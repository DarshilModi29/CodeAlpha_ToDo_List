let task = document.getElementsByTagName("textarea");
let addButton = document.getElementById("add-card");
let dateDropdown = document.getElementById('dateDropdown');
let tbody = document.getElementById("task_list");
let cards = document.getElementById("cards");
let dropdownValue = "";
let updateId = "";
let today = new Date();
let hour = today.getHours().toString().padStart(2, "0");
let min = today.getMinutes().toString().padStart(2, "0");
let sec = today.getSeconds().toString().padStart(2, "0");
let Time = `${hour}:${min}:${sec}`;
let todayDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
let otherActions = document.getElementsByClassName("other-actions");
let addCardCon = document.getElementById("add-card-container");
let save = document.getElementsByClassName('actions');
let currentTextarea = null;

const dropdown = () => {
    dropdownValue = dateDropdown.value;
    displayTasks();
}

const addCard = () => {
    try {
        let newHTML = "";
        var currentHTML = cards.innerHTML;
        let textArea = document.getElementsByClassName("task")[0];
        if (textArea && textArea.value == "") {
            alert("Please enter a task");
            document.getElementById("add-card").style.pointerEvents = "none";
            return;
        }
        if (!dropdownValue || dropdownValue >= todayDate) {
            newHTML += `
            <div class="col-lg-3 col-md-6">
                <div class="card">
                    <div class="actions" style="justify-content: end;">
                        <i class="bi bi-file-earmark-check" onclick="addTodo();"></i>
                        <i class="bi bi-x-lg" onclick="removeCard();"></i>
                    </div>
                    <textarea class="task"></textarea>
                </div>
            </div>
            `;
            cards.innerHTML = newHTML + currentHTML;
            task[0].focus();
        } else {
            alert("You can't add task in previous dates");
        }
    } catch (error) {
        console.log(error);
    }
}

const removeCard = () => {
    try {
        let card = document.getElementsByClassName("bi-x-lg")[0];
        card.parentElement.parentElement.parentElement.remove();
    } catch (error) {
        console.log(error);
    }
}

const displayTasks = () => {
    try {
        console.log();
        cards.innerHTML = "";
        let oldHTML = addCardCon.innerHTML
        let html = "";
        let tasks = localStorage.getItem(dropdownValue ? dropdownValue : todayDate) ? JSON.parse(localStorage.getItem(dropdownValue ? dropdownValue : todayDate)) : [];
        if (tasks.length > 0) {
            tasks.forEach(element => {
                html += `
                <div class="col-lg-3 col-md-6" >
                    <div class="card">
                        <div class="actions">
                            <i class="bi bi-file-earmark-check" onclick="addTodo();"></i>
                            <p>created at: ${element.createdAt}</p>
                            <div class="other-actions">
                                <i class="bi bi-pencil ${element.status == "done" ? "d-none" : ""}" onclick="updateTask(${element.id})"></i> <i class="bi bi-trash" onclick="deleteTask(${element.id})"></i>
                                <i class="bi bi-check2-all ${element.status == "done" ? "d-none" : ""}" onclick="doneTask(${element.id})"></i>
                            </div>
                        </div>
                        <textarea style="${element.status == "done" ? "height: 65%" : ""}" class="task" id="${element.id}">${element.task}</textarea>
                        <p class="${element.status == "done" ? "" : "d-none"}">finishedAt: ${element.finishedAt}</p>
                    </div>
                </div>
            `
            });
            cards.innerHTML = html + oldHTML;
            for (let i = 0; i < save.length; i++) {
                save[i].firstElementChild.style.display = "none";
                otherActions[i].style.display = "block";
                task[i].disabled = true;
            }
        } else {
            cards.innerHTML = oldHTML;
        }
    } catch (error) {
        console.log(error);
    }
}

const doneTask = (id) => {
    let tasks = localStorage.getItem(dropdownValue ? dropdownValue : todayDate) ? JSON.parse(localStorage.getItem(dropdownValue ? dropdownValue : todayDate)) : [];
    tasks.forEach(element => {
        if (element.id == id) {
            element.status = "done";
            element.finishedAt = `${todayDate} ${Time}`;
        }
    });
    localStorage.setItem(dropdownValue ? dropdownValue : todayDate, JSON.stringify(tasks));
    displayTasks();
}

const deleteTask = async (id) => {
    try {
        if (confirm("Are you sure you want to delete your task") === true) {
            let tasks = localStorage.getItem(dropdownValue ? dropdownValue : todayDate) ? JSON.parse(localStorage.getItem(dropdownValue ? dropdownValue : todayDate)) : [];
            tasks = tasks.filter(task => task.id !== id);
            tasks.forEach((element, index) => {
                element.id = index + 1
            });
            localStorage.setItem(dropdownValue ? dropdownValue : todayDate, JSON.stringify(tasks));
        }
        displayTasks();
    } catch (error) {
        console.log(error);
    }
}

const updateTask = (id) => {
    try {
        updateId = id
        currentTextarea = document.getElementById(id);
        currentTextarea.disabled = false;
        currentTextarea.focus();
        let val = currentTextarea.value;
        currentTextarea.value = '';
        currentTextarea.value = val;
        let prevEle = currentTextarea.previousElementSibling.children;
        prevEle[1].style.display = "none";
        prevEle[0].style.display = "block";
    } catch (error) {
        console.log(error);
    }
}

const addTodo = () => {
    try {
        let taskData = JSON.parse(localStorage.getItem(dropdownValue ? dropdownValue : todayDate)) ? JSON.parse(localStorage.getItem(dropdownValue ? dropdownValue : todayDate)) : [];
        if (updateId) {
            taskData.forEach(element => {
                if (element.id === updateId) {
                    element.task = currentTextarea.value;
                }
            });
            localStorage.setItem(dropdownValue ? dropdownValue : todayDate, JSON.stringify(taskData));
            updateId = "";
            displayTasks();
        } else {
            if (task[0].value == "") {
                alert("Please enter your task");
                task[0].focus();
                return;
            }
            taskData.push({ id: taskData.length + 1, task: task[0].value, status: "pending", createdAt: Time });
            localStorage.setItem(dropdownValue ? dropdownValue : todayDate, JSON.stringify(taskData));
            displayTasks();
        }
        task.value = "";
    } catch (error) {
        console.log(error);
    }
}

const displayDateDropdown = () => {
    try {
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        let numOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let days = 1; days <= numOfDays; days++) {
            const option = document.createElement('option');
            const date = new Date(currentYear, currentMonth, days);
            const day = String(date.getDate());
            const month = String(date.getMonth() + 1);
            const year = date.getFullYear();

            let formattedDate = `${day}/${month}/${year}`;
            option.value = formattedDate;
            option.textContent = formattedDate;

            if (isSameDate(date, today)) {
                option.selected = true;
            }
            dateDropdown.appendChild(option);
        }
    } catch (error) {
        console.log(error);
    }
}

const isSameDate = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

window.onload = () => {
    displayDateDropdown();
    displayTasks();
};