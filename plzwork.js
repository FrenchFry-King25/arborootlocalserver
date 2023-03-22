const { SerialPort } = require('serialport')

// Create a port
const port = new SerialPort({
  path: 'COM10',
  baudRate: 9600,
})


port.on("open", function() {
  console.log("-- Connection opened --");
  port.on("data", function(data) {
    console.log("Data received: " + data);
  });
});