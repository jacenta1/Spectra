/**
 * 0G Network configuration and contract constants.
 * All chain interaction goes through these values.
 */

// 0G Chain (Newton Testnet) configuration
export const ZERO_G_CHAIN = {
  id: 16600,
  name: "0G Newton Testnet",
  rpcUrl: process.env.NEXT_PUBLIC_0G_RPC_URL || "https://evmrpc-testnet.0g.ai",
  explorerUrl: "https://chainscan.0g.ai",
  nativeCurrency: {
    name: "A0GI",
    symbol: "A0GI",
    decimals: 18,
  },
} as const;

// 0G Mainnet configuration
export const ZERO_G_MAINNET = {
  id: 56600, 
  name: "0G Mainnet",
  rpcUrl: process.env.NEXT_PUBLIC_0G_MAINNET_RPC_URL || "https://evmrpc.0g.ai",
  explorerUrl: "https://chainscan.0g.ai",
  nativeCurrency: {
    name: "A0GI",
    symbol: "A0GI",
    decimals: 18,
  },
} as const;

// Use testnet by default, switch to mainnet when ready
export const ACTIVE_CHAIN = process.env.NEXT_PUBLIC_USE_MAINNET === "true" 
  ? ZERO_G_MAINNET 
  : ZERO_G_CHAIN;

// 0G Compute Router API
export const ZERO_G_COMPUTE = {
  routerUrl: process.env.NEXT_PUBLIC_0G_COMPUTE_ROUTER_URL || "https://router.0g.ai",
  apiKey: process.env.ZERO_G_COMPUTE_API_KEY || "",
} as const;

// 0G Storage configuration
export const ZERO_G_STORAGE = {
  indexerUrl: process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
} as const;

// Known Agentic ID contract addresses
export const AGENTIC_ID_CONTRACTS = {
  registry: process.env.NEXT_PUBLIC_AGENTIC_ID_REGISTRY || "0x0000000000000000000000000000000000000000",
} as const;

export const ZERO_G_CONFIG = {
  chainId: ACTIVE_CHAIN.id,
  chainName: ACTIVE_CHAIN.name,
  rpcUrl: ACTIVE_CHAIN.rpcUrl,
  explorerUrl: ACTIVE_CHAIN.explorerUrl,
  computeRouterUrl: ZERO_G_COMPUTE.routerUrl,
  storageIndexerUrl: ZERO_G_STORAGE.indexerUrl,
  agenticIdRegistry: AGENTIC_ID_CONTRACTS.registry,
} as const;

// ERC-7857 (Agentic ID) ABI - minimal interface for reading agent data
export const AGENTIC_ID_ABI = [
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
  {
    type: "function",
    name: "ownerOf",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;

// Block scanning configuration
export const SCAN_CONFIG = {
  blockRange: 5000n,
  initialLookback: 50000n,
  pollInterval: 12000,
} as const;
