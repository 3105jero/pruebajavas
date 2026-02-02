const API_URL = "http://localhost:3000";

// Obtener elementos del formulario
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// Cuando se envía el formulario
loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita que la página se recargue

  // Obtener valores de los campos
  const email = emailInput.value;
  const password = passwordInput.value;

  // Intentar hacer login
  hacerLogin(email, password);
});

// Función para hacer login
function hacerLogin(email, password) {
  // Buscar usuario en la API
  fetch(`${API_URL}/users?email=${email}`)
    .then((response) => response.json())
    .then((users) => {
      // Si encontró usuarios con ese email
      if (users.length > 0) {
        const user = users[0]; // Tomar el primer usuario encontrado

        // Verificar si la contraseña es correcta
        if (user.password === password) {
          // Login exitoso!
          guardarSesion(user);
          redirigirSegunRol(user.role);
        } else {
          // Contraseña incorrecta
          mostrarError("Contraseña incorrecta");
        }
      } else {
        // No se encontró el usuario
        mostrarError("Usuario no encontrado");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      mostrarError(
        "Error al conectar con el servidor. Asegúrate de que JSON Server esté corriendo.",
      );
    });
}

// Guardar sesión en localStorage
function guardarSesion(user) {
  // Guardar información del usuario
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
}

// Redirigir según el rol del usuario
function redirigirSegunRol(role) {
  if (role === "admin") {
    // Si es admin, ir al dashboard
    window.location.href = "admin-dashboard.html";
  } else {
    // Si es usuario normal, ir a tareas
    window.location.href = "tasks.html";
  }
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
  errorMessage.textContent = mensaje;
  errorMessage.classList.remove("d-none");

  // Ocultar el mensaje después de 5 segundos
  setTimeout(() => {
    errorMessage.classList.add("d-none");
  }, 5000);
}

// Verificar si ya hay una sesión activa al cargar la página
window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    redirigirSegunRol(user.role);
  }
});
