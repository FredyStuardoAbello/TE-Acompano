// rutinas.js - Versión completa con etiquetas de fecha y hora
const RutinasModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();

        let html = '<h2>Rutinas Diarias</h2>';
        html += '<div style="margin-bottom:20px;">';
        html += '<input type="text" id="nuevaRutina" placeholder="Nombre de la rutina" style="margin-bottom:10px;">';
        
        // Sección de fecha y hora con etiquetas
        html += '<div style="display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">';
        html += '<div style="flex:1; min-width:140px;">';
        html += '<label for="nuevaRutinaFecha" style="display:block; font-size:0.8rem; margin-bottom:4px; color:var(--color-texto);">Fecha</label>';
        html += '<input type="date" id="nuevaRutinaFecha" style="width:100%;">';
        html += '</div>';
        html += '<div style="flex:1; min-width:120px;">';
        html += '<label for="nuevaRutinaHora" style="display:block; font-size:0.8rem; margin-bottom:4px; color:var(--color-texto);">Hora</label>';
        html += '<input type="time" id="nuevaRutinaHora" style="width:100%;">';
        html += '</div>';
        html += '</div>';

        html += '<button id="agregarRutina" style="width:100%;">➕ Agregar rutina</button>';
        html += '</div>';

        html += '<ul id="listaRutinas">';
        estado.rutinas.forEach(r => {
            let fechaHoraTexto = '';
            if (r.fechaLimite) {
                try {
                    const fecha = new Date(r.fechaLimite);
                    fechaHoraTexto = `📅 ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    const ahora = new Date();
                    const diffHoras = (fecha - ahora) / (1000 * 60 * 60);
                    if (diffHoras < 24 && diffHoras > 0) fechaHoraTexto = '🔥 ' + fechaHoraTexto + ' (pronto)';
                    else if (diffHoras < 0) fechaHoraTexto = '⌛ ' + fechaHoraTexto + ' (vencida)';
                } catch (e) {}
            }
            html += `<li>
                <div style="flex:1;">
                    <strong>${r.titulo}</strong>
                    ${fechaHoraTexto ? `<br><span style="font-size:0.9rem; color:var(--color-acento);">${fechaHoraTexto}</span>` : ''}
                </div>
                <button class="eliminar" data-id="${r.id}">🗑️ Eliminar</button>
            </li>`;
        });
        html += '</ul>';
        document.getElementById('app').innerHTML = html;

        document.getElementById('agregarRutina').addEventListener('click', () => {
            const titulo = document.getElementById('nuevaRutina').value.trim();
            const fecha = document.getElementById('nuevaRutinaFecha').value;
            const hora = document.getElementById('nuevaRutinaHora').value;
            if (!titulo) return alert('El nombre es obligatorio');
            let fechaLimite = null;
            if (fecha && hora) fechaLimite = `${fecha}T${hora}:00`;
            else if (fecha) fechaLimite = `${fecha}T00:00:00`;
            estado.rutinas.push({
                id: Date.now(),
                titulo,
                fechaLimite,
                hora: fechaLimite ? new Date(fechaLimite).toLocaleTimeString() : new Date().toLocaleTimeString()
            });
            DataManager.guardarEstado(estado);
            render();
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                estado.rutinas = estado.rutinas.filter(r => r.id !== id);
                DataManager.guardarEstado(estado);
                render();
            });
        });
    };
    return { render };
})();







