const Message = require('../../message');

const listProvince = {
  v1: async (req, res) => {
    try {
      const provinces = await ProvinceModel.find().sort({ name: 1 });
      return res.json({ success: true, data: provinces });
    } catch (err) {
      logger.logError('address/listProvince', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const listDistrict = {
  v1: async (req, res) => {
    try {
      const { provinceCode } = req.query;
      const query = provinceCode ? { provinceCode } : {};
      const districts = await DistrictModel.find(query).sort({ name: 1 });
      return res.json({ success: true, data: districts });
    } catch (err) {
      logger.logError('address/listDistrict', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const listWard = {
  v1: async (req, res) => {
    try {
      const { districtCode } = req.query;
      const query = districtCode ? { districtCode } : {};
      const wards = await WardModel.find(query).sort({ name: 1 });
      return res.json({ success: true, data: wards });
    } catch (err) {
      logger.logError('address/listWard', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { listProvince, listDistrict, listWard };
