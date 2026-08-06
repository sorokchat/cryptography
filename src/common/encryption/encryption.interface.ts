export interface IEncryptionServie {
  encrypt(plaintext: string, key: string): Promise<string>;
  decrypt(encrypted: string, key: string): Promise<string>;
}
