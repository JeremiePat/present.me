const MY_ENV = process.env

describe(`l10n module function`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`Reuse unknown string as is`, () => {
    const l10n = require(`../index`)
    // As a function
    expect(l10n(`Basic string`)).toBe(`Basic string`)
    // As a template literal transformer
    expect(l10n`Basic string`).toBe(`Basic string`)
  })

  it(`Basic string conversion`, () => {
    const l10n = require(`../index`)
    l10n.data = {
      'Basic string': `Got basic string translation`
    }

    // As a function
    expect(l10n(`Basic string`)).toBe(`Got basic string translation`)
    // As a template literal transformer
    expect(l10n`Basic string`).toBe(`Got basic string translation`)
  })

  it(`Placeholder: Same position on target`, () => {
    const l10n = require(`../index`)
    l10n.data = {
      '%1 and %2 and %3': `%1 or %2 or %3`
    }

    const data = [`A`, `B`, `C`]

    // As a function
    expect(l10n(`%1 and %2 and %3`, ...data)).toBe(`A or B or C`)
    // As a template literal transformer
    expect(l10n`${data[0]} and ${data[1]} and ${data[2]}`).toBe(`A or B or C`)
  })

  it(`Placeholder: Different position on target`, () => {
    const l10n = require(`../index`)
    l10n.data = {
      '%1 and %2 and %3': `%3 or %1 or %2`
    }

    const data = [`A`, `B`, `C`]

    // As a function
    expect(l10n(`%1 and %2 and %3`, ...data)).toBe(`C or A or B`)
    // As a template literal transformer
    expect(l10n`${data[0]} and ${data[1]} and ${data[2]}`).toBe(`C or A or B`)
  })
})

describe(`l10n module sensibility to process.env.LANG`, () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...MY_ENV }
  })

  afterEach(() => {
    process.env = MY_ENV
  })

  it(`process.env.LANG === 'en'`, () => {
    process.env.LANG = `en`
    const l10n = require(`../index`)

    expect(Object.keys(l10n.data)).toHaveLength(0)
  })

  it(`process.env.LANG === 'fr'`, () => {
    process.env.LANG = `fr`
    const l10n = require(`../index`)
    const data = require(`../fr.json`)

    expect(l10n.data).toEqual(data)
  })

  it(`process.env.LANG not set`, () => {
    delete process.env.LANG
    const l10n = require(`../index`)

    expect(Object.keys(l10n.data)).toHaveLength(0)
  })
})
