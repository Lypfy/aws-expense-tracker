/**
 * AWS Serverless Expense Tracker - Main Application Controller
 * Điều phối luồng dữ liệu giữa API, Giao diện (UI), Biểu đồ (Charts) và Bộ chọn lịch (Calendar)
 * Tác giả: Nguyễn Thành Thắng (SV2 - 24110332)
 */

let currentUserId = CONFIG.DEFAULT_USER_ID;
let currentMonth = "2026-10";
let selectedDay = null; // null: xem cả tháng, hoặc chuỗi ngày cụ thể "2026-10-17"
let selectedChartCategory = "ALL"; // "ALL" hoặc id danh mục cụ thể
let rawTransactions = [];
let currentView = "viewOverview";

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

/**
 * 1. Khởi tạo toàn bộ ứng dụng
 */
function initApp() {
    setupEventListeners();
    setupViewNavigation();
    UiService.setupCategoryDropdown();

    // Khởi tạo bộ chọn Lịch
    CalendarService.setupCalendarPicker({
        onPrevMonth: () => changeMonthOffset(-1),
        onNextMonth: () => changeMonthOffset(1),
        onViewAll: () => {
            selectedDay = null;
            CalendarService.syncAllPeriodDisplays(currentMonth, selectedDay);
            CalendarService.renderCalendarDays(rawTransactions, currentMonth, selectedDay, handleDaySelect);
            applyFilters();
        }
    });

    // Khởi tạo bộ lọc dropdown Tháng và Năm ở ĐẦU MỖI TRANG (Đồng bộ nhau)
    CalendarService.setupPagePeriodSelectors((newMonth) => {
        currentMonth = newMonth;
        selectedDay = null;
        CalendarService.syncAllPeriodDisplays(currentMonth, selectedDay);
        loadTransactions();
    });

    // Đồng bộ các nhãn hiển thị và tải dữ liệu lần đầu
    CalendarService.syncAllPeriodDisplays(currentMonth, selectedDay);
    loadTransactions();

    // Tự động căn chỉnh lại biểu đồ khi resize màn hình
    window.addEventListener("resize", () => {
        if (currentView === "viewOverview") {
            ChartService.renderMonthlyChart(rawTransactions, currentMonth, selectedChartCategory);
        }
    });
}

/**
 * 2. Điều hướng chuyển đổi 2 trang (SPA Tabs: Tổng quan vs Lịch sử)
 */
function setupViewNavigation() {
    const navItems = document.querySelectorAll(".nav-menu .nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetView = item.getAttribute("data-view");
            if (targetView) {
                switchView(targetView);
            }
        });
    });
}

function switchView(viewId) {
    currentView = viewId;

    // Cập nhật trạng thái active ở sidebar
    document.querySelectorAll(".nav-menu .nav-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-view") === viewId);
    });

    // Ẩn/hiện view tương ứng
    document.querySelectorAll(".view-section").forEach(sec => {
        if (sec.id === viewId) {
            sec.classList.remove("hidden");
        } else {
            sec.classList.add("hidden");
        }
    });

    // Cập nhật URL hash nhẹ nhàng
    window.location.hash = viewId === "viewOverview" ? "#overview" : "#history";

    // Nếu quay về trang Tổng quan, tính toán lại canvas biểu đồ
    if (viewId === "viewOverview") {
        setTimeout(() => {
            ChartService.renderMonthlyChart(rawTransactions, currentMonth, selectedChartCategory);
        }, 50);
    }
}

/**
 * 3. Lắng nghe các sự kiện tương tác trên trang
 */
