import { TASK_LINEARIZATION } from '../task_names.js';
import { task } from 'hardhat/config';

export default task(TASK_LINEARIZATION)
  .addPositionalArgument({
    name: 'contract',
    description:
      'The contract name or fully qualified name (contracts/File.sol:ContractName)',
  })
  .addFlag({
    name: 'noCompile',
    description: "Don't compile before running this task",
  })
  .setAction(import.meta.resolve('../actions/linearization.js'))
  .build();
