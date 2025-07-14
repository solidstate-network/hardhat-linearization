import { readJsonFile } from '@nomicfoundation/hardhat-utils/fs';
import { NewTaskActionFunction } from 'hardhat/types/tasks';
import {
  isFullyQualifiedName,
  parseFullyQualifiedName,
  getFullyQualifiedName,
} from 'hardhat/utils/contract-names';
import { astDereferencer, findAll } from 'solidity-ast/utils.js';

interface TaskActionArguments {
  contract: string;
  noCompile: boolean;
}

const action: NewTaskActionFunction<TaskActionArguments> = async (
  args,
  hre,
) => {
  if (!args.noCompile) {
    await hre.tasks.getTask('compile').run({ quiet: true });
  }
  let fullName, sourceName, contractName;
  if (isFullyQualifiedName(args.contract)) {
    fullName = args.contract;
    ({ sourceName, contractName } = parseFullyQualifiedName(args.contract));
  } else {
    ({ sourceName, contractName } = await hre.artifacts.readArtifact(
      args.contract,
    ));
    fullName = getFullyQualifiedName(sourceName, contractName);
  }
  const buildInfoId = await hre.artifacts.getBuildInfoId(fullName);
  const buildInfoPath = await hre.artifacts.getBuildInfoOutputPath(
    buildInfoId!,
  );
  const buildInfo = await readJsonFile(buildInfoPath!);
  if (buildInfo === undefined) {
    throw new Error('Build info not found');
  }
  const deref = astDereferencer(buildInfo.output);
  for (const c of findAll(
    'ContractDefinition',
    buildInfo.output.sources[`project/${sourceName}`]!.ast,
  )) {
    if (c.name === contractName) {
      const list = c.linearizedBaseContracts.map(
        (id) => deref('ContractDefinition', id).name,
      );
      console.log(list.join('\n'));
      break;
    }
  }
};

export default action;
