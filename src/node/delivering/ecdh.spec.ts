import { describe, it, beforeEach, expect } from "@jest/globals";
import { IDeliveringService } from "../../common";
import { EcdhService } from "./ecdh.service";

describe("Server ECDH", () => {
  let instance: IDeliveringService;

  beforeEach(() => {
    instance = new EcdhService();
  });

  it("generateKeys should return private and public keys in hex format", async () => {
    const keys = await instance.generateKeys();
    expect(keys).toHaveProperty("privateKey");
    expect(keys).toHaveProperty("publicKey");
    expect(keys.privateKey).toMatch(/^[0-9a-f]{64}$/i);
    expect(keys.publicKey).toMatch(/^[0-9a-f]{130}$/i);
  });

  it("computeSharedSecret should return equels shared secret", async () => {
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
    expect(secretA).toMatch(/^[0-9a-f]{64}$/i);
  });

  it("computeSharedSecret returns differend shared secret when differend keys", async () => {
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

  it("computeSharedSecret throw error when private key incorrect", async () => {
    const keys = await instance.generateKeys();
    const error: string = "Приватний ключ має бути 32 байтовим hex-рядком";
    const invalidPrivate = "invalid";
    await expect(
      instance.computeSharedSecret(invalidPrivate, keys.publicKey),
    ).rejects.toThrow(error);
    const toShort: string = "a".repeat(63);
    await expect(
      instance.computeSharedSecret(toShort, keys.publicKey),
    ).rejects.toThrow(error);
  });

  it("computeSharedSecret throw error when public key incorrect", async () => {
    const keys = await instance.generateKeys();
    const error: string = "Публічний ключ має бути 65 байтовим hex-рядком";
    const invalidPublic = "nothex";
    await expect(
      instance.computeSharedSecret(keys.privateKey, invalidPublic),
    ).rejects.toThrow(error);
  });
});
