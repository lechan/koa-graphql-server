import mongoose from 'mongoose'
import py from 'pinyin'
const Movie = mongoose.model('Movie')

;(async () => {
    let movies = await Movie.find({})
    movies.forEach(async item => {
        if (item.pinyinSplit.length === 0) {
            const pinyin = py(item.title, {
                style: py.STYLE_NORMAL
            }).join(',')
            item.pinyin = pinyin.replace(/,/g, '')
            item.pinyinSplit = pinyin.split(',')
            const movie = new Movie(item)
            await movie.save()
            console.log(item._id + '.' + item.title + ' 保存成功')
        }
    })
})()