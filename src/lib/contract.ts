export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '0x'
) as `0x${string}`;

export const LEADERBOARD_ABI = [
  {
    name: 'submitScore',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'score', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'bestScore',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'ScoreSubmitted',
    type: 'event',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'score', type: 'uint256', indexed: false },
      { name: 'best', type: 'uint256', indexed: false },
    ],
  },
] as const;
