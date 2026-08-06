import { runDeliveringTests } from "../../common";
import { EcdhService } from "./ecdh.service";

runDeliveringTests("Browser", () => new EcdhService());
