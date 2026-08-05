import { beforeEach, describe, expect, it } from "@jest/globals";
import { ISigningService } from "./signing.interface";
import { HmacService } from "./hmac.service";

describe("HMAC Signing", () => {
  let service: ISigningService;
  const plaintext: string = "text";
  const password: string = "password";
  const signature: string = `c830a8f7e9f47b928fed4b5af159883fcc1290826a2701e00fcd02c69e3774bf`;
  beforeEach(() => {
    service = new HmacService();
  });

  it("should correctly sign", async () => {
    const result = await service.sign(plaintext, password);
    expect(result).toBe(signature);
  });

  it("should truthy verify sign", async () => {
    const verified = await service.verify(signature, plaintext, password);
    expect(verified).toBeTruthy();
  });

  it("should falsy verify sign", async () => {
    const verified = await service.verify("test", "example", "password");
    expect(verified).toBeFalsy();
  });
});