function setupEventListeners() {
    // Nút mở Modal từ thẻ hành động nhanh
    const btnUploadOcr = document.getElementById("btnUploadOcr");
    if (btnUploadOcr) {
        btnUploadOcr.addEventListener("click", () => UiService.openModal("modalAddExpense"));
    }

    // Đóng Modal khi bấm nút X hoặc click overlay bên ngoài
    document.querySelectorAll(".modal-close-btn, .modal-overlay").forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal-overlay") || e.target.classList.contains("modal-close-btn")) {
                UiService.closeModals();
            }
        });
    });

    // Form submit thêm giao dịch mới
    const formAdd = document.getElementById("formAddExpense");
    if (formAdd) {
        formAdd.addEventListener("submit", handleAddExpense);
    }

    // Bộ lọc danh mục chi tiêu (trang Lịch sử & trên Biểu đồ)
    const historyCatSelect = document.getElementById("historyCategorySelect");
    const chartCatSelect = document.getElementById("chartCategorySelect");

    const syncCategoryFilter = (val) => {
        selectedChartCategory = val;
        if (historyCatSelect && historyCatSelect.value !== val) historyCatSelect.value = val;
        if (chartCatSelect && chartCatSelect.value !== val) chartCatSelect.value = val;
        ChartService.renderMonthlyChart(rawTransactions, currentMonth, selectedChartCategory);
        applyFilters();
    };

    if (historyCatSelect) {
        historyCatSelect.addEventListener("change", (e) => syncCategoryFilter(e.target.value));
    }
    if (chartCatSelect) {
        chartCatSelect.addEventListener("change", (e) => syncCategoryFilter(e.target.value));
    }

    // Lọc theo từ khóa tìm kiếm & Dropdown nguồn chi tiêu (trên đầu trang Lịch sử)
    const searchInput = document.getElementById("searchTransactionsInput");
    const filterSelect = document.getElementById("filterSourceSelect");

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }
    if (filterSelect) {
        filterSelect.addEventListener("change", applyFilters);
    }

    // Kéo thả hoặc chọn file hóa đơn
    const fileInput = document.getElementById("receiptFileInput");
    const dropzone = document.getElementById("receiptDropzone");
    if (dropzone && fileInput) {
        dropzone.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

/**
 * 4. Chuyển đổi tháng tới/lui (+1 hoặc -1)
 */
function changeMonthOffset(offset) {
    const [year, month] = currentMonth.split("-").map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    const yStr = date.getFullYear();
    const mStr = String(date.getMonth() + 1).padStart(2, "0");
    currentMonth = `${yStr}-${mStr}`;
    selectedDay = null;

    CalendarService.syncAllPeriodDisplays(currentMonth, selectedDay);
    loadTransactions();
}

/**
 * 5. Xử lý khi người dùng click chọn 1 ngày trong lưới lịch
 */
function handleDaySelect(dateStr) {
    if (selectedDay === dateStr) {
        selectedDay = null; // Bỏ chọn nếu click lại ngày đang chọn
    } else {
        selectedDay = dateStr;
    }

    CalendarService.syncAllPeriodDisplays(currentMonth, selectedDay);
    CalendarService.renderCalendarDays(rawTransactions, currentMonth, selectedDay, handleDaySelect);
    applyFilters();
}

/**
 * 6. Tải danh sách giao dịch từ API hoặc Mock Fallback
 */
async function loadTransactions() {
    const tableBody = document.getElementById("transactionsTableBody");
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-dim);">Đang tải danh sách giao dịch...</td></tr>`;
    }

    try {
        rawTransactions = await ExpenseApi.fetchTransactions(currentUserId, currentMonth);
    } catch (err) {
        console.warn("API Gateway không khả dụng (chuyển sang dữ liệu mẫu theo tháng):", err);
        rawTransactions = ExpenseApi.getMockTransactions(currentMonth);
    }

    UiService.renderMetrics(rawTransactions, currentMonth);
    ChartService.renderMonthlyChart(rawTransactions, currentMonth, selectedChartCategory);
    CalendarService.renderCalendarDays(rawTransactions, currentMonth, selectedDay, handleDaySelect);
    CalendarService.syncAllPeriodDisplays(currentMonth, selectedDay);
    applyFilters();
}

/**
 * 7. Lọc kết hợp: Ngày trong lịch + Từ khóa tìm kiếm + Nguồn giao dịch
 */
