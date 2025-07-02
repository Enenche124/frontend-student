document.getElementById("assignCourseForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Not authorized");
    window.location.href = "../login.html";
    return;
  }

  const courseCode = document.getElementById("courseCode").value.trim();
  const lecturerEmail = document.getElementById("lecturerEmail").value.trim();

  try {
    const response = await fetch(`http://localhost:9090/api/admin/courses/${courseCode}/assign?lecturerEmail=${lecturerEmail}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.text();

    if (response.ok) {
      document.getElementById("message").textContent = "✅ " + result;
    } else {
      document.getElementById("message").textContent = "❌ Error: " + result;
    }
  } catch (err) {
    document.getElementById("message").textContent = "❌ Network Error: " + err.message;
  }
});
