// Aguarda o carregamento completo do DOM para evitar erros
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. Carregamento Dinâmico do Cabeçalho e Rodapé
       ========================================================================= */

    // Carrega o cabeçalho e insere no placeholder
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('/header.html')
            .then(res => res.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;
                
                // As funcionalidades do header precisam ser ativadas aqui, após o HTML ser carregado.
                
                // Lógica do Menu Hambúrguer
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.addEventListener('click', () => {
                        // Adiciona/remove a classe 'active' para animar o ícone e mostrar o menu
                        hamburger.classList.toggle('active');
                        navMenu.classList.toggle('active');
                    });
                }
                
                // Destacar o link ativo no menu
                const currentPath = window.location.pathname;
                document.querySelectorAll("#nav-menu ul li a").forEach(link => {
                    const linkPath = new URL(link.href).pathname;
                    if (linkPath === currentPath) {
                        link.classList.add("active");
                    }
                });
            })
            .catch(err => console.error("Erro ao carregar o header:", err));
    }
    
    // Carrega o rodapé e insere no placeholder
    const footerPlaceholder = document.getElementById('footer');
    if (footerPlaceholder) {
        fetch('/footer.html')
            .then(res => res.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }


    /* =========================================================================
       2. Efeito de Digitação na Homepage (Se o elemento existir)
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
       3. Atualização de Skills com base em Projetos (Se a página for de skills)
       ========================================================================= */
    const atualizarSkillsComProjetos = () => {
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
    
    // Roda a função apenas se a página atual for a de skills
    if (window.location.pathname.includes('skills.html')) {
        atualizarSkillsComProjetos();
    }
});