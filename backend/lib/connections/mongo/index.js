'use strict'
var mongoose = require('mongoose')

module.exports = function(uri) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

  var db = mongoose.connection

  db.on('error', function(err) {
    logger.logError('MongoDB connection error:', err.message)
  })

  db.once('open', function() {
    logger.logInfo('MongoDB connected:', uri)
  })

  db.on('disconnected', function() {
    logger.logWarn('MongoDB disconnected')
  })

  return db
}
