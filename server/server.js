const express = require('express');
const serveIndex = require('serve-index');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'recipes',
    password: 'password'
})

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


app.listen(8080, function() {
    console.log(`app is running on port 8080`);
})