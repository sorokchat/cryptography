export interface IKeyGeneration {
  generation(seed?: string): Promise<string>;
}
