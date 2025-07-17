import { readJsonFile } from '@nomicfoundation/hardhat-utils/fs';
import type { ArtifactManager } from 'hardhat/types/artifacts';
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre';
import { SolidityBuildInfoOutput } from 'hardhat/types/solidity';
import {
  isFullyQualifiedName,
  parseFullyQualifiedName,
} from 'hardhat/utils/contract-names';
import { astDereferencer, findAll } from 'solidity-ast/utils.js';

export const getLinearization = async (
  hre: Pick<HardhatRuntimeEnvironment, 'artifacts'>,
  contractNameOrFullyQualifiedName: string,
): Promise<string[]> => {
  const artifact = await hre.artifacts.readArtifact(
    contractNameOrFullyQualifiedName,
  );

  // TODO: throw if build info not found (contract was not compiled by HH)
  const buildInfoPath = await hre.artifacts.getBuildInfoOutputPath(
    artifact.buildInfoId!,
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
