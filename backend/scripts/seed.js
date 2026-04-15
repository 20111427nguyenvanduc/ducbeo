'use strict'
global._ = require('lodash')
global.config = require('config')
global.moment = require('moment')
global.async = require('async')
global.mongoose = require('mongoose')

var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var fs = require('fs')

var Logger = require('../lib/logger')
global.logger = Logger(__dirname + '/../logs')

var mongoUri = config.get('mongodb.uri')

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

fs.readdirSync(__dirname + '/../lib/models').forEach(function(file) {
  if (file.endsWith('.js')) {
    var name = _.upperFirst(_.camelCase(file.replace('.js', ''))) + 'Model'
    global[name] = require('../lib/models/' + file)
  }
})

async.series([
  function seedAdmin(cb) {
    AdminModel.findOne({ username: 'superadmin' }, function(err, existing) {
      if (err) return cb(err)
      if (existing) {
        logger.logInfo('Admin already exists, skipping')
        return cb(null)
      }
      var salt = bcrypt.genSaltSync(10)
      var passwordHash = bcrypt.hashSync('Admin@123', salt)
      AdminModel.create({
        username: 'superadmin',
        fullName: 'Super Admin',
        passwordHash: passwordHash,
        role: 'super_admin',
        isActive: true,
      }, function(err, doc) {
        if (err) return cb(err)
        logger.logInfo('Created admin:', doc.username)
        cb(null)
      })
    })
  },
  function seedPropertyTypes(cb) {
    PropertyTypeModel.countDocuments({}, function(err, count) {
      if (err) return cb(err)
      if (count > 0) {
        logger.logInfo('Property types already seeded, skipping')
        return cb(null)
      }
      var types = [
        { name: 'Đất nền', slug: 'dat-nen', order: 1, isActive: true },
        { name: 'Nhà riêng', slug: 'nha-rieng', order: 2, isActive: true },
        { name: 'Căn hộ', slug: 'can-ho', order: 3, isActive: true },
        { name: 'Biệt thự', slug: 'biet-thu', order: 4, isActive: true },
        { name: 'Nhà mặt phố', slug: 'nha-mat-pho', order: 5, isActive: true },
        { name: 'Văn phòng', slug: 'van-phong', order: 6, isActive: true },
        { name: 'Mặt bằng kinh doanh', slug: 'mat-bang-kd', order: 7, isActive: true },
        { name: 'Kho xưởng', slug: 'kho-xuong', order: 8, isActive: true },
        { name: 'Đất nông nghiệp', slug: 'dat-nong-nghiep', order: 9, isActive: true },
        { name: 'Dự án BĐS', slug: 'du-an-bds', order: 10, isActive: true },
      ]
      PropertyTypeModel.insertMany(types, function(err) {
        if (err) return cb(err)
        logger.logInfo('Seeded property types:', types.length)
        cb(null)
      })
    })
  },
  function seedConfigs(cb) {
    ConfigModel.countDocuments({}, function(err, count) {
      if (err) return cb(err)
      if (count > 0) {
        logger.logInfo('Configs already seeded, skipping')
        return cb(null)
      }
      var configs = [
        { key: 'app_version', value: '1.0.0' },
        { key: 'maintenance_mode', value: false },
        { key: 'hotline', value: '0123456789' },
        { key: 'contact_email', value: 'info@bdshy.vn' },
        { key: 'listing_duration_days', value: 30 },
      ]
      ConfigModel.insertMany(configs, function(err) {
        if (err) return cb(err)
        logger.logInfo('Seeded configs:', configs.length)
        cb(null)
      })
    })
  },
], function(err) {
  if (err) {
    logger.logError('Seed error:', err.message || err)
    process.exit(1)
  }
  logger.logInfo('Seed completed successfully')
  process.exit(0)
})
