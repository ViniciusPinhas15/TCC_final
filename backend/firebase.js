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

