/* This file is part of the Readability2 project.
 * https://github.com/mvasilkov/readability2
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */
import SAXParser from 'parse5-sax-parser'

import { Readability } from '../Readability'
import { autoclose } from '../grouping'

export function connect(r: Readability, parser: SAXParser) {
    parser.on('startTag', function ({ tagName, attrs, selfClosing }) {
        r.onopentag(tagName)
        attrs.forEach(attr => r.onattribute(attr.name, attr.value))
        if (selfClosing || autoclose.has(tagName))
            r.onclosetag(tagName)
    })

    parser.on('endTag', function ({ tagName }) {
        autoclose.has(tagName) || r.onclosetag(tagName)
    })

    parser.on('text', function ({ text }) {
        r.ontext(text)
    })
}
