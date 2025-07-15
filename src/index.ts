import pkg from '../package.json' with { type: 'json' };
import taskPrintLinearization from './tasks/linearization.js';
import { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: pkg.name,
  npmPackage: pkg.name,
  dependencies: [
    async () => (await import('@solidstate/hardhat-solidstate-utils')).default,
  ],
  tasks: [taskPrintLinearization],
};

export default plugin;
