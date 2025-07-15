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
                    add: "Ajoutez ou mettez à jour le numéro de mobile de récupération.",
                    emptyMobile: "Vous devez configurer votre numéro de mobile pour procéder à la récupération par SMS-OTP.",
                    update: "Mettez à jour le numéro de mobile de récupération ({{mobile}})",
                    view: "Voir le numéro de mobile de récupération ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "Numéro de mobile",
                                placeholder: "Entrez le numéro de mobile de récupération.",
                                validations: {
                                    empty: "Entrez un numéro de mobile.",
                                    invalidFormat: "Le format du numéro de mobile n'est pas correct."
                                }
                            }
                        }
                    }
                },
                heading: "Récupération par SMS",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la mise à jour du numéro de mobile de récupération."
                        },
                        genericError: {
                            description: "Une erreur est survenue lors de la mise à jour du numéro de mobile de récupération",
                            message: "Quelque chose a mal tourné"
                        },
                        success: {
                            description: "Le numéro de mobile du profil utilisateur a été mis à jour avec succès",
                            message: "Numéro de mobile mis à jour avec succès"
                        }
                    }
                }
            },
            codeRecovery: {
                descriptions: {
                    add: "Ajouter ou mettre à jour les options pour les codes de récupération."
                },
                heading: "Codes de récupération"
            },
            emailRecovery: {
                descriptions: {
                    add: "Ajouter ou mettre à jour l'e-mail de récupération",
                    emptyEmail: "Vous devez configurer votre adresse e-mail pour procéder à la récupération des e-mails.",
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
                        invalidNewPassword: {
                            description: "Le mot de passe ne satisfait pas les contraintes requises.",
                            message: "Mot de passe incorrect"
                        },
                        passwordCaseRequirement: "Au moins {{minUpperCase}} majuscule et {{minLowerCase}} " +
                            "minuscules",
                        passwordCharRequirement: "Au moins {{minSpecialChr}} de caractère(s) spécial(s)",
                        passwordLengthRequirement: "Doit contenir entre {{min}} et {{max}} caractères",
                        passwordLowerCaseRequirement: "Au moins {{minLowerCase}} lettre(s) minuscule(s)",
                        passwordNumRequirement: "Au moins {{min}} numéro(s)",
                        passwordRepeatedChrRequirement: "Pas plus de {{repeatedChr}} caractère(s) répété(s)",
                        passwordUniqueChrRequirement: "Au moins {{uniqueChr}} caractère(s) unique(s)",
                        passwordUpperCaseRequirement: "Au moins {{minUpperCase}} lettre(s) majuscule(s)",
                        submitError: {
                            description: "{{description}}",
                            message: "Erreur lors de la modification du mot de passe"
                        },
                        submitSuccess: {
                            description: "Le mot de passe a été modifié avec succès",
                            message: "Réinitialisation du mot de passe réussie"
                        },
                        validationConfig: {
                            error: {
                                description: "{{description}}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Impossible de récupérer les données de configuration de validation.",
                                message: "Quelque chose s'est mal passé"
                            }
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
            dropdown: {
                footer: {
                    cookiePolicy: "Cookies",
                    privacyPolicy: "Confidentialité",
                    termsOfService: "Conditions"
                }
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
                heading: "Authentificateur TOTP",
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
                        regenerateConfirmLabel: "Confirmez la régénération d'un nouveau code QR",
                        regenerateWarning: {
                            extended: "Lorsque vous régénérez un nouveau code QR, vous devez le scanner et réinstaller votre application Authenticatrice.Vous ne pourrez plus vous connecter avec le code QR précédent.",
                            generic: "Lorsque vous régénérez un nouveau code QR, vous devez le scanner et réinstaller votre application Authenticatrice.Votre configuration précédente ne fonctionnera plus."
                        }
                    },
                    toolTip: "Vous n'avez pas d'application? Téléchargez une application d'authentification " +
                        "telle que Google Authenticator depuis <1>App Store</1> ou <3>Google Play</3>",
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
                actions: {
                    add: "Ajouter des codes de secours",
                    delete: "Supprimer les codes de secours"
                },
                description: "Utilisez des codes de secours pour accéder à votre compte au cas où vous ne pourriez pas " +
                    "recevoir de codes d'authentification multifacteur. Vous pouvez régénérer de nouveaux codes si nécessaire.",
                download: {
                    heading: "ENREGISTREZ VOS CODES DE SECOURS.",
                    info1: "Vous ne pouvez utiliser chaque code de secours qu'une seule fois.",
                    info2: "Ces codes ont été générés sur ",
                    subHeading: "Vous pouvez utiliser ces codes de secours pour vous connecter à " +
                        "Asgardeo lorsque vous êtes loin de votre téléphone. Conservez ces codes " +
                        "de sauvegarde dans un endroit sûr mais accessible."
                },
                heading: "Codes de sauvegarde",
                messages: {
                    disabledMessage: "Au moins un authentificateur supplémentaire doit être configuré pour activer les codes de sauvegarde."
                },
                modals: {
                    actions: {
                        copied: "copié",
                        copy: "Copier les codes",
                        download: "Codes de téléchargement",
                        regenerate: "Régénérer"
                    },
                    delete: {
                        description: "Cette action supprimera les codes de secours et vous ne pourrez plus les utiliser. " +
                            "Souhaitez-vous continuer?",
                        heading: "Confirmation"
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
                mutedHeader: "Options de récupération",
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
                    deleteSuccess: {
                        genericMessage: "Suppression réussie",
                        message: "Codes de secours supprimés avec succès."
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
                },
                remaining: "restant"
            },
            fido: {
                description: "Vous pouvez utiliser une <1>clé d'accès</1>, une " +
                    "<1>clé de sécurité FIDO</1> ou des <1>données biométriques</1> " +
                    "sur votre appareil pour vous connecter à votre compte.",
                form: {
                    label: "Clé d'accès",
                    placeholder: "Entrez un nom pour le mot de passe",
                    remove: "Supprimer le mot de passe",
                    required: "Veuillez saisir un nom pour votre mot de passe"
                },
                heading: "Clé d'accès",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Cette action est irréversible et supprimera définitivement le mot de passe.",
                        description: "Si vous supprimez ce mot de passe, vous ne pourrez peut-être " +
                            "pas vous reconnecter à votre compte. Veuillez procéder avec prudence.",
                        heading: "Es-tu sûr?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "L'enregistrement du mot de passe a été interrompu. " +
                            "Si ce n'était pas intentionnel tu peut réessayer le flux.",
                        heading: "Échec de l'enregistrement du mot de passe",
                        tryWithOlderDevice: "VVous pouvez également réessayer avec un mot de passe plus ancien."
                    }
                },
                noPassKeyMessage: "Vous n'avez pas encore de clés d'accès enregistrées.",
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la suppression du mot de passe"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du mot de passe " +
                                "suppression de la clé de sécurité/biométrique",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le mot de passe a été supprimé avec succès de la liste",
                            message: "Votre mot de passe supprimé avec succès"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la récupération du mot de passe"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du mot de passe",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le mot de passe a été enregistré avec succès et maintenant vous " +
                                "peut l'utiliser pour l'authentification.",
                            message: "Votre mot de passe enregistré avec succès"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la mise à jour du nom du mot de passe"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du nom du mot de passe",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le nom de votre mot de passe a été mis à jour avec succès",
                            message: "Le nom du mot de passe a été mis à jour avec succès"
                        }
                    }
                },
                tryButton: "Essayez avec un ancien mot de passe"
            },
            "pushAuthenticatorApp": {
                "addHint": "Configurer",
                "configuredDescription": "Vous pouvez utiliser les notifications de connexion générées par votre application d'authentification configurée pour l'authentification à deux facteurs. Si vous n'avez pas accès à l'application, vous pouvez configurer une nouvelle application d'authentification ici.",
                "deleteHint": "Supprimer",
                "description": "Vous pouvez utiliser l'application d'authentification push pour recevoir des notifications de connexion sous forme de notifications push pour l'authentification à deux facteurs.",
                "heading": "Authentificateur Push",
                "hint": "Voir",
                "modals": {
                    "deviceDeleteConfirmation": {
                        "assertionHint": "Veuillez confirmer votre action.",
                        "content": "Cette action est irréversible et supprimera définitivement l'appareil.",
                        "description": "Si vous supprimez cet appareil, vous ne pourrez peut-être pas vous reconnecter à votre compte. Veuillez procéder avec prudence.",
                        "heading": "Êtes-vous sûr ?"
                    },
                    "scan": {
                        "additionNote": "Le code QR a été ajouté avec succès à votre profil !",
                        "done": "Succès ! Vous pouvez maintenant utiliser votre application d'authentification push pour l'authentification à deux facteurs.",
                        "heading": "Configurer l'application d'authentification push",
                        "messageBody": "Vous pouvez trouver une liste des applications d'authentification disponibles ici.",
                        "subHeading": "Scannez le code QR ci-dessous avec l'application d'authentification push"
                    }
                },
                "notifications": {
                    "delete": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Une erreur s'est produite"
                        },
                        "genericError": {
                            "description": "Une erreur s'est produite lors de la suppression de l'appareil enregistré",
                            "message": "Une erreur s'est produite"
                        },
                        "success": {
                            "description": "L'appareil enregistré a été supprimé avec succès",
                            "message": "Appareil supprimé avec succès"
                        }
                    },
                    "deviceListFetchError": {
                        "error": {
                            "description": "Une erreur s'est produite lors de la récupération des appareils enregistrés pour l'authentification push",
                            "message": "Une erreur s'est produite"
                        }
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Une erreur s'est produite"
                        },
                        "genericError": {
                            "description": "Une erreur s'est produite lors de la récupération du code QR",
                            "message": "Une erreur s'est produite"
                        }
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "Vous recevrez un SMS contenant un code de vérification à usage unique"
                },
                heading: "Mobile number",
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
            verificationSent: {
                heading: "Vous recevrez un OTP à votre numéro de mobile pour vérification sous peu"
            },
            verifySmsOtp: {
                didNotReceive: "Vous n'avez pas reçu le code?",
                error: "Échec de la vérification. Veuillez réessayer.",
                heading: "Vérifiez votre numéro de mobile",
                label: "Entrez le code de vérification envoyé à votre numéro de mobile",
                placeholder: "Entrez votre code de vérification",
                requiredError: "Entrer le code de vérification",
                resend: "Renvoyer"
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
        profile: {
            actions: {
                "deleteEmail": "Supprimer l'adresse e-mail",
                "deleteMobile": "Supprimer le téléphone portable",
                "verifyEmail": "Confirmez votre adresse email",
                "verifyMobile": "Vérifiez le mobile"
            },
            fields: {
                "Account Confirmed Time": "Heure confirmée du compte",
                "Account Disabled": "Compte désactivé",
                "Account Locked": "Compte bloqué",
                "Account State": "État du compte",
                "Active": "Active",
                "Address - Street": "Rue d'adresse",
                "Ask Password": "Demander le mot de passe",
                "Backup Code Enabled": "Code de sauvegarde activé",
                "Backup Codes": "Codes de sauvegarde",
                "Birth Date": "Date de naissance",
                "Country": "Pays",
                "Created Time": "Temps créé",
                "Disable EmailOTP": "Désactiver EMAILOTP",
                "Disable SMSOTP": "Désactiver SMSOTP",
                "Display Name": "Afficher un nom",
                "Email": "E-mail",
                "Email Addresses": "Adresses mail",
                "Email Verified": "Email verifier",
                "Enabled Authenticators": "Authentificateurs activés",
                "Existing Lite User": "Utilisateur Lite existant",
                "External ID": "ID externe",
                "Failed Attempts Before Success": "Échec des tentatives avant le succès",
                "Failed Backup Code Attempts": "Échec des tentatives de code de sauvegarde",
                "Failed Email OTP Attempts": "Email Échec des tentatives OTP",
                "Failed Lockout Count": "Compte de lock-out échoué",
                "Failed Login Attempts": "Échec des tentatives de connexion",
                "Failed Password Recovery Attempts": "Échec des tentatives de récupération de mot de passe",
                "Failed SMS OTP Attempts": "Échec des tentatives de SMS OTP",
                "Failed TOTP Attempts": "Échec des tentatives TOTP",
                "First Name": "Prénom",
                "Force Password Reset": "Forcer la réinitialisation du mot de passe",
                "Full Name": "Nom et prénom",
                "Gender": "Genre",
                "Groups": "Groupes",
                "Identity Provider Type": "Type de fournisseur d'identité",
                "Last Logon": "Dernière connexion",
                "Last Modified Time": "Dernière heure modifiée",
                "Last Name": "Nom de famille",
                "Last Password Update": "Dernière mise à jour du mot de passe",
                "Lite User": "Utilisateur de lite",
                "Lite User ID": "ID utilisateur de lite",
                "Local": "Locale",
                "Local Credential Exists": "Des informations d'identification locales existent",
                "Locality": "Localité",
                "Location": "Emplacement",
                "Locked Reason": "Raison verrouillée",
                "Manager - Name": "Manager - Nom",
                "Middle Name": "Deuxième nom",
                "Mobile": "mobile",
                "Mobile Numbers": "Numéros de téléphone portable",
                "Nick Name": "Surnom",
                "Phone Verified": "Téléphone vérifié",
                "Photo - Thumbnail": "Photo - Vignette",
                "Photo URL": "URL photo",
                "Postal Code": "Code Postal",
                "Preferred Channel": "Canal préféré",
                "Read Only User": "Lire uniquement l'utilisateur",
                "Region": "Région",
                "Resource Type": "Type de ressource",
                "Roles": "Les rôles",
                "Secret Key": "Clef secrète",
                "TOTP Enabled": "TOTP activé",
                "Time Zone": "Fuseau horaire",
                "URL": "url",
                "Unlock Time": "Déverrouiller le temps",
                "User Account Type": "Type de compte d'utilisateur",
                "User ID": "ID de l'utilisateur",
                "User Metadata - Version": "Métadonnées utilisateur - version",
                "User Source": "Source d'utilisateur",
                "User Source ID": "ID de source utilisateur",
                "Username": "Nom d'utilisateur",
                "Verification Pending Email": "E-mail en attente de vérification",
                "Verification Pending Mobile Number": "Numéro de mobile en attente de vérification",
                "Verified Email Addresses": "Adresses de montage E vérifiées",
                "Verified Mobile Numbers": "Numéros de téléphone mobile vérifiés",
                "Verify Email": "Vérifier les courriels",
                "Verify Mobile": "Vérifiez le mobile",
                "Verify Secret Key": "Vérifiez la clé secrète",
                "Website URL": "URL de site web",
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
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: "Veuillez confirmer votre action.",
                    content: "Cette action est irréversible et supprime définitivement la valeur sélectionnée.",
                    description: "Si vous supprimez cette valeur sélectionnée, elle sera définitivement supprimée de votre profil.",
                    heading: "Es-tu sûr?"
                },
                emailAddressDeleteConfirmation: {
                    assertionHint: "Veuillez confirmer votre action.",
                    content: "Cette action est irréversible et supprime de façon permanente l'adresse e-mail.",
                    description: "Si vous supprimez cette adresse E-Mail, vous serez supprimé de votre profil de façon permanente.",
                    heading: "Es-tu sûr?"
                },
                mobileNumberDeleteConfirmation: {
                    assertionHint: "Veuillez confirmer votre action.",
                    content: "Cette action est irréversible et supprimera en permanence le numéro de téléphone portable.",
                    description: "Si vous supprimez ce numéro de téléphone portable, il sera supprimé de votre profil de façon permanente.",
                    heading: "Es-tu sûr?"
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
                },
                verifyEmail: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite lors de l'envoi de l'e-mail de révision -e"
                    },
                    genericError: {
                        description: "Lors de l'envoi de l'e-mail de révision -e, une erreur s'est produite",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "L'e-mail de la révision -e a été envoyé avec succès. Veuillez vérifier votre boîte de réception",
                        message: "Email de la révision réussie -e"
                    }
                },
                verifyMobile: {
                    error: {
                        description: "{{description}}",
                        message: "Une erreur s'est produite lors de l'envoi du code de vérification"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de l'envoi du code de vérification",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Le code d'examen a été envoyé avec succès. Veuillez vérifier votre téléphone portable",
                        message: "Code d'examen réussi"
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
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}.",
                        message: "Erreur lors de la récupération des préférences d'auto-inscription"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la récupération des préférences d'auto-inscription.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Préférences d'auto-inscription récupérées avec succès.",
                        message: "Récupération des préférences d'auto-inscription réussie"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "Renvoyer",
            selfSignUp: {
                awaitingAccountConfirmation: "Votre compte n'est pas encore actif. Nous avons envoyé un " +
                    "lien d'activation à votre adresse e-mail enregistrée. Besoin d'un nouveau lien ?",
                notifications: {
                    resendError: {
                        description: "Une erreur s'est produite lors du renvoi de l'e-mail de confirmation de compte.",
                        message: "Quelque chose s'est mal passé"
                    },
                    resendSuccess: {
                        description: "E-mail de confirmation de compte renvoyé avec succès.",
                        message: "E-mail de confirmation de compte renvoyé avec succès"
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
            lastAccessed: "Dernier accès {{date}}",
            modals: {
                terminateActiveUserSessionModal: {
                    heading: "Terminer les sessions actives en cours",
                    message:
                        "Les modifications de l'option d'authentification à deux facteurs (2FA) ne seront pas appliquées à vos sessions actives. Nous vous " +
                        "recommandons de les résilier.",
                    primaryAction: "Terminer tout",
                    secondaryAction: "Réviser et résilier"

                },
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
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur lors de l'obtention de la vérification lors de la préférence de mise à jour"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de l'obtention de la vérification des préférences de mise à jour",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Récupération réussie de la vérification de la préférence de mise à jour",
                        message: "vérification lors de la récupération des préférences de mise à jour réussie"
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
                                "Gravatar. Veuillez créer un compte en vous rendant sur <1>le site officiel de Gravatar</1> " +
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
            description: "Gérer les informations de récupération que nous pouvons utiliser pour vous aider à récupérer votre mot de passe",
            emptyPlaceholderText: "Aucune option de récupération de compte disponible",
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
            description: "Afficher vos comptes à partir d'autres connexions liées à ce compte",
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
            description: "Téléchargez toutes les données de votre profil, y compris les données personnelles et les comptes liés",
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
