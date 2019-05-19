// @ts-ignore
export const anMode = (aNumbersToFindModeOf: number[]): number[] => {
	if (
		aNumbersToFindModeOf.filter(
			(x: number, index: number) =>
				aNumbersToFindModeOf.indexOf(x) == index,
		).length == aNumbersToFindModeOf.length
	)
		return aNumbersToFindModeOf
	else
		return anMode(
			aNumbersToFindModeOf
				.sort((x: number, index: number) => x - index)
				.map((x: number, index: number) =>
					aNumbersToFindModeOf.indexOf(x) !== index ? x : null,
				)
				// @ts-ignore
				.filter((x: number) => x !== null),
		)
}

export const nMedian = (afValues: number[]): number => {
	if (afValues.length === 0) return 0

	afValues.sort((a, b) => {
		return a - b
	})

	const half = Math.floor(afValues.length / 2)

	if (afValues.length % 2) return afValues[half]

	return (afValues[half - 1] + afValues[half]) / 2
}
