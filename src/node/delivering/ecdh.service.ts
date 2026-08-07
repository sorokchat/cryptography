import crypto from "node:crypto";
import {
  type IDeliveringService,
  type DeliveringKeys,
  type IHashingService,
} from "../../common";

export class EcdhService implements IDeliveringService {
  private static readonly CURVE: string = "prime256v1";

  constructor(private readonly hashing: IHashingService) {}

  public async generateKeys(seed?: string): Promise<DeliveringKeys> {
    const ecdh = crypto.createECDH(EcdhService.CURVE);
    if (seed) {
      const hash = await this.hashing.hash(seed);
      const number = BigInt(
        "0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
      );
      const privateKeyBigInt = BigInt("0x" + hash) % number;
      const privateKeyHex = privateKeyBigInt.toString(16).padStart(64, "0");
      ecdh.setPrivateKey(privateKeyHex, "hex");
    } else {
      ecdh.generateKeys();
    }
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
