const Message = require('../../../message');

const create = {
  v1: async (req, res) => {
    try {
      const { name, slug, isActive, order, icon } = req.body;
      if (!name || !slug) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const existing = await PropertyTypeModel.findOne({ slug });
      if (existing) {
        return res.json({ success: false, message: 'Slug đã tồn tại' });
      }

      const propertyType = await PropertyTypeModel.create({
        name,
        slug,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
        icon: icon || '',
      });

      return res.json({ success: true, message: Message.PROPERTY_TYPE_CREATED, data: propertyType });
    } catch (err) {
      logger.logError('admin/propertyType/create', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const list = {
  v1: async (req, res) => {
    try {
      const propertyTypes = await PropertyTypeModel.find().sort({ order: 1, name: 1 });
      return res.json({ success: true, data: propertyTypes });
    } catch (err) {
      logger.logError('admin/propertyType/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const allowedFields = ['name', 'isActive', 'order', 'icon'];
      const updateData = {};
      allowedFields.forEach((f) => {
        if (req.body[f] !== undefined) updateData[f] = req.body[f];
      });

      const propertyType = await PropertyTypeModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!propertyType) {
        return res.json({ success: false, message: Message.PROPERTY_TYPE_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.PROPERTY_TYPE_UPDATED, data: propertyType });
    } catch (err) {
      logger.logError('admin/propertyType/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const remove = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const propertyType = await PropertyTypeModel.findByIdAndDelete(id);
      if (!propertyType) {
        return res.json({ success: false, message: Message.PROPERTY_TYPE_NOT_FOUND });
      }
      return res.json({ success: true, message: Message.PROPERTY_TYPE_DELETED });
    } catch (err) {
      logger.logError('admin/propertyType/remove', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const toggleActive = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const propertyType = await PropertyTypeModel.findById(id);
      if (!propertyType) {
        return res.json({ success: false, message: Message.PROPERTY_TYPE_NOT_FOUND });
      }

      const updated = await PropertyTypeModel.findByIdAndUpdate(
        id,
        { isActive: !propertyType.isActive },
        { new: true }
      );

      return res.json({ success: true, data: updated });
    } catch (err) {
      logger.logError('admin/propertyType/toggleActive', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create, list, update, remove, toggleActive };
