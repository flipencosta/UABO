const eggSound = document.getElementById('egg-sound');
const secretEggSound = document.getElementById('secret-egg-sound');
const container = document.querySelector('.container');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let eggs = [document.getElementById('egg')];
let rounds = 0;
let timeLeft = 60;
let gameInterval;
let isPaused = false;

function handleClick(egg) {
    if (egg.isTrueEgg) {
        if (egg.isSecretEgg) {
            secretEggSound.play();
            score += 5;
        } else {
            eggSound.play();
            score += 1;
        }
        updateScore();
        shuffleEggs();
    }
}

// Função para verificar se uma posição se sobrepõe com alguma posição de um ovo existente
function isOverlap(x, y) {
    for (const egg of eggs) {
        const rect1 = { x: x, y: y, width: 100, height: 100 }; // Retângulo do novo ovo
        const rect2 = egg.getBoundingClientRect(); // Retângulo do ovo existente
        const offset = 20; // Espaço de distância entre os ovos

        if (
            rect1.x < rect2.x + rect2.width + offset &&
            rect1.x + rect1.width + offset > rect2.x &&
            rect1.y < rect2.y + rect2.height + offset &&
            rect1.y + rect1.height + offset > rect2.y
        ) {
            return true; // Se houver sobreposição, retorna true
        }
    }
    return false; // Se não houver sobreposição, retorna false
}

// Função para criar um novo ovo evitando sobreposição
function createNewEgg() {
    let newX, newY;
    do {
        // Gera novas coordenadas até encontrar uma que não se sobreponha com nenhum ovo existente
        newX = Math.random() * (container.clientWidth - 100);
        newY = Math.random() * (container.clientHeight - 100);
    } while (isOverlap(newX, newY));

    const newEgg = document.createElement('img');
    newEgg.src = 'egg.png';
    newEgg.alt = 'Imagem de um ovo';
    newEgg.onclick = () => handleClick(newEgg);
    newEgg.style.left = `${newX}px`; // Define a posição do novo ovo
    newEgg.style.top = `${newY}px`;
    return newEgg;
}

function shuffleEggs() {
    rounds += 1;
    const newEgg = createNewEgg();
    container.appendChild(newEgg);
    eggs.push(newEgg);

    eggs.forEach(egg => {
        egg.style.left = `${Math.random() * (container.clientWidth - 100)}px`;
        egg.style.top = `${Math.random() * (container.clientHeight - 100)}px`;
    });

    const trueEggIndex = Math.floor(Math.random() * eggs.length);
    eggs.forEach((egg, index) => {
        egg.isTrueEgg = index === trueEggIndex;
        egg.isSecretEgg = false;
    });

    if (rounds % 3 === 0) {
        eggs[trueEggIndex].isSecretEgg = true;
    }
}

function updateScore() {
    scoreDisplay.textContent = `Pontuação: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `Maior Pontuação: ${highScore}`;
    }
}

function startTimer() {
    gameInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft -= 1;
            timerDisplay.textContent = `Tempo: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                alert(`Tempo esgotado! Sua pontuação final é: ${score}`);
                resetGame();
            }
        }
    }, 1000);
}

function resetGame() {
    score = 0;
    rounds = 0;
    timeLeft = 60;
    updateScore();
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;
    eggs.forEach(egg => {
        if (egg !== document.getElementById('egg')) {
            egg.remove();
        }
    });
    eggs = [document.getElementById('egg')];
    shuffleEggs();
    startButton.disabled = false;
    pauseButton.disabled = true;
    isPaused = false;
    clearInterval(gameInterval);
}

// Adicionando event listeners para os botões de iniciar, pausar e resetar o jogo
startButton.addEventListener('click', () => {
    startTimer();
    startButton.disabled = true;
    pauseButton.disabled = false;
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Continuar' : 'Pausar';
});

resetButton.addEventListener('click', () => {
    resetGame();
    startButton.disabled = false;
    pauseButton.disabled = true;
    pauseButton.textContent = 'Pausar';
});

document.addEventListener('DOMContentLoaded', () => {
    highScoreDisplay.textContent = `Maior Pontuação: ${highScore}`;
    updateScore();
    shuffleEggs();
    pauseButton.disabled = true;
});
