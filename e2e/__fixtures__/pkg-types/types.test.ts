import { expectType } from 'tsd';
import concat from '.';

expectType<string>(concat('pre', 'fix'));
expectType<number>(concat(1, 2));
