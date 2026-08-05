import crypto from "node:crypto";
export class AesService {
    static ALGORITHM = "aes-256-cbc";
    async encrypt(plaintext, key) {
        const salt = crypto.randomBytes(16);
        const bufferKey = await this.createKeyFromPassword(key, salt);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(AesService.ALGORITHM, bufferKey, iv);
        let encrypted = cipher.update(plaintext, "utf8", "hex");
        encrypted += cipher.final("hex");
        return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`;
    }
    async decrypt(encrypted, key) {
        const parts = encrypted.split(":");
        if (parts.length !== 3)
            throw new Error("Невірний формат зашифрованих даних");
        const salt = Buffer.from(parts[0], "hex");
        const iv = Buffer.from(parts[1], "hex");
        const encryptedString = parts[2];
        const keyBuffer = await this.createKeyFromPassword(key, salt);
        const decipher = crypto.createDecipheriv(AesService.ALGORITHM, keyBuffer, iv);
        let decrypted = decipher.update(encryptedString, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
    createKeyFromPassword(password, salt) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 32, (error, derivedKey) => {
                if (error)
                    reject(error);
                else
                    resolve(derivedKey);
            });
        });
    }
}
//# sourceMappingURL=aes.service.js.map