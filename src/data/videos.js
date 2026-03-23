export const videos = [
  {
    id: 'wallet-intro',
    youtubeId: 'dQw4w9WgXcQ',
    label: 'Tutorial #1',
    title: 'Getting Started with INDS Wallet',
    duration: '12:34',
    date: 'March 10, 2026',
    description: `This tutorial walks you through the complete setup process of the INDS Wallet from scratch. You will learn how to generate keys fully offline, why that matters for security, and how to safely store your recovery phrase.

We cover the installation process on both Windows and macOS, the initial wallet configuration, and the first steps for connecting to the INDS network without exposing your IP address.

By the end of this video you will have a fully operational non-custodial wallet ready for transactions.`,
  },
  {
    id: 'offline-keys',
    youtubeId: '9bZkp7q19f0',
    label: 'Tutorial #2',
    title: 'How to Set Up a Secure Key Offline',
    duration: '08:17',
    date: 'March 14, 2026',
    description: `Key generation is the most critical step in any self-custodial setup. In this video we demonstrate how to generate cryptographic keys on an air-gapped device — completely disconnected from the internet.

We explain the entropy sources used by INDS, how to verify key integrity, and the best practices for physical backup. You will also see a live demo of generating a key pair and signing a test transaction offline.

This approach eliminates the most common attack vector used against crypto users: online key generation.`,
  },
  {
    id: 'first-transaction',
    youtubeId: 'L_jWHffIx5E',
    label: 'Tutorial #3',
    title: 'INDS Exchange: First Transaction Guide',
    duration: '15:50',
    date: 'March 18, 2026',
    description: `Ready to make your first exchange? This guide covers the built-in INDS exchanger end-to-end: selecting assets, reviewing rates, setting slippage tolerance, and confirming a transaction without a block explorer.

We also explain how the internal exchanger differs from centralized platforms — no order books, no KYC, no logged IPs. Every swap is routed through the INDS network with configurable privacy levels.

Includes a walkthrough of transaction hash lookup and status tracking inside the wallet interface.`,
  },
];
