/**
 * ShiftMaster Pro - Core Application Logic
 * Comprehensive Web Scheduling & Workforce Management System
 * 
 * Features:
 * - Flexible Scheduling Periods (Month, 7-day, 14-day, Custom)
 * - Simplified Shifts (Chinese Name, Chinese Code, English Code, Colors, Leave Flags)
 * - Overtime Hours Logging & Breakdown per Staff Member
 * - Individual Staff Hours & Detailed Modal
 * - Salary Breakdown & Customizable Overtime Pay Multiplier
 * - Monthly Leave Quota Tracking & One-Click Batch Allocation
 * - Headcount Adequacy Verification (Weekday, Weekend, and Custom Dates)
 * - Auto-Scheduling with Anti-Pairs, Role Restrictions & Fairness Balancing
 * - Two-Tier Tailored Excel Export with Full Title/Cell-Merge Customization
 */

(function () {
  'use strict';

  // --- Storage & State Keys ---
  const STORAGE_KEY = 'shiftmaster_pro_v2';
  const THEME_KEY = 'shiftmaster_theme';

  // --- 2026-10-18 預設排班範本 (人員名冊與班別設定) ---
  const DEFAULT_TEMPLATE = {
  "staff": [
    {
      "id": "staff_1792162844249",
      "name": "蕭葦茹",
      "role": "店長",
      "wage": 200,
      "maxHours": 40,
      "color": "#ee719e",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 160
    },
    {
      "id": "staff_1792162876427",
      "name": "吳喬宛",
      "role": "正職",
      "wage": 200,
      "maxHours": 40,
      "color": "#be38f3",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 40
    },
    {
      "id": "staff_1792162922716",
      "name": "李青純",
      "role": "正職",
      "wage": 200,
      "maxHours": 40,
      "color": "#fefb41",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 40
    },
    {
      "id": "staff_1792162949616",
      "name": "羅靜雯",
      "role": "老闆",
      "wage": 200,
      "maxHours": 40,
      "color": "#e22400",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 40
    },
    {
      "id": "staff_1792163003194",
      "name": "陳奕靜",
      "role": "工讀生",
      "wage": 200,
      "maxHours": 40,
      "color": "#01c7fc",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 40
    },
    {
      "id": "staff_1792163035426",
      "name": "游宜臻",
      "role": "工讀生",
      "wage": 200,
      "maxHours": 40,
      "color": "#96d35f",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 40
    },
    {
      "id": "staff_1792249659974",
      "name": "陳姣嬋",
      "role": "工讀生",
      "wage": 200,
      "maxHours": 40,
      "color": "#6366f1",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 160
    },
    {
      "id": "staff_1792249704287",
      "name": "陳玉珮",
      "role": "工讀生",
      "wage": 200,
      "maxHours": 40,
      "color": "#feb43f",
      "offPref": "none",
      "leaveQuota": 8,
      "periodMaxHours": 40
    }
  ],
  "shifts": [
    {
      "id": "shift_off",
      "name": "休假",
      "code": "休",
      "enCode": "H",
      "start": "00:00",
      "end": "00:00",
      "hours": 0,
      "color": "#ffffff",
      "textColor": "#ef4444",
      "bgTransparent": true,
      "targetStaff": 0,
      "isLeave": true
    },
    {
      "id": "shift_1789744720001",
      "name": "A",
      "code": "A",
      "enCode": "A",
      "start": "09:30",
      "end": "18:30",
      "hours": 8,
      "color": "#ffffff",
      "textColor": "#000000",
      "bgTransparent": true,
      "targetStaff": 1,
      "isLeave": false
    },
    {
      "id": "shift_1789744781872",
      "name": "B",
      "code": "B",
      "enCode": "B",
      "start": "11:00",
      "end": "20:00",
      "hours": 8,
      "color": "#ffffff",
      "textColor": "#000000",
      "bgTransparent": true,
      "targetStaff": 1,
      "isLeave": false
    },
    {
      "id": "shift_1789744831308",
      "name": "C",
      "code": "C",
      "enCode": "C",
      "start": "09:30",
      "end": "20:00",
      "hours": 9.5,
      "color": "#ffffff",
      "textColor": "#000000",
      "bgTransparent": true,
      "targetStaff": 1,
      "isLeave": false
    },
    {
      "id": "shift_1792247726553",
      "name": "打菜",
      "code": "D",
      "enCode": "D",
      "start": "10:00",
      "end": "19:00",
      "hours": 8,
      "color": "#ffffff",
      "textColor": "#000000",
      "bgTransparent": true,
      "targetStaff": 1,
      "isLeave": false
    },
    {
      "id": "shift_1792249605127",
      "name": "三阿姨",
      "code": "3",
      "enCode": "3",
      "start": "10:30",
      "end": "13:00",
      "hours": 2.5,
      "color": "#ffffff",
      "textColor": "#000000",
      "bgTransparent": true,
      "targetStaff": 1,
      "isLeave": false
    },
    {
      "id": "shift_1792302074861",
      "name": "排休",
      "code": "排",
      "enCode": "H",
      "start": "09:00",
      "end": "09:00",
      "hours": 0,
      "color": "#ffffff",
      "textColor": "#0042a9",
      "bgTransparent": true,
      "targetStaff": 2,
      "isLeave": true
    }
  ],
  "roles": [
    "店長",
    "正職",
    "工讀生",
    "老闆"
  ],
  "rules": {
    "maxDailyShifts": 1,
    "maxConsecutiveDays": 6,
    "maxDailyHours": 12,
    "periodMaxHours": 160,
    "monthlyLeaveQuota": 8,
    "weekdayShiftMin": {},
    "holidayShiftMin": {},
    "headcount": {
      "weekdayMin": 3,
      "weekendMin": 4,
      "customDates": []
    }
  },
  "antiPairs": [],
  "roleRestrictions": [],
  "staffRestrictions": [],
  "shiftFairness": [],
  "otMultiplier": 1.34,
  "shiftDisplayLang": "zh",
  "schedules": {}
};

  // --- Default Roles (從 2026-10-18 範本設定) ---
  const DEFAULT_ROLES = (DEFAULT_TEMPLATE.roles && DEFAULT_TEMPLATE.roles.length > 0)
    ? DEFAULT_TEMPLATE.roles
    : ['店長', '正職', '工讀生', '老闆'];

  // --- Default Shifts Configuration (從 2026-10-18 範本設定) ---
  const DEFAULT_SHIFTS = DEFAULT_TEMPLATE.shifts;

  // --- Default Staff Roster (從 2026-10-18 範本設定) ---
  const DEFAULT_STAFF = DEFAULT_TEMPLATE.staff;

  const DAY_NAMES_ZH = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const DAY_NAMES_FULL_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const DAY_NAMES_SHORT_ZH = ['日', '一', '二', '三', '四', '五', '六'];
  const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- App State ---
  let state = {
    staff: [],
    shifts: [],
    roles: [...DEFAULT_ROLES],
    // Keyed by `${staffId}_${dateStr}` => { shiftId: string, otHours: number } or string (compatible)
    schedules: {},
    // Flexible Period State
    periodMode: 'month', // '7days' | '14days' | 'month' | 'custom'
    periodStart: new Date(),
    periodEnd: new Date(),
    selectedDayIndex: 0,
    currentView: window.innerWidth <= 768 ? 'day' : 'day',
    // Shift Display Language: 'zh' or 'en'
    shiftDisplayLang: 'zh',
    // Overtime Pay Multiplier (Default 1.34)
    otMultiplier: 1.34,
    // Regulatory Rules Config
    rules: {
      maxDailyShifts: 1,
      maxConsecutiveDays: 6,
      maxDailyHours: 12,
      periodMaxHours: 160,
      monthlyLeaveQuota: 8,
      weekdayShiftMin: {}, // { shiftId: count }
      holidayShiftMin: {}, // { shiftId: count }
      headcount: {
        weekdayMin: 3,
        weekendMin: 4,
        customDates: [] // Array of { date: 'YYYY-MM-DD', min: number }
      }
    },
    // Auto-Schedule Advanced Rules
    antiPairs: [], // Array of [staffIdA, staffIdB]
    roleRestrictions: [], // Array of { role: string, shiftId: string }
    staffRestrictions: [], // Array of { staffId: string, shiftId: string }
    shiftFairness: [], // Shift IDs that must be balanced
    activeTarget: null
  };

  // --- DOM Elements References (Cached safely) ---
  const elPeriodModeSelect = document.getElementById('period-mode-select');
  const elCustomDateContainer = document.getElementById('custom-date-range-container');
  const elInputPeriodStart = document.getElementById('input-period-start');
  const elInputPeriodEnd = document.getElementById('input-period-end');
  const elBtnApplyCustomDates = document.getElementById('btn-apply-custom-dates');
  const elPeriodDisplayBadge = document.getElementById('period-display-badge');

  const elDateCarousel = document.getElementById('mobile-date-carousel');
  const elDaySummaryTitle = document.getElementById('day-summary-title');
  const elDaySummaryHeadcount = document.getElementById('day-summary-headcount');
  const elMobileStaffCards = document.getElementById('mobile-staff-cards-list');
  const elStaffWeeklyList = document.getElementById('staff-weekly-cards-list');

  // Containers
  const elContainerDay = document.getElementById('container-day-view');
  const elContainerStaff = document.getElementById('container-staff-view');
  const elContainerTable = document.getElementById('container-table-view');
  const elContainerStats = document.getElementById('container-stats-view');

  // Table Elements
  const elTableHeader = document.getElementById('schedule-table-header');
  const elTableBody = document.getElementById('schedule-table-body');
  const elTableFooter = document.getElementById('schedule-table-footer');
  const elLegend = document.getElementById('shifts-legend-container');

  // Stats Table Elements
  const elStatsTableHeader = document.getElementById('stats-table-header');
  const elStatsTableBody = document.getElementById('stats-table-body');
  const elModalShiftDateDetails = document.getElementById('modal-shift-date-details');

  // Rules Settings Elements
  const elRulePeriodMaxHours = document.getElementById('rule-period-max-hours');
  const elRuleMonthlyLeaveQuota = document.getElementById('rule-monthly-leave-quota');

  // KPI elements
  const elStatHours = document.getElementById('stat-total-hours');
  const elStatAvgHours = document.getElementById('stat-avg-hours');
  const elStatShifts = document.getElementById('stat-total-shifts');
  const elStatCoverage = document.getElementById('stat-coverage-rate');
  const elStatCost = document.getElementById('stat-total-cost');
  const elStatAlertCount = document.getElementById('stat-alert-count');
  const elStatAlertDesc = document.getElementById('stat-alert-desc');
  const elCardHours = document.getElementById('card-hours');
  const elCardLeaves = document.getElementById('card-leaves');
  const elCardCost = document.getElementById('card-cost');
  const elCardAlert = document.getElementById('card-alert');

  // Bottom Sheet Elements
  const elBottomSheetBackdrop = document.getElementById('bottom-sheet-backdrop');
  const elBottomSheetTitle = document.getElementById('bottom-sheet-title');
  const elBottomSheetSubtitle = document.getElementById('bottom-sheet-subtitle');
  const elDrawerShiftsList = document.getElementById('drawer-shifts-list');
  const elBtnSheetSetOff = document.getElementById('btn-sheet-set-off');
  const elBtnSheetClear = document.getElementById('btn-sheet-clear');
  const elBtnCloseBottomSheet = document.getElementById('btn-close-bottom-sheet');
  const elInputOvertimeHours = document.getElementById('input-overtime-hours');
  const elInputEarlyLeaveHours = document.getElementById('input-early-leave-hours');

  // Desktop Popover & Modals
  const elShiftPicker = document.getElementById('shift-picker-popover');
  const elToastContainer = document.getElementById('toast-container');
  const elStaffModal = document.getElementById('modal-staff');
  const elShiftsModal = document.getElementById('modal-shifts');
  const elRulesModal = document.getElementById('modal-rules');
  const elAutoRulesModal = document.getElementById('modal-auto-rules');
  const elHoursModal = document.getElementById('modal-hours-detail');
  const elCostModal = document.getElementById('modal-cost-detail');
  const elLeavesModal = document.getElementById('modal-leaves');
  const elExcelModal = document.getElementById('modal-excel-options');
  const elShiftStatsModal = document.getElementById('modal-shift-stats');

  // Table-view Language Display Toggle
  const elBtnToggleShiftLangTable = document.getElementById('btn-toggle-shift-lang-table');
  const elLabelShiftLangTable = document.getElementById('label-shift-lang-table');

  // ==========================================================================
  // Flexible Period Helper Functions
  // ==========================================================================
  function calculatePeriodRange(mode, anchorDate) {
    const base = new Date(anchorDate);
    let start, end;

    if (mode === 'month') {
      start = new Date(base.getFullYear(), base.getMonth(), 1);
      end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    } else if (mode === '7days') {
      const day = base.getDay();
      const diff = base.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(base.setDate(diff));
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else if (mode === '14days') {
      const day = base.getDay();
      const diff = base.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(base.setDate(diff));
      end = new Date(start);
      end.setDate(start.getDate() + 13);
    } else {
      start = state.periodStart ? new Date(state.periodStart) : new Date();
      end = state.periodEnd ? new Date(state.periodEnd) : new Date();
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return { start, end };
  }

  function getPeriodDays() {
    const days = [];
    const current = new Date(state.periodStart);
    const end = new Date(state.periodEnd);

    let safetyCounter = 0;
    while (current <= end && safetyCounter < 90) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      safetyCounter++;
    }
    return days;
  }

  function shiftPeriod(delta) {
    if (state.periodMode === 'month') {
      const currentMonth = state.periodStart.getMonth();
      const targetDate = new Date(state.periodStart);
      targetDate.setMonth(currentMonth + delta);
      const range = calculatePeriodRange('month', targetDate);
      state.periodStart = range.start;
      state.periodEnd = range.end;
    } else if (state.periodMode === '7days') {
      state.periodStart.setDate(state.periodStart.getDate() + delta * 7);
      state.periodEnd.setDate(state.periodEnd.getDate() + delta * 7);
    } else if (state.periodMode === '14days') {
      state.periodStart.setDate(state.periodStart.getDate() + delta * 14);
      state.periodEnd.setDate(state.periodEnd.getDate() + delta * 14);
    } else {
      const daysCount = Math.round((state.periodEnd - state.periodStart) / (1000 * 60 * 60 * 24)) + 1;
      state.periodStart.setDate(state.periodStart.getDate() + delta * daysCount);
      state.periodEnd.setDate(state.periodEnd.getDate() + delta * daysCount);
    }

    if (elInputPeriodStart) elInputPeriodStart.value = formatDateIso(state.periodStart);
    if (elInputPeriodEnd) elInputPeriodEnd.value = formatDateIso(state.periodEnd);

    const days = getPeriodDays();
    if (state.selectedDayIndex >= days.length) {
      state.selectedDayIndex = 0;
    }

    renderAll();
  }

  function formatDateIso(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }

  // ==========================================================================
  // Safe Schedule Record Accessor (Compatible with string or object)
  // ==========================================================================
  function getScheduleEntry(staffId, dateStr) {
    const raw = state.schedules[`${staffId}_${dateStr}`];
    if (!raw) return null;
    if (typeof raw === 'string') {
      return { shiftId: raw, otHours: 0, earlyLeaveHours: 0 };
    }
    return {
      shiftId: raw.shiftId,
      otHours: Math.max(0, parseFloat(raw.otHours) || 0),
      earlyLeaveHours: Math.max(0, parseFloat(raw.earlyLeaveHours) || 0)
    };
  }

 // ==========================================================================
// 狀態管理與 Google 試算表同步模組 (含 LocalStorage 離線備份)
// ==========================================================================

// ⚠️ 請填入您在 Google Apps Script 部署後取得的「網頁應用程式網址」
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwpKXulUoa-TIEsbBzWw3_IbSkOSyqyVxttKSnty80_Yo1L9BQQHMpXbdN8Yfg6FOSYBg/exec"

/**
 * 輔助函式：用來將解析後的 JSON 物件完整套用進 state 中，並執行預設值防呆與資料正規化
 * @param {Object} parsed - 從雲端或本地解析出來的狀態資料
 */
function applyParsedState(parsed) {
  state.staff = parsed.staff || DEFAULT_STAFF;
  state.shifts = parsed.shifts || DEFAULT_SHIFTS;
  state.roles = parsed.roles && parsed.roles.length > 0 ? parsed.roles : [...DEFAULT_ROLES];
  state.schedules = parsed.schedules || {};
  state.periodMode = parsed.periodMode || 'month';
  state.shiftDisplayLang = parsed.shiftDisplayLang || 'zh';
  state.otMultiplier = typeof parsed.otMultiplier === 'number' ? parsed.otMultiplier : 1.34;
  
  // 初始化法規與檢核規則設定
  state.rules = Object.assign({
    maxDailyShifts: 1,
    maxConsecutiveDays: 6,
    maxDailyHours: 12,
    periodMaxHours: 160,
    monthlyLeaveQuota: 8,
    weekdayShiftMin: {},
    holidayShiftMin: {},
    headcount: { weekdayMin: 3, weekendMin: 2, customDates: [] }
  }, parsed.rules || {});
  
  state.antiPairs = parsed.antiPairs || [];
  state.roleRestrictions = parsed.roleRestrictions || [];
  state.staffRestrictions = Array.isArray(parsed.staffRestrictions) ? parsed.staffRestrictions : [];
  state.shiftFairness = Array.isArray(parsed.shiftFairness) ? parsed.shiftFairness : [];
  state.customShiftRequirements = parsed.customShiftRequirements || [];

  // 確保每位員工都有本月應休天數 (leaveQuota)
  state.staff.forEach(s => {
    if (typeof s.leaveQuota !== 'number') s.leaveQuota = 8;
  });

  // 若完全沒有任何班別，加入預設休假班別
  if (state.shifts.length === 0) {
    state.shifts.push({ id: 'shift_off', name: '休假', code: '休', enCode: '休', start: '00:00', end: '00:00', hours: 0, color: '#ffffff', textColor: '#ef4444', bgTransparent: true, targetStaff: 0, isLeave: true });
  }

  // 班別資料正規化：確保假別標記、字體顏色、透明背景與單字元代碼符合規範
  state.shifts.forEach(s => {
    if (typeof s.isLeave !== 'boolean') {
      s.isLeave = s.id === 'shift_off' || s.hours === 0;
    }
    if (!s.textColor) s.textColor = '#ffffff';
    if (typeof s.bgTransparent !== 'boolean') s.bgTransparent = false;
    if (s.code) s.code = s.code.slice(0, 1);
    if (s.enCode) s.enCode = s.enCode.slice(0, 1);
  });
}

/**
 * 載入狀態主函式：優先從 Google 雲端（試算表）同步最新排班資料，
 * 若網路異常或雲端無資料則自動降級讀取本地 LocalStorage 或載入示範資料。
 */
async function loadState() {
  showToast('🔄 正在從 Google 雲端同步排班資料...', 'info');
  let loadedFromCloud = false;

  try {
    // 向 Google Apps Script 發送載入請求
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "load" })
    });
    const result = await response.json();
    
    // 若成功取得雲端資料，直接套用
    if (result.status === "success" && result.payload) {
      applyParsedState(result.payload);
      loadedFromCloud = true;
      showToast('✅ 成功從 Google 雲端載入最新排班！', 'success');
    }
  } catch (err) {
    console.warn('從雲端載入失敗，嘗試讀取本地備份:', err);
  }

  // 若雲端載入失敗，改從瀏覽器的 LocalStorage 讀取備份
  if (!loadedFromCloud) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 若本地儲存仍是舊版示範假資料（如林雅婷或舊預設班別），自動升級載入 2026-10-18 範本
        const hasLegacyDemo = parsed.staff && parsed.staff.some(s => s.name === '林雅婷' || s.id === 'staff_1');
        if (hasLegacyDemo) {
          initDefaultDemoData();
          showToast('已自動升級載入 2026-10-18 排班範本！', 'success');
        } else {
          applyParsedState(parsed);
          showToast('⚠️ 網路連線異常，已載入本地暫存資料', 'warning');
        }
      } else {
        initDefaultDemoData(); // 若兩者皆無則載入預設 2026-10-18 範本資料
      }
    } catch (e) {
      console.warn('載入本地狀態失敗，改用預設資料:', e);
      initDefaultDemoData();
    }
  }

  // 計算並設定當前的排班週期範圍
  const range = calculatePeriodRange(state.periodMode, new Date());
  state.periodStart = range.start;
  state.periodEnd = range.end;

  // 同步 UI 介面的選項數值
  if (elPeriodModeSelect) elPeriodModeSelect.value = state.periodMode;
  if (elInputPeriodStart) elInputPeriodStart.value = formatDateIso(state.periodStart);
  if (elInputPeriodEnd) elInputPeriodEnd.value = formatDateIso(state.periodEnd);
  if (elCustomDateContainer) elCustomDateContainer.style.display = state.periodMode === 'custom' ? 'flex' : 'none';

  updateShiftLangButtonUI();
  findAndSelectToday();
  
  // 資料載入完成後重新渲染所有檢視畫面
  renderAll();
}

/**
 * 自動尋找並選取今天的日期索引
 */
function findAndSelectToday() {
  const days = getPeriodDays();
  const todayIso = formatDateIso(new Date());
  const idx = days.findIndex(d => formatDateIso(d) === todayIso);
  state.selectedDayIndex = idx >= 0 ? idx : 0;
}

/**
 * 儲存狀態主函式：當畫面資料變動時，
 * 同時寫入 LocalStorage（保障離線可用）並非同步上傳至 Google 試算表（雲端同步）。
 */
