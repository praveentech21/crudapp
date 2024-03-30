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

// Function to add task to Firebase database
function addTask(taskName, taskDescription) {
  // Get today's date in the format YYYYMMDD
  const today = new Date();
  const dateString = `${String(today.getDate()).padStart(2, "0")}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${today.getFullYear()}`;

  // Get a reference to the tasks node for today's date
  const dailyTasksRef = ref(database, `dailytaskes/${dateString}`);

  const newtask = push(dailyTasksRef);

  // Push the task to the database
  set(newtask, {
    [taskName]: taskDescription,
    status: "pending",
  })
    .then(() => {
      console.log("Task added successfully!");
      // Close the modal after adding task
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("addTaskModal")
      );
      modal.hide();
    })
    .catch((error) => {
      console.error("Error adding task: ", error);
    });
}

fetchTasksOfToday();

// Function to fetch tasks of today from Firebase
function fetchTasksOfToday() {
  const today = new Date();
  const dateString = `${String(today.getDate()).padStart(2, "0")}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${today.getFullYear()}`;

  const dailyTasksRef = ref(database, `dailytaskes/${dateString}`);

  // Listen for changes to the data at dailyTasksRef
  onValue(dailyTasksRef, (snapshot) => {
    const tasks = snapshot.val(); // Retrieve the data from the snapshot

    // Check if there are tasks available
    if (tasks) {
      // Iterate over the tasks and display them
      Object.entries(tasks).forEach(([taskName, taskDescription]) => {
        // Get task status
        const status = taskDescription.status;

        // Set image source based on task status
        let imageSource = "";
        if (status === "pending") {
          imageSource = "Bhavani/img/icons/unicons/paypal.png";
        } else if (status === "running") {
          imageSource = "Bhavani/img/icons/unicons/chart.png";
        } else {
          imageSource = "Bhavani/img/icons/unicons/chart-success.png";
        }

        // Get the first key-value pair from taskDescription
        const [[firstKey, firstValue]] = Object.entries(taskDescription);
        console.log(firstKey, firstValue);

        // Create HTML elements for each task
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
        <span class="text-muted" type="hidden" id="taskStatus">${status}</span>


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

function createTaskActionButtons(taskId, status) {
  let actionButtons = "";
  if (status === "pending") {
    actionButtons = `
    <button type="button" class="btn btn-outline-info change-status-btn" data-task-id="${taskId}"><i class="tf-icons bx bx-bulb"></i></button>
    <button type="button" class="btn btn-icon btn-outline-danger delete-task-btn" data-task-id="${taskId}"><i class="bx bx-trash-alt"></i></button>
  `;
  } else if (status === "running") {
    actionButtons = `
    <button type="button" class="btn btn-outline-success change-status-btn" data-task-id="${taskId}"><i class="tf-icons bx bx-task"></i></button>
    <button type="button" class="btn btn-icon btn-outline-danger delete-task-btn" data-task-id="${taskId}"><i class="bx bx-trash-alt"></i></button>
  `;
  } else if (status === "complete") {
    actionButtons = `
      <button type="button" class="btn btn-icon btn-outline-danger delete-task-btn" data-task-id="${taskId}"><i class="bx bx-trash-alt"></i></button>
  `;
  }
  return actionButtons;
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".change-status-btn").forEach((button) => {
    console.log(button);
    button.addEventListener("click", () => {
      const taskId = button.dataset.taskId;
      console.log(`Change status button clicked for task ID: ${taskId}`);
      // Implement code to change task status using taskId
    });
  });

  // Event listener for delete task buttons
  document.querySelectorAll(".delete-task-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = button.dataset.taskId;
      console.log(`Delete task button clicked for task ID: ${taskId}`);
      // Implement code to delete task using taskId
    });
  });

  // Event listener for delete task button
  document.getElementById("deleteTaskBtn").addEventListener("click", () => {
    // Perform delete operation (you need to implement this)
    // deleteTask(taskId);
  });

  // Event listener for edit button
  document.getElementById("editTaskBtn").addEventListener("click", () => {
    const taskName = document.getElementById("taskName").textContent.trim();
    const taskDescription = document
      .getElementById("taskDescription")
      .textContent.trim();
    const modalContent = createEditTaskModal(taskName, taskDescription);
    const modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
    document.getElementById("editTaskModalContent").innerHTML = modalContent;
    modal.show();
  });

  // Event listener for save task changes button
  document
    .getElementById("saveTaskChangesBtn")
    .addEventListener("click", () => {
      // Get updated task name and description
      const updatedTaskName = document
        .getElementById("editTaskNameInput")
        .value.trim();
      const updatedTaskDescription = document
        .getElementById("editTaskDescriptionInput")
        .value.trim();

      // Perform update operation (you need to implement this)
      // updateTask(taskId, updatedTaskName, updatedTaskDescription);

      // Close the modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editTaskModal")
      );
      modal.hide();
    });

  // Add similar checks for other event listeners
});

// Call the function to fetch tasks of today when needed
