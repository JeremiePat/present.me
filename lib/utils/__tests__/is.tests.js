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

  describe(`is.file`, () => {
    const SASS_FILE = `file.sass`
    const SCSS_FILE = `file.scss`
    const HTML_FILE = `file.html`
    const HTM_FILE = `file.htm`
    const YAML_FILE = `file.yaml`
    const YML_FILE = `file.yml`
    const CSS_FILE = `file.css`
    const MD_FILE = `file.md`
    const HIDDEN_FILE = `.file`
    const JPEG_FILE = `file.jpeg`
    const JPG_FILE = `file.jpg`
    const GIF_FILE = `file.gif`
    const PNG_FILE = `file.png`
    const SVG_FILE = `file.svg`
    const SVGZ_FILE = `file.svgz`
    const WEBP_FILE = `file.webp`
    const EOT_FILE = `file.eot`
    const OTF_FILE = `file.otf`
    const TTF_FILE = `file.ttf`
    const WOFF_FILE = `file.woff`
    const WOFF2_FILE = `file.woff2`;

    [
      { title: `is.file.sass`, fn: is.file.sass, ok: [SASS_FILE, SCSS_FILE] },
      { title: `is.file.html`, fn: is.file.html, ok: [HTML_FILE, HTM_FILE] },
      { title: `is.file.yaml`, fn: is.file.yaml, ok: [YAML_FILE, YML_FILE] },
      { title: `is.file.css`, fn: is.file.css, ok: [CSS_FILE] },
      { title: `is.file.markdown`, fn: is.file.markdown, ok: [MD_FILE] },
      { title: `is.file.hidden`, fn: is.file.hidden, ok: [HIDDEN_FILE] },
      { title: `is.file.img`, fn: is.file.img, ok: [JPEG_FILE, JPG_FILE, GIF_FILE, PNG_FILE, SVG_FILE, SVGZ_FILE, WEBP_FILE] },
      { title: `is.file.font`, fn: is.file.font, ok: [EOT_FILE, OTF_FILE, TTF_FILE, WOFF_FILE, WOFF2_FILE] }
    ].forEach(({ title, fn, ok }) => {
      it(title, () => {
        expect(fn(SASS_FILE)).toBe(ok.includes(SASS_FILE))
        expect(fn(SCSS_FILE)).toBe(ok.includes(SCSS_FILE))
        expect(fn(HTML_FILE)).toBe(ok.includes(HTML_FILE))
        expect(fn(HTM_FILE)).toBe(ok.includes(HTM_FILE))
        expect(fn(YAML_FILE)).toBe(ok.includes(YAML_FILE))
        expect(fn(YML_FILE)).toBe(ok.includes(YML_FILE))
        expect(fn(CSS_FILE)).toBe(ok.includes(CSS_FILE))
        expect(fn(MD_FILE)).toBe(ok.includes(MD_FILE))
        expect(fn(HIDDEN_FILE)).toBe(ok.includes(HIDDEN_FILE))
        expect(fn(JPEG_FILE)).toBe(ok.includes(JPEG_FILE))
        expect(fn(JPG_FILE)).toBe(ok.includes(JPG_FILE))
        expect(fn(GIF_FILE)).toBe(ok.includes(GIF_FILE))
        expect(fn(PNG_FILE)).toBe(ok.includes(PNG_FILE))
        expect(fn(SVG_FILE)).toBe(ok.includes(SVG_FILE))
        expect(fn(SVGZ_FILE)).toBe(ok.includes(SVGZ_FILE))
        expect(fn(WEBP_FILE)).toBe(ok.includes(WEBP_FILE))
        expect(fn(EOT_FILE)).toBe(ok.includes(EOT_FILE))
        expect(fn(OTF_FILE)).toBe(ok.includes(OTF_FILE))
        expect(fn(TTF_FILE)).toBe(ok.includes(TTF_FILE))
        expect(fn(WOFF_FILE)).toBe(ok.includes(WOFF_FILE))
        expect(fn(WOFF2_FILE)).toBe(ok.includes(WOFF2_FILE))
      })
    })
  })
})
