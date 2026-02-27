const DATA_PATHS = ["../data/homicides_normalized.json", "/data/homicides_normalized.json", "./data/homicides_normalized.json"];
const DEFAULT_LANGUAGE = "he";
const LANGUAGE_STORAGE_KEY = "homicide_dashboard_language";
const ALL_FILTER_VALUE = "ALL";
const TRAJECTORY_YEAR = 2026;
const RAW_DEFAULT_COLUMNS = [
  "canonicalDate",
  "victim_name_he",
  "age",
  "gender",
  "citizen_status",
  "residence_locality",
  "geographic_area",
  "district_state",
  "weapon_type",
  "solved_status",
  "record_group",
  "included_in_main_tally",
  "sources"
];

const LANGUAGE_META = {
  he: { locale: "he-IL", dir: "rtl" },
  ar: { locale: "ar", dir: "rtl" },
  en: { locale: "en-US", dir: "ltr" }
};

const AREA_MAP_DEFINITIONS = {
  north_galilee: { lat: 32.95, lon: 35.32 },
  haifa_coast: { lat: 32.71, lon: 34.98 },
  triangle: { lat: 32.46, lon: 35.01 },
  center: { lat: 32.04, lon: 34.87 },
  tel_aviv: { lat: 32.08, lon: 34.78 },
  jerusalem: { lat: 31.78, lon: 35.22 },
  south_negev: { lat: 31.25, lon: 34.79 },
  mixed_cities: { lat: 32.06, lon: 34.83 },
  west_bank: { lat: 31.93, lon: 35.24 }
};

