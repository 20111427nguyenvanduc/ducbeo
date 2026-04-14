const Message = require('../../message');

const getConfig = {
  v1: async (req, res) => {
    try {
      const publicKeys = ['app_version', 'maintenance_mode', 'hotline', 'contact_email', 'listing_duration_days'];
      const configs = await ConfigModel.find({ key: { $in: publicKeys } });
      const result = {};
      configs.forEach((c) => {
        result[c.key] = c.value;
      });

      // Also get active banners
      const banners = await BannerModel.find({ isActive: true }).sort({ order: 1 });
      result.banners = banners;

      // Active property types
      const propertyTypes = await PropertyTypeModel.find({ isActive: true }).sort({ order: 1 });
      result.propertyTypes = propertyTypes;

      return res.json({ success: true, data: result });
    } catch (err) {
      logger.logError('app/getConfig', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { getConfig };
