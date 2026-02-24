// rutinas.js
const rutinasModule = (() => {
    const render = () => {
        const estado = DataManager.cargarEstado();
        let html = '<h2>Rutinas Diarias</h2>';
        
        // Formulario para nueva rutina con fecha y hora
        html += '<div class="form-rutina">';
        html += '<input type="text" id="nuevaRutina" placeholder="Actividad">';
        html += '<input type="date" id="fechaRutina" value="' + new Date().toISOString().split('T')[0] + '">';
        html += '<input type="time" id="horaRutina" value="' + new Date().toTimeString().slice(0,5) + '">';
        html += '<button id="agregarRutina">Agregar</button>';
        html += '</div>';
        
        html += '<ul id="listaRutinas">';
        
        // Ordenar por fecha y hora (más recientes primero)
        const rutinasOrdenadas = [...estado.rutinas].sort((a, b) => {
            const fechaA = new Date(a.fecha + 'T' + a.hora);
            const fechaB = new Date(b.fecha + 'T' + b.hora);
            return fechaB - fechaA;
        });

        rutinasOrdenadas.forEach(r => {
            // Formatear fecha para mostrar
            const fechaObj = new Date(r.fecha + 'T' + r.hora);
            const fechaStr = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            html += `<li data-id="${r.id}">
                <span>${r.titulo} - ${fechaStr}</span>
                <button class="eliminar" data-id="${r.id}">🗑️ Eliminar</button>
            </li>`;
        });
        
        html += '</ul>';
        document.getElementById('app').innerHTML = html;

        // Agregar nueva rutina
        document.getElementById('agregarRutina')?.addEventListener('click', () => {
            const titulo = document.getElementById('nuevaRutina').value.trim();
            const fecha = document.getElementById('fechaRutina').value;
            const hora = document.getElementById('horaRutina').value;
            if (titulo && fecha && hora) {
                estado.rutinas.push({
                    id: Date.now(),
                    titulo,
                    fecha,
                    hora
                });
                DataManager.guardarEstado(estado);
                render();
            } else {
                alert('Completa todos los campos');
            }
        });

        // Eliminar rutina
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