const I18N = {
  he: {
    meta: { title: "לוח מעקב קורבנות רצח בחברה הערבית בישראל" },
    language: { label: "שפה", selectorAria: "בחירת שפה" },
    views: {
      dashboard: "דשבורד",
      rawData: "נתונים גולמיים"
    },
    brand: { logoAlt: "לוגו יוזמות אברהם" },
    hero: {
      title: "לוח מעקב קורבנות רצח בחברה הערבית בישראל",
      downloadNormalized: "הורדת CSV מנורמל",
      downloadSummary: "הורדת סיכום שנתי"
    },
    filters: {
      title: "סינון",
      year: "שנה",
      area: "אזור גיאוגרפי",
      district: "מחוז (מדינה)",
      gender: "מגדר",
      citizenship: "אזרחות",
      weapon: "סוג כלי הרג",
      status: "סטטוס פענוח",
      search: "חיפוש לפי שם/יישוב",
      searchPlaceholder: "הקלדה לחיפוש",
      mainOnly: "הצגת ספירה ראשית בלבד (ללא קטגוריות משלימות כמו שוטרים/מאבטחים)",
      reset: "איפוס סינון",
      allOption: "הכול"
    },
    charts: {
      victimsByYear: "קורבנות לפי שנה",
      genderByYear: "מגדר לפי שנה",
      weaponDistribution: "התפלגות סוג כלי הרג",
      topDistricts: "מחוזות מובילים",
      geoMap: "מפה גיאוגרפית",
      topLocalities: "יישובים מובילים",
      monthlyTrend: "מגמה חודשית (לפי הסינון הנוכחי)",
      actualSeries: "נתונים בפועל",
      projectionSeries: "תחזית 2026 לפי קצב נוכחי",
      projectionAsOf: "מעודכן עד"
    },
    table: {
      title: "רשומות מסוננות",
      note: "מוצגות עד 200 רשומות עדכניות לפי הסינון הנוכחי.",
      date: "תאריך",
      victim: "קורבן",
      age: "גיל",
      gender: "מגדר",
      locality: "יישוב",
      area: "אזור",
      weapon: "כלי הרג",
      status: "סטטוס",
      sources: "מקורות",
      link1: "קישור",
      link2: "קישור"
    },
    raw: {
      title: "נתונים גולמיים לפי שנה",
      year: "שנה",
      showAllColumns: "הצגת כל העמודות",
      rowsCount: "{count} רשומות",
      yes: "כן",
      no: "לא",
      columns: {
        canonicalDate: "תאריך",
        victim_name_he: "קורבן",
        age: "גיל",
        gender: "מגדר",
        citizen_status: "אזרחות",
        residence_locality: "יישוב",
        geographic_area: "אזור",
        district_state: "מחוז",
        weapon_type: "כלי הרג",
        solved_status: "סטטוס",
        record_group: "קבוצת רשומה",
        included_in_main_tally: "בספירה ראשית",
        sources: "מקורות"
      }
    },
    methodology: {
      title: "הערות מתודולוגיה",
      item1: "הנתונים מנורמלים מקבצים שנתיים בעלי סכמות שונות.",
      item2: "תאריכים מומרים לפורמט ISO (`YYYY-MM-DD`) כשאפשר.",
      item3: "שורות משלימות נשמרות אך מסומנות במפורש.",
      item4: "השוואה בין שנים דורשת זהירות, כי כללי הסיווג במקורות משתנים.",
      item5: "בגרף השנתי מוצגת גם תחזית 2026 לפי קצב נוכחי עד לתאריך העדכון האחרון ב-2026.",
      item6: "המפה מציגה פיזור לפי מרכזי אזור/מחוז משוערים, ולא מיקום אירוע מדויק."
    },
    kpi: {
      total: "קורבנות (מסונן)",
      firearm: "מקרים עם ירי",
      women: "קורבנות נשים",
      age30: "עד גיל 30",
      solved: "פוענח/כתב אישום"
    },
    axis: {
      year: "שנה",
      victims: "מספר קורבנות",
      month: "חודש",
      mapNoData: "אין מספיק נתונים גיאוגרפיים לתצוגת מפה"
    },
    errors: {
      loadingTitle: "שגיאה בטעינת נתונים",
      loadingBody: "טעינת הקובץ המנורמל נכשלה. יש להריץ scripts/normalize_data.rb ולשרת את הפרויקט דרך HTTP."
    },
    enum: {
      gender: { Male: "גבר", Female: "אישה", Unknown: "לא ידוע" },
      citizen_status: { Citizen: "אזרח/ית", "Non-citizen": "לא אזרח/ית", Unknown: "לא ידוע" },
      weapon_type: {
        Firearm: "ירי",
        "Sharp Object": "כלי חד",
        Vehicle: "רכב",
        Strangulation: "חניקה",
        Explosive: "מטען נפץ",
        Other: "אחר",
        Unknown: "לא ידוע"
      },
      solved_status: {
        "Solved/Indicted": "פוענח/כתב אישום",
        "Partially Solved": "פוענח חלקית",
        Unsolved: "לא פוענח",
        Unknown: "לא ידוע"
      }
    },
    areas: {
      north_galilee: "צפון וגליל",
      haifa_coast: "חיפה וחוף",
      triangle: "אזור המשולש",
      center: "מרכז",
      tel_aviv: "תל אביב",
      jerusalem: "ירושלים",
      south_negev: "דרום ונגב",
      mixed_cities: "ערים מעורבות",
      west_bank: "הרשות הפלסטינית"
    }
  },
  ar: {
    meta: { title: "لوحة تتبع ضحايا القتل في المجتمع العربي في إسرائيل" },
    language: { label: "اللغة", selectorAria: "اختيار اللغة" },
    views: {
      dashboard: "لوحة المؤشرات",
      rawData: "البيانات الخام"
    },
    brand: { logoAlt: "شعار مبادرات إبراهيم" },
    hero: {
      title: "لوحة تتبع ضحايا القتل في المجتمع العربي في إسرائيل",
      downloadNormalized: "تنزيل CSV الموحّد",
      downloadSummary: "تنزيل الملخص السنوي"
    },
    filters: {
      title: "التصفية",
      year: "السنة",
      area: "المنطقة الجغرافية",
      district: "المحافظة (الدولة)",
      gender: "النوع الاجتماعي",
      citizenship: "المواطنة",
      weapon: "نوع أداة القتل",
      status: "حالة فك الجريمة",
      search: "بحث بالاسم/البلدة",
      searchPlaceholder: "اكتب للبحث",
      mainOnly: "عرض الحصيلة الرئيسية فقط (بدون الفئات التكميلية مثل الشرطة/الحراس)",
      reset: "إعادة ضبط التصفية",
      allOption: "الكل"
    },
    charts: {
      victimsByYear: "الضحايا حسب السنة",
      genderByYear: "النوع الاجتماعي حسب السنة",
      weaponDistribution: "توزيع نوع أداة القتل",
      topDistricts: "المحافظات الأعلى",
      geoMap: "الخريطة الجغرافية",
      topLocalities: "البلدات الأعلى",
      monthlyTrend: "اتجاه شهري (حسب التصفية الحالية)",
      actualSeries: "البيانات الفعلية",
      projectionSeries: "توقع 2026 وفق الوتيرة الحالية",
      projectionAsOf: "محدّث حتى"
    },
    table: {
      title: "السجلات المصفّاة",
      note: "يتم عرض حتى 200 سجل حديث حسب التصفية الحالية.",
      date: "التاريخ",
      victim: "الضحية",
      age: "العمر",
      gender: "النوع الاجتماعي",
      locality: "البلدة",
      area: "المنطقة",
      weapon: "أداة القتل",
      status: "الحالة",
      sources: "المصادر",
      link1: "رابط",
      link2: "رابط"
    },
    raw: {
      title: "البيانات الخام حسب السنة",
      year: "السنة",
      showAllColumns: "عرض كل الأعمدة",
      rowsCount: "{count} سجلات",
      yes: "نعم",
      no: "لا",
      columns: {
        canonicalDate: "التاريخ",
        victim_name_he: "الضحية",
        age: "العمر",
        gender: "النوع الاجتماعي",
        citizen_status: "المواطنة",
        residence_locality: "البلدة",
        geographic_area: "المنطقة",
        district_state: "المحافظة",
        weapon_type: "أداة القتل",
        solved_status: "الحالة",
        record_group: "مجموعة السجل",
        included_in_main_tally: "ضمن الحصيلة الرئيسية",
        sources: "المصادر"
      }
    },
    methodology: {
      title: "ملاحظات منهجية",
      item1: "تم توحيد البيانات من ملفات سنوية بهياكل مختلفة.",
      item2: "تم توحيد التواريخ إلى صيغة ISO (`YYYY-MM-DD`) كلما أمكن.",
      item3: "يتم الاحتفاظ بالصفوف التكميلية مع وسم واضح.",
      item4: "المقارنة بين السنوات تتطلب الحذر لأن قواعد التصنيف تتغير حسب المصدر.",
      item5: "يعرض المخطط السنوي أيضًا توقع 2026 وفق الوتيرة الحالية حتى آخر تاريخ متاح في 2026.",
      item6: "تعرض الخريطة توزيعًا وفق مراكز مناطق/محافظات تقديرية، وليس موقع الحادث الدقيق."
    },
    kpi: {
      total: "ضحايا (بعد التصفية)",
      firearm: "حالات إطلاق نار",
      women: "ضحايا من النساء",
      age30: "حتى عمر 30",
      solved: "تم فكها/لائحة اتهام"
    },
    axis: {
      year: "السنة",
      victims: "عدد الضحايا",
      month: "الشهر",
      mapNoData: "لا توجد بيانات جغرافية كافية لعرض الخريطة"
    },
    errors: {
      loadingTitle: "خطأ في تحميل البيانات",
      loadingBody: "فشل تحميل الملف الموحّد. شغّل scripts/normalize_data.rb وقدّم المشروع عبر HTTP."
    },
    enum: {
      gender: { Male: "ذكر", Female: "أنثى", Unknown: "غير معروف" },
      citizen_status: { Citizen: "مواطن/ة", "Non-citizen": "غير مواطن/ة", Unknown: "غير معروف" },
      weapon_type: {
        Firearm: "سلاح ناري",
        "Sharp Object": "أداة حادة",
        Vehicle: "مركبة",
        Strangulation: "خنق",
        Explosive: "متفجرات",
        Other: "أخرى",
        Unknown: "غير معروف"
      },
      solved_status: {
        "Solved/Indicted": "تم فكها/لائحة اتهام",
        "Partially Solved": "تم فكها جزئيا",
        Unsolved: "غير محلولة",
        Unknown: "غير معروف"
      }
    },
    areas: {
      north_galilee: "الشمال والجليل",
      haifa_coast: "حيفا والساحل",
      triangle: "منطقة المثلث",
      center: "الوسط",
      tel_aviv: "تل أبيب",
      jerusalem: "القدس",
      south_negev: "الجنوب والنقب",
      mixed_cities: "مدن مختلطة",
      west_bank: "السلطة الفلسطينية"
    }
  },
  en: {
    meta: { title: "Homicide Victim Tracker in Arab Society in Israel" },
    language: { label: "Language", selectorAria: "Select language" },
    views: {
      dashboard: "Dashboard",
      rawData: "Raw Data"
    },
    brand: { logoAlt: "Abraham Initiatives logo" },
    hero: {
      title: "Homicide Victim Tracker in Arab Society in Israel",
      downloadNormalized: "Download normalized CSV",
      downloadSummary: "Download year summary"
    },
    filters: {
      title: "Filters",
      year: "Year",
      area: "Geographic area",
      district: "District (state)",
      gender: "Gender",
      citizenship: "Citizenship",
      weapon: "Weapon type",
      status: "Case status",
      search: "Search by name/locality",
      searchPlaceholder: "Type to search",
      mainOnly: "Main tally only (exclude supplementary police/security categories)",
      reset: "Reset filters",
      allOption: "All"
    },
    charts: {
      victimsByYear: "Victims by year",
      genderByYear: "Gender by year",
      weaponDistribution: "Weapon type distribution",
      topDistricts: "Top districts",
      geoMap: "Geographic map",
      topLocalities: "Top localities",
      monthlyTrend: "Monthly trend (current filtered scope)",
      actualSeries: "Actual data",
      projectionSeries: "2026 projection at current pace",
      projectionAsOf: "Updated through"
    },
    table: {
      title: "Filtered records",
      note: "Showing up to 200 most recent records in the current filter.",
      date: "Date",
      victim: "Victim",
      age: "Age",
      gender: "Gender",
      locality: "Locality",
      area: "Area",
      weapon: "Weapon",
      status: "Status",
      sources: "Sources",
      link1: "Link",
      link2: "Link"
    },
    raw: {
      title: "Raw Data by Year",
      year: "Year",
      showAllColumns: "Show all columns",
      rowsCount: "{count} records",
      yes: "Yes",
      no: "No",
      columns: {
        canonicalDate: "Date",
        victim_name_he: "Victim",
        age: "Age",
        gender: "Gender",
        citizen_status: "Citizenship",
        residence_locality: "Locality",
        geographic_area: "Area",
        district_state: "District",
        weapon_type: "Weapon",
        solved_status: "Status",
        record_group: "Record group",
        included_in_main_tally: "In main tally",
        sources: "Sources"
      }
    },
    methodology: {
      title: "Methodology notes",
      item1: "Data is normalized from yearly files with different schemas.",
      item2: "Dates are standardized to ISO format (`YYYY-MM-DD`) whenever possible.",
      item3: "Supplementary rows are kept but explicitly flagged.",
      item4: "Cross-year comparisons require caution because source classification rules vary over time.",
      item5: "The yearly chart also shows a 2026 projection based on current pace through the latest available 2026 date.",
      item6: "The map shows distribution by approximate area/district centroids, not exact incident coordinates."
    },
    kpi: {
      total: "Victims (filtered)",
      firearm: "Firearm cases",
      women: "Women victims",
      age30: "Age 30 or younger",
      solved: "Solved/indicted"
    },
    axis: {
      year: "Year",
      victims: "Victims",
      month: "Month",
      mapNoData: "Not enough geographic data to render map"
    },
    errors: {
      loadingTitle: "Data loading error",
      loadingBody: "Failed to load normalized data. Run scripts/normalize_data.rb and serve the repository over HTTP."
    },
    enum: {
      gender: { Male: "Male", Female: "Female", Unknown: "Unknown" },
      citizen_status: { Citizen: "Citizen", "Non-citizen": "Non-citizen", Unknown: "Unknown" },
      weapon_type: {
        Firearm: "Firearm",
        "Sharp Object": "Sharp object",
        Vehicle: "Vehicle",
        Strangulation: "Strangulation",
        Explosive: "Explosive",
        Other: "Other",
        Unknown: "Unknown"
      },
      solved_status: {
        "Solved/Indicted": "Solved/Indicted",
        "Partially Solved": "Partially solved",
        Unsolved: "Unsolved",
        Unknown: "Unknown"
      }
    },
    areas: {
      north_galilee: "North and Galilee",
      haifa_coast: "Haifa and Coast",
      triangle: "Triangle area",
      center: "Center",
      tel_aviv: "Tel Aviv",
      jerusalem: "Jerusalem",
      south_negev: "South and Negev",
      mixed_cities: "Mixed cities",
      west_bank: "Palestinian Authority"
    }
  }
};

