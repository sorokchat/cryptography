import { KeyDerivationFunction, KeyDerivationParameters } from ".";
import crypto from "node:crypto";

export class HkdfService implements KeyDerivationFunction {
  private readonly defaultHash: string = "sha256";

  public async deriveKey(parameters: KeyDerivationParameters): Promise<string> {
    const { secret, salt, info, length, hash = this.defaultHash } = parameters;
    const secretBuffer = Buffer.from(secret);
    const saltBuffer = salt !== undefined ? Buffer.from(salt) : Buffer.alloc(0);
    const infoBuffer = info !== undefined ? Buffer.from(info) : Buffer.alloc(0);
    const resultBuffer = crypto.hkdfSync(
      hash,
      secretBuffer,
      saltBuffer,
      infoBuffer,
      length,
    );
    return Buffer.from(resultBuffer).toString("hex");
  }
}
