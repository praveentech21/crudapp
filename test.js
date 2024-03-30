// Function to create edit task modal
function createEditTaskModal(taskName, taskDescription) {
    const modalContent = `
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editTaskModalLabel">Edit Task</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editTaskNameInput" class="form-label">Task Name</label>
            <input type="text" class="form-control" id="editTaskNameInput" value="${taskName}" />
          </div>
          <div class="mb-3">
            <label for="editTaskDescriptionInput" class="form-label">Task Description</label>
            <input type="text" class="form-control" id="editTaskDescriptionInput" value="${taskDescription}" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="saveTaskChangesBtn">Save changes</button>
        </div>
      </div>
    `;
    return modalContent;
  }
  
  // Function to create task action buttons
  function createTaskActionButtons(status) {
    let actionButtons = '';
    if (status === "pending") {
      actionButtons = `
        <button type="button" class="btn btn-outline-warning me-2" id="changeStatusBtn">On Work</button>
        <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn">Delete</button>
      `;
    } else if (status === "running") {
      actionButtons = `
        <button type="button" class="btn btn-outline-info me-2" id="changeStatusBtn">Complete</button>
        <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn">Delete</button>
      `;
    } else if (status === "complete") {
      actionButtons = `
        <button type="button" class="btn btn-outline-danger" id="deleteTaskBtn">Delete</button>
      `;
    }
    return actionButtons;
  }
  
  // Event listener for edit button
  document.getElementById("editTaskBtn").addEventListener("click", () => {
    const taskName = document.getElementById("taskName").textContent.trim();
    const taskDescription = document.getElementById("taskDescription").textContent.trim();
    const modalContent = createEditTaskModal(taskName, taskDescription);
    const modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
    document.getElementById("editTaskModalContent").innerHTML = modalContent;
    modal.show();
  });
  
  // Event listener for save task changes button
  document.getElementById("saveTaskChangesBtn").addEventListener("click", () => {
    // Get updated task name and description
    const updatedTaskName = document.getElementById("editTaskNameInput").value.trim();
    const updatedTaskDescription = document.getElementById("editTaskDescriptionInput").value.trim();
  
    // Perform update operation (you need to implement this)
    // updateTask(taskId, updatedTaskName, updatedTaskDescription);
  
    // Close the modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
    modal.hide();
  });
  
  // Event listener for change status button
  document.getElementById("changeStatusBtn").addEventListener("click", () => {
    const currentStatus = document.getElementById("taskStatus").textContent.trim();
    let newStatus = "";
    if (currentStatus === "pending") {
      newStatus = "running";
    } else if (currentStatus === "running") {
      newStatus = "complete";
    }
  
    // Perform update status operation (you need to implement this)
    // updateTaskStatus(taskId, newStatus);
  });
  
  // Event listener for delete task button
  document.getElementById("deleteTaskBtn").addEventListener("click", () => {
    // Perform delete operation (you need to implement this)
    // deleteTask(taskId);
  });
  
  // Inside the loop where you display tasks
  const taskItem = document.createElement("li");
  taskItem.classList.add("d-flex", "mb-4", "pb-1");
  taskItem.innerHTML = `
    <div class="avatar flex-shrink-0 me-3">
      <img src="${imageSource}" alt="Task Icon" class="rounded" />
    </div>
    <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
      <div class="me-2">
        <small class="text-muted d-block mb-1" id="taskName">${taskName}</small>
        <h6 class="mb-0" id="taskDescription">${taskDescription}</h6>
        <span class="text-muted" id="taskStatus">${status}</span>
      </div>
      <div class="user-progress d-flex align-items-center gap-1">
        ${createTaskActionButtons(status)}
      </div>
    </div>
  `;
  document.getElementById("todaytasks").appendChild(taskItem);
  