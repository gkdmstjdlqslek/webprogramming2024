const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    isMovingUp: false,
    color: 'green'
};

const scoreAreas = [
    { y: canvas.height - 100, score: 10 },
    { y: canvas.height - 200, score: 20 },
    { y: canvas.height - 300, score: 30 },
    { y: canvas.height - 400, score: 40 },
    { y: canvas.height - 500, score: 50 }
];

let score = 0;
let gameTime = 120; // 2 minutes
let inScoringZone = false;
let scoringStartTime = 0;
let gameInterval;
let restStartTime = 0;
let isResting = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawScoreAreas() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';

    scoreAreas.forEach(area => {
        ctx.fillText(area.score + ' 점', 10, area.y - 10);
        ctx.beginPath();
        ctx.moveTo(0, area.y);
        ctx.lineTo(canvas.width, area.y);
        ctx.stroke();
    });
}

function updateScore() {
    if (isResting) return;

    let isInScoreArea = false;

    scoreAreas.forEach(area => {
        if (player.y < area.y + 50 && player.y + player.height > area.y) {
            isInScoreArea = true;
            if (!inScoringZone) {
                inScoringZone = true;
                scoringStartTime = new Date().getTime();
            } else {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - scoringStartTime;
                if (elapsedTime >= 5000) {
                    score += area.score - 10;
                    scoreElement.textContent = 'Score: ' + score;
                    player.isMovingUp = false;
                    player.y = canvas.height - player.height; 
                    inScoringZone = false;
                    startRestPeriod();
                }
            }
        }
    });

    if (!isInScoreArea) {
        player.isMovingUp = false;
    }
}

function updatePlayer(){
    if(isResting) return;

    if(player.isMovingUp) {
        player.y -= player.speed;
        if(player.y < 0){
            player.y = 0;
        }
    }
}

function startRestPeriod() {
    isResting = true;
    player.color = 'red';
    restStartTime = new Date().getTime();
}

function checkRestPeriod() {
    if (isResting) {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - restStartTime;
        if (elapsedTime >= 5000) {
            isResting = false;
            player.color = 'green';
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScoreAreas();
    drawPlayer();
    updatePlayer();
    updateScore();
    checkRestPeriod();

    if (gameTime > 0) {
        gameInterval = requestAnimationFrame(gameLoop);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 80, canvas.height / 2 + 50);
    }
}

function updateTimer() {
    if (gameTime > 0) {
        gameTime--;
        const minutes = Math.floor(gameTime / 60).toString().padStart(2, '0');
        const seconds = (gameTime % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes} :${seconds}`;
    } else {
        clearInterval(timerInterval);
        cancelAnimationFrame(gameInterval);
    }
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !isResting) {
        player.isMovingUp = true;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
        player.isMovingUp = false;
    }
});

const timerInterval = setInterval(updateTimer, 1000);
gameLoop();
