fetch('components/header.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('header').innerHTML = html;
    setActiveMenu();
  });

function setActiveMenu() {
  const current = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
    }
  });
}
