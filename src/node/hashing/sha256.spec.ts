import { Sha256Service } from "./sha256.service";
import { type IHashingService } from "../../common";
import { describe, it, beforeEach, expect } from "@jest/globals";

describe("Server SHA256", () => {
  let instance: IHashingService;
  beforeEach(() => {
    instance = new Sha256Service();
  });
  it("Hash by SHA 256 should be correct", async () => {
    const input: string = "hello";
    const expected: string =
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
    const result: string = await instance.hash(input);
    expect(result).toBe(expected);
  });
});
