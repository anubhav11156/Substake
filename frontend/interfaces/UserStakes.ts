export interface AddUserStakesType {
  address: string;
  assets: string;
  stakeBatchId: number;
  protocol: string;
  network: string;
  shares?: number;
  status?: string;
}
export interface AddUserUntakesType {
  address: string;
  assetsExpected: number;
  assetsFinalized: number;
  unstakeBatchId: number;
  protocol: string;
  network: string;
  shares: string;
  status?: string;
}
