import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { type IEncryptionOptions, type IEncryptionServie } from ".";
import nodeCrypto from "node:crypto";

export function runAesTests(
  environment: string,
  factory: () => IEncryptionServie,
): void {
  describe(`${environment} AES encrypting/decrypting`, () => {
    let service: IEncryptionServie;
    const plaintext: string = "Hello, world";
    const password: string = "my secret key";
    const encrypted: string = "93e3cb96913b287944f800e902543d2a";
    const options: IEncryptionOptions = {
      iv: "9dae0242a8da11c5c478fe2f7544423e",
      salt: "73616c74",
    };

    beforeEach(() => {
      service = factory();
      jest.clearAllMocks();
    });

    it("should encrypt correctly with correct password", async () => {
      const result = await service.encrypt(plaintext, password, options);
      expect(result).toBe(encrypted);
    });

    it("should decrypt correctly with correct password", async () => {
      const result = await service.decrypt(encrypted, password, options);
      expect(result).toBe(plaintext);
    });

    it("should throw error, salf or password incorrect", async () => {
      const password: string = "somepassword";
      const saltText: string = "643";
      const fakeError = new Error("Помилка PBKDF2");
      jest
        .spyOn(nodeCrypto, "pbkdf2")
        .mockImplementation(
          (_password, _salt, _iterations, _keyLength, _digest, callback) => {
            callback(fakeError, Buffer.from(""));
          },
        );
      expect(
        service.encrypt(plaintext, password, {
          iv: options.iv,
          salt: saltText,
        }),
      ).rejects.toThrow();
    });
  });
}
