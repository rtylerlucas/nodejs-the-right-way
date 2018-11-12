'use strict'
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];

if (!filename) {
    throw Error('Must specify a file!');
}

net.createServer(connection => {
    console.log('Subscriber connected!');
    connection.write(JSON.stringify({type: 'watching', file: filename}) + '\n');

    //fs.watch() evokes the callback on files changes
    const watcher = fs.watch(filename, () =>
        connection.write(JSON.stringify({ type: 'changed', timestamp: Date.now() }) + '\n'));

    connection.on('close', () => {
        console.log('Subscriber disconnected.');
        watcher.close();
    })
    //listen binds to port
}).listen(60300, () => console.log('Awaiting subscribers...'));
