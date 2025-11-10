// ================================
// animations.js
// Animações profissionais (AURA)
// ================================

document.addEventListener("DOMContentLoaded", () => {
  // === Seletores principais ===
  const characters = document.querySelectorAll(".character");
  const titles = document.querySelectorAll(".section-title, .section-subtitle");
  const sobreSection = document.querySelector(".sobre");
  const sobreText = document.querySelector(".sobre-container");
  const sobreImage = document.querySelector(".sobre-img-top");
  const links = document.querySelectorAll('header nav a[href^="#"]');

  // === Observers base ===
  const observerOptions = { threshold: 0.25 };

  // === Função genérica de revelar com atraso ===
  const revealWithDelay = (el, delay = 0) => {
    setTimeout(() => el.classList.add("visible"), delay);
  };

  // === Characters (animação individual) ===
  if (characters.length) {
    const charObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          revealWithDelay(entry.target, i * 150);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
    characters.forEach((c) => charObserver.observe(c));
  }

  // === Titles ===
  if (titles.length) {
    const titleObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
    titles.forEach((t) => titleObserver.observe(t));
  }

  // === Seção SOBRE (texto + imagem) ===
  if (sobreSection && sobreText && sobreImage) {
    const sobreObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sobreText.classList.add("visible");
          setTimeout(() => sobreImage.classList.add("visible"), 300);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
    sobreObserver.observe(sobreSection);
  }

  // === Overlay de transição suave entre cliques ===
  const overlay = document.createElement("div");
  overlay.classList.add("page-transition");
  document.body.appendChild(overlay);

  // === Rolagem suave com offset fixo ===
  const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    // Inicia fade-out (transição)
    overlay.classList.add("active");

    setTimeout(() => {
      // Scroll exato até o texto
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });

      // Destaque suave na seção
      target.classList.add("focus-section");
      setTimeout(() => target.classList.remove("focus-section"), 1200);

      // Finaliza transição
      setTimeout(() => overlay.classList.remove("active"), 700);
    }, 250);
  };

  // === Eventos do menu ===
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      const id = href.substring(1);
      scrollToSection(id);
    });
  });
});