function saveState() {
  try {
    const payload = {
      staff: state.staff,
      shifts: state.shifts,
      roles: state.roles,
      schedules: state.schedules,
      periodMode: state.periodMode,
      shiftDisplayLang: state.shiftDisplayLang,
      otMultiplier: state.otMultiplier,
      rules: state.rules,
      antiPairs: state.antiPairs,
      roleRestrictions: state.roleRestrictions,
      staffRestrictions: state.staffRestrictions || [],
      shiftFairness: state.shiftFairness,
      customShiftRequirements: state.customShiftRequirements || []
    };

    // 1. 寫入本地 LocalStorage 作為快速備份
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // 2. 非同步將完整狀態上傳到 Google 試算表 (使用 no-cors 避免瀏覽器攔截)
    fetch(GAS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", payload: payload })
    }).catch(err => {
      console.error('雲端同步失敗（資料已安全暫存於本地）:', err);
    });

  } catch (e) {
    console.error('儲存狀態發生錯誤:', e);
  }
}

  /**
   * 當前週期班別隨機，其他週期班別清空
   */
  function generateRandomScheduleForCurrentPeriod() {
    // 1. 其他週期班別清空
    state.schedules = {};

    const periodDays = getPeriodDays();
    if (!periodDays || periodDays.length === 0 || !state.staff || state.staff.length === 0) return;

    const workShifts = state.shifts.filter(s => !s.isLeave && s.hours > 0);
    const offShift = state.shifts.find(s => s.id === 'shift_off') || { id: 'shift_off' };

    const streaks = {};
    const offCounts = {};
    state.staff.forEach(s => {
      streaks[s.id] = 0;
      offCounts[s.id] = 0;
    });

    // 每天目標上班人數（以 8 人名冊而言，平日 5~6 人、假日 5~6 人上班，使每人月休均衡維持在 8 天左右）
    const targetWorking = Math.max(1, Math.min(state.staff.length, Math.round(state.staff.length * 0.75)));
    const minWeekday = (state.rules && state.rules.headcount && state.rules.headcount.weekdayMin) || 3;
    const minWeekend = (state.rules && state.rules.headcount && state.rules.headcount.weekendMin) || 4;
    const maxConsecutive = (state.rules && state.rules.maxConsecutiveDays) || 6;

    periodDays.forEach(d => {
      const dateStr = formatDateIso(d);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const minStaff = isWeekend ? minWeekend : minWeekday;

      // 檢查休假偏好與連勤上限
      const mustOff = [];
      const canWork = [];

      state.staff.forEach(staff => {
        if (streaks[staff.id] >= maxConsecutive) {
          // 連勤已滿法定上限，強制安排休假
          mustOff.push(staff);
        } else if (staff.offPref !== 'none' && parseInt(staff.offPref, 10) === d.getDay()) {
          // 固定休假偏好
          mustOff.push(staff);
        } else {
          canWork.push(staff);
        }
      });

      // 依休假次數排序：休假次數較多者優先出勤，休假較少者有機會排休
      canWork.sort((a, b) => {
        const diff = offCounts[b.id] - offCounts[a.id];
        return diff !== 0 ? diff : (Math.random() - 0.5);
      });

      const numWorking = Math.min(canWork.length, Math.max(minStaff, targetWorking));
      const working = canWork.slice(0, numWorking);
      const offToday = mustOff.concat(canWork.slice(numWorking));

      // 安排今日休假
      offToday.forEach(staff => {
        state.schedules[`${staff.id}_${dateStr}`] = { shiftId: offShift.id, otHours: 0 };
        streaks[staff.id] = 0;
        offCounts[staff.id] = (offCounts[staff.id] || 0) + 1;
      });

      // 隨機打散出勤同仁並隨機指派可工作班別
      const shuffledWorking = [...working].sort(() => Math.random() - 0.5);
      shuffledWorking.forEach((staff, idx) => {
        if (workShifts.length > 0) {
          const shift = workShifts[idx % workShifts.length];
          state.schedules[`${staff.id}_${dateStr}`] = { shiftId: shift.id, otHours: 0 };
        } else {
          state.schedules[`${staff.id}_${dateStr}`] = { shiftId: offShift.id, otHours: 0 };
        }
        streaks[staff.id] = (streaks[staff.id] || 0) + 1;
      });
    });
  }

  function initDefaultDemoData() {
    // 1. 範本只針對人員、班別設定復原
    state.staff = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.staff));
    state.shifts = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.shifts));
    state.roles = (DEFAULT_TEMPLATE.roles && DEFAULT_TEMPLATE.roles.length > 0)
      ? [...DEFAULT_TEMPLATE.roles]
      : ['店長', '正職', '工讀生', '老闆'];

    state.rules = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.rules || {
      maxDailyShifts: 1,
      maxConsecutiveDays: 6,
      maxDailyHours: 12,
      periodMaxHours: 160,
      monthlyLeaveQuota: 8,
      weekdayShiftMin: {},
      holidayShiftMin: {},
      headcount: { weekdayMin: 3, weekendMin: 4, customDates: [] }
    }));
    state.antiPairs = [...(DEFAULT_TEMPLATE.antiPairs || [])];
    state.roleRestrictions = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.roleRestrictions || []));
    state.staffRestrictions = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.staffRestrictions || []));
    state.shiftFairness = [...(DEFAULT_TEMPLATE.shiftFairness || [])];
    state.otMultiplier = typeof DEFAULT_TEMPLATE.otMultiplier === 'number' ? DEFAULT_TEMPLATE.otMultiplier : 1.34;
    state.shiftDisplayLang = DEFAULT_TEMPLATE.shiftDisplayLang || 'zh';

    // 規範化班別資料
    state.shifts.forEach(s => {
      if (typeof s.isLeave !== 'boolean') s.isLeave = s.id === 'shift_off' || s.hours === 0;
      if (!s.textColor) s.textColor = '#ffffff';
      if (typeof s.bgTransparent !== 'boolean') s.bgTransparent = false;
      if (s.code) s.code = s.code.slice(0, 1);
      if (s.enCode) s.enCode = s.enCode.slice(0, 1);
    });

    state.staff.forEach(s => {
      if (typeof s.leaveQuota !== 'number') s.leaveQuota = 8;
    });

    // 2. 當前週期班別隨機，其他週期班別清空
    const range = calculatePeriodRange(state.periodMode || 'month', new Date());
    state.periodStart = range.start;
    state.periodEnd = range.end;

    generateRandomScheduleForCurrentPeriod();

    saveState();
  }

  // ==========================================================================
  // Calculations & Compliance Violations Inspector
  // ==========================================================================
  function getStaffHoursBreakdown(staffId, periodDays) {
    let normalHours = 0;
    let otHours = 0;
    let earlyLeaveHours = 0;

    periodDays.forEach(d => {
      const dateStr = formatDateIso(d);
      const entry = getScheduleEntry(staffId, dateStr);
      if (entry && entry.shiftId) {
        const shift = state.shifts.find(s => s.id === entry.shiftId);
        if (shift && shift.hours) {
          normalHours += shift.hours;
        }
        if (entry.otHours > 0) {
          otHours += entry.otHours;
        }
        if (entry.earlyLeaveHours > 0) {
          earlyLeaveHours += entry.earlyLeaveHours;
        }
      }
    });

    return {
      normalHours,
      otHours,
      earlyLeaveHours,
      totalHours: normalHours + otHours - earlyLeaveHours
    };
  }

  /**
   * Evaluates all violations and scheduling conflicts according to customizable rules.
   * Includes headcount adequacy verification for Weekdays, Weekends, and Custom dates.
   */
  function getAllViolations() {
    const periodDays = getPeriodDays();
    const violations = [];
    const maxConsecutive = state.rules.maxConsecutiveDays || 6;
    const maxDailyHours = state.rules.maxDailyHours || 12;
    const periodWeeks = Math.max(1, periodDays.length / 7);

    // 1. Staff-level checks (Period Overtime, Leave Quota, Consecutive days, Daily Hours, Role Restrictions)
    const configuredPeriodMaxHours = (state.rules && typeof state.rules.periodMaxHours === 'number') ? state.rules.periodMaxHours : 160;
    const configuredMonthlyLeaves = (state.rules && typeof state.rules.monthlyLeaveQuota === 'number') ? state.rules.monthlyLeaveQuota : 8;

    state.staff.forEach(staff => {
      const breakdown = getStaffHoursBreakdown(staff.id, periodDays);

      // 週期工時超量：依據自訂義設定的時數上限，超過才顯示異常
      if (breakdown.totalHours > configuredPeriodMaxHours) {
        violations.push({
          staffId: staff.id,
          staffName: staff.name,
          date: '整期累計',
          type: 'overtime',
          title: '週期工時超量',
          desc: `${staff.name} 當期工時達 ${breakdown.totalHours}h (含加班 ${breakdown.otHours}h)，超過設定上限 ${configuredPeriodMaxHours}h`
        });
      }

      // 休假未足額：比對應休天數設定，未足額顯示異常，足額則正常不顯示
      let actualLeaves = 0;
      periodDays.forEach(d => {
        const dateStr = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateStr);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(s => s.id === entry.shiftId);
          if (shift && (shift.isLeave || shift.hours === 0)) {
            actualLeaves++;
          }
        }
      });

      if (actualLeaves < configuredMonthlyLeaves) {
        violations.push({
          staffId: staff.id,
          staffName: staff.name,
          date: '整期累計',
          type: 'leave-shortage',
          title: '休假未足額',
          desc: `${staff.name} 當期排定休假 ${actualLeaves} 天，未達應休天數設定 ${configuredMonthlyLeaves} 天（尚缺 ${configuredMonthlyLeaves - actualLeaves} 天）`
        });
      }

      // Check Consecutive work days
      let consecutive = 0;
      let streakStartDate = null;
      periodDays.forEach(d => {
        const dateStr = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateStr);
        const shift = entry ? state.shifts.find(s => s.id === entry.shiftId) : null;
        const isWorking = shift && !shift.isLeave && shift.hours > 0;

        if (isWorking) {
          if (consecutive === 0) streakStartDate = dateStr;
          consecutive++;
          if (consecutive > maxConsecutive) {
            violations.push({
              staffId: staff.id,
              staffName: staff.name,
              date: dateStr,
              type: 'consecutive',
              title: '連續出勤過長',
              desc: `${staff.name} 從 ${streakStartDate} 起已連續出勤 ${consecutive} 天，超過法定上限 ${maxConsecutive} 天`
            });
          }
        } else {
          consecutive = 0;
          streakStartDate = null;
        }

        // Check Daily Hours (Shift hours + overtime)
        if (entry && shift) {
          const dailyTotal = (shift.hours || 0) + (entry.otHours || 0);
          if (dailyTotal > maxDailyHours) {
            violations.push({
              staffId: staff.id,
              staffName: staff.name,
              date: dateStr,
              type: 'daily-hours',
              title: '單日工時超限',
              desc: `${staff.name} 於 ${dateStr} 排定班別 (${shift.hours}h) 加班 (${entry.otHours}h)，單日總計 ${dailyTotal}h 超過單日上限 ${maxDailyHours}h`
            });
          }
        }

        // Check Role Restrictions
        if (entry && shift) {
          const isRestricted = state.roleRestrictions.some(r => r.role === staff.role && r.shiftId === shift.id);
          if (isRestricted) {
            violations.push({
              staffId: staff.id,
              staffName: staff.name,
              date: dateStr,
              type: 'role-restrict',
              title: '職位限制衝突',
              desc: `${staff.name} 職位為「${staff.role}」，依排班約束不可排定「${shift.name}」`
            });
          }

          // Check Staff Restrictions (特定人員不能上特定班別)
          const isStaffRestricted = (state.staffRestrictions || []).some(r => r.staffId === staff.id && r.shiftId === shift.id);
          if (isStaffRestricted) {
            violations.push({
              staffId: staff.id,
              staffName: staff.name,
              date: dateStr,
              type: 'staff-restrict',
              title: '人員班別限制衝突',
              desc: `${staff.name} 設有個人班別限制，不可排定「${shift.name}」`
            });
          }
        }
      });
    });

    // 2. Day-level checks (Anti-pair conflicts, Headcount adequacy for weekday/weekend/custom)
    const headcountRules = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };

    periodDays.forEach(d => {
      const dateStr = formatDateIso(d);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      // Determine required minimum headcount
      let requiredMin = isWeekend ? (headcountRules.weekendMin || 2) : (headcountRules.weekdayMin || 3);
      if (headcountRules.customDates) {
        const customMatch = headcountRules.customDates.find(c => c.date === dateStr);
        if (customMatch && typeof customMatch.min === 'number') {
          requiredMin = customMatch.min;
        }
      }

      // Count working staff on this day
      let activeWorkingCount = 0;
      const workingStaffIds = [];

      state.staff.forEach(staff => {
        const entry = getScheduleEntry(staff.id, dateStr);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(s => s.id === entry.shiftId);
          if (shift && !shift.isLeave && shift.hours > 0) {
            activeWorkingCount++;
            workingStaffIds.push(staff.id);
          }
        }
      });

      // Check Headcount Adequacy
      if (activeWorkingCount < requiredMin) {
        violations.push({
          staffId: 'system',
          staffName: '當日執勤人力',
          date: dateStr,
          type: 'headcount-shortage',
          title: '執勤人力不足',
          desc: `${dateStr} (${DAY_NAMES_ZH[d.getDay()]}) 實際執勤 ${activeWorkingCount} 人，低於規定最低人力 ${requiredMin} 人`
        });
      }

      // Check Anti-Pair Conflicts
      state.antiPairs.forEach(pair => {
        if (workingStaffIds.includes(pair[0]) && workingStaffIds.includes(pair[1])) {
          const staffA = state.staff.find(s => s.id === pair[0]);
          const staffB = state.staff.find(s => s.id === pair[1]);
          violations.push({
            staffId: `${pair[0]}_${pair[1]}`,
            staffName: `${staffA ? staffA.name : 'A'} & ${staffB ? staffB.name : 'B'}`,
            date: dateStr,
            type: 'anti-pair',
            title: '搭檔互斥衝突',
            desc: `${staffA ? staffA.name : '同仁A'} 與 ${staffB ? staffB.name : '同仁B'} 被設定為互斥搭檔，但於 ${dateStr} 同時出勤！`
          });
        }
      });
    });

    return violations;
  }

  // ==========================================================================
  // Display & UI Language Switching
  // ==========================================================================
  function toggleShiftDisplayLang() {
    state.shiftDisplayLang = state.shiftDisplayLang === 'zh' ? 'en' : 'zh';
    saveState();
    updateShiftLangButtonUI();
    renderAll();
    const label = state.shiftDisplayLang === 'zh' ? '繁體中文' : 'English (英文代碼)';
    showToast(`🔤 班別顯示模式已切換為：${label}`, 'info');
  }

  function updateShiftLangButtonUI() {
    if (elLabelShiftLangTable) {
      elLabelShiftLangTable.textContent = state.shiftDisplayLang === 'en' ? 'EN 英文代碼' : '中文顯示';
    }
    if (elBtnToggleShiftLangTable) {
      if (state.shiftDisplayLang === 'en') {
        elBtnToggleShiftLangTable.classList.add('btn-primary');
        elBtnToggleShiftLangTable.classList.remove('btn-secondary');
      } else {
        elBtnToggleShiftLangTable.classList.remove('btn-primary');
        elBtnToggleShiftLangTable.classList.add('btn-secondary');
      }
    }
  }

  function getShiftDisplayShort(shift) {
    if (!shift) return '-';
    if (state.shiftDisplayLang === 'en') {
      const code = shift.enCode || shift.code || shift.name || '';
      return code.slice(0, 1).toUpperCase();
    }
    const code = shift.code || shift.name || '';
    return code.slice(0, 1);
  }

  function getShiftDisplayTitle(shift) {
    if (!shift) return '';
    if (state.shiftDisplayLang === 'en') {
      return `${shift.name} [${shift.enCode || shift.code}]`;
    }
    return `${shift.name} [${shift.code}]`;
  }

  // 取得班別顯示樣式：勾選底色透明時，黑字改白底、白字改黑底；未勾選則完全依據使用者設定
  function getShiftPillStyle(shift) {
    if (!shift) return { bg: 'transparent', color: 'inherit', border: 'none', isTransparent: false };
    const textColor = shift.textColor || '#ffffff';

    if (shift.bgTransparent) {
      // 所有的班別當勾選底色透明時，觀看時黑色字體背景改白色，白色字體背景改黑色。
      let isDarkText = false;
      if (textColor.startsWith('#')) {
        const hex = textColor.replace('#', '');
        const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16) || 0;
        const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16) || 0;
        const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16) || 0;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        isDarkText = brightness < 128;
      } else if (textColor.toLowerCase() === 'black') {
        isDarkText = true;
      }

      const bg = isDarkText ? '#ffffff' : '#000000';
      const border = isDarkText ? '1px solid rgba(0, 0, 0, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)';
      return {
        bg,
        color: textColor, // 依照設定
        border,
        isTransparent: true
      };
    } else {
      // 其他狀況就依照我的設定 (背景為 shift.color，文字為 shift.textColor)
      return {
        bg: shift.color || '#10b981',
        color: textColor, // 依照設定
        border: 'none',
        isTransparent: false
      };
    }
  }

  // ==========================================================================
  // VIEW 1: Mobile-Friendly Day Carousel & Cards Mode
  // ==========================================================================
  function renderMobileDayView() {
    const periodDays = getPeriodDays();
    if (periodDays.length === 0) return;

    if (state.selectedDayIndex < 0 || state.selectedDayIndex >= periodDays.length) {
      state.selectedDayIndex = 0;
    }

    const currentDay = periodDays[state.selectedDayIndex];
    const currentDayIso = formatDateIso(currentDay);
    const dayOfWeek = currentDay.getDay();

    // 1. Render Carousel Tabs (指尖大小一格，顯示月/日(星期)與上班人數)
    if (elDateCarousel) {
      elDateCarousel.innerHTML = '';
      const headcountRules = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };

      periodDays.forEach((d, idx) => {
        const item = document.createElement('div');
        const isSelected = idx === state.selectedDayIndex;
        const dIso = formatDateIso(d);
        const dow = d.getDay();
        const isWk = dow === 0 || dow === 6;

        let dayTarget = isWk ? headcountRules.weekendMin : headcountRules.weekdayMin;
        if (headcountRules.customDates) {
          const match = headcountRules.customDates.find(c => c.date === dIso);
          if (match && typeof match.min === 'number') dayTarget = match.min;
        }

        let dayOnDuty = 0;
        state.staff.forEach(s => {
          const entry = getScheduleEntry(s.id, dIso);
          if (entry && entry.shiftId) {
            const shift = state.shifts.find(sh => sh.id === entry.shiftId);
            if (shift && !shift.isLeave && shift.hours > 0) dayOnDuty++;
          }
        });

        item.className = `day-chip date-carousel-item ${isSelected ? 'active' : ''} ${isWk ? 'is-weekend' : ''}`;
        item.innerHTML = `
          <div class="day-chip-name">${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES_SHORT_ZH[dow]})</div>
          <div class="day-chip-badge ${dayOnDuty >= dayTarget ? 'is-sufficient' : 'is-shortage'}">${dayOnDuty}人上班</div>
        `;
        item.addEventListener('click', () => {
          state.selectedDayIndex = idx;
          renderMobileDayView();
        });
        elDateCarousel.appendChild(item);
      });

      const activeItem = elDateCarousel.children[state.selectedDayIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

    // 2. Headcount requirement & adequacy
    const headcountRules = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let targetHeadcount = isWeekend ? headcountRules.weekendMin : headcountRules.weekdayMin;
    if (headcountRules.customDates) {
      const match = headcountRules.customDates.find(c => c.date === currentDayIso);
      if (match && typeof match.min === 'number') targetHeadcount = match.min;
    }

    let onDutyCount = 0;
    let offCount = 0;

    state.staff.forEach(s => {
      const entry = getScheduleEntry(s.id, currentDayIso);
      if (entry && entry.shiftId) {
        const shift = state.shifts.find(sh => sh.id === entry.shiftId);
        if (shift && !shift.isLeave && shift.hours > 0) {
          onDutyCount++;
        } else {
          offCount++;
        }
      } else {
        offCount++;
      }
    });

    if (elDaySummaryTitle) {
      const fullDayStr = `${currentDay.getFullYear()}年${currentDay.getMonth() + 1}月${currentDay.getDate()}日 (${DAY_NAMES_ZH[dayOfWeek]})`;
      elDaySummaryTitle.textContent = fullDayStr;
    }

    if (elDaySummaryHeadcount) {
      const isAdequate = onDutyCount >= targetHeadcount;
      elDaySummaryHeadcount.innerHTML = `
        <div class="day-headcount-wrapper">
          <span>上班 <b>${onDutyCount}</b> 人 / 需 <button type="button" class="btn-headcount-edit" id="btn-edit-day-headcount" title="點擊設定此日最低人力（連動除錯人力設定）"><b>${targetHeadcount}</b> 人 ✏️</button></span>
          <span class="headcount-light ${isAdequate ? 'light-green' : 'light-red'}" title="${isAdequate ? '人力充足（亮綠燈）' : '人數不足（亮紅燈）'}"></span>
        </div>
      `;

      const btnEditHeadcount = document.getElementById('btn-edit-day-headcount');
      if (btnEditHeadcount) {
        btnEditHeadcount.addEventListener('click', () => {
          editDayHeadcountTarget(currentDayIso, dayOfWeek, targetHeadcount);
        });
      }
    }

    // 3. Render Staff Cards for selected day (精簡為每排 3 格小方塊，僅顯示上班出勤員工)
    if (elMobileStaffCards) {
      elMobileStaffCards.innerHTML = '';

      const workingStaffList = state.staff.filter(staff => {
        const entry = getScheduleEntry(staff.id, currentDayIso);
        if (!entry || !entry.shiftId) return false;
        const shift = state.shifts.find(s => s.id === entry.shiftId);
        return shift && !shift.isLeave && shift.hours > 0;
      });

      if (workingStaffList.length === 0) {
        elMobileStaffCards.innerHTML = `
          <div style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);background:var(--glass-bg);border:1px dashed var(--border-color);border-radius:var(--radius-lg);width:100%;">
            <div style="font-size:1.8rem;margin-bottom:0.4rem;">☕</div>
            <div style="font-size:0.9rem;font-weight:700;color:var(--text-secondary);">本日暫無上班出勤人員</div>
            <div style="font-size:0.75rem;margin-top:0.25rem;">可點擊上方導覽切換至「當期」或「總表」為同仁排班</div>
          </div>
        `;
      } else {
        const grid = document.createElement('div');
        grid.className = 'mobile-staff-mini-grid';

        workingStaffList.forEach(staff => {
          const entry = getScheduleEntry(staff.id, currentDayIso);
          const shift = state.shifts.find(s => s.id === entry.shiftId);
          const card = document.createElement('div');
          card.className = 'staff-mini-card';

          const shiftCodeText = getShiftDisplayShort(shift);
          const otText = (entry && entry.otHours > 0) ? `+${entry.otHours}h` : '';
          const elText = (entry && entry.earlyLeaveHours > 0) ? `-${entry.earlyLeaveHours}h` : '';
          const shiftDisplayName = (state.shiftDisplayLang === 'en') ? (shift.enCode || shift.code || shift.name) : shift.name;

          const pillStyleObj = getShiftPillStyle(shift);
          const shiftCardStyle = `background:${pillStyleObj.bg};color:${pillStyleObj.color};border:${pillStyleObj.border};`;

          card.innerHTML = `
            <div class="staff-mini-card-avatar" style="background:${staff.color};border-color:${staff.color};">
              ${staff.name.slice(0, 1)}
            </div>
            <div class="staff-mini-card-name" title="${escapeHtml(staff.name)}">${escapeHtml(staff.name)}</div>
            <div class="staff-mini-card-role">${escapeHtml(staff.role)}</div>
            <div class="staff-mini-card-shift" style="${shiftCardStyle}" title="${escapeHtml(shift.name)}">
              <span style="color:${pillStyleObj.color};">${escapeHtml(shiftDisplayName)}</span>
              ${otText ? `<span class="ot-badge" style="margin-left:2px;font-size:0.65rem;">${otText}</span>` : ''}
              ${elText ? `<span class="ot-badge" style="margin-left:2px;font-size:0.65rem;background:rgba(239,68,68,0.3);color:#fee2e2;">${elText}</span>` : ''}
            </div>
          `;

          card.addEventListener('click', () => {
            openBottomSheet(staff, currentDayIso, DAY_NAMES_ZH[dayOfWeek]);
          });

          grid.appendChild(card);
        });

        elMobileStaffCards.appendChild(grid);
      }
    }
  }

  function editDayHeadcountTarget(dateIso, dayOfWeek, currentVal) {
    const isWk = dayOfWeek === 0 || dayOfWeek === 6;
    const dayTypeStr = isWk ? '假日' : '平日';
    const input = prompt(`【人力設定連動除錯】\n請設定 ${dateIso} (${dayTypeStr}) 所需最低出勤人力 (人)：\n\n・輸入數字：更新此日期之特殊最低人力\n・輸入 c 或 clear：清除此日期特殊設定，回歸${dayTypeStr}預設值 (${isWk ? (state.rules.headcount.weekendMin || 2) : (state.rules.headcount.weekdayMin || 3)}人)\n・若需修改全域平日/假日通則，請至「除錯」中設定`, currentVal);

    if (input === null) return;
    const trimmed = input.trim().toLowerCase();
    state.rules.headcount = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
    state.rules.headcount.customDates = state.rules.headcount.customDates || [];

    if (trimmed === 'c' || trimmed === 'clear') {
      state.rules.headcount.customDates = state.rules.headcount.customDates.filter(c => c.date !== dateIso);
      saveState();
      renderAll();
      renderHeadcountRulesUI();
      showToast(`已清除 ${dateIso} 特殊人力設定，回歸${dayTypeStr}通則`, 'info');
      return;
    }

    const val = parseInt(trimmed, 10);
    if (isNaN(val) || val < 0) {
      showToast('請輸入有效的人數數字', 'warning');
      return;
    }

    state.rules.headcount.customDates = state.rules.headcount.customDates.filter(c => c.date !== dateIso);
    state.rules.headcount.customDates.push({ date: dateIso, min: val });
    saveState();
    renderAll();
    renderHeadcountRulesUI();
    showToast(`已將 ${dateIso} 最低人力需求設定為 ${val} 人（已同步至除錯人力設定）`, 'success');
  }

  // ==========================================================================
  // VIEW 2: Staff-Centric Weekly Cards Mode
  // ==========================================================================
  function renderStaffView() {
    if (!elStaffWeeklyList) return;
    elStaffWeeklyList.innerHTML = '';

    const days = getPeriodDays();

    state.staff.forEach(staff => {
      const breakdown = getStaffHoursBreakdown(staff.id, days);
      const card = document.createElement('div');
      card.className = 'staff-weekly-card';

      const header = document.createElement('div');
      header.className = 'staff-weekly-card-header';

      // Build shift count summary according to state.shifts order with color badges
      const workShifts = state.shifts.filter(s => !s.isLeave);
      const shiftCounts = {};
      workShifts.forEach(sh => { shiftCounts[sh.id] = 0; });

      days.forEach(d => {
        const dateIso = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateIso);
        if (entry && entry.shiftId && shiftCounts[entry.shiftId] !== undefined) {
          shiftCounts[entry.shiftId]++;
        }
      });

      let badgesHtml = '<div class="staff-summary-container">';
      workShifts.forEach(shift => {
        const code = getShiftDisplayShort(shift);
        const count = shiftCounts[shift.id] || 0;
        const pStyle = getShiftPillStyle(shift);
        badgesHtml += `
          <span class="staff-shift-count-badge" style="background:${pStyle.bg};color:${pStyle.color};border:${pStyle.border};">
            ${escapeHtml(code)} ${count}
          </span>
        `;
      });

      // 新增休假計數
      let leaveDaysCount = 0;
      days.forEach(d => {
        const dateIso = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(s => s.id === entry.shiftId);
          if (shift && (shift.isLeave || shift.hours === 0)) {
            leaveDaysCount++;
          }
        }
      });

      badgesHtml += `
        <span class="staff-shift-count-badge" style="background:rgba(239, 68, 68, 0.15);color:var(--accent-danger);border:1px solid rgba(239, 68, 68, 0.4);" title="當期累計排定休假天數">
          休 ${leaveDaysCount}
        </span>
      `;

      badgesHtml += `
        <span class="staff-hours-divider"></span>
        <div class="staff-hours-wrapper">
          <div class="staff-ot-el-stacked">
            <span class="staff-ot-line">+${breakdown.otHours}h</span>
            <span class="staff-el-line">-${breakdown.earlyLeaveHours}h</span>
          </div>
          <span class="staff-hours-total">時數: ${breakdown.totalHours}H</span>
        </div>
      </div>`;

      header.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.65rem;">
          <div class="staff-avatar" style="background:${staff.color};width:32px;height:32px;font-size:0.8rem;">
            ${staff.name.slice(0, 1)}
          </div>
          <div>
            <span style="font-weight:700;font-size:0.95rem;color:var(--text-primary);">${escapeHtml(staff.name)}</span>
            <span class="staff-role-badge">${escapeHtml(staff.role)}</span>
          </div>
        </div>
        ${badgesHtml}
      `;
      card.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'staff-weekly-days-grid';

      days.forEach(d => {
        const dateIso = formatDateIso(d);
        const dayTitle = `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES_SHORT_ZH[d.getDay()]})`;
        const dayName = state.shiftDisplayLang === 'en' ? DAY_NAMES_EN[d.getDay()] : DAY_NAMES_ZH[d.getDay()];
        const entry = getScheduleEntry(staff.id, dateIso);
        const shift = entry && entry.shiftId ? state.shifts.find(s => s.id === entry.shiftId) : null;

        const pill = document.createElement('div');
        pill.className = 'staff-day-pill';
        if (shift) {
          const pillStyle = getShiftPillStyle(shift);
          pill.style.backgroundColor = pillStyle.bg;
          pill.style.borderColor = pillStyle.border;
          pill.style.color = pillStyle.color;
          if (pillStyle.isTransparent) {
            pill.classList.add('is-transparent');
          }
          const codeText = getShiftDisplayShort(shift);
          const otText = entry.otHours > 0 ? `<span class="ot-badge">+${entry.otHours}h</span>` : '';
          const elText = (entry.earlyLeaveHours || 0) > 0 ? `<span class="ot-badge" style="background:rgba(239,68,68,0.25);color:#ef4444;">-${entry.earlyLeaveHours}h</span>` : '';
          pill.innerHTML = `
            <span class="staff-day-pill-name" style="font-size:0.62rem;white-space:nowrap;color:${pillStyle.color};opacity:0.85;">${dayTitle}</span>
            <span class="staff-day-pill-code" style="color:${pillStyle.color};font-weight:800;">${codeText} ${otText}${elText}</span>
          `;
        } else {
          pill.innerHTML = `
            <span class="staff-day-pill-name" style="font-size:0.62rem;white-space:nowrap;">${dayTitle}</span>
            <span class="staff-day-pill-code" style="color:var(--text-muted);">-</span>
          `;
        }

        pill.addEventListener('click', () => {
          openBottomSheet(staff, dateIso, dayName);
        });

        grid.appendChild(pill);
      });

      card.appendChild(grid);
      elStaffWeeklyList.appendChild(card);
    });
  }

  // ==========================================================================
  // VIEW 3: Compact Schedule Table Mode
  // ==========================================================================
  function renderTable() {
    if (!elTableHeader || !elTableBody || !elTableFooter) return;
    const periodDays = getPeriodDays();
    const todayIso = formatDateIso(new Date());

    // 1. Table Header
    const trDateLabel = state.shiftDisplayLang === 'en' ? 'Date' : '日期';
    const blNameLabel = state.shiftDisplayLang === 'en' ? 'Name' : '姓名';
    elTableHeader.innerHTML = `
      <th class="col-staff diagonal-header-cell">
        <div class="diagonal-box">
          <span class="diagonal-tr">${trDateLabel}</span>
          <span class="diagonal-bl">${blNameLabel}</span>
        </div>
      </th>
    `;
    periodDays.forEach(d => {
      const dateIso = formatDateIso(d);
      const isToday = dateIso === todayIso;
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      // Dates ALWAYS shown in Chinese regardless of shift lang
      const dayNameShort = DAY_NAMES_SHORT_ZH[d.getDay()];
      const dayFormatted = `${d.getDate()}`;

      const th = document.createElement('th');
      th.className = `day-header-cell ${isToday ? 'is-today' : ''} ${isWeekend ? 'is-weekend' : ''}`;
      th.innerHTML = `
        <div class="day-name">${dayNameShort}</div>
        <div class="day-date">${dayFormatted}</div>
      `;
      elTableHeader.appendChild(th);
    });

    const thTotal = document.createElement('th');
    thTotal.className = 'col-total';
    thTotal.textContent = '工時';
    elTableHeader.appendChild(thTotal);

    // 2. Table Body (Staff Rows)
    elTableBody.innerHTML = '';
    state.staff.forEach(staff => {
      const tr = document.createElement('tr');

      const roleInitial = staff.role ? staff.role.trim().slice(0, 1) : '';
      const roleInitialHtml = roleInitial ? `<span class="staff-role-initial">${escapeHtml(roleInitial)}</span>` : '';
      const tdStaff = document.createElement('td');
      tdStaff.className = 'staff-row-cell';
      tdStaff.innerHTML = `
        <div class="staff-profile-card">
          <span class="staff-name" title="${escapeHtml(staff.name)} (${escapeHtml(staff.role)})">${escapeHtml(staff.name)}</span>${roleInitialHtml}
        </div>
      `;
      tr.appendChild(tdStaff);

      periodDays.forEach(d => {
        const dateIso = formatDateIso(d);
        const dayName = state.shiftDisplayLang === 'en' ? DAY_NAMES_EN[d.getDay()] : DAY_NAMES_ZH[d.getDay()];
        const entry = getScheduleEntry(staff.id, dateIso);
        const shift = entry && entry.shiftId ? state.shifts.find(s => s.id === entry.shiftId) : null;

        const td = document.createElement('td');
        const slot = document.createElement('div');
        slot.className = 'shift-slot';

        if (shift) {
          const shortCode = getShiftDisplayShort(shift);
          const fullTitle = getShiftDisplayTitle(shift);
          const otBadge = entry.otHours > 0 ? `<span class="ot-badge">+${entry.otHours}</span>` : '';
          const elBadge = (entry.earlyLeaveHours || 0) > 0 ? `<span class="ot-badge" style="background:rgba(239,68,68,0.25);color:#ef4444;">-${entry.earlyLeaveHours}</span>` : '';
          const pStyle = getShiftPillStyle(shift);
          const pillClass = pStyle.isTransparent ? 'shift-pill is-transparent' : 'shift-pill';
          const pillStyleStr = `background:${pStyle.bg};color:${pStyle.color};border:${pStyle.border};`;

          slot.innerHTML = `
            <div class="${pillClass}" style="${pillStyleStr}" title="${escapeHtml(fullTitle)} ${shift.start}~${shift.end}${entry.otHours > 0 ? ` (加班+${entry.otHours}h)` : ''}${(entry.earlyLeaveHours||0) > 0 ? ` (早退-${entry.earlyLeaveHours}h)` : ''}">
              <div class="shift-pill-title" style="color:${pStyle.color};">
                <span class="shift-code-text" style="color:${pStyle.color};">${shortCode}</span>
                ${otBadge}${elBadge}
              </div>
            </div>
          `;
        } else {
          slot.classList.add('empty-slot');
          slot.innerHTML = `
            <svg class="empty-add-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          `;
        }

        slot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (window.innerWidth <= 768) {
            openBottomSheet(staff, dateIso, dayName);
          } else {
            openShiftPicker(staff.id, dateIso, slot);
          }
        });

        td.appendChild(slot);
        tr.appendChild(td);
      });

      const breakdown = getStaffHoursBreakdown(staff.id, periodDays);
      const tdTotal = document.createElement('td');
      tdTotal.className = 'col-total';
      tdTotal.innerHTML = `
        <div class="total-hours-display">
          <span class="hours-num">${breakdown.totalHours}h</span>
          ${breakdown.otHours > 0 ? `<span style="font-size:0.65rem;color:#f59e0b;">(+${breakdown.otHours})</span>` : ''}
          ${breakdown.earlyLeaveHours > 0 ? `<span style="font-size:0.65rem;color:var(--accent-danger);">(-${breakdown.earlyLeaveHours})</span>` : ''}
        </div>
      `;
      tr.appendChild(tdTotal);

      elTableBody.appendChild(tr);
    });

    // 3. Table Footer (Daily Active Staff Headcount)
    elTableFooter.innerHTML = `<th class="col-staff">出勤</th>`;
    const headcountRules = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };

    periodDays.forEach(d => {
      const dateIso = formatDateIso(d);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      let requiredMin = isWeekend ? headcountRules.weekendMin : headcountRules.weekdayMin;
      if (headcountRules.customDates) {
        const customMatch = headcountRules.customDates.find(c => c.date === dateIso);
        if (customMatch && typeof customMatch.min === 'number') requiredMin = customMatch.min;
      }

      let count = 0;
      state.staff.forEach(s => {
        const entry = getScheduleEntry(s.id, dateIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(sh => sh.id === entry.shiftId);
          if (shift && !shift.isLeave && shift.hours > 0) {
            count++;
          }
        }
      });

      const th = document.createElement('th');
      const isShort = count < requiredMin;
      th.className = isShort ? 'shortage' : 'adequate';
      th.title = `標準: ${requiredMin}人 / 實際: ${count}人`;
      th.textContent = `${count}`;
      elTableFooter.appendChild(th);
    });

    const thFooterTotal = document.createElement('th');
    thFooterTotal.className = 'col-total';
    thFooterTotal.textContent = '-';
    elTableFooter.appendChild(thFooterTotal);

    // 4. Render Legend Chips
    renderShiftLegend();
  }

  function renderShiftLegend() {
    if (!elLegend) return;
    elLegend.innerHTML = '<span class="legend-title">班別對照表：</span>';

    state.shifts.forEach(shift => {
      const chip = document.createElement('div');
      chip.className = 'legend-chip';
      const code = state.shiftDisplayLang === 'en'
        ? (shift.enCode || shift.code || '')
        : (shift.code || shift.name || '');
      const timeText = (shift.start && shift.end && shift.start !== '-')
        ? `${shift.start} ~ ${shift.end}`
        : (shift.start || '-');
      const pStyle = getShiftPillStyle(shift);

      chip.innerHTML = `
        <span class="legend-color-dot" style="background:${pStyle.bg};border:${pStyle.border};"></span>
        <span class="legend-name" style="padding:1px 6px;border-radius:4px;background:${pStyle.bg};color:${pStyle.color};border:${pStyle.border};font-weight:700;">${escapeHtml(shift.name)} [${escapeHtml(code)}]</span>
        <span class="legend-time">${escapeHtml(timeText)}</span>
      `;
      elLegend.appendChild(chip);
    });
  }

  // ==========================================================================
  // VIEW 4: Shift Count Stats Table Mode (班數總表呈現)
  // 顯示在下方，內容使用總表的顯示內容修改：
  // - 姓名欄固定不滑動
  // - 姓名不顯示職稱
  // - 上方日期欄改成班別
  // - 中間顯示對應員工該班別的班數數字
  // - 點擊數字彈框顯示該員工上該班別的日期（例 9/1(二)），一行一行列出，支援直接更改班別
  // ==========================================================================
  function renderStatsTableView() {
    if (!elStatsTableHeader || !elStatsTableBody) return;
    const periodDays = getPeriodDays();

    // 1. Header: 姓名/班別 斜線切分欄 + 各班別
    const trShiftLabel = state.shiftDisplayLang === 'en' ? 'Shift' : '班別';
    const blNameLabel = state.shiftDisplayLang === 'en' ? 'Name' : '姓名';
    elStatsTableHeader.innerHTML = `
      <th class="col-staff diagonal-header-cell">
        <div class="diagonal-box">
          <span class="diagonal-tr">${trShiftLabel}</span>
          <span class="diagonal-bl">${blNameLabel}</span>
        </div>
      </th>
    `;

    state.shifts.forEach(shift => {
      const th = document.createElement('th');
      th.className = 'col-shift';
      const pStyle = getShiftPillStyle(shift);
      const shiftDisplayName = (state.shiftDisplayLang === 'en') ? (shift.enCode || shift.code || shift.name) : shift.name;
      th.innerHTML = `
        <span style="display:inline-block;padding:0.18rem 0.5rem;border-radius:4px;background:${pStyle.bg};color:${pStyle.color};border:${pStyle.border};font-size:0.75rem;font-weight:700;white-space:nowrap;">
          ${escapeHtml(shiftDisplayName)}
        </span>
      `;
      th.title = `${shift.name} (${shift.hours}h)`;
      elStatsTableHeader.appendChild(th);
    });

    // 2. Body: 每個員工一列
    elStatsTableBody.innerHTML = '';
    state.staff.forEach(staff => {
      const tr = document.createElement('tr');

      // 姓名欄（固定不滑動、顯示職稱第一個字）
      const roleInitial = staff.role ? staff.role.trim().slice(0, 1) : '';
      const roleInitialHtml = roleInitial ? `<span class="staff-role-initial">${escapeHtml(roleInitial)}</span>` : '';
      const tdStaff = document.createElement('td');
      tdStaff.className = 'staff-row-cell';
      tdStaff.innerHTML = `
        <div class="staff-info-compact" title="${escapeHtml(staff.name)} (${escapeHtml(staff.role)})">
          <div class="staff-color-dot" style="background:${staff.color};"></div>
          <span class="staff-name-text">${escapeHtml(staff.name)}</span>${roleInitialHtml}
        </div>
      `;
      tr.appendChild(tdStaff);

      // 統計該同仁在當期各班別的排定日期與次數
      state.shifts.forEach(shift => {
        const matchingDates = [];
        periodDays.forEach(d => {
          const dateIso = formatDateIso(d);
          const entry = getScheduleEntry(staff.id, dateIso);
          if (entry && entry.shiftId === shift.id) {
            matchingDates.push({
              date: d,
              dateIso: dateIso,
              otHours: entry.otHours || 0
            });
          }
        });

        const count = matchingDates.length;

        const td = document.createElement('td');
        td.className = 'stats-count-cell';
        td.innerHTML = `
          <span class="stats-count-badge ${count > 0 ? 'has-count' : ''}">
            ${count}
          </span>
        `;
        td.title = `點擊查看 ${staff.name}「${shift.name}」出勤日期`;

        td.addEventListener('click', () => {
          openShiftDateDetailsModal(staff, shift, matchingDates);
        });

        tr.appendChild(td);
      });

      elStatsTableBody.appendChild(tr);
    });
  }

  function openShiftDateDetailsModal(staff, shift, matchingDates) {
    if (!elModalShiftDateDetails) return;
    const nameEl = document.getElementById('shift-details-staff-name');
    const shiftEl = document.getElementById('shift-details-shift-name');
    const listEl = document.getElementById('shift-date-details-list');

    const currentShiftTitle = (state.shiftDisplayLang === 'en' ? (shift.enCode || shift.code || shift.name) : shift.name);
    const roleInitial = staff.role ? staff.role.trim().slice(0, 1) : '';
    if (nameEl) nameEl.textContent = staff.name + (roleInitial ? ` (${roleInitial})` : '');
    if (shiftEl) shiftEl.textContent = currentShiftTitle;

    if (listEl) {
      listEl.innerHTML = '';
      if (matchingDates.length === 0) {
        listEl.innerHTML = `
          <div style="text-align:center;padding:1.75rem 1rem;color:var(--text-muted);background:var(--bg-secondary);border-radius:var(--radius-md);">
            當期暫無排定「${escapeHtml(currentShiftTitle)}」出勤紀錄
          </div>
        `;
      } else {
        matchingDates.forEach(item => {
          const d = item.date;
          const dateStr = `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES_SHORT_ZH[d.getDay()]})`;
          const row = document.createElement('div');
          row.className = 'shift-detail-date-row';

          let optionsHtml = '';
          state.shifts.forEach(s => {
            const isSel = s.id === shift.id;
            const optName = (state.shiftDisplayLang === 'en' ? (s.enCode || s.code || s.name) : s.name);
            optionsHtml += `<option value="${s.id}" ${isSel ? 'selected' : ''}>${escapeHtml(optName)} (${s.hours}h)</option>`;
          });
          optionsHtml += `<option value="__clear__">❌ 清除排班</option>`;

          row.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <span style="font-weight:700;color:var(--text-primary);font-size:0.92rem;">📅 ${dateStr}</span>
              ${item.otHours > 0 ? `<span style="font-size:0.75rem;color:#f59e0b;font-weight:600;">(加班 ${item.otHours}h)</span>` : ''}
            </div>
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <label style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">改為：</label>
              <select class="form-control change-shift-select" style="font-size:0.8rem;padding:0.25rem 0.5rem;width:auto;">
                ${optionsHtml}
              </select>
            </div>
          `;

          const selectEl = row.querySelector('.change-shift-select');
          selectEl.addEventListener('change', (e) => {
            const newShiftId = e.target.value;
            if (newShiftId === '__clear__') {
              assignShift(staff.id, item.dateIso, null, 0);
            } else {
              assignShift(staff.id, item.dateIso, newShiftId, item.otHours);
            }
            // 重新整理明細列表
            const periodDays = getPeriodDays();
            const updatedDates = [];
            periodDays.forEach(day => {
              const dIso = formatDateIso(day);
              const ent = getScheduleEntry(staff.id, dIso);
              if (ent && ent.shiftId === shift.id) {
                updatedDates.push({ date: day, dateIso: dIso, otHours: ent.otHours || 0 });
              }
            });
            openShiftDateDetailsModal(staff, shift, updatedDates);
            renderStatsTableView();
          });

          listEl.appendChild(row);
        });
      }
    }

    elModalShiftDateDetails.classList.add('open');
  }

  // ==========================================================================
  // Render KPI Dashboard
  // ==========================================================================
  function renderKPIDashboard() {
    const periodDays = getPeriodDays();
    let totalNormalHours = 0;
    let totalOtHours = 0;
    let totalEarlyLeaveHours = 0;
    let totalShiftsAssigned = 0;
    let totalCost = 0;
    let totalLeaveDays = 0;
    let hoursOverCount = 0;
    let leaveShortCount = 0;

    state.staff.forEach(staff => {
      const breakdown = getStaffHoursBreakdown(staff.id, periodDays);
      totalNormalHours += breakdown.normalHours;
      totalOtHours += breakdown.otHours;
      totalEarlyLeaveHours += (breakdown.earlyLeaveHours || 0);

      const normalCost = breakdown.normalHours * staff.wage;
      const otCost = breakdown.otHours * staff.wage * state.otMultiplier;
      const elDeduction = (breakdown.earlyLeaveHours || 0) * staff.wage;
      totalCost += (normalCost + otCost - elDeduction);

      // Hours over-limit: use per-staff periodMaxHours if set
      const allowed = typeof staff.periodMaxHours === 'number'
        ? staff.periodMaxHours
        : null;
      if (allowed !== null && breakdown.totalHours > allowed) hoursOverCount++;

      // Leave short count: use per-staff leaveQuota if set
      const quota = typeof staff.leaveQuota === 'number' ? staff.leaveQuota : null;
      let actualLeaves = 0;
      periodDays.forEach(d => {
        const dateIso = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(s => s.id === entry.shiftId);
          if (shift) {
            if (shift.isLeave || shift.hours === 0) {
              actualLeaves++;
              totalLeaveDays++;
            } else {
              totalShiftsAssigned++;
            }
          }
        }
      });
      if (quota !== null && actualLeaves < quota) leaveShortCount++;
    });

    const grandTotalHours = totalNormalHours + totalOtHours - totalEarlyLeaveHours;
    const avgHours = state.staff.length > 0 ? (grandTotalHours / state.staff.length).toFixed(1) : 0;

    if (elStatHours) {
      elStatHours.innerHTML = `${hoursOverCount} <span style="font-size:0.85rem;font-weight:500;">人超標</span>`;
    }
    if (elStatAvgHours) {
      elStatAvgHours.textContent = `總工時: ${grandTotalHours}h | 人均: ${avgHours}h`;
    }

    if (elStatShifts) {
      elStatShifts.innerHTML = `${leaveShortCount} <span style="font-size:0.85rem;font-weight:500;">人未足額</span>`;
    }
    if (elStatCoverage) {
      elStatCoverage.textContent = `總休假: ${totalLeaveDays}天 | 出勤: ${totalShiftsAssigned}班次`;
    }

    if (elStatCost) {
      elStatCost.textContent = `NT$ ${Math.round(totalCost).toLocaleString()}`;
    }

    // Violations and alert count
    const violations = getAllViolations();
    if (elStatAlertCount) {
      elStatAlertCount.innerHTML = `${violations.length} <span style="font-size:0.85rem;font-weight:500;">項異常</span>`;
      elStatAlertCount.style.color = violations.length === 0 ? 'var(--accent-success)' : 'var(--accent-danger)';
    }
    if (elStatAlertDesc) {
      elStatAlertDesc.textContent = violations.length === 0 ? '全數符合勞基法規與排班規則' : '存在工時超標、互斥或人力不足';
    }

    if (elPeriodDisplayBadge) {
      const s = state.periodStart;
      const e = state.periodEnd;
      elPeriodDisplayBadge.textContent = `${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()} ~ ${e.getFullYear()}/${e.getMonth() + 1}/${e.getDate()}`;
    }
  }

  // ==========================================================================
  // Global View Dispatcher
  // ==========================================================================
  function renderActiveView() {
    // Hide all containers first
    if (elContainerDay) elContainerDay.style.display = 'none';
    if (elContainerStaff) elContainerStaff.style.display = 'none';
    if (elContainerTable) elContainerTable.style.display = 'none';
    if (elContainerStats) elContainerStats.style.display = 'none';

    // Update active tab button styles
    const btnDay = document.getElementById('view-toggle-day');
    const btnStaff = document.getElementById('view-toggle-staff');
    const btnStats = document.getElementById('btn-open-shift-stats');
    const btnWeek = document.getElementById('view-toggle-week');

    if (btnDay) btnDay.classList.toggle('active', state.currentView === 'day');
    if (btnStaff) btnStaff.classList.toggle('active', state.currentView === 'staff');
    if (btnStats) btnStats.classList.toggle('active', state.currentView === 'stats');
    if (btnWeek) btnWeek.classList.toggle('active', state.currentView === 'week');

    if (state.currentView === 'day') {
      if (elContainerDay) elContainerDay.style.display = 'block';
      renderMobileDayView();
    } else if (state.currentView === 'staff') {
      if (elContainerStaff) elContainerStaff.style.display = 'block';
      renderStaffView();
    } else if (state.currentView === 'stats') {
      if (elContainerStats) elContainerStats.style.display = 'block';
      renderStatsTableView();
    } else {
      if (elContainerTable) elContainerTable.style.display = 'block';
      renderTable();
    }
  }

  function renderAll() {
    renderKPIDashboard();
    renderActiveView();
  }

  // ==========================================================================
  // Shift Assignment Logic
  // ==========================================================================
  function assignShift(staffId, dateStr, shiftId, otHours = 0, earlyLeaveHours = 0) {
    const key = `${staffId}_${dateStr}`;
    if (shiftId === null) {
      delete state.schedules[key];
      showToast('已清除排班', 'success');
    } else {
      const existingEntry = state.schedules[key] || {};
      state.schedules[key] = {
        shiftId: shiftId,
        otHours: Math.max(0, parseFloat(otHours) || 0),
        earlyLeaveHours: Math.max(0, parseFloat(earlyLeaveHours) || (existingEntry.earlyLeaveHours || 0))
      };
      const shift = state.shifts.find(s => s.id === shiftId);
      const otMsg = otHours > 0 ? ` (加班 +${otHours}h)` : '';
      showToast(`已排定：${shift ? shift.name : ''}${otMsg}`, 'success');
    }
    saveState();
    renderAll();
  }

  // ==========================================================================
  // Bottom Sheet (Mobile Shift Assignment & Overtime Hours)
  // ==========================================================================
  function openBottomSheet(staff, dateStr, dayName) {
    state.activeTarget = { staffId: staff.id, dateStr };

    if (elBottomSheetTitle) elBottomSheetTitle.textContent = `指派班別：${staff.name}`;
    if (elBottomSheetSubtitle) elBottomSheetSubtitle.textContent = `日期：${dateStr} (${dayName}) ・ 職稱：${staff.role}`;

    const currentEntry = getScheduleEntry(staff.id, dateStr);
    if (elInputOvertimeHours) {
      elInputOvertimeHours.value = (currentEntry && currentEntry.otHours > 0) ? currentEntry.otHours : '';
    }
    if (elInputEarlyLeaveHours) {
      elInputEarlyLeaveHours.value = (currentEntry && currentEntry.earlyLeaveHours > 0) ? currentEntry.earlyLeaveHours : '';
    }

    if (elDrawerShiftsList) {
      elDrawerShiftsList.innerHTML = '';
      state.shifts.forEach(shift => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'drawer-shift-item';

        const pStyle = getShiftPillStyle(shift);
        item.style.backgroundColor = pStyle.bg;
        item.style.color = pStyle.color;
        item.style.border = pStyle.border;

        const codeText = getShiftDisplayShort(shift);
        const nameText = (state.shiftDisplayLang === 'en') ? (shift.enCode || shift.name) : shift.name;

        item.innerHTML = `
          <div class="drawer-shift-title">
            <span style="padding:0.15rem 0.5rem;background:rgba(0,0,0,0.18);border-radius:4px;font-size:0.85rem;color:${pStyle.color};font-weight:800;">${codeText}</span>
            <span style="display:inline-flex;align-items:center;gap:4px;color:${pStyle.color};font-weight:700;">
              ${nameText}
            </span>
          </div>
          <div class="drawer-shift-time" style="color:${pStyle.color};opacity:0.85;">
            ${shift.start && shift.start !== '-' ? `${shift.start}-${shift.end}` : ''} (${shift.hours}h)
          </div>
        `;

        item.addEventListener('click', () => {
          const enteredOt = (elInputOvertimeHours && elInputOvertimeHours.value !== '') ? (parseFloat(elInputOvertimeHours.value) || 0) : 0;
          const enteredEl = (elInputEarlyLeaveHours && elInputEarlyLeaveHours.value !== '') ? (parseFloat(elInputEarlyLeaveHours.value) || 0) : 0;
          assignShift(staff.id, dateStr, shift.id, enteredOt, enteredEl);
          closeBottomSheet();
        });

        elDrawerShiftsList.appendChild(item);
      });
    }

    if (elBottomSheetBackdrop) {
      elBottomSheetBackdrop.classList.add('open');
      document.body.classList.add('modal-open');
    }
  }

  function closeBottomSheet() {
    if (elBottomSheetBackdrop) {
      elBottomSheetBackdrop.classList.remove('open');
      const hasOther = document.querySelector('.modal-backdrop.open');
      if (!hasOther) document.body.classList.remove('modal-open');
    }
    state.activeTarget = null;
  }

  // ==========================================================================
  // Desktop Popover (Shift Picker with Overtime Input & Confirm Button)
  // ==========================================================================
  function openShiftPicker(staffId, dateStr, anchorEl) {
    if (!elShiftPicker) return;
    elShiftPicker.innerHTML = '';

    const currentEntry = getScheduleEntry(staffId, dateStr);
    const initialOt = (currentEntry && currentEntry.otHours > 0) ? currentEntry.otHours : '';
    const initialEl = (currentEntry && currentEntry.earlyLeaveHours > 0) ? currentEntry.earlyLeaveHours : '';

    function doSaveOtEl() {
      const inputOt = document.getElementById('popover-input-ot');
      const inputEl = document.getElementById('popover-input-el');
      const otVal = (inputOt && inputOt.value !== '') ? (parseFloat(inputOt.value) || 0) : 0;
      const elVal = (inputEl && inputEl.value !== '') ? (parseFloat(inputEl.value) || 0) : 0;
      let existing = getScheduleEntry(staffId, dateStr);
      if (!existing || !existing.shiftId) {
        const defaultShift = state.shifts.find(s => !s.isLeave && s.hours > 0) || state.shifts[0];
        if (defaultShift) {
          assignShift(staffId, dateStr, defaultShift.id, otVal, elVal);
        } else {
          showToast('請先新增並選擇班別', 'warning');
          return;
        }
      } else {
        existing.otHours = otVal;
        existing.earlyLeaveHours = elVal;
        saveState();
        renderAll();
      }
      showToast(`已儲存：加班 ${otVal}h / 早退 ${elVal}h`, 'success');
      closeShiftPicker();
    }

    // 1a. Overtime input row in popover with dedicated save button
    const otRow = document.createElement('div');
    otRow.className = 'popover-ot-row';
    otRow.innerHTML = `
      <span style="font-weight:600;font-size:0.8rem;">⏰ 當日加班：</span>
      <div style="display:flex;align-items:center;gap:4px;">
        <input type="number" id="popover-input-ot" class="popover-ot-input" value="${initialOt}" min="0" max="12" step="0.5" placeholder="0" style="width:48px;text-align:center;padding:2px 4px;">
        <span>h</span>
        <button type="button" class="btn btn-primary" id="popover-btn-save-ot" style="padding:3px 8px;font-size:0.75rem;white-space:nowrap;font-weight:700;">儲存</button>
      </div>
    `;
    elShiftPicker.appendChild(otRow);

    // 1b. Early leave input row in popover with dedicated save button
    const elRow = document.createElement('div');
    elRow.className = 'popover-ot-row';
    elRow.style.borderTop = '1px dashed var(--border-color)';
    elRow.innerHTML = `
      <span style="color:var(--accent-danger);font-weight:600;font-size:0.8rem;">🚪 當日早退：</span>
      <div style="display:flex;align-items:center;gap:4px;">
        <input type="number" id="popover-input-el" class="popover-ot-input" value="${initialEl}" min="0" max="12" step="0.5" placeholder="0" style="width:48px;text-align:center;padding:2px 4px;">
        <span>h</span>
        <button type="button" class="btn btn-primary" id="popover-btn-save-el" style="padding:3px 8px;font-size:0.75rem;white-space:nowrap;font-weight:700;">儲存</button>
      </div>
    `;
    elShiftPicker.appendChild(elRow);

    otRow.querySelector('#popover-btn-save-ot').addEventListener('click', (e) => {
      e.stopPropagation();
      doSaveOtEl();
    });

    elRow.querySelector('#popover-btn-save-el').addEventListener('click', (e) => {
      e.stopPropagation();
      doSaveOtEl();
    });

    otRow.querySelector('#popover-input-ot').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSaveOtEl();
      }
    });

    elRow.querySelector('#popover-input-el').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        doSaveOtEl();
      }
    });

    // 2. Shift Options List
    state.shifts.forEach(shift => {
      const item = document.createElement('div');
      item.className = 'shift-picker-item';

      const shortCode = getShiftDisplayShort(shift);
      const titleText = getShiftDisplayTitle(shift);
      const pStyle = getShiftPillStyle(shift);

      item.innerHTML = `
        <span style="display:flex;align-items:center;gap:0.4rem;">
          <span style="display:inline-block;padding:1px 5px;border-radius:3px;background:${pStyle.bg};color:${pStyle.color};border:${pStyle.border};font-size:0.72rem;font-weight:800;line-height:1.2;">${shortCode}</span>
          <span style="font-weight:600;">${escapeHtml(titleText)}</span>
        </span>
        <span style="font-size:0.75rem;opacity:0.8;">${shift.hours > 0 ? `${shift.hours}h` : '休'}</span>
      `;

      item.addEventListener('click', () => {
        const inputOt = document.getElementById('popover-input-ot');
        const inputEl = document.getElementById('popover-input-el');
        const otVal = (inputOt && inputOt.value !== '') ? (parseFloat(inputOt.value) || 0) : 0;
        const elVal = (inputEl && inputEl.value !== '') ? (parseFloat(inputEl.value) || 0) : 0;
        assignShift(staffId, dateStr, shift.id, otVal, elVal);
        closeShiftPicker();
      });

      elShiftPicker.appendChild(item);
    });

    // 3. Clear button
    const removeItem = document.createElement('div');
    removeItem.className = 'shift-picker-item remove-item';
    removeItem.innerHTML = `<span>❌ 清除此格排班</span>`;
    removeItem.addEventListener('click', () => {
      assignShift(staffId, dateStr, null, 0);
      closeShiftPicker();
    });
    elShiftPicker.appendChild(removeItem);

    const rect = anchorEl.getBoundingClientRect();
    elShiftPicker.style.display = 'flex';
    elShiftPicker.style.visibility = 'hidden';

    // 取得彈出視窗尺寸與螢幕視窗可視高度
    const popoverRect = elShiftPicker.getBoundingClientRect();
    const popoverHeight = popoverRect.height;
    const popoverWidth = popoverRect.width;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let topPos = 0;
    // 若下方空間不足以容納彈出視窗（且上方空間大於下方），自動往上延伸顯示
    if (spaceBelow < popoverHeight + 12 && spaceAbove > spaceBelow) {
      topPos = window.scrollY + rect.top - popoverHeight - 4;
      if (topPos < window.scrollY + 8) {
        topPos = window.scrollY + 8;
      }
    } else {
      // 往下延伸，但保證不超出視窗底部
      topPos = window.scrollY + rect.bottom + 4;
      const maxTop = window.scrollY + viewportHeight - popoverHeight - 8;
      if (topPos > maxTop) {
        topPos = Math.max(window.scrollY + 8, maxTop);
      }
    }

    // 水平方向防止超出視窗右側
    let leftPos = window.scrollX + rect.left;
    if (rect.left + popoverWidth > viewportWidth - 8) {
      leftPos = window.scrollX + viewportWidth - popoverWidth - 8;
    }
    if (leftPos < window.scrollX + 8) {
      leftPos = window.scrollX + 8;
    }

    elShiftPicker.style.top = `${topPos}px`;
    elShiftPicker.style.left = `${leftPos}px`;
    elShiftPicker.style.visibility = 'visible';
  }

  function closeShiftPicker() {
    if (elShiftPicker) elShiftPicker.style.display = 'none';
  }

  // ==========================================================================
  // Staff Hours Breakdown Modal (工時明細與時數上限設定)
  // ==========================================================================
  function openHoursModal() {
    if (!elHoursModal) return;
    elHoursModal.classList.add('open');

    const content = document.getElementById('hours-detail-content');
    if (!content) return;

    const periodDays = getPeriodDays();

    let html = `
      <!-- 一鍵套用全員時數上限 -->
      <div class="card-embedded" style="margin-bottom:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <span style="font-size:0.85rem;font-weight:700;">時數上限：</span>
            <input type="number" id="input-batch-hours-limit" class="form-control" placeholder="輸入時數" min="0" max="9999" style="width:90px;">
            <span style="font-size:0.75rem;color:var(--text-muted);">小時</span>
          </div>
          <button id="btn-apply-batch-hours-limit" class="btn btn-secondary" style="font-size:0.8rem;">一鍵套用全員時數上限</button>
        </div>
      </div>

      <div class="horizontal-scroll-table-wrapper">
        <table class="detail-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>時數上限</th>
              <th>時數</th>
              <th>加班</th>
              <th>早退</th>
              <th>總時數</th>
              <th>檢核</th>
              <th>調整上限</th>
            </tr>
          </thead>
          <tbody>
    `;

    state.staff.forEach(staff => {
      const breakdown = getStaffHoursBreakdown(staff.id, periodDays);
      const allowed = typeof staff.periodMaxHours === 'number' ? staff.periodMaxHours : null;
      const isOver = allowed !== null && breakdown.totalHours > allowed;
      const allowedDisplay = allowed !== null ? `${Math.round(allowed)}h` : '未設定';
      const allowedVal = allowed !== null ? Math.round(allowed) : '';
      const roleInitial = staff.role ? staff.role.trim().slice(0, 1) : '';
      const roleInitialHtml = roleInitial ? `<span class="staff-role-initial">${escapeHtml(roleInitial)}</span>` : '';

      html += `
        <tr>
          <td><b>${escapeHtml(staff.name)}</b>${roleInitialHtml}</td>
          <td>${allowedDisplay}</td>
          <td>${breakdown.normalHours}h</td>
          <td style="color:#f59e0b;font-weight:700;">${breakdown.otHours > 0 ? `+${breakdown.otHours}h` : '0h'}</td>
          <td style="color:var(--accent-danger);font-weight:700;">${(breakdown.earlyLeaveHours || 0) > 0 ? `-${breakdown.earlyLeaveHours}h` : '0h'}</td>
          <td style="font-weight:800;font-size:0.95rem;">${breakdown.totalHours}h</td>
          <td>
            ${allowed !== null
              ? `<span class="headcount-status-badge ${isOver ? 'status-shortage' : 'status-ok'}">${isOver ? '超標' : '正常'}</span>`
              : `<span class="headcount-status-badge" style="background:var(--bg-subtle);color:var(--text-muted);">未設定</span>`
            }
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:4px;">
              <input type="number" class="leave-quota-input hours-limit-input" data-staff-id="${staff.id}" value="${allowedVal}" placeholder="輸入上限" min="0" max="9999" style="width:70px;">
              <span style="font-size:0.75rem;color:var(--text-muted);">h</span>
              <button class="btn btn-secondary btn-save-hours-limit" data-staff-id="${staff.id}" style="padding:0.2rem 0.5rem;font-size:0.72rem;">儲存</button>
            </div>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    content.innerHTML = html;

    // Batch apply button
    const btnBatch = document.getElementById('btn-apply-batch-hours-limit');
    if (btnBatch) {
      btnBatch.addEventListener('click', () => {
        const inp = document.getElementById('input-batch-hours-limit');
        const val = parseFloat(inp ? inp.value : 160) || 0;
        state.staff.forEach(s => { s.periodMaxHours = val; });
        saveState();
        openHoursModal();
        renderKPIDashboard();
        showToast(`已一鍵將全員時數上限設定為 ${val} 小時！`, 'success');
      });
    }

    // Bind save limit buttons
    content.querySelectorAll('.btn-save-hours-limit').forEach(btn => {
      btn.addEventListener('click', () => {
        const staffId = btn.dataset.staffId;
        const input = content.querySelector(`.hours-limit-input[data-staff-id="${staffId}"]`);
        if (input) {
          const staff = state.staff.find(s => s.id === staffId);
          if (staff) {
            staff.periodMaxHours = parseFloat(input.value) || 0;
            saveState();
            renderKPIDashboard();
            showToast(`已更新 ${staff.name} 時數上限為 ${staff.periodMaxHours} h`, 'success');
            openHoursModal();
          }
        }
      });
    });
  }

  // ==========================================================================
  // Staff Cost & Overtime Multiplier Modal (薪資明細)
  // ==========================================================================
  function openCostModal() {
    if (!elCostModal) return;
    elCostModal.classList.add('open');
    renderCostModalUI();
  }

  function renderCostModalUI() {
    const content = document.getElementById('cost-detail-content');
    if (!content) return;

    const periodDays = getPeriodDays();
    let sumNormalHours = 0;
    let sumOtHours = 0;
    let sumElHours = 0;
    let sumNormalCost = 0;
    let sumOtCost = 0;
    let sumElDeduction = 0;
    let sumTotalCost = 0;

    let html = `
      <div class="card-embedded" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          <span style="font-weight:700;font-size:0.875rem;">⚙️ 加班費計算倍率：</span>
          <input type="number" id="input-modal-ot-rate" class="form-control" value="${state.otMultiplier}" min="1" max="4" step="0.01" style="width:90px;font-weight:700;">
          <span style="font-size:0.75rem;color:var(--text-muted);">倍 (例：1.34 = 時薪 × 1.34)</span>
        </div>
        <button id="btn-apply-modal-ot-rate" class="btn btn-primary" style="font-size:0.8rem;padding:0.4rem 0.8rem;">更新計算</button>
      </div>

      <div class="horizontal-scroll-table-wrapper">
        <table class="detail-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>時薪</th>
              <th>時數</th>
              <th>薪資</th>
              <th>加班</th>
              <th>加班費</th>
              <th>早退</th>
              <th>早退扣薪</th>
              <th>總薪資</th>
            </tr>
          </thead>
          <tbody>
    `;

    state.staff.forEach(staff => {
      const breakdown = getStaffHoursBreakdown(staff.id, periodDays);
      const normalPay = Math.round(breakdown.normalHours * staff.wage);
      const otPay = Math.round(breakdown.otHours * staff.wage * state.otMultiplier);
      const elDeduction = Math.round((breakdown.earlyLeaveHours || 0) * staff.wage);
      const totalPay = normalPay + otPay - elDeduction;

      sumNormalHours += breakdown.normalHours;
      sumOtHours += breakdown.otHours;
      sumElHours += (breakdown.earlyLeaveHours || 0);
      sumNormalCost += normalPay;
      sumOtCost += otPay;
      sumElDeduction += elDeduction;
      sumTotalCost += totalPay;

      const roleInitial = staff.role ? staff.role.trim().slice(0, 1) : '';
      const roleInitialHtml = roleInitial ? `<span class="staff-role-initial">${escapeHtml(roleInitial)}</span>` : '';

      html += `
        <tr>
          <td><b>${escapeHtml(staff.name)}</b>${roleInitialHtml}</td>
          <td>NT$ ${staff.wage}</td>
          <td>${breakdown.normalHours}h</td>
          <td>NT$ ${normalPay.toLocaleString()}</td>
          <td style="color:#f59e0b;font-weight:700;">${breakdown.otHours > 0 ? `+${breakdown.otHours}h` : '0h'}</td>
          <td style="color:#f59e0b;">NT$ ${otPay.toLocaleString()}</td>
          <td style="color:var(--accent-danger);font-weight:700;">${(breakdown.earlyLeaveHours || 0) > 0 ? `-${breakdown.earlyLeaveHours}h` : '0h'}</td>
          <td style="color:var(--accent-danger);">-NT$ ${elDeduction.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--accent-primary);font-size:0.95rem;">NT$ ${totalPay.toLocaleString()}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
          <tfoot>
            <tr style="background:var(--bg-subtle);font-weight:800;">
              <td>全體合計</td>
              <td>-</td>
              <td>${sumNormalHours}h</td>
              <td>NT$ ${sumNormalCost.toLocaleString()}</td>
              <td style="color:#f59e0b;">${sumOtHours > 0 ? `+${sumOtHours}h` : '0h'}</td>
              <td style="color:#f59e0b;">NT$ ${sumOtCost.toLocaleString()}</td>
              <td style="color:var(--accent-danger);">${sumElHours > 0 ? `-${sumElHours}h` : '0h'}</td>
              <td style="color:var(--accent-danger);">-NT$ ${sumElDeduction.toLocaleString()}</td>
              <td style="color:var(--accent-primary);font-size:1.05rem;">NT$ ${sumTotalCost.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    content.innerHTML = html;

    const btnApply = document.getElementById('btn-apply-modal-ot-rate');
    if (btnApply) {
      btnApply.addEventListener('click', () => {
        const inp = document.getElementById('input-modal-ot-rate');
        if (inp) {
          const val = parseFloat(inp.value);
          if (val > 0) {
            state.otMultiplier = val;
            saveState();
            renderCostModalUI();
            renderKPIDashboard();
            showToast(`已套用加班倍率：${val} 倍！`, 'success');
          }
        }
      });
    }
  }

  // ==========================================================================
  // Leave Management Modal (休假管理與應休天數)
  // ==========================================================================
  function openLeavesModal() {
    if (!elLeavesModal) return;
    elLeavesModal.classList.add('open');
    renderLeavesModalUI();
  }

  function renderLeavesModalUI() {
    const content = document.getElementById('leave-detail-content');
    if (!content) return;

    const periodDays = getPeriodDays();

    let html = `
      <div class="horizontal-scroll-table-wrapper">
        <table class="detail-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>應休</th>
              <th>已排休</th>
              <th>未休</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
    `;

    state.staff.forEach(staff => {
      const quota = typeof staff.leaveQuota === 'number' ? staff.leaveQuota : null;
      let actualLeaves = 0;

      periodDays.forEach(d => {
        const dateIso = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(s => s.id === entry.shiftId);
          if (shift && (shift.isLeave || shift.hours === 0)) {
            actualLeaves++;
          }
        }
      });

      let statusHtml;
      if (quota === null) {
        statusHtml = `<span class="headcount-status-badge" style="background:var(--bg-subtle);color:var(--text-muted);">未設定</span>`;
      } else {
        const diff = quota - actualLeaves;
        const isShort = diff > 0;
        statusHtml = `<span class="headcount-status-badge ${diff === 0 ? 'status-ok' : (isShort ? 'status-shortage' : 'status-ok')}">${diff === 0 ? '已足額' : (isShort ? `尚缺 ${diff} 天` : `超出 ${Math.abs(diff)} 天`)}</span>`;
      }

      const roleInitial = staff.role ? staff.role.trim().slice(0, 1) : '';
      const roleInitialHtml = roleInitial ? `<span class="staff-role-initial">${escapeHtml(roleInitial)}</span>` : '';

      html += `
        <tr>
          <td><b>${escapeHtml(staff.name)}</b>${roleInitialHtml}</td>
          <td>
            <input type="number" class="leave-quota-input" data-staff-id="${staff.id}" value="${quota !== null ? quota : ''}" placeholder="輸入天數" min="0" max="31">
          </td>
          <td><span class="leave-actual-badge">${actualLeaves} 天</span></td>
          <td>
            ${statusHtml}
          </td>
          <td>
            <button class="btn btn-secondary btn-save-single-quota" data-staff-id="${staff.id}" style="padding:0.25rem 0.55rem;font-size:0.75rem;">
              儲存
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    content.innerHTML = html;

    // Bind individual save buttons
    content.querySelectorAll('.btn-save-single-quota').forEach(btn => {
      btn.addEventListener('click', () => {
        const staffId = btn.dataset.staffId;
        const input = content.querySelector(`.leave-quota-input[data-staff-id="${staffId}"]`);
        if (input) {
          const staff = state.staff.find(s => s.id === staffId);
          if (staff) {
            const raw = input.value.trim();
            staff.leaveQuota = raw === '' ? null : (parseInt(raw, 10) || 0);
            saveState();
            renderLeavesModalUI();
            renderKPIDashboard();
            const dispVal = staff.leaveQuota !== null ? `${staff.leaveQuota} 天` : '未設定';
            showToast(`已更新 ${staff.name} 應休天數為 ${dispVal}`, 'success');
          }
        }
      });
    });
  }

  // ==========================================================================
  // Shift Stats Modal Management (班數統計總表)
  // ==========================================================================
  function openShiftStatsModal() {
    if (!elShiftStatsModal) return;
    const badge = document.getElementById('shift-stats-period-badge');
    if (badge) {
      const pText = document.getElementById('period-display-badge')?.textContent || '';
      badge.textContent = `統計週期：${pText.trim()}`;
    }
    renderShiftStatsTable();
    elShiftStatsModal.classList.add('open');
  }

  function renderShiftStatsTable() {
    const table = document.getElementById('table-shift-stats');
    if (!table) return;

    const days = getPeriodDays();
    const allShifts = state.shifts;

    // Calculate count per staff & per shift
    const stats = {};
    const shiftColTotals = {};
    allShifts.forEach(s => { shiftColTotals[s.id] = 0; });
    let grandTotalShifts = 0;
    let grandTotalHours = 0;

    state.staff.forEach(staff => {
      stats[staff.id] = {
        counts: {},
        totalShifts: 0,
        totalHours: 0
      };
      allShifts.forEach(s => { stats[staff.id].counts[s.id] = 0; });

      days.forEach(d => {
        const dateIso = formatDateIso(d);
        const entry = getScheduleEntry(staff.id, dateIso);
        if (entry && entry.shiftId && stats[staff.id].counts[entry.shiftId] !== undefined) {
          stats[staff.id].counts[entry.shiftId]++;
          shiftColTotals[entry.shiftId]++;
          const shiftObj = state.shifts.find(s => s.id === entry.shiftId);
          if (shiftObj && !shiftObj.isLeave && shiftObj.hours > 0) {
            stats[staff.id].totalShifts++;
            grandTotalShifts++;
          }
        }
      });
      const breakdown = getStaffHoursBreakdown(staff.id, days);
      stats[staff.id].totalHours = breakdown.totalHours;
      grandTotalHours += breakdown.totalHours;
    });

    // Table Header
    let html = '<thead><tr>';
    html += '<th style="position:sticky;left:0;z-index:2;min-width:110px;text-align:left;">員工姓名</th>';
    allShifts.forEach(shift => {
      const code = getShiftDisplayShort(shift);
      html += `
        <th style="min-width:65px;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${shift.color};"></span>
            <span>${escapeHtml(shift.name)} [${escapeHtml(code)}]</span>
          </div>
        </th>
      `;
    });
    html += '<th style="min-width:70px;text-align:center;font-weight:800;color:var(--accent-primary);">出勤班數</th>';
    html += '<th style="min-width:70px;text-align:center;font-weight:800;color:var(--accent-secondary);">總工時</th>';
    html += '</tr></thead><tbody>';

    // Table Body
    state.staff.forEach(staff => {
      const st = stats[staff.id];
      html += '<tr>';
      html += `
        <td style="position:sticky;left:0;background:var(--bg-card);z-index:1;text-align:left;font-weight:700;">
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <div class="staff-avatar" style="background:${staff.color};width:26px;height:26px;font-size:0.75rem;">
              ${staff.name.slice(0, 1)}
            </div>
            <span>${escapeHtml(staff.name)}</span>
            <span style="font-size:0.7rem;color:var(--text-muted);">(${escapeHtml(staff.role)})</span>
          </div>
        </td>
      `;

      allShifts.forEach(shift => {
        const count = st.counts[shift.id] || 0;
        if (count > 0) {
          const bg = shift.bgTransparent ? 'var(--bg-secondary)' : shift.color;
          const fg = shift.textColor || '#ffffff';
          const borderStyle = shift.bgTransparent ? `border:1px solid ${shift.color || 'var(--border-color)'};` : '';
          html += `
            <td style="text-align:center;">
              <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-weight:800;font-size:0.8rem;background:${bg};color:${fg};${borderStyle}">
                ${count}
              </span>
            </td>
          `;
        } else {
          html += '<td style="text-align:center;color:var(--text-muted);font-size:0.75rem;">0</td>';
        }
      });

      html += `<td style="text-align:center;font-weight:800;color:var(--accent-primary);">${st.totalShifts}</td>`;
      html += `<td style="text-align:center;font-weight:800;color:var(--text-primary);">${st.totalHours}H</td>`;
      html += '</tr>';
    });

    // Table Footer (Totals)
    html += '</tbody><tfoot><tr style="font-weight:800;background:var(--bg-tertiary);border-top:2px solid var(--border-color);">';
    html += '<td style="position:sticky;left:0;background:var(--bg-tertiary);z-index:1;text-align:left;">全體合計</td>';
    allShifts.forEach(shift => {
      const colTotal = shiftColTotals[shift.id] || 0;
      html += `<td style="text-align:center;">${colTotal}</td>`;
    });
    html += `<td style="text-align:center;color:var(--accent-primary);">${grandTotalShifts}</td>`;
    html += `<td style="text-align:center;">${grandTotalHours}H</td>`;
    html += '</tr></tfoot>';

    table.innerHTML = html;
  }

  // ==========================================================================
  // Headcount Adequacy Tab Management (法規與人力規則)
  // ==========================================================================
  function openRulesModal(defaultTab = 'violations') {
    if (!elRulesModal) return;
    elRulesModal.classList.add('open');
    switchRulesTab(defaultTab);
  }

  function switchRulesTab(tab) {
    const btnViolations = document.getElementById('tab-btn-violations');
    const btnSettings = document.getElementById('tab-btn-rules-settings');
    const btnHeadcount = document.getElementById('tab-btn-headcount-rules');

    const paneViolations = document.getElementById('tab-content-violations');
    const paneSettings = document.getElementById('tab-content-rules-settings');
    const paneHeadcount = document.getElementById('tab-content-headcount-rules');

    [btnViolations, btnSettings, btnHeadcount].forEach(b => { if (b) b.classList.remove('active'); });
    [paneViolations, paneSettings, paneHeadcount].forEach(p => { if (p) p.style.display = 'none'; });

    if (tab === 'violations') {
      if (btnViolations) btnViolations.classList.add('active');
      if (paneViolations) paneViolations.style.display = 'block';
      renderViolationsList();
    } else if (tab === 'headcount') {
      if (btnHeadcount) btnHeadcount.classList.add('active');
      if (paneHeadcount) paneHeadcount.style.display = 'block';
      renderHeadcountRulesUI();
    } else {
      if (btnSettings) btnSettings.classList.add('active');
      if (paneSettings) paneSettings.style.display = 'block';
      populateRulesForm();
    }
  }

  function renderViolationsList() {
    const container = document.getElementById('violations-list-container');
    if (!container) return;
    container.innerHTML = '';

    const violations = getAllViolations();

    if (violations.length === 0) {
      container.innerHTML = `
        <div class="violation-empty-state">
          <svg class="violation-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div style="font-weight:700;font-size:1.05rem;color:var(--text-primary);margin-top:0.4rem;">
            目前排班完全合規！
          </div>
          <div style="font-size:0.825rem;color:var(--text-secondary);">
            無連續工作超限、無工時超標、無搭檔互斥、且平日/假日人力完全達標。
          </div>
        </div>
      `;
      return;
    }

    violations.forEach(v => {
      const item = document.createElement('div');
      item.className = 'violation-item';
      item.innerHTML = `
        <div class="violation-left">
          <div class="violation-header-row">
            <span class="violation-staff-badge">${escapeHtml(v.staffName)}</span>
            <span class="violation-date">📅 ${escapeHtml(v.date)}</span>
            <span class="violation-tag">🚨 ${escapeHtml(v.title)}</span>
          </div>
          <div class="violation-desc">${escapeHtml(v.desc)}</div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  function populateRulesForm() {
    const elMaxShifts = document.getElementById('rule-max-shifts-day');
    const elMaxConsecutive = document.getElementById('rule-max-consecutive-days');
    const elMaxDaily = document.getElementById('rule-max-daily-hours');
    const elPeriodMaxHours = document.getElementById('rule-period-max-hours');
    const elMonthlyLeaves = document.getElementById('rule-monthly-leave-quota');

    if (elMaxShifts) elMaxShifts.value = state.rules.maxDailyShifts || 1;
    if (elMaxConsecutive) elMaxConsecutive.value = state.rules.maxConsecutiveDays || 6;
    if (elMaxDaily) elMaxDaily.value = state.rules.maxDailyHours || 12;
    if (elPeriodMaxHours) elPeriodMaxHours.value = (typeof state.rules.periodMaxHours === 'number') ? state.rules.periodMaxHours : 160;
    if (elMonthlyLeaves) elMonthlyLeaves.value = (typeof state.rules.monthlyLeaveQuota === 'number') ? state.rules.monthlyLeaveQuota : 8;
  }

  function renderHeadcountRulesUI() {
    state.rules.headcount = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
    const elWeekday = document.getElementById('rule-weekday-headcount');
    const elHoliday = document.getElementById('rule-holiday-headcount');
    const listCustom = document.getElementById('custom-headcount-list');

    if (elWeekday) elWeekday.value = state.rules.headcount.weekdayMin || 3;
    if (elHoliday) elHoliday.value = state.rules.headcount.weekendMin || 2;

    if (listCustom) {
      listCustom.innerHTML = '';
      if (!state.rules.headcount.customDates || state.rules.headcount.customDates.length === 0) {
        listCustom.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted);">尚未設定自訂特殊日期（使用平日/假日預設值）</span>';
      } else {
        state.rules.headcount.customDates.forEach((item, idx) => {
          const row = document.createElement('div');
          row.className = 'headcount-rule-tag';
          row.innerHTML = `
            <span>📅 <b>${escapeHtml(item.date)}</b> ： 最低 <b>${item.min}</b> 人</span>
            <button type="button" class="btn-del-rule" title="移除此自訂日期">&times;</button>
          `;
          row.querySelector('.btn-del-rule').addEventListener('click', () => {
            state.rules.headcount.customDates.splice(idx, 1);
            saveState();
            renderHeadcountRulesUI();
            renderAll();
            showToast('已移除自訂日期人力要求', 'info');
          });
          listCustom.appendChild(row);
        });
      }
    }
  }

  // ==========================================================================
  // Auto-Schedule Advanced Rules Modal
  // ==========================================================================
  function openAutoRulesModal() {
    if (!elAutoRulesModal) return;
    elAutoRulesModal.classList.add('open');
    renderAutoRulesModalUI();
  }

  function renderAutoRulesModalUI() {
    const selA = document.getElementById('select-antipair-a');
    const selB = document.getElementById('select-antipair-b');
    const listAnti = document.getElementById('antipair-list-container');

    if (selA && selB) {
      selA.innerHTML = '';
      selB.innerHTML = '';
      state.staff.forEach(s => {
        const optA = document.createElement('option');
        optA.value = s.id;
        optA.textContent = `${s.name} (${s.role})`;
        selA.appendChild(optA);

        const optB = document.createElement('option');
        optB.value = s.id;
        optB.textContent = `${s.name} (${s.role})`;
        selB.appendChild(optB);
      });
    }

    if (listAnti) {
      listAnti.innerHTML = '';
      if (state.antiPairs.length === 0) {
        listAnti.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted);">尚未設定互斥人員（所有人皆可同天排班）</span>';
      } else {
        state.antiPairs.forEach((pair, idx) => {
          const staffA = state.staff.find(s => s.id === pair[0]);
          const staffB = state.staff.find(s => s.id === pair[1]);
          const nameA = staffA ? staffA.name : '已刪除同仁';
          const nameB = staffB ? staffB.name : '已刪除同仁';

          const tag = document.createElement('div');
          tag.className = 'rule-tag-item';
          tag.innerHTML = `
            <span>🚫 <b>${escapeHtml(nameA)}</b> 與 <b>${escapeHtml(nameB)}</b> 不能同天出勤</span>
            <button type="button" class="btn-del-rule" title="移除此互斥規則">&times;</button>
          `;
          tag.querySelector('.btn-del-rule').addEventListener('click', () => {
            state.antiPairs.splice(idx, 1);
            saveState();
            renderAutoRulesModalUI();
            showToast('已移除互斥規則', 'info');
          });
          listAnti.appendChild(tag);
        });
      }
    }

    const selRole = document.getElementById('select-role-restrict-role');
    const selShift = document.getElementById('select-role-restrict-shift');
    const listRoleRestrict = document.getElementById('role-restrict-list-container');

    if (selRole && selShift) {
      selRole.innerHTML = '';
      state.roles.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        selRole.appendChild(opt);
      });

      selShift.innerHTML = '';
      const workShifts = state.shifts.filter(s => s.id !== 'shift_off');
      workShifts.forEach(sh => {
        const opt = document.createElement('option');
        opt.value = sh.id;
        opt.textContent = `${sh.name} (${sh.code})`;
        selShift.appendChild(opt);
      });
    }

    if (listRoleRestrict) {
      listRoleRestrict.innerHTML = '';
      if (state.roleRestrictions.length === 0) {
        listRoleRestrict.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted);">尚未設定職能限制（所有職位皆可排任意班別）</span>';
      } else {
        state.roleRestrictions.forEach((item, idx) => {
          const shift = state.shifts.find(s => s.id === item.shiftId);
          const shiftName = shift ? shift.name : '已刪除班別';

          const tag = document.createElement('div');
          tag.className = 'rule-tag-item';
          tag.innerHTML = `
            <span>🔒 職位 <b>${escapeHtml(item.role)}</b> 不能上 <b>${escapeHtml(shiftName)}</b></span>
            <button type="button" class="btn-del-rule" title="移除此限制">&times;</button>
          `;
          tag.querySelector('.btn-del-rule').addEventListener('click', () => {
            state.roleRestrictions.splice(idx, 1);
            saveState();
            renderAutoRulesModalUI();
            showToast('已移除職位排班限制', 'info');
          });
          listRoleRestrict.appendChild(tag);
        });
      }
    }

    // Rule 3: Staff Shift Restrictions (特定人員不能上特定班別)
    const selStaffRestrict = document.getElementById('select-staff-restrict-staff');
    const selStaffShift = document.getElementById('select-staff-restrict-shift');
    const listStaffRestrict = document.getElementById('staff-restrict-list-container');

    if (selStaffRestrict && selStaffShift) {
      selStaffRestrict.innerHTML = '';
      state.staff.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st.id;
        const rInit = st.role ? ` (${st.role})` : '';
        opt.textContent = `${st.name}${rInit}`;
        selStaffRestrict.appendChild(opt);
      });

      selStaffShift.innerHTML = '';
      const workShifts = state.shifts.filter(s => s.id !== 'shift_off');
      workShifts.forEach(sh => {
        const opt = document.createElement('option');
        opt.value = sh.id;
        opt.textContent = `${sh.name} (${sh.code})`;
        selStaffShift.appendChild(opt);
      });
    }

    if (listStaffRestrict) {
      listStaffRestrict.innerHTML = '';
      state.staffRestrictions = Array.isArray(state.staffRestrictions) ? state.staffRestrictions : [];
      if (state.staffRestrictions.length === 0) {
        listStaffRestrict.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted);">尚未設定人員限制（所有人員皆可排任意班別）</span>';
      } else {
        state.staffRestrictions.forEach((item, idx) => {
          const staffObj = state.staff.find(s => s.id === item.staffId);
          const staffName = staffObj ? staffObj.name : '已刪除人員';
          const shift = state.shifts.find(s => s.id === item.shiftId);
          const shiftName = shift ? shift.name : '已刪除班別';

          const tag = document.createElement('div');
          tag.className = 'rule-tag-item';
          tag.innerHTML = `
            <span>🚫 人員 <b>${escapeHtml(staffName)}</b> 不能上 <b>${escapeHtml(shiftName)}</b></span>
            <button type="button" class="btn-del-rule" title="移除此限制">&times;</button>
          `;
          tag.querySelector('.btn-del-rule').addEventListener('click', () => {
            state.staffRestrictions.splice(idx, 1);
            saveState();
            renderAutoRulesModalUI();
            showToast('已移除人員排班限制', 'info');
          });
          listStaffRestrict.appendChild(tag);
        });
      }
    }

    // Weekday & Weekend Minimum Headcount
    const inpAutoWeekday = document.getElementById('auto-rule-weekday-headcount');
    const inpAutoHoliday = document.getElementById('auto-rule-holiday-headcount');
    const hc = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
    if (inpAutoWeekday) {
      inpAutoWeekday.value = typeof hc.weekdayMin === 'number' ? hc.weekdayMin : 3;
      inpAutoWeekday.onchange = () => {
        state.rules.headcount = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
        state.rules.headcount.weekdayMin = parseInt(inpAutoWeekday.value, 10) || 0;
        saveState();
      };
    }
    if (inpAutoHoliday) {
      inpAutoHoliday.value = typeof hc.weekendMin === 'number' ? hc.weekendMin : 2;
      inpAutoHoliday.onchange = () => {
        state.rules.headcount = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
        state.rules.headcount.weekendMin = parseInt(inpAutoHoliday.value, 10) || 0;
        saveState();
      };
    }

    // Render 各班別平日與假日最低人力需求
    const shiftHeadcountContainer = document.getElementById('auto-shifts-headcount-container');
    if (shiftHeadcountContainer) {
      shiftHeadcountContainer.innerHTML = '';
      const workShifts = state.shifts.filter(s => !s.isLeave && s.hours > 0);
      state.rules.weekdayShiftMin = state.rules.weekdayShiftMin || {};
      state.rules.holidayShiftMin = state.rules.holidayShiftMin || {};

      workShifts.forEach(shift => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:0.75rem;padding:0.4rem 0.6rem;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-sm);flex-wrap:wrap;';

        const curWeekdayMin = typeof state.rules.weekdayShiftMin[shift.id] === 'number' ? state.rules.weekdayShiftMin[shift.id] : (shift.targetStaff || 1);
        const curHolidayMin = typeof state.rules.holidayShiftMin[shift.id] === 'number' ? state.rules.holidayShiftMin[shift.id] : (shift.targetStaff || 1);

        row.innerHTML = `
          <div style="display:flex;align-items:center;gap:0.4rem;min-width:110px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${shift.color};"></span>
            <span style="font-weight:700;font-size:0.85rem;color:var(--text-primary);">${escapeHtml(shift.name)}</span>
            <span style="font-size:0.72rem;color:var(--text-muted);">(${shift.hours}h)</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:0.35rem;">
              <label style="font-size:0.78rem;color:var(--text-secondary);white-space:nowrap;">平日：</label>
              <input type="number" class="form-control inp-shift-weekday-min" data-shift-id="${shift.id}" value="${curWeekdayMin}" min="0" max="30" style="width:65px;padding:0.25rem 0.4rem;font-size:0.8rem;">
              <span style="font-size:0.72rem;color:var(--text-muted);">人</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.35rem;">
              <label style="font-size:0.78rem;color:var(--text-secondary);white-space:nowrap;">假日：</label>
              <input type="number" class="form-control inp-shift-holiday-min" data-shift-id="${shift.id}" value="${curHolidayMin}" min="0" max="30" style="width:65px;padding:0.25rem 0.4rem;font-size:0.8rem;">
              <span style="font-size:0.72rem;color:var(--text-muted);">人</span>
            </div>
          </div>
        `;

        row.querySelector('.inp-shift-weekday-min').addEventListener('change', (e) => {
          state.rules.weekdayShiftMin[shift.id] = Math.max(0, parseInt(e.target.value, 10) || 0);
          saveState();
        });

        row.querySelector('.inp-shift-holiday-min').addEventListener('change', (e) => {
          state.rules.holidayShiftMin[shift.id] = Math.max(0, parseInt(e.target.value, 10) || 0);
          saveState();
        });

        shiftHeadcountContainer.appendChild(row);
      });
    }

    const fairnessContainer = document.getElementById('shift-fairness-toggles-container');
    if (fairnessContainer) {
      fairnessContainer.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'checkbox-grid';
      const workShifts = state.shifts.filter(s => s.id !== 'shift_off');

      workShifts.forEach(shift => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        const isChecked = state.shiftFairness.includes(shift.id);

        label.innerHTML = `
          <input type="checkbox" data-shift-id="${shift.id}" ${isChecked ? 'checked' : ''}>
          <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${shift.color};"></span>
          <span>${escapeHtml(shift.name)} (${shift.code})</span>
        `;

        label.querySelector('input').addEventListener('change', (e) => {
          if (e.target.checked) {
            if (!state.shiftFairness.includes(shift.id)) state.shiftFairness.push(shift.id);
          } else {
            state.shiftFairness = state.shiftFairness.filter(id => id !== shift.id);
          }
          saveState();
        });

        grid.appendChild(label);
      });
      fairnessContainer.appendChild(grid);
    }

    // Rule 4: Custom Date Shift Requirements
    const selCustomShift = document.getElementById('select-custom-req-shift');
    const inpCustomDate = document.getElementById('input-custom-req-date');
    const listCustomReq = document.getElementById('custom-req-list-container');

    if (selCustomShift) {
      selCustomShift.innerHTML = '';
      const workShifts = state.shifts.filter(s => s.id !== 'shift_off');
      workShifts.forEach(sh => {
        const opt = document.createElement('option');
        opt.value = sh.id;
        opt.textContent = `${sh.name} (${sh.code})`;
        selCustomShift.appendChild(opt);
      });
    }
    if (inpCustomDate && !inpCustomDate.value) {
      inpCustomDate.value = formatDateIso(state.periodStart || new Date());
    }

    if (listCustomReq) {
      listCustomReq.innerHTML = '';
      state.customShiftRequirements = state.customShiftRequirements || [];
      if (state.customShiftRequirements.length === 0) {
        listCustomReq.innerHTML = '<span style="font-size:0.75rem;color:var(--text-muted);">尚未設定指定時間班別需求（將依各班別預設需求排班）</span>';
      } else {
        state.customShiftRequirements.forEach((item, idx) => {
          const shift = state.shifts.find(s => s.id === item.shiftId);
          const shiftName = shift ? shift.name : '已刪除班別';

          const tag = document.createElement('div');
          tag.className = 'rule-tag-item';
          tag.innerHTML = `
            <span>📅 <b>${escapeHtml(item.date)}</b> 的 <b>${escapeHtml(shiftName)}</b> 需求：<b>${item.count}</b> 人</span>
            <button type="button" class="btn-del-rule" title="移除此需求">&times;</button>
          `;
          tag.querySelector('.btn-del-rule').addEventListener('click', () => {
            state.customShiftRequirements.splice(idx, 1);
            saveState();
            renderAutoRulesModalUI();
            showToast('已移除指定時間班別人力需求', 'info');
          });
          listCustomReq.appendChild(tag);
        });
      }
    }
  }

  // ==========================================================================
  // Auto-Scheduling Solver (依據互斥、偏好、公平性平均指派，帶入除錯設定以達成 0 異常)
  // ==========================================================================
  function runAutoScheduler() {
    if (!confirm('將針對當期「尚未填入班別」的日期進行智慧自動排班（已填入之班別將完整保留不覆蓋），確認繼續？')) {
      return;
    }

    if (state.staff.length === 0) {
      showToast('目前名冊中無員工，請先新增人員！', 'warning');
      return;
    }

    const periodDays = getPeriodDays();
    const workShifts = state.shifts.filter(s => !s.isLeave && s.hours > 0);

    if (workShifts.length === 0) {
      showToast('無可排定的工作班別，請先設定班別！', 'warning');
      return;
    }

    // 檢查是否有尚未填入班別的格子
    let emptySlotsCount = 0;
    state.staff.forEach(s => {
      periodDays.forEach(d => {
        const dateIso = formatDateIso(d);
        const entry = getScheduleEntry(s.id, dateIso);
        if (!entry || !entry.shiftId) {
          emptySlotsCount++;
        }
      });
    });

    if (emptySlotsCount === 0) {
      showToast('當期所有同仁之班別均已完整排定，無空白班表需要填入！', 'info');
      return;
    }

    const maxConsecutive = state.rules.maxConsecutiveDays || 6;
    const maxDailyHours = state.rules.maxDailyHours || 12;
    const periodMaxHours = (state.rules && typeof state.rules.periodMaxHours === 'number') ? state.rules.periodMaxHours : 160;

    // Initialize shift counts & hours per staff for fairness and hour balancing
    const shiftCountMap = {};
    const staffHoursMap = {};
    state.staff.forEach(s => {
      shiftCountMap[s.id] = {};
      staffHoursMap[s.id] = 0;
      workShifts.forEach(sh => { shiftCountMap[s.id][sh.id] = 0; });
    });

    // 先讀取當期現有班表，統計已排定之工時與班別次數（不覆蓋已填入之班別）
    periodDays.forEach(d => {
      const dateIso = formatDateIso(d);
      state.staff.forEach(s => {
        const entry = getScheduleEntry(s.id, dateIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(sh => sh.id === entry.shiftId);
          if (shift && !shift.isLeave && shift.hours > 0) {
            shiftCountMap[s.id][shift.id] = (shiftCountMap[s.id][shift.id] || 0) + 1;
            staffHoursMap[s.id] = (staffHoursMap[s.id] || 0) + (shift.hours || 0) + (entry.otHours || 0);
          }
        }
      });
    });

    // Helper: 檢查若某同仁在此日排入上班，是否會超過法定/設定連續上班天數 (前後雙向檢查)
    function wouldExceedConsecutive(staffId, dayIndex) {
      let streak = 1;
      // 向前累計
      for (let i = dayIndex - 1; i >= 0; i--) {
        const prevIso = formatDateIso(periodDays[i]);
        const entry = getScheduleEntry(staffId, prevIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(sh => sh.id === entry.shiftId);
          if (shift && !shift.isLeave && shift.hours > 0) {
            streak++;
            continue;
          }
        }
        break;
      }
      // 向後累計 (既有已排定班別)
      for (let i = dayIndex + 1; i < periodDays.length; i++) {
        const nextIso = formatDateIso(periodDays[i]);
        const entry = getScheduleEntry(staffId, nextIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(sh => sh.id === entry.shiftId);
          if (shift && !shift.isLeave && shift.hours > 0) {
            streak++;
            continue;
          }
        }
        break;
      }
      return streak > maxConsecutive;
    }

    // Helper: 陣列隨機洗牌演算法 (Fisher-Yates)
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    let newlyAssignedCount = 0;

    periodDays.forEach((d, dayIndex) => {
      const dateIso = formatDateIso(d);
      const dayOfWeek = d.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const workingToday = new Set();

      // 先將當日「既有已填入工作班別」的員工加入 workingToday
      state.staff.forEach(staff => {
        const entry = getScheduleEntry(staff.id, dateIso);
        if (entry && entry.shiftId) {
          const shift = state.shifts.find(sh => sh.id === entry.shiftId);
          if (shift && !shift.isLeave && shift.hours > 0) {
            workingToday.add(staff.id);
          }
        }
      });

      // 1. 偏好休假：僅針對「當日尚未填入班別」的員工排定
      const staffForOffPref = shuffleArray([...state.staff]);
      staffForOffPref.forEach(staff => {
        const key = `${staff.id}_${dateIso}`;
        const entry = getScheduleEntry(staff.id, dateIso);
        if (!entry || !entry.shiftId) {
          if (staff.offPref !== 'none' && parseInt(staff.offPref, 10) === dayOfWeek) {
            const defaultOffShift = state.shifts.find(s => s.id === 'shift_off') || state.shifts.find(s => s.isLeave) || { id: 'shift_off' };
            state.schedules[key] = { shiftId: defaultOffShift.id, otHours: 0 };
            newlyAssignedCount++;
          }
        }
      });

      // 2. 依班別需求排定上班（隨機打散順序，以隨機非固定順序選拔合格員工）
      const dailyWorkShifts = shuffleArray([...workShifts]);
      dailyWorkShifts.forEach(shift => {
        let totalTarget = isWeekend
          ? (state.rules.holidayShiftMin && typeof state.rules.holidayShiftMin[shift.id] === 'number' ? state.rules.holidayShiftMin[shift.id] : (shift.targetStaff || 1))
          : (state.rules.weekdayShiftMin && typeof state.rules.weekdayShiftMin[shift.id] === 'number' ? state.rules.weekdayShiftMin[shift.id] : (shift.targetStaff || 1));

        if (state.customShiftRequirements) {
          const customReq = state.customShiftRequirements.find(r => r.date === dateIso && r.shiftId === shift.id);
          if (customReq && typeof customReq.count === 'number') {
            totalTarget = customReq.count;
          }
        }

        // 計算當日該班別「既有已排定」之人數
        let alreadyAssignedForShift = 0;
        state.staff.forEach(staff => {
          const entry = getScheduleEntry(staff.id, dateIso);
          if (entry && entry.shiftId === shift.id) {
            alreadyAssignedForShift++;
          }
        });

        const needed = Math.max(0, totalTarget - alreadyAssignedForShift);
        if (needed <= 0) return;

        // 候選人篩選：嚴格確保不覆蓋已有班別，並依照所有排班除錯規則
        const filterCandidate = (staff, strictHours = true) => {
          const key = `${staff.id}_${dateIso}`;
          const entry = getScheduleEntry(staff.id, dateIso);
          if (entry && entry.shiftId) return false; // 已有排班絕對不覆蓋！
          if (workingToday.has(staff.id)) return false;

          // 1. 排班規則：連續出勤上限 (雙向檢核)
          if (wouldExceedConsecutive(staff.id, dayIndex)) return false;

          // 2. 排班規則：單日最高工時上限
          if (shift.hours > maxDailyHours) return false;

          // 3. 排班規則：個人週期工時上限 / 總體上限
          const staffPeriodMax = (typeof staff.periodMaxHours === 'number' && staff.periodMaxHours > 0) ? staff.periodMaxHours : periodMaxHours;
          if (strictHours && (staffHoursMap[staff.id] + shift.hours > staffPeriodMax)) return false;

          // 4. 排班規則：職位限制 (限制該職稱不得排此班別)
          const restricted = state.roleRestrictions.some(r => r.role === staff.role && r.shiftId === shift.id);
          if (restricted) return false;

          // 4.1 排班規則：個人班別限制 (特定人員不能上特定班別)
          const staffRestricted = (state.staffRestrictions || []).some(r => r.staffId === staff.id && r.shiftId === shift.id);
          if (staffRestricted) return false;

          // 5. 排班規則：搭檔互斥衝突
          const conflict = state.antiPairs.some(pair => {
            if (pair[0] === staff.id && workingToday.has(pair[1])) return true;
            if (pair[1] === staff.id && workingToday.has(pair[0])) return true;
            return false;
          });
          if (conflict) return false;

          return true;
        };

        let candidates = state.staff.filter(s => filterCandidate(s, true));
        // 若嚴格工時限制下人數不足，在符合連勤與互斥規則下適度放寬工時限制
        if (candidates.length < needed) {
          candidates = state.staff.filter(s => filterCandidate(s, false));
        }

        // 每次填入皆以隨機打散方式選取，同級工時與班數不依名冊順序
        shuffleArray(candidates);
        const isFairnessShift = state.shiftFairness ? state.shiftFairness.includes(shift.id) : true;
        candidates.sort((a, b) => {
          if (isFairnessShift) {
            const countA = shiftCountMap[a.id][shift.id] || 0;
            const countB = shiftCountMap[b.id][shift.id] || 0;
            if (countA !== countB) return countA - countB;
          }
          // 工時相近（以4小時為彈性區間）的人員隨機排序，打破名冊順序
          const tierA = Math.floor((staffHoursMap[a.id] || 0) / 4);
          const tierB = Math.floor((staffHoursMap[b.id] || 0) / 4);
          if (tierA !== tierB) return tierA - tierB;
          return Math.random() - 0.5;
        });

        for (let i = 0; i < needed && i < candidates.length; i++) {
          const chosen = candidates[i];
          state.schedules[`${chosen.id}_${dateIso}`] = { shiftId: shift.id, otHours: 0 };
          workingToday.add(chosen.id);
          shiftCountMap[chosen.id][shift.id] = (shiftCountMap[chosen.id][shift.id] || 0) + 1;
          staffHoursMap[chosen.id] = (staffHoursMap[chosen.id] || 0) + (shift.hours || 0);
          newlyAssignedCount++;
        }
      });

      // 2.1 平日/假日最低上班人數要求 (Headcount Rules)
      const headcountRules = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
      let requiredMin = isWeekend ? (headcountRules.weekendMin ?? 2) : (headcountRules.weekdayMin ?? 3);
      if (headcountRules.customDates) {
        const customMatch = headcountRules.customDates.find(c => c.date === dateIso);
        if (customMatch && typeof customMatch.min === 'number') {
          requiredMin = customMatch.min;
        }
      }

      if (workingToday.size < requiredMin) {
        const remainingStaff = state.staff.filter(staff => {
          const key = `${staff.id}_${dateIso}`;
          const entry = getScheduleEntry(staff.id, dateIso);
          if (entry && entry.shiftId) return false; // 已有排班不覆蓋
          if (workingToday.has(staff.id)) return false;
          if (wouldExceedConsecutive(staff.id, dayIndex)) return false;
          return true;
        });

        shuffleArray(remainingStaff);
        remainingStaff.sort((a, b) => {
          const tierA = Math.floor((staffHoursMap[a.id] || 0) / 4);
          const tierB = Math.floor((staffHoursMap[b.id] || 0) / 4);
          if (tierA !== tierB) return tierA - tierB;
          return Math.random() - 0.5;
        });

        for (const candidate of remainingStaff) {
          if (workingToday.size >= requiredMin) break;

          const availableShifts = shuffleArray([...workShifts]);
          const availableShift = availableShifts.find(shift => {
            const restricted = state.roleRestrictions.some(r => r.role === candidate.role && r.shiftId === shift.id);
            if (restricted) return false;
            const staffRestricted = (state.staffRestrictions || []).some(r => r.staffId === candidate.id && r.shiftId === shift.id);
            if (staffRestricted) return false;
            const conflict = state.antiPairs.some(pair => {
              if (pair[0] === candidate.id && workingToday.has(pair[1])) return true;
              if (pair[1] === candidate.id && workingToday.has(pair[0])) return true;
              return false;
            });
            if (conflict) return false;
            return true;
          });

          if (availableShift) {
            state.schedules[`${candidate.id}_${dateIso}`] = { shiftId: availableShift.id, otHours: 0 };
            workingToday.add(candidate.id);
            shiftCountMap[candidate.id][availableShift.id] = (shiftCountMap[candidate.id][availableShift.id] || 0) + 1;
            staffHoursMap[candidate.id] = (staffHoursMap[candidate.id] || 0) + (availableShift.hours || 0);
            newlyAssignedCount++;
          }
        }
      }

      // 3. 當日「仍完全無排班（空白）」之同仁，指派預設休假 (絕不覆蓋任何既有已排定班別)
      const staffForRemainingOff = shuffleArray([...state.staff]);
      staffForRemainingOff.forEach(staff => {
        const key = `${staff.id}_${dateIso}`;
        const entry = getScheduleEntry(staff.id, dateIso);
        if (!entry || !entry.shiftId) {
          const defaultOffShift = state.shifts.find(s => s.id === 'shift_off') || state.shifts.find(s => s.isLeave) || { id: 'shift_off' };
          state.schedules[key] = { shiftId: defaultOffShift.id, otHours: 0 };
          newlyAssignedCount++;
        }
      });
    });

    saveState();
    renderAll();
    const violationsAfter = getAllViolations();
    if (violationsAfter.length === 0) {
      showToast(`✨ 智慧自動排班完成！已填補 ${newlyAssignedCount} 格未排班天數，既有排定班別完整保留，且零異常完全合規！`, 'success');
    } else {
      showToast(`✨ 智慧自動排班完成！已填補 ${newlyAssignedCount} 格未排班天數，既有班別完整保留（目前檢測到 ${violationsAfter.length} 項需微調）。`, 'info');
    }
  }

  // ==========================================================================
  // Staff Modal Management
  // ==========================================================================
  function renderStaffModalList() {
    const listEl = document.getElementById('staff-entity-list');
    const badgeEl = document.getElementById('staff-count-badge');
    if (badgeEl) badgeEl.textContent = state.staff.length;
    if (!listEl) return;

    listEl.innerHTML = '';
    state.staff.forEach(staff => {
      const item = document.createElement('div');
      item.className = 'entity-item';

      const offMap = { 'none': '無偏好', '0': '週日', '1': '週一', '2': '週二', '3': '週三', '4': '週四', '5': '週五', '6': '週六' };
      const offText = offMap[staff.offPref] || '無偏好';

      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <div class="staff-avatar" style="background:${staff.color};width:34px;height:34px;font-size:0.85rem;">
            ${staff.name.slice(0, 1)}
          </div>
          <div>
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);">
              ${escapeHtml(staff.name)}
              <span class="staff-role-badge">${escapeHtml(staff.role)}</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);">
              時薪 NT$${staff.wage} ・ 偏好休 ${offText}
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.35rem;">
          <button class="btn btn-icon-only btn-edit-staff" data-id="${staff.id}" title="編輯員工資料" style="color:var(--accent-primary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button class="btn btn-icon-only btn-delete-staff" data-id="${staff.id}" title="移除員工" style="color:var(--accent-danger);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      item.querySelector('.btn-edit-staff').addEventListener('click', () => {
        startEditStaff(staff);
      });

      item.querySelector('.btn-delete-staff').addEventListener('click', () => {
        if (confirm(`確定要移除「${staff.name}」嗎？這將一併清除該同仁的排班紀錄。`)) {
          state.staff = state.staff.filter(s => s.id !== staff.id);
          state.antiPairs = state.antiPairs.filter(pair => pair[0] !== staff.id && pair[1] !== staff.id);
          state.staffRestrictions = (state.staffRestrictions || []).filter(sr => sr.staffId !== staff.id);
          Object.keys(state.schedules).forEach(k => {
            if (k.startsWith(`${staff.id}_`)) delete state.schedules[k];
          });
          saveState();
          renderAll();
          renderStaffModalList();
          showToast(`已移除員工：${staff.name}`, 'warning');
        }
      });

      listEl.appendChild(item);
    });
  }

  function startEditStaff(staff) {
    const editIdEl = document.getElementById('staff-edit-id');
    const nameEl = document.getElementById('staff-name');
    const roleEl = document.getElementById('staff-role');
    const wageEl = document.getElementById('staff-wage');
    const maxHoursEl = document.getElementById('staff-max-hours');
    const colorEl = document.getElementById('staff-color');
    const offPrefEl = document.getElementById('staff-off-pref');
    const titleEl = document.getElementById('staff-form-title');
    const btnSave = document.getElementById('btn-save-staff');
    const btnCancel = document.getElementById('btn-cancel-edit-staff');

    if (editIdEl) editIdEl.value = staff.id;
    if (nameEl) nameEl.value = staff.name;
    if (roleEl) roleEl.value = staff.role;
    if (wageEl) wageEl.value = staff.wage;
    if (maxHoursEl) maxHoursEl.value = typeof staff.periodMaxHours === 'number' ? staff.periodMaxHours : (staff.maxHours * 4 || 160);
    if (colorEl) colorEl.value = staff.color;
    if (offPrefEl) offPrefEl.value = staff.offPref;

    if (titleEl) titleEl.textContent = `✏️ 編輯員工：${staff.name}`;
    if (btnSave) btnSave.textContent = '💾 儲存修改';
    if (btnCancel) btnCancel.style.display = 'inline-block';

    if (nameEl) nameEl.focus();
  }

  function cancelEditStaff() {
    const editIdEl = document.getElementById('staff-edit-id');
    const nameEl = document.getElementById('staff-name');
    const wageEl = document.getElementById('staff-wage');
    const maxHoursEl = document.getElementById('staff-max-hours');
    const titleEl = document.getElementById('staff-form-title');
    const btnSave = document.getElementById('btn-save-staff');
    const btnCancel = document.getElementById('btn-cancel-edit-staff');

    if (editIdEl) editIdEl.value = '';
    if (nameEl) nameEl.value = '';
    if (wageEl) wageEl.value = '200';
    if (maxHoursEl) maxHoursEl.value = '40';
    if (titleEl) titleEl.textContent = '👤 新增員工同仁';
    if (btnSave) btnSave.textContent = '＋ 加入同仁';
    if (btnCancel) btnCancel.style.display = 'none';
  }

  function renderRolesManagementUI() {
    const listEl = document.getElementById('roles-chips-list');
    const selectEl = document.getElementById('staff-role');

    if (selectEl) {
      selectEl.innerHTML = '';
      state.roles.forEach(role => {
        const opt = document.createElement('option');
        opt.value = role;
        opt.textContent = role;
        selectEl.appendChild(opt);
      });
    }

    if (listEl) {
      listEl.innerHTML = '';
      state.roles.forEach(role => {
        const chip = document.createElement('div');
        chip.className = 'role-chip';
        chip.innerHTML = `
          <span>${escapeHtml(role)}</span>
          ${DEFAULT_ROLES.includes(role) ? '' : `<button type="button" class="btn-del-role" data-role="${escapeHtml(role)}">&times;</button>`}
        `;

        const delBtn = chip.querySelector('.btn-del-role');
        if (delBtn) {
          delBtn.addEventListener('click', () => {
            state.roles = state.roles.filter(r => r !== role);
            saveState();
            renderRolesManagementUI();
            showToast(`已刪除職能角色：${role}`, 'info');
          });
        }

        listEl.appendChild(chip);
      });
    }
  }

  function addCustomRole(newRoleName) {
    const trimmed = (newRoleName || '').trim();
    if (!trimmed) return;
    if (state.roles.includes(trimmed)) {
      showToast('此角色名稱已存在！', 'warning');
      return;
    }
    state.roles.push(trimmed);
    saveState();
    renderRolesManagementUI();
    showToast(`已成功新增角色：${trimmed}`, 'success');
  }

  // ==========================================================================
  // Shifts Modal Management (Simplified: Name, Code, EnCode, Color, Leave Flag)
  // ==========================================================================
  function renderShiftsModalList() {
    const listEl = document.getElementById('shifts-entity-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    state.shifts.forEach(shift => {
      const item = document.createElement('div');
      item.className = 'entity-item';

      const leaveTag = shift.isLeave ? '<span style="font-size:0.7rem;background:rgba(245,158,11,0.2);color:#f59e0b;padding:1px 5px;border-radius:4px;margin-left:4px;">假別</span>' : '';
      const bgDisplay = shift.bgTransparent ? '透明' : shift.color;

      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.6rem;flex:1;min-width:0;">
          <div style="width:16px;height:16px;border-radius:4px;background:${shift.bgTransparent ? 'transparent' : shift.color};box-shadow:${shift.bgTransparent ? 'none' : '0 0 4px ' + shift.color + '80'};border:1px solid ${shift.color};flex-shrink:0;"></div>
          <div style="min-width:0;flex:1;word-break:break-word;">
            <div style="font-weight:700;font-size:0.88rem;color:var(--text-primary);display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
              <span>${escapeHtml(shift.name)}</span>
              <span style="color:${shift.textColor || '#fff'};background:${shift.bgTransparent ? 'transparent' : shift.color};padding:0 4px;border-radius:3px;">[${shift.code}]</span>
              <span style="font-size:0.75rem;color:var(--text-secondary);">EN:[${shift.enCode || shift.code}]</span>
              ${leaveTag}
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);word-break:break-word;margin-top:2px;">
              ${shift.start} ~ ${shift.end} ・ 計薪 ${shift.hours}h ・ 目標 ${shift.targetStaff} 人 ・ 字體: <span style="color:${shift.textColor || '#fff'};">■</span>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:4px;align-items:center;flex-shrink:0;margin-left:0.35rem;">
          <button class="btn btn-icon-only btn-edit-shift" data-id="${shift.id}" title="編輯班別" style="color:var(--accent-primary);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn btn-icon-only btn-delete-shift" data-id="${shift.id}" title="移除班別" style="color:var(--accent-danger);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;

      // Edit button: load shift into form
      const editBtn = item.querySelector('.btn-edit-shift');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          const nameEl = document.getElementById('shift-name');
          const codeEl = document.getElementById('shift-code');
          const enCodeEl = document.getElementById('shift-en-code');
          const textColorEl = document.getElementById('shift-text-color');
          const colorEl = document.getElementById('shift-color');
          const bgTransEl = document.getElementById('shift-bg-transparent');
          const startEl = document.getElementById('shift-start');
          const endEl = document.getElementById('shift-end');
          const hoursEl = document.getElementById('shift-hours');
          const targetEl = document.getElementById('shift-target-staff');
          const isLeaveEl = document.getElementById('shift-is-leave');
          const saveBtn = document.getElementById('btn-save-shift');

          if (nameEl) { nameEl.value = shift.name; nameEl.disabled = false; }
          if (codeEl) { codeEl.value = shift.code; codeEl.disabled = false; }
          if (enCodeEl) { enCodeEl.value = shift.enCode || shift.code; enCodeEl.disabled = false; }
          if (textColorEl) textColorEl.value = shift.textColor || '#ffffff';
          if (colorEl) colorEl.value = shift.color;
          if (bgTransEl) bgTransEl.checked = !!shift.bgTransparent;
          if (startEl) { startEl.value = shift.start === '-' ? '00:00' : shift.start; startEl.disabled = false; }
          if (endEl) { endEl.value = shift.end === '-' ? '00:00' : shift.end; endEl.disabled = false; }
          if (hoursEl) { hoursEl.value = shift.hours; hoursEl.disabled = false; }
          if (targetEl) { targetEl.value = shift.targetStaff; targetEl.disabled = false; }
          if (isLeaveEl) { isLeaveEl.checked = !!shift.isLeave; isLeaveEl.disabled = false; }

          const breakHoursEl = document.getElementById('shift-break-hours');
          if (breakHoursEl) {
            breakHoursEl.disabled = false;
            if (shift.breakHours !== undefined) {
              breakHoursEl.value = shift.breakHours;
            } else if (shift.start && shift.end && shift.start !== '-' && shift.end !== '-') {
              const [sh, sm] = shift.start.split(':').map(Number);
              const [eh, em] = shift.end.split(':').map(Number);
              if (!isNaN(sh) && !isNaN(eh)) {
                let min = (eh * 60 + em) - (sh * 60 + sm);
                if (min <= 0) min += 24 * 60;
                const calcBreak = Math.max(0, Math.round((min / 60 - shift.hours) * 10) / 10);
                breakHoursEl.value = calcBreak;
              } else {
                breakHoursEl.value = 1;
              }
            } else {
              breakHoursEl.value = 0;
            }
          }

          // Mark form as editing this shift
          const form = document.getElementById('form-add-shift');
          if (form) form.dataset.editId = shift.id;
          if (saveBtn) saveBtn.textContent = '更新班別';

          // Scroll form into view
          if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      // Delete button
      const delBtn = item.querySelector('.btn-delete-shift');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          if (confirm(`確定要刪除班別「${shift.name}」嗎？`)) {
            state.shifts = state.shifts.filter(s => s.id !== shift.id);
            state.shiftFairness = state.shiftFairness.filter(id => id !== shift.id);
            state.roleRestrictions = state.roleRestrictions.filter(rr => rr.shiftId !== shift.id);
            state.staffRestrictions = (state.staffRestrictions || []).filter(sr => sr.shiftId !== shift.id);
            // Clear schedules using this shift
            Object.keys(state.schedules).forEach(k => {
              if (state.schedules[k] && state.schedules[k].shiftId === shift.id) {
                delete state.schedules[k];
              }
            });
            saveState();
            renderAll();
            renderShiftsModalList();
            showToast(`已刪除班別：${shift.name}`, 'warning');
          }
        });
      }

      listEl.appendChild(item);
    });
  }

// ==========================================================================
// Fully Tailored Two-Tier EXCEL Exporter (完整支援 31 天與雙段式對齊)
// ==========================================================================
function doExportCustomExcel() {
  const year = state.periodStart.getFullYear();
  const month = state.periodStart.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 28, 29, 30, 31

  if (state.staff.length === 0) {
    showToast('名冊內無員工資料，無法匯出排班表！', 'warning');
    return;
  }

  // 讀取 Modal 裡的設定
  const langOpt = document.getElementById('excel-lang') ? document.getElementById('excel-lang').value : 'zh';
  const showColor = document.getElementById('excel-show-color') ? document.getElementById('excel-show-color').checked : false;
  const staffFormat = document.getElementById('excel-staff-format') ? document.getElementById('excel-staff-format').value : 'name-only';
  const dateFormat = document.getElementById('excel-date-format') ? document.getElementById('excel-date-format').value : 'num';
  const weekFormat = document.getElementById('excel-week-format') ? document.getElementById('excel-week-format').value : 'full';

  const titleTopInput = document.getElementById('excel-title-top') ? document.getElementById('excel-title-top').value.trim() : '';
  const titleBottomInput = document.getElementById('excel-title-bottom') ? document.getElementById('excel-title-bottom').value.trim() : '';

  const headerA2 = document.getElementById('excel-header-a2') ? document.getElementById('excel-header-a2').value : '員工 \\ 日期';
  const headerA3 = document.getElementById('excel-header-a3') ? document.getElementById('excel-header-a3').value : '星期';
  const headerA13 = document.getElementById('excel-header-a13') ? document.getElementById('excel-header-a13').value : '員工 \\ 日期';
  const headerA14 = document.getElementById('excel-header-a14') ? document.getElementById('excel-header-a14').value : '星期';

  // 輔助函式：日期格式
  function getDayLabel(d) {
    const dayNum = d.getDate();
    const m = d.getMonth() + 1;
    if (dateFormat === 'mmdd') {
      const mm = String(m).padStart(2, '0');
      const dd = String(dayNum).padStart(2, '0');
      return `${mm}${dd}`;
    } else if (dateFormat === 'slash') {
      return `${m}/${dayNum}`;
    }
    return `${dayNum}號`;
  }

  // 輔助函式：星期格式
  function getWeekLabel(d) {
    const idx = d.getDay();
    if (weekFormat === 'short') return DAY_NAMES_ZH[idx];
    if (weekFormat === 'char') return DAY_NAMES_SHORT_ZH[idx];
    return DAY_NAMES_FULL_ZH[idx];
  }

  // 輔助函式：員工名稱格式
  function getStaffLabel(staff) {
    if (staffFormat === 'name-role') {
      return `${staff.name} (${staff.role})`;
    }
    return staff.name;
  }

  const titleCss = showColor
    ? 'background-color: #312e81; color: #ffffff; font-weight: bold; font-size: 13pt; height: 36px;'
    : 'background-color: transparent; color: #000000; font-weight: bold; font-size: 13pt; height: 36px;';
  const dateCss = showColor
    ? 'background-color: #4338ca; color: #ffffff; font-weight: bold;'
    : 'background-color: transparent; color: #000000; font-weight: bold;';
  const weekCss = showColor
    ? 'background-color: #e0e7ff; color: #1e1b4b; font-weight: bold;'
    : 'background-color: transparent; color: #000000; font-weight: bold;';
  const staffColCss = showColor
    ? 'background-color: #f8fafc; font-weight: bold; text-align: left; padding-left: 10px;'
    : 'background-color: transparent; color: #000000; font-weight: bold; text-align: left; padding-left: 10px;';
  const emptyRowCss = showColor
    ? 'border: 0.5pt solid #cccccc; height: 24px; background-color: #ffffff;'
    : 'border: 0.5pt solid #cccccc; height: 24px; background-color: transparent;';
  const emptySepCss = showColor
    ? 'border: none; height: 26px; background-color: #ffffff;'
    : 'border: none; height: 26px; background-color: transparent;';

  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>${year}年${month + 1}月排班總表</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: "Microsoft JhengHei", "Noto Sans TC", Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 0.5pt solid #999999; text-align: center; vertical-align: middle; padding: 6px 4px; font-size: 11pt; }
    .title-row { ${titleCss} }
    .header-date { ${dateCss} }
    .header-week { ${weekCss} }
    .staff-name-col { ${staffColCss} }
    .weekend { color: #dc2626; font-weight: bold; }
    .shift-cell { font-size: 10pt; font-weight: 600; background-color: transparent; }
    .empty-row-cell { ${emptyRowCss} }
    .empty-separator { ${emptySepCss} }
  </style>
</head>
<body>
<table>`;

  // ========================================================================
  // 【上半月】 (1 ~ 15 號) [共 16 欄：A欄 + 15天]
  // ========================================================================
  if (titleTopInput) {
    html += `<tr><th colspan="16" class="title-row">${escapeHtml(titleTopInput)}</th></tr>`;
  } else {
    html += `<tr>`;
    for (let c = 0; c < 16; c++) html += `<td class="empty-row-cell"></td>`;
    html += `</tr>`;
  }

  // 日期列 (A2 ~ P2)
  html += `<tr><th class="header-date">${escapeHtml(headerA2)}</th>`;
  for (let day = 1; day <= 15; day++) {
    const d = new Date(year, month, day);
    html += `<th class="header-date">${getDayLabel(d)}</th>`;
  }
  html += `</tr>`;

  // 星期列 (A3 ~ P3)
  html += `<tr><th class="header-week">${escapeHtml(headerA3)}</th>`;
  for (let day = 1; day <= 15; day++) {
    const d = new Date(year, month, day);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    html += `<th class="header-week ${isWeekend ? 'weekend' : ''}">${getWeekLabel(d)}</th>`;
  }
  html += `</tr>`;

  // 上半月員工排班資料
  state.staff.forEach(staff => {
    html += `<tr><td class="staff-name-col">${escapeHtml(getStaffLabel(staff))}</td>`;
    for (let day = 1; day <= 15; day++) {
      const d = new Date(year, month, day);
      const dateIso = formatDateIso(d);
      const entry = getScheduleEntry(staff.id, dateIso);
      const shift = entry && entry.shiftId ? state.shifts.find(s => s.id === entry.shiftId) : null;

      if (shift) {
        const shiftText = langOpt === 'en'
          ? (shift.enCode || shift.code || shift.name)
          : `${shift.name} [${shift.code}]`;
        const otText = entry.otHours > 0 ? ` (+${entry.otHours}h)` : '';

        let bgStyle = showColor ? '' : 'background-color:transparent;';
        if (showColor) {
          const isOff = shift.isLeave || shift.hours === 0;
          bgStyle = isOff
            ? 'background-color:#f1f5f9;color:#64748b;'
            : `background-color:${shift.color}25;color:${shift.color};font-weight:bold;`;
        }
        html += `<td class="shift-cell" style="${bgStyle}">${escapeHtml(shiftText + otText)}</td>`;
      } else {
        html += `<td class="shift-cell" style="background-color:transparent;color:#94a3b8;">-</td>`;
      }
    }
    html += `</tr>`;
  });

  // ========================================================================
  // 【12:12 空格間隔列】
  // ========================================================================
  html += `<tr><td colspan="16" class="empty-separator"></td></tr>`;

  // ========================================================================
  // 【下半月】 (16 ~ 月底)
  // ========================================================================
  if (titleBottomInput) {
    html += `<tr><th colspan="16" class="title-row">${escapeHtml(titleBottomInput)}</th></tr>`;
  } else {
    html += `<tr>`;
    for (let c = 0; c < 16; c++) html += `<td class="empty-row-cell"></td>`;
    html += `</tr>`;
  }

  // 下半月日期列 (16 ~ 月底)
  html += `<tr><th class="header-date">${escapeHtml(headerA13)}</th>`;
  for (let day = 16; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    html += `<th class="header-date">${getDayLabel(d)}</th>`;
  }
  html += `</tr>`;

  // 下半月星期列
  html += `<tr><th class="header-week">${escapeHtml(headerA14)}</th>`;
  for (let day = 16; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    html += `<th class="header-week ${isWeekend ? 'weekend' : ''}">${getWeekLabel(d)}</th>`;
  }
  html += `</tr>`;

  // 下半月員工排班資料
  state.staff.forEach(staff => {
    html += `<tr><td class="staff-name-col">${escapeHtml(getStaffLabel(staff))}</td>`;
    for (let day = 16; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const dateIso = formatDateIso(d);
      const entry = getScheduleEntry(staff.id, dateIso);
      const shift = entry && entry.shiftId ? state.shifts.find(s => s.id === entry.shiftId) : null;

      if (shift) {
        const shiftText = langOpt === 'en'
          ? (shift.enCode || shift.code || shift.name)
          : `${shift.name} [${shift.code}]`;
        const otText = entry.otHours > 0 ? ` (+${entry.otHours}h)` : '';

        let bgStyle = showColor ? '' : 'background-color:transparent;';
        if (showColor) {
          const isOff = shift.isLeave || shift.hours === 0;
          bgStyle = isOff
            ? 'background-color:#f1f5f9;color:#64748b;'
            : `background-color:${shift.color}25;color:${shift.color};font-weight:bold;`;
        }
        html += `<td class="shift-cell" style="${bgStyle}">${escapeHtml(shiftText + otText)}</td>`;
      } else {
        html += `<td class="shift-cell" style="background-color:transparent;color:#94a3b8;">-</td>`;
      }
    }
    html += `</tr>`;
  });

  html += `</table></body></html>`;

  // 觸發前端下載檔案
  const blob = new Blob(['\uFEFF', html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `排班總表_${year}年${month + 1}月份.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (elExcelModal) elExcelModal.classList.remove('open');
  showToast(`📊 已成功匯出自訂雙段式 EXCEL 檔案 (${year}年${month + 1}月)！`, 'success');
}
  // ==========================================================================
  // Toast & Notifications
  // ==========================================================================
  function showToast(message, type = 'success') {
    if (!elToastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

    elToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // Event Listeners & Binding (Safe null-checked)
  // ==========================================================================
  function setupEventListeners() {
    // 1. Table View Language Display Toggle
    if (elBtnToggleShiftLangTable) {
      elBtnToggleShiftLangTable.addEventListener('click', toggleShiftDisplayLang);
    }

    // 2. Period Mode Change
    if (elPeriodModeSelect) {
      elPeriodModeSelect.addEventListener('change', (e) => {
        state.periodMode = e.target.value;
        saveState();

        if (state.periodMode === 'custom') {
          if (elCustomDateContainer) elCustomDateContainer.style.display = 'flex';
        } else {
          if (elCustomDateContainer) elCustomDateContainer.style.display = 'none';
          const range = calculatePeriodRange(state.periodMode, new Date());
          state.periodStart = range.start;
          state.periodEnd = range.end;
          if (elInputPeriodStart) elInputPeriodStart.value = formatDateIso(state.periodStart);
          if (elInputPeriodEnd) elInputPeriodEnd.value = formatDateIso(state.periodEnd);
          findAndSelectToday();
          renderAll();
        }
      });
    }

    // Custom Date Apply
    if (elBtnApplyCustomDates) {
      elBtnApplyCustomDates.addEventListener('click', () => {
        const sVal = elInputPeriodStart ? elInputPeriodStart.value : '';
        const eVal = elInputPeriodEnd ? elInputPeriodEnd.value : '';
        if (!sVal || !eVal) {
          showToast('請選擇開始與結束日期', 'warning');
          return;
        }
        const sDate = new Date(sVal);
        const eDate = new Date(eVal);
        if (sDate > eDate) {
          showToast('開始日期不得晚於結束日期', 'warning');
          return;
        }
        state.periodStart = sDate;
        state.periodEnd = eDate;
        findAndSelectToday();
        renderAll();
        showToast('已套用自訂排班週期！', 'success');
      });
    }

    // Prev / Next / Current Period
    const btnPrev = document.getElementById('btn-prev-period');
    const btnNext = document.getElementById('btn-next-period');
    const btnCurrent = document.getElementById('btn-current-period');

    if (btnPrev) btnPrev.addEventListener('click', () => shiftPeriod(-1));
    if (btnNext) btnNext.addEventListener('click', () => shiftPeriod(1));
    if (btnCurrent) {
      btnCurrent.addEventListener('click', () => {
        const range = calculatePeriodRange(state.periodMode, new Date());
        state.periodStart = range.start;
        state.periodEnd = range.end;
        if (elInputPeriodStart) elInputPeriodStart.value = formatDateIso(state.periodStart);
        if (elInputPeriodEnd) elInputPeriodEnd.value = formatDateIso(state.periodEnd);
        findAndSelectToday();
        renderAll();
      });
    }

    // View toggling
    const btnViewDay = document.getElementById('view-toggle-day');
    const btnViewStaff = document.getElementById('view-toggle-staff');
    const btnOpenShiftStats = document.getElementById('btn-open-shift-stats');
    const btnViewWeek = document.getElementById('view-toggle-week');

    if (btnViewDay) {
      btnViewDay.addEventListener('click', () => {
        state.currentView = 'day';
        renderActiveView();
        showToast('📱 已切換為手機單日排班卡片', 'info');
      });
    }
    if (btnViewStaff) {
      btnViewStaff.addEventListener('click', () => {
        state.currentView = 'staff';
        renderActiveView();
        showToast('👤 已切換為當期人員檢視模式', 'info');
      });
    }
    if (btnOpenShiftStats) {
      btnOpenShiftStats.addEventListener('click', () => {
        state.currentView = 'stats';
        renderActiveView();
        showToast('📊 已切換為班數出勤統計總表', 'info');
      });
    }
    if (btnViewWeek) {
      btnViewWeek.addEventListener('click', () => {
        state.currentView = 'week';
        renderActiveView();
        showToast('🖥️ 已切換為總表（微縮緊湊排版）', 'info');
      });
    }

    // Clear Period
    const btnClearWeek = document.getElementById('btn-clear-week');
    if (btnClearWeek) {
      btnClearWeek.addEventListener('click', () => {
        if (confirm('確定要清空當前週期內的所有排班嗎？（人員與班別設定將會保留）')) {
          const periodDays = getPeriodDays();
          state.staff.forEach(s => {
            periodDays.forEach(d => {
              const dateIso = formatDateIso(d);
              delete state.schedules[`${s.id}_${dateIso}`];
            });
          });
          saveState();
          renderAll();
          showToast('已清空當前週期所有排班紀錄', 'warning');
        }
      });
    }

    // Reset / Apply Template Data (人員與班別復原，當前週期班別隨機，其他週期清空)
    const btnResetDemo = document.getElementById('btn-reset-demo');
    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        if (confirm('確定要載入範本嗎？\n（將復原人員與班別設定，當前週期班別隨機排定，其他週期班別清空）')) {
          initDefaultDemoData();
          renderAll();
          showToast('✅ 人員與班別已復原，當前週期隨機排班完成！', 'success');
        }
      });
    }

    // Auto-Schedule buttons
    const btnAutoSched = document.getElementById('btn-auto-schedule');
    const mBtnAutoSched = document.getElementById('m-btn-auto-schedule');
    if (btnAutoSched) btnAutoSched.addEventListener('click', runAutoScheduler);
    // On mobile, "自動排班" opens the combined Smart Auto-Schedule + Constraint Rules modal
    if (mBtnAutoSched) mBtnAutoSched.addEventListener('click', openAutoRulesModal);

    // Quick run auto-schedule button inside modal
    const btnQuickRunAuto = document.getElementById('btn-quick-run-auto-schedule');
    if (btnQuickRunAuto) {
      btnQuickRunAuto.addEventListener('click', () => {
        if (elAutoRulesModal) elAutoRulesModal.classList.remove('open');
        runAutoScheduler();
      });
    }

    // Auto-Schedule Rules Modal buttons
    const btnOpenAutoRules = document.getElementById('btn-open-auto-rules');
    if (btnOpenAutoRules) btnOpenAutoRules.addEventListener('click', openAutoRulesModal);

    const btnRunFromModal = document.getElementById('btn-run-auto-schedule-from-modal');
    if (btnRunFromModal) {
      btnRunFromModal.addEventListener('click', () => {
        if (elAutoRulesModal) elAutoRulesModal.classList.remove('open');
        runAutoScheduler();
      });
    }

    // Add Anti-Pair rule
    const btnAddAntiPair = document.getElementById('btn-add-antipair');
    if (btnAddAntiPair) {
      btnAddAntiPair.addEventListener('click', () => {
        const idA = document.getElementById('select-antipair-a').value;
        const idB = document.getElementById('select-antipair-b').value;
        if (!idA || !idB || idA === idB) {
          showToast('請選擇兩位不同的員工設定互斥！', 'warning');
          return;
        }
        const exists = state.antiPairs.some(p => (p[0] === idA && p[1] === idB) || (p[0] === idB && p[1] === idA));
        if (exists) {
          showToast('此互斥組合已存在！', 'warning');
          return;
        }
        state.antiPairs.push([idA, idB]);
        saveState();
        renderAutoRulesModalUI();
        showToast('已新增搭檔互斥規則！', 'success');
      });
    }

    // Add Role Restriction
    const btnAddRoleRestrict = document.getElementById('btn-add-role-restrict');
    if (btnAddRoleRestrict) {
      btnAddRoleRestrict.addEventListener('click', () => {
        const role = document.getElementById('select-role-restrict-role').value;
        const shiftId = document.getElementById('select-role-restrict-shift').value;
        if (!role || !shiftId) return;

        const exists = state.roleRestrictions.some(r => r.role === role && r.shiftId === shiftId);
        if (exists) {
          showToast('此職位班別限制已存在！', 'warning');
          return;
        }
        state.roleRestrictions.push({ role, shiftId });
        saveState();
        renderAutoRulesModalUI();
        showToast(`已新增限制：${role} 不可上此班別`, 'success');
      });
    }

    // Add Staff Restriction (特定人員不能上特定班別)
    const btnAddStaffRestrict = document.getElementById('btn-add-staff-restrict');
    if (btnAddStaffRestrict) {
      btnAddStaffRestrict.addEventListener('click', () => {
        const staffId = document.getElementById('select-staff-restrict-staff').value;
        const shiftId = document.getElementById('select-staff-restrict-shift').value;
        if (!staffId || !shiftId) return;

        state.staffRestrictions = Array.isArray(state.staffRestrictions) ? state.staffRestrictions : [];
        const exists = state.staffRestrictions.some(r => r.staffId === staffId && r.shiftId === shiftId);
        if (exists) {
          showToast('此人員班別限制已存在！', 'warning');
          return;
        }
        state.staffRestrictions.push({ staffId, shiftId });
        saveState();
        renderAutoRulesModalUI();
        const staffObj = state.staff.find(s => s.id === staffId);
        const shiftObj = state.shifts.find(s => s.id === shiftId);
        const staffName = staffObj ? staffObj.name : '人員';
        const shiftName = shiftObj ? shiftObj.name : '班別';
        showToast(`已新增限制：${staffName} 不能上「${shiftName}」`, 'success');
      });
    }

    // Add Custom Date Shift Headcount Requirement
    const btnAddCustomReq = document.getElementById('btn-add-custom-req');
    if (btnAddCustomReq) {
      btnAddCustomReq.addEventListener('click', () => {
        const date = document.getElementById('input-custom-req-date').value;
        const shiftId = document.getElementById('select-custom-req-shift').value;
        const count = parseInt(document.getElementById('input-custom-req-count').value, 10);
        if (!date || !shiftId) {
          showToast('請選擇日期與班別！', 'warning');
          return;
        }
        if (isNaN(count) || count < 0) {
          showToast('請輸入有效的人數！', 'warning');
          return;
        }
        state.customShiftRequirements = state.customShiftRequirements || [];
        const existing = state.customShiftRequirements.find(r => r.date === date && r.shiftId === shiftId);
        if (existing) {
          existing.count = count;
        } else {
          state.customShiftRequirements.push({ id: `req_${Date.now()}`, date, shiftId, count });
        }
        saveState();
        renderAutoRulesModalUI();
        const shift = state.shifts.find(s => s.id === shiftId);
        const shiftName = shift ? shift.name : '';
        showToast(`已設定 ${date} ${shiftName} 人力需求為 ${count} 人`, 'success');
      });
    }

    // KPI Card Click Handlers
    if (elCardHours) elCardHours.addEventListener('click', openHoursModal);
    if (elCardLeaves) elCardLeaves.addEventListener('click', openLeavesModal);
    if (elCardCost) elCardCost.addEventListener('click', openCostModal);
    if (elCardAlert) elCardAlert.addEventListener('click', () => openRulesModal('violations'));

    const mBtnRules = document.getElementById('m-btn-rules');
    if (mBtnRules) mBtnRules.addEventListener('click', () => openRulesModal('violations'));

    // Rules Modal Tabs
    const tabViolations = document.getElementById('tab-btn-violations');
    const tabSettings = document.getElementById('tab-btn-rules-settings');
    const tabHeadcount = document.getElementById('tab-btn-headcount-rules');

    if (tabViolations) tabViolations.addEventListener('click', () => switchRulesTab('violations'));
    if (tabSettings) tabSettings.addEventListener('click', () => switchRulesTab('settings'));
    if (tabHeadcount) tabHeadcount.addEventListener('click', () => switchRulesTab('headcount'));

    // Save Rules Settings Form
    const formRulesSettings = document.getElementById('form-rules-settings');
    if (formRulesSettings) {
      formRulesSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        const maxShifts = parseInt(document.getElementById('rule-max-shifts-day').value, 10) || 1;
        const maxConsecutive = parseInt(document.getElementById('rule-max-consecutive-days').value, 10) || 6;
        const maxDailyHours = parseFloat(document.getElementById('rule-max-daily-hours').value) || 12;
        const periodMaxHours = parseFloat(document.getElementById('rule-period-max-hours').value) || 160;
        const monthlyLeaveQuota = parseInt(document.getElementById('rule-monthly-leave-quota').value, 10) || 8;

        state.rules.maxDailyShifts = maxShifts;
        state.rules.maxConsecutiveDays = maxConsecutive;
        state.rules.maxDailyHours = maxDailyHours;
        state.rules.periodMaxHours = periodMaxHours;
        state.rules.monthlyLeaveQuota = monthlyLeaveQuota;

        saveState();
        renderAll();
        switchRulesTab('violations');
        showToast('✅ 法規規則設定已成功儲存！', 'success');
      });
    }

    // Headcount Rules Save & Add Custom Date
    const btnSaveHeadcount = document.getElementById('btn-save-headcount-rules');
    if (btnSaveHeadcount) {
      btnSaveHeadcount.addEventListener('click', () => {
        const wk = parseInt(document.getElementById('rule-weekday-headcount').value, 10) || 3;
        const hol = parseInt(document.getElementById('rule-holiday-headcount').value, 10) || 2;
        state.rules.headcount = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
        state.rules.headcount.weekdayMin = wk;
        state.rules.headcount.weekendMin = hol;

        saveState();
        renderAll();
        showToast('✅ 執勤人力規則已儲存！', 'success');
      });
    }

    const btnAddCustomHeadcount = document.getElementById('btn-add-custom-headcount');
    if (btnAddCustomHeadcount) {
      btnAddCustomHeadcount.addEventListener('click', () => {
        const dateVal = document.getElementById('input-custom-headcount-date').value;
        const numVal = parseInt(document.getElementById('input-custom-headcount-num').value, 10) || 1;
        if (!dateVal) {
          showToast('請先選擇日期！', 'warning');
          return;
        }
        state.rules.headcount = state.rules.headcount || { weekdayMin: 3, weekendMin: 2, customDates: [] };
        state.rules.headcount.customDates = state.rules.headcount.customDates.filter(c => c.date !== dateVal);
        state.rules.headcount.customDates.push({ date: dateVal, min: numVal });
        saveState();
        renderHeadcountRulesUI();
        renderAll();
        showToast(`已新增 ${dateVal} 最低人力要求：${numVal} 人`, 'success');
      });
    }

    // One-Click Apply Leave Quota
    const btnApplyLeaveQuota = document.getElementById('btn-apply-leave-quota');
    if (btnApplyLeaveQuota) {
      btnApplyLeaveQuota.addEventListener('click', () => {
        const val = parseInt(document.getElementById('input-monthly-leave-quota').value, 10);
        if (isNaN(val) || val < 0) {
          showToast('請輸入有效的應休天數', 'warning');
          return;
        }
        state.staff.forEach(s => { s.leaveQuota = val; });
        saveState();
        renderLeavesModalUI();
        renderKPIDashboard();
        showToast(`已一鍵將全員本月應休天數設定為 ${val} 天！`, 'success');
      });
    }

    // Excel Export buttons (Opens options modal)
    const openExcelModal = () => {
      if (elExcelModal) {
        // A1~P1 and A12~P12 custom title fields default to blank
        elExcelModal.classList.add('open');
      }
    };

    const btnExportExcel = document.getElementById('btn-export-excel');
    const mBtnExport = document.getElementById('m-btn-export');
    if (btnExportExcel) btnExportExcel.addEventListener('click', openExcelModal);
    if (mBtnExport) mBtnExport.addEventListener('click', openExcelModal);

    const btnDoExportExcel = document.getElementById('btn-do-export-excel');
    if (btnDoExportExcel) btnDoExportExcel.addEventListener('click', doExportCustomExcel);

    // Print buttons (Desktop & Mobile)
    const btnPrint = document.getElementById('btn-print');
    const mBtnPrint = document.getElementById('m-btn-print');
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());
    if (mBtnPrint) mBtnPrint.addEventListener('click', () => window.print());

    // Staff Modal
    const openStaffModal = () => {
      if (elStaffModal) {
        elStaffModal.classList.add('open');
        renderStaffModalList();
        renderRolesManagementUI();
      }
    };
    const btnOpenStaff = document.getElementById('btn-open-staff');
    const mBtnStaff = document.getElementById('m-btn-staff');
    if (btnOpenStaff) btnOpenStaff.addEventListener('click', openStaffModal);
    if (mBtnStaff) mBtnStaff.addEventListener('click', openStaffModal);

    // Add Custom Role Button
    const btnAddRole = document.getElementById('btn-add-role');
    if (btnAddRole) {
      btnAddRole.addEventListener('click', () => {
        const input = document.getElementById('input-new-role');
        if (input) {
          addCustomRole(input.value);
          input.value = '';
        }
      });
    }

    // Shifts Modal
    const openShiftsModal = () => {
      if (elShiftsModal) {
        elShiftsModal.classList.add('open');
        renderShiftsModalList();
      }
    };
    const btnOpenShifts = document.getElementById('btn-open-shifts');
    const mBtnShifts = document.getElementById('m-btn-shifts');
    if (btnOpenShifts) btnOpenShifts.addEventListener('click', openShiftsModal);
    if (mBtnShifts) mBtnShifts.addEventListener('click', openShiftsModal);

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        const target = document.getElementById(modalId);
        if (target) target.classList.remove('open');
      });
    });

    [elStaffModal, elShiftsModal, elRulesModal, elAutoRulesModal, elHoursModal, elCostModal, elLeavesModal, elExcelModal, elShiftStatsModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('open');
        });
      }
    });

    // Bottom Sheet Close & Action buttons
    if (elBtnCloseBottomSheet) elBtnCloseBottomSheet.addEventListener('click', closeBottomSheet);
    if (elBottomSheetBackdrop) {
      elBottomSheetBackdrop.addEventListener('click', (e) => {
        if (e.target === elBottomSheetBackdrop) closeBottomSheet();
      });
    }

    if (elBtnSheetSetOff) {
      elBtnSheetSetOff.addEventListener('click', () => {
        if (state.activeTarget) {
          assignShift(state.activeTarget.staffId, state.activeTarget.dateStr, 'shift_off', 0);
          closeBottomSheet();
        }
      });
    }

    if (elBtnSheetClear) {
      elBtnSheetClear.addEventListener('click', () => {
        if (state.activeTarget) {
          assignShift(state.activeTarget.staffId, state.activeTarget.dateStr, null, 0);
          closeBottomSheet();
        }
      });
    }

    // Add / Edit Staff Form Submit
    const formAddStaff = document.getElementById('form-add-staff');
    if (formAddStaff) {
      formAddStaff.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('staff-edit-id') ? document.getElementById('staff-edit-id').value : '';
        const name = document.getElementById('staff-name').value.trim();
        const role = document.getElementById('staff-role').value;
        const wage = parseFloat(document.getElementById('staff-wage').value) || 200;
        const periodMaxHoursInput = parseFloat(document.getElementById('staff-max-hours').value);
        const periodMaxHours = isNaN(periodMaxHoursInput) ? null : periodMaxHoursInput;
        const color = document.getElementById('staff-color').value;
        const offPref = document.getElementById('staff-off-pref').value;

        if (!name) return;

        if (editId) {
          // 編輯現有人員
          const existing = state.staff.find(s => s.id === editId);
          if (existing) {
            existing.name = name;
            existing.role = role;
            existing.wage = wage;
            if (periodMaxHours !== null) existing.periodMaxHours = periodMaxHours;
            existing.color = color;
            existing.offPref = offPref;
            showToast(`已成功更新同仁：${name}`, 'success');
          }
          cancelEditStaff();
        } else {
          // 新增同仁
          const newStaff = { id: `staff_${Date.now()}`, name, role, wage, maxHours: 40, color, offPref, leaveQuota: null };
          if (periodMaxHours !== null) newStaff.periodMaxHours = periodMaxHours;
          state.staff.push(newStaff);
          showToast(`已成功新增同仁：${name}`, 'success');
          cancelEditStaff();
        }

        saveState();
        renderAll();
        renderStaffModalList();
      });

      const btnCancelEdit = document.getElementById('btn-cancel-edit-staff');
      if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', () => {
          cancelEditStaff();
        });
      }
    }

    // Add Shift Form Submit (簡化：留中文名稱、中文代碼、英文代碼、假別標記, 字體顏色, 透明)
    const formAddShift = document.getElementById('form-add-shift');
    if (formAddShift) {
      formAddShift.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('shift-name').value.trim();
        const code = document.getElementById('shift-code').value.trim();
        const enCode = document.getElementById('shift-en-code').value.trim() || code;
        const start = document.getElementById('shift-start').value;
        const end = document.getElementById('shift-end').value;
        const breakHours = document.getElementById('shift-break-hours') ? (parseFloat(document.getElementById('shift-break-hours').value) || 0) : 0;
        const hours = parseFloat(document.getElementById('shift-hours').value) || 0;
        const color = document.getElementById('shift-color').value;
        const textColor = document.getElementById('shift-text-color') ? document.getElementById('shift-text-color').value : '#ffffff';
        const bgTransparent = document.getElementById('shift-bg-transparent') ? document.getElementById('shift-bg-transparent').checked : false;
        const targetStaff = parseInt(document.getElementById('shift-target-staff').value, 10) || 1;
        const isLeave = document.getElementById('shift-is-leave') ? document.getElementById('shift-is-leave').checked : (hours === 0);

        if (!name || !code) return;

        const editId = formAddShift.dataset.editId;
        if (editId) {
          // Update existing shift
          const existing = state.shifts.find(s => s.id === editId);
          if (existing) {
            existing.name = name;
            existing.code = code.slice(0, 1);
            existing.enCode = enCode.slice(0, 1);
            existing.start = start;
            existing.end = end;
            existing.breakHours = breakHours;
            existing.hours = hours;
            existing.color = color;
            existing.textColor = textColor;
            existing.bgTransparent = bgTransparent;
            existing.targetStaff = targetStaff;
            existing.isLeave = isLeave;
            delete formAddShift.dataset.editId;
            const saveBtn = document.getElementById('btn-save-shift');
            if (saveBtn) saveBtn.textContent = '新增班別';
            // Re-enable disabled fields
            ['shift-name', 'shift-code', 'shift-start', 'shift-end', 'shift-break-hours', 'shift-hours', 'shift-target-staff', 'shift-is-leave'].forEach(id => {
              const el = document.getElementById(id);
              if (el) el.disabled = false;
            });
            saveState();
            renderAll();
            renderShiftsModalList();
            showToast(`已更新班別：${existing.name} [${existing.code}]`, 'success');
          }
        } else {
          const newShift = { id: `shift_${Date.now()}`, name, code: code.slice(0, 1), enCode: enCode.slice(0, 1), start, end, breakHours, hours, color, textColor, bgTransparent, targetStaff, isLeave };
          state.shifts.push(newShift);
          if (!isLeave && hours > 0) state.shiftFairness.push(newShift.id);
          saveState();
          renderAll();
          renderShiftsModalList();
          showToast(`已成功新增班別：${name} [${code}]`, 'success');
        }
        document.getElementById('shift-name').value = '';
        document.getElementById('shift-code').value = '';
        document.getElementById('shift-en-code').value = '';
        if (document.getElementById('shift-break-hours')) document.getElementById('shift-break-hours').value = '1';
      });
    }

    // Auto-calculate paid hours = (end - start) - break hours
    function autoCalcShiftHours() {
      const elStart = document.getElementById('shift-start');
      const elEnd = document.getElementById('shift-end');
      const elBreak = document.getElementById('shift-break-hours');
      const elHours = document.getElementById('shift-hours');
      const elIsLeave = document.getElementById('shift-is-leave');
      if (!elStart || !elEnd || !elHours) return;
      if (elIsLeave && elIsLeave.checked) return;

      const startVal = elStart.value;
      const endVal = elEnd.value;
      const breakVal = elBreak ? (parseFloat(elBreak.value) || 0) : 0;
      if (!startVal || !endVal) return;

      const [sh, sm] = startVal.split(':').map(Number);
      const [eh, em] = endVal.split(':').map(Number);
      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return;

      let totalMin = (eh * 60 + em) - (sh * 60 + sm);
      if (totalMin <= 0) totalMin += 24 * 60; // 跨午夜
      const totalHours = totalMin / 60;
      const paidHours = Math.max(0, Math.round((totalHours - breakVal) * 10) / 10);
      elHours.value = paidHours;
    }

    const shiftStartEl = document.getElementById('shift-start');
    const shiftEndEl = document.getElementById('shift-end');
    const shiftBreakEl = document.getElementById('shift-break-hours');
    if (shiftStartEl) {
      shiftStartEl.addEventListener('change', autoCalcShiftHours);
      shiftStartEl.addEventListener('input', autoCalcShiftHours);
    }
    if (shiftEndEl) {
      shiftEndEl.addEventListener('change', autoCalcShiftHours);
      shiftEndEl.addEventListener('input', autoCalcShiftHours);
    }
    if (shiftBreakEl) {
      shiftBreakEl.addEventListener('change', autoCalcShiftHours);
      shiftBreakEl.addEventListener('input', autoCalcShiftHours);
    }

    // Auto-sync modal-open class on body to prevent background scrolling on mobile
    const syncModalLock = () => {
      const hasOpen = document.querySelector('.modal-backdrop.open, .bottom-sheet-backdrop.open');
      if (hasOpen) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    };

    const modalObserver = new MutationObserver(syncModalLock);
    document.querySelectorAll('.modal-backdrop, .bottom-sheet-backdrop').forEach(el => {
      modalObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
      // Prevent backdrop touchmove from sliding background
      el.addEventListener('touchmove', (e) => {
        if (e.target === el) e.preventDefault();
      }, { passive: false });
    });

    // Desktop Popover Outside Click
    document.addEventListener('click', (e) => {
      if (elShiftPicker && elShiftPicker.style.display !== 'none' && !elShiftPicker.contains(e.target)) {
        closeShiftPicker();
      }
    });

    // Theme Toggle (Desktop & Mobile)
    const elThemeToggle = document.getElementById('btn-theme-toggle');
    const elThemeIcon = document.getElementById('theme-icon');
    const mBtnTheme = document.getElementById('m-btn-theme');
    const mThemeIcon = document.getElementById('m-theme-icon');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
      const iconSvg = theme === 'light'
        ? '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

      if (elThemeIcon) elThemeIcon.innerHTML = iconSvg;
      if (mThemeIcon) mThemeIcon.innerHTML = iconSvg;
    }

    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    const toggleThemeAction = () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    };

    if (elThemeToggle) elThemeToggle.addEventListener('click', toggleThemeAction);
    if (mBtnTheme) mBtnTheme.addEventListener('click', toggleThemeAction);

    // ======================================================================
    // Save Overtime from Drawer (with confirmation)
    // ======================================================================
    const btnSaveDrawerOt = document.getElementById('btn-save-drawer-ot');
    if (btnSaveDrawerOt) {
      btnSaveDrawerOt.addEventListener('click', () => {
        if (!state.activeTarget) return;
        const enteredOt = elInputOvertimeHours ? (parseFloat(elInputOvertimeHours.value) || 0) : 0;
        if (!confirm(`確認將加班時數儲存為 ${enteredOt} 小時？（將更新薪資計算與工時統計）`)) return;

        const key = `${state.activeTarget.staffId}_${state.activeTarget.dateStr}`;
        const existing = state.schedules[key];
        if (existing) {
          existing.otHours = enteredOt;
          saveState();
          renderAll();
          showToast(`已儲存加班 +${enteredOt} 小時`, 'success');
        } else {
          showToast('請先指派班別再儲存加班時數', 'warning');
        }
      });
    }

    // ======================================================================
    // Save Early Leave from Drawer (with confirmation)
    // ======================================================================
    const btnSaveDrawerEl = document.getElementById('btn-save-drawer-el');
    if (btnSaveDrawerEl) {
      btnSaveDrawerEl.addEventListener('click', () => {
        if (!state.activeTarget) return;
        const enteredEl = elInputEarlyLeaveHours ? (parseFloat(elInputEarlyLeaveHours.value) || 0) : 0;
        if (!confirm(`確認將早退時數儲存為 ${enteredEl} 小時？（將從工時與薪資中扣除）`)) return;

        const key = `${state.activeTarget.staffId}_${state.activeTarget.dateStr}`;
        const existing = state.schedules[key];
        if (existing) {
          existing.earlyLeaveHours = enteredEl;
          saveState();
          renderAll();
          showToast(`已儲存早退 -${enteredEl} 小時`, 'success');
        } else {
          showToast('請先指派班別再儲存早退時數', 'warning');
        }
      });
    }

    // ======================================================================
    // CSV / JSON Export (backup all state)
    // ======================================================================
    function doExportJson() {
      try {
        const data = {
          staff: state.staff,
          shifts: state.shifts,
          roles: state.roles,
          schedules: state.schedules,
          rules: state.rules,
          antiPairs: state.antiPairs,
          roleRestrictions: state.roleRestrictions,
          staffRestrictions: state.staffRestrictions || [],
          shiftFairness: state.shiftFairness,
          otMultiplier: state.otMultiplier,
          shiftDisplayLang: state.shiftDisplayLang,
          exportedAt: new Date().toISOString()
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `排班備份_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ 已成功匯出 JSON 備份！', 'success');
      } catch (err) {
        showToast(`❌ 匯出失敗：${err.message || '未知錯誤'}`, 'danger');
      }
    }

    const btnExportCsv = document.getElementById('btn-export-csv');
    if (btnExportCsv) btnExportCsv.addEventListener('click', doExportJson);

    // ======================================================================
    // JSON Import (restore state from backup file)
    // ======================================================================
    const btnImportCsv = document.getElementById('btn-import-csv');
    const mBtnImport = document.getElementById('m-btn-import');
    const inputImportFile = document.getElementById('input-import-file');

    function triggerImport() {
      if (!confirm('請選擇匯入 JSON 檔才能載入備份，確認繼續？')) return;
      if (inputImportFile) inputImportFile.click();
    }

    if (btnImportCsv) btnImportCsv.addEventListener('click', triggerImport);
    if (mBtnImport) mBtnImport.addEventListener('click', triggerImport);

    if (inputImportFile) {
      inputImportFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const imported = JSON.parse(ev.target.result);
            if (!imported.staff || !imported.schedules) {
              showToast('檔案格式不符合，無法匯入！', 'warning');
              return;
            }
            if (!confirm('確認要匯入備份檔案？（目前資料將被覆蓋）')) return;

            if (imported.staff) state.staff = imported.staff;
            if (imported.shifts) state.shifts = imported.shifts;
            if (imported.roles) state.roles = imported.roles;
            if (imported.schedules) state.schedules = imported.schedules;
            if (imported.rules) state.rules = imported.rules;
            if (imported.antiPairs) state.antiPairs = imported.antiPairs;
            if (imported.roleRestrictions) state.roleRestrictions = imported.roleRestrictions;
            if (imported.staffRestrictions) state.staffRestrictions = imported.staffRestrictions;
            if (imported.shiftFairness) state.shiftFairness = imported.shiftFairness;
            if (typeof imported.otMultiplier === 'number') state.otMultiplier = imported.otMultiplier;
            if (imported.shiftDisplayLang) state.shiftDisplayLang = imported.shiftDisplayLang;

            saveState();
            renderAll();
            showToast('✅ 備份檔案已成功匯入！', 'success');
          } catch (err) {
            showToast(`匯入失敗：${err.message}`, 'warning');
          }
          inputImportFile.value = '';
        };
        reader.readAsText(file);
      });
    }
  }

  // ==========================================================================
  // App Bootstrapper
  // ==========================================================================
  function init() {
    loadState();
    setupEventListeners();
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
