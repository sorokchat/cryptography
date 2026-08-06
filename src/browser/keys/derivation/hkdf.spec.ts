import { runDerivationTests } from "../../../common";
import { HkdfService } from "./hkdf.service";

runDerivationTests("Browser", () => new HkdfService());
