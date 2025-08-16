import { createBuildConfig } from '@esdora/build-tools/configs'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig(createBuildConfig({
  entries: ['src/index'],
  externals: [],
  sourcemap: true,
}))
