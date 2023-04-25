async function main() {
  // configure pyodide
  let pyodide = await loadPyodide();
  pyodide.pyimport('SPProcessing')

  // populate industry dropdown
  pyodide.runPython(`
    import SPProcessing.TickerData.TickerData as TickerData
    print(TickerData)
    # tTree = TickerTree("SP_500.xml")

  `)

  // load tickerData
  const tickerData = pyodide.runPython(`
    import SPProcessing.TickerData.TickerData as TickerData
    # tickerData = TickerData("SP500_ind.csv")
    # tickerData.read_data()
    # return tickerData
    print(TickerData)
  `)

  console.log(pyodide.runPython(`
      import sys
      sys.version
  `));
};
main();