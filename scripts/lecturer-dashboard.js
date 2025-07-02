// lecturer-dashboard.js

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const email = localStorage.getItem("email");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Redirect if not lecturer
if (role !== "LECTURER") {
  alert("Access denied. Redirecting...");
  window.location.href = "../login.html";
}

// Display lecturer email
const lecturerEmailDisplay = document.getElementById("lecturer-email");
if (lecturerEmailDisplay) {
  lecturerEmailDisplay.textContent = email || "Lecturer";
}

// ==============================
// Load Assigned Courses
// ==============================
async function loadLecturerCourses() {
  try {
    const response = await fetch("http://localhost:9090/api/v1/lecturer/courses", { headers });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }

    const courses = await response.json();
    const list = document.getElementById("lecturerCoursesList");
    list.innerHTML = "";

    courses.forEach(course => {
      const li = document.createElement("li");
      li.textContent = `CourseCode: ${course.courseCode} Title: ${course.courseTitle || "Untitled"} Description: (${course.courseDescription || "No description"})`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load courses:", error.message);
  }
}

loadLecturerCourses();

// ==============================
// Load Enrolled Students
// ==============================
async function loadEnrolledStudents() {
  try {
    const response = await fetch("http://localhost:9090/api/v1/lecturer/students", { headers });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg);
    }

    const students = await response.json();
    const list = document.getElementById("studentsList");
    list.innerHTML = "";

    students.forEach(student => {
        console.log("Student:", student);
        
      const li = document.createElement("li");
      li.textContent = `${student.name} (${student.studentEmail})`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load students:", error.message);
  }
}

loadEnrolledStudents();

// ==============================
// Assign Grade
// ==============================
const assignGradeForm = document.getElementById("assign-grade-form");
if (assignGradeForm) {
  assignGradeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentEmail = document.getElementById("studentEmail").value.trim();
    const courseCode = document.getElementById("courseCode").value.trim();
    const score = parseInt(document.getElementById("score").value.trim());

    try {
      const response = await fetch("http://localhost:9090/api/v1/lecturer/assign-grade", {
        method: "POST",
        headers,
        body: JSON.stringify({ studentEmail, courseCode, score }),
      });

      const message = await response.text();
      alert(message);
      assignGradeForm.reset();
    } catch (error) {
      alert("Failed to assign grade.");
      console.error(error);
    }
  });
}

// ==============================
// Logout
// ==============================
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    alert("Logged out successfully.");
    window.location.href = "../login.html";
  });
}
