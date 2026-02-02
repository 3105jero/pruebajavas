# CRUDZASO - Sistema de Gestión de Tareas Académicas

## Descripción

CRUDZASO es una aplicación web para la gestión de tareas académicas o laborales que permite a los usuarios registrarse, iniciar sesión y administrar sus tareas. Incluye un panel administrativo para supervisar todas las actividades del sistema.

### Para Usuarios

- Registro e inicio de sesión
- Crear, editar y eliminar tareas
- Filtrar tareas por estado (Pendiente, En progreso, Completada)
- Ver perfil personal con estadísticas
- Cambiar estado de las tareas

### Para Administradores

- Ver todas las tareas de todos los usuarios identificados por el nombre
- Editar cualquier tarea
- Eliminar tareas
- Estadísticas generales

## Tecnologías Utilizadas

- HTML5
- CSS
- Bootstrap 5
- JavaScript (Vanilla)
- JSON Server (API falsa)
- LocalStorage (manejo de sesión)

### Requisitos previos

- Node.js instalado en tu computadora
- Navegador web por ejemplo chrome o firefox

### Paso 1: Instalar JSON Server

Abre tu terminal o línea de comandos y ejecuta:

```bash
npm install -g json-server
```

### Paso 2: Descargar el proyecto

Descarga o clona este proyecto en tu computadora.

### Paso 3: Iniciar JSON Server

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
npx json-server db.json
```

Deberías ver un mensaje como:

```
JSON Server started on PORT :3000 y una carita como esta: "( ˶ˆ ᗜ ˆ˵ )"
```

### Paso 4: Abrir la aplicación

Ahora puedes abrir el archivo `login.html` en tu navegador.

**Importante:** Asegúrate de que JSON Server esté corriendo antes de usar la aplicación.

## Usuarios de Prueba

### Usuario Administrador

- **Email:** admin@prueba.com
- **Contraseña:** 123

### Usuario Regular

- **Email:** pedrito@prueba.com
- **Contraseña:** 123

## 📂 Estructura del Proyecto

```
crudzaso/
│
├── css/
│   └── styles.css          # Estilos personalizados
│
├── js/
│   ├── login.js           # Lógica de inicio de sesión
│   ├── register.js        # Lógica de registro
│   ├── auth.js            # Verificación de autenticación
│   ├── tasks.js           # Gestión de tareas de usuario
│   ├── profile.js         # Página de perfil
│   └── admin-dashboard.js # Dashboard del administrador
│
├── login.html             # Página de inicio de sesión
├── register.html          # Página de registro
├── tasks.html             # Gestión de tareas (usuario)
├── profile.html           # Perfil de usuario
├── admin-dashboard.html   # Dashboard del admin
└── db.json                # Base de datos falsa (JSON Server)
```

### Roles del Sistema

- **user:** Puede gestionar solo sus propias tareas
- **admin:** Puede ver y gestionar todas las tareas del sistema

### Protección de Rutas

- Si un usuario intenta acceder a una página de admin, será redirigido
- Si no hay sesión activa, se redirige automáticamente al login
- La sesión se guarda en localStorage del navegador

## Funcionalidades Principales

### Login

1. Ingresa tu email y contraseña
2. El sistema verifica tus credenciales
3. Redirige según tu rol (user o admin)

### Registro

1. Completa el formulario con tus datos
2. El sistema verifica que el email no esté registrado
3. Crea tu cuenta con rol "user" automáticamente
4. Te redirige al login

### Gestión de Tareas (Usuario)

1. Ver todas tus tareas en tarjetas
2. Crear nueva tarea con título, descripción y estado
3. Editar tareas existentes
4. Eliminar tareas
5. Filtrar por estado

### Dashboard Admin

2. Ver todas las tareas en una tabla
3. Editar cualquier tarea
4. Eliminar cualquier tarea
5. Filtrar por estado

## Solución de Problemas

### El login no funciona

- Verifica que JSON Server esté corriendo en el puerto 3000
- En caso de que aun asi persista,busca en la consola del navegador que provoca el error

### No se muestran las tareas

- Asegúrate de estar logueado
- Verifica que JSON Server esté corriendo
- Comprueba que haya tareas en db.json puedes entrar a la pagina (http://localhost:3000/tasks)

### Error de CORS

- JSON Server debería manejar CORS automáticamente
- Si persiste, verifica que la URL en los archivos JS sea `http://localhost:3000`

## Importante

1. **JSON Server debe estar corriendo:** Recuerda iniciar JSON Server antes de usar la aplicación
2. **LocalStorage:** La sesión se guarda en el navegador, si borras los datos del navegador perderás la sesión

## Autor

Proyecto desarrollado para el Módulo 3 - CRUDZASO por Jeronimo Torres

## Licencia

Este proyecto es de código abierto y está disponible para fines educativos.
