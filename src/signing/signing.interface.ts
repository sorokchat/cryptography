export interface ISigningService {
  sign(payload: string, key: string): Promise<string>;
  verify(signature: string, payload: string, key: string): Promise<boolean>;
}
