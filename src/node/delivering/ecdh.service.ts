import crypto from "node:crypto";
import { type IDeliveringService, type DeliveringKeys } from "../../common";

export class EcdhService implements IDeliveringService {
  private static readonly CURVE: string = "prime256v1";

  public async generateKeys(): Promise<DeliveringKeys> {
    const ecdh = crypto.createECDH(EcdhService.CURVE);
    ecdh.generateKeys();
    const publicKey = ecdh.getPublicKey("hex");
    const privateKey = ecdh.getPrivateKey("hex");
    return {
      privateKey,
      publicKey,
    };
  }

  public async computeSharedSecret(
    privateKey: string,
    otherPublicKey: string,
  ): Promise<string> {
    if (!/^[0-9a-f]{64}$/i.test(privateKey)) {
      throw new Error("Приватний ключ має бути 32 байтовим hex-рядком");
    }
    if (!/^[0-9a-f]{130}$/i.test(otherPublicKey)) {
      throw new Error("Публічний ключ має бути 65 байтовим hex-рядком");
    }
    const ecdh = crypto.createECDH(EcdhService.CURVE);
    const publicKey = Buffer.from(otherPublicKey, "hex");
    ecdh.setPrivateKey(privateKey, "hex");
    return ecdh.computeSecret(publicKey).toString("hex");
  }
}
