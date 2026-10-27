import { signInWithPopup, OAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";

const microsoftButton = document.querySelector("#microsoft-login");

const closeSigninModal = () => {
  const modalElement = document.querySelector('#singin-modal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide();
};

if (microsoftButton) {
  microsoftButton.addEventListener('click', async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Microsoft login:", result);
      closeSigninModal();
      alert('Bienvenido ' + (result.user.displayName || result.user.email));
    } catch (error) {
      console.log(error);
      alert("Error al iniciar sesión con Microsoft: " + error.message);
    }
  });
}