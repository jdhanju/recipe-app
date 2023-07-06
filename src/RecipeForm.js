import React from 'react';

const RecipeForm = ({ newRecipe, handleInputChange, handleFormSubmit }) => {
  return (
    <form className="mainForm" onSubmit={handleFormSubmit}>
      <label className="formLabel">
        Recipe Name:
        <input
          type="text"
          name="name"
          value={newRecipe.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label className="formLabel">
        Ingredients:
        <textarea
          name="ingredients"
          value={newRecipe.ingredients}
          onChange={handleInputChange}
          required
        />
      </label>
      <label className="formLabel">
        Directions:
        <textarea
          name="directions"
          value={newRecipe.directions}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Add Recipe</button>
    </form>
  );
};

export default RecipeForm;
