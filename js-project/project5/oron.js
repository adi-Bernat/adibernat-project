document.addEventListener("DOMContentLoaded", function () {
    const num1Element = document.getElementById('num1');
    const num2Element = document.getElementById('num2');
    const operatorElement = document.getElementById('current-operator');
    const answerInput = document.getElementById('answer');
    const checkButton = document.getElementById('check');
    const skipButton = document.getElementById('skip');
    const resultsTableBody = document.getElementById('results');
    const timerText = document.getElementById('timer-text');
    const timerBar = document.getElementById('timer-bar');
    const operatorSelect = document.getElementById('operator');
    const rangeSelect = document.getElementById('range');

    let currentAnswer = 0;
    let timeLeft = 10;
    let timerInterval;
    let questionCount = 0;
    let isGameReady = false;

    // השבתת כפתורים בהתחלה
    skipButton.disabled = true;
    checkButton.disabled = true;

    // פונקציה לדילוג על שאלה
    function skipQuestion() {
        // הוספת שורה לטבלה עם "דילוג" כתשובת המשתמש
        const newRow = document.createElement('tr');
        const rowCount = resultsTableBody.rows.length + 1;

        newRow.innerHTML = `
            <td data-label="מספר">${rowCount}</td>
            <td data-label="שאלה">${num1Element.textContent} ${operatorElement.textContent} ${num2Element.textContent}</td>
            <td data-label="התשובה שלך">דילוג</td>
            <td data-label="תשובה נכונה">${currentAnswer}</td>
        `;
        resultsTableBody.appendChild(newRow);

        // עדכון מונה השאלות
        questionCount++;

        // בדיקה אם הגענו ל-10 שאלות
        if (questionCount >= 10) {
            clearInterval(timerInterval);
            timerText.textContent = "הגעת למספר השאלות המקסימלי!";
            timerBar.style.width = "0%";
            skipButton.disabled = true;
            checkButton.disabled = true;
            return;
        }

        answerInput.value = "";

        generateQuestion();
        startTimer();
    }

    function generateQuestion() {
        if (questionCount >= 10) {
            clearInterval(timerInterval);
            timerText.textContent = "הגעת למספר השאלות המקסימלי!";
            timerBar.style.width = "0%";
            return;
        }

        const range = parseInt(rangeSelect.value);
        const num1 = Math.floor(Math.random() * range) + 1;
        const num2 = Math.floor(Math.random() * range) + 1;
        const operator = operatorSelect.value;

        let correctAnswer;

        switch (operator) {
            case "+":
                correctAnswer = num1 + num2;
                break;
            case "-":
                correctAnswer = num1 - num2;
                break;
            case "*":
                correctAnswer = num1 * num2;
                break;
            case "/":
                correctAnswer = (num1 / num2).toFixed(2);
                break;
        }

        num1Element.textContent = num1;
        num2Element.textContent = num2;
        operatorElement.textContent = operator;
        currentAnswer = correctAnswer;
    }

    function startTimer() {
        timeLeft = 10;
        timerText.textContent = `${timeLeft} שניות`;
        timerBar.style.width = "100%";

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(function () {
            timeLeft--;
            timerText.textContent = `${timeLeft} שניות`;
            timerBar.style.width = `${(timeLeft / 10) * 100}%`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                skipQuestion();
            }
        }, 1000);
    }

    function checkAnswer() {
        const userAnswer = answerInput.value ? parseFloat(answerInput.value) : 'לא נענה';
        const correctAnswer = currentAnswer;

        const newRow = document.createElement('tr');
        const rowCount = resultsTableBody.rows.length + 1;

        newRow.innerHTML = `
            <td data-label="מספר">${rowCount}</td>
            <td data-label="שאלה">${num1Element.textContent} ${operatorElement.textContent} ${num2Element.textContent}</td>
            <td data-label="התשובה שלך">${userAnswer}</td>
            <td data-label="תשובה נכונה">${correctAnswer}</td>
        `;
        resultsTableBody.appendChild(newRow);

        answerInput.value = "";
        questionCount++;

        if (questionCount >= 10) {
            clearInterval(timerInterval);
            timerText.textContent = "הגעת למספר השאלות המקסימלי!";
            timerBar.style.width = "0%";
            skipButton.disabled = true;
            checkButton.disabled = true;
            return;
        }

        generateQuestion();
        startTimer();
    }

    function activateGame() {
        if (operatorSelect.value && rangeSelect.value) {
            if (!isGameReady) {
                generateQuestion();
                startTimer();
                isGameReady = true;
                skipButton.disabled = false;
                checkButton.disabled = false;
            }
        }
    }

    // מאזיני אירועים
    operatorSelect.addEventListener('change', activateGame);
    rangeSelect.addEventListener('change', activateGame);
    checkButton.addEventListener('click', checkAnswer);
    skipButton.addEventListener('click', skipQuestion);

    answerInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !checkButton.disabled) {
            e.preventDefault();
            checkAnswer();
        }
    });
});