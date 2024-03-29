// Initialize Firebase
var firebaseConfig = {
  // Your Firebase configuration
};

firebase.initializeApp(firebaseConfig);

// Reference to Firestore collection
var db = firebase.firestore();

// Function to load tasks from Firebase
function loadTasks() {
  var taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear existing tasks

  // Get today's date
  var today = new Date();
  var todayStr = today.toISOString().split("T")[0];

  // Query Firestore for tasks for today
  db.collection("tasks")
    .where("date", "==", todayStr)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var taskData = doc.data();
        var taskItem = document.createElement("div");
        taskItem.classList.add("taskItem");
        taskItem.innerHTML = `
          <p>${taskData.title}</p>
          <button onclick="changeStatus('${doc.id}', '${taskData.status}')">${
          taskData.status === "complete" ? "Mark Incomplete" : "Mark Complete"
        }</button>
        `;
        taskList.appendChild(taskItem);
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

// Function to change task status
function changeStatus(taskId, currentStatus) {
  var newStatus = currentStatus === "complete" ? "incomplete" : "complete";
  db.collection("tasks")
    .doc(taskId)
    .update({
      status: newStatus,
    })
    .then(() => {
      loadTasks(); // Reload tasks after status change
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
}

// Load tasks when page loads
loadTasks();

// Event listener for Add New Task button
document.getElementById("addTaskBtn").addEventListener("click", () => {
  // Redirect to add task page or open a modal for adding task
  // Implement based on your preference
});

// Function to load previous day's tasks
function loadPreviousTasks() {
  var dateInput = document.getElementById("dateInput").value;
  var previousTaskList = document.getElementById("previousTaskList");
  previousTaskList.innerHTML = ""; // Clear existing tasks

  // Query Firestore for tasks for selected date
  db.collection("tasks")
    .where("date", "==", dateInput)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var taskData = doc.data();
        var taskItem = document.createElement("div");
        taskItem.classList.add("taskItem");
        taskItem.innerHTML = `
          <p>${taskData.title}</p>
          <p>Status: ${taskData.status}</p>
        `;
        previousTaskList.appendChild(taskItem);
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
}

// Event listener for Add New Task button
document.getElementById("addTaskBtn").addEventListener("click", () => {
  // Show modal for adding new task
  document.getElementById("addTaskModal").style.display = "block";
});

// Close the modal when close button is clicked
document.getElementsByClassName("close")[0].addEventListener("click", () => {
  document.getElementById("addTaskModal").style.display = "none";
});

// Function to handle submission of new task
document.getElementById("submitTaskBtn").addEventListener("click", () => {
  var taskInput = document.getElementById("taskInput").value.trim();

  if (taskInput !== "") {
    // Add the task to Firestore
    addTask(taskInput);

    // Clear input field
    document.getElementById("taskInput").value = "";

    // Close the modal
    document.getElementById("addTaskModal").style.display = "none";
  } else {
    // Display an alert or error message for empty task input
    alert("Please enter a task description.");
  }
});

// Function to add task to Firestore
function addTask(taskDescription) {
  var today = new Date();
  var todayStr = today.toISOString().split("T")[0];

  db.collection("tasks")
    .add({
      title: taskDescription,
      status: "incomplete",
      date: todayStr,
    })
    .then(() => {
      // Reload tasks after adding new task
      loadTasks();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
