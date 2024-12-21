const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    image: new Image()
};

let pipes = [];
let frame = 0;
let score = 0;

bird.image.src = 'assets/bird.png'; // Ganti dengan path gambar burung

function drawBird() {
    ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    let pipeImage = new Image();
    pipeImage.src = 'assets/pipe.png'; // Ganti dengan path gambar pipa
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.top);
        ctx.drawImage(pipeImage, pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 75 === 0) {
        let top = Math.random() * (canvas.height / 2);
        let bottom = Math.random() * (canvas.height / 2);
        pipes.push({ x: canvas.width, top: top, bottom: bottom, width: 20 });
    }
    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
            document.getElementById('score').innerText = score; // Update score display
        }
    });
}

function checkCollision() {
    for (let pipe of pipes) {
        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x) {
            if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
                resetGame();
            }
        }
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    document.getElementById('score').innerText = score; // Reset score display
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height) {
        resetGame();
    }

    updatePipes();
    checkCollision();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
}

function gameLoop() {
    update();
    draw();
    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

gameLoop();
