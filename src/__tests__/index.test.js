import { Analysis, fromJcamp, toJcamp, getJSGraph } from '..';

test('index', () => {
  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(8);

  analysis.pushSpectrum(
    {
      x: {
        data: [1, 2],
        isMonotone: true,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis [yUnits]',
      },
    },
    {
      title: 'My spectrum',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  let firstSpectrum = analysis.getSpectrum();

  expect(firstSpectrum.variables.x.data).toStrictEqual([1, 2]);
  expect(firstSpectrum.variables.y.data).toStrictEqual([3, 4]);

  let normalized = analysis.getNormalizedData({
    normalization: {
      filters: [{ name: 'normalize' }],
    },
  });
  expect(normalized.y[0] + normalized.y[1]).toBeCloseTo(1, 10);

  let undefinedSpectrum = analysis.getSpectrum({ index: 2 });
  expect(undefinedSpectrum).toBeUndefined();

  let myFlavor = analysis.getSpectrum('myFlavor');
  expect(myFlavor.variables.x.data).toStrictEqual([1, 2]);
  expect(myFlavor.variables.y.data).toStrictEqual([3, 4]);

  let jsgraph = getJSGraph([analysis]);
  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  let jcamp = toJcamp(analysis, {
    info: {
      owner: 'cheminfo',
      origin: 'Common Spectrum',
    },
  });

  let analysis2 = fromJcamp(jcamp);

  expect(analysis2.spectra[0]).toStrictEqual({
    variables: {
      x: {
        data: [1, 2],
        isMonotone: true,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis [xUnits]',
        symbol: 'X',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis [yUnits]',
        symbol: 'Y',
      },
    },
    title: 'My spectrum',
    dataType: 'TGA',
    meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
    flavor: 'yUnits vs xUnits',
  });
});
