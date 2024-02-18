import { appState } from './shared.js'

let hub = JSON.parse(localStorage.getItem("hub")) || [];
const hubInput = document.getElementById("hub-Input");
const hubList = document.getElementById("hubList");
const hubCount = document.getElementById("hubCount");
const hubAddButton = document.querySelector(".hub-btn");
const hubDeleteButton = document.getElementById("hubDeleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
    hubAddButton.addEventListener("click", addHub);
    hubInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents default Enter key behavior
        addHub();
      }
    });
    appState.CreateTodoList(document.querySelector("#hubInput").value)
    hubDeleteButton.addEventListener("click", deleteAllHubs);
    displayHub();
  });
  
  function addHub() {
    const newHub = hubInput.value.trim();
    if (newHub !== "") {
      hub.push({ text: newHub, disabled: false });
      saveToLocalStorage();
      hubInput.value = "";
      displayHubs();
    }
  }
  
  function deleteHub(index) {
    hub.splice(index, 1);
    saveToLocalStorage();
    displayHubs();
  }
  
  function displayHubs() {
    hubList.innerHTML = "";
    hub.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("hubContainer");
      div.draggable = true;
      div.dataset.index = index; // Store the index of the item
      div.innerHTML = `
          <div class="hubContainer-left">
            <p id="hub-${index}" class="${item.disabled ? "disabled" : ""}">${item.text}</p>
          </div>
          <div class="hubContainer-right">
            <button id="hubDeleteButton">Delete</button>
          </div>
      `;
      div.querySelector("#hubDeleteButton").addEventListener("click", function () {
        deleteHub(index);
      });
      hubList.appendChild(div);
    });
    hubCount.textContent = hub.length;
  
    // Add event listeners for drag and drop
    const containers = document.querySelectorAll(".hubContainer");
    containers.forEach(container => {
      container.addEventListener("dragstart", handleDragStart);
      container.addEventListener("dragover", handleDragOver);
      container.addEventListener("drop", handleDrop);
    });
  }
  
  function togglehub(index) {
    hub[index].disabled = !hub[index].disabled;
    saveToLocalStorage();
    displayHubs();
  }
  
  function deleteAllHubs() {
    hub = [];
    saveToLocalStorage();
    displayHubs();
  }
  
  function saveToLocalStorage() {
    localStorage.setItem("hub", JSON.stringify(hub));
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
  
    // Reorder the hub array
    const draggedItem = hub.splice(draggedIndex, 1)[0];
    hub.splice(targetIndex, 0, draggedItem);
  
    saveToLocalStorage();
    displayHubs();
  } 
