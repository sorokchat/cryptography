import { runEncryptionTests } from "../../../common";
import { AesService } from "./aes.service";

runEncryptionTests("Server", () => new AesService());
