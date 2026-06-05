let timerInterval = null;
let timeLeft = 25 * 60; // default 25 minutes
const display = document.getElementById("timer-display");

function updateDisplay() {
  let min = Math.floor(timeLeft / 60);
  let sec = timeLeft % 60;
  display.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function startTimer() {
  if (timerInterval) return; // Already running

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      display.textContent = "DONE!";
      return;
    }
    timeLeft--;
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timeLeft = 25 * 60;
  updateDisplay();
}

// Custom set
document.getElementById("set-custom").onclick = () => {
  const mins = parseInt(document.getElementById("custom-min").value);
  if (isNaN(mins) || mins <= 0) {
    alert("Enter a valid number of minutes.");
    return;
  }
  timeLeft = mins * 60;
  updateDisplay();
};

// Buttons
document.getElementById("start-btn").onclick = startTimer;
document.getElementById("pause-btn").onclick = pauseTimer;
document.getElementById("reset-btn").onclick = resetTimer;

// Initialize
updateDisplay();
