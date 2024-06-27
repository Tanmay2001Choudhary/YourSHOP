const express = require('express')
const router = express()
const bcrypt = require('bcrypt')
const ownerModel = require('../models/owner-model')
const { generateToken } = require('../utils/generateToken')
router.post('/create', async (req, res) => {
  try {
    let owners = await ownerModel.find()
    if (owners.length > 0) {
      req.flash(
        'error',
        'There Should be only one owner so please login to that account.'
      )
      return res.redirect('/owners/login')
    }
    let { fullname, email, password } = req.body
    if (email === '' || password === '' || fullname === '') {
      req.flash('error', 'All fields are required')
      return res.redirect('/owners/login')
    }
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let createdOwner = await ownerModel.create({
          fullname,
          email,
          password: hash,
        })
        let token = generateToken(createdOwner)
        res.cookie('token', token)
        res.redirect('/owners/admin')
      })
    })
  } catch (err) {
    req.flash('error', 'Something went wrong')
    res.redirect('/owners/login')
  }
})

router.get('/login', (req, res) => {
  let error = req.flash('error')
  res.render('owner-login', { error, loggedin: false, ownerLogin: false })
})
router.post('/login', async (req, res) => {
  let { email, password } = req.body
  if (email === '' || password === '') {
    req.flash('error', 'All fields are required')
    return res.redirect('/owners/login')
  }
  let owner = await ownerModel.findOne({ email })
  if (!owner) {
    req.flash('error', 'Email or Password incorrect')
    return res.redirect('/owners/login')
  }
  let isMatch = await bcrypt.compare(password, owner.password)
  if (!isMatch) {
    req.flash('error', 'Email or Password incorrect')
    return res.redirect('/owners/login')
  }
  let token = generateToken(owner)
  res.cookie('token', token)
  res.redirect('/admin')
})
router.get('/admin', (req, res) => {
  let success = req.flash('success')
  let error = req.flash('error')
  res.render('createproducts', { success, error })
})

module.exports = router
