# 🏡 SÀN BẤT ĐỘNG SẢN HƯNG YÊN
## *"Uy tín – An tâm – Mua nhanh – Bán lẹ"*

> **Phiên bản:** 2.0.0
> **Cập nhật:** 03/2026

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Giới thiệu

**Sàn Bất Động Sản Hưng Yên** là nền tảng trung gian kết nối **Công ty Bất Động Sản** với **Người có nhu cầu mua / bán BĐS** tại Hưng Yên và các khu vực lân cận.

> 💬 **Slogan:** *Uy tín – An tâm – Mua nhanh – Bán lẹ*

### 1.2 Mục tiêu

- Cung cấp **công cụ quản lý chuyên nghiệp** cho Công ty BĐS.
- Giúp **Người mua** dễ dàng tìm kiếm BĐS phù hợp và gửi yêu cầu tư vấn.
- Cho phép **Người bán cá nhân** đăng ký ký gửi tài sản lên sàn.
- Cung cấp **hệ thống quản trị** vận hành toàn bộ nền tảng.

### 1.3 Điểm khác biệt

- Mỗi Công ty BĐS có **domain riêng** (vd: `congtyabc.bdshy.vn`).
- Hệ thống tách biệt **Tài sản** và **Tin đăng**.
- **Đơn tư vấn** có vòng đời đầy đủ, theo dõi realtime.
- Admin có **job tự động** nhắc nhở Công ty BĐS.

### 1.4 Sơ đồ tổng thể

