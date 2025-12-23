const TOTAL = 75;
const display = document.getElementById('display');
const ball = document.getElementById('ball');
const board = document.getElementById('board');
const drawBtn = document.getElementById('draw');
const resetBtn = document.getElementById('reset');
const cloud = document.getElementById('cloud');

let pool = [];

function letterFor(n) { if (n <= 15) return 'B'; if (n <= 30) return 'I'; if (n <= 45) return 'N'; if (n <= 60) return 'G'; return 'O' }

function initCloud() {
    cloud.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const b = document.createElement('div');
        b.className = 'cloud-ball';
        const duration = 2 + Math.random() * 2;
        const angle = Math.random() * 360;
        const radius = 60 + Math.random() * 60;

        b.style.setProperty('--duration', `${duration}s`);
        b.style.setProperty('--angle', `${angle}deg`);
        b.style.setProperty('--radius', `${radius}px`);

        cloud.appendChild(b)
    }
}

function initBoard() {
    board.innerHTML = '';
    for (let i = 1; i <= TOTAL; i++) {
        const c = document.createElement('div');
        c.className = 'cell';
        c.id = 'n-' + i;
        c.innerHTML = `<div class="letter">${letterFor(i)}</div>${i}`;
        board.appendChild(c)
    }
}

function reset() {
    pool = Array.from({ length: TOTAL }, (_, i) => i + 1);
    display.textContent = '?';
    ball.textContent = '';
    document.querySelectorAll('.cell').forEach(c => {
        c.classList.remove('active');
        c.querySelector('.mini-ball')?.remove()
    });
    initCloud()
}

function draw() {
    if (!pool.length) { alert('Todos os números sorteados'); return }
    drawBtn.disabled = true;

    // 1. Start "mixing" phase (3 seconds)
    // Speed up cloud balls
    document.querySelectorAll('.cloud-ball').forEach(b => b.style.setProperty('--duration', '0.5s'));
    display.textContent = '...';

    setTimeout(() => {
        // 2. Pick number and drop ball
        const i = Math.floor(Math.random() * pool.length);
        const num = pool.splice(i, 1)[0];

        ball.textContent = num;
        ball.classList.remove('drop');
        void ball.offsetWidth;
        ball.classList.add('drop');

        // Restore cloud speed
        document.querySelectorAll('.cloud-ball').forEach(b => {
            const duration = 2 + Math.random() * 2;
            b.style.setProperty('--duration', `${duration}s`);
        });

        // 3. Wait for drop animation (1.6s) then show on board
        setTimeout(() => {
            display.textContent = num;
            const cell = document.getElementById('n-' + num);
            cell.classList.add('active');
            const mb = document.createElement('div');
            mb.className = 'mini-ball';
            mb.textContent = num;
            cell.appendChild(mb);
            drawBtn.disabled = false
        }, 1600)
    }, 3000); // 3 seconds mixing
}


const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        header.classList.add('compact');
    } else {
        header.classList.remove('compact');
    }
});


drawBtn.onclick = draw;
resetBtn.onclick = () => { if (confirm('Reiniciar bingo?')) reset() };

initBoard();
reset();


