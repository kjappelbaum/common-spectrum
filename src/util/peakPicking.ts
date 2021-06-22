import { optimize as optimizePeak } from 'ml-spectra-fitting';
import { xFindClosestIndex } from 'ml-spectra-processing';

import type { SpectrumType, PeakPickingOptions } from '../types';

/** Based on a x value we will return a peak*/
export function peakPicking(
  spectrum: SpectrumType,
  /** value to search (on x axis) */
  target: number,
  options: PeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    optimize = false,
    widthGuess = 1,
    max = true,
    shapeOptions = {},
  } = options;

  const x = spectrum.variables[xVariable]?.data;
  const y = spectrum.variables[yVariable]?.data.slice(); // do deep copy as we maybe need to flip sign
  if (!x || !y) return;
  let targetIndex;
  targetIndex = xFindClosestIndex(x, target);
  let optimizedPeak;
  let optimizedIndex;
  const result: Record<string, number> = {};
  if (optimize) {
    if (max === false) {
      let maximumY = Math.max(...y);
      for (let i = 0; i < y.length; i++) {
        y[i] *= -1;
        y[i] += maximumY; // This makes it somewhat more robust
      }
    }

    optimizedPeak = optimizePeak(
      { x: x, y: y },
      [{ x: x[targetIndex], y: y[targetIndex], width: widthGuess }],
      shapeOptions,
    );

    optimizedIndex = xFindClosestIndex(x, optimizedPeak.peaks[0].x);
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[optimizedIndex];
    }
    result.width = optimizedPeak.peaks[0].width;
  } else {
    for (let key in spectrum.variables) {
      result[key] = spectrum.variables[key].data[targetIndex];
    }
  }

  return result;
}