import { HardhatUserConfig } from 'hardhat/config';
import HardhatLinearization from './src/index.js'

export default <HardhatUserConfig> {
  solidity: '0.8.9',
  plugins:[HardhatLinearization],
  typechain: {
    dontOverrideCompile: true,
  },
};
