import { runEncryptionTests } from "../../../common";
import { AesService } from "./aes.service";

runEncryptionTests("Browser", () => new AesService());
