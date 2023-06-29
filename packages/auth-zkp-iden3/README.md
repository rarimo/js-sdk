# @rarimo/auth-zkp-iden3
These packages aim to provide developers with a set of commonly used functions and features for building web applications, such as handling big numbers, date manipulation, subscribing to and receiving notifications when certain events occur with EventEmitter, and more.

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

/**
 * define type with variable to proof,
 * verifiableCredentials response will keep this variable in credentialSubject
 */
type QueryVariableName = { isNatural: number }

const getVerifiableCredentials = async () => {
  AuthZkp.setConfig({
    // rpc url where statev2 contract is deployed
    RPC_URL: 'https://matic-mumbai.chainstacklabs.com',
    // statev2 contract address
    STATE_V2_ADDRESS: '0x134B1BE34911E39A8397ec6289782989729807a4',
    // api url of issuer svc
    ISSUER_API_URL: 'http://127.0.0.1:8000/',
  })
  const authProof = new AuthZkp<QueryVariableName>(
    identityStoreSnap.identity as Identity,
  )

  const verifiableCredentials = await authProof.getVerifiableCredentials()
}

```

## Running the tests

```
yarn test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE) file for details
