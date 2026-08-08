import { runHmacTests } from "../../common";
import { HmacService } from "./hmac.service";
runHmacTests("Browser", () => new HmacService());
