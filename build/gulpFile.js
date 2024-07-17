

import { series } from 'gulp'
import { buildModules } from 'task'

export default series(buildModules)