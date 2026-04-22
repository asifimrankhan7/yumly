
import recipes from './src/data/recipes.json';
import fs from 'fs';

const recipeImagesContent = fs.readFileSync('./src/constants/recipe-images.ts', 'utf8');

const missingIds = [];
recipes.forEach(recipe => {
  if (!recipeImagesContent.includes(`"${recipe.id}":`)) {
    missingIds.push(recipe.id);
  }
});

if (missingIds.length > 0) {
  console.log('Missing IDs in RecipeImages:', missingIds);
} else {
  console.log('All IDs found!');
}
