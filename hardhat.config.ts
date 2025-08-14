import HardhatLinearization from './src/index.js';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.30',
    npmFilesToBuild: ['@solidstate/contracts/token/fungible/FungibleToken.sol'],
  },
  plugins: [HardhatLinearization],
};

export default config;
