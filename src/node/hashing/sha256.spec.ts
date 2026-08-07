import { runSha256Tests } from "../../common";
import { Sha256Service } from "./sha256.service.ts";

runSha256Tests("Server", () => new Sha256Service());
