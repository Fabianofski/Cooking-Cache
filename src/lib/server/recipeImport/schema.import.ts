import axios from 'axios';
import type { Recipe } from '../../../models/Recipe';
import type SchemaRecipe from '../../../models/SchemaRecipe';
import * as cheerio from 'cheerio';
import { extractIngredientFromLines } from './ingredient.extractor';

export async function extractSchemaRecipe(url: string): Promise<Recipe> {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const script = $('script[type="application/ld+json"]');
    if (!script) throw new Error('No schema recipe found');

    let schemaRecipe: SchemaRecipe | undefined = undefined;
    for (let element of script) {
        // @ts-ignore
        const data = JSON.parse(element.children[0].data);

        if (data['@type'] === 'Recipe') {
            schemaRecipe = data;
            break;
        }
    }
    if (!schemaRecipe) throw new Error('No schema recipe found');

    const recipe: Recipe = {
        image: extractImageFromSchema(schemaRecipe.image),
        title: schemaRecipe.name,
        url: url,
        createdTime: schemaRecipe.datePublished,
        updatedTime: schemaRecipe.datePublished,
        difficulty: 'medium',
        ingredients: { "Default": extractIngredientFromLines(schemaRecipe.recipeIngredient) },
        description: extractDescriptionFromSchema(schemaRecipe.recipeInstructions),
        id: '',
        collectionId: '',
        creatorId: '',
        cookingTime: extractCookingTimeFromSchema(schemaRecipe.prepTime, schemaRecipe.cookTime, schemaRecipe.totalTime),
        numberOfServings: parseInt(schemaRecipe.recipeYield),
        tags: extractTagsFromSchema(schemaRecipe.keywords)
    };

    return recipe;
}

function extractImageFromSchema(schemaImage: any): string {
    if (typeof schemaImage === 'object') {
        return schemaImage[0];
    } else {
        return schemaImage;
    }
}

function extractDescriptionFromSchema(schemaInstructions: any): string[] {
    if (typeof schemaInstructions === 'string') {
        return schemaInstructions.split('\n').filter((line: string) => line !== '');
    } else if (typeof schemaInstructions === "object") {
        return schemaInstructions.map((instruction: any) => instruction.text);
    } else {
        return schemaInstructions;
    }
}

function extractCookingTimeFromSchema(schemaPrepTime: string, schemaCookTime: string, schemaTotalTime: string | undefined): number {
    schemaPrepTime = schemaPrepTime.replace('PT', '').replace('M', '');
    schemaCookTime = schemaCookTime.replace('PT', '').replace('M', '');
    
    if (schemaTotalTime) {
        schemaTotalTime = schemaTotalTime.replace('PT', '').replace('M', '');
        return parseInt(schemaTotalTime);
    } else return parseInt(schemaPrepTime) + parseInt(schemaCookTime);
}

function extractTagsFromSchema(schemaKeywords: any): string[] {
    if (typeof schemaKeywords === 'string') {
        return schemaKeywords.split(',').map((keyword: string) => keyword.trim());
    } else {
        return schemaKeywords;
    }
}
