let todo = [];
let hub = [];


// Task Hub
const hubInput = document.getElementById("hub-Input");
const hubList = document.getElementById("hubList");
const hubAddButton = document.querySelector(".hub-btn");

// Features
const hubCount = document.getElementById("hubCount");

// Tasks
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");


/*

- Initialize
    + DOMContentLoaded
    + Event Listeners
    - Local Storage Save/Load
    + script.init(); to initialize scripts
    + export vars

*/

document.addEventListener("DOMContentLoaded", function () {
    hubAddButton.addEventListener("click", addHub);
    hubInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevents default Enter key behavior
        addHub();
      }
    });

    displayHubs();
  });
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();

  /* 

- Task Hub
    + Display Hub
    + Add Hub
    + Delete Hub
    + Select Hub
    - Save Hub to hubs

*/
  
  function addHub() {
    const newHub = hubInput.value.trim();
    if (newHub !== "") {
        hub.push({ text: newHub, selected: true, todos: [] }); // solution line
        hubInput.value = "";
        displayHubs();

        const newIndex = hub.length - 1;

        selectHub(newIndex);
    }
  }

  
  function deleteHub(index) {
    hub.splice(index, 1);
    displayHubs();
  }
  
  function displayHubs() {
    hubList.innerHTML = "";
    hub.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("hubContainer");
      div.setAttribute("id", "");
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
      div.querySelector(".hubContainer-left").addEventListener("click", function () {
        selectHub(index);
      });
      hubList.appendChild(div);
    });
    hubCount.textContent = hub.length;
  
      displayTasks();
  }

  function selectHub(index) {
    // Remove "selected" ID from all .hubContainer elements
    const hubContainers = document.querySelectorAll(".hubContainer");
    hubContainers.forEach(container => {
        container.removeAttribute("id");
    });

    hub.forEach((hub) => {
      hub.selected = false;
    });

    // Add "selected" ID to the .hubContainer element with the specified index
    const selectedHubContainer = document.querySelector(`.hubContainer[data-index="${index}"]`);
    if (selectedHubContainer) {
        selectedHubContainer.id = "selected";
        hub[index].selected = true;
    }
    displayTasks();
    console.log(hub);
  }

/*
- Tasks
    - Add Task
    - Delete Task
    - Display Task
    - Edit Task
    - Save Task to Hub

*/


function addTask() {
    const selectedHub = document.querySelector(".hubContainer#selected");
    if (selectedHub) {
        const newTask = todoInput.value.trim();
        if (newTask !== "") {
          const selectedIndex = hub.findIndex(h => h.selected);
          if (selectedIndex !== -1) {
            hub[selectedIndex].todos.push({ text: newTask, disabled: false });
          }
          todoInput.value = "";
          displayTasks();
        } else {
            console.log("Task name cannot be empty");
        }
    } else {
        console.log("Please select a hub first");
    }
  }

  
  function deleteTask(index) {
    // Find the index of the selected hub
    const selectedIndex = hub.findIndex(h => h.selected);

    if (selectedIndex !== -1) {
        // Remove the task at the specified index from the todos array of the selected hub
        hub[selectedIndex].todos.splice(index, 1);
        // Call displayTasks to update the UI
        displayTasks();
    }
}

  
function displayTasks() {
  todoList.innerHTML = "";
  const selectedIndex = hub.findIndex(h => h.selected);
  if (selectedIndex !== -1) {
      const selectedHub = hub[selectedIndex];
      selectedHub.todos.forEach((item, index) => {
          const div = document.createElement("div");
          div.classList.add("todoContainer");
          div.draggable = true;
          div.dataset.index = index; // Store the index of the item
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
              // Check if any task is checked
              var anyChecked = document.querySelectorAll(".todo-checkbox:checked").length > 0;
              
              // Get the clearCompletedButton element
              var clearCompletedButton = document.getElementById("clearCompletedButton");
              
              // Change display property based on if any task is checked
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
      todoCount.textContent = selectedHub.todos.length; 
      saveHubsToLocalStorage()
  }
  
}

  
  function clearCompleted() {
    const selectedIndex = hub.findIndex(h => h.selected);

    if (selectedIndex !== -1) {
        hub[selectedIndex].todos = hub[selectedIndex].todos.filter(item => !item.disabled);
        clearCompletedButton.style.display = "none";
        displayTasks();
    }
}

  
  
function editTask(index) {
  // Find the index of the selected hub
  const selectedIndex = hub.findIndex(h => h.selected);

  if (selectedIndex !== -1) {
      const todoItem = document.getElementById(`todo-${index}`);
      const existingText = hub[selectedIndex].todos[index].text;
      const inputElement = document.createElement("input");
      
      inputElement.value = existingText;
      todoItem.replaceWith(inputElement);
      inputElement.focus();

      inputElement.addEventListener("blur", function () {
          const updatedText = inputElement.value.trim();
          if (updatedText) {
              hub[selectedIndex].todos[index].text = updatedText;
              displayTasks();
          }
      });
  }
}

  
  function toggleTask(index) {
    // Find the index of the selected hub
    const selectedIndex = hub.findIndex(h => h.selected);

    if (selectedIndex !== -1) {
        // Toggle the disabled property of the todo item within the selected hub
        hub[selectedIndex].todos[index].disabled = !hub[selectedIndex].todos[index].disabled;
        // Call displayTasks to update the UI
        displayTasks();
    }
}

  
  function deleteAllTasks() {
  // Find the index of the selected hub
    const selectedIndex = hub.findIndex(h => h.selected);

    if (selectedIndex !== -1) {
      // Clear the todos array within the selected hub
      hub[selectedIndex].todos = [];
      // Call displayTasks to update the UI
      displayTasks();
  }
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

    displayTasks();
  }


  function saveHubsToLocalStorage() {
    localStorage.setItem('hubData', JSON.stringify(hub));
}
