
import { Client as ElasticClient, ApiResponse, RequestParams } from '@elastic/elasticsearch'

const main  = async () => {

	const client = new ElasticClient({ node: 'http://elasticsearch:9200' })
	const sIndex: string = 'expense-explorer-index'

	client.indices.delete({
		index: sIndex
	})
}

main()
