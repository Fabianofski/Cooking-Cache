import type Ingredient from '../../../models/Ingredient';
import units from './units';

export function extractIngredientsFromText(text: string): Ingredient[] {
	const ingredientLines = extractLinesWithIngredients(text);
	return extractIngredientFromLines(ingredientLines);
}

const unitRegex = new RegExp(units.map((unit) => `(\\d| )${unit} `).join('|'), 'i');

export function extractLinesWithIngredients(text: string): string[] {
	const lines = text.split('\n');
	const ingredientLines = [];

	for (let line of lines) {
		if (line.match(unitRegex)) {
			ingredientLines.push(line);
		}
	}

	return ingredientLines;
}

export function extractIngredientFromLines(lines: string[]): Ingredient[] {
	const ingredients: Ingredient[] = [];

	for (let line of lines) {
		let unit = line.match(unitRegex)?.[0] || '';
		unit = unit.substring(1).trim();
		line = line.replace(unit, '').trim();

		const amount = line.match(/(\d+(?:[,.]\d+)?)/g)?.[0] || '';
		line = line.replace(amount, '').trim();

		line = line.replace('of', '');
		line = line.replace('-', '');
		line = line.trim();
		const name = line;

		ingredients.push({
			name: name,
			amount: parseFloat(amount.replace(',', '.')),
			unit: unit
		});
	}

	return ingredients;
}
