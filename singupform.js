import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js"
import { auth } from "./firebase.js"

const singupForm = document.querySelector('#signup-form')

singupForm.addEventListener('submit', async (e) => {
    // Evita que los datos aparezcan en la URL y que la página se recargue
    e.preventDefault()

    const email = singupForm['signup-email'].value
    const password = singupForm['signup-password'].value

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log("Usuario registrado con éxito:", userCredential)
        alert("¡Registro exitoso!")
        singupForm.reset() // Limpia el formulario tras el registro exitoso
    } catch (error) {
        console.log(error.code, error.message)

        // Notificaciones personalizadas según el error de Firebase
        if (error.code === 'auth/weak-password') {
            alert("La contraseña es muy débil. Debe tener al menos 6 caracteres.")
        } else if (error.code === 'auth/invalid-email') {
            alert("El formato del correo electrónico no es válido.")
        } else if (error.code === 'auth/email-already-in-use') {
            alert("Este correo electrónico ya está registrado.")
        } else {
            alert("Ocurrió un error en el registro: " + error.message)
        }
    }
})