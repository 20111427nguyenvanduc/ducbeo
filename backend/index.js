const express = require('express');
const cors = require('cors');

global._ = require('lodash');
global.config = require('config');
global.Logger = require('./lib/logger');
global.mongoose = require('mongoose');
global.fs = require('fs');
global.moment = require('moment');
global.async = require('async');
global.ms = require('ms');
global.MailUtil = require('./lib/utils/mail');
global.logger = Logger(`${__dirname}/logs`);

// MongoDB connection
require('./lib/connections/mongodb');

// Load models
fs.readdirSync(`${__dirname}/lib/models`).forEach((file) => {
  if (file.endsWith('.js')) {
    global[_.upperFirst(_.camelCase(file.replace('.js', 'Model')))] = require(`./lib/models/${file}`);
  }
});

const bodyParser = require('body-parser');
const tokenToUserMiddleware = require('./lib/middleware/tokenToUser');
const optionalTokenToUserMiddleware = require('./lib/middleware/optionalTokenToUser');
const tokenToCompanyUserMiddleware = require('./lib/middleware/tokenToCompanyUser');
const tokenToAdminMiddleware = require('./lib/middleware/tokenToAdmin');
const requireSuperAdminMiddleware = require('./lib/middleware/requireSuperAdmin');

const app = express();
app.set('trust proxy', true);
const server = require('http').Server(app);
global.io = require('socket.io')(server, { cors: { origin: '*' } });

// CORS
const allowedOrigins = _.get(config, 'allowedOrigins', []);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

const declareRoute = (method, routeName, middlewares = [], destinationRoute) => {
  if (!destinationRoute || !routeName) return;
  Object.keys(destinationRoute).forEach((version) => {
    app[method](`/api/${version}${routeName}`, middlewares, destinationRoute[version]);
  });
};

// ─── Auth (Member) ───────────────────────────────────────────────────────────
const authRoute = require('./lib/routes/auth');
declareRoute('post', '/auth/send-otp', [], authRoute.sendOtp);
declareRoute('post', '/auth/verify-otp', [], authRoute.verifyOtp);
declareRoute('post', '/auth/logout', [tokenToUserMiddleware], authRoute.logout);
declareRoute('post', '/auth/change-password', [tokenToUserMiddleware], authRoute.changePassword);

// ─── Member ──────────────────────────────────────────────────────────────────
const memberRoute = require('./lib/routes/member');
declareRoute('get', '/member/me', [tokenToUserMiddleware], memberRoute.get);
declareRoute('put', '/member/me', [tokenToUserMiddleware], memberRoute.update);

// ─── Listing (public) ────────────────────────────────────────────────────────
const listingRoute = require('./lib/routes/listing');
declareRoute('post', '/listing/list', [optionalTokenToUserMiddleware], listingRoute.list);
declareRoute('get', '/listing/:id', [optionalTokenToUserMiddleware], listingRoute.detail);

// ─── ConsultRequest (member) ──────────────────────────────────────────────────
const consultRequestRoute = require('./lib/routes/consultRequest');
declareRoute('post', '/consult-request', [tokenToUserMiddleware], consultRequestRoute.create);
declareRoute('get', '/consult-request', [tokenToUserMiddleware], consultRequestRoute.list);
declareRoute('get', '/consult-request/:id', [tokenToUserMiddleware], consultRequestRoute.detail);

// ─── ConsignRequest (member) ──────────────────────────────────────────────────
const consignRequestRoute = require('./lib/routes/consignRequest');
declareRoute('post', '/consign-request', [tokenToUserMiddleware], consignRequestRoute.create);

// ─── Notification (member) ────────────────────────────────────────────────────
const notificationRoute = require('./lib/routes/notification');
declareRoute('get', '/notification', [tokenToUserMiddleware], notificationRoute.list);
declareRoute('put', '/notification/:id/seen', [tokenToUserMiddleware], notificationRoute.seen);
declareRoute('put', '/notification/seen-all', [tokenToUserMiddleware], notificationRoute.seenAll);
declareRoute('get', '/notification/count', [tokenToUserMiddleware], notificationRoute.count);

