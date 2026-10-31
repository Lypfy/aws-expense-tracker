/**
 * AWS Serverless Expense Tracker - Charts & Visualizations
 * Vẽ biểu đồ đa đường (Multi-line series) chi tiêu theo danh mục, hover snap theo ngày và sóng sparklines thực tế
 */

const ChartService = {
    CATEGORY_COLORS: {
        "Food & Dining": "#fbbf24",      // Vàng hổ phách
        "Groceries": "#34d399",          // Xanh ngọc
        "Transportation": "#38bdf8",     // Xanh cyan
        "Healthcare": "#f87171",         // Đỏ hồng
        "Shopping": "#c084fc",           // Tím lavender
        "Utilities": "#fb923c",          // Cam
        "General": "#94a3b8"             // Xám bạc
    },

    chartState: null,
    hoverInitialized: false,
    sparklineStates: {},

    /**
     * Khởi tạo hoặc cập nhật biểu đồ xu hướng chi tiêu hàng tháng
     */
    renderMonthlyChart(transactions, currentMonth, selectedCategory = "ALL") {
        const canvas = document.getElementById("monthlyTrendChart");
        if (!canvas) return;

        const [year, month] = currentMonth.split("-").map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();

        // Lọc giao dịch trong tháng
        const monthTxs = transactions.filter(t => t.createdAt && t.createdAt.startsWith(currentMonth));

        // Phân loại chi tiêu theo ngày và theo danh mục
        const categoryDayMap = {};
        const categoryTotalMap = {};
        const overallDailyMap = {};
        for (let d = 1; d <= daysInMonth; d++) overallDailyMap[d] = 0;

        monthTxs.forEach(t => {
            const d = parseInt(t.createdAt.substring(8, 10), 10);
            const amt = parseFloat(t.amount) || 0;
            const cat = t.category || "General";

            if (d >= 1 && d <= daysInMonth) {
                overallDailyMap[d] += amt;

                if (!categoryDayMap[cat]) {
                    categoryDayMap[cat] = {};
                    for (let day = 1; day <= daysInMonth; day++) categoryDayMap[cat][day] = 0;
                    categoryTotalMap[cat] = 0;
                }
                categoryDayMap[cat][d] += amt;
                categoryTotalMap[cat] += amt;
            }
        });

        // Danh sách danh mục vẽ
        let activeCategories = [];
        if (selectedCategory === "ALL") {
            activeCategories = Object.keys(categoryDayMap);
        } else if (categoryDayMap[selectedCategory]) {
            activeCategories = [selectedCategory];
        }

        // Tính toán số liệu tổng & cực đại
        let displayTotal = 0;
        let maxSingleVal = 0;
        let peakDay = 0;

        if (selectedCategory === "ALL") {
            displayTotal = Object.values(overallDailyMap).reduce((a, b) => a + b, 0);
            for (let d = 1; d <= daysInMonth; d++) {
                if (overallDailyMap[d] > maxSingleVal) {
                    maxSingleVal = overallDailyMap[d];
                    peakDay = d;
                }
            }
        } else {
            displayTotal = categoryTotalMap[selectedCategory] || 0;
            const singleCatMap = categoryDayMap[selectedCategory] || {};
            for (let d = 1; d <= daysInMonth; d++) {
                const v = singleCatMap[d] || 0;
                if (v > maxSingleVal) {
                    maxSingleVal = v;
                    peakDay = d;
                }
            }
        }

        // Cập nhật số tiền lớn và nhãn tiêu đề
        const hugeNumberEl = document.getElementById("hugeMonthAmount");
        if (hugeNumberEl) hugeNumberEl.textContent = displayTotal.toLocaleString("vi-VN");

        const titleEl = document.getElementById("chartDisplayTitle");
        if (titleEl) {
            if (selectedCategory === "ALL") {
                titleEl.textContent = "Tổng chi tiêu tháng (Tất cả danh mục)";
            } else {
                const catObj = (typeof CONFIG !== "undefined" && CONFIG.CATEGORIES) 
                    ? CONFIG.CATEGORIES.find(c => c.id === selectedCategory) 
                    : null;
                titleEl.textContent = `Chi tiêu danh mục: ${catObj ? catObj.name : selectedCategory}`;
            }
        }

        // Cập nhật thông số phụ
        const avgDailyEl = document.getElementById("avgDailySpend");
        if (avgDailyEl) {
            const avg = Math.round(displayTotal / (daysInMonth || 30));
            avgDailyEl.textContent = avg.toLocaleString("vi-VN") + " ₫";
        }

        const peakEl = document.getElementById("peakSpendDay");
        if (peakEl) {
            peakEl.textContent = peakDay > 0 ? `Ngày ${peakDay} (${(maxSingleVal / 1000).toFixed(0)}k)` : "Chưa có";
        }

        // Cập nhật Ngân sách dự kiến & Tỷ lệ đã dùng
        const monthlyBudget = parseFloat(localStorage.getItem("expense_monthly_budget")) || 5000000;
        const budgetExpectedEl = document.getElementById("statBudgetExpected");
        if (budgetExpectedEl) {
            budgetExpectedEl.textContent = monthlyBudget.toLocaleString("vi-VN") + " ₫";
        }

        const budgetRatioEl = document.getElementById("statBudgetRatio");
        if (budgetRatioEl) {
            const ratio = ((displayTotal / monthlyBudget) * 100).toFixed(1);
            budgetRatioEl.textContent = ratio + "%";
            const numRatio = parseFloat(ratio);
            if (numRatio > 100) {
                budgetRatioEl.style.color = "var(--accent-red, #f87171)";
            } else if (numRatio > 80) {
                budgetRatioEl.style.color = "var(--accent-amber, #fbbf24)";
            } else {
                budgetRatioEl.style.color = "var(--accent-green, #34d399)";
            }
        }

        // Cập nhật thẻ Legend
        this.renderLegend(activeCategories, selectedCategory);

        // Lưu trạng thái biểu đồ
        this.chartState = {
            transactions,
            currentMonth,
            year,
            month,
            selectedCategory,
            daysInMonth,
            categoryDayMap,
            categoryTotalMap,
            overallDailyMap,
            activeCategories,
            maxSingleVal,
            upperLimit: maxSingleVal > 0 ? maxSingleVal * 1.3 : 100000,
            hoveredDay: null
        };

        // Gắn sự kiện chuột tương tác (nếu chưa gắn)
        this.initChartHoverEvents(canvas);

        // Vẽ biểu đồ
        this.drawMainChart();
    },

    /**
     * Khởi tạo các sự kiện hover chuột trên canvas chính (snap theo ngày)
     */
    initChartHoverEvents(canvas) {
        if (this.hoverInitialized) return;
        this.hoverInitialized = true;

        const handleHover = (clientX, clientY) => {
            if (!this.chartState) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;

            const { padL, padR, padT, padB, cssW, cssH, chartW, stepX, daysInMonth } = this.chartState;

            // Nếu chuột nằm ngoài vùng vẽ biểu đồ
            if (mouseX < padL - 8 || mouseX > cssW - padR + 8 || mouseY < padT - 15 || mouseY > cssH - padB + 15) {
                this.clearHover();
                return;
            }

            // Snap vào ngày gần nhất
            const dayFraction = (mouseX - padL) / stepX;
            const snappedDay = Math.min(Math.max(1, Math.round(dayFraction) + 1), daysInMonth);

            if (this.chartState.hoveredDay !== snappedDay) {
                this.chartState.hoveredDay = snappedDay;
                this.chartState.hoveredClientX = clientX;
                this.chartState.hoveredClientY = clientY;
                this.drawMainChart();
                this.updateTooltip(snappedDay, mouseX, mouseY);
            }
        };

        canvas.addEventListener("mousemove", (e) => {
            handleHover(e.clientX, e.clientY);
        });

        canvas.addEventListener("mouseleave", () => {
            this.clearHover();
        });

        // Hỗ trợ cảm ứng trên thiết bị di động
        canvas.addEventListener("touchmove", (e) => {
            if (e.touches && e.touches[0]) {
                handleHover(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        canvas.addEventListener("touchend", () => {
            this.clearHover();
        });
    },

    clearHover() {
        if (!this.chartState || this.chartState.hoveredDay === null) return;
        this.chartState.hoveredDay = null;
        this.drawMainChart();
        const tooltip = document.getElementById("chartHoverTooltip");
        if (tooltip) tooltip.style.display = "none";
    },

    /**
     * Vẽ canvas chính dựa trên trạng thái đã lưu
     */
    drawMainChart() {
        const canvas = document.getElementById("monthlyTrendChart");
        if (!canvas || !this.chartState) return;

        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = rect.width || 360;
        const cssH = rect.height || 145;

        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        ctx.scale(dpr, dpr);

        const padL = 14;
        const padR = 14;
        const padT = 20;
        const padB = 24;
        const chartW = cssW - padL - padR;
        const chartH = cssH - padT - padB;

        const { daysInMonth, selectedCategory, activeCategories, categoryDayMap, upperLimit, hoveredDay } = this.chartState;
        const stepX = chartW / (daysInMonth - 1);

        // Lưu lại thông số kích thước để xử lý hover
        this.chartState.padL = padL;
        this.chartState.padR = padR;
        this.chartState.padT = padT;
        this.chartState.padB = padB;
        this.chartState.cssW = cssW;
        this.chartState.cssH = cssH;
        this.chartState.chartW = chartW;
        this.chartState.chartH = chartH;
        this.chartState.stepX = stepX;

        ctx.clearRect(0, 0, cssW, cssH);

        // 1. Trường hợp chọn riêng 1 danh mục
        if (selectedCategory !== "ALL" && activeCategories.length > 0) {
            const catId = activeCategories[0];
            const color = this.CATEGORY_COLORS[catId] || "#a855f7";
            const dayMap = categoryDayMap[catId] || {};

            const points = [];
            for (let d = 1; d <= daysInMonth; d++) {
                const val = dayMap[d] || 0;
                const x = padL + (d - 1) * stepX;
                const y = padT + chartH - (val / upperLimit) * chartH;
                points.push({ x, y, val, d });
            }

            // Vùng Gradient fill
            const grad = ctx.createLinearGradient(0, padT, 0, cssH - padB);
            grad.addColorStop(0, `${color}40`);
            grad.addColorStop(1, `${color}00`);

            ctx.beginPath();
            ctx.moveTo(points[0].x, cssH - padB);
            ctx.lineTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const curr = points[i];
                const next = points[i + 1];
                const mx = (curr.x + next.x) / 2;
                ctx.bezierCurveTo(mx, curr.y, mx, next.y, next.x, next.y);
            }
            ctx.lineTo(points[points.length - 1].x, cssH - padB);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Đường spline
            this.drawSplineCurve(ctx, points, color, 2.5);

            // Các điểm tĩnh khi không hover
            if (hoveredDay === null) {
                this.drawPoints(ctx, points, color);
            }
        } else if (selectedCategory === "ALL") {
            // 2. Trường hợp Đa đường: Vẽ từng danh mục
            if (activeCategories.length > 0) {
                activeCategories.forEach(catId => {
                    const color = this.CATEGORY_COLORS[catId] || "#a855f7";
                    const dayMap = categoryDayMap[catId] || {};
                    const points = [];

                    for (let d = 1; d <= daysInMonth; d++) {
                        const val = dayMap[d] || 0;
                        const x = padL + (d - 1) * stepX;
                        const y = padT + chartH - (val / upperLimit) * chartH;
                        points.push({ x, y, val, d });
                    }

                    this.drawSplineCurve(ctx, points, color, 2.0);
                    if (hoveredDay === null) {
                        this.drawPoints(ctx, points, color, false);
                    }
                });
            } else {
                ctx.beginPath();
                ctx.moveTo(padL, cssH - padB);
                ctx.lineTo(cssW - padR, cssH - padB);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        // 3. HIỆU ỨNG KHI HOVER: ĐƯỜNG DẪN SNAP THEO NGÀY & CÁC CHẤM SỐ LIỆU TẠI CHUỘT
        if (hoveredDay !== null) {
            const snapX = padL + (hoveredDay - 1) * stepX;

            // Đường thẳng đứng đứt nét snap theo ngày
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.moveTo(snapX, padT - 6);
            ctx.lineTo(snapX, cssH - padB);
            ctx.stroke();
            ctx.restore();

            // Vẽ các chấm sáng nổi bật trên từng đường tại ngày đang hover
            activeCategories.forEach(catId => {
                const color = this.CATEGORY_COLORS[catId] || "#a855f7";
                const dayMap = categoryDayMap[catId] || {};
                const val = dayMap[hoveredDay] || 0;
                const snapY = padT + chartH - (val / upperLimit) * chartH;

                // Vòng hào quang ngoài (Halo)
                ctx.beginPath();
                ctx.arc(snapX, snapY, 7, 0, Math.PI * 2);
                ctx.fillStyle = `${color}40`;
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Tâm chấm tròn
                ctx.beginPath();
                ctx.arc(snapX, snapY, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = "#ffffff";
                ctx.fill();
            });

            // Nhãn ngày nổi bật ở trục đáy
            ctx.save();
            ctx.fillStyle = "#a855f7";
            ctx.font = "bold 11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(String(hoveredDay).padStart(2, "0"), snapX, cssH - 6);
            ctx.restore();
        } else {
            // Nhãn trục ngày ở đáy bình thường
            ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
            ctx.font = "10px Inter, sans-serif";
            ctx.textAlign = "center";
            [1, 5, 10, 15, 20, 25, daysInMonth].forEach(d => {
                const x = padL + (d - 1) * stepX;
                ctx.fillText(String(d).padStart(2, "0"), x, cssH - 6);
            });
        }
    },

    /**
     * Cập nhật nội dung và vị trí của tooltip nổi khi hover
     */
    updateTooltip(day, mouseX, mouseY) {
        const tooltip = document.getElementById("chartHoverTooltip");
        if (!tooltip || !this.chartState) return;

        const { year, month, selectedCategory, activeCategories, categoryDayMap, overallDailyMap, padL, stepX, cssW } = this.chartState;
        const snapX = padL + (day - 1) * stepX;

        const mStr = String(month).padStart(2, "0");
        const dStr = String(day).padStart(2, "0");
        let contentHtml = `<div class="tooltip-header"><span>Ngày ${dStr}/${mStr}/${year}</span></div>`;

        if (selectedCategory === "ALL") {
            const spendingCats = activeCategories.filter(cat => (categoryDayMap[cat] && categoryDayMap[cat][day] > 0));
            const totalForDay = overallDailyMap[day] || 0;

            if (spendingCats.length > 0) {
                contentHtml += spendingCats.map(cat => {
                    const color = this.CATEGORY_COLORS[cat] || "#a855f7";
                    const val = categoryDayMap[cat][day];
                    const catObj = (typeof CONFIG !== "undefined" && CONFIG.CATEGORIES) 
                        ? CONFIG.CATEGORIES.find(c => c.id === cat) 
                        : null;
                    const catName = catObj ? catObj.name : cat;
                    return `
                        <div class="tooltip-row">
                            <span class="tooltip-cat-label">
                                <span class="tooltip-cat-dot" style="background: ${color};"></span>
                                ${catName}
                            </span>
                            <span class="tooltip-cat-val">${val.toLocaleString("vi-VN")} ₫</span>
                        </div>
                    `;
                }).join("");

                contentHtml += `
                    <div class="tooltip-row tooltip-total-row">
                        <span style="color: #94a3b8; font-weight: 600;">Tổng ngày:</span>
                        <strong style="color: var(--accent-green); font-weight: 700;">${totalForDay.toLocaleString("vi-VN")} ₫</strong>
                    </div>
                `;
            } else {
                contentHtml += `<div class="tooltip-row" style="color: #64748b;">Không có chi tiêu (0 ₫)</div>`;
            }
        } else {
            const catId = selectedCategory;
            const color = this.CATEGORY_COLORS[catId] || "#a855f7";
            const val = (categoryDayMap[catId] && categoryDayMap[catId][day]) || 0;
            const catObj = (typeof CONFIG !== "undefined" && CONFIG.CATEGORIES) 
                ? CONFIG.CATEGORIES.find(c => c.id === catId) 
                : null;
            const catName = catObj ? catObj.name : catId;

            contentHtml += `
                <div class="tooltip-row">
                    <span class="tooltip-cat-label">
                        <span class="tooltip-cat-dot" style="background: ${color};"></span>
                        ${catName}
                    </span>
                    <strong class="tooltip-cat-val">${val.toLocaleString("vi-VN")} ₫</strong>
                </div>
            `;
        }

        tooltip.innerHTML = contentHtml;
        tooltip.style.display = "block";

        // Định vị tooltip căn giữa snapX
        const tooltipWidth = tooltip.offsetWidth || 160;
        let leftPos = snapX;
        if (leftPos - tooltipWidth / 2 < 10) {
            leftPos = tooltipWidth / 2 + 10;
        } else if (leftPos + tooltipWidth / 2 > cssW - 10) {
            leftPos = cssW - tooltipWidth / 2 - 10;
        }

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `24px`;
    },

    /**
     * Vẽ biểu đồ mini Sparklines THỰC TẾ cho 3 thẻ danh mục phổ biến nhất
     */
    renderCategorySparklines(transactions, currentMonth, sortedCats) {
        const [year, month] = currentMonth.split("-").map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();

        const canvasIds = ["canvasSpark1", "canvasSpark2", "canvasSpark3"];

        canvasIds.forEach((canvasId, index) => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            if (sortedCats && sortedCats[index]) {
                const [catId] = sortedCats[index];
                const color = this.CATEGORY_COLORS[catId] || "#a855f7";

                // Tính chi tiêu thực tế theo từng ngày trong tháng của danh mục này
                const dailyAmounts = new Array(daysInMonth).fill(0);
                transactions.forEach(t => {
                    if (t.createdAt && t.createdAt.startsWith(currentMonth) && t.category === catId) {
                        const d = parseInt(t.createdAt.substring(8, 10), 10);
                        const amt = parseFloat(t.amount) || 0;
                        if (d >= 1 && d <= daysInMonth) {
                            dailyAmounts[d - 1] += amt;
                        }
                    }
                });

                this.drawSparklineWithHover(canvasId, color, dailyAmounts, catId, daysInMonth);
            } else {
                // Không có danh mục: vẽ đường phẳng nhẹ nhàng
                this.drawSparklineWithHover(canvasId, "#64748b", new Array(daysInMonth).fill(0), "Chưa có", daysInMonth);
            }
        });
    },

    /**
     * Vẽ sparkline với hiệu ứng hover snap theo ngày
     */
    drawSparklineWithHover(canvasId, color, dailyAmounts, catName, daysInMonth) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        this.sparklineStates[canvasId] = {
            color,
            dailyAmounts,
            catName,
            daysInMonth,
            hoveredDay: null
        };

        const render = () => {
            const state = this.sparklineStates[canvasId];
            if (!state) return;

            const ctx = canvas.getContext("2d");
            const dpr = window.devicePixelRatio || 1;
            const w = canvas.width = canvas.offsetWidth * dpr;
            const h = canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);

            const cssW = w / dpr;
            const cssH = h / dpr;

            ctx.clearRect(0, 0, cssW, cssH);

            const padX = 6;
            const padY = 8;
            const step = (cssW - padX * 2) / (daysInMonth - 1);
            const maxVal = Math.max(...dailyAmounts, 0);
            const upper = maxVal > 0 ? maxVal * 1.25 : 100;

            const points = dailyAmounts.map((amt, idx) => ({
                x: padX + idx * step,
                y: cssH - padY - (amt / upper) * (cssH - padY * 2),
                val: amt,
                day: idx + 1
            }));

            // Nếu tất cả là 0: vẽ đường phẳng ở đáy
            if (maxVal === 0) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
                ctx.lineWidth = 1.5;
                ctx.moveTo(padX, cssH - padY);
                ctx.lineTo(cssW - padX, cssH - padY);
                ctx.stroke();
                return;
            }

            // Gradient fill nhẹ dưới đường sparkline
            const grad = ctx.createLinearGradient(0, padY, 0, cssH);
            grad.addColorStop(0, `${color}30`);
            grad.addColorStop(1, `${color}00`);

            ctx.beginPath();
            ctx.moveTo(points[0].x, cssH - padY);
            ctx.lineTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const curr = points[i];
                const next = points[i + 1];
                const mx = (curr.x + next.x) / 2;
                ctx.bezierCurveTo(mx, curr.y, mx, next.y, next.x, next.y);
            }
            ctx.lineTo(points[points.length - 1].x, cssH - padY);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();

            // Đường cong spline
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 0; i < points.length - 1; i++) {
                const curr = points[i];
                const next = points[i + 1];
                const mx = (curr.x + next.x) / 2;
                ctx.bezierCurveTo(mx, curr.y, mx, next.y, next.x, next.y);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();

            // Điểm kết thúc hoặc điểm hover snap kèm con số mốc thời gian
            if (state.hoveredDay !== null) {
                const p = points[state.hoveredDay - 1];
                if (p) {
                    // 1. Đường gióng thẳng đứng mờ
                    ctx.save();
                    ctx.beginPath();
                    ctx.setLineDash([2, 2]);
                    ctx.strokeStyle = `${color}55`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, padY);
                    ctx.lineTo(p.x, cssH - padY);
                    ctx.stroke();
                    ctx.restore();

                    // 2. Vòng hào quang ngoài
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
                    ctx.fillStyle = `${color}40`;
                    ctx.fill();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();

                    // 3. Chấm tròn trắng ở tâm
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffffff";
                    ctx.fill();

                    // 4. Nhãn hiển thị con số chi tiêu tại mốc thời gian đang hover (Chỉ hiển thị số tiền chi tiêu)
                    const dayLabel = `${p.val.toLocaleString("vi-VN")} ₫`;

                    ctx.save();
                    ctx.font = "bold 9.5px 'Plus Jakarta Sans', sans-serif";
                    const textWidth = ctx.measureText(dayLabel).width;
                    const badgeW = textWidth + 12;
                    const badgeH = 17;

                    let badgeX = p.x - badgeW / 2;
                    if (badgeX < 4) badgeX = 4;
                    if (badgeX + badgeW > cssW - 4) badgeX = cssW - badgeW - 4;

                    let badgeY = p.y - badgeH - 6;
                    if (badgeY < 2) {
                        badgeY = p.y + 8;
                    }

                    ctx.fillStyle = "rgba(12, 15, 23, 0.94)";
                    ctx.strokeStyle = `${color}99`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
                    } else {
                        ctx.rect(badgeX, badgeY, badgeW, badgeH);
                    }
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(dayLabel, badgeX + badgeW / 2, badgeY + badgeH / 2);
                    ctx.restore();
                }
            } else {
                const last = points[points.length - 1];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        render();

        // Gắn sự kiện chuột cho sparkline (nếu chưa gắn)
        if (!canvas._hasHover) {
            canvas._hasHover = true;
            canvas.addEventListener("mousemove", (e) => {
                const state = this.sparklineStates[canvasId];
                if (!state) return;
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const step = (rect.width - 12) / (state.daysInMonth - 1);
                const day = Math.min(Math.max(1, Math.round((mouseX - 6) / step) + 1), state.daysInMonth);
                if (state.hoveredDay !== day) {
                    state.hoveredDay = day;
                    render();
                }
            });

            canvas.addEventListener("mouseleave", () => {
                const state = this.sparklineStates[canvasId];
                if (state) {
                    state.hoveredDay = null;
                    render();
                }
            });
        }
    },

    /**
     * Hàm vẽ đường cong Bezier Spline
     */
    drawSplineCurve(ctx, points, color, lineWidth = 2) {
        if (!points || points.length === 0) return;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const mx = (curr.x + next.x) / 2;
            ctx.bezierCurveTo(mx, curr.y, mx, next.y, next.x, next.y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    },

    /**
     * Vẽ các chấm tròn tại các ngày có giao dịch
     */
    drawPoints(ctx, points, color, showLabels = true) {
        points.forEach(p => {
            if (p.val > 0) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
                ctx.fillStyle = `${color}40`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();

                if (showLabels) {
                    ctx.fillStyle = "#e2e8f0";
                    ctx.font = "bold 9px Inter, sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText(`${(p.val / 1000).toFixed(0)}k`, p.x, p.y - 7);
                }
            }
        });
    },

    /**
     * Hiển thị Legend danh mục
     */
    renderLegend(categories, selectedCategory) {
        const legendContainer = document.getElementById("chartLegendContainer");
        if (!legendContainer) return;

        if (selectedCategory !== "ALL") {
            const color = this.CATEGORY_COLORS[selectedCategory] || "#a855f7";
            const catObj = (typeof CONFIG !== "undefined" && CONFIG.CATEGORIES) 
                ? CONFIG.CATEGORIES.find(c => c.id === selectedCategory) 
                : null;
            const name = catObj ? catObj.name : selectedCategory;
            legendContainer.innerHTML = `
                <span class="chart-legend-badge" style="border-color: ${color}40; background: ${color}15; color: ${color};">
                    <span class="legend-dot" style="background: ${color}; box-shadow: 0 0 6px ${color};"></span>
                    ${name}
                </span>
            `;
            return;
        }

        if (categories.length === 0) {
            legendContainer.innerHTML = `<span class="chart-legend-badge"><span class="legend-dot"></span> Chưa có chi tiêu</span>`;
            return;
        }

        legendContainer.innerHTML = categories.map(cat => {
            const color = this.CATEGORY_COLORS[cat] || "#a855f7";
            const catObj = (typeof CONFIG !== "undefined" && CONFIG.CATEGORIES) 
                ? CONFIG.CATEGORIES.find(c => c.id === cat) 
                : null;
            const name = catObj ? catObj.name : cat;
            return `
                <div class="legend-series-item">
                    <span class="legend-series-dot" style="background: ${color}; box-shadow: 0 0 4px ${color};"></span>
                    <span>${name}</span>
                </div>
            `;
        }).join("");
    }
};
