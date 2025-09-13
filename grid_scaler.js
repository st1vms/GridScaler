let gridData = [];
let rows = 0, cols = 0;
let subRows = 0, subCols = 0;

function createGrid() {
  rows = parseInt(document.getElementById("rows").value);
  cols = parseInt(document.getElementById("cols").value);
  subRows = parseInt(document.getElementById("subRows").value);
  subCols = parseInt(document.getElementById("subCols").value);

  gridData = Array.from({ length: rows }, () => Array(cols).fill(0));
  renderGrid(rows, cols, gridData);
}

function renderGrid(r, c, data) {
  const table = document.getElementById("grid");
  table.innerHTML = "";

  const subRowSize = r / subRows;
  const subColSize = c / subCols;

  for (let i = 0; i < r; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < c; j++) {
      const td = document.createElement("td");
      if (data[i][j] === 1) td.classList.add("marked");

      // Draw sub-area borders
      let borderStyle = "";
      if (i % subRowSize === 0) borderStyle += "border-top: 2px solid black;";
      if (j % subColSize === 0) borderStyle += "border-left: 2px solid black;";
      if (i === r - 1) borderStyle += "border-bottom: 2px solid black;";
      if (j === c - 1) borderStyle += "border-right: 2px solid black;";
      td.setAttribute("style", borderStyle);

      td.addEventListener("click", () => {
        data[i][j] = 1 - data[i][j];
        td.classList.toggle("marked");
      });
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function resizeGrid() {
  const newRows = parseInt(document.getElementById("newRows").value);
  const newCols = parseInt(document.getElementById("newCols").value);

  const newData = Array.from({ length: newRows }, () => Array(newCols).fill(0));

  for (let i = 0; i < newRows; i++) {
    for (let j = 0; j < newCols; j++) {
      const srcI = Math.floor(i * rows / newRows);
      const srcJ = Math.floor(j * cols / newCols);
      newData[i][j] = gridData[srcI][srcJ];
    }
  }

  gridData = newData;
  rows = newRows;
  cols = newCols;

  document.getElementById("rows").value = rows;
  document.getElementById("cols").value = cols;

  renderGrid(rows, cols, gridData);
}

function downloadJSON() {
  const saveObj = {
    rows,
    cols,
    subRows,
    subCols,
    newRows: parseInt(document.getElementById("newRows").value),
    newCols: parseInt(document.getElementById("newCols").value),
    data: gridData
  };
  const blob = new Blob([JSON.stringify(saveObj)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "canvas.json";
  a.click();
  URL.revokeObjectURL(url);
}

function uploadJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const obj = JSON.parse(e.target.result);

      rows = obj.rows;
      cols = obj.cols;
      subRows = obj.subRows;
      subCols = obj.subCols;

      document.getElementById("rows").value = rows;
      document.getElementById("cols").value = cols;
      document.getElementById("subRows").value = subRows;
      document.getElementById("subCols").value = subCols;

      if (obj.newRows) document.getElementById("newRows").value = obj.newRows;
      if (obj.newCols) document.getElementById("newCols").value = obj.newCols;

      gridData = obj.data;
      renderGrid(rows, cols, gridData);
    } catch (err) {
      alert("Errore nel caricamento del file.");
    }
  };
  reader.readAsText(file);
}

function OnUploadButtonClick(event) {
  const input = document.getElementById('fileInput');
  input.value = null; // reset to allow same file selection
  input.click();
}

window.onload = createGrid;