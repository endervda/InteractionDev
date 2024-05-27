let video;
let handpose;
let predictions = [];
let balls = [];
let score = 0;
let startTime;
let gameOver = false;

class Ball {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.r = 40;
        this.pierced = false;
        this.color = color(random(255), random(255), random(255));
    }

    show() {
        if (!this.pierced) {
            fill(this.color);
            stroke(0);
            strokeWeight(2);
            ellipse(this.x, this.y, this.r * 2);
        }
    }

    pierce() {
        this.pierced = true;
    }

    respawn() {
        this.x = random(width);
        this.y = random(height);
        this.pierced = false;
        this.color = color(random(255), random(255), random(255));
    }
}

function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent('canvasContainer');
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    handpose = ml5.handpose(video, modelReady);

    handpose.on('predict', results => {
        predictions = results;
    });

    for (let i = 0; i < 5; i++) {
        balls.push(new Ball());
    }

    startTime = millis();
}

function modelReady() {
    console.log('Model Loaded');
}

function draw() {
    background(255);
    image(video, 0, 0, width, height);

    for (let ball of balls) {
        ball.show();
    }

    if (!gameOver) {
        checkCollisions();
    }

    fill(255);
    stroke(0);
    strokeWeight(2);
    textSize(32);
    text("Score: " + score, 10, 30);

    let remainingTime = 30 - int((millis() - startTime) / 1000);
    remainingTime = max(remainingTime, 0);
    text("Time: " + remainingTime, width - 150, 30);

    // Draw hand keypoints
    for (let hand of predictions) {
        for (let finger of hand.annotations.indexFinger) {
            ellipse(finger[0], finger[1], 10);
        }
    }

    if (!gameOver && remainingTime <= 0) {
        gameOver = true;
        showGameOverScreen();
    }
}

function checkCollisions() {
    for (let hand of predictions) {
        let indexFinger = hand.annotations.indexFinger[3];
        if (indexFinger) {
            let fingerX = indexFinger[0];
            let fingerY = indexFinger[1];

            for (let ball of balls) {
                if (!ball.pierced && dist(fingerX, fingerY, ball.x, ball.y) < ball.r) {
                    ball.pierce();
                    score++;
                    balls.push(new Ball());
                    break;
                }
            }
        }
    }
}

function showGameOverScreen() {
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over\nFinal Score: " + score, width / 2, height / 2);

    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    score = 0;
    startTime = millis();
    gameOver = false;
    balls = [];

    for (let i = 0; i < 5; i++) {
        balls.push(new Ball());
    }
    
    document.getElementById('restartButton').style.display = 'none';
}
