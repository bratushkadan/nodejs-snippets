import {resolve as resolvePath} from 'path'

import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  reporters: ['default'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@lavka)'],
  verbose: true,
  testTimeout: 10000,
  maxWorkers: 7,
}

process.env = Object.assign(process.env, {
  ROOT_DIR: resolvePath(__dirname, '..'),
  CLOWNDUCTOR_TOKEN: 'clownductor-token',
  ARCANUM_API_OAUTH_TOKEN: 'arcanum-token',
  YAV_TOKEN: 'yav-token',
  SANDBOX_TOKEN: 'sandbox-token',
  DAYS_TO_STALE: 5,
})

export default config
