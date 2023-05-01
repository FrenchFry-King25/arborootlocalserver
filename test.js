const comPath = "COM28" //set this

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server });


const static_files = express.static("static");
app.use(static_files);

console.log('script open')

const port = new SerialPort({
    path: comPath, //replace with your port (look on the arduino app)
    baudRate: 9600,
})

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

wss.on('connection', function connection(ws) {
    console.log("CLIENT CONNECTED");
    ws.send('welcome to my web socket server');

    ws.on('message', function incoming(message) {
        console.log('recieved: %s', message);

        port.write(message, (err) => {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });

    });

    parser.on('data', (data) => {
        ws.send(data.toString());
    });
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/test.html"));
})

//SETTING UP SERIAL MONITOR CONNECTION - read from arduino
//VIEW CODE localhost:3000 (you can change the number)
server.listen(80, () => {
    console.log('Server listening on port 80');
});





