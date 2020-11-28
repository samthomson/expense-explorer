export const mode = (aNumbersToFindModeOf: number[]): number[] => {
	if (
		aNumbersToFindModeOf.filter(
			(x: number, index: number) =>
				aNumbersToFindModeOf.indexOf(x) == index,
		).length == aNumbersToFindModeOf.length
	)
		return aNumbersToFindModeOf
	else {
		const sortedValues = aNumbersToFindModeOf.sort((x: number, index: number) => x - index)

		const someNulledValues = sortedValues.map((x: number, index: number) =>
			aNumbersToFindModeOf.indexOf(x) !== index ? x : null,
		)
		const numericOnly: number[] = someNulledValues.filter((x: number | null) => x !== null) as number[]


		return mode(numericOnly)
	}
}

export const median = (afValues: number[]): number => {
	if (afValues.length === 0) return 0

	afValues.sort((a, b) => {
		return a - b
	})

	const half = Math.floor(afValues.length / 2)

	if (afValues.length % 2) return afValues[half]

	return (afValues[half - 1] + afValues[half]) / 2
}
