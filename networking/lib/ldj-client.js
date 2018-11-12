'use strict'
const EventEmitter = require('events').EventEmitter
class LdjClient extends EventEmitter {
    constructor(stream) {
        super();
        let buffer = '';
        stream.on('data', data => {
            buffer += data;
            let boundry = buffer.indexOf('\n');
            while (boundry !== -1) {
                const msg = buffer.substring(0, boundry);
                this.emit('message', JSON.parse(msg));
                buffer = buffer.substring(boundry + 1);
                boundry = buffer.indexOf('\n');
            }
        });
    }

    static connect(stream) {
        return new LdjClient(stream);
    }
}

module.exports = LdjClient;