

function getRandomId() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

class AppState {

    constructor() {
        this.listOfTodoLists = []
        this.currentTodoListId = '';
    }

    CreateTodoList(todoListName) {
        this.listOfTodoLists.push(new TodoList(todoListName))
    }

    setCurrentTodoListId(id) {
        this.currentTodoListId = id;
    }
}

class TodoList {
    constructor(todoListName) {
        this.todoListName = todoListName()
        this.todoListId = getRandomId()
        this.todos = []
    }

    addTodo(todoItem) {
        this.todos.push(todoItem)
    }
}

class Todo {
    constructor(text) {
        this.todoId = getRandomId()
        this.text = text;
        this.completed = false;
    }
}


let appState = new AppState();

console.log('appState', appState)

export {
    appState
}