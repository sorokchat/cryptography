import { runKeyGenerationTests } from "../../../../common";
import { AesRandomKeyGenerationService } from "./aes-key-generation.service";

runKeyGenerationTests(
  "Browser",
  (bytesCount) => new AesRandomKeyGenerationService(bytesCount),
);