// ─── Push Notify (member) ────────────────────────────────────────────────────
const pushNotifyRoute = require('./lib/routes/pushNotify');
declareRoute('post', '/push-notify/token', [tokenToUserMiddleware], pushNotifyRoute.addToken);

// ─── Address (public) ────────────────────────────────────────────────────────
const addressRoute = require('./lib/routes/address');
declareRoute('get', '/address/province', [], addressRoute.listProvince);
declareRoute('get', '/address/district', [], addressRoute.listDistrict);
declareRoute('get', '/address/ward', [], addressRoute.listWard);

// ─── App Config (public) ─────────────────────────────────────────────────────
const appRoute = require('./lib/routes/app');
declareRoute('get', '/app/config', [], appRoute.getConfig);

// ─── Company (public) ────────────────────────────────────────────────────────
const companyRoute = require('./lib/routes/company');
declareRoute('get', '/company/:domain', [], companyRoute.detail);

// ─── Company Auth ────────────────────────────────────────────────────────────
const companyAuthRoute = require('./lib/routes/companyAuth');
declareRoute('post', '/company-auth/login', [], companyAuthRoute.login);
declareRoute('post', '/company-auth/logout', [tokenToCompanyUserMiddleware], companyAuthRoute.logout);
declareRoute('post', '/company-auth/change-password', [tokenToCompanyUserMiddleware], companyAuthRoute.changePassword);
declareRoute('post', '/company-auth/forgot-password-request', [], companyAuthRoute.forgotPasswordRequest);
declareRoute('post', '/company-auth/forgot-password-confirm', [], companyAuthRoute.forgotPasswordConfirm);
declareRoute('post', '/company-auth/change-first-password', [tokenToCompanyUserMiddleware], companyAuthRoute.changeFirstPassword);

// ─── Company Property ────────────────────────────────────────────────────────
const companyPropertyRoute = require('./lib/routes/companyProperty');
declareRoute('post', '/company/property', [tokenToCompanyUserMiddleware], companyPropertyRoute.create);
declareRoute('get', '/company/property', [tokenToCompanyUserMiddleware], companyPropertyRoute.list);
declareRoute('get', '/company/property/:id', [tokenToCompanyUserMiddleware], companyPropertyRoute.detail);
declareRoute('put', '/company/property/:id', [tokenToCompanyUserMiddleware], companyPropertyRoute.update);
declareRoute('delete', '/company/property/:id', [tokenToCompanyUserMiddleware], companyPropertyRoute.remove);

// ─── Company Listing ─────────────────────────────────────────────────────────
const companyListingRoute = require('./lib/routes/companyListing');
declareRoute('post', '/company/listing', [tokenToCompanyUserMiddleware], companyListingRoute.create);
declareRoute('get', '/company/listing', [tokenToCompanyUserMiddleware], companyListingRoute.list);
declareRoute('get', '/company/listing/:id', [tokenToCompanyUserMiddleware], companyListingRoute.detail);
declareRoute('put', '/company/listing/:id', [tokenToCompanyUserMiddleware], companyListingRoute.update);
declareRoute('delete', '/company/listing/:id', [tokenToCompanyUserMiddleware], companyListingRoute.remove);
declareRoute('post', '/company/listing/:id/extend', [tokenToCompanyUserMiddleware], companyListingRoute.extend);

// ─── Company Consult Request ──────────────────────────────────────────────────
const companyConsultRequestRoute = require('./lib/routes/companyConsultRequest');
declareRoute('get', '/company/consult-request', [tokenToCompanyUserMiddleware], companyConsultRequestRoute.list);
declareRoute('get', '/company/consult-request/:id', [tokenToCompanyUserMiddleware], companyConsultRequestRoute.detail);
declareRoute('put', '/company/consult-request/:id/status', [tokenToCompanyUserMiddleware], companyConsultRequestRoute.updateStatus);
declareRoute('post', '/company/consult-request/:id/note', [tokenToCompanyUserMiddleware], companyConsultRequestRoute.addNote);

