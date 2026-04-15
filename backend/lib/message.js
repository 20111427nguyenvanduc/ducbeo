'use strict'

module.exports = {
  SYSTEM_ERROR: { head: 'Lỗi', body: 'Lỗi hệ thống' },
  NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy' },
  UNAUTHORIZED: { head: 'Lỗi', body: 'Vui lòng đăng nhập' },
  FORBIDDEN: { head: 'Lỗi', body: 'Không có quyền' },
  INVALID_INPUT: { head: 'Lỗi', body: 'Dữ liệu đầu vào không hợp lệ' },

  PHONE_REQUIRED: { head: 'Lỗi', body: 'Số điện thoại không được để trống' },
  INVALID_PHONE: { head: 'Lỗi', body: 'Số điện thoại không hợp lệ' },
  OTP_SENT: { head: 'Thành công', body: 'Mã OTP đã được gửi' },
  OTP_INVALID: { head: 'Lỗi', body: 'Mã OTP không hợp lệ hoặc đã hết hạn' },
  OTP_EXPIRED: { head: 'Lỗi', body: 'Mã OTP đã hết hạn' },
  LOGIN_SUCCESS: { head: 'Thành công', body: 'Đăng nhập thành công' },
  LOGOUT_SUCCESS: { head: 'Thành công', body: 'Đăng xuất thành công' },
  TOKEN_INVALID: { head: 'Lỗi', body: 'Token không hợp lệ' },
  TOKEN_EXPIRED: { head: 'Phiên hết hạn', body: 'Vui lòng đăng nhập lại' },
  PASSWORD_WRONG: { head: 'Lỗi', body: 'Mật khẩu không đúng' },
  PASSWORD_CHANGED: { head: 'Thành công', body: 'Đổi mật khẩu thành công' },
  PASSWORD_REQUIRED: { head: 'Lỗi', body: 'Mật khẩu không được để trống' },
  USERNAME_REQUIRED: { head: 'Lỗi', body: 'Tên đăng nhập không được để trống' },
  ACCOUNT_LOCKED: { head: 'Lỗi', body: 'Tài khoản đã bị khóa' },
  ACCOUNT_NOT_FOUND: { head: 'Lỗi', body: 'Tài khoản không tồn tại' },
  TOO_MANY_FAILED_ATTEMPTS: { head: 'Lỗi', body: 'Quá nhiều lần đăng nhập sai' },

  MEMBER_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy người dùng' },
  MEMBER_UPDATED: { head: 'Thành công', body: 'Cập nhật thông tin thành công' },
  MEMBER_LOCKED: { head: 'Thành công', body: 'Tài khoản người dùng đã bị khóa' },
  MEMBER_UNLOCKED: { head: 'Thành công', body: 'Tài khoản người dùng đã được mở khóa' },

  COMPANY_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy công ty' },
  COMPANY_CREATED: { head: 'Thành công', body: 'Tạo công ty thành công' },
  COMPANY_UPDATED: { head: 'Thành công', body: 'Cập nhật công ty thành công' },
  COMPANY_LOCKED: { head: 'Lỗi', body: 'Công ty đã bị khóa' },
  COMPANY_UNLOCKED: { head: 'Thành công', body: 'Công ty đã được mở khóa' },
  COMPANY_DELETED: { head: 'Thành công', body: 'Xóa công ty thành công' },

  PROPERTY_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy tài sản' },
  PROPERTY_CREATED: { head: 'Thành công', body: 'Tạo tài sản thành công' },
  PROPERTY_UPDATED: { head: 'Thành công', body: 'Cập nhật tài sản thành công' },
  PROPERTY_DELETED: { head: 'Thành công', body: 'Xóa tài sản thành công' },

  LISTING_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy tin đăng' },
  LISTING_CREATED: { head: 'Thành công', body: 'Tạo tin đăng thành công' },
  LISTING_UPDATED: { head: 'Thành công', body: 'Cập nhật tin đăng thành công' },
  LISTING_DELETED: { head: 'Thành công', body: 'Xóa tin đăng thành công' },
  LISTING_APPROVED: { head: 'Thành công', body: 'Tin đăng đã được duyệt' },
  LISTING_REJECTED: { head: 'Thành công', body: 'Tin đăng đã bị từ chối' },
  LISTING_EXTENDED: { head: 'Thành công', body: 'Gia hạn tin đăng thành công' },

  CONSULT_REQUEST_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy đơn tư vấn' },
  CONSULT_REQUEST_CREATED: { head: 'Thành công', body: 'Gửi đơn tư vấn thành công' },
  CONSULT_REQUEST_UPDATED: { head: 'Thành công', body: 'Cập nhật đơn tư vấn thành công' },
  CONSULT_REQUEST_NOTE_ADDED: { head: 'Thành công', body: 'Thêm ghi chú thành công' },
  REMINDER_SENT: { head: 'Thành công', body: 'Đã gửi nhắc nhở' },

  CONSIGN_REQUEST_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy đơn ký gửi' },
  CONSIGN_REQUEST_CREATED: { head: 'Thành công', body: 'Gửi đơn ký gửi thành công' },
  CONSIGN_REQUEST_UPDATED: { head: 'Thành công', body: 'Cập nhật đơn ký gửi thành công' },

  NOTIFICATION_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy thông báo' },
  NOTIFICATION_SEEN: { head: 'Thành công', body: 'Đã đánh dấu đã đọc' },
  NOTIFICATION_SEEN_ALL: { head: 'Thành công', body: 'Đã đánh dấu tất cả đã đọc' },

  BANNER_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy banner' },
  BANNER_CREATED: { head: 'Thành công', body: 'Tạo banner thành công' },
  BANNER_UPDATED: { head: 'Thành công', body: 'Cập nhật banner thành công' },
  BANNER_DELETED: { head: 'Thành công', body: 'Xóa banner thành công' },

  PROPERTY_TYPE_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy loại bất động sản' },
  PROPERTY_TYPE_CREATED: { head: 'Thành công', body: 'Tạo loại bất động sản thành công' },
  PROPERTY_TYPE_UPDATED: { head: 'Thành công', body: 'Cập nhật loại bất động sản thành công' },
  PROPERTY_TYPE_DELETED: { head: 'Thành công', body: 'Xóa loại bất động sản thành công' },

  FEEDBACK_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy phản hồi' },
  FEEDBACK_RESOLVED: { head: 'Thành công', body: 'Đã xử lý phản hồi' },

  CONFIG_NOT_FOUND: { head: 'Lỗi', body: 'Không tìm thấy cấu hình' },
  CONFIG_UPDATED: { head: 'Thành công', body: 'Cập nhật cấu hình thành công' },
  CONFIG_ADDED: { head: 'Thành công', body: 'Thêm cấu hình thành công' },
}
