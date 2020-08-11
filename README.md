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

### Type definition file

The type definitions should be in a file named `index.d.ts` in the root directory of the project by default.

If the type definition files are located somewhere else then specify its path in the top of respective test file as shown below:

```ts
/**
 * @type ../../custom/path/to/types.d.ts
 **/
```
