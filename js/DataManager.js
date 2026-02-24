const DataManager = (() => {
    const STORAGE_KEY = 'teaSupportApp_data';
    
    const guardarEstado = (estadoApp) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoApp));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    };
    
    const cargarEstado = () => {
        try {
            const datos = localStorage.getItem(STORAGE_KEY);
            return datos ? JSON.parse(datos) : { 
                rutinas: [], 
                tareas: [], 
                registrosEmocionales: [],
                planes: []
            };
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
            return { rutinas: [], tareas: [], registrosEmocionales: [], planes: [] };
        }
    };
    
    return { guardarEstado, cargarEstado };
})();