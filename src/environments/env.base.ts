import {PostBuildEnv, PreBuildEnv} from '../../types/env'
import {getWindow} from '../app/shared/utils/browser'

const preBuildEnv = process.env as unknown as PreBuildEnv
const postBuildEnv = getWindow().env as PostBuildEnv

export const environment = {
  production: false,
  commitHash: preBuildEnv.COMMIT_HASH,
  appVersion: preBuildEnv.APP_VERSION,
  backendURL: postBuildEnv?.BACKEND_URL || 'https://eth-staging.ampnet.io',
  fixed: {
    chainID: (postBuildEnv?.FIXED_CHAIN_ID ? Number(postBuildEnv?.FIXED_CHAIN_ID) : undefined),
  },
}