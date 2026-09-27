// =========================
// DATA
// =========================

let homework = JSON.parse(localStorage.getItem("homework")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];


// =========================
// ELEMENTS
// =========================

const hwInput = document.getElementById("new-homework");
const hwSubject = document.getElementById("hw-subject");
const hwNotes = document.getElementById("hw-notes");
const hwPriority = document.getElementById("hw-priority");
const addHomeworkBtn = document.getElementById("add-homework");

const goalInput = document.getElementById("new-goal");
const goalNotes = document.getElementById("goal-notes");
const addGoalBtn = document.getElementById("add-goal");

const homeworkList = document.getElementById("homework");
const goalsList = document.getElementById("goals");

const searchInput = document.getElementById("search-tasks");

const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");


// =========================
// SAVE DATA
// =========================

function saveData() {
    localStorage.setItem("homework", JSON.stringify(homework));
    localStorage.setItem("goals", JSON.stringify(goals));
}


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// =========================
// RENDER HOMEWORK
// =========================

function renderHomework() {

    homeworkList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase().trim();

    homework.forEach((task, index) => {

        const searchableText =
            `${task.text} ${task.notes || ""} ${task.subject || ""}`.toLowerCase();

        if (!searchableText.includes(searchTerm)) {
            return;
        }

        const taskElement = document.createElement("div");
        taskElement.className = "task";

        taskElement.innerHTML = `
            <input 
                type="checkbox" 
                ${task.done ? "checked" : ""}
                onchange="toggleHomework(${index})"
            >

            <div class="task-content">

                <div class="task-name ${task.done ? "completed" : ""}">
                    ${escapeHTML(task.text)}
                </div>

                <div class="task-subject">
                    ${escapeHTML(task.subject || "No subject")}
                </div>

                ${
                    task.notes
                        ? `<div class="task-notes">
                            ${escapeHTML(task.notes)}
                           </div>`
                        : ""
                }

            </div>

            <span class="priority ${task.priority || "medium"}">
                ${(task.priority || "medium").toUpperCase()}
            </span>

            <button 
                class="remove-task" 
                onclick="removeHomework(${index})"
            >
                ×
            </button>
        `;

        homeworkList.appendChild(taskElement);
    });

    updateProgress();
}


// =========================
// RENDER GOALS
// =========================

function renderGoals() {

    goalsList.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase().trim();

    goals.forEach((goal, index) => {

        const searchableText =
            `${goal.text} ${goal.notes || ""}`.toLowerCase();

        if (!searchableText.includes(searchTerm)) {
            return;
        }

        const taskElement = document.createElement("div");
        taskElement.className = "task";

        taskElement.innerHTML = `
            <input 
                type="checkbox" 
                ${goal.done ? "checked" : ""}
                onchange="toggleGoal(${index})"
            >

            <div class="task-content">

                <div class="task-name ${goal.done ? "completed" : ""}">
                    ${escapeHTML(goal.text)}
                </div>

                ${
                    goal.notes
                        ? `<div class="task-notes">
                            ${escapeHTML(goal.notes)}
                           </div>`
                        : ""
                }

            </div>

            <button 
                class="remove-task" 
                onclick="removeGoal(${index})"
            >
                ×
            </button>
        `;

        goalsList.appendChild(taskElement);
    });

    updateProgress();
}


// =========================
// ADD HOMEWORK
// =========================

addHomeworkBtn.addEventListener("click", () => {

    const text = hwInput.value.trim();
    const subject = hwSubject.value;
    const notes = hwNotes.value.trim();
    const priority = hwPriority.value;

    // Must have task
    if (!text) {
        hwInput.focus();
        return;
    }

    // Must select subject
    if (!subject) {
        hwSubject.focus();
        return;
    }

    homework.push({
        text: text,
        subject: subject,
        notes: notes,
        priority: priority,
        done: false
    });

    saveData();

    renderHomework();

    // Clear inputs
    hwInput.value = "";
    hwSubject.value = "";
    hwNotes.value = "";
    hwPriority.value = "medium";

    hwInput.focus();
});


