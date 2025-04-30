import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../lib/firebase';
import { encryptFile, decryptFile, exportKeyToBase64, importKeyFromBase64 } from '../utils/fileEncryption';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage(app);

interface UploadResult {
  downloadUrl: string;
  encryptionKey: string;
  iv: string;
  fileName: string;
}

/**
 * Convert Uint8Array to base64 string
 */
const uint8ArrayToBase64 = (array: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < array.byteLength; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
};

/**
 * Convert base64 string to Uint8Array
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const uploadEncryptedFile = async (
  file: File,
  folder: string = 'chat'
): Promise<UploadResult> => {
  try {
    // Encrypt the file
    const { encryptedData, iv, key } = await encryptFile(file);
    
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    
    // Create a reference to the file location
    const fileRef = ref(storage, fileName);
    
    // Upload the encrypted file
    await uploadBytes(fileRef, new Blob([encryptedData]));
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(fileRef);
    
    // Export the encryption key to base64
    const encryptionKey = await exportKeyToBase64(key);
    
    return {
      downloadUrl,
      encryptionKey,
      iv: uint8ArrayToBase64(iv),
      fileName
    };
  } catch (error) {
    console.error('Error uploading encrypted file:', error);
    throw error;
  }
};

export const downloadAndDecryptFile = async (
  url: string,
  encryptionKey: string,
  iv: string,
  mimeType: string
): Promise<Blob> => {
  try {
    // Download the encrypted file
    const response = await fetch(url);
    const encryptedData = await response.arrayBuffer();
    
    // Convert base64 IV back to Uint8Array
    const ivArray = base64ToUint8Array(iv);
    
    // Import the encryption key
    const key = await importKeyFromBase64(encryptionKey);
    
    // Decrypt the file
    const decryptedData = await decryptFile(encryptedData, key, ivArray);
    
    // Return as Blob with original mime type
    return new Blob([decryptedData], { type: mimeType });
  } catch (error) {
    console.error('Error downloading and decrypting file:', error);
    throw error;
  }
};

export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileName);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};