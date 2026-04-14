const Message = require('../../message');

const create = {
  v1: async (req, res) => {
    try {
      const member = req.member;
      const {
        propertyTypeSlug,
        transactionType,
        province,
        district,
        ward,
        addressDetail,
        area,
        price,
        description,
        images,
      } = req.body;

      if (!propertyTypeSlug || !transactionType) {
        return res.json({ success: false, message: Message.INVALID_INPUT });
      }

      const consignRequest = await ConsignRequestModel.create({
        memberId: member._id,
        memberName: member.name || member.phone,
        memberPhone: member.phone,
        propertyTypeSlug,
        transactionType,
        province,
        district,
        ward,
        addressDetail,
        area,
        price,
        description: description || '',
        images: images || [],
        status: 'new',
      });

      return res.json({
        success: true,
        message: Message.CONSIGN_REQUEST_CREATED,
        data: consignRequest,
      });
    } catch (err) {
      logger.logError('consignRequest/create', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { create };
