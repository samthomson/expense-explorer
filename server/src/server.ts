import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressGraphQL from 'express-graphql'
import schema from './schema'

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => res.send('expense explorer - home root'))

app.use(bodyParser.json())
app.use('/graphql', expressGraphQL({
	schema,
	graphiql: true
}))

app.listen(
	port,
	() => console.log(`Example app listening on port ${port}!`)
)
