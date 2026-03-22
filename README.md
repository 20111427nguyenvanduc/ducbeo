# 📋 TÀI LIỆU HỆ THỐNG - SÀN GIAO DỊCH BẤT ĐỘNG SẢN NỀN

> **Phiên bản:** 1.0.0  
> **Cập nhật:** 03/2026

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Giới thiệu

Hệ thống **Sàn Giao Dịch Bất Động Sản Nền** là nền tảng trung gian kết nối **Công ty Bất Động Sản** (bên có đất cần bán) với **Người mua** (bên có nhu cầu tìm đất). Thay vì phải tìm kiếm qua nhiều kênh rời rạc, người mua có thể vào một nơi duy nhất để xem tất cả các lô đất nền đang được rao bán, lọc theo nhu cầu và liên hệ trực tiếp với công ty BĐS.

### 1.2 Mục tiêu

- Cung cấp nền tảng cho các **Công ty BĐS** đăng tin bán đất nền một cách chuyên nghiệp.
- Giúp **Người mua** dễ dàng tìm kiếm, so sánh và liên hệ mua đất.
- Cung cấp công cụ **Quản trị** để vận hành và kiểm soát toàn bộ hệ thống.

### 1.3 Sơ đồ tổng thể

```
┌──────────────┐   ┌────────────────┐   ┌──────────────────┐   ┌──────────────┐
│ Landing Page │   │  Web + Mobile  │   │ Company Portal   │   │ Admin System │
│ (WordPress)  │   │  App           │   │ (Công ty BĐS)    │   │ (Quản trị)   │
│              │   │  (Người mua)   │   │                  │   │              │
│ bdsnen.vn    │   │ app.bdsnen.vn  │   │ company.bdsnen   │   │ admin.bdsnen │
└──────┬───────┘   └──────┬─────────┘   └────────┬─────────┘   └──────┬───────┘
       │                  │                       │                    │
       └──────────────────┴───────────────────────┴────────────────────┘
                                        │
                           ┌────────────▼────────────┐
                           │       Backend API        │
                           │   api.bdsnen.vn          │
                           │   (Node.js + Express)    │
                           └────────────┬────────────┘
                                        │
                              ┌─────────▼─────────┐
                              │     MongoDB        │
                              └───────────────────┘
```

---

## 2. NGƯỜI DÙNG THAM GIA HỆ THỐNG

Hệ thống có **4 loại người dùng** với vai trò và quyền hạn khác nhau:

| # | Người dùng | Mô tả | Cần đăng nhập |
|---|---|---|---|
| 1 | 👤 **Người mua (Guest)** | Người có nhu cầu tìm mua đất nền. Vào xem danh sách, tìm kiếm và để lại thông tin liên hệ | ❌ Không |
| 2 | 🏢 **Công ty BĐS** | Doanh nghiệp bất động sản. Đăng ký tài khoản, đăng tin bán đất và nhận thông tin khách hàng quan tâm | ✅ Có |
| 3 | 🔑 **Admin** | Quản trị viên hệ thống. Duyệt tài khoản, duyệt tin đăng, theo dõi vận hành | ✅ Có |
| 4 | 🦸 **Super Admin** | Quản trị cấp cao. Toàn quyền hệ thống bao gồm quản lý Admin khác và cài đặt hệ thống | ✅ Có |

---

## 3. CÁC SẢN PHẨM TRONG HỆ THỐNG

### 3.1 🌐 Landing Page (WordPress)

**Mục đích:** Giới thiệu nền tảng, thu hút Công ty BĐS đăng ký sử dụng dịch vụ.

**Đối tượng:** Khách truy cập, Công ty BĐS tiềm năng.

