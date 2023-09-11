document.addEventListener("DOMContentLoaded", function () {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskTime = document.getElementById("taskTime");
  const taskTableBody = document.getElementById("taskTableBody");

  const tasks = [];

  let taskIdCounter = 1;

  function addTaskToTable(taskText, taskDateTime) {
    const currentTime = new Date();
    let taskDateTimeValue;

    if (taskDateTime) {
      taskDateTimeValue = new Date(taskDateTime);
    } else {
      taskDateTimeValue = new Date(taskDate.value + "T23:59:00");
    }

    const status = "Will do Later";

    const newRow = taskTableBody.insertRow();
    newRow.innerHTML = `
            <td>${taskIdCounter}</td>
            <td>${taskText}</td>
            <td>
                <button class="mini-btn later selected">Later</button>
                <button class="mini-btn planning">Planning</button>
                <button class="mini-btn working">Working</button>
                <button class="mini-btn complete">Complete</button>
            </td>
            <td>${taskDateTime ? formatDeadline(taskDateTimeValue) : ""}</td>
            <td>${status}</td>
            <td><button class="mini-btn delete">❌</button></td>
        `;

    const deadlineCell = newRow.cells[3];
    const actionButtons = newRow.querySelectorAll(".mini-btn");

    actionButtons.forEach((button) => {
      button.addEventListener("click", function () {
        actionButtons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");

        const statusCell = newRow.cells[4];
        if (button.classList.contains("later")) {
          statusCell.textContent = "Will do Later";
        } else if (button.classList.contains("planning")) {
          statusCell.textContent = "Not Started Yet";
        } else if (button.classList.contains("working")) {
          statusCell.textContent = "In Progress";
        } else if (button.classList.contains("complete")) {
          statusCell.textContent = "Completed";
        }
      });
    });

    const deleteButton = newRow.querySelector(".delete");
    deleteButton.addEventListener("click", function () {
      tasks.splice(taskIdCounter - 1, 1);

      updateLocalStorage();

      taskTableBody.removeChild(newRow);
    });

    if (taskDateTime) {
      const countdown = calculateCountdown(taskDateTimeValue);
      deadlineCell.setAttribute("data-tooltip", countdown);
    }

    tasks.push({
      id: taskIdCounter,
      taskText,
      taskDateTime: taskDateTimeValue
    });

    taskIdCounter++;
  }

  function formatDeadline(taskDateTimeValue) {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    return taskDateTimeValue.toLocaleString("en-US", options);
  }

  function calculateCountdown(deadline) {
    const now = new Date();
    const timeLeft = deadline - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (timeLeft <= 0) {
      return `${-daysLeft} days ${-hoursLeft} hr ${-minutesLeft} min past from now`;
    } else {
      return `${daysLeft} days ${hoursLeft} hr ${minutesLeft} min from now`;
    }
  }

  function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    taskTableBody.innerHTML = "";
    tasks.forEach((task) => {
      addTaskToTable(task.taskText, task.taskDateTime);
    });
  }

  loadTasksFromLocalStorage();

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const taskDateTime = taskDate.value
      ? `${taskDate.value}T${taskTime.value || "23:59"}:00`
      : null;
    if (taskText !== "" && taskDateTime !== null) {
      addTaskToTable(taskText, taskDateTime);
      taskInput.value = "";
      taskDate.value = "";
      taskTime.value = "";
    }
  });
});
