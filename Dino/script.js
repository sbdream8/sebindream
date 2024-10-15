const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
let dino = { x: 50, y: 150, width: 50, height: 50, dy: 0, jumpHeight: -10, gravity: 0.5 };
let ground = { x: 0, y: 180, width: canvas.width, height: 20 };
let obstacle = { x: canvas.width, y: 150, width: 30, height: 50, speed: 5 };
let isJumping = false;
let score = 0;
let gameOver = false;

// Event Listener for Jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isJumping) {
    isJumping = true;
    dino.dy = dino.jumpHeight;
  }
});

// Game Loop
function update() {
  if (!gameOver) {
    // Dino Physics
    dino.dy += dino.gravity;
    dino.y += dino.dy;

    // Stop Dino from falling through the ground
    if (dino.y + dino.height >= ground.y) {
      dino.y = ground.y - dino.height;
      dino.dy = 0;
      isJumping = false;
    }

    // Move obstacle
    obstacle.x -= obstacle.speed;

    // Reset obstacle when it goes off screen
    if (obstacle.x + obstacle.width < 0) {
      obstacle.x = canvas.width;
      score++;
    }

    // Collision detection
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.height + dino.y > obstacle.y
    ) {
      gameOver = true;
    }

    draw();
  }
}

function draw() {
  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Dino
  ctx.fillStyle = '#000';
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  // Draw Ground
  ctx.fillStyle = '#888';
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Draw Obstacle
  ctx.fillStyle = '#f00';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

  // Draw Score
  ctx.font = '20px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(`Score: ${score}`, 10, 20);

  if (gameOver) {
    ctx.fillText('Game Over! Press Space to Restart', canvas.width / 4, canvas.height / 2);
  }
}

// Restart Game on Space Key Press
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && gameOver) {
    resetGame();
  }
});

function resetGame() {
  dino.y = 150;
  obstacle.x = canvas.width;
  score = 0;
  gameOver = false;
  isJumping = false;
}

// Main game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

gameLoop();