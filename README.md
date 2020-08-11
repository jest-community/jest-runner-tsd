# `jest-runner-tsd`

A Jest runner that tests typescript typings using [tsd](https://github.com/SamVerschueren/tsd) under the hood.

## Install

Install `jest-runner-tsd`

```bash
yarn add --dev jest-runner-tsd

# or with NPM

npm install --save-dev jest-runner-tsd
```

### Adding to Jest Config

Create a `jest.config.types.js` file and have the runner property set to `jest-runner-tsd` as shown below:

```js
module.exports = {
  runner: 'jest-runner-tsd',
};
```

In the project `package.json` file, modify the scripts block to use the configuration file as show below:

```json
...
"scripts": {
  ...
  "type-tests": "yarn jest --config jest.config.types.js"
}
...
```

### Run

To start the test, just execute the following command

```bash
yarn test-types
```

## Writing tests

> This runner uses TSD. To see the available assertions, checkout it's [documentation](https://github.com/SamVerschueren/tsd)

### For JavaScript Projects

There are multiple ways you can pass a type definition file.

#### Default

The type definitions should be in a file named `index.d.ts` in the root directory of the project by default.

#### `types` property in package.json

You can also set your `types` property in package.json. The runner will automatically pick the type defintion file from there.

```json
{
  ...
  "types": "path/to/types.d.ts"
}
```

#### Docblocks

If the type definition file is located somewhere else then specify its path in the top of respective test file using the `@type` inside a docblock.

```ts
/**
 * @type ../../custom/path/to/types.d.ts
 **/
```

### For TypeScript Projects

> **Note:** This is only a workaround. A stable solution may be introduced in future.

Due to [limitations in TSD](https://github.com/SamVerschueren/tsd/issues/32), the only solution now for testing types in TypeScript projects
would be to have a empty type definition file and specify it's path using one of the many methods explained above.
