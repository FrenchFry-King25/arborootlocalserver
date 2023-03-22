const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const WebSocket = require('ws');

const wss = new WebSocket.Server({server: server});

console.log('script open')

wss.on('connection', function connection(ws) {
    console.log("CLIENT CONNECTED");
    ws.send('welcome to my web socket server');

    ws.on('message', function incoming(message) {
        console.log('recieved: %s', message);
        ws.send('got your messages');
    });
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname+"/index.html"));
})

//SETTING UP SERIAL MONITOR CONNECTION - read from arduino
//VIEW CODE localhost:3000 (you can change the number)
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
