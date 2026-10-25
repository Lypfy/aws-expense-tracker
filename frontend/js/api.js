/**
 * AWS Serverless Expense Tracker - API & Data Service
 * Quản lý kết nối tới AWS API Gateway, DynamoDB, S3 Textract và Mock Storage
 */

const MOCK_STORAGE = [
    {
        transactionId: "TX_2026-10-17T15:22:13_1e54ea5e",
        userId: "24110332",
        amount: 120000,
        currency: "VND",
        category: "Food & Dining",
        merchant: "Nhà hàng Phở Lý Quốc Sư",
        description: "Hóa đơn Phở Lý Quốc Sư (Quét tự động)",
        createdAt: "2026-10-17T15:22:13Z",
        ocrStatus: "COMPLETED"
    },
    {
        transactionId: "TX_2026-10-17T19:55:02_ac30df61",
        userId: "24110332",
        amount: 55000,
        currency: "VND",
        category: "Food & Dining",
        merchant: "Highlands Coffee",
        description: "Cà phê sáng",
        createdAt: "2026-10-17T19:55:02Z"
    },
    {
        transactionId: "TX_2026-10-18T10:15:30_bb45cd12",
        userId: "24110332",
        amount: 250000,
        currency: "VND",
        category: "Groceries",
        merchant: "WinMart Landmark",
        description: "Mua thực phẩm cuối tuần",
        createdAt: "2026-10-18T10:15:30Z"
    },
    {
        transactionId: "TX_2026-10-19T08:30:00_cc56de23",
        userId: "24110332",
        amount: 95000,
        currency: "VND",
        category: "Transportation",
        merchant: "GrabBike",
        description: "Di chuyển đi làm",
        createdAt: "2026-10-19T08:30:00Z"
    },
    {
        transactionId: "TX_2026-10-20T17:45:00_dd67ef34",
        userId: "24110332",
        amount: 150000,
        currency: "VND",
        category: "Transportation",
        merchant: "Cây xăng Petrolimex Số 14",
        description: "Đổ xăng xe máy",
        createdAt: "2026-10-20T17:45:00Z",
        ocrStatus: "COMPLETED"
    },
    {
        transactionId: "TX_2026-10-21T14:10:00_ee78fa45",
        userId: "24110332",
        amount: 165000,
        currency: "VND",
        category: "Healthcare",
        merchant: "Nhà thuốc Pharmacity",
        description: "Vitamin & thuốc cảm",
        createdAt: "2026-10-21T14:10:00Z"
    },
    {
        transactionId: "TX_2026-10-22T20:00:00_ff89ab56",
        userId: "24110332",
        amount: 420000,
        currency: "VND",
        category: "Shopping",
        merchant: "Uniqlo Vạn Hạnh Mall",
        description: "Áo sơ mi công sở",
        createdAt: "2026-10-22T20:00:00Z"
    },
    {
        transactionId: "TX_2026-10-23T09:20:00_aa90bc67",
        userId: "24110332",
        amount: 310000,
        currency: "VND",
        category: "Utilities",
        merchant: "EVN TP. Hồ Chí Minh",
        description: "Tiền điện sinh hoạt kỳ 10/2026",
        createdAt: "2026-10-23T09:20:00Z"
    },
    {
        transactionId: "TX_2026-10-24T11:00:00_bb01cd78",
        userId: "24110332",
        amount: 75000,
        currency: "VND",
        category: "General",
        merchant: "Tiệm in Photocopy Thắng Lợi",
        description: "In tài liệu học tập",
        createdAt: "2026-10-24T11:00:00Z"
    }
];

const ExpenseApi = {
    /**
     * Lấy danh sách giao dịch từ AWS API Gateway
     */
    async fetchTransactions(userId, month) {
        const url = `${CONFIG.API_BASE_URL}/transactions?userId=${encodeURIComponent(userId)}&month=${encodeURIComponent(month)}`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        const data = await res.json();
        const allData = Array.isArray(data) ? data : (data.items || []);
        // Đảm bảo chỉ trả về giao dịch thuộc đúng tháng được chọn
        return allData.filter(t => !t.createdAt || t.createdAt.startsWith(month));
    },

    /**
     * Thêm giao dịch chi tiêu mới lên DynamoDB
     */
    async createTransaction(expenseData) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expenseData)
        });
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        return await res.json();
    },

    /**
     * Xóa giao dịch khỏi DynamoDB
     */
    async deleteTransaction(transactionId, userId) {
        const encId = encodeURIComponent(transactionId);
        const url = `${CONFIG.API_BASE_URL}/transactions/${encId}?userId=${encodeURIComponent(userId)}`;
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }
        return true;
    },

    /**
     * Lấy dữ liệu giả lập theo tháng khi offline hoặc API chưa có sẵn
     */
    getMockTransactions(month) {
        return MOCK_STORAGE.filter(t => t.createdAt && t.createdAt.startsWith(month));
    },

    /**
     * Lưu giao dịch mới vào Mock Storage
     */
    addMockExpense(newExpense) {
        MOCK_STORAGE.unshift(newExpense);
    },

    /**
     * Xóa giao dịch trong Mock Storage
     */
    removeMockTransaction(transactionId) {
        const idx = MOCK_STORAGE.findIndex(t => t.transactionId === transactionId);
        if (idx !== -1) {
            MOCK_STORAGE.splice(idx, 1);
        }
    },

    /**
     * Tải hóa đơn trực tiếp lên Amazon S3 Bucket để kích hoạt chuỗi Lambda OCR Textract (Cách 1)
     */
    async uploadReceiptToS3(file, userId) {
        // Định danh object key theo ngày giờ và tên file
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const cleanFileName = (file && file.name) ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "receipt.jpg";
        const objectKey = `uploads/${userId}_${timestamp}_${cleanFileName}`;
        const s3Url = `https://${CONFIG.S3_BUCKET}.s3.${CONFIG.AWS_REGION}.amazonaws.com/${objectKey}`;

        // Gửi HTTP PUT trực tiếp lên S3 bucket
        const res = await fetch(s3Url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type || "application/octet-stream"
            },
            body: file
        });

        if (!res.ok) {
            throw new Error(`Tải lên S3 thất bại (HTTP ${res.status}: ${res.statusText})`);
        }

        return {
            success: true,
            bucket: CONFIG.S3_BUCKET,
            key: objectKey,
            s3Url: `s3://${CONFIG.S3_BUCKET}/${objectKey}`
        };
    }
};
