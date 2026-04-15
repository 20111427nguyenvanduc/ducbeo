'use strict'
global._ = require('lodash')
global.config = require('config')
global.moment = require('moment')
global.async = require('async')
global.mongoose = require('mongoose')

var Logger = require('./lib/logger')
global.logger = Logger(__dirname + '/logs')

var mongoSetup = require('./lib/connections/mongo')
var redisSetup = require('./lib/connections/redis')
mongoSetup(config.get('mongodb.uri'))
global.redisClient = redisSetup(
  config.get('redis.host'),
  config.get('redis.port'),
  config.get('redis.password')
)

var fs = require('fs')
fs.readdirSync(__dirname + '/lib/models').forEach(function(file) {
  if (file.endsWith('.js')) {
    var name = _.upperFirst(_.camelCase(file.replace('.js', ''))) + 'Model'
    global[name] = require('./lib/models/' + file)
  }
})

var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var http = require('http')
var app = express()
var server = http.Server(app)
global.io = require('socket.io')(server, { cors: { origin: '*' } })

app.set('trust proxy', true)
var allowedOrigins = config.get('allowedOrigins') || []
app.use(cors({
  origin: function(origin, cb) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) return cb(null, true)
    return cb(null, false)
  },
  credentials: true,
}))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.static('public'))

function declareRoute(method, routeName, middlewares, destinationRoute) {
  if (!destinationRoute || !routeName) return
  Object.keys(destinationRoute).forEach(function(version) {
    app[method]('/api/' + version + routeName, middlewares, destinationRoute[version])
  })
}

var tokenToUser = require('./lib/middleware/tokenToUser')
var tokenToCompanyUser = require('./lib/middleware/tokenToCompanyUser')
var tokenToAdmin = require('./lib/middleware/tokenToAdmin')
var requireSuperAdmin = require('./lib/middleware/requireSuperAdmin')

// ─── Auth (Member) ────────────────────────────────────────────────────────────
var authRoute = require('./lib/routes/auth')
declareRoute('post', '/auth/send-otp', [], authRoute.sendOtp)
declareRoute('post', '/auth/verify-otp', [], authRoute.verifyOtp)
declareRoute('post', '/auth/logout', [tokenToUser], authRoute.logout)

// ─── Listing (public) ─────────────────────────────────────────────────────────
var listingRoute = require('./lib/routes/listing')
declareRoute('post', '/listing/list', [], listingRoute.list)
declareRoute('get', '/listing/detail/:id', [], listingRoute.detail)

// ─── Address (public) ─────────────────────────────────────────────────────────
var addressRoute = require('./lib/routes/address')
declareRoute('post', '/address/list-province', [], addressRoute.listProvince)
declareRoute('post', '/address/list-district', [], addressRoute.listDistrict)
declareRoute('post', '/address/list-ward', [], addressRoute.listWard)

// ─── App Config (public) ──────────────────────────────────────────────────────
var appRoute = require('./lib/routes/app')
declareRoute('post', '/app/get-config', [], appRoute.getConfig)
declareRoute('post', '/app/get-banners', [], appRoute.getBanners)

// ─── Company (public) ─────────────────────────────────────────────────────────
var companyRoute = require('./lib/routes/company')
declareRoute('get', '/company/detail', [], companyRoute.detail)

// ─── Member (tokenToUser) ─────────────────────────────────────────────────────
var memberRoute = require('./lib/routes/member')
declareRoute('get', '/member/profile', [tokenToUser], memberRoute.profile)
declareRoute('put', '/member/update-profile', [tokenToUser], memberRoute.updateProfile)

// ─── ConsultRequest (member) ──────────────────────────────────────────────────
var consultRequestRoute = require('./lib/routes/consultRequest')
declareRoute('post', '/consult-request/create', [tokenToUser], consultRequestRoute.create)
declareRoute('get', '/consult-request/list', [tokenToUser], consultRequestRoute.list)
declareRoute('get', '/consult-request/detail/:id', [tokenToUser], consultRequestRoute.detail)

// ─── ConsignRequest (member) ──────────────────────────────────────────────────
var consignRequestRoute = require('./lib/routes/consignRequest')
declareRoute('post', '/consign-request/create', [tokenToUser], consignRequestRoute.create)

