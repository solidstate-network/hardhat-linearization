import { readJsonFile } from '@nomicfoundation/hardhat-utils/fs';
import type { ArtifactManager } from 'hardhat/types/artifacts';
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre';
import {
  isFullyQualifiedName,
  parseFullyQualifiedName,
  getFullyQualifiedName,
} from 'hardhat/utils/contract-names';
import type { SolcOutput } from 'solidity-ast/solc.js';
import { astDereferencer, findAll } from 'solidity-ast/utils.js';

const getBuildInfo = async (
  artifacts: ArtifactManager,
  contractNameOrFullyQualifiedName: string,
): Promise<{ output: SolcOutput }> => {
  // TODO: BuildInfo type
  // TODO: throw if build info not found (contract was not compiled by HH)
  const buildInfoId = await artifacts.getBuildInfoId(
    contractNameOrFullyQualifiedName,
  );
  const buildInfoPath = await artifacts.getBuildInfoOutputPath(buildInfoId!);
  return await readJsonFile(buildInfoPath!);
};

export const getLinearization = async (
  hre: Pick<HardhatRuntimeEnvironment, 'artifacts'>,
  contractNameOrFullyQualifiedName: string,
): Promise<string[]> => {
  const { sourceName, contractName } = isFullyQualifiedName(
    contractNameOrFullyQualifiedName,
  )
    ? parseFullyQualifiedName(contractNameOrFullyQualifiedName)
    : await hre.artifacts.readArtifact(contractNameOrFullyQualifiedName);

  const { output } = await getBuildInfo(
    hre.artifacts,
    contractNameOrFullyQualifiedName,
  );

  const deref = astDereferencer(output);

  const contractDefinitions = findAll(
    'ContractDefinition',
    output.sources[`project/${sourceName}`].ast,
  );

  return contractDefinitions
    .find((c) => c.name === contractName)!
    .linearizedBaseContracts.map((id) => deref('ContractDefinition', id).name);
};
