 
function buildSectorGroupHMTLElement(sectorName) {
  const sectorGroupElement = document.createElement('optgroup')
  sectorGroupElement.setAttribute('label', sectorName)
  return sectorGroupElement
}

function buildHTMLForIndustryList(industryList) {
  let html = ''
  for(let industry of industryList) {
    html += `<option value="${industry}"> ${industry} </option>`
  }
  return html
}

function buildHTMLElement(sector, industryList) {
  const sectorGroupHTMLElement = buildSectorGroupHMTLElement(sector)
  const htmlForIndustryList = buildHTMLForIndustryList(industryList)
  sectorGroupHTMLElement.innerHTML += htmlForIndustryList
  return sectorGroupHTMLElement
}

function getIndustryUISelector() {
  return document.getElementById('industry-selector')
}

function bindHTMLElementToIndustrySelector(htmlElement, industrySelector) {
  industrySelector.appendChild(htmlElement)
}

function bindSectorsAndIndustriesDataToUI(sectorsAndIndustriesData) {
  const industrySelector = getIndustryUISelector()
  const sectorsInSectorsAndIndustriesData = Object.keys(sectorsAndIndustriesData)
  for(let sector of sectorsInSectorsAndIndustriesData) {
    const industriesForTheSector = sectorsAndIndustriesData[sector]
    const htmlElement = buildHTMLElement(sector, industriesForTheSector)
    bindHTMLElementToIndustrySelector(htmlElement, industrySelector)
  }
}

async function getPythonEnvironment() {
  let pyodide = await loadPyodide();
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install('stock-market-bytetheory');
  return pyodide
}

function transformPythonResponseToJS(pythonResponse) {
  const mapFormOfSectorsAndIndustriesData = pythonResponse.toJs()
  const objectFormOfSectorsAndIndustriesData = Object.fromEntries(mapFormOfSectorsAndIndustriesData)
  return objectFormOfSectorsAndIndustriesData
}

async function getAllSectorsAndIndustries() {
  let pyodide = await getPythonEnvironment()
  const pythonResponse = await pyodide.runPython(`
    from stock_market_bytetheory import SP500History

    marketHistory = SP500History()
    marketHistory.getAllSectorsAndIndustries()
  `) 
  return transformPythonResponseToJS(pythonResponse)
}

async function populateIndustryOptions() {
  const sectorsAndIndustriesData = await getAllSectorsAndIndustries()
  bindSectorsAndIndustriesDataToUI(sectorsAndIndustriesData)
}

populateIndustryOptions()