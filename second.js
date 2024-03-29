// Function to load previous day's tasks
function loadPreviousTasks() {
    var dateInput = document.getElementById('dateInput').value;
    var previousTaskList = document.getElementById('previousTaskList');
    previousTaskList.innerHTML = ''; // Clear existing tasks
  
    // Query Firestore for tasks for selected date
    db.collection("tasks").where("date", "==", dateInput).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var taskData = doc.data();
        var taskItem = document.createElement('div');
        taskItem.classList.add('taskItem');
        taskItem.innerHTML = `
          <p>${taskData.title}</p>
          <p>Status: ${taskData.status}</p>
        `;
        previousTaskList.appendChild(taskItem);
      });
    }).catch((error) => {
      console.error("Error getting documents: ", error);
    });
  }
  