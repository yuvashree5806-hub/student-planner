const today = new Date().toISOString().split("T")[0];
const weekdayShort = new Date().toLocaleString("default", { weekday: "short" });

// Stats
const statSubjects = document.getElementById("stat-subjects");
const statTasks = document.getElementById("stat-tasks");
const statTodayTasks = document.getElementById("stat-today-tasks");
const statReminders = document.getElementById("stat-reminders");

// Lists
const todayClassesList = document.getElementById("today-classes-list");
const todayClassesEmpty = document.getElementById("today-classes-empty");

const tasksTodayList = document.getElementById("tasks-today-list");
const tasksTodayEmpty = document.getElementById("tasks-today-empty");

const deadlinesList = document.getElementById("deadlines-list");
const deadlinesEmpty = document.getElementById("deadlines-empty");

const remindersList = document.getElementById("reminders-list");
const remindersEmptyList = document.getElementById("reminders-empty-list");

// Load all dashboard data
document.addEventListener("DOMContentLoaded", async () => {
  const subjects = await apiGet("/subjects");
  const tasks = await apiGet("/tasks");
  const timetable = await apiGet("/timetable");
  const reminders = await apiGet("/reminders");

  // Update stats
  statSubjects.textContent = subjects.length;
  statTasks.textContent = tasks.length;
  statReminders.textContent = reminders.length;

  const todayTasks = tasks.filter((t) => t.deadline.startsWith(today));
  statTodayTasks.textContent = todayTasks.length;

  // Today’s classes
  const todayClasses = timetable.filter((c) => c.day === weekdayShort);
  if (!todayClasses.length) {
    todayClassesEmpty.style.display = "block";
  } else {
    todayClassesEmpty.style.display = "none";
    todayClasses.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = `${c.Subject?.name || ""} (${c.startTime.slice(0, 5)} – ${c.endTime.slice(0, 5)})`;
      todayClassesList.appendChild(li);
    });
  }

  // Tasks due today
  if (!todayTasks.length) {
    tasksTodayEmpty.style.display = "block";
  } else {
    tasksTodayEmpty.style.display = "none";
    todayTasks.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = `${t.title} (${t.Subject?.name || ""})`;
      tasksTodayList.appendChild(li);
    });
  }

  // Upcoming deadlines
  const upcoming = tasks
    .filter((t) => t.deadline > today)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  if (!upcoming.length) {
    deadlinesEmpty.style.display = "block";
  } else {
    deadlinesEmpty.style.display = "none";
    upcoming.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = `${t.title} – ${new Date(t.deadline).toLocaleDateString()}`;
      deadlinesList.appendChild(li);
    });
  }

  // Reminders
  if (!reminders.length) {
    remindersEmptyList.style.display = "block";
  } else {
    remindersEmptyList.style.display = "none";
    reminders.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `${r.Task?.title || ""} – ${new Date(r.remindAt).toLocaleString()}`;
      remindersList.appendChild(li);
    });
  }
});
