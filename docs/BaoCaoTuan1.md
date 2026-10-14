# BÁO CÁO TIẾN ĐỘ TUẦN 1 - NHÓM CAPSTONE
- Học phần: Điện toán đám mây (Cloud Computing)
- Đề tài: Ứng dụng quản lý chi tiêu cá nhân với phân tích dữ liệu (Expense Tracker)
- Repository GitHub (Public): https://github.com/Lypfy/aws-expense-tracker
- Region triển khai: us-east-1 (US East - N. Virginia)
---
## I. BẢNG PHÂN CÔNG CÔNG VIỆC VÀ THỜI GIAN LÀM VIỆC (≥ 8 GIỜ/SV)
| Thành viên | Vai trò | Số giờ | Công việc chi tiết đảm nhiệm | Sản phẩm minh chứng trên GitHub |
| :--- | :---: | :---: | :--- | :--- |
| **Lê Trọng Nghĩa**<br>(MSSV: 24110286) | SV1 | **8.5h** | - Nghiên cứu cơ chế trích xuất Textract AnalyzeExpense.<br>- Nghiên cứu luồng Data Lake (S3 -> Glue -> Athena).<br>- Khởi tạo 2 S3 Buckets, cấu hình Tag.<br>- Thu thập 15-20 file hóa đơn mẫu.<br>- Thiết kế và vẽ sơ đồ kiến trúc hệ thống tổng thể.<br>- Xây dựng mã nguồn khung Lambda OCR Processor. | - Sơ đồ kiến trúc: [docs/aws_architecture_user_diagram_plus.drawio.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus.drawio.png)<br>- Nghiên cứu Textract: [docs/Textract_AnalyzeExpense.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/Textract_AnalyzeExpense.md)<br>- Bucket S3 kèm Tags: `expense-raw-receipts-24110286`, `expense-analytics-data-24110286` ([screenshots/Buckets_tag.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/Buckets_tag.png))<br>- Dữ liệu hóa đơn mẫu (15 ảnh): [data/sample-receipts](https://github.com/Lypfy/aws-expense-tracker/tree/main/data/sample-receipts)<br>- Code Lambda OCR: [backend/functions/ocr-processor/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/ocr-processor/handler.py) |
| **Nguyễn Thành Thắng**<br>(MSSV: 24110332) | SV2 | **8.5h** | - Khảo sát bảo mật IAM LabRole, phân tích VocLabPolicy.<br>- Khởi tạo Default VPC Security Group, gắn Tag.<br>- Thiết kế schema NoSQL, khởi tạo bảng DynamoDB Transactions (On-Demand).<br>- Đặc tả 5 REST API CRUD, tạo mock data và dựng repo Git.<br>- Xây dựng mã nguồn khung Lambda Transactions CRUD. | - Security Group: `expense-tracker-sg`<br>- Bảng DynamoDB: `Transactions`<br>- Code Lambda CRUD: [backend/functions/transactions/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/transactions/handler.py)<br>- Đặc tả API: [docs/api/transactions-api.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/api/transactions-api.md)<br>- Schema CSDL: [docs/dynamodb-schema.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/dynamodb-schema.md)<br>- Dữ liệu giả lập: [data/mock-transactions.json](https://github.com/Lypfy/aws-expense-tracker/blob/main/data/mock-transactions.json) |
---
## II. CHI TIẾT CÔNG VIỆC VÀ LIÊN KẾT MINH CHỨNG CỤ THỂ TRÊN GITHUB
### 1. Hạ tầng mạng & Bảo mật (SV2):
- Khảo sát quyền hạn `LabRole` của AWS Academy, xác nhận đầy đủ quyền tương tác DynamoDB, Lambda, S3 thông qua các policy tùy chỉnh.
  - Link ảnh minh chứng IAM: [screenshots/01_iam_labrole.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/01_iam_labrole.png)
- Khởi tạo Security Group `expense-tracker-sg` trong Default VPC, gắn Tag `Project: ExpenseTracker` và `Owner: NguyenThanhThang`.
  - Link ảnh minh chứng Security Group: [screenshots/02_security_group.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/02_security_group.png)
### 2. Thiết kế Cơ sở dữ liệu NoSQL DynamoDB (SV2):
- Khởi tạo bảng `Transactions` ở trạng thái Active, chế độ On-Demand (Pay-per-request) để tối ưu chi phí Lab.
- Thiết kế Composite Primary Key: Partition Key `userId` (String) + Sort Key `transactionId` (String định dạng `TX#YYYY-MM-DDTHH:mm:ss#<uuid>`).
- Gắn đầy đủ 2 Tags: `Project: ExpenseTracker` và `Owner: NguyenThanhThang`.
  - Link file đặc tả Schema DynamoDB: [docs/dynamodb-schema.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/dynamodb-schema.md)
  - Link ảnh minh chứng bảng DynamoDB: [screenshots/03_dynamodb_table.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/03_dynamodb_table.png)
  - Link ảnh minh chứng Tags DynamoDB: [screenshots/03_dynamodb_tags.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/03_dynamodb_tags.png)
### 3. Thiết kế Đặc tả RESTful API, Dữ liệu mẫu & Mã nguồn Backend (SV2):
- Xây dựng hoàn chỉnh tài liệu OpenAPI chuẩn cho 5 endpoints CRUD giao dịch chi tiêu (`POST`, `GET`, `PUT`, `DELETE`).
  - Link file đặc tả API: [docs/api/transactions-api.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/api/transactions-api.md)
- Chuẩn bị tập dữ liệu giả lập gồm 5 giao dịch mẫu phục vụ kiểm thử tuần 2:
  - Link file dữ liệu mẫu: [data/mock-transactions.json](https://github.com/Lypfy/aws-expense-tracker/blob/main/data/mock-transactions.json)
- Khởi tạo mã nguồn khung Lambda xử lý các nghiệp vụ CRUD giao dịch qua API Gateway:
  - Link mã nguồn Lambda CRUD: [backend/functions/transactions/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/transactions/handler.py)
### 4. Lưu trữ S3, Dữ liệu Hóa đơn OCR & Mã nguồn Xử lý (SV1):
- Khởi tạo 2 S3 Buckets tại Region `us-east-1` kèm Tag `Project: ExpenseTracker`, `Owner: LeTrongNghia`:
  - `expense-raw-receipts-24110286`: Lưu trữ ảnh/PDF hóa đơn tải lên.
  - `expense-analytics-data-24110286`: Lưu trữ dữ liệu tổng hợp cho Glue/Athena.
  - Link ảnh minh chứng S3 Buckets kèm Tag: [screenshots/Buckets_tag.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/Buckets_tag.png)
- Chuẩn bị tập dữ liệu 15 ảnh hóa đơn mẫu thực tế:
  - Link thư mục hóa đơn mẫu: [data/sample-receipts](https://github.com/Lypfy/aws-expense-tracker/tree/main/data/sample-receipts)
- Khởi tạo mã nguồn khung Lambda xử lý sự kiện S3 Event Notification gọi Textract AnalyzeExpense:
  - Link mã nguồn Lambda OCR: [backend/functions/ocr-processor/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/ocr-processor/handler.py)
### 5. Nghiên cứu cơ chế đọc hóa đơn của Textract (AnalyzeExpense) và luồng Data Lake (SV1):
- Tìm hiểu chức năng và cơ chế hoạt động của Textract AnalyzeExpense.
- Xác định các thông tin có thể trích xuất từ hóa đơn: tên cửa hàng, ngày giao dịch, tổng tiền, thuế và chi tiết mặt hàng.
- Tìm hiểu cấu trúc dữ liệu JSON mà Textract trả về.
- Nghiên cứu cách tích hợp Textract với S3 và Lambda để xử lý hóa đơn.
- Tìm hiểu cách chuẩn hóa, kiểm tra và lưu dữ liệu giao dịch vào DynamoDB.
- Nghiên cứu luồng đưa dữ liệu lên S3, sử dụng Glue và Athena để phân tích chi tiêu.
- Tổng hợp kết quả nghiên cứu, xây dựng sơ đồ luồng xử lý và cập nhật tài liệu lên GitHub.
  - Link file nghiên cứu: [docs/Textract_AnalyzeExpense.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/Textract_AnalyzeExpense.md)
### 6. Thiết kế và vẽ sơ đồ kiến trúc hệ thống tổng thể (SV1):
- Thiết kế kiến trúc tổng thể cho ứng dụng quản lý chi tiêu cá nhân với phân tích dữ liệu trên AWS, hỗ trợ ghi nhận giao dịch, trích xuất thông tin hóa đơn và thống kê chi tiêu.
- Luồng hoạt động:
  + Ghi nhận chi tiêu: Người dùng nhập giao dịch, hệ thống xử lý qua API Gateway và Lambda, sau đó lưu vào DynamoDB.
  + Xử lý hóa đơn: Hóa đơn được lưu trên S3, Textract trích xuất thông tin, sau đó dữ liệu được kiểm tra và lưu trữ.
  + Phân tích dữ liệu: Dữ liệu phù hợp được tổ chức trên S3, AWS Glue quản lý metadata và Amazon Athena truy vấn phục vụ báo cáo.
  - Link sơ đồ kiến trúc: [docs/aws_architecture_user_diagram_plus.drawio.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus.drawio.png)
---
## III. MINH CHỨNG LỊCH SỬ COMMIT TRÊN GITHUB
Toàn bộ tiến độ công việc Tuần 1 được phản ánh rõ ràng qua các Git commit có ý nghĩa trên nhánh `main`:
- Link xem toàn bộ lịch sử commit: [Lịch sử Commit Tuần 1](https://github.com/Lypfy/aws-expense-tracker/commits/main)

**Các commit chính của từng thành viên thể hiện nội dung công việc tuần:**
1. **Sinh viên 2 (Nguyễn Thành Thắng):**
   - [`14ee7cf`](https://github.com/Lypfy/aws-expense-tracker/commit/14ee7cf8a5ec9dc5c234b3f81580ce42488d5e07): `setup project structure, mock data, and dynamo schema`
   - [`8415980`](https://github.com/Lypfy/aws-expense-tracker/commit/84159807fa364e5264b15926ec0ea797bce17804): `more screenshots and updated README.md`
   - [`826b245`](https://github.com/Lypfy/aws-expense-tracker/commit/826b2452da69595fec8e6927d75dfab6a84f39ae): `add transactions lambda skeleton handler (Nguyen Thanh Thang)`
2. **Sinh viên 1 (Lê Trọng Nghĩa):**
   - [`66c2f89`](https://github.com/Lypfy/aws-expense-tracker/commit/66c2f891fd451fab9de0021ce682f862df5bbf11): `Add files via upload (Mã nguồn python khung gọi Textract)`
   - [`9d243f3`](https://github.com/Lypfy/aws-expense-tracker/commit/9d243f34795c6f62df06dc46c847902181b82c3e): `Add files via upload (Ảnh thu thập các hóa đơn mẫu)`
   - [`8060ca6`](https://github.com/Lypfy/aws-expense-tracker/commit/8060ca64f8b5ab5a9bdf7f41ac52087dbf7163d6): `Add files via upload (ảnh sơ đồ kiến trúc hệ thống tổng thể)`
   - [`c2a12ae`](https://github.com/Lypfy/aws-expense-tracker/commit/c2a12ae61d7631bc7a7208178391fdf58e9c6f22): `Add files via upload (gắn thẻ cho buckets)`
   - [`356685e`](https://github.com/Lypfy/aws-expense-tracker/commit/356685e0513607e498b501c6fc562618eedf87df): `Update Textract and Athena/Glue Data Lake research document`
---
## IV. KHAI BÁO SỬ DỤNG CÔNG CỤ AI / LLM & MINH CHỨNG CHỈNH SỬA
Tuân thủ nghiêm ngặt quy chế môn học về việc minh bạch khi ứng dụng AI (kèm đối chiếu minh chứng chỉnh sửa qua link file và commit):

### 1. Claude (Claude 3.5 Sonnet)
- **Prompt:** "Hãy giải thích cách sử dụng AWS Textract AnalyzeExpense để trích xuất thông tin từ hóa đơn dạng ảnh hoặc PDF. Trình bày các thông tin có thể trích xuất, cấu trúc dữ liệu JSON trả về và cách ứng dụng kết quả vào hệ thống quản lý chi tiêu ExpenseTracker."
- **AI tạo ra:** Hỗ trợ tìm hiểu chức năng AWS Textract AnalyzeExpense, cách trích xuất thông tin hóa đơn và cấu trúc dữ liệu JSON phục vụ quá trình xử lý hóa đơn trong dự án.
- **SV đã sửa:** Tổng hợp và chọn lọc nội dung phù hợp với phạm vi đề tài; đối chiếu thông tin với kiến trúc hệ thống ExpenseTracker và hoàn thiện phần nghiên cứu công nghệ trong báo cáo; xây dựng tài liệu nghiên cứu Textract và luồng Data Lake.
- **Minh chứng qua file & commit:**
  - File nghiên cứu công nghệ Textract: [docs/Textract_AnalyzeExpense.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/Textract_AnalyzeExpense.md)
  - Thư mục dữ liệu hóa đơn: [data/sample-receipts](https://github.com/Lypfy/aws-expense-tracker/tree/main/data/sample-receipts)
  - Commit minh chứng của SV1: [Update Textract and Athena/Glue Data Lake research document](https://github.com/Lypfy/aws-expense-tracker/commit/356685e0513607e498b501c6fc562618eedf87df)

### 2. ChatGPT (GPT-5)
- **Prompt:** "Hỗ trợ xây dựng dữ liệu JSON giả lập cho 15 hóa đơn phục vụ đề tài AWS ExpenseTracker. Dữ liệu cần thể hiện thông tin hóa đơn và các khoản chi tiêu, có cấu trúc thống nhất để thuận tiện cho việc kiểm thử và minh họa quy trình xử lý dữ liệu. Đồng thời, hỗ trợ đề xuất bố cục sơ đồ kiến trúc AWS có sử dụng các dịch vụ S3, Textract, Glue và Athena."
- **AI tạo ra:** Dữ liệu JSON giả lập cho hóa đơn và các gợi ý về bố cục, thành phần của sơ đồ kiến trúc hệ thống AWS.
- **SV đã sửa:** Kiểm tra và điều chỉnh cấu trúc dữ liệu JSON cho phù hợp với đề tài (chuẩn hóa các trường `amount`, `category`, `type`); rà soát thông tin hóa đơn giả lập và hoàn thiện sơ đồ kiến trúc hệ thống trên Draw.io theo thiết kế thực tế của nhóm.
- **Minh chứng qua file & commit:**
  - File dữ liệu giả lập chuẩn hóa: [data/mock-transactions.json](https://github.com/Lypfy/aws-expense-tracker/blob/main/data/mock-transactions.json)
  - Sơ đồ kiến trúc tổng thể: [docs/aws_architecture_user_diagram_plus.drawio.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus.drawio.png)
  - Commit minh chứng của SV2: [setup project structure, mock data, and dynamo schema](https://github.com/Lypfy/aws-expense-tracker/commit/14ee7cf8a5ec9dc5c234b3f81580ce42488d5e07)
  - Commit minh chứng của SV1: [Add files via upload - ảnh sơ đồ kiến trúc hệ thống tổng thể](https://github.com/Lypfy/aws-expense-tracker/commit/8060ca64f8b5ab5a9bdf7f41ac52087dbf7163d6)

### 3. Amazon Q Developer
- **Prompt:** "Hỗ trợ đề xuất thiết kế khóa chính, khóa sắp xếp và cách tổ chức dữ liệu cho bảng DynamoDB Transactions trong hệ thống AWS ExpenseTracker. Giải thích cách lựa chọn thiết kế phù hợp với dữ liệu giao dịch và nhu cầu truy vấn của hệ thống."
- **AI tạo ra:** Gợi ý về thiết kế khóa và cấu trúc bảng DynamoDB Transactions phục vụ việc lưu trữ dữ liệu giao dịch chi tiêu.
- **SV đã sửa:** Đối chiếu gợi ý với yêu cầu đề tài, điều chỉnh Sort Key thành định dạng phân cấp `TX#YYYY-MM-DDTHH:mm:ss#<uuid>` để tối ưu hóa truy vấn chi tiêu theo tháng bằng toán tử `begins_with`; trực tiếp đăng nhập AWS Console tạo bảng DynamoDB với chế độ thanh toán On-Demand và gắn đầy đủ 2 thẻ Tag theo quy định.
- **Minh chứng qua file & commit:**
  - File lược đồ CSDL DynamoDB: [docs/dynamodb-schema.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/dynamodb-schema.md)
  - Ảnh minh chứng bảng DynamoDB Active: [screenshots/03_dynamodb_table.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/03_dynamodb_table.png)
  - Ảnh minh chứng gán thẻ Tag: [screenshots/03_dynamodb_tags.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/03_dynamodb_tags.png)
  - Commit minh chứng của SV2: [more screenshots and updated README.md](https://github.com/Lypfy/aws-expense-tracker/commit/84159807fa364e5264b15926ec0ea797bce17804)

### 4. Gemini (Gemini 3.8 Flash)
- **Prompt:** "Hỗ trợ phân tích yêu cầu lưu trữ dữ liệu giao dịch chi tiêu trên Amazon DynamoDB và xây dựng đặc tả 5 RESTful API CRUD. Đồng thời, hỗ trợ viết mã nguồn khung bằng Python SDK (boto3) cho Lambda CRUD Transactions và Lambda OCR Receipt Processor xử lý sự kiện S3 Event Notification gọi Amazon Textract."
- **AI tạo ra:** Các gợi ý về cấu trúc và thiết kế khóa cho bảng DynamoDB Transactions; khung đặc tả OpenAPI cho 5 endpoints CRUD; khung mã nguồn cho 2 hàm Lambda (`transactions/handler.py` và `ocr-processor/handler.py`).
- **SV đã sửa:**
  - **SV2 (Nguyễn Thành Thắng):** Đánh giá và chọn lọc các gợi ý phù hợp; hoàn thiện tài liệu đặc tả 5 REST API CRUD chuẩn OpenAPI Specification; chuẩn hóa mã nguồn khung Lambda backend `backend/functions/transactions/handler.py` (tích hợp CORS header, bọc mã ngoại lệ `500`, chuẩn hóa mã trạng thái HTTP).
  - **SV1 (Lê Trọng Nghĩa):** Kiểm tra cấu trúc phân tích sự kiện S3 Event (`event['Records'][0]['s3']`), bổ sung giải mã URL an toàn cho tên file (`urllib.parse.unquote_plus`), thiết lập cấu trúc dữ liệu trích xuất chuẩn và hoàn thiện mã nguồn khung `backend/functions/ocr-processor/handler.py`.
- **Minh chứng qua file & commit:**
  - File đặc tả REST API: [docs/api/transactions-api.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/api/transactions-api.md)
  - File mã nguồn Lambda CRUD (SV2): [backend/functions/transactions/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/transactions/handler.py)
  - Commit minh chứng của SV2: [add transactions lambda skeleton handler (Nguyen Thanh Thang)](https://github.com/Lypfy/aws-expense-tracker/commit/826b2452da69595fec8e6927d75dfab6a84f39ae)
  - File mã nguồn Lambda OCR (SV1): [backend/functions/ocr-processor/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/ocr-processor/handler.py)
  - Commit minh chứng của SV1: [Add files via upload - Mã nguồn python khung gọi Textract (Lê Trọng Nghĩa)](https://github.com/Lypfy/aws-expense-tracker/commit/66c2f891fd451fab9de0021ce682f862df5bbf11)
