import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js"
import { auth } from "./firebase.js"

const siginForm = document.querySelector('#login-form')

if (siginForm) {
    siginForm.addEventListener('submit', async (e) => {
        // Previene la recarga y la exposición de datos en la URL
        e.preventDefault()

        const email = siginForm['email'].value
        const password = siginForm['password'].value

        try {
            const credenciales = await signInWithEmailAndPassword(auth, email, password)
            console.log("Inicio de sesión exitoso:", credenciales)
            
            // Cerrar el modal automáticamente al iniciar sesión
            const signinModal = document.querySelector('#singin-modal')
            const modal = bootstrap.Modal.getInstance(signinModal)
            if (modal) modal.hide()

            siginForm.reset()
        } catch (error) {
            console.log(error.code, error.message)

            // Validaciones y alertas de error
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert("La contraseña o el correo son incorrectos.")
            } else if (error.code === 'auth/user-not-found') {
                alert("No existe ningún usuario registrado con este correo.")
            } else if (error.code === 'auth/invalid-email') {
                alert("El formato del correo electrónico no es válido.")
            } else {
                alert("Error al iniciar sesión: " + error.message)
            }
        }
    })
}