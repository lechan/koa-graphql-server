import mongoose from 'mongoose'
const Category = mongoose.model('Category')

export const getCateData = async (ctx, next) => {
    const list = await Category.find({}).exec()
    if (list.length > 0) {
        ctx.body = {
            code: 0,
            data: list
        }
    } else {
        ctx.body = {
            code: 0,
            data: []
        }
    }
}
