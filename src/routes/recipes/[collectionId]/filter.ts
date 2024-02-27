function fullTextFilter(
	array: { [key: string]: any }[],
	searchText: string
): { [key: string]: any }[] {
	searchText = searchText.toLowerCase();

	return array.filter((item) => {
		const searchInObject = (obj: { [key: string]: any }) => {
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					const value: any = obj[key];

					if (typeof value === 'string' && value.toLowerCase().includes(searchText)) {
						return true;
					} else if (typeof value === 'object' && value !== null) {
						if (searchInObject(value)) {
							return true;
						}
					}
					/* c8 ignore start */
					if (Array.isArray(value)) {
						for (let i = 0; i < value.length; i++) {
							if (typeof value[i] === 'object' && value[i] !== null) {
								if (searchInObject(value[i])) {
									return true;
								}
							}
						}
					}
					/* c8 ignore end */
				}
			}
			return false;
		};

		return searchInObject(item);
	});
}

export { fullTextFilter };
