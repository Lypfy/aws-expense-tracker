/**
 * AWS Serverless Expense Tracker - UI Components & Modals
 * Quản lý hiển thị bảng giao dịch, thẻ KPI, modal và custom dropdown danh mục
 */

const UiService = {
    /**
     * Chống XSS bằng cách mã hóa các ký tự đặc biệt
     */
    escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    /**
     * Mở modal theo ID
     */
    openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add("active");
    },

    /**
     * Đóng tất cả modal đang mở
     */
    closeModals() {
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
        const statusEl = document.getElementById("uploadStatusText");
        if (statusEl) {
            statusEl.style.display = "none";
            statusEl.innerHTML = "";
            statusEl.className = "upload-status-bar";
        }
        const ocrInput = document.getElementById("inputOcrStatus");
        if (ocrInput) ocrInput.value = "MANUAL";
    },

    /**
     * Tính toán và hiển thị các số liệu trên thẻ KPI / Tổng quan
     */
    renderMetrics(transactions, currentMonth) {
        let totalSpent = 0;
        let ocrCount = 0;
        const catMap = {};

        // Chỉ tính cho các giao dịch thuộc currentMonth
        const monthTx = transactions.filter(t => !t.createdAt || t.createdAt.startsWith(currentMonth));

        monthTx.forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            totalSpent += amt;
            if (t.ocrStatus === "COMPLETED" || (t.description && t.description.includes("OCR"))) {
                ocrCount++;
            }
            const cat = t.category || "General";
            catMap[cat] = (catMap[cat] || 0) + amt;
        });

        // Cập nhật số tiền khổng lồ ở giữa
        const hugeEl = document.getElementById("hugeMonthAmount");
        if (hugeEl) {
            hugeEl.textContent = totalSpent.toLocaleString("vi-VN");
        }

        const countEl = document.getElementById("statTotalCount");
        if (countEl) countEl.textContent = `${monthTx.length} giao dịch`;

        const ocrStatEl = document.getElementById("statOcrCount");
        if (ocrStatEl) ocrStatEl.textContent = `${ocrCount} hóa đơn`;

        // Cập nhật thẻ danh mục top 1, 2, 3
        const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        
        const topCards = [
            { valId: "card1Value", nameId: "card1Name", iconBoxId: "card1IconBox", badgeId: "card1Badge", index: 0, defaultName: "Food & Dining" },
            { valId: "card2Value", nameId: "card2Name", iconBoxId: "card2IconBox", badgeId: "card2Badge", index: 1, defaultName: "Groceries" },
            { valId: "card3Value", nameId: "card3Name", iconBoxId: "card3IconBox", badgeId: "card3Badge", index: 2, defaultName: "Transportation" }
        ];

        topCards.forEach(tc => {
            const valEl = document.getElementById(tc.valId);
            const nameEl = document.getElementById(tc.nameId);
            const iconBoxEl = document.getElementById(tc.iconBoxId);
            const badgeEl = document.getElementById(tc.badgeId);

            if (sortedCats[tc.index]) {
                const [catId, amount] = sortedCats[tc.index];
                const catObj = (typeof CONFIG !== "undefined" && CONFIG.CATEGORIES) 
                    ? CONFIG.CATEGORIES.find(c => c.id === catId) 
                    : null;
                if (valEl) valEl.textContent = amount.toLocaleString("vi-VN") + " ₫";
                if (nameEl) nameEl.textContent = catObj ? catObj.name : catId;
                if (badgeEl) {
                    const pct = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : "0";
                    badgeEl.textContent = `${pct}% chi tiêu`;
                    badgeEl.className = "metric-badge-change badge-green";
                }
                if (iconBoxEl && catObj) {
                    iconBoxEl.style.background = catObj.bg;
                    iconBoxEl.style.color = catObj.color;
                    iconBoxEl.innerHTML = catObj.svg;
                }
            } else {
                if (valEl) valEl.textContent = "0 ₫";
                if (nameEl) nameEl.textContent = tc.defaultName;
                if (badgeEl) {
                    badgeEl.textContent = "0%";
                    badgeEl.className = "metric-badge-change";
                }
            }
        });

        // Vẽ sparkline thực tế cho 3 thẻ dựa trên giao dịch thật của từng danh mục
        if (typeof ChartService !== "undefined" && ChartService.renderCategorySparklines) {
            ChartService.renderCategorySparklines(monthTx, currentMonth, sortedCats);
        }
    },

    /**
     * Render bảng danh sách giao dịch & cập nhật thanh tóm tắt lịch sử
     */
    renderTable(transactions) {
        const tableBody = document.getElementById("transactionsTableBody");
        const summaryLabel = document.getElementById("historySummaryLabel");

        // Cập nhật số lượng giao dịch ở đầu trang Lịch sử
        if (summaryLabel) {
            summaryLabel.textContent = `${transactions.length} giao dịch`;
        }

        if (!tableBody) return;

        if (transactions.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 28px; color: var(--text-dim);">Chưa có giao dịch nào phù hợp với bộ lọc.</td></tr>`;
            return;
        }

        tableBody.innerHTML = transactions.map(t => {
            const isOcr = t.ocrStatus === "COMPLETED" || (t.description && t.description.includes("OCR"));
            const dateStr = t.createdAt ? t.createdAt.substring(0, 10) : "N/A";
            const amtStr = (parseFloat(t.amount) || 0).toLocaleString("vi-VN") + " ₫";
            const catInfo = CONFIG.CATEGORIES.find(c => c.id === t.category) || {
                name: t.category || "General",
                color: "#94a3b8",
                bg: "rgba(148, 163, 184, 0.15)",
                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>`
            };

            return `
                <tr>
                    <td style="color: var(--text-dim); font-size: 0.8rem;">${dateStr}</td>
                    <td>
                        <div class="merchant-cell">
                            <div class="merchant-icon" style="color: ${catInfo.color}; background: ${catInfo.bg};">
                                ${catInfo.svg}
                            </div>
                            <div>
                                <div class="merchant-name-text">${this.escapeHtml(t.merchant || "Không tên")}</div>
                                <div class="merchant-desc-text">${this.escapeHtml(t.description || "")}</div>
                            </div>
                        </div>
                    </td>
                    <td><span style="color: #cbd5e1; font-weight: 600;">${catInfo.name}</span></td>
                    <td>
                        ${isOcr 
                            ? `<span class="source-badge source-ocr"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" /></svg>Hóa đơn OCR</span>` 
                            : `<span class="source-badge source-manual"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>Nhập tay</span>`
                        }
                    </td>
                    <td><span class="amount-value">${amtStr}</span></td>
                    <td style="text-align: right;">
                        <button class="action-icon-btn" title="Xóa giao dịch" onclick="deleteTransaction('${t.transactionId}')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    },

    /**
     * Khởi tạo custom dropdown chọn Danh mục với Heroicons SVG
     */
    setupCategoryDropdown() {
        const wrapper = document.getElementById("customCategoryDropdown");
        const triggerBtn = document.getElementById("categoryTriggerBtn");
        const optionsContainer = document.getElementById("categoryOptionsList");
        const hiddenInput = document.getElementById("selectCategory");
        const selectedIcon = document.getElementById("selectedCatIcon");
        const selectedText = document.getElementById("selectedCatText");

        if (!wrapper || !triggerBtn || !optionsContainer || !hiddenInput) return;

        // Render danh sách các option từ CONFIG.CATEGORIES
        optionsContainer.innerHTML = CONFIG.CATEGORIES.map(cat => {
            const isSelected = cat.id === hiddenInput.value;
            return `
                <div class="custom-select-option ${isSelected ? 'selected' : ''}" data-cat-id="${cat.id}">
                    <div class="custom-option-left">
                        <span class="custom-cat-icon-badge" style="background: ${cat.bg}; color: ${cat.color};">
                            ${cat.svg}
                        </span>
                        <span>${cat.name}</span>
                    </div>
                    <svg class="custom-option-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
            `;
        }).join("");

        const updateSelectedDisplay = (catId) => {
            const cat = CONFIG.CATEGORIES.find(c => c.id === catId) || CONFIG.CATEGORIES[0];
            if (cat && selectedIcon && selectedText) {
                selectedIcon.innerHTML = cat.svg;
                selectedIcon.style.background = cat.bg;
                selectedIcon.style.color = cat.color;
                selectedText.textContent = cat.name;
                hiddenInput.value = cat.id;
            }
        };

        updateSelectedDisplay(hiddenInput.value || "Food & Dining");

        // Đóng/Mở dropdown khi bấm vào trigger button
        triggerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            wrapper.classList.toggle("open");
        });

        // Bắt sự kiện khi click chọn 1 danh mục
        optionsContainer.querySelectorAll(".custom-select-option").forEach(opt => {
            opt.addEventListener("click", (e) => {
                e.stopPropagation();
                const catId = opt.getAttribute("data-cat-id");
                updateSelectedDisplay(catId);

                optionsContainer.querySelectorAll(".custom-select-option").forEach(o => o.classList.remove("selected"));
                opt.classList.add("selected");
                wrapper.classList.remove("open");
            });
        });

        // Đóng dropdown khi click ra ngoài
        document.addEventListener("click", (e) => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove("open");
            }
        });
    }
};

// Global aliases for direct calls from HTML event handlers
function openModal(id) {
    UiService.openModal(id);
}
function closeModals() {
    UiService.closeModals();
}
