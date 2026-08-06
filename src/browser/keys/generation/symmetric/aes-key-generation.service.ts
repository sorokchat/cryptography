import { type IKeyGeneration } from "../../../../common";

export class AesRandomKeyGenerationService implements IKeyGeneration {
  constructor(private readonly bytesCount: number) {}

  public async generation(_seed?: string): Promise<string> {
    const bytes = new Uint8Array(this.bytesCount);
    crypto.getRandomValues(bytes);
    const decoder = new TextDecoder("utf-8", { fatal: false });
    return decoder.decode(bytes);
  }
}
