const ACCEPTED = /\.(jpe?g|png|webp|svg)$/i;

export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED.test(file.name)) {
      reject(new Error(`${file.name}: unsupported file type`));
      return;
    }
    if (file.size > 800 * 1024) {
      reject(new Error(`${file.name}: larger than 800 KB`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`${file.name}: not a valid image`));
    reader.onload = () => {
      const src = reader.result;
      if (file.type === 'image/svg+xml') {
        try {
          const text = atob(String(src).split(',')[1]);
          if (/<script|on\w+\s*=|javascript:/i.test(text)) {
            reject(new Error(`${file.name}: SVG contains unsafe code and was rejected`));
            return;
          }
        } catch {
          reject(new Error('Invalid SVG'));
          return;
        }
      }
      const image = new Image();
      image.onerror = () => reject(new Error(`${file.name}: not a valid image`));
      image.onload = () => resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        w: image.naturalWidth,
        h: image.naturalHeight,
        src,
      });
      image.src = src;
    };
    reader.readAsDataURL(file);
  });
}
