import { type ISigningService } from "../../common";

export class HmacService implements ISigningService {
  private readonly algorithm: string = "SHA-256";

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
    const expected = await this.sign(payload, key);
    return signature === expected;
  }

  private bufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
