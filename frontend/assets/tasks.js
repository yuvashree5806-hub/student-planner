const taskForm = document.getElementById("task-form");
const taskSubjectSelect = document.getElementById("task-subject");
const tasksTable = document.getElementById("tasks-table");
const tasksBody = document.getElementById("tasks-body");
const tasksEmpty = document.getElementById("tasks-empty");

// Load subjects in dropdown
async function loadSubjects() {
  const subjects = await apiGet("/subjects");
  taskSubjectSelect.innerHTML = '<option value="">Select subject</option>';

  subjects.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    taskSubjectSelect.appendChild(opt);
  });
}

// Load tasks
async function loadTasks() {
  const tasks = await apiGet("/tasks");

  if (!tasks.length) {
    tasksTable.style.display = "none";
    tasksEmpty.style.display = "block";
    return;
  }

  tasksTable.style.display = "table";
  tasksEmpty.style.display = "none";
  tasksBody.innerHTML = "";

  tasks.forEach((t) => {
    const tr = document.createElement("tr");

    // Title
    const titleTd = document.createElement("td");
    titleTd.textContent = t.title;

    // Subject
    const subjectTd = document.createElement("td");
    subjectTd.textContent = t.Subject ? t.Subject.name : "-";

    // Deadline
    const deadlineTd = document.createElement("td");
    deadlineTd.textContent = new Date(t.deadline).toLocaleDateString();

    // Status badge
    const statusTd = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "chip";
    
    if (t.status === "completed") {
      badge.style.borderColor = "#10b981";
      badge.style.color = "#059669";
      badge.textContent = "Completed";
    } else if (t.status === "in-progress") {
      badge.style.borderColor = "#fbbf24";
      badge.style.color = "#d97706";
      badge.textContent = "In Progress";
    } else {
      badge.style.borderColor = "#ef4444";
      badge.style.color = "#b91c1c";
      badge.textContent = "Pending";
    }

    statusTd.appendChild(badge);

    // Actions
    const actionsTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      if (confirm("Delete this task?")) {
        await apiDelete(`/tasks/${t.id}`);
        loadTasks();
      }
    };
    actionsTd.appendChild(delBtn);

    tr.append(titleTd, subjectTd, deadlineTd, statusTd, actionsTd);
    tasksBody.appendChild(tr);
  });
}

// Save new task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    title: taskForm["title"].value,
    subjectId: parseInt(taskForm["subjectId"].value),
    deadline: taskForm["deadline"].value,
    status: taskForm["status"].value,
    notes: taskForm["notes"].value,
  };

  await apiPost("/tasks", body);
  taskForm.reset();
  loadTasks();
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSubjects();
  loadTasks();
});
