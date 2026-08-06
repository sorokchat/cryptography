import { type IEncryptionServie } from "../../../common";
import { AesService } from "./aes.service";
import { describe, beforeEach, beforeAll, it, expect } from "@jest/globals";

describe("(Browser - Web Crypto) AesService", () => {
  let service: IEncryptionServie;

  beforeAll(() => {
    if (typeof crypto === "undefined" || !crypto.subtle) {
      throw new Error(
        "Web Crypto API not available. Please run tests with jsdom + @peculiar/webcrypto.",
      );
    }
  });

  beforeEach(() => {
    service = new AesService();
  });

  describe("Basic encryption/decryption", () => {
    it("should encrypt and decrypt a simple text with correct password", async () => {
      const plaintext = "Hello, world!";
      const password = "mySecretPassword";
      const encrypted = await service.encrypt(plaintext, password);
      expect(encrypted).toMatch(/^[0-9a-f]{32}:[0-9a-f]{24}:[0-9a-f]+$/);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });

    it("should handle empty string", async () => {
      const plaintext = "";
      const password = "pass";
      const encrypted = await service.encrypt(plaintext, password);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe("");
    });

    it("should handle long text and special characters (emoji, cyrillic, etc.)", async () => {
      const plaintext = "🚀 Привіт, 世界! ümläuts and a very long text ".repeat(
        10,
      );
      const password = "p@ssw0rd!";
      const encrypted = await service.encrypt(plaintext, password);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe("Different passwords", () => {
    it("should produce different ciphertexts for different passwords", async () => {
      const plaintext = "test";
      const pass1 = "password1";
      const pass2 = "password2";
      const enc1 = await service.encrypt(plaintext, pass1);
      const enc2 = await service.encrypt(plaintext, pass2);
      expect(enc1).not.toBe(enc2);
      const dec1 = await service.decrypt(enc1, pass1);
      expect(dec1).toBe(plaintext);
      await expect(service.decrypt(enc1, pass2)).rejects.toThrow();
    });
  });
  describe("Output format", () => {
    it("should return string with three parts separated by colon", async () => {
      const result = await service.encrypt("test", "pass");
      const parts = result.split(":");
      expect(parts).toHaveLength(3);
      expect(parts[0]).toHaveLength(32);
      expect(parts[1]).toHaveLength(24);
      expect(parts[2].length % 2).toBe(0);
    });
  });

  describe("Randomness", () => {
    it("should produce different ciphertexts for same plaintext and password (due to random salt and IV)", async () => {
      const plaintext = "same text";
      const password = "same pass";
      const enc1 = await service.encrypt(plaintext, password);
      const enc2 = await service.encrypt(plaintext, password);
      expect(enc1).not.toBe(enc2);
      const dec1 = await service.decrypt(enc1, password);
      const dec2 = await service.decrypt(enc2, password);
      expect(dec1).toBe(plaintext);
      expect(dec2).toBe(plaintext);
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid encrypted format (not enough parts)", async () => {
      const invalid = "invalid";
      await expect(service.decrypt(invalid, "pass")).rejects.toThrow(
        "Невірний формат зашифрованих даних",
      );
    });

    it("should throw error for invalid encrypted format (too many parts)", async () => {
      const invalid = "a:b:c:d";
      await expect(service.decrypt(invalid, "pass")).rejects.toThrow(
        "Невірний формат зашифрованих даних",
      );
    });

    it("should throw error for malformed hex in encrypted parts", async () => {
      const invalid = "nothex:123456789012345678901234:abcdef";
      await expect(service.decrypt(invalid, "pass")).rejects.toThrow(
        "Hex-рядок повинен містити лише шістнадцяткові символи",
      );
    });
    it("should throw error when using wrong password (authentication failure)", async () => {
      const plaintext = "secret";
      const correctPass = "correct";
      const wrongPass = "wrong";
      const encrypted = await service.encrypt(plaintext, correctPass);
      await expect(service.decrypt(encrypted, wrongPass)).rejects.toThrow();
    });

    it("should throw error when ciphertext is tampered", async () => {
      const plaintext = "secret";
      const password = "pass";
      const encrypted = await service.encrypt(plaintext, password);

      const parts = encrypted.split(":");
      const tampered = parts[2].slice(0, -2) + "00";
      const tamperedEncrypted = `${parts[0]}:${parts[1]}:${tampered}`;
      await expect(
        service.decrypt(tamperedEncrypted, password),
      ).rejects.toThrow();
    });
  });

  describe("Performance", () => {
    it("should encrypt and decrypt 10 times within reasonable time", async () => {
      const text = "performance test";
      const pass = "perf";
      const start = Date.now();
      for (let i = 0; i < 10; i++) {
        const enc = await service.encrypt(text, pass);
        await service.decrypt(enc, pass);
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // 5 секунд для 10 ітерацій
    });
  });

  describe("Password variations", () => {
    it("should work with very long password", async () => {
      const plaintext = "test";
      const password = "a".repeat(1000);
      const encrypted = await service.encrypt(plaintext, password);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });

    it("should work with short password", async () => {
      const plaintext = "test";
      const password = "1";
      const encrypted = await service.encrypt(plaintext, password);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });

    it("should work with password containing special characters", async () => {
      const plaintext = "test";
      const password = "p@$$w0rd!?";
      const encrypted = await service.encrypt(plaintext, password);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });
  });
});