| Trang / Section | Nội dung |
|---|---|
| Trang chủ (Hero) | Slogan, mô tả ngắn, nút CTA "Đăng ký dùng thử" |
| Tính năng | Giới thiệu các tính năng nổi bật của nền tảng |
| Cách hoạt động | Hướng dẫn 3 bước: Đăng ký → Đăng tin → Nhận khách |
| Bảng giá | Các gói dịch vụ (nếu có tính phí) |
| Liên hệ | Form đăng ký tư vấn |
| Blog | Bài viết thị trường BĐS (hỗ trợ SEO) |

---

### 3.2 🏠 Web App + Mobile App (Dành cho Người mua)

**Mục đích:** Nơi người mua tìm kiếm đất nền và liên hệ với Công ty BĐS.

**Đối tượng:** Người mua / Khách vãng lai (không cần đăng nhập).

**Công nghệ:** ReactJS (Web) + React Native Expo (Mobile App).

#### 📱 Màn 1 - Trang Chủ

Đây là màn hình đầu tiên người dùng nhìn thấy khi vào ứng dụng.

**Hiển thị:**
- Header: Logo + Thanh tìm kiếm nhanh + Nút "Dành cho Công ty BĐS" (link sang Company Portal)
- Bộ lọc nhanh: Tỉnh/Thành, Khoảng giá, Diện tích
- Danh sách tin đăng dạng thẻ (card): ảnh đại diện, tiêu đề, giá, diện tích, vị trí, tên công ty đăng
- Phân trang hoặc cuộn vô hạn (infinite scroll)
- Footer: thông tin liên hệ, điều khoản

**Người dùng có thể:**
- Nhập từ khoá vào ô tìm kiếm → chuyển sang màn Tìm kiếm
- Chọn bộ lọc nhanh → danh sách cập nhật ngay
- Bấm vào một thẻ đất → chuyển sang màn Chi tiết mảnh đất
- Bấm "Dành cho Công ty BĐS" → mở trang Company Portal

---

#### 📱 Màn 2 - Tìm Kiếm & Lọc

Giúp người mua thu hẹp kết quả theo nhu cầu cụ thể.

**Hiển thị:**
- Thanh search có từ khoá hiện tại
- Bộ lọc nâng cao:
  - Tỉnh / Quận / Phường
  - Khoảng giá (từ - đến)
  - Diện tích (từ - đến)
  - Loại đất: Thổ cư / Nông nghiệp / Thương mại
  - Pháp lý: Sổ đỏ / Đang làm sổ / Chưa có sổ
- Kết quả dạng **Danh sách** hoặc **Bản đồ**
- Sắp xếp: Mới nhất / Giá tăng dần / Giá giảm dần / Diện tích

**Người dùng có thể:**
- Nhập từ khoá + chọn bộ lọc → kết quả cập nhật realtime
- Chuyển đổi giữa chế độ xem Danh sách ↔ Bản đồ
- Bấm vào thẻ đất → màn Chi tiết
- Xoá bộ lọc → reset về mặc định

---

#### 📱 Màn 3 - Chi Tiết Mảnh Đất

Màn hình quan trọng nhất — nơi người mua quyết định có liên hệ hay không.

**Hiển thị:**
- Carousel ảnh mảnh đất (vuốt xem ảnh tiếp theo, bấm để xem fullscreen)
- Tiêu đề, Giá bán, Giá/m², Diện tích, Vị trí (Tỉnh/Quận/Phường)
- Thông tin chi tiết: Loại đất, Tình trạng pháp lý, Mặt tiền, Hướng
- Mô tả chi tiết từ công ty đăng
- Bản đồ vị trí (Google Maps tích hợp)
- Thông tin công ty đăng: Logo, tên công ty, số điện thoại
- Nút **"LIÊN HỆ NGAY"** (cố định ở dưới màn hình)
- Nút Chia sẻ

**Người dùng có thể:**
- Vuốt / bấm ảnh → xem ảnh fullscreen
- Bấm "Xem bản đồ" → mở Google Maps chỉ đường
- Bấm "Chia sẻ" → chia sẻ link tin đăng
- Bấm "LIÊN HỆ NGAY" → mở Form Liên Hệ bên dưới

---

