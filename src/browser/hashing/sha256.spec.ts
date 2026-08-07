import { runSha256Tests } from "../../common";
import { Sha256Service } from "./sha256.service";
runSha256Tests("Browser", () => new Sha256Service());
