const mongoose = require('mongoose')
const Schema = mongoose.Schema

var MemoSchema = new Schema({
  title: String,
  isi: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

var Memo = mongoose.model('Memo',MemoSchema)

module.exports = Memo
