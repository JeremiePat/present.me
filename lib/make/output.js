const path = require(`path`)

const pandocDir = path.resolve(__dirname, `..`, `..`, `pandoc`)
const revealDir = path.resolve(__dirname, `..`, `..`, `node_modules`, `reveal.js`)

function makeBin (src) {
  if (process.env.PME_MAKE_MODE === `REMOTE`) {
    return [
      `docker run`,
      `--rm`,
      `--mount type=bind,source=${pandocDir},target=/root/.pandoc,readonly`,
      `--mount type=bind,source=${revealDir},target=/reveal,readonly`,
      `-v ${path.resolve(src)}:/src`,
      `-w /src`,
      // '--user `id -u`:`id -g`',
      `-t pme`
      // 'pandoc'
    ].join(` `)
  } else {
    process.chdir(src)
    return `pandoc`
  }
}

module.exports = {
  'html/slides': {
    ext: `.html`,
    cmd (src, dest, files) {
      return [
        makeBin(src),
        `--defaults=revealjs`,
        `--verbose`,
        ...files,
        // ...css.map(f => `--css ${f}`),
        `-o ${dest}`
      ].join(` `)
    }
  },

  'pdf/slides': {
    ext: `.pdf`,
    cmd (src, dest, files) {
      return [
        makeBin(src),
        `--defaults=beamer`,
        `--verbose`,
        ...files,
        `-o ${dest}`
      ].join(` `)
    }
  }
}
