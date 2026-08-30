"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ZERO_G_MAINNET, ZERO_G_CHAIN } from "@/lib/zero-g/constants";

export type NetworkType = "mainnet" | "testnet";

export interface NetworkContextType {
  network: NetworkType;
  isMainnet: boolean;
  setNetwork: (network: NetworkType) => void;
  toggleNetwork: () => void;
  activeChain: typeof ZERO_G_MAINNET | typeof ZERO_G_CHAIN;
  getExplorerTxUrl: (txHash: string) => string;
  getExplorerAddressUrl: (address: string) => string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  // Default to Mainnet as requested
  const [network, setNetworkState] = useState<NetworkType>("mainnet");

  useEffect(() => {
    const saved = localStorage.getItem("spectra_network") as NetworkType | null;
    if (saved === "mainnet" || saved === "testnet") {
      setNetworkState(saved);
    }
  }, []);

  const setNetwork = (net: NetworkType) => {
    setNetworkState(net);
    localStorage.setItem("spectra_network", net);
  };

  const toggleNetwork = () => {
    const next = network === "mainnet" ? "testnet" : "mainnet";
    setNetwork(next);
  };

  const isMainnet = network === "mainnet";
  const activeChain = isMainnet ? ZERO_G_MAINNET : ZERO_G_CHAIN;

  const getExplorerTxUrl = (txHash: string) => {
    const base = isMainnet ? ZERO_G_MAINNET.explorerUrl : ZERO_G_CHAIN.explorerUrl;
    return `${base}/tx/${txHash}`;
  };

  const getExplorerAddressUrl = (address: string) => {
    const base = isMainnet ? ZERO_G_MAINNET.explorerUrl : ZERO_G_CHAIN.explorerUrl;
    return `${base}/address/${address}`;
  };

  return (
    <NetworkContext.Provider
      value={{
        network,
        isMainnet,
        setNetwork,
        toggleNetwork,
        activeChain,
        getExplorerTxUrl,
        getExplorerAddressUrl,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextType {
  const context = useContext(NetworkContext);
  if (!context) {
    // Fallback for non-context usages
    return {
      network: "mainnet",
      isMainnet: true,
      setNetwork: () => {},
      toggleNetwork: () => {},
      activeChain: ZERO_G_MAINNET,
      getExplorerTxUrl: (txHash: string) => `https://chainscan.0g.ai/tx/${txHash}`,
      getExplorerAddressUrl: (address: string) => `https://chainscan.0g.ai/address/${address}`,
    };
  }
  return context;
}
