// app.js
const App = (() => {
    const init = () => {
        crearEstructuraHeader();
        initTheme();
        agregarBotonAyuda();
        agregarBotonTema();

        if (typeof OnboardingModule !== 'undefined') {
            OnboardingModule.iniciar(() => {
                configurarEventos();
                cargarModulo('rutinas');
            });
        } else {
            configurarEventos();
            cargarModulo('rutinas');
        }
    };

    const crearEstructuraHeader = () => {
        const header = document.querySelector('header');
        if (!header) return;
        if (header.querySelector('.header-top')) return;

        const h1 = header.querySelector('h1');
        const nav = header.querySelector('nav');

        const headerTop = document.createElement('div');
        headerTop.className = 'header-top';

        if (h1) {
            headerTop.appendChild(h1.cloneNode(true));
            h1.remove();
        }

        const headerButtons = document.createElement('div');
        headerButtons.className = 'header-buttons';
        headerButtons.id = 'header-buttons';
        headerTop.appendChild(headerButtons);

        header.insertBefore(headerTop, header.firstChild);

        if (nav) {
            header.appendChild(nav);
        }
    };

    const configurarEventos = () => {
        document.querySelectorAll('nav button').forEach(btn => {
            btn.addEventListener('click', e => {
                const modulo = e.target.dataset.module;
                cargarModulo(modulo);
            });
        });
    };

    const cargarModulo = (modulo) => {
        // Quitar clase activa de todos los botones
        document.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        // Añadir clase activa al botón correspondiente
        const botonActivo = document.querySelector(`nav button[data-module="${modulo}"]`);
        if (botonActivo) {
            botonActivo.classList.add('active');
        }

        switch(modulo) {
            case 'rutinas': RutinasModule.render(); break;
            case 'tareas': TareasModule.render(); break;
            case 'emociones': EmocionesModule.render(); break;
            case 'cambios': CambiosModule.render(); break;
            default: console.warn('Módulo no encontrado:', modulo);
        }
    };

    const agregarBotonAyuda = () => {
        const contenedor = document.getElementById('header-buttons');
        if (!contenedor) return;
        if (document.getElementById('btn-ayuda')) return;

        const btnAyuda = document.createElement('button');
        btnAyuda.id = 'btn-ayuda';
        btnAyuda.className = 'btn-header';
        btnAyuda.innerHTML = '❓ Ayuda';

        btnAyuda.addEventListener('click', () => {
            localStorage.removeItem('onboardingCompletado');
            location.reload();
        });

        contenedor.appendChild(btnAyuda);
    };

    const agregarBotonTema = () => {
        const contenedor = document.getElementById('header-buttons');
        if (!contenedor) return;
        if (document.getElementById('btn-tema')) return;

        const btnTema = document.createElement('button');
        btnTema.id = 'btn-tema';
        btnTema.className = 'btn-header';
        btnTema.innerHTML = localStorage.getItem('tema') === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro';

        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const esOscuro = document.body.classList.contains('dark-theme');
            localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
            btnTema.innerHTML = esOscuro ? '☀️ Claro' : '🌙 Oscuro';
        });

        contenedor.appendChild(btnTema);
    };

    const initTheme = () => {
        const temaGuardado = localStorage.getItem('tema');
        if (temaGuardado === 'oscuro') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);

