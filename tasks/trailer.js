import cp from 'child_process'
import { resolve } from 'path'

;(async () => {
    const script = resolve(__dirname, '../spider/video')
    const child = cp.fork(script, [])
    let invoked = false
    child.on('error', err => {
        if (invoked) return
        invoked = true
        console.log(err)
    })
    child.on('exit', code => {
        if (invoked) return
        invoked = true
        let err = code === 0 ? null : new Error('exit code' + code)
        console.log(err)
    })
    child.on('message', data => {
        console.log(data)
    })
})()