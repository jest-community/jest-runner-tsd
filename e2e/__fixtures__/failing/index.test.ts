import { expectType } from 'tsd';
import concat from '.';

expectType<string>(concat('pre', 'fix'));
expectType<string>(concat(1, 2));
