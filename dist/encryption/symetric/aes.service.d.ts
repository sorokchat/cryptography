import { IEncryptionServie } from "../encryption.interface";
export declare class AesService implements IEncryptionServie {
    private readonly ALGORITHM;
    private readonly IV_LENGTH;
    encrypt(plaintext: string, key: string): Promise<string>;
    decrypt(encrypted: string, key: string): Promise<string>;
}
//# sourceMappingURL=aes.service.d.ts.map