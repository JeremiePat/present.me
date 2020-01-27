const opt = require(`../opt`)

describe(`nunjucks::filters::opt`, () => {
  test(`opt(null)`, () => {
    expect(opt(null)).toBe(`null`)
  })

  test(`opt(string)`, () => {
    expect(opt(`foo`)).toBe(`'foo'`)
  })

  test(`opt(string, string)`, () => {
    expect(opt(`foo`, `bar`)).toBe(`'foo'`)
  })

  test(`opt(string, 'autoSlideMethod')`, () => {
    expect(opt(`foo`, `autoSlideMethod`)).toBe(`foo`)
  })
})
