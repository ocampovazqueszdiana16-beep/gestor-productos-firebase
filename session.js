// Guarda el uid del usuario autenticado. TODAS las consultas parten de aquí.
let currentUid = null;
export const setUid = uid => { currentUid = uid; };
export const getUid = () => currentUid;
