/**
 * Provides API endpoints for searching the books index.
 */
'use strict';
const request = require('request');
const rp = require('request-promise');
module.exports = (app, es) => {
    const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

    /**
     * Search for books by matching particular field value.
     * Ex: /api/search/books/authors/Twain
     *  /api/search/books/title/Romeo%20and%20Juliet
     */
    app.get('/api/search/books/:field/:query', (req,res) => {
        const esReqBody = {
            size: 10,
            query: {
                match: {
                    [req.params.field]: req.params.query
                }
            },
        }
        const options = {url, json: true, body: esReqBody};
        request.get(options, (err, esRes, esResBody) => { //callback function to handle response
            if (err) {
                res.status(502).json({
                    error: 'bad_gateway',
                    reason: err.code,
                });
                return;
            }
            if (esRes.statusCode !== 200) {
                res.status(esRes.statusCode).json(esResBody);
                return;
            }
            res.status(200).json(esResBody.hits.hits.map(({_source}) => _source)); //deconstructing assignment: using pair of curly braces inside parameter to anonymous function, indicates we want to create a local variable of the same name with the same value.

        })
    });

    app.get('/api/suggest/:field/:query', (req, res) => {
        const esReqBody = {
            size: 0, //tells ES we don't want any matching documents returned, only suggestions.
            suggest: {
                suggestions: {
                    text: req.params.query,
                    term: {
                        field: req.params.field,
                        suggest_mode: 'always'
                    }
                }
            }
        };

        const options = {url, json: true, body: esReqBody};

        rp({url, json: true, body: esReqBody})
            .then(esResBody => res.status(200).json(esResBody.suggest.suggestions))
            .catch(({error}) => res.status(error.status || 502).json(error));
    });
}

