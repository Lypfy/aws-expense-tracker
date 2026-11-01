# BÁO CÁO TIẾN ĐỘ TUẦN 4 - NHÓM CAPSTONE
- Học phần: Điện toán đám mây (Cloud Computing)
- Giảng viên hướng dẫn: ThS. Huỳnh Xuân Phụng
- Đề tài: Ứng dụng quản lý chi tiêu cá nhân với phân tích dữ liệu (Expense Tracker)
- Repository GitHub (Public): https://github.com/Lypfy/aws-expense-tracker
- Region triển khai: `us-east-1` (US East - N. Virginia)
- AWS Account ID: `2593-5119-2274`
- Video Demo sản phẩm hoàn chỉnh (Google Drive): [https://drive.google.com/file/d/1P0wc6t_vyj5OzbL0OTGyZ_y5o0ucI1Ti/view?usp=drive_link](https://drive.google.com/file/d/1P0wc6t_vyj5OzbL0OTGyZ_y5o0ucI1Ti/view?usp=drive_link)

---

## I. BẢNG PHÂN CÔNG CÔNG VIỆC VÀ THỜI GIAN LÀM VIỆC (≥ 8 GIỜ/SV)

| Thành viên | Vai trò | Số giờ | Công việc chi tiết đảm nhiệm | Sản phẩm minh chứng trên GitHub |
| :--- | :---: | :---: | :--- | :--- |
| **Lê Trọng Nghĩa**<br>(MSSV: 24110286) | SV1 | **8.5h** | - Kiểm thử chuyên sâu chu trình OCR Textract AnalyzeExpense với các mẫu hóa đơn thực tế và đánh giá độ chính xác.<br>- Tối ưu hóa truy vấn Amazon Athena trên S3 Data Lake, dọn dẹp các file kết quả `.csv` cũ trong thư mục `athena-results/`.<br>- Đối soát cấu trúc dữ liệu JSON phân vùng trên S3 Analytics và kiểm tra tính nhất quán của bảng Glue Data Catalog.<br>- Đóng góp nội dung phân tích Data Lake, Glue Data Catalog và quy trình bóc tách OCR vào Báo cáo Tổng kết.<br>- Tham gia ghi hình và thuyết minh phần trích xuất hóa đơn và Athena SQL trong Video Demo $\le 10$ phút. | - Ảnh kiểm thử tải hóa đơn lên S3: [screenshots/tuan4/test_upload_receipts_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/test_upload_receipts_success.png)<br>- Ảnh hóa đơn lưu tại S3 Raw: [screenshots/tuan4/recepts_in_s3_raw.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/recepts_in_s3_raw.png)<br>- Ảnh bản ghi JSON tại S3 Analytics: [screenshots/tuan4/recepts_in_s3_analysts.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/recepts_in_s3_analysts.png)<br>- Ảnh Lambda OCR thực thi: [screenshots/tuan4/function_lambda_sucess.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/function_lambda_sucess.png)<br>- Ảnh ước tính chi phí Data Lake: [screenshots/tuan4/my_etimate.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/my_etimate.png)<br>- Ảnh dọn dẹp tài nguyên thừa trên S3: [screenshots/tuan4/s3_analytics_cleanup.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/s3_analytics_cleanup.png)<br>- Minh chứng bóc tách OCR trên E2E: [screenshots/tuan4/e2e_full_system_test.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/e2e_full_system_test.png)<br>- Đoạn video demo chu trình OCR & Athena: [Xem Video Demo](https://drive.google.com/file/d/1P0wc6t_vyj5OzbL0OTGyZ_y5o0ucI1Ti/view?usp=drive_link) |
| **Nguyễn Thành Thắng**<br>(MSSV: 24110332) | SV2 | **8.5h** | - Chủ trì kiểm thử liên thông tổng thể (E2E System Testing) luồng Web UI $\leftrightarrow$ API Gateway $\leftrightarrow$ Lambda CRUD $\leftrightarrow$ DynamoDB.<br>- Xuất và lập báo cáo chi phí AWS Billing từ AWS Academy Learner Lab Portal (chứng minh chi phí an toàn $0.2 / $50 credit).<br>- Thực hiện dọn dẹp Stack CloudFormation thử nghiệm `expense-tracker-iac-v2` trên AWS Console, bảo toàn nguyên vẹn bảng DynamoDB chính `Transactions`.<br>- Cập nhật sơ đồ kiến trúc hệ thống toàn diện chuẩn 7 dịch vụ AWS ([docs/aws_architecture_user_diagram_plus_v2.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus_v2.png)).<br>- Chủ trì biên soạn tài liệu Báo cáo Tổng kết Đồ án hoàn chỉnh ([docs/BaoCaoTongKet.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/BaoCaoTongKet.md)).<br>- Xây dựng kịch bản, quay màn hình và chủ trì biên tập Video Demo sản phẩm $\le 10$ phút.<br>- Rà soát toàn bộ cấu hình hạ tầng, mã nguồn và hoàn thiện tài liệu phục vụ báo cáo nghiệm thu đồ án. | - Ảnh Báo cáo Chi phí AWS: [screenshots/tuan4/aws_billing_cost_explorer.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/aws_billing_cost_explorer.png)<br>- Ảnh Dọn dẹp Stack CloudFormation: [screenshots/tuan4/cleanup_iac_stack.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/cleanup_iac_stack.png)<br>- Ảnh Kiểm thử Liên thông E2E Web UI: [screenshots/tuan4/e2e_full_system_test.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/e2e_full_system_test.png)<br>- Sơ đồ kiến trúc cập nhật: [docs/aws_architecture_user_diagram_plus_v2.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus_v2.png)<br>- Báo cáo Tổng kết hoàn chỉnh: [docs/BaoCaoTongKet.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/BaoCaoTongKet.md)<br>- Video Demo hoàn chỉnh $\le 10$ phút: [Xem Video Demo trên Google Drive](https://drive.google.com/file/d/1P0wc6t_vyj5OzbL0OTGyZ_y5o0ucI1Ti/view?usp=drive_link) |

---

## II. CHI TIẾT CÔNG VIỆC VÀ LIÊN KẾT MINH CHỨNG CỤ THỂ TRÊN GITHUB

### 1. Thực thi Kiểm thử Liên thông Tổng thể Hệ thống (End-to-End Testing) (SV2):
- **Quy trình kiểm thử:** Mở ứng dụng Web Client tại `frontend/index.html` và chạy liên thông toàn bộ các ca kiểm thử từ Web UI qua API Gateway Stage `dev`, gọi hàm Lambda CRUD, lưu trữ vào DynamoDB `Transactions`, tải ảnh hóa đơn lên S3 kích hoạt Lambda OCR Textract.
- **Kết quả kiểm thử:**
  - Bảng Lịch sử chi tiêu ghi nhận đầy đủ 11 giao dịch thực tế trên DynamoDB, hiển thị phân tách rõ ràng giữa giao dịch **Nhập tay** (Huy hiệu xám) và giao dịch **Hóa đơn OCR** (Huy hiệu tím).
  - Đèn trạng thái góc dưới Sidebar báo xanh: `API: Connected (AWS us-east-1 • Stage dev)`.
  - Bộ chọn thời gian tương tác Lịch thông minh lọc chính xác giao dịch theo tháng `2026-10` và theo từng ngày cụ thể.
  - Link ảnh minh chứng Kiểm thử E2E: [screenshots/tuan4/e2e_full_system_test.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/e2e_full_system_test.png)

### 2. Kiểm tra Chi phí AWS Billing & Phân tích Tối ưu hóa (SV2):
- **Số liệu chi phí thực tế:** Truy cập AWS Academy Learner Lab Portal, ghi nhận hệ thống vận hành siêu tiết kiệm sau 4 tuần:
  - **Used:** `$0.2 of $50` (Mới sử dụng $0.20 USD trên hạn mức $50.00 USD được tài trợ).
  - **Remaining:** `$49.80 USD` (Tiết kiệm đến 99.6% ngân sách).
- **Phân tích cơ chế bảo mật IAM SCP:** Giải thích rõ thông báo *"You don't have permission to access billing information"* trên AWS Console là do chính sách Service Control Policy của AWS Academy áp dụng lên tài khoản thành viên trong AWS Organization để bảo mật tài khoản gốc.
- Link ảnh minh chứng Chi phí AWS: [screenshots/tuan4/aws_billing_cost_explorer.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/aws_billing_cost_explorer.png)

### 3. Dọn dẹp Tài nguyên Thử nghiệm Môi trường Lab (SV2):
- **Thực thi quy chuẩn dọn dẹp an toàn:**
  - Truy cập AWS CloudFormation Console tại Region `us-east-1`.
  - Thực hiện lệnh xóa (Delete) Stack thử nghiệm `expense-tracker-iac-v2` (Stack đã tạo thành công ở Tuần 3 để chứng minh năng lực IaC).
  - Stack được xóa sạch sẽ sang trạng thái `DELETE_COMPLETE`, giải phóng bảng DynamoDB test `Transactions-IaC-Test` và API test `expense-tracker-api-iac`.
  - Kiểm tra đối soát bảo toàn 100% bảng DynamoDB chính `Transactions` và API Gateway chính `expense-tracker-api`.
- Link ảnh minh chứng Dọn dẹp Stack: [screenshots/tuan4/cleanup_iac_stack.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/cleanup_iac_stack.png)

### 4. Cập nhật Sơ đồ Kiến trúc Hệ thống Chuẩn 7 Dịch vụ AWS (SV2):
- Cập nhật lại sơ đồ kiến trúc hệ thống phản ánh trung thực 100% hạ tầng thực tế đang hoạt động ở Tuần 4:
  - Loại bỏ các thành phần phác thảo ban đầu không sử dụng (`EventBridge`, `Step Functions`, định dạng `Parquet`).
  - Thể hiện đầy đủ nhánh Web SPA $\rightarrow$ API Gateway $\rightarrow$ Lambda CRUD $\rightarrow$ DynamoDB của SV2.
  - Thể hiện chuỗi S3 Raw $\rightarrow$ Lambda OCR $\rightarrow$ Textract AnalyzeExpense $\rightarrow$ S3 Analytics (JSON) $\rightarrow$ Glue Crawler $\rightarrow$ Athena SQL của SV1.
  - Bổ sung khối giám sát Amazon CloudWatch Dashboard & Alarm bao quát toàn hệ thống.
- Link file sơ đồ kiến trúc cập nhật: [docs/aws_architecture_user_diagram_plus_v2.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus_v2.png)

### 5. Chủ trì Biên soạn Báo cáo Tổng kết Đồ án Hoàn chỉnh (SV2):
- Hoàn thiện tài liệu Báo cáo Tổng kết lớn tại [docs/BaoCaoTongKet.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/BaoCaoTongKet.md) gồm đầy đủ 7 chương theo chuẩn quy chế đồ án công nghệ thông tin.

### 6. Đánh giá Chu trình Bóc tách OCR Textract & Tối ưu hóa Phân tích Athena (SV1):
- **Kiểm thử chu trình OCR:** Thực hiện tải các mẫu hóa đơn thực tế (trong `data/sample-receipts/`) lên S3, kiểm tra độ chính xác bóc tách các trường `VENDOR_NAME`, `INVOICE_RECEIPT_DATE`, `TOTAL`, và phân loại tự động danh mục chi tiêu (`infer_category`).
  - Link ảnh kiểm thử tải hóa đơn lên S3: [screenshots/tuan4/test_upload_receipts_success.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/test_upload_receipts_success.png)
  - Link ảnh hóa đơn lưu trữ tại S3 Raw: [screenshots/tuan4/recepts_in_s3_raw.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/recepts_in_s3_raw.png)
  - Link ảnh bản ghi JSON phân vùng tại S3 Analytics: [screenshots/tuan4/recepts_in_s3_analysts.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/recepts_in_s3_analysts.png)
  - Link ảnh kiểm thử gọi hàm Lambda OCR thực thi: [screenshots/tuan4/function_lambda_sucess.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/function_lambda_sucess.png)
- **Tối ưu hóa Data Lake & Athena:** Dọn dẹp các file kết quả truy vấn `.csv` cũ trong thư mục `athena-results/` trên S3 để tối ưu dung lượng; kiểm tra các bản ghi JSON xuất sang `expense-analytics-data-24110286/transactions/` để bảo đảm các trường số tiền là kiểu số thực `double` giúp truy vấn `SUM()`, `AVG()` đạt hiệu năng cao nhất.
  - Link ảnh ước tính chi phí nhóm tài nguyên Data Lake: [screenshots/tuan4/my_etimate.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/my_etimate.png)
  - Link ảnh dọn dẹp tài nguyên thừa trên S3: [screenshots/tuan4/s3_analytics_cleanup.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/screenshots/tuan4/s3_analytics_cleanup.png)
- **Đóng góp Báo cáo Tổng kết:** Soạn thảo chi tiết phân hệ Data Lake, Glue Data Catalog và Athena SQL cho [docs/BaoCaoTongKet.md](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/BaoCaoTongKet.md).

---

## III. MA TRẬN KIỂM THỬ LIÊN THÔNG TỔNG THỂ (E2E TEST MATRIX)

| Mã Test | Nội dung kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **SYS-01** | Tạo chi tiêu thủ công từ Web UI SPA | API trả HTTP 201; DynamoDB cập nhật bản ghi; Dashboard nhảy số | Hoàn thành trong $< 300$ms; Bản ghi lưu với PK `24110332` | **PASS** |
| **SYS-02** | Tải hóa đơn kích hoạt OCR Textract | S3 upload thành công; Textract bóc tách; Web hiện huy hiệu OCR | Nhận diện đúng cửa hàng, số tiền; Giao dịch hiện tức thì | **PASS** |
| **SYS-03** | Lọc dữ liệu theo tháng và danh mục | Web chỉ hiển thị đúng các bản ghi khớp; Biểu đồ vẽ chuẩn | Lọc mượt mà; Biểu đồ Canvas phản hồi tức thì | **PASS** |
| **SYS-04** | Giám sát hệ thống với CloudWatch | Invocations tăng; Latency ổn định 80-250ms; Không có lỗi | 3 Widget ghi nhận chuẩn xác; Biểu đồ Dual-Axis rõ nét | **PASS** |
| **SYS-05** | Truy vấn dữ liệu lớn trên Athena | Athena trả về thống kê chi tiêu trong $< 1.5$s, quét $< 10$KB | 5 câu truy vấn SQL thực thi thành công; Chi phí tối ưu | **PASS** |
| **SYS-06** | Báo cáo chi phí & Dọn dẹp tài nguyên | Chi phí lũy kế $< $1; Stack test xóa sạch sẽ | Chi phí thực tế $0.2 / $50; Stack xóa đạt `DELETE_COMPLETE` | **PASS** |

---

## IV. MINH CHỨNG LỊCH SỬ COMMIT TRÊN GITHUB (TUẦN 4)

Toàn bộ tiến độ và kết quả công việc Tuần 4 được thể hiện minh bạch, liên tục qua các Git commit trên nhánh `main`:
- Link xem toàn bộ lịch sử commit: [Lịch sử Commit Dự án](https://github.com/Lypfy/aws-expense-tracker/commits/main)

### 1. Sinh viên 2 (Nguyễn Thành Thắng - MSSV: 24110332 - GitHub: `Lypfy`):
* [`f400b65`](https://github.com/Lypfy/aws-expense-tracker/commit/f400b651d5ba59ce6b2bd84901d3c0a296577575) *(31/10/2026)*: `Thêm trạng thái kết nối, thêm tab cài đặt` - Hoàn thiện giao diện Web Client SPA: tích hợp đèn trạng thái kết nối API Gateway theo thời gian thực (`API: Connected`), bổ sung tab Cài đặt cấu hình ngân sách tháng và User ID hỗ trợ kiểm thử Multi-tenant.
* [`82b5def`](https://github.com/Lypfy/aws-expense-tracker/commit/82b5defb88570da9deb50af639c710ad6b8b8adc) *(31/10/2026)*: `fix date sorting` - Sửa thuật toán sắp xếp và chuẩn hóa ngày hiển thị trên giao diện đối với các hóa đơn OCR.
* [`c06890f`](https://github.com/Lypfy/aws-expense-tracker/commit/c06890fbb1e12a9cf988b99695871f97726f09ae) *(31/10/2026)*: `Cập nhật sơ đồ kiến trúc` - Cập nhật sơ đồ kiến trúc toàn diện 7 dịch vụ AWS ([docs/aws_architecture_user_diagram_plus_v2.png](https://github.com/Lypfy/aws-expense-tracker/blob/main/docs/aws_architecture_user_diagram_plus_v2.png)).
* [`0a6ea29`](https://github.com/Lypfy/aws-expense-tracker/commit/0a6ea29bbceb1fbd8c8f0b43fbf2430b5566fa4c) *(31/10/2026)*: `Ảnh minh chứng SV2` - Bổ sung bộ ảnh minh chứng Kiểm thử liên thông E2E (`e2e_full_system_test.png`), Báo cáo chi phí AWS Billing (`aws_billing_cost_explorer.png`) và Dọn dẹp Stack CloudFormation an toàn (`cleanup_iac_stack.png`).

### 2. Sinh viên 1 (Lê Trọng Nghĩa - MSSV: 24110286 - GitHub: `letrongnghia2116`):
* [`35eaa34`](https://github.com/Lypfy/aws-expense-tracker/commit/35eaa3430bdd37c521f8feb853017bc91e35bbe6) *(01/11/2026)*: `Hình ảnh kiểm thử upload hóa đơn thành công` - Upload ảnh minh chứng `screenshots/tuan4/test_upload_receipts_success.png`.
* [`d4ab7d2`](https://github.com/Lypfy/aws-expense-tracker/commit/d4ab7d2d8f1451c6df7519f372fae7b03c699a32) *(01/11/2026)*: `dữ liệu được ghi nhận vào expense_raw_receipts thành công` - Upload ảnh minh chứng S3 Raw Bucket `screenshots/tuan4/recepts_in_s3_raw.png`.
* [`b46029e`](https://github.com/Lypfy/aws-expense-tracker/commit/b46029e8b884a8289775e7a74f08d8df314c94d8) *(01/11/2026)*: `dữ liệu được ghi nhận vào expense_analysts_receipts thành công` - Upload ảnh minh chứng S3 Analytics Data Lake `screenshots/tuan4/recepts_in_s3_analysts.png`.
* [`6e17b9e`](https://github.com/Lypfy/aws-expense-tracker/commit/6e17b9e5ef3bdce94fb2d96affe4fd7eeac4845d) & [`f131abd`](https://github.com/Lypfy/aws-expense-tracker/commit/f131abd18ee880100a949d89d77e9e942dcbb2fb) *(01/11/2026)*: `kiểm thử gọi hàm lambda để xữ lý upload hóa đơn thành công` - Upload ảnh minh chứng thực thi hàm Lambda OCR `screenshots/tuan4/function_lambda_sucess.png`.
* [`fb94362`](https://github.com/Lypfy/aws-expense-tracker/commit/fb94362d9fdb0556bc95916a26b49f6a694c23e9) *(01/11/2026)*: `ước tính chi phí cho nhóm tài nguyên Data Lake (S3, Amazon Textract, AWS Glue, Amazon Athena)` - Upload ảnh phân tích chi phí `screenshots/tuan4/my_etimate.png`.
* [`3b9120d`](https://github.com/Lypfy/aws-expense-tracker/commit/3b9120d938311a2bf40bd49164675bc131a9caf6) *(01/11/2026)*: `dọn dẹp các tài nguyên không cần thiết` - Upload ảnh dọn dẹp file thừa S3 `screenshots/tuan4/s3_analytics_cleanup.png`.

---

## V. BẢNG TỔNG KẾT TIMESHEET TUẦN 4 & KHAI BÁO SỬ DỤNG AI

### 1. Bảng phân bổ thời gian thực hiện Tuần 4 của SV2 (Nguyễn Thành Thắng):
| Buổi | Ngày | Khung giờ | Số giờ | Nội dung công việc thực tế | Minh chứng |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **Buổi 1** | 27/10/2026 | 19:00 - 21:30 | **2.5h** | Thực thi kiểm thử liên thông End-to-End từ Web UI vào AWS Cloud (SYS-01 $\rightarrow$ SYS-04). Tối ưu hóa logic đồng bộ ngày giữa Sort Key và ngày hóa đơn OCR. | `screenshots/tuan4/e2e_full_system_test.png` |
| **Buổi 2** | 28/10/2026 | 14:00 - 16:00 | **2.0h** | Kiểm tra chi phí trên AWS Academy Portal ($0.2). Thực hiện xóa Stack `expense-tracker-iac-v2` trên CloudFormation Console an toàn. | `screenshots/tuan4/aws_billing_cost_explorer.png`, `screenshots/tuan4/cleanup_iac_stack.png` |
| **Buổi 3** | 29/10/2026 | 19:30 - 21:30 | **2.0h** | Cập nhật Sơ đồ Kiến trúc Hệ thống 7 dịch vụ AWS. Chủ trì biên soạn tài liệu Báo cáo Tổng kết `docs/BaoCaoTongKet.md`. | `docs/aws_architecture_user_diagram_plus_v2.png`, `docs/BaoCaoTongKet.md` |
| **Buổi 4** | 31/10/2026 | 08:30 - 10:30 | **2.0h** | Rà soát toàn bộ mã nguồn repository, kịch bản thuyết minh và biên tập hoàn thiện Video Demo sản phẩm $\le 10$ phút. | [Video Demo Google Drive](https://drive.google.com/file/d/1P0wc6t_vyj5OzbL0OTGyZ_y5o0ucI1Ti/view?usp=drive_link) |
| **TỔNG** | | | **8.5h** | **Đạt chuẩn quy chế môn học ($\ge 8.0$ giờ/tuần)** | |

### 2. Khai báo Sử dụng Công cụ AI (AI Disclosure):
- **Công cụ:** Gemini 3.8 Flash, ChatGPT.
- **Nội dung hỗ trợ:** Gợi ý cấu trúc ma trận kiểm thử E2E, gợi ý bố cục thiết kế sơ đồ kiến trúc đám mây 2D vector, hỗ trợ rà soát thuật ngữ chuyên ngành.
- **Tự chủ học thuật:** Sinh viên tự tay thực thi 100% các bước trên AWS Console, viết code kiểm thử, chụp ảnh minh chứng và hoàn toàn làm chủ kiến thức, giải pháp kỹ thuật đã triển khai trong đồ án.

