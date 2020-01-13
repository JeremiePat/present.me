module.exports = {
  'html/slides': {
    ext: '.html',
    cmd (bin, files, dest) {
      return [
        bin,
        '--defaults=revealjs',
        '--verbose',
        ...files,
        // ...css.map(f => `--css ${f}`),
        `-o ${dest}`
      ].join(' ')
    }
  },

  'pdf/slides': {
    ext: '.pdf',
    cmd (bin, files, dest) {
      return [
        bin,
        '--defaults=beamer',
        '--verbose',
        ...files,
        `-o ${dest}`
      ].join(' ')
    }
  }
}
