# 🏡 SÀN BẤT ĐỘNG SẢN HƯNG YÊN
## *"Uy tín – An tâm – Mua nhanh – Bán lẹ"*

> **Phiên bản:** 2.0.0
> **Cập nhật:** 03/2026

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Giới thiệu

**Sàn Bất Động Sản Hưng Yên** là nền tảng trung gian kết nối **Công ty Bất Động Sản** với **Người có nhu cầu mua / bán BĐS** tại Hưng Yên và các khu vực lân cận. Hệ thống cho phép các Công ty BĐS đăng tin rao bán **đa dạng loại hình BĐS** (đất nền, nhà riêng, căn hộ chung cư, biệt thự, nhà mặt phố, bất động sản thương mại...), quản lý danh sách tài sản và theo dõi toàn bộ quá trình tư vấn khách hàng từ lúc khách để lại thông tin đến khi hoàn thành giao dịch.

> 💬 **Slogan:** *Uy tín – An tâm – Mua nhanh – Bán lẹ*

### 1.2 Mục tiêu

- Cung cấp **công cụ quản lý chuyên nghiệp** cho Công ty BĐS: quản lý đa dạng loại hình BĐS, đăng tin, theo dõi đơn tư vấn.
- Giúp **Người mua** dễ dàng tìm kiếm BĐS phù hợp theo nhiều loại hình (đất nền, nhà riêng, căn hộ, biệt thự, nhà mặt phố, thương mại...) và gửi yêu cầu tư vấn.
- Cho phép **Người bán cá nhân** đăng ký ký gửi tài sản lên sàn với đầy đủ loại hình BĐS.
- Cung cấp **hệ thống quản trị** vận hành toàn bộ nền tảng, nhắc nhở tư vấn và báo cáo thống kê.

### 1.3 Điểm khác biệt

- Mỗi Công ty BĐS có **domain riêng** được cấp phát bởi Admin (vd: `congtyabc.bdshy.vn`).
- Hệ thống tách biệt **Tài sản** và **Tin đăng** — 1 tài sản có thể có nhiều tin đăng, tránh spam, dễ quản lý.
- **Đơn tư vấn** có vòng đời đầy đủ từ Chờ tư vấn → Hoàn thành, được theo dõi realtime.
- Admin có **job tự động** nhắc nhở Công ty BĐS khi đơn tư vấn bị bỏ quên.

### 1.4 Sơ đồ tổng thể

```
┌───────────────┐  ┌──────────────────┐  ┌──────────────────────┐  ┌────────────────┐
│  Landing Page │  │  Web + Mobile    │  │  Company Portal      │  │  Admin System  │
│  (WordPress)  │──▶  App             │  │  (Công ty BĐS)       │  │  (Quản trị)    │
│  bdshy.vn     │  │  (Người mua/bán) │  │  congtyabc.bdshy.vn  │  │                │
│  [CTA→App]    │  │  app.bdshy.vn    │  │  congtyxyz.bdshy.vn  │  │ admin.bdshy    │
└──────┬────────┘  └───────┬──────────┘  └──────────┬───────────┘  └───────┬────────┘
       │  (CTA "Xem tin    │                         │                      │
       │   bán đất ngay")  │                         │                      │
       └───────────────────┴─────────────────────────┴──────────────────────┘
                                           │
                              ┌────────────▼────────────┐
                              │       Backend API        │
                              │   api.bdshy.vn           │
                              │   (Node.js + Express)    │
                              └────────────┬────────────┘
                                           │
                                 ┌─────────▼─────────┐
                                 │     MongoDB        │
                                 └───────────────────┘
```

---

## 2. NGƯỜI DÙNG THAM GIA HỆ THỐNG

| # | Người dùng | Mô tả | Đăng nhập | Nền tảng |
|---|---|---|---|---|
| 1 | 👤 **Người mua / Người bán cá nhân** | Tìm BĐS, gửi yêu cầu tư vấn, xem lịch sử tư vấn, đăng ký ký gửi tài sản | SĐT + OTP | Web + App |
| 2 | 🏢 **Nhân viên Công ty BĐS** | Quản lý tài sản, đăng tin, xử lý đơn tư vấn | Username + Password | Web |
| 3 | 🔑 **Admin** | Vận hành hệ thống, duyệt tin, quản lý công ty, nhắc nhở tư vấn | Username + Password | Web |
| 4 | 🦸 **Super Admin** | Toàn quyền hệ thống, quản lý Admin, cài đặt | Username + Password | Web |

---

## 3. CÁC SẢN PHẨM TRONG HỆ THỐNG

---

### 3.1 🌐 Landing Page (WordPress)

**Mục đích:** Giới thiệu nền tảng, thu hút Công ty BĐS liên hệ sử dụng dịch vụ.

**Đối tượng:** Khách truy cập, Công ty BĐS tiềm năng.

