export function extractTagsFromText(text: string): string[] {
	const tags = text.match(/#[a-zA-Z0-9]+/g);
	tags?.forEach((tag, index) => {
		tags[index] = tag.replace('#', '');
	});

	if (tags) {
		return tags;
	} else {
		return [];
	}
}
