/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
    actions: "Ações",
    activate: "Ativar",
    active: "Ativo",
    add: "Adicionar",
    addKey: "Adicionar segredo",
    addURL: "Adicionar URL",
    all: "Todos",
    applicationName: "Nome da aplicação",
    applications: "Aplicações",
    approvalStatus: "Status de Aprovação",
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
                    description: "Não foi possível recuperar os detalhes da aprovação.",
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
    approve: "Aprovar",
    approved: "Aprovado",
    apps: "Apps",
    assignee: "Cessionário",
    assignees: "Cessionários",
    asyncOperationErrorMessage: {
        description: "Algo deu errado",
        message: "Ocorreu um erro inesperado. Verifique novamente mais tarde."
    },
    authentication: "Autenticação",
    authenticator: "Autenticador",
    authenticator_plural: "Autenticadores",
    back: "Voltar",
    beta: "Beta",
    browser: "Navegador",
    cancel: "Cancelar",
    challengeQuestionNumber: "Pergunta de Segurança {{number}}",
    change: "Mudar",
    chunkLoadErrorMessage: {
        description: "Ocorreu um erro ao servir a aplicação solicitada. Por favor, tente recarregar o app.",
        heading: "Algo deu errado",
        primaryActionText: "Recarregar o App"
    },
    claim: "Claim",
    clear: "Limpar",
    clientId: "ID do Cliente",
    close: "Fechar",
    comingSoon: "Em breve",
    completed: "Concluído",
    configure: "Configurar",
    confirm: "Confirmar",
    contains: "Contém",
    continue: "Continuar",
    copyToClipboard: "Copiar para a área de transferência",
    create: "Criar",
    createdOn: "Criado em",
    dangerZone: "Zona de Perigo",
    darkMode: "Modo Escuro",
    delete: "Deletar",
    deprecated: "Esta configuração foi descontinuada e será removida em uma versão futura.",
    description: "Descrição",
    deviceModel: "Modelo do dispositivo",
    disable: "Desabilitar",
    disabled: "Desativado",
    docs: "Documentos",
    documentation: "Documentação",
    done: "Concluído",
    download: "Baixar",
    drag: "Arrastar",
    duplicateURLError: "Este valor já foi adicionado",
    edit: "Editar",
    enable: "Habilitar",
    enabled: "Habilitado",
    endsWith: "Termina com",
    equals: "Igual a",
    exitFullScreen: "Sair do modo tela cheia",
    experimental: "experimental",
    explore: "Explorar",
    export: "Exportar",
    featureAvailable: "Este recurso estará disponível em breve!",
    filter: "Filtrar",
    finish: "Finalizar",
    generatePassword: "Gerar senha",
    goBackHome: "Voltar para a página inicial",
    goFullScreen: "Ir para modo tela cheia",
    good: "Bom",
    help: "Ajuda",
    hide: "Ocultar",
    hidePassword: "Ocultar senha",
    identityProviders: "Provedores de Identidade",
    import: "Importar",
    initiator: "Iniciador",
    ipAddress: "Endereço IP",
    issuer: "Emissor",
    lastAccessed: "Último acesso",
    lastModified: "Última modificação",
    lastSeen: "Última visualização",
    lastUpdatedOn: "Última atualização em",
    learnMore: "Saiba mais",
    lightMode: "Modo Claro",
    loading: "Carregando",
    loginTime: "Tempo de login",
    logout: "Logout",
    makePrimary: "Tornar primário",
    maxValidation: "Este valor deve ser menor ou igual a {{max}}.",
    maximize: "Maximizar",
    metaAttributes: "Metaatributos",
    minValidation: "Este valor deve ser maior ou igual a {{min}}.",
    minimize: "Minimizar",
    minutes: "minutos",
    more: "Mais",
    myAccount: "Minha Conta",
    name: "Nome",
    networkErrorMessage: {
        description: "Por favor, tente entrar novamente.",
        heading: "Sua sessão expirou",
        primaryActionText: "Entrar"
    },
    new: "Novo",
    next: "Próximo",
    noResultsFound: "Nenhum resultado encontrado",
    okay: "Ok",
    operatingSystem: "Sistema operacional",
    operations: "Operações",
    organizationName: "Organização {{orgName}}",
    overview: "Visão Geral",
    personalInfo: "Informação Pessoal",
    pin: "Fixar",
    pinned: "Fixado",
    premium: "Prêmio",
    pressEnterPrompt: "Pressione <1>Enter</1> para selecionar",
    preview: "Pré-visualização",
    previous: "Anterior",
    primary: "Primária",
    priority: "Prioridade",
    privacy: "Privacidade",
    properties: "Propriedades",
    publish: "Publicar",
    ready: "Pronto",
    regenerate: "Regenerar",
    register: "Registrar",
    reject: "Rejeitar",
    rejected: "Rejeitado",
    release: "Lançamento",
    remove: "Remover",
    removeAll: "Remover todos",
    required: "Isto é necessário.",
    reserved: "Reservado",
    resetFilters: "Redefinir filtros",
    retry: "Tentar novamente",
    revoke: "Revogar",
    revokeAll: "Revogar todos",
    samples: "Exemplos",
    save: "Salvar",
    saveDraft: "Salvar rascunho",
    sdks: "SDKs",
    search: "Pesquisar",
    searching: "Pesquisando",
    security: "Segurança",
    selectAll: "Selecione tudo",
    selectNone: "Selecione nenhum",
    services: "Serviços",
    settings: "Configurações",
    setup: "Configurar",
    show: "Mostrar",
    showAll: "Mostrar todos",
    showLess: "Mostrar menos",
    showMore: "Mostrar mais",
    showPassword: "Mostrar senha",
    skip: "Pular",
    startsWith: "Começa com",
    step: "Etapa",
    strong: "Forte",
    submit: "Enviar",
    switch: "Alternar",
    technologies: "Tecnologias",
    terminate: "Encerrar",
    terminateAll: "Encerrar todos",
    terminateSession: "Encerrar sessão",
    tooShort: "Muito curto",
    type: "Tipo",
    unpin: "Desafixar",
    unpinned: "Desafixado",
    update: "Atualizar",
    user: "Usuário",
    verified: "Verificada",
    verify: "Verificar",
    view: "Visualizar",
    weak: "Fraco",
    weakPassword: "A força da senha deve ser pelo menos boa."
};
