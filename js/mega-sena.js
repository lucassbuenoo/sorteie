const button = document.getElementById('generateMega');
const result = document.getElementById('megaResult');

function generateMegaSena() {
  const numbers = new Set();

  while (numbers.size < 6) {
    const n = Math.floor(Math.random() * 60) + 1;
    numbers.add(n);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

button.addEventListener('click', () => {
  const numbers = generateMegaSena();
  const balls = result.querySelectorAll('.ball');

  balls.forEach((ball, index) => {
    ball.textContent = numbers[index].toString().padStart(2, '0');
  });
});
