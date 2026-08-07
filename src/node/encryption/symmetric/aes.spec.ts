import { runAesTests } from "../../../common";
import { AesService } from "./aes.service";

runAesTests("Server", () => new AesService());
