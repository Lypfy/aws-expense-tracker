# AWS Serverless Personal Expense Tracker & Data Analytics

> **Đề tài Capstone:** Ứng dụng quản lý chi tiêu cá nhân với phân tích dữ liệu  
> **Môn học:** Điện toán đám mây (Cloud Computing) - Đợt 1 (2026 - 2027)  
> **Giảng viên hướng dẫn (GVHD):** ThS. Huỳnh Xuân Phụng  
> **Môi trường triển khai:** AWS Academy Learner Lab (`us-east-1`)  

---

## 👥 Thành viên nhóm & Phân công nhiệm vụ

| STT | Họ và tên | MSSV | Vai trò | Nhiệm vụ chính phụ trách | Tag Owner |
| :---: | :--- | :---: | :---: | :--- | :---: |
| 1 | **Lê Trọng Nghĩa** | `24110286` | **SV1** | Trích xuất hóa đơn (Amazon Textract), Data Lake phân tích dữ liệu (Amazon S3, AWS Glue, Amazon Athena), thu thập dữ liệu mẫu. | `LeTrongNghia` |
| 2 | **Nguyễn Thành Thắng** | `24110332` | **SV2** | Mạng & Bảo mật (VPC, Security Group, IAM LabRole), Cơ sở dữ liệu (Amazon DynamoDB), RESTful API CRUD (API Gateway + Lambda), Quản lý Repository. | `NguyenThanhThang` |

---

## 🏗️ Kiến trúc giải pháp (System Architecture)

Dự án được xây dựng hoàn toàn trên nền tảng **Serverless** của AWS:
- **API & Xử lý giao dịch:** Client $\rightarrow$ Amazon API Gateway $\rightarrow$ AWS Lambda $\rightarrow$ Amazon DynamoDB.
- **Trích xuất hóa đơn tự động (OCR):** Upload hóa đơn lên Amazon S3 $\rightarrow$ S3 Trigger Lambda $\rightarrow$ Amazon Textract (`AnalyzeExpense`) $\rightarrow$ Ghi nhận vào DynamoDB.
- **Data Lake & Phân tích chi tiêu:** Dữ liệu chi tiêu xuất sang Amazon S3 $\rightarrow$ AWS Glue Crawler cập nhật Data Catalog $\rightarrow$ Amazon Athena thực thi câu truy vấn SQL phân tích xu hướng chi tiêu theo tháng/danh mục.

---

## 📁 Cấu trúc thư mục dự án (Repository Structure)

```text
aws-expense-tracker/
├── backend/                             # Mã nguồn backend Serverless
│   └── functions/
│       ├── transactions/                # Lambda CRUD giao dịch (SV2)
│       ├── ocr-processor/               # Lambda OCR Textract (SV1)
│       └── analytics-export/            # Lambda xuất dữ liệu sang Data Lake (SV1)
├── data/                                # Dữ liệu thử nghiệm
│   ├── mock-transactions.json           # Dữ liệu giao dịch giả lập (SV2)
│   └── sample-receipts/                 # 15-20 file hóa đơn mẫu (SV1)
├── docs/                                # Tài liệu kỹ thuật dự án
│   ├── api/
│   │   └── transactions-api.md          # Đặc tả RESTful API CRUD chi tiết
│   ├── dynamodb-schema.md               # Thiết kế lược đồ DynamoDB
│   └── architecture.png                 # Sơ đồ kiến trúc hệ thống
├── screenshots/                         # Minh chứng cấu hình thực tế trên AWS Lab
│   └── README.md
├── ignores/                             # Báo cáo, Worklog và sổ tay theo dõi
│   ├── bao_cao_ke_hoach_tuan1.md        # Báo cáo tuần 1 nộp GVHD
│   ├── SV2_Worklog.md                   # Nhật ký công việc SV2 (Chính thức)
│   ├── SV2_Personal_Tracker.md          # Sổ tay theo dõi cá nhân SV2
│   └── PROJECT_CONTEXT.md               # Ngữ cảnh dự án (Single Source of Truth)
├── .gitignore
└── README.md
```

---

## 📜 Quy chuẩn môi trường AWS Learner Lab
- **Region:** Bắt buộc `us-east-1` (US East - N. Virginia).
- **IAM Role:** Tái sử dụng `LabRole` có sẵn, không tạo IAM User/Role mới.
- **Tagging chuẩn:**
  - `Project`: `ExpenseTracker`
  - `Owner`: `LeTrongNghia` (SV1) hoặc `NguyenThanhThang` (SV2)