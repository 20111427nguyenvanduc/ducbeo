'use strict'
var winston = require('winston')
require('winston-daily-rotate-file')
var path = require('path')
var fs = require('fs')

var Logger = function(logDir) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }

  var dailyRotateTransport = new winston.transports.DailyRotateFile({
    name: 'dailyRotateApp',
    filename: path.join(logDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
  })

  var errorRotateTransport = new winston.transports.DailyRotateFile({
    name: 'dailyRotateError',
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
  })

  var instance = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        colorize: true,
        timestamp: function() { return new Date().toISOString() },
      }),
      dailyRotateTransport,
      errorRotateTransport,
    ],
  })

  instance.logInfo = function() { instance.info(Array.prototype.join.call(arguments, ' ')) }
  instance.logError = function() { instance.error(Array.prototype.join.call(arguments, ' ')) }
  instance.logWarn = function() { instance.warn(Array.prototype.join.call(arguments, ' ')) }
  instance.logDebug = function() { instance.debug(Array.prototype.join.call(arguments, ' ')) }

  return instance
}

module.exports = Logger
