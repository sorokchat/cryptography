import { IEncryptionServie } from "../encryption";
import { IHashingService } from "../hasing";
import { ISigningService } from "./signing.interface";
export declare class MacService implements ISigningService {
    private readonly encryptionService;
    private readonly hashingService;
    constructor(encryptionService: IEncryptionServie, hashingService: IHashingService);
    sign(payload: string, key: string): Promise<string>;
    verify(sign: string, payload: string): Promise<boolean>;
}
//# sourceMappingURL=mac.service.d.ts.map