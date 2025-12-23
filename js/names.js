document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     ELEMENTOS (SEGUROS)
  ========================= */

  const namesInput = document.getElementById('namesInput');
  const drawBtn = document.getElementById('drawBtn');
  const stepBtn = document.getElementById('stepBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultList = document.getElementById('resultList');
  const fileInput = document.getElementById('fileInput');
  const drawCountInput = document.getElementById('drawCount');
  const enableCountdown = document.getElementById('enableCountdown');

  const countdownModal = document.getElementById('countdownModal');
  const countdownNumber = document.getElementById('countdownNumber');

  const alertModal = document.getElementById('alertModal');
  const alertTitle = document.getElementById('alertTitle');
  const alertMessage = document.getElementById('alertMessage');
  const alertClose = document.getElementById('alertClose');

  let shuffledNames = [];
  let currentStep = 0;
  let drawInterval = null;

  /* =========================
     ALERTA (ROBUSTO)
  ========================= */

  function showAlert(message, title = 'Atenção') {
    if (!alertModal || !alertMessage || !alertTitle) {
      alert(message);
      return;
    }

    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertModal.classList.add('active');
  }

  if (alertModal && alertClose) {
    alertClose.addEventListener('click', () => {
      alertModal.classList.remove('active');
    });

    alertModal.addEventListener('click', (e) => {
      if (e.target === alertModal) {
        alertModal.classList.remove('active');
      }
    });
  }

  /* =========================
     UTILITÁRIOS
  ========================= */

  function getNames() {
    if (!namesInput) return [];
    return namesInput.value
      .split('\n')
      .map(n => n.trim())
      .filter(Boolean);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderResult(name, position) {
    if (!resultList) return;

    const div = document.createElement('div');
    div.className = `result-item rank-${position}`;
    div.dataset.rank = `${position}º`;
    div.textContent = name;

    resultList.appendChild(div);
    resultList.scrollTop = resultList.scrollHeight;
  }

  /* =========================
     CONTAGEM REGRESSIVA
  ========================= */

  function startCountdown(callback) {
    if (!countdownModal || !countdownNumber) {
      callback();
      return;
    }

    let time = 5;
    countdownNumber.textContent = time;
    countdownModal.classList.add('active');

    const timer = setInterval(() => {
      time--;
      countdownNumber.textContent = time;

      if (time <= 0) {
        clearInterval(timer);
        countdownModal.classList.remove('active');
        setTimeout(callback, 200);
      }
    }, 1000);
  }

  /* =========================
     SORTEIO PROGRESSIVO
  ========================= */

  function progressiveDraw(quantity) {
    let count = 0;

    drawInterval = setInterval(() => {
      if (count >= quantity || currentStep >= shuffledNames.length) {
        clearInterval(drawInterval);
        return;
      }

      renderResult(shuffledNames[currentStep], currentStep + 1);
      currentStep++;
      count++;

    }, 500);
  }

  /* =========================
     IMPORTAÇÃO DE ARQUIVOS
  ========================= */

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file || !namesInput) return;

      const ext = file.name.split('.').pop().toLowerCase();

      try {
        if (ext === 'csv' || ext === 'txt') {
          namesInput.value = await file.text();
        }

        else if (ext === 'xlsx' || ext === 'xls') {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          namesInput.value = json.flat().filter(Boolean).join('\n');
        }

        else if (ext === 'pdf') {
          const data = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(data).promise;
          let text = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(i => i.str).join('\n') + '\n';
          }

          namesInput.value = text;
        }

      } catch {
        showAlert('Erro ao importar arquivo.');
      }
    });
  }

  /* =========================
     EVENTOS
  ========================= */

  if (drawBtn) {
    drawBtn.addEventListener('click', () => {
      const names = getNames();

      if (names.length < 2) {
        showAlert('Insira pelo menos 2 nomes para realizar o sorteio.');
        return;
      }

      clearInterval(drawInterval);
      resultList.innerHTML = '';
      currentStep = 0;
      shuffledNames = shuffle([...names]);

      const quantity =
        Math.min(parseInt(drawCountInput?.value) || names.length, names.length);

      if (enableCountdown?.checked) {
        startCountdown(() => progressiveDraw(quantity));
      } else {
        progressiveDraw(quantity);
      }
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      if (shuffledNames.length === 0 || currentStep >= shuffledNames.length) {
        const names = getNames();
        if (names.length < 2) {
          showAlert('Insira pelo menos 2 nomes para realizar o sorteio.');
          return;
        }

        shuffledNames = shuffle([...names]);
        currentStep = 0;
        resultList.innerHTML = '';
      }

      renderResult(shuffledNames[currentStep], currentStep + 1);
      currentStep++;
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearInterval(drawInterval);
      if (namesInput) namesInput.value = '';
      if (fileInput) fileInput.value = '';
      if (resultList) resultList.innerHTML = '';
      shuffledNames = [];
      currentStep = 0;
    });
  }

  /* =========================
     HEADER COMPACTO (SEGURO)
  ========================= */

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (!header) return;

    header.classList.toggle('compact', window.scrollY > 80);
  });

});
