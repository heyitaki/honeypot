import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_HTTP_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 3,
      },
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    externalArtifacts: ['externalArtifacts/*.json'],
  },
};

export default config;
