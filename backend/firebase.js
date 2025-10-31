// 🔥 firebase.js — TUDO EM UM SÓ ARQUIVO

// === PASSO 1: CONFIGURAÇÃO DO FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyDmF-OkFwUnZXW1WHrTu2HCCkXUdavaRqg",
  authDomain: "balds-restobar.firebaseapp.com",
  projectId: "balds-restobar",
  storageBucket: "balds-restobar.firebasestorage.app",
  messagingSenderId: "35157944769",
  appId: "1:35157944769:web:9cb4ffdcf015f21ccf2740"
};
/// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
// Referências
const auth = firebase.auth();
const db = firebase.firestore();

// === FUNÇÃO PARA MOSTRAR MENSAGENS ===
function showMessage(text, type) {
  const msgDiv = document.getElementById('message');
  if (msgDiv) {
    msgDiv.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
  }
}

// === LOGIN ===
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showMessage('Login bem-sucedido!', 'success');
    setTimeout(() => window.location.href = '../index.html', 1500); // Ajuste o caminho se necessário
  } catch (error) {
    showMessage(`Erro: ${error.message}`, 'danger');
  }
});

// === CADASTRO ===
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection('users').doc(user.uid).set({
      name: name,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showMessage('Cadastro realizado com sucesso!', 'success');
    setTimeout(() => window.location.href = '../index.html', 1500); // Ajuste o caminho se necessário
  } catch (error) {
    showMessage(`Erro: ${error.message}`, 'danger');
  }
});