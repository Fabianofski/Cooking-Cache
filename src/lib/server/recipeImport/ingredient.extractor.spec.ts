import { describe, it, expect } from 'vitest';
import {
	extractIngredientFromLines,
	extractIngredientsFromText,
	extractLinesWithIngredients
} from './ingredient.extractor';

describe('extractIngredients', () => {
	it('should extract lines which contain ingredients', () => {
		const input = '1 cup of sugar\n1 cup of flour\n1 cup of milk\nThis is a description.';
		const expected = ['1 cup of sugar', '1 cup of flour', '1 cup of milk'];
		expect(extractLinesWithIngredients(input)).toEqual(expected);
	});

	it('should extract Ingredients from Lines and remove "of"', () => {
		const input = ['1 cup of sugar', '1 cup of flour', '1 cup of milk'];
		const expected = [
			{ name: 'sugar', amount: 1, unit: 'cup' },
			{ name: 'flour', amount: 1, unit: 'cup' },
			{ name: 'milk', amount: 1, unit: 'cup' }
		];
		expect(extractIngredientFromLines(input)).toEqual(expected);
	});

	it('should extract Ingredients from Lines and remove "-"', () => {
		const input = ['- 500 Gramm Mehl', '- 1 Tasse Zucker', '- 1 Tasse Milch'];
		const expected = [
			{ name: 'Mehl', amount: 500, unit: 'Gramm' },
			{ name: 'Zucker', amount: 1, unit: 'Tasse' },
			{ name: 'Milch', amount: 1, unit: 'Tasse' }
		];
		expect(extractIngredientFromLines(input)).toEqual(expected);
	});

	it('should extract Ingredients from Lines', () => {
		const input = ['500 Gramm Mehl', '1 Tasse Zucker', '1 Tasse Milch'];
		const expected = [
			{ name: 'Mehl', amount: 500, unit: 'Gramm' },
			{ name: 'Zucker', amount: 1, unit: 'Tasse' },
			{ name: 'Milch', amount: 1, unit: 'Tasse' }
		];
		expect(extractIngredientFromLines(input)).toEqual(expected);
	});

	it('should extract Ingredients from a text', () => {
		const input =
			'Zutaten\n500 Gramm Mehl\n1 Tasse Zucker\n1 Tasse Milch\nHier ist eine Rezeptbeschreibung\nund noch mehr Text.\nUnd noch mehr Text.';
		const expected = [
			{ name: 'Mehl', amount: 500, unit: 'Gramm' },
			{ name: 'Zucker', amount: 1, unit: 'Tasse' },
			{ name: 'Milch', amount: 1, unit: 'Tasse' }
		];
		expect(extractIngredientsFromText(input)).toEqual(expected);
	});

	it("should extract Ingredients with '.' decimal amount", () => {
		const input = '1.5 cups of sugar\n1.5 cups of flour\n1.5 cups of milk';
		const expected = [
			{ name: 'sugar', amount: 1.5, unit: 'cups' },
			{ name: 'flour', amount: 1.5, unit: 'cups' },
			{ name: 'milk', amount: 1.5, unit: 'cups' }
		];
		expect(extractIngredientsFromText(input)).toEqual(expected);
	});

	it("should extract Ingredients with ',' decimal amount ", () => {
		const input = '1,5 cups of sugar\n1,5 cups of flour\n1,5 cups of milk';
		const expected = [
			{ name: 'sugar', amount: 1.5, unit: 'cups' },
			{ name: 'flour', amount: 1.5, unit: 'cups' },
			{ name: 'milk', amount: 1.5, unit: 'cups' }
		];
		expect(extractIngredientsFromText(input)).toEqual(expected);
	});
});
