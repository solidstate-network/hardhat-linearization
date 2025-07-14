import { task } from 'hardhat/config';
import { HardhatPlugin } from 'hardhat/types/plugins';

const taskPrintLinearization = task('print-linearization')
  .addPositionalArgument({
    name: 'contract',
    description:
      'The contract name or fully qualified name (contracts/File.sol:ContractName)',
  })
  .addFlag({ name: 'noCompile', description: 'Skip compilation' })
  .setAction(import.meta.resolve('./task-action.js'))
  .build();

const plugin: HardhatPlugin = {
  id: 'hardhat-linearization',
  tasks: [taskPrintLinearization],
};

export default plugin;
