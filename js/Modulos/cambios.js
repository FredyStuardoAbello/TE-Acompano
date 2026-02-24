// cambios.js
const CambiosModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();
        if (!estado.planes) estado.planes = [];
        estado.planes = estado.planes.map(p => {
            if (!p.id) p.id = Date.now() + Math.random();
            return p;
        });

        let html = '<h2>Manejo de Cambios</h2>';
        html += '<div class="cambios-form">';
        html += '<label>Cambio inesperado: <input type="text" id="cambioDesc" placeholder="Ej: Corte de luz"></label>';
        html += '<label>Ajustes posibles: <textarea id="ajustes" placeholder="Ej: Usar linterna, Reagendar"></textarea></label>';
        html += '<label>Fecha del cambio: <input type="date" id="fechaCambio" value="' + new Date().toISOString().split('T')[0] + '"></label>';
        html += '<button id="guardarPlan">Guardar plan</button>';
        html += '</div>';
        html += '<div id="planesGuardados"></div>';
        html += '<div id="accionesCambios" style="margin-top:10px;"></div>';

        document.getElementById('app').innerHTML = html;

        const mostrarPlanes = () => {
            if (estado.planes.length === 0) {
                document.getElementById('planesGuardados').innerHTML = '<p>No hay planes guardados.</p>';
                document.getElementById('accionesCambios').innerHTML = '';
                return;
            }

            let planesHtml = '<h3>Planes guardados</h3><ul style="list-style:none; padding:0;">';
            // Ordenar por fecha (más recientes primero)
            const planesOrdenados = [...estado.planes].sort((a, b) => {
                return new Date(b.fecha) - new Date(a.fecha);
            });
            planesOrdenados.forEach(p => {
                const fechaObj = new Date(p.fecha);
                const fechaStr = fechaObj.toLocaleDateString();
                planesHtml += `<li style="display: flex; align-items: center; justify-content: space-between; background: #f9fbfd; margin-bottom: 8px; padding: 10px; border-radius: 8px; border-left: 4px solid var(--color-boton);">
                    <span><strong>${p.cambio}</strong> (${fechaStr}): ${p.ajustes}</span>
                    <button class="eliminar-plan" data-id="${p.id}" style="background-color:#d32f2f; color:white; border:none; border-radius:20px; padding:5px 12px; margin-left:10px; cursor:pointer;">🗑️ Eliminar</button>
                </li>`;
            });
            planesHtml += '</ul>';
            document.getElementById('planesGuardados').innerHTML = planesHtml;

            document.getElementById('accionesCambios').innerHTML = '<button id="borrarTodosPlanes" style="background-color:#d32f2f; color:white; border:none; border-radius:20px; padding:8px 16px; cursor:pointer;">🗑️ Borrar todos los planes</button>';

            document.querySelectorAll('.eliminar-plan').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = Number(e.target.dataset.id);
                    estado.planes = estado.planes.filter(p => p.id !== id);
                    DataManager.guardarEstado(estado);
                    render();
                });
            });

            document.getElementById('borrarTodosPlanes')?.addEventListener('click', () => {
                if (confirm('¿Borrar todos los planes guardados?')) {
                    estado.planes = [];
                    DataManager.guardarEstado(estado);
                    render();
                }
            });
        };

        document.getElementById('guardarPlan')?.addEventListener('click', () => {
            const cambio = document.getElementById('cambioDesc').value.trim();
            const ajustes = document.getElementById('ajustes').value.trim();
            const fecha = document.getElementById('fechaCambio').value;
            if (cambio && ajustes && fecha) {
                estado.planes.push({ 
                    id: Date.now(),
                    cambio, 
                    ajustes, 
                    fecha: fecha // guardamos la fecha en formato YYYY-MM-DD
                });
                DataManager.guardarEstado(estado);
                document.getElementById('cambioDesc').value = '';
                document.getElementById('ajustes').value = '';
                // La fecha se mantiene por defecto
                mostrarPlanes();
            } else {
                alert('Completa todos los campos');
            }
        });

        mostrarPlanes();
    };
    return { render };
})();

