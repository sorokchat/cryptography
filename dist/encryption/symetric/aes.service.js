import crypto from "node:crypto";
export class AesService {
    ALGORITHM = "aes-256-gcm";
    IV_LENGTH = 12;
    async encrypt(plaintext, key) {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
        let encrypted = cipher.update(plaintext, "utf8", "hex");
        encrypted += cipher.final("hex");
        const authTag = cipher.getAuthTag().toString("hex");
        return `${iv.toString("hex")}:${authTag}:${encrypted}`;
    }
    async decrypt(encrypted, key) {
        const [ivHex, authTagHex, cyphertextHex] = encrypted.split(":");
        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");
        const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(cyphertextHex, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}
//# sourceMappingURL=aes.service.js.map