import { Sha256Service } from "./sha256.service";
import { IHashingService } from "./hashing.interface";
import { describe, beforeEach, it, expect } from "@jest/globals";

describe("SHA 256", () => {
  let instance: IHashingService;
  beforeEach(() => {
    instance = new Sha256Service();
  });
  it("Hash by SHA 256 should be correct", async () => {
    const input: string = "hello";
    const output: string = "";
    const result: string = await instance.hash(input);
    expect(result).toBe(output);
  });
});
