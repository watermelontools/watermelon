import base64ToUint8Array from "./base64ToUint8Array";

export function encrypt(plaintext: string): string {
    if(!process.env.NEXT_PUBLIC_ENCRYPTION_KEY) {
        throw new Error("Encryption key not found"); 
    }
    const key = base64ToUint8Array(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
    
    let encrypted = "";
    for (let i = 0; i < plaintext.length; i++) {
        encrypted += String.fromCharCode(plaintext.charCodeAt(i) ^ key[i % key.length]);
    }
    return btoa(encrypted);  // encoding result to base64 for better readability
}

export function decrypt(ciphertext: string): string {
    if(!process.env.NEXT_PUBLIC_ENCRYPTION_KEYY) {
        throw new Error("Encryption key not found"); 
    }
    const key = base64ToUint8Array(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

    const decoded = atob(ciphertext);
    let decrypted = "";
    
    for (let i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key[i % key.length]);
    }
    return decrypted;
}