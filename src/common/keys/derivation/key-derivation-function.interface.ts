import { KeyDerivationParameters } from "./key-derivation-parameters.interface";

export interface KeyDerivationFunction {
  deriveKey(parameters: KeyDerivationParameters): Promise<string>;
}
