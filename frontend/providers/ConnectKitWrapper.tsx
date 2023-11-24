"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from "wagmi";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_PROJECT_ID!,

    // Required
    appName: "Substake",

    // Optional
    appDescription: "Substake",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

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
