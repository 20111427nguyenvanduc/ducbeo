const Message = require('../../../message');

const create = {
  v1: async (req, res) => {
    try {
      const { title, imageUrl, link, isActive, order } = req.body;
      if (!title || !imageUrl) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const banner = await BannerModel.create({
        title,
        imageUrl,
        link: link || '',
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      });

      return res.json({ success: true, message: Message.BANNER_CREATED, data: banner });
    } catch (err) {
      logger.logError('admin/banner/create', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const list = {
  v1: async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

      const [banners, total] = await Promise.all([
        BannerModel.find()
          .sort({ order: 1, createdAt: -1 })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        BannerModel.countDocuments(),
      ]);

      return res.json({ success: true, data: { banners, total, page: parsedPage, limit: parsedLimit } });
    } catch (err) {
      logger.logError('admin/banner/list', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const allowedFields = ['title', 'imageUrl', 'link', 'isActive', 'order'];
      const updateData = {};
      allowedFields.forEach((f) => {
        if (req.body[f] !== undefined) updateData[f] = req.body[f];
      });

      const banner = await BannerModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!banner) {
        return res.json({ success: false, message: Message.BANNER_NOT_FOUND });
      }

      return res.json({ success: true, message: Message.BANNER_UPDATED, data: banner });
    } catch (err) {
      logger.logError('admin/banner/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const remove = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await BannerModel.findByIdAndDelete(id);
      if (!banner) {
        return res.json({ success: false, message: Message.BANNER_NOT_FOUND });
      }
      return res.json({ success: true, message: Message.BANNER_DELETED });
    } catch (err) {
      logger.logError('admin/banner/remove', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const toggleActive = {
  v1: async (req, res) => {
    try {
      const { id } = req.params;
      const banner = await BannerModel.findById(id);
      if (!banner) {
        return res.json({ success: false, message: Message.BANNER_NOT_FOUND });
      }

      const updated = await BannerModel.findByIdAndUpdate(
        id,
        { isActive: !banner.isActive },
        { new: true }
      );

      return res.json({ success: true, data: updated });
    } catch (err) {
      logger.logError('admin/banner/toggleActive', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create, list, update, remove, toggleActive };
