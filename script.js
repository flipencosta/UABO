const eggSound = document.getElementById('egg-sound');
const container = document.querySelector('.container');
let eggs = [document.getElementById('egg')];

function handleClick(egg) {
    if (egg.isTrueEgg) {
        eggSound.play();
        shuffleEggs();
    }
}

function shuffleEggs() {
    // Increase the number of eggs
    const newEgg = document.createElement('img');
    newEgg.src = 'egg.png';
    newEgg.alt = 'Egg';
    newEgg.style.width = '100px';
    newEgg.style.cursor = 'pointer';
    newEgg.style.position = 'absolute';
    newEgg.onclick = () => handleClick(newEgg);
    container.appendChild(newEgg);
    eggs.push(newEgg);

    // Shuffle positions of all eggs
    eggs.forEach(egg => {
        egg.style.left = `${Math.random() * (container.clientWidth - 100)}px`;
        egg.style.top = `${Math.random() * (container.clientHeight - 100)}px`;
    });

    // Choose a random egg to be the true egg
    const trueEggIndex = Math.floor(Math.random() * eggs.length);
    eggs.forEach((egg, index) => {
        egg.isTrueEgg = index === trueEggIndex;
    });
}

// Initial shuffle
shuffleEggs();
