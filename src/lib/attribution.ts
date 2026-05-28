import { Attribution } from 'ox/erc8021';

const BUILDER_CODE = process.env.NEXT_PUBLIC_BUILDER_CODE ?? 'bc_06vnarrm';

// ERC-8021 data suffix — append to all Base transactions to attribute activity to this app.
// Usage with wagmi: pass to createConfig({ dataSuffix: DATA_SUFFIX })
// Usage with viem:  pass to createWalletClient({ dataSuffix: DATA_SUFFIX })
export const DATA_SUFFIX = Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
