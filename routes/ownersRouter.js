const express = require('express')
const router = express()
const ownerModel = require('../models/owner-model')
router.post('/create', async (req, res) => {
  let owners = await ownerModel.find()
  if (owners.length > 0) {
    return res
      .status(500)
      .send("You don't have permission to create a new owner")
  }
  let { fullname, email, password } = req.body
  let createdOwner = await ownerModel.create({
    fullname,
    email,
    password,
  })
  res.status(200).send(createdOwner)
})

router.get('/login', (req, res) => {
  let error = req.flash('error')
  res.render('owner-login', { error })
})
router.post('/login', async (req, res) => {
  let { email, password } = req.body
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
  req.session.owner = owner
  res.redirect('/admin')
})
router.get('/admin', (req, res) => {
  let success = req.flash('success')
  let error = req.flash('error')
  res.render('createproducts', { success, error })
})

module.exports = router
