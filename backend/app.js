const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const config = require('./config');
const rds = require('./rds');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Routers
var createRouter = require('./routes/create');
var roomRouter = require('./routes/room');

// Error Handler
const errorHandler = (error, request, response, next) => {
    // Error handling middleware functionality
    console.log( `error ${error.message}`) // log the error
    const status = error.status || 500
    // send back an easily understandable error message to the caller
    response.status(status).json({ error: error.message });
}

app.use('/create', createRouter);
app.use('/room', roomRouter);
app.use(errorHandler);
  

app.get('/', (req, res) => {
    res.send('hello backend')
})

module.exports = app
