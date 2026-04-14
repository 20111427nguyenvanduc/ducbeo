const Message = require('../../../message');

const create = {
  v1: async (req, res) => {
    try {
      const { name, phone, address, email, domain, username, password } = req.body;
      if (!name || !username || !password) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      // Check duplicate domain
      if (domain) {
        const existing = await CompanyModel.findOne({ domain });
        if (existing) {
          return res.json({ success: false, message: 'Domain đã được sử dụng' });
        }
      }

      // Check duplicate username
      const existingUser = await CompanyUserModel.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return res.json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
      }

      const company = await CompanyModel.create({
        name,
        phone: phone || '',
        address: address || '',
        email: email || '',
        domain: domain || undefined,
        isActive: true,
        createdBy: req.admin._id,
      });

      const passwordHash = CompanyUserModel.hashPassword(password);
      await CompanyUserModel.create({
        companyId: company._id,
        username: username.toLowerCase(),
        passwordHash,
        role: 'owner',
        mustChangePassword: true,
        isActive: true,
      });

      return res.json({
        success: true,
        message: Message.COMPANY_CREATED,
        data: company,
      });
    } catch (err) {
      logger.logError('admin/company/create', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 20, keyword, isActive } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const query = {};
      if (keyword) query.name = { $regex: keyword, $options: 'i' };
      if (isActive !== undefined) query.isActive = isActive === 'true';

      const [companies, total] = await Promise.all([
        CompanyModel.find(query)
          .sort({ createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        CompanyModel.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: {
          companies,
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (err) {
      logger.logError('admin/company/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const detail = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await CompanyModel.findById(id);
      if (!company) {
        return res.json({ success: false, message: Message.COMPANY_NOT_FOUND });
      }

      const users = await CompanyUserModel.find({ companyId: id }).select('-passwordHash -resetPasswordToken');

      return res.json({ success: true, data: { company, users } });
    } catch (err) {
      logger.logError('admin/company/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const allowedFields = ['name', 'phone', 'address', 'email', 'domain', 'logo', 'description'];
      const updateData = {};
      allowedFields.forEach((f) => {
        if (req.body[f] !== undefined) updateData[f] = req.body[f];
      });

      const company = await CompanyModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!company) {
        return res.json({ success: false, message: Message.COMPANY_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.COMPANY_UPDATED, data: company });
    } catch (err) {
      logger.logError('admin/company/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const lockUnlock = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await CompanyModel.findById(id);
      if (!company) {
        return res.json({ success: false, message: Message.COMPANY_NOT_FOUND });
      }

      const newIsActive = !company.isActive;
      await CompanyModel.findByIdAndUpdate(id, { isActive: newIsActive });

      return res.json({
        success: true,
        message: newIsActive ? Message.COMPANY_UNLOCKED : Message.COMPANY_LOCKED,
        data: { isActive: newIsActive },
      });
    } catch (err) {
      logger.logError('admin/company/lockUnlock', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const remove = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await CompanyModel.findByIdAndDelete(id);
      if (!company) {
        return res.json({ success: false, message: Message.COMPANY_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.COMPANY_DELETED });
    } catch (err) {
      logger.logError('admin/company/remove', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create, list, detail, update, lockUnlock, remove };