```
┌───────────────┐  ┌──────────────────┐  ┌──────────────────────┐  ┌────────────────┐
│  Landing Page │──▶  Web + Mobile    │  │  Company Portal      │  │  Admin System  │
│  bdshy.vn     │  │  App             │  │  congtyabc.bdshy.vn  │  │  admin.bdshy   │
│  [CTA→App]    │  │  app.bdshy.vn    │  │  congtyxyz.bdshy.vn  │  │                │
└──────┬────────┘  └───────┬──────────┘  └──────────┬───────────┘  └───────┬────────┘
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
| 1 | 👤 **Người mua / Người bán cá nhân** | Tìm BĐS, gửi yêu cầu tư vấn, xem lịch sử, đăng ký ký gửi | SĐT + OTP | Web + App |
| 2 | 🏢 **Nhân viên Công ty BĐS** | Quản lý tài sản, đăng tin, xử lý đơn tư vấn | Username + Password | Web |
| 3 | 🔑 **Admin** | Vận hành hệ thống, duyệt tin, quản lý công ty | Username + Password | Web |
| 4 | 🦸 **Super Admin** | Toàn quyền hệ thống, quản lý Admin, cài đặt | Username + Password | Web |

---

## 3. CÁC SẢN PHẨM TRONG HỆ THỐNG

---

### 3.1 🌐 Landing Page (WordPress)

**Mục đích:** Giới thiệu nền tảng, thu hút Công ty BĐS liên hệ sử dụng dịch vụ.

| Section | Nội dung |
|---|---|
| Hero | **"Uy tín – An tâm – Mua nhanh – Bán lẹ"** + CTA "Liên hệ tư vấn" + CTA **"Xem tin bán đất"** → `app.bdshy.vn` |
| Tính năng | Giới thiệu tính năng nổi bật |
| Cách hoạt động | 3 bước: Đăng ký → Đăng tin → Nhận khách |
| Bảng giá | Các gói dịch vụ |
| Liên hệ | Form liên hệ để Admin tạo tài khoản |
| Blog | Bài viết thị trường BĐS Hưng Yên (SEO) |
| **Xem Tin BĐS** | Nút **"Xem tin bán đất ngay"** → `app.bdshy.vn` (không cần đăng nhập) |

> **Lưu ý:** Công ty BĐS **không tự đăng ký** — phải liên hệ để Admin tạo tài khoản và cấp domain riêng.

---

### 3.2 🏠 Web App + Mobile App (Dành cho Người mua / Người bán cá nhân)

**Đăng nhập:** Số điện thoại + OTP (không cần tài khoản để xem danh sách).

**Công nghệ:** ReactJS (Web) + React Native Expo (Mobile App).

---

#### 📱 Màn 1 — Trang Chủ (Không cần đăng nhập)

**Hiển thị:**
- Header: Logo + Slogan + Thanh tìm kiếm + Nút "Đăng nhập"
- Bộ lọc nhanh: Loại hình (Đất nền / Nhà riêng / Căn hộ / Biệt thự / Nhà mặt phố / Văn phòng / Mặt bằng KD / Kho-Xưởng / Đất nông nghiệp / Dự án BĐS), Loại giao dịch (Bán / Cho thuê), Tỉnh/Thành, Khoảng giá, Diện tích
- Danh sách tin đăng dạng thẻ: ảnh đại diện, tiêu đề, giá, diện tích, vị trí, loại hình
- Phân trang / Infinite scroll
- Footer

---

#### 📱 Màn 2 — Tìm Kiếm & Lọc Nâng Cao

**Bộ lọc nâng cao:**
- Loại hình BĐS (multi-select, 10 loại)
- Loại giao dịch: Bán / Cho thuê
- Tỉnh / Quận / Phường
- Khoảng giá (từ - đến)
- Diện tích (từ - đến)
- Pháp lý: Sổ đỏ / Sổ hồng / Hợp đồng / Đang chờ sổ
- Số phòng ngủ: 1PN / 2PN / 3PN / 4PN+ (cho Nhà, Căn hộ, Biệt thự)
- Hướng nhà/ban công
- Nội thất: Đầy đủ / Cơ bản / Không nội thất
- Kết quả dạng **Danh sách** hoặc **Bản đồ**
- Sắp xếp: Mới nhất / Giá tăng / Giá giảm / Diện tích

---

#### 📱 Màn 3 — Chi Tiết BĐS (Không cần đăng nhập)

**Hiển thị:**
- Carousel ảnh (vuốt / bấm xem fullscreen)
- Tiêu đề, Giá bán/thuê, Giá/m², Diện tích, Loại hình, Pháp lý
- Địa chỉ + Bản đồ Google Maps
- Thông tin Công ty đăng: Logo, tên, SĐT
- Nút **"GỬI YÊU CẦU TƯ VẤN"** (sticky bottom)
- Nút Chia sẻ

**Thông tin chi tiết theo từng loại hình BĐS:**

| Loại hình | Trường thông tin đặc trưng |
|---|---|
| 🏘️ Đất nền / Đất thổ cư | Loại đất (Thổ cư / Nông nghiệp / Công nghiệp), Quy hoạch, Vị trí lô, Hướng, Mặt tiền (m), Đường vào (m) |
| 🏠 Nhà riêng / Nhà phố | Số tầng, DT sàn (m²), Số PN, Số WC, Mặt tiền (m), Đường vào (m), Hướng nhà, Nội thất |
| 🏢 Căn hộ chung cư | Tầng số, Tòa nhà, Số PN, Số WC, Hướng ban công, View, Nội thất, Tên dự án/chung cư |
| 🏡 Biệt thự / Nhà liền kề | DT đất (m²), DT xây dựng (m²), Số tầng, Số PN, Sân vườn (Có/Không), Hồ bơi (Có/Không), Hướng |
| 🏬 Nhà mặt phố / Mặt tiền | Số tầng, DT sàn (m²), Mặt tiền (m), Vỉa hè (m), Hướng, Phù hợp KD (Có/Không) |
| 🏢 Văn phòng | DT sàn (m²), Tầng số, Tòa nhà, Nội thất, ĐH trung tâm (Có/Không), Thang máy (Có/Không) |
| 🏪 Mặt bằng kinh doanh | DT sàn (m²), Chiều ngang (m), Chiều dài (m), Mặt tiền (m), Tầng số, Vị trí (góc/giữa dãy) |
| 🏭 Kho / Xưởng | DT kho (m²), Chiều cao kho (m), Tải trọng sàn (tấn/m²), Cửa xe tải (Có/Không), Điện 3 pha (Có/Không) |
| 🌾 Đất nông nghiệp | Loại đất, DT (m² hoặc ha), Nguồn nước (Có/Không), Hiện trạng |
| 🏗️ Dự án BĐS | Tên dự án, Chủ đầu tư, Tiến độ, Loại căn, Tầng, Block |

---

#### 📱 Màn 4 — Đăng Nhập (SĐT + OTP)

- Nhập SĐT → Bấm "Gửi OTP" → Nhập mã OTP (6 số) → Bấm "Xác nhận"
- Nếu số chưa có tài khoản → tự động tạo mới
- Bấm "Gửi lại OTP" (sau 60 giây)

---

#### 📱 Màn 5 — Form Gửi Yêu Cầu Tư Vấn (Bottom Sheet)

- Tên *, SĐT * (tự điền), Ghi chú
- Sau khi gửi → tạo đơn tư vấn trạng thái **"Chờ tư vấn"** + thông báo realtime cho Công ty BĐS

---

#### 📱 Màn 6 — Lịch Sử Tư Vấn (Cần đăng nhập)

**Trạng thái đơn tư vấn:**

| Trạng thái | Ý nghĩa |
|---|---|
| ⏳ Chờ tư vấn | Vừa gửi, chưa có phản hồi |
| 📞 Đang tư vấn | Công ty đang liên hệ |
| 🏠 Hẹn xem đất | Đã hẹn lịch đi xem thực tế |
| 📝 Đang chuyển nhượng | Đang làm thủ tục sang tên |
| 📋 Chờ sổ | Đang chờ cấp sổ |
| ✅ Hoàn thành | Giao dịch hoàn tất |

---

#### 📱 Màn 7 — Đăng Ký Bán BĐS / Ký Gửi (Cần đăng nhập)

**Form:**
- Loại hình: dropdown 10 loại + Loại giao dịch: Bán / Cho thuê
- Diện tích (m²), Giá mong muốn
- Địa chỉ đầy đủ (Tỉnh/Quận/Phường + chi tiết)
- Tình trạng pháp lý
- Upload ảnh tài sản (tối đa 10 ảnh)
- Mô tả thêm, SĐT liên hệ *
- *Sau khi chọn loại hình → hiện thêm các trường đặc trưng tương ứng*

---

#### 📱 Màn 8 — Thông Tin Cá Nhân (Cần đăng nhập)

**Hiển thị:**
- Avatar / Ảnh đại diện (bấm để upload/thay đổi)
- Họ và tên
- Số điện thoại (SĐT đăng nhập — chỉ đọc)
- Email (tùy chọn)
- Ngày sinh (tùy chọn)
- Giới tính: Nam / Nữ / Khác (tùy chọn)
- Địa chỉ thường trú (tùy chọn)
- Nút "Cập nhật thông tin"
- Nút "Đăng xuất"

**Người dùng có thể:**
- Upload/thay đổi ảnh đại diện
- Chỉnh sửa họ tên, email, ngày sinh, giới tính, địa chỉ
- Lưu thông tin → hệ thống tự điền vào form tư vấn khi cần
- Đăng xuất khỏi tài khoản

---

### 3.3 🏢 Company Portal (Dành cho Công ty BĐS)

**Đăng nhập:** Username + Password (do Admin cấp). Không cần OTP khi đăng nhập thông thường — OTP chỉ dùng khi **quên mật khẩu**.

**Truy cập:** `congtyabc.bdshy.vn` | **Công nghệ:** ReactJS + Vite + Tailwind CSS.

---

#### 🖥️ Màn 1 — Đăng Nhập

- Username, Password, Nút "Đăng nhập", Link "Quên mật khẩu"
- Lần đầu đăng nhập → bắt buộc **đổi mật khẩu**
- Đăng nhập sai 5 lần → khoá tài khoản tạm thời

#### 🖥️ Màn 2 — Đổi Mật Khẩu Lần Đầu

- Bắt buộc khi đăng nhập lần đầu với tài khoản do Admin cấp
- Nhập mật khẩu mới + xác nhận → Cập nhật

#### 🖥️ Màn 3 — Quên Mật Khẩu (OTP qua SĐT)

- Nhập Username hoặc Email → Hệ thống gửi OTP SMS về SĐT đăng ký
- Nhập OTP → Nhập mật khẩu mới

#### 🖥️ Màn 4 — Dashboard Tổng Quan

- Thống kê nhanh: tài sản, tin đăng, đơn tư vấn mới, đơn đang xử lý
- Danh sách đơn tư vấn mới nhất + tin đăng sắp hết hạn
- Biểu đồ đơn tư vấn theo tuần/tháng

#### 🖥️ Màn 5 — Quản Lý Tài Sản

**Thông tin của 1 tài sản (dynamic theo loại hình):**

| Nhóm | Trường thông tin |
|---|---|
| **Cơ bản** | Loại hình BĐS (10 loại), Loại giao dịch (Bán/Cho thuê), Giá (VNĐ), Diện tích (m²), SĐT người bán/chủ |
| **Pháp lý** | Sổ đỏ / Sổ hồng / Hợp đồng mua bán / Đang chờ sổ |
| **Vị trí** | Tỉnh/Quận/Phường, Địa chỉ chi tiết, Tọa độ GPS (tự động hoặc chọn trên bản đồ) |
| **Hình ảnh** | Upload tối đa 20 ảnh, kéo thả sắp xếp, ảnh đầu = đại diện, hỗ trợ video |
| **Đất nền** | *(Hiện khi chọn = Đất nền)* Loại đất, Quy hoạch, Vị trí lô, Hướng, Mặt tiền, Đường vào |
| **Nhà riêng/Nhà phố** | *(Hiện khi chọn = Nhà riêng)* Số tầng, DT sàn, Số PN, Số WC, Mặt tiền, Đường vào, Hướng, Nội thất |
| **Căn hộ** | *(Hiện khi chọn = Căn hộ)* Tên dự án/CCC, Tòa, Tầng, Số PN, Số WC, Hướng ban công, View, Nội thất |
| **Biệt thự/Liền kề** | *(Hiện khi chọn = Biệt thự)* DT đất, DT XD, Số tầng, Số PN, Sân vườn, Hồ bơi, Hướng |
| **Nhà mặt phố** | *(Hiện khi chọn = Mặt phố)* Số tầng, DT sàn, Mặt tiền, Vỉa hè, Hướng, Phù hợp KD |
| **Thương mại (VP/Mặt bằng/Kho)** | *(Hiện khi chọn loại tương ứng)* Các trường đặc trưng theo loại |
| **Đất nông nghiệp** | *(Hiện khi chọn = Đất NN)* Loại đất, DT (m²/ha), Nguồn nước, Hiện trạng |

#### 🖥️ Màn 6 — Quản Lý Tin Đăng

- Tabs: Tất cả | Đang hiển thị | Chờ duyệt | Hết hạn | Bị từ chối
- Tạo tin → chọn tài sản → điền tiêu đề, mô tả, ngày hết hạn → gửi duyệt
- Gia hạn, Chỉnh sửa, Xoá tin

#### 🖥️ Màn 7 — Quản Lý Đơn Tư Vấn

**Vòng đời:** ⏳ Chờ tư vấn → 📞 Đang tư vấn → 🏠 Hẹn xem đất → 📝 Đang chuyển nhượng → 📋 Chờ sổ → ✅ Hoàn thành

#### 🖥️ Màn 8 — Hồ Sơ Công Ty

- Logo, Tên công ty, SĐT, Địa chỉ, Domain được cấp
- Cập nhật thông tin, Đổi mật khẩu, Đăng xuất

---

### 3.4 ⚙️ Admin System (Dành cho Quản trị viên)

**Công nghệ:** ReactJS + Vite + Ant Design.

#### 🖥️ Màn 1 — Dashboard Thống Kê

- Tổng số: Công ty hoạt động / Tin đang hiển thị / Đơn hôm nay / Đơn chờ xử lý
- Biểu đồ theo ngày/tuần/tháng

#### 🖥️ Màn 2 — Quản Lý Công Ty BĐS

- Tạo tài khoản + cấp domain riêng (vd: `congtyabc.bdshy.vn`)
- Chỉnh sửa, Khoá/Mở khoá, Xoá

#### 🖥️ Màn 3 — Quản Lý Thành Viên

- Danh sách người dùng, Khoá/Mở khoá, Xem lịch sử

#### 🖥️ Màn 4 — Quản Lý Tin Đăng

- Duyệt ✅ / Từ chối ❌ (nhập lý do) / Xoá

#### 🖥️ Màn 5 — Quản Lý Đơn Tư Vấn (Toàn hệ thống)

- Highlight đơn quá hạn chưa cập nhật (Chờ tư vấn quá 24h)
- Job tự động: đơn "Chờ tư vấn" quá 24h → gửi nhắc nhở; đơn "Đang tư vấn" quá 72h → gửi cảnh báo

#### 🖥️ Màn 6 — Thống Kê & Báo Cáo

- Xuất Excel/PDF, lọc theo thời gian/công ty

#### 🖥️ Màn 7 — Góp Ý & Phản Hồi

- Xem, đánh dấu đã xử lý, phản hồi người dùng

#### 🖥️ Màn 8 — Quản Lý Media

- Tab 1: Ảnh tin đăng (xem, tải, xoá vi phạm)
- Tab 2: Banner & Marketing (upload, sắp xếp, bật/tắt)

#### 🖥️ Màn 9 — Cài Đặt Hệ Thống (Super Admin)

- Quản lý **Loại hình BĐS**: Đất nền, Nhà riêng, Căn hộ, Biệt thự/Liền kề, Nhà mặt phố, Văn phòng, Mặt bằng KD, Kho/Xưởng, Đất nông nghiệp, Dự án BĐS (thêm/sửa/ẩn)
- Quản lý **Tỉnh/Thành phố** và đơn vị hành chính
- Quản lý **Tình trạng pháp lý**
- Cài đặt thời gian job tự động nhắc nhở
- Quản lý email template
- Quản lý tài khoản Admin (tạo, khoá, xoá) — chỉ Super Admin

---

## 4. LUỒNG NGHIỆP VỤ CHÍNH

### Luồng 1 — Công ty BĐS được onboard và đăng tin
```
[Công ty] Liên hệ qua Landing Page
[Admin]   Tạo tài khoản, cấp domain riêng (congtyabc.bdshy.vn)
[Công ty] Đăng nhập → Đổi mật khẩu lần đầu
          → Thêm tài sản → Tạo tin đăng → Gửi duyệt
