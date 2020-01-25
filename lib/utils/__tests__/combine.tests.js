const combine = require(`../combine`)

describe(`utils::combine`, () => {
  test(`combine(any,any)`, () => {
    expect(() => { combine({}, 1) }).toThrow()
    expect(() => { combine({}, 1n) }).toThrow()
    expect(() => { combine({}, NaN) }).toThrow()
    expect(() => { combine({}, ``) }).toThrow()
    expect(() => { combine({}, undefined) }).toThrow()
    expect(() => { combine({}, null) }).toThrow()
    expect(() => { combine({}, true) }).toThrow()
    expect(() => { combine({}, false) }).toThrow()
    expect(() => { combine({}, Symbol(`foo`)) }).toThrow()

    expect(() => { combine(1, {}) }).toThrow()
    expect(() => { combine(1n, {}) }).toThrow()
    expect(() => { combine(NaN, {}) }).toThrow()
    expect(() => { combine(``, {}) }).toThrow()
    expect(() => { combine(undefined, {}) }).toThrow()
    expect(() => { combine(null, {}) }).toThrow()
    expect(() => { combine(true, {}) }).toThrow()
    expect(() => { combine(false, {}) }).toThrow()
    expect(() => { combine(Symbol(`foo`), {}) }).toThrow()
  })

  test(`combine([],[])`, () => {
    const in1 = [1, 2]
    const in2 = [2, 3]

    const result = combine(in1, in2)

    expect(result).toEqual([1, 2, 3])
  })

  test(`combine([],{})`, () => {
    const in1 = [1, 2]
    const in2 = { a: 3 }

    const result = combine(in1, in2)

    expect(result).not.toBe(in2)
    expect(result).toEqual(in2)
  })

  test(`combine({}, [])`, () => {
    const in1 = { a: 3 }
    const in2 = [1, 2]

    const result = combine(in1, in2)

    expect(result).not.toBe(in1)
    expect(result).toEqual(in1)
  })

  test(`combine({}, {})`, () => {
    expect(combine({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
    expect(combine({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    expect(combine({ a: { b: 1, c: 1 } }, { a: { c: 2, d: 2 } })).toEqual({ a: { b: 1, c: 2, d: 2 } })
    expect(combine({ a: [1, 2] }, { a: [2, 3] })).toEqual({ a: [1, 2, 3] })
    expect(combine({ a: 1 }, { a: [1] })).toEqual({ a: [1] })
    expect(combine({ a: [1] }, { a: { b: 1 } })).toEqual({ a: { b: 1 } })
    expect(combine({ a: { b: 1 } }, { a: [1] })).toEqual({ a: [1] })
    expect(combine({ a: 1 }, { a: { b: 2 } })).toEqual({ a: { b: 2 } })

    // Deep nesting
    expect(combine({
      a: {
        b: {
          c: 1,
          d: [1],
          f: 1
        }
      }
    }, {
      a: {
        b: {
          c: 2,
          d: [2],
          e: 2
        }
      }
    })).toEqual({
      a: {
        b: {
          c: 2,
          d: [1, 2],
          e: 2,
          f: 1
        }
      }
    })
  })
})
