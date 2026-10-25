# BÁO CÁO TIẾN ĐỘ TUẦN 3 - NHÓM CAPSTONE
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
| **Lê Trọng Nghĩa**<br>(MSSV: 24110286) | SV1 | **8.5h** | - Cấu hình S3 Bucket CORS trên bucket `expense-raw-receipts-24110286` cho phép Web Client upload trực tiếp qua HTTP PUT/POST.<br>- Chỉnh sửa và hoàn thiện logic tải ảnh hóa đơn từ Web UI (`frontend/js/api.js` và `frontend/index.html`), kiểm thử luồng upload tự động kích hoạt Lambda `ocr-receipt-processor` Textract và đồng bộ bản ghi vào DynamoDB `Transactions`.<br>- Thiết lập Amazon CloudWatch Alarm (`OCR-Processor-Errors-Alarm`) giám sát lỗi hàm Lambda OCR khi `Errors >= 1` trong chu kỳ 1 phút; tích hợp widget theo dõi cảnh báo vào CloudWatch Dashboard chung.<br>- Xây dựng và thực thi 5 câu truy vấn SQL phân tích nâng cao trên Amazon Athena (chi tiêu theo danh mục, theo tháng, theo tuần, theo nhà cung cấp, và tìm hóa đơn có giá trị cao nhất).<br>- Soạn thảo template CloudFormation cho Data Lake (`infrastructure/data-lake-template.yaml`) mô tả S3 Analytics Bucket và Glue Data Catalog Database; kiểm tra cú pháp hợp lệ bằng lệnh validate. | - Cấu hình S3 CORS: [screenshots/tuan3/sharing_cors_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/sharing_cors_success.png)<br>- Upload hóa đơn từ Web UI: [screenshots/tuan3/upload_receipts_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/upload_receipts_success.png)<br>- DynamoDB cập nhật bản ghi OCR: [screenshots/tuan3/update_table_transaction.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/update_table_transaction.png)<br>- CloudWatch Logs ghi nhận Textract: [screenshots/tuan3/cloudWatch_log_receipts.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/cloudWatch_log_receipts.png)<br>- CloudWatch Alarm cấu hình thành công: [screenshots/tuan3/create_alarm.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/create_alarm.png)<br>- Theo dõi cảnh báo trên Dashboard: [screenshots/tuan3/expense_tracker_dashboard.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/expense_tracker_dashboard.png)<br>- Kết quả SQL Athena (Category): [screenshots/tuan3/spending_by_category.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/spending_by_category.png)<br>- Kết quả SQL Athena (Month): [screenshots/tuan3/spending_by_month.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/spending_by_month.png)<br>- Kết quả SQL Athena (Week): [screenshots/tuan3/spending_by_week.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/spending_by_week.png)<br>- Kết quả SQL Athena (Vendor): [spending_by_vendor.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/spending_by_vendor.png)<br>- Hóa đơn chi tiêu cao nhất: [screenshots/tuan3/highest_receipt.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/highest_receipt.png)<br>- Template Data Lake: [infrastructure/data-lake-template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/infrastructure/data-lake-template.yaml)<br>- Validate template Data Lake: [screenshots/tuan3/template_valid.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/template_valid.png) |
| **Nguyễn Thành Thắng**<br>(MSSV: 24110332) | SV2 | **8.5h** | - Thiết kế và xây dựng hoàn chỉnh giao diện Frontend Web Client Single Page Application (HTML5/CSS3/JavaScript ES6 thuần) kết nối trực tiếp với API Gateway REST API Stage `dev` qua Fetch API.<br>- Tách 2 view mạch lạc: Tổng quan (`viewOverview`) và Lịch sử (`viewHistory`); tối ưu UX/UI: bỏ nhãn tháng/năm ở phụ đề, bỏ tổng chi ở đầu bảng (chỉ hiển thị `X giao dịch`), đồng bộ top 3 thẻ metric theo đúng DB (`Food & Dining`, `Groceries`, `Transportation`), tích hợp biểu đồ đa đường SVG và Sparklines theo ngày.<br>- Thiết kế Modal thêm chi tiêu thông minh: phân tách rõ luồng tải hóa đơn lên S3 trực tiếp qua HTTP PUT (xử lý bất đồng bộ) và luồng nhập thủ công có validation.<br>- Hiện thực hóa Infrastructure as Code (IaC) theo chỉ đạo của GVHD: Viết template [template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/template.yaml) mô tả DynamoDB Table và REST API Gateway; khắc phục lỗi xung đột tài nguyên và triển khai thành công Stack `expense-tracker-iac-v2` (`CREATE_COMPLETE`).<br>- Thiết lập Amazon CloudWatch Dashboard `ExpenseTracker-Dashboard-24110332` với 3 widget đo lường hiệu năng: Requests/Errors, Average Latency và Lambda Invocations/Duration; áp dụng kỹ thuật Trục tung kép (Dual-Axis) phân tách thang đo thời gian và số lượng.<br>- Kiểm thử liên thông End-to-End toàn hệ thống từ Web UI vào AWS Cloud. | - Mã nguồn Web Frontend: [frontend/](https://github.com/Lypfy/aws-expense-tracker/tree/main/frontend)<br>- Ảnh giao diện Tổng quan Web UI: [screenshots/tuan3/web_ui_overview.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/web_ui_overview.png)<br>- Ảnh Modal thêm giao dịch & upload S3: [screenshots/tuan3/web_ui_add_transaction.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/web_ui_add_transaction.png)<br>- Template CloudFormation IaC: [template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/template.yaml)<br>- Ảnh Stack CloudFormation tạo thành công: [screenshots/tuan3/cloudformation_stack_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/cloudformation_stack_success.png)<br>- Ảnh CloudWatch Dashboard hệ thống: [screenshots/tuan3/cloudwatch_dashboard.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/cloudwatch_dashboard.png)

---

## II. CHI TIẾT CÔNG VIỆC VÀ LIÊN KẾT MINH CHỨNG CỤ THỂ TRÊN GITHUB

### 1. Xây dựng Giao diện Web Frontend Single Page Application (SV2):
- **Kiến trúc & Công nghệ:** 
  - Triển khai mã nguồn trong thư mục [frontend/](https://github.com/Lypfy/aws-expense-tracker/tree/main/frontend) bằng HTML5, CSS3 hiện đại và JavaScript ES6 thuần kết hợp Fetch API.
  - Không sử dụng các framework nặng (React/Vue) hay runtime Node.js nhằm đảm bảo tính gọn nhẹ, mở là chạy ngay trên trình duyệt mà không cần cài đặt môi trường.
- **Tách 2 View chức năng chuyên biệt:**
  - **Trang Tổng quan (`viewOverview`):**
    - Phụ đề tinh tế: *"Theo dõi và phân tích chi tiêu thông minh"*.
    - Top 3 Thẻ Metric chuẩn hóa theo danh mục thực tế của database: `Food & Dining`, `Groceries` (sử dụng icon xe đẩy siêu thị shopping-cart), `Transportation`.
    - Biểu đồ đa đường (`monthlyTrendChart`) & Sparklines: Vẽ động số tiền chi tiêu theo từng ngày trong tháng, hỗ trợ hover snap hiển thị số tiền mà không thay đổi con trỏ chuột.
    - Thẻ phân bổ tỷ trọng chi tiêu và danh sách các khoản chi tiêu mới nhất.
    - Link ảnh minh chứng Web UI Tổng quan: [screenshots/tuan3/web_ui_overview.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/web_ui_overview.png)
  - **Trang Lịch sử giao dịch (`viewHistory`):**
    - Phụ đề hiển thị chính xác số lượng: `X giao dịch` (đã bỏ phần tổng chi ở đầu bảng để giao diện thoáng đãng).
    - Toolbar đầu trang trang bị bộ lọc theo danh mục chuẩn Database kết hợp bộ chọn ngày Windows Calendar Picker (`<input type="date">`).
    - Bảng chi tiêu hiển thị chi tiết: Ngày, Nhà cung cấp/Cửa hàng, Danh mục, Nguồn chi tiêu (Huy hiệu xanh `Thủ công` hoặc huy hiệu tím `🤖 OCR Textract`), Số tiền (₫), và nút Xóa (`DELETE`).
- **Modal Thêm chi tiêu thông minh:**
  - Phân tách rõ 2 luồng: Phía trên là vùng tải ảnh hóa đơn trực tiếp lên Amazon S3 qua HTTP PUT (xử lý bất đồng bộ, tự động đóng modal và tải lại bảng sau 2.5 giây); phía dưới là Form nhập thủ công có kiểm tra ràng buộc dữ liệu đầu vào (Input Validation) và định dạng tiền tệ VND (`toLocaleString('vi-VN') + ' ₫'`).
  - Link ảnh minh chứng Modal Thêm giao dịch: [screenshots/tuan3/web_ui_add_transaction.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/web_ui_add_transaction.png)

### 2. Hiện thực hóa Infrastructure as Code (IaC) với AWS CloudFormation (SV2):
- **Bám sát chỉ đạo của GVHD ThS. Huỳnh Xuân Phụng:** *"làm thật một SAM/CloudFormation template nhỏ cho stack hiện tại (không chỉ đọc tài liệu) — vào tuần 4 viết báo cáo tổng kết và demo em sẽ chủ động hơn nhiều."*
- **Soạn thảo file template [template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/template.yaml):**
  - Khai báo Parameters: `ProjectName` (Default: `ExpenseTracker`), `Environment` (Default: `dev`), `LabRoleArn` (`arn:aws:iam::2593-5119-2274:role/LabRole`).
  - Khai báo Resources:
    - `TransactionsTable`: Định nghĩa bảng DynamoDB `Transactions-IaC-Test`, chế độ dung lượng `PAY_PER_REQUEST` (On-Demand), Partition Key `userId` (String), Sort Key `transactionId` (String).
    - `ExpenseTrackerApi`: Định nghĩa REST API Gateway `expense-tracker-api-iac` kiểu `REGIONAL`.
  - Khai báo Tags quản trị: `Project: !Ref ProjectName`, `Owner: NguyenThanhThang`.
  - Khai báo Outputs: Trích xuất `DynamoDBTableName` và `ApiGatewayRestApiId`.
- **Xử lý xung đột tài nguyên & Triển khai thực tế trên AWS Console:**
  - Phát hiện và xử lý lỗi `Resource name conflict` do tên bảng `Transactions` đã tồn tại từ Tuần 1 $\rightarrow$ Đổi tên bảng thành `Transactions-IaC-Test` và API thành `expense-tracker-api-iac`.
  - Khởi tạo Stack `expense-tracker-iac-v2` thành công, đạt trạng thái màu xanh **`CREATE_COMPLETE`**.
  - Link ảnh minh chứng CloudFormation Stack thành công: [screenshots/tuan3/cloudformation_stack_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/cloudformation_stack_success.png)

### 3. Thiết lập Amazon CloudWatch Dashboard Giám sát Hệ thống (SV2):
- **Khởi tạo Dashboard:** `ExpenseTracker-Dashboard-24110332` tại Region `us-east-1` kèm tags `Project: ExpenseTracker`, `Owner: NguyenThanhThang`.
- **Cấu hình 3 Widget biểu đồ theo dõi sức khỏe hệ thống (Đã tối ưu Period & Thang đo):**
  1. **Widget 1 (API Gateway - Requests & Errors):**
     - Namespace: `AWS/ApiGateway` $\rightarrow$ By Api Name: `expense-tracker-api`.
     - Metrics: `Count` (lưu lượng request), `4XXError` (lỗi client), `5XXError` (lỗi server).
     - Statistic: `Sum` | Period: **`5 minutes`** | Trục Y bên trái (`<` - Count).
     - Đánh giá: `Count` ghi nhận đầy đủ các đợt gọi API từ Web UI, trong khi `4XXError` và `5XXError` duy trì ở mức 0 chứng minh API Gateway hoạt động ổn định 100%.
  2. **Widget 2 (API Gateway - Average Latency):**
     - Namespace: `AWS/ApiGateway` $\rightarrow$ By Api Name: `expense-tracker-api`.
     - Metric: `Latency` (đo độ trễ phản hồi tính bằng ms).
     - Statistic: `Average` | Period: **`5 minutes`** | Trục Y bên trái (`<` - Milliseconds).
     - Đánh giá: Độ trễ dao động ổn định trong ngưỡng an toàn 80ms – 250ms khi hệ thống đã ấm (warm).
  3. **Widget 3 (Lambda Transactions Service - Invocations & Duration - Kỹ thuật Dual Axis):**
     - Namespace: `AWS/Lambda` $\rightarrow$ By Function Name: `expense-transactions-service`.
     - Metrics: `Duration`, `Invocations`, `Errors`.
     - **Tối ưu hóa trục tung kép (Dual-Axis):**
       - Trục Y bên trái (`<` - Milliseconds): Dành riêng cho `Duration` (Statistic: `Average`, dao động 80ms – 352ms).
       - Trục Y bên phải (`>` - Count): Dành cho `Invocations` và `Errors` (Statistic: `Sum`, dao động 1 – 11 lượt).
     - Period: **`5 minutes`**.
     - *Giải pháp kỹ thuật:* Khắc phục triệt để hiện tượng đường `Invocations` bị đè bẹp sát đáy số 0 do chênh lệch thang đo hàng trăm lần với `Duration`, đồng thời cho phép phân tích trực quan mối tương quan giữa lưu lượng gọi hàm và thời gian thực thi.
- Link ảnh minh chứng CloudWatch Dashboard: [screenshots/tuan3/cloudwatch_dashboard.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/cloudwatch_dashboard.png)

### 4. Tích hợp Tải Hóa đơn lên Amazon S3 & Xử lý OCR Tự động (SV1):
- **Cấu hình S3 Bucket CORS:**
  - Thiết lập cấu hình CORS trên S3 bucket `expense-raw-receipts-24110286`: Cho phép phương thức `GET`, `PUT`, `POST` và header `*` từ mọi Origin (`*`) để Web UI trình duyệt có thể gửi file ảnh trực tiếp lên bucket mà không bị chặn chính sách Same-Origin.
  - Link ảnh minh chứng cấu hình S3 CORS: [screenshots/tuan3/sharing_cors_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/sharing_cors_success.png)
- **Tích hợp Web Client Upload:**
  - Hoàn thiện module gọi API tải file tại `frontend/js/api.js` và `frontend/index.html`.
  - Khi người dùng chọn file ảnh, Web client đẩy thẳng file lên S3 prefix `receipts/` $\rightarrow$ Kích hoạt S3 Event Notification gọi Lambda `ocr-receipt-processor`.
  - Link ảnh minh chứng upload thành công từ Web UI: [screenshots/tuan3/upload_receipts_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/upload_receipts_success.png)
- **Đối soát Dữ liệu Tự động Cập nhật:**
  - Bảng DynamoDB `Transactions` tự động ghi nhận bản ghi bóc tách từ hóa đơn mới với đầy đủ các trường `amount`, `vendor`, `category`, `receiptUrl` và gắn Sort Key URL-Safe.
  - CloudWatch Logs của Lambda ghi nhận quá trình bóc tách thành công từ Amazon Textract `AnalyzeExpense`.
  - Link ảnh minh chứng DynamoDB cập nhật: [screenshots/tuan3/update_table_transaction.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/update_table_transaction.png)
  - Link ảnh minh chứng CloudWatch Logs ghi nhận Textract: [screenshots/tuan3/cloudWatch_log_receipts.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/cloudWatch_log_receipts.png)

### 5. Thiết lập Amazon CloudWatch Alarm cho Lambda OCR (SV1):
- **Cấu hình CloudWatch Alarm (`OCR-Processor-Errors-Alarm`):**
  - Dịch vụ: `AWS/Lambda` $\rightarrow$ FunctionName: `ocr-receipt-processor` $\rightarrow$ Metric: `Errors`.
  - Ngưỡng kích hoạt: `Errors >= 1` trong chu kỳ `1 minute`.
  - Trạng thái kiểm soát: Tự động chuyển sang `In alarm` khi hàm Lambda gặp lỗi bóc tách hóa đơn hoặc quá tải thời gian thực thi.
  - Link ảnh minh chứng tạo Alarm thành công: [screenshots/tuan3/create_alarm.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/create_alarm.png)
- **Tích hợp cảnh báo lên Dashboard:**
  - Đưa widget trạng thái của Alarm vào Dashboard giám sát chung của nhóm, giúp quan sát nhanh tình trạng lỗi của toàn bộ các hàm backend.
  - Link ảnh minh chứng theo dõi cảnh báo trên Dashboard: [screenshots/tuan3/expense_tracker_dashboard.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/expense_tracker_dashboard.png)

### 6. Mở rộng Truy vấn Phân tích Nâng cao trên Amazon Athena (SV1):
Thực thi 5 câu truy vấn SQL phân tích dữ liệu chuyên sâu trên database `expense_analytics_db` phục vụ báo cáo quản trị chi tiêu:
1. **Phân tích tổng chi tiêu theo từng danh mục (Category):**
   - Câu lệnh: `SELECT category, COUNT(*) as count, SUM(amount) as total FROM "expense_analytics_db"."expense_analytics_data_24110286" GROUP BY category ORDER BY total DESC;`
   - Link ảnh minh chứng kết quả: [screenshots/tuan3/spending_by_category.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/spending_by_category.png)
2. **Phân tích chi tiêu theo tháng (Month):**
   - Link ảnh minh chứng kết quả: [screenshots/tuan3/spending_by_month.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/spending_by_month.png)
3. **Phân tích chi tiêu theo tuần (Week):**
   - Link ảnh minh chứng kết quả: [screenshots/tuan3/spending_by_week.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/spending_by_week.png)
4. **Phân tích chi tiêu theo nhà cung cấp / cửa hàng (Vendor):**
   - Link ảnh minh chứng kết quả: [spending_by_vendor.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/spending_by_vendor.png)
5. **Tìm kiếm hóa đơn có giá trị chi tiêu cao nhất (Highest Receipt):**
   - Link ảnh minh chứng kết quả: [screenshots/tuan3/highest_receipt.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/highest_receipt.png)

### 7. Xây dựng Template CloudFormation cho Data Lake (SV1):
- Soạn thảo file template [infrastructure/data-lake-template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/infrastructure/data-lake-template.yaml) mô tả S3 Analytics Bucket (`expense-analytics-data-24110286`) và Glue Data Catalog Database (`expense_analytics_db`).
- Thực hiện kiểm tra tính hợp lệ cú pháp template (Validation) thành công trước khi áp dụng.
- Link file template: [infrastructure/data-lake-template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/infrastructure/data-lake-template.yaml)
- Link ảnh minh chứng validate template thành công: [screenshots/tuan3/template_valid.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/template_valid.png)

---

## III. MINH CHỨNG LỊCH SỬ COMMIT TRÊN GITHUB

Toàn bộ tiến độ công việc Tuần 3 được thể hiện minh bạch, liên tục qua các Git commit trên nhánh `main`:
- Link xem toàn bộ lịch sử commit: [Lịch sử Commit Tuần 3](https://github.com/Lypfy/aws-expense-tracker/commits/main)

**Các commit chính của từng thành viên trong Tuần 3:**
1. **Sinh viên 2 (Nguyễn Thành Thắng - 24110332):**
   - [`275c53b`](https://github.com/Lypfy/aws-expense-tracker/commit/275c53b7c2612501ab157aea5b9c34288d8e9aa1): `xây dựng giao diện Web`
   - [`abacffc`](https://github.com/Lypfy/aws-expense-tracker/commit/abacffc2394f2ae08fdb73bf94bb546c3e9393f8): `upload iac template`
   - [`57d873a`](https://github.com/Lypfy/aws-expense-tracker/commit/57d873a367028fa2a4ded3fdda14b1e29c8437fd): `Upload ảnh minh chứng`

2. **Sinh viên 1 (Lê Trọng Nghĩa - 24110286):**
   - [`72a49df`](https://github.com/Lypfy/aws-expense-tracker/commit/72a49df81b9f797cb11097989255add86d706ea3): `chỉnh sửa API để upload hóa đơn`
   - [`abf69d9`](https://github.com/Lypfy/aws-expense-tracker/commit/abf69d9b99dc3215ee7830de5f5a486acc566482): `Merge branch 'main' of https://github.com/Lypfy/aws-expense-tracker`
   - [`03facda`](https://github.com/Lypfy/aws-expense-tracker/commit/03facda0f2941ffbcec33678dfd9544fae24bd74): `Add Data Lake CloudFormation template`
   - [`b9eae9d`](https://github.com/Lypfy/aws-expense-tracker/commit/b9eae9d90c5c83ccf554245f5d4ca68fe58d25fb): `Ảnh cấu hình S3 Bucket CORS cho phép upload từ trình duyệt.`
   - [`4c93fbf`](https://github.com/Lypfy/aws-expense-tracker/commit/4c93fbfa7e2dc3b50a1696d850542d26c34a4571): `upload hóa đơn thành công từ trình duyệt`
   - [`2e3a0da`](https://github.com/Lypfy/aws-expense-tracker/commit/2e3a0dac37371b066eaa88a24faaca7ec029a2c9): `các hóa đơn tự động cập nhật trên bảng transaction`
   - [`249d422`](https://github.com/Lypfy/aws-expense-tracker/commit/249d422ab3c1a646416a9ff9f14b449c9bde67ee): `cloudWatch_log ghi nhận quá trình cập nhật thành công`
   - [`093d3d3`](https://github.com/Lypfy/aws-expense-tracker/commit/093d3d3b3d79eb7ed401c0d7e495c3344500dee1): `create alarm thành công`
   - [`a5c51ee`](https://github.com/Lypfy/aws-expense-tracker/commit/a5c51eeaacb8a8b507e0065cacb3fd56316a5f84): `theo dõi cảnh báo trên dashboard`
   - [`275e0c8`](https://github.com/Lypfy/aws-expense-tracker/commit/275e0c8e37b95a306c9c3db0151071a9cf7f1e12): `Ảnh kết quả các câu truy vấn SQL nâng cao trên Amazon Athena.`
   - [`c63ac2b`](https://github.com/Lypfy/aws-expense-tracker/commit/c63ac2bd1eb24cb0f1416cec52f7b066098d14ef): `Ảnh kết quả các câu truy vấn SQL nâng cao trên Amazon Athena.`
   - [`21c2588`](https://github.com/Lypfy/aws-expense-tracker/commit/21c258852b26f70d4320f973b305791af8bd9360): `Ảnh kết quả các câu truy vấn SQL nâng cao trên Amazon Athena.`
   - [`e4ebc92`](https://github.com/Lypfy/aws-expense-tracker/commit/e4ebc9227a69cad41dba36aeac805a87ebca539e): `Ảnh kết quả các câu truy vấn SQL nâng cao trên Amazon Athena.`
   - [`a075244`](https://github.com/Lypfy/aws-expense-tracker/commit/a0752449c2e57c478855f012653064973bf96800): `Add files via upload`
   - [`474e22f`](https://github.com/Lypfy/aws-expense-tracker/commit/474e22fbc41d6987ef24d94a56e87916c7e469cc): `ảnh nội dung template và kết quả validate`

---

## IV. KHAI BÁO SỬ DỤNG CÔNG CỤ AI / LLM & MINH CHỨNG CHỈNH SỬA
Tuân thủ nghiêm ngặt quy chế môn học về việc minh bạch khi ứng dụng AI (kèm đối chiếu minh chứng chỉnh sửa qua link file và commit):

### 1. Claude (Claude 3.5 Sonnet) / Antigravity AI
- **Prompt:** "Hỗ trợ xây dựng giao diện Single-Page Application (HTML5/CSS3/Vanilla JS) kết nối trực tiếp với Amazon API Gateway REST API đã kích hoạt CORS. Yêu cầu phong cách Dark Theme hiện đại, hiển thị bảng dữ liệu, lọc theo tháng và modal thêm giao dịch có chức năng upload ảnh hóa đơn lên S3 trực tiếp qua HTTP PUT."
- **AI tạo ra:** Cấu trúc mã nguồn HTML cơ bản, các lớp CSS Dark Theme và đoạn mã Fetch API gọi REST API.
- **SV đã sửa (Nguyễn Thành Thắng - SV2):**
  - Tích hợp chuẩn xác Invoke URL của API Gateway Stage `dev` (`https://amn08je3vj.execute-api.us-east-1.amazonaws.com/dev`).
  - Tối ưu UX/UI: Loại bỏ nhãn tháng/năm ở phụ đề trang Tổng quan; bỏ tổng chi ở đầu bảng Lịch sử (chỉ giữ `X giao dịch`); chuẩn hóa Top 3 thẻ metric theo đúng Database (`Food & Dining`, `Groceries`, `Transportation`); viết thuật toán vẽ biểu đồ đa đường SVG và Sparklines theo ngày.
  - Xóa bỏ hoàn toàn logic mock AI tự điền form trong modal, chuyển sang luồng upload file ảnh thật lên S3 để Lambda OCR của SV1 xử lý bất đồng bộ.
  - Bổ sung định dạng tiền tệ VND (`toLocaleString('vi-VN') + ' ₫'`).
- **Minh chứng qua file & commit:**
  - Thư mục mã nguồn: [frontend/](https://github.com/Lypfy/aws-expense-tracker/tree/main/frontend)
  - Commit minh chứng: [`275c53b`](https://github.com/Lypfy/aws-expense-tracker/commit/275c53b7c2612501ab157aea5b9c34288d8e9aa1)

### 2. Gemini (Gemini 3.8 Flash)
- **Prompt:** "Hướng dẫn cấu hình S3 Bucket CORS cho phép ứng dụng Web Client từ trình duyệt tải trực tiếp ảnh hóa đơn lên S3 bucket mà không bị chặn lỗi Same-Origin Policy. Hướng dẫn viết các câu lệnh SQL nâng cao trên Amazon Athena để phân tích chi tiêu theo tháng, tuần và nhà cung cấp."
- **AI tạo ra:** Đoạn mã cấu hình JSON CORS chuẩn cho S3 và các mẫu câu lệnh SQL `GROUP BY` cơ bản.
- **SV đã sửa (Lê Trọng Nghĩa - SV1):**
  - Trực tiếp cấu hình S3 CORS trên console bucket `expense-raw-receipts-24110286`.
  - Tối ưu các câu lệnh SQL trên Athena để xử lý đúng kiểu dữ liệu bảng partitioned `expense_analytics_data_24110286`, thực thi thành công 5 kịch bản phân tích báo cáo và xuất kết quả chính xác.
- **Minh chứng qua file & commit:**
  - Ảnh cấu hình CORS: [screenshots/tuan3/sharing_cors_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan3/sharing_cors_success.png)
  - Các commit Athena: [`275e0c8`](https://github.com/Lypfy/aws-expense-tracker/commit/275e0c8e37b95a306c9c3db0151071a9cf7f1e12), [`c63ac2b`](https://github.com/Lypfy/aws-expense-tracker/commit/c63ac2bd1eb24cb0f1416cec52f7b066098d14ef), [`21c2588`](https://github.com/Lypfy/aws-expense-tracker/commit/21c258852b26f70d4320f973b305791af8bd9360), [`e4ebc92`](https://github.com/Lypfy/aws-expense-tracker/commit/e4ebc9227a69cad41dba36aeac805a87ebca539e), [`a075244`](https://github.com/Lypfy/aws-expense-tracker/commit/a0752449c2e57c478855f012653064973bf96800)

### 3. Amazon Q Developer
- **Prompt:** "How to write an AWS CloudFormation template (YAML) to define DynamoDB Table and API Gateway REST API within AWS Academy Learner Lab constraints (using existing LabRole)? How to set up CloudWatch Metric Graph with Dual-Axis for Duration and Invocations?"
- **AI tạo ra:** Cấu trúc mẫu file template CloudFormation và hướng dẫn sơ lược về CloudWatch.
- **SV đã sửa (Nguyễn Thành Thắng - SV2 & Lê Trọng Nghĩa - SV1):**
  - **SV2:** Xây dựng file [template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/template.yaml), xử lý lỗi xung đột tên bảng `Transactions` cũ bằng cách đổi sang `Transactions-IaC-Test`, đổi tên stack sang `expense-tracker-iac-v2` và deploy thành công trên Console đạt `CREATE_COMPLETE`. Tự tay cấu hình CloudWatch Dashboard với kỹ thuật Dual-Axis (trục tung kép) và điều chỉnh Period sang 5 phút để biểu đồ hiển thị mượt mà.
  - **SV1:** Soạn thảo template Data Lake [infrastructure/data-lake-template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/infrastructure/data-lake-template.yaml) mô tả S3 Analytics Bucket và Glue Database, thực hiện validate cú pháp thành công.
- **Minh chứng qua file & commit:**
  - File template: [template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/template.yaml), [infrastructure/data-lake-template.yaml](https://github.com/Lypfy/aws-expense-tracker/blob/main/infrastructure/data-lake-template.yaml)
  - Commits: [`abacffc`](https://github.com/Lypfy/aws-expense-tracker/commit/abacffc2394f2ae08fdb73bf94bb546c3e9393f8), [`03facda`](https://github.com/Lypfy/aws-expense-tracker/commit/03facda0f2941ffbcec33678dfd9544fae24bd74), [`474e22f`](https://github.com/Lypfy/aws-expense-tracker/commit/474e22fbc41d6987ef24d94a56e87916c7e469cc)

---

## V. KẾ HOẠCH THỰC HIỆN TUẦN 4 (TỔNG KẾT, DEMO & ĐÁNH GIÁ CUỐI KỲ)

Bám sát đúng yêu cầu trọng tâm của học phần cho giai đoạn kết thúc: *"Kiểm thử tổng thể, tối ưu chi phí, dọn dẹp tài nguyên, viết báo cáo và demo"*, nhóm phân bổ kế hoạch Tuần 4 (mỗi SV cam kết $\ge 8$ giờ) với 5 nhiệm vụ cụ thể:

1. **Kiểm thử Tổng thể Hệ thống (End-to-End System Testing):**
   - Thực hiện kiểm thử toàn diện kịch bản tích hợp liên thông qua toàn bộ 7 dịch vụ AWS trong đề tài: Web UI $\leftrightarrow$ API Gateway $\leftrightarrow$ Lambda CRUD $\leftrightarrow$ DynamoDB $\leftrightarrow$ S3 Bucket $\leftrightarrow$ Lambda OCR Textract $\leftrightarrow$ AWS Glue $\leftrightarrow$ Amazon Athena.
   - Kiểm tra các trường hợp biên (Edge Cases): tải file ảnh kích thước lớn, hóa đơn bị nghiêng/mờ, nhập sai định dạng dữ liệu để đánh giá cơ chế xử lý lỗi (Error Handling).

2. **Tối ưu hóa Chi phí & Lập Báo cáo Chi phí Sử dụng Cuối kỳ (Cost Report):**
   - Kiểm tra và tổng hợp báo cáo chi phí sử dụng thực tế trên AWS Billing / Cost Explorer trong suốt 4 tuần triển khai trên AWS Academy Learner Lab (bảo đảm nằm an toàn trong hạn mức tài trợ $50 credit).
   - Đánh giá hiệu quả chi phí của kiến trúc Serverless (mô hình Pay-per-request của DynamoDB, Lambda và S3 so với mô hình máy chủ EC2 truyền thống).

3. **Dọn dẹp Tài nguyên Môi trường Lab (Resource Cleanup):**
   - Rà soát toàn bộ tài nguyên theo đúng quy định Learner Lab: dừng/xóa các Stack CloudFormation thử nghiệm (`expense-tracker-iac-v2`), dọn dẹp các CloudWatch Logs tạm thời và các file rác phát sinh trong quá trình kiểm thử.
   - Bảo toàn các tài nguyên cốt lõi và dữ liệu chuẩn phục vụ cho buổi chấm thi và vấn đáp trực tiếp.

4. **Hoàn thiện Báo cáo Tổng kết Đồ án & Sản xuất Video Demo (≤ 10 phút):**
   - Soạn thảo tài liệu Báo cáo Tổng kết Đồ án hoàn chỉnh (`docs/BaoCaoTongKet.md`) kèm Sơ đồ Kiến trúc Hệ thống chi tiết (Architecture Diagram) phản ánh đúng hiện trạng triển khai thực tế.
   - Biên tập và ghi hình **Video Demo hoàn chỉnh có thời lượng $\le 10$ phút** minh họa rõ ràng: thao tác Web UI, chu trình OCR Textract tự động, bảng dữ liệu DynamoDB, CloudWatch Dashboard và các câu lệnh phân tích dữ liệu trên Amazon Athena.

5. **Ôn tập Chuẩn bị Đánh giá Vấn đáp Trực tuyến 15 phút (Quy chế Giảng viên):**
   - Hai sinh viên chủ động nắm vững toàn bộ kiến trúc hạ tầng, vai trò từng dịch vụ AWS, cấu hình IAM `LabRole`, các thẻ Tags quản lý và từng dòng mã nguồn đã viết (xử lý `DecimalEncoder`, Sort Key URL-Safe, Anti-Upsert `attribute_exists`, S3 CORS, CloudWatch Dual-Axis).
   - Đảm bảo trả lời độc lập, chính xác 100% bộ câu hỏi trắc nghiệm/tự luận trong bài test 15 phút trên hệ thống `projects-fit.hcmute.edu.vn` (chia sẻ màn hình, bật camera/mic, không dùng tài liệu và không sử dụng AI).

**Kết quả dự kiến đạt được:** Hoàn thành xuất sắc đồ án Serverless Expense Tracker đúng tiến độ 4 tuần, có đầy đủ video demo $\le 10$ phút, báo cáo chi phí minh bạch và đạt kết quả cao nhất trong buổi đánh giá cuối kỳ.
