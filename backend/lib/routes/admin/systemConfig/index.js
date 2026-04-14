const Message = require('../../../message');

const list = {
  v1: async (req, res) => {
    try {
      const configs = await ConfigModel.find().sort({ key: 1 });
      return res.json({ success: true, data: configs });
    } catch (err) {
      logger.logError('admin/systemConfig/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const get = {
  v1: async (req, res) => {
    try {
      const { key } = req.params;
      const config = await ConfigModel.findOne({ key });
      if (!config) {
        return res.json({ success: false, message: Message.CONFIG_NOT_FOUND });
      }
      return res.json({ success: true, data: config });
    } catch (err) {
      logger.logError('admin/systemConfig/get', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const add = {
  v1: async (req, res) => {
    try {
      const { key, value, description } = req.body;
      if (!key || value === undefined) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const existing = await ConfigModel.findOne({ key });
      if (existing) {
        return res.json({ success: false, message: 'Key đã tồn tại' });
      }

      const config = await ConfigModel.create({ key, value, description: description || '' });
      return res.json({ success: true, message: Message.CONFIG_ADDED, data: config });
    } catch (err) {
      logger.logError('admin/systemConfig/add', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { key } = req.params;
      const { value, description } = req.body;

      if (value === undefined) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const updateData = { value };
      if (description !== undefined) updateData.description = description;

      const config = await ConfigModel.findOneAndUpdate({ key }, updateData, { new: true });
      if (!config) {
        return res.json({ success: false, message: Message.CONFIG_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.CONFIG_UPDATED, data: config });
    } catch (err) {
      logger.logError('admin/systemConfig/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { list, get, add, update };
