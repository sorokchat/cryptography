import { type ISigningService } from "../../common";

export class HmacService implements ISigningService {
  private readonly algorithm: string;

  constructor(algorithm: string = "SHA-256") {
    const hashMap: Record<string, string> = {
      sha256: "SHA-256",
      sha384: "SHA-384",
      sha512: "SHA-512",
      "sha-256": "SHA-256",
      "sha-384": "SHA-384",
      "sha-512": "SHA-512",
    };
    this.algorithm = hashMap[algorithm.toLowerCase()] || algorithm;
  }

  private async importKey(key: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    return crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: this.algorithm },
      false,
      ["sign"],
    );
  }

  public async sign(payload: string, key: string): Promise<string> {
    const cryptoKey = await this.importKey(key);
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const signature = await crypto.subtle.sign(
      { name: "HMAC" },
      cryptoKey,
      data,
    );
    return this.bufferToHex(new Uint8Array(signature));
  }

  public async verify(
    signature: string,
    payload: string,
    key: string,
  ): Promise<boolean> {
    try {
      const expected = await this.sign(payload, key);
      const sigBuffer = this.hexToBuffer(signature);
      const expBuffer = this.hexToBuffer(expected);
      if (sigBuffer.length !== expBuffer.length) return false;
      return this.timingSafeEqual(sigBuffer, expBuffer);
    } catch {
      return false;
    }
  }

  private bufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  private hexToBuffer(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) {
      throw new Error("Hex-рядок повинен мати парну довжину");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }

  private timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }
    return result === 0;
  }
}
