import * as express from 'express'

const app = express()
const port = process.env.PORT

// app.use(bodyParser.json());
// app.use('/graphql', expressGraphQL({
//   schema,
//   graphiql: true
// }));

// const webpackMiddleware = require('webpack-dev-middleware');
// const webpack = require('webpack');
// const webpackConfig = require('../webpack.config.js');
// app.use(webpackMiddleware(webpack(webpackConfig)));

app.get('/', (req, res) => res.send('expense explorer - home root'))

app.listen(
	port,
	() => console.log(`Example app listening on port ${port}!`)
)