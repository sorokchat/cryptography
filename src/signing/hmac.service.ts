import { ISigningService } from "./signing.interface";
import { createHmac, timingSafeEqual } from "node:crypto";

export class HmacService implements ISigningService {
  private readonly algorithm: string;

  constructor(algorithm: string = "sha256") {
    this.algorithm = algorithm;
  }

  public async sign(payload: string, key: string): Promise<string> {
    return createHmac(this.algorithm, key)
      .update(payload, "utf8")
      .digest("hex");
  }

  public async verify(
    signature: string,
    payload: string,
    key: string,
  ): Promise<boolean> {
    try {
      const expected = await this.sign(payload, key);
      return timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expected, "hex"),
      );
    } catch {
      return false;
    }
  }
}
