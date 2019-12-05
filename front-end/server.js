const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (request, response) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log('starting express app');

const port = Number(process.env.REACT_APP_PRODUCTION_PORT) || 3007;

app.listen(port);
