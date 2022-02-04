import { expectError, expectType } from 'tsd-lite';

interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  expectError((obj.prop = 'hello'));
  return obj.prop;
}

expectType<string>(doSomething({ prop: 'val' }));
