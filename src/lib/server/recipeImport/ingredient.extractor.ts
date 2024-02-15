import units from './units';

export default function extractLinesWithIngredients(text: string): string[] {
	const lines = text.split('\n');
	const ingredientLines = [];

	for (const line of lines) {
		if (line.match(new RegExp(units.join('|'), 'i'))) {
			ingredientLines.push(line);
		}
	}

	return lines;
}
