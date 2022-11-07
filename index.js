class TaskConstructor {
  constructor(index, name, isCompleted = false) {
    this.index = index;
    this.name = name;
    this.isCompleted = isCompleted;
  }
}

class ComplatedTasks {
  static checkTask(tasksArr) {
    const tasksList = document.querySelector(".todo-list");
    const checkBox = document.querySelectorAll("input[name=checkbox]");

    if (tasksList.hasChildNodes()) {
      checkBox.forEach((check) => {
        check.addEventListener("change", (e) => {
          const checkMark = check.nextElementSibling;
          const taskName = check.nextElementSibling.nextElementSibling;
          const taskUiId = check.parentElement.parentElement.dataset.id;
          if (e.target.checked) {
            taskName.style.textDecoration = "line-through";
            check.style.display = "none";
            checkMark.style.display = "block";
            // looping over the state arr
            tasksArr.forEach((task) => {
              if (task.index === Number(taskUiId)) {
                task.isCompleted = true;
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
              }
            });
          }
        });
      });
    }
  }

  static taskDecoration(tasksArr) {
    const tasksList = document.querySelector(".todo-list");
    const checkBox = document.querySelectorAll("input[name=checkbox]");

    if (tasksList.hasChildNodes()) {
      checkBox.forEach((check) => {
        const checkMark = check.nextElementSibling;
        const taskName = check.nextElementSibling.nextElementSibling;
        const taskUiId = check.parentElement.parentElement.dataset.id;
        tasksArr.forEach((task) => {
          if (task.isCompleted && task.index === Number(taskUiId)) {
            taskName.style.textDecoration = "line-through";
            check.style.display = "none";
            checkMark.style.display = "block";
          }
        });
      });
    }
  }
}

class HandleLocalStorage {
  static addTasksToLs(tasksArr) {
    window.localStorage.setItem("tasks", JSON.stringify(tasksArr));
  }

  static removeItemsFromLs(tasksArr, taskId) {
    tasksArr.forEach((task, index) => {
      if (task.index === Number(taskId)) {
        tasksArr.splice(index, 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
  }

  static clearAllCompleted(tasksArr) {
    const clearAll = document.querySelector(".clear-all");
    clearAll.addEventListener("click", () => {
      const completedTasks = tasksArr.filter(
        (task) => task.isCompleted !== true
      );
      localStorage.setItem("tasks", JSON.stringify(completedTasks));
      completedTasks.forEach((task) => {
        const todoWrapper = document.querySelector(".todo-list");
        todoWrapper.innerHTML = `
            <li data-id="${task.index}">
              <div>
                <input name="checkbox" type="checkbox" />
                <img class="check-icon" src="https://api.iconify.design/ic:baseline-check.svg" />
                <h2 class="task-name" contenteditable="true">${task.name}</h2>
              </div>
              <img class="edit-icon" src="https://api.iconify.design/material-symbols:delete-outline.svg" />
              
            </li>
          `;
      });
      window.location.reload();
    });
  }
}

class TaskDeletion {
  // Delete task from the UI
  static delTaskFromUi(tasksArr) {
    const tasksList = document.querySelector(".todo-list");
    if (tasksList.hasChildNodes()) {
      const editIcon = document.querySelectorAll(".edit-icon");
      editIcon.forEach((icon) => {
        icon.addEventListener("click", (e) => {
          if (e.target.classList.contains("edit-icon")) {
            e.target.parentElement.remove();
            HandleLocalStorage.removeItemsFromLs(
              tasksArr,
              e.target.parentElement.dataset.id
            );
          }
        });
      });
    }
  }
}

class Tasks {
  // Getting the task from the field
  static tasksGenerator() {
    const taskField = document.querySelector("#task-field");
    let tasksArr;
    if (localStorage.getItem("tasks") === null) {
      tasksArr = [];
    } else {
      const lsItems = JSON.parse(localStorage.getItem("tasks"));
      tasksArr = lsItems;
    }

    taskField.addEventListener("keypress", (e) => {
      if (e.target.value !== "" && e.key === "Enter") {
        const userTask = new TaskConstructor(
          tasksArr.length,
          e.target.value,
          false
        );
        tasksArr.push(userTask);
        e.target.value = "";
        // Ivoking adding items to the local storage function
        HandleLocalStorage.addTasksToLs(tasksArr);
        window.location.reload();
      }
    });
    tasksArr.forEach((task) => Tasks.setTasksInUi(task));
    // Delete task from UI
    TaskDeletion.delTaskFromUi(tasksArr);
    // test
    ComplatedTasks.checkTask(tasksArr);
    // test2
    ComplatedTasks.taskDecoration(tasksArr);
    // test3
    HandleLocalStorage.clearAllCompleted(tasksArr);
  }

  // setting tasks in the UI
  static setTasksInUi(task) {
    const todoWrapper = document.querySelector(".todo-list");
    todoWrapper.innerHTML += `
      <li data-id="${task.index}">
        <div>
          <input name="checkbox" type="checkbox" />
          <img class="check-icon" src="https://api.iconify.design/ic:baseline-check.svg" />
          <h2 class="task-name" contenteditable="true">${task.name}</h2>
        </div>
        <img class="edit-icon" src="https://api.iconify.design/material-symbols:delete-outline.svg" />
        
        </li>
    `;
  }
}
