import moment from 'moment'

import util from '@/common/js/util'

import './index.scss'

import '@/common/scss/common.scss'

import 'console-polyfill'

console.info('hello world')

util()

console.info(moment())

setTimeout(() => console.info(moment()), 1000)
