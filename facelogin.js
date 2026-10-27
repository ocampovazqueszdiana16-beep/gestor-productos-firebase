import { signInWithPopup, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";

const facebookButton = document.querySelector("#facebook-login");

const closeSigninModal = () => {
  const modalElement = document.querySelector('#singin-modal');
  const modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) modal.hide();
};

if (facebookButton) {
  facebookButton.addEventListener('click', async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Facebook login:", result);
      closeSigninModal();
      alert('Bienvenido ' + (result.user.displayName || result.user.email));
    } catch (error) {
      console.log(error);
      alert("Error al iniciar sesión con Facebook: " + error.message);
    }
  });
}