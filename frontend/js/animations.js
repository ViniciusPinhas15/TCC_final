// ================================
// animations.js
// Animações profissionais ao rolar
// ================================

// Quando o DOM for carregado
document.addEventListener("DOMContentLoaded", () => {
  const characters = document.querySelectorAll(".character");
  const titles = document.querySelectorAll(".section-title, .section-subtitle");

  // Usa Intersection Observer para detecção mais fluida
  const observerOptions = {
    threshold: 0.2, // Inicia quando 20% do elemento está visível
  };

  // Função de entrada com atraso suave
  const revealElement = (el, index, baseDelay = 150) => {
    setTimeout(() => el.classList.add("visible"), index * baseDelay);
  };

  // Observador para os personagens
  const characterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        revealElement(entry.target, index, 200);
        characterObserver.unobserve(entry.target); // evita repetir a animação
      }
    });
  }, observerOptions);

  // Observador para o título e subtítulo
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        titleObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Aplica os observadores
  characters.forEach((char) => characterObserver.observe(char));
  titles.forEach((title) => titleObserver.observe(title));
});
