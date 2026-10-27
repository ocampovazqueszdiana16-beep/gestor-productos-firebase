// Muestra u oculta elementos según haya sesión o no
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

export const loginChecker = user => {
  loggedInLinks.forEach(el => el.style.display = user ? 'block' : 'none');
  loggedOutLinks.forEach(el => el.style.display = user ? 'none' : 'block');
  const label = document.querySelector('#user-label');
  if (label) label.textContent = user ? (user.displayName || user.email || '') : '';
};
