#!/usr/bin/env node

const util = require('util');

const request = require('request-promise-native');
const Mercury = require('@postlight/mercury-parser');
const nodePandoc = require('node-pandoc');

// node-pandoc is a function which takes a callback, but i want to use a promise
const pandoc = util.promisify(nodePandoc);

var testUrl = 'https://www.theguardian.com/technology/2019/nov/21/how-our-home-delivery-habit-reshaped-the-world';

request(testUrl).then(function (body) {
    return Mercury.parse(testUrl, {
        html: Buffer.from(body, "utf-8"),
    });
}).then(function (result) {
    var filename = `${result.title} [${result.domain}].docx`;
    var args = ['-f', 'html', '-t', 'docx', '-o', filename];
    console.log('saving file to', filename);
    return pandoc(result.content, args);
});
