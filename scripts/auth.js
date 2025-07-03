const apiBaseUrl = "http://localhost:9090/api/v1/auth"; 


const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
      showMessage("All fields are required.", "error");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage("Registration successful!");
        window.location.href = "login.html";
      } else {
        showMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      showMessage("Invalid Credential,.");
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.name);
        showMessage("Login successful!");

        window.location.href = "dashboard-redirect.html";
      } else {
        showMessage(data.message || "Login failed.");
      }
    } catch (error) {
      showMessage("Error during login.");
      console.error(error);
    }
  });
}

function showMessage(message, type = "success") {
  const notification = document.getElementById("notification");
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 4000); 
}
