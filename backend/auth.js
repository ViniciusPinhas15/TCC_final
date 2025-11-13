// ./backend/auth.js
// Este arquivo deve ser carregado APÓS firebase.js

// ========== UTILIDADES ==========

// Notificação moderna (em pop-up)
function showNotification(message, isSuccess = false) {
  const old = document.querySelector('.notification');
  if (old) old.remove();

  const notif = document.createElement('div');
  notif.className = `notification ${isSuccess ? 'success' : 'error'}`;
  const icon = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
  notif.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => notif.remove(), 500);
  }, 4000);
}

// ========== TOGGLE DE SENHA (login e cadastro) ==========
document.getElementById("togglePassword")?.addEventListener("click", function () {
  const pwd = document.getElementById("password");
  const icon = this.querySelector("i");
  if (pwd.type === "password") {
    pwd.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    pwd.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
});

document.getElementById("toggleSignupPassword")?.addEventListener("click", function () {
  const pwd = document.getElementById("signupPassword");
  const icon = this.querySelector("i");
  if (pwd.type === "password") {
    pwd.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    pwd.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
});

// ========== LOGIN ==========
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await auth.signInWithEmailAndPassword(email, password);
      showNotification("Login realizado com sucesso!", true);
      setTimeout(() => window.location.href = "index.html", 1500);
    } catch (error) {
      let msg = "Email ou senha incorretos.";
      if (error.code === "auth/invalid-email") {
        msg = "Formato de e-mail inválido.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Muitas tentativas. Tente novamente mais tarde.";
      }
      showNotification(msg, false);
    }
  });
}

// ========== CADASTRO ==========
if (document.getElementById("signupForm")) {
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(userCredential.user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showNotification("Cadastro concluído com sucesso!", true);
      setTimeout(() => window.location.href = "login.html", 1500);
    } catch (error) {
      let msg = "Erro ao criar conta.";
      if (error.code === "auth/email-already-in-use") {
        msg = "Esse e-mail já foi cadastrado.";
      } else if (error.code === "auth/invalid-email") {
        msg = "Formato de e-mail inválido.";
      } else if (error.code === "auth/weak-password") {
        msg = "A senha deve ter pelo menos 6 caracteres.";
      }
      showNotification(msg, false);
    }
  });
}

// ========== LOGIN COM REDES SOCIAIS ==========
if (document.querySelector('.social-btn')) {
  const googleBtn = document.querySelector('.social-btn:nth-child(1)');
  const facebookBtn = document.querySelector('.social-btn:nth-child(2)');

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
          await db.collection("users").doc(user.uid).set({
            name: user.displayName || "Usuário Google",
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        showNotification("Login com Google realizado!", true);
        setTimeout(() => window.location.href = "index.html", 1500);
      } catch (error) {
        console.error("Erro no Google:", error);
        showNotification("Erro ao logar com Google.", false);
      }
    });
  }

  if (facebookBtn) {
    facebookBtn.addEventListener('click', async () => {
      const provider = new firebase.auth.FacebookAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
          await db.collection("users").doc(user.uid).set({
            name: user.displayName || "Usuário Facebook",
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
        showNotification("Login com Facebook realizado!", true);
        setTimeout(() => window.location.href = "index.html", 1500);
      } catch (error) {
        console.error("Erro no Facebook:", error);
        showNotification("Erro ao logar com Facebook.", false);
      }
    });
  }
}

// ========== CONTROLE DE LOGIN (para index.html) ==========
auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");

  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (profileMenu) profileMenu.style.display = "block";

    const userDoc = await db.collection("users").doc(user.uid).get();
    const nameEl = document.getElementById("userName");
    if (nameEl && userDoc.exists) {
      nameEl.textContent = userDoc.data().name || user.email;
    }
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (profileMenu) profileMenu.style.display = "none";
  }
});

// ========== LOGOUT ==========
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  showNotification("Você saiu da conta.", false);
  setTimeout(() => window.location.href = "login.html", 1500);
});

// ========== MENU DE PERFIL ==========
const profileBtn = document.getElementById("profileBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

if (profileBtn && dropdownMenu) {
  let menuVisible = false;

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuVisible = !menuVisible;
    dropdownMenu.classList.toggle("show", menuVisible);
  });

  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      menuVisible = false;
      dropdownMenu.classList.remove("show");
    }
  });
}

// ================= ESQUECEU A SENHA? =================
document.getElementById("forgotPasswordLink")?.addEventListener("click", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email")?.value?.trim();
  if (!email) {
    showNotification("Digite seu e-mail primeiro.", false);
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    showNotification("E-mail de redefinição enviado! Verifique sua caixa de entrada.", true);
  } catch (error) {
    let msg = "Erro ao enviar e-mail.";
    if (error.code === "auth/invalid-email") {
      msg = "Formato de e-mail inválido.";
    } else if (error.code === "auth/user-not-found") {
      msg = "Nenhuma conta encontrada com esse e-mail.";
    }
    showNotification(msg, false);
  }
});