const { bold, italic } = require(`chalk`)
const format = require(`../format`)

const longString = `This is a very long string that will require some line breaking formating with a long URL for good mesure: http://test.com/with/a/very/long/address`

function splitString (length) {
  const rgx = new RegExp(`.{0,${length - 2}}(?:$|\\s|/)`, `g`)
  return longString.match(rgx).slice(0, -1)
}

describe(`log::format`, () => {
  it(`format(string, rawString, null, number)`, () => {
    const length = Math.round(30 + Math.random() * 50)
    const prefix = Math.round(10000000 + Math.random() * 9999999).toString(36).toUpperCase() + `: `
    const glue = `\n` + ` `.repeat(prefix.length)
    const result = `${prefix}${splitString(length - prefix.length).join(glue)}`

    const output = format(longString, prefix, null, length)

    expect(output).toEqual(result.split(`\n`))
  })

  it(`format('\\n', rawString, null, number)`, () => {
    const length = Math.round(30 + Math.random() * 50)
    const prefix = Math.round(10000000 + Math.random() * 9999999).toString(36).toUpperCase() + `: `
    const glue = ` `.repeat(prefix.length)

    const output = format(`\n`, prefix, null, length)

    expect(output).toEqual([
      prefix,
      glue
    ])
  })

  it(`format(string, formatedString, null, number)`, () => {
    const length = Math.round(30 + Math.random() * 50)
    const prefix = Math.round(10000000 + Math.random() * 9999999).toString(36).toUpperCase() + `: `
    const glue = `\n` + ` `.repeat(prefix.length)
    const result = `${bold(prefix)}${splitString(length - prefix.length).join(glue)}`

    const output = format(longString, bold(prefix), null, length)

    expect(output).toEqual(result.split(`\n`))
  })

  it(`format(string, formatedString, formater, number)`, () => {
    const length = Math.round(30 + Math.random() * 50)
    const prefix = Math.round(10000000 + Math.random() * 9999999).toString(36).toUpperCase() + `: `
    const glue = `\n` + ` `.repeat(prefix.length)
    const result = `${bold(prefix)}${splitString(length - prefix.length).map(s => italic(s)).join(glue)}`

    const output = format(longString, bold(prefix), italic, length)

    expect(output).toEqual(result.split(`\n`))
  })
})
