const subjectForm = document.getElementById("subject-form");
const subjectsTable = document.getElementById("subjects-table");
const subjectsBody = document.getElementById("subjects-body");
const subjectsEmpty = document.getElementById("subjects-empty");

async function loadSubjects() {
  try {
    const subjects = await apiGet("/subjects");
    if (!subjects.length) {
      subjectsTable.style.display = "none";
      subjectsEmpty.style.display = "block";
      return;
    }
    subjectsTable.style.display = "table";
    subjectsEmpty.style.display = "none";

    subjectsBody.innerHTML = "";
    subjects.forEach((s) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "badge";
      const dot = document.createElement("span");
      dot.className = "badge-dot";
      dot.style.background = s.color || "#2563eb";
      badge.appendChild(dot);
      badge.append(s.name);
      nameTd.appendChild(badge);

      const codeTd = document.createElement("td");
      codeTd.textContent = s.code || "-";

      const teacherTd = document.createElement("td");
      teacherTd.textContent = s.teacher || "-";

      const createdTd = document.createElement("td");
      createdTd.textContent = new Date(s.createdAt).toLocaleDateString();

      const actionsTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger";
      delBtn.textContent = "Delete";
      delBtn.onclick = async () => {
        if (confirm("Delete this subject?")) {
          await apiDelete(`/subjects/${s.id}`);
          loadSubjects();
        }
      };
      actionsTd.appendChild(delBtn);

      tr.append(nameTd, codeTd, teacherTd, createdTd, actionsTd);
      subjectsBody.appendChild(tr);
    });
  } catch (e) {
    subjectsEmpty.textContent = "Failed to load subjects.";
    console.error(e);
  }
}

subjectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    name: subjectForm["name"].value,
    code: subjectForm["code"].value,
    teacher: subjectForm["teacher"].value,
    color: subjectForm["color"].value,
    notes: subjectForm["notes"].value,
  };
  try {
    await apiPost("/subjects", body);
    subjectForm.reset();
    subjectForm["color"].value = "#2563eb";
    loadSubjects();
  } catch (e) {
    alert("Failed to save subject");
  }
});

document.addEventListener("DOMContentLoaded", loadSubjects);