// ─── Company Dashboard ────────────────────────────────────────────────────────
const companyDashboardRoute = require('./lib/routes/companyDashboard');
declareRoute('get', '/company/dashboard', [tokenToCompanyUserMiddleware], companyDashboardRoute.stats);

// ─── Admin Auth ───────────────────────────────────────────────────────────────
const adminAuthRoute = require('./lib/routes/admin/auth');
declareRoute('post', '/admin/auth/login', [], adminAuthRoute.login);
declareRoute('post', '/admin/auth/logout', [tokenToAdminMiddleware], adminAuthRoute.logout);
declareRoute('post', '/admin/auth/change-password', [tokenToAdminMiddleware], adminAuthRoute.changePassword);
declareRoute('get', '/admin/auth/me', [tokenToAdminMiddleware], adminAuthRoute.get);

// ─── Admin Company ────────────────────────────────────────────────────────────
const adminCompanyRoute = require('./lib/routes/admin/company');
declareRoute('post', '/admin/company', [tokenToAdminMiddleware], adminCompanyRoute.create);
declareRoute('get', '/admin/company', [tokenToAdminMiddleware], adminCompanyRoute.list);
declareRoute('get', '/admin/company/:id', [tokenToAdminMiddleware], adminCompanyRoute.detail);
declareRoute('put', '/admin/company/:id', [tokenToAdminMiddleware], adminCompanyRoute.update);
declareRoute('put', '/admin/company/:id/lock', [tokenToAdminMiddleware], adminCompanyRoute.lockUnlock);
declareRoute('delete', '/admin/company/:id', [tokenToAdminMiddleware], adminCompanyRoute.remove);

// ─── Admin Member ─────────────────────────────────────────────────────────────
const adminMemberRoute = require('./lib/routes/admin/member');
declareRoute('get', '/admin/member', [tokenToAdminMiddleware], adminMemberRoute.list);
declareRoute('get', '/admin/member/count', [tokenToAdminMiddleware], adminMemberRoute.count);
declareRoute('get', '/admin/member/:id', [tokenToAdminMiddleware], adminMemberRoute.detail);
declareRoute('put', '/admin/member/:id/lock', [tokenToAdminMiddleware], adminMemberRoute.lockUnlock);

// ─── Admin Listing ────────────────────────────────────────────────────────────
const adminListingRoute = require('./lib/routes/admin/listing');
declareRoute('get', '/admin/listing', [tokenToAdminMiddleware], adminListingRoute.list);
declareRoute('get', '/admin/listing/:id', [tokenToAdminMiddleware], adminListingRoute.detail);
declareRoute('put', '/admin/listing/:id/approve', [tokenToAdminMiddleware], adminListingRoute.approve);
declareRoute('put', '/admin/listing/:id/reject', [tokenToAdminMiddleware], adminListingRoute.reject);
declareRoute('delete', '/admin/listing/:id', [tokenToAdminMiddleware], adminListingRoute.remove);

// ─── Admin ConsultRequest ─────────────────────────────────────────────────────
const adminConsultRequestRoute = require('./lib/routes/admin/consultRequest');
declareRoute('get', '/admin/consult-request', [tokenToAdminMiddleware], adminConsultRequestRoute.list);
declareRoute('get', '/admin/consult-request/statistics', [tokenToAdminMiddleware], adminConsultRequestRoute.statistics);
declareRoute('get', '/admin/consult-request/:id', [tokenToAdminMiddleware], adminConsultRequestRoute.detail);
declareRoute('post', '/admin/consult-request/:id/reminder', [tokenToAdminMiddleware], adminConsultRequestRoute.sendReminder);

