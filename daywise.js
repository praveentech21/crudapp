import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8h-Or1Qp1NE0OpQ-zlRuhdD4izqmaMlg",
  authDomain: "taskmanager-332b3.firebaseapp.com",
  databaseURL:
    "https://taskmanager-332b3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "taskmanager-332b3",
  storageBucket: "taskmanager-332b3.appspot.com",
  messagingSenderId: "408951169059",
  appId: "1:408951169059:web:9c6b9bd78441c67a301196",
};

// Initialize Firebase
document.getElementById('getdatebutton').addEventListener('click', () => {
  const date = document.getElementById('requieddate').value;
  console.log(date);
  const today = new Date(date);
  const dateString = `${String(today.getDate()).padStart(2, "0")}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${today.getFullYear()}`;
  console.log(dateString);

  const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
  const dailyTasksRef = ref(database, `dailytaskes/${dateString}`);

  const todaytasks = document.getElementById("todaytasks");
  todaytasks.innerHTML = "";
  
  todaystasks(dailyTasksRef);
});

function todaystasks(dailyTasksRef) {
  onValue(dailyTasksRef, (snapshot) => {
    const data = snapshot.val()
    if(data) {
      Object.entries(data).forEach(([key, value]) => {

        const status = value.taskstatus;
        const [[firstkey, keydesc]] = Object.entries(value);

        let imageSource = "";
        let actionButtons = "";

        if (status === "pending") {
          imageSource = "Bhavani/img/icons/unicons/paypal.png";
          actionButtons = `
          <button type="button" data-taskid="${key}" data-firstkey="${firstkey}" data-keydesc="${keydesc}" data-status="${status}" class="btn btn-outline-secondary updatetaskdetails" >Edit</button>
          <button type="button" data-taskid="${key}" data-status="running" class="btn btn-outline-info changetorunning"><i class="tf-icons bx bx-rocket"></i></i></button>
          <button type="button" data-taskid="${key}" class="btn btn-icon btn-outline-danger deletetask"><i class="bx bx-trash-alt"></i></button>
        `;
      
        } else if (status === "running") {
            actionButtons = `
            <button type="button" data-taskid="${key}" data-firstkey="${firstkey}" data-keydesc="${keydesc}" data-status="${status}" class="btn btn-outline-secondary updatetaskdetails" >Edit</button>
            <button type="button" data-taskid="${key}" data-status="complete" class="btn btn-outline-success changetocomplete"><i class="tf-icons bx bx-rocket"></i></i></button>
            <button type="button" data-taskid="${key}" class="btn btn-icon btn-outline-danger deletetask"><i class="bx bx-trash-alt"></i></button>
          `;
          imageSource = "Bhavani/img/icons/unicons/chart.png";
        } else if(status === "completed"){
          imageSource = "Bhavani/img/icons/unicons/chart-success.png";
          actionButtons = `
          <button type="button" data-taskid="${key}" data-firstkey="${firstkey}" data-keydesc="${keydesc}" data-status="${status}" class="btn btn-outline-secondary updatetaskdetails" >Edit</button>
            <button type="button" data-taskid="${taskid}" class="btn btn-icon btn-outline-danger deletetask"><i class="bx bx-trash-alt"></i></button>
        `;
        }

        todaytasks.innerHTML += `<li class="d-flex mb-4 pb-1">
        <div class="avatar flex-shrink-0 me-3">
          <img src="${imageSource}" alt="Statusicon" class="rounded" />
        </div>
        <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
          <div class="me-2">
            <small class="text-muted d-block mb-1">${firstkey}</small>
            <h6 class="mb-0">${keydesc}</h6>
          </div>
          <div class="user-progress d-flex align-items-center gap-1">
            ${actionButtons}
          </div>
        </div>
      </li>`
        });
    }
    else {
      console.log("No tasks for that day");
        document.getElementById("todaytasks").innerHTML = "<p>No tasks for that day</p>";
        }
}
    );
}

document.getElementById("todaytasks").addEventListener("click", (e) => {
  if (e.target.classList.contains("deletetask")) {
    const taskid = e.target.getAttribute("data-taskid");
    console.log("delete task", taskid);
    deleteTask(taskid);
  } else if (e.target.classList.contains("changetorunning")) {
    const taskid = e.target.getAttribute("data-taskid");
    console.log("change to running", taskid);
    updateTaskStatus(taskid, "running");
  } else if (e.target.classList.contains("changetocomplete")) {
    const taskid = e.target.getAttribute("data-taskid");
    console.log("change to complete", taskid);
    updateTaskStatus(taskid, "completed");
  } else if (e.target.classList.contains("updatetaskdetails")) {
    document.getElementById("taskNameUpdate").value = e.target.getAttribute("data-firstkey");
    document.getElementById("taskDescriptionUpdate").value = e.target.getAttribute("data-keydesc");
    document.getElementById("taskidtoupdate").value = e.target.getAttribute("data-taskid");
    document.getElementById("taskstatusnow").value = e.target.getAttribute("data-status");
    const modal = new bootstrap.Modal(document.getElementById("updatetaskmodel"));
    modal.show();
  }
});

document.getElementById("updatetaskbutton").addEventListener("click", () => {
    const taskid = document.getElementById("taskidtoupdate").value;
    const taskName = document.getElementById("taskNameUpdate").value.trim();
    const taskDescription = document.getElementById("taskDescriptionUpdate").value.trim();
    const taskstatus = document.getElementById("taskstatusnow").value;
    if (taskName !== "" && taskDescription !== "") {
        updateTask(taskid, taskName, taskDescription, taskstatus);
        document.getElementById("taskNameUpdate").value = "";
        document.getElementById("taskDescriptionUpdate").value = "";
        document.getElementById("taskidtoupdate").value = "";
        const modal = bootstrap.Modal.getInstance(
            document.getElementById("updatetaskmodel")
        );
        modal.hide();
    } else {
        alert("Please enter both task name and task description.");
    }
    }
);

function deleteTask(taskid) {
  const taskRef = ref(database, `dailytaskes/${dateString}/${taskid}`);
  remove(taskRef)
    .then(() => {
      console.log("Task deleted successfully!");
    })
    .catch((error) => {
      console.error("Error deleting task: ", error);
    });
}

function updateTaskStatus(taskid, newStatus) {
  const taskRef = ref(database, `dailytaskes/${dateString}/${taskid}`);
  update(taskRef, {
    taskstatus: newStatus,
  })
    .then(() => {
      console.log("Task status updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating task status: ", error);
    });
}

function updateTask( taskid, taskName, taskDescription, taskstatus) {
  const taskRef = ref(database, `dailytaskes/${dateString}/${taskid}`);
  set(taskRef, {
    [taskName]: taskDescription,
    taskstatus: taskstatus,
  })
    .then(() => {
      console.log("Task updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating task: ", error);
    });
}