[Admin]   Duyệt tin → Tin hiển thị lên sàn app.bdshy.vn
```

### Luồng 2 — Khách từ Landing Page xem tin và gửi tư vấn
```
[Khách]  Vào bdshy.vn (Landing Page)
         → Bấm "Xem tin bán đất ngay" → Chuyển tới app.bdshy.vn
         → Xem danh sách / Tìm kiếm / Lọc (không cần đăng nhập)
         → Xem Chi tiết BĐS
         → Bấm "GỬI YÊU CẦU TƯ VẤN"
         → Đăng nhập bằng SĐT + OTP (nếu chưa đăng nhập)
         → Điền tên, ghi chú → Gửi
[Hệ thống] Tạo đơn tư vấn → Thông báo realtime đến Công ty BĐS
[Công ty]  Gọi điện → Cập nhật trạng thái → ... → Hoàn thành
[Khách]  Theo dõi trạng thái trong Lịch sử tư vấn
```

### Luồng 3 — Admin nhắc nhở đơn tư vấn bị bỏ quên
```
[Hệ thống] Job tự động chạy mỗi giờ
           → Phát hiện đơn "Chờ tư vấn" quá 24h → Gửi nhắc nhở
[Admin]    Xem danh sách đơn quá hạn → Gửi nhắc nhở thủ công
```

### Luồng 4 — Người bán cá nhân đăng ký ký gửi
```
[Người bán] Đăng nhập SĐT + OTP → Vào màn "Đăng ký bán BĐS"
            → Điền thông tin + ảnh → Gửi