// ─── Notification (member) ────────────────────────────────────────────────────
var notificationRoute = require('./lib/routes/notification')
declareRoute('post', '/notification/list', [tokenToUser], notificationRoute.list)
declareRoute('post', '/notification/seen', [tokenToUser], notificationRoute.seen)
declareRoute('post', '/notification/count-unread', [tokenToUser], notificationRoute.countUnread)

// ─── Push Notify (member) ─────────────────────────────────────────────────────
var pushNotifyRoute = require('./lib/routes/pushNotify')
declareRoute('post', '/push-notify/add-token', [tokenToUser], pushNotifyRoute.addToken)

// ─── Company Auth ─────────────────────────────────────────────────────────────
var companyAuthRoute = require('./lib/routes/companyAuth')
declareRoute('post', '/company/auth/login', [], companyAuthRoute.login)
declareRoute('post', '/company/auth/logout', [tokenToCompanyUser], companyAuthRoute.logout)
declareRoute('post', '/company/auth/change-password', [tokenToCompanyUser], companyAuthRoute.changePassword)

// ─── Company Dashboard ────────────────────────────────────────────────────────
var companyDashboardRoute = require('./lib/routes/companyDashboard')
declareRoute('get', '/company/dashboard/stats', [tokenToCompanyUser], companyDashboardRoute.stats)

// ─── Company Property ─────────────────────────────────────────────────────────
var companyPropertyRoute = require('./lib/routes/companyProperty')
declareRoute('get', '/company/property/list', [tokenToCompanyUser], companyPropertyRoute.list)
declareRoute('post', '/company/property/create', [tokenToCompanyUser], companyPropertyRoute.create)
declareRoute('put', '/company/property/update', [tokenToCompanyUser], companyPropertyRoute.update)
declareRoute('delete', '/company/property/delete', [tokenToCompanyUser], companyPropertyRoute.delete)
declareRoute('get', '/company/property/detail/:id', [tokenToCompanyUser], companyPropertyRoute.detail)

// ─── Company Listing ──────────────────────────────────────────────────────────
var companyListingRoute = require('./lib/routes/companyListing')
declareRoute('get', '/company/listing/list', [tokenToCompanyUser], companyListingRoute.list)
declareRoute('post', '/company/listing/create', [tokenToCompanyUser], companyListingRoute.create)
declareRoute('put', '/company/listing/update', [tokenToCompanyUser], companyListingRoute.update)
declareRoute('delete', '/company/listing/delete', [tokenToCompanyUser], companyListingRoute.delete)
declareRoute('get', '/company/listing/detail/:id', [tokenToCompanyUser], companyListingRoute.detail)

// ─── Company ConsultRequest ───────────────────────────────────────────────────
var companyConsultRequestRoute = require('./lib/routes/companyConsultRequest')
declareRoute('get', '/company/consult-request/list', [tokenToCompanyUser], companyConsultRequestRoute.list)
declareRoute('get', '/company/consult-request/detail/:id', [tokenToCompanyUser], companyConsultRequestRoute.detail)
declareRoute('post', '/company/consult-request/update-status', [tokenToCompanyUser], companyConsultRequestRoute.updateStatus)
declareRoute('post', '/company/consult-request/add-note', [tokenToCompanyUser], companyConsultRequestRoute.addNote)

// ─── Admin Auth ───────────────────────────────────────────────────────────────
var adminAuthRoute = require('./lib/routes/admin/auth')
declareRoute('post', '/admin/auth/login', [], adminAuthRoute.login)
declareRoute('post', '/admin/auth/logout', [tokenToAdmin], adminAuthRoute.logout)
declareRoute('post', '/admin/auth/change-password', [tokenToAdmin], adminAuthRoute.changePassword)

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
var adminDashboardRoute = require('./lib/routes/admin/dashboard')
declareRoute('get', '/admin/dashboard/stats', [tokenToAdmin], adminDashboardRoute.stats)

// ─── Admin Company ────────────────────────────────────────────────────────────
var adminCompanyRoute = require('./lib/routes/admin/company')
declareRoute('get', '/admin/company/list', [tokenToAdmin], adminCompanyRoute.list)
declareRoute('post', '/admin/company/create', [tokenToAdmin, requireSuperAdmin], adminCompanyRoute.create)
declareRoute('put', '/admin/company/update', [tokenToAdmin], adminCompanyRoute.update)
declareRoute('delete', '/admin/company/delete', [tokenToAdmin, requireSuperAdmin], adminCompanyRoute.delete)

