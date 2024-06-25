const express = require('express')
const app = express()
const debug = require('debug')('development:server')
const path = require('path')
const cookieParser = require('cookie-parser')
const db = require('./config/mongoose-connection')
const config = require('config')

const expressSession = require('express-session')
const flash = require('connect-flash')

require('dotenv').config()

const indexRouter = require('./routes/index')
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRECT,
  })
)
app.use(flash())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  debug(`App is listening on port ${PORT}`)
})