// ─── Admin ConsignRequest ─────────────────────────────────────────────────────
const adminConsignRequestRoute = require('./lib/routes/admin/consignRequest');
declareRoute('get', '/admin/consign-request', [tokenToAdminMiddleware], adminConsignRequestRoute.list);
declareRoute('get', '/admin/consign-request/:id', [tokenToAdminMiddleware], adminConsignRequestRoute.detail);
declareRoute('put', '/admin/consign-request/:id/status', [tokenToAdminMiddleware], adminConsignRequestRoute.updateStatus);

// ─── Admin Feedback ───────────────────────────────────────────────────────────
const adminFeedbackRoute = require('./lib/routes/admin/feedback');
declareRoute('get', '/admin/feedback', [tokenToAdminMiddleware], adminFeedbackRoute.list);
declareRoute('get', '/admin/feedback/:id', [tokenToAdminMiddleware], adminFeedbackRoute.detail);
declareRoute('put', '/admin/feedback/:id/resolve', [tokenToAdminMiddleware], adminFeedbackRoute.resolve);

// ─── Admin Banner ─────────────────────────────────────────────────────────────
const adminBannerRoute = require('./lib/routes/admin/banner');
declareRoute('post', '/admin/banner', [tokenToAdminMiddleware], adminBannerRoute.create);
declareRoute('get', '/admin/banner', [tokenToAdminMiddleware], adminBannerRoute.list);
declareRoute('put', '/admin/banner/:id', [tokenToAdminMiddleware], adminBannerRoute.update);
declareRoute('delete', '/admin/banner/:id', [tokenToAdminMiddleware], adminBannerRoute.remove);
declareRoute('put', '/admin/banner/:id/toggle', [tokenToAdminMiddleware], adminBannerRoute.toggleActive);

// ─── Admin PropertyType ───────────────────────────────────────────────────────
const adminPropertyTypeRoute = require('./lib/routes/admin/propertyType');
declareRoute('post', '/admin/property-type', [tokenToAdminMiddleware], adminPropertyTypeRoute.create);
declareRoute('get', '/admin/property-type', [tokenToAdminMiddleware], adminPropertyTypeRoute.list);
declareRoute('put', '/admin/property-type/:id', [tokenToAdminMiddleware], adminPropertyTypeRoute.update);
declareRoute('delete', '/admin/property-type/:id', [tokenToAdminMiddleware], adminPropertyTypeRoute.remove);
declareRoute('put', '/admin/property-type/:id/toggle', [tokenToAdminMiddleware], adminPropertyTypeRoute.toggleActive);

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const adminDashboardRoute = require('./lib/routes/admin/dashboard');
declareRoute('get', '/admin/dashboard', [tokenToAdminMiddleware], adminDashboardRoute.stats);

// ─── Admin System Config (SuperAdmin only) ────────────────────────────────────
const adminSystemConfigRoute = require('./lib/routes/admin/systemConfig');
declareRoute('get', '/admin/system-config', [tokenToAdminMiddleware, requireSuperAdminMiddleware], adminSystemConfigRoute.list);
declareRoute('get', '/admin/system-config/:key', [tokenToAdminMiddleware, requireSuperAdminMiddleware], adminSystemConfigRoute.get);
declareRoute('post', '/admin/system-config', [tokenToAdminMiddleware, requireSuperAdminMiddleware], adminSystemConfigRoute.add);
declareRoute('put', '/admin/system-config/:key', [tokenToAdminMiddleware, requireSuperAdminMiddleware], adminSystemConfigRoute.update);

// ─── Cron jobs ────────────────────────────────────────────────────────────────
const ConsultRequestNotifier = require('./lib/job/consultRequestNotifier');
ConsultRequestNotifier.start();

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const port = _.get(config, 'port', 3000);
server.listen(port, () => logger.logInfo('Server listening at port:', port));
