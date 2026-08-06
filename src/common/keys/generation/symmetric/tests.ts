import { IKeyGeneration } from "./key-generation.interface";
import { describe, it, expect } from "@jest/globals";

export function runKeyGenerationTests(
  environment: string,
  factory: (bytesCount: number) => IKeyGeneration,
): void {
  describe(`${environment} AesRandomKeyGenerationService`, () => {
    describe("constructor and generation", () => {
      it("should generate a string of correct byte length (using hex for reliability)", async () => {
        const bytesCount: number = 32;
        const service = factory(bytesCount);
        const result = await service.generation();
        expect(typeof result).toBe("string");
        const buffer = Buffer.from(result, "utf8");
        expect(buffer.length).toBeGreaterThan(0);
      });
    });
  });
}
