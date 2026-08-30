# Spectra | Agent Observability, Memory & Verification Layer for 0G

Spectra is the developer-first observability, decentralized memory inspection, and cryptographic verification platform built natively for autonomous AI agents on the **0G Network** (0G Chain, 0G Storage, 0G Compute, and ERC-7857 Agentic IDs).

```
 +---------------------------------------------------------------------------------------+
 |                                      SPECTRA UI                                       |
 |  [Dashboard]   [Agents]   [Activity]   [Verify]   [Swarms]   [Simulator]   [SDK Hub]  |
 +--------+----------+----------+------------+----------+------------+------------+------+
          |          |          |            |          |            |            |
          v          v          v            v          v            v            v
 +-----------------+ +--------------------+ +-------------------+ +--------------------+
 | 0G CHAIN (EVM)  | | 0G STORAGE         | | 0G COMPUTE        | | @spectra/sdk       |
 | - ERC-7857 IDs  | | - Memory Roots     | | - Router API      | | - Dynamic Snippets |
 | - Viem Indexer  | | - Merkle Proofs    | | - Anomaly Scanner | | - Python & TS      |
 | - SpectraVerifier| - Vector Context    | | - TEE Attestation | | - Proof Bundles    |
 +-----------------+ +--------------------+ +-------------------+ +--------------------+
```

---

## Complete Multi-Wave Capability Matrix

| Module | Core Functionality | 0G Infrastructure | Status |
|---|---|---|---|
| **Agent Discovery & Identity** | Auto-discovers ERC-7857 Agentic IDs on 0G Chain, parses owner wallets and metadata pointers. | 0G Chain (Newton Testnet & Mainnet) | Complete |
| **0G Storage Memory Inspector** | Tree viewer for short-term RAM contexts vs long-term decentralized memory blocks; validates Merkle inclusion proofs. | 0G Storage (Indexer API) | Complete |
| **Verifiable Execution Suite** | Interactive validator checking 0G Chain receipts, TEE enclave signatures, and 0G Storage roots (`/verify`). | 0G Chain + TEE Enclaves | Complete |
| **On-Chain Verifier Contract** | Gas-optimized Solidity contract for anchoring agent verification attestations permanently on 0G. | `contracts/SpectraVerifier.sol` | Complete |
| **AI Anomaly & Safety Scanner** | Real-time agent behavioral risk engine scoring reentrancy, capital leaks, and prompt injection. | 0G Compute Router | Complete |
| **Swarm Topology View** | Multi-agent coordination matrix, sub-agent hierarchies, and 0G DA message passing (`/swarms`). | 0G DA & Multi-Agent Swarms | Complete |
| **Agent Sandbox & Simulator** | Interactive live test harness for memory commits, compute inferences, and anomaly detection (`/playground`). | 0G Chain, Storage & Compute | Complete |
| **Developer SDK & Proof Exporter** | Official SDK (`@spectra/sdk`), dynamic code generator (TS/Py/cURL), and downloadable `.json` proof certificates. | `packages/sdk` | Complete |

---

## Quickstart

### Prerequisites
- Node.js >= 18
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/spectra.git
cd spectra

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the Spectra dashboard.

---

## 0G Network Integration Details

### 1. 0G Chain (EVM RPC)
- **Newton Testnet RPC**: `https://evmrpc-testnet.0g.ai` (Chain ID: `16600`)
- **Mainnet RPC**: `https://evmrpc.0g.ai` (Chain ID: `56600`)
- **0G Explorer**: `https://chainscan.0g.ai`

### 2. 0G Storage Indexer
- **Storage Indexer**: `https://indexer-storage-testnet-turbo.0g.ai`
- **Capability**: Queries Merkle root hashes, retrieves agent long-term memory blocks, and computes leaf inclusion paths.

### 3. 0G Compute Router
- **Router Endpoint**: `https://router.0g.ai`
- **Capability**: Verifiable AI inference with TEE attestations (Intel SGX / AMD SEV-SNP / NVIDIA Confidential Compute).

---

## Smart Contract Architecture

The on-chain attestation registry is located at [`contracts/SpectraVerifier.sol`](contracts/SpectraVerifier.sol):

- `registerProof(bytes32 txHash, uint256 agentTokenId, address agentAddress, bytes32 storageRoot, bytes32 dataHash, bytes enclaveSignature)`: Anchors and verifies execution proofs on 0G Chain.
- `verifyMerkleProof(bytes32 leaf, bytes32[] proof, bytes32 root, uint256 index)`: Validates 0G Storage Merkle root inclusion in Solidity.

---

## Developer SDK (`@spectra/sdk`)

Agent developers can integrate with Spectra in seconds:

```typescript
import { createSpectra } from "@spectra/sdk";

const spectra = createSpectra({
  agentAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
  agentTokenId: "1",
});

// Emit execution telemetry
await spectra.emit({
  type: "inference",
  description: "DeepSeek-R1 inference completed on 0G Compute Router",
  txHash: "0x5d6e7f...",
});

// Record decentralized memory root on 0G Storage
await spectra.recordMemoryRoot("0x3a4f89...", "0x98a7b6...");
```

---

## Judge Independent 0G Verification Guide

To independently verify genuine 0G infrastructure connectivity without mocked data:

1. **Verify Live 0G EVM Chain RPCs**:
   ```bash
   node -e "
   const { createPublicClient, http } = require('viem');
   async function check() {
     const testnet = createPublicClient({ transport: http('https://evmrpc-testnet.0g.ai') });
     console.log('0G Testnet Block:', (await testnet.getBlockNumber()).toString());
     const mainnet = createPublicClient({ transport: http('https://evmrpc.0g.ai') });
     console.log('0G Mainnet Block:', (await mainnet.getBlockNumber()).toString());
   }
   check();
   "
   ```

2. **Verify Merkle Proof Algorithm (`src/lib/zero-g/storage.ts` & `contracts/SpectraVerifier.sol`)**:
   - Computes standard binary SHA-256 leaves and parent hashes matching 0G Storage Turbo Indexer specification (`https://indexer-storage-testnet-turbo.0g.ai`).

3. **Verify Smart Contract (`contracts/SpectraVerifier.sol`)**:
   - Implements standard Solidity `ecrecover` signature verification and Merkle root checks for TEE attestations on 0G Chain.

---

## License

MIT License. Built for the **0G Bridge Buildathon** on AKINDO.