[Admin]     Nhận yêu cầu → Liên hệ xác nhận → Phân công xử lý
```

---

## 5. TỔNG HỢP CHỨC NĂNG THEO VAI TRÒ

### 👤 Người mua / Người bán cá nhân

| # | Chức năng | Cần đăng nhập |
|---|---|---|
| 1 | Xem danh sách BĐS trên trang chủ | ❌ |
| 2 | Tìm kiếm theo từ khoá | ❌ |
| 3 | Lọc theo loại hình BĐS đầy đủ (Đất nền, Nhà riêng, Căn hộ, Biệt thự, Mặt phố, Thương mại...) | ❌ |
| 4 | Chuyển đổi xem dạng Danh sách / Bản đồ | ❌ |
| 5 | Xem chi tiết BĐS (ảnh, thông tin đầy đủ, bản đồ) | ❌ |
| 6 | Chia sẻ link tin đăng | ❌ |
| 7 | Đăng nhập bằng SĐT + OTP | ❌ |
| 8 | Gửi yêu cầu tư vấn | ✅ |
| 9 | Xem lịch sử tư vấn và trạng thái đơn | ✅ |
| 10 | Đăng ký bán BĐS / Ký gửi tài sản | ✅ |
| 11 | Xem & cập nhật thông tin cá nhân | ✅ |

### 🏢 Công ty BĐS (Nhân viên)

| # | Chức năng |
|---|---|
| 1 | Đăng nhập bằng Username + Password |
| 2 | Đổi mật khẩu lần đầu (bắt buộc) |
| 3 | Quên mật khẩu / Đặt lại qua OTP SMS |
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
| 3 | Quản lý tài khoản thành viên |
| 4 | Duyệt / Từ chối / Xoá tin đăng |
| 5 | Xem toàn bộ đơn tư vấn hệ thống |
| 6 | Gửi nhắc nhở thủ công cho đơn bị bỏ quên |
| 7 | Xem thống kê & báo cáo toàn hệ thống |
| 8 | Xuất báo cáo Excel/PDF |
| 9 | Quản lý góp ý / phản hồi người dùng |
| 10 | Quản lý media (ảnh tin đăng + banner) |
| 11 | Quản lý danh mục hệ thống |
| 12 | Quản lý email template |

### 🦸 Super Admin

| # | Chức năng |
|---|---|
| 1 | Tất cả quyền của Admin |
| 2 | Tạo / Khoá / Xoá tài khoản Admin |
| 3 | Cài đặt thời gian job tự động nhắc nhở |
| 4 | Toàn quyền cài đ���t hệ thống |

---

## 6. DANH SÁCH MÀN HÌNH (Dành cho Designer)

### 🏠 Web App + Mobile App (Người mua / Người bán)

| # | Tên màn | Mô tả ngắn |
|---|---|---|
| M01 | Trang Chủ | Danh sách tin đăng + bộ lọc nhanh đầy đủ |
| M02 | Tìm Kiếm & Lọc | Lọc nâng cao 10 loại hình + xem List/Map |
| M03 | Chi Tiết BĐS | Thông tin đầy đủ theo loại hình + nút Gửi yêu cầu |
| M04 | Đăng Nhập (SĐT + OTP) | Nhập SĐT → nhận OTP → xác nhận |
| M05 | Form Gửi Yêu Cầu Tư Vấn | Bottom sheet / popup |
| M06 | Lịch Sử Tư Vấn | Danh sách đơn + trạng thái |
| M07 | Đăng Ký Bán / Ký Gửi BĐS | Form điền thông tin + dropdown 10 loại hình |
| M08 | Thông Tin Cá Nhân | Xem & cập nhật hồ sơ, avatar, đăng xuất |

### 🏢 Company Portal (Công ty BĐS)

| # | Tên màn | Mô tả ngắn |
|---|---|---|
| C01 | Đăng Nhập | Username + Password |
| C02 | Đổi Mật Khẩu Lần Đầu | Bắt buộc khi đăng nhập lần đầu |
| C03 | Quên Mật Khẩu (OTP) | Nhập SĐT → OTP → mật khẩu mới |
| C04 | Dashboard Tổng Quan | Thống kê + đơn mới + tin hết hạn |
| C05 | Quản Lý Tài Sản | Danh sách + thêm/sửa/xoá tài sản |
| C06 | Chi Tiết / Tạo / Sửa Tài Sản | Form nhập đầy đủ theo loại hình (dynamic fields) |
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
| A04 | Chi Tiết Công Ty | Thông tin + tài sản + tin + đơn |
| A05 | Quản Lý Thành Viên | List người dùng + khoá/mở |
| A06 | Quản Lý Tin Đăng | Duyệt / Từ chối / Xoá |
| A07 | Quản Lý Đơn Tư Vấn | Toàn bộ đơn + quá hạn + nhắc nhở |
| A08 | Thống Kê & Báo Cáo | Biểu đồ + xuất Excel/PDF |
| A09 | Góp Ý & Phản Hồi | Danh sách + xử lý |
| A10 | Quản Lý Media | Ảnh tin đăng + banner marketing |
| A11 | Cài Đặt Hệ Thống | Danh mục 10 loại hình + email template + job config |

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
bds-hy-platform/
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
- ✅ Web App + Mobile App người mua/bán (8 màn hình)
- ✅ Company Portal cho Công ty BĐS
- ✅ Admin System vận hành
- ✅ Landing Page WordPress với CTA dẫn tới app.bdshy.vn

### Phase 2 — Mở rộng (3-6 tháng tới)

#### 🏗️ Nhóm 1 — Mở rộng loại hình BĐS
- ✅ Đã có (Phase 1): Đất nền, Nhà riêng, Căn hộ chung cư
- 🔜 **Biệt thự / Nhà liền kề**: Thêm trường thông tin đặc trưng (DT đất, DT xây dựng, sân vườn, hồ bơi). Cập nhật bộ lọc và màn chi tiết.
- 🔜 **Nhà mặt phố / Mặt tiền**: Thêm trường mặt tiền, vỉa hè, phù hợp kinh doanh. Hiển thị badge "Mặt phố" trên thẻ tin.
- 🔜 **BĐS thương mại**: Tách 3 nhóm — Văn phòng, Mặt bằng KD, Kho/Xưởng — mỗi nhóm có bộ trường và bộ lọc riêng.
- 🔜 **Đất nông nghiệp / Trang trại**: Trường loại đất, ngu��n nước, hiện trạng cây trồng, diện tích tính theo ha.
- 🔜 **Dự án BĐS**: Admin/Công ty tạo dự án tổng thể → đăng tin theo từng căn/lô. Người mua xem sơ đồ mặt bằng, chọn căn theo block/tầng.

#### 👥 Nhóm 2 — Nâng cấp trải nghiệm người dùng
- 🔜 **Yêu thích tin đăng**: Bấm ❤️ lưu tin, xem lại trong tab "Đã lưu" ở Thông tin cá nhân.
- 🔜 **So sánh BĐS**: Chọn 2–3 tin đăng → so sánh thông số cạnh nhau (giá/m², diện tích, số phòng, pháp lý, vị trí).
- 🔜 **Thông báo tin mới phù hợp**: Người dùng lưu bộ lọc → nhận push notification / email khi có tin mới khớp.
- 🔜 **Đánh giá Công ty BĐS**: Sau khi hoàn thành giao dịch → đánh giá ⭐ (1–5 sao) + nhận xét. Điểm hiển thị trên trang công ty.
- 🔜 **Chia sẻ mạng xã hội**: Chia sẻ tin đăng lên Facebook, Zalo với preview ảnh + giá + địa chỉ đẹp (Open Graph).

#### 🏢 Nhóm 3 — Nâng cấp Company Portal
- 🔜 **Quản lý nhân viên sale**: Tạo tài khoản cho từng nhân viên (Admin công ty / Nhân viên). Mỗi người đăng nhập tài khoản riêng.
- 🔜 **Phân công đơn tư vấn**: Khi có đơn mới, quản lý assign cho nhân viên cụ thể. Nhân viên nhận thông báo và xử lý đơn được giao.
- 🔜 **Báo cáo hiệu quả nhân viên**: Số đơn nhận, số đơn hoàn thành, tỷ lệ chuyển đổi, thời gian xử lý TB, doanh số ước tính/tháng.
- 🔜 **CRM nội bộ**: Lưu lịch sử tương tác với từng khách — ghi log cuộc gọi, nhắn tin, lịch hẹn, ghi chú. Tất cả nhân viên công ty cùng xem.
- 🔜 **Lịch hẹn xem đất**: Giao diện calendar quản lý buổi hẹn. Nhắc nhở tự động 1 giờ trước hẹn.

#### 📊 Nhóm 4 — Nâng cấp Admin & Báo cáo
- 🔜 **Báo cáo theo loại hình BĐS**: Thống kê tin đăng, đơn tư vấn, tỷ lệ chuyển đổi phân theo từng loại hình và khu vực địa lý.
- 🔜 **Heatmap thị trường**: Bản đồ nhiệt hiển thị mật độ BĐS rao bán theo địa bàn — nhận ra khu vực nóng.
- 🔜 **Quy trình ký gửi đầy đủ**: Tiếp nhận → xác minh → chụp ảnh → phân công → đăng tin → theo dõi kết quả bán.
- 🔜 **Tích hợp Google Analytics**: Theo dõi hành vi: trang xem nhiều nhất, bộ lọc dùng nhiều nhất, tỷ lệ thoát, nguồn traffic.
- 🔜 **Thông báo đa kênh**: Bổ sung Email notification + Push notification (Firebase FCM) ngoài SMS và Socket.io hiện có.

#### 💳 Nhóm 5 — Thanh toán & Gói dịch vụ
- 🔜 **Gói dịch vụ cho Công ty BĐS**:
  - **Cơ bản (Miễn phí)**: Tối đa 10 tin/tháng, không tin nổi bật, báo cáo cơ bản
  - **Chuyên nghiệp**: Không giới hạn tin, 5 tin nổi bật/tháng, báo cáo đầy đủ, hỗ trợ email
  - **Doanh nghiệp**: Không giới hạn, tin nổi bật ưu tiên, CRM nội bộ, báo cáo nâng cao, hỗ trợ Zalo/hotline riêng
- 🔜 **Tin đăng nổi bật**: Trả thêm phí → tin hiển thị đầu danh sách + badge "Nổi bật 🔥".
- 🔜 **Tích hợp thanh toán**: VNPay, MoMo, chuyển khoản ngân hàng — thanh toán gói dịch vụ và tin nổi bật.
- 🔜 **Quản lý hóa đơn**: Admin xem danh sách thanh toán, trạng thái, xuất hóa đơn VAT điện tử.

---

*© 2026 Sàn Bất Động Sản Hưng Yên — "Uy tín – An tâm – Mua nhanh – Bán lẹ"*
*Tài liệu được quản lý tại: https://github.com/20111427nguyenvanduc/ducbeo*
