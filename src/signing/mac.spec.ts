import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { ISigningService } from "./signing.interface";
import { MacService } from "./mac.service";
import { IEncryptionServie } from "../encryption";
import { IHashingService } from "../hasing";

describe("MAC Signing", () => {
  let service: ISigningService;
  const plaintext: string = "text";
  const password: string = "password";
  const encrypted: string = `${plaintext}:${password}`;
  const sign: string = `${encrypted}:hashed`;
  beforeEach(() => {
    service = new MacService(
      {
        encrypt: jest.fn().mockImplementation(async (plaintext, key) => {
          return `${plaintext}:${key}`;
        }),

        decrypt: jest.fn().mockImplementation(async (encrypted, key) => {
          return `${encrypted}:${key}`;
        }),
      } as jest.Mocked<IEncryptionServie>,
      {
        hash: jest.fn().mockImplementation(async (plaintext) => {
          return `${plaintext}:hashed`;
        }),
      } as jest.Mocked<IHashingService>,
    );
  });

  it("should correctly sign", async () => {
    const result = await service.sign(plaintext, password);
    expect(result).toBe(sign);
  });

  it("should truthy verify sign", async () => {
    const verified = await service.verify(sign, encrypted);
    expect(verified).toBeTruthy();
  });

  it("should falsy verify sign", async () => {
    const verified = await service.verify("test", "example");
    expect(verified).toBeFalsy();
  });
});
