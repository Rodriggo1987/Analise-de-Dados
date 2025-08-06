document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       INICIALIZAÇÃO DO CABEÇALHO E RODAPÉ (com menu hambúrguer)
       ========================================================================= */
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/header.html')
            .then(res => res.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;

                // Lógica do Menu Hambúrguer (Adicionada na versão anterior)
                const hamburger = document.querySelector('.hamburger-menu');
                const nav = document.querySelector('header nav');
                if (hamburger && nav) {
                    hamburger.addEventListener('click', () => {
                        hamburger.classList.toggle('active');
                        nav.classList.toggle('active');
                    });
                }
                
                // Destacar o link ativo no menu
                const currentPath = window.location.pathname;
                document.querySelectorAll("nav ul li a").forEach(link => {
                    const linkPath = new URL(link.href).pathname;
                    if (linkPath === currentPath) {
                        link.classList.add("active");
                    }
                });
            })
            .catch(err => console.error("Erro ao carregar header:", err));
    }

    const footerPlaceholder = document.getElementById('footer');
    if (footerPlaceholder) {
        fetch('/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }

    /* =========================================================================
       EFEITO DE DIGITAÇÃO NA HOMEPAGE
       ========================================================================= */
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        const text = [
            "Dados para Insights de Negocio",
            "Analise e Segurança dos Dados",
            "Visualização e Tomada de Decisão com Dados"
        ];
        
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = text[index];
            typedTextElement.innerHTML = currentText.substring(0, charIndex);
        
            if (!isDeleting && charIndex < currentText.length) {
                charIndex++;
                setTimeout(type, 100);
            } else if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 1500);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(type, 50);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % text.length;
                setTimeout(type, 1000);
            }
        }
        type(); // Inicia o efeito
    }

    /* =========================================================================
       ATUALIZAÇÃO DE SKILLS COM BASE NOS PROJETOS
       ========================================================================= */
    function atualizarSkillsComProjetos() {
        fetch('/sections/projetos.html') // Caminho correto absoluto

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
    
   const currentPath = window.location.pathname;
if (currentPath.includes('skills.html')) {
    atualizarSkillsComProjetos();
}

});
