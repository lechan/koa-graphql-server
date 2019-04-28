import Router from 'koa-router'
import { getCateData } from '../controllers/categories'
import { getMovieData } from '../controllers/movies'

const router = new Router()

const prefix = '/movies'

// 路由设置
router.get(`${prefix}/cateList`, getCateData)
router.get(`${prefix}/movieList`, getMovieData)

export default router