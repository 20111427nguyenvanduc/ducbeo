// Note: `_` (lodash), `config` are set as globals in index.js before this module is used.
const jwt = require('jsonwebtoken');

const getSecret = () => _.get(config, 'jwt.secret', process.env.JWT_SECRET || 'bdshy-default-secret');
const getAccessExpiry = () => _.get(config, 'jwt.accessExpiry', process.env.JWT_ACCESS_EXPIRY || '1h');
const getRefreshExpiry = () => _.get(config, 'jwt.refreshExpiry', process.env.JWT_REFRESH_EXPIRY || '7d');

const signAccessToken = (payload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: getAccessExpiry() });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: getRefreshExpiry() });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, getSecret());
};

const generateMemberToken = (memberId) => {
  return signAccessToken({ id: memberId, type: 'member' });
};

const generateCompanyUserToken = (companyUserId) => {
  return signAccessToken({ id: companyUserId, type: 'company_user' });
};

const generateAdminToken = (adminId) => {
  return signAccessToken({ id: adminId, type: 'admin' });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  generateMemberToken,
  generateCompanyUserToken,
  generateAdminToken,
};