function applyFilters() {
    const query = (document.getElementById("searchTransactionsInput")?.value || "").toLowerCase();
    const sourceFilter = document.getElementById("filterSourceSelect")?.value || "all";

    const filtered = rawTransactions.filter(t => {
        // Lọc theo ngày cụ thể (nếu người dùng click chọn ngày trên lịch)
        if (selectedDay) {
            const txDate = t.createdAt ? t.createdAt.substring(0, 10) : "";
            if (txDate !== selectedDay) return false;
        }

        // Lọc theo danh mục chi tiêu (nếu đã chọn danh mục cụ thể)
        if (selectedChartCategory && selectedChartCategory !== "ALL") {
            if (t.category !== selectedChartCategory) return false;
        }

        const isOcr = t.ocrStatus === "COMPLETED" || (t.description && t.description.includes("OCR"));

        // Lọc nguồn
        if (sourceFilter === "ocr" && !isOcr) return false;
        if (sourceFilter === "manual" && isOcr) return false;

        // Lọc từ khóa
        if (query) {
            const matchMerchant = t.merchant && t.merchant.toLowerCase().includes(query);
            const matchDesc = t.description && t.description.toLowerCase().includes(query);
            const matchCat = t.category && t.category.toLowerCase().includes(query);
            if (!matchMerchant && !matchDesc && !matchCat) return false;
        }

        return true;
    });

    UiService.renderTable(filtered);
}

/**
 * 8. Xử lý thêm chi tiêu qua form
 */
async function handleAddExpense(e) {
    e.preventDefault();
    const btnSubmit = e.target.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Đang lưu giao dịch...";

    const ocrStatus = document.getElementById("inputOcrStatus")?.value || "MANUAL";

    const newExpense = {
        transactionId: `TX_${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random().toString(16).substring(2, 8)}`,
        userId: currentUserId,
        amount: parseFloat(document.getElementById("inputAmount").value),
        currency: "VND",
        merchant: document.getElementById("inputMerchant").value.trim(),
        category: document.getElementById("selectCategory").value,
        description: document.getElementById("inputDescription").value.trim(),
        type: "EXPENSE",
        ocrStatus: ocrStatus,
        createdAt: new Date().toISOString()
    };

    try {
        await ExpenseApi.createTransaction(newExpense);
        UiService.closeModals();
        e.target.reset();
        await loadTransactions();
    } catch (err) {
        console.warn("Lưu qua API thất bại, lưu tạm vào bộ nhớ cục bộ:", err);
        ExpenseApi.addMockExpense(newExpense);
        UiService.closeModals();
        e.target.reset();
        await loadTransactions();
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Lưu giao dịch";
    }
}

/**
 * 9. Xóa giao dịch
 */
async function deleteTransaction(transactionId) {
    if (!confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) return;

    try {
        await ExpenseApi.deleteTransaction(transactionId, currentUserId);
        await loadTransactions();
    } catch (err) {
        console.warn("Xóa qua API thất bại, xóa trong bộ nhớ cục bộ:", err);
        ExpenseApi.removeMockTransaction(transactionId);
        await loadTransactions();
    }
}

/**
 * 10. Xử lý upload hóa đơn lên Amazon S3 (Kích hoạt Lambda OCR Textract tự động)
 */
async function handleFileUpload(file) {
    const statusEl = document.getElementById("uploadStatusText");

    if (statusEl) {
        statusEl.style.display = "flex";
        statusEl.className = "upload-status-bar scanning";
        statusEl.innerHTML = `
            <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Đang tải hóa đơn lên Amazon S3 (${CONFIG.S3_BUCKET})...</span>
        `;
    }

    try {
        await ExpenseApi.uploadReceiptToS3(file, currentUserId);

        if (statusEl) {
            statusEl.className = "upload-status-bar success";
            statusEl.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>Tải lên S3 thành công! Lambda OCR đang tự động trích xuất & lưu vào hệ thống...</span>
            `;
        }

        // Tự động đóng modal sau 2.5s và tải lại bảng để thấy giao dịch mới
        setTimeout(async () => {
            UiService.closeModals();
            if (statusEl) statusEl.style.display = "none";
            await loadTransactions();
        }, 2500);

    } catch (err) {
        console.error("Lỗi tải lên S3:", err);
        if (statusEl) {
            statusEl.className = "upload-status-bar error";
            statusEl.innerHTML = `<span>Tải lên S3 thất bại: ${err.message}. (Vui lòng kiểm tra quyền S3 CORS)</span>`;
        }
    }
}

// Expose deleteTransaction globally
window.deleteTransaction = deleteTransaction;
