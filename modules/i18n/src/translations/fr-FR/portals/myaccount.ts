/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
                    add: "Ajouter ou mettre à jour les options pour les codes de récupération."
                },
                heading: "Codes de récupération"
            },
            emailRecovery: {
                descriptions: {
                    add: "Ajouter ou mettre à jour l'e-mail de récupération",
                    update: "Mettre à jour de l'e-mail de récupération ({{email}}}",
                    view: "Afficher l'adresse e-mail de récupération ({{email}}}"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "Adresse e-mail",
                                placeholder: "Entrez l'e-mail de récupération",
                                validations: {
                                    empty: "Entrez une adresse e-mail",
                                    invalidFormat: "Format d'adresse e-mail invalide"
                                }
                            }
                        }
                    }
                },
                heading: "E-mail de récupération",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la  mise à jour de l'e-mail de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de l'e-mail de récupération",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'adresse e-mail dans le profil de l'utilisateur a été mise à jour " +
                                "avec succès",
                            message: "Adresse e-mail mise à jour avec succès"
                        }
                    }
                }
            },
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de l'obtention de la préférence de récupération"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de l'obtention de la préférence de récupération",
                        message: "Un problème est survenu"
                    },
                    success: {
                        description: "Récupération réussie de la préférence de récupération",
                        message: "Récupération des préférences de récupération réussie"
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "Ajouter ou mettre à jour les questions de sécurité"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "Réponse",
                                placeholder: "Entrez votre réponse",
                                validations: {
                                    empty: "La réponse est obligatoire"
                                }
                            },
                            question: {
                                label: "Question",
                                placeholder: "Sélectionnez une question de sécurité",
                                validations: {
                                    empty: "Au moins une question de sécurité doit être sélectionnée"
                                }
                            }
                        }
                    }
                },
                heading: "Questions de sécurité",
                notifications: {
                    addQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de l'ajout des questions de sécurité"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'ajout des questions de sécurité",
                            message: "Quelque chose s'est mal passé."
                        },
                        success: {
                            description: "Les questions de sécurité ont été ajoutées avec succès",
                            message: "Les questions de sécurité ont été ajoutées avec succès"
                        }
                    },
                    updateQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la mise à jour des questions de sécurité"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des questions de sécurité",
                            message: "Quelque chose s'est mal passé."
                        },
                        success: {
                            description: "Les questions de sécurité ont été mises à jour avec succès",
                            message: "Les questions de sécurité ont été mises à jour avec succès"
                        }
                    }
                }
            }
        },
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Attribut à filtrer",
                        placeholder: "Ex. Nom, Description, etc.",
                        validations: {
                            empty: "L'attribut est obligatoire."
                        }
                    },
                    filterCondition: {
                        label: "Condition",
                        placeholder: "Ex. Commence par, etc.",
                        validations: {
                            empty: "La condition de filtrage est obligatoire."
                        }
                    },
                    filterValue: {
                        label: "Valeur à rechercher",
                        placeholder: "Ex. admin, wso2, etc.",
                        validations: {
                            empty: "La valeur est obligatoire."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Maj + Entrée",
                    label: "Chercher en tant que requête"
                }
            },
            options: {
                header: "Recherche avancée"
            },
            placeholder: "Recherche par {{attribute}}",
            popups: {
                clear: "Effacer la recherche",
                dropdown: "Afficher les options"
            },
            resultsIndicator: "Affichage des résultats pour la requête \"{{query}}\""
        },
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "Ex. Nom, Description, etc."
                        },
                        filterCondition: {
                            placeholder: "Ex. Commence par, etc."
                        },
                        filterValue: {
                            placeholder: "Entrez la valeur à rechercher"
                        }
                    }
                },
                placeholder: "Recherche par application"
            },
            all: {
                heading: "Toutes les applications"
            },
            favourite: {
                heading: "Favoris"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la récupération des applications"
                    },
                    genericError: {
                        description: "Impossible de récupérer les applications",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Récupération des applications effectuée avec succès",
                        message: "Récupération des applications réussie"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "Rafraîchir la liste",
                    subtitles: {
                        0: "La liste des applications est vide",
                        1: "Il n'y a peut-être pas d'applications visibles.",
                        2: "Veuillez demander à un administrateur d'activer la découverte des applications."
                    },
                    title: "Pas d'applications"
                }
            },
            recent: {
                heading: "Applications récentes"
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "Confirmation du nouveau mot de passe",
                            placeholder: "Confirmez le nouveau mot de passe",
                            validations: {
                                empty: "Veuillez confirmer votre nouveau mot de passe",
                                mismatch: "Les nouveaux mots de passes saisis ne correspondent pas"
                            }
                        },
                        currentPassword: {
                            label: "Mot de passe actuel",
                            placeholder: "Entrez le mot de passe actuel",
                            validations: {
                                empty: "Veuillez saisir votre mot de passe actuel",
                                invalid: "Le mot de passe actuel que vous avez saisi est invalide."
                            }
                        },
                        newPassword: {
                            label: "Nouveau mot de passe",
                            placeholder: "Entrez le nouveau mot de passe",
                            validations: {
                                empty: "Veuillez saisir votre nouveau mot de passe"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "Quelque chose s'est mal passé. Veuillez réessayer",
                            message: "Erreur lors de la modification du mot de passe"
                        },
                        invalidCurrentPassword: {
                            description: "Le mot de passe actuel que vous avez saisi semble être invalide. " +
                                "Veuillez réessayer",
                            message: "Erreur lors de la modification du mot de passe"
                        },
                        passwordCaseRequirement: "Au moins une lettre majuscule et minuscule",
                        passwordCharRequirement: "Au moins un des symboles !@#$%^&*",
                        passwordLengthRequirement: "Plus de 8 caractères",
                        passwordNumRequirement: "Au moins un numéro",
                        submitError: {
                            description: "{{description}}",
                            message: "Erreur lors de la modification du mot de passe"
                        },
                        submitSuccess: {
                            description: "Le mot de passe a été modifié avec succès",
                            message: "Réinitialisation du mot de passe réussie"
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "Confirmation",
                    message:
                        "La modification du mot de passe entraînera la fin de la session en cours. Vous devrez " +
                        "vous reconnecter avec votre nouveau mot de passe. Voulez-vous continuer ?"
                }
            }
        },
        consentManagement: {
            editConsent: {
                collectionMethod: "Méthode de recueil",
                dangerZones: {
                    revoke: {
                        actionTitle: "Révoquer",
                        header: "Révoquer le consentement",
                        subheader: "Vous devrez à nouveau donner votre consentement pour accéder à nouveau à " +
                            "cette application."
                    }
                },
                description: "Description",
                piiCategoryHeading:
                    "Gérez le consentement pour la collecte et le partage de vos informations personnelles " +
                    "avec l'application. Décochez les attributs que vous souhaitez révoquer puis validez en " +
                    "cliquant sur le bouton de Mettre à jour pour enregistrer les modifications ou cliquez " +
                    "sur le bouton de Révoquer pour supprimer le consentement pour tous les attributs.",
                state: "État",
                version: "Version"
            },
            modals: {
                consentRevokeModal: {
                    heading: "Etes-vous sûr ?",
                    message:
                        "Cette opération est irréversible. Cela révoquera définitivement le consentement pour " +
                        "tous les attributs. Êtes-vous sûr de vouloir continuer ?",
                    warning: "Veuillez noter que vous serez redirigé vers la page de recueil de consentement"
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Quelque chose s'est mal passé"
                    },
                    genericError: {
                        description: "Impossible de charger des informations sur l'application sélectionnée",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Preuve de consentement récupéré avec succès",
                        message: "Récupération réussie"
                    }
                },
                consentedAppsFetch: {
                    error: {
                        description: "{{description}}",
                        message: "Quelque chose s'est mal passé"
                    },
                    genericError: {
                        description: "Impossible de charger la liste des applications autorisées",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Liste des applications autorisées récupérée avec succès",
                        message: "Récupération réussie"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la révocation de consentements"
                    },
                    genericError: {
                        description: "Erreur lors de la révocation de consentements accordés à l'application",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Le consentement accordé à l'application a été révoqué avec succès",
                        message: "Consentement révoqué avec succès"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "Quelque chose s'est mal passé"
                    },
                    genericError: {
                        description: "Les attributs partagés avec l'application n'ont pas été mis à jour",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Les attributs partagés avec l'application ont été mis à jour avec succès",
                        message: "Mise à jour des attributs partagés réussie"
                    }
                }
            }
        },
        cookieConsent: {
            confirmButton: "J'ai compris",
            content: "Nous utilisons des cookies pour vous garantir la meilleure expérience globale. Ces cookies " +
                "sont utilisés pour maintenir une session continue ininterrompue tout en offrant des services " +
                "fluides et personnalisés. Pour En savoir plus sur la façon dont nous utilisons les cookies, " +
                "reportez-vous à notre <1>Politique relative aux cookies</1>."
        },
        federatedAssociations: {
            deleteConfirmation: "Ceci supprimera l'accès à votre compte par le service d'authentification tiers. " +
                "Confirmez-vous la suppression ?",
            notifications: {
                getFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Quelque chose s'est mal passé"
                    },
                    genericError: {
                        description: "Impossible de récupérer les services d'authentifications tiers ayant " +
                            "accès à votre compte",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Les services d'auhtentifications tiers ayant accès à votre compte ont été " +
                            "récupérées avec succès",
                        message: "Services d'authentifications tiers récupérés avec succès"
                    }
                },
                removeAllFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Quelque chose s'est mal passé"
                    },
                    genericError: {
                        description: "Impossible de supprimer tous les services d'authentifications tiers ayant " +
                            "accès à votre",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Accès supprimé avec succès pour tous les services d'authentifications tiers " +
                            "ayant eu accès à votre compte.",
                        message: "Accès supprimés avec succès"
                    }
                },
                removeFederatedAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Quelque chose s'est mal passé"
                    },
                    genericError: {
                        description: "L'accès a votre compte par le service d'authentification tiers n'a pu " +
                            "être supprimé",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "L'accès à votre compte par le service d'authentification tiers a été supprimé " +
                            "avec succès",
                        message: "Accès supprimé avec succès"
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
                    description: "Gérer en tant que développeurs ou administrateurs",
                    name: "Console"
                },
                myAccount: {
                    description: "Gérez votre propre compte",
                    name: "My Account"
                },
                tooltip: "Apps"
            },
            organizationLabel: "Ce compte est géré par"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "Associer un compte utilisateur"
                }
            },
            deleteConfirmation: "Ceci supprimera l'association avec votre compte. Confirmez-vous" +
                "la suppression ?",
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "Mot de passe",
                            placeholder: "Saisissez le mot de passe",
                            validations: {
                                empty: "Le mot de passe est obligatoire"
                            }
                        },
                        username: {
                            label: "Nom d'utilisateur",
                            placeholder: "Saisissez le nom d'utilisateur",
                            validations: {
                                empty: "Le nom d'utilisateur est obligatoire"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la récupération des comptes associés"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de l'association au compte",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "L'association au compte a été ajoutée avec succès",
                        message: "Compte associé avec succès"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la récupération des comptes associés"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la récupération des comptes associés",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Les informations requises sur le profil de l'utilisateur ont été récupérés " +
                            "avec succès",
                        message: "Détails des comptes associés récupérés avec succès"
                    }
                },
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la suppression des comptes associés"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la suppression des comptes associés",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Tous les comptes associés ont été supprimés",
                        message: "Comptes associés supprimés avec succès"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la suppression du compte associé"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la suppression du compte associé",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Le compte associé a été supprimé",
                        message: "Compte associé supprimé avec succès"
                    }
                },
                switchAccount: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite lors du changement de compte"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors du changement de compte",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Le changement de compte a été réalisé avec succès",
                        message: "Changement de compte réalisé avec succès"
                    }
                }
            }
        },
        loginVerifyData: {
            description: "Ces données sont utilisées pour vérifier davantage votre identité lors de la connexion",
            heading: "Données utilisées pour vérifier votre connexion",
            modals: {
                clearTypingPatternsModal: {
                    heading: "Bestätigung",
                    message: "Cette action effacera vos modèles de frappe enregistrés dans TypingDNA. " +
                        "Souhaitez-vous continuer?"
                }
            },
            notifications: {
                clearTypingPatterns: {
                    error: {
                        description: "Les modèles de saisie n'ont pas pu être effacés. Veuillez contacter " +
                            "l'administrateur de votre site",
                        message: "Échec de la suppression des modèles de saisie"
                    },
                    success: {
                        description: "Vos modèles de frappe dans TypingDNA ont été effacés avec succès",
                        message: "Modèles de frappe supprimés avec succès"
                    }
                }
            },
            typingdna: {
                description: "Vos modèles de frappe peuvent être effacés à partir d'ici",
                heading: "TypingDNA modèles de frappe"
            }
        },
        mfa: {
            authenticatorApp: {
                addHint: "Configurer",
                configuredDescription: "Vous pouvez utiliser les codes TOTP de votre " +
                    "application d'authentification configurée pour une authentification à " +
                    "deux facteurs. Si vous n'avez pas accès à l'application, vous pouvez configurer " +
                    "une nouvelle application d'authentification à partir d'ici",
                deleteHint: "Retirer",
                description: "Scannez le code QR à l'aide d'une application " +
                    "d'authentification pour utiliser des codes d'accès " +
                    "à usage unique basés sur le temps (également appelés TOTP) " +
                    "comme deuxième facteur lors de la connexion aux applications.",
                enableHint: "Activer/désactiver l'authentificateur TOTP",
                heading: "Application d'authentification",
                hint: "Voir",
                modals: {
                    delete : {
                        heading: "Confirmation",
                        message: "Cette action supprimera le code QR ajouté à votre profil. " +
                            "Souhaitez-vous continuer ? "
                    },
                    done: "Réussi ! Vous pouvez maintenant utiliser votre application d'authentification pour une " +
                        "authentification en deux étapes",
                    heading: "Configurer une application d'authentification",
                    scan: {
                        additionNote: "Le code QR a été ajouté avec succès à votre profil",
                        authenticatorApps: "Applications d'authentification",
                        generate: "Générer un nouveau code",
                        heading: "Scannez ce code QR à l'aide d'une application d'authentification",
                        messageBody: "Vous pouvez utiliser une application d'authentification compatible dans " +
                            "cette liste :",
                        messageHeading: "Vous n'avez pas d'application d'authentification ?",
                        regenerateWarning: "Lorsque vous régénérez un nouveau code QR, vous devez le scanner et " + 
                            "reconfigurer votre application d'authentification. Votre configuration précédente " + 
                            "ne fonctionnera plus."
                    },
                    toolTip: "Vous n'avez pas d'application? Téléchargez une application d'authentification " +
                        "telle que Google Authenticator depuis <3> App Store </3> ou <3> Google Play </3>",
                    verify: {
                        error: "La vérification a échoué. Veuillez réessayer.",
                        heading: "Entrez le code généré pour vérification",
                        label: "Code de vérification",
                        placeholder: "Entrez votre code de vérification",
                        reScan: "Re-scanner",
                        reScanQuestion: "Voulez-vous scanner le code QR à nouveau ?",
                        requiredError: "Veuillez entrer votre code de vérification"
                    }
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression de la " +
                                "configuration de l'authentificateur TOTP",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "Suppression réussie",
                        message: "La configuration TOTP a bien été supprimée."
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du code QR",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération d'un nouveau code QR",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la tentative de mise " + 
                                "à jour de la liste des authentificateurs activés",
                            message: "Quelque chose s'est mal passé"
                        }
                    }
                },
                regenerate: "Régénérer"
            },
            backupCode: {
                description: "Vous pouvez utiliser des codes de secours pour vous connecter si vous " 
                    + "ne pouvez pas recevoir de code de vérification via l'application d'authentification.",
                download: {
                    heading: "ENREGISTREZ VOS CODES DE SECOURS.",
                    info1: "Vous ne pouvez utiliser chaque code de secours qu'une seule fois.",
                    info2: "Ces codes ont été générés sur ",
                    subHeading: "Vous pouvez utiliser ces codes de secours pour vous connecter à " + 
                        "Asgardeo lorsque vous êtes loin de votre téléphone. Conservez ces codes " + 
                        "de sauvegarde dans un endroit sûr mais accessible."
                },
                heading: "Codes de sauvegarde",
                modals: {
                    actions: {
                        copied: "copié",
                        copy: "Copier les codes",
                        download: "Codes de téléchargement",
                        regenerate: "Régénérer"
                    },
                    description: "Utilisez les codes de secours pour vous connecter lorsque vous êtes " + 
                        "loin de votre téléphone. Vous pouvez en générer plus lorsqu'ils sont tous utilisés",
                    generate: {
                        description: "Tous vos codes de secours sont utilisés. " + 
                            "Permet de générer un nouvel ensemble de codes de secours",
                        heading: "Générer"  
                    },
                    heading: "Codes de sauvegarde",
                    info: "Chaque code ne peut être utilisé qu'une seule fois",
                    regenerate: {
                        description: "Après avoir généré de nouveaux codes, vos anciens codes ne fonctionneront plus. " 
                            + "Assurez-vous de sauvegarder les nouveaux codes une fois qu'ils sont générés.",
                        heading: "Confirmation"
                    },
                    subHeading: "Codes d'accès à usage unique que vous pouvez utiliser pour vous connecter",
                    warn: "Ces codes n'apparaîtront qu'une seule fois. Assurez-vous de les enregistrer " 
                        + "maintenant et de les stocker dans un endroit sûr mais accessible."
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression des codes de secours",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    downloadError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la tentative de " + 
                                "téléchargement des codes de secours",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    downloadSuccess: {
                        genericMessage: {
                            description: "Les codes de sauvegarde sont téléchargés avec succès.",
                            message: "Les codes de sauvegarde ont été téléchargés avec succès."
                        },
                        message: {
                            description: "{{message}}",
                            message: "Les codes de sauvegarde ont été téléchargés avec succès."
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la tentative de " + 
                                "génération de nouveaux codes de secours",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    retrieveAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la tentative d'obtention " + 
                                "de la liste des authentificateurs activés",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    retrieveError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des codes de secours",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la tentative de mise " + 
                                "à jour de la liste des authentificateurs activés",
                            message: "Quelque chose s'est mal passé"
                        }
                    }
                }
            },
            fido: {
                description: "Vous pouvez utiliser une clé de sécurité FIDO2 ou des données biométriques" +
                    " dans votre appareil pour vous connecter à votre compte.",
                form: {
                    label: "Clé de sécurité/Biométrie",
                    placeholder: "Entrez un nom pour la clé de sécurité/biométrique",
                    remove: "Retirer la clé de sécurité/biométrique",
                    required: "Veuillez entrer un nom pour votre clé de sécurité/biométrique"
                },
                heading: "Clé de sécurité/Biométrie",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Cette action est irréversible et supprimera définitivement " +
                            "la clé de sécurité/biométrique.",
                        description: "Si vous supprimez cette clé de sécurité/biométrique, vous ne pourrez " +
                            "peut-être plus vous connecter à votre compte. Veuillez procéder avec prudence.",
                        heading: "Es-tu sûr?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "La clé de sécurité/l'enregistrement biométrique a " +
                            "été interrompu. Si ce n'était pas intentionnel, vous pouvez réessayer le flux.",
                        heading: "Échec de l'enregistrement de la clé de sécurité/biométrique",
                        tryWithOlderDevice: "Vous pouvez également réessayer avec une " +
                            "ancienne clé de sécurité/biométrique."
                    }
                },
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la suppression " +
                                "de la clé de sécurité/biométrique"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la " +
                                "suppression de la clé de sécurité/biométrique",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "La clé de sécurité/biométrique a été supprimée avec succès de la liste",
                            message: "Votre clé de sécurité/biométrique a été supprimée avec succès"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la récupération " +
                                "de la clé de sécurité/biométrique"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération" +
                                " de la clé de sécurité/biométrique",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "La clé de sécurité/biométrique a été enregistrée " +
                                "avec succès et vous pouvez maintenant l'utiliser pour l'authentification.",
                            message: "Votre clé de sécurité/biométrique enregistrée avec succès"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la mise à jour " +
                                "de la clé de sécurité/du nom biométrique"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à " +
                                "jour de la clé de sécurité/du nom biométrique",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le nom de votre clé de sécurité/biométrique a été mis à jour avec succès",
                            message: "Clé de sécurité/Nom biométrique mis à jour avec succès"
                        }
                    }
                },
                tryButton: "Essayez avec une ancienne clé de sécurité/biométrique"
            },
            smsOtp: {
                descriptions: {
                    hint: "Vous recevrez un SMS contenant un code de vérification à usage unique"
                },
                heading: "à l'aide d'un SMS",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la mise à jour du numéro de téléphone " +
                                "de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du numéro de téléphone " +
                                "de récupération",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le numéro de téléphone portable dans le profil de l'utilisateur est mis " +
                                "à jour avec succès",
                            message: "Numéro de récupération mis à jour avec succès"
                        }
                    }
                }
            }
        },
        mobileUpdateWizard: {
            done: "Succès! Votre numéro de mobile a été vérifié avec succès.",
            notifications: {
                resendError: {
                    error: {
                        description: "{{error}}",
                        message: "Un problème est survenu"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la tentative d'obtention d'un nouveau " +
                            "code de vérification",
                        message: "Un problème est survenu"
                    }
                },
                resendSuccess: {
                    message: "La demande de code de renvoi a été envoyée avec succès"
                }
            },
            submitMobile: {
                heading: "Entrez votre nouveau numéro de mobile"
            },
            verifySmsOtp: {
                error: "Échec de la vérification. Veuillez réessayer.",
                generate: "Renvoyer un nouveau code de vérification",
                heading: "Entrez le code de vérification envoyé à votre numéro de mobile",
                label: "Code de vérification",
                placeholder: "Entrez votre code de vérification",
                requiredError: "Entrer le code de vérification"
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "Gérer l'activité de votre compte compte"
                    },
                    description: "Vous êtes actuellement connecté à partir de l'appareil suivant",
                    header: "Sessions actives"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "Sécuriser votre compte"
                    },
                    description: "Paramètres et recommandations pour vous aider à sécuriser votre compte",
                    header: "Sécurité du compte"
                },
                accountStatus: {
                    complete: "Votre profil est complet",
                    completedFields: "Attributs complétés",
                    completionPercentage: "Votre profil est complété à {{percentage}}%",
                    inComplete: "Complétez votre profil",
                    inCompleteFields: "Attributs incomplets",
                    mandatoryFieldsCompletion: "{{completed}} attributs complétés sur {{total}} obligatoires",
                    optionalFieldsCompletion: "{{completed}} attributs complétés sur {{total}} optionnels"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "Gérer vos consentements"
                    },
                    description: "Contrôlez les données que vous souhaitez partager avec d'autres applications",
                    header: "Gestion du consentement"
                },
                profileStatus: {
                    completionPercentage: "Votre profil est complété à {{percentage}}%",
                    description: "Gérez votre profil",
                    header: "Votre profil {{productName}}",
                    profileText: "Détails de votre profil personnel",
                    readOnlyDescription: "Afficher votre profil",
                    userSourceText: "(Connecté via {{source}})"
                }
            }
        },
        privacy: {
            about: {
                description:
                    "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your account.",
                            1:
                                "WSO2 IS uses attributes like your first name, last name, etc., to provide a rich and" +
                                " personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements. For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0:
                                    "Collecting information from the user profile page where you enter your personal" +
                                    " data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3:
                                    "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1:
                        "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2:
                        "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3:
                        "Entities, organizations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organization or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0:
                                "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1:
                                "This privacy policy is for the informational purposes of the entity or persons " +
                                "running WSO2 IS and sets out the processes and functionality contained within " +
                                "WSO2 IS regarding personal data protection. It is the responsibility of entities " +
                                "and persons running WSO2 IS to create and administer its own rules and processes " +
                                "governing users' personal data, and such rules and processes may change the use, " +
                                "storage and disclosure policies contained herein. Therefore users should consult " +
                                "the entity or persons running WSO2 IS for its own privacy policy for details " +
                                "governing users' personal data."
                        }
                    },
                    heading: "Disclaimer"
                },
                disclosureOfPersonalInfo: {
                    description:
                        "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description:
                            "Please note that the organization, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1:
                                "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2:
                                "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1:
                                "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1:
                                "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2:
                                "If you do not have an account and you do not agree with our privacy policy, " +
                                "you can choose not to create one."
                        },
                        heading: "Your choices"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "Storage of personal information",
                    howLong: {
                        description: {
                            list1: {
                                0: "Current password",
                                1: "Previously used passwords"
                            },
                            para1:
                                "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2:
                                "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1:
                                "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the organization you are registered under, or the " +
                                "super-administrator if you do not use the organization feature.",
                            para2:
                                "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1:
                                "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2:
                                "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1:
                                "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2:
                                "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1:
                            "WSO2 IS will only use your personal information for the purposes for which it was " +
                            "collected (or for a use identified as consistent with that purpose).",
                        para2: "WSO2 IS uses your personal information only for the following purposes.",
                        subList1: {
                            heading: "This includes:",
                            list: {
                                0: "IP address",
                                1: "Browser fingerprinting",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS may use:",
                            list: {
                                0: "IP Address to derive geographic information",
                                1: "Browser fingerprinting to determine the browser technology or/and version"
                            }
                        }
                    },
                    heading: "Use of personal information"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "Your user name (except in cases where the user name created by your employer is " +
                                "under contract)",
                            1: "Your date of birth/age",
                            2: "IP address used to log in",
                            3: "Your device ID if you use a device (e.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (e.g., phone or tablet)",
                            3: "Operating system and generic browser information"
                        },
                        para1:
                            "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2:
                            "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        profile: {
            fields: {
                emails: "Email",
                generic: {
                    default: "Ajouter l'attribut {{fieldName}}"
                },
                nameFamilyName: "Nom de famille",
                nameGivenName: "Prénom",
                phoneNumbers: "Numéros de téléphone",
                profileImage: "Image de profil",
                profileUrl: "URL",
                userName: "Nom d'utilisateur"
            },
            forms: {
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: "Sélectionnez votre pays"
                        }
                    }
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                futureDateError: "La date que vous avez saisie pour le champ {{field}} " + 
                                "n'est pas valide.",
                                invalidFormat: "Veuillez saisir un test valide au format YYYY-MM-DD."
                            }
                        }
                    }
                },
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "Email",
                            note: "NOTE: La modification de cela modifie l'adresse e-mail associée à ce compte. " +
                                "Cette adresse e-mail est également utilisée pour la récupération de compte.",
                            placeholder: "Veuillez saisir votre adresse e-mail",
                            validations: {
                                empty: "L'adresse e-mail est obligatoire",
                                invalidFormat: "Format de l'adresse e-mail saisie invalide. Vous pouvez utiliser des " +
                                    "caractères alphanumériques, caractères Unicode, des traits de soulignement (_), " +
                                    "des tirets (-), des points (.) Et un signe arobase (@)."
                            }
                        }
                    }
                },
                generic: {
                    inputs: {
                        placeholder: "Entrez votre {{fieldName}}",
                        readonly: {
                            placeholder: "Cette valeur est vide",
                            popup: "Contactez l'administrateur pour mettre à jour votre {{fieldName}}"
                        },
                        validations: {
                            empty: "L'attribut {{fieldName}} est obligatoire",
                            invalidFormat: "Le format du {{fieldName}} saisi est incorrect"
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "Numéro de téléphone portable",
                            note: "NOTE: Le numéro de téléphone portable associé de votre profil utilisateur " +
                                "sera modifié",
                            placeholder: "Veuillez saisir votre numéro de portable",
                            validations: {
                                empty: "Le numéro de portable est un champ obligatoire",
                                invalidFormat: "Veuillez saisir un numéro de mobile valide au format [+][indicatif du "+
                                    "pays][indicatif régional][numéro de téléphone local]."
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "Prénom",
                            placeholder: "Veuillez saisir votre prénom",
                            validations: {
                                empty: "Le prénom est obligatoire"
                            }
                        },
                        lastName: {
                            label: "Nom de famille",
                            placeholder: "Veuillez saisir votre nom de famille",
                            validations: {
                                empty: "Le nom de famille est obligatoire"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "Organisation",
                            placeholder: "Veuillez saisir votre organisation",
                            validations: {
                                empty: "L'organisation est obligatoire"
                            }
                        }
                    }
                }
            },
            messages: {
                emailConfirmation: {
                    content: "Veuillez confirmer votre adresse e-mail afin de pouvoir l'ajouter à votre profil",
                    header: "Confirmation en attente !"
                },
                mobileVerification: {
                    content: "Ce numéro de mobile est utilisé pour l'envoi de SMS OTP lorsque l'authentification " +
                        "second facteur est activée et pour l'envoi de codes de récupération en cas de " +
                        "récupération d'un nom d'utilisateur / mot de passe. Pour mettre à jour ce numéro, " +
                        "vous devez vérifier le nouveau numéro en entrant le code de vérification envoyé à votre " +
                        "nouveau numéro. Cliquez sur mettre à jour si vous souhaitez continuer."
                }
            },
            notifications: {
                getProfileCompletion: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de l'évaluation de la complétude du profil",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "La complétude du profil a été évalué avec succès",
                        message: "Évaluation réussie"
                    }
                },
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite lors de la récupération des détails de votre profil"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la récupération des détails de votre profil",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Les attributs obligatoires du profil utilisateur ont été récupérés avec succès",
                        message: "Profil utilisateur récupéré avec succès"
                    }
                },
                getUserReadOnlyStatus: {
                    genericError: {
                        description: "Une erreur s'est produite lors de la récupération du statut lecture-seule " +
                            "de l'utilisateur",
                        message: "Quelque chose s'est mal passé"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite lors de la mise à jour des informations du profil"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la mise à jour des informations du profil",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Les attributs obligatoires du profil utilisateur ont été mis à jour avec succès",
                        message: "Profil utilisateur mis à jour avec succès"
                    }
                }
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "Cette fonctionnalité n'est pas disponible pour votre compte"
                }
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite lors du téléchargement des informations de votre profil " +
                            "utilisateur"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors du téléchargement des informations de votre " +
                            "profil utilisateur",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Le téléchargement du fichier contenant les informations de votre profil " +
                            "utilisateur a commencé",
                        message: "Le téléchargement des détails de votre profil utilisateur a débuté"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "Cette image a été récupérée à partir du service <1>Gravatar</1>.",
            urlUpdateHeader: "Entrez l'URL d'une image pour mettre à jour votre image de profil"
        },
        userSessions: {
            browserAndOS: "{{browser}} sur {{os}} {{version}}",
            dangerZones: {
                terminate: {
                    actionTitle: "Déconnecter",
                    header: "Se déconnecter",
                    subheader: "L'accès à votre compte depuis cet appareil sera supprimé."
                }
            },
            lastAccessed: "Dernier accès il y a {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "Confirmation",
                    message:
                        "L'action vous déconnectera de cette session et de toutes les autres sessions sur " +
                        "chaque appareil. Souhaitez-vous continuer?"
                },
                terminateUserSessionModal: {
                    heading: "Confirmation",
                    message:
                        "Cette action supprimera l'accès à votre compte depuis cet appareil. " +
                        "Souhaitez-vous continuer ?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de la récupération des sessions authentifiées "
                    },
                    genericError: {
                        description: "Impossible de récupérer les sessions authentifiées",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Sessions authentifiées récupérées avec succès",
                        message: "Récupération des sessions authentifiées réussie"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "Impossible de mettre fin à toutes les sessions authentitifées"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la fermeture des sessions authentifiées",
                        message: "Impossible de mettre fin aux sessions authentifiées"
                    },
                    success: {
                        description: "Toutes les sessions authentifiées ont été supprimées",
                        message: "Fermeture de toutes les sessions authentifiées"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "Impossible de mettre fin à la session authentifiée"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la fermeture de la session authentifiée",
                        message: "Impossible de mettre fin à la session authentifiée"
                    },
                    success: {
                        description: "Fermeture de la session authentifiée effectuée avec succès",
                        message: "Session supprimée avec succès"
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
                            content: "Il semblerait que l'adresse e-mail sélectionnée ne soit pas enregistré sur " +
                                "Gravatar. Veuillez créer un compte en vous rendant sur le site officiel de Gravatar " +
                                "ou utilisez une des images ci-dessous.",
                            header: "Aucune image n'a été trouvée sur Gravatar !"
                        }
                    },
                    heading: "Gravatar associé à l'adresse email "
                },
                hostedAvatar: {
                    heading: "Image Internet",
                    input: {
                        errors: {
                            http: {
                                content: "L'URL sélectionnée pointe vers une ressource non sécurisée (HTTP). " +
                                    "Soyez prudent.",
                                header: "Contenu non sécurisé !"
                            },
                            invalid: {
                                content: "Veuillez saisir une URL valide pointant vers une image"
                            }
                        },
                        hint: "Entrez l'URL valide d'une image hébergée sur un site tiers",
                        placeholder: "Veuillez saisir l'URL de l'image",
                        warnings: {
                            dataURL: {
                                content: "L'utilisation d'URL comportant un grand nombre " +
                                    "de caractères peut causer des problèmes dans la base " +
                                    "de données. Procédez avec prudence",
                                header: "Vérifiez l'URL saisie !"
                            }
                        }
                    }
                },
                systemGenAvatars: {
                    heading: "Avatar généré par le système",
                    types: {
                        initials: "Initiales"
                    }
                }
            },
            description: "Mettre à jour votre photo de profil",
            heading: "Photo de votre profil",
            primaryButton: "Sauvegarder",
            secondaryButton: "Annuler"
        },
        sessionTimeoutModal: {
            description: "Lorsque vous cliquez sur <1>Retour</1>, nous essaierons de récupérer la session " +
                "si elle existe. Si vous n'avez pas de session active, vous serez redirigé vers la page de connexion.",
            heading: "Il semble que vous ayez été inactif pendant longtemps.",
            loginAgainButton: "Connectez-vous à nouveau",
            primaryButton: "Retourner",
            secondaryButton: "Déconnexion",
            sessionTimedOutDescription: "Veuillez vous reconnecter pour reprendre là où vous vous étiez arrêté.",
            sessionTimedOutHeading: "La session utilisateur a expiré en raison d'une inactivité."
        }
    },
    pages: {
        applications: {
            subTitle: "Découvrez et accédez à vos applications",
            title: "Applications"
        },
        overview: {
            subTitle: "Gérez vos informations personnelles, la sécurité de votre compte et vos paramètres de " +
                "confidentialité",
            title: "Bienvenue, {{firstName}}"
        },
        personalInfo: {
            subTitle: "Modifier ou exporter votre profil personnel et gérer vos comptes associés",
            title: "Données personnelles"
        },
        personalInfoWithoutExportProfile: {
            subTitle: "Modifier votre profil personnel",
            title: "Données personnelles"
        },
        personalInfoWithoutLinkedAccounts: {
            subTitle: "Modifier ou exporter votre profil personnel",
            title: "Données personnelles"
        },
        privacy: {
            subTitle: "",
            title: "Politique de confidentialité de WSO2 Identity Server"
        },
        readOnlyProfileBanner: "Votre profil ne peut pas être modifié depuis ce portail. Veuillez " +
            "contacter votre administrateur pour plus de détails.",
        security: {
            subTitle: "Sécurisez votre compte en gérant les consentements, les sessions authentifiées et les " +
                "paramètres de sécurité",
            title: "Sécurité"
        }
    },
    placeholders: {
        404: {
            action: "Revenir à la page d'accueil",
            subtitles: {
                0: "La page que vous essayez de consulter n'existe pas.",
                1: "Veuillez vérifier l'URL ou cliquez sur le bouton ci-dessous pour être redirigé vers la page " +
                    "d'accueil."
            },
            title: "Page introuvable"
        },
        accessDeniedError: {
            action: "Revenir à la page d'accueil",
            subtitles: {
                0: "Il semblerait que vous ne soyez pas autorisé à accéder à cette page.",
                1: "Veuillez vous connecter en utilisant un autre compte."
            },
            title: "Accès non autorisé"
        },
        emptySearchResult: {
            action: "Réinitialiser la recherche",
            subtitles: {
                0: "La recherche \"{{query}}\" n'a renvoyé aucun résultat.",
                1: "Veuillez essayer avec d'autres paramètres."
            },
            title: "Aucun résultat"
        },
        genericError: {
            action: "Rafraîchir la page",
            subtitles: {
                0: "Quelque chose s'est mal passé lors de l'affichage de cette page.",
                1: "Voir la console du navigateur pour les détails techniques."
            },
            title: "Quelque chose s'est mal passé"
        },
        loginError: {
            action: "Se déconnecter",
            subtitles: {
                0: "Il semblerait que l'accès à ce portail ne vous est pas autorisé.",
                1: "Veuillez vous connecter en utilisant un autre compte."
            },
            title: "Accès interdit"
        },
        sessionStorageDisabled: {
            subtitles: {
                0: "Pour utiliser cette application, vous devez activer les cookies dans les " +
                    "paramètres de votre navigateur Web.",
                1: "Pour plus d'informations sur l'activation des cookies, consultez la section d'aide " +
                    "de votre navigateur Web."
            },
            title: "Les cookies sont désactivés dans votre navigateur."
        }
    },
    sections: {
        accountRecovery: {
            description:
                "Gérez les informations de récupération que nous pouvons utiliser pour vous aider à récupérer " +
                "votre nom d'utilisateur ou votre mot de passe",
            heading: "Récupération de votre compte"
        },
        changePassword: {
            actionTitles: {
                change: "Changer mon mot de passe"
            },
            description: "Assurez-vous de mettre à jour régulièrement votre mot de passe et de ne pas le réutiliser " +
                "sur d'autres sites.",
            heading: "Changer de mot de passe"
        },
        consentManagement: {
            actionTitles: {
                empty: "Vous n'avez accordé votre consentement à aucune application"
            },
            description:
                "Passez en revue les consentements que vous avez fournis pour chaque demande. " +
                "En outre, vous pouvez révoquer un ou plusieurs d'entre eux selon vos besoins.",
            heading: "Gérer mes consentements",
            placeholders: {
                emptyConsentList: {
                    heading: "Vous n'avez accordé aucun consentement"
                }
            }
        },
        createPassword: {
            actionTitles: {
                create: "Créer un mot de passe"
            },
            description: "Créez un mot de passe dans {{productName}}. Vous pouvez utiliser ce mot de passe pour vous " +
                "connecter à {{productName}} en plus de la connexion sociale.\n",
            heading: "Créer un mot de passe"
        },
        federatedAssociations: {
            description: "Visualisez les comptes enregistrés auprès de services d'authentifications tiers liés à " +
                "votre compte",
            heading: "Services d'authentification tiers"
        },
        linkedAccounts: {
            actionTitles: {
                add: "Associer un autre compte"
            },
            description: "Liez vos comptes et accédez à ceux-ci de manière transparente sans avoir à vous reconnecter",
            heading: "Comptes associés"
        },
        mfa: {
            description:
                "Renforcez la protection de votre compte en configurant plusieurs " +
                "étapes d'authentification.",
            heading: "Authentification à plusieurs étapes"
        },
        profile: {
            description: "Gérez vos données personnelles telles que votre nom, votre adresse e-mail, votre numéro " +
                "de téléphone portable, etc.",
            heading: "Profil"
        },
        profileExport: {
            actionTitles: {
                export: "Téléchargez le profil"
            },
            description: "Téléchargez toutes les données de votre profil utilisateur : données personnelles, " +
                "questions de sécurité et consentements",
            heading: "Télécharger mon profil"
        },
        userSessions: {
            actionTitles: {
                empty: "Aucune session active",
                terminateAll: "Mettre fin à toutes les sessions"
            },
            description: "Passez en revue toutes les sessions actuellement actives sur votre compte",
            heading: "Sessions Actives",
            placeholders: {
                emptySessionList: {
                    heading: "Il n'y a pas de sessions actives pour cet utilisateur"
                }
            }
        }
    }
};
