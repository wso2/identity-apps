/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { CommonNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const common: CommonNS = {
    access: "Acceso",
    actions: "Comportamiento",
    activate: "Activar",
    active: "Activo",
    add: "Añadir",
    addKey: "Agregar secreto",
    addURL: "Agregar URL",
    all: "Todas",
    applicationName: "Nombre de la aplicación",
    applications: "Aplicaciones",
    approvalStatus: "Estado de aprobación",
    approvals: "Aprobaciones",
    approvalsPage: {
        list: {
            columns: {
                actions: "Acciones",
                name: "Nombre"
            }
        },
        modals: {
            description: "Revise las tareas operativas que requieren su aprobación",
            header: "Aprobaciones",
            subHeader: "Revise las tareas operativas que requieren su aprobación"
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "Error al obtener los detalles de aprobación"
                },
                genericError: {
                    description: "No se pudieron recuperar los detalles de aprobación.",
                    message: "Algo salió mal"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Error al obtener las aprobaciones pendientes"
                },
                genericError: {
                    description: "No se pudieron recuperar las aprobaciones pendientes.",
                    message: "Algo salió mal"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Error al actualizar la aprobación"
                },
                genericError: {
                    description: "No se pudo actualizar la aprobación pendiente.",
                    message: "Algo salió mal"
                },
                success: {
                    description: "Aprobación actualizada con éxito.",
                    message: "Actualización exitosa"
                }
            }
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "Ver todo",
                subtitles: {
                    0: "Actualmente no hay aprobaciones en estado {{status}}.",
                    1: "Por favor, verifique si tiene tareas en estado {{status}} para",
                    2: "verlas aquí."
                },
                title: "No se encontraron resultados"
            },
            emptyApprovalList: {
                action: "",
                subtitles: {
                    0: "Actualmente no hay aprobaciones para revisar.",
                    1: "Por favor, verifique si ha agregado un flujo de trabajo para controlar las operaciones en el sistema.",
                    2: ""
                },
                title: "No hay aprobaciones"
            },
            emptySearchResults: {
                action: "Ver todo",
                subtitles: {
                    0: "No pudimos encontrar el flujo de trabajo que buscó.",
                    1: "Por favor, verifique si tiene un flujo de trabajo con ese nombre en",
                    2: "el sistema."
                },
                title: "No hay aprobaciones"
            },
            searchApprovals: "Buscar por nombre de flujo de trabajo"
        },
        propertyMessages: {
            assignedUsersDeleted: "Los usuarios asignados han sido eliminados.",
            roleDeleted: "La función ha sido eliminada.",
            selfRegistration: "Auto registro",
            unassignedUsersDeleted: "Los usuarios no asignados han sido eliminados."
        },
        subTitle: "Revise las tareas operativas que requieren su aprobación",
        title: "Aprobaciones"
    },
    approve: "Aprobar",
    approved: "Aprobado",
    apps: "Aplicaciones",
    assignee: "Cesionario",
    assignees: "cesionarios",
    asyncOperationErrorMessage: {
        description: "Algo salió mal",
        message: "Se produjo un error inesperado. Vuelva a intentarlo más tarde."
    },
    authentication: "Autenticación",
    authenticator: "Autenticador",
    authenticator_plural: "Autenticadores",
    back: "atrás",
    beta: "Beta",
    browser: "Navegador",
    cancel: "Cancelar",
    challengeQuestionNumber: "Pregunta de desafío {{number}}",
    change: "Cambio",
    chunkLoadErrorMessage: {
        description: "Ocurrió un error al servir la aplicación solicitada. Intente volver a cargar la aplicación.",
        heading: "Algo salió mal",
        primaryActionText: "Recargar la aplicación"
    },
    claim: "Afirmar",
    clear: "Claro",
    clientId: "Identificación del cliente",
    close: "Cerrar",
    comingSoon: "Próximamente, en breve, pronto",
    completed: "TERMINADO",
    configure: "Configurar",
    confirm: "Confirmar",
    contains: "contiene",
    continue: "SEGUIR",
    copyToClipboard: "Copiar al portapapeles",
    create: "Crear",
    createdOn: "Creado en",
    dangerZone: "Zona peligrosa",
    darkMode: "Modo oscuro",
    delete: "Borrar",
    deprecated: "Esta configuración está obsoleta y se eliminará en una versión futura.",
    description: "Descripción",
    deviceModel: "Modelo de dispositivo",
    disable: "Desactivar",
    disabled: "discapacitado",
    docs: "Documentos",
    documentation: "documentación",
    done: "Hecho",
    download: "Descargar",
    drag: "Arrastrar",
    duplicateURLError: "Este valor ya está agregado",
    edit: "Editar",
    enable: "Permitir",
    enabled: "activado",
    endsWith: "Termina con",
    equals: "igual",
    exitFullScreen: "Salir de pantalla completa",
    experimental: "experimental",
    explore: "Explorar",
    export: "Exportar",
    featureAvailable: "¡Esta característica estará disponible pronto!",
    filter: "Filtrar",
    finish: "Terminar",
    generatePassword: "Generar contraseña",
    goBackHome: "Regresar a casa",
    goFullScreen: "Ir a pantalla completa",
    good: "Bien",
    help: "Ayuda",
    hide: "Esconder",
    hidePassword: "Contraseña oculta",
    identityProviders: "Proveedores de identidad",
    import: "Importar",
    initiator: "Iniciador",
    ipAddress: "dirección IP",
    issuer: "Editor",
    lastAccessed: "Último accedido",
    lastModified: "Última modificación",
    lastSeen: "Ultima vez visto",
    lastUpdatedOn: "Ultima actualización en",
    learnMore: "Aprende más",
    lightMode: "Modo de luz",
    loading: "Cargando",
    loginTime: "Hora de inicio de sesión",
    logout: "Cerrar sesión",
    makePrimary: "Hacer primario",
    maxValidation: "Este valor debe ser menor o igual a {{max}}.",
    maximize: "Maximizar",
    metaAttributes: "Metaatributos",
    minValidation: "Este valor debe ser mayor o igual a {{min}}.",
    minimize: "Minimizar",
    minutes: "minutos",
    more: "más",
    myAccount: "Mi cuenta",
    name: "Nombre",
    networkErrorMessage: {
        description: "Intente iniciar sesión de nuevo.",
        heading: "Su sesión ha caducado",
        primaryActionText: "Registrarse"
    },
    new: "Nuevo",
    next: "próximo",
    noResultsFound: "No se han encontrado resultados",
    okay: "Okey",
    operatingSystem: "Sistema operativo",
    operations: "Operaciones",
    organizationName: "organización {{orgName}}",
    overview: "Descripción general",
    personalInfo: "Información personal",
    pin: "Alfiler",
    pinned: "Fijado",
    premium: "de primera calidad",
    pressEnterPrompt: "Presione <1>Entrar</1> para seleccionar",
    preview: "Avance",
    previous: "Anterior",
    primary: "Primaria",
    priority: "Prioridad",
    privacy: "intimidad",
    properties: "Propiedades",
    publish: "Publicar",
    ready: "Listo",
    regenerate: "Regenerado",
    register: "Registrarse",
    reject: "Rechazar",
    rejected: "Rechazado",
    release: "Liberación",
    remove: "Eliminar",
    removeAll: "Eliminar todo",
    required: "Esto es requerido.",
    reserved: "Reservado",
    resetFilters: "Restablecer filtros",
    retry: "Rever",
    revoke: "Revocar",
    revokeAll: "revocar todo",
    samples: "Muestras",
    save: "Salvar",
    saveDraft: "Guardar borrador",
    sdks: "SDK",
    search: "Buscar",
    searching: "buscando",
    security: "Seguridad",
    selectAll: "Seleccionar todo",
    selectNone: "Seleccionar ninguno",
    services: "Servicios",
    settings: "AJUSTES",
    setup: "Configurar",
    show: "Show",
    showAll: "Mostrar todo",
    showLess: "Muestra menos",
    showMore: "Mostrar más",
    showPassword: "Mostrar contraseña",
    skip: "Saltar",
    startsWith: "Comienza con",
    step: "Paso",
    strong: "Fuerte",
    submit: "Enviar",
    switch: "Cambiar",
    technologies: "Tecnologías",
    terminate: "Terminar",
    terminateAll: "Terminar todo",
    terminateSession: "Terminar sesión",
    tooShort: "Demasiado corto",
    type: "Escribe",
    unpin: "Desprender",
    unpinned: "Sin fijar",
    update: "Actualizar",
    user: "Usuario",
    verified: "Verificada",
    verify: "Verificar",
    view: "Vista",
    weak: "Débil",
    weakPassword: "La seguridad de la contraseña debería ser al menos buena."
};
