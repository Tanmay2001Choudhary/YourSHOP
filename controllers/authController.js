const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/generateToken')

module.exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullname } = req.body

    let user = await userModel.findOne({ email })
    if (user) {
      req.flash('error', 'User Already Exists')
      return res.redirect('/')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    user = await userModel.create({
      email,
      password: hash,
      fullname,
    })

    const token = generateToken(user)
    res.cookie('token', token)
    req.flash('success', '')
    res.redirect('/shop')
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/')
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
      req.flash('error', 'Email or Password incorrect')
      return res.redirect('/')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = generateToken(user)
      res.cookie('token', token)
      req.flash('success', '')
      res.redirect('/shop')
    } else {
      req.flash('error', 'Email or Password incorrect')
      return res.redirect('/')
    }
  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/')
  }
}

module.exports.logoutUser = (req, res) => {
  console.log(res.cookie.token)
  res.cookie('token', '')
  res.redirect('/')
}
