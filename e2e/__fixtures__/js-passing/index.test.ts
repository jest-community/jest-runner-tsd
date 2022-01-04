import { expectType } from 'tsd-lite';
import concat from '.';

expectType<string>(concat('pre', 'fix'));
expectType<number>(concat(1, 2));
