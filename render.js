// MÓDULO DE RENDERIZADO Y ANIMACIONES - [Angel Santana]
//
// Dibuja las barras (con su número encima), reproduce los eventos que generan los algoritmos de
// ordenamientos.js y muestra en el panel derecho el código que se está ejecutando.
// Sirve tanto para la visualización individual como para los dos paneles de la comparación.

const COLOR_BASE = '#4a5568';
const COLOR_COMPARA = '#3182ce';
const COLOR_MUEVE = '#dd6b20';
const COLOR_ORDENADO = '#38a169';

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Ajusta el tamaño del número según lo ancha que quedó cada barra
function ajustarEtiquetas(contenedor) {
    const primera = contenedor.firstElementChild;
    if (!primera) return;
    const ancho = primera.offsetWidth;
    if (ancho > 0) {
        const tamano = Math.max(6, Math.min(10, Math.floor(ancho / 1.8)));
        contenedor.style.setProperty('--tam-valor', `${tamano}px`);
    }
}

// Actualiza la altura y el número de una barra
function actualizarBarra(barra, valor, maxValor) {
    barra.style.height = `${(valor / maxValor) * 100}%`;
    let etiqueta = barra.querySelector('.valor');
    if (!etiqueta) {
        etiqueta = document.createElement('span');
        etiqueta.className = 'valor';
        barra.appendChild(etiqueta);
    }
    etiqueta.textContent = valor;
}

/**
 * Dibuja un arreglo como barras dentro de un contenedor.
 * @param {HTMLElement} contenedor - Elemento donde se dibujan las barras.
 * @param {Array} datos - Valores a dibujar.
 * @param {boolean} anchoPorcentual - true para que las barras se repartan todo el ancho (comparación).
 */
function renderizarArreglo(contenedor, datos, anchoPorcentual = false) {
    if (!contenedor) {
        console.warn("No se encontró el contenedor de visualización en el DOM.");
        return;
    }

    contenedor.innerHTML = "";
    const maxValor = Math.max(...datos, 100);

    datos.forEach((valor) => {
        const barra = document.createElement("div");
        barra.classList.add("bar");
        if (anchoPorcentual) barra.style.width = `${100 / datos.length}%`;
        actualizarBarra(barra, valor, maxValor);
        contenedor.appendChild(barra);
    });

    ajustarEtiquetas(contenedor);
}

/**
 * Reproduce paso a paso los eventos de un algoritmo sobre las barras de un contenedor.
 * @param {Object} opciones
 *   contenedor    - Elemento con las barras (ya dibujadas con renderizarArreglo).
 *   datos         - Arreglo inicial (el mismo que se le dio al algoritmo).
 *   eventos       - Lista de eventos que devolvió el algoritmo.
 *   velocidad     - Función que devuelve los ms de espera por paso.
 *   puntoControl  - Función async llamada en cada paso; lanza un error para detener y espera si hay pausa.
 *   alEvento      - (opcional) Función llamada con cada evento justo cuando se muestra.
 */
