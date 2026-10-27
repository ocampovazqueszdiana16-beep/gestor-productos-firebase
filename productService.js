// CRUD de Firestore. Ruta única: users/{uid}/products (+ subcolección images)
import { db } from "./firebase.js";
import { getUid } from "./session.js";
import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const productsRef = () => collection(db, "users", getUid(), "products");
const imagesRef = id => collection(db, "users", getUid(), "products", id, "images");

// Guarda cada imagen como documento independiente
const saveImages = async (productId, images, startOrder) => {
  for (let i = 0; i < images.length; i++) {
    await addDoc(imagesRef(productId), {
      data: images[i].data,
      nombreArchivo: images[i].nombreArchivo,
      orden: startOrder + i
    });
  }
};

// CREATE
export const createProduct = async (fields, images) => {
  const ref = await addDoc(productsRef(), { ...fields, fechaCreacion: serverTimestamp() });
  await saveImages(ref.id, images, 0);
};

// READ: productos del usuario con sus imágenes
export const listProducts = async () => {
  const snap = await getDocs(query(productsRef(), orderBy("fechaCreacion", "desc")));
  return Promise.all(snap.docs.map(async d => {
    const imgs = await getDocs(query(imagesRef(d.id), orderBy("orden")));
    return { id: d.id, ...d.data(), images: imgs.docs.map(i => ({ id: i.id, ...i.data() })) };
  }));
};

// UPDATE: campos + imágenes eliminadas + imágenes nuevas
export const updateProduct = async (id, fields, removedIds, newImages, nextOrder) => {
  await updateDoc(doc(db, "users", getUid(), "products", id), fields);
  for (const imgId of removedIds) {
    await deleteDoc(doc(db, "users", getUid(), "products", id, "images", imgId));
  }
  await saveImages(id, newImages, nextOrder);
};

// DELETE: Firestore no borra subcolecciones solo, hay que borrar las imágenes primero
export const deleteProduct = async id => {
  const imgs = await getDocs(imagesRef(id));
  await Promise.all(imgs.docs.map(i => deleteDoc(i.ref)));
  await deleteDoc(doc(db, "users", getUid(), "products", id));
};
