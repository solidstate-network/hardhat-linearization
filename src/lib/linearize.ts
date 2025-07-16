import { readJsonFile } from '@nomicfoundation/hardhat-utils/fs';
import type { ArtifactManager } from 'hardhat/types/artifacts';
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre';
import { SolidityBuildInfoOutput } from 'hardhat/types/solidity';
import {
  isFullyQualifiedName,
  parseFullyQualifiedName,
} from 'hardhat/utils/contract-names';
import { astDereferencer, findAll } from 'solidity-ast/utils.js';

const getBuildInfo = async (
  artifacts: ArtifactManager,
  contractNameOrFullyQualifiedName: string,
): Promise<SolidityBuildInfoOutput> => {
  // TODO: throw if build info not found (contract was not compiled by HH)
  const buildInfoId = await artifacts.getBuildInfoId(
    contractNameOrFullyQualifiedName,
  );
  const buildInfoPath = await artifacts.getBuildInfoOutputPath(buildInfoId!);
  return await readJsonFile(buildInfoPath!);
};

const parseContractNameOrFullyQualifiedName = async (
  artifacts: ArtifactManager,
  contractNameOrFullyQualifiedName: string,
): Promise<ReturnType<typeof parseFullyQualifiedName>> => {
  if (isFullyQualifiedName(contractNameOrFullyQualifiedName)) {
    return parseFullyQualifiedName(contractNameOrFullyQualifiedName);
  } else {
    const { sourceName, contractName } = await artifacts.readArtifact(
      contractNameOrFullyQualifiedName,
    );
    return { sourceName, contractName };
  }
};

export const getLinearization = async (
  hre: Pick<HardhatRuntimeEnvironment, 'artifacts'>,
  contractNameOrFullyQualifiedName: string,
): Promise<string[]> => {
  const { sourceName, contractName } =
    await parseContractNameOrFullyQualifiedName(
      hre.artifacts,
      contractNameOrFullyQualifiedName,
    );

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
