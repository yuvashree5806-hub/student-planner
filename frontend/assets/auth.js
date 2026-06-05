const API_BASE = "http://localhost:5000/api";
const TOKEN_KEY = "token";

if (localStorage.getItem(TOKEN_KEY)) {
  window.location.href = "index.html";
}

function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

async function submitAuth(endpoint, body, errorId) {
  setError(errorId, "");
  try {
    const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(errorId, data.message || "Request failed");
      return;
    }
    localStorage.setItem(TOKEN_KEY, data.token);
    window.location.href = "index.html";
  } catch {
    setError(errorId, "Could not reach server. Is the backend running?");
  }
}

document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  submitAuth("login", {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
  }, "auth-error");
});

document.getElementById("register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("password-confirm").value;
  if (password !== confirm) {
    setError("auth-error", "Passwords do not match");
    return;
  }
  submitAuth("register", {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password,
  }, "auth-error");
});
