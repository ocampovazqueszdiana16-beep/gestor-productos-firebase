// Listado de productos del usuario (tarjetas) con botones Editar / Eliminar
import { listProducts, deleteProduct } from "./productService.js";
import { openForEdit } from "./productForm.js";

const grid = document.querySelector('#product-grid');
const count = document.querySelector('#product-count');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cache = [];

export const renderProducts = async () => {
  grid.innerHTML = '<p class="muted">Cargando productos…</p>';
  try {
    cache = await listProducts();
  } catch (e) {
    console.error(e);
    grid.innerHTML = '<p class="muted">No se pudieron cargar los productos: ' + esc(e.message) + '</p>';
    return;
  }
  count.textContent = cache.length;
  if (!cache.length) {
    grid.innerHTML = '<div class="empty"><h3>Aún no tienes productos</h3><p>Agrega el primero con el botón “Nuevo producto”.</p></div>';
    return;
  }
  grid.innerHTML = cache.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="thumbs ${p.images.length > 1 ? 'multi' : ''}">
        ${p.images.map(i => `<img src="${i.data}" alt="${esc(p.nombre)}" loading="lazy">`).join('')}
      </div>
      <div class="product-body">
        <span class="chip">${esc(p.categoria)}</span>
        <h3>${esc(p.nombre)}</h3>
        <p class="desc">${esc(p.descripcion)}</p>
        <div class="meta">
          <strong class="price">$${Number(p.precio).toFixed(2)}</strong>
          <span>${esc(p.existencias)} en existencia</span>
        </div>
        <div class="actions">
          <button class="btn btn-sm btn-outline-light" data-act="edit">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-act="delete">Eliminar</button>
        </div>
      </div>
    </article>`).join('');
};

// Limpia la pantalla al cerrar sesión (no quedan datos del usuario anterior)
export const clearProducts = () => { cache = []; grid.innerHTML = ''; count.textContent = '0'; };

grid.addEventListener('click', async e => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = btn.closest('.product-card').dataset.id;
  const product = cache.find(p => p.id === id);
  if (btn.dataset.act === 'edit') openForEdit(product);
  if (btn.dataset.act === 'delete' && confirm(`¿Eliminar “${product.nombre}” y sus imágenes?`)) {
    try { await deleteProduct(id); await renderProducts(); }
    catch (err) { alert('Error al eliminar: ' + err.message); }
  }
});
