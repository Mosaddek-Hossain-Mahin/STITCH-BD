/**
 * Direct Image Upload Helper
 * Converts File objects from client file pickers / drag-and-drop into
 * optimized Base64 data URLs without needing third-party upload services or external URLs.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  name: string;
  sizeBytes: number;
  width: number;
  height: number;
}

export async function processImageFile(
  file: File,
  maxDimension = 1400,
  quality = 0.88
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    // If SVG, keep as raw SVG data URL to preserve vector crispness
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          name: file.name,
          sizeBytes: file.size,
          width: 200,
          height: 200,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize down if exceeding maxDimension while keeping aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback to original data URL if canvas context fails
          resolve({
            dataUrl: e.target?.result as string,
            name: file.name,
            sizeBytes: file.size,
            width: img.width,
            height: img.height,
          });
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Preserve PNG transparency if PNG, else use WebP or JPEG
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        resolve({
          dataUrl,
          name: file.name,
          sizeBytes: Math.round((dataUrl.length * 3) / 4),
          width,
          height,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
