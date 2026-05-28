import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-viem';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const accounts = process.env.DEPLOYER_PRIVATE_KEY
  ? [process.env.DEPLOYER_PRIVATE_KEY]
  : [];

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    base: {
      url: 'https://mainnet.base.org',
      chainId: 8453,
      accounts,
    },
    'base-sepolia': {
      url: 'https://sepolia.base.org',
      chainId: 84532,
      accounts,
    },
  },
};

export default config;
