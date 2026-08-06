import { runHashingTests } from "../../common";
import { Sha256Service } from "./sha256.service";
runHashingTests("Browser", () => new Sha256Service());
