'use strict';

const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const messageEl = document.getElementById('message');
const startButton = document.getElementById('startButton');

const HEART_STYLES = [
  {
    gradient: 'radial-gradient(circle at 30% 30%, #fff2f9, #ffb7d9 60%, #ff8cc7 100%)',
    shadow: 'rgba(255, 146, 182, 0.4)'
  },
  {
    gradient: 'radial-gradient(circle at 30% 30%, #f6f0ff, #d8c6ff 60%, #bba4ff 100%)',
    shadow: 'rgba(185, 164, 255, 0.35)'
  },
  {
    gradient: 'radial-gradient(circle at 30% 30%, #eefcfa, #bfeee6 60%, #9cddcf 100%)',
    shadow: 'rgba(156, 221, 207, 0.35)'
  },
  {
    gradient: 'radial-gradient(circle at 30% 30%, #fff4eb, #ffd3b6 60%, #ffb38a 100%)',
    shadow: 'rgba(255, 179, 138, 0.35)'
  },
  {
    gradient: 'radial-gradient(circle at 30% 30%, #f0f7ff, #c7e4ff 60%, #9fccff 100%)',
    shadow: 'rgba(159, 204, 255, 0.35)'
  }
];

const state = {
  playerX: 0,
  playerSpeed: 380,
  hearts: [],
  lastSpawn: 0,
  spawnInterval: 650,
  score: 0,
  timeLeft: 30,
  timerId: null,
  playing: false,
  lastFrame: null,
  movingLeft: false,
  movingRight: false
};

function resetGame() {
  state.hearts.forEach((heart) => heart.el.remove());
  state.hearts = [];
  state.score = 0;
  state.timeLeft = 30;
  state.lastSpawn = 0;
  state.lastFrame = null;
  state.spawnInterval = 650;
  state.movingLeft = false;
  state.movingRight = false;
  scoreEl.textContent = '0';
  timerEl.textContent = '30';
  hideMessage();
  const centeredX = (gameArea.clientWidth - player.clientWidth) / 2;
  state.playerX = centeredX;
  player.style.transform = `translateX(${centeredX}px)`;
}

function startGame() {
  if (state.playing) {
    return;
  }

  resetGame();
  state.playing = true;
  state.playerX = (gameArea.clientWidth - player.clientWidth) / 2;
  state.lastFrame = performance.now();
  player.style.transform = `translateX(${state.playerX}px)`;

  startButton.textContent = 'Catch those hearts!';
  startButton.disabled = true;
  startButton.classList.add('disabled');

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    if (state.timeLeft < 0) {
      state.timeLeft = 0;
    }
    timerEl.textContent = state.timeLeft.toString();

    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  requestAnimationFrame(gameLoop);
}

function endGame() {
  state.playing = false;
  clearInterval(state.timerId);
  state.timerId = null;
  showMessage(
    `<span class="final-text">You're so sweet! 💗</span>` +
      `<span class="final-score">Final Score: ${state.score}</span>`
  );
  startButton.textContent = 'Play again';
  startButton.disabled = false;
  startButton.classList.remove('disabled');
}

function gameLoop(timestamp) {
  if (!state.playing) {
    return;
  }

  const delta = timestamp - (state.lastFrame ?? timestamp);
  state.lastFrame = timestamp;

  updatePlayer(delta);
  spawnHearts(timestamp);
  updateHearts(delta);

  requestAnimationFrame(gameLoop);
}

function updatePlayer(delta) {
  if (!state.movingLeft && !state.movingRight) {
    return;
  }

  const distance = (state.playerSpeed * delta) / 1000;

  if (state.movingLeft) {
    state.playerX -= distance;
  }

  if (state.movingRight) {
    state.playerX += distance;
  }

  const minX = 0;
  const maxX = gameArea.clientWidth - player.clientWidth;
  state.playerX = Math.max(minX, Math.min(maxX, state.playerX));
  player.style.transform = `translateX(${state.playerX}px)`;
}

