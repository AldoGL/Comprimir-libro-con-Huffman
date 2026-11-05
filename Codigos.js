// MÓDULO DE CÓDIGO MOSTRADO EN EL PANEL DERECHO
//
// Para cada algoritmo se guarda:
//   - lineas: el código que se muestra (versión resumida de lo que hace ordenamientos.js).
//   - mapa:   qué líneas se resaltan cuando ocurre cada tipo de evento del algoritmo.
//             La clave es evento.paso (si existe) o evento.type ("compare", "swap", "overwrite").
//
// El número entre /* */ es el índice de línea que usa el mapa.

const CODIGOS = {
    bubble: {
        lineas: [
            /*0*/ 'for (let i = 0; i < n; i++) {',
            /*1*/ '  for (let j = 0; j < n - i - 1; j++) {',
            /*2*/ '    if (array[j] > array[j + 1]) {',
            /*3*/ '      [array[j], array[j + 1]] = [array[j + 1], array[j]];',
            /*4*/ '    }',
            /*5*/ '  }',
            /*6*/ '  // array[n - i - 1] ya quedó en su lugar',
            /*7*/ '}'
        ],
        mapa: { compare: [1, 2], swap: [3] }
    },

    selection: {
        lineas: [
            /*0*/ 'for (let i = 0; i < n - 1; i++) {',
            /*1*/ '  let minIdx = i;',
            /*2*/ '  for (let j = i + 1; j < n; j++) {',
            /*3*/ '    if (array[j] < array[minIdx]) {',
            /*4*/ '      minIdx = j;',
            /*5*/ '    }',
            /*6*/ '  }',
            /*7*/ '  if (minIdx !== i) {',
            /*8*/ '    [array[i], array[minIdx]] = [array[minIdx], array[i]];',
            /*9*/ '  }',
            /*10*/ '}'
        ],
        mapa: { compare: [2, 3], swap: [7, 8] }
    },

    insertion: {
        lineas: [
            /*0*/ 'for (let i = 1; i < n; i++) {',
            /*1*/ '  let clave = array[i];',
            /*2*/ '  let j = i - 1;',
            /*3*/ '  while (j >= 0 && array[j] > clave) {',
            /*4*/ '    array[j + 1] = array[j];',
            /*5*/ '    j--;',
            /*6*/ '  }',
            /*7*/ '  array[j + 1] = clave;',
            /*8*/ '}'
        ],
        mapa: { compare: [3], overwrite: [4, 5], insertar: [7] }
    },

    gnome: {
        lineas: [
            /*0*/ 'let index = 0;',
            /*1*/ 'while (index < n) {',
            /*2*/ '  if (index === 0) {',
            /*3*/ '    index++;',
            /*4*/ '  } else if (array[index] >= array[index - 1]) {',
            /*5*/ '    index++;',
            /*6*/ '  } else {',
            /*7*/ '    [array[index], array[index - 1]] = [array[index - 1], array[index]];',
            /*8*/ '    index--;',
            /*9*/ '  }',
            /*10*/ '}'
        ],
        mapa: { compare: [4], swap: [6, 7, 8] }
    },

    exchange: {
        lineas: [
            /*0*/ 'for (let i = 0; i < n - 1; i++) {',
            /*1*/ '  for (let j = i + 1; j < n; j++) {',
            /*2*/ '    if (array[i] > array[j]) {',
            /*3*/ '      [array[i], array[j]] = [array[j], array[i]];',
            /*4*/ '    }',
            /*5*/ '  }',
            /*6*/ '}'
        ],
        mapa: { compare: [1, 2], swap: [3] }
    },

    stooge: {
        lineas: [
            /*0*/ 'function stoogeSort(left, right) {',
            /*1*/ '  if (left >= right) return;',
            /*2*/ '  if (array[left] > array[right]) {',
            /*3*/ '    [array[left], array[right]] = [array[right], array[left]];',
            /*4*/ '  }',
            /*5*/ '  if (right - left + 1 > 2) {',
            /*6*/ '    let third = Math.floor((right - left + 1) / 3);',
            /*7*/ '    stoogeSort(left, right - third);',
            /*8*/ '    stoogeSort(left + third, right);',
            /*9*/ '    stoogeSort(left, right - third);',
            /*10*/ '  }',
            /*11*/ '}'
        ],
        mapa: { compare: [2], swap: [3] }
    },

    quick: {
        lineas: [
            /*0*/ 'function quickSort(low, high) {',
            /*1*/ '  if (low < high) {',
            /*2*/ '    let p = partition(low, high);',
            /*3*/ '    quickSort(low, p - 1);',
            /*4*/ '    quickSort(p + 1, high);',
            /*5*/ '  }',
            /*6*/ '}',
            /*7*/ 'function partition(low, high) {',
            /*8*/ '  let pivot = array[high];',
            /*9*/ '  let i = low - 1;',
            /*10*/ '  for (let j = low; j < high; j++) {',
            /*11*/ '    if (array[j] < pivot) {',
            /*12*/ '      i++;',
            /*13*/ '      [array[i], array[j]] = [array[j], array[i]];',
            /*14*/ '    }',
            /*15*/ '  }',
            /*16*/ '  [array[i + 1], array[high]] = [array[high], array[i + 1]];',
            /*17*/ '  return i + 1;',
            /*18*/ '}'
        ],
        mapa: { compare: [10, 11], swap: [12, 13], pivote: [16, 17] }
    },

    merge: {
        lineas: [
            /*0*/ 'function mergeSort(left, right) {',
            /*1*/ '  if (left >= right) return;',
            /*2*/ '  let middle = Math.floor((left + right) / 2);',
            /*3*/ '  mergeSort(left, middle);',
            /*4*/ '  mergeSort(middle + 1, right);',
            /*5*/ '  merge(left, middle, right);',
            /*6*/ '}',
            /*7*/ 'function merge(left, middle, right) {',
            /*8*/ '  let leftPart = array.slice(left, middle + 1);',
            /*9*/ '  let rightPart = array.slice(middle + 1, right + 1);',
            /*10*/ '  let i = 0, j = 0, k = left;',
            /*11*/ '  while (i < leftPart.length && j < rightPart.length) {',
            /*12*/ '    if (leftPart[i] <= rightPart[j]) array[k++] = leftPart[i++];',
            /*13*/ '    else array[k++] = rightPart[j++];',
            /*14*/ '  }',
            /*15*/ '  while (i < leftPart.length) array[k++] = leftPart[i++];',
            /*16*/ '  while (j < rightPart.length) array[k++] = rightPart[j++];',
            /*17*/ '}'
        ],
        mapa: { compare: [11, 12], overwrite: [12, 13], 'resto-izq': [15], 'resto-der': [16] }
    }
};
