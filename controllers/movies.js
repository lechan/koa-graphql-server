import mongoose from 'mongoose'
const Movie = mongoose.model('Movie')

export const getMovieData = async (ctx, next) => {
    const { pageSize = 10, pageNo = 1 } = ctx.request.query
    if (isNaN(pageSize) || isNaN(pageNo)) {
        ctx.body = {
            code: 1,
            msg: '参数类型有问题'
        }
        return
    }
    if (pageSize > 100 || pageNo > 10000) {
        ctx.body = {
            code: 1,
            msg: '分页数超过限制'
        }
        return
    }
    const skip = (pageNo - 1) * pageSize
    const list = await Movie.find({}).sort({createdAt: 1}).limit(Number(pageSize)).skip(skip).exec()
    const total = list.length
    if (list.length > 0) {
        ctx.body = {
            code: 0,
            msg: 'success',
            data: {
                list,
                total
            }
        }
        return
    } else {
        ctx.body = {
            code: 0,
            msg: 'success',
            data: {
                list: [],
                total: 0
            }
        }
        return
    }
}

export const associativeSearch = async (ctx, next) => {
    const { keyword = '' } = ctx.request.query
    const reg = new RegExp(keyword, 'i')
    let list = []
    if (keyword !== '') {
        list = await Movie.find({
            $or: [{
                title : {$regex : reg}
            }, {
                pinyin : {$regex : reg}
            }]
        }, 'doubanId title pinyin').sort({createdAt: 1}).limit(10).exec()
    }
    const total = list.length
    if (list.length > 0) {
        ctx.body = {
            code: 0,
            msg: 'success',
            data: {
                list,
                total
            }
        }
        return
    } else {
        ctx.body = {
            code: 0,
            msg: 'success',
            data: {
                list: [],
                total: 0
            }
        }
        return
    }
}

export const findMovie = async (ctx, next) => {
    const { doubanId = '' } = ctx.request.query
    let data = {}
    if (doubanId !== '') {
        data = await Movie.findOne({
            doubanId
        }).exec()
    }
    ctx.body = {
        code: 0,
        msg: 'success',
        data
    }
    return
}
