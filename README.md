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
| --port  | The port on where to serve the slide deck on the local machine. By default a random available port on the machine will be assigned |

## Customization

_WIP_
