// tareas.js
const TareasModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();
        let html = '<h2>Tareas Paso a Paso</h2>';
        html += '<input type="text" id="nuevaTarea" placeholder="Nueva tarea">';
        html += '<button id="agregarTarea">Agregar</button>';
        html += '<div id="listaTareas">';
        
        estado.tareas.forEach(t => {
            html += `<div class="tarea" data-id="${t.id}">
                <h3>${t.titulo}</h3>
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

        // Agregar nueva tarea
        document.getElementById('agregarTarea')?.addEventListener('click', () => {
            const titulo = document.getElementById('nuevaTarea').value.trim();
            if (titulo) {
                estado.tareas.push({
                    id: Date.now(),
                    titulo,
                    pasos: []
                });
                DataManager.guardarEstado(estado);
                render();
            }
        });

        // Marcar paso completado
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

        // Agregar paso a tarea existente
        document.querySelectorAll('.agregarPaso').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tareaId = Number(e.target.dataset.id);
                const texto = prompt('Descripción del paso:');
                if (texto && texto.trim()) {
                    const tarea = estado.tareas.find(t => t.id === tareaId);
                    tarea.pasos.push({ texto: texto.trim(), completado: false });
                    DataManager.guardarEstado(estado);
                    render();
                }
            });
        });

        // Eliminar tarea completa
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