#### 📱 Màn 4 - Form Liên Hệ (Popup / Bottom Sheet)

Không chuyển trang — hiện lên ngay trên màn Chi tiết.

**Hiển thị:**
- Tiêu đề: "Để lại thông tin, chúng tôi sẽ liên hệ bạn"
- Trường nhập: Họ và tên *, Số điện thoại *, Email, Ghi chú / Yêu cầu
- Nút "Gửi thông tin"

**Người dùng có thể:**
- Điền thông tin + Bấm "Gửi" → hệ thống lưu thông tin (lead), hiện thông báo "Gửi thành công! Công ty BĐS sẽ liên hệ bạn sớm."
- Bấm đóng (X) → đóng form, quay về màn Chi tiết

> **Sau khi người mua gửi:** Công ty BĐS sẽ nhận được thông báo ngay lập tức (realtime) và có thể xem thông tin trong Company Portal.

---

### 3.3 🏢 Company Portal (Dành cho Công ty BĐS)

**Mục đích:** Công cụ quản lý dành riêng cho Công ty BĐS — đăng tin, quản lý tin đăng và xem thông tin khách hàng quan tâm.

**Đối tượng:** Công ty BĐS (bắt buộc đăng nhập).

**Công nghệ:** ReactJS + Vite + Tailwind CSS.

#### 🖥️ Màn 1 - Đăng Ký Tài Khoản

**Hiển thị:**
- Tên công ty *, Email *, Mật khẩu *, Xác nhận mật khẩu *
- Số điện thoại *, Địa chỉ công ty, Mã số thuế
- Upload logo công ty
- Nút "Đăng ký"

**Luồng sau khi đăng ký:**
1. Hệ thống gửi email xác thực địa chỉ email
2. Tài khoản ở trạng thái **"Chờ duyệt"**
3. Admin xem xét và duyệt tài khoản
4. Công ty nhận email thông báo **"Tài khoản đã được duyệt"**
5. Công ty đăng nhập và bắt đầu sử dụng

---

#### 🖥️ Màn 2 - Đăng Nhập

**Hiển thị:** Email, Mật khẩu, Nút "Đăng nhập", Link "Quên mật khẩu", Link "Chưa có tài khoản? Đăng ký"

**Người dùng có thể:**
- Đăng nhập thành công → vào Dashboard
- Bấm "Quên mật khẩu" → nhập email → nhận link đặt lại mật khẩu

---

#### 🖥️ Màn 3 - Dashboard Tổng Quan

Trang tổng quan sau khi đăng nhập.

**Hiển thị:**
- Lời chào: "Xin chào, [Tên Công ty]!"
- Thống kê nhanh: Số tin đang hiển thị / Tổng lượt xem hôm nay / Số leads mới chưa liên hệ
- Danh sách **leads mới nhất** cần xử lý (tên, SĐT, thời gian gửi)
- Danh sách **tin đăng sắp hết hạn** (nếu có giới hạn thời gian)

**Người dùng có thể:**
- Bấm vào số liệu thống kê → chuyển sang màn tương ứng
- Bấm vào lead → xem chi tiết
- Bấm "Tạo tin mới" → chuyển sang màn Tạo tin đăng

---

#### 🖥️ Màn 4 - Danh Sách Tin Đăng

**Hiển thị:**
- Nút "Tạo tin mới" (nổi bật góc trên phải)
- Tabs lọc theo trạng thái: **Tất cả** | **Đang hiển thị** | **Chờ duyệt** | **Đã bán** | **Bị từ chối**
- Mỗi tin đăng hiển thị: ảnh thu nhỏ, tiêu đề, giá, diện tích, trạng thái (badge màu), số lượt xem, số leads

**Người dùng có thể:**
- Bấm "Tạo tin mới" → màn Tạo tin đăng
- Bấm "Chỉnh sửa" trên tin → màn Chỉnh sửa tin đăng
- Bấm "Đánh dấu đã bán" → tin chuyển sang trạng thái Đã bán, ẩn khỏi sàn
- Bấm "Xoá" → hiện popup xác nhận → xoá tin
- Bấm tab trạng thái → lọc danh sách theo trạng thái tương ứng

