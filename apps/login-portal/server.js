/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

'use strict';

const express = require('express');
const ip = require('ip');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');

const server = express();
const config = {
    "protocol": "http",
    "host": "localhost",
    "port": 3001
};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

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
    if (request.body.username === '' || request.body.password === '') {
        response.status(204).send({
            valid: false,
            message: 'Username or password cannot be empty',
            data: ''
        });
        return;
    } else {
        const endpoint = "https://localhost:9443/scim2/Me";
        const header = {
            headers: {
                'Content-Type': 'application/scim+json',
                "Accept": 'application/json'
            },
            auth: {
                username: request.body.username,
                password: request.body.password
            }
        };

        axios.get(endpoint, header)
            .then((endpointResponse) => {
                if (endpointResponse.status === 200) {
                    response.status(200).send({
                        data: endpointResponse.data,
                        message: 'Valid credentials',
                        status: endpointResponse.status
                    });
                } else {
                    console.error(endpointResponse.status);
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    response.status(200).send({
                        data: error.response.data,
                        message: 'Invalid username or password',
                        status: error.response.status

                    });
                } else {
                    console.error(error.response.status);
                }
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
