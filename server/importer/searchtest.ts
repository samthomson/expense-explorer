
import { Client as ElasticClient } from '@elastic/elasticsearch'
import * as moment from 'moment'

export const search  = async () => {

	const client = new ElasticClient({ node: 'http://elasticsearch:9200' })
	const sIndex: string = String(process.env.ELASTIC_INDEX)

	const scope: string = 'month'
	const oQueriedDate = moment()
	const sScopePeriod: any = (scope === 'month') ? 'month' : 'year'
	const sLowerDateRange = oQueriedDate.startOf(sScopePeriod).format('DD/MM/Y')
	const sUpperDateRange = oQueriedDate.endOf(sScopePeriod).format('DD/MM/Y')

	const oQuery = {
		index: process.env.ELASTIC_INDEX,
		body: {
			query: {
				range: {
					Date: {
						gte: sLowerDateRange,
						lte: sUpperDateRange,
						format: "dd/MM/yyyy"
					}
				}
			},
			size: 10000,
			aggs: {
				time_spending_breakdown: {
					date_histogram : {
						field: "Date",
						interval: "day"
					},
					aggs: {
						unit_total: { "sum" : { "field" : "Amount" } }
					}
				},
				category_spending_breakdown: {
					terms : { "field" : "Category" },
					aggs: {
						unit_total: { "sum" : { "field" : "Amount" } }
					}
				}
			}
		}
	}

	const util = require('util')
	const result = await client.search(oQuery).catch((err: any) => console.log(util.inspect(err, {showHidden: false, depth: null})))




	console.log(util.inspect(result, {showHidden: false, depth: null}))

	// console.log(result)
	// if (result && result.body && result.body.hits && result.body.hits.hits) {

	// }
}

search()
