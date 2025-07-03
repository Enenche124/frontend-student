
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const email = localStorage.getItem("email");
const userName = localStorage.getItem("userName");
const nameDisplay = document.getElementById("welcome-name");


const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};


if (role !== "LECTURER") {
  showMessage("Access denied. Redirecting...");
  window.location.href = "../login.html";
}

if(nameDisplay && userName) {
  nameDisplay.textContent = `Welcome, ${userName}`;
}


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
      showMessage(message);
      assignGradeForm.reset();
    } catch (error) {
      showMessage("Failed to assign grade.");
      console.error(error);
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



function showMessage(message, type = "success") {
  const notification = document.getElementById("notification");
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 4000); 
}