// ─── Admin Member ─────────────────────────────────────────────────────────────
var adminMemberRoute = require('./lib/routes/admin/member')
declareRoute('get', '/admin/member/list', [tokenToAdmin], adminMemberRoute.list)
declareRoute('get', '/admin/member/detail/:id', [tokenToAdmin], adminMemberRoute.detail)
declareRoute('post', '/admin/member/lock', [tokenToAdmin], adminMemberRoute.lock)

// ─── Admin Listing ────────────────────────────────────────────────────────────
var adminListingRoute = require('./lib/routes/admin/listing')
declareRoute('get', '/admin/listing/list', [tokenToAdmin], adminListingRoute.list)
declareRoute('get', '/admin/listing/detail/:id', [tokenToAdmin], adminListingRoute.detail)
declareRoute('post', '/admin/listing/approve', [tokenToAdmin], adminListingRoute.approve)
declareRoute('post', '/admin/listing/reject', [tokenToAdmin], adminListingRoute.reject)
declareRoute('delete', '/admin/listing/delete', [tokenToAdmin], adminListingRoute.delete)

// ─── Admin ConsultRequest ─────────────────────────────────────────────────────
var adminConsultRequestRoute = require('./lib/routes/admin/consultRequest')
declareRoute('get', '/admin/consult-request/list', [tokenToAdmin], adminConsultRequestRoute.list)
declareRoute('get', '/admin/consult-request/detail/:id', [tokenToAdmin], adminConsultRequestRoute.detail)

// ─── Admin ConsignRequest ─────────────────────────────────────────────────────
var adminConsignRequestRoute = require('./lib/routes/admin/consignRequest')
declareRoute('get', '/admin/consign-request/list', [tokenToAdmin], adminConsignRequestRoute.list)
declareRoute('get', '/admin/consign-request/detail/:id', [tokenToAdmin], adminConsignRequestRoute.detail)
declareRoute('post', '/admin/consign-request/update-status', [tokenToAdmin], adminConsignRequestRoute.updateStatus)

// ─── Admin Feedback ───────────────────────────────────────────────────────────
var adminFeedbackRoute = require('./lib/routes/admin/feedback')
declareRoute('get', '/admin/feedback/list', [tokenToAdmin], adminFeedbackRoute.list)
declareRoute('post', '/admin/feedback/resolve', [tokenToAdmin], adminFeedbackRoute.resolve)

// ─── Admin Banner ─────────────────────────────────────────────────────────────
var adminBannerRoute = require('./lib/routes/admin/banner')
declareRoute('get', '/admin/banner/list', [tokenToAdmin], adminBannerRoute.list)
declareRoute('post', '/admin/banner/create', [tokenToAdmin], adminBannerRoute.create)
declareRoute('put', '/admin/banner/update', [tokenToAdmin], adminBannerRoute.update)
declareRoute('delete', '/admin/banner/delete', [tokenToAdmin], adminBannerRoute.delete)

// ─── Admin PropertyType ───────────────────────────────────────────────────────
var adminPropertyTypeRoute = require('./lib/routes/admin/propertyType')
declareRoute('get', '/admin/property-type/list', [tokenToAdmin], adminPropertyTypeRoute.list)
declareRoute('post', '/admin/property-type/create', [tokenToAdmin], adminPropertyTypeRoute.create)
declareRoute('put', '/admin/property-type/update', [tokenToAdmin], adminPropertyTypeRoute.update)
declareRoute('delete', '/admin/property-type/delete', [tokenToAdmin], adminPropertyTypeRoute.delete)

// ─── Admin System Config ──────────────────────────────────────────────────────
var adminSystemConfigRoute = require('./lib/routes/admin/systemConfig')
declareRoute('get', '/admin/system-config/list', [tokenToAdmin, requireSuperAdmin], adminSystemConfigRoute.list)
declareRoute('put', '/admin/system-config/update', [tokenToAdmin, requireSuperAdmin], adminSystemConfigRoute.update)

// ─── Cron Jobs ────────────────────────────────────────────────────────────────
var ConsultRequestNotifier = require('./lib/job/consultRequestNotifier')
ConsultRequestNotifier.start()

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', function(req, res) { res.json({ status: 'ok', timestamp: new Date() }) })

var port = config.get('port') || 3000
server.listen(port, function() { logger.logInfo('Server listening at port:', port) })
