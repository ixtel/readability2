#!/usr/bin/env node

/* This file is part of the Readability2 project.
 * https://github.com/mvasilkov/readability2
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
const fs = require('fs')
const ParserStream = require('parse5-parser-stream')
const SerializerStream = require('parse5-serializer-stream')

function run(filename, done) {
    try {
        const a = fs.statSync(filename).mtimeMs
        const b = fs.statSync(filename + '.repair').mtimeMs

        if (a < b) {
            if (typeof done == 'function') done(null, filename)
            return
        }
    }
    catch (err) {
    }

    const infile = fs.createReadStream(filename, { encoding: 'utf8' })
    const parser = new ParserStream

    parser.once('finish', function () {
        const outfile = fs.createWriteStream(filename + '.repair', { encoding: 'utf8' })
        const writer = new SerializerStream(parser.document)

        outfile.once('finish', function () {
            if (typeof done == 'function') done(null, filename)
        })

        writer.pipe(outfile)
    })

    infile.pipe(parser)
}

if (require.main === module) {
    if (process.argv.length != 3) {
        console.log('Usage: repair.js FILE')
        return
    }
    run(process.argv[2])
}

module.exports = run
