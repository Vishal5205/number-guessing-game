let secretNumber;
let attemptsLeft;
let timer;
let time = 0;
let bestScore = localStorage.getItem("bestScore");

document.getElementById("bestScore").textContent = bestScore ?? "--";

function startGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 5;
    time = 0;

    document.getElementById("attempts").textContent = attemptsLeft;
    document.getElementById("timer").textContent = time;
    document.getElementById("message").textContent = "";
    document.getElementById("guessInput").disabled = false;

    clearInterval(timer);
    timer = setInterval(() => {
        time++;
        document.getElementById("timer").textContent = time;
    }, 1000);
}

startGame();

function checkGuess() {
    const input = document.getElementById("guessInput");
    const message = document.getElementById("message");
    const guess = Number(input.value);

    if (!guess || guess < 1 || guess > 100) {
        message.textContent = "❌ Enter a number between 1 and 100";
        return;
    }

    attemptsLeft--;
    document.getElementById("attempts").textContent = attemptsLeft;

    if (guess === secretNumber) {
        message.textContent = "🎉 Correct! You won!";
        clearInterval(timer);
        saveBestScore();
        input.disabled = true;
        return;
    }

    message.textContent = guess > secretNumber ? "⬆️ Too High!" : "⬇️ Too Low!";

    if (attemptsLeft === 0) {
        message.textContent = `😢 Game Over! Number was ${secretNumber}`;
        clearInterval(timer);
        input.disabled = true;
    }

    input.value = "";
}

function saveBestScore() {
    if (!bestScore || time < bestScore) {
        localStorage.setItem("bestScore", time);
        document.getElementById("bestScore").textContent = time;
    }
}

function resetGame() {
    startGame();
}

function toggleDark() {
    document.body.classList.toggle("dark");
}
