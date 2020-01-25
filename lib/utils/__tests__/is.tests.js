const is = require(`../is`)

describe(`utils::is`, () => {
  test(`is.enum(any)`, () => {
    /* Should be true ---------------------- */
    expect(is.enum({})).toBe(true) /* Object */

    /* Should be false -------------------------------------------- */
    expect(is.enum(new RegExp())).toBe(false) /*  Object (extended) */
    expect(is.enum([])).toBe(false) /*            Array             */
    expect(is.enum(1)).toBe(false) /*             Number            */
    expect(is.enum(1n)).toBe(false) /*            BigInt            */
    expect(is.enum(NaN)).toBe(false) /*           NaN               */
    expect(is.enum(``)).toBe(false) /*            String            */
    expect(is.enum(undefined)).toBe(false) /*     undefined         */
    expect(is.enum(null)).toBe(false) /*          null              */
    expect(is.enum(Symbol(`foo`))).toBe(false) /* Symbol            */
    expect(is.enum(() => {})).toBe(false) /*      Function          */
    expect(is.enum(true)).toBe(false) /*          Boolean           */
  })

  test(`is.object(any)`, () => {
    /* Should be true ----------------------------------------------- */
    expect(is.object({})).toBe(true) /*             Object            */
    expect(is.object(new RegExp())).toBe(true) /*  Object (extended) */
    expect(is.object([])).toBe(true) /*            Array             */

    /* Should be false ---------------------------------------------- */
    expect(is.object(1)).toBe(false) /*             Number            */
    expect(is.object(1n)).toBe(false) /*            BigInt            */
    expect(is.object(NaN)).toBe(false) /*           NaN               */
    expect(is.object(``)).toBe(false) /*            String            */
    expect(is.object(undefined)).toBe(false) /*     undefined         */
    expect(is.object(null)).toBe(false) /*          null              */
    expect(is.object(Symbol(`foo`))).toBe(false) /* Symbol            */
    expect(is.object(() => {})).toBe(false) /*      Function          */
    expect(is.object(true)).toBe(false) /*          Boolean           */
  })

  test(`is.array(any)`, () => {
    /* Should be true ----------------------- */
    expect(is.array([])).toBe(true) /* Array */

    /* Should be false ---------------------------------------------- */
    expect(is.array({})).toBe(false) /*            Object            */
    expect(is.array(new RegExp())).toBe(false) /*  Object (extended) */
    expect(is.array(1)).toBe(false) /*             Number            */
    expect(is.array(1n)).toBe(false) /*            BigInt            */
    expect(is.array(NaN)).toBe(false) /*           NaN               */
    expect(is.array(``)).toBe(false) /*            String            */
    expect(is.array(undefined)).toBe(false) /*     undefined         */
    expect(is.array(null)).toBe(false) /*          null              */
    expect(is.array(Symbol(`foo`))).toBe(false) /* Symbol            */
    expect(is.array(() => {})).toBe(false) /*      Function          */
    expect(is.array(true)).toBe(false) /*          Boolean           */
  })

  test(`is.number(any)`, () => {
    /* Should be true ----------------------- */
    expect(is.number(1)).toBe(true) /* Number */

    /* Should be false ---------------------------------------------- */
    expect(is.number({})).toBe(false) /*            Object            */
    expect(is.number(new RegExp())).toBe(false) /*  Object (extended) */
    expect(is.number([])).toBe(false) /*            Array             */
    expect(is.number(1n)).toBe(false) /*            BigInt            */
    expect(is.number(NaN)).toBe(false) /*           NaN               */
    expect(is.number(``)).toBe(false) /*            String            */
    expect(is.number(undefined)).toBe(false) /*     undefined         */
    expect(is.number(null)).toBe(false) /*          null              */
    expect(is.number(Symbol(`foo`))).toBe(false) /* Symbol            */
    expect(is.number(() => {})).toBe(false) /*      Function          */
    expect(is.number(true)).toBe(false) /*          Boolean           */
  })

  test(`is.func(any)`, () => {
    /* Should be true ------------------------------ */
    expect(is.func(() => {})).toBe(true) /* Function */

    /* Should be false -------------------------------------------- */
    expect(is.func({})).toBe(false) /*            Object            */
    expect(is.func(new RegExp())).toBe(false) /*  Object (extended) */
    expect(is.func([])).toBe(false) /*            Array             */
    expect(is.func(1)).toBe(false) /*             Number            */
    expect(is.func(1n)).toBe(false) /*            BigInt            */
    expect(is.func(NaN)).toBe(false) /*           NaN               */
    expect(is.func(``)).toBe(false) /*            String            */
    expect(is.func(undefined)).toBe(false) /*     undefined         */
    expect(is.func(null)).toBe(false) /*          null              */
    expect(is.func(Symbol(`foo`))).toBe(false) /* Symbol            */
    expect(is.func(true)).toBe(false) /*          Boolean           */
  })

  test(`is.file`, () => {
    const SASS_FILE = `file.sass`
    const SCSS_FILE = `file.scss`
    const HTML_FILE = `file.html`
    const HTM_FILE = `file.htm`
    const YAML_FILE = `file.yaml`
    const YML_FILE = `file.yml`
    const CSS_FILE = `file.css`
    const MD_FILE = `file.md`

    /* is.file.sass ---------------------------- */
    expect(is.file.sass(SASS_FILE)).toBe(true)
    expect(is.file.sass(SCSS_FILE)).toBe(true)
    expect(is.file.sass(HTML_FILE)).toBe(false)
    expect(is.file.sass(HTM_FILE)).toBe(false)
    expect(is.file.sass(YAML_FILE)).toBe(false)
    expect(is.file.sass(YML_FILE)).toBe(false)
    expect(is.file.sass(CSS_FILE)).toBe(false)
    expect(is.file.sass(MD_FILE)).toBe(false)

    /* is.file.html ---------------------------- */
    expect(is.file.html(SASS_FILE)).toBe(false)
    expect(is.file.html(SCSS_FILE)).toBe(false)
    expect(is.file.html(HTML_FILE)).toBe(true)
    expect(is.file.html(HTM_FILE)).toBe(true)
    expect(is.file.html(YAML_FILE)).toBe(false)
    expect(is.file.html(YML_FILE)).toBe(false)
    expect(is.file.html(CSS_FILE)).toBe(false)
    expect(is.file.html(MD_FILE)).toBe(false)

    /* is.file.yaml ---------------------------- */
    expect(is.file.yaml(SASS_FILE)).toBe(false)
    expect(is.file.yaml(SCSS_FILE)).toBe(false)
    expect(is.file.yaml(HTML_FILE)).toBe(false)
    expect(is.file.yaml(HTM_FILE)).toBe(false)
    expect(is.file.yaml(YAML_FILE)).toBe(true)
    expect(is.file.yaml(YML_FILE)).toBe(true)
    expect(is.file.yaml(CSS_FILE)).toBe(false)
    expect(is.file.yaml(MD_FILE)).toBe(false)

    /* is.file.css ----------------------------- */
    expect(is.file.css(SASS_FILE)).toBe(false)
    expect(is.file.css(SCSS_FILE)).toBe(false)
    expect(is.file.css(HTML_FILE)).toBe(false)
    expect(is.file.css(HTM_FILE)).toBe(false)
    expect(is.file.css(YAML_FILE)).toBe(false)
    expect(is.file.css(YML_FILE)).toBe(false)
    expect(is.file.css(CSS_FILE)).toBe(true)
    expect(is.file.css(MD_FILE)).toBe(false)

    /* is.file.markdown ----------------------- */
    expect(is.file.markdown(SASS_FILE)).toBe(false)
    expect(is.file.markdown(SCSS_FILE)).toBe(false)
    expect(is.file.markdown(HTML_FILE)).toBe(false)
    expect(is.file.markdown(HTM_FILE)).toBe(false)
    expect(is.file.markdown(YAML_FILE)).toBe(false)
    expect(is.file.markdown(YML_FILE)).toBe(false)
    expect(is.file.markdown(CSS_FILE)).toBe(false)
    expect(is.file.markdown(MD_FILE)).toBe(true)
  })
})
