// משתני המשחק
let turn = true; // true = X
let btnClicked = 0;
let vsComputer = true; // משחק נגד המחשב כברירת מחדל
let gameOver = false;

// בחירת אלמנטים מה-DOM
const btns = document.querySelectorAll(".btn");
const statusDisplay = document.querySelector(".status");
const resetBtn = document.querySelector(".reset-btn");
const messageBox = document.querySelector(".message-box");
const toggleModeBtn = document.querySelector(".toggle-mode");

// הוספת מאזיני לחיצה
btns.forEach(btn => {
    btn.addEventListener("click", btnClick);
});
resetBtn.addEventListener("click", reset);
toggleModeBtn.addEventListener("click", toggleGameMode);

// החלפת מצב משחק
function toggleGameMode() {
    vsComputer = !vsComputer;
    toggleModeBtn.textContent = vsComputer ? "שחק נגד חבר" : "שחק נגד המחשב";
    reset();
}

// מציאת המהלך הטוב ביותר למחשב
function findBestMove() {
    // בדיקה אם אפשר לנצח במהלך הבא
    for (let i = 0; i < btns.length; i++) {
        if (!btns[i].textContent) {
            btns[i].textContent = "O";
            if (checkWin().win) {
                btns[i].textContent = "";
                return i;
            }
            btns[i].textContent = "";
        }
    }

    // בדיקה אם צריך לחסום ניצחון של היריב
    for (let i = 0; i < btns.length; i++) {
        if (!btns[i].textContent) {
            btns[i].textContent = "X";
            if (checkWin().win) {
                btns[i].textContent = "";
                return i;
            }
            btns[i].textContent = "";
        }
    }

    // אם המרכז פנוי, קח אותו
    if (!btns[4].textContent) {
        return 4;
    }

    // נסה לקחת פינה פנויה
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => !btns[i].textContent);
    if (emptyCorners.length > 0) {
        return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // קח כל משבצת פנויה
    const emptySquares = Array.from(btns).map((btn, i) => !btn.textContent ? i : null).filter(i => i !== null);
    if (emptySquares.length > 0) {
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    return -1;
}

// תור המחשב
function makeComputerMove() {
    const move = findBestMove();
    if (move !== -1) {
        btnClicked++;
        btns[move].textContent = "O";

        const gameState = checkWin();

        if (gameState.win) {
            gameOver = true;
            gameState.pos.forEach(index => {
                btns[index].style.color = "red";
            });
            showMessage("המחשב ניצח!", 'win');
            setTimeout(reset, 2000);
        }
        else if (gameState.isTie) {
            gameOver = true;
            showMessage('המשחק הסתיים בתיקו!', 'tie');
            setTimeout(reset, 2000);
        }
        else {
            turn = !turn;
            updateStatusDisplay();
        }
    }
}

// פונקציות להצגת הודעות
function showMessage(message, type) {
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = 'message-box show ' + (type || '');
    }
}

function hideMessage() {
    if (messageBox) {
        messageBox.className = 'message-box';
        messageBox.textContent = '';
    }
}

// פונקציית לחיצה על משבצת
function btnClick() {
    if (this.textContent !== "" || gameOver) return;
    if (vsComputer && !turn) return;

    btnClicked++;
    // שינוי כאן - הצגת X או O בהתאם לתור
    this.textContent = turn ? "X" : "O";

    const gameState = checkWin();

    if (gameState.win) {
        gameOver = true;
        gameState.pos.forEach(index => {
            btns[index].style.color = "red";
        });
        // שינוי כאן - הצגת השחקן המנצח
        const winner = vsComputer ? "ניצחת!" : `שחקן ${turn ? 'X' : 'O'} ניצח!`;
        showMessage(winner, 'win');
        setTimeout(reset, 2000);
    }
    else if (gameState.isTie) {
        gameOver = true;
        showMessage('המשחק הסתיים בתיקו!', 'tie');
        setTimeout(reset, 2000);
    }
    else {
        turn = !turn;
        updateStatusDisplay();

        // הפעלת תור המחשב אחרי השהייה קצרה
        if (vsComputer) {
            setTimeout(makeComputerMove, 500);
        }
    }
}

// פונקציית איפוס המשחק
function reset() {
    turn = true;
    btnClicked = 0;
    gameOver = false;
    btns.forEach(btn => {
        btn.textContent = "";
        btn.style.color = "";
    });
    hideMessage();
    updateStatusDisplay();
}

// עדכון תצוגת התור הנוכחי
function updateStatusDisplay() {
    if (vsComputer) {
        statusDisplay.textContent = turn ? "תורך לשחק" : "תור המחשב";
    } else {
        statusDisplay.textContent = `תור שחקן: ${turn ? 'X' : 'O'}`;
    }
}

// בדיקת מצב ניצחון
function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // שורות
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // טורים
        [0, 4, 8], [2, 4, 6]             // אלכסונים
    ];

    let result = { win: false, isTie: false, pos: [] };

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            btns[a].textContent &&
            btns[a].textContent === btns[b].textContent &&
            btns[a].textContent === btns[c].textContent
        ) {
            return { win: true, isTie: false, pos: combination };
        }
    }

    if (btnClicked === 9) {
        result.isTie = true;
    }

    return result;
}