let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const grid = document.getElementById("calendar-grid");
const title = document.getElementById("calendar-title");

let tasks = [];
let timetable = [];

// Load tasks + timetable
async function loadEvents() {
  tasks = await apiGet("/tasks");
  timetable = await apiGet("/timetable");
}

// Generate calendar
function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthName = new Date(currentYear, currentMonth)
    .toLocaleString("default", { month: "long" });

  title.textContent = `${monthName} ${currentYear}`;
  grid.innerHTML = "";

  // Empty cells before day 1
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell", "empty");
    grid.appendChild(cell);
  }

  // Actual days
  for (let date = 1; date <= daysInMonth; date++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-cell");

    // Label
    const dayLabel = document.createElement("div");
    dayLabel.className = "calendar-day";
    const weekday = new Date(currentYear, currentMonth, date).toLocaleString("default", { weekday: "short" });
    dayLabel.textContent = weekday;

    const dateLabel = document.createElement("div");
    dateLabel.className = "calendar-date";
    dateLabel.textContent = date;

    cell.append(dayLabel, dateLabel);

    const fullDate = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;

    // Check for tasks due this date
    const hasDeadline = tasks.some(t => t.deadline.startsWith(fullDate));

    // Check if timetable events exist on this weekday (optional)
    const weekdayShort = weekday.slice(0,3);
    const hasClass = timetable.some(ev => ev.day === weekdayShort);

    if (hasDeadline) {
      const dot = document.createElement("div");
      dot.classList.add("event-dot", "deadline-dot");
      cell.appendChild(dot);
    } else if (hasClass) {
      const dot = document.createElement("div");
      dot.classList.add("event-dot");
      cell.appendChild(dot);
    }

    // Event click
    cell.onclick = () => openModal(fullDate);

    grid.appendChild(cell);
  }
}

// Modal
const modal = document.getElementById("calendar-modal");
const modalDate = document.getElementById("modal-date");
const modalEvents = document.getElementById("modal-events");
document.getElementById("close-modal").onclick = () => modal.classList.add("hidden");

function openModal(date) {
  modalDate.textContent = new Date(date).toDateString();
  modalEvents.innerHTML = "";

  const deadlineTasks = tasks.filter(t => t.deadline.startsWith(date));
  const weekday = new Date(date).toLocaleString("default", { weekday: "short" });
  const dayClasses = timetable.filter(ev => ev.day === weekday);

  if (!deadlineTasks.length && !dayClasses.length) {
    modalEvents.innerHTML = "<p class='text-muted'>No events.</p>";
  }

  deadlineTasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "chip";
    div.style.borderColor = "#dc2626";
    div.textContent = `Deadline: ${t.title}`;
    modalEvents.appendChild(div);
  });

  dayClasses.forEach(e => {
    const div = document.createElement("div");
    div.className = "chip";
    div.textContent = `Class: ${e.Subject ? e.Subject.name : ''} (${e.startTime.slice(0,5)})`;
    modalEvents.appendChild(div);
  });

  modal.classList.remove("hidden");
}

// Buttons
document.getElementById("prev-month").onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
};

document.getElementById("next-month").onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
};

// Init
document.addEventListener("DOMContentLoaded", async () => {
  await loadEvents();
  renderCalendar();
});
