function quickSort(input) {

    const array = [...input];
    const events = [];

    function partition(low, high) {

        const pivot = array[high];

        let i = low - 1;

        for (let j = low; j < high; j++) {

            events.push(
                createEvent("compare", {
                    indices: [j, high]
                })
            );

            if (array[j] < pivot) {

                i++;

                [array[i], array[j]] =
                    [array[j], array[i]];

                events.push(
                    createEvent("swap", {
                        indices: [i, j],
                        values: [array[i], array[j]]
                    })
                );
            }
        }

        [array[i + 1], array[high]] =
            [array[high], array[i + 1]];

        events.push(
            createEvent("swap", {
                paso: "pivote",
                indices: [i + 1, high],
                values: [
                    array[i + 1],
                    array[high]
                ]
            })
        );

        events.push(
            createEvent("sorted", {
                indices: [i + 1]
            })
        );

        return i + 1;
    }


    function sort(low, high) {

        if (low < high) {

            const pivotIndex =
                partition(low, high);

            sort(low, pivotIndex - 1);

            sort(pivotIndex + 1, high);
        }
    }


    sort(0, array.length - 1);

    events.push(
        createEvent("finish", {
            array: [...array]
        })
    );

    return {
        array,
        events
    };
}

function mergeSort(input) {

    const array = [...input];
    const events = [];

    function merge(left, middle, right) {

        const leftPart =
            array.slice(left, middle + 1);

        const rightPart =
            array.slice(middle + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (
            i < leftPart.length &&
            j < rightPart.length
        ) {

            events.push(
                createEvent("compare", {
                    indices: [k, Math.min(k + 1, right)]
                })
            );

            if (leftPart[i] <= rightPart[j]) {
                array[k] = leftPart[i];
                i++;
            } else {
                array[k] = rightPart[j];
                j++;
            }

            events.push(
                createEvent("overwrite", {
                    index: k,
                    value: array[k]
                })
            );

            k++;
        }


        while (i < leftPart.length) {

            array[k] = leftPart[i];

            events.push(
                createEvent("overwrite", {
                    paso: "resto-izq",
                    index: k,
                    value: array[k]
                })
            );

            i++;
            k++;
        }


        while (j < rightPart.length) {

            array[k] = rightPart[j];

            events.push(
                createEvent("overwrite", {
                    paso: "resto-der",
                    index: k,
                    value: array[k]
                })
            );

            j++;
            k++;
        }
    }


    function sort(left, right) {

        if (left >= right) {
            return;
        }

        const middle =
            Math.floor((left + right) / 2);

        sort(left, middle);

        sort(middle + 1, right);

        merge(left, middle, right);
    }


    sort(0, array.length - 1);

    events.push(
        createEvent("finish", {
            array: [...array]
        })
    );

    return {
        array,
        events
    };
}

function createEvent(type, data = {}) {
    return {
        type,
        ...data
    };
}


function gnomeSort(input) {

    const array = [...input];
    const events = [];

    let index = 0;

    while (index < array.length) {

        if (index === 0) {
            index++;
            continue;
        }

        events.push(
            createEvent("compare", {
                indices: [index - 1, index]
            })
        );

        if (array[index] >= array[index - 1]) {
            index++;
        } else {

            [array[index], array[index - 1]] =
                [array[index - 1], array[index]];

            events.push(
                createEvent("swap", {
                    indices: [index - 1, index],
                    values: [array[index - 1], array[index]]
                })
            );

            index--;
        }
    }

    events.push(
        createEvent("finish", {
            array: [...array]
        })
    );

    return {
        array,
        events
    };
}


function exchangeSort(input) {

    const array = [...input];
    const events = [];

    for (let i = 0; i < array.length - 1; i++) {

        for (let j = i + 1; j < array.length; j++) {

            events.push(
                createEvent("compare", {
                    indices: [i, j]
                })
            );

            if (array[i] > array[j]) {

                [array[i], array[j]] =
                    [array[j], array[i]];

                events.push(
                    createEvent("swap", {
                        indices: [i, j],
                        values: [array[i], array[j]]
                    })
                );
            }
        }

        events.push(
            createEvent("sorted", {
                indices: [i]
            })
        );
    }

    events.push(
        createEvent("sorted", {
            indices: [array.length - 1]
        })
    );

    events.push(
        createEvent("finish", {
            array: [...array]
        })
    );

    return {
        array,
        events
    };
}


function stoogeSort(input) {

    const array = [...input];
    const events = [];

    function sort(left, right) {

        if (left >= right) {
            return;
        }

        events.push(
            createEvent("compare", {
                indices: [left, right]
            })
        );

        if (array[left] > array[right]) {

            [array[left], array[right]] =
                [array[right], array[left]];

            events.push(
                createEvent("swap", {
                    indices: [left, right],
                    values: [array[left], array[right]]
                })
            );
        }

        if (right - left + 1 > 2) {

            const third = Math.floor(
                (right - left + 1) / 3
            );

            sort(left, right - third);

            sort(left + third, right);

            sort(left, right - third);
        }
    }

    sort(0, array.length - 1);

    events.push(
        createEvent("finish", {
            array: [...array]
        })
    );

    return {
        array,
        events
    };
}

function bubbleSort(input) {
    const array = [...input];
    const events = [];
    let n = array.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            events.push(createEvent("compare", { indices: [j, j + 1] }));

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                events.push(createEvent("swap", { indices: [j, j + 1], values: [array[j], array[j + 1]] }));
            }
        }
        events.push(createEvent("sorted", { indices: [n - 1 - i] }));
    }

    events.push(createEvent("finish", { array: [...array] }));
    return { array, events };
}

