class TaskManager {
  constructor() {
    this.tasks = this.getTasks();
  }

  addTask(task) {
    this.tasks.push(task);
    this.setTasks(this.tasks);
    this.renderTasks();
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
    this.setTasks(this.tasks);
    this.renderTasks();
  }

  getTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks;
  }

  setTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  createTaskCard(item, index) {
    const colors = ["#E8533D", "#19C7C0", "#6972FF", "purple", "#060647"];

    if (!item.isEditing) {
      const taskCard = $(`<div class="task-container">
    <div class="top">
      <div class="note">
        <p>${item.note}</p>
      </div>
      <div>
        <button class="edit-button"><img src="./images/icons/edit.svg" class="icon"/></button>
      </div>
    </div>
    <div class="task-title">
      <h1>${item.title}</h1>
    </div>
    <div class="description">
      <p>
       ${item.description}
      </p>
    </div>
 
    <div class="assignedTo">
      <div class="heading">
        <h3>Assignees</h3>
      </div>
      <div class="assignees">
        ${item.assignees
          .map((assingedTo) => {
            return `
              <span style='background-color: ${
                colors[this.getRandomInt(5)]
              }'>${assingedTo}</span>
           `;
          })
          .join(" ")}
      </div>
    </div>

   

    <hr />

    <div class="complete-delete">
      <div class="arrows">

      ${
        item.status == "todo"
          ? `<button class="move-to-inprogress"><img src="./images/icons/right.svg"/></button>`
          : item.status == "In progress"
          ? `<button class="move-to-todo"><img src="./images/icons/left.svg"/></button>
          <button class="move-to-complete"><img src="./images/icons/right.svg"/></button>`
          : item.status == "complete"
          ? `<button class="move-to-inprogress" ><img src="./images/icons/left.svg"/></button>`
          : ``
      }

          
              
        </div>
      <div class="buttons">
        <button class="complete-button"><img src="./images/icons/tick.svg" class="icon"/></button>
        <button class="delete-button"><img src="./images/icons/delete.svg" class="icon"/></button>
      </div>
    </div>
  </div>`);
      taskCard.find(".edit-button").click(() => this.showUpdateForm(index));
      taskCard.find(".delete-button").click(() => this.removeTask(index));
      taskCard
        .find(".move-to-inprogress")
        .click(() => this.changeStatus(index, "In progress"));
      taskCard
        .find(".move-to-todo")
        .click(() => this.changeStatus(index, "todo"));
      taskCard
        .find(".move-to-complete")
        .click(() => this.changeStatus(index, "complete"));

      taskCard
        .find(".complete-button")
        .click(() => this.changeStatus(index, "complete"));
      return taskCard;
    } else {
      const taskCard = $(
        '<div class="update-task-container">' +
          '<div class="top">' +
          '<div class="update-note">' +
          '<label for="note">Enter Note:</label>' +
          '<input id="updated-note" name="note" value="' +
          item.note +
          '" />' +
          "</div>" +
          "</div>" +
          '<div class="task-title">' +
          '<div class="update-title">' +
          '<label for="title">Enter Title:</label>' +
          '<input id="updated-title" type="text" name="title"  value="' +
          item.title +
          '" required />' +
          "</div>" +
          "</div>" +
          '<div class="description">' +
          '<div class="update-description">' +
          '<label for="description"> Enter description</label>' +
          '<textarea id="updated-description" rows="4" cols="50" id="description" name="description">' +
          item.description +
          "</textarea>" +
          "</div>" +
          "</div>" +
          '<div class="update-assignees">' +
          '<label for="assignedTo">Enter assignees:</label>' +
          '<input id="assignedTo" name="assignedTo" value="' +
          item.assignees.join(",") +
          '" />' +
          "</div>" +
          "<hr/>" +
          '<div class="update-cancel">' +
          '<div class="buttons">' +
          '<button class="update-button">Update</button>' +
          '<button class="cancel-button">Cancel</button>' +
          "</div>" +
          "</div>" +
          "</div>"
      );
      taskCard.find(".update-button").click(() => this.updateTask(index));
      taskCard.find(".cancel-button").click(() => this.cancelClick(index));
      return taskCard;
    }
  }

  renderTasks() {
    const toDoContainer = $(".to-do");
    toDoContainer.empty(); // clear contents

    const inProgressContainer = $(".in-progress");
    inProgressContainer.empty(); // clear contents

    const completeContainer = $(".complete");
    completeContainer.empty(); // clear contents

    const tasks = this.getTasks();

    tasks.map((item, index) => {
      if (item.status == "todo") {
        const taskCard = this.createTaskCard(item, index);

        toDoContainer.append(taskCard);
      }
      if (item.status == "In progress") {
        const taskCard = this.createTaskCard(item, index);

        inProgressContainer.append(taskCard);
      }

      if (item.status == "complete") {
        const taskCard = this.createTaskCard(item, index);

        completeContainer.append(taskCard);
      }
    });
  }

  showUpdateForm(index) {
    const updateTaskContainer = $(".to-do");
    updateTaskContainer.empty(); // Clear existing update form

    const task = this.tasks[index];
    this.tasks[index].isEditing = true;
    this.setTasks(this.tasks);
    console.log(task);
    this.renderTasks();
  }

  updateTask(index) {
    const newNote = $("#updated-note").val().trim();
    const newTitle = $("#updated-title").val().trim();
    const newDescription = $("#updated-description").val().trim();
    const newAssignees = $("#assignedTo").val().trim();
    const assigned_people = newAssignees.split(",");

    this.tasks[index].note = newNote;
    this.tasks[index].title = newTitle;
    this.tasks[index].description = newDescription;
    this.tasks[index].assignees = assigned_people;

    this.tasks[index].isEditing = false;

    this.setTasks(this.tasks);

    this.renderTasks();
  }

  cancelClick(index) {
    this.tasks[index].isEditing = false;
    this.setTasks(this.tasks);
    this.renderTasks();
  }

  changeStatus(index, newStatus) {
    this.tasks[index].status = newStatus;
    this.setTasks(this.tasks);
    this.renderTasks();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //search functions
  // function for search
  filterTasks(searchQuery) {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter((task) => {
      const assigneesMatch = task.assignees.some((assignee) =>
        assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
      // Change the conditions as needed to match your search criteria
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.note.toString().includes(searchQuery) ||
        assigneesMatch ||
        task.description.toString().includes(searchQuery)
      );
    });
    this.showFilteredTasks(filteredTasks);
  }

  showFilteredTasks(filteredTasks) {
    const toDoContainer = $(".to-do");
    toDoContainer.empty(); // clear contents

    const inProgressContainer = $(".in-progress");
    inProgressContainer.empty(); // clear contents

    const completeContainer = $(".complete");
    completeContainer.empty(); // clear contents

    // const tasks = this.getTasks();

    filteredTasks.map((item, index) => {
      if (item.status == "todo") {
        const taskCard = this.createTaskCard(item, index);

        toDoContainer.append(taskCard);
      }
      if (item.status == "In progress") {
        const taskCard = this.createTaskCard(item, index);

        inProgressContainer.append(taskCard);
      }

      if (item.status == "complete") {
        const taskCard = this.createTaskCard(item, index);

        completeContainer.append(taskCard);
      }
    });
  }
}

