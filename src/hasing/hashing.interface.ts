export interface IHashingService {
  hash(plaintext: string): Promise<string>;
}
