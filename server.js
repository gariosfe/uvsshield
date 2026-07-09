const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const db = new sqlite3.Database('./database.db');
const TELEGRAM_TOKEN = "8208721144:AAEug0fTJ11fXdb-GFFvzTSX1b7Qn6Vujoo";
const TELEGRAM_CHAT_ID = "-1004354445309";

let ultimaAlerta = false;

async function enviarTelegram(uv){

    let riesgo = "";

    if(uv <= 2){
        riesgo = "🟢 Bajo";
    }
    else if(uv <=5){
        riesgo = "🟡 Moderado";
    }
    else if(uv <=7){
        riesgo = "🟠 Alto";
    }
    else if(uv <=10){
        riesgo = "🔴 Muy Alto";
    }
    else{
        riesgo = "🟣 Extremo";
    }

    const mensaje =
`⚠ *UVShield - Alerta de Radiación UV*

☀ Índice UV: *${uv}*

Nivel de Riesgo:
${riesgo}

Se recomienda:

✅ Usar protector solar
🧢 Utilizar gorra o sombrero
😎 Usar gafas con protección UV
🌳 Evitar exposición prolongada al sol`;

    try{

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: mensaje,
                parse_mode: "Markdown"
            }
        );

        console.log("Alerta enviada a Telegram");

    }
    catch(error){

        console.log("Error Telegram:");

        if(error.response){
            console.log(error.response.data);
        }else{
            console.log(error.message);
        }

    }

}

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

    //=========================
    // ALERTA TELEGRAM
    //=========================

    if(uv >= 0){

        if(!ultimaAlerta){

            enviarTelegram(uv);

            ultimaAlerta = true;

        }

    }
    else{

        ultimaAlerta = false;

    }

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



