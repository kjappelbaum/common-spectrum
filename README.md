# common-spectrum

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Common package to deal with spectral analysis.

An `Analysis` may be composed of many `Spectrum` of different flavors.

By default the flavor is an empty string and if your analysis only generates
one spectrum you may forget this level of complexity.

In the case of Thermogravitaional Analysis (TGA) we may have 2 flavor for the data:
- Weight versus Temperature
- Weight versus Time

This package allow to load / save an Analysis as a JCAMP-DX text file.

## Installation

`$ npm i common-spectrum`

## Usage

```js
import { CommonSpectrum } from 'common-spectrum';

const {
  Analysis,
  fromJcamp,
  toJcamp,
  getNormalized,
  getJSGraph,
} = new CommonSpectrum({
  dataType: 'TGA', // type of analysis like TGA for 'Thermal Gravitational Analysis'
  defaultFlavor: 'myFlavor', // default flavor when adding a spectrum
});

// we create an analysis that has no spectrum
let analysis = new Analysis();

// we add a spectrum with the default flavor
analysis.set(
  { x: [1, 2], y: [3, 4] },
  {
    xLabel: 'X axis',
    yLabel: 'Y axis',
    title: 'My spectrum',
    meta: {
      // unlimited number of meta information is allowed
      meta1: 'Meta 1',
      meta2: 'Meta 2',
    },
  },
);

// if we want to retrive the default flavor spectrum, no
// parameter is needed
let defaultFlavorSpectrum = analysis.get();

// the data of a spectrum can be normalized using various options
let data = getNormalized(defaultFlavorSpectrum, {
  filters: [{ name: 'normalize' }],
});
console.log(data);

// In order to plot the data we can use JsGraph and this method generates
// the json format required by this library
// It allows to superimpose an unlimited number of spectra.
let jsgraph = getJSGraph([analysis]);
console.log(jsgraph);

// It is possible to save the analysis as a JCAMP-DX
let jcamp = toJcamp(analysis);

// The analysis object can be recreated from a JCAMP-DX text file as well.
let analysisFromJcamp = fromJcamp(jcamp);
console.log(analysisFromJcamp);
```

## [API Documentation](https://cheminfo.github.io/common-spectrum/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/common-spectrum.svg
[npm-url]: https://www.npmjs.com/package/common-spectrum
[ci-image]: https://github.com/cheminfo/common-spectrum/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/common-spectrum/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/common-spectrum.svg
[codecov-url]: https://codecov.io/gh/cheminfo/common-spectrum
[download-image]: https://img.shields.io/npm/dm/common-spectrum.svg
[download-url]: https://www.npmjs.com/package/common-spectrum