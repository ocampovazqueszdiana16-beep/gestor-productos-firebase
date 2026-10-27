// Formulario de alta/edición con validación y vista previa de imágenes
import { createProduct, updateProduct } from "./productService.js";
import { renderProducts } from "./productList.js";
import { compressImage, onlyImages, MIN_IMAGES, MAX_IMAGES } from "./imageUtils.js";

const modalEl = document.querySelector('#product-modal');
const form = document.querySelector('#product-form');
const input = document.querySelector('#product-images');
const preview = document.querySelector('#image-preview');
const errorBox = document.querySelector('#image-error');
const title = document.querySelector('#product-modal-title');
const saveBtn = document.querySelector('#product-save');

// Estado: imágenes ya guardadas, nuevas (comprimidas) y las marcadas para borrar
let editingId = null, existing = [], added = [], removed = [];
const total = () => existing.length + added.length;
const showError = msg => { errorBox.textContent = msg; errorBox.style.display = msg ? 'block' : 'none'; };

const drawPreview = () => {
  const thumb = (src, kind, i) => `<div class="pv"><img src="${src}" alt=""><button type="button" data-kind="${kind}" data-i="${i}" aria-label="Quitar imagen">&times;</button></div>`;
  preview.innerHTML = existing.map((im, i) => thumb(im.data, 'old', i)).join('') + added.map((im, i) => thumb(im.data, 'new', i)).join('');
  document.querySelector('#image-counter').textContent = `${total()} / ${MAX_IMAGES} imágenes`;
};

const reset = () => {
  form.reset(); editingId = null; existing = []; added = []; removed = [];
  showError(''); drawPreview();
};

document.querySelector('#new-product').addEventListener('click', () => {
  reset(); title.textContent = 'Nuevo producto';
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
});

export const openForEdit = p => {
  reset(); editingId = p.id; title.textContent = 'Editar producto';
  form.nombre.value = p.nombre; form.descripcion.value = p.descripcion;
  form.precio.value = p.precio; form.categoria.value = p.categoria; form.existencias.value = p.existencias;
  existing = [...p.images]; drawPreview();
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
};

// Al elegir archivos: valida tipo y cantidad, comprime y muestra vista previa
input.addEventListener('change', async () => {
  const files = [...input.files]; input.value = '';
  if (!files.length) return;
  if (!onlyImages(files)) return showError('Solo se permiten archivos de imagen (JPG, PNG, WebP…).');
  if (total() + files.length > MAX_IMAGES)
    return showError(`Máximo ${MAX_IMAGES} imágenes por producto. Ya tienes ${total()} y elegiste ${files.length}.`);
  showError('');
  try {
    for (const f of files) added.push({ data: await compressImage(f), nombreArchivo: f.name });
  } catch (e) { showError(e.message); }
  drawPreview();
});

// Quitar una imagen (nueva o ya guardada)
preview.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const i = Number(b.dataset.i);
  if (b.dataset.kind === 'old') removed.push(existing.splice(i, 1)[0].id);
  else added.splice(i, 1);
  showError(''); drawPreview();
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (total() < MIN_IMAGES) return showError('Agrega al menos 1 imagen al producto.');
  if (total() > MAX_IMAGES) return showError(`Máximo ${MAX_IMAGES} imágenes por producto.`);
  const fields = {
    nombre: form.nombre.value.trim(), descripcion: form.descripcion.value.trim(),
    precio: Number(form.precio.value), categoria: form.categoria.value,
    existencias: parseInt(form.existencias.value, 10)
  };
  saveBtn.disabled = true; saveBtn.textContent = 'Guardando…';
  try {
    if (editingId) {
      const nextOrder = Date.now(); // orden creciente para las imágenes nuevas
      await updateProduct(editingId, fields, removed, added, nextOrder);
    } else await createProduct(fields, added);
    bootstrap.Modal.getInstance(modalEl).hide();
    await renderProducts();
  } catch (err) {
    console.error(err); showError('No se pudo guardar: ' + err.message);
  } finally { saveBtn.disabled = false; saveBtn.textContent = 'Guardar producto'; }
});