function selectionSort(input) {
    const array = [...input];
    const events = [];
    let n = array.length;

    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            events.push(createEvent("compare", { indices: [min_idx, j] }));
            if (array[j] < array[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx !== i) {
            [array[i], array[min_idx]] = [array[min_idx], array[i]];
            events.push(createEvent("swap", { indices: [i, min_idx], values: [array[i], array[min_idx]] }));
        }
        events.push(createEvent("sorted", { indices: [i] }));
    }
    events.push(createEvent("sorted", { indices: [n - 1] }));
    events.push(createEvent("finish", { array: [...array] }));
    return { array, events };
}

function insertionSort(input) {
    const array = [...input];
    const events = [];

    for (let i = 1; i < array.length; i++) {
        let clave = array[i];
        let j = i - 1;

        events.push(createEvent("compare", { indices: [j, i] }));

        while (j >= 0 && array[j] > clave) {
            events.push(createEvent("compare", { indices: [j, j + 1] }));
            array[j + 1] = array[j];
            events.push(createEvent("overwrite", { index: j + 1, value: array[j + 1] }));
            j--;
        }
        array[j + 1] = clave;
        events.push(createEvent("overwrite", { index: j + 1, value: clave, paso: "insertar" }));
    }

    events.push(createEvent("finish", { array: [...array] }));
    return { array, events };
}


// --- REGISTRO DE ALGORITMOS ---
// Cada entrada une la clave que usa la página con su nombre, su función (definida arriba)
// y su complejidad temporal según la implementación de este archivo.
const ALGORITMOS = {
    bubble:    { nombre: 'Bubble Sort',    ejecutar: bubbleSort,    complejidad: { mejor: 'O(n²)',      promedio: 'O(n²)',      peor: 'O(n²)' } },
    selection: { nombre: 'Selection Sort', ejecutar: selectionSort, complejidad: { mejor: 'O(n²)',      promedio: 'O(n²)',      peor: 'O(n²)' } },
    insertion: { nombre: 'Insertion Sort', ejecutar: insertionSort, complejidad: { mejor: 'O(n)',       promedio: 'O(n²)',      peor: 'O(n²)' } },
    gnome:     { nombre: 'Gnome Sort',     ejecutar: gnomeSort,     complejidad: { mejor: 'O(n)',       promedio: 'O(n²)',      peor: 'O(n²)' } },
    exchange:  { nombre: 'Exchange Sort',  ejecutar: exchangeSort,  complejidad: { mejor: 'O(n²)',      promedio: 'O(n²)',      peor: 'O(n²)' } },
    stooge:    { nombre: 'Stooge Sort',    ejecutar: stoogeSort,    complejidad: { mejor: 'O(n^2.71)',  promedio: 'O(n^2.71)',  peor: 'O(n^2.71)' } },
    quick:     { nombre: 'Quick Sort',     ejecutar: quickSort,     complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n²)' } },
    merge:     { nombre: 'Merge Sort',     ejecutar: mergeSort,     complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n log n)' } }
};

// --- MÉTRICAS ---
// Un evento "compare" = una comparación, "swap" = un intercambio y
// "overwrite" = una escritura (asignación) directa en el arreglo.
function nuevasMetricas() {
    return { comparaciones: 0, intercambios: 0, escrituras: 0 };
}

function sumarMetrica(metricas, evento) {
    if (evento.type === "compare") metricas.comparaciones++;
    else if (evento.type === "swap") metricas.intercambios++;
    else if (evento.type === "overwrite") metricas.escrituras++;
    return metricas;
}

// Cuenta todas las métricas de una lista completa de eventos
function contarMetricas(events) {
    const metricas = nuevasMetricas();
    events.forEach(evento => sumarMetrica(metricas, evento));
    return metricas;
}

// Tiempo real de cómputo del algoritmo (sin animación): promedio en ms de varias ejecuciones
function medirTiempoEjecucion(ejecutar, datos) {
    let repeticiones = 0;
    const inicio = performance.now();
    let ahora = inicio;
    do {
        ejecutar(datos);
        repeticiones++;
        ahora = performance.now();
    } while (ahora - inicio < 20 && repeticiones < 500);
    return (ahora - inicio) / repeticiones;
}
