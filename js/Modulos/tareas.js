// tareas.js - Versión completa con etiquetas de fecha y hora
const TareasModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();
        let html = '<h2>Tareas Paso a Paso</h2>';
        html += '<div style="margin-bottom:20px;">';
        html += '<input type="text" id="nuevaTarea" placeholder="Nombre de la tarea" style="margin-bottom:10px;">';
        
        // Sección de fecha y hora con etiquetas
        html += '<div style="display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">';
        html += '<div style="flex:1; min-width:140px;">';
        html += '<label for="nuevaTareaFecha" style="display:block; font-size:0.8rem; margin-bottom:4px; color:var(--color-texto);">Fecha</label>';
        html += '<input type="date" id="nuevaTareaFecha" style="width:100%;">';
        html += '</div>';
        html += '<div style="flex:1; min-width:120px;">';
        html += '<label for="nuevaTareaHora" style="display:block; font-size:0.8rem; margin-bottom:4px; color:var(--color-texto);">Hora</label>';
        html += '<input type="time" id="nuevaTareaHora" style="width:100%;">';
        html += '</div>';
        html += '</div>';

        html += '<button id="agregarTarea" style="width:100%;">➕ Agregar tarea</button>';
        html += '</div>';

        html += '<div id="listaTareas">';
        estado.tareas.forEach(t => {
            let fechaHoraTexto = '';
            if (t.fechaLimite) {
                try {
                    const fecha = new Date(t.fechaLimite);
                    fechaHoraTexto = `📅 ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    const ahora = new Date();
                    const diffHoras = (fecha - ahora) / (1000 * 60 * 60);
                    if (diffHoras < 24 && diffHoras > 0) fechaHoraTexto = '🔥 ' + fechaHoraTexto + ' (pronto)';
                    else if (diffHoras < 0) fechaHoraTexto = '⌛ ' + fechaHoraTexto + ' (vencida)';
                } catch (e) {}
            }
            html += `<div class="tarea" data-id="${t.id}">
                <h3>${t.titulo}</h3>
                ${fechaHoraTexto ? `<p style="font-size:0.9rem; color:var(--color-acento);">${fechaHoraTexto}</p>` : ''}
                <ul>`;
            (t.pasos || []).forEach((p, index) => {
                html += `<li>
                    <input type="checkbox" class="paso" data-tarea="${t.id}" data-paso="${index}" ${p.completado ? 'checked' : ''}>
                    ${p.texto}
                </li>`;
            });
            html += `</ul>
                <button class="agregarPaso" data-id="${t.id}">+ Agregar paso</button>
                <button class="eliminarTarea" data-id="${t.id}">Eliminar tarea</button>
            </div>`;
        });
        html += '</div>';
        document.getElementById('app').innerHTML = html;

        document.getElementById('agregarTarea').addEventListener('click', () => {
            const titulo = document.getElementById('nuevaTarea').value.trim();
            const fecha = document.getElementById('nuevaTareaFecha').value;
            const hora = document.getElementById('nuevaTareaHora').value;
            if (!titulo) return alert('El nombre es obligatorio');
            let fechaLimite = null;
            if (fecha && hora) fechaLimite = `${fecha}T${hora}:00`;
            else if (fecha) fechaLimite = `${fecha}T00:00:00`;
            estado.tareas.push({
                id: Date.now(),
                titulo,
                fechaLimite,
                pasos: []
            });
            DataManager.guardarEstado(estado);
            render();
        });

        document.querySelectorAll('.paso').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const tareaId = Number(e.target.dataset.tarea);
                const pasoIndex = Number(e.target.dataset.paso);
                const tarea = estado.tareas.find(t => t.id === tareaId);
                if (tarea && tarea.pasos[pasoIndex]) {
                    tarea.pasos[pasoIndex].completado = e.target.checked;
                    DataManager.guardarEstado(estado);
                }
            });
        });

        document.querySelectorAll('.agregarPaso').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tareaId = Number(e.target.dataset.id);
                const texto = prompt('Descripción del paso:');
                if (texto && texto.trim()) {
                    estado.tareas.find(t => t.id === tareaId).pasos.push({ texto: texto.trim(), completado: false });
                    DataManager.guardarEstado(estado);
                    render();
                }
            });
        });

        document.querySelectorAll('.eliminarTarea').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                estado.tareas = estado.tareas.filter(t => t.id !== id);
                DataManager.guardarEstado(estado);
                render();
            });
        });
    };
    return { render };
})();

