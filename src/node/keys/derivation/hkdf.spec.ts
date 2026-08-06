import { HkdfService } from "./hkdf.service";
import { runDerivationTests } from "../../../common";

runDerivationTests("Server", () => new HkdfService());
