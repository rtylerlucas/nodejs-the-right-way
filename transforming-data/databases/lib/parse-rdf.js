'use strict'
const cheerio = require('cheerio');
module.exports = rdf => {
    /*
     * $ function returned is much like JQuery selector.
     */
    const $ = cheerio.load(rdf);
    const book = {};
    //Note: the plus sign casts the result to a number.
    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', ''); // E.g: <pgterms:ebook rdf:about="ebooks/132">
    book.authors = $('pgterms\\:agent pgterms\\:name')
        .toArray() //converts cheerio collection to array of javascript objects
        .map(e => $(e).text()); //maps cheerio document nodes to string using cheerio's text() function.
    return book;
};