const toArray = require(`../toArray`)

describe(`nunjucks::filters::toArray`, () => {
  test(`toArray(null)`, () => {
    expect(toArray(null)).toEqual([])
  })

  test(`toArray(string)`, () => {
    expect(toArray(`foo`)).toEqual([`foo`])
  })

  test(`toArray(iterator)`, () => {
    expect(toArray([`foo`, `bar`])).toEqual([`foo`, `bar`])
    expect(toArray(new Set([`foo`, `bar`]))).toEqual([`foo`, `bar`])
  })

  test(`toArray(any)`, () => {
    expect(toArray(true)).toEqual([true])
    expect(toArray(false)).toEqual([false])
    expect(toArray(1)).toEqual([1])
    expect(toArray(NaN)).toEqual([NaN])

    const obj = {}
    expect(toArray(obj)).toEqual([obj])

    const fn = () => {}
    expect(toArray(fn)).toEqual([fn])
  })
})
