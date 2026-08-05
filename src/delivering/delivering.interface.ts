import { DeliveringKeys } from "./delivering.keys";

export interface IDeliveringService {
  generateKeys(): Promise<DeliveringKeys>;
  computeSharedSecret(
    privateKey: string,
    otherPublicKey: string,
  ): Promise<string>;
}
