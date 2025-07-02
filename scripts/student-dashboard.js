// student-dashboard.js

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const email = localStorage.getItem("email");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Access control
if (role !== "STUDENT") {
  alert("Access denied. Redirecting...");
  window.location.href = "../login.html";
}

// Show student email
document.getElementById("student-email").textContent = email || "Student";

// ==========================
// Load Available Courses
// ==========================
async function loadAvailableCourses() {
  try {
    const response = await fetch("http://localhost:9090/api/v1/student/available-courses", {
      headers,
    });
    const courses = await response.json();

    const list = document.getElementById("availableCoursesList");
    list.innerHTML = "";

    courses.forEach((course) => {
      const li = document.createElement("li");
      li.textContent = `${course.courseCode} - ${course.courseTitle || "Untitled"} (${course.courseDescription || "No description"})`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load available courses:", err);
  }
}

// ==========================
// Load Enrolled Courses
// ==========================
async function loadEnrolledCourses() {
  try {
    const response = await fetch("http://localhost:9090/api/v1/student/enrolled-courses", {
      headers,
    });
    const courses = await response.json();

    const list = document.getElementById("enrolledCoursesList");
    list.innerHTML = "";

    courses.forEach((course) => {
      const li = document.createElement("li");
      li.textContent = `${course.courseCode} - ${course.courseTitle || "Untitled"}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load enrolled courses:", err);
  }
}

// ==========================
// Load Grades
// ==========================
async function loadGrades() {
  try {
    const response = await fetch("http://localhost:9090/api/v1/student/performance", {
      headers,
    });
    const grades = await response.json();

    const list = document.getElementById("gradesList");
    list.innerHTML = "";

    grades.forEach((grade) => {
      const li = document.createElement("li");
      li.textContent = `Course:-> ${grade.courseCode}  Grade -> ${grade.grade} Score ->  ${grade.score}%  Position -> ${grade.position}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load grades:", err);
  }
}

// ==========================
// Enroll in a Course
// ==========================
const enrollForm = document.getElementById("enroll-form");
if (enrollForm) {
  enrollForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const courseCode = document.getElementById("enrollCourseCode").value.trim();

    try {
      const response = await fetch(`http://localhost:9090/api/v1/student/enroll?courseCode=${courseCode}`, {
        method: "POST",
        headers,
      });

      const result = await response.text();
      alert(result);
      enrollForm.reset();
      loadAvailableCourses();
      loadEnrolledCourses();
    } catch (err) {
      alert("Enrollment failed.");
      console.error(err);
    }
  });
}

// ==========================
// Logout
// ==========================
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    alert("Logged out.");
    window.location.href = "../login.html";
  });
}

// Initial Loads
loadAvailableCourses();
loadEnrolledCourses();
loadGrades();