---

#### 🖥️ Màn 5 - Tạo / Chỉnh Sửa Tin Đăng (Nhiều bước)

Chia thành 5 bước để nhập liệu dễ dàng:

**Bước 1 — Thông tin cơ bản:**
- Tiêu đề tin đăng, Loại đất (dropdown), Diện tích (m²), Giá bán, Đơn vị (VNĐ/Tỷ), Tình trạng pháp lý

**Bước 2 — Vị trí:**
- Tỉnh / Thành phố, Quận / Huyện, Phường / Xã, Địa chỉ cụ thể
- Ghim vị trí trên bản đồ (Google Maps)

**Bước 3 — Hình ảnh:**
- Upload tối đa 10 ảnh
- Kéo thả để sắp xếp thứ tự
- Ảnh đầu tiên = ảnh đại diện

**Bước 4 — Mô tả chi tiết:**
- Mô tả (rich text editor), Chiều rộng mặt tiền, Hướng nhà, Tiện ích xung quanh

**Bước 5 — Xem trước & Đăng:**
- Preview đúng như giao diện người mua sẽ thấy
- Nút "Đăng tin" → tin chuyển sang trạng thái **"Chờ duyệt"**
- Hệ thống gửi thông báo cho Admin
- Công ty nhận email xác nhận "Tin đăng đã được gửi, đang chờ duyệt"

---

#### 🖥️ Màn 6 - Quản Lý Leads (Thông tin người quan tâm)

**Hiển thị:**
- Bộ lọc: Theo tin đăng cụ thể / Đã liên hệ / Chưa liên hệ
- Mỗi lead hiển thị:
  - Họ tên, Số điện thoại, Email
  - Quan tâm đến tin đăng nào
  - Ghi chú của người mua
  - Thời gian gửi
  - Trạng thái: "Chưa liên hệ" (badge đỏ) / "Đã liên hệ" (badge xanh)

**Người dùng có thể:**
- Bấm vào số điện thoại → gọi điện trực tiếp (trên mobile)
- Bấm vào email → mở ứng dụng email
- Bấm "Đánh dấu đã liên hệ" → cập nhật trạng thái lead
- Bấm tên tin đăng → xem lại tin đăng tương ứng
- Lọc theo bộ lọc → cập nhật danh sách

---

#### 🖥️ Màn 7 - Hồ Sơ Công Ty

**Hiển thị:** Logo, Tên công ty, Email, Số điện thoại, Địa chỉ, Mã số thuế

**Người dùng có thể:**
- Chỉnh sửa thông tin công ty → lưu cập nhật
- Đổi mật khẩu (nhập mật khẩu cũ + mật khẩu mới)
- Đăng xuất → về trang đăng nhập

---

### 3.4 ⚙️ Admin System (Dành cho Quản trị viên)

**Mục đích:** Vận hành và kiểm soát toàn bộ hệ thống.

**Đối tượng:** Admin, Super Admin.

**Công nghệ:** ReactJS + Vite + Ant Design.

#### 🖥️ Màn 1 - Dashboard Thống Kê

**Hiển thị:**
- Tổng số: Công ty đang hoạt động / Tin đang hiển thị / Tổng lượt xem / Tổng leads hôm nay
- Biểu đồ: Tin đăng mới theo ngày/tuần/tháng, Leads theo ngày
- Danh sách tin đăng đang chờ duyệt (mới nhất)

---

#### 🖥️ Màn 2 - Quản Lý Công Ty BĐS

**Hiển thị:** Danh sách tất cả công ty, trạng thái tài khoản, ngày đăng ký, số tin đăng

