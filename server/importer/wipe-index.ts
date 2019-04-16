
import { Client as ElasticClient } from '@elastic/elasticsearch'

export const wipeIndex  = async () => {

	const client = new ElasticClient({ node: 'http://elasticsearch:9200' })
	const sIndex: string = String(process.env.ELASTIC_INDEX)

	await client.indices.delete({
		index: sIndex
	})
}

wipeIndex()
