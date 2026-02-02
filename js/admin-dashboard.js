// Verificar que el usuario esté logueado y sea 'admin'
verificarRol('admin');

// Obtener el usuario actual
const currentUser = obtenerUsuarioActual();

// Elementos del DOM
const tasksTableBody = document.getElementById('tasksTableBody');
const noTasks = document.getElementById('noTasks');
const filterStatus = document.getElementById('filterStatus');
const editTaskForm = document.getElementById('editTaskForm');

// Variable para el modal de edición
let editModal;

// Cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarMetricas();
    cargarTodasLasTareas();
    configurarEventos();
    
    // Inicializar modal de edición
    editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
});

// Configurar eventos
function configurarEventos() {
    // Filtro de estado
    filterStatus.addEventListener('change', cargarTodasLasTareas);
    
    // Submit del formulario de edición
    editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        actualizarTarea();
    });
}

// Cargar métricas del dashboard
function cargarMetricas() {
    // Obtener todas las tareas
    fetch(`${API_URL}/tasks`)
        .then(response => response.json())
        .then(tasks => {
            // Total de tareas
            document.getElementById('totalTasksMetric').textContent = tasks.length;
            
            // Tareas pendientes
            const pendientes = tasks.filter(t => t.status === 'pending').length;
            document.getElementById('pendingTasksMetric').textContent = pendientes;
            
            // Tareas completadas
            const completadas = tasks.filter(t => t.status === 'completed').length;
            document.getElementById('completedTasksMetric').textContent = completadas;
        })
        .catch(error => {
            console.error('Error al cargar métricas:', error);
        });
    
    // Obtener total de usuarios
    fetch(`${API_URL}/users`)
        .then(response => response.json())
        .then(users => {
            document.getElementById('totalUsersMetric').textContent = users.length;
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
        });
}

// Cargar todas las tareas del sistema
function cargarTodasLasTareas() {
    const filtro = filterStatus.value;
    let url = `${API_URL}/tasks`;
    
    // Aplicar filtro si no es "all"
    if (filtro !== 'all') {
        url += `?status=${filtro}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(tasks => {
            mostrarTareasEnTabla(tasks);
        })
        .catch(error => {
            console.error('Error al cargar tareas:', error);
        });
}

// Mostrar tareas en la tabla
function mostrarTareasEnTabla(tasks) {
    // Limpiar tabla
    tasksTableBody.innerHTML = '';
    
    // Si no hay tareas
    if (tasks.length === 0) {
        noTasks.classList.remove('d-none');
        document.querySelector('.table-responsive').classList.add('d-none');
        return;
    }
    
    noTasks.classList.add('d-none');
    document.querySelector('.table-responsive').classList.remove('d-none');
    
    // Para cada tarea, necesitamos obtener el nombre del usuario
    const promesas = tasks.map(task => {
        return fetch(`${API_URL}/users/${task.userId}`)
            .then(response => response.json())
            .then(user => {
                return { ...task, userName: user.username };
            });
    });
    
    // Cuando todas las promesas se resuelvan
    Promise.all(promesas)
        .then(tasksConUsuarios => {
            tasksConUsuarios.forEach(task => {
                const row = crearFilaTabla(task);
                tasksTableBody.appendChild(row);
            });
        });
}

// Crear fila de tabla
function crearFilaTabla(task) {
    const tr = document.createElement('tr');
    
    // Badge según estado
    let badgeClass = '';
    let estadoTexto = '';
    
    if (task.status === 'pending') {
        badgeClass = 'bg-warning text-dark';
        estadoTexto = 'Pendiente';
    } else if (task.status === 'in progress') {
        badgeClass = 'bg-info text-dark';
        estadoTexto = 'En progreso';
    } else if (task.status === 'completed') {
        badgeClass = 'bg-success';
        estadoTexto = 'Completada';
    }
    
    tr.innerHTML = `
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td>${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}</td>
        <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
        <td>${task.userName || 'N/A'}</td>
        <td>${task.createdAt || 'N/A'}</td>
        <td>
            <button class="btn btn-sm btn-primary btn-action" onclick="abrirModalEditar(${task.id})">
                Editar
            </button>
            <button class="btn btn-sm btn-danger btn-action" onclick="eliminarTarea(${task.id})">
                Eliminar
            </button>
        </td>
    `;
    
    return tr;
}

// Abrir modal para editar
function abrirModalEditar(id) {
    // Buscar la tarea
    fetch(`${API_URL}/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            // Llenar el formulario
            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTaskTitle').value = task.title;
            document.getElementById('editTaskDescription').value = task.description;
            document.getElementById('editTaskStatus').value = task.status;
            
            // Abrir modal
            editModal.show();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Actualizar tarea
function actualizarTarea() {
    const id = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value;
    const description = document.getElementById('editTaskDescription').value;
    const status = document.getElementById('editTaskStatus').value;
    
    // Objeto con datos actualizados
    const tareaActualizada = {
        title: title,
        description: description,
        status: status
    };
    
    // Enviar actualización
    fetch(`${API_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tareaActualizada)
    })
    .then(response => response.json())
    .then(data => {
        // Cerrar modal
        editModal.hide();
        
        // Recargar tareas y métricas
        cargarTodasLasTareas();
        cargarMetricas();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar la tarea');
    });
}

// Eliminar tarea
function eliminarTarea(id) {
    // Confirmar eliminación
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            cargarTodasLasTareas();
            cargarMetricas();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar la tarea');
        });
    }
}
