const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('score');

canvas.width = 320;
canvas.height = 480;

// Menggunakan gambar untuk burung, pipa, dan latar belakang
const birdImage = new Image();
const backgroundImage = new Image();
const pipeImageTop = new Image();
const pipeImageBottom = new Image();

birdImage.src = 'images/bird.png';
backgroundImage.src = 'images/forest.png';
pipeImageTop.src = 'images/pipe-top.png';
pipeImageBottom.src = 'images/pipe-bottom.png';

let bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    draw: function() {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    flap: function() {
        this.velocity = this.lift;
    }
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 120;
let pipeSpeed = 2;
let score = 0;

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) { // Spacebar to flap
        bird.flap();
    }
});

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        width: pipeWidth,
        height: pipeGap
    });
}

function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        if (pipe.x + pipe.width < 0) {
            pipes.splice(i, 1);
            score++;
        }

        if (pipe.x < bird.x + bird.width && pipe.x + pipe.width > bird.x) {
            if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.height) {
                gameOver();
            }
        }
    }
}

function drawPipes() {
    for (let pipe of pipes) {
        // Menggambar pipa atas dan bawah menggunakan gambar
        ctx.drawImage(pipeImageTop, pipe.x, 0, pipe.width, pipe.y);
        ctx.drawImage(pipeImageBottom, pipe.x, pipe.y + pipe.height, pipe.width, canvas.height - (pipe.y + pipe.height));
    }
}

function gameOver() {
    cancelAnimationFrame(animationFrame);
    alert("Game Over! Final Score: " + score);
    resetGame();
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreBoard.textContent = "Score: " + score;
}

function update() {
    bird.update();
    updatePipes();
    scoreBoard.textContent = "Score: " + score;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Menampilkan background hutan
    bird.draw();
    drawPipes();
}

function gameLoop() {
    update();
    if (Math.random() < 0.02) {
        createPipe();
    }
    animationFrame = requestAnimationFrame(gameLoop);
}

backgroundImage.onload = function() {
    birdImage.onload = function() {
        pipeImageTop.onload = function() {
            pipeImageBottom.onload = function() {
                gameLoop();
            }
        }
    }
};
