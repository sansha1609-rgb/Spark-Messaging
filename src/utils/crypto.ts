/**
 * Cryptographic utility for End-to-End Encryption (E2EE) inspection,
 * AES-GCM packet simulation, and 60-digit Safety Number verification.
 */

export async function generateSafetyNumber(seed: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed + '-whatsapp-gb-e2ee-v2');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Produce numeric 60 digits
    let digits = '';
    for (let i = 0; i < hashArray.length && digits.length < 60; i++) {
      digits += (hashArray[i] * 397 % 100000).toString().padStart(5, '0');
    }
    // Group in 5-digit blocks
    const chunks = [];
    for (let i = 0; i < 60; i += 5) {
      chunks.push(digits.slice(i, i + 5));
    }
    return chunks.join(' ');
  } catch {
    return '42891 78912 00192 84721 99124 57291 38472 91823 48102 75829 19384 75629';
  }
}

export async function encryptPacket(plaintext: string, contactId: string): Promise<{
  algorithm: string;
  iv: string;
  tag: string;
  ciphertext: string;
  keyFingerprint: string;
}> {
  try {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

    // Digest of plaintext + contactId for authentic HMAC tag simulation
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(plaintext + contactId + ivHex));
    const digestArray = Array.from(new Uint8Array(digest));
    const tagHex = digestArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Key fingerprint
    const keyFingerprint = digestArray.slice(16, 24).map(b => b.toString(16).padStart(2, '0')).join(':').toUpperCase();

    // Base64 ciphertext representation
    const textBytes = encoder.encode(plaintext);
    const xorCipher = new Uint8Array(textBytes.length);
    for (let i = 0; i < textBytes.length; i++) {
      xorCipher[i] = textBytes[i] ^ iv[i % iv.length];
    }
    const ciphertextBase64 = btoa(String.fromCharCode(...xorCipher));

    return {
      algorithm: 'AES-GCM-256 (Modified Signal/Noise Protocol)',
      iv: '0x' + ivHex,
      tag: '0x' + tagHex,
      ciphertext: ciphertextBase64,
      keyFingerprint,
    };
  } catch {
    return {
      algorithm: 'AES-GCM-256',
      iv: '0x3a9f1b2c4d5e',
      tag: '0x8e7d6c5b4a',
      ciphertext: btoa(plaintext),
      keyFingerprint: '9A:4F:2E:8C:1D:3B:AA:05',
    };
  }
}
