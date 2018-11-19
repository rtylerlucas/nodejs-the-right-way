'use strict'
const zmq = require('zeromq');
const filename = process.argv[2];

const requester = zmq.socket('req');

//handle response
requester.on('message', data => {
    const response = JSON.parse(data);
    console.log('Recieved response:', response);
});

requester.connect('tcp://localhost:60401');

//Send a request
for (let i = 0; i <= 5; i++) {
    console.log(`Sending request ${i} for ${filename}`);
    requester.send(JSON.stringify({ path: filename }));
}