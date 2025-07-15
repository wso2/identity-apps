/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
            SMSRecovery: {
                descriptions: {
                    add: "Adicione ou atualize o número do celular de recuperação.",
                    emptyMobile: "Você precisa configurar seu número de celular para prosseguir com a recuperação via SMS-OTP.",
                    update: "Atualize o número do celular de recuperação ({{mobile}})",
                    view: "Visualize o número do celular de recuperação ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "Número de celular",
                                placeholder: "Digite o número do celular de recuperação.",
                                validations: {
                                    empty: "Digite um número de celular.",
                                    invalidFormat: "O número do celular não está no formato correto."
                                }
                            }
                        }
                    }
                },
                heading: "Recuperação via SMS",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Erro ao atualizar o número do celular de recuperação."
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar o número do celular de recuperação",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O número do celular no perfil do usuário foi atualizado com sucesso",
                            message: "Número do celular atualizado com sucesso"
                        }
                    }
                }
            },
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
            dropdown: {
                footer: {
                    cookiePolicy: "Cookies",
                    privacyPolicy: "Privacidade",
                    termsOfService: "Termos"
                }
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
                heading: "Autenticador TOTP",
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
                noPassKeyMessage: "Você ainda não tem nenhuma chave de acesso registrada.",
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
            "pushAuthenticatorApp": {
                "addHint": "Configurar",
                "configuredDescription": "Você pode usar os prompts de login gerados pelo seu aplicativo autenticador configurado para autenticação de dois fatores. Se você não tiver acesso ao aplicativo, pode configurar um novo aplicativo autenticador aqui.",
                "deleteHint": "Remover",
                "description": "Você pode usar o aplicativo autenticador push para receber prompts de login como notificações push para autenticação de dois fatores.",
                "heading": "Autenticador Push",
                "hint": "Ver",
                "modals": {
                    "deviceDeleteConfirmation": {
                        "assertionHint": "Por favor, confirme sua ação.",
                        "content": "Essa ação é irreversível e removerá o dispositivo permanentemente.",
                        "description": "Se você remover este dispositivo, pode não conseguir entrar novamente na sua conta. Por favor, prossiga com cautela.",
                        "heading": "Você tem certeza?"
                    },
                    "scan": {
                        "additionNote": "O código QR foi adicionado ao seu perfil com sucesso!",
                        "done": "Sucesso! Agora você pode usar seu aplicativo autenticador push para autenticação de dois fatores.",
                        "heading": "Configurar o aplicativo autenticador push",
                        "messageBody": "Você pode encontrar uma lista de aplicativos autenticadores disponíveis aqui.",
                        "subHeading": "Escaneie o código QR abaixo usando o aplicativo autenticador push"
                    }
                },
                "notifications": {
                    "delete": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo deu errado"
                        },
                        "genericError": {
                            "description": "Ocorreu um erro ao remover o dispositivo registrado",
                            "message": "Algo deu errado"
                        },
                        "success": {
                            "description": "O dispositivo registrado foi removido com sucesso",
                            "message": "Dispositivo removido com sucesso"
                        }
                    },
                    "deviceListFetchError": {
                        "error": {
                            "description": "Ocorreu um erro ao recuperar os dispositivos registrados para autenticação push",
                            "message": "Algo deu errado"
                        }
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo deu errado"
                        },
                        "genericError": {
                            "description": "Ocorreu um erro ao recuperar o código QR",
                            "message": "Algo deu errado"
                        }
                    }
                }
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
            verificationSent: {
                heading: "Você receberá um OTP no seu número de celular para verificação em breve"
            },
            verifySmsOtp: {
                didNotReceive: "Não recebeu o código?",
                error: "Verificação falhou. Por favor, tente novamente.",
                heading: "Verifique o seu número de celular",
                label: "Digite o código de verificação enviado ao seu número de celular",
                placeholder: "Insira seu código de verificação",
                requiredError: "Insira o código de verificação",
                resend: "Reenviar"
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
        profile: {
            actions: {
                "deleteEmail": "Excluir endereço de e -mail",
                "deleteMobile": "Excluir móvel",
                "verifyEmail": "Verifique o endereço de e -mail",
                "verifyMobile": "Verifique o celular"
            },
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
                "Email Addresses": "Endereço de e-mail",
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
                "Mobile Numbers": "Números de celular",
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
                "Verified Email Addresses": "Endereços de e -mail verificados",
                "Verified Mobile Numbers": "Números de celular verificados",
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
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: "Por favor, confirme sua ação.",
                    content: "Esta ação é irreversível e excluirá permanentemente o valor selecionado.",
                    description: "Se você excluir este valor selecionado, ele será removido permanentemente do seu perfil.",
                    heading: "Tem certeza?"
                },
                emailAddressDeleteConfirmation: {
                    assertionHint: "Por favor, confirme sua ação.",
                    content: "Esta ação é irreversível e excluirá permanentemente o endereço de e -mail.",
                    description: "Se você excluir este endereço de e -mail, ele será removido permanentemente do seu perfil.",
                    heading: "Tem certeza?"
                },
                mobileNumberDeleteConfirmation: {
                    assertionHint: "Por favor, confirme sua ação.",
                    content: "Esta ação é irreversível e excluirá permanentemente o número de celular.",
                    description: "Se você excluir esse número de celular, ele será removido permanentemente do seu perfil.",
                    heading: "Tem certeza?"
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
                },
                verifyEmail: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao enviar o email de verificação"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao enviar o email de verificação",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "O email de verificação foi enviado com sucesso. Verifique sua caixa de entrada",
                        message: "Email de verificação enviado com sucesso"
                    }
                },
                verifyMobile: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao enviar o código de verificação"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao enviar o código de verificação ",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "O código de verificação foi enviado com sucesso. Verifique seu celular",
                        message: "Código de verificação enviado com sucesso"
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
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}.",
                        message: "Erro ao recuperar a preferência de auto-cadastro"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao recuperar a preferência de auto-cadastro.",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Preferência de auto-cadastro recuperada com sucesso.",
                        message: "Recuperação da preferência de auto-cadastro bem-sucedida"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "Reenviar",
            selfSignUp: {
                awaitingAccountConfirmation: "Sua conta ainda não está ativa. Enviamos um " +
                    "link de ativação para o seu endereço de e-mail cadastrado. Precisa de um novo link?",
                notifications: {
                    resendError: {
                        description: "Ocorreu um erro ao reenviar o e-mail de confirmação da conta.",
                        message: "Algo deu errado"
                    },
                    resendSuccess: {
                        description: "E-mail de confirmação de conta reenviado com sucesso.",
                        message: "E-mail de confirmação de conta reenviado com sucesso"
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
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao obter a verificação na preferência de atualização"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao obter a verificação da preferência de atualização",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A verificação da preferência de atualização foi recuperada com sucesso",
                        message: "verificação na recuperação de preferência de atualização bem-sucedida"
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
            description: "Visualize suas contas de outras conexões vinculadas a esta conta",
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
