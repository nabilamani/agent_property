import imageCompression from "browser-image-compression";

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1, // Target size is 1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Original size: ${file.size / 1024 / 1024} MB`);
    console.log(`Compressed size: ${compressedFile.size / 1024 / 1024} MB`);
    
    // Return a new File object with the same name as the original
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Compression error:", error);
    return file; // Fallback to original file
  }
}

export async function compressMultipleImages(files: File[]) {
  return Promise.all(files.map(file => compressImage(file)));
}
