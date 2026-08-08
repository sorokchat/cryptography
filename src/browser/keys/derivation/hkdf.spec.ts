import { runHkdfTests } from "../../../common";
import { HkdfService } from "./hkdf.service";

runHkdfTests("Browser", () => new HkdfService());