function spawnHearts(timestamp) {
  if (timestamp - state.lastSpawn < state.spawnInterval) {
    return;
  }

  state.lastSpawn = timestamp;
  const heartEl = document.createElement('div');
  heartEl.className = 'heart';

  const heartSize = 36;
  const maxX = gameArea.clientWidth - heartSize;
  const x = Math.random() * maxX;

  const palette = HEART_STYLES[Math.floor(Math.random() * HEART_STYLES.length)];
  heartEl.style.background = palette.gradient;
  heartEl.style.setProperty('--heart-shadow', palette.shadow);

  heartEl.style.left = `${x}px`;
  heartEl.style.top = `-40px`;
  heartEl.style.transform = 'translateY(0) rotate(45deg)';

  const speed = 120 + Math.random() * 80;

  gameArea.appendChild(heartEl);
  state.hearts.push({
    el: heartEl,
    x,
    y: -40,
    size: heartSize,
    speed
  });

  if (state.spawnInterval > 380) {
    state.spawnInterval -= 12;
  }
}

function updateHearts(delta) {
  const areaHeight = gameArea.clientHeight;
  const bottomOffset = parseFloat(window.getComputedStyle(player).bottom) || 0;
  const playerRect = {
    x: state.playerX,
    y: areaHeight - player.clientHeight - bottomOffset,
    width: player.clientWidth,
    height: player.clientHeight
  };

  for (let i = state.hearts.length - 1; i >= 0; i -= 1) {
    const heart = state.hearts[i];
    heart.y += (heart.speed * delta) / 1000;
    heart.el.style.transform = `translateY(${heart.y}px) rotate(45deg)`;

    if (heart.y > areaHeight + 60) {
      heart.el.remove();
      state.hearts.splice(i, 1);
      continue;
    }

    if (checkCollision(heart, playerRect)) {
      heart.el.remove();
      state.hearts.splice(i, 1);
      incrementScore();
      createSparkles(playerRect.x + playerRect.width / 2, playerRect.y);
    }
  }
}

function checkCollision(heart, playerRect) {
  const heartCenterX = heart.x + heart.size / 2;
  const heartBottomY = heart.y + heart.size;

  const playerLeft = playerRect.x;
  const playerRight = playerRect.x + playerRect.width;
  const playerTop = playerRect.y;

  return heartCenterX >= playerLeft && heartCenterX <= playerRight && heartBottomY >= playerTop;
}

function incrementScore() {
  state.score += 1;
  scoreEl.textContent = state.score.toString();
}

function createSparkles(x, y) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkles';
  sparkle.style.left = `${x - 10}px`;
  sparkle.style.top = `${y - 20}px`;

  for (let i = 0; i < 5; i += 1) {
    const span = document.createElement('span');
    sparkle.appendChild(span);
  }

  gameArea.appendChild(sparkle);
  setTimeout(() => {
    sparkle.remove();
  }, 700);
}

function hideMessage() {
  messageEl.innerHTML = '';
  messageEl.classList.add('hidden');
  messageEl.classList.remove('show');
}

function showMessage(html) {
  messageEl.innerHTML = html;
  messageEl.classList.remove('hidden');
  requestAnimationFrame(() => {
    messageEl.classList.add('show');
  });
}

function handleKeyDown(event) {
  if (!state.playing) {
    return;
  }

  if (event.key === 'ArrowLeft' || event.key === 'a') {
    state.movingLeft = true;
    event.preventDefault();
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    state.movingRight = true;
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    state.movingLeft = false;
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    state.movingRight = false;
  }
}

function handlePointer(event) {
  const rect = gameArea.getBoundingClientRect();
  const relativeX = event.clientX - rect.left;
  const clamped = Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, relativeX - player.clientWidth / 2));
  state.playerX = clamped;
  player.style.transform = `translateX(${state.playerX}px)`;
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

gameArea.addEventListener('pointerdown', (event) => {
  if (!state.playing) {
    return;
  }
  handlePointer(event);
  gameArea.setPointerCapture(event.pointerId);
});

gameArea.addEventListener('pointermove', (event) => {
  if (!state.playing) {
    return;
  }
  handlePointer(event);
});

gameArea.addEventListener('pointerup', (event) => {
  if (!state.playing) {
    return;
  }
  gameArea.releasePointerCapture(event.pointerId);
});

window.addEventListener('resize', () => {
  if (!state.playing) {
    return;
  }
  state.playerX = Math.max(0, Math.min(gameArea.clientWidth - player.clientWidth, state.playerX));
  player.style.transform = `translateX(${state.playerX}px)`;
});

hideMessage();
