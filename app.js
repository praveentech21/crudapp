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
  