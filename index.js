let footer = document.getElementById("footerToggle");
let panel = document.getElementById("completedPanel");
let overlay = document.getElementById("overlay");
let selectedTask = null;

let container = document.querySelector(".containerTask");
let completedList = document.querySelector(".completedList");

footer.addEventListener("click", () => {
    if(panel.classList.contains("show")){
        panel.classList.remove("show");
        footer.classList.remove("up");
        footer.innerHTML = "▲";
        overlay.classList.add("hidden");
        return;
    }

if(!overlay.classList.contains("hidden")) return;
    panel.classList.add("show");
    footer.classList.add("up");
    footer.innerHTML = "▼";
    overlay.classList.remove("hidden");
});

overlay.addEventListener("click", () => {
    closeTab();
    
    panel.classList.remove("show");
    footer.classList.remove("up");
    footer.innerHTML = "▲";

});

function openNewTask(){
    document.querySelector(".addNewTask").classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function openEditTask(){
    document.querySelector(".editExistingTask").classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function openDeleteTask(){
    document.querySelector(".deleteCurrentTask").classList.remove("hidden");
    overlay.classList.remove("hidden");

    panel.classList.remove("show");
    footer.classList.remove("up");
    footer.innerHTML = "▲";
}

function openCompleteTask(){
    document.querySelector(".submitCurrentTask").classList.remove("hidden");
    overlay.classList.remove("hidden");

    panel.classList.remove("show");
    footer.classList.remove("up");
    footer.innerHTML = "▲";
}

function closeTab(){

    document.querySelectorAll(
        ".addNewTask, .editExistingTask, .deleteCurrentTask, .submitCurrentTask"
    ).forEach(modal => modal.classList.add("hidden"));

    overlay.classList.add("hidden");
}

document.addEventListener("click", function(e){
    let task = e.target.closest(".task");
    if(!task) {
        return;
    }

    if(e.target.classList.contains("taskToggle")){
        let body = task.querySelector(".taskBody");
        body.classList.toggle("open");

        if(body.classList.contains("open")){
            body.style.maxHeight = body.scrollHeight + "px";
            e.target.innerHTML = "-";
        } else {
            body.style.maxHeight = null;
            e.target.innerHTML = "+";
        }
    }

    if(e.target.classList.contains("reminder")){
        e.target.innerHTML = e.target.innerHTML === "🔕" ? "🔔" : "🔕";
    }

    if(e.target.classList.contains("deleteBtn")){
        selectedTask = task;
        openDeleteTask();
    }

    if(e.target.classList.contains("completeBtn")){
        selectedTask = task;
        openCompleteTask();
    }

    if(e.target.classList.contains("editBtn")){
        selectedTask = task;
        let title = task.querySelector(".taskTitle").innerText;
        let description = task.querySelector(".taskText").value;

        document.getElementById("editTaskTitle").value = title;
        document.getElementById("editTaskDescription").value = description;

        openEditTask();
    }
});

document.getElementById("addTaskForm").addEventListener("submit", function(e){
    e.preventDefault();

    let title = document.getElementById("newTaskTitle").value;
    let description = document.getElementById("newTaskDescription").value;
    let date = document.getElementById("newTaskDate").value;
    let priority = document.getElementById("prioritySelectAdd").value;

    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

    if(title.trim() === ""){
        alert("Task title cannot be empty!");
        return;
    }

    const currentDate = new Date();
    const endDate = new Date(date);

    if(date === "") {
        alert("Please ensure the date data is inserted before submitting.");
        return;
    } else if(!dateRegex.test(date)) {
        alert("Please ensure the date is correct before submitting.");
        return;
    } else if(currentDate >= endDate) {
        alert("Please ensure the end date is after the current date.");
        return;
    }

    let priorityClass = "";
    let priorityText = "";

    if(priority === "LowPriority"){
        priorityClass = "taskPriorityLow";
        priorityText = "Low";
    }
    else if(priority === "MildPriority"){
        priorityClass = "taskPriorityMild";
        priorityText = "Mild";
    }
    else{
        priorityClass = "taskPriorityHigh";
        priorityText = "High";
    }

    let newTask = document.createElement("div");
    newTask.classList.add("task");

    newTask.innerHTML = `
    <div class="taskHeader">
        <div class="left">
            <span class="${priorityClass}">${priorityText}</span>
            <span class="taskTitle">${title}</span>
        </div>
        <div class="right">
            <button class="taskToggle">+</button>
        </div>
    </div>

    <div class="taskBody">
        <div class="taskDescription">
            <textarea class="taskText" readonly>${description}</textarea>
        </div>

        <div class="taskFooter">
            <div class="taskDates">
                <div>
                    <label>Date Posted:</label>
                    <span class="dateBox">${new Date().toLocaleString()}</span>
                </div>

                <div>
                    <label>End of Date:</label>
                    <span class="dateBox endDate">
                    ${date ? new Date(date).toLocaleString() : "-"}
                    </span>
                </div>
            </div>

            <div class="taskActions">
                <div class="reminder">🔕</div>
                <div class="actionButtons">
                    <button class="completeBtn">Complete</button>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;

    container.appendChild(newTask);

    closeTab();
    this.reset();
});

document.getElementById("deleteTaskForm").addEventListener("submit", function(e){
    e.preventDefault();

    if(selectedTask){
        selectedTask.remove();
        selectedTask = null;
    }

    closeTab();
});

document.getElementById("submitTaskForm").addEventListener("submit", function(e){
    e.preventDefault();

    if(selectedTask){
        let now = new Date();
        let endDateText = selectedTask.querySelector(".taskDates div:nth-child(2) .dateBox").innerText;
        let endDate = new Date(endDateText);
        let completionTime = now.toLocaleString();
        let statusHTML = "";

        if(now <= endDate){
            statusHTML = `<div class="statusOnTime">🎉 On Time 🎉</div>`;
        } else {
            statusHTML = `<div class="statusLate">😬 Late</div>`;
        }

        let footer = selectedTask.querySelector(".taskFooter");

        footer.innerHTML = `
        <div class="taskDates">
            <div>
                <label>Date Posted:</label>
                ${selectedTask.querySelector(".taskDates div:nth-child(1)").innerHTML.split("</label>")[1]}
            </div>
            <div>
                <label>End of Date:</label>
                ${selectedTask.querySelector(".taskDates div:nth-child(2)").innerHTML.split("</label>")[1]}
            </div>
        </div>
        <div class="taskCompletion">
            <div>
                <label>Completion Time:</label>
                <span class="dateBox">${completionTime}</span>
            </div>

            ${statusHTML}
        </div>
        <button class="deleteBtn">🗑</button>`;

        completedList.appendChild(selectedTask);
        selectedTask = null;
    }

    closeTab();
});

document.getElementById("editTaskForm").addEventListener("submit", function(e){
    e.preventDefault();

    let newTitle = document.getElementById("editTaskTitle").value;
    let newDescription = document.getElementById("editTaskDescription").value;
    let newEndDate = document.getElementById("editTaskDate").value;

    const currentDate = new Date();
    const endDate = new Date(newEndDate);
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

    if(newEndDate === "") {
        alert("Please ensure the date data is inserted before submitting.");
        return;
    } else if(!dateRegex.test(newEndDate)) {
        alert("Please ensure the date is correct before submitting.");
        return;
    } else if(currentDate >= endDate) {
        alert("Please ensure the end date is after the current date.");
        return;
    }

    if(selectedTask){
        selectedTask.querySelector(".taskTitle").innerText = newTitle;
        selectedTask.querySelector(".taskText").value = newDescription;
        selectedTask.querySelector(".endDate").innerText = new Date(newEndDate).toLocaleString();

        selectedTask = null;
    }

    closeTab();
});