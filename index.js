require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request
  const { number } = body

  if (!number) {
    return response.status(400).send({ error: 'missing number' })
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => {
      console.log('updated:', updatedPerson)
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log('deleted:', result)
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.count({})
    .then((count) => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date().toString()}</p>`)
    })
    .catch((error) => next(error))
})

app.use((error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  } else {
    next(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`)
})
