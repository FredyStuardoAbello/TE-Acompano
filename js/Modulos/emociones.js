// emociones.js
const EmocionesModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();
        let html = '<h2>Autorregulación Emocional</h2>';
        html += '<div class="escala-emocional">';
        const emociones = [
            { id: 'tranquilo', label: '😊 Tranquilo' },
            { id: 'contento', label: '😌 Contento' },
            { id: 'neutral', label: '😐 Neutral' },
            { id: 'ansioso', label: '😰 Ansioso' },
            { id: 'abrumado', label: '😫 Abrumado' }
        ];
        emociones.forEach(e => {
            html += `<button class="emocion-btn" data-emocion="${e.id}">${e.label}</button>`;
        });
        html += '</div>';
        html += '<div id="estrategias"></div>';
        html += '<div id="historial"></div>';
        document.getElementById('app').innerHTML = html;

        const estrategias = {
            tranquilo: ['Respira profundo', 'Disfruta el momento', 'Comparte tu calma'],
            contento: ['Reconoce lo que te hace feliz', 'Escribe algo positivo'],
            neutral: ['Observa tu entorno', 'Haz una pausa consciente'],
            ansioso: ['Cuenta hasta 10', 'Toma agua', 'Habla con alguien', 'Respiración profunda'],
            abrumado: ['Pide ayuda', 'Tómate un descanso', 'Divide el problema']
        };

        const mostrarEstrategias = (emocion) => {
            const lista = estrategias[emocion] || ['No hay estrategias específicas'];
            let stratHtml = '<h3>Estrategias sugeridas:</h3><ul>';
            lista.forEach(e => stratHtml += `<li>${e}</li>`);
            stratHtml += '</ul>';
            stratHtml += '<button id="registrarEmocion">📝 Registrar esta emoción</button>';
            document.getElementById('estrategias').innerHTML = stratHtml;

            document.getElementById('registrarEmocion')?.addEventListener('click', () => {
                estado.registrosEmocionales.push({
                    id: Date.now(),
                    emocion,
                    fecha: new Date().toLocaleString()
                });
                DataManager.guardarEstado(estado);
                alert('Emoción registrada');
                mostrarHistorial();
            });
        };

        const mostrarHistorial = () => {
            const historial = estado.registrosEmocionales || [];
            if (historial.length === 0) {
                document.getElementById('historial').innerHTML = '';
                return;
            }
            let histHtml = '<h3>Historial de emociones (últimas 5)</h3><ul>';
            historial.slice(-5).forEach(r => {
                histHtml += `<li>${r.fecha}: ${r.emocion}</li>`;
            });
            histHtml += '</ul>';
            document.getElementById('historial').innerHTML = histHtml;

            // Botón para borrar historial
            const historialDiv = document.getElementById('historial');
            if (historialDiv && !document.getElementById('btn-borrar-historial')) {
                const btnBorrar = document.createElement('button');
                btnBorrar.id = 'btn-borrar-historial';
                btnBorrar.textContent = '🗑️ Borrar historial';
                btnBorrar.style.marginTop = '10px';
                btnBorrar.style.backgroundColor = '#d32f2f';
                btnBorrar.style.color = 'white';
                btnBorrar.style.border = 'none';
                btnBorrar.style.padding = '8px 16px';
                btnBorrar.style.borderRadius = '20px';
                btnBorrar.style.cursor = 'pointer';
                btnBorrar.addEventListener('click', () => {
                    if (confirm('¿Borrar todo el historial de emociones?')) {
                        estado.registrosEmocionales = [];
                        DataManager.guardarEstado(estado);
                        mostrarHistorial();
                    }
                });
                historialDiv.appendChild(btnBorrar);
            }
        };

        document.querySelectorAll('.emocion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emocion = e.target.dataset.emocion;
                mostrarEstrategias(emocion);
            });
        });

        mostrarHistorial();
    };
    return { render };
})();


