const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  tasksDiv.innerHTML = "";

  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("mark-completed");
    checkbox.checked = JSON.parse(value);
    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      updateStorage(key.split("_")[0], key.split("_")[1], checkbox.checked);
    });

    let taskNameSpan = document.createElement("span");
    taskNameSpan.id = "taskname";
    taskNameSpan.textContent = key.split("_")[1];

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    taskInnerDiv.appendChild(checkbox);
    taskInnerDiv.appendChild(taskNameSpan);
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.appendChild(deleteButton);
    tasksDiv.appendChild(taskInnerDiv);
  }

  tasks = document.querySelectorAll(".task");
  tasks.forEach((element) => {
    element.onclick = () => {
      if (element.classList.contains("completed")) {
        updateStorage(element.id.split("_")[0], element.querySelector("#taskname").innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.querySelector("#taskname").innerText, true);
      }
    };
  });

  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      disableButtons(true);
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      updateNote = parent.id;
      parent.remove();
    });
  });

  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

document.querySelector("#push").addEventListener("click", () => {
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Please Enter A Task");
  } else {
    if (updateNote == "") {
      updateStorage(count, newTaskInput.value, false);
    } else {
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});
