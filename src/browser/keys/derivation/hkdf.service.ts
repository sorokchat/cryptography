import {
  type KeyDerivationFunction,
  type KeyDerivationParameters,
} from "../../../common";

export class HkdfService implements KeyDerivationFunction {
  private readonly defaultHash: string = "SHA-256";

  public async deriveKey(parameters: KeyDerivationParameters): Promise<string> {
    const { secret, salt, info, length, hash = this.defaultHash } = parameters;
    if (length === 0) throw new Error("Розмір має бути більше 0");
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const saltData = salt ? encoder.encode(salt) : new Uint8Array(0);
    const infoData = info ? encoder.encode(info) : new Uint8Array(0);
    const hashMap: Record<string, string> = {
      sha256: "SHA-256",
      sha384: "SHA-384",
      sha512: "SHA-512",
    };
    const webHash = hashMap[hash.toLowerCase()] || hash;
    const key = await crypto.subtle.importKey(
      "raw",
      secretData,
      { name: "HKDF" },
      false,
      ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: webHash,
        salt: saltData,
        info: infoData,
      },
      key,
      length * 8,
    );

    const bytes = new Uint8Array(bits);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
