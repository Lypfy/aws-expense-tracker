# BÁO CÁO TIẾN ĐỘ TUẦN 2 - NHÓM CAPSTONE
- Học phần: Điện toán đám mây (Cloud Computing)
- Giảng viên hướng dẫn: ThS. Huỳnh Xuân Phụng
- Đề tài: Ứng dụng quản lý chi tiêu cá nhân với phân tích dữ liệu (Expense Tracker)
- Repository GitHub (Public): https://github.com/Lypfy/aws-expense-tracker
- Region triển khai: `us-east-1` (US East - N. Virginia)
- AWS Account ID: `2593-5119-2274`
---
## I. BẢNG PHÂN CÔNG CÔNG VIỆC VÀ THỜI GIAN LÀM VIỆC (≥ 8 GIỜ/SV)
| Thành viên | Vai trò | Số giờ | Công việc chi tiết đảm nhiệm | Sản phẩm minh chứng trên GitHub |
| :--- | :---: | :---: | :--- | :--- |
| **Lê Trọng Nghĩa**<br>(MSSV: 24110286) | SV1 | **8.5h** | - Hoàn thiện mã nguồn Python Lambda OCR Receipt Processor xử lý sự kiện S3 `ObjectCreated`, gọi SDK `boto3` Textract `AnalyzeExpense` bóc tách tự động: Vendor, Date, Total, Tax.<br>- Chuẩn hóa định dạng tiền tệ và ngày tháng, ghi dữ liệu vào DynamoDB `Transactions` và xuất file JSON phân tích vào S3 bucket Analytics.<br>- Khởi tạo hàm Lambda `ocr-receipt-processor` trên AWS Console, cấu hình `LabRole`, tăng Timeout lên 30 giây.<br>- Cấu hình S3 Event Notification Trigger (`ReceiptUploaded`) trên bucket `expense-raw-receipts-24110286`.<br>- Thiết lập luồng Data Lake: Tạo và chạy AWS Glue Crawler (`expense-analytics-crawler`), đồng bộ bảng dữ liệu vào Glue Data Catalog trong database `expense_analytics_db`.<br>- Cấu hình Amazon Athena và thực thi câu lệnh SQL phân tích chi tiêu trên dữ liệu trích xuất.<br>- Kiểm thử luồng OCR tự động bằng cách tải hóa đơn mẫu lên S3, đối soát bản ghi tự động cập nhật vào DynamoDB và theo dõi qua CloudWatch Logs. | - Mã nguồn Lambda OCR: [backend/functions/ocr-processor/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/ocr-processor/handler.py)<br>- Ảnh S3 Event Notification Trigger: [screenshots/tuan2/S3_event_notification.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/S3_event_notification.png)<br>- Ảnh theo dõi log CloudWatch: [screenshots/tuan2/cloudWatch_log.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/cloudWatch_log.png)<br>- Ảnh tạo AWS Glue Crawler: [screenshots/tuan2/create_crawler.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/create_crawler.png)<br>- Ảnh Glue Crawler chạy thành công: [screenshots/tuan2/crawler_success_start.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/crawler_success_start.png)<br>- Ảnh kết quả truy vấn SQL trên Amazon Athena: [screenshots/tuan2/Sql_amazon_authena.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/Sql_amazon_authena.png)<br>- Ảnh dữ liệu hóa đơn tự động cập nhật vào DynamoDB: [screenshots/tuan2/data_Auto_update .png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/data_Auto_update%20.png) |
| **Nguyễn Thành Thắng**<br>(MSSV: 24110332) | SV2 | **8.5h** | - Hoàn thiện mã nguồn Python Lambda Transactions CRUD xử lý 5 nghiệp vụ (`POST`, `GET` all, `GET` by id/month, `PUT`, `DELETE`), chuyển đổi kiểu `Decimal` an toàn sang JSON, tích hợp CORS đầy đủ.<br>- Cải tiến Sort Key an toàn cho URL (`TX_YYYY-MM-DDTHH:mm:ss_<uuid>`), hỗ trợ tự động giải mã URL decoding (%23 -> #), thiết lập cơ chế Anti-Upsert (`attribute_exists`).<br>- Khởi tạo hàm Lambda `expense-transactions-service` trên AWS Console, gắn `LabRole`, cấu hình biến môi trường `TABLE_NAME=Transactions`, tăng timeout lên 10 giây.<br>- Khởi tạo Amazon API Gateway REST API `expense-tracker-api`, tạo tài nguyên `/transactions` và `/transactions/{id}`, cấu hình Lambda Proxy Integration, kích hoạt CORS cho toàn bộ phương thức.<br>- Deploy API Gateway ra Stage `dev`, trích xuất Invoke URL công khai.<br>- Thực hiện kiểm thử độc lập 5 ca test (`TC-01` đến `TC-05`) qua Postman & cURL; kiểm tra đối soát dữ liệu trên bảng DynamoDB `Transactions`. | - Mã nguồn Lambda CRUD: [backend/functions/transactions/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/transactions/handler.py)<br>- Đường dẫn Invoke URL Stage `dev`: `https://amn08je3vj.execute-api.us-east-1.amazonaws.com/dev`<br>- Ảnh cấu hình Lambda Console: [screenshots/tuan2/lambda_config_console_01.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/lambda_config_console_01.png), [screenshots/tuan2/lambda_config_console_02.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/lambda_config_console_02.png)<br>- Ảnh cấu hình API Gateway Resources: [screenshots/tuan2/apigateway_resources.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/apigateway_resources.png)<br>- Ảnh API Gateway Stage `dev` & Invoke URL: [screenshots/tuan2/apigateway_stage_url.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/apigateway_stage_url.png)<br>- Ảnh kết quả test Postman: [screenshots/tuan2/postman_test_01.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/postman_test_01.png), [screenshots/tuan2/postman_test_02.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/postman_test_02.png)<br>- Ảnh đối soát dữ liệu bảng DynamoDB: [screenshots/tuan2/dynamodb_items.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/dynamodb_items.png) |
---
## II. CHI TIẾT CÔNG VIỆC VÀ LIÊN KẾT MINH CHỨNG CỤ THỂ TRÊN GITHUB

### 1. Hoàn thiện mã nguồn Lambda CRUD Transactions & Cơ chế An toàn Dữ liệu (SV2):
- Xây dựng hoàn chỉnh mã nguồn [backend/functions/transactions/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/transactions/handler.py) bằng Python 3.12 sử dụng thư viện `boto3`.
- **Hỗ trợ đầy đủ CORS Preflight:** Trả về header `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Methods` cho toàn bộ các response và xử lý phương thức `OPTIONS`.
- **Lớp `DecimalEncoder`:** Khắc phục triệt để lỗi `TypeError: Object of type Decimal is not JSON serializable` đặc thù của Amazon DynamoDB khi serialize JSON.
- **Tối ưu hóa Sort Key & URL Encoding:**
  - Hỗ trợ Sort Key định dạng chuẩn URL-Safe `TX_YYYY-MM-DDTHH:mm:ss_<uuid>`.
  - Tự động bóc tách và giải mã `urllib.parse.unquote()` cho các tham số đường dẫn `{id}`, giúp hỗ trợ tương thích ngược với các ID chứa ký tự `#` (`%23`).
- **Cơ chế Anti-Upsert:** Bổ sung `ConditionExpression="attribute_exists(transactionId)"` cho hai thao tác `PUT` và `DELETE` để đảm bảo hệ thống phản hồi `404 Not Found` thay vì vô tình tạo mới bản ghi rác khi client gửi nhầm ID.

### 2. Triển khai AWS Lambda Function `expense-transactions-service` (SV2):
- Khởi tạo hàm Lambda `expense-transactions-service` tại Region `us-east-1` với Runtime Python 3.12, kiến trúc `x86_64`.
- Phân quyền thực thi sử dụng IAM Role `LabRole` có sẵn của AWS Academy.
- Cấu hình Environment Variable: `TABLE_NAME=Transactions`.
- Điều chỉnh General Configuration: Tăng Timeout lên **10 giây** để chống timeout khi xảy ra Cold Start.
- Gắn thẻ Tags quản lý: `Project: ExpenseTracker`, `Owner: NguyenThanhThang`.
  - Link ảnh minh chứng cấu hình Lambda (phần 1): [screenshots/tuan2/lambda_config_console_01.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/lambda_config_console_01.png)
  - Link ảnh minh chứng cấu hình Lambda (phần 2): [screenshots/tuan2/lambda_config_console_02.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/lambda_config_console_02.png)

### 3. Thiết lập Amazon API Gateway REST API & Triển khai Stage `dev` (SV2):
- Khởi tạo REST API `expense-tracker-api` (Endpoint Type: Regional).
- Xây dựng cây tài nguyên chuẩn RESTful:
  - Resource `/transactions`:
    - Method `POST`: Tạo mới giao dịch (tích hợp Lambda Proxy Integration).
    - Method `GET`: Lấy danh sách giao dịch theo `userId`, hỗ trợ lọc tháng `month=YYYY-MM`.
  - Resource `/transactions/{id}`:
    - Method `GET`: Lấy chi tiết 1 giao dịch.
    - Method `PUT`: Cập nhật giao dịch.
    - Method `DELETE`: Xóa giao dịch.
- Kích hoạt **Enable CORS** cho cả hai tài nguyên `/transactions` và `/transactions/{id}`.
- Triển khai (Deploy) API lên Stage `dev` thành công:
  - **Invoke URL:** `https://amn08je3vj.execute-api.us-east-1.amazonaws.com/dev`
  - Link ảnh minh chứng cây tài nguyên API Gateway: [screenshots/tuan2/apigateway_resources.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/apigateway_resources.png)
  - Link ảnh minh chứng Stage `dev` và Invoke URL: [screenshots/tuan2/apigateway_stage_url.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/apigateway_stage_url.png)

### 4. Kiểm thử Độc lập REST API (Unit Testing) & Đối soát Dữ liệu DynamoDB (SV2):
- Thực hiện kiểm thử toàn bộ 5 ca kiểm thử độc lập bằng công cụ Postman:
  - **TC-01 (POST /transactions):** Tạo mới giao dịch chi tiêu ăn sáng `45000 VND` -> Kết quả trả về HTTP `201 Created`, bản ghi sinh Sort Key dạng `TX#2026-10-17T19:55:02#ac30df61`.
    - Link ảnh minh chứng Postman TC-01: [screenshots/tuan2/postman_test_01.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/postman_test_01.png)
  - **TC-02 (GET /transactions?userId=user_01):** Lấy danh sách giao dịch -> Kết quả HTTP `200 OK`.
  - **TC-03 (GET /transactions?userId=user_01&month=2026-10):** Lọc theo tháng bằng `begins_with` -> Kết quả HTTP `200 OK`.
  - **TC-04 (PUT /transactions/{id}):** Cập nhật số tiền từ `45000` lên `55000` và đổi mô tả -> Kết quả HTTP `200 OK`, `updatedAt` được làm mới.
    - Link ảnh minh chứng Postman TC-04: [screenshots/tuan2/postman_test_02.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/postman_test_02.png)
  - **TC-05 (DELETE /transactions/{id}):** Xóa giao dịch -> Kết quả HTTP `200 OK`.
- Đối soát trực tiếp trên AWS Management Console dịch vụ Amazon DynamoDB:
  - Mở bảng `Transactions`, mục **Explore table items**, xác nhận bản ghi của `user_01` đã được lưu trữ và cập nhật số tiền `55000` chính xác tuyệt đối.
  - Link ảnh minh chứng DynamoDB Items: [screenshots/tuan2/dynamodb_items.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/dynamodb_items.png)

### 5. Phát triển Mã nguồn Lambda OCR Receipt Processor với Amazon Textract (SV1):
- Hoàn thiện mã nguồn [backend/functions/ocr-processor/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/ocr-processor/handler.py) bóc tách dữ liệu hóa đơn tự động.
- **Bóc tách nghiệp vụ Textract `AnalyzeExpense`:** Tự động phát hiện và trích xuất 4 trường thông tin cốt lõi:
  - `VENDOR_NAME`: Tên nhà cung cấp / nhà hàng / cửa hàng.
  - `INVOICE_RECEIPT_DATE`: Ngày lập hóa đơn.
  - `TOTAL`: Tổng tiền thanh toán.
  - `TAX`: Tiền thuế (nếu có).
- **Thuật toán chuẩn hóa dữ liệu & Phân loại thông minh:**
  - `normalize_amount`: Xử lý phân cách dấu phẩy, dấu chấm, loại bỏ ký hiệu tiền tệ để đưa về số thực `Decimal` hợp lệ.
  - `normalize_date`: Nhận diện và quy đổi các định dạng ngày (`DD/MM/YYYY`, `YYYY-MM-DD`, `DD Mon YYYY`) về chuẩn ISO `YYYY-MM-DD`.
  - `infer_category`: Tự động nhận diện danh mục chi tiêu (`Food & Dining`, `Groceries`, `Transportation`, `Healthcare`, `Shopping`, `Utilities`) dựa trên từ khóa tên quán/nhà cung cấp.
- **Tối ưu hóa Sort Key & Đồng bộ 100% Schema với API CRUD (SV2):**
  - Sinh khóa sắp xếp URL-Safe `TX_YYYY-MM-DDTHH:mm:ss_<short_uuid>` (thay thế dấu `#` bằng `_` để an toàn trên REST API và trình duyệt web).
  - Đồng bộ đầy đủ các trường: `amount`, `currency`, `category`, `type`, `merchant`, `description`, `receiptUrl`, `ocrStatus` tương thích hoàn toàn với API của SV2.
- **Tích hợp kép lưu trữ & Tối ưu hóa truy vấn Athena:**
  - Tự động lưu bản ghi chuẩn hóa vào bảng DynamoDB `Transactions`.
  - Xuất bản ghi JSON phân tích vào S3 bucket Analytics `expense-analytics-data-24110286/transactions/`, trong đó ép kiểu tiền tệ sang số thực `float` để AWS Glue Crawler tự động suy diễn kiểu `double`, phục vụ tính toán các hàm tổng hợp `SUM(amount)` và `COUNT(*)` trên Amazon Athena.

### 6. Cấu hình S3 Event Notification Trigger & Lambda OCR Function (SV1):
- Khởi tạo hàm Lambda `ocr-receipt-processor` tại Region `us-east-1`, gán role `LabRole`, thiết lập timeout **30 giây** (đảm bảo đủ thời gian xử lý cho Textract).
- Cấu hình **S3 Event Notification** trên bucket `expense-raw-receipts-24110286`:
  - Event name: `ReceiptUploaded`
  - Event types: `All object create events` (`s3:ObjectCreated:*`)
  - Destination: Lambda function `ocr-receipt-processor`
  - Link ảnh minh chứng cấu hình S3 Event Notification: [screenshots/tuan2/S3_event_notification.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/S3_event_notification.png)
- Kiểm tra quá trình kích hoạt qua CloudWatch Logs:
  - Link ảnh minh chứng CloudWatch Log: [screenshots/tuan2/cloudWatch_log.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/cloudWatch_log.png)

### 7. Xây dựng Data Lake với AWS Glue & Thực thi Truy vấn trên Amazon Athena (SV1):
- **Khởi tạo và chạy AWS Glue Crawler:**
  - Tạo crawler `expense-analytics-crawler` trỏ nguồn dữ liệu vào `s3://expense-analytics-data-24110286/transactions/`.
  - Thiết lập IAM Role: `LabRole`, cơ sở dữ liệu đích trong Glue Data Catalog: `expense_analytics_db`.
  - Chạy crawler thành công trạng thái **`SUCCEEDED`**, tự động tạo bảng metadata `expense_analytics_data_24110286` (Partitioned).
  - Link ảnh minh chứng tạo crawler: [screenshots/tuan2/create_crawler.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/create_crawler.png)
  - Link ảnh minh chứng crawler chạy thành công: [screenshots/tuan2/crawler_success_start.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/crawler_success_start.png)
- **Truy vấn phân tích dữ liệu trên Amazon Athena:**
  - Thiết lập Query result location trỏ về S3 bucket analytics.
  - Chọn database `expense_analytics_db` và thực thi truy vấn SQL trích xuất thành công dữ liệu hóa đơn:
    - User ID: `24110286`
    - Transaction ID: `TX#2026-10-17T15:22:13#1e54ea5e-6b45-44a0-96a0-b2f968c486ea`
    - Vendor: `Nha hang Phot Ly Quoc Su`
    - Date: `2025-05-08`
    - Total: `120000` (VND)
    - Thời gian thực thi truy vấn: `944 ms`, dung lượng quét: `0.40 KB`.
  - Link ảnh minh chứng kết quả truy vấn Athena: [screenshots/tuan2/Sql_amazon_authena.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/Sql_amazon_authena.png)
- **Đối soát dữ liệu tự động ghi vào DynamoDB:**
  - Bản ghi bóc tách từ hóa đơn tự động xuất hiện trên bảng `Transactions` với đầy đủ thông tin bóc tách.
  - Link ảnh minh chứng bảng DynamoDB có bản ghi mới: [screenshots/tuan2/data_Auto_update .png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/data_Auto_update%20.png)

---
## III. MINH CHỨNG LỊCH SỬ COMMIT TRÊN GITHUB
Toàn bộ tiến độ công việc Tuần 2 được thể hiện minh bạch, liên tục qua các Git commit trên nhánh `main`:
- Link xem toàn bộ lịch sử commit: [Lịch sử Commit Tuần 2](https://github.com/Lypfy/aws-expense-tracker/commits/main)

**Các commit chính của từng thành viên trong Tuần 2:**
1. **Sinh viên 2 (Nguyễn Thành Thắng):**
   - [`ad2ed34`](https://github.com/Lypfy/aws-expense-tracker/commit/ad2ed344621f61a4a5b202df6d0e6f1bd1108c87): `feat(transactions): implement full CRUD DynamoDB handler with CORS and Decimal serialization (Nguyen Thanh Thang - 24110332)`
   - [`2c0b830`](https://github.com/Lypfy/aws-expense-tracker/commit/2c0b830d69e33d733f14cce7a638347b754d474a): `add week 2 test screenshots for API Gateway and DynamoDB (Nguyen Thanh Thang - 24110332)`

2. **Sinh viên 1 (Lê Trọng Nghĩa):**
   - [`07b954e`](https://github.com/Lypfy/aws-expense-tracker/commit/07b954edebc8af3240f6ca252f958fe98d29ae23): `Khởi tạo code xử lý sự kiện S3, gọi SDK boto3 Textract AnalyzeExpense bóc tách trường thông tin.`
   - [`d96c064`](https://github.com/Lypfy/aws-expense-tracker/commit/d96c0649fb7d2350397d0bbbf746237daa6b52e6): `Ảnh S3 Event Notification Trigger.`
   - [`0d0474f`](https://github.com/Lypfy/aws-expense-tracker/commit/0d0474ff2b721f6a549a4e073594ce62a02c0ec4): `Ảnh S3 Event Notification Trigger`
   - [`74385aa`](https://github.com/Lypfy/aws-expense-tracker/commit/74385aa5c86af6c8391f36830b7ae04de68d5b17): `Ảnh tạo crawler thành công`
   - [`d2930e8`](https://github.com/Lypfy/aws-expense-tracker/commit/d2930e8b8f3ee9090aedf622c9115aac19a68887): `Ảnh CloudWatch Logs ghi nhận Textract bóc tách thành công`
   - [`f6ef0d9`](https://github.com/Lypfy/aws-expense-tracker/commit/f6ef0d9dedc912e0e173b4cd0a27dcb9ac1534f7): `Ảnh AWS Glue Crawler chạy thành công`
   - [`383f8fd`](https://github.com/Lypfy/aws-expense-tracker/commit/383f8fdb0cf0f13a1a56bdf4cf6e33210031b979): `Ảnh kết quả truy vấn SQL trên Amazon Athena.`
   - [`718b903`](https://github.com/Lypfy/aws-expense-tracker/commit/718b903d345c3907ae507c73c2fc6889867d8752): `dữ liệu tự động cập nhật vào DynamoDB`
   - [`9bde5c3`](https://github.com/Lypfy/aws-expense-tracker/commit/9bde5c385a3c629d247f77c78ed297f55d7055f8): `Hoàn thiện code xử lý sự kiện S3, gọi SDK boto3 Textract AnalyzeExpense bóc tách trường thông tin (Tối ưu categorization, schema DynamoDB và xuất dữ liệu S3 Analytics).`

---
## IV. KHAI BÁO SỬ DỤNG CÔNG CỤ AI / LLM & MINH CHỨNG CHỈNH SỬA
Tuân thủ nghiêm ngặt quy chế môn học về việc minh bạch khi ứng dụng AI (kèm đối chiếu minh chứng chỉnh sửa qua link file và commit):

### 1. Gemini (Gemini 3.8 Flash)
- **Prompt:** "Hỗ trợ xây dựng hàm Lambda Python bằng boto3 để xử lý sự kiện S3 Event Notification khi người dùng tải ảnh hóa đơn lên S3. Sử dụng Amazon Textract AnalyzeExpense để bóc tách các trường: tên người bán, ngày giao dịch, tổng tiền, thuế; sau đó lưu dữ liệu vào bảng DynamoDB Transactions và đồng thời xuất bản ghi JSON vào S3 Analytics bucket."
- **AI tạo ra:** Cấu trúc mã nguồn cơ bản xử lý sự kiện `event['Records']`, đoạn gọi API `analyze_expense` và cấu trúc bóc tách `SummaryFields`.
- **SV đã sửa (Lê Trọng Nghĩa - SV1):** 
  - Bổ sung các hàm kiểm tra và chuẩn hóa dữ liệu phức tạp `normalize_amount` và `normalize_date` để xử lý các dạng hóa đơn tiếng Việt có dấu phân cách tiền tệ khác nhau.
  - Bổ sung cơ chế giải mã URL `urllib.parse.unquote_plus` khi lấy tên object key từ S3 event.
  - Xây dựng hàm `infer_category` phân loại danh mục tự động từ tên nhà cung cấp để hỗ trợ Athena chạy aggregation `GROUP BY category`.
  - Tối ưu hóa định dạng Sort Key URL-Safe `TX_YYYY-MM-DDTHH:mm:ss_<uuid>` đồng bộ 100% với CRUD API của SV2.
  - Chuyển đổi kiểu dữ liệu tiền tệ `Decimal -> float` khi xuất JSON vào S3 Analytics để AWS Glue Crawler tự động nhận diện kiểu số thực `double`, cho phép tính toán trực tiếp qua `SUM()` và `AVG()`.
  - Lọc bỏ các giá trị `None` trước khi ghi vào DynamoDB để tránh lỗi schema.
  - Trực tiếp cấu hình S3 Event Notification Trigger trên bucket `expense-raw-receipts-24110286` và chạy kiểm thử thực tế.
- **Minh chứng qua file & commit:**
  - File mã nguồn: [backend/functions/ocr-processor/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/ocr-processor/handler.py)
  - Commit khởi tạo: [`07b954e`](https://github.com/Lypfy/aws-expense-tracker/commit/07b954edebc8af3240f6ca252f958fe98d29ae23)
  - Commit hoàn thiện và tối ưu: [`9bde5c3`](https://github.com/Lypfy/aws-expense-tracker/commit/9bde5c385a3c629d247f77c78ed297f55d7055f8)

### 2. Claude (Claude 3.5 Sonnet)
- **Prompt:** "Làm thế nào để xử lý REST routing cho 5 nghiệp vụ CRUD trong một hàm AWS Lambda duy nhất khi kết nối với Amazon API Gateway (Lambda Proxy Integration)? Hướng dẫn xử lý lỗi serialize Decimal của DynamoDB và cách thiết kế Sort Key phân cấp để query theo tháng hiệu quả."
- **AI tạo ra:** Mẫu code router dựa trên `httpMethod` và `resource`, gợi ý triển khai lớp `DecimalEncoder(json.JSONEncoder)`, gợi ý định dạng Sort Key có tiền tố thời gian.
- **SV đã sửa (Nguyễn Thành Thắng - SV2):**
  - Điều chỉnh định dạng Sort Key thành `TX_YYYY-MM-DDTHH:mm:ss_<uuid>` sử dụng dấu gạch dưới `_` thay cho dấu thăng `#` để đảm bảo an toàn tuyệt đối khi truyền qua URL (tránh bị trình duyệt xem là hashtag fragment).
  - Viết thêm logic tự động decode URL `urllib.parse.unquote` để tương thích ngược với dữ liệu cũ.
  - Bổ sung `ConditionExpression="attribute_exists(transactionId)"` để chống cập nhật ngoài ý muốn (Anti-Upsert).
  - Tự cấu hình API Gateway Console và kiểm thử toàn bộ 5 endpoints trên Postman.
- **Minh chứng qua file & commit:**
  - File mã nguồn: [backend/functions/transactions/handler.py](https://github.com/Lypfy/aws-expense-tracker/blob/main/backend/functions/transactions/handler.py)
  - Commit minh chứng của SV2: [feat(transactions): implement full CRUD DynamoDB handler with CORS and Decimal serialization](https://github.com/Lypfy/aws-expense-tracker/commit/ad2ed344621f61a4a5b202df6d0e6f1bd1108c87)

### 3. Amazon Q Developer
- **Prompt:** "How to configure AWS Glue Crawler to crawl partitioned JSON files generated from Lambda in S3 bucket, and how to setup Athena query result location without permission errors in AWS Academy Learner Lab?"
- **AI tạo ra:** Hướng dẫn các bước tạo Crawler, gán IAM role `LabRole`, chọn target database và cách cấu hình `Query result location` trong tab Settings của Amazon Athena.
- **SV đã sửa (Lê Trọng Nghĩa - SV1):**
  - Thực hiện trực tiếp trên AWS Glue Console: tạo crawler `expense-analytics-crawler`, trỏ chính xác đường dẫn S3 prefix `transactions/`, thiết lập database `expense_analytics_db`.
  - Chạy crawler thành công sang trạng thái `SUCCEEDED`, đối soát metadata table `expense_analytics_data_24110286`.
  - Cấu hình thư mục lưu kết quả Athena tại `s3://expense-analytics-data-24110286/athena-results/` và chạy câu lệnh SQL phân tích thực tế thành công.
- **Minh chứng qua file & commit:**
  - Ảnh tạo crawler: [screenshots/tuan2/create_crawler.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/create_crawler.png)
  - Ảnh crawler thành công: [screenshots/tuan2/crawler_success_start.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/crawler_success_start.png)
  - Ảnh truy vấn Athena: [screenshots/tuan2/Sql_amazon_authena.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/Sql_amazon_authena.png)
  - Commit của SV1: [Ảnh kết quả truy vấn SQL trên Amazon Athena](https://github.com/Lypfy/aws-expense-tracker/commit/383f8fdb0cf0f13a1a56bdf4cf6e33210031b979)

### 4. ChatGPT (GPT-5)
- **Prompt:** "Hỗ trợ viết kịch bản kiểm thử Postman cho 5 API endpoints CRUD chi tiêu cá nhân qua Amazon API Gateway. Hướng dẫn thiết lập header CORS chuẩn để sau này tích hợp giao diện Frontend không bị chặn Cross-Origin Request."
- **AI tạo ra:** Danh sách các header CORS khuyến nghị (`Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Methods`) và bộ dữ liệu JSON test mẫu.
- **SV đã sửa (Nguyễn Thành Thắng - SV2):**
  - Tích hợp chuẩn xác các headers CORS vào hàm `build_response` trong Lambda backend.
  - Trực tiếp bật tính năng **Enable CORS** trên cả hai resource `/transactions` và `/transactions/{id}` trên Amazon API Gateway Console.
  - Xây dựng 5 kịch bản test thực tế trên Postman, đối soát dữ liệu với các giao dịch thực tế của cá nhân và chụp lại minh chứng kết quả trả về mã trạng thái `201 Created` và `200 OK`.
- **Minh chứng qua file & commit:**
  - File đặc tả API: [docs/api/transactions-api.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/api/transactions-api.md)
  - Ảnh test Postman: [screenshots/tuan2/postman_test_01.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/postman_test_01.png), [screenshots/tuan2/postman_test_02.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan2/postman_test_02.png)
  - Commit của SV2: [add week 2 test screenshots for API Gateway and DynamoDB](https://github.com/Lypfy/aws-expense-tracker/commit/2c0b830d69e33d733f14cce7a638347b754d474a)
