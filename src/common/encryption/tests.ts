import { beforeEach, describe, expect, it } from "@jest/globals";
import { type IEncryptionServie } from ".";

export function runEncryptionTests(
  environment: string,
  factory: () => IEncryptionServie,
): void {
  describe(`${environment} AES encrypting/decrypting`, () => {
    let service: IEncryptionServie;
    const plaintext: string = "Hello, world";
    const password: string = "mySecretPassword";

    beforeEach(() => {
      service = factory();
    });

    it("should encrypt correctly with correct password", async () => {
      const encrypted = await service.encrypt(plaintext, password);
      // Дозволяємо IV довжиною 24 (12 байт) або 32 (16 байт)
      expect(encrypted).toMatch(/^[0-9a-f]{32}:[0-9a-f]{24,32}:[0-9a-f]+$/);
    });

    it("should decrypt correctly with correct password", async () => {
      // Генеруємо шифротекст за допомогою того ж сервісу
      const encrypted = await service.encrypt(plaintext, password);
      const decrypted = await service.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });
  });
}
