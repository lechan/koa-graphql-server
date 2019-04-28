import mongoose from 'mongoose'
const Movie = mongoose.model('Movie')

module.exports = {
    Query: {
        movies: (root, args, context, info) => {
            let pageNo = Object.prototype.toString.call(args.pageNo) === '[object Number]' ? args.pageNo : 1
            let pageSize = Object.prototype.toString.call(args.pageSize) === '[object Number]' ? args.pageSize : 10    
            let skip = (pageNo - 1) * pageSize
            return new Promise((resolve,reject) => {
                Movie.find({}).limit(Number(pageSize)).skip(skip).exec((err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        },
        movie: (root, args) => {
            return Movie.findOne(args)
        }
    }
}