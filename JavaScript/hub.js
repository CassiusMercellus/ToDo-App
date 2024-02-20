import { hub, createNewTask, hubs } from './shared.js'

const hubInput = document.getElementById("hub-Input");
const hubList = document.getElementById("hubList");
const hubCount = document.getElementById("hubCount");
const hubAddButton = document.querySelector(".hub-btn");

document.addEventListener("DOMContentLoaded", function () {
    hubAddButton.addEventListener("click", addHub);
    hubInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); 
        addHub();
      }
    });

    displayHubs();
  });
  
  function addHub() {
    // Make sure is selected when created
    const newHub = hubInput.value.trim();
    if (newHub !== "") {
      createNewHub(newHub)
      // saveToLocalStorage();
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
    let index = 0
  
    for (const todoName in hub) {
      const disabled = !hub[todoName].isCompleted
      const div = document.createElement("div");
      div.classList.add("hubContainer");
      div.draggable = true;
      div.dataset.index = index;
      div.innerHTML = `
          <div class="hubContainer-left">
            <p id="hub-${index}" class="${disabled ? "disabled" : ""}">${todoName}</p>
          </div>
          <div class="hubContainer-right">
            <button id="hubDeleteButton">Delete</button>
          </div>
      `;
      div.querySelector("#hubDeleteButton").addEventListener("click", function () {
        deleteHub(index);
      });
      hubList.appendChild(div);
      index++
    };
    hubCount.textContent = hub.length;
  
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

    const draggedItem = hub.splice(draggedIndex, 1)[0];
    hub.splice(targetIndex, 0, draggedItem);
  
    saveToLocalStorage();
    displayHubs();
  } 
