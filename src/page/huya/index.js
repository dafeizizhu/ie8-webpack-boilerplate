/* eslint no-console: "off" */

import '@/common/scss/common.scss';
import './index.scss';

import moment from 'moment';
import util from '@/common/js/util';

console.info('index');
console.info(moment());
util();

// first screen
window.performanceInfo.firstScreenTime = +new Date();
