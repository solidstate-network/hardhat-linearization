# Hardhat Linearization

Inspect Solidity smart contract inheritance linearization.

> This is a fork of a [Hardhat 2.0 plugin](https://github.com/frangio/hardhat-linearization) by [frangio](https://github.com/frangio).

## Installation

```bash
npm install --save-dev @solidstate/hardhat-linearization
# or
pnpm add -D @solidstate/hardhat-linearization
```

## Usage

Load plugin in Hardhat config:

```javascript
import HardhatLinearization from '@solidstate/hardhat-linearization';

const config: HardhatUserConfig = {
  plugins: [
    HardhatLinearization,
  ],
};
```

Run the task:

```bash
# use just the contract name if it's unique
hardhat linearization Contract
# use the fully qualified name if it's ambiguous
hardhat linearization contracts/File.sol:Contract
```

## Development

Install dependencies via pnpm:

```bash
pnpm install
```

Setup Husky to format code on commit:

```bash
pnpm prepare
```
