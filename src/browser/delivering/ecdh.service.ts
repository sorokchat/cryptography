import { ec as EC } from "elliptic";
import { type IDeliveringService, type DeliveringKeys } from "../../common";

export class EcdhService implements IDeliveringService {
  private static readonly CURVE = "p256";

  public async generateKeys(): Promise<DeliveringKeys> {
    const ec = new EC(EcdhService.CURVE);
    const keyPair = ec.genKeyPair();
    return {
      privateKey: keyPair.getPrivate("hex"),
      publicKey: keyPair.getPublic(false, "hex"),
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
    const ec = new EC(EcdhService.CURVE);
    const keyPair = ec.keyFromPrivate(privateKey, "hex");
    const otherPub = ec.keyFromPublic(otherPublicKey, "hex");
    const shared = keyPair.derive(otherPub.getPublic());
    return shared.toString("hex");
  }
}