const state = {
  allRecords: [],
  filteredRecords: [],
  language: loadLanguage(),
  activeView: "dashboard",
  rawYear: "",
  rawShowAllColumns: false,
  rawDataColumns: []
};

const ui = {
  languageChipGroup: document.getElementById("language-chip-group"),
  languageChips: Array.from(document.querySelectorAll(".lang-chip")),
  viewTabs: Array.from(document.querySelectorAll(".view-tab")),
  dashboardView: document.getElementById("dashboard-view"),
  rawView: document.getElementById("raw-view"),
  year: document.getElementById("filter-year"),
  area: document.getElementById("filter-area"),
  district: document.getElementById("filter-district"),
  gender: document.getElementById("filter-gender"),
  citizen: document.getElementById("filter-citizen"),
  weapon: document.getElementById("filter-weapon"),
  status: document.getElementById("filter-status"),
  search: document.getElementById("filter-search"),
  mainOnly: document.getElementById("filter-main-only"),
  resetButton: document.getElementById("reset-filters"),
  kpis: document.getElementById("kpis"),
  tableBody: document.querySelector("#records-table tbody"),
  rawYearTabs: document.getElementById("raw-year-tabs"),
  rawShowAllColumns: document.getElementById("raw-show-all-columns"),
  rawYearSummary: document.getElementById("raw-year-summary"),
  rawTableHead: document.querySelector("#raw-records-table thead"),
  rawTableBody: document.querySelector("#raw-records-table tbody")
};

function loadLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && LANGUAGE_META[stored]) {
      return stored;
    }
  } catch (error) {
    // Fallback to default language.
  }
  return DEFAULT_LANGUAGE;
}

function persistLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // Ignore storage issues.
  }
}

function getLocale() {
  return LANGUAGE_META[state.language].locale;
}

function getDirection() {
  return LANGUAGE_META[state.language].dir;
}

function isRtlLanguage() {
  return getDirection() === "rtl";
}

function getNestedTranslation(obj, key) {
  return key.split(".").reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), obj);
}

function t(key) {
  const primary = getNestedTranslation(I18N[state.language], key);
  if (primary !== undefined) {
    return primary;
  }

  const fallback = getNestedTranslation(I18N[DEFAULT_LANGUAGE], key);
  if (fallback !== undefined) {
    return fallback;
  }

  return key;
}

function tFormat(key, replacements = {}) {
  const template = String(t(key));
  return template.replace(/\{(\w+)\}/g, (_, token) => (replacements[token] !== undefined ? replacements[token] : ""));
}

function translateEnum(group, value) {
  const rawValue = (value || "Unknown").toString();
  const localized = getNestedTranslation(I18N[state.language], `enum.${group}.${rawValue}`);
  if (localized !== undefined) {
    return localized;
  }

  const fallback = getNestedTranslation(I18N[DEFAULT_LANGUAGE], `enum.${group}.${rawValue}`);
  if (fallback !== undefined) {
    return fallback;
  }

  return rawValue;
}

function translateFieldValue(field, value) {
  switch (field) {
    case "gender":
      return translateEnum("gender", value);
    case "citizen_status":
      return translateEnum("citizen_status", value);
    case "weapon_type":
      return translateEnum("weapon_type", value);
    case "solved_status":
      return translateEnum("solved_status", value);
    default:
      return value;
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = getDirection();
  document.title = t("meta.title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    node.setAttribute("alt", t(node.dataset.i18nAlt));
  });
  syncLanguageChips();
  syncViewTabs();
}

function syncLanguageChips() {
  ui.languageChips.forEach((chip) => {
    const isActive = chip.dataset.lang === state.language;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
}

function syncViewTabs() {
  ui.viewTabs.forEach((tab) => {
    const isActive = tab.dataset.view === state.activeView;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function setLanguage(language, { persist = true } = {}) {
  const targetLanguage = LANGUAGE_META[language] ? language : DEFAULT_LANGUAGE;
  state.language = targetLanguage;

  if (persist) {
    persistLanguage(targetLanguage);
  }

  applyStaticTranslations();
}

function createPlotTheme() {
  const rtl = isRtlLanguage();
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "IBM Plex Sans, sans-serif", color: "#10222e", size: 12 },
    margin: { t: 20, r: rtl ? 52 : 24, b: 46, l: rtl ? 24 : 52 }
  };
}

async function fetchData() {
  for (const path of DATA_PATHS) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        continue;
      }
      const payload = await response.json();
      if (Array.isArray(payload) && payload.length > 0) {
        return payload;
      }
    } catch (error) {
      // Try next path.
    }
  }

  throw new Error(t("errors.loadingBody"));
}

function normalizeRecord(record) {
  const eventDate = record.event_date_iso || "";
  const deathDate = record.death_date_iso || "";
  const canonicalDate = deathDate || eventDate;
  const dateYear = canonicalDate ? Number(canonicalDate.slice(0, 4)) : Number(record.dataset_year);
  const monthNum = Number(record.month_num) || (canonicalDate ? Number(canonicalDate.slice(5, 7)) : null);

  return {
    ...record,
    age: Number(record.age) || null,
    monthNum,
    year: Number.isFinite(dateYear) && dateYear > 1900 ? dateYear : Number(record.dataset_year),
    canonicalDate,
    searchableText: [record.victim_name_he, record.victim_name_ar, record.residence_locality, record.incident_location]
      .join(" ")
      .toLowerCase(),
    includedInMainTally: record.included_in_main_tally === true || record.included_in_main_tally === "true"
  };
}

function sortWithLocale(values) {
  const collator = new Intl.Collator(getLocale(), { sensitivity: "base", numeric: true });
  return values.sort(collator.compare);
}

function uniqueValues(records, key) {
  const values = [...new Set(records.map((item) => (item[key] || "").toString().trim()).filter(Boolean))];
  return sortWithLocale(values);
}

function setOptions(select, values, formatter = (value) => value) {
  select.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = ALL_FILTER_VALUE;
  allOption.textContent = t("filters.allOption");
  select.appendChild(allOption);

  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = formatter(value);
    select.appendChild(option);
  });
}

function captureSelectedFilters() {
  return {
    year: ui.year.value,
    area: ui.area.value,
    district: ui.district.value,
    gender: ui.gender.value,
    citizen: ui.citizen.value,
    weapon: ui.weapon.value,
    status: ui.status.value
  };
}

function restoreSelectValue(select, value) {
  const found = Array.from(select.options).some((option) => option.value === value);
  select.value = found ? value : ALL_FILTER_VALUE;
}

function populateFilterOptions({ preserveSelection = true } = {}) {
  const previousSelection = preserveSelection ? captureSelectedFilters() : null;

  setOptions(
    ui.year,
    [...new Set(state.allRecords.map((record) => record.year))].sort((a, b) => a - b).map(String),
    (value) => formatYear(value)
  );
  setOptions(ui.area, uniqueValues(state.allRecords, "geographic_area"));
  setOptions(ui.district, uniqueValues(state.allRecords, "district_state"));
  setOptions(ui.gender, uniqueValues(state.allRecords, "gender"), (value) => translateFieldValue("gender", value));
  setOptions(ui.citizen, uniqueValues(state.allRecords, "citizen_status"), (value) => translateFieldValue("citizen_status", value));
  setOptions(ui.weapon, uniqueValues(state.allRecords, "weapon_type"), (value) => translateFieldValue("weapon_type", value));
  setOptions(ui.status, uniqueValues(state.allRecords, "solved_status"), (value) => translateFieldValue("solved_status", value));

  if (!previousSelection) {
    return;
  }

  restoreSelectValue(ui.year, previousSelection.year);
  restoreSelectValue(ui.area, previousSelection.area);
  restoreSelectValue(ui.district, previousSelection.district);
  restoreSelectValue(ui.gender, previousSelection.gender);
  restoreSelectValue(ui.citizen, previousSelection.citizen);
  restoreSelectValue(ui.weapon, previousSelection.weapon);
  restoreSelectValue(ui.status, previousSelection.status);
}

