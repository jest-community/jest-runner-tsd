# jest-runner-tsd

> Run your TypeScript type tests using Jest.

[![version](https://img.shields.io/npm/v/jest-runner-tsd.svg)](https://npmjs.com/package/jest-runner-tsd)
[![license](https://img.shields.io/github/license/jest-community/jest-runner-tsd.svg)](https://github.com/jest-community/jest-runner-tsd/blob/main/LICENSE.md)

Note that since `v2` the `jest-runner-tsd` is using [`tsd-lite`](https://github.com/mrazauskas/tsd-lite) instead of [`tsd`](https://github.com/SamVerschueren/tsd). The type testing logic is the same in both implementations, i.e. both of them are wrapping around the [TypeScript compiler](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) to analyze types of your code.

## Differences from `tsd`

The usage of `tsd` with monorepos written in TypeScript may become [cumbersome](https://github.com/SamVerschueren/tsd/issues/32), because of checks unrelated with types. `tsd-light` is an attempt to address these and similar issues.

Notable differences:

- The `tsd` configuration in `package.json` is ignored. Please use `jest.config` to configure discovery of your test files and `tsconfig.json` to provide configuration for TS compiler.
- The compiler configuration will be read from the nearest `tsconfig.json` for each test file. Hence, you may have a configuration for the whole project, or a group of test files, or just a particular test file.
- `tsd-lite` will use the default TS compiler configuration without altering it. This means you should set `"strict": true` to use strict assertions, which are the default ones in vanilla `tsd`.
- Only type testing is performed without any additional checks or rules.
- The `printType` helper is discarded.

## Install

```bash
yarn add -D jest-runner-tsd @tsd/typescript
```

Remember to install `@tsd/typescript` package. It is a required peer dependency.

### Usage

1. If your type tests live inside `__typetests__` folders, set up `jest.config.tsd.js` like this:

```js
module.exports = {
  displayName: {
    color: 'blue',
    name: 'types',
  },
  runner: 'jest-runner-tsd',
  testMatch: ['**/__typetests__/**/*.test.ts'],
};
```

2. Add [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) to your project with configuration for TS compiler.

3. Run `yarn jest -c jest.config.tsd.js` command or just include a script in `package.json`:

```json
"scripts": {
  "test:types": "jest -c jest.config.tsd.js"
}
```

## Tests

To learn more about `tsd` tests and assertions see the [documentation](https://github.com/SamVerschueren/tsd).

## License

[MIT](https://github.com/jest-community/jest-runner-tsd/blob/main/LICENSE.md) © Jest Community
