async function getPythonEnvironment() {
  let pyodide = await loadPyodide();
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install('stock-market-bytetheory');
  return pyodide
}

async function main() {
//   const pythonResponse = await pyodide.runPython(`
//     print(marketHistory)
//   `) 
};
main();