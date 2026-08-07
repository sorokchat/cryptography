import { runSigningTests } from "../../common";
import { HmacService } from "./hmac.service";
runSigningTests("Browser", () => new HmacService());
