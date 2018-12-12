#!/usr/bin/env node

/* This file is part of the Readability2 project.
 * https://github.com/mvasilkov/readability2
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readability2 = require('./cli')
const compare = require('./compare')
const repair = require('./repair')
const report = require('./report')
const { hasSuffix, lsFiles, Score, testingString } = require('./utils')

const PAGES_DIR = `${__dirname}/../r2_test_pages`

const results = new Score

/* Usage: runtests.js [-b] [-t NAME] [-v]
 * -b       | Use Readability2 from build/readability2.min.js
 * -t NAME  | Run tests containing NAME
 * -v       | Verbose */
let argv = {}

function titleMatches(a, b) {
    return a.split('===', 1)[0] == b.split('===', 1)[0]
}

function comparePage(filename, done) {
    readability2(filename + '.repair', argv.b, function (err, filename, r) {
        const name = path.basename(filename, '.html.repair')
        console.log(`* ${name}.html`)

        const out = testingString(r)
        const ref = fs.readFileSync(`${PAGES_DIR}/txt/${name}.txt`, { encoding: 'utf8' })
        results.put(name, compare(ref, out, argv.v), titleMatches(ref, out))
        if (typeof done == 'function') done(null, filename)
    })
}

function run() {
    const _repair = promisify(repair)
    const _comparePage = promisify(comparePage)

    const files = lsFiles(`${PAGES_DIR}/html`).filter(hasSuffix('.html'))
    .filter(a => argv.t ? a.includes(argv.t) : true)

    Promise.all(files.map(filename => _repair(filename).then(_comparePage)))
    .then(function () {
        const saved = new Score(PAGES_DIR).load()
        results.save()
        report(saved.results, results.results, true)
    })
}

if (require.main === module) {
    argv = require('yargs-parser')(process.argv.slice(2))
    run()
}
