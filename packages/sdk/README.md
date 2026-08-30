# @spectra/sdk

The official TypeScript SDK for emitting real-time telemetry, decentralized memory roots, and execution attestations to **Spectra** on 0G.

## Installation

```bash
npm install @spectra/sdk
```

## Quickstart

```typescript
import { createSpectra } from "@spectra/sdk";

const spectra = createSpectra({
  agentAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
  agentTokenId: "1",
});

// 1. Emit an AI inference execution event
await spectra.emit({
  type: "inference",
  description: "DeepSeek-R1 inference completed on 0G Compute Router",
  txHash: "0x5d6e7f...",
});

// 2. Record a decentralized memory root stored on 0G Storage
await spectra.recordMemoryRoot("0x3a4f89...", "0x98a7b6...");
```
