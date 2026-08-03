export interface ISigningService {
  sign(payload: string, key: string): Promise<string>;
  verify(sign: string, encrypted: string): Promise<boolean>;
}
