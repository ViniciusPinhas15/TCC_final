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
// ================================
// animations.js
// Animações profissionais ao rolar
// ================================

document.addEventListener("DOMContentLoaded", () => {
  // Seleciona elementos
  const characters = document.querySelectorAll(".character");
  const titles = document.querySelectorAll(".section-title, .section-subtitle");
  const sobreSection = document.querySelector(".sobre");
  const sobreText = document.querySelector(".sobre-container");
  const sobreImage = document.querySelector(".sobre-img-top");

  // Configurações do observer
  const observerOptions = {
    threshold: 0.25, // dispara quando 25% visível
  };

  // Função genérica para revelar com atraso suave
  const revealElement = (el, index = 0, baseDelay = 150) => {
    setTimeout(() => el.classList.add("visible"), index * baseDelay);
  };

  // ========== Personagens ==========
  const characterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        revealElement(entry.target, index, 200);
        characterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  characters.forEach((char) => characterObserver.observe(char));

  // ========== Títulos ==========
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        titleObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  titles.forEach((title) => titleObserver.observe(title));

  // ========== SOBRE NÓS ==========
  if (sobreSection && sobreText && sobreImage) {
    const sobreObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sobreText.classList.add("visible");
          setTimeout(() => sobreImage.classList.add("visible"), 300); // imagem entra logo depois
          sobreObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sobreObserver.observe(sobreSection);
  }
});
// animations.js
// Animações ao rolar e navegação com destaque (AURA)

document.addEventListener("DOMContentLoaded", () => {
  // === Seletores ===
  const characters = document.querySelectorAll(".character");
  const titles = document.querySelectorAll(".section-title, .section-subtitle");
  const sobreSection = document.querySelector(".sobre");
  const sobreText = document.querySelector(".sobre-container");
  const sobreImage = document.querySelector(".sobre-img-top");
  const appSection = document.getElementById("app");
  const ajudaSection = document.getElementById("ajuda");

  // === Observer options ===
  const smallOptions = { threshold: 0.2 };
  const midOptions = { threshold: 0.25 };

  // === util: reveal with delay (for list-like elements) ===
  const revealWithStagger = (elList, baseDelay = 150) => {
    elList.forEach((el, idx) => {
      setTimeout(() => el.classList.add("visible"), idx * baseDelay);
    });
  };

  // ========== Characters ==========
  if (characters.length) {
    const charObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, midOptions);

    characters.forEach((c) => charObserver.observe(c));
  }

  // ========== Titles (section title + subtitle) ==========
  if (titles.length) {
    const titleObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, smallOptions);

    titles.forEach((t) => titleObserver.observe(t));
  }

  // ========== SOBRE (texto + imagem) ==========
  if (sobreSection && sobreText && sobreImage) {
    const sobreObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // texto aparece primeiro
          sobreText.classList.add("visible");
          // imagem aparece com atraso
          setTimeout(() => sobreImage.classList.add("visible"), 250);
          obs.unobserve(entry.target);
        }
      });
    }, midOptions);

    sobreObserver.observe(sobreSection);
  }

  // ========== APP e AJUDA - Fade-in quando entram ==========
  const fadeTargets = [];
  if (appSection) fadeTargets.push(appSection);
  if (ajudaSection) fadeTargets.push(ajudaSection);

  if (fadeTargets.length) {
    const fadeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // espera que CSS trate .visible
          obs.unobserve(entry.target);
        }
      });
    }, smallOptions);

    fadeTargets.forEach((t) => {
      // assegura que os alvos comecem com estilo de entrada
      t.classList.add("fade-in");
      fadeObserver.observe(t);
    });
  }

  // ========== Rolagem pelo menu com destaque confiável ==========
  // para todos links ancorados internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (ev) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (!target) return; // nada a fazer

      ev.preventDefault();

      // Rola suavemente
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      // cria um observer temporário para detectar quando o target ficou visível
      const tempObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // remove quaisquer highlights existentes
            document.querySelectorAll(".highlight").forEach((el) => el.classList.remove("highlight"));

            // aplica o destaque dependendo do alvo
            if (targetId === "app") {
              const appBtn = target.querySelector(".apk-btn");
              if (appBtn) {
                appBtn.classList.add("highlight");
                // remove depois do tempo da animação
                setTimeout(() => appBtn.classList.remove("highlight"), 1600);
              }
            } else if (targetId === "ajuda") {
              const h2 = target.querySelector("h2, .ajuda-texto h2");
              if (h2) {
                h2.classList.add("highlight");
                setTimeout(() => h2.classList.remove("highlight"), 1600);
              }
            } else {
              // genérico: highlight no próprio target
              target.classList.add("highlight");
              setTimeout(() => target.classList.remove("highlight"), 1200);
            }

            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      // start observing the target + a small safety timeout
      tempObs.observe(target);

      // safety fallback: if not intersecting after 1200ms, still apply briefly
      setTimeout(() => {
        if (!target.classList.contains("highlight")) {
          if (targetId === "app") {
            const appBtn = target.querySelector(".apk-btn");
            if (appBtn) {
              appBtn.classList.add("highlight");
              setTimeout(() => appBtn.classList.remove("highlight"), 1600);
            }
          } else if (targetId === "ajuda") {
            const h2 = target.querySelector("h2, .ajuda-texto h2");
            if (h2) {
              h2.classList.add("highlight");
              setTimeout(() => h2.classList.remove("highlight"), 1600);
            }
          }
        }
      }, 1200);
    });
  });
});
// ======== Navegação com transição suave e animação visual ========
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('header nav a[href^="#"]');

  // Criar overlay de transição (fade)
  const overlay = document.createElement("div");
  overlay.classList.add("page-transition");
  document.body.appendChild(overlay);

  // Função de animação de rolagem
  const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    // Inicia o efeito de transição (fade escuro)
    overlay.classList.add("active");

    // Aguarda um pouco antes de rolar
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      // Ao chegar, destaca a seção (fade + zoom leve)
      target.classList.add("focus-section");
      setTimeout(() => {
        target.classList.remove("focus-section");
      }, 1200);

      // Remove overlay
      setTimeout(() => {
        overlay.classList.remove("active");
      }, 800);
    }, 300);
  };

  // Adiciona evento aos links
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      const id = href.substring(1);
      scrollToSection(id);
    });
  });
});
  