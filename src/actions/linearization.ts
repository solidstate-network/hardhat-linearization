import { getLinearization } from '../lib/linearize.js';
import { printLinearization } from '../lib/print.js';
import { TASK_COMPILE } from '../task_names.js';
import { NewTaskActionFunction } from 'hardhat/types/tasks';

interface TaskActionArguments {
  contract: string;
  noCompile: boolean;
}

const action: NewTaskActionFunction<TaskActionArguments> = async (
  args,
  hre,
) => {
  if (!args.noCompile) {
    await hre.tasks.getTask(TASK_COMPILE).run({ quiet: true });
  }

  const linearization = await getLinearization(hre, args.contract);
  printLinearization(linearization);
};

export default action;
