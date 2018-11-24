'use strict'
const fs = require('fs');
const request = require('request');
const program = require('commander'); //program is Commander object, very useful for making CLI tools.
const pkg = require('./package.json');

const fullUrl = (path = '') => {
    let url = `http://${program.host}:${program.port}/`;
    if (program.index) {
        url += program.index + '/';
        if (program.type) {
            url += program.type + '/';
        }
    }
    return url + path.replace(/^\/*/, '');
};

// Commander module makes it easy to create a CLI 
program
    .command('url [path]')
    .description('generate the URL for the options and path (default is /)')
    .action((path = '/') => console.log(fullUrl(path)));

program
    .command('get [path]')
    .description('perform GET operation for path (default is /)')
    .action((path = '/') => {
        const options = {
            url: fullUrl(path),
            json: program.json, //trailing commas in JS are allowed, faciliate cleaner pull requests if the object is extended.
        };
        request(options, printResponse);
    });

const printResponse = (err, res, body) => {
    if (program.json) {
        console.log(JSON.stringify(err || body));
    } else {
        if (err) throw err;
        console.log(body);
    }
}

program
    .command('create-index')
    .description('create an index')
    .action(() => {
        if (!program.index) {
            const errorMsg = 'No index specified! Use --index <name>';
            if (!program.json) throw Error(errorMsg);
            console.log(JSON.stringify({ error: errorMsg })); //wrapping error in json, if -j flag enabled.
            return;
        }
        request.put(fullUrl(), printResponse);
    });

program
    .command('list-indices')
    .description('list available indices')
    .alias('li')
    .action(() => {
        //execute this. get '_cat/indices?v'
        const listUrl = program.json ? fullUrl('_all') : fullUrl('_cat/indices?v');
        request({url: listUrl, json: program.json}, printResponse);
    })

program
    .command('bulk <file>')
    .description('read and perform bulk options from the specified file')
    .action(file => {
        fs.stat(file, (err, stats) => {
            if (err) {
                if (program.json) {
                    console.log(JSON.stringify(err));
                    return;
                }
                throw err;
            }
            const options = {
                url: fullUrl('_bulk'),
                json: true,
                headers: {
                    'content-length': stats.size,
                    'content-type': 'application/json',
                }
            };
            const req = request.post(options);
            const stream = fs.createReadStream(file);
            stream.pipe(req);
            req.pipe(process.stdout);
        });
    });

program
    .command('query [queries...]') //[queries...] tells Commander object we expect 0 or more objects
    .alias('q')
    .description('perform an Elasticsearch query (hitting the _search endpoint)')
    .action((queries = []) => {
        const options = { //options is the input object to the Request module
            url: fullUrl('_search'),
            json: program.json,
            qs: {},
        };
        if (queries && queries.length) { //exits and non-empty
            options.qs.q =queries.join(' ');
        }
        if (program.filter) {
            options.qs._source = program.filter; //_source is part of Elasticsearch's DSL.
        }
        request(options, printResponse);
    });

program
    .version(pkg.verson)
    .description(pkg.description)
    .usage('[options] <command> [...]')
    .option('-o, --host <hostname>', 'hostname [localhost]', 'localhost')
    .option('-p, --port <number>', 'port number [9200]', '9200')
    .option('-j, --json', 'format output as JSON')
    .option('-i, --index <name>', 'which index to use')
    .option('-t, --type <type>', 'default type for bulk operations')
    .option('-f, --filter <filter>', 'source filter for query results');

program.parse(process.argv);

if (!program.args.filter(arg => typeof arg === 'object').length) {
    program.help();
}