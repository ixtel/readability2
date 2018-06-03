export const badMultiplier = 0.1

export const rejectScore = 9

export const rootMultiplier = 0.999

const a = [' ', '\t', '\r', '\n', '\u00a0']
const space = RegExp(`(?:${a.join('|')}){2,}`, 'g')

const b = ['-', '_']
const comment = RegExp(`^comment(?=${b.join('|')})`)

export const regexp = {
    space,
    comment,
}
