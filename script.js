const fields = [
  {
    input: document.querySelector("#target-revenue"),
    displayInput: document.querySelector("#target-revenue-display"),
    label: "Target Revenue",
  },
  {
    input: document.querySelector("#average-order-value"),
    displayInput: document.querySelector("#average-order-value-display"),
    label: "Average Order Value",
  },
  {
    input: document.querySelector("#lead-conversion-rate"),
    label: "Lead Conversion Rate",
    isRate: true,
    defaultValue: 25,
    valueDisplay: document.querySelector("#lead-conversion-rate-value"),
  },
  {
    input: document.querySelector("#prospect-conversion-rate"),
    label: "Prospect Conversion Rate",
    isRate: true,
    defaultValue: 10,
    valueDisplay: document.querySelector("#prospect-conversion-rate-value"),
  },
];

const calculateButton = document.querySelector(".calculate-button");
const resetButton = document.querySelector(".reset-button");
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
updateCurrencySymbols();

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
  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const shortMonthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  let previousCumulativeValues = series.map(() => 0);

  for (let monthIndex = 0; monthIndex < monthCount; monthIndex += 1) {
    const monthDate = new Date(Date.UTC(startYear, startMonth - 1 + monthIndex, 1));
    const monthName = monthFormatter.format(monthDate);
    const shortMonthName = shortMonthFormatter.format(monthDate);
    const monthNumber = monthIndex + 1;
    const monthRow = document.createElement("div");
    monthRow.className = "monthly-chart-row";
    monthRow.tabIndex = 0;
    monthRow.setAttribute("role", "group");

    const progressFactor = (monthNumber / monthCount) ** 2;
    const cumulativeValues = series.map(({ total }) =>
      monthNumber === monthCount ? total : Math.round(total * progressFactor),
    );
    const monthlyValues = cumulativeValues.map((value, index) => value - previousCumulativeValues[index]);
    previousCumulativeValues = cumulativeValues;
    const tooltipText = [
      `Month #${monthNumber} — ${monthName}`,
      "THIS MONTH",
      `Clients (X): ${formatNumber(monthlyValues[2])}`,
      `Leads (Y): ${formatNumber(monthlyValues[1])}`,
      `Prospects (Z): ${formatNumber(monthlyValues[0])}`,
      "CUMULATIVE",
      `Clients (X): ${formatNumber(cumulativeValues[2])}`,
      `Leads (Y): ${formatNumber(cumulativeValues[1])}`,
      `Prospects (Z): ${formatNumber(cumulativeValues[0])}`,
    ].join("\n");
    monthRow.setAttribute("aria-label", tooltipText.replace(/\n/g, ", "));

    const heading = document.createElement("div");
    heading.className = "monthly-chart-heading";
    heading.textContent = `Month ${monthNumber} — ${shortMonthName}`;
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
    tooltip.textContent = tooltipText;
    monthRow.append(tooltip);

    fragment.append(monthRow);
  }

  monthlyChartRows.replaceChildren(fragment);
  monthlyPipelineChart.hidden = false;
};

campaignDateFields.forEach(({ display, picker }) => {
  display.addEventListener("input", () => {
    display.setCustomValidity("");
    updateMonthlyChart();
  });

  display.addEventListener("change", () => {
    if (!display.value) {
      picker.value = "";
      display.setCustomValidity("");
      updateMonthlyChart();
      return;
    }

    const isoDate = parseDate(display.value);
    if (!isoDate) {
      display.setCustomValidity("Enter a valid date in DD/MM/YYYY format.");
      display.reportValidity();
      updateMonthlyChart();
      return;
    }

    picker.value = isoDate;
    display.setCustomValidity("");
    updateMonthlyChart();
  });

  picker.addEventListener("change", () => {
    display.value = formatDate(picker.value);
    display.setCustomValidity("");
    updateMonthlyChart();
  });
});

fields.forEach(({ input, displayInput, valueDisplay }) => {
  if (displayInput) {
    displayInput.addEventListener("input", () => {
      displayInput.setCustomValidity("");
      input.setCustomValidity("");
      syncNumericField(displayInput, input);
      updateMonthlyChart();
    });
  }

  input.addEventListener("input", () => {
    input.setCustomValidity("");
    if (valueDisplay) {
      valueDisplay.textContent = `${input.value}%`;
    }
    updateMonthlyChart();
  });
});

resetButton.addEventListener("click", () => {
  fields.forEach(({ input, displayInput, defaultValue, valueDisplay }) => {
    input.value = defaultValue ?? "";
    input.setCustomValidity("");
    if (displayInput) {
      displayInput.value = defaultValue ?? "";
      displayInput.setCustomValidity("");
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

  fields.forEach(({ input, displayInput, label, isRate }) => {
    const value = input.valueAsNumber;
    let message = "";

    if (input.value.trim() === "" || !Number.isFinite(value)) {
      message = `Enter a valid ${label.toLowerCase()}.`;
    } else if (value <= 0) {
      message = `${label} must be greater than zero.`;
    } else if (isRate && value > 100) {
      message = `${label} cannot be greater than 100%.`;
    }

    const validationInput = displayInput ?? input;
    validationInput.setCustomValidity(message);
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
    fields[3].setCustomValidity("This rate is too small to calculate a finite result.");
    fields[3].reportValidity();
    return;
  }

  resultOutputs.requiredProspectsZ.textContent = formatNumber(results.requiredProspectsZ);
  resultOutputs.requiredLeadsY.textContent = formatNumber(results.requiredLeadsY);
  resultOutputs.requiredClientsX.textContent = formatNumber(results.requiredClientsX);

  updateMonthlyChart();
});
