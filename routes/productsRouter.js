const express = require('express')
const router = express.Router()
const upload = require('../config/multer-config')
const productModel = require('../models/product-model')

router.post('/create', upload.single('image'), async (req, res) => {
  try {
    console.log(req.file.buffer)
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body

    if (!name || !price || !req.file) {
      req.flash('error', 'Name, price, and image are required.')
      return res.redirect('/owners/admin')
    }
    if (isNaN(price) || price <= 0) {
      req.flash('error', 'Invalid price.')
      return res.redirect('/owners/admin')
    }

    // Create the product
    const product = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    })

    req.flash('success', 'Product created successfully')
    res.redirect('/owners/admin')
  } catch (err) {
    console.error(err.message)
    req.flash('error', 'An error occurred while creating the product.')
    res.redirect('/owners/admin')
  }
})

module.exports = router
