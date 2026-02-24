// rutinas.js - Versión con fecha/hora, indicadores y mejoras visuales
const RutinasModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();

        let html = '<h2>Rutinas Diarias</h2>';

        // Formulario para nueva rutina con fecha y hora
        html += '<div style="margin-bottom:20px;">';
        html += '<input type="text" id="nuevaRutina" placeholder="Nombre de la rutina" style="margin-bottom:10px;">';
        html += '<div style="display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">';
        html += '<input type="date" id="nuevaRutinaFecha" style="flex:1; min-width:140px;">';
        html += '<input type="time" id="nuevaRutinaHora" style="flex:1; min-width:120px;">';
        html += '</div>';
        html += '<button id="agregarRutina" style="width:100%;">➕ Agregar rutina</button>';
        html += '</div>';

        html += '<ul id="listaRutinas">';

        estado.rutinas.forEach(r => {
            // Procesar fecha/hora si existe
            let fechaHoraTexto = '';
            if (r.fechaLimite) {
                try {
                    const fecha = new Date(r.fechaLimite);
                    fechaHoraTexto = `📅 ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                    const ahora = new Date();
                    const diffHoras = (fecha - ahora) / (1000 * 60 * 60);
                    if (diffHoras < 24 && diffHoras > 0) {
                        fechaHoraTexto = '🔥 ' + fechaHoraTexto + ' (pronto)';
                    } else if (diffHoras < 0) {
                        fechaHoraTexto = '⌛ ' + fechaHoraTexto + ' (vencida)';
                    }
                } catch (e) {
                    fechaHoraTexto = '';
                }
            }

            html += `<li>
                <div style="flex:1;">
                    <strong>${r.titulo}</strong>
                    ${fechaHoraTexto ? `<br><span style="font-size:0.9rem; color:var(--color-acento);">${fechaHoraTexto}</span>` : ''}
                </div>
                <button class="eliminar" data-id="${r.id}" style="background-color:#d32f2f; color:white; border:none; border-radius:20px; padding:8px 16px; cursor:pointer;">🗑️ Eliminar</button>
            </li>`;
        });

        html += '</ul>';
        document.getElementById('app').innerHTML = html;

        // Evento para agregar nueva rutina
        document.getElementById('agregarRutina')?.addEventListener('click', () => {
            const titulo = document.getElementById('nuevaRutina').value.trim();
            const fecha = document.getElementById('nuevaRutinaFecha').value;
            const hora = document.getElementById('nuevaRutinaHora').value;

            if (!titulo) {
                alert('El nombre de la rutina es obligatorio');
                return;
            }

            let fechaLimite = null;
            if (fecha && hora) {
                fechaLimite = `${fecha}T${hora}:00`;
            } else if (fecha) {
                fechaLimite = `${fecha}T00:00:00`;
            }

            estado.rutinas.push({
                id: Date.now(),
                titulo,
                fechaLimite,
                hora: fechaLimite ? new Date(fechaLimite).toLocaleTimeString() : new Date().toLocaleTimeString()
            });
            DataManager.guardarEstado(estado);
            render();
        });

        // Evento para eliminar rutina
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






