import { IKeyGeneration } from "./key-generation.interface";
import crypto from "node:crypto";

export class AesRandomKeyGenerationService implements IKeyGeneration {
  constructor(private readonly bytesCount: number) {}

  public async generation(_seed?: string): Promise<string> {
    return crypto.randomBytes(this.bytesCount).toString("utf8");
  }
}
