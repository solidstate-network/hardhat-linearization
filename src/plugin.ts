import { task } from 'hardhat/config';
import { isFullyQualifiedName, parseFullyQualifiedName, getFullyQualifiedName } from 'hardhat/utils/contract-names';
import { astDereferencer, findAll } from 'solidity-ast/utils.js';
import { HardhatPlugin } from 'hardhat/types/plugins';
import { readJsonFile } from '@nomicfoundation/hardhat-utils/fs';

const taskPrintLinearization = task("print-linearization")
  .addPositionalArgument({ name: "contract", description: "The contract name or fully qualified name (contracts/File.sol:ContractName)"})
  .addFlag({ name: "noCompile", description: "Skip compilation"})
  .setAction(async (args: { contract: string, noCompile: boolean }, hre) => {
    if (!args.noCompile) {
      await hre.tasks.getTask('compile').run({ quiet: true });
    }
    let fullName, sourceName, contractName;
    if (isFullyQualifiedName(args.contract)) {
      fullName = args.contract;
      ({ sourceName, contractName } = parseFullyQualifiedName(args.contract));
    } else {
      ({ sourceName, contractName } = await hre.artifacts.readArtifact(args.contract));
      fullName = getFullyQualifiedName(sourceName, contractName);
    }
    const buildInfoId = await hre.artifacts.getBuildInfoId(fullName)
    const buildInfoPath = await hre.artifacts.getBuildInfoOutputPath(buildInfoId!);
    const buildInfo = await readJsonFile(buildInfoPath!);
    if (buildInfo === undefined) {  
      throw new Error('Build info not found');
    }
    const deref = astDereferencer(buildInfo.output);
    for (const c of findAll('ContractDefinition', buildInfo.output.sources[`project/${sourceName}`]!.ast)) {
      if (c.name === contractName) {
        const list = c.linearizedBaseContracts.map(id => deref('ContractDefinition', id).name);
        console.log(list.join('\n'));
        break;
      }
    }
  }).build();

const plugin: HardhatPlugin = {
  id: 'hardhat-linearization',
  tasks: [taskPrintLinearization]
}

export default plugin;
