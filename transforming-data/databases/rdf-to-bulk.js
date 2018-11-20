'use strict'
const fs = require('fs');
const dir = require('node-dir');
const parseRDF = require('./lib/parse-rdf.js');

const dirname = process.argv[2];

const options = {
    match: /|.rdf$/,
    exclude: ['pg0.rdf'] //ignore the template rdf file, id = 0.
};

dir.readFiles(dirname, options, (err, content, next) => {
    if (err) throw err;
    const rdf = parseRDF(content);
    console.log(JSON.stringify({ "index": { "_id": `pg${rdf.id}` } }));
    console.log(JSON.stringify(rdf));
    next();
});