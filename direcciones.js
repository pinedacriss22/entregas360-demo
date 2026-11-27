let direccionesRegistradas = [];

async function cargarDirecciones() {

    const cargando = document.getElementById(
        'cargando-direcciones'
    );

    const vacias = document.getElementById(
        'direcciones-vacias'
    );

    const lista = document.getElementById(
        'lista-direcciones'
    );

    const boton = document.getElementById(
        'btn-nueva-direccion'
    );

    cargando.hidden = false;
    vacias.hidden = true;
    lista.replaceChildren();
    boton.disabled = true;

    try {

        const respuesta = await fetch('/api/direcciones', {
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (respuesta.status === 401) {

            mostrarAlerta({
                tipo: 'advertencia',
                titulo: 'Inicia sesi\u00f3n',
                mensaje: 'Debes iniciar sesi\u00f3n para administrar tus direcciones.',
                boton: 'Iniciar sesi\u00f3n',
                redireccion: '/entregas360-demo/pages/login.html'
            });

            return;
        }

        if (!respuesta.ok) {
            throw new Error(
                'No se pudieron consultar las direcciones'
            );
        }

        direccionesRegistradas = await respuesta.json();

        boton.disabled = false;

        if (direccionesRegistradas.length === 0) {

            vacias.hidden = false;

        } else {

            direccionesRegistradas.forEach(direccion => {

                const tarjeta = document.createElement('article');

                tarjeta.className = 'direccion-tarjeta';

                if (Number(direccion.principal) === 1) {
                    tarjeta.classList.add('direccion-principal');
                }

                const titulo = document.createElement('h3');
                titulo.textContent = direccion.alias;

                const ubicacion = document.createElement('p');
                ubicacion.textContent =
                    direccion.colonia + ', ' + direccion.ciudad;

                const detalle = document.createElement('p');
                detalle.textContent = direccion.direccion;

                const referencia = document.createElement('p');
                referencia.textContent = direccion.referencia || '';

                tarjeta.append(
                    titulo,
                    ubicacion,
                    detalle,
                    referencia
                );

                if (Number(direccion.principal) === 1) {

                    const etiqueta = document.createElement('span');

                    etiqueta.className = 'direccion-etiqueta';
                    etiqueta.textContent = 'Principal';

                    tarjeta.appendChild(etiqueta);

                }

                const acciones = document.createElement('div');

                acciones.className = 'direccion-acciones';

                const btnEditar = document.createElement('button');

                btnEditar.type = 'button';
                btnEditar.className = 'btn-secundario';
                btnEditar.textContent = 'Editar';

                btnEditar.addEventListener('click', () => {
                    editarDireccion(direccion.id);
                });

                acciones.appendChild(btnEditar);

                const btnEliminar = document.createElement('button');

                btnEliminar.type = 'button';
                btnEliminar.className = 'btn-eliminar';
                btnEliminar.textContent = 'Eliminar';

                btnEliminar.addEventListener('click', () => {
                    confirmarEliminarDireccion(direccion.id);
                });

acciones.appendChild(btnEliminar);

if (Number(direccion.principal) !== 1) {

    const btnPrincipal = document.createElement('button');

    btnPrincipal.type = 'button';
    btnPrincipal.className = 'btn-secundario';

    btnPrincipal.textContent = 'Establecer como principal';

    btnPrincipal.addEventListener('click', () => {
        establecerDireccionPrincipal(direccion.id);
    });

    acciones.appendChild(btnPrincipal);

}

                tarjeta.appendChild(acciones);

                lista.appendChild(tarjeta);

            });

        }

    } catch (error) {

        mostrarAlerta({
            tipo: 'error',
            titulo: 'Error al cargar direcciones',
            mensaje: error.message,
            boton: 'Aceptar'
        });

    } finally {

        cargando.hidden = true;

    }

}

document.addEventListener(
    'DOMContentLoaded',
    cargarDirecciones
);

const formularioDireccion = document.getElementById(
    'formulario-direccion'
);

const contenedorDireccion = document.getElementById(
    'formulario-contenedor'
);

document.getElementById('btn-nueva-direccion')
    .addEventListener('click', () => {

        formularioDireccion.reset();

        document.getElementById('direccion-id').value = '';

        document.getElementById('titulo-formulario').textContent =
            'Nueva direcci\u00f3n';

        document.getElementById('ciudad').value =
            'San Pedro Sula';

        contenedorDireccion.hidden = false;

        contenedorDireccion.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        document.getElementById('alias').focus();

    });

document.getElementById('btn-cancelar-direccion')
    .addEventListener('click', () => {

        formularioDireccion.reset();

        contenedorDireccion.hidden = true;

    });

    formularioDireccion.addEventListener('submit', async evento => {

    evento.preventDefault();

    const botonGuardar = document.getElementById(
        'btn-guardar-direccion'
    );

    const botonCancelar = document.getElementById(
        'btn-cancelar-direccion'
    );

    const botonNueva = document.getElementById(
        'btn-nueva-direccion'
    );

    const datos = {
        alias: document.getElementById('alias').value.trim(),
        ciudad: document.getElementById('ciudad').value.trim(),
        colonia: document.getElementById('colonia').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        referencia: document.getElementById('referencia').value.trim()
    };

    if (
        !datos.alias ||
        !datos.ciudad ||
        !datos.colonia ||
        !datos.direccion
    ) {

        mostrarAlerta({
            tipo: 'advertencia',
            titulo: 'Campos incompletos',
            mensaje: 'Completa todos los campos obligatorios.',
            boton: 'Corregir'
        });

        return;

    }

    botonGuardar.disabled = true;
    botonCancelar.disabled = true;
    botonNueva.disabled = true;
    botonGuardar.textContent = 'Guardando...';

    try {

        const direccionId = document.getElementById('direccion-id').value;

        const esEdicion = direccionId !== '';

        const url = esEdicion
            ? '/api/direcciones/' + direccionId
            : '/api/direcciones';

        const respuesta = await fetch(url, {

            method: esEdicion ? 'PUT' : 'POST',

            credentials: 'same-origin',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(datos)

        });

        if (respuesta.status === 401) {

            mostrarAlerta({
                tipo: 'advertencia',
                titulo: 'Sesi\u00f3n expirada',
                mensaje: 'Debes iniciar sesi\u00f3n nuevamente.',
                boton: 'Iniciar sesi\u00f3n',
                redireccion: '/entregas360-demo/pages/login.html'
            });

            return;

        }

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.error ||
                'No se pudo guardar la direccion'
            );
        }

        formularioDireccion.reset();

        contenedorDireccion.hidden = true;

        await cargarDirecciones();

 mostrarAlerta({
    tipo: 'exito',

    titulo: esEdicion
        ? 'Direcci\u00f3n actualizada'
        : 'Direcci\u00f3n registrada',

    mensaje: esEdicion
        ? 'Los cambios se han guardado correctamente.'
        : 'Tu nueva direcci\u00f3n se ha guardado correctamente.',

    boton: 'Aceptar'
});

    } catch (error) {

        mostrarAlerta({
            tipo: 'error',
            titulo: 'No se pudo guardar la direcci\u00f3n',
            mensaje: error.message,
            boton: 'Intentar nuevamente'
        });

    } finally {

        botonGuardar.disabled = false;
        botonCancelar.disabled = false;
        botonNueva.disabled = false;

        botonGuardar.textContent = 'Guardar direcci\u00f3n';

    }

});

