# 1. Nghiên cứu dịch vụ Textract (AnalyzeExpense) và luồng Athena/Glue Data Lake
## 1.1. Nghiên cứu dịch vụ Amazon Textract (AnalyzeExpense)

Amazon Textract là dịch vụ AWS hỗ trợ trích xuất thông tin từ tài liệu bằng công nghệ học máy. Nhóm tập trung nghiên cứu chức năng AnalyzeExpense, được thiết kế để phân tích hóa đơn và biên lai, trích xuất các thông tin như tên nhà cung cấp, ngày giao dịch, tổng tiền, thuế và chi tiết các khoản mục. Kết quả được trả về dưới dạng JSON, tạo điều kiện thuận lợi cho việc xử lý và lưu trữ dữ liệu tự động.
Trong ứng dụng quản lý chi tiêu cá nhân, dịch vụ này có thể hỗ trợ người dùng nhập thông tin hóa đơn nhanh chóng, giảm thao tác nhập liệu thủ công. Sau khi trích xuất, dữ liệu cần được kiểm tra, chuẩn hóa và chỉnh sửa nếu có sai sót trước khi sử dụng.
## 1.2. Nghiên cứu luồng Athena/Glue Data Lake

Nhóm tìm hiểu mô hình Data Lake trên AWS, trong đó Amazon S3 được sử dụng để lưu trữ hóa đơn gốc, dữ liệu JSON thô và dữ liệu đã xử lý. AWS Glue hỗ trợ khám phá cấu trúc dữ liệu thông qua Crawler và quản lý siêu dữ liệu bằng Glue Data Catalog. Trên cơ sở đó, Amazon Athena cho phép truy vấn dữ liệu trực tiếp trên S3 bằng SQL mà không cần quản lý máy chủ cơ sở dữ liệu.
Luồng xử lý dự kiến gồm: Tiếp nhận hóa đơn → Amazon Textract trích xuất thông tin → Chuẩn hóa dữ liệu → Lưu trữ trên Amazon S3 → AWS Glue lập danh mục dữ liệu → Amazon Athena truy vấn và phân tích.
## 1.3. Kết quả nghiên cứu

Qua quá trình nghiên cứu, nhóm xác định được vai trò của từng dịch vụ trong quy trình xử lý dữ liệu hóa đơn. Amazon Textract hỗ trợ tự động hóa nhập liệu, Amazon S3 đảm nhiệm lưu trữ, AWS Glue quản lý cấu trúc dữ liệu và Amazon Athena phục vụ phân tích chi tiêu. Đây là cơ sở để nhóm xây dựng và thử nghiệm quy trình tích hợp các dịch vụ trên AWS Learner Lab trong những giai đoạn tiếp theo.
