"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { arbitrumGoerli, scrollSepolia, polygonMumbai } from '@wagmi/core/chains'
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";


const {chains, publicClient, webSocketPublicClient } = configureChains(
  [scrollSepolia, polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://sepolia-rpc.scroll.io/`,
      }),
    }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI! }),
  ]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Substake",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

const ConnectKitWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};

export default ConnectKitWrapper;
