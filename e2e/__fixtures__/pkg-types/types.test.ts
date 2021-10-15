import { expectType } from 'mlh-tsd';
import concat from '.';

expectType<string>(concat('pre', 'fix'));
expectType<number>(concat(1, 2));
