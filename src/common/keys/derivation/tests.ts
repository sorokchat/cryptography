import { describe, it, beforeEach, expect } from "@jest/globals";
import {
  type KeyDerivationFunction,
  type KeyDerivationParameters,
} from "../../../common";

export function runDerivationTests(
  enviornment: string,
  factorty: () => KeyDerivationFunction,
): void {
  describe(`${enviornment} HKDF Tests`, () => {
    let instance: KeyDerivationFunction;

    beforeEach(() => {
      instance = factorty();
    });

    it("should derive a key of correct length (hex)", async () => {
      const length: number = 32;
      const parameters: KeyDerivationParameters = {
        secret: "my-secret",
        salt: "salt",
        info: "info",
        length,
      };
      const result = await instance.deriveKey(parameters);
      expect(result).toHaveLength(length * 2);
      expect(result).toMatch(/^[0-9a-f]+$/i);
    });

    it("should derive a key of length 16 (32 hex chars)", async () => {
      const parameters: KeyDerivationParameters = {
        secret: "secret",
        salt: "salt",
        info: "info",
        length: 16,
      };
      const result = await instance.deriveKey(parameters);
      expect(result).toHaveLength(32);
    });

    it("should return empty string for length 0", async () => {
      const parameters: KeyDerivationParameters = {
        secret: "secret",
        salt: "salt",
        info: "info",
        length: 0,
      };
      expect(instance.deriveKey(parameters)).rejects.toThrow();
    });

    it("should be deterministic with same parameters", async () => {
      const parameters: KeyDerivationParameters = {
        secret: "secret",
        salt: "salt",
        info: "info",
        length: 32,
      };
      const first = await instance.deriveKey(parameters);
      const second = await instance.deriveKey(parameters);
      expect(first).toBe(second);
    });

    it("should produce different keys with different salt", async () => {
      const baseParameters: KeyDerivationParameters = {
        secret: "secret",
        info: "info",
        length: 32,
      };
      const first = await instance.deriveKey({
        ...baseParameters,
        salt: "salt1",
      });
      const second = await instance.deriveKey({
        ...baseParameters,
        salt: "salt2",
      });
      expect(first).not.toBe(second);
    });

    it("should produce different keys with different info", async () => {
      const baseParameters: KeyDerivationParameters = {
        secret: "secret",
        salt: "salt",
        length: 32,
      };
      const first = await instance.deriveKey({
        ...baseParameters,
        info: "info1",
      });
      const second = await instance.deriveKey({
        ...baseParameters,
        info: "info2",
      });
      expect(first).not.toBe(second);
    });

    it("should produce different keys with different secret", async () => {
      const baseParameters: Omit<KeyDerivationParameters, "secret"> = {
        salt: "salt",
        info: "info",
        length: 32,
      };
      const first = await instance.deriveKey({
        ...baseParameters,
        secret: "secret1",
      });
      const second = await instance.deriveKey({
        ...baseParameters,
        secret: "secret2",
      });
      expect(first).not.toBe(second);
    });

    it("should accept undefined salt and info (default to empty buffers)", async () => {
      const parameters: KeyDerivationParameters = {
        secret: "secret",
        length: 32,
      };
      const result = await instance.deriveKey(parameters);
      expect(result).toBeDefined();
      expect(result).toHaveLength(64);
    });
  });
}
