import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";

const googleButton = document.querySelector("#google-login");

if (googleButton) {
  googleButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
      const credenciales = await signInWithPopup(auth, provider);
      console.log(credenciales);
      
      const modalElement = document.querySelector('#singin-modal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      alert('Bienvenido ' + (credenciales.user.displayName || credenciales.user.email));
    } catch (error) {
      console.log(error);
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  });
}