// =========================
// ADD GOAL
// =========================

addGoalBtn.addEventListener("click", () => {

    const text = goalInput.value.trim();
    const notes = goalNotes.value.trim();

    if (!text) {
        goalInput.focus();
        return;
    }

    goals.push({
        text: text,
        notes: notes,
        done: false
    });

    saveData();

    renderGoals();

    // Clear inputs
    goalInput.value = "";
    goalNotes.value = "";

    goalInput.focus();
});


// =========================
// TOGGLE HOMEWORK
// =========================

function toggleHomework(index) {

    homework[index].done = !homework[index].done;

    saveData();
    renderHomework();
}


// =========================
// REMOVE HOMEWORK
// =========================

function removeHomework(index) {

    homework.splice(index, 1);

    saveData();
    renderHomework();
}


// =========================
// TOGGLE GOAL
// =========================

function toggleGoal(index) {

    goals[index].done = !goals[index].done;

    saveData();
    renderGoals();
}


// =========================
// REMOVE GOAL
// =========================

function removeGoal(index) {

    goals.splice(index, 1);

    saveData();
    renderGoals();
}


// =========================
// SEARCH
// =========================

searchInput.addEventListener("input", () => {

    renderHomework();
    renderGoals();

});


// =========================
// PROGRESS
// =========================

function updateProgress() {

    const allTasks = [...homework, ...goals];

    if (allTasks.length === 0) {

        progressBar.style.width = "0%";
        progressText.textContent = "0% completed";

        return;
    }

    const completedTasks =
        allTasks.filter(task => task.done).length;

    const percentage =
        Math.round((completedTasks / allTasks.length) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% completed`;
}


// =========================
// DARK MODE
// =========================

const themeButton = document.getElementById("toggle-theme");

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeButton.textContent = "☀️";
    } else {
        themeButton.textContent = "🌙";
    }

});


// =========================
// ENTER KEY
// =========================

hwInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        addHomeworkBtn.click();
    }

});

goalInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {
        addGoalBtn.click();
    }

});


// =========================
// POMODORO
// =========================

let timer;
let timeLeft = 25 * 60;
let currentMode = "Focus";

let pomodoroSessions =
    Number(localStorage.getItem("pomodoroSessions")) || 0;

const timerDisplay = document.getElementById("timer");
const timerMode = document.getElementById("timer-mode");

const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");

const sessionCount = document.getElementById("session-count");


// =========================
// UPDATE TIMER DISPLAY
// =========================

function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timerMode.textContent = currentMode;

    sessionCount.textContent =
        `Sessions completed: ${pomodoroSessions}`;
}


// =========================
// START TIMER
// =========================

startTimerBtn.addEventListener("click", () => {

    if (timer) return;

    timer = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;

            switchPomodoroMode();
        }

    }, 1000);

});


// =========================
// PAUSE TIMER
// =========================

pauseTimerBtn.addEventListener("click", () => {

    clearInterval(timer);
    timer = null;

});


// =========================
// RESET TIMER
// =========================

resetTimerBtn.addEventListener("click", () => {

    clearInterval(timer);
    timer = null;

    currentMode = "Focus";
    timeLeft = 25 * 60;

    updateTimerDisplay();

});


// =========================
// SWITCH POMODORO MODE
// =========================

function switchPomodoroMode() {

    if (currentMode === "Focus") {

        pomodoroSessions++;

        localStorage.setItem(
            "pomodoroSessions",
            pomodoroSessions
        );

        // Every 4 focus sessions = long break
        if (pomodoroSessions % 4 === 0) {

            currentMode = "Long Break";
            timeLeft = 10 * 60;

        } else {

            currentMode = "Short Break";
            timeLeft = 5 * 60;

        }

    } else {

        currentMode = "Focus";
        timeLeft = 25 * 60;

    }

    updateTimerDisplay();

    alert(`${currentMode} started!`);

}


// =========================
// INITIAL LOAD
// =========================

renderHomework();
renderGoals();
updateTimerDisplay();