'use strict'
const fs = require('fs');
const parseRDF = require('./lib/parse-rdf.js');

const rdf = fs.readFileSync(process.argv[2]);
console.log(JSON.stringify(parseRDF(rdf), null, '  '));