function getAvailableYearsFromDatasetYear() {
  return [...new Set(state.allRecords.map((record) => String(record.dataset_year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
}

function getRawRecordsForYear(year) {
  return state.allRecords
    .filter((record) => String(record.dataset_year) === String(year))
    .sort((a, b) => {
      const dateCompare = (b.canonicalDate || "").localeCompare(a.canonicalDate || "");
      if (dateCompare !== 0) {
        return dateCompare;
      }

      return Number(a.source_row_number || 0) - Number(b.source_row_number || 0);
    });
}

function getRawDefaultColumns() {
  return RAW_DEFAULT_COLUMNS;
}

function getAllRawColumnsFromDataHeaders() {
  if (state.rawDataColumns.length) {
    return state.rawDataColumns;
  }

  if (!state.allRecords.length) {
    return [];
  }

  const excluded = new Set(["monthNum", "year", "canonicalDate", "searchableText", "includedInMainTally"]);
  return Object.keys(state.allRecords[0]).filter((key) => !excluded.has(key));
}

function getRawColumnLabel(columnKey) {
  const translated = t(`raw.columns.${columnKey}`);
  if (translated !== `raw.columns.${columnKey}`) {
    return translated;
  }
  return columnKey;
}

function formatRawBoolean(value) {
  const normalized = String(value).toLowerCase();
  if (normalized === "true") {
    return t("raw.yes");
  }
  if (normalized === "false") {
    return t("raw.no");
  }
  return value;
}

function formatRawCellValue(columnKey, record) {
  switch (columnKey) {
    case "canonicalDate":
      return formatDate(record.canonicalDate);
    case "victim_name_he":
      return record.victim_name_he || record.victim_name_ar || "";
    case "age":
      return record.age ? formatNumber(record.age) : "";
    case "gender":
      return translateFieldValue("gender", record.gender);
    case "citizen_status":
      return translateFieldValue("citizen_status", record.citizen_status);
    case "weapon_type":
      return translateFieldValue("weapon_type", record.weapon_type);
    case "solved_status":
      return translateFieldValue("solved_status", record.solved_status);
    case "included_in_main_tally":
      return formatRawBoolean(record.included_in_main_tally);
    default:
      return record[columnKey] ?? "";
  }
}

function renderRawYearTabs() {
  if (!ui.rawYearTabs) {
    return;
  }

  const years = getAvailableYearsFromDatasetYear();
  ui.rawYearTabs.innerHTML = "";

  if (!state.rawYear && years.length) {
    state.rawYear = years[0];
  }

  years.forEach((year) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "raw-year-tab";
    button.dataset.rawYear = year;
    button.textContent = formatYear(year);
    button.classList.toggle("is-active", state.rawYear === year);
    button.setAttribute("aria-pressed", String(state.rawYear === year));
    ui.rawYearTabs.appendChild(button);
  });
}

function renderRawTable() {
  if (!ui.rawTableHead || !ui.rawTableBody || !ui.rawYearSummary) {
    return;
  }

  const records = getRawRecordsForYear(state.rawYear);
  const columns = state.rawShowAllColumns ? getAllRawColumnsFromDataHeaders() : getRawDefaultColumns();

  ui.rawYearSummary.textContent = tFormat("raw.rowsCount", { count: formatNumber(records.length) });
  ui.rawTableHead.innerHTML = "";
  ui.rawTableBody.innerHTML = "";

  const headerRow = document.createElement("tr");
  columns.forEach((columnKey) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = getRawColumnLabel(columnKey);
    headerRow.appendChild(headerCell);
  });
  ui.rawTableHead.appendChild(headerRow);

  records.forEach((record) => {
    const row = document.createElement("tr");

    columns.forEach((columnKey) => {
      if (columnKey === "sources") {
        row.appendChild(createSourceCell(record));
        return;
      }

      if (columnKey === "source_url_1") {
        row.appendChild(createSingleSourceLinkCell(record.source_url_1, t("table.link1")));
        return;
      }

      if (columnKey === "source_url_2") {
        row.appendChild(createSingleSourceLinkCell(record.source_url_2, t("table.link2")));
        return;
      }

      row.appendChild(createTextCell(formatRawCellValue(columnKey, record)));
    });

    ui.rawTableBody.appendChild(row);
  });
}

function renderActiveView() {
  const showDashboard = state.activeView === "dashboard";

  if (ui.dashboardView) {
    ui.dashboardView.classList.toggle("view-hidden", !showDashboard);
  }

  if (ui.rawView) {
    ui.rawView.classList.toggle("view-hidden", showDashboard);
  }

  syncViewTabs();
}

function setupEvents() {
  [ui.year, ui.area, ui.district, ui.gender, ui.citizen, ui.weapon, ui.status, ui.search, ui.mainOnly]
    .filter(Boolean)
    .forEach((element) => {
    const eventName = element.tagName === "INPUT" && element.type === "search" ? "input" : "change";
    element.addEventListener(eventName, applyFilters);
  });

  if (ui.resetButton) {
    ui.resetButton.addEventListener("click", () => {
      ui.year.value = ALL_FILTER_VALUE;
      ui.area.value = ALL_FILTER_VALUE;
      ui.district.value = ALL_FILTER_VALUE;
      ui.gender.value = ALL_FILTER_VALUE;
      ui.citizen.value = ALL_FILTER_VALUE;
      ui.weapon.value = ALL_FILTER_VALUE;
      ui.status.value = ALL_FILTER_VALUE;
      ui.search.value = "";
      ui.mainOnly.checked = true;
      applyFilters();
    });
  }

  ui.viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetView = tab.dataset.view;
      if (!targetView || targetView === state.activeView) {
        return;
      }

      state.activeView = targetView;
      renderActiveView();
    });
  });

  if (ui.rawYearTabs) {
    ui.rawYearTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-raw-year]");
      if (!button) {
        return;
      }

      const selectedYear = button.dataset.rawYear;
      if (!selectedYear || selectedYear === state.rawYear) {
        return;
      }

      state.rawYear = selectedYear;
      renderRawYearTabs();
      renderRawTable();
    });
  }

  if (ui.rawShowAllColumns) {
    ui.rawShowAllColumns.addEventListener("change", (event) => {
      state.rawShowAllColumns = event.target.checked;
      renderRawTable();
    });
  }

  ui.languageChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const selectedLanguage = chip.dataset.lang;
      if (!selectedLanguage || selectedLanguage === state.language) {
        return;
      }
      setLanguage(selectedLanguage);
      populateFilterOptions({ preserveSelection: true });
      applyFilters();
    });
  });
}

