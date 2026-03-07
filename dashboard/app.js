const DATA_PATHS = {
  records: ["../data/homicides_normalized.json", "/data/homicides_normalized.json", "./data/homicides_normalized.json"],
  localitySummary: ["../data/locality_year_summary.json", "/data/locality_year_summary.json", "./data/locality_year_summary.json"],
  analysisCountryComparison: [
    "../data/analysis_country_comparison.json",
    "/data/analysis_country_comparison.json",
    "./data/analysis_country_comparison.json"
  ]
};
const SITE_BASE_URL = "https://ekurer.github.io/arab-society-murder-tracker";
const DEFAULT_LANGUAGE = "he";
const LANGUAGE_STORAGE_KEY = "homicide_dashboard_language";
const ALL_FILTER_VALUE = "ALL";
const DEFAULT_ANALYSIS_TAB = "country-comparison";
const ANALYSIS_TABS = ["ramadan", "country-comparison"];
const TRAJECTORY_YEAR = 2026;
const MS_PER_DAY = 86400000;
const MAP_METRICS = ["victims", "share", "solved_share", "firearm_share"];
const SOLVED_STATUS_FOR_METRICS = "Solved/Indicted";
const RECENT_VICTIMS_LIMIT = 8;
const DEFAULT_MAP_CENTER = [31.85, 35.03];
const DEFAULT_MAP_ZOOM = 8;
const ISRAEL_BOUNDS = [
  [29.4, 34.0],
  [33.4, 35.95]
];
const RAMADAN_PERIODS = {
  2018: { start: "2018-05-16", end: "2018-06-14" },
  2019: { start: "2019-05-05", end: "2019-06-03" },
  2020: { start: "2020-04-24", end: "2020-05-23" },
  2021: { start: "2021-04-13", end: "2021-05-12" },
  2022: { start: "2022-04-02", end: "2022-05-01" },
  2023: { start: "2023-03-23", end: "2023-04-20" },
  2024: { start: "2024-03-11", end: "2024-04-09" },
  2025: { start: "2025-03-01", end: "2025-03-29" },
  2026: { start: "2026-02-18", end: "2026-03-19" }
};
const RAW_DEFAULT_COLUMNS = [
  "canonicalDate",
  "victim_name_he",
  "age",
  "gender",
  "locality_name_canonical",
  "weapon_type",
  "solved_status",
  "source_url_1",
  "source_url_2"
];

const LANGUAGE_META = {
  he: { locale: "he-IL", dir: "rtl", ogLocale: "he_IL" },
  ar: { locale: "ar", dir: "rtl", ogLocale: "ar_AR" },
  en: { locale: "en-US", dir: "ltr", ogLocale: "en_US" }
};

const HEBREW_TO_ARABIC_MULTI = [
  ["ג׳", "ج"],
  ["ג'", "ج"],
  ["צ׳", "تش"],
  ["צ'", "تش"],
  ["ת׳", "ث"],
  ["ת'", "ث"],
  ["ח׳", "خ"],
  ["ח'", "خ"],
  ["ד׳", "ذ"],
  ["ד'", "ذ"]
];

const HEBREW_TO_ARABIC_CHAR = {
  א: "ا",
  ב: "ب",
  ג: "ج",
  ד: "د",
  ה: "ه",
  ו: "و",
  ז: "ز",
  ח: "ح",
  ט: "ط",
  י: "ي",
  כ: "ك",
  ך: "ك",
  ל: "ل",
  מ: "م",
  ם: "م",
  נ: "ن",
  ן: "ن",
  ס: "س",
  ע: "ع",
  פ: "ف",
  ף: "ف",
  צ: "ص",
  ץ: "ص",
  ק: "ق",
  ר: "ر",
  ש: "ش",
  ת: "ت",
  "׳": "",
  "'": ""
};

const ARABIC_TO_LATIN_CHAR = {
  ا: "a",
  أ: "a",
  إ: "i",
  آ: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  ة: "a",
  ى: "a",
  ء: "",
  ئ: "y",
  ؤ: "w",
  "ّ": "",
  "ْ": "",
  "َ": "a",
  "ُ": "u",
  "ِ": "i"
};

const HEBREW_TO_LATIN_MULTI = [
  ["ג׳", "j"],
  ["ג'", "j"],
  ["צ׳", "ch"],
  ["צ'", "ch"],
  ["ת׳", "th"],
  ["ת'", "th"],
  ["ח׳", "kh"],
  ["ח'", "kh"],
  ["ד׳", "dh"],
  ["ד'", "dh"]
];

const HEBREW_TO_LATIN_CHAR = {
  א: "a",
  ב: "b",
  ג: "g",
  ד: "d",
  ה: "h",
  ו: "w",
  ז: "z",
  ח: "h",
  ט: "t",
  י: "y",
  כ: "k",
  ך: "k",
  ל: "l",
  מ: "m",
  ם: "m",
  נ: "n",
  ן: "n",
  ס: "s",
  ע: "a",
  פ: "f",
  ף: "f",
  צ: "s",
  ץ: "s",
  ק: "q",
  ר: "r",
  ש: "sh",
  ת: "t",
  "׳": "",
  "'": ""
};

