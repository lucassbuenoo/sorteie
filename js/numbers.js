const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3')
];

const spinBtn = document.getElementById('spinBtn');
const startInput = document.getElementById('start');
const endInput = document.getElementById('end');
const noRepeat = document.getElementById('noRepeat');
const historyList = document.getElementById('historyList');

let usedNumbers = new Set();
let history = [];
let isSpinning = false;

function buildReels() {
  reels.forEach(reel => {
    reel.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      for (let d = 0; d <= 9; d++) {
        const div = document.createElement('div');
        div.className = 'digit';
        div.textContent = d;
        reel.appendChild(div);
      }
    }
    reel.style.transform = 'translateY(0)';
    reel.style.transition = 'none';
  });
}

function spinReelTo(reel, digit, duration) {
  const digitHeight = document.querySelector('.digit').offsetHeight;
  const loops = 5 + Math.floor(Math.random() * 5);
  const offset = (loops * 10 + digit) * digitHeight;

  reel.style.transition = 'none';
  reel.style.transform = 'translateY(0)';

  requestAnimationFrame(() => {
    reel.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.2,1)`;
    reel.style.transform = `translateY(-${offset}px)`;
  });
}

async function runDraw() {
  if (isSpinning) return;

  const start = +startInput.value;
  const end = +endInput.value;

  let pool = [];
  for (let i = start; i <= end; i++) {
    if (!noRepeat.checked || !usedNumbers.has(i)) pool.push(i);
  }

  if (pool.length === 0) return alert('Sem números disponíveis.');

  const drawn = pool[Math.floor(Math.random() * pool.length)];
  const s = String(drawn).padStart(3, '0');

  isSpinning = true;
  spinBtn.disabled = true;

  spinReelTo(reels[0], +s[0], 2500);
  spinReelTo(reels[1], +s[1], 3000);
  spinReelTo(reels[2], +s[2], 3500);

  await new Promise(r => setTimeout(r, 3600));

  if (noRepeat.checked) usedNumbers.add(drawn);

  history.unshift(drawn);
  renderHistory();

  isSpinning = false;
  spinBtn.disabled = false;
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(n => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.textContent = n;
    historyList.appendChild(div);
  });
}

document.getElementById('clearHistory').onclick = () => {
  history = [];
  usedNumbers.clear();
  renderHistory();
};

spinBtn.onclick = runDraw;

buildReels();


const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header.classList.add('compact');
  } else {
    header.classList.remove('compact');
  }
});
