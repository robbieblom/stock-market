async function getPythonEnvironment() {
  let pyodide = await loadPyodide();
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("stock-market-bytetheory");
  return pyodide;
}

let pythonReadyPromise = getPythonEnvironment();
