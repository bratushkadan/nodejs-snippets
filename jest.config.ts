import {resolve as resolvePath} from 'path'

import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  reporters: ['default'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@my-pkg)'],
  verbose: true,
  testTimeout: 10000,
  maxWorkers: 7,
}

process.env = Object.assign(process.env, {
  ROOT_DIR: resolvePath(__dirname, '..'),
  A_TOKEN: 'a-token',
  B_TOKEN: 'b-token',
  C_TOKEN: 'c-token',
  D_TOKEN: 'd-token',
  DAYS_TO_STALE: 5,
})

export default config
