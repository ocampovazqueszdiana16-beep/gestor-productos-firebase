import { signInWithPopup, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";

const githubButton = document.querySelector("#github-login");

const closeSigninModal = () => {
  const modalElement = document.querySelector('#singin-modal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide();
};

if (githubButton) {
  githubButton.addEventListener('click', async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub login:", result);
      closeSigninModal();
      alert('Bienvenido ' + (result.user.displayName || result.user.email));
    } catch (error) {
      console.log(error);
      alert("Error al iniciar sesión con GitHub: " + error.message);
    }
  });
}