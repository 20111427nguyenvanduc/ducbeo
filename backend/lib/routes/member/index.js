const Message = require('../../message');

const get = {
  v1: async (req, res) => {
    try {
      const member = req.member;
      return res.json({
        success: true,
        data: {
          _id: member._id,
          phone: member.phone,
          name: member.name,
          email: member.email,
          avatar: member.avatar,
          dob: member.dob,
          gender: member.gender,
          address: member.address,
          createdAt: member.createdAt,
        },
      });
    } catch (err) {
      logger.logError('member/get', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

const update = {
  v1: async (req, res) => {
    try {
      const { name, email, avatar, dob, gender, address } = req.body;
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (dob !== undefined) updateData.dob = dob;
      if (gender !== undefined) updateData.gender = gender;
      if (address !== undefined) updateData.address = address;

      const member = await MemberModel.findByIdAndUpdate(
        req.member._id,
        updateData,
        { new: true }
      );

      return res.json({
        success: true,
        message: Message.MEMBER_UPDATED,
        data: {
          _id: member._id,
          phone: member.phone,
          name: member.name,
          email: member.email,
          avatar: member.avatar,
          dob: member.dob,
          gender: member.gender,
          address: member.address,
        },
      });
    } catch (err) {
      logger.logError('member/update', err.message);
      return res.json({ success: false, message: Message.SYSTEM_ERROR });
    }
  },
};

module.exports = { get, update };
