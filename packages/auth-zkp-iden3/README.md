# @rarimo/auth-zkp-iden3
This package provides a class to work with iden3 zero-knowledge proof. Generates auth proof and return verifiable credentials.

![version (scoped package)](https://badgen.net/npm/v/@rarimo/auth-zkp-iden3)
![types](https://badgen.net/npm/types/@rarimo/auth-zkp-iden3)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@rarimo/auth-zkp-iden3)
![checks](https://badgen.net/github/checks/rarimo/js-sdk/main)

## Getting Started

### Installing

```
yarn add @rarimo/auth-zkp-iden3
```

### Usage

```ts
import { AuthZkp } from '@rarimo/auth-zkp-iden3'
import { type Identity } from '@rarimo/identity-gen-iden3'

/**
 * define type with variable to proof,
 * verifiableCredentials response will keep this variable in credentialSubject
 */
type QueryVariableName = { isNatural: number }

const getVerifiableCredentials = async (identity: Identity) => {
  /**
   * Setup config is necessary to let AuthZkp works properly
   */
  AuthZkp.setConfig({
    // rpc url where statev2 contract is deployed
    RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
    // statev2 contract address
    STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
    // api url of issuer svc
    ISSUER_API_URL: 'http://127.0.0.1:8000/',
  })
  const authProof = new AuthZkp<QueryVariableName>(identity)

  const verifiableCredentials = await authProof.getVerifiableCredentials()
}
```

## Known Issues
[Read here](https://github.com/rarimo/js-sdk/blob/main/README.md#working-with-zkp-iden3-packages)

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details
