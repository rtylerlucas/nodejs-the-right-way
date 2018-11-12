'use strict'
const net = require('net');
const client = require('./lib/line-delimited-json-client.js')
    .connect(net.connect({ port: 60300 }));

client.on('message', message => {
    if (message.type === 'watching') {
        console.log(`Now watching ${message.file}`);
    } else if (message.type === 'changed') {
        console.log(`File changed: ${new Date(message.timestamp)}`)
    } else {
        console.log(`Unsupported message type: ${message.type}`);
    }
});