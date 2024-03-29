// Initialize Firebase
var firebaseConfig = {
    // Your Firebase configuration
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Reference to Firestore collection
  var db = firebase.firestore();
  
  // Function to load tasks from Firebase
  function loadTasks() {
    var taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks
  
    // Get today's date
    var today = new Date();
    var todayStr = today.toISOString().split('T')[0];
  
    // Query Firestore for tasks for today
    db.collection("tasks").where("date", "==", todayStr).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var taskData = doc.data();
        var taskItem = document.createElement('div');
        taskItem.classList.add('taskItem');
        taskItem.innerHTML = `
          <p>${taskData.title}</p>
          <button onclick="changeStatus('${doc.id}', '${taskData.status}')">${taskData.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}</button>
        `;
        taskList.appendChild(taskItem);
      });
    }).catch((error) => {
      console.error("Error getting documents: ", error);
    });
  }
  
  // Function to change task status
  function changeStatus(taskId, currentStatus) {
    var newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';
    db.collection("tasks").doc(taskId).update({
      status: newStatus
    }).then(() => {
      loadTasks(); // Reload tasks after status change
    }).catch((error) => {
      console.error("Error updating document: ", error);
    });
  }
  
  // Load tasks when page loads
  loadTasks();
  
  // Event listener for Add New Task button
  document.getElementById('addTaskBtn').addEventListener('click', () => {
    // Redirect to add task page or open a modal for adding task
    // Implement based on your preference
  });
  