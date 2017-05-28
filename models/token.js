const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TokenSchema = new Schema({
  token: String
})

var Token = mongoose.model('Token',TokenSchema)

module.exports = Token
