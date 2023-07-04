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

app.post('/add-recipe', async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let name = req.body.name;
    let ingredients = req.body.ingredients;
    let directions = req.body.directions;

    console.log(req.body);
    try {
        //await pool.query(`CREATE TABLE IF NOT EXISTS recipe (name varchar(255),ingredients varchar(255),directions varchar(255))`);
        var addRecipeQuery = `INSERT INTO recipe values ($1,$2,$3)`;
        await pool.query(addRecipeQuery, [name, ingredients, directions]);
        // const res = await pool.query(`SELECT now()`);
        // console.log(res.rows);
        res.send(JSON.stringify(data));
    } catch (error) {
        res.send(error);
    }
})

app.get('/get-recipes', async function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    var allUsersQuery = `SELECT * FROM recipe`
    pool.query(allUsersQuery, (err, result) => {
        if (err) {
            res.end(err)
        }
        console.log(result.rows);
        res.json(result.rows);
    })
})


app.listen(8080, function() {
    console.log(`app is running on port 8080`);
})