**Admin có thể:**
- Duyệt tài khoản mới → hệ thống gửi email thông báo cho công ty
- Khoá tài khoản → công ty không thể đăng nhập hoặc đăng tin
- Mở khoá tài khoản → khôi phục quyền truy cập
- Xem chi tiết → thông tin công ty + lịch sử tin đăng + leads

---

#### 🖥️ Màn 3 - Duyệt Tin Đăng

**Hiển thị:**
- Tabs: **Chờ duyệt** | **Đang hiển thị** | **Bị từ chối**
- Xem đầy đủ nội dung tin đăng (ảnh, thông tin, vị trí)

**Admin có thể:**
- Duyệt ✅ → tin hiển thị lên sàn → thông báo cho công ty
- Từ chối ❌ → nhập lý do từ chối → gửi email thông báo cho công ty
- Xoá → xoá tin khỏi hệ thống (vi phạm nội dung)

---

#### 🖥️ Màn 4 - Xem Tất Cả Leads

**Hiển thị:** Toàn bộ leads trong hệ thống, lọc theo công ty / theo tin đăng / theo thời gian

**Admin có thể:**
- Xem chi tiết từng lead
- Xuất danh sách leads ra file Excel/CSV

---

#### 🖥️ Màn 5 - Cài Đặt Hệ Thống

**Admin có thể:**
- Quản lý danh mục: Loại đất, Tỉnh/Thành phố, Tình trạng pháp lý
- Chỉnh sửa nội dung email template (email duyệt tài khoản, duyệt tin, từ chối...)
- Quản lý tài khoản Admin (chỉ Super Admin)

---

## 4. LUỒNG NGHIỆP VỤ CHÍNH

### Luồng 1 - Công ty BĐS đăng ký và đăng tin

```
[Công ty] Vào Landing Page
    → Bấm "Đăng ký dùng thử"
    → Điền form đăng ký trên Company Portal
    → Xác thực email
    → Chờ Admin duyệt tài khoản
[Admin]  Nhận thông báo có tài khoản mới
    → Xem xét thông tin công ty
    → Bấm "Duyệt"
[Công ty] Nhận email "Tài khoản đã được duyệt"
    → Đăng nhập vào Company Portal
    → Tạo tin đăng mới (5 bước)
    → Bấm "Đăng tin"
[Admin]  Nhận thông báo có tin đăng mới chờ duyệt
    → Kiểm tra nội dung tin
    → Bấm "Duyệt"
[Công ty] Tin đăng hiển thị lên sàn (Web/App người mua)
```

### Luồng 2 - Người mua tìm kiếm và liên hệ

```
[Người mua] Vào Web App / Mobile App
    → Xem danh sách đất trang chủ hoặc tìm kiếm
    → Bấm vào thẻ đất quan tâm
    → Xem Chi tiết mảnh đất
    → Bấm "LIÊN HỆ NGAY"
    → Điền form: Tên, SĐT, Email, Ghi chú
    → Bấm "Gửi thông tin"
[Hệ thống] Lưu thông tin lead
    → Gửi thông báo realtime cho Công ty BĐS
[Công ty]  Nhận thông báo trên Company Portal
    → Vào màn Leads
    → Xem thông tin người mua
    → Gọi điện / Email liên hệ lại
    → Đánh dấu "Đã liên hệ"
```

### Luồng 3 - Admin vận hành hệ thống

```
[Admin] Đăng nhập Admin System
    → Xem Dashboard thống kê tổng quan
    → Kiểm tra danh sách tài khoản công ty chờ duyệt → Duyệt / Từ chối
    → Kiểm tra danh sách tin đăng chờ duyệt → Duyệt / Từ chối
    → Theo dõi leads và hoạt động hệ thống
    → Xử lý báo cáo vi phạm (nếu có)
```

---

## 5. TỔNG HỢP CHỨC NĂNG THEO VAI TRÒ

### 👤 Người mua (Không cần đăng nhập)

