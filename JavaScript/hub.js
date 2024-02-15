import { appState } from './shared.js'

let htodo = JSON.parse(localStorage.getItem("h-todo")) || [];
const htodoInput = document.getElementById("h-todoInput");
const htodoList = document.getElementById("h-todoList");
const htodoCount = document.getElementById("h-todoCount");
const haddButton = document.querySelector(".h-btn");
const hdeleteButton = document.getElementById("h-deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    haddButton.addEventListener("click", addTask);
    htodoInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents default Enter key behavior
        addTask();
      }
    });
    appState.CreateTodoList(document.querySelector("#h-todoInput").value)
    hdeleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
  });
  
  function addTask() {
    const newTask = htodoInput.value.trim();
    if (newTask !== "") {
      htodo.push({ text: newTask, disabled: false });
      saveToLocalStorage();
      htodoInput.value = "";
      displayTasks();
    }
  }
  
  function deleteTask(index) {
    htodo.splice(index, 1);
    saveToLocalStorage();
    displayTasks();
  }
  
  function displayTasks() {
    htodoList.innerHTML = "";
    htodo.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("h-todoContainer");
      div.draggable = true;
      div.dataset.index = index; // Store the index of the item
      div.innerHTML = `
          <div class="h-todoContainer-left">
            <p id="h-todo-${index}" class="h-${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">${item.text}</p>
          </div>
          <div class="h-todoContainer-right">
            <button id="h-deleteTaskButton">Delete</button>
          </div>
      `;
      div.querySelector("#h-deleteTaskButton").addEventListener("click", function () {
        deleteTask(index);
      });
      htodoList.appendChild(div);
    });
    htodoCount.textContent = htodo.length;
  
    // Add event listeners for drag and drop
    const containers = document.querySelectorAll(".h-todoContainer");
    containers.forEach(container => {
      container.addEventListener("dragstart", handleDragStart);
      container.addEventListener("dragover", handleDragOver);
      container.addEventListener("drop", handleDrop);
    });
  }
  
  function toggleTask(index) {
    htodo[index].disabled = !htodo[index].disabled;
    saveToLocalStorage();
    displayTasks();
  }
  
  function deleteAllTasks() {
    htodo = [];
    saveToLocalStorage();
    displayTasks();
  }
  
  function saveToLocalStorage() {
    localStorage.setItem("h-todo", JSON.stringify(htodo));
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
    const draggedItem = htodo.splice(draggedIndex, 1)[0];
    htodo.splice(targetIndex, 0, draggedItem);
  
    saveToLocalStorage();
    displayTasks();
  } 
