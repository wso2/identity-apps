/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { Views } from "../../models";

export const views: Views = {
    components: {
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: "Adicionar ou atualizar opções de recuperação de código"
                },
                heading: "Recuperação de código"
            },
            emailRecovery: {
                descriptions: {
                    add: "Adicionar um endereço de email de recuperação",
                    update: "Atualizar endereço de email de recuperação ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "Endereço de e-mail",
                                placeholder: "Digite o endereço de e-mail de recuperação",
                                validations: {
                                    empty: "Digite um endereço de email",
                                    invalidFormat: "O endereço de email não está no formato correto"
                                }
                            }
                        }
                    }
                },
                heading: "Recuperação de Email",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "Erro ao atualizar o email de recuperação"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar o email de recuperação",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O endereço de email no perfil do usuário foi atualizado com sucesso",
                            message: "Endereço de email atualizado com sucesso"
                        }
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "Adicionar e atualizar perguntas de desafio de recuperação de conta"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "Responda",
                                placeholder: "Digite sua resposta",
                                validations: {
                                    empty: "A resposta é um campo obrigatório"
                                }
                            },
                            question: {
                                label: "Pergunta, questão",
                                placeholder: "Selecione uma pergunta de segurança",
                                validations: {
                                    empty: "Pelo menos uma pergunta de segurança deve ser selecionada"
                                }
                            }
                        }
                    }
                },
                heading: "Questões de segurança",
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
                            message: "Perguntas de segurança foram adicionadas com sucesso"
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
        applications: {
            all: {
                heading: "Todas as aplicações"
            },
            favourite: {
                heading: "Favoritas"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar aplicativos"
                    },
                    genericError: {
                        description: "Não foi possível recuperar aplicativos",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os aplicativos foram recuperados com sucesso.",
                        message: "Recuperação de aplicativos bem-sucedida"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Atualizar lista",
                    subtitles: {
                        0: "A lista de aplicativos retornou vazia.",
                        1: "Isso pode ser devido a não ter aplicativos detectáveis.",
                        2: "Peça a um administrador para ativar a capacidade de descoberta de aplicativos."
                    },
                    title: "Sem aplicações"
                }
            },
            recent: {
                heading: "Aplicações recentes"
            },
            search: {
                forms: {
                    searchForm: {
                        inputs: {
                            filerAttribute: {
                                label: "Atributo de filtro",
                                placeholder: "ex: nome, descrição etc.",
                                validations: {
                                    empty: "O atributo de filtro é um campo obrigatório"
                                }
                            },
                            filterCondition: {
                                label: "Condição do filtro",
                                placeholder: "ex: começa com etc.",
                                validations: {
                                    empty: "A condição do filtro é um campo obrigatório"
                                }
                            },
                            filterValue: {
                                label: "Valor do filtro",
                                placeholder: "ex: facebook, folga etc.",
                                validations: {
                                    empty: "O valor do filtro é um campo obrigatório"
                                }
                            },
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
                    header: "Busca Avançada",
                },
                placeholder: "Procura por nome",
                popups: {
                    clear: "pesquisa clara",
                    dropdown: "mostrar opções"
                },
                resultsIndicator: "Mostrando resultados para \"{{query}}\""
            }
        },
        approvals: {
            notifications: {
                fetchApprovalDetails: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar os detalhes da aprovação"
                    },
                    genericError: {
                        description: "Não foi possível atualizar os detalhes da aprovação",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Recuperou com êxito os detalhes da aprovação",
                        message: "Recuperação de detalhes da aprovação bem-sucedida"
                    }
                },
                fetchPendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar aprovações pendentes"
                    },
                    genericError: {
                        description: "Não foi possível recuperar as aprovações pendentes",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Recuperações pendentes recuperadas com sucesso",
                        message: "Recuperação de aprovações pendentes bem-sucedida"
                    }
                },
                updatePendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao atualizar a aprovação"
                    },
                    genericError: {
                        description: "Não foi possível atualizar a aprovação",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Atualização aprovada com sucesso",
                        message: "Atualização bem sucedida"
                    }
                }
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "Confirme a Senha",
                            placeholder: "Digite a nova senha",
                            validations: {
                                empty: "Confirmar senha é um campo obrigatório",
                                mismatch: "A confirmação da senha não corresponde"
                            }
                        },
                        currentPassword: {
                            label: "Senha atual",
                            placeholder: "Digite a senha atual",
                            validations: {
                                empty: "A senha atual é um campo obrigatório",
                                invalid: "A senha atual é inválida"
                            }
                        },
                        newPassword: {
                            label: "Nova senha",
                            placeholder: "Digite a nova senha",
                            validations: {
                                empty: "Nova senha é um campo obrigatório"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Algo deu errado. Por favor, tente novamente",
                            message: "Alterar erro de senha"
                        },
                        invalidCurrentPassword: {
                            description: "A senha atual que você digitou parece ser inválida. Por favor, tente " +
                                "novamente",
                            message: "Alterar erro de senha"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "Alterar erro de senha"
                        },
                        submitSuccess: {
                            description: "A senha foi alterada com sucesso",
                            message: "Redefinição de senha bem-sucedida"
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "Confirmação",
                    message: "A alteração da senha resultará no encerramento da sessão atual. Você precisará fazer " +
                        "o login com a senha recém-alterada. Você deseja continuar?"
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
                        subheader: "Você precisará fornecer o consentimento para este aplicativo novamente."
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
                    message: "Esta operação não é reversível. Isso revogará permanentemente o consentimento para " +
                        "todos os atributos. Tem certeza de que deseja continuar?",
                    warning: "Observe que você será redirecionado para a página de consentimento de login"
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "Não foi possível carregar as informações no aplicativo selecionado",
                        message: "Something went wrong"
                    },
                    success: {
                        description: "Recuperado com sucesso o recibo de consentimento",
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
                        description: "Recuperada com sucesso a lista de aplicativos consentidos",
                        message: "Recuperação bem sucedida"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "Erro de revogação de consentimento"
                    },
                    genericError: {
                        description: "Não foi possível revogar o consentimento para o aplicativo",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "O consentimento foi revogado com sucesso para o aplicativo",
                        message: "O consentimento revoga o sucesso"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Algo deu errado"
                    },
                    genericError: {
                        description: "As reivindicações consentidas falharam ao atualizar para o aplicativo",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "As reivindicações consentidas foram atualizadas com sucesso para o aplicativo",
                        message: "Reivindicações consentidas atualizadas com sucesso"
                    }
                }
            }
        },
        footer: {
            copyright: "Servidor de Identidade WSO2 © {{year}}"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "Adicionar conta de usuário local"
                }
            },
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "Senha",
                            placeholder: "Digite a senha",
                            validations: {
                                empty: "Senha é um campo obrigatório"
                            }
                        },
                        username: {
                            label: "Nome de usuário",
                            placeholder: "Digite o nome de usuário",
                            validations: {
                                empty: "Nome de usuário é um campo obrigatório"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar contas de usuário vinculadas"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao adicionar a conta vinculada",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "A conta de usuário vinculada necessária adicionada com sucesso",
                        message: "Conta de usuário vinculada adicionada com sucesso"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar contas de usuário vinculadas"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao recuperar as contas de usuário vinculadas",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os detalhes do perfil do usuário necessários são recuperados com sucesso",
                        message: "Contas de usuário vinculadas recuperadas com sucesso"
                    }
                },
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao remover contas de usuário vinculadas"
                    },
                    genericError: {
                        description: "O usuário vinculado é responsável por remover o erro",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Todas as contas de usuário vinculadas foram removidas",
                        message: "Contas vinculadas removidas"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao remover a conta de usuário vinculada"
                    },
                    genericError: {
                        description: "A conta do usuário vinculado que remove o erro ocorreu",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "As contas de usuário vinculadas foram removidas",
                        message: "A conta vinculada foi removida"
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
        mfa: {
            fido: {
                description: "Autentique-se conectando uma chave FIDO",
                heading: "FIDO",
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao remover o dispositivo"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao remover o dispositivo",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O dispositivo foi removido com sucesso da lista",
                            message: "Seu dispositivo foi removido com sucesso"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao recuperar o dispositivo"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao recuperar o dispositivo",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O dispositivo foi registrado com sucesso e agora você pode usá-lo como um " +
                                "segundo fator",
                            message: "Seu dispositivo registrado com sucesso"
                        }
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "Você receberá uma mensagem de texto contendo o código de verificação"
                },
                heading: "SMS OTP",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Ocorreu um erro ao atualizar o número do celular"
                        },
                        genericError: {
                            description: "Ocorreu um erro ao atualizar o número do celular",
                            message: "Algo deu errado"
                        },
                        success: {
                            description: "O número do celular no perfil do usuário é atualizado com sucesso",
                            message: "Número de celular atualizado com sucesso"
                        }
                    }
                }
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "Gerenciar a atividade da conta"
                    },
                    description: "No momento, você está conectado no seguinte dispositivo",
                    header: "Atividade da conta"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "Atualizar segurança da conta"
                    },
                    description: "Configurações e recomendações para ajudar você a manter sua conta segura",
                    header: "Segurança da conta"
                },
                accountStatus: {
                    complete: "Seu perfil está completo",
                    completedFields: "Campos preenchidos",
                    completionPercentage: "A conclusão do seu perfil está em {{percentage}}%",
                    inComplete: "Complete seu perfil",
                    inCompleteFields: "Campos incompletos",
                    mandatoryFieldsCompletion: "{{completed}} de {{total}} campos obrigatórios preenchidos",
                    optionalFieldsCompletion: "{{completed}} de {{total}} campos opcionais preenchidos"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "Gerenciar consentimentos"
                    },
                    description: "Controle os dados que você deseja compartilhar com os aplicativos",
                    header: "Controle de consentimento"
                }
            }
        },
        privacy: {
            about: {
                description: "O WSO2 Identity Server (referido como \"WSO2 IS\" nesta política) é um servidor de " +
                    "gerenciamento e titularidade de identidades de código aberto baseado em padrões e " +
                    "especificações abertos.",
                heading: "Sobre o servidor de identidade WSO2"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "O WSO2 IS usa seu endereço IP para detectar tentativas suspeitas de login na sua " +
                                "conta.",
                            1: "O WSO2 IS usa atributos como seu nome, sobrenome, etc., para fornecer uma " +
                                "experiência rica e personalizada ao usuário.",
                            2: "O WSO2 IS usa suas perguntas e respostas de segurança apenas para permitir a " +
                                "recuperação da conta."
                        },
                        para1: "O WSO2 IS coleta suas informações apenas para atender aos seus requisitos de " +
                            "acesso. Por exemplo:"
                    },
                    heading: "Coleta de informações pessoais",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Coletando informações da página de perfil do usuário em que você insere seus " +
                                    "dados pessoais.",
                                1: "Rastreando seu endereço IP com solicitação HTTP, cabeçalhos HTTP e TCP / IP.",
                                2: "Rastreando suas informações geográficas com o endereço IP.",
                                3: "Rastreando seu histórico de login com cookies do navegador. Por favor, consulte " +
                                    "nosso {{cookiePolicyLink}} para obter mais informações."
                            },
                            para1: "O WSO2 IS coleta suas informações por:"
                        },
                        heading: "Tecnologias de rastreamento"
                    }
                },
                description: {
                    para1: "Esta política descreve como o WSO2 IS captura suas informações pessoais, os propósitos " +
                        "de coleta e informações sobre a retenção de suas informações pessoais.",
                    para2: "Observe que esta política é apenas para referência e é aplicável ao software como um " +
                        "roduto. A WSO2 Inc. e seus desenvolvedores não têm acesso às informações mantidas no " +
                        "WSO2 IS. Consulte a seção <1> isenção de responsabilidade </1> para obter mais informações.",
                    para3: "Entidades, organizações ou indivíduos que controlam o uso e a administração do WSO2 IS " +
                        "devem criar suas próprias políticas de privacidade, definindo a maneira pela qual os dados " +
                        "são controlados ou processados ​​pela respectiva entidade, organização ou indivíduo."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "O WSO2, seus funcionários, parceiros e afiliados não têm acesso e não exigem, " +
                                "armazenam, processam ou controlam nenhum dos dados, incluindo dados pessoais " +
                                "contidos no WSO2 IS. Todos os dados, incluindo dados pessoais, são controlados " +
                                "e processados ​​pela entidade ou indivíduo que executa o WSO2 IS. O WSO2, seus " +
                                "funcionários parceiros e afiliados não são um processador de dados ou um " +
                                "controlador de dados, de acordo com os regulamentos de privacidade de dados. " +
                                "O WSO2 não fornece nenhuma garantia ou assume qualquer responsabilidade ou " +
                                "obrigação relacionada à legalidade ou à maneira e aos propósitos pelos quais " +
                                "o WSO2 IS é usado por essas entidades ou pessoas.",
                            1: "Esta política de privacidade é para fins informativos da entidade ou pessoas que " +
                                "executam o WSO2 IS e define os processos e a funcionalidade contidos no WSO2 IS em " +
                                "relação à proteção de dados pessoais. É de responsabilidade das entidades e " +
                                "pessoas que executam o WSO2 IS criar e administrar suas próprias regras e " +
                                "processos que regem os dados pessoais dos usuários, e essas regras e processos " +
                                "podem alterar as políticas de uso, armazenamento e divulgação aqui contidas. " +
                                "Portanto, os usuários devem consultar a entidade ou pessoas que executam o " +
                                "WSO2 IS para obter sua própria política de privacidade para obter detalhes sobre " +
                                "os dados pessoais dos usuários."
                        }
                    },
                    heading: "aviso Legal"
                },
                disclosureOfPersonalInfo: {
                    description: "O WSO2 IS apenas divulga informações pessoais para os aplicativos relevantes " +
                        "(também conhecidos como Provedor de Serviços) registrados no WSO2 IS. Esses aplicativos " +
                        "são registrados pelo administrador de identidade de sua entidade ou organização. As " +
                        "informações pessoais são divulgadas apenas para os fins para os quais foram coletadas " +
                        "(ou para um uso identificado como consistente com essa finalidade), conforme controlado " +
                        "por esses Provedores de Serviços, a menos que você tenha consentido de outra forma ou " +
                        "onde seja exigido por lei.",
                    heading: "Divulgação de informações pessoais",
                    legalProcess: {
                        description: "Observe que a organização, entidade ou indivíduo que executa o WSO2 IS " +
                            "pode ser obrigado a divulgar suas informações pessoais com ou sem o seu consentimento, " +
                            "quando exigidas por lei, após o devido e legal processo.",
                        heading: "processo juridico"
                    }
                },
                heading: "Política de Privacidade",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "As versões atualizadas do WSO2 IS podem conter alterações nesta política e " +
                                "as revisões dessa política serão incluídas nessas atualizações. Tais alterações " +
                                "se aplicariam apenas aos usuários que optarem por usar versões atualizadas.",
                            para2: "A organização que executa o WSO2 IS pode revisar a Política de Privacidade de " +
                                "tempos em tempos. Você pode encontrar a política de governo mais recente com o " +
                                "respectivo link fornecido pela organização que executa o WSO2 IS 5.5. " +
                                "A organização notificará quaisquer alterações na política de privacidade " +
                                "nos nossos canais públicos oficiais."
                        },
                        heading: "Alterações nesta política"
                    },
                    contactUs: {
                        description: {
                            para1: "Entre em contato com o WSO2 se tiver alguma dúvida ou preocupação em relação " +
                                "a esta política de privacidade."
                        },
                        heading: "Contate-Nos"
                    },
                    heading: "Mais Informações",
                    yourChoices: {
                        description: {
                            para1: "Se você já possui uma conta de usuário no WSO2 IS, tem o direito de desativar " +
                                "sua conta se achar que esta política de privacidade é inaceitável para você.",
                            para2: "Se você não possui uma conta e não concorda com nossa política de privacidade, " +
                                "pode optar por não criar uma."
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
                            para1: "O WSO2 IS retém seus dados pessoais, desde que você seja um usuário ativo do " +
                                "nosso sistema. Você pode atualizar seus dados pessoais a qualquer momento usando " +
                                "os portais de usuário de autocuidado fornecidos.",
                            para2: "O WSO2 IS pode manter segredos de hash para fornecer um nível adicional de " +
                                "segurança. Isso inclui:"
                        },
                        heading: "Por quanto tempo suas informações pessoais são retidas"
                    },
                    requestRemoval: {
                        description: {
                            para1: "Você pode solicitar que o administrador exclua sua conta. O administrador é " +
                                "o administrador do inquilino no qual você está registrado ou o superadministrador " +
                                "se você não usar o recurso de inquilino.",
                            para2: "Além disso, você pode solicitar para anonimizar todos os vestígios de suas " +
                                "atividades que o WSO2 IS possa ter retido em logs, bancos de dados ou " +
                                "armazenamento analítico."
                        },
                        heading: "Como solicitar a remoção de suas informações pessoais"
                    },
                    where: {
                        description: {
                            para1: "O WSO2 IS armazena suas informações pessoais em bancos de dados protegidos. " +
                                "O WSO2 IS exerce medidas adequadas de segurança aceitas pelo setor para proteger " +
                                "o banco de dados em que suas informações pessoais são mantidas. O WSO2 IS como " +
                                "produto não transfere ou compartilha seus dados com terceiros ou locais.",
                            para2: "O WSO2 IS pode usar criptografia para manter seus dados pessoais com um nível " +
                                "adicional de segurança."
                        },
                        heading: "Onde suas informações pessoais são armazenadas"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "Para fornecer uma experiência personalizada ao usuário. O WSO2 IS usa seu nome e " +
                                "as imagens de perfil carregadas para esse fim.",
                            1: "Para proteger sua conta contra acesso não autorizado ou possíveis tentativas de " +
                                "hackers. O WSO2 IS usa cabeçalhos HTTP ou TCP / IP para esse fim.",
                            2: "Derivar dados estatísticos para fins analíticos nas melhorias de desempenho do " +
                                "sistema. O WSO2 IS não manterá nenhuma informação pessoal após cálculos " +
                                "estatísticos. Portanto, o relatório estatístico não tem como identificar " +
                                "uma pessoa individualmente."
                        },
                        para1: "O WSO2 IS usará suas informações pessoais apenas para os fins para os quais " +
                            "foram coletadas (ou para um uso identificado como consistente com esse objetivo).",
                        para2: "O WSO2 IS usa suas informações pessoais apenas para os seguintes fins.",
                        subList1: {
                            heading: "Isso inclui:",
                            list: {
                                0: "endereço de IP",
                                1: "Impressão digital do navegador",
                                2: "Biscoitos"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS pode usar:",
                            list: {
                                0: "Endereço IP para obter informações geográficas",
                                1: "Impressão digital do navegador para determinar a tecnologia ou / e a versão " +
                                    "do navegador"
                            }
                        }
                    },
                    heading: "Uso de informações pessoais"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "Seu nome de usuário (exceto nos casos em que o nome de usuário criado por seu " +
                                "empregador esteja sob contrato)",
                            1: "Sua data de nascimento / idade",
                            2: "Endereço IP usado para efetuar login",
                            3: "O ID do seu dispositivo se você usar um dispositivo (por exemplo, telefone ou " +
                                "tablet) para fazer login"
                        },
                        list2: {
                            0: "Cidade / país de onde você originou a conexão TCP / IP",
                            1: "Hora do dia em que você efetuou login (ano, mês, semana, hora ou minuto)",
                            2: "Tipo de dispositivo que você usou para fazer login (por exemplo, telefone ou tablet)",
                            3: "Sistema operacional e informações genéricas do navegador"
                        },
                        para1: "O WSO2 IS considera qualquer coisa relacionada a você e pela qual você pode ser " +
                            "identificado como suas informações pessoais. Isso inclui, mas não se limita a:",
                        para2: "No entanto, o WSO2 IS também coleta as seguintes informações que não são " +
                            "consideradas informações pessoais, mas são usadas apenas para fins " +
                            "<1> estatísticos </1>. A razão para isso é que essas informações não podem ser usadas " +
                            "para rastrear você."
                    },
                    heading: "O que são informações pessoais?"
                }
            }
        },
        profile: {
            fields: {
                addresses_home: "Endereço residencial",
                addresses_work: "Endereço de trabalho",
                emails: "O email",
                emails_home: "E-mail residencial",
                emails_other: "Outro email",
                emails_work: "Email de trabalho",
                generic: {
                    default: "Adicionar {{fieldName}}"
                },
                name_familyName: "Último nome",
                name_givenName: "Primeiro nome",
                phoneNumbers: "Número de telefone",
                phoneNumbers_home: "Número de telefone residencial",
                phoneNumbers_mobile: "Número de celular",
                phoneNumbers_other: "Outro número de telefone",
                phoneNumbers_work: "Número de telefone comercial",
                profileUrl: "URL",
                userName: "Nome de usuário"
            },
            forms: {
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "O email",
                            note: "NOTA: Isso mudará o endereço de email no seu perfil",
                            placeholder: "Insira o seu endereço de email",
                            validations: {
                                empty: "O endereço de email é um campo obrigatório",
                                invalidFormat: "O endereço de email não está no formato correto",
                            }
                        }
                    }
                },
                generic: {
                    inputs: {
                        placeholder: "Insira o seu {{fieldName}}",
                        validations: {
                            empty: "{{fieldName}} é um campo obrigatório",
                            invalidFormat: "The {{fieldName}} não está no formato correto"
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "Número de celular",
                            note: "NOTA: Isso mudará o número do celular em seu perfil",
                            placeholder: "Digite seu número de celular",
                            validations: {
                                empty: "O número do celular é um campo obrigatório",
                                invalidFormat: "O número do celular não está no formato correto"
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "Primeiro nome",
                            placeholder: "Digite o primeiro nome",
                            validations: {
                                empty: "O primeiro nome é um campo obrigatório"
                            }
                        },
                        lastName: {
                            label: "Último nome",
                            placeholder: "Digite o sobrenome",
                            validations: {
                                empty: "O sobrenome é um campo obrigatório"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "Organização",
                            placeholder: "Entre na sua organização",
                            validations: {
                                empty: "Organização é um campo obrigatório"
                            }
                        }
                    }
                }
            },
            notifications: {
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao recuperar os detalhes do perfil",
                    },
                    genericError: {
                        description: "Ocorreu um erro ao recuperar os detalhes do perfil",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os detalhes do perfil do usuário necessários são recuperados com sucesso",
                        message: "Perfil de usuário recuperado com sucesso"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Ocorreu um erro ao atualizar os detalhes do perfil",
                    },
                    genericError: {
                        description: "Ocorreu um erro ao atualizar os detalhes do perfil",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Os detalhes do perfil de usuário necessários foram atualizados com sucesso",
                        message: "Perfil de usuário atualizado com sucesso"
                    }
                }
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "Este recurso não está disponível para sua conta."
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
                        description: "Os detalhes do perfil de usuário necessários foram baixados com sucesso",
                        message: "Detalhes do perfil do usuário baixados com sucesso"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "Esta imagem foi recuperada do serviço <1>Gravatar</1>."
        },
        userSessions: {
            browserAndOS: "{{browser}} no {{os}} {{version}}",
            dangerZones: {
                terminate: {
                    actionTitle: "Terminar",
                    header: "Encerrar sessão",
                    subheader: "Você será desconectado da sessão no dispositivo específico."
                }
            },
            lastAccessed: "Último acesso {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "Confirmação",
                    message: "Esta ação fará o logout de todas as sessões em todos os dispositivos. Você deseja " +
                        "continuar?"
                },
                terminateUserSessionModal: {
                    heading: "Confirmação",
                    message: "Esta ação fará com que você saia da sessão no dispositivo específico. Você deseja " +
                        "continuar?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Erro ao recuperar a sessão do usuário"
                    },
                    genericError: {
                        description: "Não foi possível recuperar nenhuma sessão do usuário",
                        message: "Algo deu errado"
                    },
                    success: {
                        description: "Recuperadas com sucesso as sessões do usuário",
                        message: "Recuperação de sessão do usuário bem-sucedida"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Não foi possível encerrar as sessões do usuário"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao encerrar as sessões do usuário",
                        message: "Não foi possível encerrar as sessões do usuário"
                    },
                    success: {
                        description: "Terminou com êxito todas as sessões do usuário",
                        message: "Terminou todas as sessões do usuário"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "Não foi possível encerrar a sessão do usuário"
                    },
                    genericError: {
                        description: "Ocorreu um erro ao encerrar a sessão do usuário",
                        message: "Não foi possível encerrar a sessão do usuário"
                    },
                    success: {
                        description: "Encerrada com êxito a sessão do usuário",
                        message: "Sessão finalizada com sucesso"
                    }
                }
            }
        },
    },
    pages: {
        applications: {
            subTitle: "Manage and maintain your applications",
            title: "Applications"
        },
        operations: {
            subTitle: "Gerenciar e manter tarefas como aprovações pendentes etc.",
            title: "Operações"
        },
        overview: {
            subTitle: "Gerencie suas informações, segurança, privacidade e todas as configurações relacionadas",
            title: "Bem-vindo, {{firstName}}"
        },
        personalInfo: {
            subTitle: "Gerencie informações sobre você, seus sub-perfis e sua conta em geral",
            title: "Informação pessoal"
        },
        privacy: {
            subTitle: "",
            title: "Política de Privacidade do Servidor de Identidade WSO2"
        },
        security: {
            subTitle: "Atualize as configurações para tornar sua conta segura",
            title: "Segurança"
        }
    },
    placeholders: {
        404: {
            action: "Voltar para casa",
            subtitles: {
                0: "Não foi possível encontrar a página que você estava procurando.",
                1: "Por favor, verifique o URL ou clique no botão abaixo para ser redirecionado de volta à página inicial."
            },
            title: "página não encontrada"
        },
        emptySearchResult: {
            action: "Limpar consulta de pesquisa",
            subtitles: {
                0: "Não conseguimos encontrar resultados para \"{{query}}\"",
                1: "Tente um termo de pesquisa diferente."
            },
            title: "Nenhum resultado encontrado"
        },
        genericError: {
            action: "Recarregue a página",
            subtitles: {
                0: "Ocorreu um erro ao exibir esta página.",
                1: "Consulte o console do navegador para obter detalhes técnicos."
            },
            title: "Algo deu errado"
        },
        loginError: {
            action: "Continuar logout",
            subtitles: {
                0: "Parece que você não tem permissão para usar este portal.",
                1: "Faça login com uma conta diferente."
            },
            title: "Você não está autorizado"
        }
    },
    sections: {
        accountRecovery: {
            description: "Ver e gerenciar suas opções de recuperação de conta",
            heading: "Recuperação de conta"
        },
        approvals: {
            description: "Você pode gerenciar aprovações pendentes aqui",
            heading: "Aprovações pendentes",
            placeholders: {
                emptyApprovalList: {
                    heading: "Você não tem {{status}} aprovações pendentes"
                }
            }
        },
        changePassword: {
            actionTitles: {
                change: "Mude sua senha"
            },
            description: "Alterar e modificar a senha existente",
            heading: "Mudar senha"
        },
        consentManagement: {
            actionTitles: {
                empty: "Você não concedeu consentimento a nenhum aplicativo"
            },
            description: "Ver e gerenciar aplicativos consentidos da sua conta",
            heading: "Aplicações consentidas",
            placeholders: {
                emptyConsentList: {
                    heading: "Você não concedeu consentimento a nenhum aplicativo"
                }
            },
        },
        linkedAccounts: {
            actionTitles: {
                add: "Adicionar Conta"
            },
            description: "Gerencie todas as suas contas vinculadas em um só lugar",
            heading: "Contas ligadas"
        },
        mfa: {
            description: "Ver e gerenciar suas opções de autenticação multifator",
            heading: "Autenticação multifatorial"
        },
        profile: {
            description: "Gerencie e atualize suas informações básicas de perfil",
            heading: "Perfil"
        },
        profileExport: {
            actionTitles: {
                export: "Exportar dados do perfil"
            },
            description: "Faça o download de todos os dados do seu perfil, incluindo dados pessoais, perguntas de " +
                "segurança e consentimentos",
            heading: "Exportar perfil"
        },
        userSessions: {
            actionTitles: {
                empty: "Nenhuma sessão ativa",
                terminateAll: "Terminar todas as sessões"
            },
            description: "Esta é uma lista dos dispositivos que estão ativos em sua conta",
            heading: "Sessões de usuário ativas",
            placeholders: {
                emptySessionList: {
                    heading: "Não há sessões ativas para este usuário"
                }
            },
        }
    }
};
