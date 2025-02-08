import { User } from './user.js';

const drawTableRows = (users) => {
    const tableBody = document.querySelector('#users-table-body');

    tableBody.innerHTML = '';

    users.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>${user.isLogedIn ? 'מחובר' : 'מנותק'}</td>
        `;
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'התנתקות';
        logoutBtn.className = 'table-btn logout-btn';  // הוספת classes
        logoutBtn.addEventListener('click', () => {
            User.logout(user.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'מחיקה';
        deleteBtn.className = 'table-btn delete-btn';  // הוספת classes
        deleteBtn.addEventListener('click', () => {
            User.removeUser(user.id);
        });

        const editBtn = row.querySelector('.edit-button');
        editBtn.addEventListener('click', () => {
            const originalData = { ...user }; // שמירת המידע המקורי

            // מחליף את התצוגה הרגילה בטופס עריכה
            row.classList.add('editing-mode');
            row.innerHTML = `
                <td data-label="שם פרטי">
                    <input type="text" class="edit-input" value="${user.firstName}" />
                </td>
                <td data-label="שם משפחה">
                    <input type="text" class="edit-input" value="${user.lastName}" />
                </td>
                <td data-label="אימייל">
                    <input type="email" class="edit-input" value="${user.email}" />
                </td>
                <td data-label="סיסמא">
                    <input type="password" class="edit-input" value="${user.password}" />
                </td>
                <td data-label="סטטוס">
                    <span>${user.isLogedIn ? 'מחובר' : 'מנותק'}</span>
                </td>
                <td data-label="פעולות">
                    <div class="action-buttons">
                        <button class="save-button">שמור</button>
                        <button class="cancel-button">בטל</button>
                    </div>
                </td>
            `;
            const saveButton = row.querySelector('.save-button');
            const cancelButton = row.querySelector('.cancel-button');

            saveButton.addEventListener('click', () => {
                const inputs = row.querySelectorAll('.edit-input');

                // בדיקת תקינות הקלט
                if ([...inputs].some(input => !input.value.trim())) {
                    alert('כל השדות הם חובה');
                    return;
                }

                // בדיקה אם האימייל החדש כבר קיים אצל משתמש אחר
                const existingUser = User.getUserByEmail(inputs[2].value);
                if (existingUser && existingUser.id !== user.id) {
                    alert('כתובת האימייל כבר קיימת במערכת');
                    return;
                }

                // עדכון הנתונים
                const updatedData = {
                    firstName: inputs[0].value.trim(),
                    lastName: inputs[1].value.trim(),
                    email: inputs[2].value.trim(),
                    password: inputs[3].value.trim()
                };

                // עדכון המשתמש
                if (User.updateUser(user.id, updatedData)) {
                    drawTableRows(User.usersList);
                } else {
                    alert('אירעה שגיאה בעדכון המשתמש');
                }
            });

            cancelButton.addEventListener('click', () => {
                // החזרת המצב הקודם
                drawTableRows(User.usersList);
            });
        });

        row.appendChild(logoutBtn);
        row.appendChild(deleteBtn);
        row.appendChild(editButton);
        tableBody.appendChild(row);
    });
};

const registerForm = document.querySelector('.register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = e.target.elements.firstName.value;
    const lastName = e.target.elements.lastName.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    const users = User.usersList;

    if (users.find((user) => user.email === email)) {
        alert('משתמש עם כתובת דוא"ל זו כבר קיים');
        return;
    }
    new User(firstName, lastName, email, password);
    e.target.reset();
});

const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    const user = User.usersList.find((user) => user.email === email);
    if (user && user.password === password) {
        User.login(user.id);
        e.target.reset();
    } else {
        alert('שם משתמש או סיסמה לא נכונים');
    }
});

import { User } from './user.js';

export const drawTableRows = () => {
    const tableBody = document.querySelector('#users-table-body');
    tableBody.innerHTML = '';  // ניקוי הטבלה

    // בדיקה שיש משתמשים להציג
    console.log('Current users:', User.usersList);

    User.usersList.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="שם פרטי">${user.firstName}</td>
            <td data-label="שם משפחה">${user.lastName}</td>
            <td data-label="אימייל">${user.email}</td>
            <td data-label="סיסמא">${user.password}</td>
            <td data-label="סטטוס">${user.isLogedIn ? 'מחובר' : 'מנותק'}</td>
            <td data-label="פעולות">
                <div class="action-buttons">
                    ${user.isLogedIn ? '<button class="logout-button">התנתקות</button>' : ''}
                    <button class="edit-button">ערוך</button>
                    <button class="delete-button">מחק</button>
                </div>
            </td>
        `;

        // הוספת מאזיני אירועים לכפתורים
        const logoutBtn = row.querySelector('.logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                User.logout(user.id);
                drawTableRows();  // רענון הטבלה
            });
        }

        const deleteBtn = row.querySelector('.delete-button');
        deleteBtn.addEventListener('click', () => {
            if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
                User.removeUser(user.id);
                drawTableRows();  // רענון הטבלה
            }
        });

        const editBtn = row.querySelector('.edit-button');
        editBtn.addEventListener('click', () => {
            row.classList.add('editing-mode');
            row.innerHTML = `
                <td data-label="שם פרטי">
                    <input type="text" value="${user.firstName}" />
                </td>
                <td data-label="שם משפחה">
                    <input type="text" value="${user.lastName}" />
                </td>
                <td data-label="אימייל">
                    <input type="email" value="${user.email}" />
                </td>
                <td data-label="סיסמא">
                    <input type="password" value="${user.password}" />
                </td>
                <td data-label="סטטוס">
                    <input type="text" value="${user.isLogedIn ? 'מחובר' : 'מנותק'}" readonly />
                </td>
                <td data-label="פעולות">
                    <div class="action-buttons">
                        <button class="save-button">שמור</button>
                        <button class="cancel-button">בטל</button>
                    </div>
                </td>
            `;

            const saveButton = row.querySelector('.save-button');
            saveButton.addEventListener('click', () => {
                const inputs = row.querySelectorAll('input');
                const updatedData = {
                    firstName: inputs[0].value.trim(),
                    lastName: inputs[1].value.trim(),
                    email: inputs[2].value.trim(),
                    password: inputs[3].value
                };

                User.updateUser(user.id, updatedData);
                drawTableRows();  // רענון הטבלה
            });

            const cancelButton = row.querySelector('.cancel-button');
            cancelButton.addEventListener('click', () => {
                drawTableRows();  // רענון הטבלה
            });
        });

        tableBody.appendChild(row);
    });
};

// הוספת מאזין לטופס ההרשמה
const registerForm = document.querySelector('.register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        if (User.getUserByEmail(userData.email)) {
            alert('משתמש עם כתובת דוא"ל זו כבר קיים');
            return;
        }

        // יצירת משתמש חדש
        new User(userData.firstName, userData.lastName, userData.email, userData.password);

        // רענון הטבלה
        drawTableRows();

        // איפוס הטופס
        e.target.reset();
    });
}

// הוספת מאזין לטופס ההתחברות
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const email = formData.get('email');
        const password = formData.get('password');

        const user = User.getUserByEmail(email);
        if (user && user.password === password) {
            User.login(user.id);
            drawTableRows();  // רענון הטבלה
            e.target.reset();
        } else {
            alert('שם משתמש או סיסמה לא נכונים');
        }
    });
}

// טעינת הטבלה בטעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    drawTableRows();
});

export { drawTableRows, registerForm, loginForm };