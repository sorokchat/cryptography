import { type IEncryptionOptions } from "./encryption-options.interface";

export interface IEncryptionServie {
  encrypt(
    plaintext: string,
    key: string,
    options: IEncryptionOptions,
  ): Promise<string>;
  decrypt(
    encrypted: string,
    key: string,
    options: IEncryptionOptions,
  ): Promise<string>;
}
