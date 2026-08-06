import { beforeEach, describe, expect, it } from "@jest/globals";
import { type IEncryptionServie } from "../../../common";
import { AesService } from "./aes.service";

describe("Server AES encrypting/decrypting", () => {
  let service: IEncryptionServie;
  const expectedPlaintext: string = "Hello, world";
  const password: string = "mySecretPassword";
  beforeEach(() => {
    service = new AesService();
  });

  it("should encrypt correctly with correct password", async () => {
    const encrypted = await service.encrypt(expectedPlaintext, password);
    expect(encrypted).toMatch(/^[0-9a-f]{32}:[0-9a-f]{32}:[0-9a-f]+$/);
  });

  it("should decrypt correctly with correct password", async () => {
    const encrypted: string =
      "f3475ca9b3f84abd04260264fc14b9b6:99383fe06608ac660d17f1a922f93fca:fe610b1fa00f3c9f65261d482b645c51";

    const decrypted = await service.decrypt(encrypted, password);
    expect(decrypted).toBe(expectedPlaintext);
  });
});
