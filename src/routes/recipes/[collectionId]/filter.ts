function fullTextFilter(
	array: { [key: string]: any }[],
	searchPatterns: string[]
): { [key: string]: any }[] {
	return array.filter((item) => {
		const searchInObject = (obj: { [key: string]: any }) => {
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					const value: any = obj[key];

					if (
						typeof value === 'string' &&
						stringIncludesPatterns(value.toLowerCase(), searchPatterns)
					) {
						return true;
					} else if (typeof value === 'object' && value !== null) {
						if (searchInObject(value)) {
							return true;
						}
					} else if (Array.isArray(value)) {
						for (let i = 0; i < value.length; i++) {
							if (typeof value[i] === 'object' && value[i] !== null) {
								if (searchInObject(value[i])) {
									return true;
								}
							}
						}
					}
				}
			}
			return false;
		};

		return searchInObject(item);
	});
}

function stringIncludesPatterns(text: string, patterns: string[]): boolean {
	for (let i = 0; i < patterns.length; i++) {
		if (text.includes(patterns[i].toLowerCase())) {
			return true;
		}
	}
	return false;
}

export { fullTextFilter };
