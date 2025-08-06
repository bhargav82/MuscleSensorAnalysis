// External Libraries
import { GoogleGenerativeAI } from '@google/generative-ai'
import express from 'express';
import cors from 'cors';
import SerialPort from 'serialport';
import { ReadlineParser  } from '@serialport/parser-readline';
import dotenv from 'dotenv';
dotenv.config();


// Setup Express server
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());


// Global Variables
let emgData = [];
let recording = false;

const apiKey = process.env.NEW_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI("AIzaSyC3huuErkJWPkb-WSbEXmxSdSvdlS3T5kQ");

const model = ai.getGenerativeModel({model: "gemini-1.5-flash"})



// SerialPort setup - to read in values (until a new line) from Arduino microcontroller through port
const serial = new SerialPort.SerialPort({path: '/dev/tty.usbserial-110', baudRate: 115200});
const parser = new ReadlineParser({delimiter: '\n'});
serial.pipe(parser)


// Check if SerialPort was successfully opened
serial.on('open', () =>
{
    console.log("Serial port is open.");
});

serial.on('error', (err) => 
{
    console.log(err.message);
});


// Continously read in data
parser.on('data', (line) =>
{
    
    if (recording)
    {
        console.log("Started logging.");
        const inputClean = line.trim();
        const inputArray = inputClean.split(" ");
        const timestamp = parseInt(inputArray[0]);
        const value = parseInt(inputArray[1]);

        emgData.push({timestamp, value});
    }

});



// Start Recording
app.post('/start', (request, response) =>
{
    
    emgData = [];
    recording = true;

    console.log("Started recording.");
    response.sendStatus(200);
})

// Stop Recording
app.post('/stop', (request, response) =>
{
    recording = false;

    console.log("Stopped Recording.");
    response.json(emgData);
})

app.post('/callGemini', async (request, response)  =>
{
    // Follow Gemini docs to get a AI response and then return it

    try
    {
        const prompt = ` I am a 20 year old who exercises 4-5x a week. I eat a strict diet, no sugar and only organic food.
                    These are my emg results after placing on my forearm and squeezing a few times for a few seconds.
                    The data is has the time in ms with the first value being the starting point.
                    The values are in mV. Please analyze this data and report an accurate response.` + JSON.stringify(emgData); 
        
        const aiAnswer = await model.generateContent(prompt);
        
        response.send(aiAnswer.response.text());
    } 
    catch (err)
    {
        console.log(err);
    }
    
    
})


// Starts Server at port 3001
app.listen(port, () =>
{
    console.log("Express is on at port: ", port);
});