import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeGrid = ({ recipes, onRecipeClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.5rem'
    }}>
      {recipes.map((recipe) => (
        <div 
          key={recipe.id} 
          onClick={() => onRecipeClick && onRecipeClick(recipe)}
          style={{ cursor: 'pointer' }}
        >
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;
