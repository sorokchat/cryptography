import { runEcdhTests } from "../../common";
import { EcdhService } from "./ecdh.service";

runEcdhTests("Browser", () => new EcdhService());
