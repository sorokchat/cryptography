export class MacService {
    encryptionService;
    hashingService;
    constructor(encryptionService, hashingService) {
        this.encryptionService = encryptionService;
        this.hashingService = hashingService;
    }
    async sign(payload, key) {
        const encrypted = await this.encryptionService.encrypt(payload, key);
        return await this.hashingService.hash(encrypted);
    }
    async verify(sign, payload) {
        const hashed = await this.hashingService.hash(payload);
        return sign === hashed;
    }
}
//# sourceMappingURL=mac.service.js.map