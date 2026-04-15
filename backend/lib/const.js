'use strict'

var CONSULT_STATUS = {
  WAITING: 'waiting',
  CONSULTING: 'consulting',
  APPOINTMENT: 'appointment',
  TRANSFERRING: 'transferring',
  WAITING_DOC: 'waiting_doc',
  COMPLETED: 'completed',
}

var PROPERTY_TYPES = [
  'dat-nen', 'nha-rieng', 'can-ho', 'biet-thu', 'nha-mat-pho',
  'van-phong', 'mat-bang-kd', 'kho-xuong', 'dat-nong-nghiep', 'du-an-bds',
]

var LEGAL_STATUS = {
  SO_DO: 'so_do',
  SO_HONG: 'so_hong',
  HOP_DONG: 'hop_dong',
  CHO_SO: 'cho_so',
}

var TRANSACTION_TYPE = {
  SELL: 'sell',
  RENT: 'rent',
}

var LISTING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
}

var CONSIGN_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
}

var NOTIFICATION_TYPE = {
  CONSULT_REQUEST: 'consult_request',
  CONSULT_REMINDER: 'consult_reminder',
  LISTING_APPROVED: 'listing_approved',
  LISTING_REJECTED: 'listing_rejected',
  LISTING_EXPIRED: 'listing_expired',
  CONSIGN_STATUS: 'consign_status',
}

var USER_TYPE = {
  MEMBER: 'member',
  COMPANY_USER: 'company_user',
  ADMIN: 'admin',
}

var ADMIN_ROLE = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
}

var FEEDBACK_STATUS = {
  NEW: 'new',
  RESOLVED: 'resolved',
}

var PROPERTY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

var RESPONSE_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  FAIL: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
  TOKEN_EXPIRED: 1993,
}

module.exports = {
  CONSULT_STATUS,
  PROPERTY_TYPES,
  LEGAL_STATUS,
  TRANSACTION_TYPE,
  LISTING_STATUS,
  CONSIGN_STATUS,
  NOTIFICATION_TYPE,
  USER_TYPE,
  ADMIN_ROLE,
  FEEDBACK_STATUS,
  PROPERTY_STATUS,
  RESPONSE_CODE,
}
