// onboarding.js - Módulo para manejar el flujo de bienvenida y tour
const OnboardingModule = (() => {
    const ONBOARDING_KEY = 'onboardingCompletado';

    // Verifica si el onboarding ya fue visto
    const debeMostrarse = () => {
        return !localStorage.getItem(ONBOARDING_KEY);
    };

    // Marca el onboarding como visto
    const marcarComoVisto = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true');
    };

    // Muestra la pantalla de bienvenida
    const mostrarBienvenida = (callback) => {
        const overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        overlay.id = 'onboarding-overlay';
        overlay.innerHTML = `
            <div class="onboarding-card">
                <h2>😊 ¡Bienvenido a TE Acompaño!</h2>
                <p>Esta aplicación te ayudará a organizar tu día, gestionar tareas y regular tus emociones de manera sencilla y privada.</p>
                <div class="onboarding-buttons">
                    <button id="onboarding-start" class="btn-primary">Comenzar tour</button>
                    <button id="onboarding-skip" class="btn-secondary">Omitir tour</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('onboarding-start').addEventListener('click', () => {
            document.body.removeChild(overlay);
            mostrarTour(callback);
        });

        document.getElementById('onboarding-skip').addEventListener('click', () => {
            document.body.removeChild(overlay);
            marcarComoVisto();
            if (callback) callback();
        });
    };

    // Muestra el tour guiado
    const mostrarTour = (callback) => {
        const overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        overlay.id = 'onboarding-overlay';
        overlay.innerHTML = `
            <div class="onboarding-tour">
                <h3>🔍 Explora las secciones</h3>
                <ul>
                    <li><span class="emoji">📋</span> <strong>Rutinas:</strong> Organiza tus actividades diarias</li>
                    <li><span class="emoji">✅</span> <strong>Tareas:</strong> Divide tareas complejas en pasos</li>
                    <li><span class="emoji">😊</span> <strong>Emociones:</strong> Identifica y regula tu estado emocional</li>
                    <li><span class="emoji">🔄</span> <strong>Cambios:</strong> Planifica ajustes ante imprevistos</li>
                </ul>
                <p>¿Quieres crear tu primera actividad ahora?</p>
                <div class="tour-buttons">
                    <button id="tour-create" class="btn-primary">Crear actividad</button>
                    <button id="tour-finish" class="btn-secondary">Finalizar tour</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('tour-create').addEventListener('click', () => {
            document.body.removeChild(overlay);
            marcarComoVisto();
            if (typeof RutinasModule !== 'undefined') {
                RutinasModule.render();
                setTimeout(() => {
                    const input = document.getElementById('nuevaRutina');
                    const btn = document.getElementById('agregarRutina');
                    if (input && btn) {
                        input.value = 'Mi primera actividad';
                        btn.click();
                    }
                }, 500);
            } else if (callback) callback();
        });

        document.getElementById('tour-finish').addEventListener('click', () => {
            document.body.removeChild(overlay);
            marcarComoVisto();
            if (callback) callback();
        });
    };

    // Inicia el proceso de onboarding
    const iniciar = (callback) => {
        if (debeMostrarse()) {
            mostrarBienvenida(callback);
        } else {
            if (callback) callback();
        }
    };

    return { iniciar };
})();