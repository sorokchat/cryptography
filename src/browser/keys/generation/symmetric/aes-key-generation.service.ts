import { type IKeyGeneration } from "../../../../common";

export class AesRandomKeyGenerationService implements IKeyGeneration {
  constructor(private readonly bytesCount: number) {}

  public async generation(_seed?: string): Promise<string> {
    const bytes = new Uint8Array(this.bytesCount);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((buffer) => buffer.toString(16).padStart(2, "0"))
      .join("");
  }
}
