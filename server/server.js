var express = require('express');
var serveIndex = require('serve-index');
var app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

//enabling cors policy
app.use(cors())

app.use(bodyParser.json());

app.post('/add-recipe', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let data = req.body;
    console.log(data);
    res.send(JSON.stringify(data));
})


app.listen(8080, function() {
    console.log(`app is running on port 8080`);
})