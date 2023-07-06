import React, { useState, useEffect } from 'react';
import RecipeForm from './RecipeForm';
import RecipeList from './RecipeList';
import './App.css';

const App = () => {
  const [recipes, setRecipes] = useState([]);

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    directions: ''
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8080/get-recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipes();
  }, []);

  const handleInputChange = (e) => {
    setNewRecipe({
      ...newRecipe,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/add-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newRecipe })
      });
      console.log(await response.json());
    } catch (error) {
      console.log(error);
    }

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
      <RecipeList recipes={recipes} setRecipes={setRecipes} />
    </div>
  );
};

export default App;
