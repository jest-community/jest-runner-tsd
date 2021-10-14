import {expectType} from 'mlh-tsd';
import concat from '.';

expectType<string>(concat('pre', 'fix'));
expectType<string>(concat(1, 2));
