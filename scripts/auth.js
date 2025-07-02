const apiBaseUrl = "http://localhost:9090/api/v1/auth"; 

// REGISTER FUNCTION
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    try {
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();
      if (data.success) {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      alert("Error during registration.");
      console.error(error);
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.success && data.token) {
        // Store token and role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Login successful!");

        window.location.href = "dashboard-redirect.html";
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      alert("Error during login.");
      console.error(error);
    }
  });
}
