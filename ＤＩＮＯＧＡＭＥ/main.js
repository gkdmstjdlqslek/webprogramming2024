var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    speed: 5, 
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Cactus {
    constructor() {
        this.x = canvas.width; 
        this.y = 200;
        this.width = 50;
        this.height = 50;
        this.speed = 7; 
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var timer = 0;
var cactusmore = [];
var jumptimer = 0;
var animation;

var score = 0; 
var scoreInterval; 

function frames() {
    animation = requestAnimationFrame(frames);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timer % 120 === 0) { 
        var cactus = new Cactus();
        cactusmore.push(cactus);
    }

    cactusmore.forEach((a, i, o) => {
        if (a.x + a.width < 0) {
            o.splice(i, 1)
        }
        a.x -= a.speed; 
        collision(dino, a);
        a.draw();
    })

    //점프 기능
    if (jumping == true) {
        dino.y -= dino.speed * 2;
        jumptimer++;
    }

    if (jumping == false) {
        if (dino.y < 200) {
            dino.y += dino.speed;
        }
    }

    if (jumptimer > 15) {
        jumping = false;
        jumptimer = 0;
    }

    dino.draw();
    
    // 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, canvas.width - 150, 30);
}

frames();

// 충돌 확인
function collision(dino, cactus) {
    var x축차이 = cactus.x - (dino.x + dino.width);
    var y축차이 = cactus.y - (dino.y + dino.height);
    if (x축차이 < 0 && y축차이 < 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);

        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText('Score: ' + score, canvas.width / 2 - 80, canvas.height / 2 + 50);

        clearInterval(scoreInterval);
    }
}

var jumping = false;
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        jumping = true;
    }
})

// 점수 증가
scoreInterval = setInterval(function() {
    score++;
}, 100);
