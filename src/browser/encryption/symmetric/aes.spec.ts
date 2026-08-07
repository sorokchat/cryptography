import { runAesTests } from "../../../common";
import { AesService } from "./aes.service";

runAesTests("Browser", () => new AesService());
