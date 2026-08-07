import type { IEncryptionOptions, IEncryptionServie } from "../../../common";
import crypto from "node:crypto";

export class AesService implements IEncryptionServie {
  private static readonly ALGORITHM: string = "aes-256-cbc";
  private static readonly ITERATIONS: number = 100000;
  private static readonly KEY_LENGTH: number = 32;
  private static readonly DIGEST: string = "sha256";

  public async encrypt(
    plaintext: string,
    key: string,
    { iv, salt }: IEncryptionOptions,
  ): Promise<string> {
    const saltBuffer = Buffer.from(salt, "hex");
    const ivBuffer = Buffer.from(iv, "hex");
    const keyBufer = await this.deriveKey(key, saltBuffer);
    const cipher = crypto.createCipheriv(
      AesService.ALGORITHM,
      keyBufer,
      ivBuffer,
    );
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }
  public async decrypt(
    encrypted: string,
    key: string,
    { iv, salt }: IEncryptionOptions,
  ): Promise<string> {
    const saltBuffer = Buffer.from(salt, "hex");
    const ivBuffer = Buffer.from(iv, "hex");
    const keyBuffer = await this.deriveKey(key, saltBuffer);
    const decipher = crypto.createDecipheriv(
      AesService.ALGORITHM,
      keyBuffer,
      ivBuffer,
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  private deriveKey(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        salt,
        AesService.ITERATIONS,
        AesService.KEY_LENGTH,
        AesService.DIGEST,
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        },
      );
    });
  }
}
