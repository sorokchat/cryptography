import { runEcdhTests } from "../../common";
import { EcdhService } from "./ecdh.service";
import { Sha256Service } from "../hashing";

runEcdhTests("Server", () => new EcdhService(new Sha256Service()));
