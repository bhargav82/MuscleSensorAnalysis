// External Libraries
const express = require('express');
const cors = require('cors');
const SerialPort = require('serialport');
const ReadLine = require('readline');

// Set up Express server
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());


// Global Variables
let emgData = [];
let recording = false;


// SerialPort setup - to read in values (until a new line) from Arduino through port
const serial = new SerialPort.SerialPort({path: '/dev/tty.usbserial-110', baudRate: 115200});
const parser = new ReadLine({delimiter: '\n'});

serial.pipe(parser)

// Continously read in Data
parser.on('data', (line) =>
{
    if (recording)
    {
        const inputClean = line.trim();
        const inputArray = inputClean.split(" ");
        const timestamp = parseInt(inputArray[0]);
        const value = parseInt(inputArray[1]);

        emgData.push({timestamp, value});
    }

});


// Starts Server
app.listen(port, () =>
{
    console.log("Express is on at port: ", port);
});



// Start Recording
app.post("/start", (request, response))
{
    emgData = [];
    recording = true;

    console.log("Started recording.");
    response.sendStatus(200);
}

// Stop Recording
app.post("/stop", (request, response))
{
    recording = false;

    console.log("Stopped Recording.");
    response.json(emgData);
}
