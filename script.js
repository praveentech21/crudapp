import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGgjCg0aFMLNEiqQgTMCnTt061IXsc7bE",
  authDomain: "reactapp-f963d.firebaseapp.com",
  databaseURL:
    "https://reactapp-f963d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reactapp-f963d",
  storageBucket: "reactapp-f963d.appspot.com",
  messagingSenderId: "671928270352",
  appId: "1:671928270352:web:ed69f31a567548d59cd495",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const today = new Date();
const dateString = `${String(today.getDate()).padStart(2, "0")}${String(
  today.getMonth() + 1
).padStart(2, "0")}${today.getFullYear()}`;

const dailyTasksRef = ref(database, `dailytaskes/${dateString}`);

// Event listener for Add Task button
document.querySelector(".btn-outline-primary").addEventListener("click", () => {
  // Show the add task modal
  const modal = new bootstrap.Modal(document.getElementById("addTaskModal"));
  modal.show();
});

// Event listener for Add Task modal's "Add Task" button
document.getElementById("submitTaskBtn").addEventListener("click", () => {
  // Get task name and description from input fields
  const taskName = document.getElementById("taskNameInput").value.trim();
  const taskDescription = document
    .getElementById("taskDescriptionInput")
    .value.trim();

  if (taskName !== "" && taskDescription !== "") {
    // Add the task to the database
    addTask(taskName, taskDescription);
    // Clear input fields
    document.getElementById("taskNameInput").value = "";
    document.getElementById("taskDescriptionInput").value = "";
  } else {
    // Show an error message if any field is empty
    alert("Please enter both task name and task description.");
  }
});

function addTask(taskName, taskDescription) {
  const newtask = push(dailyTasksRef);

  // Push the task to the database
  set(newtask, {
    [taskName]: taskDescription,
    status: "pending",
  })
    .then(() => {
      console.log("Task added successfully!");
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("addTaskModal")
      );
      modal.hide();
    })
    .catch((error) => {
      console.error("Error adding task: ", error);
    });
}

function fetchTasksOfToday() {
  onValue(dailyTasksRef, (snapshot) => {
    const tasks = snapshot.val();

    if (tasks) {
      // Iterate over the tasks and display them
      Object.entries(tasks).forEach(([taskName, taskDescription]) => {
        // Get task status
        const status = taskDescription.status;

        let imageSource = "";
        if (status === "pending") {
          imageSource = "Bhavani/img/icons/unicons/paypal.png";
        } else if (status === "running") {
          imageSource = "Bhavani/img/icons/unicons/chart.png";
        } else {
          imageSource = "Bhavani/img/icons/unicons/chart-success.png";
        }

        const [[firstKey, firstValue]] = Object.entries(taskDescription);

        const taskItem = document.createElement("li");
        taskItem.classList.add("d-flex", "mb-4", "pb-1");
        taskItem.innerHTML = `
    <div class="avatar flex-shrink-0 me-3">
      <img src="${imageSource}" alt="Task Icon" class="rounded" />
    </div>
    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
      <div class="me-2">
        <small class="text-muted d-block mb-1">${firstKey}</small>
        <h6 class="mb-0">${firstValue}</h6>
      </div>
      <div class="user-progress d-flex align-items-center gap-1">
        ${createTaskActionButtons(taskName, status)}
      </div>
    </div>
  `;
        document.getElementById("todaytasks").appendChild(taskItem);
      });
    } else {
      console.log("No tasks for today.");
    }
  });
}

function createTaskActionButtons(taskid, status) {
  let actionButtons = "";
  if (status === "pending") {
    actionButtons = `
    <button type="button" data-taskid="${taskid}" data-status="running" class="btn btn-outline-info changetorunning">Edit</i></button>
    <button type="button" data-taskid="${taskid}" class="btn btn-icon btn-outline-danger deletetask"><i class="bx bx-trash-alt"></i></button>
  `;
  } else if (status === "running") {
    actionButtons = `
    <button type="button" data-taskid="${taskid}" data-status="complete" class="btn btn-outline-success changetocomplete">Edit</i></button>
    <button type="button" data-taskid="${taskid}" class="btn btn-icon btn-outline-danger deletetask"><i class="bx bx-trash-alt"></i></button>
  `;
  } else if (status === "complete") {
    actionButtons = `
      <button type="button" data-taskid="${taskid}" class="btn btn-icon btn-outline-danger deletetask"><i class="bx bx-trash-alt"></i></button>
  `;
  }
  return actionButtons;
}

function deleattask(taskId) {
  const dailyTasksRef = ref(database, `dailytaskes/${dateString}/${taskId}`);
  set(dailyTasksRef, null)
    .then(() => {
      console.log("Task deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting task: ", error);
    });
}

function updateTaskStatus(taskId, newStatus) {
  const dailyTasksRef = ref(database, `dailytaskes/${dateString}/${taskId}`);

  // Update the task status in the database
  set(dailyTasksRef, {
    status: newStatus,
  })
    .then(() => {
      console.log("Task status updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating task status: ", error);
    });
}


fetchTasksOfToday();
