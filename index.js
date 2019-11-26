#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const url = require('url');
const util = require('util');

const request = require('request-promise-native');
const Mercury = require('@postlight/mercury-parser');
const nodePandoc = require('node-pandoc');
const tempy = require('tempy');

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

const server = http.createServer(async function (req, res) {
    var url = new URL(req.url, 'http://tonberry.quietmisdreavus.net:8080/');
    if (url.pathname == '/article') {
        var articleUrl = url.searchParams.get('url');
        if (articleUrl) {
            try {
                var result = await renderArticle(articleUrl);
                var outputFilename = `${result.title}.docx`;
                var tempFilename = tempy.file({ extension: 'docx' });
                var filename = await pandocToFile(result, tempFilename);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('Content-Disposition', `inline; filename="${outputFilename}"`);
                var readStream = fs.createReadStream(filename);
                readStream.pipe(res);
            } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`something happened:\n${err}`);
            }
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('hi, what?\n');
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('hi, what?\n');
    }
});

const hostname = '0.0.0.0';
const port = 8080;

server.listen(port, hostname, function () {
    console.log(`server online at http://${hostname}:${port}/`);
});
