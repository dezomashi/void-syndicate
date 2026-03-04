# 📂 VOID SYNDICATE: AI-Driven Behavioral Analysis
> **Web3 Interactive Portfolio Case // Technical Proof of Concept**

VOID SYNDICATE is a technical demonstration of a real-time AI behavioral analysis pipeline integrated with dynamic on-chain NFT minting. 

I built this project to explore how unstructured terminal logs can be transformed into structured data and permanently encoded as generative on-chain assets.

### 🛠 Tech Highlights
- **AI Pipeline:** Real-time log aggregation fed into **Qwen-2.5 (Hugging Face)** for structured psychological profiling.
- **Dynamic Assets:** 100% **On-Chain Metadata** (Base64 SVG). No IPFS/centralized storage used.
- **Web3 UX:** Seamless transition from a terminal-style "breach" to a corporate "override" UI using **Wagmi/Viem**.
- **Smart Contract:** Custom ERC-721 minting flow on **Sepolia Testnet**.

### 🔍 How it Works (The Pipeline)
1. **Log Collection:** User terminal commands are buffered and sent to `/api/analyze`.
2. **AI Inference:** LLM evaluates traits (Aggression, Loyalty, Anomaly) and returns a validated JSON object.
3. **SVG Rendering:** A server-side generator uses the JSON data to build a personalized ID Badge (SVG).
4. **Blockchain Mint:** The final metadata is encoded into a Base64 string and minted directly to the user's wallet.


[🚀 LIVE DEMO](https://void-syndicate-two.vercel.app)


---
*This repository demonstrates my approach to building AI-to-Web3 pipelines — from prompt design and response validation to deterministic SVG generation and on-chain encoding.*