function matchesFilter(record, key, selectedValue) {
  if (selectedValue === ALL_FILTER_VALUE) {
    return true;
  }
  return (record[key] || "") === selectedValue;
}

function applyFilters() {
  const year = ui.year.value;
  const area = ui.area.value;
  const district = ui.district.value;
  const gender = ui.gender.value;
  const citizen = ui.citizen.value;
  const weapon = ui.weapon.value;
  const status = ui.status.value;
  const search = ui.search.value.trim().toLowerCase();
  const mainOnly = ui.mainOnly.checked;

  state.filteredRecords = state.allRecords.filter((record) => {
    if (mainOnly && !record.includedInMainTally) {
      return false;
    }

    if (year !== ALL_FILTER_VALUE && String(record.year) !== year) {
      return false;
    }

    if (!matchesFilter(record, "geographic_area", area)) {
      return false;
    }

    if (!matchesFilter(record, "district_state", district)) {
      return false;
    }

    if (!matchesFilter(record, "gender", gender)) {
      return false;
    }

    if (!matchesFilter(record, "citizen_status", citizen)) {
      return false;
    }

    if (!matchesFilter(record, "weapon_type", weapon)) {
      return false;
    }

    if (!matchesFilter(record, "solved_status", status)) {
      return false;
    }

    if (search && !record.searchableText.includes(search)) {
      return false;
    }

    return true;
  });

  render();
}

function formatNumber(value) {
  return new Intl.NumberFormat(getLocale()).format(value);
}

function formatYear(value) {
  const numericYear = Number(value);
  if (!Number.isFinite(numericYear)) {
    return String(value);
  }

  return new Intl.NumberFormat(getLocale(), {
    useGrouping: false,
    maximumFractionDigits: 0
  }).format(numericYear);
}

