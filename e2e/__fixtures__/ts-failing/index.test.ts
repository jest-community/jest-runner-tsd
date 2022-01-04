import { expectError, expectType } from 'tsd-lite';
import { makeDate } from '.';

expectType<Date>(makeDate(12345678));
expectType<string>(makeDate(5, 5, 5));

expectError(makeDate(1, 3, 6));
expectError(makeDate(1, 3));
