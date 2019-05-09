import Router from 'koa-router'
import { getCateData } from '../controllers/categories'
import { getMovieData, associativeSearch, findMovie } from '../controllers/movies'

const router = new Router()

const prefix = '/movies'

// 路由设置
router.get(`${prefix}/cateList`, getCateData)
router.get(`${prefix}/movieList`, getMovieData)
router.get(`${prefix}/associate`, associativeSearch)
router.get(`${prefix}/movie`, findMovie)

export default router