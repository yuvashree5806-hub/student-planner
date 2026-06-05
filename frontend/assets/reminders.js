const remForm = document.getElementById("reminder-form");
const remTaskSelect = document.getElementById("rem-task");
const remHelp = document.getElementById("reminders-help");
const remEmpty = document.getElementById("reminders-empty");
const remTable = document.getElementById("reminders-table");
const remBody = document.getElementById("reminders-body");

let allTasks = [];

// Load tasks for dropdown
async function loadTasksForReminders() {
  try {
    allTasks = await apiGet("/tasks");

    if (!allTasks.length) {
      remTaskSelect.innerHTML = "";
      remTaskSelect.disabled = true;
      remHelp.textContent = "Add at least one task first to create reminders.";
      return;
    }

    remTaskSelect.disabled = false;
    remHelp.textContent = "Choose a task and when you want to be reminded.";

    remTaskSelect.innerHTML = '<option value="">Select task</option>';
    allTasks.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.title;
      remTaskSelect.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
    remHelp.textContent = "Failed to load tasks.";
  }
}

// Load reminders list
async function loadReminders() {
  try {
    const reminders = await apiGet("/reminders");

    if (!reminders.length) {
      remTable.style.display = "none";
      remEmpty.style.display = "block";
      return;
    }

    remTable.style.display = "table";
    remEmpty.style.display = "none";
    remBody.innerHTML = "";

    reminders.forEach((r) => {
      const tr = document.createElement("tr");

      // Task name
      const taskTd = document.createElement("td");
      taskTd.textContent = r.Task ? r.Task.title : "(no task)";

      // Time
      const whenTd = document.createElement("td");
      const dt = new Date(r.remindAt);
      whenTd.textContent = dt.toLocaleString();

      // Message
      const msgTd = document.createElement("td");
      msgTd.textContent = r.message || "-";

      // Actions
      const actionsTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger";
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        if (confirm("Delete this reminder?")) {
          await apiDelete(`/reminders/${r.id}`);
          loadReminders();
        }
      };
      actionsTd.appendChild(delBtn);

      tr.append(taskTd, whenTd, msgTd, actionsTd);
      remBody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    remEmpty.textContent = "Failed to load reminders.";
  }
}

// Handle form submit
remForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const taskId = parseInt(remForm["taskId"].value, 10);
  const remindAt = remForm["remindAt"].value;
  const message = remForm["message"].value;

  if (!taskId || !remindAt) {
    alert("Please choose a task and reminder time.");
    return;
  }

  try {
    await apiPost("/reminders", { taskId, remindAt, message });
    remForm.reset();
    loadReminders();
  } catch (e) {
    console.error(e);
    alert("Failed to save reminder.");
  }
});

// Init
document.addEventListener("DOMContentLoaded", async () => {
  await loadTasksForReminders();
  await loadReminders();
});
