import { HkdfService } from "./hkdf.service";
import { runHkdfTests } from "../../../common";

runHkdfTests("Server", () => new HkdfService());
