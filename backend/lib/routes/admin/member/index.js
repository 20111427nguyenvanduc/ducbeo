'use strict'
var fs = require('fs')
var obj = {}
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js' && file.endsWith('.js')) {
    obj[file.replace('.js', '')] = require('./' + file)
  }
})
module.exports = obj
