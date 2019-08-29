import Router from 'koa-router'
import { koa as voyagerMiddleware } from 'graphql-voyager/middleware';
import { getCateData } from '../controllers/categories'
import { getMovieData, associativeSearch, findMovie } from '../controllers/movies'

const router = new Router()

const prefix = '/movies'

// 路由设置
router.get(`${prefix}/cateList`, getCateData)
router.get(`${prefix}/movieList`, getMovieData)
router.get(`${prefix}/associate`, associativeSearch)
router.get(`${prefix}/movie`, findMovie)

router.get(`${prefix}/voyager`, voyagerMiddleware({
  endpointUrl: `${prefix}/graphql`
}));

export default router