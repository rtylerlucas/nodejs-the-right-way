'use strict'
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LdjClient = require('../lib/ldj-client.js');
describe('LdjClient', () => { //name the context for our tests
    let stream = null;
    let client = null;

    beforeEach(() => { //fresh instances
        stream = new EventEmitter();
        client = new LdjClient(stream);
    });
    //it() tests specific behavior of the class
    //done callback Mocha provides to signal test has finished.
    //we fill in the done callback
    //invoke done() when your test is complete.
    //invoke done(error) if test fails.
    it('should emit a single message from a single data event', done => { 
        // test body
        client.on('message', message => {
            assert.deepEqual(message, { foo: 'bar' });
            done();
        });
        stream.emit('data', '{"foo":"bar"}\n');
    });

    it('should emit single message from a split data event', done => {
        client.on('message', message => {
            assert.deepEqual(message, { foo: 'bar' });
            done();
        });
        stream.emit('data', '{"foo":"b');
        // setTimeout(() =>  stream.emit('data', 'ar"}\n'), 10);
        process.nextTick(() => stream.emit('data', 'ar"}\n'));
        //nextTick() will execute before the next spin of the event loop. 
        //By contrast, setTimeout() will wait for the event loop to spin at least once.
    });
});