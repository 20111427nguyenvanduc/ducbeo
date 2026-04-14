// Consult request status flow
const CONSULT_STATUS = {
  WAITING: 'waiting',
  CONSULTING: 'consulting',
  APPOINTMENT: 'appointment',
  TRANSFERRING: 'transferring',
  WAITING_DOC: 'waiting_doc',
  COMPLETED: 'completed',
};

// Property types (slugs)
const PROPERTY_TYPES = [
  'dat-nen',
  'nha-rieng',
  'can-ho',
  'biet-thu',
  'nha-mat-pho',
  'van-phong',
  'mat-bang-kd',
  'kho-xuong',
  'dat-nong-nghiep',
  'du-an-bds',
];

// Legal status for property
const LEGAL_STATUS = {
  SO_DO: 'so_do',
  SO_HONG: 'so_hong',
  HOP_DONG: 'hop_dong',
  CHO_SO: 'cho_so',
};

// Transaction types
const TRANSACTION_TYPE = {
  SELL: 'sell',
  RENT: 'rent',
};

// Listing status
const LISTING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

// Consign request status
const CONSIGN_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

// Notification types
const NOTIFICATION_TYPE = {
  CONSULT_REQUEST: 'consult_request',
  CONSULT_REMINDER: 'consult_reminder',
  LISTING_APPROVED: 'listing_approved',
  LISTING_REJECTED: 'listing_rejected',
  LISTING_EXPIRED: 'listing_expired',
  CONSIGN_STATUS: 'consign_status',
};

// User types (for systemLog, notification, etc.)
const USER_TYPE = {
  MEMBER: 'member',
  COMPANY_USER: 'company_user',
  ADMIN: 'admin',
};

// Admin roles
const ADMIN_ROLE = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Feedback status
const FEEDBACK_STATUS = {
  NEW: 'new',
  RESOLVED: 'resolved',
};

// Property status
const PROPERTY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

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
};
