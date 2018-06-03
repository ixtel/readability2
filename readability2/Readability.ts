import { IContainerNode, IReader } from './types'
import { Cleaner } from './Cleaner'
import { Reader } from './Reader'
import { normalizeSpace } from './functions'

export class Readability {
    readonly reader: IReader

    readonly onopentag: (name: string) => void
    readonly onclosetag: (name: string) => void
    readonly onattribute: (name: string, value: string) => void
    readonly ontext: (content: string) => void

    private _result: { node: IContainerNode, sum: number } | null = null

    private _cleaner?: Cleaner

    constructor() {
        const r = this.reader = new Reader

        this.onopentag = r.onopentag.bind(r)
        this.onclosetag = r.onclosetag.bind(r)
        this.onattribute = r.onattribute.bind(r)
        this.ontext = r.ontext.bind(r)
    }

    compute() {
        const { root } = this.reader
        const result = { node: root, sum: 0 }
        root.compute(result)
        return this._result = result
    }

    clean(): string {
        if (this._result == null)
            return ''

        if (this._cleaner == null)
            this._cleaner = new Cleaner(this._result.node)

        return normalizeSpace(this._cleaner.root.toString())
    }
}