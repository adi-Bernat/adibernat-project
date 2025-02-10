document.addEventListener('DOMContentLoaded', () => {
    // השגת אלמנטים מה-DOM
    const addTaskForm = document.getElementById('addTaskForm');
    const newTaskInput = document.getElementById('newTaskInput');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const emptyMessage = document.getElementById('emptyMessage');
    const emptyCompletedMessage = document.getElementById('emptyCompletedMessage');
    const filterButtons = document.querySelectorAll('.filter-button');

    // הגדרת תאריך מינימלי להיום
    const today = new Date();
    taskDateInput.min = today.toISOString().split('T')[0];

    // מערך המשימות - טעינה מהלוקאל סטורג' או יצירת מערך ריק
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // פונקציה לפורמט תאריך לתצוגה
    function formatDateTime(dateStr, timeStr) {
        const date = new Date(`${dateStr}T${timeStr}`);
        return date.toLocaleString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // פונקציה לבדיקה אם משימה דחופה או באיחור
    function getTaskStatus(dateStr, timeStr) {
        const taskDate = new Date(`${dateStr}T${timeStr}`);
        const now = new Date();
        const timeDiff = taskDate - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (timeDiff < 0) return 'overdue';
        if (hoursDiff <= 24) return 'urgent';
        return 'normal';
    }

    // פונקציה לסינון משימות
    function filterTasks(filter) {
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        return tasks.filter(task => {
            if (task.completed) return false;

            const taskDate = new Date(`${task.date}T${task.time}`);

            switch (filter) {
                case 'today':
                    return taskDate.toDateString() === now.toDateString();
                case 'week':
                    return taskDate >= now && taskDate <= weekFromNow;
                case 'upcoming':
                    return taskDate > weekFromNow;
                default:
                    return true;
            }
        });
    }

    // פונקציה לעדכון הודעות "אין משימות"
    function updateEmptyMessages() {
        const activeTasks = filterTasks(currentFilter);
        const completedTasks = tasks.filter(task => task.completed);

        emptyMessage.style.display = activeTasks.length === 0 ? 'block' : 'none';
        emptyCompletedMessage.style.display = completedTasks.length === 0 ? 'block' : 'none';
    }

    // פונקציה לשמירה בלוקאל סטורג'
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateEmptyMessages();
    }

    // פונקציה ליצירת אלמנט משימה
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        const taskStatus = getTaskStatus(task.date, task.time);
        if (taskStatus === 'overdue') li.classList.add('task-overdue');
        if (taskStatus === 'urgent') li.classList.add('task-urgent');

        if (task.isEditing) {
            // מצב עריכה
            li.classList.add('editing');
            li.innerHTML = `
                <input type="text" class="edit-input" value="${task.text}">
                <input type="date" class="task-date" value="${task.date}">
                <input type="time" class="task-time" value="${task.time}">
                <div class="task-buttons">
                    <button class="save-button">שמור</button>
                    <button class="cancel-button">בטל</button>
                </div>
            `;

            const editInput = li.querySelector('.edit-input');
            const editDate = li.querySelector('.task-date');
            const editTime = li.querySelector('.task-time');
            const saveButton = li.querySelector('.save-button');
            const cancelButton = li.querySelector('.cancel-button');

            saveButton.addEventListener('click', () => {
                const newText = editInput.value.trim();
                const newDate = editDate.value;
                const newTime = editTime.value;

                if (newText && newDate && newTime) {
                    task.text = newText;
                    task.date = newDate;
                    task.time = newTime;
                    task.isEditing = false;
                    renderTasks();
                    saveTasks();
                }
            });

            cancelButton.addEventListener('click', () => {
                task.isEditing = false;
                renderTasks();
            });
        } else {
            // מצב תצוגה רגיל
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <span class="task-text ${task.completed ? 'task-completed' : ''}">${task.text}</span>
                    <span class="task-date-time">${formatDateTime(task.date, task.time)}</span>
                </div>
                <div class="task-buttons">
                    ${!task.completed ? '<button class="edit-button">ערוך</button>' : ''}
                    <button class="delete-button">מחק</button>
                </div>
            `;

            const checkbox = li.querySelector('.task-checkbox');
            const editButton = li.querySelector('.edit-button');
            const deleteButton = li.querySelector('.delete-button');

            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
                saveTasks();
            });

            if (editButton) {
                editButton.addEventListener('click', () => {
                    task.isEditing = true;
                    renderTasks();
                });
            }

            deleteButton.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
                saveTasks();
            });
        }

        return li;
    }

    // פונקציה לרינדור כל המשימות
    function renderTasks() {
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';

        const activeTasks = filterTasks(currentFilter);
        const completedTasks = tasks.filter(task => task.completed);

        // מיון משימות לפי תאריך וזמן
        activeTasks.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        // הצגת משימות פעילות
        activeTasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });

        // הצגת משימות שהושלמו
        completedTasks.forEach(task => {
            completedTaskList.appendChild(createTaskElement(task));
        });

        updateEmptyMessages();
    }

    // טיפול בהוספת משימה חדשה
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newTaskInput.value.trim();
        const date = taskDateInput.value;
        const time = taskTimeInput.value;

        if (text && date && time) {
            tasks.push({
                id: Date.now(),
                text,
                date,
                time,
                completed: false,
                isEditing: false
            });
            newTaskInput.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = '';
            renderTasks();
            saveTasks();
        }
    });

    // טיפול בסינון משימות
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    // בדיקת משימות שעבר זמנן כל דקה
    setInterval(() => {
        const needsUpdate = tasks.some(task => {
            if (!task.completed) {
                const status = getTaskStatus(task.date, task.time);
                return status === 'overdue' || status === 'urgent';
            }
            return false;
        });
        if (needsUpdate) {
            renderTasks();
        }
    }, 60000);

    // רינדור ראשוני של המשימות
    renderTasks();
});