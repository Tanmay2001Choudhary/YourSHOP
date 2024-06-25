const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
  },
  email: String,
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
  contact: Number,
  picture: String,
})

module.exports = mongoose.model('user', userSchema)
