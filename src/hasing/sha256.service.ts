import { IHashingService } from "./hashing.interface";
import crypto from "node:crypto";

export class Sha256Service implements IHashingService {
  public async hash(plaintext: string): Promise<string> {
    return crypto.hash("sha256", plaintext, { outputEncoding: "hex" });
  }
}
