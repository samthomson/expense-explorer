import { expect } from 'chai'
import 'mocha'

import * as HelperUtil from './helper'

describe('helper util', async () => {
	it('determines median per period correctly', async () => {
		const testValues = [10, 20, 31]
		const determinedMedian = HelperUtil.nMedian(testValues)
		console.log('determinedMedian', determinedMedian)
		expect(determinedMedian).to.equal(20)
	})
})
