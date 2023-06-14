import { AES, enc } from 'crypto-js';

export const decrypt = async (data: string) => {
    const key = "y$B&E)H@McQfTjWmZq4t7w!z%C*F-JaN"
    const decryptedData = AES.decrypt(data, key).toString(enc.Utf8);
    const decryptedJson = JSON.parse(decryptedData);
    return decryptedJson
}