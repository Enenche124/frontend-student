// admin-dashboard.js

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const email = localStorage.getItem("email");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// ACCESS CONTROL CHECK
if (role !== "ADMIN") {
  alert("Access denied. Redirecting...");
  window.location.href = "../login.html";
}

// Display admin email
const emailDisplay = document.getElementById("admin-email");
if (emailDisplay) {
  emailDisplay.textContent = email || "Admin";
}

// ==========================
// LOAD ALL COURSES
// ==========================
async function loadCourses() {
  try {
    const response = await fetch("http://localhost:9090/api/admin/courses", {
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "../login.html";
    }

    const courses = await response.json();
    console.log("Courses loaded:", courses);
    const list = document.getElementById("coursesList");
    list.innerHTML = "";

    courses.forEach((course) => {
      const li = document.createElement("li");
      
      li.textContent = `${course.courseCode} ${course.courseTitle || "Untitled"} (${course.courseDescription || "No description"}), (${course.courseLecturerEmail || "No lecturer assigned"})`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Failed to load courses:", error);
  }
}
loadCourses();

// ==========================
// LOAD ALL LECTURERS
// ==========================
async function loadLecturers() {
  const lecturersList = document.getElementById("lecturersList");
  if (!lecturersList) return;

  lecturersList.innerHTML = ""; // CLEAR old list

  try {
    const response = await fetch("http://localhost:9090/api/admin/lecturers", {
      headers,
    });

    const lecturers = await response.json();
    lecturers.forEach((email) => {
      const li = document.createElement("li");
      li.textContent = email;
      lecturersList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load lecturers:", err);
  }
}


loadLecturers();

// ==========================
// CREATE COURSE
// ==========================
const createForm = document.getElementById("create-course-form");
if (createForm) {
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const courseCode = document.getElementById("courseCode").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    try {
      const response = await fetch("http://localhost:9090/api/admin/courses", {
        method: "POST",
        headers,
        body: JSON.stringify({ courseCode, title, description }),
      });

      const data = await response.text();
      alert(data);
      createForm.reset();
      loadCourses();
    } catch (err) {
      alert("Failed to create course.");
      console.error(err);
    }
  });
}

// ==========================
// ASSIGN COURSE TO LECTURER
// ==========================
const assignForm = document.getElementById("assign-course-form");
if (assignForm) {
  assignForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const courseCode = document.getElementById("assignCourseCode").value;
    const lecturerEmail = document.getElementById("lecturerEmail").value;

    try {
      const response = await fetch(
        `http://localhost:9090/api/admin/courses/${courseCode}/assign?lecturerEmail=${lecturerEmail}`,
        {
          method: "PUT",
          headers,
        }
      );

      const data = await response.text();
      alert(data);
      assignForm.reset();
    } catch (err) {
      alert("Failed to assign course.");
      console.error(err);
    }
  });
}

// ==========================
// DELETE COURSE
// ==========================
const deleteCourseForm = document.getElementById("delete-course-form");
if (deleteCourseForm) {
  deleteCourseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const courseCode = document.getElementById("deleteCourseCode").value;

    try {
      const response = await fetch(
        `http://localhost:9090/api/admin/delete-course?courseCode=${courseCode}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.text();
      alert(data);
      deleteCourseForm.reset();
      loadCourses();
    } catch (err) {
      alert("Failed to delete course.");
      console.error(err);
    }
  });
}

// ==========================
// DELETE LECTURER
// ==========================
const deleteLecturerForm = document.getElementById("delete-lecturer-form");
if (deleteLecturerForm) {
  deleteLecturerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("deleteLecturerEmail").value;

    try {
      const response = await fetch(
        `http://localhost:9090/api/admin/delete-lecturer?email=${email}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.text();
      console.log("Delete response:", data);
      alert(data);
      deleteLecturerForm.reset();
      loadLecturers();
    } catch (err) {
      alert("Failed to delete lecturer.");
      console.error(err);
    }
  });
}



const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    alert("Logged out successfully.");
    window.location.href = "../login.html";
  });
}



const createUserForm = document.getElementById("create-user-form");
if (createUserForm) {
  createUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("newUserName").value.trim();
    const email = document.getElementById("newUserEmail").value.trim();
    const password = document.getElementById("newUserPassword").value.trim();
    const role = document.getElementById("newUserRole").value;

    try {
      const response = await fetch("http://localhost:9090/api/admin/create-user", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.text();
      alert(data);

      createUserForm.reset();
      loadLecturers(); // refresh list if new lecturer was added
    } catch (err) {
      alert("Failed to create user.");
      console.error(err);
    }
  });
}
