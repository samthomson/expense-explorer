import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as expressGraphQL from 'express-graphql'
import schema from './schema'

const app = express()
const port = process.env.PORT

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://elasticsearch:9200' })

app.get('/', async (req, res) => {
	res.send('expense explorer - home root')
})

app.use(bodyParser.json())
app.use('/graphql', expressGraphQL({
	schema,
	graphiql: true
}))

app.listen(
	port,
	() => console.log(`Example app listening on port ${port}!`)
)
