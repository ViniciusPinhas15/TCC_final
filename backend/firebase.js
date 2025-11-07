// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDmF-OkFwUnZXW1WHrTu2HCCkXUdavaRqg",
  authDomain: "balds-restobar.firebaseapp.com",
  projectId: "balds-restobar",
  storageBucket: "balds-restobar.firebasestorage.app",
  messagingSenderId: "35157944769",
  appId: "1:35157944769:web:9cb4ffdcf015f21ccf2740"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Função auxiliar para mensagens simples
function showMessage(text) {
  alert(text);
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await auth.signInWithEmailAndPassword(email, password);
      showMessage("✅ Login realizado com sucesso!");
      window.location.href = "index.html";
    } catch (error) {
      showMessage("❌ Erro: " + error.message);
    }
  });
}

// ================= CADASTRO =================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await db.collection("users").doc(user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showMessage("✅ Cadastro concluído com sucesso!");
      window.location.href = "login.html";
    } catch (error) {
      showMessage("❌ Erro: " + error.message);
    }
  });
}

// ================= LOGIN COM GOOGLE =================
const googleBtn = document.querySelector('.social-btn:nth-child(1)'); // primeiro botão = Google
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      // verifica se já existe no Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();

      if (!userDoc.exists) {
        await db.collection("users").doc(user.uid).set({
          name: user.displayName || "Usuário Google",
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      showMessage('Login com Google realizado com sucesso!', 'success');
      setTimeout(() => window.location.href = 'index.html', 1500);

    } catch (error) {
      console.error("Erro ao logar com Google:", error);
      showMessage(`Erro: ${error.message}`, 'danger');
    }
  });
}

// ================= LOGIN COM FACEBOOK =================
const facebookBtn = document.querySelector('.social-btn:nth-child(2)'); // segundo botão = Facebook
if (facebookBtn) {
  facebookBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.FacebookAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      // verifica se já existe no Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();

      if (!userDoc.exists) {
        await db.collection("users").doc(user.uid).set({
          name: user.displayName || "Usuário Facebook",
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      showMessage('Login com Facebook realizado com sucesso!', 'success');
      setTimeout(() => window.location.href = 'index.html', 1500);

    } catch (error) {
      console.error("Erro ao logar com Facebook:", error);
      showMessage(`Erro: ${error.message}`, 'danger');
    }
  });
}


// ================= CONTROLE DE LOGIN (INDEX) =================
auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");

  if (user) {
    console.log("Usuário logado:", user.email);

    if (loginBtn) loginBtn.style.display = "none";
    if (profileMenu) profileMenu.style.display = "block";

    // Mostrar nome do usuário
    const userDoc = await db.collection("users").doc(user.uid).get();
    const nameEl = document.getElementById("userName");
    if (nameEl && userDoc.exists) {
      nameEl.textContent = userDoc.data().name || user.email;
    }
  } else {
    console.log("Nenhum usuário logado.");
    if (loginBtn) loginBtn.style.display = "block";
    if (profileMenu) profileMenu.style.display = "none";
  }
});

// ================= LOGOUT =================
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  alert("🔒 Você saiu da conta!");
  window.location.href = "login.html";
});
// === ABRIR / FECHAR MENU DE PERFIL ===
const profileBtn = document.getElementById("profileBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

// Controla o estado do menu com classe CSS e evita sumir instantaneamente
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

