function mostrarAlerta({
    tipo = 'info',
    titulo = 'Informacion',
    mensaje = '',
    boton = 'Aceptar',
    redireccion = null
} = {}) {

    const tipos = {
        exito: {
            color: '#198754',
            fondo: '#e8f5ed',
            icono: '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/>'
        },
        error: {
            color: '#dc3545',
            fondo: '#fdebec',
            icono: '<circle cx="12" cy="12" r="10"/><path d="M9 9l6 6M15 9l-6 6"/>'
        },
        advertencia: {
            color: '#d97706',
            fondo: '#fff3db',
            icono: '<path d="M12 3L2 21h20L12 3z"/><path d="M12 9v4M12 17h.01"/>'
        },
        info: {
            color: '#2563eb',
            fondo: '#e8f0ff',
            icono: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>'
        }
    };

    const config = tipos[tipo] || tipos.info;

    if (!document.getElementById('estilos-alertas360')) {

        const estilos = document.createElement('style');

        estilos.id = 'estilos-alertas360';

        estilos.textContent = `
            .alerta360 {
                position: fixed;
                inset: 0;
                margin: auto;
                width: 90%;
                max-width: 420px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 40px 30px;
                border: none;
                border-radius: 24px;
                background: white;
                text-align: center;
                font-family: "Segoe UI", Arial, sans-serif;
                box-shadow: 0 20px 80px rgba(0,0,0,0.25);
            }

            .alerta360::backdrop {
                background: rgba(15,35,25,0.65);
                backdrop-filter: blur(5px);
            }

            .alerta360[open] {
                animation: alerta360-aparecer 0.3s ease-out;
            }

            .alerta360-icono {
                width: 85px;
                height: 85px;
                margin: 0 auto 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .alerta360 h2 {
                color: #18352a;
                font-size: 26px;
                margin-bottom: 15px;
            }

            .alerta360-mensaje {
                color: #64748b;
                font-size: 15px;
                line-height: 1.7;
                margin-bottom: 28px;
                overflow-wrap: anywhere;
            }

            .alerta360-boton {
                width: 100%;
                padding: 15px;
                border: none;
                border-radius: 10px;
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: filter 0.2s;
            }

            .alerta360-boton:hover {
                filter: brightness(0.90);
            }

            .alerta360-boton:focus-visible {
                outline: 3px solid #94a3b8;
                outline-offset: 3px;
            }

            .alerta360-marca {
                margin-top: 25px;
                color: #94a3b8;
                font-size: 12px;
            }

            @keyframes alerta360-aparecer {
                from {
                    opacity: 0;
                    transform: scale(0.90);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .alerta360[open] {
                    animation: none;
                }
            }
        `;

        document.head.appendChild(estilos);
    }

    const anterior = document.querySelector('.alerta360');

    if (anterior) {
        anterior.close();
        anterior.remove();
    }

    const modal = document.createElement('dialog');

    modal.className = 'alerta360';

    modal.setAttribute(
        'aria-labelledby',
        'alerta360-titulo'
    );

    modal.setAttribute(
        'aria-describedby',
        'alerta360-mensaje'
    );

    modal.innerHTML = `
        <div class="alerta360-icono"
             style="background: ${config.fondo};">

            <svg width="48" height="48"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="${config.color}"
                 stroke-width="2"
                 stroke-linecap="round"
                 stroke-linejoin="round">

                ${config.icono}

            </svg>

        </div>

        <h2 id="alerta360-titulo"></h2>

        <p id="alerta360-mensaje"
           class="alerta360-mensaje"></p>

        <button type="button"
                class="alerta360-boton"
                style="background: ${config.color};">
        </button>

        <p class="alerta360-marca">
            Entregas360 | Tu soluci&oacute;n log&iacute;stica
        </p>
    `;

    modal.querySelector('h2').textContent = titulo;

    modal.querySelector(
        '.alerta360-mensaje'
    ).textContent = mensaje;

    const botonModal = modal.querySelector(
        '.alerta360-boton'
    );

    botonModal.textContent = boton;

    function cerrarAlerta() {

        modal.close();
        modal.remove();

        if (redireccion) {
            window.location.href = redireccion;
        }
    }

    botonModal.addEventListener('click', cerrarAlerta);

    modal.addEventListener('cancel', (evento) => {
        evento.preventDefault();
        cerrarAlerta();
    });

    document.body.appendChild(modal);

    modal.showModal();

    botonModal.focus();
}