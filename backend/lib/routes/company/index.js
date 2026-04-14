const Message = require('../../message');

const detail = {
  v1: async (req, res) => {
    try {
      const { domain } = req.params;
      const company = await CompanyModel.findOne({ domain, isActive: true })
        .select('name phone address logo domain description email');

      if (!company) {
        return res.json({ success: false, message: Message.COMPANY_NOT_FOUND });
      }

      return res.json({ success: true, data: company });
    } catch (err) {
      logger.logError('company/detail', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { detail };
