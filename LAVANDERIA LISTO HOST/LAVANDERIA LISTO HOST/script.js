// script.js - Sin cambios necesarios para mejoras visuales

document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.querySelector('.menu-toggle-button');
    const dashboardContainer = document.querySelector('.dashboard-container');
    // Verifica si hay un botón y contenedor antes de añadir listeners
    if (menuToggleButton && dashboardContainer) {
        const menuCollapsed = localStorage.getItem('menuCollapsed') === 'true';

        // Aplica estado colapsado inicial si existe en localStorage
        if (menuCollapsed) {
            dashboardContainer.classList.add('collapsed');
        }

        // Listener para el botón de menú
        menuToggleButton.addEventListener('click', function() {
            dashboardContainer.classList.toggle('collapsed');
            // Guarda el nuevo estado en localStorage
            localStorage.setItem('menuCollapsed', dashboardContainer.classList.contains('collapsed'));
        });
    } else {
        console.warn("Botón de menú o contenedor del dashboard no encontrado.");
    }

    // Carga los datos si las funciones existen
    if (typeof cargarServicios === 'function') {
        cargarServicios();
    }
    if (typeof cargarClientes === 'function') {
        cargarClientes();
    }
});

// Asegúrate que las funciones de carga de datos estén definidas
// (Asumiendo que ya existen como las proporcionaste antes)

function cargarServicios() {
    // Selecciona el tbody de forma más robusta
    const tablaBody = document.querySelector('.data-list[aria-labelledby="data-list-heading"] table tbody');
    if (!tablaBody) {
        console.error('No se encontró el tbody para servicios.');
        return;
    }

    fetch('/api/servicios') // Asegúrate que esta ruta API sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            tablaBody.innerHTML = ''; // Limpiar tabla antes de añadir

            if (!Array.isArray(data)) {
                 throw new Error('La respuesta de la API no es un array');
            }

            if(data.length === 0) {
                const row = tablaBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 5; // Ajusta al número de columnas
                cell.textContent = 'No hay servicios para mostrar.';
                cell.style.textAlign = 'center';
                return;
            }

            data.forEach(servicio => {
                const row = tablaBody.insertRow();
                row.insertCell().textContent = servicio.folio || '-'; // Valor por defecto
                row.insertCell().textContent = servicio.fecha || '-';
                row.insertCell().textContent = servicio.cliente || '-';
                
                const estadoCell = row.insertCell();
                const estadoText = servicio.estado || 'desconocido';
                estadoCell.innerHTML = `<span class="status ${estadoText.toLowerCase().replace(/\s+/g, '-')}">${estadoText}</span>`; // Añade clase y span

                // Añadir celda de acciones (Asegúrate que FontAwesome está cargado)
                const accionesCell = row.insertCell();
                accionesCell.innerHTML = '<a href="#" title="Ver Detalles"><i class="fas fa-eye"></i> Ver</a>'; 
                // Podrías añadir más acciones aquí
                // accionesCell.innerHTML += ' <a href="#" title="Editar"><i class="fas fa-edit"></i> Editar</a>';
            });
        })
        .catch(error => {
            console.error('Error al obtener los servicios:', error);
            tablaBody.innerHTML = `<tr><td colspan="5">Error al cargar los datos: ${error.message}</td></tr>`;
        });
}

function cargarClientes() {
    const tablaBody = document.querySelector('#clientes-table tbody');
     if (!tablaBody) {
        console.error('No se encontró el tbody para clientes.');
        return;
    }

    fetch('/api/clientes') // Asegúrate que esta ruta API sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            tablaBody.innerHTML = ''; // Limpiar

             if (!Array.isArray(data)) {
                 throw new Error('La respuesta de la API no es un array');
            }

            if(data.length === 0) {
                const row = tablaBody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 3; // Ajusta al número de columnas
                cell.textContent = 'No hay clientes para mostrar.';
                cell.style.textAlign = 'center';
                return;
            }

            data.forEach(cliente => {
                const row = tablaBody.insertRow();
                row.insertCell().textContent = cliente.codigo || '-';
                row.insertCell().textContent = cliente.nombre || '-';
                row.insertCell().textContent = cliente.email || '-';
                 // Podrías añadir celda de acciones aquí también
            });
        })
        .catch(error => {
            console.error('Error al obtener los clientes:', error);
            tablaBody.innerHTML = `<tr><td colspan="3">Error al cargar los clientes: ${error.message}</td></tr>`;
        });
}