import mongoose from 'mongoose'
const Category = mongoose.model('Category')

module.exports = {
    Query: {
        cateList: (root, args, context, info) => {
            return new Promise((resolve,reject) => {
                Category.find({}).exec((err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        },
        cate: (root, args) => {
            return Category.findOne(args)
        }
    }
}