| # | Chức năng |
|---|---|
| 1 | Xem danh sách đất nền trên trang chủ |
| 2 | Tìm kiếm theo từ khoá |
| 3 | Lọc theo: Tỉnh/Thành, Giá, Diện tích, Loại đất, Pháp lý |
| 4 | Sắp xếp kết quả |
| 5 | Chuyển đổi xem dạng Danh sách / Bản đồ |
| 6 | Xem chi tiết mảnh đất (ảnh, thông tin, bản đồ) |
| 7 | Xem vị trí trên Google Maps |
| 8 | Chia sẻ link tin đăng |
| 9 | Gửi thông tin liên hệ (để lại lead) |

### 🏢 Công ty BĐS (Cần đăng nhập)

| # | Chức năng |
|---|---|
| 1 | Đăng ký tài khoản công ty |
| 2 | Đăng nhập / Đăng xuất |
| 3 | Quên mật khẩu / Đặt lại mật khẩu |
| 4 | Xem Dashboard tổng quan (tin đăng, lượt xem, leads) |
| 5 | Tạo tin đăng bán đất mới |
| 6 | Chỉnh sửa tin đăng |
| 7 | Xoá tin đăng |
| 8 | Đánh dấu tin đăng "Đã bán" |
| 9 | Xem danh sách leads (người quan tâm) |
| 10 | Lọc leads theo tin đăng / trạng thái liên hệ |
| 11 | Đánh dấu lead "Đã liên hệ" |
| 12 | Nhận thông báo realtime khi có lead mới |
| 13 | Cập nhật hồ sơ công ty |
| 14 | Đổi mật khẩu |

### 🔑 Admin

| # | Chức năng |
|---|---|
| 1 | Đăng nhập Admin System |
| 2 | Xem Dashboard thống kê toàn hệ thống |
| 3 | Duyệt / Từ chối tài khoản Công ty BĐS |
| 4 | Khoá / Mở khoá tài khoản Công ty BĐS |
| 5 | Duyệt / Từ chối tin đăng |
| 6 | Xoá tin đăng vi phạm |
| 7 | Xem tất cả leads trong hệ thống |
| 8 | Xuất danh sách leads (Excel/CSV) |
| 9 | Quản lý danh mục (Loại đất, Tỉnh/Thành, Pháp lý) |
| 10 | Chỉnh sửa email template |

### 🦸 Super Admin (Toàn quyền)

| # | Chức năng |
|---|---|
| 1 | Tất cả quyền của Admin |
| 2 | Quản lý tài khoản Admin (tạo, khoá, xoá) |
| 3 | Cài đặt hệ thống |

---

## 6. THÔNG TIN KỸ THUẬT

### Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Landing Page | WordPress |
| Web App (Người mua) | React + Vite + Tailwind CSS |
| Mobile App (Người mua) | React Native + Expo |
| Company Portal | React + Vite + Tailwind CSS |
| Admin System | React + Vite + Ant Design |
| Backend API | Node.js + Express.js |
| Cơ sở dữ liệu | MongoDB + Mongoose |
| Xác thực | JWT + Refresh Token |
| Upload ảnh | Cloudinary |
| Bản đồ | Google Maps API |
| Gửi Email | Nodemailer |
| Thông báo Realtime | Socket.io |
| Quản lý State | Zustand |

### Domain

| Hệ thống | Domain |
|---|---|
| Landing Page | bdsnen.vn |
| Web App (Người mua) | app.bdsnen.vn |
| Company Portal | company.bdsnen.vn |
| Admin System | admin.bdsnen.vn |
| Backend API | api.bdsnen.vn |

### Cấu trúc thư mục (Monorepo)

```
bds-nen-platform/
├── web-app/           # React - Người mua
├── mobile-app/        # React Native - Người mua
├── company-portal/    # React - Công ty BĐS
├── admin/             # React - Quản trị
├── backend/           # Node.js + Express
└── docs/              # Tài liệu hệ thống
```

---

*Tài liệu được tạo và quản lý tại: https://github.com/20111427nguyenvanduc/ducbeo
