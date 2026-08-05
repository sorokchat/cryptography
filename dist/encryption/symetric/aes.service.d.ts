import { IEncryptionServie } from "../encryption.interface";
export declare class AesService implements IEncryptionServie {
    private static readonly ALGORITHM;
    encrypt(plaintext: string, key: string): Promise<string>;
    decrypt(encrypted: string, key: string): Promise<string>;
    private createKeyFromPassword;
}
//# sourceMappingURL=aes.service.d.ts.map