#!/usr/bin/env node

const util = require('util');

const request = require('request-promise-native');
const Mercury = require('@postlight/mercury-parser');
const nodePandoc = require('node-pandoc');

// node-pandoc is a function which takes a callback, but i want to use a promise
const pandoc = util.promisify(nodePandoc);

async function renderArticle(inputUrl) {
    try {
        var body = await request(inputUrl);
        return await Mercury.parse(inputUrl, {
            html: Buffer.from(body, "utf-8"),
        });
    } catch(err) {
        throw err;
    }
}

async function pandocToFile(article, filename) {
    try {
        filename = filename || `${article.title}.docx`;
        var args = ['-f', 'html', '-t', 'docx', '-o', filename];
        await pandoc(article.content, args);
        return filename;
    } catch(err) {
        throw err;
    }
}

if (process.argv.length <= 2) {
    console.log('call this with a URL to fetch');
    return;
}

var url = process.argv[2];

renderArticle(url).then(function(result) {
    return pandocToFile(result);
}).then(function(filename) {
    console.log('file written to:', filename);
}).catch(function(err) {
    console.log('ERROR:', err);
});
