import { runKeyGenerationTests } from "../../../../common";
import { AesRandomKeyGenerationService } from "./aes-random-key-generation.service";

runKeyGenerationTests(
  "Server",
  (bytesCount) => new AesRandomKeyGenerationService(bytesCount),
);
