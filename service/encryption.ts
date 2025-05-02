import pkg from 'crypto-js';
const { AES, enc } = pkg;

const $key = process.env.NEXT_PUBLIC_ENCRYPT_KEY;

if (!$key) {
    throw new Error('Encryption key is not defined');
}

export const encrypt = (data:any) => {
    return AES.encrypt(data, $key).toString();
}
export const decrypt = (data: any) => {
    try {
        if (data) {
            const bytes = AES.decrypt(data, $key);
            const decryptedText = bytes.toString(enc.Utf8);
            return JSON.parse(decryptedText);
        }
    } catch (error) {
        console.error('Decryption error:', error);
    }
    return null;
}
