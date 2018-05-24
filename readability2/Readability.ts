import { Cleaner } from './Cleaner'
import { IReader } from './IReader'
import { Reader } from './Reader'
import { INode } from './INode'
import { normalizeSpace } from './functions'

export class Readability {
    readonly reader: IReader

    readonly onopentag: (name: string) => void
    readonly onclosetag: (name: string) => void
    readonly onattribute: (name: string, value: string) => void
    readonly ontext: (content: string) => void

    _needle: { node: INode, sum: number } | null = null

    _cleaner: Cleaner | undefined

    constructor() {
        const r = this.reader = new Reader

        this.onopentag = r.onopentag.bind(r)
        this.onclosetag = r.onclosetag.bind(r)
        this.onattribute = r.onattribute.bind(r)
        this.ontext = r.ontext.bind(r)
    }

    compute() {
        const { root } = this.reader
        const needle: { node: INode, sum: number } = { node: root, sum: 0 }
        root.compute(needle)
        return this._needle = needle
    }

    clean(): string {
        if (this._needle == null)
            return ''

        if (this._cleaner == null)
            this._cleaner = new Cleaner(this._needle.node)

        return normalizeSpace(this._cleaner.root.toString())
    }
}
