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
