const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variabel game
let bird = { x: 50, y: 300, width: 20, height: 20, dy: 0, gravity: 0.5, jump: -10 };
let pipes = [];
let pipeGap = 150;
let pipeWidth = 50;
let pipeSpeed = 2;
let score = 0;
let gameOver = false;

// Tambahkan event listener untuk lompatan
document.addEventListener('keydown', () => {
  if (!gameOver) bird.dy = bird.jump;
});

// Fungsi untuk membuat pipa baru
function createPipe() {
  let pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 50;
  pipes.push({ x: canvas.width, top: pipeHeight, bottom: pipeHeight + pipeGap });
}

// Update posisi burung dan pipa
function update() {
  if (gameOver) return;

  // Update burung
  bird.dy += bird.gravity;
  bird.y += bird.dy;

  // Update pipa
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= pipeSpeed;

    // Hapus pipa yang keluar layar
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
    }

    // Deteksi tabrakan
    if (
      bird.x < pipes[i].x + pipeWidth &&
      bird.x + bird.width > pipes[i].x &&
      (bird.y < pipes[i].top || bird.y + bird.height > pipes[i].bottom)
    ) {
      gameOver = true;
    }
  }

  // Tambahkan pipa baru
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    createPipe();
  }

  // Deteksi jika burung keluar layar
  if (bird.y < 0 || bird.y + bird.height > canvas.height) {
    gameOver = true;
  }
}

// Gambar elemen game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gambar burung
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Gambar pipa
  ctx.fillStyle = 'green';
  for (let i = 0; i < pipes.length; i++) {
    ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].top);
    ctx.fillRect(pipes[i].x, pipes[i].bottom, pipeWidth, canvas.height - pipes[i].bottom);
  }

  // Gambar skor
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Pesan Game Over
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Loop game
function gameLoop() {
  update();
  draw();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

createPipe();
gameLoop();
