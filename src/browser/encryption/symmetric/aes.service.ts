import { IEncryptionServie } from "../../../common";

export class AesService implements IEncryptionServie {
  private static readonly ITERATIONS = 100000;
  private static readonly HASH = "SHA-256";
  private static readonly KEY_LENGTH = 32;

  public async encrypt(plaintext: string, key: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyBuffer = await this.deriveKey(key, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(keyBuffer),
      { name: "AES-GCM" },
      false,
      ["encrypt"],
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      data,
    );
    const saltHex = this.bufferToHex(salt);
    const ivHex = this.bufferToHex(iv);
    const encryptedHex = this.bufferToHex(new Uint8Array(encrypted));
    return `${saltHex}:${ivHex}:${encryptedHex}`;
  }

  public async decrypt(encrypted: string, key: string): Promise<string> {
    const parts = encrypted.split(":");
    if (parts.length !== 3) {
      throw new Error("Невірний формат зашифрованих даних");
    }

    const [saltHex, ivHex, encryptedHex] = parts;
    const salt = this.hexToBuffer(saltHex);
    const iv = this.hexToBuffer(ivHex);
    const data = this.hexToBuffer(encryptedHex);
    const keyBuffer = await this.deriveKey(key, salt);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(keyBuffer),
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      cryptoKey,
      new Uint8Array(data),
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  private async deriveKey(
    password: string,
    salt: Uint8Array,
  ): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    const keyBuffer = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits"],
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: new Uint8Array(salt),
        iterations: AesService.ITERATIONS,
        hash: AesService.HASH,
      },
      keyBuffer,
      AesService.KEY_LENGTH * 8,
    );
    return new Uint8Array(derivedBits);
  }

  private bufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private hexToBuffer(hex: string): Uint8Array {
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
      throw new Error("Hex-рядок повинен містити лише шістнадцяткові символи");
    }
    if (hex.length % 2 !== 0) {
      throw new Error("Hex-рядок повинен мати парну довжину");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }
}
