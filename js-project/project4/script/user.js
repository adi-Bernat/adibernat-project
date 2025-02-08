import { drawTableRows } from "./domService.js";
export class User {
    static usersList = [];

    constructor(firstName, lastName, email, password) {
        this.id = Date.now();  // שימוש בטיימסטמפ כ-ID ייחודי
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isLogedIn = false;

        User.usersList.push(this);
        User.saveToLocalStorage();
    }

    static loadFromLocalStorage() {
        try {
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                User.usersList = JSON.parse(savedUsers);
                console.log('Loaded users:', User.usersList);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            User.usersList = [];
        }
    }

    static saveToLocalStorage() {
        try {
            localStorage.setItem('users', JSON.stringify(User.usersList));
            console.log('Saved users:', User.usersList);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getUserByEmail(email) {
        return User.usersList.find(user => user.email === email);
    }

    static login(userId) {
        const user = User.usersList.find(user => user.id === userId);
        if (user) {
            user.isLogedIn = true;
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static logout(userId) {
        const user = User.usersList.find(user => user.id === userId);
        if (user) {
            user.isLogedIn = false;
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static removeUser(userId) {
        const index = User.usersList.findIndex(user => user.id === userId);
        if (index !== -1) {
            User.usersList.splice(index, 1);
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static updateUser(userId, userData) {
        const user = User.usersList.find(user => user.id === userId);
        if (user) {
            Object.assign(user, userData);
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }
}

// טעינת המשתמשים בעת טעינת המודול
User.loadFromLocalStorage();

export class User {
    static usersList = JSON.parse(localStorage.getItem('users')) || [];
    static currentId = User.usersList.length > 0
        ? Math.max(...User.usersList.map(user => user.id)) + 1
        : 1;

    constructor(firstName, lastName, email, password) {
        this.id = User.currentId++;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isLogedIn = false;

        User.usersList.push(this);
        User.saveToLocalStorage();
    }

    static saveToLocalStorage() {
        localStorage.setItem('users', JSON.stringify(this.usersList));
    }

    static login(userId) {
        const user = this.usersList.find(user => user.id === userId);
        if (user) {
            user.isLogedIn = true;
            this.saveToLocalStorage();
            drawTableRows(this.usersList);
        }
    }

    static logout(userId) {
        const user = this.usersList.find(user => user.id === userId);
        if (user) {
            user.isLogedIn = false;
            this.saveToLocalStorage();
            drawTableRows(this.usersList);
        }
    }

    static removeUser(userId) {
        const index = this.usersList.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.usersList.splice(index, 1);
            this.saveToLocalStorage();
            drawTableRows(this.usersList);
        }
    }
}

export class User {
    static usersList = [];

    constructor(firstName, lastName, email, password) {
        this.id = Date.now();  // שימוש בטיימסטמפ כ-ID
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isLogedIn = false;

        User.usersList.push(this);
        User.saveToLocalStorage();
    }

    // פונקציה לאתחול המחלקה וטעינת המשתמשים מה-localStorage
    static loadFromStorage() {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            try {
                const parsedUsers = JSON.parse(savedUsers);
                User.usersList = parsedUsers;
                console.log('Loaded users:', User.usersList);  // בדיקת טעינה
            } catch (error) {
                console.error('Error parsing users from localStorage:', error);
                User.usersList = [];
            }
        }
    }

    static saveToLocalStorage() {
        try {
            localStorage.setItem('users', JSON.stringify(User.usersList));
            console.log('Saved users:', User.usersList);  // בדיקת שמירה
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static login(userId) {
        const user = User.usersList.find(user => user.id === userId);
        if (user) {
            user.isLogedIn = true;
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static logout(userId) {
        const user = User.usersList.find(user => user.id === userId);
        if (user) {
            user.isLogedIn = false;
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static removeUser(userId) {
        const index = User.usersList.findIndex(user => user.id === userId);
        if (index !== -1) {
            User.usersList.splice(index, 1);
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static updateUser(userId, userData) {
        const user = User.usersList.find(user => user.id === userId);
        if (user) {
            Object.assign(user, userData);
            User.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static getUserByEmail(email) {
        return User.usersList.find(user => user.email === email);
    }
}

// טעינת המשתמשים בעת טעינת הקובץ
User.loadFromStorage();