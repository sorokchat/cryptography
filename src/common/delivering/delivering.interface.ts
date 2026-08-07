import { DeliveringKeys } from "./delivering.keys";

export interface IDeliveringService {
  generateKeys(seed?: string): Promise<DeliveringKeys>;
  computeSharedSecret(
    privateKey: string,
    otherPublicKey: string,
  ): Promise<string>;
}
