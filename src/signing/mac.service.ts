import { IEncryptionServie } from "../encryption";
import { IHashingService } from "../hasing";
import { ISigningService } from "./signing.interface";

export class MacService implements ISigningService {
  constructor(
    private readonly encryptionService: IEncryptionServie,
    private readonly hashingService: IHashingService,
  ) { }

  public async sign(payload: string, key: string): Promise<string> {
    const encrypted = await this.encryptionService.encrypt(payload, key);
    return await this.hashingService.hash(encrypted);
  }

  public async verify(sign: string, payload: string): Promise<boolean> {
    const hashed = await this.hashingService.hash(payload);
    return sign === hashed;
  }
}
