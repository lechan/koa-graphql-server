// http://api.douban.com/v2/movie/subject/1764796

import rp from 'request-promise-native'
import mongoose from 'mongoose'
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')


async function fetchMovie (item) {
    const url = `http://api.douban.com/v2/movie/${item.doubanId}`
    const res = await rp(url)
    let body
    try {
        body = JSON.parse(res)
    } catch (err) {
        console.log(err)
    }
    return body
}

;(async() => {
    let movies = await Movie.find({
        $or: [
            { summary: { $exists: false } },
            { summary: null },
            { year: { $exists: false } },
            { title: '' },
            { summary: '' }
        ]
    })

    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i]
        let movieData = await fetchMovie(movie)
        if (movieData) {
            let tags = movieData.tags || []
            movie.tags = movie.tags || []
            movie.summary = movieData.summary || ''
            movie.title = movieData.alt_title || movieData.title || ''
            movie.rawTitle = movieData.title || ''

            if (movieData.attrs) {
                movie.movieTypes = movieData.attrs.movie_type || []
                movie.year = movieData.attrs.year[0] || 2500

                for (let i = 0; i < movie.movieTypes.length; i++) {
                    let item = movie.movieTypes[i]
                    let cate = await Category.findOne({
                        name: item
                    })

                    if (!cate) {
                        cate = new Category({
                            name: item,
                            movies: [movie._id]
                        })
                    } else {
                        if(cate.movies.indexOf(movie._id) === -1) {
                            cate.movies.push(movie._id)
                        }
                    }

                    await cate.save()

                    if (!movie.category) {
                        movie.category.push(cate._id)
                    } else {
                        if (movie.category.indexOf(cate._id) === -1) {
                            movie.category.push(cate._id)
                        }
                    }
                }

                let dates = movieData.attrs.pubdate || []
                let pubdates = []

                dates.map(item => {
                    if (item && item.split('(').length > 0) {
                        let parts = item.split('(')
                        let date = parts[0]
                        let country = '未知'
                        if (parts[1]) {
                            country = parts[1].split(')')[0]
                        }
                        pubdates.push({
                            date: new Date(date),
                            country
                        })
                    }
                })

                movie.pubdate = pubdates
            }

            tags.forEach(item => {
                movie.tags.push(item.name)
            })
            await movie.save()
        }
    }
})()