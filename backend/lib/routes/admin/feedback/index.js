'use strict'
var fs = require('fs')
var obj = {}
fs.readdirSync(__dirname).forEach(function(name) {
  if (name !== 'index.js' && fs.statSync(__dirname + '/' + name).isDirectory()) {
    obj[name] = require('./' + name)
  }
})
module.exports = obj
