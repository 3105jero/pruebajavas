// Verificar que el usuario esté logueado y sea 'user'
verificarRol('user');

// Obtener el usuario actual
const currentUser = obtenerUsuarioActual();

// Cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosUsuario();
    cargarEstadisticas();
});

// Cargar datos del usuario
function cargarDatosUsuario() {
    // Mostrar nombre completo
    document.getElementById('userFullName').textContent = currentUser.fullName;
    
    // Mostrar usuario
    document.getElementById('userUsername').textContent = currentUser.username;
    
    // Mostrar email
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // Mostrar rol
    const rolBadge = document.getElementById('userRole');
    rolBadge.textContent = currentUser.role === 'admin' ? 'Administrador' : 'Usuario';
    
    // Mostrar iniciales
    const iniciales = obtenerIniciales(currentUser.fullName);
    document.getElementById('userInitials').textContent = iniciales;
}

// Obtener iniciales del nombre
function obtenerIniciales(nombre) {
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
        return palabras[0][0].toUpperCase() + palabras[1][0].toUpperCase();
    }
    return palabras[0][0].toUpperCase();
}

// Cargar estadísticas de tareas del usuario
function cargarEstadisticas() {
    // Obtener todas las tareas del usuario
    fetch(`${API_URL}/tasks?userId=${currentUser.id}`)
        .then(response => response.json())
        .then(tasks => {
            // Total de tareas
            document.getElementById('totalTasks').textContent = tasks.length;
            
            // Contar pendientes
            const pendientes = tasks.filter(task => task.status === 'pending').length;
            document.getElementById('pendingTasks').textContent = pendientes;
            
            // Contar completadas
            const completadas = tasks.filter(task => task.status === 'completed').length;
            document.getElementById('completedTasks').textContent = completadas;
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
        });
}
