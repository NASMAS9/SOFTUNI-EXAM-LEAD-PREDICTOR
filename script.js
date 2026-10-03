const fields = [
  {
    input: document.querySelector("#target-revenue"),
    label: "Target Revenue",
  },
  {
    input: document.querySelector("#average-order-value"),
    label: "Average Order Value",
  },
  {
    input: document.querySelector("#lead-response-rate"),
    label: "Lead Response Rate",
    isRate: true,
  },
  {
    input: document.querySelector("#prospect-response-rate"),
    label: "Prospect Response Rate",
    isRate: true,
  },
];

const calculateButton = document.querySelector(".calculate-button");
const resetButton = document.querySelector(".reset-button");
const resultOutputs = [
  document.querySelector('[aria-label="Required clients"]'),
  document.querySelector('[aria-label="Required leads"]'),
  document.querySelector('[aria-label="Required prospects"]'),
];
const numberFormatter = new Intl.NumberFormat();

fields.forEach(({ input }) => {
  input.addEventListener("input", () => input.setCustomValidity(""));
});

resetButton.addEventListener("click", () => {
  fields.forEach(({ input }) => {
    input.value = "";
    input.setCustomValidity("");
  });
  resultOutputs.forEach((output) => {
    output.textContent = "—";
  });
});

calculateButton.addEventListener("click", () => {
  let firstInvalidInput = null;

  fields.forEach(({ input, label, isRate }) => {
    const value = input.valueAsNumber;
    let message = "";

    if (input.value.trim() === "" || !Number.isFinite(value)) {
      message = `Enter a valid ${label.toLowerCase()}.`;
    } else if (value <= 0) {
      message = `${label} must be greater than zero.`;
    } else if (isRate && value > 100) {
      message = `${label} cannot be greater than 100%.`;
    }

    input.setCustomValidity(message);
    if (message && !firstInvalidInput) {
      firstInvalidInput = input;
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.reportValidity();
    return;
  }

  const [targetRevenue, averageOrderValue, leadResponseRate, prospectResponseRate] =
    fields.map(({ input }) => input.valueAsNumber);
  const requiredClients = Math.ceil(targetRevenue / averageOrderValue);
  const requiredLeads = Math.ceil(requiredClients / (leadResponseRate / 100));
  const requiredProspects = Math.ceil(requiredLeads / (prospectResponseRate / 100));
  const results = [requiredClients, requiredLeads, requiredProspects];

  if (!results.every(Number.isFinite)) {
    fields[3].setCustomValidity("This rate is too small to calculate a finite result.");
    fields[3].reportValidity();
    return;
  }

  results.forEach((result, index) => {
    resultOutputs[index].textContent = numberFormatter.format(result);
  });
});
