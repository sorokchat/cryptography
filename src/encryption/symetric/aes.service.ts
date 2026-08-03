import { IEncryptionServie } from "../encryption.interface";
import crypto, { CipherGCM, DecipherGCM } from "node:crypto";

export class AesService implements IEncryptionServie {
  private readonly ALGORITHM: string = "aes-256-gcm";
  private readonly IV_LENGTH: number = 12;

  public async encrypt(plaintext: string, key: string): Promise<string> {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv) as CipherGCM;
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  }

  public async decrypt(encrypted: string, key: string): Promise<string> {
    const [ivHex, authTagHex, cyphertextHex] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      key,
      iv,
    ) as DecipherGCM;
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(cyphertextHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
