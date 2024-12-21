const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('score');

canvas.width = 320;
canvas.height = 480;

// Menambahkan background hutan
const backgroundImage = new Image();
backgroundImage.src = 'forest.png';

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    draw: function() {
        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
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

// Fungsi untuk membuat pipa baru
function createPipe() {
    let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
    pipes.push({
        x: canvas.width,
        y: pipeHeight,
        width: pipeWidth,
        height: pipeGap
    });
}

// Mengupdate posisi pipa
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

// Menarik untuk menggambar pipa
function drawPipes() {
    for (let pipe of pipes) {
        ctx.fillStyle = '#00cc66';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y); // Top pipe
        ctx.fillRect(pipe.x, pipe.y + pipe.height, pipe.width, canvas.height - (pipe.y + pipe.height)); // Bottom pipe
    }
}

// Menangani game over
function gameOver() {
    cancelAnimationFrame(animationFrame);
    alert("Game Over! Final Score: " + score);
    resetGame();
}

// Mengatur ulang permainan
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreBoard.textContent = "Score: " + score;
}

// Mengupdate posisi burung dan pipa
function update() {
    bird.update();
    updatePipes();
    scoreBoard.textContent = "Score: " + score;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    bird.draw();
    drawPipes();
}

// Menggambar loop permainan
function gameLoop() {
    update();
    if (Math.random() < 0.02) {
        createPipe();
    }
    animationFrame = requestAnimationFrame(gameLoop);
}

backgroundImage.onload = function() {
    gameLoop();
};
