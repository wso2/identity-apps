'use strict';

const express = require('express');
const ip = require('ip');
const cors = require('cors');
const session = require('express-session');

const server = express();
const config = {
    "protocol": "http",
    "host": "localhost",
    "port": 3001
};
server.use(cors());
server.use(express.json());
server.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));
server.listen(config.port);

server.post('/auth', (request, response) => {
    if (request.body.username === 'admin' && request.body.password === 'admin') {

        response.status(200).send({
            valid: true,
            message: 'Valid credentials'
        });
    } else if (request.body.username === '' || request.body.password === '') {
        response.status(204).send({
            valid: false,
            message: 'Empty credentials'
        });
    } else {
        response.status(200).send({
            valid: false,
            message: 'Invalid credentials'
        });
    }
});

server.get('/user', (request, response) => {
    if (request.body.username === 'admin') {
        response.status(200).send({
            user: 'admin',
            domain: 'wso2',
            displayName: 'Administrator',
            telephone: '+94 11 895 8900'
        });
    } else if (request.body.username === 'jerad') {
        response.status(200).send({
            user: 'jerad',
            domain: 'wso2',
            displayName: 'Jerad Rutnam',
            telephone: '+94 11 895 8900'
        });
    } else {
        response.status(200).send({
            valid: false,
            message: 'No results found'
        });
    }
});

console.log('Server started!');
console.log(' ');
console.log('You can now use the server at below url.');
console.log(' ');
console.log('  Local:            ' + config.protocol + '://' + config.host + ':' + config.port + '/');
console.log('  On Your Network:  ' + config.protocol + '://' + ip.address() + ':' + config.port + '/');
console.log(' ');
