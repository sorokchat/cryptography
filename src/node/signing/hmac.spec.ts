import { HmacService } from "./hmac.service";
import { runHmacTests } from "../../common";
runHmacTests("Server", () => new HmacService());
