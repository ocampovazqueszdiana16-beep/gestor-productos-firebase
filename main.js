// Punto de entrada: conecta autenticación con el módulo de productos
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { loginChecker } from "./loginCheck.js";
import { setUid } from "./session.js";
import { renderProducts, clearProducts } from "./productList.js";

import './singupform.js';
import './logout.js';
import './singinForm.js';
import './googleLogin.js';
import './facelogin.js';
import './githublogin.js';
import './microsoftlogin.js';
import './productForm.js';

onAuthStateChanged(auth, async user => {
  loginChecker(user);
  if (user) {
    setUid(user.uid);          // todas las rutas usan users/{uid}/products
    await renderProducts();
  } else {
    setUid(null);
    clearProducts();           // limpia la pantalla
  }
});
