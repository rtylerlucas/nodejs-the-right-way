'use strict'
const zmq = require('zeromq');
const subscriber = zmq.socket('sub');

//Tells zeroMQ that we want to receive all messages.
//If you only want some messages, provide a string prefix.
//subscribe must be called some point in code in order to receive messages.
subscriber.subscribe('');

subscriber.on('message', data => {
    const message = JSON.parse(data);
    const date = new Date(message.timestamp);
    console.log(`File "${message.file}" changed at "${date}"`);
});

subscriber.connect("tcp://localhost:60400");