// Adapted from: https://www.typescriptlang.org/tsconfig#strictNullChecks

import { expectType } from 'tsd-lite';

declare const loggedInUsername: string;

const users = [
  { name: 'Oby', age: 12 },
  { name: 'Heera', age: 32 },
];

const loggedInUser = users.find(u => u.name === loggedInUsername);

expectType<number>(loggedInUser.age);
