const { bold, italic } = require(`chalk`)
const stringify = require(`../stringify`)

describe(`log::stringify`, () => {
  it(`stringify(string, true)`, () => {
    const input = `Hello World!`
    const output = stringify(input, true)

    expect(output).toBe(input)
  })

  it(`stringify(string, false)`, () => {
    const input = `Hello World!`
    const output = stringify(input, false)

    expect(output).toBe(input)
  })

  it(`stringify(array, true)`, () => {
    const input = Array(Math.round(1 + Math.random() * 9))
    const output = stringify(input, true)

    expect(output).toBe(`${italic(`Array`)}::(${input.length})`)
  })

  it(`stringify(array<string>, false)`, () => {
    const input = Array(Math.round(1 + Math.random() * 9))
      .fill(0)
      .map((v, i) => `${i}`)

    const result = `${bold(`• `)}${italic(`Array`)}::(${input.length})\n${
      input.map(s => `${bold(`| `)}${s}`).join(`\n`)
    }`

    const output = stringify(input, false)

    expect(output).toBe(result)
  })

  it(`stringify(function, true)`, () => {
    const input = (str) => { console.log(str) }
    const output = stringify(input, true)

    expect(output).toBe(`${italic(`Function`)}::${input.name}(…${input.length})`)
  })

  it(`stringify(function, false)`, () => {
    const input = (str) => { console.log(str) }
    const output = stringify(input, false)

    expect(output).toBe(`${bold(`• `)}${italic(`Function`)}::${input.name}(…${input.length})\n${
      input.toString().split(`\n`).map(s => `${bold(`| `)}${s}`).join(`\n`)
    }`)
  })

  it(`stringify(object, true)`, () => {
    const input = { hello: `world` }

    // What if contructor doesn't exist!
    input.constructor = null

    const output = stringify(input, true)

    // Nailed it!
    expect(output).toBe(`${italic(`Object`)}::Object::(${Object.keys(input).length})`)
  })

  it(`stringify(object, false)`, () => {
    class Foo {
      constructor () {
        this.hello = `world`
      }
    }

    const input = new Foo()
    const output = stringify(input, false)

    expect(output).toBe(`${bold(`• `)}${italic(`Object`)}::Foo::(${Object.keys(input).length})\n${
      bold(`| `)}${italic.dim(`hello`)}: world`)
  })
})
