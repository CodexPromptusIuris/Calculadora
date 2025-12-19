// Variable Global
let valorUF = 38000; // Valor fallback por si falla la API

// 1. CARGA INICIAL: Obtener valor real de la UF
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://mindicador.cl/api/uf')
        .then(response => response.json())
        .then(data => {
            if(data.serie && data.serie.length > 0) {
                valorUF = data.serie[0].valor;
                // Actualizar visualmente
                document.getElementById('uf-display').innerText = `$${valorUF.toLocaleString('es-CL')}`;
            }
        })
        .catch(err => {
            console.error('Error API UF:', err);
            document.getElementById('uf-display').innerText = '$38.000 (Ref)';
        });
});

// 2. FUNCIÓN PRINCIPAL: Calcular y Generar Link
document.getElementById('btn-calcular').addEventListener('click', () => {
    
    // Obtener elementos del DOM
    const m2Input = document.getElementById('m2');
    const nivelesSelect = document.getElementById('niveles');
    const pendienteSelect = document.getElementById('pendiente');
    const calidadSelect = document.getElementById('calidad');

    // Obtener valores numéricos
    const m2 = parseFloat(m2Input.value) || 0;
    const factorNivel = parseFloat(nivelesSelect.value);
    const factorPendiente = parseFloat(pendienteSelect.value);
    const ufMetroCuadrado = parseFloat(calidadSelect.value);

    // Validación simple
    if(m2 < 10) { 
        alert("Por favor ingresa una superficie válida (mínimo 10 m²)."); 
        return; 
    }

    // --- LÓGICA DE CÁLCULO ---
    // Costo Obra = m2 * Calidad * FactorPisos * FactorPendiente
    const costoNetoUF = m2 * ufMetroCuadrado * factorNivel * factorPendiente;
    
    // Sumar Honorarios y Gastos Generales (aprox +12%)
    const totalUF = costoNetoUF * 1.12;

    // Convertir a Pesos Chilenos
    const totalCLP = totalUF * valorUF;

    // Formatear para mostrar bonito ($ 100.000.000)
    const formatoPeso = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });
    
    const precioTexto = formatoPeso.format(totalCLP);

    // Mostrar Resultados en Pantalla
    const resultDiv = document.getElementById('resultado');
    document.getElementById('precio-final').innerText = precioTexto;
    resultDiv.classList.remove('hidden');

    // --- GENERACIÓN LINK WHATSAPP ---
    
    // 1. Obtener los textos legibles de los selects (para que el mensaje diga "Terreno Plano" y no "1")
    const textoNivel = nivelesSelect.options[nivelesSelect.selectedIndex].text;
    const textoPendiente = pendienteSelect.options[pendienteSelect.selectedIndex].text;
    const textoCalidad = calidadSelect.options[calidadSelect.selectedIndex].text;

    // 2. Redactar el mensaje
    // \n significa salto de línea
    const mensaje = `Hola Luz y Sombra, hice una estimación en su web y me gustaría agendar una reunión.\n\n` +
                    `📋 *Mi Ficha Técnica:*\n` +
                    `- Superficie: ${m2} m²\n` +
                    `- Niveles: ${textoNivel}\n` +
                    `- Terreno: ${textoPendiente}\n` +
                    `- Tipo: ${textoCalidad}\n\n` +
                    `💰 *Inversión Estimada: ${precioTexto}*`;

    // 3. Crear el Link (Número del estudio: 56953464563)
    const telefonoDestino = "56953464563"; 
    const urlFinal = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;

    // 4. Asignar al botón
    document.getElementById('link-whatsapp').href = urlFinal;
});
