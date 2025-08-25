import { createBuildConfig } from '@esdora/build-tools/configs'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig(createBuildConfig({
  entries: ['src/index', 'src/experimental'],
  externals: [],
  sourcemap: true,
}))
