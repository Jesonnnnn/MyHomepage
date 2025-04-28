let blockSize = 25;
let total_row = 17; 
let total_col = 17; 
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speedX = 0;
let speedY = 0;

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;

let isPaused = false;
let gameInterval;
let isGameRunning = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");
    
    context.fillStyle = "rgb(0,63,136)";
    context.fillRect(0, 0, board.width, board.height);
    
    placeFood();
    document.addEventListener("keyup", changeDirection);

    document.getElementById('restartBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    
    document.getElementById('restartBtn').textContent = '开始游戏';
}

function startGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    snakeBody = [];
    speedX = 0;
    speedY = 0;
    gameOver = false;
    isPaused = false;
    
    if (gameInterval) clearInterval(gameInterval);
    
    let gameSpeed = 7;
    gameInterval = setInterval(update, 1000 / gameSpeed);
    isGameRunning = true;
    
    const startBtn = document.getElementById('restartBtn');
    startBtn.textContent = '重新开始';
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    pauseBtn.textContent = isPaused ? '继续游戏' : '暂停游戏';
}

function update() {
    if (gameOver || isPaused) {
        return;
    }

    context.fillStyle = "rgb(0,63,136)";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "white";
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0 
        || snakeX > total_col * blockSize 
        || snakeY < 0 
        || snakeY > total_row * blockSize) { 
        gameOver = true;
        alert("Game Over");
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) { 
            gameOver = true;
            alert("Game Over");
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) { 
        speedX = 0;
        speedY = -1;
    }
    else if (e.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    }
    else if (e.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    }
    else if (e.code == "ArrowRight" && speedX != -1) { 
        speedX = 1;
        speedY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize; 
    foodY = Math.floor(Math.random() * total_row) * blockSize; 
}

function drawInitialState() {
    context.fillStyle = "rgb(0,63,136)";
    context.fillRect(0, 0, board.width, board.height);
    
    context.fillStyle = "white";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    
    context.fillStyle = "yellow";
    context.fillRect(foodX, foodY, blockSize, blockSize);
}
