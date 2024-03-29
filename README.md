# `jest-runner-tsd`

> Run your TypeScript type tests using Jest.

[![version](https://img.shields.io/npm/v/jest-runner-tsd.svg)](https://npmjs.com/package/jest-runner-tsd)
[![license](https://img.shields.io/github/license/jest-community/jest-runner-tsd.svg)](https://github.com/jest-community/jest-runner-tsd/blob/main/LICENSE.md)

**Note:** the `jest-runner-tsd` is using [`tsd-lite`](https://github.com/mrazauskas/tsd-lite) instead of [`tsd`](https://github.com/SamVerschueren/tsd). Both of them have the same type testing logic, but `tsd-lite` makes it easier to test projects written in TypeScript (or types generated by your library).

Most important differences (for the full list see [`tsd-lite` repo](https://github.com/mrazauskas/tsd-lite)):

- `tsd-lite` has no additional [rules](https://github.com/SamVerschueren/tsd/issues/32) or checks;
- `jest.config` is used to discover test files;
- `tsconfig.json` provides configuration for TS compiler. For details see [Configuration](#configuration) section;
- the type assertions must be imported from `tsd-lite` package.

## Install

```bash
yarn add --dev jest-runner-tsd @tsd/typescript
# or
npm install --save-dev jest-runner-tsd @tsd/typescript
```

Remember to install `@tsd/typescript` package. It is a required peer dependency.

Note that `@tsd/typescript` will be used to compile type tests. Generally it is recommended to match versions of `@tsd/typescript` and `typescript` in a project, but you may choose to test on different version too.

## Configuration

### Jest

First of all, you should [configure Jest](https://jestjs.io/docs/configuration) to discover your test files. For example, if the files have `.test.ts` suffix and live inside `__typetests__` directories, set up `jest.config.tsd.js` like this:

```js
module.exports = {
  displayName: {
    color: 'blue',
    name: 'types',
  },
  runner: 'jest-runner-tsd',
  testMatch: ['**/__typetests__/*.test.ts'],
};
```

### TS Compiler

Your test files will be compiled using the [TypeScript compiler](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) (similar to `tsc`), but, instead of emitting JS code, `tsd-lite` will analyze types and diagnostics returned by the compiler.

To compile each test file, `tsd-lite` will read the nearest [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) and will pass the configuration to the compiler. Hence, you may have a configuration for the whole project, or a group of test files, or just a particular test file.

For example, if your project already includes a `tsconfig.json` in the root directory, but you prefer to have different configuration for testing, simply add another `tsconfig.json` to a directory with the test files. It may override or extend your root configuration.

**Tip:** run `yarn tsc -p path/to/__typetests__ --showConfig` to print the configuration which applies to the test files.

**Note:** if `tsconfig.json` is not found, the compiler will fall back to the default configuration.

### Optionally Strict

Just like TypeScript, `tsd-lite` is [optionally strict](https://www.typescriptlang.org/docs/handbook/2/basic-types.html#strictness). In contrary, the vanilla `tsd` is strict by default. If you are migrating your test suite, remember to set `"strict": true` in `tsconfig.json`.

```ts
import { expectType } from 'tsd-lite';

declare const loggedInUsername: string;

const users = [
  { name: 'Oby', age: 12 },
  { name: 'Heera', age: 32 },
];

const loggedInUser = users.find(u => u.name === loggedInUsername);

expectType<number>(loggedInUser.age);
```

The assertion in this example fails with `"strict": true`, but passes with `"strict": false`.

## Writing Tests

Let's say you defined a `JsonObject` type:

```ts
// JsonObject.ts
type JsonValue = string | number | boolean | JsonObject | Array<JsonValue>;

export interface JsonObject {
  [key: string]: JsonValue;
}
```

It is relatively complex, so it is worth adding a type test to prevent mistakes and regression in the future:

```ts
// __typetests__/JsonObject.test.ts
import { expectAssignable, expectNotAssignable } from 'tsd-lite';
import type { JsonObject } from '../JsonObject.js';

expectAssignable<JsonObject>({
  caption: 'test',
  count: 100,
  isTest: true,
  location: { name: 'test', start: [1, 2], valid: false, x: 10, y: 20 },
  values: [0, 10, 20, { x: 1, y: 2 }, true, 'test', ['a', 'b']],
});

expectNotAssignable<JsonObject>({
  filter: () => {},
});
```

**Tip:** For the full list of type testing assertions see the [documentation of `tsd-lite`](https://github.com/mrazauskas/tsd-lite#assertions).

## Running Tests

If all is set, simply run `yarn jest --config jest.config.tsd.js` command. Or better include a script in `package.json`:

```json
"scripts": {
  "test:types": "jest --config jest.config.tsd.js"
}
```

## License

[MIT](https://github.com/jest-community/jest-runner-tsd/blob/main/LICENSE.md) © Jest Community
