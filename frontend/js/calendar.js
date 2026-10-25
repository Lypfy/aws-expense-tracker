/**
 * AWS Serverless Expense Tracker - Calendar & Period Controller
 * Quản lý bộ chọn lịch tháng/ngày (Windows Calendar style), dropdown kỳ báo cáo và đồng bộ thời gian
 */

const CalendarService = {
  /**
   * Khởi tạo các sự kiện cho popup Lịch ở trang Lịch sử chi tiêu
   */
  setupCalendarPicker({ onPrevMonth, onNextMonth, onViewAll }) {
    const wrapper = document.getElementById("calendarPickerDropdown");
    const triggerBtn = document.getElementById("calendarTriggerBtn");
    const prevBtn = document.getElementById("calPrevMonthBtn");
    const nextBtn = document.getElementById("calNextMonthBtn");
    const viewAllBtn = document.getElementById("btnCalViewAll");

    if (!wrapper || !triggerBtn) return;

    // Mở / Đóng popover lịch khi bấm nút trigger
    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      wrapper.classList.toggle("open");
    });

    // Đóng khi click ngoài
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("open");
      }
    });

    // Chuyển tháng trước
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof onPrevMonth === "function") onPrevMonth();
      });
    }

    // Chuyển tháng sau
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof onNextMonth === "function") onNextMonth();
      });
    }

    // Nút xem toàn bộ ngày trong tháng
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        wrapper.classList.remove("open");
        if (typeof onViewAll === "function") onViewAll();
      });
    }
  },

  /**
   * Render các ô ngày trong lưới lịch theo mẫu Windows Calendar
   */
  renderCalendarDays(transactions, currentMonth, selectedDay, onDayClick) {
    const grid = document.getElementById("calendarDaysGrid");
    const monthLabel = document.getElementById("calCurrentMonthLabel");
    if (!grid) return;

    const [year, month] = currentMonth.split("-").map(Number);
    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    if (monthLabel) {
      monthLabel.textContent = `${monthNames[month - 1]}, ${year}`;
    }

    // Tập hợp các ngày có giao dịch trong tháng
    const daysWithTx = new Set();
    transactions.forEach((t) => {
      if (t.createdAt && t.createdAt.startsWith(currentMonth)) {
        const dayNum = parseInt(t.createdAt.substring(8, 10), 10);
        if (!isNaN(dayNum)) daysWithTx.add(dayNum);
      }
    });

    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0: CN, 1: T2,...
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    let html = "";

    // Các ngày cuối của tháng trước
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      html += `<div class="cal-day-cell other-month">${daysInPrevMonth - i}</div>`;
    }

    // Các ngày của tháng hiện tại
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, "0");
      const fullDateStr = `${currentMonth}-${dayStr}`;
      const hasTx = daysWithTx.has(d);
      const isSelected = selectedDay === fullDateStr;

      html += `
                <div class="cal-day-cell ${hasTx ? "has-tx" : ""} ${isSelected ? "selected-day" : ""}" 
                     data-date="${fullDateStr}" 
                     title="${hasTx ? `Ngày ${d} có phát sinh chi tiêu` : `Ngày ${d}`}">
                    ${d}
                </div>
            `;
    }

    // Điền thêm các ngày đầu của tháng sau cho đủ hàng 7 cột
    const totalCells = firstDayIndex + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let j = 1; j <= remaining; j++) {
      html += `<div class="cal-day-cell other-month">${j}</div>`;
    }

    grid.innerHTML = html;

    // Bắt sự kiện chọn ngày
    grid.querySelectorAll(".cal-day-cell:not(.other-month)").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        e.stopPropagation();
        const dateStr = cell.getAttribute("data-date");
        const wrapper = document.getElementById("calendarPickerDropdown");
        if (wrapper) wrapper.classList.remove("open");
        if (typeof onDayClick === "function") {
          onDayClick(dateStr);
        }
      });
    });
  },

  /**
   * Cập nhật nhãn hiển thị trên nút chọn lịch
   */
  updateCalendarTriggerLabel(currentMonth, selectedDay) {
    const label = document.getElementById("calendarSelectedLabel");
    if (!label) return;

    const [year, month] = currentMonth.split("-");
    const monthNum = parseInt(month, 10);
    if (selectedDay) {
      const parts = selectedDay.split("-");
      label.textContent = `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
    } else {
      label.textContent = `Tháng ${monthNum}/${year}`;
    }
  },

  /**
   * Khởi tạo bộ lọc dropdown Tháng và Năm ở ĐẦU MỖI TRANG (Đồng bộ lẫn nhau)
   */
  setupPagePeriodSelectors(onPeriodChange) {
    const overviewM = document.getElementById("overviewMonthSelect");
    const overviewY = document.getElementById("overviewYearSelect");
    const historyM = document.getElementById("historyMonthSelect");
    const historyY = document.getElementById("historyYearSelect");

    const handleOverviewChange = () => {
      if (!overviewM || !overviewY) return;
      const newMonth = `${overviewY.value}-${overviewM.value}`;
      if (historyM) historyM.value = overviewM.value;
      if (historyY) historyY.value = overviewY.value;
      if (typeof onPeriodChange === "function") onPeriodChange(newMonth);
    };

    const handleHistoryChange = () => {
      if (!historyM || !historyY) return;
      const newMonth = `${historyY.value}-${historyM.value}`;
      if (overviewM) overviewM.value = historyM.value;
      if (overviewY) overviewY.value = historyY.value;
      if (typeof onPeriodChange === "function") onPeriodChange(newMonth);
    };

    if (overviewM) overviewM.addEventListener("change", handleOverviewChange);
    if (overviewY) overviewY.addEventListener("change", handleOverviewChange);
    if (historyM) historyM.addEventListener("change", handleHistoryChange);
    if (historyY) historyY.addEventListener("change", handleHistoryChange);
  },

  /**
   * Đồng bộ hiển thị tháng/năm trên toàn bộ giao diện
   */
  syncAllPeriodDisplays(currentMonth, selectedDay) {
    const [year, month] = currentMonth.split("-");
    const monthNum = parseInt(month, 10);

    // 1. Nhãn đầu trang Tổng quan
    const activeLabel = document.getElementById("activePeriodLabel");
    if (activeLabel) {
      activeLabel.textContent = `Tháng ${monthNum}/${year}`;
    }

    // 2. Đồng bộ các dropdown Tháng/Năm
    const pairs = [
      ["overviewMonthSelect", "overviewYearSelect"],
      ["historyMonthSelect", "historyYearSelect"],
    ];

    pairs.forEach(([mId, yId]) => {
      const mEl = document.getElementById(mId);
      const yEl = document.getElementById(yId);
      if (mEl && mEl.value !== month) mEl.value = month;
      if (yEl && yEl.value !== year) yEl.value = year;
    });

    // 3. Nhãn nút lịch & popover
    this.updateCalendarTriggerLabel(currentMonth, selectedDay);
    const calMonthLabel = document.getElementById("calCurrentMonthLabel");
    if (calMonthLabel) {
      calMonthLabel.textContent = `Tháng ${monthNum}, ${year}`;
    }
  },
};