const I18N = {
  he: {
    meta: {
      title: "לוח מעקב קורבנות רצח בחברה הערבית בישראל",
      description:
        "לוח מעקב אינטראקטיבי אחר קורבנות רצח בחברה הערבית בישראל, עם מפה לפי יישוב, השוואת שנים, ניתוחי רמדאן ושמות הקורבנות."
    },
    language: { selectorAria: "בחירת שפה" },
    views: {
      dashboard: "דשבורד",
      compareYears: "השוואת שנים",
      analyses: "אנליזות",
      rawData: "שמות הנרצחים"
    },
    brand: { logoAlt: "לוגו יוזמות אברהם" },
    hero: {
      eyebrow: "Town-level homicide monitor",
      title: "לוח מעקב קורבנות רצח בחברה הערבית בישראל",
      subtitle: "מפת פיזור יישובית, השוואת שנים, וצלילה לפרופיל מקומי על בסיס נתוני הקורבנות המתעדכנים."
    },
    narrative: {
      lead: "עמותת יוזמות אברהם עוקבת אחר קורבנות רצח בחברה הערבית בישראל משנת 2018 עד היום.",
      context:
        "בין השנים 2000 ל-2009 מספר הנרצחים הערבים בישראל היה נמוך ממספר הנרצחים היהודים. הפער התהפך רק סביב 2010. השינוי המרכזי אינו בזהות קולקטיבית, אלא במציאות של אכיפה, זמינות נשק ומשילות. במסך האנליזות אפשר לעבור גם להשוואה מול מדינות לא-עתירות הכנסה עם שיעורי רצח גבוהים, לצד מדינות ערביות עם נתון זמין, שבה החברה הערבית בישראל מוצגת כיחידה אנליטית אחת."
    },
    filters: {
      year: "שנה",
      allOption: "כל השנים",
      selectAria: "בחירת שנה",
      previousYear: "שנה קודמת",
      nextYear: "שנה הבאה"
    },
    dashboard: {
      mapEyebrow: "Geographic dispersion",
      mapTitle: "מפת פיזור לפי יישוב",
      mapMethodology: "הסמנים מייצגים צבירה לפי יישוב מגורים, על מרכז היישוב, ולא נקודות רצח מדויקות.",
      metricLabel: "מדד מפה",
      clearLocality: "איפוס מיקוד יישוב",
      trendEyebrow: "Evolution over time",
      monthlyEyebrow: "Current scope",
      weaponEyebrow: "Method of killing",
      genderEyebrow: "Gender profile",
      localitiesEyebrow: "Town leaderboard",
      noLocalityTitle: "בחרו יישוב מהמפה כדי לראות פרופיל מקומי",
      noLocalityBody:
        "המפה מציגה צבירה לפי יישוב מגורים. לחיצה על סמן או על יישוב בטבלה תפתח פרופיל עם התפתחות רב-שנתית, רשימת קורבנות עדכנית וקישורי מקור.",
      noLocalitySecondary: "אין כאן נקודות רצח מדויקות אלא מרכזי יישובים, כדי לשמור על דיוק מתודולוגי ולמנוע מצג שווא של מיקום.",
      scopeAllYears: "כל השנים",
      recentVictims: "קורבנות אחרונים",
      localityTrend: "התפתחות לפי שנה",
      coverageWarning: "כיסוי המפה חלקי: {count} רשומות נותרו ללא התאמת יישוב ממופה.",
      partialYear: "{year} היא שנה חלקית עד {date}.",
      mappedOnlyNote: "הגרפים מבוססים על כלל הרשומות המסוננות; המפה עצמה מציגה רק יישובים שמופו."
    },
    compare: {
      eyebrow: "Year against year",
      title: "השוואת שנים ברמת היישוב",
      yearA: "שנה א׳",
      yearB: "שנה ב׳",
      metric: "מדד",
      searchLocality: "חיפוש יישוב",
      resetLocality: "איפוס יישוב",
      mapPanelLabelA: "שנה א׳",
      mapPanelLabelB: "שנה ב׳",
      monthlyEyebrow: "Month by month",
      monthlyChartTitle: "מגמה חודשית: שנה מול שנה",
      deltaEyebrow: "Where change is sharpest",
      deltaChartTitle: "יישובים עם השינוי הבולט ביותר",
      tableEyebrow: "Sortable locality table",
      tableTitle: "טבלת השוואה יישובית",
      partialNote: "לפחות אחת מהשנים שנבחרו היא שנה חלקית. ההשוואה מציגה נתונים שנצפו עד כה בלבד.",
      totalA: "סה״כ בשנה א׳",
      totalB: "סה״כ בשנה ב׳",
      delta: "שינוי",
      deltaPct: "שינוי יחסי",
      firearmDelta: "שינוי בחלק הירי",
      solvedDelta: "שינוי בשיעור כתבי האישום",
      table: {
        locality: "יישוב",
        yearA: "שנה א׳",
        yearB: "שנה ב׳",
        delta: "שינוי",
        firearmDelta: "שינוי בחלק הירי",
        solvedDelta: "שינוי בכתבי האישום"
      }
    },
    common: {
      partialBadge: "חלקי"
    },
    charts: {
      victimsByYear: "קורבנות לפי שנה",
      genderByYear: "מגדר לפי שנה",
      weaponDistribution: "התפלגות סוג כלי הרג",
      monthlyTrend: "מגמה חודשית",
      topLocalities: "יישובים בולטים"
    },
    mapMetrics: {
      victims: "מספר קורבנות",
      share: "חלק מההיקף הנבחר",
      solved_share: "שיעור כתבי אישום",
      firearm_share: "שיעור ירי"
    },
    kpi: {
      total: "סה\"כ קורבנות",
      solvedShare: "שיעור כתבי אישום",
      firearmShare: "שיעור ירי",
      mappedLocalities: "יישובים ממופים",
      allYearsTotal: "סה\"כ כל השנים"
    },
    detail: {
      totalVictims: "קורבנות בהיקף הנבחר",
      allYearsTotal: "קורבנות בכל השנים",
      solvedShare: "שיעור כתבי אישום",
      firearmShare: "שיעור ירי",
      recentSources: "מקורות",
      moreContext: "הערות נוספות"
    },
    analyses: {
      eyebrow: "Seasonal analysis",
      title: "אנליזות ונתוני השוואה",
      subtitle:
        "מעבר בין ניתוח רמדאן לבין השוואה מול מדינות לא-עתירות הכנסה עם שיעורי רצח גבוהים, לצד מדינות ערביות עם נתון זמין ואוכלוסייה של מעל 300 אלף תושבים.",
      tabsAriaLabel: "תתי-טאבים של עמוד האנליזות",
      tabs: {
        ramadan: "רמדאן",
        countryComparison: "רצח גבוה ומדינות ערביות"
      },
      ramadan: {
        title: "אנליזות רמדאן",
        subtitle: "השוואה בין ספירה נומינלית, משקל מסך מקרי הרצח באותה שנה, וקצב רצח יומי ברמדאן מול שאר ימי השנה."
      },
      tableTitle: "טבלת השוואה שנתית",
      tableNote: "`pp` = נקודות אחוז. בשנה חלקית ההשוואה נעשית מול יתר הימים שנצפו עד כה באותה שנה.",
      noData: "אין מספיק נתונים זמינים לניתוח.",
      countryComparison: {
        title: "השוואת החברה הערבית בישראל למדינות עם שיעור רצח גבוה ולמדינות ערביות",
        subtitle:
          "השוואת שיעור הרצח ל-100 אלף נפש לפי השנה שנבחרה, מול עד 15 מדינות לא-עתירות הכנסה עם שיעורי הרצח הגבוהים ביותר במאגר World Bank באותה שנה, ובנוסף מדינות ערביות עם ערך זמין ואוכלוסייה של מעל 300 אלף.",
        disclaimer: "זוהי ישות אנליטית לצורכי השוואה בלבד, ולא מדינה ריבונית.",
        methodology:
          "שנת ההשוואה: {year}. אוכלוסיית החברה הערבית בישראל נלקחה מהלמ״ס. סט ההשוואה כולל עד 15 מדינות לא-עתירות הכנסה עם שיעורי הרצח הגבוהים ביותר מבין הערכים הזמינים במאגר World Bank/UNODC, ורק מדינות שמנו מעל 300 אלף תושבים באותה שנה. בנוסף נכללות מדינות ערביות עם ערך זמין ובאותו סף אוכלוסייה. מספר המדינות המוצגות בשנה זו: {count}.",
        provisionalMethodology:
          "שנת ההשוואה: {year}. אוכלוסיית החברה הערבית בישראל נלקחה מהלמ״ס. המדינות המוצגות מבוססות על פרסומים רשמיים לאומיים זמינים לשנת {year}, עם סף אוכלוסייה של מעל 300 אלף תושבים, ולכן זו שכבת השוואה פרוביזורית ולא סדרת World Bank האחידה. מספר המדינות המוצגות בשנה זו: {count}.",
        noCountryData:
          "לשנה {year} אין כרגע מספיק שיעורי רצח זמינים של מדינות מעל 300 אלף תושבים במאגר World Bank, ולכן מוצגים רק נתוני החברה הערבית בישראל או מצב ללא נתונים.",
        chartTitle: "שיעור רצח ל-100 אלף נפש",
        tableTitle: "טבלת השוואה למדינות עם שיעור רצח גבוה ולמדינות ערביות",
        tableNote:
          "מוצגות רק מדינות עם ערך זמין לשנת {year} ואוכלוסייה של מעל 300 אלף באותה שנה. הסט כולל עד 15 מדינות לא-עתירות הכנסה עם שיעורי הרצח הגבוהים ביותר, ובנוסף מדינות ערביות עם ערך זמין. השורה הישראלית-ערבית מבוססת על ספירת הנרצחים בטראקר ועל מכנה אוכלוסייה רשמי של הלמ״ס.",
        provisionalNote:
          "לשנת {year} המדינות המוצגות מבוססות על מקורות רשמיים לאומיים, באופן פרוביזורי ושורה-אחר-שורה, ולא על שכבת World Bank האחידה שעדיין חסרה לשנה זו.",
        sourceLink: "מקור",
        yearLabel: "שנת השוואה",
        yearTabsAriaLabel: "שנות השוואה זמינות",
        methodologyToggleAriaLabel: "הצגת מתודולוגיית ההשוואה",
        labels: {
          entity: "החברה הערבית בישראל",
          rank: "דירוג בשיעור הרצח",
          totalEntities: "מספר ישויות בהשוואה"
        },
        kpis: {
          rate: "שיעור רצח ל-100 אלף",
          victims: "נרצחים בשנת הייחוס",
          population: "אוכלוסייה רשמית",
          countries: "מדינות זמינות להשוואה",
          rank: "דירוג מול הישויות המוצגות"
        },
        table: {
          entity: "מדינה / ישות",
          year: "שנת מקור",
          rate: "שיעור ל-100 אלף",
          delta: "פער מול החברה הערבית בישראל",
          source: "מקור"
        }
      },
      kpis: {
        totalVictims: "קורבנות ברמדאן",
        avgShare: "חלק ממוצע מכלל הרציחות",
        aboveBaseline: "שנים מעל קצב יתר השנה",
        avgRatio: "יחס קצבים ממוצע"
      },
      charts: {
        nominal: "מספר מקרי רצח ברמדאן",
        share: "חלק רמדאן מכלל הרציחות באותה שנה",
        rateRatio: "קצב יומי ברמדאן מול יתר השנה",
        excess: "עודף או חסר מול קצב הימים שמחוץ לרמדאן"
      },
      table: {
        year: "שנה",
        period: "חלון רמדאן",
        victims: "מקרי רצח",
        share: "חלק מהשנה",
        ramadanRate: "קצב יומי ברמדאן",
        restRate: "קצב יומי ביתר השנה",
        ratio: "יחס קצבים",
        excess: "עודף/חסר",
        firearmDelta: "שינוי במשקל הירי",
        solvedDelta: "שינוי בשיעור כתבי האישום",
        coverage: "כיסוי"
      },
      labels: {
        complete: "שנה מלאה",
        notAvailable: "לא זמין"
      },
      units: {
        perDay: "ליום",
        pp: "pp"
      }
    },
    raw: {
      eyebrow: "Full transparency",
      title: "נתונים גולמיים לפי שנה",
      year: "שנה",
      showAllColumns: "הצגת כל העמודות",
      rowsCount: "{count} רשומות",
      yes: "כן",
      no: "לא",
      columns: {
        rowNumber: "מס׳",
        canonicalDate: "תאריך",
        victim_name_he: "שם הקורבן",
        victim_name_ar: "שם הקורבן (ערבית)",
        age: "גיל",
        gender: "מגדר",
        residence_locality: "יישוב",
        locality_key: "מפתח יישוב",
        locality_name_canonical: "יישוב",
        district_state: "מחוז",
        weapon_type: "כלי הרג",
        solved_status: "סטטוס פענוח",
        source_url_1: "קישור 1",
        source_url_2: "קישור 2"
      }
    },
    axis: {
      year: "שנה",
      month: "חודש",
      victims: "קורבנות",
      shareOfYear: "חלק מהשנה",
      rateRatio: "יחס קצבים",
      excessVictims: "עודף/חסר",
      ratePer100k: "שיעור רצח ל-100 אלף נפש"
    },
    table: {
      link1: "קישור 1",
      link2: "קישור 2"
    },
    errors: {
      loadingTitle: "שגיאה בטעינת הנתונים",
      loadingBody: "לא ניתן לטעון את קובצי הנתונים."
    },
    enum: {
      gender: { Male: "גבר", Female: "אישה", Unknown: "לא ידוע" },
      citizen_status: { Citizen: "אזרח", "Non-citizen": "לא אזרח", Unknown: "לא ידוע" },
      weapon_type: {
        Firearm: "ירי",
        "Sharp Object": "חפץ חד",
        Vehicle: "דריסה",
        Strangulation: "חניקה",
        Explosive: "מטען / פיצוץ",
        Other: "אחר",
        Unknown: "לא ידוע"
      },
      solved_status: {
        "Solved/Indicted": "פוענח / כתב אישום",
        "Partially Solved": "פענוח חלקי",
        Unsolved: "לא פוענח",
        Unknown: "לא ידוע"
      }
    }
  },
  ar: {
    meta: {
      title: "لوحة متابعة ضحايا القتل في المجتمع العربي في إسرائيل",
      description:
        "لوحة تفاعلية لمتابعة ضحايا القتل في المجتمع العربي في إسرائيل، مع خريطة حسب البلدة، مقارنة بين السنوات، تحليلات رمضان وأسماء الضحايا."
    },
    language: { selectorAria: "اختيار اللغة" },
    views: {
      dashboard: "لوحة القيادة",
      compareYears: "مقارنة السنوات",
      analyses: "تحليلات",
      rawData: "أسماء الضحايا"
    },
    brand: { logoAlt: "شعار مبادرات إبراهيم" },
    hero: {
      eyebrow: "Town-level homicide monitor",
      title: "لوحة متابعة ضحايا القتل في المجتمع العربي في إسرائيل",
      subtitle: "خريطة انتشار على مستوى البلدات، مقارنة مباشرة بين السنوات، وغوص في الملف المحلي لكل بلدة."
    },
    narrative: {
      lead: "تتابع مبادرات إبراهيم ضحايا القتل في المجتمع العربي في إسرائيل منذ عام 2018 وحتى اليوم.",
      context:
        "بين الأعوام 2000 و2009 كان عدد الضحايا العرب في إسرائيل أقل من عدد الضحايا اليهود. انقلب هذا الفارق فقط حول عام 2010. التغيير المركزي لا يتعلق بهوية جماعية، بل بواقع يرتبط بإنفاذ القانون وتوفر السلاح والحوكمة. في شاشة التحليلات يمكن أيضاً الانتقال إلى مقارنة مع دول غير مرتفعة الدخل ذات معدلات قتل مرتفعة، إلى جانب دول عربية لديها قيمة متاحة، حيث يُعرض المجتمع العربي في إسرائيل كوحدة تحليلية واحدة."
    },
    filters: {
      year: "السنة",
      allOption: "كل السنوات",
      selectAria: "اختيار السنة",
      previousYear: "السنة السابقة",
      nextYear: "السنة التالية"
    },
    dashboard: {
      mapEyebrow: "Geographic dispersion",
      mapTitle: "خريطة التوزع حسب البلدة",
      mapMethodology: "العلامات تمثل تجميعًا بحسب بلدة السكن عند مركز البلدة، وليست مواقع قتل دقيقة.",
      metricLabel: "مؤشر الخريطة",
      clearLocality: "إعادة ضبط التركيز",
      trendEyebrow: "Evolution over time",
      monthlyEyebrow: "Current scope",
      weaponEyebrow: "Method of killing",
      genderEyebrow: "Gender profile",
      localitiesEyebrow: "Town leaderboard",
      noLocalityTitle: "اختاروا بلدة من الخريطة لعرض ملفها المحلي",
      noLocalityBody: "النقر على علامة أو على بلدة في القائمة يفتح ملفًا محليًا مع تطور زمني وقائمة الضحايا وروابط المصادر.",
      noLocalitySecondary: "هذه ليست نقاط قتل دقيقة بل مراكز بلدات، للحفاظ على الدقة المنهجية وتجنب الإيحاء الخاطئ بالموقع.",
      scopeAllYears: "كل السنوات",
      recentVictims: "ضحايا أخيرون",
      localityTrend: "التطور حسب السنة",
      coverageWarning: "تغطية الخريطة جزئية: بقيت {count} سجلات بدون مطابقة لبلدة ممسوحة.",
      partialYear: "سنة {year} جزئية حتى {date}.",
      mappedOnlyNote: "الرسوم تعتمد على جميع السجلات المصفاة؛ الخريطة تعرض فقط البلدات التي تمت موضعتها."
    },
    compare: {
      eyebrow: "Year against year",
      title: "مقارنة السنوات على مستوى البلدة",
      yearA: "السنة أ",
      yearB: "السنة ب",
      metric: "المؤشر",
      searchLocality: "ابحث عن بلدة",
      resetLocality: "إعادة ضبط البلدة",
      mapPanelLabelA: "السنة أ",
      mapPanelLabelB: "السنة ب",
      monthlyEyebrow: "Month by month",
      monthlyChartTitle: "الاتجاه الشهري: سنة مقابل سنة",
      deltaEyebrow: "Where change is sharpest",
      deltaChartTitle: "البلدات ذات التغير الأبرز",
      tableEyebrow: "Sortable locality table",
      tableTitle: "جدول المقارنة المحلي",
      partialNote: "واحدة على الأقل من السنوات المختارة جزئية، والمقارنة تعرض البيانات المرصودة حتى الآن فقط.",
      totalA: "الإجمالي في السنة أ",
      totalB: "الإجمالي في السنة ب",
      delta: "التغير",
      deltaPct: "التغير النسبي",
      firearmDelta: "تغير نسبة السلاح الناري",
      solvedDelta: "تغير نسبة لوائح الاتهام",
      table: {
        locality: "البلدة",
        yearA: "السنة أ",
        yearB: "السنة ب",
        delta: "التغير",
        firearmDelta: "تغير السلاح الناري",
        solvedDelta: "تغير لوائح الاتهام"
      }
    },
    common: {
      partialBadge: "جزئي"
    },
    charts: {
      victimsByYear: "الضحايا حسب السنة",
      genderByYear: "النوع الاجتماعي حسب السنة",
      weaponDistribution: "توزيع وسيلة القتل",
      monthlyTrend: "اتجاه شهري",
      topLocalities: "بلدات بارزة"
    },
    mapMetrics: {
      victims: "عدد الضحايا",
      share: "الحصة من النطاق المختار",
      solved_share: "نسبة لوائح الاتهام",
      firearm_share: "نسبة السلاح الناري"
    },
    kpi: {
      total: "إجمالي الضحايا",
      solvedShare: "نسبة لوائح الاتهام",
      firearmShare: "نسبة السلاح الناري",
      mappedLocalities: "بلدات ممسوحة",
      allYearsTotal: "إجمالي كل السنوات"
    },
    detail: {
      totalVictims: "ضحايا في النطاق المختار",
      allYearsTotal: "ضحايا في كل السنوات",
      solvedShare: "نسبة لوائح الاتهام",
      firearmShare: "نسبة السلاح الناري",
      recentSources: "المصادر",
      moreContext: "معلومات إضافية"
    },
    analyses: {
      eyebrow: "Seasonal analysis",
      title: "تحليلات ومقارنات",
      subtitle:
        "التنقل بين تحليل رمضان وبين مقارنة مع دول غير مرتفعة الدخل ذات معدلات قتل مرتفعة، إلى جانب دول عربية لديها قيمة متاحة وسكان يزيدون على 300 ألف نسمة.",
      tabsAriaLabel: "تبويبات فرعية لصفحة التحليلات",
      tabs: {
        ramadan: "رمضان",
        countryComparison: "قتل مرتفع ودول عربية"
      },
      ramadan: {
        title: "تحليلات رمضان",
        subtitle: "مقارنة بين العدد الاسمي، والحصة من مجموع جرائم القتل في السنة نفسها، والمعدل اليومي في رمضان مقابل بقية السنة."
      },
      tableTitle: "جدول مقارنة سنوي",
      tableNote: "`pp` = نقاط مئوية. في السنة الجزئية تتم المقارنة مقابل بقية الأيام المرصودة حتى الآن.",
      noData: "لا توجد بيانات كافية للتحليل.",
      countryComparison: {
        title: "مقارنة المجتمع العربي في إسرائيل بدول ذات معدلات قتل مرتفعة وبالدول العربية",
        subtitle:
          "مقارنة معدل القتل لكل 100 ألف نسمة بحسب السنة المختارة، مقابل ما يصل إلى 15 دولة غير مرتفعة الدخل ذات أعلى معدلات قتل متاحة في قاعدة World Bank في تلك السنة، إضافة إلى دول عربية لها قيمة متاحة وسكان يزيدون على 300 ألف.",
        disclaimer: "هذه وحدة تحليلية لأغراض المقارنة فقط وليست دولة ذات سيادة.",
        methodology:
          "سنة المقارنة: {year}. عدد السكان للمجتمع العربي في إسرائيل مأخوذ من CBS. مجموعة المقارنة تشمل حتى 15 دولة غير مرتفعة الدخل ذات أعلى معدلات قتل بين القيم المتاحة في مؤشر World Bank/UNODC، وذلك فقط للدول التي يزيد عدد سكانها على 300 ألف في تلك السنة. كما تُضمّ الدول العربية التي لديها قيمة متاحة وتستوفي حد السكان نفسه. عدد الدول المعروضة في هذه السنة: {count}.",
        provisionalMethodology:
          "سنة المقارنة: {year}. عدد السكان للمجتمع العربي في إسرائيل مأخوذ من CBS. الدول المعروضة تستند إلى منشورات وطنية رسمية متاحة لسنة {year} مع حد سكاني يزيد على 300 ألف نسمة، ولذلك فهي طبقة مقارنة مؤقتة وليست سلسلة World Bank الموحدة. عدد الدول المعروضة في هذه السنة: {count}.",
        noCountryData:
          "لا توجد حالياً معدلات قتل كافية متاحة في قاعدة World Bank لسنة {year} لدول يزيد عدد سكانها على 300 ألف، لذلك تُعرض فقط بيانات المجتمع العربي في إسرائيل أو حالة عدم توفر البيانات.",
        chartTitle: "معدل القتل لكل 100 ألف نسمة",
        tableTitle: "جدول المقارنة مع الدول ذات معدلات القتل المرتفعة والدول العربية",
        tableNote:
          "تُعرض فقط الدول التي لديها قيمة متاحة لسنة {year} ويزيد عدد سكانها على 300 ألف في تلك السنة. تشمل المجموعة ما يصل إلى 15 دولة غير مرتفعة الدخل ذات أعلى معدلات قتل، إضافة إلى الدول العربية ذات القيمة المتاحة. السطر الخاص بالمجتمع العربي في إسرائيل يستند إلى عدد الضحايا في المتعقب وإلى مقام سكاني رسمي من CBS.",
        provisionalNote:
          "بالنسبة لسنة {year}، تستند الدول المعروضة إلى مصادر وطنية رسمية وبشكل مؤقت صفاً بصف، وليس إلى طبقة World Bank الموحدة التي لا تزال غير متاحة لتلك السنة.",
        sourceLink: "المصدر",
        yearLabel: "سنة المقارنة",
        yearTabsAriaLabel: "سنوات المقارنة المتاحة",
        methodologyToggleAriaLabel: "عرض منهجية المقارنة",
        labels: {
          entity: "المجتمع العربي في إسرائيل",
          rank: "الترتيب حسب معدل القتل",
          totalEntities: "عدد الجهات في المقارنة"
        },
        kpis: {
          rate: "معدل القتل لكل 100 ألف",
          victims: "الضحايا في سنة المرجع",
          population: "عدد السكان الرسمي",
          countries: "الدول المتاحة للمقارنة",
          rank: "الترتيب مقابل الجهات المعروضة"
        },
        table: {
          entity: "الدولة / الجهة",
          year: "سنة المصدر",
          rate: "المعدل لكل 100 ألف",
          delta: "الفارق مقابل المجتمع العربي في إسرائيل",
          source: "المصدر"
        }
      },
      kpis: {
        totalVictims: "ضحايا رمضان",
        avgShare: "متوسط الحصة من إجمالي القتل",
        aboveBaseline: "سنوات فوق وتيرة بقية السنة",
        avgRatio: "متوسط نسبة الوتيرة"
      },
      charts: {
        nominal: "عدد جرائم القتل في رمضان",
        share: "حصة رمضان من إجمالي جرائم القتل في السنة",
        rateRatio: "الوتيرة اليومية في رمضان مقابل بقية السنة",
        excess: "زيادة أو نقصان مقابل وتيرة الأيام خارج رمضان"
      },
      table: {
        year: "السنة",
        period: "نافذة رمضان",
        victims: "جرائم القتل",
        share: "حصة من السنة",
        ramadanRate: "الوتيرة اليومية في رمضان",
        restRate: "الوتيرة اليومية في بقية السنة",
        ratio: "نسبة الوتيرتين",
        excess: "زيادة/نقصان",
        firearmDelta: "تغير حصة السلاح الناري",
        solvedDelta: "تغير نسبة لوائح الاتهام",
        coverage: "التغطية"
      },
      labels: {
        complete: "سنة كاملة",
        notAvailable: "غير متاح"
      },
      units: {
        perDay: "في اليوم",
        pp: "pp"
      }
    },
    raw: {
      eyebrow: "Full transparency",
      title: "بيانات خام حسب السنة",
      year: "السنة",
      showAllColumns: "إظهار كل الأعمدة",
      rowsCount: "{count} سجل",
      yes: "نعم",
      no: "لا",
      columns: {
        rowNumber: "رقم",
        canonicalDate: "التاريخ",
        victim_name_he: "اسم الضحية",
        victim_name_ar: "اسم الضحية (عربي)",
        age: "العمر",
        gender: "النوع الاجتماعي",
        residence_locality: "البلدة",
        locality_key: "مفتاح البلدة",
        locality_name_canonical: "البلدة",
        district_state: "اللواء",
        weapon_type: "أداة القتل",
        solved_status: "حالة الحل",
        source_url_1: "رابط 1",
        source_url_2: "رابط 2"
      }
    },
    axis: {
      year: "السنة",
      month: "الشهر",
      victims: "الضحايا",
      shareOfYear: "حصة السنة",
      rateRatio: "نسبة الوتيرتين",
      excessVictims: "زيادة/نقصان",
      ratePer100k: "معدل القتل لكل 100 ألف نسمة"
    },
    table: {
      link1: "رابط 1",
      link2: "رابط 2"
    },
    errors: {
      loadingTitle: "خطأ في تحميل البيانات",
      loadingBody: "تعذر تحميل ملفات البيانات."
    },
    enum: {
      gender: { Male: "ذكر", Female: "أنثى", Unknown: "غير معروف" },
      citizen_status: { Citizen: "مواطن", "Non-citizen": "غير مواطن", Unknown: "غير معروف" },
      weapon_type: {
        Firearm: "سلاح ناري",
        "Sharp Object": "أداة حادة",
        Vehicle: "دهس",
        Strangulation: "خنق",
        Explosive: "متفجرات",
        Other: "أخرى",
        Unknown: "غير معروف"
      },
      solved_status: {
        "Solved/Indicted": "محلول / لائحة اتهام",
        "Partially Solved": "حل جزئي",
        Unsolved: "غير محلول",
        Unknown: "غير معروف"
      }
    }
  },
  en: {
    meta: {
      title: "Homicide Victim Tracker in Arab Society in Israel",
      description:
        "Interactive tracker of homicide victims in Arab society in Israel, with a locality map, year comparisons, Ramadan analysis, and victim names."
    },
    language: { selectorAria: "Select language" },
    views: {
      dashboard: "Dashboard",
      compareYears: "Compare Years",
      analyses: "Analyses",
      rawData: "Victims' Names"
    },
    brand: { logoAlt: "Abraham Initiatives logo" },
    hero: {
      eyebrow: "Town-level homicide monitor",
      title: "Homicide Victim Tracker in Arab Society in Israel",
      subtitle: "A locality-level dispersion map, direct year comparisons, and deep local profiles grounded in the victim dataset."
    },
    narrative: {
      lead: "The Abraham Initiatives has tracked homicide victims in Arab society in Israel from 2018 through today.",
      context:
        "Between 2000 and 2009, the number of Arab homicide victims in Israel was lower than the number of Jewish homicide victims. The gap reversed only around 2010. The central change is not collective identity, but a reality shaped by enforcement, weapon availability, and governance. The analyses screen also includes a comparison against non-high-income countries with high homicide rates, alongside Arab countries with available values, treating Arab society in Israel as a single analytical unit."
    },
    filters: {
      year: "Year",
      allOption: "All years",
      selectAria: "Select year",
      previousYear: "Previous year",
      nextYear: "Next year"
    },
    dashboard: {
      mapEyebrow: "Geographic dispersion",
      mapTitle: "Locality-level homicide dispersion map",
      mapMethodology: "Markers represent aggregated victim residence localities at town centroids, not exact homicide coordinates.",
      metricLabel: "Map metric",
      clearLocality: "Clear locality focus",
      trendEyebrow: "Evolution over time",
      monthlyEyebrow: "Current scope",
      weaponEyebrow: "Method of killing",
      genderEyebrow: "Gender profile",
      localitiesEyebrow: "Town leaderboard",
      noLocalityTitle: "Select a locality from the map to open a local profile",
      noLocalityBody:
        "Clicking a map marker or locality row opens a local profile with a multi-year trajectory, recent victims, and source links.",
      noLocalitySecondary: "This product maps town centroids rather than homicide points, to avoid false precision.",
      scopeAllYears: "All years",
      recentVictims: "Recent victims",
      localityTrend: "Year-by-year trajectory",
      coverageWarning: "Map coverage is partial: {count} records are still unmatched to a mapped locality.",
      partialYear: "{year} is partial through {date}.",
      mappedOnlyNote: "Charts use all filtered records; the map itself only shows localities with mapped centroids."
    },
    compare: {
      eyebrow: "Year against year",
      title: "Compare years at the locality level",
      yearA: "Year A",
      yearB: "Year B",
      metric: "Metric",
      searchLocality: "Search locality",
      resetLocality: "Reset locality",
      mapPanelLabelA: "Year A",
      mapPanelLabelB: "Year B",
      monthlyEyebrow: "Month by month",
      monthlyChartTitle: "Monthly trend: year vs year",
      deltaEyebrow: "Where change is sharpest",
      deltaChartTitle: "Localities with the sharpest change",
      tableEyebrow: "Sortable locality table",
      tableTitle: "Locality comparison table",
      partialNote: "At least one selected year is partial, so the comparison reflects observed data so far only.",
      totalA: "Total in Year A",
      totalB: "Total in Year B",
      delta: "Delta",
      deltaPct: "Relative delta",
      firearmDelta: "Firearm-share delta",
      solvedDelta: "Indictment-share delta",
      table: {
        locality: "Locality",
        yearA: "Year A",
        yearB: "Year B",
        delta: "Delta",
        firearmDelta: "Firearm delta",
        solvedDelta: "Indictment delta"
      }
    },
    common: {
      partialBadge: "Partial"
    },
    charts: {
      victimsByYear: "Victims by year",
      genderByYear: "Gender by year",
      weaponDistribution: "Weapon distribution",
      monthlyTrend: "Monthly trend",
      topLocalities: "Top localities"
    },
    mapMetrics: {
      victims: "Victim count",
      share: "Share of selected scope",
      solved_share: "Indictment share",
      firearm_share: "Firearm share"
    },
    kpi: {
      total: "Total victims",
      solvedShare: "Indictment share",
      firearmShare: "Firearm share",
      mappedLocalities: "Mapped localities",
      allYearsTotal: "All-years total"
    },
    detail: {
      totalVictims: "Victims in selected scope",
      allYearsTotal: "Victims across all years",
      solvedShare: "Indictment share",
      firearmShare: "Firearm share",
      recentSources: "Sources",
      moreContext: "More context"
    },
    analyses: {
      eyebrow: "Seasonal analysis",
      title: "Analyses and Comparisons",
      subtitle:
        "Move between the Ramadan analysis and a comparison against non-high-income countries with high homicide rates, alongside Arab countries with available values and populations above 300,000.",
      tabsAriaLabel: "Analysis page subtabs",
      tabs: {
        ramadan: "Ramadan",
        countryComparison: "High-Homicide + Arab Countries"
      },
      ramadan: {
        title: "Ramadan analyses",
        subtitle: "Compare nominal counts, share of annual homicides, and daily homicide pace in Ramadan versus the rest of the year."
      },
      tableTitle: "Yearly comparison table",
      tableNote: "`pp` = percentage points. In a partial year, comparison uses the rest of the observed days so far.",
      noData: "Not enough data is available for analysis.",
      countryComparison: {
        title: "Arab Society in Israel Compared with High-Homicide and Arab Countries",
        subtitle:
          "Compare homicide rates per 100,000 people for the selected year against up to 15 non-high-income countries with the highest available homicide rates in the World Bank dataset for that year, plus Arab countries with an available value and populations above 300,000.",
        disclaimer: "This is an analytical entity for comparison purposes only, not a sovereign state.",
        methodology:
          "Comparison year: {year}. The Arab population in Israel comes from the CBS. The comparison set includes up to 15 non-high-income countries with the highest homicide rates among values available in the World Bank/UNODC indicator, limited to countries above 300,000 residents in that year. Arab countries with an available value and the same population floor are added to the set. Countries shown in this year: {count}.",
        provisionalMethodology:
          "Comparison year: {year}. The Arab population in Israel comes from the CBS. The displayed countries rely on available official national releases for {year}, limited to populations above 300,000, so this is a provisional comparison layer rather than the harmonized World Bank series. Countries shown in this year: {count}.",
        noCountryData:
          "Not enough comparable World Bank homicide rates are currently available for {year} among countries above 300,000 residents, so this view can show only Arab-society-in-Israel data or a no-data state.",
        chartTitle: "Homicide rate per 100,000 people",
        tableTitle: "High-homicide and Arab-country comparison table",
        tableNote:
          "Only countries with an available value in {year} and populations above 300,000 in that year are shown. The set includes up to 15 non-high-income countries with the highest homicide rates, plus Arab countries with available values. The Arab-society row combines the tracker's homicide count with an official CBS population denominator.",
        provisionalNote:
          "For {year}, the displayed countries rely on country-by-country provisional figures from official national sources, not on the harmonized World Bank layer, which is still unavailable for that year.",
        sourceLink: "Source",
        yearLabel: "Comparison year",
        yearTabsAriaLabel: "Available comparison years",
        methodologyToggleAriaLabel: "Show comparison methodology",
        labels: {
          entity: "Arab society in Israel",
          rank: "Homicide-rate rank",
          totalEntities: "Entities in comparison"
        },
        kpis: {
          rate: "Homicide rate per 100,000",
          victims: "Victims in reference year",
          population: "Official population",
          countries: "Countries available",
          rank: "Rank among displayed entities"
        },
        table: {
          entity: "Country / entity",
          year: "Source year",
          rate: "Rate per 100,000",
          delta: "Gap vs Arab society in Israel",
          source: "Source"
        }
      },
      kpis: {
        totalVictims: "Ramadan victims",
        avgShare: "Average share of annual homicides",
        aboveBaseline: "Years above rest-of-year pace",
        avgRatio: "Average rate ratio"
      },
      charts: {
        nominal: "Homicides during Ramadan",
        share: "Ramadan share of annual homicides",
        rateRatio: "Daily pace in Ramadan vs the rest of the year",
        excess: "Excess or deficit vs non-Ramadan pace"
      },
      table: {
        year: "Year",
        period: "Ramadan window",
        victims: "Homicides",
        share: "Share of year",
        ramadanRate: "Ramadan daily pace",
        restRate: "Rest-of-year daily pace",
        ratio: "Rate ratio",
        excess: "Excess/deficit",
        firearmDelta: "Firearm-share delta",
        solvedDelta: "Indictment-share delta",
        coverage: "Coverage"
      },
      labels: {
        complete: "Complete year",
        notAvailable: "Not available"
      },
      units: {
        perDay: "per day",
        pp: "pp"
      }
    },
    raw: {
      eyebrow: "Full transparency",
      title: "Raw data by year",
      year: "Year",
      showAllColumns: "Show all columns",
      rowsCount: "{count} records",
      yes: "Yes",
      no: "No",
      columns: {
        rowNumber: "#",
        canonicalDate: "Date",
        victim_name_he: "Victim",
        victim_name_ar: "Victim (Arabic)",
        age: "Age",
        gender: "Gender",
        residence_locality: "Residence locality",
        locality_key: "Locality key",
        locality_name_canonical: "Locality",
        district_state: "District",
        weapon_type: "Weapon type",
        solved_status: "Solved status",
        source_url_1: "Link 1",
        source_url_2: "Link 2"
      }
    },
    axis: {
      year: "Year",
      month: "Month",
      victims: "Victims",
      shareOfYear: "Share of year",
      rateRatio: "Rate ratio",
      excessVictims: "Excess / deficit",
      ratePer100k: "Homicide rate per 100,000"
    },
    table: {
      link1: "Link 1",
      link2: "Link 2"
    },
    errors: {
      loadingTitle: "Error loading data",
      loadingBody: "The dashboard could not load its data files."
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
        "Solved/Indicted": "Solved / indicted",
        "Partially Solved": "Partially solved",
        Unsolved: "Unsolved",
        Unknown: "Unknown"
      }
    }
  }
};

