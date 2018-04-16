import moment from 'moment'

import util from '@/common/js/util'

import './index.scss'

import '@/common/scss/common.scss'

console.info('hello world')

util()

console.info(moment())

setTimeout(() => console.info(moment()), 1000)
