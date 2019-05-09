import { connect, initSchemas } from '../database/init'

;(async () => {
    await connect()

    // require('../tasks/movie')
    require('../tasks/api')
    // require('../tasks/pinyin')
})()