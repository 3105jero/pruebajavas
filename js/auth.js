// Este archivo verifica que el usuario esté logueado
// Se incluye en todas las páginas que requieren autenticación

// URL de la API
const API_URL = 'http://localhost:3000';

// Función para verificar si hay una sesión activa
function verificarSesion() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Si no hay sesión, redirigir al login
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return null;
    }
    
    // Obtener datos del usuario
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        cerrarSesion();
        return null;
    }
    
    return JSON.parse(userData);
}

// Función para verificar el rol del usuario
function verificarRol(rolRequerido) {
    const user = verificarSesion();
    
    if (!user) {
        return false;
    }
    
    // Si el rol no coincide, redirigir
    if (user.role !== rolRequerido) {
        if (user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'tasks.html';
        }
        return false;
    }
    
    return true;
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Configurar el botón de cerrar sesión si existe
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
});

// Obtener el usuario actual
function obtenerUsuarioActual() {
    return verificarSesion();
}
