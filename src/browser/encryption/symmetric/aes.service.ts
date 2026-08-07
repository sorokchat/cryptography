import type { IEncryptionOptions, IEncryptionServie } from "../../../common";

export class AesService implements IEncryptionServie {
  private static readonly ITERATIONS = 100000;
  private static readonly HASH = "SHA-256";
  private static readonly KEY_LENGTH = 32;
  private static readonly ALGORITHM: string = "AES-CBC";

  public async encrypt(
    plaintext: string,
    key: string,
    { salt, iv }: IEncryptionOptions,
  ): Promise<string> {
    const keyBuffer = await this.deriveKey(key, this.hexToBuffer(salt));
    const ivBuffer = this.hexToBuffer(iv);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(keyBuffer),
      { name: AesService.ALGORITHM },
      false,
      ["encrypt"],
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const encrypted = await crypto.subtle.encrypt(
      { name: AesService.ALGORITHM, iv: new Uint8Array(ivBuffer) },
      cryptoKey,
      data,
    );
    return this.bufferToHex(new Uint8Array(encrypted));
  }

  public async decrypt(
    encrypted: string,
    key: string,
    { iv, salt }: IEncryptionOptions,
  ): Promise<string> {
    const saltBuffer = this.hexToBuffer(salt);
    const ivBuffer = this.hexToBuffer(iv);
    const data = this.hexToBuffer(encrypted);
    const keyBuffer = await this.deriveKey(key, saltBuffer);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      new Uint8Array(keyBuffer),
      { name: AesService.ALGORITHM },
      false,
      ["decrypt"],
    );
    const decrypted = await crypto.subtle.decrypt(
      { name: AesService.ALGORITHM, iv: new Uint8Array(ivBuffer) },
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
    const cleaned = hex.replace(/\s/g, "");
    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
    }
    return bytes;
  }
}
