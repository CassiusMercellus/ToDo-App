// let todo = JSON.parse(localStorage.getItem("todo")) || [];
// let hub = JSON.parse(localStorage.getItem("hub")) || [];

// Creates the object to store todo lists (should be empty)
let hubs = {
    'hub 1': {
        'my todo 1': {
            isCompleted: false
        },
        'my todo 2': {
            isCompleted: false
        }
    },
    'hub 2': {
        'my todo 3': {
            isCompleted: false
        },
        'my todo 4': {
            isCompleted: false
        }
    }
};

let hub = hubs['hub 1'] // should be empty
let todo = hub['my todo 1'] // item within hub that probably should be empty


const createNewHub = (hubName) => {
    hubs[hubName] = {}
}

const createNewTask = (hubName, taskName) => {
    // if there are no hubs (should be ran in the add task function)
    if (hubs?.[hubName] === undefined) {
        console.log(`hubName ${hubName }with taskName ${taskName} does not exist. Current hubs looks like...`, hubs)
        return;
    }
// todoInput.value = taskName
    hubs[hubName][taskName] = {
        isCompleted: false
    }
}
// detect when hubcontainer selected
/* 
div.querySelector(".hubContainer").addEventListener("click", function (event) {
    let selected = event.target.querySelector(".hubContainer").textContent;
    if (selected.classList.contains( "selected" )) {
        console.log("hub is already selected")
    } else {
        selectHub(selected);
    }
  });
*/
function selectHub(selected) {
    // clear the selected class from any hub object
    // load content from hub name from hubs object
}


// Exported Vars
export {
    createNewHub,
    createNewTask,
    hub, todo, hubs
}

