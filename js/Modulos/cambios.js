// cambios.js
const CambiosModule = (() => {
    const render = () => {
        // Obtener el estado actual desde DataManager
        const estado = DataManager.cargarEstado();

        // Asegurar que la propiedad 'planes' existe y tiene id
        if (!estado.planes) estado.planes = [];
        // Asignar id a planes antiguos (por si acaso)
        estado.planes = estado.planes.map(p => {
            if (!p.id) p.id = Date.now() + Math.random();
            return p;
        });

        // Construir la interfaz HTML
        let html = '<h2>Manejo de Cambios</h2>';
        html += '<div class="cambios-form">';
        html += '<label>Cambio inesperado: <input type="text" id="cambioDesc" placeholder="Ej: Corte de luz"></label>';
        html += '<label>Ajustes posibles: <textarea id="ajustes" placeholder="Ej: Usar linterna, Reagendar"></textarea></label>';
        html += '<button id="guardarPlan">Guardar plan</button>';
        html += '</div>';
        html += '<div id="planesGuardados"></div>';
        html += '<div id="accionesCambios" style="margin-top:10px;"></div>'; // Contenedor para botón borrar todos

        // Insertar en el DOM
        document.getElementById('app').innerHTML = html;

        // Función para mostrar los planes guardados
        const mostrarPlanes = () => {
            if (estado.planes.length === 0) {
                document.getElementById('planesGuardados').innerHTML = '<p>No hay planes guardados.</p>';
                document.getElementById('accionesCambios').innerHTML = '';
                return;
            }

            let planesHtml = '<h3>Planes guardados</h3><ul style="list-style:none; padding:0;">';
            estado.planes.forEach(p => {
                planesHtml += `<li style="display: flex; align-items: center; justify-content: space-between; background: #f9fbfd; margin-bottom: 8px; padding: 10px; border-radius: 8px; border-left: 4px solid var(--color-boton);">
                    <span><strong>${p.cambio}</strong> (${p.fecha}): ${p.ajustes}</span>
                    <button class="eliminar-plan" data-id="${p.id}" style="background-color:#d32f2f; color:white; border:none; border-radius:20px; padding:5px 12px; margin-left:10px; cursor:pointer;">🗑️ Eliminar</button>
                </li>`;
            });
            planesHtml += '</ul>';
            document.getElementById('planesGuardados').innerHTML = planesHtml;

            // Botón para borrar todos
            document.getElementById('accionesCambios').innerHTML = '<button id="borrarTodosPlanes" style="background-color:#d32f2f; color:white; border:none; border-radius:20px; padding:8px 16px; cursor:pointer;">🗑️ Borrar todos los planes</button>';

            // Eventos eliminar individual
            document.querySelectorAll('.eliminar-plan').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = Number(e.target.dataset.id);
                    estado.planes = estado.planes.filter(p => p.id !== id);
                    DataManager.guardarEstado(estado);
                    render(); // Recargar el módulo
                });
            });

            // Evento borrar todos
            document.getElementById('borrarTodosPlanes')?.addEventListener('click', () => {
                if (confirm('¿Borrar todos los planes guardados?')) {
                    estado.planes = [];
                    DataManager.guardarEstado(estado);
                    render();
                }
            });
        };

        // Evento para guardar un nuevo plan
        document.getElementById('guardarPlan')?.addEventListener('click', () => {
            const cambio = document.getElementById('cambioDesc').value.trim();
            const ajustes = document.getElementById('ajustes').value.trim();
            if (cambio && ajustes) {
                estado.planes.push({ 
                    id: Date.now(),
                    cambio, 
                    ajustes, 
                    fecha: new Date().toLocaleString() 
                });
                DataManager.guardarEstado(estado);
                // Limpiar campos
                document.getElementById('cambioDesc').value = '';
                document.getElementById('ajustes').value = '';
                mostrarPlanes();
            } else {
                alert('Completa ambos campos');
            }
        });

        // Mostrar los planes existentes al cargar el módulo
        mostrarPlanes();
    };

    return { render };
})();
