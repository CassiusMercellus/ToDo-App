import { appState } from './shared.js'
// Retrieve todo from local storage or initialize an empty array


let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("todoContainer");
    div.draggable = true;
    div.dataset.index = index; // Store the index of the item
    div.innerHTML = `
        <div class="todoContainer-left">
          <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
          <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">${item.text}</p>
        </div>
        <div class="todoContainer-right">
          <button id="editTaskButton" onclick="editTask(${index})">Edit</button>
          <button id="deleteTaskButton">Delete</button>
        </div>
    `;
    div.querySelector("#deleteTaskButton").addEventListener("click", function () {
      deleteTask(index);
    });
    todoList.appendChild(div);
  });
  todoCount.textContent = todo.length;

  // Add event listeners for drag and drop
  const containers = document.querySelectorAll(".todoContainer");
  containers.forEach(container => {
    container.addEventListener("dragstart", handleDragStart);
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);
  });
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.index);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  const draggedIndex = event.dataTransfer.getData("text/plain");
  const targetIndex = event.target.dataset.index;

  if (draggedIndex === targetIndex) {
    return;
  }

  // Reorder the todo array
  const draggedItem = todo.splice(draggedIndex, 1)[0];
  todo.splice(targetIndex, 0, draggedItem);

  saveToLocalStorage();
  displayTasks();
}

