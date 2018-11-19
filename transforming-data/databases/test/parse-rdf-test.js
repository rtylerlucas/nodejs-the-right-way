'use strict'

const fs = require('fs');
const expect = require('chai').expect;
const parseRDF = require('../lib/parse-rdf.js');

const rdf = fs.readFileSync(`${__dirname}/pg132.rdf`);

describe('parseRDF', () => {
    it('should be a function', () => {
        expect(parseRDF).to.be.a('function');
    });

    it('should parse RDF content', () => {
        const book = parseRDF(rdf);
        expect(book).to.be.an('object');
    })
});