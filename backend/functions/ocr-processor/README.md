# AWS LAMBDA - TEXTRACT OCR PROCESSOR
**Phụ trách:** Sinh viên 1 (SV1)  
**Nhiệm vụ Tuần 2:**
- Hàm Lambda kích hoạt tự động khi có ảnh hóa đơn mới được tải lên `s3://expense-raw-receipts-<mssv>`.
- Gọi Amazon Textract `AnalyzeExpense` để trích xuất hóa đơn.
- Tự động ghi kết quả trích xuất vào DynamoDB bảng `Transactions`.
