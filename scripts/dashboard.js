// scripts/dashboard.js

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "../login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");

  if (!role) {
    alert("Not authorized. Redirecting to login...");
    window.location.href = "../login.html";
    return;
  }

  document.getElementById("user-role").textContent = role;

  const navLinks = document.getElementById("nav-links");
  let links = "";

  switch (role) {
    case "ADMIN":
      links = `
        <li><a href="../admin/create-course.html">Create Course</a></li>
        <li><a href="../admin/manage-users.html">Manage Users</a></li>
      `;
      break;

    case "LECTURER":
      links = `
        <li><a href="lecturer-assign-grade.html">Assign Grades</a></li>
        <li><a href="lecturer-courses.html">My Courses</a></li>
        <li><a href="lecturer-students.html">Enrolled Students</a></li>
      `;
      break;

    case "STUDENT":
      links = `
        <li><a href="student-courses.html">My Courses</a></li>
        <li><a href="student-grades.html">My Grades</a></li>
      `;
      break;
  }

  navLinks.innerHTML = links;
});
