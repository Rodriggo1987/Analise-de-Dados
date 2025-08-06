const text = [
  "Dados para Insights de Negocio",
  "Analise e Segurança dos Dados",
  "Visualização e Tomada de Decisão com Dados"
];

let index = 0;
let i = 0;
let currentText = '';
let isDeleting = false;
let element = document.getElementById('typed-text');

function type() {
  currentText = text[index];
  
  // Atualiza o conteúdo com base no modo
  element.innerHTML = currentText.substring(0, i);

  // Controla os incrementos/decrementos
  if (!isDeleting && i < currentText.length) {
    i++;
    setTimeout(type, 100); // velocidade da digitação
  } else if (!isDeleting && i === currentText.length) {
    // Espera 1.5s antes de apagar
    isDeleting = true;
    setTimeout(type, 1500);
  } else if (isDeleting && i > 0) {
    i--;
    setTimeout(type, 50); // velocidade da exclusão
  } else if (isDeleting && i === 0) {
    // Avança para o próximo texto após apagar
    isDeleting = false;
    index = (index + 1) % text.length;
    setTimeout(type, 1000); // pequena pausa entre ciclos
  }
}

function atualizarSkillsComProjetos() {
  fetch('projetos.html')
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const tagElements = doc.querySelectorAll('.project-card .tags span');
      const projectTags = Array.from(tagElements).map(el => el.textContent.trim().toLowerCase());

      const tagCount = {};
      projectTags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });

      const skillElements = document.querySelectorAll('.skill');
      skillElements.forEach(skill => {
        const nameEl = skill.querySelector('.skill-name');
        const barEl = skill.querySelector('.progress-bar');
        const percentEl = skill.querySelector('.skill-percent');

        if (nameEl && barEl && percentEl) {
          const skillName = nameEl.textContent.trim().toLowerCase();
          const basePercent = parseInt(barEl.getAttribute('data-base')) || 0;

          if (tagCount[skillName]) {
            const incremento = tagCount[skillName] * 5;
            const novoPercent = Math.min(basePercent + incremento, 100);
            percentEl.textContent = `${novoPercent}%`;
            barEl.style.width = `${novoPercent}%`;
            barEl.style.backgroundColor = '#6a6ff5';
          } else {
            percentEl.textContent = `${basePercent}%`;
            barEl.style.width = `${basePercent}%`;
          }
        }
      });
    })
    .catch(error => console.error('Erro ao atualizar skills:', error));
}




type();
