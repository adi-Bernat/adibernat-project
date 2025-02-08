document.addEventListener('DOMContentLoaded', () => {
    // השגת אלמנטים מה-DOM
    const addTaskForm = document.getElementById('addTaskForm');
    const newTaskInput = document.getElementById('newTaskInput');
    const taskList = document.getElementById('taskList');
    const emptyMessage = document.getElementById('emptyMessage');

    // מערך המשימות - טעינה מהלוקאל סטורג' או יצירת מערך ריק
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // פונקציה לעדכון הודעת "אין משימות"
    function updateEmptyMessage() {
        emptyMessage.style.display = tasks.length === 0 ? 'block' : 'none';
    }

    // פונקציה לשמירה בלוקאל סטורג'
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateEmptyMessage();
    }

    // פונקציה ליצירת אלמנט משימה
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        if (task.isEditing) {
            // מצב עריכה
            li.classList.add('editing');
            li.innerHTML = `
                <input type="text" class="edit-input" value="${task.text}">
                <div class="task-buttons">
                    <button class="save-button">שמור</button>
                    <button class="cancel-button">בטל</button>
                </div>
            `;

            const editInput = li.querySelector('.edit-input');
            const saveButton = li.querySelector('.save-button');
            const cancelButton = li.querySelector('.cancel-button');

            // טיפול בלחיצה על כפתור שמור
            saveButton.addEventListener('click', () => {
                const newText = editInput.value.trim();
                if (newText) {
                    task.text = newText;
                    task.isEditing = false;
                    renderTasks();
                    saveTasks();
                }
            });

            // טיפול בלחיצה על כפתור ביטול
            cancelButton.addEventListener('click', () => {
                task.isEditing = false;
                renderTasks();
            });
        } else {
            // מצב תצוגה רגיל
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'task-completed' : ''}">${task.text}</span>
                <div class="task-buttons">
                    <button class="edit-button">ערוך</button>
                    <button class="delete-button">מחק</button>
                </div>
            `;

            const checkbox = li.querySelector('.task-checkbox');
            const editButton = li.querySelector('.edit-button');
            const deleteButton = li.querySelector('.delete-button');

            // טיפול בשינוי מצב צ'קבוקס
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
                saveTasks();
            });

            // טיפול בלחיצה על כפתור עריכה
            editButton.addEventListener('click', () => {
                task.isEditing = true;
                renderTasks();
            });

            // טיפול בלחיצה על כפתור מחיקה
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
        tasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
        updateEmptyMessage();
    }

    // טיפול בהוספת משימה חדשה
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newTaskInput.value.trim();
        if (text) {
            tasks.push({
                id: Date.now(),
                text,
                completed: false,
                isEditing: false
            });
            newTaskInput.value = '';
            renderTasks();
            saveTasks();
        }
    });

    // רינדור ראשוני של המשימות
    renderTasks();
});