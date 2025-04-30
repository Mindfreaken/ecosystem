/**
 * Generates a random encryption key
 */
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypts a file using AES-GCM
 */
export const encryptFile = async (file: File): Promise<{ 
  encryptedData: ArrayBuffer; 
  iv: Uint8Array;
  key: CryptoKey;
}> => {
  const key = await generateEncryptionKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const arrayBuffer = await file.arrayBuffer();
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    arrayBuffer
  );

  return { encryptedData, iv, key };
};

/**
 * Decrypts an encrypted file
 */
export const decryptFile = async (
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> => {
  return await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encryptedData
  );
};

/**
 * Convert ArrayBuffer to base64 string
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Convert base64 string to ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Exports a CryptoKey to base64 string
 */
export const exportKeyToBase64 = async (key: CryptoKey): Promise<string> => {
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
};

/**
 * Imports a base64 string back to CryptoKey
 */
export const importKeyFromBase64 = async (keyStr: string): Promise<CryptoKey> => {
  const keyData = base64ToArrayBuffer(keyStr);
  return await window.crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
}; 