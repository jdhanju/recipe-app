const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg')

const PORT = 8080;

pool = new Pool({
    user: 'postgres',
    host: 'db',
    password: 'root'
})

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    } else {
        console.log("working");
    }
});

//enabling cors policy
app.use(cors())

app.use(bodyParser.json());


async function createTables() {
    // Create the "recipes" table
    await pool.query(`CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        directions VARCHAR(255),
        timeLastModified TIMESTAMP DEFAULT NOW()
    )`);

    // Create the "ingredients" table
    await pool.query(`CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INT REFERENCES recipes(id),
        ingredient VARCHAR(255)
    )`);
}

app.get('/', function(req, res) {
    res.send(res.status);
})

app.post('/add-recipe', async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let name = req.body.name;
    let ingredients = req.body.ingredients;
    let directions = req.body.directions;

    try {
        //need to create database in docker

        //create the tables
        await createTables();

        const addRecipeQuery = `
            INSERT INTO recipes (name, directions) 
            VALUES ($1, $2) 
            RETURNING id`;

        const result = await pool.query(addRecipeQuery, [name, directions]);
        console.log(result.rows);
        const recipeId = result.rows[0].id;

        // Insert the ingredients into the "ingredients" table
        const addIngredientsQuery = `
            INSERT INTO ingredients (recipe_id, ingredient) 
            VALUES ($1, $2)
        `;

        const result2 = await pool.query(addIngredientsQuery, [recipeId, ingredients]);

        res.send("Data sent!");

    } catch (error) {
        res.send(error);
    }
})

app.get('/get-recipes', async function(req, res) {
    //create the tables
    await createTables();

    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');

    const fetchRecipesQuery = `
        SELECT r.id, r.name, r.directions, r.timeLastModified, i.ingredient
        FROM recipes AS r
        LEFT JOIN ingredients AS i ON r.id = i.recipe_id
    `;

    try {
        const result = await pool.query(fetchRecipesQuery);
        console.log("my data:");
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the recipes.');
    }
})

app.delete('/delete-recipe/:recipeID', async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');

    try {
        const recipeName = req.params.recipeID;

        // Delete the recipe from the "recipes" table
        const deleteRecipeQuery = `
            DELETE FROM recipes
            WHERE id = $1
        `;

        // Delete the associated ingredients from the "ingredients" table
        const deleteIngredientsQuery = `
            DELETE FROM ingredients
            WHERE recipe_id IN (
                SELECT id FROM recipes WHERE id = $1
            )
        `;

        await pool.query(deleteIngredientsQuery, [recipeName]); //we need to delete the ingredient first since it is dependant on recipe
        await pool.query(deleteRecipeQuery, [recipeName]);
        res.send("Recipe deleted successfully!");
    } catch (error) {
        res.status(500).send('An error occurred while deleting the recipe.');
    }
});

app.put('/update-recipe/:id/:recipeName/:recipeIngredients/:recipeDirections', async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');

    try {
        const id = req.params.id;
        const recipeName = req.params.recipeName;
        const recipeIngredients = req.params.recipeIngredients;
        const recipeDirections = req.params.recipeDirections;

        // Update the recipe in the "recipes" table
        const updateRecipeQuery = `
        UPDATE recipes
        SET name = $1, directions = $2, timeLastModified = NOW()
        WHERE id = $3
      `;
        await pool.query(updateRecipeQuery, [recipeName, recipeDirections, id]);

        // Update the ingredients in the "ingredients" table
        const updateIngredientsQuery = `
        UPDATE ingredients
        SET ingredient = $1
        WHERE recipe_id = $2
      `;
        await pool.query(updateIngredientsQuery, [recipeIngredients, id]);

        res.send("Recipe updated successfully!");
    } catch (error) {
        res.status(500).send('An error occurred while updating the recipe.');
    }
});





app.listen(PORT, '0.0.0.0')
console.log(`Running on port ${PORT}`)