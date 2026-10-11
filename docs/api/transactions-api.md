# ĐẶC TẢ RESTFUL API - GIAO DỊCH CHI TIÊU (EXPENSE TRANSACTIONS API)
**Mô-đun:** Quản lý giao dịch chi tiêu (Backend Serverless)  
**Phụ trách:** Sinh viên 2 (SV2)  
**Base URL (Dự kiến Tuần 2):** `https://<api-id>.execute-api.us-east-1.amazonaws.com/prod`  

---

## 📌 DANH SÁCH ENDPOINTS

| Phương thức | Endpoint | Mô tả chức năng | Quyền hạn / Header |
| :---: | :--- | :--- | :--- |
| **POST** | `/transactions` | Tạo mới một giao dịch chi tiêu hoặc thu nhập | `Content-Type: application/json` |
| **GET** | `/transactions` | Lấy danh sách giao dịch (hỗ trợ lọc theo userId, tháng, năm) | `userId` (Query param bắt buộc) |
| **GET** | `/transactions/{id}` | Lấy thông tin chi tiết một giao dịch | `userId` (Query param bắt buộc) |
| **PUT** | `/transactions/{id}` | Cập nhật thông tin giao dịch | `Content-Type: application/json` |
| **DELETE** | `/transactions/{id}` | Xóa một giao dịch khỏi hệ thống | `userId` (Query param bắt buộc) |

---

## 📝 CHI TIẾT TỪNG ENDPOINT

### 1. Tạo mới giao dịch (Create Transaction)
- **Method:** `POST`
- **Path:** `/transactions`
- **Request Body (JSON):**
  ```json
  {
    "userId": "user_01",
    "amount": 150000,
    "currency": "VND",
    "category": "Food & Dining",
    "type": "EXPENSE",
    "merchant": "Highlands Coffee",
    "description": "Cà phê gặp bạn",
    "receiptUrl": "s3://expense-raw-receipts-xxxx/receipt-01.jpg"
  }
  ```
- **Phản hồi thành công (201 Created):**
  ```json
  {
    "message": "Transaction created successfully",
    "data": {
      "userId": "user_01",
      "transactionId": "TX#2026-10-11T11:20:00#f8a3d1b2",
      "amount": 150000,
      "category": "Food & Dining",
      "createdAt": "2026-10-11T11:20:00Z"
    }
  }
  ```

---

### 2. Lấy danh sách giao dịch (List Transactions)
- **Method:** `GET`
- **Path:** `/transactions`
- **Query Parameters:**
  - `userId` (bắt buộc): Mã người dùng (ví dụ: `user_01`).
  - `month` (tùy chọn): Tháng lọc (ví dụ: `10`).
  - `year` (tùy chọn): Năm lọc (ví dụ: `2026`).
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "total": 1,
    "data": [
      {
        "userId": "user_01",
        "transactionId": "TX#2026-10-11T11:20:00#f8a3d1b2",
        "amount": 150000,
        "category": "Food & Dining",
        "merchant": "Highlands Coffee",
        "type": "EXPENSE",
        "createdAt": "2026-10-11T11:20:00Z"
      }
    ]
  }
  ```

---

### 3. Xem chi tiết giao dịch (Get Transaction Detail)
- **Method:** `GET`
- **Path:** `/transactions/{id}?userId=user_01`
- **Phản hồi thành công (200 OK):** Trả về toàn bộ thuộc tính của bản ghi.
- **Phản hồi lỗi (404 Not Found):** Nếu không tìm thấy mã giao dịch.

---

### 4. Cập nhật giao dịch (Update Transaction)
- **Method:** `PUT`
- **Path:** `/transactions/{id}`
- **Request Body:**
  ```json
  {
    "userId": "user_01",
    "amount": 160000,
    "category": "Food & Dining",
    "description": "Cà phê và bánh ngọt"
  }
  ```
- **Phản hồi thành công (200 OK):** Bản ghi đã được cập nhật.

---

### 5. Xóa giao dịch (Delete Transaction)
- **Method:** `DELETE`
- **Path:** `/transactions/{id}?userId=user_01`
- **Phản hồi thành công (200 OK):**
  ```json
  {
    "message": "Transaction deleted successfully",
    "transactionId": "TX#2026-10-11T11:20:00#f8a3d1b2"
  }
  ```
