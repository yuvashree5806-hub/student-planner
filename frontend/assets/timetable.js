const ttForm = document.getElementById("tt-form");
const ttSubjectSelect = document.getElementById("tt-subject");
const ttTable = document.getElementById("tt-table");
const ttBody = document.getElementById("tt-body");
const ttEmpty = document.getElementById("tt-empty");

async function loadSubjectsForTimetable() {
  const subjects = await apiGet("/subjects");
  ttSubjectSelect.innerHTML = '<option value="">Select subject</option>';
  subjects.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    ttSubjectSelect.appendChild(opt);
  });
}

async function loadTimetable() {
  try {
    const entries = await apiGet("/timetable");
    if (!entries.length) {
      ttTable.style.display = "none";
      ttEmpty.style.display = "block";
      return;
    }
    ttTable.style.display = "table";
    ttEmpty.style.display = "none";

    ttBody.innerHTML = "";
    entries.forEach((e) => {
      const tr = document.createElement("tr");

      const dayTd = document.createElement("td");
      dayTd.textContent = e.day;

      const timeTd = document.createElement("td");
      timeTd.textContent = `${e.startTime.slice(0, 5)} – ${e.endTime.slice(0, 5)}`;

      const subjectTd = document.createElement("td");
      subjectTd.textContent = e.Subject ? e.Subject.name : "-";

      const roomTd = document.createElement("td");
      roomTd.textContent = e.room || "-";

      const actionsTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger";
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        if (confirm("Delete this entry?")) {
          await apiDelete(`/timetable/${e.id}`);
          loadTimetable();
        }
      };
      actionsTd.appendChild(delBtn);

      tr.append(dayTd, timeTd, subjectTd, roomTd, actionsTd);
      ttBody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    ttEmpty.textContent = "Failed to load timetable.";
  }
}

ttForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const body = {
    day: ttForm["day"].value,
    startTime: ttForm["start"].value,
    endTime: ttForm["end"].value,
    subjectId: parseInt(ttForm["subjectId"].value, 10),
    room: ttForm["room"].value,
  };
  try {
    await apiPost("/timetable", body);
    ttForm.reset();
    loadTimetable();
  } catch (e) {
    alert("Failed to save entry");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadSubjectsForTimetable();
  loadTimetable();
});