const state = {
  allRecords: [],
  mainRecords: [],
  recordsByLocalityKey: new Map(),
  localitySummary: null,
  localityByKey: new Map(),
  language: loadLanguage(),
  activeView: "dashboard",
  selectedYear: ALL_FILTER_VALUE,
  selectedLocalityKey: "",
  mapMetric: "victims",
  analysisTab: DEFAULT_ANALYSIS_TAB,
  rawYear: "",
  rawShowAllColumns: false,
  rawDataColumns: [],
  years: [],
  yearMeta: new Map(),
  analysisCountryComparison: null,
  analysisCountryComparisonYear: "",
  compareYearA: "",
  compareYearB: "",
  compareMapMetric: "victims",
  compareSelectedLocalityKey: "",
  compareSortKey: "absDelta",
  compareSortDirection: "desc",
  nameLexicon: { heToAr: new Map(), arToHe: new Map() },
  maps: {
    dashboard: null,
    compareA: null,
    compareB: null
  },
  markerLayers: {
    dashboard: null,
    compareA: null,
    compareB: null
  },
  markerLookups: {
    dashboard: new Map(),
    compareA: new Map(),
    compareB: new Map()
  },
  hasFitDashboardMap: false,
  hasFitCompareMaps: false,
  isSyncingCompareMaps: false,
  compareLocalityNameLookup: new Map()
};

const ui = {
  languageChips: Array.from(document.querySelectorAll(".lang-chip")),
  viewTabs: Array.from(document.querySelectorAll(".view-tab")),
  analysisTabs: Array.from(document.querySelectorAll(".analysis-subtab")),
  headerFilterGroup: document.querySelector(".header-filter-group"),
  yearSelect: document.getElementById("header-year-select"),
  yearPrev: document.getElementById("header-year-prev"),
  yearNext: document.getElementById("header-year-next"),
  dashboardView: document.getElementById("dashboard-view"),
  compareView: document.getElementById("compare-view"),
  analysesView: document.getElementById("analyses-view"),
  rawView: document.getElementById("raw-view"),
  analysisSubviewRamadan: document.getElementById("analysis-subview-ramadan"),
  analysisSubviewCountryComparison: document.getElementById("analysis-subview-country-comparison"),
  dashboardKpis: document.getElementById("dashboard-kpis"),
  dashboardMetricSelect: document.getElementById("dashboard-metric-select"),
  dashboardClearLocality: document.getElementById("dashboard-clear-locality"),
  dashboardMapLegend: document.getElementById("dashboard-map-legend"),
  dashboardCoverageNote: document.getElementById("dashboard-map-coverage-note"),
  localityDetailPanel: document.getElementById("locality-detail-panel"),
  dashboardTopLocalities: document.getElementById("dashboard-top-localities"),
  compareYearASelect: document.getElementById("compare-year-a-select"),
  compareYearBSelect: document.getElementById("compare-year-b-select"),
  compareMetricSelect: document.getElementById("compare-metric-select"),
  compareLocalitySearch: document.getElementById("compare-locality-search"),
  compareLocalityOptions: document.getElementById("compare-locality-options"),
  compareResetLocality: document.getElementById("compare-reset-locality"),
  comparePartialNote: document.getElementById("compare-partial-note"),
  compareKpis: document.getElementById("compare-kpis"),
  compareMapLegendA: document.getElementById("compare-map-legend-a"),
  compareMapLegendB: document.getElementById("compare-map-legend-b"),
  compareMapTitleA: document.getElementById("compare-map-title-a"),
  compareMapTitleB: document.getElementById("compare-map-title-b"),
  compareMapSummaryA: document.getElementById("compare-map-summary-a"),
  compareMapSummaryB: document.getElementById("compare-map-summary-b"),
  compareTableHead: document.querySelector("#compare-table thead"),
  compareTableBody: document.querySelector("#compare-table tbody"),
  rawYearTabs: document.getElementById("raw-year-tabs"),
  rawShowAllColumns: document.getElementById("raw-show-all-columns"),
  rawTableHead: document.querySelector("#raw-records-table thead"),
  rawTableBody: document.querySelector("#raw-records-table tbody"),
  countryComparisonYearTabs: document.getElementById("country-comparison-year-tabs"),
  countryComparisonNote: document.getElementById("country-comparison-note"),
  countryComparisonMethodology: document.getElementById("country-comparison-methodology"),
  countryComparisonKpis: document.getElementById("country-comparison-kpis"),
  countryComparisonTableHead: document.querySelector("#country-comparison-table thead"),
  countryComparisonTableBody: document.querySelector("#country-comparison-table tbody"),
  ramadanAnalysisKpis: document.getElementById("ramadan-analysis-kpis"),
  ramadanAnalysisTableHead: document.querySelector("#ramadan-analysis-table thead"),
  ramadanAnalysisTableBody: document.querySelector("#ramadan-analysis-table tbody")
};

function loadLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && LANGUAGE_META[stored]) {
      return stored;
    }
  } catch (error) {
    // Ignore localStorage issues.
  }

  return DEFAULT_LANGUAGE;
}

function persistLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // Ignore localStorage issues.
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
  return fallback !== undefined ? fallback : key;
}

function tFormat(key, replacements = {}) {
  const template = String(t(key));
  return template.replace(/\{(\w+)\}/g, (_, token) => (replacements[token] !== undefined ? replacements[token] : ""));
}

function setMetaContent(selector, value) {
  const node = document.querySelector(selector);
  if (node) {
    node.setAttribute("content", value);
  }
}

function getCanonicalDashboardUrl(language = state.language) {
  const url = new URL(`${SITE_BASE_URL}/dashboard/`);
  url.searchParams.set("lang", language);
  return url.toString();
}

function applySeoMetadata() {
  const canonicalHref = getCanonicalDashboardUrl(state.language);
  const description = t("meta.description");
  const title = t("meta.title");

  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonicalHref);
  setMetaContent('meta[property="og:locale"]', LANGUAGE_META[state.language].ogLocale);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);

  const canonicalLink = document.getElementById("canonical-link");
  if (canonicalLink) {
    canonicalLink.setAttribute("href", canonicalHref);
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = getDirection();
  applySeoMetadata();

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    node.setAttribute("alt", t(node.dataset.i18nAlt));
  });

  syncLanguageChips();
  syncViewTabs();
  syncAnalysisTabs();
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

