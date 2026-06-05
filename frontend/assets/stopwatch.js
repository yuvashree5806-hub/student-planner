let swInterval = null;
let milliseconds = 0;

const swDisplay = document.getElementById("sw-display");
const lapsTable = document.getElementById("laps-table");
const lapsBody = document.getElementById("laps-body");
const lapsEmpty = document.getElementById("laps-empty");

// Format stopwatch output
function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let centiseconds = Math.floor((ms % 1000) / 10);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
    String(centiseconds).padStart(2, "0")
  );
}

function updateDisplay() {
  swDisplay.textContent = formatTime(milliseconds);
}

// Start Stopwatch
document.getElementById("sw-start").onclick = () => {
  if (swInterval) return;

  swInterval = setInterval(() => {
    milliseconds += 10;
    updateDisplay();
  }, 10);
};

// Stop Stopwatch
document.getElementById("sw-stop").onclick = () => {
  clearInterval(swInterval);
  swInterval = null;
};

// Reset Stopwatch
document.getElementById("sw-reset").onclick = () => {
  clearInterval(swInterval);
  swInterval = null;
  milliseconds = 0;
  updateDisplay();

  // Clear laps
  lapsTable.style.display = "none";
  lapsEmpty.style.display = "block";
  lapsBody.innerHTML = "";
};

// Lap
document.getElementById("sw-lap").onclick = () => {
  if (!swInterval) return;

  const lapTime = formatTime(milliseconds);

  // show table
  lapsTable.style.display = "table";
  lapsEmpty.style.display = "none";

  const tr = document.createElement("tr");
  const lapNum = lapsBody.children.length + 1;

  const nTd = document.createElement("td");
  nTd.textContent = lapNum;

  const tTd = document.createElement("td");
  tTd.textContent = lapTime;

  tr.append(nTd, tTd);
  lapsBody.appendChild(tr);
};

// Init
updateDisplay();
