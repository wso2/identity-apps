/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { MyAccountNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    components: {
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: "Adicionar ou atualizar opções do código de recuperação"
                },
                heading: "Código de Recuperação"
            },
            emailRecovery: {
                descriptions: {
                    add: "Adicionar um endereço de e-mail de recuperação",
                    emptyEmail: "Você precisa configurar seu endereço de e-mail para prosseguir com a recuperação via e-mail.",
                    update: "Atualizar endereço de e-mail de recuperação ({{email}})",
                    view: "Ver endereço de e-mail de recuperação ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "Endereço de e-mail",
                                placeholder: "Digite o endereço de e-mail de recuperação",
                                validations: {
                                    empty: "Digite um endereço de e-mail",
                                    invalidFormat: "O endereço de e-mail não está no formato correto"
                                }
                            }
                        }
                    }
                },
                heading: "Recuperação via E-mail",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "Erro ao atualizar o e-mail de recuperação"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar o e-mail de recuperação",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O endereço de e-mail no perfil do usuário foi atualizado com sucesso",
                            message: "Endereço de e-mail atualizado com sucesso"
                        }
                    }
                }
            },
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao obter a preferência de recuperação"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao obter a preferência de recuperação",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A preferência de recuperação foi obtida com sucesso",
                        message: "Obtenção da preferência de recuperação bem-sucedida"
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "Adicionar ou atualizar perguntas de segurança da recuperação de conta"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "Resposta",
                                placeholder: "Digite sua resposta",
                                validations: {
                                    empty: "A resposta não pode ser vazia"
                                }
                            },
                            question: {
                                label: "Pergunta",
                                placeholder: "Selecione uma pergunta de segurança",
                                validations: {
                                    empty: "Pelo menos uma pergunta de segurança deve ser selecionada"
                                }
                            }
                        }
                    }
                },
                heading: "Questões de Segurança",
                notifications: {
                    addQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao adicionar as perguntas de segurança"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao adicionar as perguntas de segurança",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "As perguntas de segurança necessárias foram adicionadas com sucesso",
                            message: "As perguntas de segurança foram adicionadas com sucesso"
                        }
                    },
                    updateQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Erro ao atualizar as perguntas de segurança"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar as perguntas de segurança",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "As perguntas de segurança necessárias foram atualizadas com sucesso",
                            message: "As perguntas de segurança foram atualizadas com sucesso"
                        }
                    }
                }
            }
        },
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Atributo de filtro",
                        placeholder: "ex: 'Nome', 'Descrição', etc.",
                        validations: {
                            empty: "O atributo de filtro não pode estar vazio"
                        }
                    },
                    filterCondition: {
                        label: "Condição do filtro",
                        placeholder: "ex: 'Começa com', etc.",
                        validations: {
                            empty: "A condição do filtro não pode estar vazia"
                        }
                    },
                    filterValue: {
                        label: "Valor do filtro",
                        placeholder: "ex: 'admin', 'wso2', etc.",
                        validations: {
                            empty: "O valor do filtro não pode estar vazio"
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "Para pesquisar como uma consulta"
                }
            },
            options: {
                header: "Busca Avançada"
            },
            placeholder: "Pesquisar por {{attribute}}",
            popups: {
                clear: "limpar pesquisa",
                dropdown: "Mostrar opções"
            },
            resultsIndicator: "Mostrando resultados para a consulta \"{{query}}\""
        },
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "ex: 'Nome', 'Descrição', etc."
                        },
                        filterCondition: {
                            placeholder: "ex: 'Começa com', etc."
                        },
                        filterValue: {
                            placeholder: "Insira o valor para pesquisar"
                        }
                    }
                },
                placeholder: "Pesquisar pelo nome da aplicação"
            },
            all: {
                heading: "Todas as aplicações"
            },
            favourite: {
                heading: "Favoritos"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar os aplicativos"
                    },
                    genericError: {
                        description: "Não foi possível recuperar os aplicativos",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os aplicativos foram recuperados com sucesso.",
                        message: "Recuperação dos aplicativos bem-sucedida"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Atualizar lista",
                    subtitles: {
                        0: "A lista de aplicativos retornou vazia.",
                        1: "Isso pode ser devido a não ter aplicativos descobríveis.",
                        2: "Por favor, peça a um administrador para ativar a capacidade de descoberta de aplicativos."
                    },
                    title: "Sem aplicações"
                }
            },
            recent: {
                heading: "Aplicações recentes"
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "Confirme a senha",
                            placeholder: "Digite a nova senha",
                            validations: {
                                empty: "Confirmar a senha é obrigatório",
                                mismatch: "A confirmação da senha não corresponde"
                            }
                        },
                        currentPassword: {
                            label: "Senha atual",
                            placeholder: "Digite a senha atual",
                            validations: {
                                empty: "A senha atual não pode ser vazia",
                                invalid: "A senha atual é inválida"
                            }
                        },
                        newPassword: {
                            label: "Nova senha",
                            placeholder: "Digite a nova senha",
                            validations: {
                                empty: "A nova senha não pode ser vazia"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Algo deu errado. Por favor, tente novamente",
                            message: "Erro na alteração de senha"
                        },
                        invalidCurrentPassword: {
                            description: "A senha atual que você digitou parece ser inválida. Por favor, tente novamente",
                            message: "Erro na alteração de senha"
                        },
                        invalidNewPassword: {
                            description: "A senha não atende às restrições exigidas.",
                            message: "Senha inválida"
                        },
                        passwordCaseRequirement: "Pelo menos {{minUpperCase}} maiúsculas e {{minLowerCase}} letras minúsculas",
                        passwordCharRequirement: "Pelo menos {{minSpecialChr}} de caracteres especiais",
                        passwordLengthRequirement: "Deve ter entre {{min}} e {{max}} caracteres",
                        passwordLowerCaseRequirement: "Pelo menos {{minLowerCase}} letra(s) minúscula(s)",
                        passwordNumRequirement: "Pelo menos {{min}} número(s)",
                        passwordRepeatedChrRequirement: "Não mais que {{repeatedChr}} caracter(es) repetido(s)",
                        passwordUniqueChrRequirement: "Pelo menos {{uniqueChr}} caractere(s) único(s)",
                        passwordUpperCaseRequirement: "Pelo menos {{minUpperCase}} letra(s) maiúscula(s)",
                        submitError: {
                            description: "{{description}}",
                            message: "Erro na alteração de senha"
                        },
                        submitSuccess: {
                            description: "A senha foi alterada com sucesso",
                            message: "Redefinição de senha bem-sucedida"
                        },
                        validationConfig: {
                            error: {
                                description: "{{description}}",
                                message: "Erro de recuperação"
                            },
                            genericError: {
                                description: "Não foi possível recuperar os dados de configuração de validação.",
                                message: "Algo deu errado"
                            }
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "Confirmação",
                    message: "A alteração da senha resultará no encerramento da sessão atual. Você precisará fazer o login com a senha recém-alterada. Você deseja continuar?"
                }
            }
        },
        consentManagement: {
            editConsent: {
                collectionMethod: "Método de Coleta",
                dangerZones: {
                    revoke: {
                        actionTitle: "Revogar",
                        header: "Revogar consentimento",
                        subheader: "Você precisará fornecer o consentimento para esta aplicação novamente."
                    }
                },
                description: "Descrição",
                piiCategoryHeading: "Gerencie o consentimento para a coleta e o compartilhamento de suas informações " +
                    "pessoais com o aplicativo. Desmarque os atributos que você precisa revogar e pressione o botão " +
                    "atualizar para salvar as alterações ou pressione o botão revogar para remover o consentimento " +
                    "para todos os atributos.",
                state: "Estado",
                version: "Versão"
            },
            modals: {
                consentRevokeModal: {
                    heading: "Você tem certeza?",
                    message: "Esta operação é irreversível. Isso revogará permanentemente o consentimento para todos os atributos. Tem certeza de que deseja continuar?",
                    warning: "Por favor, observe que você será redirecionado para a página de consentimento de login"
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Não foi possível carregar as informações do aplicativo selecionado",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Recibo de consentimento recuperado com sucesso",
                        message: "Recuperação bem sucedida"
                    }
                },
                consentedAppsFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Não foi possível carregar a lista de aplicativos consentidos",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Lista de aplicativos consentidos recuperada com sucesso",
                        message: "Recuperação bem sucedida"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "Erro de revogação de consentimento"
                    },
                    genericError: {
                        description: "Não foi possível revogar o consentimento para a aplicação",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "O consentimento foi revogado com sucesso para a aplicação",
                        message: "Revogação de consentimentos bem sucedida"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Falha ao atualizar as claims consentidas para a aplicação",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "As claims consentidas foram atualizadas com sucesso para a aplicação",
                        message: "Claims consentidas atualizadas com sucesso"
                    }
                }
            }
        },
        cookieConsent: {
            confirmButton: "Entendi",
            content: "Usamos cookies para garantir que você obtenha a melhor experiência geral. Esses cookies são usados ​​para manter uma sessão contínua ininterrupta, enquanto fornecendo serviços estáveis e personalizados. Para aprender mais sobre como utilizamos cookies, consulte nossa <1>Política de Cookies</1>."
        },
        federatedAssociations: {
            deleteConfirmation: "Isso removerá a conta de login social vinculada de sua conta local. Deseja continuar?",
            notifications: {
                getFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Não foi possível recuperar as contas de login social vinculadas",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "As contas de login social vinculadas foram recuperadas com sucesso",
                        message: "Contas de login social vinculadas recuperadas com sucesso"
                    }
                },
                removeAllFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Não foi possível remover as contas de login social vinculadas",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Todas as contas de login social vinculadas foram removidas com sucesso",
                        message: "Contas de login social vinculadas removidas com sucesso"
                    }
                },
                removeFederatedAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Não foi possível remover a conta de login social vinculada",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A conta de login social vinculada foi removida com sucesso",
                        message: "Contas de login social vinculada removida com sucesso"
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        header: {
            appSwitch: {
                console: {
                    description: "Gerenciar como desenvolvedores ou administradores",
                    name: "Console"
                },
                myAccount: {
                    description: "Gerenciar sua própria conta",
                    name: "My Account"
                },
                tooltip: "Apps"
            },
            organizationLabel: "Esta conta é gerenciada por"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "Adicionar conta de usuário local"
                }
            },
            deleteConfirmation: "Isso removerá a conta vinculada de sua conta. Deseja continuar?",
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "Senha",
                            placeholder: "Digite a senha",
                            validations: {
                                empty: "A senha não pode estar vazia"
                            }
                        },
                        username: {
                            label: "Nome de usuário",
                            placeholder: "Digite o nome de usuário",
                            validations: {
                                empty: "O nome de usuário não pode estar vazio"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar as contas de usuário vinculadas"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao adicionar a conta vinculada",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A conta de usuário vinculada obrigatória foi adicionada com sucesso",
                        message: "Conta de usuário vinculada adicionada com sucesso"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar as contas de usuário vinculadas"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao recuperar as contas de usuário vinculadas",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os detalhes obrigatórios do perfil do usuário foram recuperados com sucesso",
                        message: "Contas de usuário vinculadas recuperadas com sucesso"
                    }
                },
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao remover contas de usuário vinculadas"
                    },
                    genericError: {
                        description: "Um erro ocorreu ao remover as contas de usuário vinculadas",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Todas as contas de usuário vinculadas foram removidas",
                        message: "Contas vinculadas removidas com sucesso"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao remover a conta de usuário vinculada"
                    },
                    genericError: {
                        description: "Um erro ocorreu ao remover a conta de usuário vinculada",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "As contas de usuário vinculadas foram removidas",
                        message: "A conta vinculada foi removida com sucesso"
                    }
                },
                switchAccount: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao mudar de conta"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao mudar de conta",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A conta foi trocada com sucesso",
                        message: "Conta trocada com sucesso"
                    }
                }
            }
        },
        loginVerifyData: {
            description: "Esses dados são usados para complementar a verificação de sua identidade durante o login ",
            heading: "Dados usados para verificar o seu login",
            modals: {
                clearTypingPatternsModal: {
                    heading: "Confirmação",
                    message: "Esta ação irá limpar seus padrões de digitação salvos no TypingDNA. Você deseja continuar?"
                }
            },
            notifications: {
                clearTypingPatterns: {
                    error: {
                        description: "Os padrões de digitação não puderam ser apagados. Por favor, em contato com o administrador do seu site",
                        message: "Falha ao apagar os padrões de digitação"
                    },
                    success: {
                        description: "Seus padrões de digitação no TypingDNA foram apagados com sucesso ",
                        message: "Padrões de digitação apagados com sucesso"
                    }
                }
            },
            typingdna: {
                description: "Seus padrões de digitação podem ser apagados a partir daqui",
                heading: "Padrões de digitação TypingDNA"
            }
        },
        mfa: {
            authenticatorApp: {
                addHint: "Configurar",
                configuredDescription: "Você pode usar códigos TOTP do seu aplicativo autenticador configurado para autenticação de dois fatores. Se você não tiver acesso ao aplicativo, pode configurar um novo aplicativo autenticador a partir daqui.",
                deleteHint: "Remover",
                description: "Você pode usar o aplicativo autenticador para obter códigos de verificação para autenticação de dois fatores.",
                enableHint: "Habilitar/Desabilitar Autenticador TOTP",
                heading: "Aplicativo Autenticador",
                hint: "Visualizar",
                modals: {
                    delete: {
                        heading: "Confirmação",
                        message: "Esta ação removerá o QR code adicionado ao seu perfil. Deseja continuar?"
                    },
                    done: "Sucesso! Agora você pode usar seu Aplicativo Autenticador para autenticação de dois fatores",
                    heading: "Configurar um Aplicativo Autenticador",
                    scan: {
                        additionNote: "QR code foi adicionado com sucesso ao seu perfil!",
                        authenticatorApps: "Aplicativos Autenticadores",
                        generate: "Gerar um novo código",
                        heading: "Escaneie o QR code abaixo usando um aplicativo autenticador",
                        messageBody: "Você pode encontrar uma lista de Aplicativos Autenticadores disponíveis aqui.",
                        messageHeading: "Não tem um Aplicativo Autenticador instalado?",
                        regenerateConfirmLabel: "Confirmar a regeneração de um novo QR code.",
                        regenerateWarning: {
                            extended: "Ao regenerar um novo QR code, você deve escaneá-lo e reconfigurar seu aplicativo autenticador. Você não poderá mais fazer login com o QR code anterior.",
                            generic: "Ao regenerar um novo QR code, você deve escaneá-lo e reconfigurar seu aplicativo autenticador. Sua configuração anterior não funcionará mais."
                        }
                    },
                    toolTip: "Não tem um aplicativo autenticador? Baixe um aplicativo autenticador como o Google Authenticator da <1>App Store</1> ou <3>Google Play</3>",
                    verify: {
                        error: "Verificação falhou. Por favor, tente novamente.",
                        heading: "Digite o código gerado para verificação",
                        label: "Código de Verificação",
                        placeholder: "Insira seu código de verificação",
                        reScan: "Reescanear",
                        reScanQuestion: "Deseja escanear o QR code novamente?",
                        requiredError: "Insira o código de verificação"
                    }
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao deletar o QR code",
                            message: "Algo deu errado"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "Removido com sucesso",
                        message: "Configuração TOTP removida com sucesso"
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao recuperar o QR code",
                            message: "Algo deu errado"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao tentar obter um novo QR code",
                            message: "Algo deu errado"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao tentar atualizar a lista de autenticadores habilitados",
                            message: "Algo deu errado"
                        }
                    }
                },
                regenerate: "Regenerar"
            },
            backupCode: {
                actions: {
                    add: "Adicionar códigos de backup",
                    delete: "Remover códigos de backup"
                },
                description: "Use códigos de backup para acessar sua conta no caso de não poder receber códigos de autenticação multifator. Você pode regenerar novos códigos se necessário.",
                download: {
                    heading: "Códigos de backup para {{productName}}",
                    info1: "Você só pode usar cada código de backup uma vez.",
                    info2: "Esses códigos foram gerados em ",
                    subHeading: "Você pode usar esses códigos de backup para entrar no {{productName}} quando estiver longe do seu telefone. Mantenha esses códigos de backup em um local seguro, mas acessível."
                },
                heading: "Códigos de Backup",
                messages: {
                    disabledMessage: "Pelo menos um autenticador adicional deve ser configurado para habilitar códigos de backup."
                },
                modals: {
                    actions: {
                        copied: "Copiado",
                        copy: "Copiar Códigos",
                        download: "Baixar Códigos",
                        regenerate: "Regenerar"
                    },
                    delete: {
                        description: "Esta ação removerá os códigos de backup e você não poderá mais usá-los. Deseja continuar?",
                        heading: "Confirmação"
                    },
                    description: "Use códigos de backup para entrar quando estiver longe do seu telefone.",
                    generate: {
                        description: "Todos os seus códigos de backup foram usados. Vamos gerar um novo conjunto de códigos de backup.",
                        heading: "Gerar"
                    },
                    heading: "Códigos de Backup",
                    info: "Cada código só pode ser usado uma vez. Você pode gerar novos códigos a qualquer momento para substituir estes.",
                    regenerate: {
                        description: "Após gerar novos códigos, seus códigos antigos não funcionarão mais. Certifique-se de salvar os novos códigos assim que forem gerados.",
                        heading: "Confirmação"
                    },
                    subHeading: "Códigos de uso único que você pode usar para entrar",
                    warn: "Estes códigos aparecerão apenas uma vez. Certifique-se de salvá-los agora e armazená-los em algum lugar seguro, mas acessível."
                },
                mutedHeader: "Opções de Recuperação",
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao deletar códigos de backup",
                            message: "Algo deu errado"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "Removido com sucesso",
                        message: "Códigos de backup removidos com sucesso"
                    },
                    downloadError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao tentar baixar códigos de backup",
                            message: "Algo deu errado"
                        }
                    },
                    downloadSuccess: {
                        genericMessage: {
                            description: "Os códigos de backup foram baixados com sucesso",
                            message: "Códigos de backup baixados com sucesso"
                        },
                        message: {
                            description: "{{message}}",
                            message: "Códigos de backup baixados com sucesso"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao tentar gerar novos códigos de backup",
                            message: "Algo deu errado"
                        }
                    },
                    retrieveAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao tentar obter a lista de autenticadores habilitados",
                            message: "Algo deu errado"
                        }
                    },
                    retrieveError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao recuperar códigos de backup",
                            message: "Algo deu errado"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Algo deu errado"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao tentar atualizar a lista de autenticadores habilitados",
                            message: "Algo deu errado"
                        }
                    }
                },
                remaining: "restante(s)"
            },
            fido: {
                description: "Você pode usar um <1>Passkey</1>, <1>Chave de Segurança FIDO2</1> ou <1>Biometria</1> em seu dispositivo para entrar na sua conta.",
                form: {
                    label: "Chave de Segurança/Biometria",
                    placeholder: "Insira um nome para a chave de segurança/biometria",
                    remove: "Remover a chave de segurança/biometria",
                    required: "Por favor, insira um nome para sua chave de segurança/biometria"
                },
                heading: "Chave de Segurança/Biometria",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "Por favor, confirme sua ação.",
                        content: "Esta ação é irreversível e excluirá permanentemente a chave de segurança/biometria.",
                        description: "Se você excluir esta chave de segurança/biometria, pode não conseguir entrar na sua conta novamente. Por favor, proceda com cautela.",
                        heading: "Tem certeza?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "O registro da chave de segurança/biometria foi interrompido. Se isso não foi intencional, você pode tentar o processo novamente.",
                        heading: "Falha no Registro da Chave de Segurança/Biometria",
                        tryWithOlderDevice: "Você também pode tentar novamente com uma chave de segurança/biometria mais antiga."
                    }
                },
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao remover a chave de segurança/biometria"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao remover a chave de segurança/biometria",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "A chave de segurança/biometria foi removida com sucesso da lista",
                            message: "Sua chave de segurança/biometria foi removida com sucesso"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao recuperar a chave de segurança/biometria"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao recuperar a chave de segurança/biometria",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "A chave de segurança/biometria foi registrada com sucesso e agora você pode usá-la para autenticação.",
                            message: "Sua chave de segurança/biometria foi registrada com sucesso"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao atualizar o nome da chave de segurança/biometria"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar o nome da chave de segurança/biometria",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O nome da sua chave de segurança/biometria foi atualizado com sucesso",
                            message: "Nome da chave de Segurançabiometria foi atualizado com sucesso"
                        }
                    }
                },
                tryButton: "Tente uma chave de segurança/biometria mais antiga"
            },
            smsOtp: {
                descriptions: {
                    hint: "Você receberá uma mensagem de texto contendo um código de verificação de uso único"
                },
                heading: "Número SMS",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao atualizar o número de celular"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar o número de celular",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O número de celular no perfil do usuário foi atualizado com sucesso",
                            message: "Número de celular atualizado com sucesso"
                        }
                    }
                }
            }
        },
        mobileUpdateWizard: {
            done: "Sucesso! Seu número de celular foi verificado com sucesso.",
            notifications: {
                resendError: {
                    error: {
                        description: "{{error}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Um erro ocorreu ao tentar obter um novo código de verificação",
                        message: "Algo deu errado"
                    }
                },
                resendSuccess: {
                    message: "Solicitação de reenvio de código enviada com sucesso"
                }
            },
            submitMobile: {
                heading: "Insira seu novo número de celular"
            },
            verifySmsOtp: {
                error: "Verificação falhou. Por favor, tente novamente.",
                generate: "Reenviar um novo código de verificação",
                heading: "Insira o código de verificação enviado para o seu número de celular",
                label: "Código de Verificação",
                placeholder: "Insira seu código de verificação",
                requiredError: "Insira o código de verificação"
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "Gerenciar atividade da conta"
                    },
                    description: "Você está atualmente logado a partir do seguinte dispositivo",
                    header: "Sessões Ativas"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "Atualizar a segurança da conta"
                    },
                    description: "Configurações e recomendações para ajudá-lo a manter sua conta segura",
                    header: "Segurança da Conta"
                },
                accountStatus: {
                    complete: "Seu perfil está completo",
                    completedFields: "Campos preenchidos",
                    completionPercentage: "A conclusão do seu perfil está em {{percentage}}%",
                    inComplete: "Complete seu perfil",
                    inCompleteFields: "Campos incompletos",
                    mandatoryFieldsCompletion: "{{completed}} de {{total}} campos obrigatórios concluídos",
                    optionalFieldsCompletion: "{{completed}} de {{total}} campos opcionais concluídos"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "Gerenciar consentimentos"
                    },
                    description: "Controle os dados que deseja compartilhar com aplicativos",
                    header: "Controle de Consentimentos"
                },
                profileStatus: {
                    completionPercentage: "A conclusão do seu perfil está em {{percentage}}%",
                    description: "Gerenciar seu perfil",
                    header: "Seu Perfil {{productName}}",
                    profileText: "Detalhes do seu perfil pessoal",
                    readOnlyDescription:"VVisualizar seu perfil",
                    userSourceText: "(Cadastrado via {{source}})"
                }
            }
        },
        privacy: {
            about: {
                description: "WSO2 Identity Server (referido como “WSO2 IS” nesta política) é um servidor de gerenciamento de identidade e direitos de código aberto baseado em padrões e especificações abertas.",
                heading: "Sobre WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS usa seu endereço IP para detectar tentativas suspeitas de login em sua conta.",
                            1: "WSO2 IS usa atributos como seu nome, sobrenome, etc., para fornecer uma experiência de usuário rica e personalizada.",
                            2: "WSO2 IS usa suas perguntas e respostas de segurança apenas para permitir a recuperação da conta."
                        },
                        para1: "WSO2 IS coleta suas informações apenas para atender às suas necessidades de acesso. Por exemplo:"
                    },
                    heading: "Coleta de informações pessoais",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Coletando informações da página de perfil do usuário onde você insere seus dados pessoais.",
                                1: "Rastreando seu endereço IP com solicitação HTTP, cabeçalhos HTTP e TCP/IP.",
                                2: "Rastreando suas informações geográficas com o endereço IP.",
                                3: "Rastreando seu histórico de login com cookies do navegador. Por favor, veja nossa {{cookiePolicyLink}} para mais informações."
                            },
                            para1: "WSO2 IS coleta suas informações por:"
                        },
                        heading: "Tecnologias de Rastreamento"
                    }
                },
                description: {
                    para1: "Esta política descreve como WSO2 IS captura suas informações pessoais, os propósitos da coleta e informações sobre a retenção de suas informações pessoais.",
                    para2: "Por favor, note que esta política é apenas para referência e é aplicável ao software como um produto. WSO2 LLC. e seus desenvolvedores não têm acesso às informações mantidas dentro do WSO2 IS. Por favor, veja a seção <1>aviso legal</1> para mais informações.",
                    para3: "Entidades, organizações ou indivíduos que controlam o uso e administração do WSO2 IS devem criar suas próprias políticas de privacidade definindo a maneira como os dados são controlados ou processados pela respectiva entidade, organização ou indivíduo."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, seus funcionários, parceiros e afiliados não têm acesso e não requerem, armazenam, processam ou controlam nenhum dos dados, incluindo dados pessoais contidos no WSO2 IS. Todos os dados, incluindo dados pessoais, são controlados e processados pela entidade ou indivíduo que executa o WSO2 IS. WSO2, seus funcionários, parceiros e afiliados não são um processador de dados ou um controlador de dados dentro do significado de quaisquer regulamentos de privacidade de dados. WSO2 não fornece quaisquer garantias ou assume qualquer responsabilidade ou obrigação em conexão com a legalidade ou a maneira e propósitos para os quais o WSO2 IS é usado por tais entidades ou pessoas.",
                            1: "Esta política de privacidade é para fins informativos da entidade ou pessoas que executam o WSO2 IS e define os processos e funcionalidades contidos no WSO2 IS em relação à proteção de dados pessoais. É responsabilidade das entidades e pessoas que executam o WSO2 IS criar e administrar suas próprias regras e processos governando os dados pessoais dos usuários, e tais regras e processos podem alterar as políticas de uso, armazenamento e divulgação contidas aqui. Portanto, os usuários devem consultar a entidade ou pessoas que executam o WSO2 IS para sua própria política de privacidade para detalhes que governam os dados pessoais dos usuários."
                        }
                    },
                    heading: "Aviso Legal"
                },
                disclosureOfPersonalInfo: {
                    description: "O WSO2 IS só divulga informações pessoais para as aplicações relevantes (também conhecidas como Provedor de Serviço) que estão registradas com o WSO2 IS. Essas aplicações são registradas pelo administrador de identidade da sua entidade ou organização. As informações pessoais são divulgadas apenas para os fins para os quais foram coletadas (ou para um uso identificado como consistente com esse propósito), conforme controlado por tais Provedores de Serviços, a menos que você tenha consentido de outra forma ou quando é exigido por lei.",
                    heading: "Divulgação de informações pessoais",
                    legalProcess: {
                        description: "Observe que a organização, entidade ou indivíduo que opera o WSO2 IS pode ser compelido a divulgar suas informações pessoais com ou sem o seu consentimento quando é exigido por lei, seguindo um processo legal e devido.",
                        heading: "Processo legal"
                    }
                },
                heading: "Política de Privacidade",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "Versões atualizadas do WSO2 IS podem conter alterações nesta política e revisões desta política serão incluídas nessas atualizações. Tais mudanças só se aplicam a usuários que optarem por usar versões atualizadas.",
                            para2: "A organização que opera o WSO2 IS pode revisar a Política de Privacidade de tempos em tempos. Você pode encontrar a política mais recente com o respectivo link fornecido pela organização que opera o WSO2 IS. A organização notificará quaisquer alterações na política de privacidade através de nossos canais públicos oficiais."
                        },
                        heading: "Mudanças nesta política"
                    },
                    contactUs: {
                        description: {
                            para1: "Por favor, entre em contato com a WSO2 se você tiver alguma dúvida ou preocupação em relação a esta política de privacidade."
                        },
                        heading: "Fale conosco"
                    },
                    heading: "Mais informações",
                    yourChoices: {
                        description: {
                            para1: "Se você já tem uma conta de usuário no WSO2 IS, você tem o direito de desativar sua conta se achar que esta política de privacidade é inaceitável para você.",
                            para2: "Se você não tem uma conta e não concorda com nossa política de privacidade, você pode optar por não criar uma."
                        },
                        heading: "Suas escolhas"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "Armazenamento de informações pessoais",
                    howLong: {
                        description: {
                            list1: {
                                0: "Senha atual",
                                1: "Senhas usadas anteriormente"
                            },
                            para1: "O WSO2 IS retém seus dados pessoais enquanto você for um usuário ativo de nosso sistema. Você pode atualizar seus dados pessoais a qualquer momento usando os portais de autoatendimento fornecidos.",
                            para2: "O WSO2 IS pode manter segredos hash para fornecer um nível adicional de segurança. Isso inclui:"
                        },
                        heading: "Quanto tempo suas informações pessoais são retidas"
                    },
                    requestRemoval: {
                        description: {
                            para1: "Você pode solicitar ao administrador para excluir sua conta. O administrador é o administrador da organização na qual você está registrado, ou o super-administrador se você não usar o recurso de organização.",
                            para2: "Além disso, você pode solicitar a anonimização de todos os vestígios de suas atividades que o WSO2 IS possa ter retido em logs, bancos de dados ou armazenamentos analíticos."
                        },
                        heading: "Como solicitar a remoção de suas informações pessoais"
                    },
                    where: {
                        description: {
                            para1: "O WSO2 IS armazena suas informações pessoais em bancos de dados seguros. O WSO2 IS exerce medidas de segurança aceitas na indústria para proteger o banco de dados onde suas informações pessoais são mantidas. O WSO2 IS, como produto, não transfere nem compartilha seus dados com terceiros ou locais.",
                            para2: "O WSO2 IS pode usar criptografia para manter seus dados pessoais com um nível adicional de segurança."
                        },
                        heading: "Onde suas informações pessoais são armazenadas"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "Para fornecer uma experiência de usuário personalizada, o WSO2 IS usa seu nome e fotos de perfil enviadas.",
                            1: "Para proteger sua conta de acessos não autorizados ou tentativas de hacking, o WSO2 IS usa Cabeçalhos HTTP ou TCP/IP.",
                            2: "Prover dados estatísticos para fins analíticos sobre melhorias no desempenho do sistema. O WSO2 IS não manterá nenhuma informação pessoal após cálculos estatísticos. Portanto, o relatório estatístico não tem meios de identificar uma pessoa individual."
                        },
                        para1: "O WSO2 IS usará suas informações pessoais apenas para os fins para os quais foram coletadas (ou para um uso identificado como consistente com esse propósito).",
                        para2: "OO WSO2 IS usa suas informações pessoais apenas para os seguintes propósitos.",
                        subList1: {
                            heading: "Isso inclui:",
                            list: {
                                0: "Endereço IP",
                                1: "Impressão digital do navegador",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "O WSO2 IS pode usar:",
                            list: {
                                0: "Endereço IP para obter informações geográficas",
                                1: "Impressão digital do navegador para determinar a tecnologia e/ou versão do navegador"
                            }
                        }
                    },
                    heading: "Uso de informações pessoais"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "Seu nome de usuário (exceto nos casos em que o nome de usuário criado pelo seu empregador está sob contrato)",
                            1: "Sua data de nascimento/idade",
                            2: "Endereço IP usado para fazer login",
                            3: "Seu ID de dispositivo se você usar um dispositivo (por exemplo, telefone ou tablet) para fazer login"
                        },
                        list2: {
                            0: "Cidade/País de onde originou a conexão TCP/IP",
                            1: "Horário do dia em que você fez login (ano, mês, semana, hora ou minuto)",
                            2: "Tipo de dispositivo que você usou para fazer login (por exemplo, telefone ou tablet)",
                            3: "Sistema operacional e informações genéricas do navegador"
                        },
                        para1: "O WSO2 IS considera qualquer coisa relacionada a você, e pela qual você pode ser identificado, como suas informações pessoais. Isso inclui, mas não está limitado a:",
                        para2: "No entanto, o WSO2 IS também coleta as seguintes informações que não são consideradas informações pessoais, mas são usadas apenas para fins <1>estatísticos</1>. A razão para isso é que essas informações não podem ser usadas para rastrear você."
                    },
                    heading: "O que é informação pessoal?"
                }
            }
        },
        profile: {
            fields: {
                "Account Confirmed Time": "Hora da Confirmação da Conta",
                "Account Disabled": "Conta Desativada",
                "Account Locked": "Conta Bloqueada",
                "Account State": "Estado da Conta",
                "Active": "Ativo",
                "Address - Street": "Endereço - Rua",
                "Ask Password": "Solicitar Senha",
                "Backup Code Enabled": "Código de Backup Habilitado",
                "Backup Codes": "Códigos de Backup",
                "Birth Date": "Data de Nascimento",
                "Country": "País",
                "Created Time": "Hora da Criação",
                "Disable EmailOTP": "Desabilitar OTP de E-mail",
                "Disable SMSOTP": "Desabilitar OTP de SMS",
                "Display Name": "Nome de Exibição",
                "Email": "E-mail",
                "Email Verified": "E-mail Verificado",
                "Enabled Authenticators": "Autenticadores Habilitados",
                "Existing Lite User": "Usuário Lite Existente",
                "External ID": "ID Externo",
                "Failed Attempts Before Success": "Tentativas Falhas Antes do Sucesso",
                "Failed Backup Code Attempts": "Tentativas Falhas no Código de Backup",
                "Failed Email OTP Attempts": "Tentativas Falhas no OTP de E-mail",
                "Failed Lockout Count": "Contagem de Bloqueio por Falhas",
                "Failed Login Attempts": "Tentativas de Login Falhas",
                "Failed Password Recovery Attempts": "Tentativas Falhas de Recuperação de Senha",
                "Failed SMS OTP Attempts": "Tentativas Falhas no OTP de SMS",
                "Failed TOTP Attempts": "Tentativas Falhas no TOTP",
                "First Name": "Nome",
                "Force Password Reset": "Forçar Redefinição de Senha",
                "Full Name": "Nome Completo",
                "Gender": "Gênero",
                "Groups": "Grupos",
                "Identity Provider Type": "Tipo de Provedor de Identidade",
                "Last Logon": "Último Login",
                "Last Modified Time": "Hora da Última Modificação",
                "Last Name": "Sobrenome",
                "Last Password Update": "Última Atualização de Senha",
                "Lite User": "Usuário Lite",
                "Lite User ID": "ID do Usuário Lite",
                "Local": "Local",
                "Local Credential Exists": "Credencial Local Existe",
                "Locality": "Localidade",
                "Location": "Localização",
                "Locked Reason": "Motivo do Bloqueio",
                "Manager - Name": "Gerente - Nome",
                "Middle Name": "Nome do Meio",
                "Mobile": "Celular",
                "Nick Name": "Apelido",
                "Phone Verified": "Telefone Verificado",
                "Photo - Thumbnail": "Foto - Miniatura",
                "Photo URL": "URL da Foto",
                "Postal Code": "Código Postal",
                "Preferred Channel": "Canal Preferencial",
                "Read Only User": "Usuário Somente Leitura",
                "Region": "Região",
                "Resource Type": "Tipo de Recurso",
                "Roles": "Atribuições",
                "Secret Key": "Chave Secreta",
                "TOTP Enabled": "TOTP Habilitado",
                "Time Zone": "Fuso Horário",
                "URL": "URL",
                "Unlock Time": "Hora do Desbloqueio",
                "User Account Type": "Tipo de Conta do Usuário",
                "User ID": "ID do Usuário",
                "User Metadata - Version": "Metadados do Usuário - Versão",
                "User Source": "Fonte do Usuário",
                "User Source ID": "ID da Fonte do Usuário",
                "Username": "Nome de Usuário",
                "Verification Pending Email": "E-mail Pendente de Verificação",
                "Verification Pending Mobile Number": "Número de Celular Pendente de Verificação",
                "Verify Email": "Verificar E-mail",
                "Verify Mobile": "Verificar Celular",
                "Verify Secret Key": "Verificar Chave Secreta",
                "Website URL": "URL do Site",
                emails: "E-mail",
                generic: {
                    default: "Adicionar {{fieldName}}"
                },
                nameFamilyName: "Sobrenome",
                nameGivenName: "Nome",
                phoneNumbers: "Número de telefone",
                profileImage: "Imagem de Perfil",
                profileUrl: "URL",
                userName: "Nome de Usuário"
            },
            forms: {
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: "Selecione seu país"
                        }
                    }
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                futureDateError: "A data que você inseriu para o campo {{field}} é inválida.",
                                invalidFormat: "Por favor, insira um {{fieldName}} válido no formato AAAA-MM-DD."
                            }
                        }
                    }
                },
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "E-mail",
                            note: "NOTA: Editar isso altera o endereço de e-mail associado a esta conta. Este endereço de e-mail também é usado para recuperação de conta.",
                            placeholder: "Insira seu endereço de e-mail",
                            validations: {
                                empty: "O endereço de e-mail não pode estar vazio",
                                invalidFormat: "Por favor, insira um endereço de email válido. Você pode usar caracteres alfanuméricos, caracteres unicode, sublinhados (_), traços (-), pontos (.), e um sinal de arroba (@)."
                            }
                        }
                    }
                },
                generic: {
                    inputs: {
                        placeholder: "Insira seu {{fieldName}}",
                        readonly: {
                            placeholder: "Este valor está vazio",
                            popup: "Contate o administrador para atualizar seu {{fieldName}}"
                        },
                        validations: {
                            empty: "{{fieldName}} é um campo obrigatório",
                            invalidFormat: "O formato do {{fieldName}} inserido está incorreto"
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "Número de celular",
                            note: "NOTA: Isso mudará o número de celular em seu perfil",
                            placeholder: "Insira seu número de celular",
                            validations: {
                                empty: "O número de celular não pode estar vazio",
                                invalidFormat: "Por favor, insira um número de celular válido no formato [+][código do país][código de área][número de telefone local]."
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "Nome",
                            placeholder: "Insira o nome",
                            validations: {
                                empty: "O nome não pode estar vazio"
                            }
                        },
                        lastName: {
                            label: "Sobrenome",
                            placeholder: "Insira o sobrenome",
                            validations: {
                                empty: "O sobrenome não pode estar vazio"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "Organização",
                            placeholder: "Insira sua organização",
                            validations: {
                                empty: "A organização não pode estar vazio"
                            }
                        }
                    }
                }
            },
            messages: {
                emailConfirmation: {
                    content: "Por favor, confirme a atualização do endereço de e-mail para adicionar o novo e-mail ao seu perfil.",
                    header: "Confirmação pendente!"
                },
                mobileVerification: {
                    content: "Este número de celular é usado para enviar OTPs de SMS quando a autenticação de segundo fator estiver habilitada e para enviar códigos de recuperação em caso de recuperação de nome de usuário/senha. Para atualizar este número, você deve verificar o novo número inserindo o código de verificação enviado para seu novo número. Clique em atualizar se desejar prosseguir."
                }
            },
            notifications: {
                getProfileCompletion: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao avaliar a conclusão do perfil",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A conclusão do perfil foi avaliada com sucesso",
                        message: "Cálculo Bem-Sucedido"
                    }
                },
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao recuperar os detalhes do perfil"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao recuperar os detalhes do perfil",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os detalhes necessários do perfil do usuário foram recuperados com sucesso",
                        message: "Perfil do usuário recuperado com sucesso"
                    }
                },
                getUserReadOnlyStatus: {
                    genericError: {
                        description: "Ocorreu um erro ao recuperar o status de somente leitura do usuário",
                        message: "Algo deu errado"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao atualizar os detalhes do perfil"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao atualizar os detalhes do perfil",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os detalhes necessários do perfil do usuário foram atualizados com sucesso",
                        message: "Perfil do usuário atualizado com sucesso"
                    }
                }
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "Este recurso não está disponível para sua conta"
                }
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao baixar os detalhes do perfil do usuário"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao baixar os detalhes do perfil do usuário",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "O arquivo contendo os detalhes necessários do perfil do usuário começou a ser baixado",
                        message: "Download dos detalhes do perfil do usuário iniciado"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "Esta imagem foi recuperada do serviço <1>Gravatar</1>.",
            urlUpdateHeader: "Insira uma URL de imagem para definir sua foto de perfil"
        },
        userSessions: {
            browserAndOS: "{{browser}} no {{os}} {{version}}",
            dangerZones: {
                terminate: {
                    actionTitle: "Encerrar",
                    header: "Encerrar sessão",
                    subheader: "Você será desconectado da sessão no dispositivo específico."
                }
            },
            lastAccessed: "Último acesso em {{date}}",
            modals: {
                terminateActiveUserSessionModal: {
                    heading: "Encerrar Sessões Ativas Atuais",
                    message:
                        "As alterações na opção de autenticação de segundo fator (2FA) não serão aplicadas às suas sessões ativas. Recomendamos que você as encerre.",
                    primaryAction: "Encerrar tudo",
                    secondaryAction: "Revisar e encerrar"

                },
                terminateAllUserSessionsModal: {
                    heading: "Confirmação",
                    message: "A ação irá desconectá-lo desta sessão e de todas as outras sessões em todos os dispositivos. Deseja continuar?"
                },
                terminateUserSessionModal: {
                    heading: "Confirmação",
                    message: "Esta ação irá desconectá-lo da sessão no dispositivo específico. Deseja continuar?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar sessão ativa"
                    },
                    genericError: {
                        description: "Não foi possível recuperar nenhuma sessão ativa",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Sessões ativas recuperadas com sucesso",
                        message: "Recuperação de sessão ativa bem-sucedida"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Não foi possível encerrar sessões ativas"
                    },
                    genericError: {
                        description: "Algo deu errado ao encerrar sessões ativas",
                        message: "Não foi possível encerrar sessões ativas"
                    },
                    success: {
                        description: "Todas as sessões ativas foram encerradas com sucesso",
                        message: "Todas as sessões ativas foram encerradas"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "Não foi possível encerrar a sessão ativa"
                    },
                    genericError: {
                        description: "Algo deu errado ao encerrar a sessão ativa",
                        message: "Não foi possível encerrar a sessão ativa"
                    },
                    success: {
                        description: "Sessão ativa encerrada com sucesso",
                        message: "Sucesso no encerramento da sessão"
                    }
                }
            }
        }
    },
    modals: {
        editAvatarModal: {
            content: {
                gravatar: {
                    errors: {
                        noAssociation: {
                            content: "Parece que o email selecionado não está registrado no Gravatar. Inscreva-se para uma conta Gravatar visitando <1>site oficial do Gravatar</1> ou use uma das seguintes opções.",
                            header: "Nenhuma imagem Gravatar correspondente encontrada!"
                        }
                    },
                    heading: "Gravatar baseado em "
                },
                hostedAvatar: {
                    heading: "Imagem Hospedada",
                    input: {
                        errors: {
                            http: {
                                content: "A URL selecionada aponta para uma imagem insegura servida por HTTP. Por favor, prossiga com cautela.",
                                header: "Conteúdo Inseguro!"
                            },
                            invalid: {
                                content: "Por favor, insira um URL de imagem válido"
                            }
                        },
                        hint: "Insira um URL de imagem válido que esteja hospedado em um local de terceiros.",
                        placeholder: "Insira o URL da imagem.",
                        warnings: {
                            dataURL: {
                                content: "Usar URLs de Dados com grande quantidade de caracteres pode resultar em problemas de banco de dados. Prossiga com cautela.",
                                header: "Verifique novamente o URL de Dados inserido!"
                            }
                        }
                    }
                },
                systemGenAvatars: {
                    heading: "Avatar gerado pelo sistema",
                    types: {
                        initials: "Iniciais"
                    }
                }
            },
            description: null,
            heading: "Atualizar foto de perfil",
            primaryButton: "Salvar",
            secondaryButton: "Cancelar"
        },
        sessionTimeoutModal: {
            description: "Quando você clicar em <1>Voltar</1>, tentaremos recuperar a sessão, se ela existir. Se você não tiver uma sessão ativa, será redirecionado para a página de login.",
            heading: "Parece que você esteve inativo por muito tempo.",
            loginAgainButton: "Entrar novamente",
            primaryButton: "Voltar",
            secondaryButton: "Sair",
            sessionTimedOutDescription: "Por favor, faça login novamente para continuar de onde parou.",
            sessionTimedOutHeading: "Sessão do usuário expirou devido à inatividade."
        }
    },
    pages: {
        applications: {
            subTitle: "Descubra e acesse suas aplicações",
            title: "Aplicações"
        },
        overview: {
            subTitle: "Gerencie suas informações pessoais, segurança da conta e configurações de privacidade",
            title: "Bem-vindo, {{firstName}}"
        },
        personalInfo: {
            subTitle: "Edite ou exporte seu perfil pessoal e gerencie contas vinculadas",
            title: "Informações Pessoais"
        },
        personalInfoWithoutExportProfile: {
            subTitle: "Visualize e gerencie suas informações pessoais",
            title: "Informações Pessoais"
        },
        personalInfoWithoutLinkedAccounts: {
            subTitle: "Edite ou exporte seu perfil pessoal",
            title: "Informações Pessoais"
        },
        privacy: {
            subTitle: "",
            title: "Política de Privacidade do WSO2 Identity Server"
        },
        readOnlyProfileBanner: "Seu perfil não pode ser modificado por este portal. Por favor, entre em contato com seu administrador para mais detalhes.",
        security: {
            subTitle: "Proteja sua conta gerenciando consentimentos, sessões e configurações de segurança",
            title: "Segurança"
        }
    },
    placeholders: {
        404: {
            action: "Voltar para a página inicial",
            subtitles: {
                0: "Não conseguimos encontrar a página que você está procurando.",
                1: "Por favor, verifique o URL ou clique no botão abaixo para ser redirecionado de volta para a página inicial."
            },
            title: "Página não encontrada"
        },
        accessDeniedError: {
            action: "Voltar para a página inicial",
            subtitles: {
                0: "Parece que você não tem permissão para acessar esta página.",
                1: "Por favor, tente entrar com uma conta diferente."
            },
            title: "Acesso não concedido"
        },
        emptySearchResult: {
            action: "Limpar consulta de pesquisa",
            subtitles: {
                0: "Não encontramos resultados para \"{{query}}\"",
                1: "Por favor, tente um termo de pesquisa diferente."
            },
            title: "Nenhum resultado encontrado"
        },
        genericError: {
            action: "Atualize a página",
            subtitles: {
                0: "Algo deu errado ao exibir esta página.",
                1: "Veja o console do navegador para detalhes técnicos."
            },
            title: "Algo deu errado"
        },
        loginError: {
            action: "Continuar o logout",
            subtitles: {
                0: "Parece que você não tem permissão para usar este portal.",
                1: "Por favor, entre com uma conta diferente."
            },
            title: "Você não está autorizado"
        },
        sessionStorageDisabled: {
            subtitles: {
                0: "Para usar este aplicativo, você precisa habilitar cookies nas configurações do seu navegador.",
                1: "Para mais informações sobre como habilitar cookies, veja a seção de ajuda do seu navegador."
            },
            title: "Cookies estão desabilitados no seu navegador."
        }
    },
    sections: {
        accountRecovery: {
            description: "Gerencie informações de recuperação que podemos usar para ajudá-lo a recuperar sua senha",
            emptyPlaceholderText: "Sem opções de recuperação de conta disponíveis",
            heading: "Recuperação de Conta"
        },
        changePassword: {
            actionTitles: {
                change: "Alterar sua senha"
            },
            description: "Atualize sua senha regularmente e certifique-se de que ela seja única em relação a outras senhas que você usa.",
            heading: "Alterar Senha"
        },
        consentManagement: {
            actionTitles: {
                empty: "Você não concedeu consentimento a nenhum aplicativo"
            },
            description: "Revise os consentimentos que você forneceu para cada aplicativo. Além disso, você pode revogar um ou mais deles conforme necessário.",
            heading: "Gerenciar Consentimentos",
            placeholders: {
                emptyConsentList: {
                    heading: "Você não concedeu consentimento a nenhum aplicativo"
                }
            }
        },
        createPassword: {
            actionTitles: {
                create: "Criar senha"
            },
            description: "Crie uma senha no {{productName}}. Você pode usar esta senha para entrar no {{productName}} além do login social.",
            heading: "Criar Senha"
        },
        federatedAssociations: {
            description: "Veja suas contas de outros provedores de identidade que estão vinculadas a esta conta",
            heading: "Contas de Login Social Vinculadas"
        },
        linkedAccounts: {
            actionTitles: {
                add: "Adicionar conta"
            },
            description: "Vincule/associe suas outras contas e acesse-as sem precisar fazer login novamente",
            heading: "Contas Vinculadas"
        },
        mfa: {
            description: "Configure autenticações adicionais para entrar facilmente ou adicionar uma camada extra de segurança à sua conta.",
            heading: "Autenticação Adicional"
        },
        profile: {
            description: "Gerencie seu perfil pessoal",
            heading: "Perfil"
        },
        profileExport: {
            actionTitles: {
                export: "Baixar o perfil"
            },
            description: "Baixe todos os seus dados de perfil, incluindo dados pessoais e contas vinculadas",
            heading: "Exportar Perfil"
        },
        userSessions: {
            actionTitles: {
                empty: "Nenhuma sessão ativa",
                terminateAll: "Encerrar todas as sessões"
            },
            description: "Revise todas as sessões de usuário ativas para sua conta",
            heading: "Sessões Ativas",
            placeholders: {
                emptySessionList: {
                    heading: "Não há sessões ativas para este usuário"
                }
            }
        }
    }
};
