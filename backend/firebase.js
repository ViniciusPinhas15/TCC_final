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
