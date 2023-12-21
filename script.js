const taskManager = new TaskManager();
taskManager.renderTasks();

$("#add-task-dialog").dialog({
  autoOpen: false,
  width: 500, // Set the dialog's width as desired
});

$(".add-task").click(() => {
  console.log("first");

  $("#add-task-dialog").dialog("open");

  // taskManager.renderTasks();
});

$("#submit-btn").click(() => {
  const taskNote = $("#task-note").val();
  const taskTitle = $("#task-title").val();
  const taskDescription = $("#task-description").val();
  const taskAssigness = $("#task-assignedTo").val().split(",");
  let taskStatus = "todo";

  taskManager.addTask({
    note: taskNote,
    title: taskTitle,
    description: taskDescription,

    assignees: taskAssigness,
    status: taskStatus,
    isEditing: false,
  });

  $("#add-task-dialog").dialog("close");

  taskManager.renderTasks();

  console.log(taskAssigness);
});

$("#cancel-btn").click(() => {
  $("#add-task-dialog").dialog("close");
});

$("#search-input").on("input", function () {
  const searchQuery = $(this).val();
  if (searchQuery != "") {
    taskManager.filterTasks(searchQuery);
  } else {
    taskManager.renderTasks();
  }
});
