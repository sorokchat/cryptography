import { ec as EC } from "elliptic";
import {
  type IDeliveringService,
  type DeliveringKeys,
  type IHashingService,
} from "../../common";

export class EcdhService implements IDeliveringService {
  private static readonly CURVE = "p256";

  constructor(private readonly hashing: IHashingService) {}

  public async generateKeys(seed?: string): Promise<DeliveringKeys> {
    const ec = new EC(EcdhService.CURVE);
    let keyPair: EC.KeyPair;
    if (seed) {
      const hash = await this.hashing.hash(seed);
      const bigNumber = BigInt("0x" + ec.curve.n.toString(16));
      const privateKey = BigInt("0x" + hash) % bigNumber;
      const privateHex = privateKey.toString(16).padStart(64, "0");
      keyPair = ec.keyFromPrivate(privateHex, "hex");
    } else {
      keyPair = ec.genKeyPair();
    }
    return {
      privateKey: keyPair.getPrivate("hex").padStart(64, "0"),
      publicKey: keyPair.getPublic(false, "hex").padStart(130, "0"),
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
    return shared.toString("hex").padStart(64, "0");
  }
}
