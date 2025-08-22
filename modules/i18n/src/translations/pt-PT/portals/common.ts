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
    access: "Acesso",
    actions: "ações",
    activate: "Ativar",
    active: "Activo",
    add: "AAdicionar",
    addKey: "Adicionar segredo",
    addURL: "Adicione URL",
    all: "Tudo",
    applicationName: "Nome da Aplicação",
    applications: "Formulários",
    approvalStatus: "Status de aprovação",
    approvals: "Aprovações",
    approvalsPage: {
        list: {
            columns: {
                actions: "Ações",
                name: "Nome"
            }
        },
        modals: {
            description: "Revise as tarefas operacionais que requerem sua aprovação",
            header: "Aprovações",
            subHeader: "Revise as tarefas operacionais que requerem sua aprovação"
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "Erro ao buscar detalhes de aprovação"
                },
                genericError: {
                    description: "Não foi possível recuperar os detalhes de aprovação.",
                    message: "Algo deu errado"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Erro ao buscar aprovações pendentes"
                },
                genericError: {
                    description: "Não foi possível recuperar as aprovações pendentes.",
                    message: "Algo deu errado"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Erro ao atualizar a aprovação"
                },
                genericError: {
                    description: "Não foi possível atualizar a aprovação pendente.",
                    message: "Algo deu errado"
                },
                success: {
                    description: "Aprovação atualizada com sucesso.",
                    message: "Atualização bem-sucedida"
                }
            }
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "Ver todos",
                subtitles: {
                    0: "Atualmente não há aprovações no estado {{status}}.",
                    1: "Verifique se você tem alguma tarefa no estado {{status}} para",
                    2: "visualizá-las aqui."
                },
                title: "Nenhum resultado encontrado"
            },
            emptyApprovalList: {
                action: "",
                subtitles: {
                    0: "Atualmente não há aprovações para revisar.",
                    1: "Verifique se você adicionou um fluxo de trabalho para controlar as operações no sistema.",
                    2: ""
                },
                title: "Nenhuma Aprovação"
            },
            emptySearchResults: {
                action: "Ver todos",
                subtitles: {
                    0: "Não conseguimos encontrar o fluxo de trabalho que você pesquisou.",
                    1: "Verifique se você tem um fluxo de trabalho com esse nome em",
                    2: "o sistema."
                },
                title: "Nenhuma Aprovação"
            },
            searchApprovals: "Pesquisar por nome de fluxo de trabalho"
        },
        propertyMessages: {
            assignedUsersDeleted: "Os usuários atribuídos foram excluídos.",
            roleDeleted: "A função foi excluída.",
            selfRegistration: "Auto registro",
            unassignedUsersDeleted: "Os usuários não atribuídos foram excluídos."
        },
        subTitle: "Revise as tarefas operacionais que requerem sua aprovação",
        title: "Aprovações"
    },
    approve: "Approve",
    approved: "Aprovado",
    apps: "Formulários",
    assignee: "Cessionário",
    assignees: "Cessionárias",
    asyncOperationErrorMessage: {
        description: "Algo correu mal",
        message: "Ocorreu um erro inesperado. Por favor, volte mais tarde."
    },
    authentication: "Autenticação",
    authenticator: "Autenticador",
    authenticator_plural: "Autenticadores",
    back: "Voltar",
    beta: "Beta",
    browser: "Navegador",
    cancel: "Cancelar",
    challengeQuestionNumber: "Questão Desafio {{number}}",
    change: "Mudança",
    chunkLoadErrorMessage: {
        description: "Ocorreu um erro ao servir o aplicativo solicitado. Tente recarregar o aplicativo.",
        heading: "Quelque chose s'est mal passé",
        primaryActionText: "Recarregue o aplicativo"
    },
    claim: "Afirmação",
    clear: "Apagar",
    clientId: "ID do Cliente",
    close: "Fechar",
    comingSoon: "Em breve",
    completed: "Concluído",
    configure: "Configurar",
    confirm: "Confirme",
    contains: "Contém",
    continue: "Continuar",
    copyToClipboard: "Copiar para área de transferência",
    create: "Crio",
    createdOn: "Criado em",
    dangerZone: "Zona de perigo",
    darkMode: "Modo escuro",
    delete: "Excluir",
    deprecated: "Esta configuração foi descontinuada e será removida em uma versão futura.",
    description: "Descrição",
    deviceModel: "Modelo do dispositivo",
    disable: "Desabilitar",
    disabled: "Desativado",
    docs: "Documentos",
    documentation: "Documentação",
    done: "Feito",
    download: "Baixar",
    drag: "Arrasto",
    duplicateURLError: "Este URL já foi adicionado",
    edit: "Editar",
    enable: "Habilitar",
    enabled: "Ativado",
    endsWith: "Termina com",
    equals: "É igual a",
    exitFullScreen: "Sair da tela inteira",
    experimental: "experimental",
    explore: "Explorar",
    export: "Exportação",
    featureAvailable: "Este recurso estará disponível em breve!",
    filter: "Filtro",
    finish: "Terminar",
    generatePassword: "Gerar senha",
    goBackHome: "Volto para casa",
    goFullScreen: "Ir para tela inteira",
    good: "Boa",
    help: "Socorro",
    hide: "ocultar",
    hidePassword: "Esconder a senha",
    identityProviders: "Fornecedor de identidade",
    import: "Importar",
    initiator: "Iniciador",
    ipAddress: "endereço de IP",
    issuer: "emissor",
    lastAccessed: "Último acesso",
    lastModified: "Última modificação",
    lastSeen: "Visto pela última vez",
    lastUpdatedOn: "Última atualização em",
    learnMore: "Saber mais",
    lightMode: "Modo claro",
    loading: "Carregando",
    loginTime: "Hora de início de sessão",
    logout: "Sair",
    makePrimary: "Tornar primário",
    maxValidation: "Este valor deve ser menor ou igual a {{max}}.",
    maximize: "maximizar",
    metaAttributes: "Metaatributos",
    minValidation: "Este valor deve ser maior ou igual a {{min}}.",
    minimize: "minimizar",
    minutes: "minutos",
    more: "Mais",
    myAccount: "Minha conta",
    name: "Nome",
    networkErrorMessage: {
        description: "Por favor, tente entrar novamente.",
        heading: "Sua sessão expirou",
        primaryActionText: "Entrar"
    },
    new: "novo",
    next: "Próximo",
    noResultsFound: "Nenhum resultado encontrado",
    okay: "OK",
    operatingSystem: "Sistema operacional",
    operations: "Operações",
    organizationName: "Organização {{orgName}}",
    overview: "visão global",
    personalInfo: "Informação pessoal",
    pin: "Bastão",
    pinned: "Bastão",
    premium: "Prêmio",
    pressEnterPrompt: "Pressione <1>Enter</1> para selecionar",
    preview: "Visualizar",
    previous: "Anterior",
    primary: "Primária",
    priority: "Prioridade",
    privacy: "Privacidade",
    properties: "Propriedades",
    publish: "Publicar",
    ready: "Pronta",
    regenerate: "Regenerado",
    register: "Registro",
    reject: "Rejeitar",
    rejected: "Rejeitado",
    release: "Liberação",
    remove: "Retirar",
    removeAll: "Remover tudo",
    required: "Isso é obrigatório",
    reserved: "Reservado",
    resetFilters: "Redefinir filtros",
    retry: "Repetir",
    revoke: "Revogar",
    revokeAll: "Revogar tudo",
    samples: "Amostras",
    save: "Salve",
    saveDraft: "Salvar rascunho",
    sdks: "SDKs",
    search: "Procurar",
    searching: "Procurando",
    security: "Segurança",
    selectAll: "Selecione tudo",
    selectNone: "Selecione nenhum",
    services: "Serviços",
    settings: "Configurações",
    setup: "Configurar",
    show: "exposição",
    showAll: "Mostre tudo",
    showLess: "Mostre menos",
    showMore: "Mostre mais",
    showPassword: "Mostrar senha",
    skip: "pular",
    startsWith: "Começa com",
    step: "Passo",
    strong: "Forte",
    submit: "Enviar",
    switch: "Interruptor",
    technologies: "Tecnologias",
    terminate: "Terminar",
    terminateAll: "Terminar tudo",
    terminateSession: "Encerrar sessão",
    tooShort: "Curto demais",
    type: "Tipo",
    unpin: "Solto",
    unpinned: "Solto",
    update: "Atualizar",
    user: "Do utilizador",
    verified: "Verificada",
    verify: "Verificar",
    view: "Visão",
    weak: "Fraco",
    weakPassword: "A força da senha deve ser pelo menos boa."
};
