import { runEcdhTests } from "../../common";
import { EcdhService } from "./ecdh.service";

runEcdhTests("Server", () => new EcdhService());
