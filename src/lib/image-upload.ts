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
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return {
    name: file.name,
    type: file.type,
    data: btoa(binary),
  };
}
