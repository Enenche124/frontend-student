
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const email = localStorage.getItem("email");
const userName = localStorage.getItem("userName");
const nameDisplay = document.getElementById("welcome-name");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

if (role !== "ADMIN") {
  showMessage("Access denied. Redirecting...");
  window.location.href = "../login.html";
}

if (nameDisplay && userName) {
  nameDisplay.textContent = `Welcome, ${userName}`;
}


async function loadCourses() {
  try {
    const response = await fetch("http://localhost:9090/api/admin/courses", {
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      showMessage("Session expired. Please login again.");
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


async function loadLecturers() {
  const lecturersList = document.getElementById("lecturersList");
  if (!lecturersList) return;

  lecturersList.innerHTML = ""; 

  try {
    const response = await fetch("http://localhost:9090/api/admin/lecturers", {
      headers,
    });

    const lecturers = await response.json();
    

    if (!Array.isArray(lecturers)) {
      throw new Error("Invalid lecturer list format");
    }

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
      showMessage(data);
      createForm.reset();
      loadCourses();
    } catch (err) {
      showMessage("Failed to create course.");
      console.error(err);
    }
  });
}




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
      showMessage(data);
      assignForm.reset();
      loadCourses(); 
    } catch (err) {
      showMessage("Failed to assign course.");
      console.error(err);
    }
  });
}




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
      showMessage(data);
      deleteCourseForm.reset();
      loadCourses();
    } catch (err) {
      showMessage("Failed to delete course.");
      console.error(err);
    }
  });
}




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
      showMessage(data);
      deleteLecturerForm.reset();
      loadLecturers();
    } catch (err) {
      showMessage("Failed to delete lecturer.");
      console.error(err);
    }
  });
}


const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    showMessage("Logged out successfully.");
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
      showMessage(data);

      createUserForm.reset();
      loadLecturers(); 
      loadCourses();  
    } catch (err) {
      showMessage("Failed to create user.");
      console.error(err);
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

