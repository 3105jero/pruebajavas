// URL de la API (JSON Server)
const API_URL = 'http://localhost:3000';

// Obtener elementos del formulario
const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Cuando se envía el formulario
registerForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue
    
    // Obtener valores
    const fullName = fullNameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        mostrarError('Las contraseñas no coinciden');
        return;
    }
    
    // Verificar si el email ya existe
    verificarYRegistrar(fullName, username, email, password);
});

// Función para verificar si el email existe y registrar
function verificarYRegistrar(fullName, username, email, password) {
    // Buscar si ya existe un usuario con ese email
    fetch(`${API_URL}/users?email=${email}`)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                // El email ya está registrado
                mostrarError('Este correo electrónico ya está registrado');
            } else {
                // El email está disponible, crear el usuario
                crearUsuario(fullName, username, email, password);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarError('Error al conectar con el servidor. Asegúrate de que JSON Server esté corriendo.');
        });
}

// Función para crear un nuevo usuario
function crearUsuario(fullName, username, email, password) {
    // Crear objeto con los datos del nuevo usuario
    const nuevoUsuario = {
        fullName: fullName,
        username: username,
        email: email,
        password: password,
        role: 'user' // Todos los nuevos usuarios son 'user' por defecto
    };
    
    // Enviar a la API para crear el usuario
    fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
    .then(response => response.json())
    .then(data => {
        // Usuario creado exitosamente
        mostrarExito('¡Cuenta creada exitosamente! Redirigiendo al login...');
        
        // Limpiar el formulario
        registerForm.reset();
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarError('Error al crear la cuenta. Intenta de nuevo.');
    });
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    errorMessage.textContent = mensaje;
    errorMessage.classList.remove('d-none');
    successMessage.classList.add('d-none');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 5000);
}

// Mostrar mensaje de éxito
function mostrarExito(mensaje) {
    successMessage.textContent = mensaje;
    successMessage.classList.remove('d-none');
    errorMessage.classList.add('d-none');
}
