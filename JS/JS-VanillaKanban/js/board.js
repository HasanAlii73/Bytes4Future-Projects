const board = document.getElementById('board')

const boardState = {
    todo: [
        { id: 1, title: "task1" },
        { id: 2, title: "task2" },
    ],
    inProgress: [{ id: 3, title: "task3" }],
    review: [{ id: 4, title: "task4" }, { id: 5, title: "task5" }, { id: 6, title: "task6" }],
    done: [{ id: 7, title: "task7" }, { id: 8, title: "task8" }]
};

const columnLabels = {
    todo: "To Do",
    inProgress: "In Progress",
    review: "Review",
    done: "Done"
};

function renderColumns() {
    return Object.keys(boardState).map(column => `
        <div class="board-column">
            <h3 class="board-column-header">${columnLabels[column]}</h3>
            <p class="board-column-taskCounter">${boardState[column].length}</p>
            <div id="${column}-column-tasks" class="board-column-tasks">
            </div>
            <button class="board-column-addTaskBtn">Add Task</button>
        </div>`
    ).join('');
}

function renderBoard() {
    board.innerHTML = renderColumns();
}

renderBoard();