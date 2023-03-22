const comPath = "COM23" //set this

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server });

const socket = new WebSocket('wss://www.arboroot.com');

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
        ws.send('got your messages');

        port.write(message, (err) => {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });

        socket.send(message);
    });

    parser.on('data', (data) => {
        ws.send(data.toString());
    });


    var t = 0;
    setInterval(() => {
        if(t > 10 && t < 21) {
            p = (t - 10) * 5
            ws.send("PRO" + p);
        } else if(t > 34 && t < 45) {
            p = ((t - 34) * 5) + 50;
            ws.send("PRO" + p);
        } if(t == 48) {t = 0}
        t++;
    }, 500)
})


socket.addEventListener('open', function (event) {
    console.log('opened communication to Director!!!!!!');
    
    parser.on('data', (data) => {
        socket.send(data.toString())
    });

    var t = 0;
    setInterval(() => {
        if(t > 10 && t < 21) {
            p = (t - 10) * 5
            socket.send("PRO" + p);
        } else if(t > 34 && t < 45) {
            p = ((t - 34) * 5) + 50;
            socket.send("PRO" + p);
        } if(t == 48) {
            t = 0;
            socket.send("PRO" + 00);
        }
        t++;
    }, 500)
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/dashboard.html"));
})

//SETTING UP SERIAL MONITOR CONNECTION - read from arduino
//VIEW CODE localhost:3000 (you can change the number)
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});





