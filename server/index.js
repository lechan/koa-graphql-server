import Koa from 'koa'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { connect } from '../database/init'
import router from '../router'
import { ApolloServer, gql } from 'apollo-server-koa'

const typeDefs = gql(require('../graphql/typeDefs'))
const resolvers = require('../graphql/resolvers')
const app = new Koa()

connect()

// 使用 bodyParser 和 KoaStatic 中间件
app.use(bodyParser());
app.use(KoaStatic(__dirname + '/public'));

app.use(router.routes())
app.use(router.allowedMethods())

const server = new ApolloServer({
    typeDefs,
    resolvers
})
server.applyMiddleware({ app, path: '/movies/graphql' })

app.listen(8000)

console.log('Server Start')