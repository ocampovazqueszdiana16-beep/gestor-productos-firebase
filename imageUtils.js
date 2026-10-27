// Validación, redimensionado y compresión de imágenes en el navegador
export const MIN_IMAGES = 1;
export const MAX_IMAGES = 5;
const MAX_WIDTH = 800;
const MAX_CHARS = 400000; // ~300 KB en Base64 (Base64 pesa ~33% más)

// Valida que todos los archivos sean imágenes
export const onlyImages = files => files.every(f => f.type.startsWith('image/'));

const loadImage = file => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => reject(new Error('No se pudo leer ' + file.name));
  img.src = url;
});

// Devuelve un Data URL JPEG de máx. 800px de ancho y ~300 KB
export const compressImage = async file => {
  const img = await loadImage(file);
  let width = Math.min(MAX_WIDTH, img.width);
  let quality = 0.8;
  let data;
  do {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = Math.round(img.height * (width / img.width));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; // fondo blanco para PNG con transparencia
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    data = canvas.toDataURL('image/jpeg', quality);
    quality -= 0.1;
    if (quality < 0.4) { quality = 0.7; width = Math.round(width * 0.8); }
  } while (data.length > MAX_CHARS && width > 200);
  return data;
};