function formatPct(value, total) {
  const pct = total ? value / total : 0;
  return new Intl.NumberFormat(getLocale(), {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(pct);
}

function formatDate(isoDate) {
  if (!isoDate) {
    return "";
  }

  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(getLocale(), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function computeYearPaceProjection(records, targetYear = TRAJECTORY_YEAR) {
  const yearRecords = records.filter((record) => record.year === targetYear && record.canonicalDate);
  if (!yearRecords.length) {
    return null;
  }

  const sortedDates = yearRecords
    .map((record) => record.canonicalDate)
    .filter((value) => typeof value === "string" && value.startsWith(`${targetYear}-`))
    .sort();
  const latestIso = sortedDates[sortedDates.length - 1];

  if (!latestIso) {
    return null;
  }

  const latestDate = new Date(`${latestIso}T00:00:00Z`);
  if (Number.isNaN(latestDate.getTime())) {
    return null;
  }

  const startOfYearUtc = Date.UTC(targetYear, 0, 1);
  const latestUtc = Date.UTC(targetYear, latestDate.getUTCMonth(), latestDate.getUTCDate());
  const elapsedDays = Math.max(1, Math.floor((latestUtc - startOfYearUtc) / 86400000) + 1);
  const daysInYear = Math.floor((Date.UTC(targetYear + 1, 0, 1) - startOfYearUtc) / 86400000);

  const actualCount = yearRecords.length;
  const projectedCount = Math.max(actualCount, Math.round((actualCount / elapsedDays) * daysInYear));

  return {
    year: targetYear,
    actualCount,
    projectedCount,
    latestIso
  };
}

function createKpi(label, value) {
  const card = document.createElement("article");
  card.className = "kpi";

  const labelNode = document.createElement("div");
  labelNode.className = "label";
  labelNode.textContent = label;

  const valueNode = document.createElement("div");
  valueNode.className = "value";
  valueNode.textContent = value;

  card.appendChild(labelNode);
  card.appendChild(valueNode);
  return card;
}

function renderKpis(records) {
  ui.kpis.innerHTML = "";

  const total = records.length;
  const firearm = records.filter((record) => record.firearm_involved === "Yes").length;
  const women = records.filter((record) => record.gender === "Female").length;
  const age30 = records.filter((record) => record.age && record.age <= 30).length;
  const solved = records.filter((record) => ["Solved/Indicted", "Partially Solved"].includes(record.solved_status)).length;

  ui.kpis.appendChild(createKpi(t("kpi.total"), formatNumber(total)));
  ui.kpis.appendChild(createKpi(t("kpi.firearm"), `${formatNumber(firearm)} (${formatPct(firearm, total)})`));
  ui.kpis.appendChild(createKpi(t("kpi.women"), `${formatNumber(women)} (${formatPct(women, total)})`));
  ui.kpis.appendChild(createKpi(t("kpi.age30"), `${formatNumber(age30)} (${formatPct(age30, total)})`));
  ui.kpis.appendChild(createKpi(t("kpi.solved"), `${formatNumber(solved)} (${formatPct(solved, total)})`));
}

function countBy(records, field, options = {}) {
  const counts = new Map();

  records.forEach((record) => {
    const value = (record[field] || "Unknown").toString().trim() || "Unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  let entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (options.limit) {
    entries = entries.slice(0, options.limit);
  }
  return entries;
}

function normalizeAreaBucket(record) {
  const area = (record.geographic_area || "").toString();
  const district = (record.district_state || "").toString();
  const combined = `${area} ${district}`;

  if (combined.includes("משולש")) return "triangle";
  if (combined.includes("ערים מעורבות")) return "mixed_cities";
  if (combined.includes("הרשות הפלסטינית")) return "west_bank";
  if (combined.includes("ירושלים")) return "jerusalem";
  if (combined.includes("תל אביב")) return "tel_aviv";
  if (combined.includes("נגב") || combined.includes("דרום") || combined.includes("הדרום") || combined.includes("דרם")) return "south_negev";
  if (combined.includes("צפון") || combined.includes("גליל") || combined.includes("הצפון")) return "north_galilee";
  if (combined.includes("חיפה") || combined.includes("חוף")) return "haifa_coast";
  if (combined.includes("מרכז") || combined.includes("המרכז")) return "center";

  return null;
}

function renderGeoMap(records) {
  const grouped = new Map();
  records.forEach((record) => {
    const bucket = normalizeAreaBucket(record);
    if (!bucket) return;
    grouped.set(bucket, (grouped.get(bucket) || 0) + 1);
  });

  const entries = [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    Plotly.react(
      "chart-map",
      [],
      {
        ...createPlotTheme(),
        annotations: [
          {
            text: t("axis.mapNoData"),
            showarrow: false,
            x: 0.5,
            y: 0.5,
            xref: "paper",
            yref: "paper",
            font: { size: 13, color: "#42505a" }
          }
        ]
      },
      { displayModeBar: false, responsive: true }
    );
    return;
  }

  const maxCount = Math.max(...entries.map((entry) => entry[1]));
  const sizes = entries.map((entry) => Math.max(12, (entry[1] / maxCount) * 42));

  Plotly.react(
    "chart-map",
    [
      {
        type: "scattergeo",
        mode: "markers+text",
        lat: entries.map((entry) => AREA_MAP_DEFINITIONS[entry[0]].lat),
        lon: entries.map((entry) => AREA_MAP_DEFINITIONS[entry[0]].lon),
        text: entries.map((entry) => `${t(`areas.${entry[0]}`)}<br>${formatNumber(entry[1])}`),
        hovertemplate: "%{text}<extra></extra>",
        textposition: "top center",
        marker: {
          size: sizes,
          color: "#0e7c7b",
          line: { width: 1.5, color: "#ffffff" },
          opacity: 0.82
        }
      }
    ],
    {
      ...createPlotTheme(),
      margin: { t: 4, r: 4, b: 4, l: 4 },
      geo: {
        projection: { type: "mercator" },
        center: { lat: 31.9, lon: 35.0 },
        lataxis: { range: [29.4, 33.4] },
        lonaxis: { range: [34.0, 35.9] },
        showland: true,
        landcolor: "#f4ebde",
        showcountries: true,
        countrycolor: "#b9a58f",
        showcoastlines: true,
        coastlinecolor: "#b9a58f",
        bgcolor: "rgba(0,0,0,0)"
      }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderYearTrend(records) {
  const grouped = new Map();
  records.forEach((record) => {
    grouped.set(record.year, (grouped.get(record.year) || 0) + 1);
  });

  const points = [...grouped.entries()].sort((a, b) => a[0] - b[0]);
  const projection = computeYearPaceProjection(records, TRAJECTORY_YEAR);
  const traces = [
    {
      x: points.map((entry) => entry[0]),
      y: points.map((entry) => entry[1]),
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#0e7c7b", width: 3 },
      marker: { color: "#e26d5a", size: 8 },
      name: t("charts.actualSeries"),
      showlegend: Boolean(projection)
    }
  ];

  if (projection) {
    traces.push({
      x: [projection.year, projection.year],
      y: [projection.actualCount, projection.projectedCount],
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#8f5b34", width: 3, dash: "dash" },
      marker: { color: "#8f5b34", size: 7, symbol: "diamond" },
      name: t("charts.projectionSeries")
    });
  }

  const annotations = [];
  if (projection) {
    annotations.push({
      x: projection.year,
      y: projection.projectedCount,
      text: `${t("charts.projectionSeries")} (${formatNumber(projection.projectedCount)})<br>${t("charts.projectionAsOf")}: ${formatDate(projection.latestIso)}`,
      showarrow: true,
      arrowhead: 2,
      ax: getDirection() === "rtl" ? -40 : 40,
      ay: -36,
      bgcolor: "#fff7eb",
      bordercolor: "#8f5b34",
      borderwidth: 1,
      font: { size: 11, color: "#5b3a1e" }
    });
  }

  Plotly.react(
    "chart-year-trend",
    traces,
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.year"), fixedrange: true, ...(isRtlLanguage() ? { autorange: "reversed" } : {}) },
      yaxis: { title: t("axis.victims"), fixedrange: true },
      annotations,
      legend: projection ? { orientation: "h", y: 1.12, x: 0 } : undefined
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderGenderTrend(records) {
  const years = [...new Set(records.map((record) => record.year))].sort((a, b) => a - b);
  const genders = ["Male", "Female", "Unknown"].filter(
    (gender) => gender !== "Unknown" || records.some((record) => record.gender === "Unknown")
  );
  const colors = { Male: "#1d4e89", Female: "#e26d5a", Unknown: "#8a8a8a" };

  const traces = genders.map((gender) => ({
    x: years,
    y: years.map((year) => records.filter((record) => record.year === year && record.gender === gender).length),
    type: "bar",
    name: translateEnum("gender", gender),
    marker: { color: colors[gender] }
  }));

  Plotly.react(
    "chart-gender-trend",
    traces,
    {
      ...createPlotTheme(),
      barmode: "stack",
      xaxis: { title: t("axis.year"), fixedrange: true, ...(isRtlLanguage() ? { autorange: "reversed" } : {}) },
      yaxis: { title: t("axis.victims"), fixedrange: true }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderWeaponChart(records) {
  const entries = countBy(records, "weapon_type", { limit: 8 });
  Plotly.react(
    "chart-weapon",
    [
      {
        labels: entries.map((entry) => translateFieldValue("weapon_type", entry[0])),
        values: entries.map((entry) => entry[1]),
        type: "pie",
        hole: 0.45,
        marker: {
          colors: ["#0e7c7b", "#e26d5a", "#1d4e89", "#8f5b34", "#a8ad57", "#b95f89", "#7b8a9e", "#4c7b4b"]
        }
      }
    ],
    {
      ...createPlotTheme(),
      showlegend: true,
      margin: { t: 20, r: 10, b: 10, l: 10 }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderDistrictChart(records) {
  const entries = countBy(records, "district_state", { limit: 10 });
  Plotly.react(
    "chart-district",
    [
      {
        y: entries.map((entry) => entry[0]).reverse(),
        x: entries.map((entry) => entry[1]).reverse(),
        type: "bar",
        orientation: "h",
        marker: { color: "#0e7c7b" }
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.victims"), fixedrange: true },
      yaxis: { fixedrange: true, side: isRtlLanguage() ? "right" : "left" }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderLocalityChart(records) {
  const entries = countBy(records, "residence_locality", { limit: 12 });
  Plotly.react(
    "chart-locality",
    [
      {
        x: entries.map((entry) => entry[0]),
        y: entries.map((entry) => entry[1]),
        type: "bar",
        marker: { color: "#e26d5a" }
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: {
        fixedrange: true,
        tickangle: isRtlLanguage() ? 35 : -35,
        ...(isRtlLanguage() ? { autorange: "reversed" } : {})
      },
      yaxis: { title: t("axis.victims"), fixedrange: true }
    },
    { displayModeBar: false, responsive: true }
  );
}

function getMonthLabels() {
  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(Date.UTC(2024, index, 1));
    return new Intl.DateTimeFormat(getLocale(), { month: "short" }).format(monthDate);
  });
}

function renderMonthlyChart(records) {
  const monthly = Array.from({ length: 12 }, (_, idx) => [idx + 1, 0]);
  records.forEach((record) => {
    if (record.monthNum && record.monthNum >= 1 && record.monthNum <= 12) {
      monthly[record.monthNum - 1][1] += 1;
    }
  });

  Plotly.react(
    "chart-monthly",
    [
      {
        x: monthly.map((entry) => entry[0]),
        y: monthly.map((entry) => entry[1]),
        type: "scatter",
        mode: "lines+markers",
        fill: "tozeroy",
        line: { color: "#1d4e89", width: 3 },
        marker: { color: "#0e7c7b", size: 7 }
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: {
        title: t("axis.month"),
        tickmode: "array",
        tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ticktext: getMonthLabels(),
        fixedrange: true,
        ...(isRtlLanguage() ? { autorange: "reversed" } : {})
      },
      yaxis: { title: t("axis.victims"), fixedrange: true }
    },
    { displayModeBar: false, responsive: true }
  );
}

function createTextCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value || "";
  return cell;
}

function createSourceCell(record) {
  const cell = document.createElement("td");
  const links = [];

  if (record.source_url_1) {
    const link1 = document.createElement("a");
    link1.href = record.source_url_1;
    link1.target = "_blank";
    link1.rel = "noreferrer";
    link1.textContent = t("table.link1");
    links.push(link1);
  }

  if (record.source_url_2) {
    const link2 = document.createElement("a");
    link2.href = record.source_url_2;
    link2.target = "_blank";
    link2.rel = "noreferrer";
    link2.textContent = t("table.link2");
    links.push(link2);
  }

  links.forEach((link, idx) => {
    if (idx > 0) {
      cell.appendChild(document.createTextNode(" | "));
    }
    cell.appendChild(link);
  });

  return cell;
}

function createSingleSourceLinkCell(url, label) {
  const cell = document.createElement("td");

  if (!url) {
    return cell;
  }

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  cell.appendChild(link);

  return cell;
}

function renderTable(records) {
  ui.tableBody.innerHTML = "";

  const rows = [...records]
    .sort((a, b) => (b.canonicalDate || "").localeCompare(a.canonicalDate || ""))
    .slice(0, 200);

  rows.forEach((record) => {
    const row = document.createElement("tr");
    row.appendChild(createTextCell(formatDate(record.canonicalDate)));
    row.appendChild(createTextCell(record.victim_name_he || record.victim_name_ar || ""));
    row.appendChild(createTextCell(record.age ? formatNumber(record.age) : ""));
    row.appendChild(createTextCell(translateFieldValue("gender", record.gender)));
    row.appendChild(createTextCell(record.residence_locality || ""));
    row.appendChild(createTextCell(record.geographic_area || ""));
    row.appendChild(createTextCell(translateFieldValue("weapon_type", record.weapon_type)));
    row.appendChild(createTextCell(translateFieldValue("solved_status", record.solved_status)));
    row.appendChild(createSourceCell(record));
    ui.tableBody.appendChild(row);
  });
}

function render() {
  const records = state.filteredRecords;
  renderKpis(records);
  renderYearTrend(records);
  renderGenderTrend(records);
  renderWeaponChart(records);
  renderDistrictChart(records);
  renderGeoMap(records);
  renderLocalityChart(records);
  renderMonthlyChart(records);
  renderTable(records);
  renderRawYearTabs();
  renderRawTable();
  renderActiveView();
}

async function initialize() {
  setLanguage(state.language, { persist: false });

  try {
    const raw = await fetchData();
    state.rawDataColumns = raw.length ? Object.keys(raw[0]) : [];
    state.allRecords = raw.map(normalizeRecord);
    const availableYears = getAvailableYearsFromDatasetYear();
    state.rawYear = availableYears.length ? availableYears[0] : "";
    state.rawShowAllColumns = false;
    if (ui.rawShowAllColumns) {
      ui.rawShowAllColumns.checked = false;
    }
    setupEvents();
    populateFilterOptions({ preserveSelection: false });
    applyFilters();
  } catch (error) {
    document.body.innerHTML = `<main><section class="panel"><h1>${t("errors.loadingTitle")}</h1><p>${error.message}</p></section></main>`;
  }
}

initialize();
