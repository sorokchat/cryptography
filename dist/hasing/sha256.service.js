import crypto from "node:crypto";
export class Sha256Service {
    async hash(plaintext) {
        return crypto.hash("sha256", plaintext, { outputEncoding: "hex" });
    }
}
//# sourceMappingURL=sha256.service.js.map