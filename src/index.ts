import taskPrintLinearization from './tasks/linearization.js';
import { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: 'hardhat-linearization',
  tasks: [taskPrintLinearization],
};

export default plugin;