| Section | Nội dung |
|---|---|
| Hero | **"Uy tín – An tâm – Mua nhanh – Bán lẹ"** + mô tả ngắn về Sàn BĐS Hưng Yên + CTA "Liên hệ tư vấn" + CTA **"Xem tin bán đất"** → `app.bdshy.vn` |
| Tính năng | Giới thiệu tính năng nổi bật của nền tảng |
| Cách hoạt động | 3 bước: Đăng ký → Đăng tin → Nhận khách |
| Bảng giá | Các gói dịch vụ |
| Liên hệ | Form liên hệ để Admin tạo tài khoản |
| Blog | Bài viết thị trường BĐS Hưng Yên (SEO) |
| Xem Tin BĐS | Nút **"Xem tin bán đất ngay"** → dẫn tới [`app.bdshy.vn`](https://app.bdshy.vn) (trang Web App cho người mua, không cần đăng nhập) |

> **Lưu ý:** Công ty BĐS **không tự đăng ký** — phải liên hệ để Admin tạo tài khoản và cấp domain riêng.

---

### 3.2 🏠 Web App + Mobile App (Dành cho Người mua / Người bán cá nhân)

**Mục đích:** Nơi người dùng tìm kiếm BĐS, gửi yêu cầu tư vấn và theo dõi tiến trình.

**Đối tượng:** Người mua, Người bán cá nhân muốn ký gửi tài sản.

**Đăng nhập:** Số điện thoại + OTP (không cần tài khoản để xem danh sách).

**Công nghệ:** ReactJS (Web) + React Native Expo (Mobile App).

---

#### 📱 Màn 1 — Trang Chủ (Không cần đăng nhập)

**Hiển thị:**
- Header: Logo **Sàn BĐS Hưng Yên** + Slogan *"Uy tín – An tâm – Mua nhanh – Bán lẹ"* + Thanh tìm kiếm nhanh + Nút "Đăng nhập"
- Bộ lọc nhanh: Loại hình (🏘️ Đất nền / 🏠 Nhà riêng / 🏢 Căn hộ / 🏡 Biệt thự / 🏬 Nhà mặt phố / 🏭 Thương mại / 🌾 Đất nông nghiệp / 🏗️ Dự án BĐS), Tỉnh/Thành, Khoảng giá, Diện tích
- Danh sách tin đăng dạng thẻ: ảnh đại diện, tiêu đề, giá, diện tích, vị trí, loại hình
- Phân trang / Infinite scroll
- Footer

**Người dùng có thể:**
- Nhập từ khoá → chuyển màn Tìm kiếm
- Chọn bộ lọc nhanh → cập nhật danh sách ngay
- Bấm vào thẻ tin → màn Chi tiết BĐS
- Bấm "Đăng nhập" → màn Đăng nhập

---

#### 📱 Màn 2 — Tìm Kiếm & Lọc Nâng Cao

**Hiển thị:**
- Thanh search với từ khoá hiện tại
- Bộ lọc nâng cao:
  - Loại hình: 🏘️ Đất nền / Đất thổ cư | 🏠 Nhà riêng / Nhà phố | 🏢 Căn hộ chung cư | 🏡 Biệt thự / Nhà liền kề | 🏬 Nhà mặt phố / Mặt tiền | 🏭 Thương mại (Văn phòng / Mặt bằng KD / Kho xưởng) | 🌾 Đất nông nghiệp | 🏗️ Dự án BĐS
  - Tỉnh / Quận / Phường (địa chỉ cũ và mới)
  - Khoảng giá (từ - đến)
  - Diện tích (từ - đến)
  - Pháp lý: Sổ đỏ/Sổ hồng / Hợp đồng mua bán / Đang chờ sổ
- Kết quả dạng **Danh sách** hoặc **Bản đồ**
- Sắp xếp: Mới nhất / Giá tăng / Giá giảm / Diện tích

**Người dùng có thể:**
- Nhập từ khoá + bộ lọc → kết quả cập nhật realtime
- Chuyển đổi List ↔ Map
- Bấm vào thẻ → màn Chi tiết
- Xoá bộ lọc → reset

---

#### 📱 Màn 3 — Chi Tiết BĐS (Không cần đăng nhập)

**Hiển thị:**
- Carousel ảnh (vuốt / bấm xem fullscreen)
- Tiêu đề, Giá bán, Giá/m², Diện tích
- Loại hình, Pháp lý, Hướng nhà, Hướng ban công
- **Thông tin theo loại hình:**
  - *Đất nền / Đất thổ cư:* Loại đất, Quy hoạch, Vị trí lô, Mặt tiền (m), Đường vào (m)
  - *Nhà riêng / Nhà phố:* Số tầng, Diện tích sàn, Mặt tiền (m), Hẻm/Mặt phố, Đường vào (m)
  - *Căn hộ chung cư:* Tầng số, Tên tòa nhà / Dự án, View, Ban công, Nội thất, Số phòng ngủ, Số phòng tắm/WC
  - *Biệt thự / Nhà liền kề:* Diện tích đất, Diện tích xây dựng, Số tầng, Sân vườn, Nội thất
  - *Nhà mặt phố / Mặt tiền:* Số tầng, Diện tích sàn, Mặt tiền (m), Nội thất
  - *Thương mại:* Công năng, Diện tích sàn, Vị trí tầng, Nội thất
  - *Đất nông nghiệp:* Loại đất, Quy hoạch, Diện tích
  - *Dự án BĐS:* Tên dự án, Block/Tầng/Căn, Tiến độ xây dựng
- Địa chỉ + Bản đồ Google Maps
- Thông tin Công ty đăng: Logo, tên, SĐT
- Nút **"GỬI YÊU CẦU TƯ VẤN"** (sticky bottom)
- Nút Chia sẻ

**Người dùng có thể:**
- Vuốt / bấm ảnh → xem fullscreen
- Bấm "Xem bản đồ" → mở Google Maps
- Bấm "Chia sẻ" → chia sẻ link
- Bấm "GỬI YÊU CẦU TƯ VẤN" → mở Form tư vấn (nếu chưa đăng nhập → yêu cầu đăng nhập trước)

---

#### 📱 Màn 4 — Đăng Nhập (SĐT + OTP)

**Hiển thị:**
- Nhập số điện thoại → Bấm "Gửi OTP"
- Nhập mã OTP (6 số) → Bấm "Xác nhận"
- Nếu số chưa có tài khoản → tự động tạo tài khoản mới

**Người dùng có thể:**
- Nhập SĐT → nhận OTP qua SMS
- Nhập OTP đúng → đăng nhập thành công, về màn trước đó
- Bấm "Gửi lại OTP" (sau 60 giây)

---

#### 📱 Màn 5 — Form Gửi Yêu Cầu Tư Vấn (Bottom Sheet)

**Hiển thị:**
- Tiêu đề: "Gửi yêu cầu tư vấn"
- Tên *
- Số điện thoại * (tự điền nếu đã đăng nhập)
- Ghi chú / Yêu cầu thêm
- Nút "Gửi yêu cầu"

**Sau khi gửi:**
- Hệ thống tạo đơn tư vấn, trạng thái: **"Chờ tư vấn"**
- Công ty BĐS nhận thông báo realtime
- Người dùng nhận thông báo "Yêu cầu đã được gửi thành công"

---

#### 📱 Màn 6 — Lịch Sử Tư Vấn (Cần đăng nhập)

**Hiển thị:**
- Danh sách các đơn tư vấn đã gửi
- Mỗi đơn: Tên BĐS, Công ty tư vấn, Ngày gửi, Trạng thái hiện tại

**Trạng thái đơn tư vấn:**
| Trạng thái | Ý nghĩa |
|---|---|
| ⏳ Chờ tư vấn | Vừa gửi, chưa có phản hồi |
| 📞 Đang tư vấn | Công ty đang liên hệ tư vấn |
| 🏠 Hẹn xem đất | Đã hẹn lịch đi xem thực tế |
| 📝 Đang tên chuyển nhượng | Đang làm thủ tục sang tên |
| 📋 Chờ sổ | Đang chờ cấp sổ |
| ✅ Hoàn thành | Giao dịch hoàn tất |

**Người dùng có thể:**
- Xem chi tiết từng đơn tư vấn
- Xem BĐS liên quan

---

#### 📱 Màn 7 — Đăng Ký Bán BĐS / Ký Gửi (Cần đăng nhập)

Dành cho người có tài sản muốn nhờ sàn tìm người mua.

**Hiển thị:**
- Form điền thông tin tài sản cần bán:
  - Loại hình: 🏘️ Đất nền / Đất thổ cư | 🏠 Nhà riêng / Nhà phố | 🏢 Căn hộ chung cư | 🏡 Biệt thự / Nhà liền kề | 🏬 Nhà mặt phố / Mặt tiền | 🏭 Thương mại | 🌾 Đất nông nghiệp | 🏗️ Dự án BĐS
  - Diện tích, Giá mong muốn
  - Địa chỉ
  - Tình trạng pháp lý
  - Upload ảnh tài sản
  - Ghi chú thêm
  - SĐT liên hệ *

**Sau khi gửi:**
- Admin nhận yêu cầu ký gửi
- Admin phân công hoặc liên hệ lại với người bán

---

### 3.3 🏢 Company Portal (Dành cho Công ty BĐS)

**Mục đích:** Công cụ quản lý toàn diện cho Công ty BĐS — quản lý tài sản, đăng tin và xử lý đơn tư vấn.

**Đối tượng:** Nhân viên / Quản lý Công ty BĐS.

**Đăng nhập:** Username + Password (do Admin cấp).

**Truy cập:** Domain riêng do Admin cấp, ví dụ `congtyabc.bdshy.vn`.

**Công nghệ:** ReactJS + Vite + Tailwind CSS.

---

#### 🖥️ Màn 1 — Đăng Nhập

**Hiển thị:** Username, Password, Nút "Đăng nhập", Link "Quên mật khẩu"

**Lưu ý:**
- Lần đầu đăng nhập → bắt buộc **đổi mật khẩu** trước khi vào hệ thống
- Đăng nhập sai 5 lần → khoá tài khoản tạm thời

---

#### 🖥️ Màn 2 — Đổi Mật Khẩu Lần Đầu

Bắt buộc khi đăng nhập lần đầu với tài khoản do Admin cấp.

**Hiển thị:**
- Mật khẩu mới *
- Xác nhận mật khẩu mới *
- Nút "Cập nhật mật khẩu"

---

#### 🖥️ Màn 3 — Quên Mật Khẩu

**Hiển thị:**
- Bước 1: Nhập Username hoặc SĐT đăng ký
- Bước 2: Nhận mã OTP qua SMS → Nhập OTP xác nhận
- Bước 3: Nhập mật khẩu mới

---

#### 🖥️ Màn 4 — Dashboard Tổng Quan

**Hiển thị:**
- Lời chào: "Xin chào, [Tên Công ty]!"
- Thống kê nhanh:
  - Số tài sản đang quản lý
  - Số tin đang hiển thị trên sàn
  - Số đơn tư vấn mới (chưa xử lý)
  - Số đơn đang tư vấn dở
- Danh sách **đơn tư vấn mới nhất** cần xử lý ngay
- Danh sách **tin đăng sắp hết hạn**
- Biểu đồ đơn tư vấn theo tuần/tháng

**Người dùng có thể:**
- Bấm vào số liệu → chuyển màn tương ứng
- Bấm vào đơn → xem chi tiết đơn tư vấn
- Bấm "Tạo tin mới" → màn Quản lý tin đăng

---

#### 🖥️ Màn 5 — Quản Lý Tài Sản

**Mục đích:** Quản lý danh sách tài sản BĐS của công ty. Mỗi tin đăng sẽ liên kết với 1 tài sản, tránh đăng trùng lặp, dễ kiểm soát.

**Hiển thị:**
- Nút "Thêm tài sản mới"
- Danh sách tài sản: ảnh đại diện, loại hình, địa chỉ, giá, diện tích, số tin đăng đang chạy
- Tìm kiếm / Lọc theo loại hình, trạng thái

**Thông tin của 1 tài sản:**

| Nhóm | Trường thông tin |
|---|---|
| **Cơ bản** | Loại hình (🏘️ Đất nền / 🏠 Nhà riêng / 🏢 Căn hộ / 🏡 Biệt thự / 🏬 Nhà mặt phố / 🏭 Thương mại / 🌾 Đất nông nghiệp / 🏗️ Dự án BĐS), Diện tích (m²), Giá bán, SĐT người bán |
| **Pháp lý** | Sổ đỏ/Sổ hồng / Hợp đồng mua bán / Đang chờ sổ |
| **Vị trí** | Địa chỉ cũ, Địa chỉ mới (theo tỉnh thành gộp), Tỉnh/Quận/Phường |
| **Hình ảnh** | Upload nhiều ảnh, kéo thả sắp xếp, ảnh đầu = ảnh đại diện |
| **Đất nền / Đất thổ cư** | Loại đất, Quy hoạch, Vị trí lô, Mặt tiền (m), Đường vào (m) |
| **Nhà riêng / Nhà phố** | Số tầng, Diện tích sàn, Mặt tiền (m), Hẻm/Mặt phố, Đường vào (m) |
| **Căn hộ chung cư** | Tầng số, Tên tòa nhà / Dự án, View, Ban công, Nội thất, Số phòng ngủ, Số phòng tắm/WC |
| **Biệt thự / Nhà liền kề** | Diện tích đất, Diện tích xây dựng, Số tầng, Sân vườn, Nội thất |
| **Nhà mặt phố / Mặt tiền** | Số tầng, Diện tích sàn, Mặt tiền (m), Nội thất |
| **Thương mại** | Công năng (Văn phòng / Mặt bằng KD / Kho xưởng), Diện tích sàn, Vị trí tầng, Nội thất |
| **Đất nông nghiệp** | Loại đất, Quy hoạch, Diện tích |
| **Dự án BĐS** | Tên dự án, Block/Tầng/Căn, Tiến độ xây dựng |

**Người dùng có thể:**
- Thêm tài sản mới
- Chỉnh sửa thông tin tài sản
- Xoá tài sản (nếu không có tin đăng đang chạy)
- Bấm vào tài sản → xem danh sách tin đăng liên kết

---

#### 🖥️ Màn 6 — Quản Lý Tin Đăng

**Mục đích:** Quản lý các tin rao bán được đăng lên sàn. Mỗi tin liên kết với 1 tài sản.

**Hiển thị:**
- Nút "Tạo tin mới"
- Tabs: **Tất cả** | **Đang hiển thị** | **Chờ duyệt** | **Hết hạn** | **Bị từ chối**
- Mỗi tin: ảnh thu nhỏ, tiêu đề, tài sản liên kết, ngày hết hạn, trạng thái (badge màu), số lượt xem, số đơn tư vấn

**Thông tin của 1 tin đăng:**
- Tiêu đề tin đăng
- Mô tả (nội dung marketing)
- Tài sản liên kết (chọn từ danh sách tài sản đã có)
- Ngày hết hạn tin
- Trạng thái: Chờ duyệt / Đang hiển thị / Hết hạn / Bị từ chối

**Người dùng có thể:**
- Tạo tin mới → chọn tài sản → điền tiêu đề, mô tả, ngày hết hạn → gửi duyệt
- Chỉnh sửa tin → gửi lại duyệt
- Gia hạn tin đăng sắp hết hạn
- Xoá tin
- Xem số liệu: lượt xem, số đơn tư vấn của từng tin

---

#### 🖥️ Màn 7 — Quản Lý Đơn Tư Vấn

**Mục đích:** Xem và cập nhật trạng thái tất cả đơn tư vấn mà khách hàng để lại cho các tin đăng của công ty.

**Hiển thị:**
- Bộ lọc: Theo tin đăng / Theo trạng thái / Theo thời gian
- Mỗi đơn tư vấn hiển thị:
  - Tên khách hàng, SĐT
  - Tin đăng / Tài sản quan tâm
  - Ghi chú của khách
  - Thời gian gửi
  - Trạng thái hiện tại (badge màu theo trạng thái)

**Vòng đời đơn tư vấn:**
```
⏳ Chờ tư vấn → 📞 Đang tư vấn → 🏠 Hẹn xem đất → 📝 Đang tên chuyển nhượng → 📋 Chờ sổ → ✅ Hoàn thành
```

**Người dùng có thể:**
- Bấm SĐT → gọi điện trực tiếp (trên mobile)
- Cập nhật trạng thái đơn → chọn trạng thái mới từ dropdown
- Thêm ghi chú nội bộ vào đơn
- Lọc đơn theo trạng thái / tin đăng

---

#### 🖥️ Màn 8 — Hồ Sơ Công Ty

**Hiển thị:** Logo, Tên công ty, SĐT, Địa chỉ, Domain được cấp

**Người dùng có thể:**
- Cập nhật logo, thông tin liên hệ
- Đổi mật khẩu
- Đăng xuất

---

### 3.4 ⚙️ Admin System (Dành cho Quản trị viên)

**Mục đích:** Vận hành toàn bộ nền tảng — quản lý công ty, duyệt tin, theo dõi đơn tư vấn và báo cáo.

**Đối tượng:** Admin, Super Admin.

**Công nghệ:** ReactJS + Vite + Ant Design.

---

#### 🖥️ Màn 1 — Dashboard Thống Kê

**Hiển thị:**
- Tổng số: Công ty đang hoạt động / Tin đang hiển thị / Đơn tư vấn hôm nay / Đơn chờ xử lý
- Biểu đồ: Tin đăng mới, Đơn tư vấn theo ngày/tuần/tháng
- Danh sách tin đăng chờ duyệt mới nhất
- Danh sách đơn tư vấn quá hạn chưa được cập nhật

---

#### 🖥️ Màn 2 — Quản Lý Công Ty BĐS

**Hiển thị:** Danh sách công ty, domain được cấp, trạng thái, ngày tạo, số tin đăng, số đơn tư vấn

**Admin có thể:**
- **Tạo tài khoản mới** cho Công ty BĐS: nhập thông tin công ty, cấp username/password tạm thời, cấp domain riêng (vd: `congtyabc.bdshy.vn`)
- Chỉnh sửa thông tin công ty
- Khoá / Mở khoá tài khoản
- Xoá công ty
- Xem chi tiết: thông tin + danh sách tài sản + tin đăng + đơn tư vấn

---

#### 🖥️ Màn 3 — Quản Lý Thành Viên (Người mua / Người bán cá nhân)

**Hiển thị:** Danh sách tài khoản người dùng, SĐT, ngày đăng ký, số đơn tư vấn, số yêu cầu ký gửi

**Admin có thể:**
- Xem chi tiết tài khoản
- Khoá / Mở khoá tài khoản
- Xem lịch sử đơn tư vấn của thành viên

---

#### 🖥️ Màn 4 — Quản Lý Tin Đăng

**Hiển thị:**
- Tabs: **Chờ duyệt** | **Đang hiển thị** | **Hết hạn** | **Bị từ chối**
- Xem đầy đủ nội dung tin đăng

**Admin có thể:**
- Duyệt ✅ → tin hiển thị lên sàn → thông báo cho công ty
- Từ chối ❌ → nhập lý do → gửi thông báo cho công ty
- Xoá tin vi phạm nội dung

---

#### 🖥️ Màn 5 — Quản Lý Đơn Tư Vấn (Toàn hệ thống)

**Mục đích:** Theo dõi toàn bộ đơn tư vấn, đảm bảo không có đơn nào bị bỏ sót.

**Hiển thị:**
- Danh sách tất cả đơn tư vấn, lọc theo công ty / trạng thái / thời gian
- Highlight các đơn **quá hạn chưa cập nhật** (vd: Chờ tư vấn quá 24h)

**Admin có thể:**
- Xem chi tiết từng đơn
- Xuất danh sách đơn (Excel/CSV)
- **Gửi nhắc nhở** thủ công đến Công ty BĐS cho đơn bị bỏ quên

**Job tự động (background job):**
- Đơn "Chờ tư vấn" quá 24h → tự động gửi thông báo nhắc nhở Công ty BĐS
- Đơn "Đang tư vấn" quá 72h không cập nhật → gửi cảnh báo

---

#### 🖥️ Màn 6 — Thống Kê & Báo Cáo

**Hiển thị:**
- Báo cáo theo khoảng thời gian tùy chọn
- Thống kê tin đăng: tổng tin, tin mới, tin hết hạn, tin bị từ chối
- Thống kê đơn tư vấn: tổng đơn, đơn hoàn thành, tỷ lệ chuyển đổi theo công ty
- Thống kê người dùng: người dùng mới, người dùng hoạt động

**Admin có thể:**
- Lọc báo cáo theo thời gian / công ty
- Xuất báo cáo Excel/PDF

---

#### 🖥️ Màn 7 — Góp Ý, Đánh Giá, Phản Hồi

**Hiển thị:** Danh sách góp ý / phản hồi từ người dùng (người mua / người bán)

**Admin có thể:**
- Xem chi tiết từng phản hồi
- Đánh dấu đã xử lý
- Phản hồi lại người dùng

---

#### 🖥️ Màn 8 — Quản Lý Media

**Hiển thị:**
- Tab 1 **Ảnh tin đăng:** Toàn bộ ảnh của các tin đăng trong hệ thống, lọc theo công ty / tin đăng
- Tab 2 **Banner & Marketing:** Ảnh/banner hiển thị trên trang chủ Web App và Landing Page

**Admin có thể:**
- Xem, tải về, xoá ảnh tin đăng vi phạm
- Upload, sắp xếp, bật/tắt banner marketing
- Cài đặt thứ tự hiển thị banner

---

#### 🖥️ Màn 9 — Cài Đặt Hệ Thống (Super Admin)

**Admin có thể:**
- Quản lý danh mục loại hình BĐS: 🏘️ Đất nền / Đất thổ cư | 🏠 Nhà riêng / Nhà phố | 🏢 Căn hộ chung cư | 🏡 Biệt thự / Nhà liền kề | 🏬 Nhà mặt phố / Mặt tiền | 🏭 Thương mại (Văn phòng / Mặt bằng KD / Kho xưởng) | 🌾 Đất nông nghiệp | 🏗️ Dự án BĐS
- Quản lý danh mục Tỉnh/Thành phố, Tình trạng pháp lý
- Cài đặt thời gian job tự động nhắc nhở
- Quản lý email template
- Quản lý tài khoản Admin (tạo, khoá, xoá) — chỉ Super Admin

---

## 4. LUỒNG NGHIỆP VỤ CHÍNH

### Luồng 1 — Công ty BĐS được onboard và đăng tin
```
[Công ty] Liên hệ qua Landing Page
[Admin]   Tạo tài khoản, cấp domain riêng (congtyabc.bdshy.vn)
          Gửi thông tin đăng nhập cho Công ty
[Công ty] Truy cập congtyabc.bdshy.vn → Đăng nhập
          → Đổi mật khẩu lần đầu
          → Thêm tài sản vào hệ thống
          → Tạo tin đăng → Chọn tài sản → Điền tiêu đề, mô tả → Gửi duyệt
[Admin]   Duyệt tin → Tin hiển thị lên sàn app.bdshy.vn
```

### Luồng 2 — Khách xem tin BĐS từ Landing Page
```
[Khách]     Truy cập bdshy.vn (Landing Page)
            → Bấm nút "Xem tin bán đất ngay"
            → Chuyển tới app.bdshy.vn (Web App)
            → Xem danh sách / Tìm kiếm / Lọc (không cần đăng nhập)
            → Xem Chi tiết BĐS
            → (Nếu muốn tư vấn) Đăng nhập bằng SĐT + OTP → Gửi yêu cầu tư vấn
```

### Luồng 3 — Người mua tìm kiếm và gửi yêu cầu tư vấn
```
[Người mua] Vào app.bdshy.vn hoặc Mobile App
            → Xem danh sách / Tìm kiếm / Lọc
            → Xem Chi tiết BĐS
            → Bấm "GỬI YÊU CẦU TƯ VẤN"
            → Đăng nhập bằng SĐT + OTP (nếu chưa đăng nhập)
            → Điền tên, ghi chú → Gửi
[Hệ thống]  Tạo đơn tư vấn (trạng thái: Chờ tư vấn)
            → Thông báo realtime đến Công ty BĐS
[Công ty]   Nhận thông báo → Vào màn Đơn tư vấn
            → Gọi điện cho khách → Cập nhật trạng thái "Đang tư vấn"
            → Hẹn xem đất → Cập nhật "Hẹn xem đất"
            → ... → Cập nhật "Hoàn thành"
[Người mua] Xem lịch sử tư vấn → Theo dõi trạng thái đơn
```

### Luồng 4 — Admin nhắc nhở đơn tư vấn bị bỏ quên
```
[Hệ thống]  Job tự động chạy mỗi giờ
            → Phát hiện đơn "Chờ tư vấn" quá 24h chưa cập nhật
            → Tự động gửi thông báo nhắc nhở đến Công ty BĐS
[Admin]     Vào màn Đơn tư vấn
            → Xem danh sách đơn quá hạn
            → Gửi nhắc nhở thủ công nếu cần
```

### Luồng 5 — Người bán cá nhân đăng ký ký gửi
```
[Người bán] Đăng nhập bằng SĐT + OTP
            → Vào màn "Đăng ký bán BĐS"
            → Điền thông tin tài sản + ảnh + SĐT liên hệ → Gửi
[Admin]     Nhận yêu cầu ký gửi
            → Liên hệ người bán để xác nhận thông tin
            → Phân công hoặc tự xử lý
```

---

## 5. TỔNG HỢP CHỨC NĂNG THEO VAI TRÒ

### 👤 Người mua / Người bán cá nhân

| # | Chức năng | Cần đăng nhập |
|---|---|---|
| 1 | Xem danh sách BĐS trên trang chủ | ❌ |
| 2 | Tìm kiếm theo từ khoá | ❌ |
| 3 | Lọc theo loại hình BĐS (Đất nền / Nhà riêng / Căn hộ / Biệt thự / Nhà mặt phố / Thương mại / Đất nông nghiệp / Dự án BĐS), tỉnh/thành, giá, diện tích, pháp lý | ❌ |
| 4 | Chuyển đổi xem dạng Danh sách / Bản đồ | ❌ |
| 5 | Xem chi tiết BĐS (ảnh, thông tin đầy đủ, bản đồ) | ❌ |
| 6 | Chia sẻ link tin đăng | ❌ |
| 7 | Đăng nhập bằng SĐT + OTP | ❌ |
| 8 | Gửi yêu cầu tư vấn | ✅ |
| 9 | Xem lịch sử tư vấn và trạng thái đơn | ✅ |
| 10 | Đăng ký bán BĐS / Ký gửi tài sản | ✅ |

### 🏢 Công ty BĐS (Nhân viên)

| # | Chức năng |
|---|---|
| 1 | Đăng nhập bằng Username + Password |
| 2 | Đổi mật khẩu lần đầu (bắt buộc) |
| 3 | Quên mật khẩu / Đặt lại mật khẩu |
| 4 | Xem Dashboard tổng quan |
| 5 | Thêm / Sửa / Xoá tài sản |
| 6 | Quản lý ảnh tài sản |
| 7 | Tạo tin đăng liên kết với tài sản |
| 8 | Chỉnh sửa / Xoá / Gia hạn tin đăng |
| 9 | Xem danh sách đơn tư vấn |
| 10 | Lọc đơn theo tin đăng / trạng thái |
| 11 | Cập nhật trạng thái đơn tư vấn |
| 12 | Thêm ghi chú nội bộ vào đơn |
| 13 | Nhận thông báo realtime khi có đơn mới |
| 14 | Cập nhật hồ sơ công ty |

### 🔑 Admin

| # | Chức năng |
|---|---|
| 1 | Tạo tài khoản Công ty BĐS + cấp domain riêng |
| 2 | Sửa / Khoá / Xoá tài khoản Công ty BĐS |
| 3 | Quản lý tài khoản thành viên (người mua/bán) |
| 4 | Duyệt / Từ chối / Xoá tin đăng |
| 5 | Xem toàn bộ đơn tư vấn hệ thống |
| 6 | Gửi nhắc nhở thủ công cho đơn bị bỏ quên |
| 7 | Xem thống kê & báo cáo toàn hệ thống |
| 8 | Xuất báo cáo Excel/PDF |
| 9 | Quản lý góp ý / phản hồi người dùng |
| 10 | Quản lý media (ảnh tin đăng + banner marketing) |
| 11 | Quản lý danh mục hệ thống |
| 12 | Quản lý email template |

### 🦸 Super Admin

| # | Chức năng |
|---|---|
| 1 | Tất cả quyền của Admin |
| 2 | Tạo / Khoá / Xoá tài khoản Admin |
| 3 | Cài đặt thời gian job tự động nhắc nhở |
| 4 | Toàn quyền cài đặt hệ thống |

---

## 6. DANH SÁCH MÀN HÌNH (Dành cho Designer)

### 🏠 Web App + Mobile App (Người mua / Người bán)

| # | Tên màn | Mô tả ngắn |
|---|---|---|
| M01 | Trang Chủ | Danh sách tin đăng + bộ lọc nhanh + logo + slogan |
| M02 | Tìm Kiếm & Lọc | Lọc nâng cao + xem List/Map |
| M03 | Chi Tiết BĐS | Thông tin đầy đủ + nút Gửi yêu cầu |
| M04 | Đăng Nhập (SĐT + OTP) | Nhập SĐT → nhận OTP → xác nhận |
| M05 | Form Gửi Yêu Cầu Tư Vấn | Bottom sheet / popup |
| M06 | Lịch Sử Tư Vấn | Danh sách đơn + trạng thái |
| M07 | Đăng Ký Bán / Ký Gửi BĐS | Form điền thông tin tài sản muốn bán |

### 🏢 Company Portal (Công ty BĐS)

| # | Tên màn | Mô tả ngắn |
|---|---|---|
| C01 | Đăng Nhập | Username + Password |
| C02 | Đổi Mật Khẩu Lần Đầu | Bắt buộc khi đăng nhập lần đầu |
| C03 | Quên Mật Khẩu | Reset qua SMS OTP |
| C04 | Dashboard Tổng Quan | Thống kê + đơn mới + tin hết hạn |
| C05 | Quản Lý Tài Sản | Danh sách + thêm/sửa/xoá tài sản |
| C06 | Chi Tiết / Tạo / Sửa Tài Sản | Form nhập đầy đủ thông tin tài sản |
| C07 | Quản Lý Tin Đăng | Danh sách tin theo trạng thái |
| C08 | Tạo / Sửa Tin Đăng | Chọn tài sản + tiêu đề, mô tả + hạn |
| C09 | Quản Lý Đơn Tư Vấn | Danh sách đơn + cập nhật trạng thái |
| C10 | Chi Tiết Đơn Tư Vấn | Thông tin khách + timeline trạng thái |
| C11 | Hồ Sơ Công Ty | Thông tin + đổi mật khẩu |

### ⚙️ Admin System

| # | Tên màn | Mô tả ngắn |
|---|---|---|
| A01 | Đăng Nhập Admin | Username + Password |
| A02 | Dashboard Thống Kê | Tổng quan toàn hệ thống |
| A03 | Quản Lý Công Ty BĐS | List + tạo + sửa + khoá + cấp domain |
| A04 | Chi Tiết Công Ty | Thông tin + tài sản + tin + đơn của công ty |
| A05 | Quản Lý Thành Viên | List người dùng + khoá/mở |
| A06 | Quản Lý Tin Đăng | Duyệt / Từ chối / Xoá |
| A07 | Quản Lý Đơn Tư Vấn | Toàn bộ đơn + đơn quá hạn + nhắc nhở |
| A08 | Thống Kê & Báo Cáo | Biểu đồ + xuất Excel/PDF |
| A09 | Góp Ý & Phản Hồi | Danh sách + xử lý |
| A10 | Quản Lý Media | Ảnh tin đăng + banner marketing |
| A11 | Cài Đặt Hệ Thống | Danh mục + email template + job config |

---

## 7. THÔNG TIN KỸ THUẬT

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
| OTP | Twilio / ESMS (SMS OTP) |
| Upload ảnh | Cloudinary |
| Bản đồ | Google Maps API |
| Gửi Email | Nodemailer |
| Thông báo Realtime | Socket.io |
| Background Job | Node-cron |
| Quản lý State | Zustand |

### Domain

| Hệ thống | Domain |
|---|---|
| Landing Page | bdshy.vn |
| Web App (Người mua) | app.bdshy.vn |
| Company Portal | [tencongty].bdshy.vn (cấp riêng cho từng công ty) |
| Admin System | admin.bdshy.vn |
| Backend API | api.bdshy.vn |

### Cấu trúc thư mục (Monorepo)
```
bds-nen-platform/
├── web-app/           # React - Người mua/bán
├── mobile-app/        # React Native - Người mua/bán
├── company-portal/    # React - Công ty BĐS
├── admin/             # React - Quản trị
├── backend/           # Node.js + Express
└── docs/              # Tài liệu hệ thống
```

---

## 8. LỘ TRÌNH PHÁT TRIỂN

### Phase 1 — Nền tảng cốt lõi (Hiện tại)
- ✅ Web App + Mobile App người mua/bán
- ✅ Company Portal cho Công ty BĐS
- ✅ Admin System vận hành

### Phase 2 — Mở rộng (3-6 tháng tới)

#### 🏗️ Mở rộng loại hình BĐS
- ✅ Đã có: Đất nền, Nhà riêng, Căn hộ chung cư
- 🔜 Biệt thự / Nhà liền kề
- 🔜 Nhà mặt phố / Mặt tiền
- 🔜 Bất động sản thương mại (Văn phòng, Mặt bằng KD, Kho xưởng)
- 🔜 Đất nông nghiệp / Trang trại
- 🔜 Dự án BĐS (theo dự án, từng block/tầng/căn)

#### 👥 Nâng cấp người dùng
- 🔜 Module đội sales nội bộ — tư vấn và chăm sóc khách hàng trực tiếp
- 🔜 Hệ thống đánh giá / review Công ty BĐS từ người dùng
- 🔜 Yêu thích / Lưu tin đăng để xem lại sau
- 🔜 So sánh BĐS (so sánh 2-3 tin cùng lúc)
- 🔜 Thông báo push khi có tin đăng mới phù hợp với bộ lọc đã lưu

#### 🏢 Nâng cấp Company Portal
- 🔜 Quản lý nhiều chi nhánh / nhân viên sale trong cùng 1 tài khoản
- 🔜 Phân công đơn tư vấn cho từng nhân viên
- 🔜 Báo cáo hiệu quả từng nhân viên sale
- 🔜 CRM nội bộ: quản lý lịch sử tương tác với từng khách hàng

#### 📊 Nâng cấp Admin & Báo cáo
- 🔜 Báo cáo nâng cao: tỷ lệ chuyển đổi theo loại hình BĐS, theo khu vực
- 🔜 Heatmap thị trường BĐS theo địa bàn
- 🔜 Tích hợp Google Analytics / tracking hành vi người dùng
- 🔜 Module nhận ký gửi từ chủ đất cá nhân (quy trình đầy đủ)

#### 💳 Thanh toán & Gói dịch vụ
- 🔜 Hệ thống gói dịch vụ trả phí cho Công ty BĐS (Cơ bản / Chuyên nghiệp / Doanh nghiệp)
- 🔜 Tin đăng nổi bật / ưu tiên hiển thị
- 🔜 Tích hợp cổng thanh toán (VNPay / MoMo / Chuyển khoản)

---

*© 2026 Sàn Bất Động Sản Hưng Yên — "Uy tín – An tâm – Mua nhanh – Bán lẹ"*
*Tài liệu được quản lý tại: https://github.com/20111427nguyenvanduc/ducbeo*