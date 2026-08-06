export interface KeyDerivationParameters {
  secret: string;
  salt?: string;
  info?: string;
  length: number;
  hash?: string;
}
