import { IEncryptionServie } from "../../../common";
import crypto from "node:crypto";

export class AesService implements IEncryptionServie {
  private static readonly ALGORITHM: string = "aes-256-cbc";

  public async encrypt(plaintext: string, key: string): Promise<string> {
    const salt = crypto.randomBytes(16);
    const bufferKey = await this.createKeyFromPassword(key, salt);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(AesService.ALGORITHM, bufferKey, iv);
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${salt.toString("hex")}:${iv.toString("hex")}:${encrypted}`;
  }
  public async decrypt(encrypted: string, key: string): Promise<string> {
    const parts = encrypted.split(":");
    if (parts.length !== 3)
      throw new Error("Невірний формат зашифрованих даних");
    const salt = Buffer.from(parts[0], "hex");
    const iv = Buffer.from(parts[1], "hex");
    const encryptedString = parts[2];
    const keyBuffer = await this.createKeyFromPassword(key, salt);
    const decipher = crypto.createDecipheriv(
      AesService.ALGORITHM,
      keyBuffer,
      iv,
    );
    let decrypted = decipher.update(encryptedString, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  private createKeyFromPassword(
    password: string,
    salt: Buffer,
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      crypto.scrypt(password, salt, 32, (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      });
    });
  }
}
