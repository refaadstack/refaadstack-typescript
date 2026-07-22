export interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface UploadFileData {
  name: string;
  type: string;
  data: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    return 'File harus berupa gambar.';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran gambar maksimal 5MB.';
  }
  return null;
}

export function createPendingImages(files: FileList | File[]) {
  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    previewUrl: URL.createObjectURL(file),
  }));
}

export function revokePendingImages(images: PendingImage[]) {
  images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
}

export async function fileToUploadData(file: File): Promise<UploadFileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // strip "data:image/png;base64," prefix
      const base64 = dataUrl.split(',')[1];
      if (!base64) {
        reject(new Error('Gagal membaca file gambar.'));
        return;
      }
      resolve({
        name: file.name,
        type: file.type,
        data: base64,
      });
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}
