# hardhat-linearization

This Hardhat plugins adds a `print-linearization` task that prints the linearization of a contract.

> This is a fork of a [Hardhat 2.0 plugin](https://github.com/frangio/hardhat-linearization) by [frangio](https://github.com/frangio).

```bash
# use just the contract name if it's unique
hardhat print-linearization Contract
# use the fully qualified name if it's ambiguous
hardhat print-linearization contracts/File.sol:Contract
```
