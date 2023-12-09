export interface AddUserStakesType {
  address: string;
  assets: string;
  stakeBatchId: number;
  protocol: string;
  network: string;
  shares?: number;
  status?: string;
}
