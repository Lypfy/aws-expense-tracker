# THIẾT KẾ LƯỢC ĐỒ CƠ SỞ DỮ LIỆU DYNAMODB (DYNAMODB SCHEMA DESIGN)
**Bảng:** `Transactions`  
**Chế độ thanh toán (Billing Mode):** `On-Demand` (Pay-per-request)  
**Phụ trách:** Sinh viên 2 (SV2)  

---

## 📌 1. MÔ HÌNH KHÓA CHÍNH (PRIMARY KEY)

| Tên khóa | Thuộc tính | Kiểu dữ liệu | Vai trò kỹ thuật & Mục đích thiết kế |
| :--- | :--- | :---: | :--- |
| **Partition Key (PK)** | `userId` | `String` | Phân tán đều dữ liệu giữa các phân vùng vật lý (partitions), cô lập dữ liệu theo từng tài khoản người dùng. |
| **Sort Key (SK)** | `transactionId` | `String` | Định dạng: `TX#YYYY-MM-DDTHH:mm:ss#<uuid>`. Hỗ trợ sắp xếp thời gian tự nhiên và truy vấn lọc theo tháng/năm bằng toán tử `begins_with(transactionId, 'TX#YYYY-MM')`. |

---

## 📋 2. DANH MỤC THUỘC TÍNH (ATTRIBUTES)

| Tên trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :---: | :---: | :--- |
| `userId` | String | Có | Mã định danh người dùng (PK). |
| `transactionId` | String | Có | Mã giao dịch theo chuỗi thời gian (SK). |
| `amount` | Number | Có | Số tiền giao dịch (VND hoặc USD). |
| `currency` | String | Không | Đơn vị tiền tệ (mặc định: `VND`). |
| `category` | String | Có | Phân loại chi tiêu: `Food & Dining`, `Transport`, `Shopping`, `Utilities`, `Entertainment`, v.v. |
| `type` | String | Có | Loại giao dịch: `EXPENSE` (Khoản chi) hoặc `INCOME` (Khoản thu). |
| `merchant` | String | Không | Tên đối tác / Cửa hàng (Trích xuất từ Textract hoặc nhập tay). |
| `description` | String | Không | Ghi chú thêm của người dùng. |
| `receiptUrl` | String | Không | Đường dẫn S3 tới ảnh hóa đơn gốc (nếu tạo qua OCR). |
| `createdAt` | String | Có | Thời gian tạo (ISO 8601 UTC). |
| `updatedAt` | String | Không | Thời gian cập nhật gần nhất. |

---

## 💡 3. CHIẾN LƯỢC TRUY VẤN (QUERY PATTERNS)

1. **Lấy toàn bộ giao dịch của 1 người dùng:**
   - Dùng lệnh: `Query`
   - Điều kiện: `KeyConditionExpression: userId = :uid`
2. **Lọc giao dịch của người dùng theo tháng (Ví dụ Tháng 10/2026):**
   - Dùng lệnh: `Query`
   - Điều kiện: `KeyConditionExpression: userId = :uid AND begins_with(transactionId, :prefix)`  
     *(với `:prefix` = `'TX#2026-10'`)*
3. **Lấy chi tiết 1 giao dịch cụ thể:**
   - Dùng lệnh: `GetItem`
   - Khóa: `Key: { userId: "user_01", transactionId: "TX#2026-10-11T11:20:00#f8a3d1b2" }`
