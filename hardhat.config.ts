import HardhatLinearization from './src/index.js';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  plugins: [HardhatLinearization],
};

export default config;
