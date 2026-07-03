const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS uv_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uv_value INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});


const mqtt = require('mqtt');

const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
    console.log("MQTT conectado");

    mqttClient.subscribe('uvshield/uv');
});


mqttClient.on('message', (topic, message) => {

    const uv = parseInt(message.toString());

    db.run(
        'INSERT INTO uv_data(uv_value) VALUES(?)',
        [uv]
    );

    console.log(`UV recibido: ${uv}`);
});


const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/api/uv', (req, res) => {

    db.all(
        'SELECT * FROM uv_data ORDER BY id DESC LIMIT 50',
        [],
        (err, rows) => {
            res.json(rows);
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor iniciado");
});
