// Verificar que el usuario esté logueado y sea 'user'
verificarRol('user');

// Obtener el usuario actual
const currentUser = obtenerUsuarioActual();

// Elementos del DOM
const tasksList = document.getElementById('tasksList');
const noTasks = document.getElementById('noTasks');
const taskForm = document.getElementById('taskForm');
const filterStatus = document.getElementById('filterStatus');
const newTaskBtn = document.getElementById('newTaskBtn');
const modalTitle = document.getElementById('modalTitle');

// Variable para saber si estamos editando
let editando = false;

// Cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTareas();
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    // Filtro de estado
    filterStatus.addEventListener('change', cargarTareas);
    
    // Botón nueva tarea
    newTaskBtn.addEventListener('click', () => {
        editando = false;
        modalTitle.textContent = 'Nueva Tarea';
        taskForm.reset();
        document.getElementById('taskId').value = '';
    });
    
    // Submit del formulario
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (editando) {
            actualizarTarea();
        } else {
            crearTarea();
        }
    });
}

// Cargar tareas del usuario
function cargarTareas() {
    const filtro = filterStatus.value;
    let url = `${API_URL}/tasks?userId=${currentUser.id}`;
    
    // Aplicar filtro si no es "all"
    if (filtro !== 'all') {
        url += `&status=${filtro}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(tasks => {
            mostrarTareas(tasks);
        })
        .catch(error => {
            console.error('Error al cargar tareas:', error);
        });
}

// Mostrar tareas en la página
function mostrarTareas(tasks) {
    // Limpiar lista
    tasksList.innerHTML = '';
    
    // Si no hay tareas
    if (tasks.length === 0) {
        noTasks.classList.remove('d-none');
        return;
    }
    
    noTasks.classList.add('d-none');
    
    // Crear una tarjeta para cada tarea
    tasks.forEach(task => {
        const card = crearTarjetaTarea(task);
        tasksList.appendChild(card);
    });
}

// Crear tarjeta de tarea
function crearTarjetaTarea(task) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-3';
    
    // Color según estado
    let badgeClass = '';
    let estadoTexto = '';
    
    if (task.status === 'pending') {
        badgeClass = 'badge-pending';
        estadoTexto = 'Pendiente';
    } else if (task.status === 'in progress') {
        badgeClass = 'badge-progress';
        estadoTexto = 'En progreso';
    } else if (task.status === 'completed') {
        badgeClass = 'badge-completed';
        estadoTexto = 'Completada';
    }
    
    col.innerHTML = `
        <div class="card task-card h-100">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title mb-0">${task.title}</h5>
                    <span class="badge ${badgeClass}">${estadoTexto}</span>
                </div>
                <p class="card-text text-muted">${task.description}</p>
                <small class="text-muted">Creada: ${task.createdAt || 'N/A'}</small>
                
                <div class="mt-3">
                    <button class="btn btn-sm btn-primary" onclick="editarTarea(${task.id})">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${task.id})">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Crear nueva tarea
function crearTarea() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const status = document.getElementById('taskStatus').value;
    
    // Crear objeto de tarea
    const nuevaTarea = {
        title: title,
        description: description,
        status: status,
        userId: currentUser.id,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Enviar a la API
    fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaTarea)
    })
    .then(response => response.json())
    .then(data => {
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        
        // Recargar tareas
        cargarTareas();
        
        // Limpiar formulario
        taskForm.reset();
    })
    .catch(error => {
        console.error('Error al crear tarea:', error);
        alert('Error al crear la tarea');
    });
}

// Editar tarea
function editarTarea(id) {
    editando = true;
    modalTitle.textContent = 'Editar Tarea';
    
    // Buscar la tarea
    fetch(`${API_URL}/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            // Llenar el formulario
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskStatus').value = task.status;
            
            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Actualizar tarea
function actualizarTarea() {
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const status = document.getElementById('taskStatus').value;
    
    // Objeto con datos actualizados
    const tareaActualizada = {
        title: title,
        description: description,
        status: status,
        userId: currentUser.id
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
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        
        // Recargar tareas
        cargarTareas();
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
            cargarTareas();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar la tarea');
        });
    }
}
