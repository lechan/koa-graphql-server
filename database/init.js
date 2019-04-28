import mongoose from 'mongoose'
import glob from 'glob'
import { resolve } from 'path'
import { mongoAuth } from '../config'

// const dbUrl = 'mongodb://localhost/douban-trailer'
const dbUrl = `mongodb://${mongoAuth.user}:${mongoAuth.pass}@${mongoAuth.ip}:27017/douban?authSource=admin`
mongoose.Promise = global.Promise

glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)

export const connect = () => {
    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }
        
        mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
    
        const db = mongoose.connection
    
        db.on('disconnected', () => {
            maxConnectTimes++
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                reject(err)
                console.log('MongoDB is Error')
            }
        })
    
        db.on('error', (err) => {
            reject(err)
            console.log('MongoDB is Error')
        })
    
        db.once('open', () => {
            resolve()
            console.log('MongoDB Connect Successfully')
        })
    })
}