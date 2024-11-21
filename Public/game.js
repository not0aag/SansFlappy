const boardWidth = 800;
const boardHeight = 900;
const playerWidth = 68;
const playerHeight = 48;
const playerX = boardWidth / 8;
let playerY = boardHeight / 2;
const gravity = 0.4;
const lift = -7;
let velocity = 0;
let gameStarted = false;
let gameOver = false;
let scrollSpeed = 2;
let currentWord = {};
let collectedLetters = [];
let letterWidth = 60;
let letterHeight = 60;
let letterSpacing = 150;
let letterArray = [];
let currentCategory = "";
let lastTime = 0;
let animationFrameId;
let board, context, playerImg;
let gameData = {};

async function init() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    playerImg = new Image();
    playerImg.src = "Images/flappybird.png";
    
    try {
        const response = await fetch('gameData.json');
        if (!response.ok) throw new Error('Failed to load game data');
        gameData = await response.json();
        setupEventListeners();
        loadCategories();
        showScreen("welcome-screen");
    } catch (error) {
        console.error("Error loading game data:", error);
    }
}

function loadCategories() {
    const categories = Object.keys(gameData);
    const container = document.querySelector('.category-buttons');
    container.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        button.addEventListener('click', () => {
            currentCategory = category;
            showScreen("game-container");
            selectNewWord();
        });
        container.appendChild(button);
    });
}

function selectNewWord() {
    const categoryWords = gameData[currentCategory];
    if (categoryWords && categoryWords.length > 0) {
        currentWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        collectedLetters = [];
        placeLetters();
    }
}

function placeLetters() {
    letterArray = currentWord.letters.map((char, i) => ({
        char,
        x: boardWidth + i * (letterWidth + letterSpacing),
        y: Math.random() * (boardHeight * 0.4) + boardHeight * 0.3,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
}

function setupEventListeners() {
    board.addEventListener("click", handleClick);
    document.addEventListener("keydown", e => {
        if (e.code === "Space") {
            e.preventDefault();
            handleClick();
        }
    });
    document.getElementById("start-button")?.addEventListener("click", startGame);
    document.getElementById("try-again-button")?.addEventListener("click", restartGame);
    document.getElementById("back-to-menu")?.addEventListener("click", backToMenu);
    document.getElementById("back-to-menu-gameover")?.addEventListener("click", backToMenu);
}

function showScreen(screenId) {
    ["welcome-screen", "game-container", "start-screen", "game-over-screen"].forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.style.display = screen === screenId ? "flex" : "none";
        }
    });
}

function gameLoop(currentTime) {
    if (!gameStarted || gameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    const elapsed = currentTime - lastTime;
    if (elapsed > 16) {
        lastTime = currentTime;
        velocity += gravity;
        playerY += velocity;

        letterArray.forEach(letter => {
            letter.x -= scrollSpeed;
            if (letter.x + letterWidth < 0) {
                letter.x = boardWidth;
                letter.y = Math.random() * (boardHeight * 0.4) + boardHeight * 0.3;
            }
        });

        checkCollisions();

        if (playerY > boardHeight - playerHeight || playerY < 0) {
            endGame();
            return;
        }

        render();
    }
    animationFrameId = requestAnimationFrame(gameLoop);
}

function render() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    context.fillStyle = "#87CEEB";
    context.fillRect(0, 0, boardWidth, boardHeight);
    context.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight);

    letterArray.forEach(letter => {
        context.fillStyle = letter.color;
        context.fillRect(letter.x, letter.y, letterWidth, letterHeight);
        context.fillStyle = "white";
        context.font = "bold 36px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(letter.char, letter.x + letterWidth / 2, letter.y + letterHeight / 2);
    });

    context.font = "24px Arial";
    context.fillStyle = "black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(`Category: ${currentCategory}`, 10, 30);
    context.fillText(`Word: ${currentWord.name}`, 10, 60);
}

function checkCollisions() {
    letterArray.forEach((letter, index) => {
        if (playerX < letter.x + letterWidth &&
            playerX + playerWidth > letter.x &&
            playerY < letter.y + letterHeight &&
            playerY + playerHeight > letter.y) {
            if (letter.char === currentWord.letters[collectedLetters.length]) {
                collectedLetters.push(letter.char);
                letterArray.splice(index, 1);
                if (collectedLetters.length === currentWord.letters.length) {
                    completeWord();
                }
            } else {
                incorrectLetter();
            }
        }
    });
}

function completeWord() {
    gameOver = true;
    const message = document.getElementById("game-over-message");
    const collectedWordDisplay = document.getElementById("collected-word");
    const completedWordImage = document.getElementById("completed-word-image");
    
    message.textContent = `Congratulations! Word Completed: ${currentWord.name}`;
    collectedWordDisplay.textContent = collectedLetters.join("");
    completedWordImage.src = currentWord.image;
    completedWordImage.style.display = "block";
    
    showScreen("game-container");
    document.getElementById("game-over-screen").style.display = "flex";
}

function incorrectLetter() {
    gameOver = true;
    document.getElementById("game-over-message").textContent = `Wrong Letter! You collected: ${collectedLetters.join("")}`;
    document.getElementById("collected-word").textContent = `Correct word was: ${currentWord.name}`;
    document.getElementById("completed-word-image").src = "Images/tryagain.jpg";
    showScreen("game-container");
    document.getElementById("game-over-screen").style.display = "flex";
}

function endGame() {
    gameOver = true;
    document.getElementById("game-over-message").textContent = "Game Over!";
    document.getElementById("collected-word").textContent = `Collected: ${collectedLetters.join("")}`;
    document.getElementById("completed-word-image").src = "Images/tryagain.jpg";
    showScreen("game-container");
    document.getElementById("game-over-screen").style.display = "flex";
}

function backToMenu() {
    cancelAnimationFrame(animationFrameId);
    resetGameState();
    showScreen("welcome-screen");
}

function resetGameState() {
    gameOver = false;
    gameStarted = false;
    playerY = boardHeight / 2;
    velocity = 0;
    lastTime = 0;
    collectedLetters = [];
    letterArray = [];
    currentWord = {};
    currentCategory = "";
    const completedWordImage = document.getElementById("completed-word-image");
    if (completedWordImage) {
        completedWordImage.style.display = "none";
    }
    context?.clearRect(0, 0, boardWidth, boardHeight);
}

function resetGame() {
    cancelAnimationFrame(animationFrameId);
    gameOver = false;
    gameStarted = false;
    playerY = boardHeight / 2;
    velocity = 0;
    lastTime = 0;
    collectedLetters = [];
    document.getElementById("completed-word-image").style.display = "none";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    selectNewWord();
}

function restartGame() {
    document.getElementById("game-over-screen").style.display = "none";
    resetGame();
    startGame();
}

function handleClick() {
    if (!gameStarted && !gameOver) {
        startGame();
    }
    if (gameStarted && !gameOver) {
        velocity = lift;
    }
}

function startGame() {
    if (!gameStarted && !gameOver) {
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("game-over-screen").style.display = "none";
        gameStarted = true;
        playerY = boardHeight / 2;
        velocity = 0;
        collectedLetters = [];
        placeLetters();
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

window.onload = init;