import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as expressGraphQL from 'express-graphql'
import schema from './schema'

const app = express()
const port = process.env.PORT

var allowCrossDomain = function (req: any, res: any, next: any) {
	// console.log(req)
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Content-Type,token')
	next()
}
app.use(allowCrossDomain)

// enable cors
var corsOptions = {
	origin: 'http://127.0.0.1:3400',
	credentials: true, // <-- REQUIRED backend setting
}
app.use(cors(corsOptions))

app.get('/', (req, res) => res.send('expense explorer - home root'))

app.use(bodyParser.json())
app.use(
	'/graphql',
	expressGraphQL({
		schema,
		graphiql: true,
	}),
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
