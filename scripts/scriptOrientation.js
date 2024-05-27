let canvas, ctx;
let blueBall;
let obstacles = [];
let score = 0;
let gameOver = false;
const obstacleFrequency = 50;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    blueBall = createBall(canvas.width / 2, canvas.height - 30, 20, '#0000FF');

    window.addEventListener('deviceorientation', handleOrientation);
    requestAnimationFrame(updateGame);
}

window.onresize = resizeCanvas;

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
}

function createBall(x, y, radius, color) {
    return {
        x: x,
        y: y,
        radius: radius,
        color: color,
        dx: 0,
        dy: 0,
        speed: 2
    };
}

function createObstacle() {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = -radius;
    return {
        x: x,
        y: y,
        radius: radius,
        color: getRandomColor(),
        dy: 2 + Math.random() * 3
    };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function handleOrientation(event) {
    blueBall.dx = event.gamma * 0.1;
    blueBall.dy = event.beta * 0.1;
}

function updateGame() {
    if (!gameOver) {
        clearCanvas();
        updateBallPosition(blueBall);
        drawBall(blueBall);

        if (Math.random() * obstacleFrequency < 1) {
            obstacles.push(createObstacle());
        }

        updateObstacles();
        drawObstacles();
        checkCollisions();

        score += 1;
        document.getElementById('score').innerText = `Score: ${score}`;

        requestAnimationFrame(updateGame);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateBallPosition(ball) {
    ball.x += ball.dx * ball.speed;
    ball.y += ball.dy * ball.speed;

    if (ball.x < ball.radius) ball.x = ball.radius;
    if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
    if (ball.y < ball.radius) ball.y = ball.radius;
    if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 255, 0)';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacles[i].dy;
        if (obstacles[i].y - obstacles[i].radius > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
        ctx.fillStyle = obstacle.color;
        ctx.fill();
        ctx.closePath();
    }
}

function checkCollisions() {
    for (const obstacle of obstacles) {
        const dx = obstacle.x - blueBall.x;
        const dy = obstacle.y - blueBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < obstacle.radius + blueBall.radius) {
            endGame();
            break;
        }
    }
}

function endGame() {
    gameOver = true;
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    gameOver = false;
    score = 0;
    obstacles = [];
    document.getElementById('restartButton').style.display = 'none';
    blueBall.x = canvas.width / 2;
    blueBall.y = canvas.height - 30;
    requestAnimationFrame(updateGame);
}