function editarDireccion(id) {

    const datos = direccionesRegistradas.find(
        direccion => Number(direccion.id) === Number(id)
    );

    if (!datos) return;

    document.getElementById('direccion-id').value =
        datos.id;

    document.getElementById('alias').value =
        datos.alias || '';

    document.getElementById('ciudad').value =
        datos.ciudad || '';

    document.getElementById('colonia').value =
        datos.colonia || '';

    document.getElementById('direccion').value =
        datos.direccion || '';

    document.getElementById('referencia').value =
        datos.referencia || '';

    document.getElementById('titulo-formulario').textContent =
        'Editar direcci\u00f3n';

    contenedorDireccion.hidden = false;

    contenedorDireccion.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

}

function confirmarEliminarDireccion(id) {

    if (document.getElementById('confirmar-eliminar')) return;

    const modal = document.createElement('dialog');

    modal.id = 'confirmar-eliminar';

  modal.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    right:auto;
    bottom:auto;
    transform:translate(-50%, -50%);
    margin:0;
    border:none;
    border-radius:20px;
    padding:30px;
    width:90%;
    max-width:400px;
    max-height:90vh;
    overflow-y:auto;
    box-sizing:border-box;
    text-align:center;
    background:#ffffff;
    box-shadow:0 20px 60px rgba(0,0,0,.25);
`;

    modal.innerHTML = `
        <div style="
            width:75px;
            height:75px;
            background:#fff4e5;
            color:#f28c28;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            margin:0 auto 20px;
        ">
            <svg width="40" height="40"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="2">

                <path d="M12 3L2 21h20L12 3z"/>
                <path d="M12 9v5"/>
                <circle cx="12" cy="17" r=".5"/>

            </svg>
        </div>

        <h2 style="color:#18352a;">
            &iquest;Eliminar direcci&oacute;n?
        </h2>

        <p style="
            color:#64748b;
            line-height:1.6;
            margin:15px 0 25px;
        ">
            Esta direcci&oacute;n se eliminar&aacute;
            de tu cuenta. Esta acci&oacute;n no se
            puede deshacer.
        </p>

        <div style="display:flex;gap:12px;">

            <button id="cancelar-eliminacion"
                    type="button"
                    style="
                        flex:1;
                        background:#e5e7eb;
                        color:#374151;
                        border:none;
                        padding:12px;
                        border-radius:8px;
                        cursor:pointer;
                        font-weight:600;
                    ">
                Cancelar
            </button>

            <button id="confirmar-eliminacion"
                    type="button"
                    style="
                        flex:1;
                        background:#dc2626;
                        color:white;
                        border:none;
                        padding:12px;
                        border-radius:8px;
                        cursor:pointer;
                        font-weight:600;
                    ">
                Eliminar
            </button>

        </div>
    `;

    const estilo = document.createElement('style');

    estilo.textContent = `
        #confirmar-eliminar::backdrop {
            background:rgba(0,0,0,.45);
            backdrop-filter:blur(3px);
        }
    `;

    modal.appendChild(estilo);

    document.body.appendChild(modal);

    modal.addEventListener('close', () => {
        modal.remove();
    });

    modal.querySelector('#cancelar-eliminacion')
        .addEventListener('click', () => {
            modal.close();
        });

    modal.querySelector('#confirmar-eliminacion')
        .addEventListener('click', () => {

            modal.close();

            eliminarDireccion(id);

        });

    modal.showModal();

    modal.querySelector('#cancelar-eliminacion').focus();

}


async function eliminarDireccion(id) {

    try {

        const respuesta = await fetch(
            '/api/direcciones/' + id,
            {
                method: 'DELETE',
                credentials: 'same-origin'
            }
        );

        if (respuesta.status === 401) {

            mostrarAlerta({
                tipo: 'advertencia',
                titulo: 'Sesi\u00f3n expirada',
                mensaje: 'Debes iniciar sesi\u00f3n nuevamente.',
                boton: 'Iniciar sesi\u00f3n',
                redireccion: '/entregas360-demo/pages/login.html'
            });

            return;

        }

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                'No se pudo eliminar la direccion'
            );

        }

        formularioDireccion.reset();

        contenedorDireccion.hidden = true;

        await cargarDirecciones();

        mostrarAlerta({
            tipo: 'exito',
            titulo: 'Direcci\u00f3n eliminada',
            mensaje: 'La direcci\u00f3n se ha eliminado correctamente.',
            boton: 'Aceptar'
        });

    } catch (error) {

        mostrarAlerta({
            tipo: 'error',
            titulo: 'No se pudo eliminar la direcci\u00f3n',
            mensaje: error.message,
            boton: 'Aceptar'
        });

    }

}

async function establecerDireccionPrincipal(id) {

    try {

        const respuesta = await fetch(
            '/api/direcciones/' + id + '/principal',
            {
                method: 'PATCH',
                credentials: 'same-origin'
            }
        );

        if (respuesta.status === 401) {

            mostrarAlerta({
                tipo: 'advertencia',
                titulo: 'Sesi\u00f3n expirada',
                mensaje: 'Debes iniciar sesi\u00f3n nuevamente.',
                boton: 'Iniciar sesi\u00f3n',
                redireccion: '/entregas360-demo/pages/login.html'
            });

            return;

        }

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                'No se pudo actualizar la direccion principal'
            );

        }

        await cargarDirecciones();

        mostrarAlerta({
            tipo: 'exito',
            titulo: 'Direcci\u00f3n principal actualizada',
            mensaje: 'Tu direcci\u00f3n principal se ha actualizado correctamente.',
            boton: 'Aceptar'
        });

    } catch (error) {

        mostrarAlerta({
            tipo: 'error',
            titulo: 'Error al actualizar',
            mensaje: error.message,
            boton: 'Aceptar'
        });

    }

}