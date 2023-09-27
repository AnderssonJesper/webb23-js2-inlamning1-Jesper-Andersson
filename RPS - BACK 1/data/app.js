const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const fs = require('fs');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

function getHighscores() {
    const highscoresData = fs.readFileSync('./data/highscores.json');
    return JSON.parse(highscoresData);
}

function saveHighscores(highscores) {
    const highscoresData = JSON.stringify(highscores, null, 4);
    fs.writeFileSync('./data/highscores.json', highscoresData);
}



app.get('/highscores', (req, res) => {
    const highscores = getHighscores();
    res.json(highscores);
});

app.post('/addScore', (req, res) => {
    const playerName = req.body.playerName;
    const playerScore = req.body.score;

    const highscores = getHighscores();

    highscores.push({ name: playerName, score: playerScore });
    highscores.sort((a, b) => b.score - a.score);
    highscores.splice(5);

    saveHighscores(highscores);

    res.status(201).json(highscores);
});

function resetHighscores() {
    const initialHighscores = [
        { name: "Spelare 1", score: 0 },
        { name: "Spelare 2", score: 0 },
        { name: "Spelare 3", score: 0 },
        { name: "Spelare 4", score: 0 },
        { name: "Spelare 5", score: 0 }
    ];
    saveHighscores(initialHighscores);
}


app.delete('/resetHighscores', (req, res) => {
    resetHighscores();
    res.status(200).json({ message: 'Highscores reset to initial state.' });
});
const port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log('Servern lyssnar på 3000...');
});



