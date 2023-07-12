function buildSectorGroupHMTLElement(sectorName) {
  const sectorGroupElement = document.createElement("optgroup");
  sectorGroupElement.setAttribute("label", sectorName);
  return sectorGroupElement;
}

function buildHTMLForIndustryList(industryList, sector) {
  let html = "";
  for (let industry of industryList) {
    html += `<option value="${industry}|${sector}"> ${industry} </option>`;
  }
  return html;
}

function buildHTMLElement(sector, industryList) {
  const sectorGroupHTMLElement = buildSectorGroupHMTLElement(sector);
  const htmlForIndustryList = buildHTMLForIndustryList(industryList, sector);
  sectorGroupHTMLElement.innerHTML += htmlForIndustryList;
  return sectorGroupHTMLElement;
}

function getIndustryUISelector() {
  return document.getElementById("industry-selector");
}

function bindHTMLElementToIndustrySelector(htmlElement, industrySelector) {
  industrySelector.appendChild(htmlElement);
}

function bindSectorsAndIndustriesDataToUI(sectorsAndIndustriesData) {
  const industrySelector = getIndustryUISelector();
  const sectorsInSectorsAndIndustriesData = Object.keys(
    sectorsAndIndustriesData
  );
  for (let sector of sectorsInSectorsAndIndustriesData) {
    const industriesForTheSector = sectorsAndIndustriesData[sector];
    const htmlElement = buildHTMLElement(sector, industriesForTheSector);
    bindHTMLElementToIndustrySelector(htmlElement, industrySelector);
  }
}

function transformPythonSectorsAndIndustriesResponseToJS(pythonResponse) {
  const mapFormOfSectorsAndIndustriesData = pythonResponse.toJs();
  const objectFormOfSectorsAndIndustriesData = Object.fromEntries(
    mapFormOfSectorsAndIndustriesData
  );
  return objectFormOfSectorsAndIndustriesData;
}

async function getAllSectorsAndIndustries() {
  let pyodide = await pythonReadyPromise;
  const pythonResponse = await pyodide.runPython(`
    from stock_market_bytetheory import SP500History

    marketHistory = SP500History()
    marketHistory.getAllSectorsAndIndustries()
  `);
  return transformPythonSectorsAndIndustriesResponseToJS(pythonResponse);
}

function removeLoadingMessageOnSelector() {
  document.getElementById("loading-msg").style.visibility = "hidden";
}

async function populateIndustryOptions() {
  const sectorsAndIndustriesData = await getAllSectorsAndIndustries();
  bindSectorsAndIndustriesDataToUI(sectorsAndIndustriesData);
  removeLoadingMessageOnSelector();
}

populateIndustryOptions();
