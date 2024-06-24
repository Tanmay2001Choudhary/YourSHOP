const mongoose = require('mongoose')
const config = require('config')

const dbgr = require('debug')('development:mongoose') //(kis phase se aa rha hai i.e. server status : message kis file se aane wala hai)

mongoose
  .connect(`${config.get('MONGODB_URI')}/scatch`)
  .then(function () {
    dbgr('connected')
  })
  .catch((err) => {
    dbgr(err.message)
  })

module.exports = mongoose.connection
