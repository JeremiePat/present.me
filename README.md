# present.me

**present.me** is a convenient tool to present your stuff.

Basically, it turns a folder full of markdown files into a slide deck ready to use.


## Install

### With NPM

The easiest way to install **present.me** is to use `npm`

```bash
$ npm i https://github.com/JeremiePat/present.me.git -g
```

### With Docker

_TBD_

## Usage

Once installed you'll get access to a cli command: `pme` to create your presentations.

The source of any presentation is a folder containing markdown files.

### Creating a presentation

```bash
$ pme make my/folder -format html/slides --output my/folder/slidedeck.html
```

the previous command will get all the markdown files out of the `my/folder` repository and will turn them into an HTML slide deck in the file `my/folder/slidedeck.html`.

The `--output` option isn't required and if it's omitted, the default name will be the name of the folder with the appropriate extension. For example:

```bash
$ pme make my/folder
```

will create an HTML slide deck in the file `my/folder/folder.html`

The `--format` option indicates the output format. For example:

```bash
$ pme make my/folder --format pdf/slides
```

This will produce a PDF document where each page will be one slide.

We currently support only two format: `html/slides` and `pdf/slides` but there are more to come.

### Serving a presentation

As a convenient tool, HTML slide decks can be served locally in order to display them nicely into your browser.

```bash
$ pme serve my/folder --port=8000
```

This command will first create an HTML slide deck out of the markdown files available in `my/folder` and then launch a local web server accessible at the address: `http://localhost:8000`

### CLI API

#### pme make

```bash
pme make [folder] [format] [...options]
```

Where:
 - `[folder]` is the path to the source folder containing markdown files
   (default to current directory).
 - `[...options]` any of the options listed bellow

| Options  | Value |
|:---------|:------|
| --format, -f | The expected output format. Default to `html/slides` |
| --output, -o | An explicite path to the expected output file. Default to `<sourceFolder>/<folderName>.<formatExtension>` |
| --theme, -t | An explicite path to a custom theme folder. Default to `<sourceFolder>/theme` |

Currently supported format:
 - `html/slides` Slide deck in HTML using [reaveal.js](https://revealjs.com)
 - `pdf/slides` Slide deck in PDF format

#### pme serve

```bash
pme serve [folder] [...options]
```

Where:
 - `[folder]` is the path to the source folder containing markdown files
   (default to current directory).
 - `[...options]` any of the options listed bellow

| Options | Value |
|:--------|:------|
| --port, -p  | The port on where to serve the slide deck on the local machine. By default a random available port on the machine will be assigned |
| --theme, -t | An explicite path to a custom theme folder. Default to `<sourceFolder>/theme` |

## Customization

Presentations can be customized to fit your needs. To do that you can create a `theme` folder that will contain a YAML configuration file and some CSS files.

By default, the `theme` folder is expected to be within your main folder alongside your markdown files. However, you can use an external theme folder by using the `--theme` option:

```bash
$ pme make --theme=/my/theme/folder
```

### Configuration

The YAML configuration file let you customize many aspect of the presentation. See [`theme/config.yaml`](theme/config.yaml) for the whole list of options and the exact syntaxe.

This include all the [reveal.js options](https://github.com/hakimel/reveal.js#configuration), the size of the document, the theme to apply, etc.

The `theme/config.yaml` represents the default config apply to all presentation. Your own config file can be lighter as it will overwrite only what you set.

### Styling

You can create your own style for your presentations by simply creating css stylesheets at the root of the `theme` folder.

Any stylesheet within a subfolder won't be loaded, except is you import them within any of the top level stylesheet with the `@import` rule.

For the PDF output, as we are using chromium under the hood, you can use the `@media print` rule to define a specific style for the PDF different than for the HTML:

```css
/* This will apply to both HTML and PDF output */
@import url('styles/common.css');

/* This will apply to the HTML output (unless you try to print it) */
@media screen {
  @import url('styles/html.css');
}

/* This will apply to the PDF output */
@media print {
  @import url('styles/pdf.css')
}
```

> **NOTE:** _If you are creating relative links to ressources into your stylesheets, all those ressources must be into the theme folder. If you are creating absolute links, always assume that your root folder is your source folder containing your theme folder named `theme`, even if you specified your theme folder through the `--theme` option._
