import pkg from '../../package.json' with { type: 'json' };
import { readJsonFile } from '@nomicfoundation/hardhat-utils/fs';
import { HardhatPluginError } from 'hardhat/plugins';
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre';
import { SolidityBuildInfoOutput } from 'hardhat/types/solidity';
import { astDereferencer, findAll } from 'solidity-ast/utils.js';

export const getLinearization = async (
  hre: Pick<HardhatRuntimeEnvironment, 'artifacts'>,
  contractNameOrFullyQualifiedName: string,
): Promise<string[]> => {
  const artifact = await hre.artifacts.readArtifact(
    contractNameOrFullyQualifiedName,
  );

  if (!artifact.buildInfoId) {
    throw new HardhatPluginError(pkg.name, `build info id not found`);
  }

  const buildInfoPath = await hre.artifacts.getBuildInfoOutputPath(
    artifact.buildInfoId,
  );
  const buildInfo = (await readJsonFile(
    buildInfoPath!,
  )) as SolidityBuildInfoOutput;

  const deref = astDereferencer(buildInfo.output);

  const contractDefinitions = findAll(
    'ContractDefinition',
    buildInfo.output.sources[artifact.inputSourceName!].ast,
  );

  return contractDefinitions
    .find((c) => c.name === artifact.contractName)!
    .linearizedBaseContracts.map((id) => deref('ContractDefinition', id).name);
};
