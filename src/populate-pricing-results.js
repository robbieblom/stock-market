function buildHTMLString(ticker) {
  const html = `
  <div class="result">
    <div class="result-field ticker-symbol">${ticker["ticker"]}</div>
    <div class="result-field weighted-avg-price">
      <div class="result-label">WAP</div>
      <div class="result-value">$${Math.round(ticker["vwap"])}</div>
    </div>
    <div class="result-field avg-open">
      <div class="result-label">Avg Open</div>
      <div class="result-value">$${Math.round(ticker["avgOpen"])}</div>
    </div>
  </div>
  `;
  return html.trim();
}

function buildTickerPricesElement(ticker) {
  const template = document.createElement("template");
  const html = buildHTMLString(ticker);
  template.innerHTML = html;
  return template.content.firstChild;
}

function bindPricesToUI(prices) {
  const resultsContainer = document.getElementById("results");
  for (let ticker of prices) {
    resultsContainer.appendChild(buildTickerPricesElement(ticker));
  }
}

function transformPythonPricesResponseToJS(pythonResponse) {
  const mapFormOfPricingMetrics = pythonResponse.toJs();
  const objectFormOfPricingMetrics = mapFormOfPricingMetrics.map((m) =>
    Object.fromEntries(m)
  );
  return objectFormOfPricingMetrics;
}

async function getPricesForSelectedIndustry(selectedIndustry, selectedSector) {
  let pyodide = await pythonReadyPromise;
  const pythonResponse = await pyodide.runPython(`
    marketHistory.getPricingMetricsForIndustry('${selectedIndustry}', '${selectedSector}')
  `);
  return transformPythonPricesResponseToJS(pythonResponse);
}

function extractSector(selectorValue) {
  return selectorValue.split("|")[1];
}

function extractSectorFromUI() {
  const industrySelectorValue =
    document.getElementById("industry-selector").value;
  const sector = extractSector(industrySelectorValue);
  return sector;
}

function extractIndustry(selectorValue) {
  return selectorValue.split("|")[0];
}

function extractIndustryFromUI() {
  const industrySelectorValue =
    document.getElementById("industry-selector").value;
  const industry = extractIndustry(industrySelectorValue);
  return industry;
}

function removeCurrentPricesFromUI() {
  const resultsContainer = document.getElementById("results");
  resultsContainer.replaceChildren();
}
async function populatePricingResults(event) {
  event.preventDefault();
  removeCurrentPricesFromUI();
  const selectedIndustry = extractIndustryFromUI();
  const selectedSector = extractSectorFromUI();
  const pricesForIndustry = await getPricesForSelectedIndustry(
    selectedIndustry,
    selectedSector
  );
  bindPricesToUI(pricesForIndustry);
}
