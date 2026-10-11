# THƯ MỤC ẢNH MINH CHỨNG (SCREENSHOTS)
Nơi lưu trữ ảnh chụp màn hình minh chứng cấu hình thật trên AWS Learner Lab để nộp báo cáo theo quy chuẩn của GVHD ThS. Huỳnh Xuân Phụng.

---

### 📌 THÔNG TIN SINH VIÊN & QUY CHUẨN TAGGING
- **Sinh viên 1 (SV1):** Lê Trọng Nghĩa - MSSV: `24110286` $\rightarrow$ Tag: `Owner: LeTrongNghia`
- **Sinh viên 2 (SV2):** Nguyễn Thành Thắng - MSSV: `24110332` $\rightarrow$ Tag: `Owner: NguyenThanhThang`
- **Dự án chung:** Tag: `Project: ExpenseTracker`

---

### 📸 QUY CHUẨN ẢNH BẮT BUỘC (THEO QUY CHẾ GVHD)
1. Chụp toàn màn hình máy tính (**Full Screen**, không cắt viền).
2. Hiển thị rõ:
   - **Mã Account ID:** `2593-5119-2274` và **Region:** `us-east-1` (N. Virginia) ở góc trên bên phải.
   - **Đồng hồ hệ thống máy tính:** Ngày, giờ thực tế ở góc dưới bên phải.
   - **Thẻ Tags:** Hiển thị rõ `Project: ExpenseTracker` và `Owner: NguyenThanhThang` (hoặc `LeTrongNghia`).

---

### 📂 DANH SÁCH ẢNH MINH CHỨNG TUẦN 1 TRONG THƯ MỤC

| Tên tệp ảnh | Nội dung minh chứng | Thành viên phụ trách | Trạng thái |
| :--- | :--- | :---: | :---: |
| `01_iam_labrole.png` | Khảo sát IAM Role `LabRole` & các policies `VocLabPolicy` | Nguyễn Thành Thắng (SV2) | ✅ Đã lưu |
| `02_security_group.png` | Khởi tạo Security Group `expense-tracker-sg` kèm Tags | Nguyễn Thành Thắng (SV2) | ✅ Đã lưu |
| `03_dynamodb_table.png` | Chi tiết bảng `Transactions` (PK `userId`, SK `transactionId`, On-demand, Active) | Nguyễn Thành Thắng (SV2) | ✅ Đã lưu |
| `03_dynamodb_tags.png` | Tab Tags của bảng `Transactions` hiển thị `Project: ExpenseTracker`, `Owner: NguyenThanhThang` | Nguyễn Thành Thắng (SV2) | ✅ Đã lưu |
| `04_s3_buckets.png` | Khởi tạo 2 S3 Buckets (`expense-raw-receipts-24110286`, `expense-analytics-data-24110286`) | Lê Trọng Nghĩa (SV1) | ⏳ Chờ SV1 nộp |