async function reproducirEventos({ contenedor, datos, eventos, velocidad, puntoControl, alEvento }) {
    const barras = contenedor.getElementsByClassName("bar");
    const arreglo = [...datos];
    const maxValor = Math.max(...datos, 100);
    const ordenadas = new Set();

    const colorBase = (i) => (ordenadas.has(i) ? COLOR_ORDENADO : COLOR_BASE);
    const pintar = (indices, color) => {
        indices.forEach(i => { if (barras[i]) barras[i].style.backgroundColor = color; });
    };

    for (const evento of eventos) {
        await puntoControl();

        if (evento.type === "compare") {
            pintar(evento.indices, COLOR_COMPARA);
            if (alEvento) alEvento(evento);
            await esperar(velocidad());
            await puntoControl();
            evento.indices.forEach(i => pintar([i], colorBase(i)));

        } else if (evento.type === "swap") {
            const [i, j] = evento.indices;
            [arreglo[i], arreglo[j]] = [arreglo[j], arreglo[i]];
            if (barras[i]) actualizarBarra(barras[i], arreglo[i], maxValor);
            if (barras[j]) actualizarBarra(barras[j], arreglo[j], maxValor);
            pintar([i, j], COLOR_MUEVE);
            if (alEvento) alEvento(evento);
            await esperar(velocidad());
            await puntoControl();
            pintar([i], colorBase(i));
            pintar([j], colorBase(j));

        } else if (evento.type === "overwrite") {
            const { index, value } = evento;
            arreglo[index] = value;
            if (barras[index]) actualizarBarra(barras[index], value, maxValor);
            pintar([index], COLOR_MUEVE);
            if (alEvento) alEvento(evento);
            await esperar(velocidad());
            await puntoControl();
            pintar([index], colorBase(index));

        } else if (evento.type === "sorted") {
            evento.indices.forEach(i => {
                ordenadas.add(i);
                pintar([i], COLOR_ORDENADO);
            });
            if (alEvento) alEvento(evento);

        } else if (evento.type === "finish") {
            // Al finalizar aseguramos el renderizado exacto del arreglo ordenado
            evento.array.forEach((valor, i) => {
                if (barras[i]) {
                    actualizarBarra(barras[i], valor, maxValor);
                    barras[i].style.backgroundColor = COLOR_ORDENADO;
                }
            });
            if (alEvento) alEvento(evento);
        }
    }
}

// --- PANEL DE CÓDIGO ---
// Usa CODIGOS (codigos.js) y los elementos #code-title y #code-body de la página.
let filasActivas = [];

// Dibuja en el panel derecho el código del algoritmo indicado
function mostrarCodigo(nombre) {
    const info = CODIGOS[nombre];
    const titulo = document.getElementById('code-title');
    const cuerpo = document.getElementById('code-body');
    if (!info || !titulo || !cuerpo) return;

    titulo.innerText = `Código: ${ALGORITMOS[nombre].nombre}`;
    cuerpo.innerHTML = '';
    filasActivas = [];
    info.lineas.forEach((texto, i) => {
        const fila = document.createElement('div');
        fila.classList.add('code-line');
        if (texto.trim().startsWith('//')) fila.classList.add('code-comment');
        const num = document.createElement('span');
        num.classList.add('code-num');
        num.textContent = i + 1;
        const cod = document.createElement('span');
        cod.textContent = texto;
        fila.appendChild(num);
        fila.appendChild(cod);
        cuerpo.appendChild(fila);
    });
    cuerpo.scrollTop = 0;
}

// Marca la(s) línea(s) que se están ejecutando en este momento
function resaltar(lineas) {
    const cuerpo = document.getElementById('code-body');
    if (!cuerpo) return;
    filasActivas.forEach(f => f.classList.remove('activa'));
    filasActivas = [];
    [].concat(lineas).forEach(i => {
        const fila = cuerpo.children[i];
        if (fila) {
            fila.classList.add('activa');
            filasActivas.push(fila);
        }
    });
    // Mantener a la vista la primera línea resaltada (sin mover la página)
    const primera = filasActivas[0];
    if (primera) {
        const arriba = primera.offsetTop;
        const abajo = arriba + primera.offsetHeight;
        if (arriba < cuerpo.scrollTop || abajo > cuerpo.scrollTop + cuerpo.clientHeight) {
            cuerpo.scrollTop = Math.max(0, arriba - cuerpo.clientHeight / 2);
        }
    }
}

function limpiarResaltado() {
    filasActivas.forEach(f => f.classList.remove('activa'));
    filasActivas = [];
}

// Resalta en el panel las líneas que corresponden a un evento del algoritmo
function resaltarEvento(nombreAlgoritmo, evento) {
    const mapa = CODIGOS[nombreAlgoritmo].mapa;
    const lineas = mapa[evento.paso] || mapa[evento.type];
    if (lineas) resaltar(lineas);
}
