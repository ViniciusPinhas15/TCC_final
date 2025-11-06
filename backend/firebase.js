// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDmF-OkFwUnZXW1WHrTu2HCCkXUdavaRqg",
  authDomain: "balds-restobar.firebaseapp.com",
  projectId: "balds-restobar",
  storageBucket: "balds-restobar.firebasestorage.app",
  messagingSenderId: "35157944769",
  appId: "1:35157944769:web:9cb4ffdcf015f21ccf2740"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Função para mensagens no cadastro/login
function showMessage(text, type) {
  const msgDiv = document.getElementById('message');
  if (!msgDiv) return;

  msgDiv.innerHTML = `
    <div class="alert alert-${type}">
      ${text}
    </div>
  `;

  setTimeout(() => msgDiv.innerHTML = "", 4000);
}

// ================= LOGIN =================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      showMessage('Login realizado com sucesso!', 'success');
      setTimeout(() => window.location.href = 'index.html', 1500);
    } catch (error) {
      showMessage(`Erro: ${error.message}`, 'danger');
    }
  });
}

// ================= CADASTRO =================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await db.collection('users').doc(user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showMessage('Cadastro concluído!', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);

    } catch (error) {
      showMessage(`Erro: ${error.message}`, 'danger');
    }
  });
}
// ✅ Controle de login na UI
auth.onAuthStateChanged(async (user) => {
  const loginBtn = document.getElementById("loginBtn");
  const profileMenu = document.getElementById("profileMenu");

  if (user) {
    // Esconde botão login
    if (loginBtn) loginBtn.style.display = "none";
    // Mostra perfil
    if (profileMenu) profileMenu.style.display = "block";
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (profileMenu) profileMenu.style.display = "none";
  }
});

// ✅ Botão de Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "./login.html";
});

// ✅ Alterar Senha
document.getElementById("changePassword")?.addEventListener("click", () => {
  const email = auth.currentUser?.email;
  if (email) {
    auth.sendPasswordResetEmail(email);
    alert("Email de redefinição de senha enviado!");
  }
});

// ✅ Alterar Nome
document.getElementById("changeName")?.addEventListener("click", async () => {
  const newName = prompt("Digite seu novo nome:");
  if (!newName || !auth.currentUser) return;

  const userUid = auth.currentUser.uid;

  await db.collection("users").doc(userUid).update({
    name: newName
  });

  alert("Nome atualizado com sucesso!");
});
