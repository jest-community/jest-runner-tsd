import { expectType } from 'tsd-lite';
import concat from '.';

expectType<string>(concat('pre', 'fix'));
expectType<string>(concat(1, 2));
