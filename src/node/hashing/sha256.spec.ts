import { runHashingTests } from "../../common";
import { Sha256Service } from "./sha256.service.ts";

runHashingTests("Server", () => new Sha256Service());
