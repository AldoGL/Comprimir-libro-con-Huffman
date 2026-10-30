// 1. Lógica para leer archivos .txt automáticamente
document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        // Cuando termine de leer el archivo, pone el texto en el textarea
        reader.onload = function(e) {
            document.getElementById('input-text').value = e.target.result;
        };
        
        // Lee el archivo como texto
        reader.readAsText(file);
    }
});

// 2. Clase para los nodos del Árbol de Huffman
class Node {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

// 3. Lógica principal de compresión
document.getElementById('btn-compress').addEventListener('click', () => {
    const text = document.getElementById('input-text').value;
    if (!text) {
        alert("Por favor, ingresa un texto o sube un archivo .txt para comprimir.");
        return;
    }

    // Calcular frecuencias
    const freqMap = {};
    for (let char of text) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }

    // Construir el árbol de Huffman
    let nodes = Object.entries(freqMap).map(([char, freq]) => new Node(char, freq));
    
    // Manejo de caso especial: texto con un solo tipo de carácter
    if (nodes.length === 1) {
        nodes.push(new Node(null, 0));
    }

    while (nodes.length > 1) {
        // Ordenar nodos por frecuencia ascendente
        nodes.sort((a, b) => a.freq - b.freq);
        
        const left = nodes.shift();
        const right = nodes.shift();
        const parent = new Node(null, left.freq + right.freq, left, right);
        
        nodes.push(parent);
    }
    const root = nodes[0];

    // Generar códigos
    const huffmanCodes = {};
    function generateCodes(node, code) {
        if (!node) return;
        if (node.char !== null) {
            huffmanCodes[node.char] = code || "0"; // "0" si solo hay 1 carácter
        }
        generateCodes(node.left, code + "0");
        generateCodes(node.right, code + "1");
    }
    generateCodes(root, "");

    // Comprimir texto
    let compressedText = "";
    for (let char of text) {
        compressedText += huffmanCodes[char];
    }
    document.getElementById('output-text').value = compressedText;

    // Actualizar UI (Tabla y Estadísticas)
    actualizarTabla(freqMap, huffmanCodes);
    actualizarEstadisticas(text.length, compressedText.length);
});

// 4. Lógica para el botón de Descomprimir (Conexión para el Integrante 2)
document.getElementById('btn-decompress').addEventListener('click', () => {
    const compressedText = document.getElementById('output-text').value;
    if (!compressedText) {
        alert("No hay texto comprimido para descomprimir.");
        return;
    }
    
    // Aquí el Integrante 2 conectará su función de descompresión.
    // Ejemplo: const textoOriginal = descomprimir(compressedText, arbolHuffman);
    
    alert("Botón conectado: Aquí se ejecutará la función de descompresión del Integrante 2.");
});

// 5. Lógica para el botón de Limpiar
document.getElementById('btn-clear').addEventListener('click', () => {
    document.getElementById('file-input').value = ""; // Limpia el input de archivo
    document.getElementById('input-text').value = "";
    document.getElementById('output-text').value = "";
    document.getElementById('huffman-body').innerHTML = '<tr><td colspan="3" class="vacio">Esperando texto...</td></tr>';
    document.getElementById('stat-orig').innerText = "0";
    document.getElementById('stat-comp').innerText = "0";
    document.getElementById('stat-ratio').innerText = "0%";
});

// 6. Funciones auxiliares para la Interfaz Gráfica
function actualizarTabla(freqMap, huffmanCodes) {
    const tbody = document.getElementById('huffman-body');
    tbody.innerHTML = "";
    
    // Ordenar por mayor frecuencia
    const sortedChars = Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);

    sortedChars.forEach(char => {
        const tr = document.createElement('tr');
        
        // Mostrar espacios y saltos de línea de forma legible
        let displayChar = char;
        if (char === " ") displayChar = "[Espacio]";
        else if (char === "\n") displayChar = "[Salto de línea]";
        else if (char === "\r") displayChar = "[Retorno de carro]";
        else if (char === "\t") displayChar = "[Tabulación]";

        tr.innerHTML = `
            <td>${displayChar}</td>
            <td>${freqMap[char]}</td>
            <td>${huffmanCodes[char]}</td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarEstadisticas(originalLength, compressedBits) {
    const originalBits = originalLength * 8; // Asumiendo 8 bits por carácter (ASCII)
    const ratio = ((1 - (compressedBits / originalBits)) * 100).toFixed(2);

    document.getElementById('stat-orig').innerText = originalBits.toLocaleString();
    document.getElementById('stat-comp').innerText = compressedBits.toLocaleString();
    document.getElementById('stat-ratio').innerText = ratio > 0 ? `-${ratio}%` : `${ratio}%`;
}
