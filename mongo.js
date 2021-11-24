const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage:')
  console.log('Show all entries: node mongo.js <password>')
  console.log('Add and entry"    node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.ezgtm.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)
mongoose.connection.close()
