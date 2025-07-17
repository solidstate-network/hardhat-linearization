import { getLinearization } from '../src/lib/linearize.js';
import hre from 'hardhat';
import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('getLinearization', () => {
  it('returns the inheritance linearization of a contract', async () => {
    assert.deepStrictEqual(await getLinearization(hre, 'FungibleToken'), [
      'FungibleToken',
      'Context',
      '_FungibleToken',
      '_Context',
      'IFungibleToken',
      'IContext',
      'IERC20',
      '_IFungibleToken',
      '_IContext',
      '_IERC20',
    ]);
  });

  it('throws if contract is not found', async () => {
    await assert.rejects(
      getLinearization(hre, 'NonexistentContract'),
      /HHE1000/,
    );
  });

  it.skip('throws if build info id is not found', async () => {
    // TODO: import precompiled contract into Hardhat
    await assert.rejects(
      getLinearization(hre, 'NonexistentContract'),
      /build info id not found/,
    );
  });
});
