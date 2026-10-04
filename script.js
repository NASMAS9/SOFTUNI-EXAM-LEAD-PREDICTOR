const fields = [
  {
    input: document.querySelector("#target-revenue"),
    displayInput: document.querySelector("#target-revenue-display"),
    labelKey: "targetRevenue",
  },
  {
    input: document.querySelector("#average-order-value"),
    displayInput: document.querySelector("#average-order-value-display"),
    labelKey: "averageOrderValue",
  },
  {
    input: document.querySelector("#lead-conversion-rate"),
    labelKey: "leadConversionRate",
    isRate: true,
    defaultValue: 25,
    valueDisplay: document.querySelector("#lead-conversion-rate-value"),
  },
  {
    input: document.querySelector("#prospect-conversion-rate"),
    labelKey: "prospectConversionRate",
    isRate: true,
    defaultValue: 10,
    valueDisplay: document.querySelector("#prospect-conversion-rate-value"),
  },
];

const calculateButton = document.querySelector(".calculate-button");
const resetButton = document.querySelector(".reset-button");
const languageSelector = document.querySelector("#language");
const currencySelector = document.querySelector("#currency");
const currencySymbols = [
  document.querySelector("#target-revenue-currency"),
  document.querySelector("#average-order-value-currency"),
];
const resultOutputs = {
  requiredClientsX: document.querySelector('[aria-label="Required clients (X)"]'),
  requiredLeadsY: document.querySelector('[aria-label="Required leads (Y)"]'),
  requiredProspectsZ: document.querySelector('[aria-label="Required prospects (Z)"]'),
};
const monthlyPipelineChart = document.querySelector("#monthly-pipeline-chart");
const monthlyChartRows = document.querySelector("#monthly-chart-rows");
const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (value) => numberFormatter.format(value).replace(/,/g, " ");
const translations = {
  en: {
    salesPlanning: "SALES PLANNING",
    pageDescription: "Plan the pipeline you need to reach your revenue target.",
    yourAssumptions: "YOUR ASSUMPTIONS",
    setTargets: "Set your targets",
    language: "Language",
    english: "English",
    bulgarian: "Bulgarian",
    currency: "Currency",
    usd: "US Dollar ($)",
    eur: "Euro (€)",
    gbp: "British Pound (£)",
    campaignStart: "Campaign Start",
    campaignEnd: "Campaign End",
    chooseCampaignStart: "Choose Campaign Start date",
    chooseCampaignEnd: "Choose Campaign End date",
    targetRevenue: "Target Revenue",
    revenueHelp: "Your total revenue goal",
    averageOrderValue: "Average Order Value",
    averageOrderValueHelp: "Average revenue per client",
    leadConversionRate: "Lead Conversion Rate",
    leadConversionRateHelp: "Percentage of leads that become clients",
    prospectConversionRate: "Prospect Conversion Rate",
    prospectConversionRateHelp: "Percentage of prospects that become leads",
    calculate: "Calculate",
    reset: "Reset",
    yourPipeline: "YOUR PIPELINE",
    projectedRequirements: "Projected requirements",
    clients: "Clients",
    leads: "Leads",
    leadsKpi: "Leads",
    prospects: "Prospects",
    requiredClients: "Required clients (X)",
    requiredLeads: "Required leads (Y)",
    requiredProspects: "Required prospects (Z)",
    monthlyCumulativePipeline: "Monthly cumulative pipeline",
    chartLegend: "Chart legend",
    resultsNote: "Enter your assumptions to see the pipeline needed for your goal.",
    gettingStarted: "GETTING STARTED",
    howItWorks: "How it works",
    chooseSettings: "Choose your settings",
    chooseSettingsDescription: "Select your preferred language and currency. The selected currency is used for Target Revenue and Average Order Value.",
    setCampaignPeriod: "Set the campaign period",
    setCampaignPeriodDescription: "Choose the Campaign Start and Campaign End dates. LeadPredictor uses this period to distribute the cumulative pipeline requirements across the campaign months.",
    setRevenueTargets: "Set your revenue targets",
    setRevenueTargetsDescription: "Enter the Target Revenue (A) and Average Order Value (B).",
    setConversionRates: "Set your conversion rates",
    setConversionRatesDescription: "Choose the Lead Conversion Rate (C) and Prospect Conversion Rate (D).",
    calculatePipeline: "Calculate your pipeline",
    calculatePipelineDescription: "Click Calculate to see how many clients (X), leads (Y) and prospects (Z) are required to achieve your revenue target.",
    calculationLogic: "Calculation logic",
    calculationIntro: "LeadPredictor works backwards from your revenue target to calculate the size of the sales pipeline required to achieve your goal.",
    calculationDiagram: "LeadPredictor calculates backwards from revenue to clients, leads, and prospects",
    targetRevenueA: "Target Revenue (A)",
    averageOrderValueB: "Average Order Value (B)",
    requiredClientsX: "Required Clients (X)",
    leadConversionRateC: "Lead Conversion Rate (C)",
    requiredLeadsY: "Required Leads (Y)",
    prospectConversionRateD: "Prospect Conversion Rate (D)",
    requiredProspectsZ: "Required Prospects (Z)",
    finalResultExplanation: "The final result tells you how many prospects you need to reach in order to achieve your revenue target, based on your assumed conversion rates.",
    campaignRampExplanation: "Your campaign dates determine the number of months in the projection. LeadPredictor uses a progressive campaign ramp-up model, where pipeline acquisition starts more gradually and increases as the campaign develops.",
    monthlyChartExplanation: "The monthly chart shows cumulative progress towards the final target using a quadratic progression, reaching 100% of the required pipeline by the final month. Bars show cumulative requirements; tooltips also show the new amount required during each month.",
    progressiveMonthlyCalculation: "Progressive monthly calculation",
    cumulativeTarget: "Cumulative target at month n",
    currentCampaignMonth: "= current campaign month",
    totalCampaignMonths: "= total campaign months",
    finalRequiredPipeline: "= final required clients, leads or prospects",
    newRequirement: "New requirement during month n",
    forMonthOne: "For Month 1:",
    progressiveExampleHeading: "Example — 400 Required Clients over 3 months",
    monthOne: "Month 1",
    monthTwo: "Month 2",
    monthThree: "Month 3",
    cumulativeClients: "cumulative clients",
    newClientsThisMonth: "New clients this month:",
    progressiveConclusion: "The same progression is applied to Required Leads (Y) and Required Prospects (Z). This models a campaign that starts gradually and accelerates over time, while reaching 100% of the required pipeline by the final month.",
    pageFooter: "A clearer path from revenue goals to action.",
    month: "Month",
    monthTooltipTitle: (monthNumber, monthName, year) => `Month #${monthNumber} — ${monthName} ${year}`,
    monthHeading: (monthNumber, monthName, year) => `Month ${monthNumber} — ${monthName} ${year}`,
    thisMonth: "THIS MONTH",
    cumulative: "CUMULATIVE",
    enterValid: (field) => `Enter a valid ${field.toLowerCase()}.`,
    greaterThanZero: (field) => `${field} must be greater than zero.`,
    rateTooHigh: (field) => `${field} cannot be greater than 100%.`,
    dateInvalid: "Enter a valid date in DD/MM/YYYY format.",
    resultTooLarge: "This rate is too small to calculate a finite result.",
  },
  bg: {
    salesPlanning: "ПЛАНИРАНЕ НА ПРОДАЖБИТЕ",
    pageDescription: "Планирайте необходимата продажбена фуния, за да постигнете целевите си приходи.",
    yourAssumptions: "ВАШИТЕ ДОПУСКАНИЯ",
    setTargets: "Задайте целите си",
    language: "Език",
    english: "English",
    bulgarian: "Български",
    currency: "Валута",
    usd: "Американски долар ($)",
    eur: "Евро (€)",
    gbp: "Британска лира (£)",
    campaignStart: "Начало на кампанията",
    campaignEnd: "Край на кампанията",
    chooseCampaignStart: "Изберете начална дата на кампанията",
    chooseCampaignEnd: "Изберете крайна дата на кампанията",
    targetRevenue: "Целеви приходи",
    revenueHelp: "Вашата цел за общи приходи",
    averageOrderValue: "Средна стойност на поръчка",
    averageOrderValueHelp: "Среден приход от клиент",
    leadConversionRate: "Коефициент на конверсия от потенциален клиент",
    leadConversionRateHelp: "Процент на потенциалните клиенти, които стават клиенти",
    prospectConversionRate: "Коефициент на конверсия от контакт",
    prospectConversionRateHelp: "Процент на контактите, които стават потенциални клиенти",
    calculate: "Изчисли",
    reset: "Изчисти",
    yourPipeline: "ВАШАТА ПРОДАЖБЕНА ФУНИЯ",
    projectedRequirements: "Необходими резултати",
    clients: "Клиенти",
    leads: "Потенциални клиенти",
    leadsKpi: "Потенц. клиенти",
    prospects: "Контакти",
    requiredClients: "Необходими клиенти (X)",
    requiredLeads: "Необходими потенциални клиенти (Y)",
    requiredProspects: "Необходими контакти (Z)",
    monthlyCumulativePipeline: "Кумулативна продажбена фуния по месеци",
    chartLegend: "Легенда на диаграмата",
    resultsNote: "Въведете вашите допускания, за да видите необходимата продажбена фуния за постигане на целта.",
    gettingStarted: "КАК ДА ЗАПОЧНЕТЕ",
    howItWorks: "Как работи",
    chooseSettings: "Изберете настройките",
    chooseSettingsDescription: "Изберете предпочитаните език и валута. Избраната валута се използва за целевите приходи и средната стойност на поръчка.",
    setCampaignPeriod: "Задайте периода на кампанията",
    setCampaignPeriodDescription: "Изберете начална и крайна дата на кампанията. LeadPredictor използва този период, за да разпредели кумулативните изисквания към продажбената фуния по месеците на кампанията.",
    setRevenueTargets: "Задайте целите за приходи",
    setRevenueTargetsDescription: "Въведете целевите приходи (A) и средната стойност на поръчка (B).",
    setConversionRates: "Задайте коефициентите на конверсия",
    setConversionRatesDescription: "Задайте коефициента на конверсия от потенциален клиент (C) и коефициента на конверсия от контакт (D).",
    calculatePipeline: "Изчислете необходимата продажбена фуния",
    calculatePipelineDescription: "Натиснете „Изчисли“, за да видите колко клиенти (X), потенциални клиенти (Y) и контакти (Z) са необходими за постигане на целевите приходи.",
    calculationLogic: "Логика на изчислението",
    calculationIntro: "LeadPredictor изчислява по обратен път от целевите приходи, за да определи размера на продажбената фуния, необходима за постигане на целта.",
    calculationDiagram: "LeadPredictor изчислява обратно от приходите към клиентите, потенциалните клиенти и контактите",
    targetRevenueA: "Целеви приходи (A)",
    averageOrderValueB: "Средна стойност на поръчка (B)",
    requiredClientsX: "Необходими клиенти (X)",
    leadConversionRateC: "Коефициент на конверсия от потенциален клиент (C)",
    requiredLeadsY: "Необходими потенциални клиенти (Y)",
    prospectConversionRateD: "Коефициент на конверсия от контакт (D)",
    requiredProspectsZ: "Необходими контакти (Z)",
    finalResultExplanation: "Крайният резултат показва колко контакта са необходими, за да постигнете целевите приходи според зададените коефициенти на конверсия.",
    campaignRampExplanation: "Датите на кампанията определят броя месеци в прогнозата. LeadPredictor използва прогресивен модел на развитие, при който набирането на контакти започва по-постепенно и се увеличава с развитието на кампанията.",
    monthlyChartExplanation: "Месечната диаграма показва кумулативния напредък към крайната цел чрез квадратична прогресия, достигаща 100% от необходимата продажбена фуния през последния месец. Лентите показват кумулативните изисквания, а подсказките показват и новото количество, необходимо през всеки месец.",
    progressiveMonthlyCalculation: "Прогресивно месечно изчисление",
    cumulativeTarget: "Кумулативна цел към месец n",
    currentCampaignMonth: "= текущият месец от кампанията",
    totalCampaignMonths: "= общият брой месеци на кампанията",
    finalRequiredPipeline: "= крайните необходими клиенти, потенциални клиенти или контакти",
    newRequirement: "Нови необходими резултати през месец n",
    forMonthOne: "За месец 1:",
    progressiveExampleHeading: "Пример — 400 необходими клиенти за 3 месеца",
    monthOne: "Месец 1",
    monthTwo: "Месец 2",
    monthThree: "Месец 3",
    cumulativeClients: "кумулативни клиенти",
    newClientsThisMonth: "Нови клиенти през месеца:",
    progressiveConclusion: "Същата прогресия се прилага за необходимите потенциални клиенти (Y) и контакти (Z). Така се моделира кампания, която започва постепенно и се ускорява с времето, като достига 100% от необходимата продажбена фуния през последния месец.",
    pageFooter: "По-ясен път от целите за приходи до конкретните действия.",
    month: "Месец",
    monthTooltipTitle: (monthNumber, monthName, year) => `Месец #${monthNumber} — ${monthName} ${year}`,
    monthHeading: (monthNumber, monthName, year) => `Месец ${monthNumber} — ${monthName} ${year}`,
    thisMonth: "ТОЗИ МЕСЕЦ",
    cumulative: "КУМУЛАТИВНО",
    enterValid: (field) => `Въведете валидна стойност за „${field}“.`,
    greaterThanZero: (field) => `${field} трябва да е по-голямо от нула.`,
    rateTooHigh: (field) => `${field} не може да е над 100%.`,
    dateInvalid: "Въведете валидна дата във формат DD/MM/YYYY.",
    resultTooLarge: "Този коефициент е твърде малък, за да се изчисли краен резултат.",
  },
};
let currentLanguage = languageSelector.value;
const translate = (key) => translations[currentLanguage][key];
const setLocalizedValidity = (element, key, fieldKey) => {
  element.dataset.validationKey = key;
  if (fieldKey) {
    element.dataset.validationFieldKey = fieldKey;
  } else {
    delete element.dataset.validationFieldKey;
  }
  const field = fieldKey ? translate(fieldKey) : "";
  element.setCustomValidity(translate(key)(field));
};
const clearLocalizedValidity = (element) => {
  delete element.dataset.validationKey;
  delete element.dataset.validationFieldKey;
  element.setCustomValidity("");
};
const monthNames = {
  en: {
    short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  bg: {
    short: ["ян.", "фев.", "март", "апр.", "май", "юни", "юли", "авг.", "септ.", "окт.", "ное.", "дек."],
    long: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември"],
  },
};
const localizeMonthlyChart = () => {
  monthlyChartRows.querySelectorAll(".monthly-chart-row").forEach((monthRow) => {
    const monthNumber = Number(monthRow.dataset.monthNumber);
    const monthIndex = Number(monthRow.dataset.monthIndex);
    const year = monthRow.dataset.year;
    const names = monthNames[currentLanguage];
    const labels = [
      ["Clients (X)", "Клиенти (X)"],
      ["Leads (Y)", "Потенциални клиенти (Y)"],
      ["Prospects (Z)", "Контакти (Z)"],
    ];
    const values = {
      monthly: [
        monthRow.dataset.monthlyClients,
        monthRow.dataset.monthlyLeads,
        monthRow.dataset.monthlyProspects,
      ],
      cumulative: [
        monthRow.dataset.cumulativeClients,
        monthRow.dataset.cumulativeLeads,
        monthRow.dataset.cumulativeProspects,
      ],
    };
    const monthName = names.long[monthIndex];
    const tooltipText = [
      translate("monthTooltipTitle")(monthNumber, monthName, year),
      translate("thisMonth"),
      ...values.monthly.map((value, index) => `${currentLanguage === "en" ? labels[index][0] : labels[index][1]}: ${formatNumber(Number(value))}`),
      translate("cumulative"),
      ...values.cumulative.map((value, index) => `${currentLanguage === "en" ? labels[index][0] : labels[index][1]}: ${formatNumber(Number(value))}`),
    ].join("\n");
    monthRow.setAttribute("aria-label", tooltipText.replace(/\n/g, ", "));
    monthRow.querySelector(".monthly-chart-heading").textContent =
      translate("monthHeading")(monthNumber, names.short[monthIndex], year);
    monthRow.querySelector(".monthly-chart-tooltip").textContent = tooltipText;
  });
};
const applyLanguage = () => {
  currentLanguage = languageSelector.value;
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-validation-key]").forEach((element) => {
    const fieldKey = element.dataset.validationFieldKey;
    const field = fieldKey ? translate(fieldKey) : "";
    element.setCustomValidity(translate(element.dataset.validationKey)(field));
  });
  localizeMonthlyChart();
};
const updateCurrencySymbols = () => {
  const currency = currencySelector.value;
  const knownSymbols = { USD: "$", EUR: "€", GBP: "£" };
  const selectedLabel = currencySelector.selectedOptions[0]?.textContent ?? "";
  const symbol = knownSymbols[currency] ?? selectedLabel.match(/\(([^)]+)\)/)?.[1] ?? "";
  currencySymbols.forEach((element) => {
    element.textContent = symbol;
  });
};
const formatEditableNumber = (value) => {
  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(value);
  if (!match) {
    return null;
  }

  const [, sign, integerPart, decimalPart] = match;
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${groupedInteger}${decimalPart === undefined ? "" : `.${decimalPart}`}`;
};

const syncNumericField = (displayInput, numericInput) => {
  const ungroupedValue = displayInput.value.replace(/ /g, "");
  const formattedValue = formatEditableNumber(ungroupedValue);
  if (formattedValue === null) {
    numericInput.value = "";
    return;
  }

  const numericValue = Number(ungroupedValue);
  numericInput.value =
    ungroupedValue !== "" && Number.isFinite(numericValue) ? ungroupedValue : "";

  const caretPosition = displayInput.selectionStart;
  const digitsBeforeCaret = displayInput.value
    .slice(0, caretPosition)
    .replace(/ /g, "").length;
  displayInput.value = formattedValue;
  let nextCaretPosition = 0;
  let digitsSeen = 0;
  while (nextCaretPosition < formattedValue.length && digitsSeen < digitsBeforeCaret) {
    if (formattedValue[nextCaretPosition] !== " ") {
      digitsSeen += 1;
    }
    nextCaretPosition += 1;
  }
  displayInput.setSelectionRange(nextCaretPosition, nextCaretPosition);
};

const campaignDateFields = [
  {
    display: document.querySelector("#campaign-start"),
    picker: document.querySelector("#campaign-start-picker"),
  },
  {
    display: document.querySelector("#campaign-end"),
    picker: document.querySelector("#campaign-end-picker"),
  },
];

currencySelector.addEventListener("change", updateCurrencySymbols);
languageSelector.addEventListener("change", applyLanguage);
updateCurrencySymbols();
applyLanguage();

const formatDate = (isoDate) => {
  if (!isoDate) {
    return "";
  }

  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const parseDate = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  if (monthNumber < 1 || monthNumber > 12) {
    return null;
  }

  const isLeapYear = yearNumber % 4 === 0 && (yearNumber % 100 !== 0 || yearNumber % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (dayNumber < 1 || dayNumber > daysInMonth[monthNumber - 1]) {
    return null;
  }

  return `${year}-${month}-${day}`;
};

const calculateRequirements = (targetRevenue, averageOrderValue, leadConversionRate, prospectConversionRate) => {
  const requiredClientsX = Math.ceil(targetRevenue / averageOrderValue);
  const requiredLeadsY = Math.ceil(requiredClientsX / (leadConversionRate / 100));
  const requiredProspectsZ = Math.ceil(requiredLeadsY / (prospectConversionRate / 100));
  return { requiredClientsX, requiredLeadsY, requiredProspectsZ };
};

const clearMonthlyChart = () => {
  monthlyChartRows.replaceChildren();
  monthlyPipelineChart.hidden = true;
};

const updateMonthlyChart = () => {
  const startDate = parseDate(campaignDateFields[0].display.value);
  const endDate = parseDate(campaignDateFields[1].display.value);
  const [targetRevenue, averageOrderValue, leadConversionRate, prospectConversionRate] =
    fields.map(({ input }) => input.valueAsNumber);

  if (
    !startDate ||
    !endDate ||
    endDate < startDate ||
    !Number.isFinite(targetRevenue) ||
    !Number.isFinite(averageOrderValue) ||
    !Number.isFinite(leadConversionRate) ||
    !Number.isFinite(prospectConversionRate) ||
    targetRevenue <= 0 ||
    averageOrderValue <= 0 ||
    leadConversionRate <= 0 ||
    leadConversionRate > 100 ||
    prospectConversionRate <= 0 ||
    prospectConversionRate > 100
  ) {
    clearMonthlyChart();
    return;
  }

  const [startYear, startMonth] = startDate.split("-").map(Number);
  const [endYear, endMonth] = endDate.split("-").map(Number);
  const monthCount = (endYear - startYear) * 12 + endMonth - startMonth + 1;
  const totals = calculateRequirements(
    targetRevenue,
    averageOrderValue,
    leadConversionRate,
    prospectConversionRate,
  );

  if (
    !Number.isFinite(monthCount) ||
    monthCount <= 0 ||
    !Object.values(totals).every(Number.isFinite)
  ) {
    clearMonthlyChart();
    return;
  }

  const maxValue = totals.requiredProspectsZ;
  if (!Number.isFinite(maxValue) || maxValue <= 0) {
    clearMonthlyChart();
    return;
  }

  const fragment = document.createDocumentFragment();
  const series = [
    { total: totals.requiredProspectsZ, className: "prospects-bar" },
    { total: totals.requiredLeadsY, className: "leads-bar" },
    { total: totals.requiredClientsX, className: "clients-bar" },
  ];
  let previousCumulativeValues = series.map(() => 0);

  for (let monthIndex = 0; monthIndex < monthCount; monthIndex += 1) {
    const monthDate = new Date(Date.UTC(startYear, startMonth - 1 + monthIndex, 1));
    const monthNumber = monthIndex + 1;
    const monthRow = document.createElement("div");
    monthRow.className = "monthly-chart-row";
    monthRow.tabIndex = 0;
    monthRow.setAttribute("role", "group");
    monthRow.dataset.monthNumber = String(monthNumber);
    monthRow.dataset.monthIndex = String(monthDate.getUTCMonth());
    monthRow.dataset.year = String(monthDate.getUTCFullYear());

    const progressFactor = (monthNumber / monthCount) ** 2;
    const cumulativeValues = series.map(({ total }) =>
      monthNumber === monthCount ? total : Math.round(total * progressFactor),
    );
    const monthlyValues = cumulativeValues.map((value, index) => value - previousCumulativeValues[index]);
    previousCumulativeValues = cumulativeValues;
    monthRow.dataset.monthlyClients = String(monthlyValues[2]);
    monthRow.dataset.monthlyLeads = String(monthlyValues[1]);
    monthRow.dataset.monthlyProspects = String(monthlyValues[0]);
    monthRow.dataset.cumulativeClients = String(cumulativeValues[2]);
    monthRow.dataset.cumulativeLeads = String(cumulativeValues[1]);
    monthRow.dataset.cumulativeProspects = String(cumulativeValues[0]);

    const heading = document.createElement("div");
    heading.className = "monthly-chart-heading";
    monthRow.append(heading);

    const track = document.createElement("div");
    track.className = "monthly-pipeline-track";
    track.setAttribute("aria-hidden", "true");
    series.forEach(({ className }, index) => {
      const bar = document.createElement("div");
      bar.className = `monthly-pipeline-bar ${className}`;
      bar.style.width = `${(cumulativeValues[index] / maxValue) * 100}%`;
      track.append(bar);
    });
    monthRow.append(track);

    const tooltip = document.createElement("span");
    tooltip.className = "monthly-chart-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.setAttribute("aria-hidden", "true");
    monthRow.append(tooltip);

    fragment.append(monthRow);
  }

  monthlyChartRows.replaceChildren(fragment);
  monthlyPipelineChart.hidden = false;
  localizeMonthlyChart();
};

campaignDateFields.forEach(({ display, picker }) => {
  display.addEventListener("input", () => {
    clearLocalizedValidity(display);
    updateMonthlyChart();
  });

  display.addEventListener("change", () => {
    if (!display.value) {
      picker.value = "";
      clearLocalizedValidity(display);
      updateMonthlyChart();
      return;
    }

    const isoDate = parseDate(display.value);
    if (!isoDate) {
      setLocalizedValidity(display, "dateInvalid");
      display.reportValidity();
      updateMonthlyChart();
      return;
    }

    picker.value = isoDate;
    clearLocalizedValidity(display);
    updateMonthlyChart();
  });

  picker.addEventListener("change", () => {
    display.value = formatDate(picker.value);
    clearLocalizedValidity(display);
    updateMonthlyChart();
  });
});

fields.forEach(({ input, displayInput, valueDisplay }) => {
  if (displayInput) {
    displayInput.addEventListener("input", () => {
      clearLocalizedValidity(displayInput);
      clearLocalizedValidity(input);
      syncNumericField(displayInput, input);
      updateMonthlyChart();
    });
  }

  input.addEventListener("input", () => {
    clearLocalizedValidity(input);
    if (valueDisplay) {
      valueDisplay.textContent = `${input.value}%`;
    }
    updateMonthlyChart();
  });
});

resetButton.addEventListener("click", () => {
  fields.forEach(({ input, displayInput, defaultValue, valueDisplay }) => {
    input.value = defaultValue ?? "";
    clearLocalizedValidity(input);
    if (displayInput) {
      displayInput.value = defaultValue ?? "";
      clearLocalizedValidity(displayInput);
    }
    if (valueDisplay) {
      valueDisplay.textContent = `${input.value}%`;
    }
  });
  Object.values(resultOutputs).forEach((output) => {
    output.textContent = "—";
  });
  updateMonthlyChart();
});

calculateButton.addEventListener("click", () => {
  let firstInvalidInput = null;

  fields.forEach(({ input, displayInput, labelKey, isRate }) => {
    const value = input.valueAsNumber;
    let message = "";
    let messageKey = "";

    if (input.value.trim() === "" || !Number.isFinite(value)) {
      messageKey = "enterValid";
    } else if (value <= 0) {
      messageKey = "greaterThanZero";
    } else if (isRate && value > 100) {
      messageKey = "rateTooHigh";
    }

    const validationInput = displayInput ?? input;
    if (messageKey) {
      setLocalizedValidity(validationInput, messageKey, labelKey);
      message = validationInput.validationMessage;
    } else {
      clearLocalizedValidity(validationInput);
    }
    if (displayInput) {
      clearLocalizedValidity(input);
    }
    if (message && !firstInvalidInput) {
      firstInvalidInput = validationInput;
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.reportValidity();
    return;
  }

  const [targetRevenue, averageOrderValue, leadConversionRate, prospectConversionRate] =
    fields.map(({ input }) => input.valueAsNumber);
  const results = calculateRequirements(
    targetRevenue,
    averageOrderValue,
    leadConversionRate,
    prospectConversionRate,
  );

  if (!Object.values(results).every(Number.isFinite)) {
    setLocalizedValidity(fields[3].input, "resultTooLarge");
    fields[3].reportValidity();
    return;
  }

  resultOutputs.requiredProspectsZ.textContent = formatNumber(results.requiredProspectsZ);
  resultOutputs.requiredLeadsY.textContent = formatNumber(results.requiredLeadsY);
  resultOutputs.requiredClientsX.textContent = formatNumber(results.requiredClientsX);

  updateMonthlyChart();
});
