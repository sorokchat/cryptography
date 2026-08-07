import { HmacService } from "./hmac.service";
import { runSigningTests } from "../../common";
runSigningTests("Server", () => new HmacService());
