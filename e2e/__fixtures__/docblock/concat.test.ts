/**
 * @type concat.d.ts
 */

import { expectType } from 'tsd';
import concat from './concat';

expectType<string>(concat('pre', 'fix'));
expectType<number>(concat(1, 2));
