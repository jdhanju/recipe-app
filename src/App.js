// App.js
import React, { useState, useEffect } from 'react';
import RecipeForm from './RecipeForm';
import RecipeList from './RecipeList';
import './App.css';

const App = () => {
  const [recipes, setRecipes] = useState(() => {
    return JSON.parse(localStorage.getItem('recipes')) || [];
  });
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    directions: ''
  });

  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleInputChange = (e) => {
    setNewRecipe({
      ...newRecipe,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setRecipes([...recipes, newRecipe]);
    setNewRecipe({
      name: '',
      ingredients: '',
      directions: ''
    });
  };

  return (
    <div className='App'>
      <RecipeForm
        newRecipe={newRecipe}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default App;