function syncAnalysisTabs() {
  ui.analysisTabs.forEach((tab) => {
    const isActive = tab.dataset.analysisTab === state.analysisTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

function setLanguage(language, { persist = true } = {}) {
  state.language = LANGUAGE_META[language] ? language : DEFAULT_LANGUAGE;
  if (persist) {
    persistLanguage(state.language);
  }
  applyStaticTranslations();
}

function tokenizeName(name) {
  return String(name || "")
    .trim()
    .split(/[\s-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function splitNameWithSeparators(name) {
  return String(name || "")
    .trim()
    .split(/([\s-]+)/)
    .filter((part) => part.length > 0);
}

function chooseMostFrequentValue(counts) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function buildNameLexicon(records) {
  const heToArCounts = new Map();
  const arToHeCounts = new Map();

  records.forEach((record) => {
    const heTokens = tokenizeName(record.victim_name_he);
    const arTokens = tokenizeName(record.victim_name_ar);

    if (!heTokens.length || heTokens.length !== arTokens.length) {
      return;
    }

    heTokens.forEach((heToken, index) => {
      const arToken = arTokens[index];

      if (!heToArCounts.has(heToken)) {
        heToArCounts.set(heToken, new Map());
      }
      if (!arToHeCounts.has(arToken)) {
        arToHeCounts.set(arToken, new Map());
      }

      heToArCounts.get(heToken).set(arToken, (heToArCounts.get(heToken).get(arToken) || 0) + 1);
      arToHeCounts.get(arToken).set(heToken, (arToHeCounts.get(arToken).get(heToken) || 0) + 1);
    });
  });

  return {
    heToAr: new Map([...heToArCounts.entries()].map(([token, counts]) => [token, chooseMostFrequentValue(counts)])),
    arToHe: new Map([...arToHeCounts.entries()].map(([token, counts]) => [token, chooseMostFrequentValue(counts)]))
  };
}

function applyMultiCharacterMapping(value, mappingPairs) {
  return mappingPairs.reduce((output, [source, target]) => output.replaceAll(source, target), String(value || ""));
}

function transliterateCharacters(value, mapping) {
  return [...String(value || "")]
    .map((char) => (mapping[char] !== undefined ? mapping[char] : char))
    .join("");
}

function capitalizeLatinName(name) {
  return name
    .split(/([\s-]+)/)
    .map((part) => {
      if (/^[\s-]+$/.test(part)) {
        return part;
      }
      return part ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    })
    .join("")
    .replace(/\bAl (?=\w)/g, "Al-")
    .replace(/\bAbu\b/g, "Abu");
}

function transliterateHebrewTokenToArabic(token) {
  const specialForms = {
    אבו: "أبو",
    אל: "ال",
    אבן: "ابن",
    עבד: "عبد"
  };

  if (specialForms[token]) {
    return specialForms[token];
  }

  return transliterateCharacters(applyMultiCharacterMapping(token, HEBREW_TO_ARABIC_MULTI), HEBREW_TO_ARABIC_CHAR);
}

function transliterateHebrewNameToArabic(name) {
  const parts = splitNameWithSeparators(name);
  return parts
    .map((part) => {
      if (/^[\s-]+$/.test(part)) {
        return part;
      }
      return state.nameLexicon.heToAr.get(part) || transliterateHebrewTokenToArabic(part);
    })
    .join("");
}

function transliterateArabicNameToLatin(name) {
  return capitalizeLatinName(transliterateCharacters(String(name || ""), ARABIC_TO_LATIN_CHAR).replace(/\s+/g, " ").trim());
}

function transliterateHebrewNameToLatin(name) {
  const normalized = applyMultiCharacterMapping(name, HEBREW_TO_LATIN_MULTI);
  return capitalizeLatinName(transliterateCharacters(normalized, HEBREW_TO_LATIN_CHAR).replace(/\s+/g, " ").trim());
}

function getVictimNameForLanguage(record, language = state.language) {
  const hebrewName = String(record.victim_name_he || "").trim();
  const arabicName = String(record.victim_name_ar || "").trim();

  if (language === "he") {
    return hebrewName || state.nameLexicon.arToHe.get(arabicName) || arabicName;
  }
  if (language === "ar") {
    return arabicName || transliterateHebrewNameToArabic(hebrewName);
  }

  const arabicForLatin = arabicName || transliterateHebrewNameToArabic(hebrewName);
  return arabicForLatin ? transliterateArabicNameToLatin(arabicForLatin) : transliterateHebrewNameToLatin(hebrewName);
}

function getLocalizedHebrewName(hebrewName, arabicName = "") {
  const heName = String(hebrewName || "").trim();
  const arName = String(arabicName || "").trim();

  if (state.language === "he") {
    return heName || arName;
  }
  if (state.language === "ar") {
    return arName || transliterateHebrewNameToArabic(heName);
  }
  return arName ? transliterateArabicNameToLatin(arName) : transliterateHebrewNameToLatin(heName);
}

function translateEnum(group, value) {
  const rawValue = (value || "Unknown").toString();
  const localized = getNestedTranslation(I18N[state.language], `enum.${group}.${rawValue}`);
  if (localized !== undefined) {
    return localized;
  }
  const fallback = getNestedTranslation(I18N[DEFAULT_LANGUAGE], `enum.${group}.${rawValue}`);
  return fallback !== undefined ? fallback : rawValue;
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

function isSolvedForMetrics(record) {
  return record?.solved_status === SOLVED_STATUS_FOR_METRICS;
}

function createPlotTheme() {
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: {
      family: isRtlLanguage() ? "Heebo, sans-serif" : "IBM Plex Sans, sans-serif",
      color: "#0f2430",
      size: 12
    },
    margin: {
      t: 18,
      r: isRtlLanguage() ? 46 : 22,
      b: 44,
      l: isRtlLanguage() ? 22 : 46
    }
  };
}

async function fetchJson(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        continue;
      }
      return await response.json();
    } catch (error) {
      // Try next path.
    }
  }

  throw new Error(t("errors.loadingBody"));
}

async function fetchOptionalJson(paths) {
  try {
    return await fetchJson(paths);
  } catch (error) {
    return null;
  }
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
    year: Number.isFinite(dateYear) && dateYear > 1900 ? dateYear : Number(record.dataset_year),
    monthNum,
    canonicalDate,
    includedInMainTally: record.included_in_main_tally === true || record.included_in_main_tally === "true"
  };
}

function sortWithLocale(values) {
  const collator = new Intl.Collator(getLocale(), { sensitivity: "base", numeric: true });
  return values.sort(collator.compare);
}

function compareIsoDates(left, right) {
  return String(left || "").localeCompare(String(right || ""));
}

function daysInclusive(startIso, endIso) {
  if (!startIso || !endIso || compareIsoDates(endIso, startIso) < 0) {
    return 0;
  }

  const start = new Date(`${startIso}T00:00:00Z`);
  const end = new Date(`${endIso}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  return Math.round((end - start) / MS_PER_DAY) + 1;
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function formatNumber(value) {
  if (!Number.isFinite(Number(value))) {
    return "0";
  }
  return new Intl.NumberFormat(getLocale()).format(Number(value));
}

function formatYear(value) {
  return new Intl.NumberFormat(getLocale(), { useGrouping: false }).format(Number(value));
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

function formatPct(value) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }

  return new Intl.NumberFormat(getLocale(), {
    style: "percent",
    minimumFractionDigits: value < 0.1 ? 1 : 0,
    maximumFractionDigits: 1
  }).format(value);
}

function formatDecimal(value, minimumFractionDigits = 1, maximumFractionDigits = minimumFractionDigits) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }

  return new Intl.NumberFormat(getLocale(), {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

function formatSignedNumber(value, minimumFractionDigits = 0, maximumFractionDigits = minimumFractionDigits) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }

  return new Intl.NumberFormat(getLocale(), {
    signDisplay: "always",
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

function formatPctPointDelta(value) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }
  return `${formatSignedNumber(value * 100, 1, 1)} ${t("analyses.units.pp")}`;
}

function formatPerDay(value) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }
  return `${formatDecimal(value, 2, 2)} ${t("analyses.units.perDay")}`;
}

function formatRatioValue(value) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }
  return `${formatDecimal(value, 2, 2)}x`;
}

function formatRatePer100k(value) {
  if (!Number.isFinite(value)) {
    return t("analyses.labels.notAvailable");
  }
  return formatDecimal(value, 2, 2);
}

function getMonthLabels() {
  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(Date.UTC(2024, index, 1));
    return new Intl.DateTimeFormat(getLocale(), { month: "long" }).format(monthDate);
  });
}

function getYearTotals() {
  const totals = new Map();
  state.mainRecords.forEach((record) => {
    totals.set(record.year, (totals.get(record.year) || 0) + 1);
  });
  return totals;
}

function buildYearMeta(records) {
  const meta = new Map();
  const latestAvailableYear = Math.max(...records.map((record) => record.year).filter(Number.isFinite));
  const now = new Date();
  const todayInJerusalem = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
  const currentYear = Number(todayInJerusalem.slice(0, 4));

  records.forEach((record) => {
    if (!Number.isFinite(record.year)) {
      return;
    }
    const entry = meta.get(record.year) || { latestIso: "", partial: false };
    if (record.canonicalDate && compareIsoDates(record.canonicalDate, entry.latestIso) > 0) {
      entry.latestIso = record.canonicalDate;
    }
    meta.set(record.year, entry);
  });

  meta.forEach((entry, year) => {
    entry.partial =
      year === latestAvailableYear &&
      year >= currentYear &&
      entry.latestIso &&
      compareIsoDates(entry.latestIso, `${year}-12-31`) < 0;
  });

  return meta;
}

function getPartialYears() {
  return [...state.yearMeta.entries()].filter(([, meta]) => meta.partial).map(([year]) => year);
}

function getLatestCompleteYears() {
  const completeYears = state.years.filter((year) => !(state.yearMeta.get(year)?.partial));
  return completeYears.slice(-2);
}

function getDefaultCompareYears() {
  const latestTwoComplete = getLatestCompleteYears();
  if (latestTwoComplete.length >= 2) {
    return latestTwoComplete;
  }
  return state.years.slice(-2);
}

function getAvailableYearsFromDatasetYear() {
  return [...new Set(state.allRecords.map((record) => String(record.dataset_year)).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
}

function getRawRecordsForYear(year) {
  return state.allRecords
    .filter((record) => String(record.dataset_year) === String(year))
    .sort((a, b) => {
      const dateCompare = (b.canonicalDate || "").localeCompare(a.canonicalDate || "");
      return dateCompare !== 0 ? dateCompare : Number(a.source_row_number || 0) - Number(b.source_row_number || 0);
    });
}

function getAllRawColumnsFromDataHeaders() {
  if (state.rawDataColumns.length) {
    return state.rawDataColumns;
  }
  if (!state.allRecords.length) {
    return [];
  }

  const excluded = new Set(["monthNum", "year", "canonicalDate", "includedInMainTally", "residence_locality"]);
  return Object.keys(state.allRecords[0]).filter((key) => !excluded.has(key));
}

function getRawColumnLabel(columnKey) {
  const translated = t(`raw.columns.${columnKey}`);
  return translated !== `raw.columns.${columnKey}` ? translated : columnKey;
}

function getMetricLabel(metric) {
  return t(`mapMetrics.${metric}`);
}

function getMetricValueForDisplay(metric, value) {
  if (metric === "victims") {
    return formatNumber(value);
  }
  return formatPct(value);
}

function getLocalizedLocalityName(locality) {
  if (!locality) {
    return "";
  }
  return getLocalizedHebrewName(locality.locality_name_he, locality.locality_name_ar);
}

function getDashboardBaseRecords() {
  return state.selectedYear === ALL_FILTER_VALUE
    ? state.mainRecords
    : state.mainRecords.filter((record) => String(record.year) === String(state.selectedYear));
}

function getDashboardDetailRecords() {
  let records = getDashboardBaseRecords();
  if (state.selectedLocalityKey) {
    records = records.filter((record) => record.locality_key === state.selectedLocalityKey);
  }
  return records;
}

function getDashboardTrendRecords() {
  if (!state.selectedLocalityKey) {
    return state.mainRecords;
  }
  return state.recordsByLocalityKey.get(state.selectedLocalityKey) || [];
}

function getAllYearsLocalityMetrics(locality) {
  const yearMetricValues = Object.values(locality.year_metrics || {});
  const victims = yearMetricValues.reduce((sum, row) => sum + (row.victims || 0), 0);
  const firearmVictims = yearMetricValues.reduce((sum, row) => sum + (row.firearm_victims || 0), 0);
  const solvedVictims = yearMetricValues.reduce((sum, row) => sum + (row.solved_victims || 0), 0);
  const maleVictims = yearMetricValues.reduce((sum, row) => sum + (row.male_victims || 0), 0);
  const femaleVictims = yearMetricValues.reduce((sum, row) => sum + (row.female_victims || 0), 0);

  return {
    victims,
    share_of_year: state.mainRecords.length ? victims / state.mainRecords.length : 0,
    firearm_victims: firearmVictims,
    firearm_share: victims ? firearmVictims / victims : 0,
    solved_victims: solvedVictims,
    solved_share: victims ? solvedVictims / victims : 0,
    male_victims: maleVictims,
    female_victims: femaleVictims
  };
}

function getLocalityMetricsForYear(locality, year) {
  if (!locality) {
    return null;
  }
  if (year === ALL_FILTER_VALUE) {
    return getAllYearsLocalityMetrics(locality);
  }
  return locality.year_metrics?.[String(year)] || {
    victims: 0,
    share_of_year: 0,
    firearm_victims: 0,
    firearm_share: 0,
    solved_victims: 0,
    solved_share: 0,
    male_victims: 0,
    female_victims: 0
  };
}

function getLocalityMetricValue(locality, year, metric) {
  const metrics = getLocalityMetricsForYear(locality, year);
  if (!metrics) {
    return 0;
  }
  switch (metric) {
    case "share":
      return metrics.share_of_year || 0;
    case "solved_share":
      return metrics.solved_share || 0;
    case "firearm_share":
      return metrics.firearm_share || 0;
    default:
      return metrics.victims || 0;
  }
}

function getDashboardMapRows() {
  return state.localitySummary.localities
    .map((locality) => {
      const metrics = getLocalityMetricsForYear(locality, state.selectedYear);
      return {
        locality,
        metrics,
        victims: metrics.victims || 0,
        metricValue: getLocalityMetricValue(locality, state.selectedYear, state.mapMetric)
      };
    })
    .filter((entry) => entry.victims > 0)
    .sort((a, b) => b.victims - a.victims);
}

function getLocalityTrendSeries(localityKey) {
  const locality = state.localityByKey.get(localityKey);
  if (!locality) {
    return [];
  }

  return state.years.map((year) => ({
    year,
    victims: locality.year_metrics?.[String(year)]?.victims || 0
  }));
}

function getRecentVictimsForLocality(localityKey) {
  let records = state.recordsByLocalityKey.get(localityKey) || [];
  if (state.selectedYear !== ALL_FILTER_VALUE) {
    records = records.filter((record) => String(record.year) === String(state.selectedYear));
  }

  return [...records]
    .sort((a, b) => (b.canonicalDate || "").localeCompare(a.canonicalDate || ""))
    .slice(0, RECENT_VICTIMS_LIMIT);
}

function getScopeTitle() {
  return state.selectedYear === ALL_FILTER_VALUE ? t("dashboard.scopeAllYears") : formatYear(state.selectedYear);
}

function computeYearPaceProjection(records, targetYear = TRAJECTORY_YEAR) {
  const yearRecords = records.filter((record) => record.year === targetYear && record.canonicalDate);
  if (!yearRecords.length) {
    return null;
  }

  const sortedDates = yearRecords.map((record) => record.canonicalDate).sort();
  const latestIso = sortedDates[sortedDates.length - 1];
  if (!latestIso) {
    return null;
  }

  const latestDate = new Date(`${latestIso}T00:00:00Z`);
  if (Number.isNaN(latestDate.getTime())) {
    return null;
  }

  const startOfYearUtc = Date.UTC(targetYear, 0, 1);
  const todayParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const currentYear = Number(todayParts.find((part) => part.type === "year")?.value);
  const currentMonth = Number(todayParts.find((part) => part.type === "month")?.value);
  const currentDay = Number(todayParts.find((part) => part.type === "day")?.value);

  const effectiveUtc =
    currentYear === targetYear
      ? Date.UTC(targetYear, currentMonth - 1, currentDay)
      : Date.UTC(targetYear, latestDate.getUTCMonth(), latestDate.getUTCDate());

  const elapsedDays = Math.max(1, Math.floor((effectiveUtc - startOfYearUtc) / MS_PER_DAY) + 1);
  const daysInYear = Math.floor((Date.UTC(targetYear + 1, 0, 1) - startOfYearUtc) / MS_PER_DAY);
  const actualCount = yearRecords.length;
  const projectedCount = Math.max(actualCount, Math.round((actualCount / elapsedDays) * daysInYear));

  return { year: targetYear, actualCount, projectedCount };
}

function computeRamadanAnalysisRows(records = state.mainRecords) {
  return Object.entries(RAMADAN_PERIODS)
    .map(([yearKey, period]) => {
      const year = Number(yearKey);
      const yearRecords = records
        .filter((record) => record.year === year && record.canonicalDate)
        .sort((left, right) => compareIsoDates(left.canonicalDate, right.canonicalDate));

      if (!yearRecords.length) {
        return null;
      }

      const latestObservedIso = yearRecords[yearRecords.length - 1].canonicalDate;
      if (compareIsoDates(latestObservedIso, period.end) < 0) {
        return null;
      }

      const observedYearEndIso = `${year}-12-31`;
      const observedRamadanDays = daysInclusive(period.start, period.end);
      const observedYearDays = daysInclusive(`${year}-01-01`, observedYearEndIso);
      const ramadanRecords = yearRecords.filter(
        (record) => compareIsoDates(record.canonicalDate, period.start) >= 0 && compareIsoDates(record.canonicalDate, period.end) <= 0
      );
      const nonRamadanRecords = yearRecords.filter(
        (record) => compareIsoDates(record.canonicalDate, period.start) < 0 || compareIsoDates(record.canonicalDate, period.end) > 0
      );

      const ramadanVictims = ramadanRecords.length;
      const totalVictimsObserved = yearRecords.length;
      const nonRamadanDays = Math.max(0, observedYearDays - observedRamadanDays);
      const ramadanDailyRate = observedRamadanDays ? ramadanVictims / observedRamadanDays : null;
      const nonRamadanDailyRate = nonRamadanDays ? nonRamadanRecords.length / nonRamadanDays : null;
      const rateRatio =
        Number.isFinite(ramadanDailyRate) && Number.isFinite(nonRamadanDailyRate) && nonRamadanDailyRate > 0
          ? ramadanDailyRate / nonRamadanDailyRate
          : null;
      const excessVictims =
        Number.isFinite(nonRamadanDailyRate) && observedRamadanDays > 0
          ? ramadanVictims - nonRamadanDailyRate * observedRamadanDays
          : null;

      const ramadanFirearmShare = ramadanVictims
        ? ramadanRecords.filter((record) => record.weapon_type === "Firearm").length / ramadanVictims
        : null;
      const yearlyFirearmShare = totalVictimsObserved
        ? yearRecords.filter((record) => record.weapon_type === "Firearm").length / totalVictimsObserved
        : null;
      const ramadanSolvedShare = ramadanVictims ? ramadanRecords.filter((record) => isSolvedForMetrics(record)).length / ramadanVictims : null;
      const yearlySolvedShare = totalVictimsObserved ? yearRecords.filter((record) => isSolvedForMetrics(record)).length / totalVictimsObserved : null;

      return {
        year,
        periodStartIso: period.start,
        observedRamadanEndIso: period.end,
        ramadanVictims,
        shareOfYear: totalVictimsObserved ? ramadanVictims / totalVictimsObserved : null,
        ramadanDailyRate,
        nonRamadanDailyRate,
        rateRatio,
        excessVictims,
        firearmShareDelta:
          Number.isFinite(ramadanFirearmShare) && Number.isFinite(yearlyFirearmShare) ? ramadanFirearmShare - yearlyFirearmShare : null,
        solvedShareDelta:
          Number.isFinite(ramadanSolvedShare) && Number.isFinite(yearlySolvedShare) ? ramadanSolvedShare - yearlySolvedShare : null
      };
    })
    .filter(Boolean);
}

function getCountryComparisonEntityLabel(row) {
  if (row?.isArabSociety) {
    return t("analyses.countryComparison.labels.entity");
  }
  if (state.language === "he") {
    return row?.nameHe || row?.nameEn || "";
  }
  if (state.language === "ar") {
    return row?.nameAr || row?.nameEn || "";
  }
  return row?.nameEn || row?.nameHe || "";
}

function getFlagEmoji(iso2) {
  const normalized = String(iso2 || "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    return "";
  }
  return [...normalized].map((char) => String.fromCodePoint(127397 + char.charCodeAt(0))).join("");
}

function getCountryComparisonDisplayLabel(row) {
  const prefix = row?.isArabSociety ? "◎" : getFlagEmoji(row?.iso2);
  return prefix ? `${prefix} ${getCountryComparisonEntityLabel(row)}` : getCountryComparisonEntityLabel(row);
}

function getAvailableCountryComparisonYears() {
  const comparison = state.analysisCountryComparison;
  return Object.keys(comparison?.years || {})
    .map(Number)
    .filter(Number.isFinite)
    .filter((year) => {
      const yearData = comparison?.years?.[String(year)];
      return (yearData?.comparators || []).length > 0 || Number(yearData?.population) > 0;
    })
    .sort((a, b) => a - b);
}

function getDefaultCountryComparisonYear() {
  const years = getAvailableCountryComparisonYears();
  if (!years.length) {
    return "";
  }

  const latestWithComparators = years
    .slice()
    .reverse()
    .find((year) => (state.analysisCountryComparison?.years?.[String(year)]?.comparators || []).length > 0);
  return latestWithComparators || years[years.length - 1];
}

function getCountryComparisonSnapshot() {
  const comparison = state.analysisCountryComparison;
  const year = Number(state.analysisCountryComparisonYear);
  const yearData = comparison?.years?.[String(year)];
  const comparators = (yearData?.comparators || [])
    .map((row) => ({
      ...row,
      isArabSociety: false,
      sourceYear: Number(row.sourceYear) || year,
      ratePer100k: Number(row.ratePer100k)
    }))
    .filter((row) => Number.isFinite(row.ratePer100k));

  const victims = state.mainRecords.filter((record) => record.year === year).length;
  const population = Number(yearData?.population) || null;
  const localRate = Number.isFinite(population) && population > 0 ? (victims / population) * 100000 : null;
  const hasComparators = comparators.length > 0;
  const hasProvisionalData = comparators.some((row) => row.provisional);

  if (!yearData) {
    return {
      year,
      victims,
      population: null,
      localRate: null,
      comparators: [],
      rows: [],
      hasComparators: false,
      hasProvisionalData: false,
      localRow: null,
      methodology: comparison?.methodology || null,
      populationSourceUrl: "",
      populationSourceLabel: comparison?.methodology?.populationSource || ""
    };
  }

  const rows = [];
  if (Number.isFinite(localRate)) {
    rows.push({
      isArabSociety: true,
      iso3: "ARAB_ISRAEL_ANALYTICAL",
      iso2: "",
      nameHe: t("analyses.countryComparison.labels.entity"),
      nameAr: t("analyses.countryComparison.labels.entity"),
      nameEn: t("analyses.countryComparison.labels.entity"),
      sourceYear: year,
      sourceUrl: yearData.populationSourceUrl,
      victims,
      population,
      ratePer100k: localRate
    });
  }

  rows.push(...comparators);
  rows.sort((left, right) => right.ratePer100k - left.ratePer100k || String(left.iso3 || "").localeCompare(String(right.iso3 || "")));

  const normalizedRows = rows.map((row, index) => ({
    ...row,
    rank: Number.isFinite(localRate) ? index + 1 : null,
    deltaVsArabSociety: Number.isFinite(localRate) ? row.ratePer100k - localRate : null
  }));

  return {
    year,
    victims,
    population,
    localRate,
    comparators,
    rows: normalizedRows,
    hasComparators,
    hasProvisionalData,
    localRow: normalizedRows.find((row) => row.isArabSociety) || null,
    methodology: comparison?.methodology || null,
    populationSourceUrl: yearData.populationSourceUrl || "",
    populationSourceLabel: comparison?.methodology?.populationSource || ""
  };
}

function createKpi(label, value, tone = "primary") {
  const card = document.createElement("article");
  card.className = `kpi kpi-${tone}`;

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

function getChronologicalYears() {
  return state.years.slice().sort((a, b) => a - b);
}

function syncYearStepperButtons() {
  const years = getChronologicalYears().map((year) => String(year));
  const selected = String(state.selectedYear);
  const isAllSelected = selected === ALL_FILTER_VALUE;
  const currentIndex = years.indexOf(selected);

  ui.yearPrev.disabled = isAllSelected || currentIndex <= 0;
  ui.yearNext.disabled = isAllSelected || currentIndex === -1 || currentIndex >= years.length - 1;
}

function syncYearStepperDirection() {
  ui.yearPrev.textContent = isRtlLanguage() ? "\u203a" : "\u2039";
  ui.yearNext.textContent = isRtlLanguage() ? "\u2039" : "\u203a";
}

function renderYearFilterControl() {
  ui.yearSelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = ALL_FILTER_VALUE;
  allOption.textContent = t("filters.allOption");
  allOption.selected = String(state.selectedYear) === ALL_FILTER_VALUE;
  ui.yearSelect.appendChild(allOption);

  state.years
    .slice()
    .sort((a, b) => b - a)
    .forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = formatYear(year);
      option.selected = String(state.selectedYear) === String(year);
      ui.yearSelect.appendChild(option);
    });

  syncYearStepperDirection();
  syncYearStepperButtons();
}

function shiftSelectedYear(direction) {
  const years = getChronologicalYears().map((year) => String(year));
  const selected = String(state.selectedYear);
  const currentIndex = years.indexOf(selected);
  if (currentIndex === -1) {
    return;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= years.length) {
    return;
  }

  state.selectedYear = years[nextIndex];
  render();
}

function renderMetricSelect(selectNode, selectedMetric) {
  selectNode.innerHTML = "";
  MAP_METRICS.forEach((metric) => {
    const option = document.createElement("option");
    option.value = metric;
    option.textContent = getMetricLabel(metric);
    option.selected = metric === selectedMetric;
    selectNode.appendChild(option);
  });
}

function renderCompareYearSelects() {
  [ui.compareYearASelect, ui.compareYearBSelect].forEach((selectNode, index) => {
    const selectedValue = index === 0 ? state.compareYearA : state.compareYearB;
    selectNode.innerHTML = "";
    state.years.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = formatYear(year);
      option.selected = String(selectedValue) === String(year);
      selectNode.appendChild(option);
    });
  });
}

function renderCompareSearchOptions() {
  state.compareLocalityNameLookup.clear();
  ui.compareLocalityOptions.innerHTML = "";

  state.localitySummary.localities.forEach((locality) => {
    const localizedName = getLocalizedLocalityName(locality);
    state.compareLocalityNameLookup.set(localizedName, locality.locality_key);
    state.compareLocalityNameLookup.set(locality.locality_name_he, locality.locality_key);
    const option = document.createElement("option");
    option.value = localizedName;
    ui.compareLocalityOptions.appendChild(option);
  });

  if (state.compareSelectedLocalityKey) {
    const locality = state.localityByKey.get(state.compareSelectedLocalityKey);
    ui.compareLocalitySearch.value = locality ? getLocalizedLocalityName(locality) : "";
  } else {
    ui.compareLocalitySearch.value = "";
  }
}

function renderRawYearTabs() {
  ui.rawYearTabs.innerHTML = "";

  getAvailableYearsFromDatasetYear().forEach((year) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "raw-year-tab";
    button.dataset.rawYear = year;
    button.textContent = formatYear(year);
    button.classList.toggle("is-active", state.rawYear === year);
    ui.rawYearTabs.appendChild(button);
  });
}

function createTextCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "";
  return cell;
}

function createExternalLink(url, label, className = "") {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  if (className) {
    link.className = className;
  }
  return link;
}

function createSingleSourceLinkCell(url, label) {
  const cell = document.createElement("td");
  if (!url) {
    return cell;
  }
  cell.appendChild(createExternalLink(url, label));
  return cell;
}

function formatRawCellValue(columnKey, record) {
  switch (columnKey) {
    case "canonicalDate":
      return formatDate(record.canonicalDate || record.death_date_iso || record.event_date_iso) || record.death_date_raw || record.event_date_raw || "";
    case "victim_name_he":
      return getVictimNameForLanguage(record);
    case "victim_name_ar":
      return getVictimNameForLanguage(record, "ar");
    case "age":
      return record.age ? formatNumber(record.age) : "";
    case "gender":
      return translateFieldValue("gender", record.gender);
    case "weapon_type":
      return translateFieldValue("weapon_type", record.weapon_type);
    case "solved_status":
      return translateFieldValue("solved_status", record.solved_status);
    case "residence_locality":
    case "locality_name_canonical":
      return record.locality_name_canonical || record.residence_locality || "";
    default:
      return record[columnKey] ?? "";
  }
}

function renderRawTable() {
  const records = getRawRecordsForYear(state.rawYear);
  const columns = state.rawShowAllColumns ? getAllRawColumnsFromDataHeaders() : RAW_DEFAULT_COLUMNS;

  ui.rawTableHead.innerHTML = "";
  ui.rawTableBody.innerHTML = "";

  const headerRow = document.createElement("tr");
  const numberHeaderCell = document.createElement("th");
  numberHeaderCell.textContent = t("raw.columns.rowNumber");
  headerRow.appendChild(numberHeaderCell);
  columns.forEach((columnKey) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = getRawColumnLabel(columnKey);
    headerRow.appendChild(headerCell);
  });
  ui.rawTableHead.appendChild(headerRow);

  records.forEach((record, index) => {
    const row = document.createElement("tr");
    row.appendChild(createTextCell(formatNumber(index + 1)));
    columns.forEach((columnKey) => {
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
  const showCompare = state.activeView === "compare";
  const showAnalyses = state.activeView === "analyses";
  const showRaw = state.activeView === "raw";

  ui.dashboardView.classList.toggle("view-hidden", !showDashboard);
  ui.compareView.classList.toggle("view-hidden", !showCompare);
  ui.analysesView.classList.toggle("view-hidden", !showAnalyses);
  ui.rawView.classList.toggle("view-hidden", !showRaw);
  ui.headerFilterGroup.classList.toggle("view-hidden", !showDashboard);

  syncViewTabs();

  setTimeout(() => {
    if (showDashboard && state.maps.dashboard) {
      state.maps.dashboard.invalidateSize();
    }
    if (showCompare) {
      state.maps.compareA?.invalidateSize();
      state.maps.compareB?.invalidateSize();
    }
  }, 0);
}

function createBaseMap(elementId) {
  const map = L.map(elementId, {
    zoomControl: false,
    minZoom: 7,
    maxZoom: 13,
    attributionControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.zoom({ position: isRtlLanguage() ? "topleft" : "topright" }).addTo(map);
  map.fitBounds(ISRAEL_BOUNDS, { padding: [12, 12] });
  return map;
}

function getOrCreateMap(mapKey, elementId) {
  if (!state.maps[mapKey]) {
    state.maps[mapKey] = createBaseMap(elementId);
    state.markerLayers[mapKey] = L.layerGroup().addTo(state.maps[mapKey]);
    state.markerLookups[mapKey] = new Map();
  }
  return state.maps[mapKey];
}

function interpolateColor(startHex, endHex, ratio) {
  const safeRatio = Math.min(1, Math.max(0, ratio));
  const start = startHex.replace("#", "");
  const end = endHex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const startValue = Number.parseInt(start.slice(offset, offset + 2), 16);
    const endValue = Number.parseInt(end.slice(offset, offset + 2), 16);
    return Math.round(startValue + (endValue - startValue) * safeRatio);
  });
  return `#${channels.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function getColorForMetric(metric, value, range) {
  const min = Number.isFinite(range.min) ? range.min : 0;
  const max = Number.isFinite(range.max) && range.max > min ? range.max : min + 1;
  const ratio = (value - min) / (max - min);

  if (metric === "firearm_share") {
    return interpolateColor("#f0d6b7", "#c86a4d", ratio);
  }
  if (metric === "solved_share") {
    return interpolateColor("#d8eadf", "#0a6e71", ratio);
  }
  return interpolateColor("#f1d2ae", "#0a6e71", ratio);
}

function getBubbleRadius(count, maxCount) {
  if (!maxCount) {
    return 7;
  }
  const ratio = count / maxCount;
  return 7 + ratio * 18;
}

function buildMapLegend(container, rows, metric, maxCount) {
  if (!container) {
    return;
  }

  const values = rows.map((row) => row.metricValue);
  const range = {
    min: Math.min(...values, 0),
    max: Math.max(...values, metric === "victims" ? maxCount : 1)
  };
  const smallCount = maxCount ? Math.max(1, Math.round(maxCount * 0.25)) : 1;
  const mediumCount = maxCount ? Math.max(1, Math.round(maxCount * 0.6)) : 1;

  container.innerHTML = `
    <div class="map-legend-title">${getMetricLabel(metric)}</div>
    <div class="map-legend-scale">
      <span class="map-legend-bubble" style="width: 14px; height: 14px; background:${getColorForMetric(metric, smallCount, range)};"></span>
      <span class="map-legend-bubble" style="width: 23px; height: 23px; background:${getColorForMetric(metric, mediumCount, range)};"></span>
      <span class="map-legend-bubble" style="width: 32px; height: 32px; background:${getColorForMetric(metric, maxCount || 1, range)};"></span>
    </div>
    <div class="map-legend-labels">
      <span>${formatNumber(smallCount)}</span>
      <span>${formatNumber(mediumCount)}</span>
      <span>${formatNumber(maxCount || 1)}</span>
    </div>
    <div class="map-legend-gradient"></div>
    <div class="map-legend-labels">
      <span>${getMetricValueForDisplay(metric, range.min)}</span>
      <span>${getMetricValueForDisplay(metric, range.max)}</span>
    </div>
  `;
}

function getMapTooltipHtml(locality, metrics, metricValue, metric) {
  return `
    <div>
      <strong>${getLocalizedLocalityName(locality)}</strong><br />
      ${t("kpi.total")}: ${formatNumber(metrics.victims || 0)}<br />
      ${getMetricLabel(metric)}: ${getMetricValueForDisplay(metric, metricValue)}<br />
      ${t("kpi.solvedShare")}: ${formatPct(metrics.solved_share || 0)}<br />
      ${t("kpi.firearmShare")}: ${formatPct(metrics.firearm_share || 0)}
    </div>
  `;
}

function drawMarkerLayer(mapKey, rows, metric, legendNode, selectedLocalityKey, onSelect, options = {}) {
  const map = state.maps[mapKey];
  const layerGroup = state.markerLayers[mapKey];
  const markerLookup = state.markerLookups[mapKey];

  markerLookup.clear();
  layerGroup.clearLayers();

  if (!rows.length) {
    if (legendNode) {
      legendNode.textContent = "";
    }
    return;
  }

  const maxCount = Math.max(...rows.map((row) => row.victims), 1);
  const values = rows.map((row) => row.metricValue);
  const range = { min: Math.min(...values), max: Math.max(...values) };

  rows.forEach((row) => {
    const selected = row.locality.locality_key === selectedLocalityKey;
    const radius = getBubbleRadius(row.victims, options.maxCount || maxCount);
    const marker = L.circleMarker([row.locality.lat, row.locality.lon], {
      radius,
      weight: selected ? 3 : 1.4,
      color: selected ? "#ffffff" : "rgba(255,255,255,0.85)",
      fillColor: getColorForMetric(metric, row.metricValue, range),
      fillOpacity: selected ? 0.98 : 0.82
    });

    marker.bindTooltip(getMapTooltipHtml(row.locality, row.metrics, row.metricValue, metric), {
      direction: "top",
      offset: [0, -4]
    });
    marker.on("click", () => onSelect(row.locality.locality_key));
    marker.addTo(layerGroup);
    markerLookup.set(row.locality.locality_key, marker);
  });

  buildMapLegend(legendNode, rows, metric, options.maxCount || maxCount);
}

function renderDashboardKpis() {
  ui.dashboardKpis.innerHTML = "";
  const scopeRecords = getDashboardDetailRecords();
  const mapRows = getDashboardMapRows();
  const solvedShare = scopeRecords.length ? scopeRecords.filter((record) => isSolvedForMetrics(record)).length / scopeRecords.length : 0;
  const firearmShare = scopeRecords.length
    ? scopeRecords.filter((record) => record.firearm_involved === "Yes").length / scopeRecords.length
    : 0;

  ui.dashboardKpis.appendChild(createKpi(t("kpi.total"), formatNumber(scopeRecords.length), "primary"));
  ui.dashboardKpis.appendChild(createKpi(t("kpi.firearmShare"), formatPct(firearmShare), "secondary"));

  if (state.selectedLocalityKey) {
    const locality = state.localityByKey.get(state.selectedLocalityKey);
    ui.dashboardKpis.appendChild(createKpi(t("kpi.allYearsTotal"), formatNumber(locality?.all_years_total || 0), "secondary"));
  } else {
    ui.dashboardKpis.appendChild(createKpi(t("kpi.mappedLocalities"), formatNumber(mapRows.length), "secondary"));
  }

  ui.dashboardKpis.appendChild(createKpi(t("kpi.solvedShare"), formatPct(solvedShare), "tertiary"));
}

function renderDashboardCoverageNote() {
  ui.dashboardCoverageNote.classList.add("view-hidden");
  ui.dashboardCoverageNote.textContent = "";
}

function renderLocalityDetailPanel() {
  const locality = state.localityByKey.get(state.selectedLocalityKey);
  ui.localityDetailPanel.innerHTML = "";

  if (!locality) {
    const emptyWrap = document.createElement("div");
    emptyWrap.className = "locality-detail-empty";

    const title = document.createElement("h2");
    title.className = "locality-title";
    title.textContent = t("dashboard.noLocalityTitle");

    const body = document.createElement("p");
    body.textContent = t("dashboard.noLocalityBody");

    const secondary = document.createElement("p");
    secondary.textContent = t("dashboard.noLocalitySecondary");

    const note = document.createElement("p");
    note.textContent = t("dashboard.mappedOnlyNote");

    emptyWrap.append(title, body, secondary, note);
    ui.localityDetailPanel.appendChild(emptyWrap);
    return;
  }

  const metrics = getLocalityMetricsForYear(locality, state.selectedYear);
  const trendSeries = getLocalityTrendSeries(locality.locality_key);
  const recentVictims = getRecentVictimsForLocality(locality.locality_key);

  const title = document.createElement("h2");
  title.className = "locality-title";
  title.textContent = getLocalizedLocalityName(locality);
  ui.localityDetailPanel.appendChild(title);

  const metaWrap = document.createElement("div");
  metaWrap.className = "locality-meta";
  [locality.district_state, locality.geographic_area, getScopeTitle()].filter(Boolean).forEach((value) => {
    const pill = document.createElement("span");
    pill.className = "meta-pill";
    pill.textContent = value;
    metaWrap.appendChild(pill);
  });
  ui.localityDetailPanel.appendChild(metaWrap);

  const metricsGrid = document.createElement("div");
  metricsGrid.className = "locality-metrics";
  [
    [t("detail.totalVictims"), formatNumber(metrics.victims || 0)],
    [t("detail.allYearsTotal"), formatNumber(locality.all_years_total || 0)],
    [t("detail.solvedShare"), formatPct(metrics.solved_share || 0)],
    [t("detail.firearmShare"), formatPct(metrics.firearm_share || 0)]
  ].forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "locality-metric";
    const labelNode = document.createElement("div");
    labelNode.className = "locality-metric-label";
    labelNode.textContent = label;
    const valueNode = document.createElement("div");
    valueNode.className = "locality-metric-value";
    valueNode.textContent = value;
    card.append(labelNode, valueNode);
    metricsGrid.appendChild(card);
  });
  ui.localityDetailPanel.appendChild(metricsGrid);

  const trendTitle = document.createElement("h3");
  trendTitle.textContent = t("dashboard.localityTrend");
  ui.localityDetailPanel.appendChild(trendTitle);

  const trendChart = document.createElement("div");
  trendChart.id = "locality-mini-trend";
  trendChart.className = "chart";
  trendChart.style.minHeight = "180px";
  ui.localityDetailPanel.appendChild(trendChart);

  const recentTitle = document.createElement("h3");
  recentTitle.textContent = t("dashboard.recentVictims");
  ui.localityDetailPanel.appendChild(recentTitle);

  const recentList = document.createElement("div");
  recentList.className = "locality-recent-list";

  recentVictims.forEach((record) => {
    const card = document.createElement("article");
    card.className = "victim-card";

    const header = document.createElement("div");
    header.className = "victim-card-header";

    const nameNode = document.createElement("div");
    nameNode.className = "victim-name";
    nameNode.textContent = getVictimNameForLanguage(record);

    const dateNode = document.createElement("div");
    dateNode.textContent = formatDate(record.canonicalDate);

    header.append(nameNode, dateNode);
    card.appendChild(header);

    const metaNode = document.createElement("div");
    metaNode.className = "victim-meta";
    metaNode.textContent = [
      record.age ? `${t("raw.columns.age")}: ${formatNumber(record.age)}` : "",
      translateFieldValue("weapon_type", record.weapon_type),
      translateFieldValue("solved_status", record.solved_status)
    ]
      .filter(Boolean)
      .join(" • ");
    card.appendChild(metaNode);

    const linksWrap = document.createElement("div");
    linksWrap.className = "victim-links";
    [
      [record.source_url_1, t("table.link1")],
      [record.source_url_2, t("table.link2")]
    ].forEach(([url, label]) => {
      if (!url) {
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = label;
      linksWrap.appendChild(link);
    });
    if (linksWrap.children.length) {
      card.appendChild(linksWrap);
    }

    const snippet = [record.description, record.notes].map((value) => String(value || "").trim()).find(Boolean);
    if (snippet) {
      const noteWrap = document.createElement("div");
      noteWrap.className = "victim-note";
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = t("detail.moreContext");
      const paragraph = document.createElement("p");
      paragraph.textContent = snippet;
      details.append(summary, paragraph);
      noteWrap.appendChild(details);
      card.appendChild(noteWrap);
    }

    recentList.appendChild(card);
  });

  if (!recentVictims.length) {
    const empty = document.createElement("p");
    empty.textContent = t("analyses.noData");
    recentList.appendChild(empty);
  }

  ui.localityDetailPanel.appendChild(recentList);

  Plotly.react(
    trendChart,
    [
      {
        x: trendSeries.map((point) => point.year),
        y: trendSeries.map((point) => point.victims),
        type: "scatter",
        mode: "lines+markers",
        line: { color: "#0a6e71", width: 3 },
        marker: { color: "#c86a4d", size: 8 },
        hovertemplate: `%{x}: %{y}<extra></extra>`
      }
    ],
    {
      ...createPlotTheme(),
      margin: { t: 12, r: isRtlLanguage() ? 20 : 14, b: 34, l: isRtlLanguage() ? 14 : 20 },
      xaxis: { fixedrange: true, automargin: true },
      yaxis: { fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" },
      showlegend: false
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderDashboardLeaderboard() {
  ui.dashboardTopLocalities.innerHTML = "";
  const topRows = getDashboardMapRows().slice(0, 12);

  topRows.forEach((row, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "leaderboard-item";
    if (row.locality.locality_key === state.selectedLocalityKey) {
      button.classList.add("is-active");
    }
    button.addEventListener("click", () => {
      state.selectedLocalityKey = row.locality.locality_key;
      render();
    });

    const rank = document.createElement("span");
    rank.className = "leaderboard-rank";
    rank.textContent = `${index + 1}`;

    const labelWrap = document.createElement("div");
    const nameNode = document.createElement("div");
    nameNode.className = "leaderboard-name";
    nameNode.textContent = getLocalizedLocalityName(row.locality);
    const metaNode = document.createElement("div");
    metaNode.className = "leaderboard-metrics";
    metaNode.textContent = `${t("kpi.solvedShare")}: ${formatPct(row.metrics.solved_share || 0)} • ${t("kpi.firearmShare")}: ${formatPct(
      row.metrics.firearm_share || 0
    )}`;
    labelWrap.append(nameNode, metaNode);

    const valueNode = document.createElement("span");
    valueNode.className = "leaderboard-count";
    valueNode.textContent = formatNumber(row.victims);

    button.append(rank, labelWrap, valueNode);
    ui.dashboardTopLocalities.appendChild(button);
  });
}

function renderDashboardMap() {
  const map = getOrCreateMap("dashboard", "dashboard-map");
  const rows = getDashboardMapRows();

  drawMarkerLayer("dashboard", rows, state.mapMetric, ui.dashboardMapLegend, state.selectedLocalityKey, (localityKey) => {
    state.selectedLocalityKey = localityKey;
    render();
  });

  if (!state.hasFitDashboardMap) {
    map.fitBounds(ISRAEL_BOUNDS, { padding: [12, 12] });
    state.hasFitDashboardMap = true;
  }

  if (state.selectedLocalityKey) {
    const marker = state.markerLookups.dashboard.get(state.selectedLocalityKey);
    if (marker) {
      map.panTo(marker.getLatLng(), { animate: true });
    }
  }
}

function renderYearTrendChart() {
  const records = getDashboardTrendRecords();
  const grouped = new Map();
  records.forEach((record) => {
    grouped.set(record.year, (grouped.get(record.year) || 0) + 1);
  });

  const projection = !state.selectedLocalityKey ? computeYearPaceProjection(records, TRAJECTORY_YEAR) : null;
  const points = state.years.map((year) => [year, grouped.get(year) || 0]);
  const traces = [
    {
      x: points.map((point) => point[0]),
      y: points.map((point) => point[1]),
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#0a6e71", width: 3 },
      marker: {
        size: points.map((point) => (String(point[0]) === String(state.selectedYear) ? 11 : 8)),
        color: points.map((point) => (String(point[0]) === String(state.selectedYear) ? "#c86a4d" : "#0f2430"))
      },
      hovertemplate: `%{x}: %{y}<extra></extra>`
    }
  ];

  if (projection) {
    traces.push({
      x: [projection.year, projection.year],
      y: [projection.actualCount, projection.projectedCount],
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#c86a4d", width: 2, dash: "dash" },
      marker: { color: "#c86a4d", size: 7 },
      hovertemplate: `%{x}: %{y}<extra></extra>`,
      showlegend: false
    });
  }

  Plotly.react(
    "chart-year-trend",
    traces,
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.year"), fixedrange: true, automargin: true },
      yaxis: { title: t("axis.victims"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" },
      showlegend: false
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderMonthlyChart(records) {
  const monthly = Array.from({ length: 12 }, (_, index) => [index + 1, 0]);
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
        line: { color: "#184d73", width: 3 },
        marker: { color: "#0a6e71", size: 7 },
        hovertemplate: `%{x}: %{y}<extra></extra>`
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: {
        title: t("axis.month"),
        tickmode: "array",
        tickvals: monthly.map((entry) => entry[0]),
        ticktext: getMonthLabels(),
        fixedrange: true,
        automargin: true
      },
      yaxis: { title: t("axis.victims"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" },
      showlegend: false
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderWeaponChart(records) {
  const grouped = new Map();
  records.forEach((record) => {
    const key = (record.weapon_type || "Unknown").toString().trim() || "Unknown";
    grouped.set(key, (grouped.get(key) || 0) + 1);
  });
  const entries = [...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);

  Plotly.react(
    "chart-weapon",
    [
      {
        labels: entries.map((entry) => translateFieldValue("weapon_type", entry[0])),
        values: entries.map((entry) => entry[1]),
        type: "pie",
        hole: 0.48,
        marker: { colors: ["#0a6e71", "#c86a4d", "#184d73", "#8a684a", "#88986b", "#ba8c4f", "#7a8792"] }
      }
    ],
    {
      ...createPlotTheme(),
      margin: { t: 16, r: 10, b: 10, l: 10 },
      showlegend: true
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderGenderChart(records) {
  const yearsInScope = [...new Set(records.map((record) => record.year).filter(Number.isFinite))];
  if (yearsInScope.length <= 1) {
    const entries = ["Male", "Female"]
      .map((gender) => [gender, records.filter((record) => record.gender === gender).length])
      .filter((entry) => entry[1] > 0);

    Plotly.react(
      "chart-gender-trend",
      [
        {
          labels: entries.map((entry) => translateEnum("gender", entry[0])),
          values: entries.map((entry) => entry[1]),
          type: "pie",
          hole: 0.44,
          marker: { colors: ["#184d73", "#c86a4d"] },
          hovertemplate: `%{label}: %{value}<extra></extra>`
        }
      ],
      {
        ...createPlotTheme(),
        margin: { t: 16, r: 10, b: 10, l: 10 }
      },
      { displayModeBar: false, responsive: true }
    );
    return;
  }

  const traces = ["Male", "Female"].map((gender) => ({
    x: state.years,
    y: state.years.map((year) => records.filter((record) => record.year === year && record.gender === gender).length),
    type: "bar",
    name: translateEnum("gender", gender),
    marker: { color: gender === "Male" ? "#184d73" : "#c86a4d" }
  }));

  Plotly.react(
    "chart-gender-trend",
    traces,
    {
      ...createPlotTheme(),
      barmode: "stack",
      xaxis: { title: t("axis.year"), fixedrange: true, automargin: true },
      yaxis: { title: t("axis.victims"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderDashboard() {
  renderDashboardKpis();
  renderDashboardCoverageNote();
  renderMetricSelect(ui.dashboardMetricSelect, state.mapMetric);
  renderDashboardMap();
  renderLocalityDetailPanel();
  renderDashboardLeaderboard();
  renderYearTrendChart();
  const scopeRecords = getDashboardDetailRecords();
  renderMonthlyChart(scopeRecords);
  renderWeaponChart(scopeRecords);
  renderGenderChart(scopeRecords);
}

function getCompareScopeRecords(year) {
  let records = state.mainRecords.filter((record) => String(record.year) === String(year));
  if (state.compareSelectedLocalityKey) {
    records = records.filter((record) => record.locality_key === state.compareSelectedLocalityKey);
  }
  return records;
}

function getCompareLocalityRows() {
  return state.localitySummary.localities
    .map((locality) => {
      const aMetrics = getLocalityMetricsForYear(locality, state.compareYearA);
      const bMetrics = getLocalityMetricsForYear(locality, state.compareYearB);
      const row = {
        locality,
        victimsA: aMetrics.victims || 0,
        victimsB: bMetrics.victims || 0,
        delta: (bMetrics.victims || 0) - (aMetrics.victims || 0),
        absDelta: Math.abs((bMetrics.victims || 0) - (aMetrics.victims || 0)),
        firearmDelta: (bMetrics.firearm_share || 0) - (aMetrics.firearm_share || 0),
        solvedDelta: (bMetrics.solved_share || 0) - (aMetrics.solved_share || 0),
        metricsA: aMetrics,
        metricsB: bMetrics
      };
      return row.victimsA > 0 || row.victimsB > 0 ? row : null;
    })
    .filter(Boolean);
}

function sortCompareRows(rows) {
  const direction = state.compareSortDirection === "asc" ? 1 : -1;
  const sorted = [...rows];
  sorted.sort((left, right) => {
    const leftValue = state.compareSortKey === "locality" ? getLocalizedLocalityName(left.locality) : left[state.compareSortKey];
    const rightValue = state.compareSortKey === "locality" ? getLocalizedLocalityName(right.locality) : right[state.compareSortKey];
    if (typeof leftValue === "string" || typeof rightValue === "string") {
      return direction * String(leftValue).localeCompare(String(rightValue), getLocale(), { sensitivity: "base" });
    }
    return direction * ((leftValue || 0) - (rightValue || 0));
  });
  return sorted;
}

function renderCompareKpis(rows) {
  ui.compareKpis.innerHTML = "";

  const yearARecords = getCompareScopeRecords(state.compareYearA);
  const yearBRecords = getCompareScopeRecords(state.compareYearB);
  const totalA = yearARecords.length;
  const totalB = yearBRecords.length;
  const delta = totalB - totalA;
  const deltaPct = totalA > 0 ? delta / totalA : null;
  const firearmShareA = totalA ? yearARecords.filter((record) => record.firearm_involved === "Yes").length / totalA : 0;
  const firearmShareB = totalB ? yearBRecords.filter((record) => record.firearm_involved === "Yes").length / totalB : 0;
  const solvedShareA = totalA ? yearARecords.filter((record) => isSolvedForMetrics(record)).length / totalA : 0;
  const solvedShareB = totalB ? yearBRecords.filter((record) => isSolvedForMetrics(record)).length / totalB : 0;

  ui.compareKpis.appendChild(createKpi(t("compare.totalA"), formatNumber(totalA), "primary"));
  ui.compareKpis.appendChild(createKpi(t("compare.totalB"), formatNumber(totalB), "primary"));
  ui.compareKpis.appendChild(createKpi(t("compare.delta"), formatSignedNumber(delta), "secondary"));
  ui.compareKpis.appendChild(createKpi(t("compare.deltaPct"), deltaPct === null ? t("analyses.labels.notAvailable") : formatPct(deltaPct), "secondary"));
  ui.compareKpis.appendChild(createKpi(t("compare.firearmDelta"), formatPctPointDelta(firearmShareB - firearmShareA), "secondary"));
  ui.compareKpis.appendChild(createKpi(t("compare.solvedDelta"), formatPctPointDelta(solvedShareB - solvedShareA), "secondary"));
}

function renderCompareSummaries() {
  const yearARecords = getCompareScopeRecords(state.compareYearA);
  const yearBRecords = getCompareScopeRecords(state.compareYearB);
  const metaA = state.yearMeta.get(Number(state.compareYearA));
  const metaB = state.yearMeta.get(Number(state.compareYearB));

  ui.compareMapTitleA.textContent = formatYear(state.compareYearA);
  ui.compareMapTitleB.textContent = formatYear(state.compareYearB);

  ui.compareMapSummaryA.textContent = `${t("kpi.total")}: ${formatNumber(yearARecords.length)}${metaA?.partial ? ` • ${t("dashboard.partialYear").replace("{year}", formatYear(state.compareYearA)).replace("{date}", formatDate(metaA.latestIso))}` : ""}`;
  ui.compareMapSummaryB.textContent = `${t("kpi.total")}: ${formatNumber(yearBRecords.length)}${metaB?.partial ? ` • ${t("dashboard.partialYear").replace("{year}", formatYear(state.compareYearB)).replace("{date}", formatDate(metaB.latestIso))}` : ""}`;

  const partialNote = metaA?.partial || metaB?.partial;
  ui.comparePartialNote.classList.toggle("view-hidden", !partialNote);
  ui.comparePartialNote.textContent = partialNote ? t("compare.partialNote") : "";
}

function renderCompareMaps(rows) {
  getOrCreateMap("compareA", "compare-map-a");
  getOrCreateMap("compareB", "compare-map-b");

  if (!state.hasFitCompareMaps) {
    setupCompareMapSync();
    state.maps.compareA.fitBounds(ISRAEL_BOUNDS, { padding: [12, 12] });
    state.maps.compareB.fitBounds(ISRAEL_BOUNDS, { padding: [12, 12] });
    state.hasFitCompareMaps = true;
  }

  const maxCount = Math.max(...rows.map((row) => Math.max(row.victimsA, row.victimsB)), 1);
  const mapRowsA = rows
    .filter((row) => row.victimsA > 0 || row.locality.locality_key === state.compareSelectedLocalityKey)
    .map((row) => ({
      locality: row.locality,
      metrics: row.metricsA,
      victims: row.victimsA,
      metricValue: getLocalityMetricValue(row.locality, state.compareYearA, state.compareMapMetric)
    }));
  const mapRowsB = rows
    .filter((row) => row.victimsB > 0 || row.locality.locality_key === state.compareSelectedLocalityKey)
    .map((row) => ({
      locality: row.locality,
      metrics: row.metricsB,
      victims: row.victimsB,
      metricValue: getLocalityMetricValue(row.locality, state.compareYearB, state.compareMapMetric)
    }));

  drawMarkerLayer("compareA", mapRowsA, state.compareMapMetric, ui.compareMapLegendA, state.compareSelectedLocalityKey, (localityKey) => {
    state.compareSelectedLocalityKey = localityKey;
    render();
  }, { maxCount });
  drawMarkerLayer("compareB", mapRowsB, state.compareMapMetric, ui.compareMapLegendB, state.compareSelectedLocalityKey, (localityKey) => {
    state.compareSelectedLocalityKey = localityKey;
    render();
  }, { maxCount });

  if (state.compareSelectedLocalityKey) {
    const marker = state.markerLookups.compareA.get(state.compareSelectedLocalityKey) || state.markerLookups.compareB.get(state.compareSelectedLocalityKey);
    if (marker) {
      state.maps.compareA.panTo(marker.getLatLng(), { animate: true });
      state.maps.compareB.panTo(marker.getLatLng(), { animate: true });
    }
  }
}

function setupCompareMapSync() {
  const syncHandler = (sourceKey, targetKey) => {
    state.maps[sourceKey].on("moveend zoomend", () => {
      if (state.isSyncingCompareMaps) {
        return;
      }
      state.isSyncingCompareMaps = true;
      const center = state.maps[sourceKey].getCenter();
      const zoom = state.maps[sourceKey].getZoom();
      state.maps[targetKey].setView(center, zoom, { animate: false });
      state.isSyncingCompareMaps = false;
    });
  };

  syncHandler("compareA", "compareB");
  syncHandler("compareB", "compareA");
}

function renderCompareMonthlyChart() {
  const recordsA = getCompareScopeRecords(state.compareYearA);
  const recordsB = getCompareScopeRecords(state.compareYearB);
  const seriesFor = (records) => {
    const monthly = Array.from({ length: 12 }, (_, index) => [index + 1, 0]);
    records.forEach((record) => {
      if (record.monthNum && record.monthNum >= 1 && record.monthNum <= 12) {
        monthly[record.monthNum - 1][1] += 1;
      }
    });
    return monthly;
  };

  const monthlyA = seriesFor(recordsA);
  const monthlyB = seriesFor(recordsB);

  Plotly.react(
    "chart-compare-monthly",
    [
      {
        x: monthlyA.map((entry) => entry[0]),
        y: monthlyA.map((entry) => entry[1]),
        type: "scatter",
        mode: "lines+markers",
        name: formatYear(state.compareYearA),
        line: { color: "#184d73", width: 3 },
        marker: { color: "#184d73", size: 7 }
      },
      {
        x: monthlyB.map((entry) => entry[0]),
        y: monthlyB.map((entry) => entry[1]),
        type: "scatter",
        mode: "lines+markers",
        name: formatYear(state.compareYearB),
        line: { color: "#c86a4d", width: 3 },
        marker: { color: "#c86a4d", size: 7 }
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: {
        title: t("axis.month"),
        tickmode: "array",
        tickvals: monthlyA.map((entry) => entry[0]),
        ticktext: getMonthLabels(),
        fixedrange: true,
        automargin: true
      },
      yaxis: { title: t("axis.victims"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderCompareDeltaChart(rows) {
  const topRows = [...rows].sort((a, b) => b.absDelta - a.absDelta).slice(0, 12).reverse();

  Plotly.react(
    "chart-compare-delta",
    [
      {
        y: topRows.map((row) => getLocalizedLocalityName(row.locality)),
        x: topRows.map((row) => row.delta),
        type: "bar",
        orientation: "h",
        marker: { color: topRows.map((row) => (row.delta >= 0 ? "#c86a4d" : "#0a6e71")) },
        hovertemplate: "%{y}: %{x:+d}<extra></extra>"
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: { title: t("compare.delta"), fixedrange: true, automargin: true },
      yaxis: { fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" },
      showlegend: false
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderCompareTable(rows) {
  const columns = [
    ["locality", "locality"],
    ["victimsA", "yearA"],
    ["victimsB", "yearB"],
    ["delta", "delta"],
    ["firearmDelta", "firearmDelta"],
    ["solvedDelta", "solvedDelta"]
  ];

  ui.compareTableHead.innerHTML = "";
  ui.compareTableBody.innerHTML = "";

  const headerRow = document.createElement("tr");
  columns.forEach(([sortKey, labelKey]) => {
    const cell = document.createElement("th");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sortable-header";
    button.textContent = t(`compare.table.${labelKey}`);
    if (state.compareSortKey === sortKey) {
      button.classList.add("is-active");
      button.textContent += state.compareSortDirection === "asc" ? " ↑" : " ↓";
    }
    button.addEventListener("click", () => {
      if (state.compareSortKey === sortKey) {
        state.compareSortDirection = state.compareSortDirection === "asc" ? "desc" : "asc";
      } else {
        state.compareSortKey = sortKey;
        state.compareSortDirection = sortKey === "locality" ? "asc" : "desc";
      }
      render();
    });
    cell.appendChild(button);
    headerRow.appendChild(cell);
  });
  ui.compareTableHead.appendChild(headerRow);

  sortCompareRows(rows).forEach((row) => {
    const tr = document.createElement("tr");
    if (row.locality.locality_key === state.compareSelectedLocalityKey) {
      tr.classList.add("is-active");
    }
    tr.addEventListener("click", () => {
      state.compareSelectedLocalityKey = row.locality.locality_key;
      render();
    });
    tr.appendChild(createTextCell(getLocalizedLocalityName(row.locality)));
    tr.appendChild(createTextCell(formatNumber(row.victimsA)));
    tr.appendChild(createTextCell(formatNumber(row.victimsB)));
    tr.appendChild(createTextCell(formatSignedNumber(row.delta)));
    tr.appendChild(createTextCell(formatPctPointDelta(row.firearmDelta)));
    tr.appendChild(createTextCell(formatPctPointDelta(row.solvedDelta)));
    ui.compareTableBody.appendChild(tr);
  });
}

function renderCompare() {
  renderCompareYearSelects();
  renderMetricSelect(ui.compareMetricSelect, state.compareMapMetric);
  renderCompareSearchOptions();

  const rows = getCompareLocalityRows();
  renderCompareSummaries();
  renderCompareKpis(rows);
  renderCompareMaps(rows);
  renderCompareMonthlyChart();
  renderCompareDeltaChart(rows);
  renderCompareTable(rows);
}

function renderRamadanAnalysisKpis(rows) {
  ui.ramadanAnalysisKpis.innerHTML = "";
  if (!rows.length) {
    ui.ramadanAnalysisKpis.appendChild(createKpi(t("analyses.kpis.totalVictims"), t("analyses.noData"), "secondary"));
    return;
  }

  const totalRamadanVictims = rows.reduce((sum, row) => sum + row.ramadanVictims, 0);
  const averageShare = average(rows.map((row) => row.shareOfYear));
  const yearsAboveBaseline = rows.filter((row) => Number.isFinite(row.rateRatio) && row.rateRatio > 1).length;
  const averageRatio = average(rows.map((row) => row.rateRatio));

  ui.ramadanAnalysisKpis.appendChild(createKpi(t("analyses.kpis.totalVictims"), formatNumber(totalRamadanVictims), "primary"));
  ui.ramadanAnalysisKpis.appendChild(createKpi(t("analyses.kpis.avgShare"), formatPct(averageShare), "secondary"));
  ui.ramadanAnalysisKpis.appendChild(
    createKpi(t("analyses.kpis.aboveBaseline"), `${formatNumber(yearsAboveBaseline)} / ${formatNumber(rows.length)}`, "secondary")
  );
  ui.ramadanAnalysisKpis.appendChild(createKpi(t("analyses.kpis.avgRatio"), formatRatioValue(averageRatio), "secondary"));
}

function renderRamadanNominalChart(rows) {
  Plotly.react(
    "chart-ramadan-nominal",
    [{ x: rows.map((row) => row.year), y: rows.map((row) => row.ramadanVictims), type: "bar", marker: { color: "#0a6e71" } }],
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.year"), fixedrange: true, automargin: true },
      yaxis: { title: t("axis.victims"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderRamadanShareChart(rows) {
  Plotly.react(
    "chart-ramadan-share",
    [
      {
        x: rows.map((row) => row.year),
        y: rows.map((row) => row.shareOfYear),
        type: "scatter",
        mode: "lines+markers",
        line: { color: "#c86a4d", width: 3 },
        marker: { color: "#184d73", size: 8 }
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.year"), fixedrange: true, automargin: true },
      yaxis: {
        title: t("axis.shareOfYear"),
        tickformat: ".0%",
        fixedrange: true,
        automargin: true,
        side: isRtlLanguage() ? "right" : "left"
      }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderRamadanRateRatioChart(rows) {
  Plotly.react(
    "chart-ramadan-rate-ratio",
    [{ x: rows.map((row) => row.year), y: rows.map((row) => row.rateRatio), type: "bar", marker: { color: "#184d73" } }],
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.year"), fixedrange: true, automargin: true },
      yaxis: { title: t("axis.rateRatio"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" },
      shapes: [{ type: "line", xref: "paper", yref: "y", x0: 0, x1: 1, y0: 1, y1: 1, line: { color: "#8a684a", dash: "dot" } }]
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderRamadanExcessChart(rows) {
  Plotly.react(
    "chart-ramadan-excess",
    [
      {
        x: rows.map((row) => row.year),
        y: rows.map((row) => row.excessVictims),
        type: "bar",
        marker: { color: rows.map((row) => (row.excessVictims >= 0 ? "#c86a4d" : "#0a6e71")) }
      }
    ],
    {
      ...createPlotTheme(),
      xaxis: { title: t("axis.year"), fixedrange: true, automargin: true },
      yaxis: { title: t("axis.excessVictims"), fixedrange: true, automargin: true, side: isRtlLanguage() ? "right" : "left" },
      shapes: [{ type: "line", xref: "paper", yref: "y", x0: 0, x1: 1, y0: 0, y1: 0, line: { color: "#8a684a", dash: "dot" } }]
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderRamadanAnalysisTable(rows) {
  ui.ramadanAnalysisTableHead.innerHTML = "";
  ui.ramadanAnalysisTableBody.innerHTML = "";

  const columns = ["year", "period", "victims", "share", "ramadanRate", "restRate", "ratio", "excess", "firearmDelta", "solvedDelta", "coverage"];
  const headerRow = document.createElement("tr");
  columns.forEach((columnKey) => {
    const cell = document.createElement("th");
    cell.textContent = t(`analyses.table.${columnKey}`);
    headerRow.appendChild(cell);
  });
  ui.ramadanAnalysisTableHead.appendChild(headerRow);

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createTextCell(formatYear(row.year)));
    tr.appendChild(createTextCell(`${formatDate(row.periodStartIso)} - ${formatDate(row.observedRamadanEndIso)}`));
    tr.appendChild(createTextCell(formatNumber(row.ramadanVictims)));
    tr.appendChild(createTextCell(formatPct(row.shareOfYear)));
    tr.appendChild(createTextCell(formatPerDay(row.ramadanDailyRate)));
    tr.appendChild(createTextCell(formatPerDay(row.nonRamadanDailyRate)));
    tr.appendChild(createTextCell(formatRatioValue(row.rateRatio)));
    tr.appendChild(createTextCell(formatSignedNumber(row.excessVictims, 1, 1)));
    tr.appendChild(createTextCell(formatPctPointDelta(row.firearmShareDelta)));
    tr.appendChild(createTextCell(formatPctPointDelta(row.solvedShareDelta)));

    const coverageCell = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = "status-pill status-pill-complete";
    pill.textContent = t("analyses.labels.complete");
    coverageCell.appendChild(pill);
    tr.appendChild(coverageCell);

    ui.ramadanAnalysisTableBody.appendChild(tr);
  });
}

function renderRamadanAnalysisTab() {
  const rows = computeRamadanAnalysisRows();
  renderRamadanAnalysisKpis(rows);
  renderRamadanNominalChart(rows);
  renderRamadanShareChart(rows);
  renderRamadanRateRatioChart(rows);
  renderRamadanExcessChart(rows);
  renderRamadanAnalysisTable(rows);
}

function renderCountryComparisonYearTabs() {
  ui.countryComparisonYearTabs.innerHTML = "";

  getAvailableCountryComparisonYears()
    .slice()
    .sort((a, b) => b - a)
    .forEach((year) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "raw-year-tab";
      button.dataset.countryComparisonYear = String(year);
      button.textContent = formatYear(year);
      button.classList.toggle("is-active", Number(state.analysisCountryComparisonYear) === year);
      ui.countryComparisonYearTabs.appendChild(button);
    });
}

function renderCountryComparisonKpis(snapshot) {
  ui.countryComparisonKpis.innerHTML = "";
  if (!snapshot.year) {
    ui.countryComparisonKpis.appendChild(createKpi(t("analyses.countryComparison.kpis.rate"), t("analyses.noData"), "secondary"));
    return;
  }

  ui.countryComparisonKpis.appendChild(
    createKpi(
      t("analyses.countryComparison.kpis.rate"),
      Number.isFinite(snapshot.localRate) ? formatRatePer100k(snapshot.localRate) : t("analyses.labels.notAvailable"),
      "primary"
    )
  );
  ui.countryComparisonKpis.appendChild(
    createKpi(t("analyses.countryComparison.kpis.victims"), formatNumber(snapshot.victims), "secondary")
  );
  ui.countryComparisonKpis.appendChild(
    createKpi(
      t("analyses.countryComparison.kpis.population"),
      Number.isFinite(snapshot.population) ? formatNumber(snapshot.population) : t("analyses.labels.notAvailable"),
      "tertiary"
    )
  );
  ui.countryComparisonKpis.appendChild(
    createKpi(t("analyses.countryComparison.kpis.countries"), formatNumber(snapshot.comparators.length), "secondary")
  );
  ui.countryComparisonKpis.appendChild(
    createKpi(
      t("analyses.countryComparison.kpis.rank"),
      snapshot.hasComparators && snapshot.localRow ? `${formatNumber(snapshot.localRow.rank)} / ${formatNumber(snapshot.rows.length)}` : t("analyses.labels.notAvailable"),
      "secondary"
    )
  );
}

function renderCountryComparisonChart(snapshot) {
  if (!snapshot.hasComparators || !snapshot.localRow) {
    Plotly.react(
      "chart-country-comparison-rates",
      [],
      {
        ...createPlotTheme(),
        xaxis: { visible: false, fixedrange: true },
        yaxis: { visible: false, fixedrange: true },
        annotations: [
          {
            text: snapshot.year ? tFormat("analyses.countryComparison.noCountryData", { year: formatYear(snapshot.year) }) : t("analyses.noData"),
            showarrow: false,
            xref: "paper",
            yref: "paper",
            x: 0.5,
            y: 0.5
          }
        ]
      },
      { displayModeBar: false, responsive: true }
    );
    return;
  }

  Plotly.react(
    "chart-country-comparison-rates",
    [
      {
        x: snapshot.rows.map((row) => row.ratePer100k),
        y: snapshot.rows.map((row) => getCountryComparisonDisplayLabel(row)),
        type: "bar",
        orientation: "h",
        marker: {
          color: snapshot.rows.map((row) => (row.isArabSociety ? "#c86a4d" : "#0a6e71"))
        },
        hovertemplate: "%{y}<br>%{x:.2f}<extra></extra>"
      }
    ],
    {
      ...createPlotTheme(),
      height: Math.max(420, snapshot.rows.length * 30 + 140),
      margin: { ...createPlotTheme().margin, l: 180 },
      xaxis: { title: t("axis.ratePer100k"), fixedrange: true, automargin: true },
      yaxis: { autorange: "reversed", fixedrange: true, automargin: true }
    },
    { displayModeBar: false, responsive: true }
  );
}

function renderCountryComparisonTable(snapshot) {
  ui.countryComparisonTableHead.innerHTML = "";
  ui.countryComparisonTableBody.innerHTML = "";

  const columns = ["entity", "year", "rate", "delta", "source"];
  const headerRow = document.createElement("tr");
  columns.forEach((columnKey) => {
    const cell = document.createElement("th");
    cell.textContent = t(`analyses.countryComparison.table.${columnKey}`);
    headerRow.appendChild(cell);
  });
  ui.countryComparisonTableHead.appendChild(headerRow);

  if (!snapshot.hasComparators || !snapshot.localRow) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = columns.length;
    td.textContent = snapshot.year ? tFormat("analyses.countryComparison.noCountryData", { year: formatYear(snapshot.year) }) : t("analyses.noData");
    tr.appendChild(td);
    ui.countryComparisonTableBody.appendChild(tr);
    return;
  }

  snapshot.rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.classList.toggle("is-highlighted", row.isArabSociety);
    tr.appendChild(createTextCell(getCountryComparisonDisplayLabel(row)));
    tr.appendChild(createTextCell(formatYear(row.sourceYear)));
    tr.appendChild(createTextCell(formatRatePer100k(row.ratePer100k)));
    tr.appendChild(createTextCell(row.isArabSociety ? formatDecimal(0, 2, 2) : formatSignedNumber(row.deltaVsArabSociety, 2, 2)));
    tr.appendChild(createSingleSourceLinkCell(row.sourceUrl, row.sourceLabel || t("analyses.countryComparison.sourceLink")));
    ui.countryComparisonTableBody.appendChild(tr);
  });
}

function renderCountryComparisonAnalysisTab() {
  const snapshot = getCountryComparisonSnapshot();
  const formattedYear = snapshot.year ? formatYear(snapshot.year) : "";

  renderCountryComparisonYearTabs();
  ui.countryComparisonNote.textContent = snapshot.year
    ? `${t("analyses.countryComparison.disclaimer")} ${tFormat("analyses.countryComparison.noCountryData", { year: formattedYear })}`.trim()
    : t("analyses.countryComparison.disclaimer");
  if (snapshot.hasComparators) {
    ui.countryComparisonNote.textContent = t("analyses.countryComparison.disclaimer");
  }
  if (snapshot.hasProvisionalData && snapshot.year) {
    ui.countryComparisonNote.textContent = `${ui.countryComparisonNote.textContent} ${tFormat("analyses.countryComparison.provisionalNote", {
      year: formattedYear
    })}`.trim();
  }
  ui.countryComparisonMethodology.innerHTML = "";

  if (snapshot.year) {
    const methodologyText = document.createElement("span");
    const methodologyKey = snapshot.hasProvisionalData
      ? "analyses.countryComparison.provisionalMethodology"
      : "analyses.countryComparison.methodology";
    methodologyText.textContent = `${tFormat(methodologyKey, {
      year: formattedYear,
      count: formatNumber(snapshot.comparators.length)
    })} `;
    ui.countryComparisonMethodology.appendChild(methodologyText);

    if (snapshot.populationSourceUrl) {
      ui.countryComparisonMethodology.appendChild(
        createExternalLink(
          snapshot.populationSourceUrl,
          snapshot.populationSourceLabel || "CBS",
          "comparison-source-link"
        )
      );
    }

    if (snapshot.methodology?.countryRateSourceUrl && !snapshot.hasProvisionalData) {
      const separator = document.createElement("span");
      separator.textContent = " • ";
      ui.countryComparisonMethodology.appendChild(separator);
      ui.countryComparisonMethodology.appendChild(
        createExternalLink(
          snapshot.methodology.countryRateSourceUrl,
          snapshot.methodology.countryRateSource || "World Bank",
          "comparison-source-link"
        )
      );
    }
  } else {
    ui.countryComparisonMethodology.textContent = t("analyses.noData");
  }

  renderCountryComparisonKpis(snapshot);
  renderCountryComparisonChart(snapshot);
  renderCountryComparisonTable(snapshot);
}

function renderAnalyses() {
  const showRamadan = state.analysisTab === "ramadan";
  ui.analysisSubviewRamadan.classList.toggle("view-hidden", !showRamadan);
  ui.analysisSubviewCountryComparison.classList.toggle("view-hidden", showRamadan);
  syncAnalysisTabs();

  if (showRamadan) {
    renderRamadanAnalysisTab();
    return;
  }

  renderCountryComparisonAnalysisTab();
}

function serializeUrlState() {
  const params = new URLSearchParams();
  params.set("view", state.activeView);
  params.set("lang", state.language);
  params.set("year", state.selectedYear);
  params.set("metric", state.mapMetric);
  params.set("analysisTab", state.analysisTab);
  if (state.analysisCountryComparisonYear) {
    params.set("analysisCompareYear", state.analysisCountryComparisonYear);
  }
  if (state.selectedLocalityKey) {
    params.set("locality", state.selectedLocalityKey);
  }
  params.set("compareYearA", state.compareYearA);
  params.set("compareYearB", state.compareYearB);
  params.set("compareMetric", state.compareMapMetric);
  if (state.compareSelectedLocalityKey) {
    params.set("compareLocality", state.compareSelectedLocalityKey);
  }
  return params;
}

function commitUrlState() {
  const params = serializeUrlState();
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
}

function hydrateStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const language = params.get("lang");
  if (language && LANGUAGE_META[language]) {
    state.language = language;
  }

  const view = params.get("view");
  if (["dashboard", "compare", "analyses", "raw"].includes(view)) {
    state.activeView = view;
  }

  const analysisTab = params.get("analysisTab");
  if (analysisTab && ANALYSIS_TABS.includes(analysisTab)) {
    state.analysisTab = analysisTab;
  }

  const analysisCompareYear = Number(params.get("analysisCompareYear"));
  if (getAvailableCountryComparisonYears().includes(analysisCompareYear)) {
    state.analysisCountryComparisonYear = analysisCompareYear;
  }

  const year = params.get("year");
  if (year === ALL_FILTER_VALUE || state.years.includes(Number(year))) {
    state.selectedYear = year || ALL_FILTER_VALUE;
  }

  const locality = params.get("locality");
  if (locality && state.localityByKey.has(locality)) {
    state.selectedLocalityKey = locality;
  }

  const metric = params.get("metric");
  if (metric && MAP_METRICS.includes(metric)) {
    state.mapMetric = metric;
  }

  const compareMetric = params.get("compareMetric");
  if (compareMetric && MAP_METRICS.includes(compareMetric)) {
    state.compareMapMetric = compareMetric;
  }

  const [defaultYearA, defaultYearB] = getDefaultCompareYears();
  const compareYearA = Number(params.get("compareYearA"));
  const compareYearB = Number(params.get("compareYearB"));
  state.compareYearA = state.years.includes(compareYearA) ? compareYearA : defaultYearA;
  state.compareYearB = state.years.includes(compareYearB) ? compareYearB : defaultYearB;

  const compareLocality = params.get("compareLocality");
  if (compareLocality && state.localityByKey.has(compareLocality)) {
    state.compareSelectedLocalityKey = compareLocality;
  }
}

function render() {
  applyStaticTranslations();
  renderYearFilterControl();
  renderActiveView();
  commitUrlState();

  if (state.activeView === "dashboard") {
    renderDashboard();
  } else if (state.activeView === "compare") {
    renderCompare();
  } else if (state.activeView === "analyses") {
    renderAnalyses();
  } else if (state.activeView === "raw") {
    renderRawYearTabs();
    renderRawTable();
  }
}

function setupEvents() {
  ui.yearSelect.addEventListener("change", (event) => {
    state.selectedYear = event.target.value || ALL_FILTER_VALUE;
    render();
  });

  ui.yearPrev.addEventListener("click", () => {
    shiftSelectedYear(-1);
  });

  ui.yearNext.addEventListener("click", () => {
    shiftSelectedYear(1);
  });

  ui.viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextView = tab.dataset.view;
      if (!nextView || nextView === state.activeView) {
        return;
      }
      state.activeView = nextView;
      render();
    });
  });

  ui.analysisTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextTab = tab.dataset.analysisTab;
      if (!nextTab || nextTab === state.analysisTab || !ANALYSIS_TABS.includes(nextTab)) {
        return;
      }
      state.analysisTab = nextTab;
      render();
    });
  });

  ui.countryComparisonYearTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-country-comparison-year]");
    if (!button) {
      return;
    }
    const nextYear = Number(button.dataset.countryComparisonYear);
    if (!getAvailableCountryComparisonYears().includes(nextYear) || nextYear === state.analysisCountryComparisonYear) {
      return;
    }
    state.analysisCountryComparisonYear = nextYear;
    render();
  });

  ui.languageChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const nextLanguage = chip.dataset.lang;
      if (!nextLanguage || nextLanguage === state.language) {
        return;
      }
      setLanguage(nextLanguage);
      render();
    });
  });

  ui.dashboardMetricSelect.addEventListener("change", (event) => {
    state.mapMetric = event.target.value;
    render();
  });

  ui.dashboardClearLocality.addEventListener("click", () => {
    state.selectedLocalityKey = "";
    render();
  });

  ui.compareYearASelect.addEventListener("change", (event) => {
    state.compareYearA = Number(event.target.value);
    render();
  });

  ui.compareYearBSelect.addEventListener("change", (event) => {
    state.compareYearB = Number(event.target.value);
    render();
  });

  ui.compareMetricSelect.addEventListener("change", (event) => {
    state.compareMapMetric = event.target.value;
    render();
  });

  ui.compareLocalitySearch.addEventListener("change", (event) => {
    const value = event.target.value.trim();
    if (!value) {
      state.compareSelectedLocalityKey = "";
      render();
      return;
    }

    const directMatch = state.compareLocalityNameLookup.get(value);
    if (directMatch) {
      state.compareSelectedLocalityKey = directMatch;
      render();
      return;
    }

    const partialMatch = state.localitySummary.localities.find((locality) => {
      const localized = getLocalizedLocalityName(locality).toLowerCase();
      return localized.includes(value.toLowerCase()) || locality.locality_name_he.includes(value);
    });
    if (partialMatch) {
      state.compareSelectedLocalityKey = partialMatch.locality_key;
      render();
    }
  });

  ui.compareResetLocality.addEventListener("click", () => {
    state.compareSelectedLocalityKey = "";
    render();
  });

  ui.rawYearTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-raw-year]");
    if (!button) {
      return;
    }
    state.rawYear = button.dataset.rawYear;
    render();
  });

  ui.rawShowAllColumns.addEventListener("change", (event) => {
    state.rawShowAllColumns = event.target.checked;
    render();
  });
}

async function initialize() {
  setLanguage(state.language, { persist: false });

  try {
    const [rawRecords, localitySummary, analysisCountryComparison] = await Promise.all([
      fetchJson(DATA_PATHS.records),
      fetchJson(DATA_PATHS.localitySummary),
      fetchOptionalJson(DATA_PATHS.analysisCountryComparison)
    ]);

    state.rawDataColumns = rawRecords.length ? Object.keys(rawRecords[0]) : [];
    state.allRecords = rawRecords.map(normalizeRecord);
    state.mainRecords = state.allRecords.filter((record) => record.includedInMainTally);
    state.nameLexicon = buildNameLexicon(state.allRecords);
    state.localitySummary = localitySummary;
    state.analysisCountryComparison = analysisCountryComparison;
    state.analysisCountryComparisonYear = getDefaultCountryComparisonYear();
    state.localityByKey = new Map((localitySummary.localities || []).map((locality) => [locality.locality_key, locality]));
    state.years = [...new Set(state.mainRecords.map((record) => record.year))].sort((a, b) => a - b);
    state.yearMeta = buildYearMeta(state.mainRecords);
    state.selectedYear = state.years[state.years.length - 1] || ALL_FILTER_VALUE;
    state.recordsByLocalityKey = state.mainRecords.reduce((map, record) => {
      const key = record.locality_key || "";
      if (!key) {
        return map;
      }
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(record);
      return map;
    }, new Map());

    const rawYears = getAvailableYearsFromDatasetYear();
    state.rawYear = rawYears[0] || "";

    hydrateStateFromUrl();
    setupEvents();
    render();
  } catch (error) {
    document.body.innerHTML = `<main class="app-shell"><section class="panel" style="padding:1.5rem"><h1>${t("errors.loadingTitle")}</h1><p>${error.message}</p></section></main>`;
  }
}

initialize();
