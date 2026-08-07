import { describe, it, beforeEach, expect } from "@jest/globals";
import { type IDeliveringService } from "../../common";

export function runEcdhTests(
  enviornment: string,
  factory: () => IDeliveringService,
): void {
  describe(`${enviornment} ECDH`, () => {
    let instance: IDeliveringService;
    const seed: string = "fixed-seed";
    const privateRegexp: RegExp = /^[0-9a-f]{64}$/i;
    const publicRegexp: RegExp = /^[0-9a-f]{130}$/i;
    const sharedRegexp: RegExp = /^[0-9a-f]{64}$/i;

    beforeEach(() => {
      instance = factory();
    });

    describe("Seed-based", () => {
      it("should generate identical keys for the same seed", async () => {
        const keys1 = await instance.generateKeys(seed);
        const keys2 = await instance.generateKeys(seed);
        expect(keys1.privateKey).toBe(keys2.privateKey);
        expect(keys1.publicKey).toBe(keys2.publicKey);
      });

      it("should generate keys by different seeds", async () => {
        const keys1 = await instance.generateKeys("seed-alpha");
        const keys2 = await instance.generateKeys("seed-beta");
        expect(keys1.privateKey).not.toBe(keys2.privateKey);
        expect(keys1.publicKey).not.toBe(keys2.publicKey);
      });

      it("should compute the same shared secret from deterministic keys", async () => {
        const seedA = "alice-secret";
        const seedB = "bob-secret";
        const keysA = await instance.generateKeys(seedA);
        const keysB = await instance.generateKeys(seedB);
        const secretA = await instance.computeSharedSecret(
          keysA.privateKey,
          keysB.publicKey,
        );
        const secretB = await instance.computeSharedSecret(
          keysB.privateKey,
          keysA.publicKey,
        );
        expect(secretA).toBe(secretB);
        expect(secretA).toMatch(sharedRegexp);
      });
      it("should be reproducible across multiple calls", async () => {
        const seed = "reproducible";
        const keys1 = await instance.generateKeys(seed);
        const keys2 = await instance.generateKeys(seed);
        const keys3 = await instance.generateKeys(seed);
        expect(keys1.privateKey).toBe(keys2.privateKey);
        expect(keys2.privateKey).toBe(keys3.privateKey);
        expect(keys1.publicKey).toBe(keys2.publicKey);
        expect(keys2.publicKey).toBe(keys3.publicKey);
      });
    });

    describe(`Random-based`, () => {
      let instance: IDeliveringService;

      beforeEach(() => {
        instance = factory();
      });

      it("should generate keys in correct hex format (без seed)", async () => {
        const keys = await instance.generateKeys();
        expect(keys.privateKey).toMatch(privateRegexp);
        expect(keys.publicKey).toMatch(publicRegexp);
      });

      it("should generate different keys on each call (без seed)", async () => {
        const keys1 = await instance.generateKeys();
        const keys2 = await instance.generateKeys();
        expect(keys1.privateKey).not.toBe(keys2.privateKey);
        expect(keys1.publicKey).not.toBe(keys2.publicKey);
      });

      it("should compute the same shared secret from random keys", async () => {
        const keysA = await instance.generateKeys();
        const keysB = await instance.generateKeys();
        const secretA = await instance.computeSharedSecret(
          keysA.privateKey,
          keysB.publicKey,
        );
        const secretB = await instance.computeSharedSecret(
          keysB.privateKey,
          keysA.publicKey,
        );
        expect(secretA).toBe(secretB);
        expect(secretA).toMatch(sharedRegexp);
      });

      it("should produce different shared secrets for different key pairs", async () => {
        const keysA1 = await instance.generateKeys();
        const keysA2 = await instance.generateKeys();
        const keysB = await instance.generateKeys();
        const secret1 = await instance.computeSharedSecret(
          keysA1.privateKey,
          keysB.publicKey,
        );
        const secret2 = await instance.computeSharedSecret(
          keysA2.privateKey,
          keysB.publicKey,
        );
        expect(secret1).not.toBe(secret2);
      });

      it("should throw error when private key is incorrect (без seed)", async () => {
        const keys = await instance.generateKeys();
        const error = "Приватний ключ має бути 32 байтовим hex-рядком";
        await expect(
          instance.computeSharedSecret("invalid", keys.publicKey),
        ).rejects.toThrow(error);
        await expect(
          instance.computeSharedSecret("a".repeat(63), keys.publicKey),
        ).rejects.toThrow(error);
      });

      it("should throw error when public key is incorrect (без seed)", async () => {
        const keys = await instance.generateKeys();
        const error = "Публічний ключ має бути 65 байтовим hex-рядком";
        await expect(
          instance.computeSharedSecret(keys.privateKey, "invalid"),
        ).rejects.toThrow(error);
      });
    });
  });
}
