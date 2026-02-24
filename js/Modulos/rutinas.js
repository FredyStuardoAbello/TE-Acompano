// rutinas.js
const RutinasModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();
        let html = '<h2>Rutinas Diarias</h2>';
        html += '<input type="text" id="nuevaRutina" placeholder="Nueva actividad">';
        html += '<button id="agregarRutina">Agregar</button>';
        html += '<ul id="listaRutinas">';

        estado.rutinas.forEach(r => {
            html += `<li>
                <span>${r.titulo} - ${r.hora || 'Sin hora'}</span>
                <button class="eliminar" data-id="${r.id}">🗑️ Eliminar</button>
            </li>`;
        });

        html += '</ul>';
        document.getElementById('app').innerHTML = html;

        // --- Agregar nueva rutina ---
        document.getElementById('agregarRutina')?.addEventListener('click', () => {
            const titulo = document.getElementById('nuevaRutina').value.trim();
            if (titulo) {
                estado.rutinas.push({
                    id: Date.now(),
                    titulo,
                    hora: new Date().toLocaleTimeString()
                });
                DataManager.guardarEstado(estado);
                render();
            }
        });

        // --- Eliminar rutina ---
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


