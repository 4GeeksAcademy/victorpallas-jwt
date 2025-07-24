// src/front/authButton.js

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("auth-button");

  if (!button) return;

  const token = localStorage.getItem("token");

  if (token) {
    button.textContent = "Logout";
    button.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  } else {
    button.textContent = "Login";
    button.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }
});
