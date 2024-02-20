import { todo, hub } from './shared.js'
// Retrieve todo from local storage or initialize an empty array


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
      event.preventDefault();
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

/* 
display task function
- checks all the items within the todo 
- allows things to be draggable
- adds HTML in order to add the item that is the task
- checks if any of the todos are checked
- clear all checked button
- toggles button visibility
- edit task button
- delete task button
- dragging functionality

What it needs to do
- save todos to the hub selected
*/

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("todoContainer");
    div.draggable = true;
    div.dataset.index = index;
    div.innerHTML = `
        <div class="todoContainer-left">
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
            <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}">${item.text}</p>
        </div>
        <div class="todoContainer-right">
            <button id="editTaskButton" onclick="editTask(${index})">Edit</button>
            <button id="deleteTaskButton">Delete</button>
        </div>
    `;
    var checkbox = div.querySelector(".todo-checkbox");
    checkbox.addEventListener("change", () => {
        toggleTask(index);
        var anyChecked = document.querySelectorAll(".todo-checkbox:checked").length > 0;      
        var clearCompletedButton = document.getElementById("clearCompletedButton");     
        if (anyChecked) {
            clearCompletedButton.style.display = "contents";
        } else {
            clearCompletedButton.style.display = "none";
        }
    });

    document.getElementById('clearCompletedButton').addEventListener('click', clearCompleted);
    div.querySelector("#editTaskButton").addEventListener("click", function () {
        editTask(index);
      });
    div.querySelector("#deleteTaskButton").addEventListener("click", function () {
      deleteTask(index);
    });
    todoList.appendChild(div);
  });
  todoCount.textContent = todo.length;

  const containers = document.querySelectorAll(".todoContainer");
  containers.forEach(container => {
    container.addEventListener("dragstart", handleDragStart);
    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);
  });
}

/* 
add task function
- checks if there are any hubs
- if there is no hub selected it simply console logs
- if there is a hub selected it adds a new task and saves to localstorage
- then updates display tasks

What it needs to do
- should check if there are any hubs selected
- be saved to the hub selected (can likely be done via displayTasks function)
- save the hub to localstorage
*/
function addTask() {
  if (hub = []) {
    console.log("no hubs")
  } else {
    const taskName = todoInput.value.trim();
    if (taskName !== "") {
      createNewTask(hubName, taskName)
      // saveToLocalStorage();
      todoInput.value = "";
      displayTasks();
    }
  }
  
}

/* 
delete task function
- simply removes a task
- saves the change to localstorage
- runs displayTasks

What it needs to do
- be saved to the hub selected (can likely be done via displayTasks function)
*/

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

/* 
clear completed function
- checks if task is completed
- clears completed
- saves localstorage
- updates displayTasks

*/

function clearCompleted() {
    todo = todo.filter(item => !item.disabled);
    clearCompletedButton.style.display = "none";
    saveToLocalStorage();
    displayTasks();
}

/* 
edit task function
- allows you to edit the task the button corresponds to

What it needs to do
- be saved to the hub selected (can likely be done via displayTasks function)
*/

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

  const draggedItem = todo.splice(draggedIndex, 1)[0];
  todo.splice(targetIndex, 0, draggedItem);

  saveToLocalStorage();
  displayTasks();
}