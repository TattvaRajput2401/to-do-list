// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAllBtn");

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach((li) => {
        tasks.push({
            text: li.querySelector(".task-text").innerText,
            completed: li.querySelector(".task-text").classList.contains("completed"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach((task) => addTask(task.text, task.completed));
}

// Add a new task
function addTask(taskText = "", completed = false) {
    if (taskText === "") {
        taskText = taskInput.value.trim();
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
    `;

    const textSpan = li.querySelector(".task-text");

    if (completed) textSpan.classList.add("completed");

    // Toggle completed
    textSpan.addEventListener("click", function () {
        this.classList.toggle("completed");
        saveTasks();
    });

    // Delete task
    li.querySelector(".delete-btn").addEventListener("click", function () {
        li.remove();
        saveTasks();
    });

    // Edit task
    li.querySelector(".edit-btn").addEventListener("click", function () {
        const currentText = textSpan.innerText;
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = currentText;
        inputField.classList.add("edit-input");

        // Replace text with input
        li.replaceChild(inputField, textSpan);
        inputField.focus();

        // Save edited text
        function saveEditedTask() {
            const newText = inputField.value.trim();
            if (newText !== "") {
                textSpan.innerText = newText;
            }
            li.replaceChild(textSpan, inputField);
            saveTasks();
        }

        inputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") saveEditedTask();
        });

        inputField.addEventListener("blur", saveEditedTask);
    });

    taskList.appendChild(li);
    taskInput.value = "";
    saveTasks();
}

// Add task on button click
addTaskBtn.addEventListener("click", addTask);

// Add task on Enter key
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Clear all tasks
clearAllBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all tasks?")) {
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
    }
});

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);
