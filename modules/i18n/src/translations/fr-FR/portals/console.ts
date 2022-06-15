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

import { ConsoleNS } from "../../../models";

export const console: ConsoleNS = {
    common: {
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "Attribut de filtrage",
                        placeholder: "Par exemple, nom, description, etc.",
                        validations: {
                            empty: "L'attribut de filtrage est un champ obligatoire."
                        }
                    },
                    filterCondition: {
                        label: "Condition de filtrage",
                        placeholder: "Par exemple, commence par etc.",
                        validations: {
                            empty: "Condition de filtrage est un champ obligatoire."
                        }
                    },
                    filterValue: {
                        label: "Valeur de filtrage",
                        placeholder: "Par exemple, admin, wso2 etc.",
                        validations: {
                            empty: "La valeur du filtre est un champ obligatoire."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Maj + Entrée",
                    label: "Pour effectuer une recherche"
                }
            },
            options: {
                header: "Recherche avancée"
            },
            placeholder: "Recherche par {{attribute}}",
            popups: {
                clear: "effacer la requête",
                dropdown: "Afficher les options"
            },
            resultsIndicator: "Afficher les résultats de la requête \"{{query}}\""
        },
        cookieConsent: {
            confirmButton: "J'ai compris",
            content: "Nous utilisons des cookies pour vous garantir la meilleure expérience globale. Ces cookies " +
                "sont utilisés pour maintenir une session continue ininterrompue tout en offrant des services " +
                "fluides et personnalisés. Pour En savoir plus sur la façon dont nous utilisons les cookies, " +
                "reportez-vous à notre <1>Politique relative aux cookies</1>."
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
            }
        },
        modals: {
            editAvatarModal: {
                content: {
                    gravatar: {
                        errors: {
                            noAssociation: {
                                content: "Il semble que l'e-mail sélectionné ne soit pas enregistré sur Gravatar. " +
                                    "Ouvrez un compte Gravatar en vous rendant sur le site officiel de Gravatar ou " +
                                    "utilisez l'un des choix suivants.",
                                header: "Aucune image Gravatar correspondante trouvée !"
                            }
                        },
                        heading: "Gravatar basé sur "
                    },
                    hostedAvatar: {
                        heading: "Image hébergée",
                        input: {
                            errors: {
                                http: {
                                    content: "L'URL sélectionnée pointe vers une image non sécurisée servie par " +
                                        "HTTP. Veuillez procéder avec prudence.",
                                    header: "Contenu non sécurisé !"
                                },
                                invalid: {
                                    content: "Veuillez entrer une URL d'image valide"
                                }
                            },
                            hint: "Entrez une URL d'image valide qui est hébergée sur un site tiers.",
                            placeholder: "Entrez l'URL de l'image.",
                            warnings: {
                                dataURL: {
                                    content: "L'utilisation d'URL avec un grand nombre de caractères peut entraîner " +
                                        "des problèmes de taille en base de données. Procédez avec prudence.",
                                    header: "Vérifiez l'URL des données saisies !"
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
                description: null,
                heading: "Mise à jour de la photo de profil",
                primaryButton: "Sauvegarder",
                secondaryButton: "Annuler"
            },
            sessionTimeoutModal: {
                description: "Lorsque vous cliquez sur <1>Retour</1>, nous essaierons de récupérer la session " +
                    "si elle existe. Si vous n'avez pas de session active, vous serez redirigé vers la page " +
                    "de connexion.",
                heading: "Il semble que vous ayez été inactif pendant longtemps.",
                loginAgainButton: "Connectez-vous à nouveau",
                primaryButton: "Retourner",
                secondaryButton: "Déconnexion",
                sessionTimedOutDescription: "Veuillez vous reconnecter pour reprendre là où vous vous étiez arrêté.",
                sessionTimedOutHeading: "La session utilisateur a expiré en raison d'une inactivité."
            }
        },
        notifications: {
            invalidPEMFile: {
                error: {
                    description: "{{ description }}",
                    message: "Erreur de décodage"
                },
                genericError: {
                    description: "Une erreur s'est produite lors du décodage du certificat.",
                    message: "Erreur de décodage"
                },
                success: {
                    description: "Décodage réussi du fichier de certificat.",
                    message: "Décodage réussi"
                }
            }
        },
        placeholders: {
            404: {
                action: "Revenir à la page d'accueil",
                subtitles: {
                    0: "La page que vous essayez de consulter n'existe pas.",
                    1: "Veuillez vérifier l'URL ou cliquez sur le bouton ci-dessous pour être redirigé vers la " +
                        "page d'accueil."
                },
                title: "Page introuvable"
            },
            accessDenied: {
                action: "Se déconnecter",
                subtitles: {
                    0: "Il semblerait que vous ne soyez pas autorisé à accéder à cette page.",
                    1: "Veuillez vous connecter en utilisant un autre compte."
                },
                title: "Accès non autorisé"
            },
            brokenPage: {
                action: "Rafraîchir la page",
                subtitles: {
                    0: "Quelque chose s'est mal passé lors de l'affichage de cette page.",
                    1: "Voir la console du navigateur pour les détails techniques."
                },
                title: "Quelque chose s'est mal passé"
            },
            consentDenied: {
                action: "Se déconnecter",
                subtitles: {
                    0: "Il semblerait que vous n'ayez pas donné votre consentement à cette application",
                    1: "Veuillez accorder votre consentement afin  d'utiliser l'application."
                },
                title: "Vous avez refusé le consentement"
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
                    0: "Il semblerait que l'accès à ce portail ne vous soit pas autorisé.",
                    1: "Veuillez vous connecter en utilisant un autre compte."
                },
                title: "Accès interdit"
            },
            sessionStorageDisabled: {
                subtitles: {
                    0: "Pour utiliser cette application, vous devez activer les cookies dans les paramètres" +
                        " de votre navigateur Web.",
                    1: "Pour plus d'informations sur l'activation des cookies, consultez la " +
                        "section d'aide de votre navigateur Web."
                },
                title: "Les cookies sont désactivés dans votre navigateur."
            },
            unauthorized: {
                action: "Se déconnecter",
                subtitles: {
                    0: "Il semblerait que l'accès à ce portail ne vous soit pas autorisé.",
                    1: "Veuillez vous connecter en utilisant un autre compte."
                },
                title: "Accès interdit"
            }
        },
        privacy: {
            about: {
                description: "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS uses your IP address to detect any suspicious login attempts to your account.",
                            1: "WSO2 IS uses attributes like your first name, last name, etc., to provide a rich and" +
                                " personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1: "WSO2 IS collects your information only to serve your access requirements. For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "Collecting information from the user profile page where you enter your personal" +
                                    " data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3: "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1: "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2: "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3: "Entities, organizations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organization or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1: "This privacy policy is for the informational purposes of the entity or persons " +
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
                    description: "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description: "Please note that the organization, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2: "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1: "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1: "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2: "If you do not have an account and you do not agree with our privacy policy, " +
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
                            para1: "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2: "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1: "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the organization you are registered under, or the " +
                                "super-administrator if you do not use the organization feature.",
                            para2: "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1: "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2: "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1: "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2: "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1: "WSO2 IS will only use your personal information for the purposes for which it was " +
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
                            0: "Your user name (except in cases where the user name created by your employer is " +
                                "under contract)",
                            1: "Your date of birth/age",
                            2: "IP address used to log in",
                            3: "Your device ID if you use a device (E.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (E.g., phone or tablet)",
                            3: "Operating system and generic browser information"
                        },
                        para1: "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2: "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        sidePanel: {
            privacy: "Confidentialité"
        },
        validations: {
            inSecureURL: {
                description: "L'URL saisie est une URL non-SSL. Veuillez procéder avec prudence.",
                heading: "URL non-SSL"
            },
            unrecognizedURL: {
                description: "L'URL saisie n'est ni HTTP ni HTTPS. Veuillez procéder avec prudence.",
                heading: "URL non reconnue"
            }
        }
    },
    develop: {
        componentExtensions: {
            component: {
                application: {
                    quickStart: {
                        title: "Démarrage rapide"
                    }
                }
            }
        },
        features: {
            URLInput: {
                withLabel: {
                    negative: {
                        content: "Vous devez activer CORS pour l'origine de cette URL pour envoyer des requêtes à "+
                            "{{productName}} à partir d'un navigateur.",
                        detailedContent: {
                            0: "",
                            1: ""
                        },
                        header: "CORS n'est pas autorisé pour",
                        leftAction: "Autoriser"
                    },
                    positive: {
                        content: "L'origine de cette URL est autorisée à envoyer des requêtes aux API " +
                        "{{productName}} à partir d'un navigateur.",
                        detailedContent: {
                            0: "",
                            1: ""
                        },
                        header: "CORS est autorisé pour"
                    }
                }
            },
            applications: {
                addWizard: {
                    steps: {
                        generalSettings: {
                            heading: "Paramètres généraux"
                        },
                        protocolConfig: {
                            heading: "Configuration du protocole"
                        },
                        protocolSelection: {
                            heading: "Sélection du protocole"
                        },
                        summary: {
                            heading: "Résumé",
                            sections: {
                                accessURL: {
                                    heading: "URL d'accès"
                                },
                                applicationQualifier: {
                                    heading: "Qualificatif de l'application"
                                },
                                assertionURLs: {
                                    heading: "URL(s) du consommateur d'assertion"
                                },
                                audience: {
                                    heading: "Audience"
                                },
                                callbackURLs: {
                                    heading: "URL(s) de redirection"
                                },
                                certificateAlias: {
                                    heading: "Alias de certificat"
                                },
                                discoverable: {
                                    heading: "Découvrable"
                                },
                                grantType: {
                                    heading: "Grant Type(s)"
                                },
                                issuer: {
                                    heading: "Émetteur"
                                },
                                metaFile: {
                                    heading: "Fichier Méta(encodé en Base64)"
                                },
                                metadataURL: {
                                    heading: "URL des métadonnées"
                                },
                                public: {
                                    heading: "Public"
                                },
                                realm: {
                                    heading: "Domaine d'identité"
                                },
                                renewRefreshToken: {
                                    heading: "Renouveler le RefreshToken"
                                },
                                replyTo: {
                                    heading: "Répondre à"
                                }
                            }
                        }
                    }
                },
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Par exemple, nom, description, etc."
                            },
                            filterCondition: {
                                placeholder: "Par exemple, commence par etc."
                            },
                            filterValue: {
                                placeholder: "Saisir une valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Chercher par nom d'application"
                },
                confirmations: {
                    addSocialLogin: {
                        content : "Pour ajouter une nouvelle connexion sociale, nous devrons vous diriger " +
                            "vers une autre page et toutes les modifications non enregistrées de cette page " +
                            "seront perdues. Veuillez confirmer.",
                        header: "Êtes-vous sûr?",
                        subHeader: "Cette action est irréversible."
                    },
                    certificateDelete: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "N/A",
                        header: "Es-tu sûr?",
                        message: "Cette action est irréversible et supprimera définitivement le certificat.",
                        primaryAction: "Effacer",
                        secondaryAction: "Annuler"
                    },
                    changeProtocol: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Cette action est irréversible et supprimera définitivement " +
                            "les configurations de protocole actuelles",
                        header: "Êtes-vous sûr?",
                        message: "Si vous passez à un autre protocole, " +
                            "les configurations {{name}} seront supprimées. Veuillez procéder avec prudence."
                    },
                    clientSecretHashDisclaimer: {
                        forms: {
                            clientIdSecretForm: {
                                clientId: {
                                    hide: "Masquer l'ID",
                                    label: "Identifiant du client",
                                    placeholder: "identité du client",
                                    show: "Afficher l'ID",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                },
                                clientSecret: {
                                    hideSecret: "Cacher le secret",
                                    label: "Secret du client",
                                    placeholder: "Saisir le secret du client",
                                    showSecret: "Montrez le secret",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                }
                            }
                        },
                        modal: {
                            assertionHint: "",
                            content: "",
                            header: "Informations d'identification de l'application OAuth",
                            message: "La valeur du secret du consommateur ne sera affichée qu'une seule fois en " +
                                "texte brut.Veuillez vous assurer de la copier et de la sauvegarder dans un " +
                                "endroit sûr."
                        }
                    },
                    deleteApplication: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Toutes les applications qui en dépendent risquent également " +
                            "de ne plus fonctionner. Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement l'application."
                    },
                    deleteOutboundProvisioningIDP: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous supprimez cet IDP de provisionnement sortant, vous ne pourrez pas " +
                            "le récupérer. Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement l'IDP."
                    },
                    deleteProtocol: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous supprimez ce protocole, vous ne pourrez pas le récupérer. Toutes les " +
                            "applications qui en dépendent risquent également de ne plus fonctionner. " +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le protocole."
                    },
                    handlerAuthenticatorAddition: {
                        assertionHint: "Veuillez taper <1>{{ id }}</1> pour confirmer.",
                        content: "L'authentificateur que vous essayez d'ajouter est un gestionnaire. Assurez-vous " +
                            "d'ajouter des authentificateurs dans les autres étapes.",
                        header: "Vous ajoutez un gestionnaire",
                        message: "C'est un gestionnaire."
                    },
                    lowOIDCExpiryTimes: {
                        assertionHint: "Continuez avec les valeurs existantes.",
                        content: "Vous avez entré une valeur inférieure à 60 secondes pour la ou les " +
                            "configuration(s) suivante.",
                        header: "Etes-vous sûr ?",
                        message: "Veuillez vérifier vos valeurs."
                    },
                    reactivateOIDC: {
                        assertionHint: "Veuillez saisir <1> {{id}} </1> pour réactiver l'application.",
                        content: "Si vous réactivez l'application, un nouveau secret client sera " +
                            "généré. Veuillez mettre à jour le secret du client d'application " +
                            "sur votre application cliente.",
                        header: "Êtes-vous sûr?",
                        message: ""
                    },
                    reactivateSPA: {
                        assertionHint: "Veuillez saisir <1> {{id}} </1> pour réactiver l'application.",
                        content: "Si vous réactivez l'application, les flux d'authentification pour " +
                            "cette application commenceront à fonctionner. Veuillez procéder " +
                            "avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action peut être annulée en révoquant l'ID client ultérieurement."
                    },
                    regenerateSecret: {
                        assertionHint: "Veuillez saisir <1> {{id}} </1> pour régénérer le secret client.",
                        content: "Si vous régénérez le secret client, les flux d'authentification " +
                                 "utilisant l'ancien secret client pour cette application cesseront " +
                                 "de fonctionner. Veuillez mettre à jour le secret du client " +
                                 "d'application sur votre application cliente.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et modifie définitivement " +
                                 "le secret client. Veuillez procéder avec prudence."
                    },
                    removeApplicationUserAttribute: {
                        content : "Si vous supprimez cela, l'attribut d'objet sera défini sur " +
                            "<1>{{ default }}</1>",
                        header: "Etes-vous sûr ?",
                        subHeader: "Vous essayez de supprimer l'attribut d'objet"
                    },
                    removeApplicationUserAttributeMapping: {
                        content : "Si vous confirmez cette action, vous devez sélectionner un nouvel attribut de sujet",
                        header: "Etes-vous sûr ?",
                        subHeader: "Vous essayez de supprimer l'attribut d'objet"
                    },
                    revokeApplication: {
                        assertionHint: "Veuillez saisir <1> {{id}} </1> pour confirmer.",
                        content: "Cette action peut être annulée en activant l'application ultérieurement.",
                        header: "Êtes-vous sûr?",
                        message: "Si vous révoquez cette application, les flux d'authentification " +
                                 "pour cette application cesseront de fonctionner. Veuillez " +
                                 "procéder avec prudence."
                    }
                },
                dangerZoneGroup: {
                    deleteApplication: {
                        actionTitle: "Supprimer",
                        header: "Supprimer l'application",
                        subheader: "Une fois l'application supprimée, elle ne peut pas être récupérée et les " +
                            "clients utilisant cette application ne fonctionneront plus."
                    },
                    header: "Zone de danger"
                },
                edit: {
                    sections: {
                        access: {
                            addProtocolWizard: {
                                heading: "Ajouter un protocole",
                                steps: {
                                    protocolSelection: {
                                        manualSetup: {
                                            emptyPlaceholder: {
                                                subtitles: "Tous les protocoles ont été configurés",
                                                title: "Aucun modèle disponible"
                                            },
                                            heading: "Configuration manuelle",
                                            subHeading: "Ajouter un protocole avec des configurations personnalisées"
                                        },
                                        quickSetup: {
                                            emptyPlaceholder: {
                                                subtitles: "Tous les protocoles ont été configurés",
                                                title: "Aucun modèle disponible"
                                            },
                                            heading: "Installation rapide",
                                            subHeading: "Obtenir la configuration du protocole à partir d'un modèle"
                                        }
                                    }
                                },
                                subHeading: "Ajouter un nouveau protocole à l'application {{appName}}"
                            },
                            protocolLanding: {
                                heading: "Quel protocole utilisez-vous?",
                                subHeading: "Sélectionnez le protocole de connexion de votre application."
                            },
                            tabName: "Protocole"
                        },
                        advanced: {
                            tabName: "Avancé"
                        },
                        attributes: {
                            attributeMappingChange: {
                                error: {
                                    description: "Les attributs mappés ont été modifiés en valeurs par défaut.",
                                    message: "Mappage d'attributs modifié"
                                }
                            },
                            forms: {
                                fields: {
                                    dynamic: {
                                        applicationRole: {
                                            label: "Rôle applicatif",
                                            validations: {
                                                duplicate: "Ce rôle est déjà associé. Veuillez sélectionner " +
                                                    "un autre rôle",
                                                empty: "Veuillez entrer un attribut à associer"
                                            }
                                        },
                                        localRole: {
                                            label: "Rôle local",
                                            validations: {
                                                empty: "Veuillez entrer le rôle local"
                                            }
                                        }
                                    }
                                }
                            },
                            roleMapping: {
                                heading: "Association des rôles"
                            },
                            selection: {
                                addWizard: {
                                    header: "Configurer les attributs utilisateur",
                                    steps: {
                                        select: {
                                            transfer: {
                                                headers: {
                                                    attribute: "Sélectionnez tous les attributs utilisateur"
                                                },
                                                searchPlaceholders: {
                                                    attribute: "Rechercher un attribut utilisateur",
                                                    role: "Chercher un rôle"
                                                }
                                            }
                                        }
                                    },
                                    subHeading: "Sélectionnez les attributs utilisateur à inclure dans la " +
                                        "réponse d'authentification."
                                },
                                attributeComponentHint: "Gérez les attributs utilisateur que vous souhaitez partager" +
                                    " avec cette application.",
                                attributeComponentHintAlt: "Gérez les attributs utilisateur que vous souhaitez" +
                                    " partager avec cette application. Vous pouvez ajouter de nouveaux attributs et " +
                                    "mappages en accédant à <1>Attributs</1>",
                                description: "Ajoutez les attributs utilisateur autorisés à être partagés avec cette " +
                                    "application.",
                                heading: "Sélection des attributs utilisateur",
                                mandatoryAttributeHint: "Marquez les attributs utilisateur qui doivent " +
                                    "obligatoirement être partagés avec l'application. Lors de la connexion, " +
                                    "{{productName}} invite l'utilisateur à saisir ces valeurs d'attribut, si elles " +
                                    "ne sont pas déjà fournies dans le profil de l'utilisateur.",
                                mappingTable: {
                                    actions: {
                                        enable: "Activer l'association"
                                    },
                                    columns: {
                                        appAttribute: "Attribut utilisateur de l'application mappée",
                                        attribute: "Attribut utilisateur",
                                        mandatory: "Obligatoire",
                                        requested: "Demandé"
                                    },
                                    listItem: {
                                        actions: {
                                            makeMandatory: "Rendre obligatoire",
                                            makeRequested: "Rendre demandable",
                                            removeMandatory: "Retirer l'obligation",
                                            removeRequested: "Retirer la demandabilité",
                                            subjectDisabledSelection: "Cet attribut est obligatoire car il " +
                                                "s'agit de l'attribut sujet."
                                        },
                                        faultyAttributeMapping: "Mappage d'attribut OpenID Connect manquant",
                                        faultyAttributeMappingHint: "La valeur d'attribut ne sera pas partagée" +
                                            " avec l'application lors de la connexion de l'utilisateur.",
                                        fields: {
                                            claim: {
                                                label: "Veuillez entrer une valeur",
                                                placeholder: "ex: {{name}} personnalisé, nouveau {{name}}"
                                            }
                                        }
                                    },
                                    mappedAtributeHint: "Au lieu d'envoyer l'attribut par défaut, l'attribut mappé "  +
                                        "personnalisé sera envoyé",
                                    mappingRevert: {
                                        confirmPrimaryAction: "Confirmer",
                                        confirmSecondaryAction: "Annuler",
                                        confirmationContent: "Ces attributs personnalisés mappés aux attributs par " +
                                            "défaut pertinents seront rétablis aux valeurs mappées par défaut par " +
                                            "cette action. Veuillez l'utiliser avec précaution car vous ne pourrez " +
                                            "pas récupérer les valeurs d'attribut personnalisé mappées.",
                                        confirmationHeading: "Confirmer le basculement du mappage des " +
                                            "revendications sur la valeur par défaut",
                                        confirmationMessage: "Cette action rétablira les valeurs mappées aux " +
                                            "valeurs par défaut."
                                    },
                                    searchPlaceholder: "Attributs de recherche"
                                },
                                selectAll: "Sélectionnez tous les attributs"
                            },
                            tabName: "Attributs Utilisateur"
                        },
                        general: {
                            tabName: "Général"
                        },
                        info: {
                            oidcHeading: "Points de terminaison du serveur",
                            oidcSubHeading: "Les points de terminaison de serveur suivants vous seront utiles pour " +
                                "implémenter et configurer l'authentification pour votre application à l'aide " +
                                "d'OpenID Connect.",
                            samlHeading: "Détails du fournisseur d'identité",
                            samlSubHeading: "Les détails de l'IdP suivants vous seront utiles pour implémenter et " +
                                "configurer l'authentification pour votre application à l'aide de SAML 2.0.",
                            tabName: "Info"
                        },
                        provisioning: {
                            inbound: {
                                heading: "Provisionnement entrant",
                                subHeading: "Provisionner des utilisateurs ou des groupes vers un annuaire de " +
                                    "WSO2 Identity Server’ via une application."
                            },
                            outbound: {
                                actions: {
                                    addIdp: "Nouveau fournisseur d'identité"
                                },
                                addIdpWizard: {
                                    errors: {
                                        noProvisioningConnector: "Le fournisseur d'identité sélectionné n'a aucun " +
                                            "connecteur de provisioning."
                                    },
                                    heading: "Ajouter un IDP de provisionnement sortant",
                                    steps: {
                                        details: "Détails de l'IDP"
                                    },
                                    subHeading: "Sélectionnez l'IDP pour approvisionner les utilisateurs qui " +
                                        "s'auto-enregistrent dans votre application."
                                },
                                heading: "Provisionnement sortant",
                                subHeading: "Configurer un fournisseur d'identité pour l'aprovisionnement " +
                                    "sortant des utilisateurs de cette application."
                            },
                            tabName: "Provisionnement"
                        },
                        signOnMethod: {
                            sections: {
                                authenticationFlow: {
                                    heading: "Flux d'authentification",
                                    sections: {
                                        scriptBased: {
                                            accordion: {
                                                title: {
                                                    description: "Contrôlez votre flux d'authentification à l'aide " +
                                                        "d'un script.",
                                                    heading: "Authentification conditionnelle"
                                                }
                                            },
                                            conditionalAuthTour: {
                                                steps: {
                                                    0: {
                                                        content: {
                                                            0: "Configurez le flux de connexion pour l'adapter " +
                                                                "à la situation ou à l'utilisateur pendant le " +
                                                                "processus d'authentification.",
                                                            1: "Cliquez sur le bouton <1>Suivant</1> pour en savoir " +
                                                                "plus sur le processus."
                                                        },
                                                        heading: "Authentification conditionnelle"
                                                    },
                                                    1: {
                                                        content: {
                                                            0: "Cliquez sur ce bouton pour ajouter les options " +
                                                                "d'authentification requises à l'étape."
                                                        },
                                                        heading: "Ajouter une authentification"
                                                    },
                                                    2: {
                                                        content: {
                                                            0: "Cliquez ici si vous devez ajouter d'autres étapes " +
                                                                "au flux. Une fois que vous avez ajouté une nouvelle " +
                                                                "étape, <1>executeStep(STEP_NUMBER);</1> apparaîtra " +
                                                                "dans l'éditeur de script."
                                                        },
                                                        heading: "Ajouter une nouvelle étape"
                                                    }
                                                }
                                            },
                                            editor: {
                                                apiDocumentation: "Documentation API",
                                                changeConfirmation: {
                                                    content: "Le modèle sélectionné remplacera le script existant " +
                                                        "dans l'éditeur ainsi que les étapes de connexion que " +
                                                        "vous avez configurées. Cliquez sur <1>Confirmer</1> pour " +
                                                        "continuer.",
                                                    heading: "Êtes-vous sûr?",
                                                    message: "Cette action est irréversible."
                                                },
                                                goToApiDocumentation: "Accéder à la documentation API",
                                                resetConfirmation: {
                                                    content: "Cette action réinitialisera le script existant dans " +
                                                        "l'éditeur par défaut. Cliquez sur <1>Confirmer</1> " +
                                                        "pour continuer.",
                                                    heading: "Êtes-vous sûr?",
                                                    message: "Cette action est irréversible."
                                                },
                                                templates: {
                                                    darkMode: "Mode sombre",
                                                    heading: "Modèles"
                                                }
                                            },
                                            heading: "Configuration basée sur des scripts",
                                            hint: "Définissez le flux d'authentification via un script adaptatif. " +
                                                "Vous pouvez sélectionner l'un des modèles du panneau pour commencer.",
                                            secretsList: {
                                                create: "Créer un nouveau secret",
                                                emptyPlaceholder: "Aucun secret disponible",
                                                search: "Recherche par nom secret",
                                                tooltips: {
                                                    keyIcon: "Stockez en toute sécurité les clés d'accès en tant que " +
                                                        "secrets. Les secrets peuvent remplacer la clé API dans la " +
                                                        "fonction <1>callChoreo</1> pour l'authentification " +
                                                        "conditionnelle.",
                                                    plusIcon: "Ajouter au script"
                                                }
                                            }
                                        },
                                        stepBased: {
                                            actions: {
                                                addAuthentication: "Ajouter une authentification",
                                                addNewStep: "Ajouter une nouvelle étape",
                                                addStep: "Nouvelle étape d'authentification",
                                                selectAuthenticator: "Sélectionner un authentificateur"
                                            },
                                            addAuthenticatorModal: {
                                                content: {
                                                    addNewAuthenticatorCard: {
                                                        title: "Configurer un nouveau fournisseur d'identité"
                                                    },
                                                    authenticatorGroups: {
                                                        basic: {
                                                            description: "Ensemble d'authentificateurs de base " +
                                                                "pris en charge par {{productName}}.",
                                                            heading: "De base"
                                                        },
                                                        enterprise: {
                                                            description: "Connexion d'entreprise via des protocoles " +
                                                                "standard.",
                                                            heading: "Connexion Entreprise"
                                                        },
                                                        mfa: {
                                                            description: "Ajoutez une couche de sécurité " +
                                                                "supplémentaire à votre flux de connexion.",
                                                            heading: "Options multifactorielles"
                                                        },
                                                        social: {
                                                            description: "Utiliser les informations de connexion " +
                                                                "existantes d'un fournisseur de réseau social.",
                                                            heading: "Connexion sociale"
                                                        }
                                                    },
                                                    goBackButton: "Revenir à la Sélection",
                                                    search: {
                                                        placeholder: "Rechercher des authentificateurs"
                                                    },
                                                    stepSelectDropdown: {
                                                        hint: "Sélectionnez l'étape à laquelle vous souhaitez " +
                                                            "ajouter des authentificateurs.",
                                                        label:  "Sélectionnez l'étape",
                                                        placeholder: "Sélectionnez l'étape"
                                                    }
                                                },
                                                description: null,
                                                heading: "Ajouter une authentification",
                                                primaryButton: null,
                                                secondaryButton: null
                                            },
                                            authenticatorDisabled: "Vous devez configurer cet authentificateur en " +
                                                "fournissant un identifiant et un secret client, à utiliser avec " +
                                                "vos applications.",
                                            firstFactorDisabled: "L'authentificateur Identifier First " +
                                                "et l'authentificateur Nom d'utilisateur et mot de passe " +
                                                "ne peuvent pas être ajoutés à la même étape.",
                                            forms: {
                                                fields: {
                                                    attributesFrom: {
                                                        label: "Utilisez les attributs de",
                                                        placeholder: "Sélectionner une étape"
                                                    },
                                                    subjectIdentifierFrom: {
                                                        label: "Choisissez l'identifiant de l'utilisateur à partir " +
                                                            "de cette étape",
                                                        placeholder: "Sélectionner une étape"
                                                    }
                                                }
                                            },
                                            heading: "Configuration par étapes",
                                            hint: "Créez des étapes d'authentification en faisant glisser les " +
                                                "authentificateurs locaux/fédérés vers les étapes correspondantes.",
                                            magicLinkDisabled: "Vous pouvez ajouter l'authentificateur Magic Link " +
                                                "uniquement à la deuxième étape, et uniquement " +
                                                "lorsque l'authentificateur Identifier First est présent " +
                                                "à la première étape.",
                                            secondFactorDisabled: "Les authentificateurs de second facteur ne " +
                                                "peuvent être utilisés que si <1>Nom d’utilisateur et mot de passe" +
                                                "</1> ou tout autre gestionnaire tel que <3>Identifiant d’abord " +
                                                "</3>qui peut gérer ces facteurs est présent dans une étape " +
                                                "précédente.",
                                            secondFactorDisabledDueToProxyMode: "Pour configurer" +
                                                " <1>{{auth}}</1>, vous devez activer le paramètre" +
                                                " d'approvisionnement juste-à-temps à partir des" +
                                                " fournisseurs d'identité suivants.",
                                            secondFactorDisabledInFirstStep: "Les authentificateurs de deuxième " +
                                                "facteur ne peuvent pas être utilisés dans la première étape."
                                        }
                                    }
                                },
                                customization: {
                                    heading: "Personnaliser la méthode de connexion",
                                    revertToDefaultButton: {
                                        hint: "Revenir à la configuration par défaut (nom d'utilisateur et " +
                                            "mot de passe)",
                                        label: "Rétablir la valeur par défaut"
                                    }
                                },
                                landing: {
                                    defaultConfig: {
                                        description: {
                                            0: "Votre application est déjà configurée pour fonctionner avec " +
                                                "l'authentification par nom d'utilisateur et mot de passe.",
                                            1: "Sélectionnez l'une des options disponibles sur le côté droit pour " +
                                                "commencer la personnalisation."
                                        },
                                        heading: "Application configurée avec nom d'utilisateur et mot de passe " +
                                            "de connexion"
                                    },
                                    flowBuilder: {
                                        addMissingSocialAuthenticatorModal: {
                                            content: {
                                                body: "Vous n'avez pas de connexion sociale" +
                                                    " active configurée avec " +
                                                    "<1>{{authenticator}} Authenticator</1>. Cliquez sur " +
                                                    "<3>Configurer</3> bouton pour lancer le" +
                                                    " processus de " +
                                                    "configuration ou accéder à la" +
                                                    " section <5>{{authenticator}} " +
                                                    "Connexion Sociale</5> manuellement.",
                                                message: "Aucun fournisseur Connexion sociale" +
                                                    " {{authenticator}} configuré"
                                            },
                                            description: "",
                                            heading: "Configurer le fournisseur Connexion " +
                                                "sociale {{authenticator}}",
                                            primaryButton: "Configurer",
                                            secondaryButton: "Annuler"
                                        },
                                        duplicateSocialAuthenticatorSelectionModal: {
                                            content: {
                                                body: "Vous avez plusieurs fournisseurs " +
                                                    "Connexions sociales" +
                                                    " configurés " +
                                                    "avec <1> {{authenticator}} Authenticator </1>. " +
                                                    "Sélectionnez celui de votre choix dans la sélection " +
                                                    "ci-dessous pour continuer.",
                                                message: "Plusieurs fournisseurs Connexions" +
                                                    " sociales trouvés avec " +
                                                    "{{authenticator}} Authenticator."
                                            },
                                            description: "",
                                            heading: "Sélectionnez le fournisseur Connexion" +
                                                " sociale {{authenticator}}",
                                            primaryButton: "Continuer",
                                            secondaryButton: "Annuler"
                                        },
                                        heading: "Commencez à créer votre flux de connexion",
                                        headings: {
                                            default: "Connexion par défaut",
                                            multiFactorLogin: "Connexion multi-facteurs",
                                            passwordlessLogin: "Connexion sans mot de passe",
                                            socialLogin: "Connexion sociale"
                                        },
                                        types: {
                                            defaultConfig: {
                                                description: "Créez votre flux de connexion en commençant par la " +
                                                    "connexion Nom d'utilisateur et mot de passe.",
                                                heading: "Commencer avec la configuration par défaut"
                                            },
                                            facebook: {
                                                description: "Permettre aux utilisateurs de se connecter avec " +
                                                    "Facebook.",
                                                heading: "Ajouter une connexion Facebook"
                                            },
                                            github: {
                                                description: "Autorisez les utilisateurs à se connecter avec GitHub.",
                                                heading: "Ajouter une connexion GitHub"
                                            },
                                            google: {
                                                description: "Permettre aux utilisateurs de se connecter avec Google.",
                                                heading: "Ajouter une connexion Google"
                                            },
                                            magicLink: {
                                                description: "Permettre aux utilisateurs de se connecter " +
                                                    "en utilisant un lien magique envoyé à leur adresse e-mail.",
                                                heading: "Ajouter une connexion Magic Link",
                                                warning: "Vous ne pouvez utiliser l'authentificateur Identifier " +
                                                    "First qu'avec l'authentificateur Magic Link. L'utiliser avec " +
                                                    "n'importe quel autre authentificateur peut entraîner un " +
                                                    "comportement inattendu."

                                            },
                                            totp: {
                                                description: "Activez une couche d'authentification supplémentaire " +
                                                    "avec OTP basé sur le temps.",
                                                heading: "Ajouter TOTP comme deuxième facteur"
                                            },
                                            usernameless: {
                                                description: "Permettre aux utilisateurs de se connecter à " +
                                                    "l'aidAjouter une connexion sans nom d'utilisateuré " +
                                                    "FIDO2 ou de la biométrie.",
                                                heading: "Ajouter une clé de sécurité/connexion biométrique",
                                                info: "Pour vous connecter avec une authentification sans mot " +
                                                    "de passe, vos utilisateurs doivent avoir leurs clés de " +
                                                    "sécurité FIDO2 ou leurs données biométriques enregistrées " +
                                                    "via Mon compte."
                                            }
                                        }
                                    }
                                },
                                requestPathAuthenticators: {
                                    notifications: {
                                        getRequestPathAuthenticators: {
                                            error: {
                                                description: "{{ description }}",
                                                message: "Erreur de récupération"
                                            },
                                            genericError: {
                                                description: "An error occurred while retrieving request path " +
                                                    "authenticators.",
                                                message: "Erreur de récupération"
                                            },
                                            success: {
                                                description: "",
                                                message: ""
                                            }
                                        }
                                    },
                                    subTitle: "Les authentificateurs locaux pour l'authentification par chemin de " +
                                        "requête.",
                                    title: "Authentification du chemin de requête"
                                },
                                templateDescription: {
                                    description: {
                                        code: "Code",
                                        defaultSteps: "Default Steps",
                                        description: "Description",
                                        helpReference: "Aide Référence",
                                        parameters: "Paramètres",
                                        prerequisites: "Prérequis"
                                    },
                                    popupContent: "Plus de détails"
                                }
                            },
                            tabName: "Méthode de connexion"
                        }
                    }
                },
                forms: {
                    advancedAttributeSettings: {
                        sections: {
                            role: {
                                fields: {
                                    role: {
                                        hint: "Cette option ajoutera au rôle le domaine de l'annuaire dans lequel " +
                                            "l'utilisateur réside",
                                        label: "Inclure le domaine utilisateur",
                                        validations: {
                                            empty: "Sélectionner l'attribut de rôle"
                                        }
                                    },
                                    roleAttribute: {
                                        hint: "Choisissez l'attribut",
                                        label: "Attribut de rôle",
                                        validations: {
                                            empty: "Sélectionner l'attribut de rôle"
                                        }
                                    }
                                },
                                heading: "Rôle"
                            },
                            subject: {
                                fields:{
                                    subjectAttribute: {
                                        hint: "Sélectionnez les attributs partagés que vous souhaitez utiliser " +
                                            "comme identifiant de sujet de l'utilisateur.",
                                        hintOIDC: "Sélectionnez les attributs partagés que vous souhaitez utiliser " +
                                            "comme identifiant de sujet de l'utilisateur. Cela représente la " +
                                            "revendication <1>sub</1> du <1>id_token</1>.",
                                        hintSAML: "Sélectionnez les attributs partagés que vous souhaitez utiliser" +
                                            " comme identifiant de sujet de l'utilisateur. Ceci représente l'élément" +
                                            " <1>subject</1> de l'assertion SAML.",
                                        label: "Attribut de sujet",
                                        validations: {
                                            empty: "Sélectionner l'attribut de sujet"
                                        }
                                    },
                                    subjectIncludeTenantDomain: {
                                        hint: "Cette option ajoutera le nom de l'organisation à l'identifiant du" +
                                            " sujet local",
                                        label: "Inclure le nom de l'organisation",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    subjectIncludeUserDomain: {
                                        hint: "Cette option ajoutera le domaine de l'annuaire dans lequel " +
                                            "l'utilisateur réside dans l'identifiant du sujet",
                                        label: "Inclure le domaine de l'utilisateur",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    subjectUseMappedLocalSubject: {
                                        hint: "Cette option utilisera l'identifiant local associé comme sujet " +
                                            "pour revendiquer l'identité",
                                        label: "Utiliser un sujet local associé",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "Sujet"
                            }
                        }
                    },
                    advancedConfig: {
                        fields: {
                            enableAuthorization: {
                                hint: "Décide si les politiques d'autorisation doivent être engagées " +
                                    "pendant les flux d'authentification.",
                                label: "Activer les autorisations",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            },
                            returnAuthenticatedIdpList: {
                                hint: "La liste des fournisseurs d'identité authentifiés sera renvoyée dans " +
                                    "la réponse d'authentification.",
                                label: "Retourne la liste des IDP authentifiés",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            },
                            saas: {
                                hint: "Par défaut, les applications ne peuvent être utilisées que par les" +
                                    " utilisateurs appartenant à l'organisation de l'application. Si cette" +
                                    " application est compatible SaaS, elle sera accessible à tous les utilisateurs" +
                                    " de toutes les organisations.",
                                label: "Application SaaS",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            },
                            skipConsentLogin: {
                                hint: "Le consentement de l'utilisateur sera ignoré pendant le processus de connexion.",
                                label: "Sauter le consentement à la connexion",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            },
                            skipConsentLogout: {
                                hint: "Le consentement de l'utilisateur sera ignoré pendant le processus de " +
                                    "déconnexion.",
                                label: "Sauter le consentement à la déconnexion",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            }
                        },
                        sections: {
                            certificate: {
                                fields: {
                                    jwksValue: {
                                        description: "L'URL utilisée pour obtenir une clé publique JWKS.",
                                        label: "URL",
                                        placeholder: "https://myapp.io/jwks",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire.",
                                            invalid: "Ceci n'est pas une URL valide"
                                        }
                                    },
                                    pemValue: {
                                        actions: {
                                            view: "Voir les informations sur le certificat"
                                        },
                                        description: "La valeur texte du certificat au format PEM.",
                                        hint: "Le certificat ( au format PEM ) de l'application.",
                                        label: "Certificat",
                                        placeholder: "Certificat au format PEM.",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire.",
                                            invalid: "Entrez un certificat valide au format PEM"
                                        }
                                    },
                                    type: {
                                        children: {
                                            jwks: {
                                                label: "Utiliser le point d'entrée JWKS"
                                            },
                                            pem: {
                                                label: "Fournir un certificat"
                                            }
                                        },
                                        label: "Type"
                                    }
                                },
                                heading: "Certificat",
                                hint: {
                                    customOidc: "Ce certificat est utilisé pour chiffrer le <1>id_token</1>" +
                                        " renvoyé après l'authentification.",
                                    customSaml: "Ce certificat permet de valider les signatures des " +
                                        "requêtes signées et de chiffrer les assertions SAML renvoyées " +
                                        "après authentification."
                                }
                            }
                        }
                    },
                    generalDetails: {
                        fields: {
                            accessUrl: {
                                hint: "L'URL de la page de destination de cette application. Il sera utilisé dans" +
                                    " le catalogue d'applications et les flux de découverte. Si la page de" +
                                    " connexion expire, l'utilisateur sera redirigé vers l'application" +
                                    " client via cette URL.",
                                label: "URL d'accès",
                                placeholder: "https://myapp.io/home",
                                validations: {
                                    empty: "Une URL d'accès valide doit être fournie pour" +
                                        " rendre cette application détectable.",
                                    invalid: "Ceci n'est pas une URL valide"
                                }
                            },
                            description: {
                                label: "Description",
                                placeholder: "Saisissez une description pour l'application"
                            },
                            discoverable: {
                                hint: "Activez pour rendre l'application visible aux utilisateurs finaux sur " +
                                    "leur catalogue d'applications <1>{{ myAccount }}</1>.",
                                label: "Application découvrable"
                            },
                            imageUrl: {
                                description: "Une URL d'image pour l'application. Si cela n'est pas fourni, nous " +
                                    "afficherons une vignette générée à la place. Taille recommandée: 200x200 pixels",
                                label: "Logo",
                                placeholder: "https://myapp-resources.io/my_app_image.png",
                                validations: {
                                    invalid: "Ceci n'est pas une URL d'image valide"
                                }
                            },
                            isManagementApp: {
                                hint: "Activez pour autoriser l'application à accéder à l'API de gestion de cette " +
                                "organisation.",
                                label: "Application de gestion"
                            },
                            name: {
                                label: "Nom",
                                placeholder: "Mon appli",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            }
                        },
                        managementAppBanner: "L'application est autorisée à accéder aux API de gestion de cette " +
                            "organisation."
                    },
                    inboundCustom: {
                        fields: {
                            checkbox: {
                                label: "{{label}}",
                                validations: {
                                    empty: "Fournir un {{name}}"
                                }
                            },
                            dropdown: {
                                label: "{{label}}",
                                placeholder: "Saisir un {{name}}",
                                validations: {
                                    empty: "Fournir un {{name}}"
                                }
                            },
                            generic: {
                                label: "{{label}}",
                                validations: {
                                    empty: "Sélectionner le {{name}}"
                                }
                            },
                            password: {
                                label: "{{label}}",
                                placeholder: "Saisir un {{name}}",
                                validations: {
                                    empty: "Fournir un {{name}}"
                                }
                            }
                        }
                    },
                    inboundOIDC: {
                        description: "Ci-dessous sont les paramètres {{protocol}} pour votre application",
                        documentation: "Lisez notre <1>documentation</1> pour en savoir plus sur l'utilisation " +
                            "du protocole <3>{{protocol}}</3> pour implémenter la connexion dans vos applications.",
                        fields: {
                            allowedOrigins: {
                                hint: "Les origines autorisées sont des URL qui seront autorisées à effectuer " +
                                    "des requêtes depuis des origines tierces vers les APIs de {{productName}} ",
                                label: "Origines autorisées",
                                placeholder: "https://myapp.io",
                                validations: {
                                    empty: "Veuillez ajouter une origine valide."
                                }
                            },
                            callBackUrls: {
                                hint: "L'URL de redirection détermine où le code d'autorisation est envoyé lors " +
                                    "de l'authentification de l'utilisateur et vers lequel l'utilisateur est " +
                                    "redirigé lors de la déconnexion de l'utilisateur. L'application cliente " +
                                    "doit spécifier l'URL de redirection dans la demande d'autorisation ou de " +
                                    "déconnexion et {{productName}} la validera par rapport aux URL de redirection " +
                                    "entrées ici.",
                                info: "Vous n’avez pas d’application? Essayez un exemple d'application " +
                                    "en utilisant {{callBackURLFromTemplate}} comme URL autorisée.",
                                label: "URI autorisés",
                                placeholder: "https://myapp.io/login",
                                validations: {
                                    empty: "Ceci est un champ obligatoire.",
                                    invalid: "L'URL saisie n'est ni HTTP ni HTTPS. Veuillez ajouter une URL valide.",
                                    required: "Ce champ est obligatoire pour une application fonctionnelle. " +
                                        "Toutefois, si vous prévoyez d'essayer l'exemple d'application, " +
                                        "ce champ peut être ignoré."
                                }
                            },
                            clientID: {
                                label: "Identifiant du client"
                            },
                            clientSecret: {
                                hashedDisclaimer: "Le secret du client est haché. Si vous avez besoin de le " +
                                    "récupérer, veuillez régénérer à nouveau le secret.",
                                hideSecret: "Cacher le secret",
                                label: "Secret du client",
                                message: "{{productName}} n'émet pas de <1>client_secret</1>" +
                                    " aux applications natives ou aux applications basées sur un navigateur " +
                                    "Web à des fins d'authentification client.",
                                placeholder: "Saisir le secret du client",
                                showSecret: "Montrez le secret",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            },
                            grant: {
                                children: {
                                    client_credential: {
                                        hint: "La portée openid n'est pas autorisée avec ce type de subvention.",
                                        label: "(portée openid non autorisée)"
                                    },
                                    implicit: {
                                        hint: "L'utilisation de l'octroi implicite avec des applications publiques " +
                                            "n'est pas recommandée. {{productName}} adhérer aux meilleures " +
                                            "pratiques desécurité et ne pas mettre en œuvre l'octroi implicite",
                                        label: "{{grantType}} (non recommandé)"
                                    },
                                    password: {
                                        hint: "L'utilisation de l'octroi de mot de passe avec des applications " +
                                            "publiques n'est pas recommandée. {{productName}} respectez les " +
                                            "meilleures pratiques de sécurité et n'implémentez pas l'octroi " +
                                            "de mot de passe",
                                        label: "{{grantType}} (non recommandé)"
                                    }
                                },
                                hint: "Cela déterminera la manière dont l'application communique avec le service " +
                                    "de jetons.",
                                label: "Types de subvention autorisés",
                                validation: {
                                    refreshToken:"Le type d'octroi Refresh token doit être sélectionné uniquement " +
                                    "avec les types d'octroi qui fournissent un jeton d'actualisation."
                                },
                                validations: {
                                    empty: "Sélectionnez au moins un type de subvention"
                                }
                            },
                            public: {
                                hint: "Permettez au client de s'authentifier auprès d'{{productName}} sans le " +
                                    "secret client." +
                                    " Les clients publics tels que les applications exécutées dans un navigateur ou" +
                                    " sur un appareil mobile ne peuvent pas utiliser les secrets client enregistrés.",
                                label: "Client public",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            }
                        },
                        messages: {
                            customInvalidMessage: "Veuillez saisir un URI valide. Les formats valides incluent " +
                                "HTTP, HTTPS ou le schéma d'URI à usage privé.",
                            revokeDisclaimer: {
                                content: "La demande a été révoquée. Réactivez l'application pour permettre " +
                                    "aux utilisateurs de se connecter.",
                                heading: "La demande est révoquée"
                            }
                        },
                        sections: {
                            accessToken: {
                                fields: {
                                    applicationTokenExpiry: {
                                        hint: "Précisez la période de validité du " +
                                            "<1>jeton d'accès à l'application</1> en secondes.",
                                        label: "Délai d'expiration du jeton d'accès à l'application",
                                        placeholder: "Saisissez l'heure d'expiration du jeton d'accès à l'application",
                                        validations: {
                                            empty: "Veuillez remplir le délai d'expiration du jeton d'accès " +
                                                "à l'application",
                                            invalid: "Le délai d'expiration du jeton d'accès à l'application " +
                                                "doit être en secondes. Les décimales et les nombres " +
                                                "négatifs ne sont pas autorisés."
                                        }
                                    },
                                    bindingType: {
                                        children: {
                                            ssoBinding: {
                                                label: "SSO-session"
                                            }
                                        },
                                        description: "Sélectionnez le type <1>SSO-session</1> pour permettre à " +
                                            "{{productName}} de lier le <3>jeton_d'accès</3> et <5>d'actualiser " +
                                            "le jeton</5> à la session de connexion et d'émettre un nouveau jeton " +
                                            "par session. À la fin de la session d'application, les jetons seront " +
                                            "également révoqués.",
                                        label: "Type de liaison de jeton",
                                        valueDescriptions: {
                                            cookie: "Liez le jeton d'accès à un cookie avec les paramètres Secure " +
                                                "et httpOnly.",
                                            none: "Pas de liaison. {{productName}} émettra un nouveau jeton d'accès " +
                                                "uniquement lorsque le jeton expirera ou sera révoqué.",
                                            sso_session: "Lie le jeton d'accès à la session de connexion. " +
                                                "{{productName}} émettra un nouveau jeton d'accès pour chaque " +
                                                "nouvelle connexion et le révoquera lors de la déconnexion."
                                        }
                                    },
                                    expiry: {
                                        hint: "Spécifiez la période de validité du <1>jeton_d'accès</1> en secondes.",
                                        label: "Délai d'expiration du jeton d'accès utilisateur",
                                        placeholder: "Saisissez l'heure d'expiration des jetons d'accès utilisateur",
                                        validations: {
                                            empty: "Veuillez indiquer le délai d'expiration des jetons d'accès",
                                            invalid: "L'heure d'expiration du jeton d'accès doit être exprimée "
                                                +"en secondes."
                                        }
                                    },
                                    revokeToken: {
                                        hint: "Autoriser la révocation des jetons de cette application lorsqu'une " +
                                            "session IDP liée se termine par une déconnexion utilisateur.",
                                        label: "Révoquer les jetons lors de la déconnexion de l'utilisateur"
                                    },
                                    type: {
                                        label: "Type de token",
                                        valueDescriptions: {
                                            "default": "Émettez un UUID opaque en tant que jeton.",
                                            "jwt": "Émettez un jeton JWT autonome."
                                        }
                                    },
                                    validateBinding: {
                                        hint: "Validez les attributs de liaison lors de la validation du jeton. Le" +
                                            " client doit présenter le <1>jeton_d'accès</1> + cookie pour une" +
                                            " autorisation réussie.",
                                        label: "Valider les liaisons des jetons"
                                    }
                                },
                                heading: "Jeton d'accès",
                                hint: " Configurez l'émetteur du jeton d'accès, l'heure d'expiration du jeton " +
                                    "d'accès de l'utilisateur, l'heure d'expiration du jeton d'accès de "+
                                    "l'application, etc."
                            },
                            certificates: {
                                disabledPopup: "Ce certificat est utilisé pour chiffrer le <1>id_token</1>." +
                                    " Tout d'abord, vous devez désactiver le cryptage <3>id_token</3> pour continuer."
                            },
                            idToken: {
                                fields: {
                                    algorithm: {
                                        hint: "La liste déroulante contient les algorithmes de chiffrement" +
                                            " de <1>jeton_d'identification</1> pris en charge.",
                                        label: "Algorithme",
                                        placeholder: "Sélectionner un algorithme",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    audience: {
                                        hint: "Spécifiez le destinataire auquel ce <1>jeton_d'ID</1> est " +
                                            "destiné. Par défaut, l'ID client de cette application est "+
                                            "ajouté en tant qu'audience.",
                                        label: "Audience",
                                        placeholder: "Saisir l'audience",
                                        validations: {
                                            duplicate: "L'audience contient des valeurs en double",
                                            empty: "Veuillez remplir le public",
                                            invalid: "Veuillez ajouter une audience valide."
                                        }
                                    },
                                    encryption: {
                                        hint: "Sélectionnez pour crypter le <1>jetons_d'identification</1> "+
                                            "lors de l'émission "+
                                            "du jeton à l'aide de la clé publique de votre application." +
                                            " Pour utiliser le chiffrement, configurez le point de terminaison "+
                                            "JWKS ou le certificat "+
                                            "de votre application dans la section Certificat ci-dessous.",
                                        label: "Activer le chiffrement",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    expiry: {
                                        hint: "Spécifiez la période de validité du <1>jeton_ID</1> en secondes.",
                                        label: "Délai d'expiration du jeton d'identification",
                                        placeholder: "Entrez l'heure d'expiration du jeton d'identification",
                                        validations: {
                                            empty: "Veuillez indiquer l'heure d'expiration du jeton d'identification",
                                            invalid: "Le délai d'expiration du jeton d'identification doit être " +
                                                "exprimé en secondes."
                                        }
                                    },
                                    method: {
                                        hint: "La liste déroulante contient les méthodes de chiffrement" +
                                            " de <1>jeton_d'identification</1> prises en charge.",
                                        label: "Méthode de chiffrement",
                                        placeholder: "Choisissez la méthode",
                                        validations: {
                                            empty:  "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "jeton d'identification"
                            },
                            logoutURLs: {
                                fields: {
                                    back: {
                                        hint: "{{productName}} communiquera directement les demandes de déconnexion" +
                                            " à cette (ces) URL client, afin que les clients puissent" +
                                            " invalider la session utilisateur.",
                                        label: "URL de déconnexion amont",
                                        placeholder: "https://myapp.io/logout",
                                        validations: {
                                            empty: "Veuillez renseigner l'URL de déconnexion amont",
                                            invalid: "Veuillez ajouter une URL valide"
                                        }
                                    },
                                    front: {
                                        label: "URL de déconnexion aval",
                                        placeholder: "Saisir l'URL de déconnexion aval",
                                        validations: {
                                            empty: "Veuillez renseigner l'URL de déconnexion aval",
                                            invalid: "Veuillez ajouter une URL valide"
                                        }
                                    }
                                },
                                heading: "PKCE"
                            },
                            pkce: {
                                description: "La méthode par défaut utilisée par {{productName}} pour " +
                                    "générer le défi est SHA-256. Sélectionnez \"Plain\" uniquement pour les " +
                                    "environnements contraints qui ne peuvent pas utiliser la transformation SHA-256.",
                                fields: {
                                    pkce: {
                                        children: {
                                            mandatory: {
                                                label: "obligatoire"
                                            },
                                            plainAlg: {
                                                label: "Prise en charge de l'algorithme de transformation 'Plain'"
                                            }
                                        },
                                        label: "{{label}}",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "PKCE",
                                hint: "Sélectionnez cette option pour obliger l'application " +
                                "à inclure un code_challenge dans la demande d'autorisation."
                            },
                            refreshToken: {
                                fields: {
                                    expiry: {
                                        hint: "Spécifiez la période de validité du <1>jeton_d'actualisation</1> " +
                                        "en secondes.",
                                        label: "Délai d'expiration du jeton de rafraîchissement",
                                        placeholder: "Saisissez l'heure d'expiration du jeton de rafraîchissement",
                                        validations: {
                                            empty: "Veuillez indiquer le délai d'expiration du jeton de " +
                                                "rafraîchissement",
                                            invalid: "L'heure d'expiration du jeton d'actualisation doit " +
                                                "être exprimée en secondes."
                                        }
                                    },
                                    renew: {
                                        hint: "Émettez un nouveau <1>jeton_d'actualisation</1> par demande " +
                                            "d'actualisation de jeton.",
                                        label: "Faire pivoter le jeton d'actualisation",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "jeton de rafraîchissement"
                            },
                            requestObjectSignature: {
                                description: "{{productName}} prend en charge la réception des paramètres de " +
                                    "demande d'authentification OIDC des clients dans un objet de demande. " +
                                    "Activez la validation de signature pour n'accepter que les objets " +
                                    "de demande signés dans la demande d'autorisation.",
                                fields: {
                                    signatureValidation: {
                                        label: "Activer la validation de la signature"
                                    }
                                },
                                heading: "Objet de requête HTTP"
                            },
                            scopeValidators: {
                                fields: {
                                    validator: {
                                        label: "{{label}}",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "Validateurs de scope"
                            }
                        }
                    },
                    inboundSAML: {
                        description: "Vous trouverez ci-dessous les paramètres SAML de votre application.",
                        documentation: "Lisez notre <1>documentation</1> pour en savoir plus sur l'utilisation " +
                            "du protocole <3>{{protocol}}</3> pour implémenter la connexion dans vos applications.",
                        fields: {
                            assertionURLs: {
                                hint: "Elle précise les URL des consommateurs vers lesquels le navigateur " +
                                    "doit être redirigé une fois l'authentification réussie. Il s'agit de l'URL " +
                                    "du service consommateur d'assertions (ACS) de l'application.",
                                info: "Vous n’avez pas d’application? Essayez un exemple d'application en utilisant" +
                                    " {{assertionURLFromTemplate}} comme URL de réponse d'assertion. (Vous pouvez" +
                                    " télécharger et exécuter un exemple ultérieurement.)",
                                label: "URL du réponse d'assertions",
                                placeholder: "https://myapp.io/login",
                                validations: {
                                    empty: "Ceci est un champ obligatoire.",
                                    invalid: "L'URL saisie n'est ni HTTP ni HTTPS. Veuillez ajouter une URL valide.",
                                    required: "Ce champ est obligatoire pour une application fonctionnelle." +
                                        " Toutefois, si vous prévoyez d'essayer l'exemple d'application, ce champ" +
                                        " peut être ignoré."
                                }
                            },
                            defaultAssertionURL: {
                                hint: "Comme il peut y avoir plusieurs URLs de consommateur d'assertions, " +
                                    "vous devez définir une par défaut au cas où vous ne pourriez " +
                                    "pas la récupérer à partir de la demande d'authentification.",
                                label: "URL du consommateur d'assertions par défaut",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            },
                            idpEntityIdAlias: {
                                hint: "Cette valeur peut remplacer l'identifiant de l'entité du fournisseur " +
                                    "d'identité qui est spécifié dans la configuration d'authentification entrante " +
                                    "SAML SSO du fournisseur d'identité résident. L'identifiant de l'entité du " +
                                    "fournisseur d'identité est utilisé comme émetteur de la réponse SAML qui " +
                                    "est générée. Il doit s'agir d'un URI/URL valide.",
                                label: "Alias IDP entityId",
                                placeholder: "Saisir alias",
                                validations: {
                                    empty: "Ceci est un champ obligatoire.",
                                    invalid: "Il doit s'agir d'un URI/URL valide."
                                }
                            },
                            issuer: {
                                errorMessage: "L'émetteur existe déjà.",
                                hint: "Ceci précise l'émetteur. C'est l'élément 'saml:Issuer' qui contient " +
                                    "l'identifiant unique de la demande. C'est également la valeur de l'émetteur" +
                                    "spécifiée dans la demande d'authentification SAML émise par l'application.",
                                label: "Emetteur",
                                placeholder: "sample-app.com",
                                validations: {
                                    empty: "Veuillez indiquer l'émetteur"
                                }
                            },
                            metaURL: {
                                errorMessage: "L'URL des métadonnées n'est pas valide",
                                hint: "URL du fichier de métadonnées",
                                label: "URL des métadonnées",
                                placeholder: "Saisir l'URL du fichier de métadonnées",
                                validations: {
                                    empty: "Veuillez indiquer l'URL du fichier de métadonnées",
                                    invalid: "Ceci n'est pas une URL valide"
                                }
                            },
                            mode: {
                                children: {
                                    manualConfig: {
                                        label: "Configuration manuelle"
                                    },
                                    metadataFile: {
                                        label: "fichier de métadonnées"
                                    },
                                    metadataURL: {
                                        label: "URL des métadonnées"
                                    }
                                },
                                hint: "Sélectionnez le mode de configuration de saml.",
                                label: "Mode"
                            },
                            qualifier: {
                                hint: "Cette valeur n'est nécessaire que si vous devez configurer plusieurs " +
                                    "authentification entrante SAML pour la même valeur d'émetteur." +
                                    "Le qualificateur défini ici sera ajouté à l'émetteur en interne " +
                                    "pour identifier une application de manière unique au moment de l'exécution.",
                                label: "Qualificateur d'application",
                                placeholder: "Saisissez le qualificatif de l'application",
                                validations: {
                                    empty: "Ceci est un champ obligatoire."
                                }
                            }
                        },
                        sections: {
                            assertion: {
                                fields: {
                                    audience: {
                                        hint: "Restreindre l'audience.",
                                        label: "Audience",
                                        placeholder: "Saisir l'audience",
                                        validations: {
                                            invalid: "Veuillez ajouter une URI valide"
                                        }
                                    },
                                    nameIdFormat: {
                                        hint: "Elle définit le format des identifiants pris en charge par le " +
                                            "fournisseur d'identité. Les identifiants sont utilisés pour fournir " +
                                            "des informations concernant un utilisateur.",
                                        label: "Format des identifiants",
                                        placeholder: "Saisir le format d'identifiant",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    recipients: {
                                        hint:  "Valider les destinataires de la réponse.",
                                        label: "Destinataires",
                                        placeholder: "Saisir les destinataires",
                                        validations: {
                                            invalid: "Veuillez ajouter une URI valide"
                                        }
                                    }
                                },
                                heading: "Assertion"
                            },
                            attributeProfile: {
                                fields: {
                                    enable: {
                                        hint: "WSO2 Identity Server prend en charge un profil d'attribut de base " +
                                            "dans lequel le fournisseur d'identité peut inclure les attributs " +
                                            "de l'utilisateur dans les assertions SAML en tant que déclaration " +
                                            "d'attributs.",
                                        label: "Activer"
                                    },
                                    includeAttributesInResponse: {
                                        hint: "Une fois que vous avez coché la case 'Toujours inclure les " +
                                            "attributs dans la réponse' , le fournisseur d'identité incluera " +
                                            "toujours les valeurs des attributs relatifs aux claims sélectionnées " +
                                            "dans la déclaration d'attributs SAML.",
                                        label: "Toujours inclure les attributs dans la réponse"
                                    },
                                    serviceIndex: {
                                        hint: "Il s'agit d'un champ optionnel, s'il n'est pas fourni, une " +
                                            "valeur sera générée automatiquement.",
                                        label: "Indice de l'attribut consommant le service",
                                        placeholder: "Saisir l'indice de l'attribut consommant le service",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "Profil des attributs"
                            },
                            certificates: {
                                disabledPopup: "Assurez-vous que la validation de la signature de la " +
                                    "demande et le chiffrement des assertions sont désactivés pour continuer."
                            },
                            encryption: {
                                fields: {
                                    assertionEncryption: {
                                        hint: "Sélectionnez pour chiffrer les assertions SAML2 renvoyées après " +
                                            "l'authentification. Pour utiliser le cryptage, configurez le " +
                                            "certificat de votre application dans la section Certificat ci-dessous.",
                                        label: "Activer",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }

                                    },
                                    assertionEncryptionAlgorithm: {
                                        label: "Algorithme de chiffrement des assertions",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    keyEncryptionAlgorithm: {
                                        label: "Algorithme de chiffrement des clés",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "Chiffrement"
                            },
                            idpInitiatedSLO: {
                                fields: {
                                    enable: {
                                        hint: "Lorsque cette option est activée, le fournisseur de services " +
                                            "n'est pas tenu d'envoyer la requête SAML.",
                                        label: "Activer",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }
                                    },
                                    returnToURLs: {
                                        label: "URLs de retour",
                                        placeholder: "Saisir une URL",
                                        validations: {
                                            invalid: "Veuillez ajouter une URL valide"
                                        }
                                    }
                                },
                                heading: "Déconnexion unique initié par l'IDP"
                            },
                            requestProfile: {
                                fields: {
                                    enable: {
                                        label: "Activer le profil de requête d'assertion",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "Requête d'assertion / Requête de profil"
                            },
                            requestValidation: {
                                fields: {
                                    signatureValidation: {
                                        hint: "Cela précise si le fournisseur d'identité doit valider " +
                                            "la signature de la  " +
                                            "demande d'authentification SAML2 et de la demande de " +
                                            "déconnexion SAML2 qui sont envoyées par l'application.",
                                        label: "Activer la validation de la signature de la requête",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    signatureValidationCertAlias: {
                                        hint: "Si un certificat applicatif est fourni, il sera utilisé et " +
                                            "le certificat sélectionné ci-dessus sera ignoré.",
                                        label: "Alias du certificat de validation de la requête",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    }
                                },
                                heading: "Requête de validation"
                            },
                            responseSigning: {
                                fields: {
                                    digestAlgorithm: {
                                        label: "Algorithme Digest",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }
                                    },
                                    responseSigning: {
                                        hint: "Signez les réponses SAML2 renvoyées après le processus " +
                                            "d'authentification.",
                                        label: "Signer les réponses SAML"
                                    },
                                    signingAlgorithm: {
                                        label: "Algorithme de signature",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }
                                    }
                                },
                                heading: "Signature de l'assertion/réponse"
                            },
                            sloProfile: {
                                fields: {
                                    enable: {
                                        label: "Activer",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }
                                    },
                                    logoutMethod: {
                                        label: "Méthode de déconnexion",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }
                                    },
                                    requestURL: {
                                        label: "URL de requête de déconnexion unique",
                                        placeholder: "Saisir l'URL de requête de déconnexion unique",
                                        validations: {
                                            empty: "Ce champ est obligatoire.",
                                            invalid: "Ce n'est pas une URL valide"
                                        }
                                    },
                                    responseURL: {
                                        label: "URL de réponse de déconnexion unique",
                                        placeholder: "Saisir l'URL de réponse de déconnexion unique",
                                        validations: {
                                            empty: "Ce champ est obligatoire.",
                                            invalid: "Ce n'est pas une URL valide"
                                        }
                                    }
                                },
                                heading: "Profile de déconnexion unique"
                            },
                            ssoProfile: {
                                fields: {
                                    artifactBinding: {
                                        hint: "La signature de la requête de résolution d'artefact sera validée " +
                                            "par rapport au certificat applicatif.",
                                        label: "Activer la validation de la signature pour la résolution d'artefacts"
                                    },
                                    bindings: {
                                        hint: "Les mécanismes de transport des messages SAML.",
                                        label: "Liaisons",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    idpInitiatedSSO: {
                                        label: "Activer le SSO initié par l'IDP",
                                        validations: {
                                            empty: "Ce champ est obligatoire."
                                        }
                                    }
                                },
                                heading: "Profil de connexion unique"
                            }
                        }
                    },
                    inboundSTS: {
                        fields: {
                            realm: {
                                hint: "Saisir l'identifiant du domaine STS passif",
                                label: "Domaine d'identité",
                                placeholder: "Saisir le domaine.",
                                validations: {
                                    empty: "Ce champ est obligatoire."
                                }
                            },
                            replyTo: {
                                hint: "Saisir l'URL du RP qui gère la réponse.",
                                label: "URL de la réponse",
                                placeholder: "Saisir l'URL de la réponse",
                                validations: {
                                    empty: "C'est un champ obligatoire.",
                                    invalid: "Ce n'est pas une URL valide"
                                }
                            }
                        }
                    },
                    inboundWSTrust: {
                        fields: {
                            audience: {
                                hint: "L'adresse de la partie de confiance.",
                                label: "Adresse",
                                placeholder: "Saisir l'adresse",
                                validations: {
                                    empty: "Saisir l'adresse.",
                                    invalid: "Ce n'est pas une URL valide"
                                }
                            },
                            certificateAlias: {
                                hint: "Certificat public de la partie de confiance.",
                                label: "Alias du certificat",
                                placeholder: "Saisir l'alias du certificat",
                                validations: {
                                    empty: "Sélectionnez un alias de certificat"
                                }
                            }
                        }
                    },
                    outboundProvisioning: {
                        fields: {
                            blocking: {
                                hint: "Bloquer le flux d'authentification jusqu'à ce que le provisionnement " +
                                    "soit terminé.",
                                label: "Blocage"
                            },
                            connector: {
                                label: "Connecteur d'approvisionnement",
                                placeholder: "Sélectionner le connecteur d'approvisionnement",
                                validations: {
                                    empty: "Il est obligatoire de sélectionner un connecteur d'approvisionnement."
                                }
                            },
                            idp: {
                                label: "Fournisseur d'identité",
                                placeholder: "Sélectionner le fournisseur d'identité",
                                validations: {
                                    empty: "Il est obligatoire de sélectionner un IDP."
                                }
                            },
                            jit: {
                                hint: "Approvisionnement des utilisateurs de l'annuaire par un " +
                                    "approvisionnement juste à temps.",
                                label: "JIT vers l'extérieur"
                            },
                            rules: {
                                hint: "Provisionner les utilisateurs sur la base des règles XACML prédéfinies",
                                label: "Activer les règles"
                            }
                        }
                    },
                    provisioningConfig: {
                        fields: {
                            proxyMode: {
                                hint: "Les utilisateurs/groupes ne sont pas approvisionnés dans l'annuaire. " +
                                    "Ils ne sont approvisionnés que vers l'extérieur.",
                                label: "Mode Proxy"
                            },
                            userstoreDomain: {
                                hint: "Sélectionnez un nom de domaine utilisateur pour fournir des " +
                                    "utilisateurs et des groupes.",
                                label: "Approvisionnement du domaine utilisateur"
                            }
                        }
                    },
                    spaProtocolSettingsWizard:{
                        fields: {
                            callBackUrls: {
                                label: "URL autorisées",
                                validations: {
                                    empty: "Ceci est un champ obligatoire",
                                    invalid: "L'URL saisie n'est ni HTTP ni HTTPS. Veuillez ajouter un URI valide."
                                }
                            },
                            name: {
                                label: "Name",
                                validations: {
                                    invalid: "The application name should contain letters, numbers."
                                }
                            }
                        }
                    }
                },
                helpPanel: {
                    tabs: {
                        configs: {
                            content: {
                                subTitle: "Mettre à jour les configurations prédéfinies par le biais du modèle " +
                                    "ou ajouter de nouvelles configurations en fonction du protocole " +
                                    "(OIDC, SAML, WS-Trust, etc.) configuré.",
                                title: "Configurations de l'application"
                            },
                            heading: "Guide de Configuration"
                        },
                        docs: {
                            content: null,
                            heading: "Docs"
                        },
                        samples: {
                            content: {
                                sample: {
                                    configurations: {
                                        btn: "Télécharger la configuration",
                                        subTitle: "Afin d'intégrer l'application créée avec l'application d'exemple, " +
                                            "vous devez initialiser le client avec les configurations " +
                                            "suivantes.",
                                        title: "Initialiser le client"
                                    },
                                    downloadSample: {
                                        btn: "Télécharger l'exemple",
                                        subTitle: "Cet exemple d'application montre l'utilisation du SDK " +
                                            "WSO2 Identity Server SDK et comment vous pouvez intégrer " +
                                            "n'importe quelle application avec lui.",
                                        title: "Essayer l'exemple"
                                    },
                                    goBack: "Revenir en arrière",
                                    subTitle: "Commencez rapidement le prototypage en téléchargeant notre " +
                                        "application d'exemple préconfigurée.",
                                    title: "Exemple d'application"
                                },
                                technology: {
                                    subTitle: "Des examples et les SDK requis accompagnés d'informations utiles vous " +
                                        "seront fournis une fois que vous aurez choisi une technologie",
                                    title: "Sélectionner une technologie"
                                }
                            },
                            heading: "Examples"
                        },
                        sdks: {
                            content: {
                                sdk: {
                                    goBack: "Revenir en arrière",
                                    subTitle: "Les kits de développement logiciel suivants peuvent être utilisés " +
                                        "pour démarrer le développement de votre application.",
                                    title: "Kits de développement de logiciels (SDKs)"
                                }
                            },
                            heading: "SDKs"
                        },
                        start: {
                            content: {
                                endpoints: {
                                    subTitle: "Si vous implémentez votre application sans utiliser un SDK WSO2, " +
                                        "les points d'entrée de serveur suivants vous seront utiles pour " +
                                        "implémenter l'authentification de votre application.",
                                    title: "Points d'entrée du serveur"
                                },
                                oidcConfigurations: {
                                    labels: {
                                        authorize: "Authorize",
                                        endSession: "Se déconnecter",
                                        introspection: "Introspection",
                                        issuer: "Émetteur",
                                        jwks: "JWKS",
                                        keystore: "Key Set",
                                        revoke: "Révoquer",
                                        token: "Token",
                                        userInfo: "UserInfo",
                                        wellKnown: "Discovery"
                                    }
                                },
                                samlConfigurations: {
                                    buttons: {
                                        certificate: "Télécharger le certificat",
                                        metadata: "Télécharger les métadonnés de l'IDP"
                                    },
                                    labels: {
                                        certificate: "Certificat de l'IDP",
                                        issuer: "Émetteur",
                                        metadata: "Métadonnées de l'IDP",
                                        slo: "Déconnexion unique",
                                        sso: "Authentification unique"
                                    }
                                },
                                trySample: {
                                    btn: "Explorez les examples",
                                    subTitle: "Vous pouvez essayer les examples qui démontreront le flux " +
                                        "d'authentification. Cliquez sur le bouton ci-dessous pour télécharger " +
                                        "et déployer l'exemple d'application.",
                                    title: "Essayer avec un exemple"
                                },
                                useSDK: {
                                    btns: {
                                        withSDK: "Utiliser le SDK",
                                        withoutSDK: "Manuellement"
                                    },
                                    subTitle: "Installez et utilisez nos SDK pour intégrer l'authentification " +
                                        "à votre application avec un nombre minimum de lignes de code.",
                                    title: "Intégrez votre propre application"
                                }
                            },
                            heading: "Quelle est la suite ?"
                        }
                    }
                },
                list: {
                    actions: {
                        add: "Nouvelle Application",
                        custom: "Personnalisé",
                        predefined: "Utiliser prédéfini"
                    },
                    columns: {
                        actions: "Actions",
                        name: "Nom"
                    }
                },
                myaccount: {
                    description: "Portail libre-service pour les utilisateurs d'Asgardeo",
                    popup: "Partagez ce lien avec vos utilisateurs pour autoriser" +
                    " l'accès à Mon compte et gérer leurs comptes.",
                    title: "Mon compte"
                },
                notifications: {
                    addApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de création"
                        },
                        genericError: {
                            description: "Echec de la création de l'application.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Création avec succès de l'application.",
                            message: "Création réussie"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "Vous avez atteint le nombre maximum de candidatures autorisé.",
                            message: "Échec de la création de l'application"
                        }
                    },
                    authenticationStepDeleteErrorDueToSecondFactors: {
                        genericError: {
                            description: "Les authentificateurs de second facteur nécessitent d'avoir" +
                                "un authentificateur de base ou identifiant-d'abord dans une étape préalable.",
                            message: "Erreur de suppression"
                        }
                    },
                    authenticationStepMin: {
                        genericError: {
                            description: "Au moins une étape d'authentification est requise.",
                            message: "Erreur de suppression"
                        }
                    },
                    conditionalScriptLoopingError: {
                        description: "Les constructions en boucle telles que <1>for</1>, <3>while</3> et " +
                            "<5>forEach</5> ne sont pas autorisées dans le script d'authentification conditionnelle.",
                        message: "Échec de la mise à jour du script"
                    },
                    deleteApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression"
                        },
                        genericError: {
                            description: "N'a pas réussi à supprimer l'application",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Suppression avec succès de l'application.",
                            message: "Application supprimée"
                        }
                    },
                    deleteCertificateGenericError: {
                        description: "Quelque chose s'est mal passé. Nous n'avons pas pu supprimer le" +
                            " certificat d'application.",
                        message: "Échec de la mise à jour de l'application"
                    },
                    deleteCertificateSuccess: {
                        description: "Suppression réussie du certificat d'application.",
                        message: "Certificat supprimé"
                    },
                    deleteOptionErrorDueToSecondFactorsOnRight: {
                        error: {
                            description: "{{description}}",
                            message: "Impossible de supprimer cet authentificateur"
                        },
                        genericError: {
                            description: "Il existe des authentificateurs dans d'autres étapes " +
                                "qui dépendent de cet authentificateur.",
                            message: "Impossible de supprimer cet authentificateur"
                        },
                        success: {
                            description: "Suppression réussie de l'authentificateur de l'étape {{stepNo}}.",
                            message: "Suppression réussie"
                        }
                    },
                    deleteProtocolConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression des configurations " +
                                "de protocole entrant.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Suppression avec succés des configurations du protocole {{protocol}}.",
                            message: "Configurations supprimées"
                        }
                    },
                    duplicateAuthenticationStep: {
                        genericError: {
                            description: "Le même authentificateur n'est pas autorisé plus d'une fois en une " +
                                "seule étape.",
                            message: "Non autorisé"
                        }
                    },
                    emptyAuthenticationStep: {
                        genericError: {
                            description: "Il y a des étapes d'authentification vides. Veuillez les supprimer ou" +
                                " ajouter des authentifiants pour continuer.",
                            message: "Erreur de mise à jour"
                        }
                    },
                    fetchAllowedCORSOrigins: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de retrouver les origines CORS autorisées.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Récupéré avec succès les origines CORS autorisées.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de récupérer les détails de l'application.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les détails de l'application ont été récupérés avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchApplications: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de récupérer les applications",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les applications ont été récupérées avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchCustomInboundProtocols: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des protocoles " +
                                "entrants personnalisés.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération avec succès des protocoles entrants personnalisés.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchInboundProtocols: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des protocoles " +
                                "entrants disponibles.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération avec succès des protocoles entrants.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchOIDCIDPConfigs: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des configurations IDP " +
                                 "pour l'application OIDC.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération avec succès des configurations IDP pour l'application OIDC.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchOIDCServiceEndpoints: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des points de " +
                                "terminaison du serveur pour les applications OIDC.",
                            message: "Retrieval error"
                        }
                    },
                    fetchProtocolMeta: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des " +
                                "métadonnées du protocole.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération avec succès des métadonnées du protocole.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchSAMLIDPConfigs: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des " +
                                "configurations IDP pour l'application SAML.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération avec succès des configurations IDP pour l'application SAML.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchTemplate: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des données " +
                                "du modèle d'application",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Récupération avec succès des données du modèle d'application..",
                            message: "Récupération réussie"
                        }
                    },
                    fetchTemplates: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de récupérer les modèles d'application.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les modèles d'application ont été récupérés avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    firstFactorAuthenticatorToSecondStep: {
                        genericError: {
                            description: "Cet authentificateur ne peut être ajouté qu'à la première étape.",
                            message: "Impossible d'ajouter à cette étape"
                        }
                    },
                    getInboundProtocolConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite en récupérant les configurations du protocole.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération avec succès des configurations des protocoles entrants.",
                            message: "Récupération réussie"
                        }
                    },
                    regenerateSecret: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de regénération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la régénération de l'application",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Regénération avec succés de l'application",
                            message: "Regénération réussie"
                        }
                    },
                    revokeApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de révocation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la révocation de l'application",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Révocation avec succés de l'application",
                            message: "Révocation réussie"
                        }
                    },
                    secondFactorAuthenticatorToFirstStep: {
                        genericError: {
                            description: "Les authentificateurs de deuxième facteur ont besoin d'un " +
                                "authentificateur ou d'un identificateur de base d'abord dans une étape précédente.",
                            message: "Impossible d'ajouter à cette étape"
                        }
                    },
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: "Voir les forfaits",
                            subtitles: "Vous pouvez contacter l'administrateur de l'organisation ou (si vous êtes l'" +
                                "administrateur) mettre à niveau votre abonnement pour augmenter la limite autorisée.",
                            title: "Il semble que vous ayez atteint le nombre maximal d'applications " +
                                "autorisées pour cette organisation."
                        },
                        heading: "Vous avez atteint la limite maximale d'applications"
                    },
                    updateAdvancedConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite alors que les configurations avancées.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie des configurations avancées.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Echec de la mise à jour des applications",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie de l'application.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateAuthenticationFlow: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du flux " +
                                "d'authentification de l'application",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour avec succès du flux d'authentification de l'application",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateClaimConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des paramètres d'attribut.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie des paramètres d'attribut.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateInboundProtocolConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des " +
                                "configurations des protocoles entrants.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie des configurations des protocoles entrants.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateInboundProvisioningConfig: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors des configurations de provisionnement.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie des configurations d'approvisionnement.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateOnlyIdentifierFirstError: {
                        description: "Identifiant Le premier authentificateur ne peut pas être le seul " +
                            "authentificateur. Il nécessite une étape supplémentaire.",
                        message: "Erreur de mise à jour"
                    },
                    updateOutboundProvisioning: {
                        genericError: {
                            description: "Le provisionnement sortant vers l'IDP existe déjà.",
                            message: "Erreur de mise à jour"
                        }
                    },
                    updateProtocol: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de l'application",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Ajout réussi de nouvelles configurations de protocole.",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                placeholders: {
                    emptyAttributesList: {
                        action: "Ajouter un attribut",
                        subtitles: "Aucun attribut n'est sélectionné pour l'application pour le moment.",
                        title: "Aucun attribut n'a été ajouté"
                    },
                    emptyAuthenticatorStep: {
                        subtitles: {
                            0: "Cliquez sur le bouton <1>Ajouter une authentification</1> pour ajouter des options " +
                                "à cette étape"
                        },
                        title: null
                    },
                    emptyAuthenticatorsList: {
                        subtitles: "N'a pas pu trouver d'authentificateur {{type}}",
                        title: null
                    },
                    emptyList: {
                        action: "Nouvelle Application",
                        subtitles: {
                            0: "Actuellement, il n'y a pas d'applications disponibles.",
                            1: "Vous pouvez ajouter une nouvelle application facilement en suivant les",
                            2: "étapes de l'assistant de création d'application."
                        },
                        title: "Ajouter une nouvelle application"
                    },
                    emptyOutboundProvisioningIDPs: {
                        action: "Nouveau IDP",
                        subtitles: "Cette application n'a pas configuré de provisionnement sortant vers un IDP." +
                            " Ajouter un IDP pour le voir ici.",
                        title: "Pas d'approvisionnement sortant vers un IDP"
                    },
                    emptyProtocolList: {
                        action: "Nouveau Protocole",
                        subtitles: {
                            0: "Il n'y a actuellement aucun protocole disponible.",
                            1: "Vous pouvez ajouter un protocole facilement en utilisant le",
                            2: "modèles prédéfinis."
                        },
                        title: "Ajouter un protocole"
                    }
                },
                popups: {
                    appStatus: {
                        active: {
                            content: "L'application est active.",
                            header: "Actif",
                            subHeader: ""
                        },
                        notConfigured: {
                            content: "L'application n'est pas configurée. Veuillez configurer les configurations " +
                                "d'accès.",
                            header: "Pas configuré",
                            subHeader: ""
                        },
                        revoked: {
                            content: "La demande est révoquée. Veuillez réactiver l'application dans les " +
                                "configurations d'accès.",
                            header: "Révoqué",
                            subHeader: ""
                        }
                    }
                },
                templates: {
                    manualSetup: {
                        heading: "Configuration manuelle",
                        subHeading: "Créer une application avec des configurations personnalisées."
                    },
                    quickSetup: {
                        heading: "Configuration rapide",
                        subHeading: "Ensemble prédéfini de modèles d'application pour accélérer la création " +
                            "de votre application."
                    }
                },
                wizards: {
                    applicationCertificateWizard: {
                        emptyPlaceHolder: {
                            description1: "Cette application n'a pas de certificat ajouté.",
                            description2: "Ajoutez un certificat pour le voir ici",
                            title: "Pas de certificat"
                        },
                        heading: "Ajouter un nouveau certificat",
                        subHeading: "Ajouter un nouveau certificat à l'application"
                    },
                    minimalAppCreationWizard: {
                        help: {
                            heading: "Aide",
                            subHeading: "Utilisez les descriptions ci-dessous pour vous guider",
                            template: {
                                common: {
                                    authorizedRedirectURLs: {
                                        example: "par ex., https://myapp.io/login",
                                        subTitle: "URL vers laquelle le code d'autorisation est envoyé lors de" +
                                            " l'authentification et vers laquelle l'utilisateur est redirigé lors de" +
                                            " la déconnexion.",
                                        title: "URL de redirection autorisées"
                                    },
                                    heading: {
                                        example: "par ex., My App",
                                        subTitle: "Un nom unique pour identifier votre application.",
                                        title: "Nom"
                                    },
                                    protocol: {
                                        subTitle: "Le protocole de configuration d'accès qui sera utilisé pour se" +
                                            " connecter à l'application en utilisant SSO.",
                                        title: "Protocole"
                                    }
                                },
                                label: "Modèles de panneau d'aide de l'assistant de création d'application minimale.",
                                samlWeb: {
                                    assertionResponseURLs: {
                                        example: "par ex., https://my-app.com/home.jsp",
                                        subTitle: "URL vers lesquelles le navigateur est redirigé une fois" +
                                            " l'authentification réussie. Également connue sous le nom d'URL" +
                                            " Assertion Consumer Service (ACS) du fournisseur de services.",
                                        title: "URL de réponse d'assertion"
                                    },
                                    issuer: {
                                        example: "par ex., my-app.com",
                                        subTitle: "L'élément <1>saml: Issuer</1> qui contient l'identifiant unique de" +
                                            " l'application. La valeur ajoutée ici doit être spécifiée dans la" +
                                            " demande d'authentification SAML envoyée depuis l'application cliente.",
                                        title: "Émetteur"
                                    },
                                    metaFile: {
                                        subTitle: "Téléchargez le fichier méta pour la configuration SAML.",
                                        title: "Télécharger le fichier de métadonnées"
                                    },
                                    metaURL: {
                                        subTitle: "Lien méta URL à partir duquel les configurations SAML " +
                                            "peuvent être récupérées.",
                                        title: "URL méta"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            authenticationProvider: {
                templates: {
                    enterprise: {
                        addWizard: {
                            subtitle: "Configurez un fournisseur d'identité pour se connecter avec des " +
                            "protocoles d'authentification standard.",
                            title: "Fournisseurs d'identité basés sur des normes"
                        },
                        validation: {
                            invalidName: "{{idpName}} n'est pas un nom valide. " +
                                "Il ne doit pas contenir d'autres caractères alphanumériques, " +
                                "à l'exception des points (.), des tirets (-), " +
                                "des traits de soulignement (_) et des espaces.",
                            name: "Merci d'entrer un nom valide"
                        }
                    }
                }
            },
            footer: {
                copyright: "WSO2 Identity Server © {{year}}"
            },
            header: {
                links: {
                    adminPortalNav: "Portail d'administration",
                    userPortalNav: "Mon Compte"
                }
            },
            helpPanel: {
                actions: {
                    close: "Fermer",
                    open: "Ouvrir le panneau d'aide",
                    pin: "Attacher",
                    unPin: "Détacher"
                },
                notifications: {
                    pin: {
                        success: {
                            description: "Le panneau d'aide apparaîtra toujours {{state}} sauf si vous le " +
                                "modifiez explicitement.",
                            message: "Panneau d'aide {{state}}"
                        }
                    }
                }
            },
            idp: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Par exemple, nom, activé, etc."
                            },
                            filterCondition: {
                                placeholder: "Par exemple, commence par etc."
                            },
                            filterValue: {
                                placeholder: "Saisir une valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Search by IDP name"
                },
                buttons: {
                    addAttribute: "Ajouter un attribut",
                    addAuthenticator: "Ajouter un authentificateur",
                    addCertificate: "Ajouter un certificat",
                    addConnector: "Ajouter un connecteur",
                    addIDP: "Nouveau fournisseur d'identité"
                },
                confirmations: {
                    deleteAuthenticator: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous supprimez cet authentificateur, vous ne pourrez pas le récupérer. " +
                            "Toutes les applications qui en dépendent risquent également de ne plus fonctionner. " +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement l'authentificateur."
                    },
                    deleteConnector: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous supprimez ce connecteur, vous ne pourrez pas le récupérer. " +
                            "Veuillez procéder avec prudence..",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le connecteur."
                    },
                    deleteIDP: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous supprimez ce fournisseur d'identité, vous ne pourrez pas le récupérer. " +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement l'IDP."
                    },
                    deleteIDPWithConnectedApps: {
                        assertionHint: "",
                        content: "Supprimez les associations de ces applications avant de supprimer:",
                        header: "Impossible de supprimer",
                        message: "Il existe des applications utilisant ce fournisseur d'identité."
                    }
                },
                dangerZoneGroup: {
                    deleteIDP: {
                        actionTitle: "Effacer",
                        header: "Supprimer la connexion",
                        subheader: "Une fois supprimé, il ne peut pas être récupéré. S'il vous plaît soyez certain."
                    },
                    disableIDP: {
                        actionTitle: "Désactiver la connexion",
                        header: "Désactiver la connexion",
                        subheader: "Une fois désactivé, il ne peut plus être utilisé jusqu'à ce que vous le réactiviez."
                    },
                    header: "Zone de danger"
                },
                forms: {
                    advancedConfigs: {
                        alias: {
                            hint: "If the resident identity provider is known by an alias at the federated identity " +
                                "provider, specify it here.",
                            label: "Alias",
                            placeholder: "Entrez une valeur pour Alias."
                        },
                        certificateType: {
                            certificateJWKS: {
                                label: "Utilisez le point d'entrée JWKS",
                                placeholder: "La valeur doit être le certificat au format JWKS.",
                                validations: {
                                    empty: "La valeur du certificat est requise",
                                    invalid: "Le point de terminaison JWKS doit être un URI valide."
                                }
                            },
                            certificatePEM: {
                                label: "Fournir le certificat",
                                placeholder: "La valeur doit être une URL PEM",
                                validations: {
                                    empty: "La valeur du certificat est requise"
                                }
                            },
                            hint: "Si le type est JWKS, la valeur doit être une URL JWKS. Si le type est" +
                                " PEM, la valeur doit être le certificat au format PEM.",
                            label: "Sélectionnez le type de certificat"
                        },
                        federationHub: {
                            hint: "Vérifiez si cela pointe vers un hub de fournisseur d'identité",
                            label: "Hub de fédération"
                        },
                        homeRealmIdentifier: {
                            hint: "Entrez l'identifiant du domaine d'identité pour ce fournisseur d'identité",
                            label: " Identifiant du domaine local",
                            placeholder: "Entrez la valeur de l'identifiant du royaume d'origine."
                        }
                    },
                    attributeSettings: {
                        attributeListItem: {
                            validation: {
                                empty: "Veuillez saisir une valeur"
                            }
                        },
                        attributeMapping: {
                            attributeColumnHeader: "Attribut",
                            attributeMapColumnHeader: "Attribut du fournisseur d'identité",
                            attributeMapInputPlaceholderPrefix: "ex : attribut IdP pour ",
                            componentHeading: "Association des attributs",
                            hint: "Ajouter des attributs pris en charge par le fournisseur d'identité"
                        },
                        attributeProvisioning: {
                            attributeColumnHeader: {
                                0: "Attribut",
                                1: "Attribut du fournisseur d'identité"
                            },
                            attributeMapColumnHeader: "Valeur par défaut",
                            attributeMapInputPlaceholderPrefix: "ex : une valeur par défaut pour le ",
                            componentHeading: "Approvisionnement de la sélection d'attributs",
                            hint: "Préciser les attributs requis pour le provisionnement"
                        },
                        attributeSelection: {
                            searchAttributes: {
                                placeHolder: "Recherche d'attributs"
                            }
                        }
                    },
                    authenticatorAccordion: {
                        default: {
                            0: "Défaut",
                            1: "Mettre par défaut"
                        },
                        enable: {
                            0: "Activé",
                            1: "Désactivé"
                        }
                    },
                    common: {
                        customProperties: "Propriétés personnalisées",
                        internetResolvableErrorMessage: "L'URL doit pouvoir être résolue par Internet.",
                        invalidQueryParamErrorMessage: "Ce ne sont pas des paramètres de requête valables",
                        invalidURLErrorMessage: "Ceci n'est pas une URL valide",
                        requiredErrorMessage: "Ceci est requis"
                    },
                    generalDetails: {
                        description: {
                            hint: "Une description textuelle de la connexion.",
                            label: "Description",
                            placeholder: "Une description textuelle de la connexion."
                        },
                        image: {
                            hint: "Une URL pour récupérer l'image du fournisseur d'identité.",
                            label: "URL du fournisseur d'identité",
                            placeholder: "Par exemple: https://example.com/image.png"
                        },
                        name: {
                            hint: "Saisissez un nom unique pour cette connexion.",
                            label: "Nom du fournisseur d'identité",
                            placeholder: "Saisissez un nom unique pour cette connexion.",
                            validations: {
                                duplicate: "Un fournisseur d'identité existe déjà avec ce nom",
                                empty: "Le nom du fournisseur d'identité est requis",
                                maxLengthReached: "Le nom du fournisseur d'identité ne peut pas contenir plus " +
                                    "de {{ maxLength }} caractères."
                            }
                        }
                    },
                    jitProvisioning: {
                        enableJITProvisioning: {
                            disabledMessageContent: "Vous ne pouvez pas désactiver le" +
                                " paramètre de provisionnement d'utilisateurs juste-à-temps" +
                                " car les applications suivantes nécessitent son activation.",
                            disabledMessageHeader: "Opération non autorisée",
                            hint: "Spécifiez si les utilisateurs fédérés à partir de ce" +
                                " fournisseur d'identité doivent être mandatés.",
                            label: "Provisionnement d'utilisateurs juste à temps"
                        },
                        provisioningScheme: {
                            children: {
                                0: "Demande du nom d'utilisateur, du mot de passe et du consentement",
                                1: "Demande du mot de passe et du consentement",
                                2: "Demande du consentement",
                                3: "Provision silencieuse"
                            },
                            hint: "Sélectionnez le schéma à utiliser, lorsque les utilisateurs sont approvisionnés.",
                            label: "Schéma de provisionnement"
                        },
                        provisioningUserStoreDomain: {
                            hint: "Sélectionner le nom de domaine de l'annuaire qui fournira des utilisateurs.",
                            label: "Domaine d'annuaire pour approvisionner des utilisateurs"
                        }
                    },
                    outboundConnectorAccordion: {
                        default: {
                            0: "Défaut",
                            1: "Mettre par défaut"
                        },
                        enable: {
                            0: "Activé",
                            1: "Désactivé"
                        }
                    },
                    outboundProvisioningRoles: {
                        heading: "Approvisionnement externe des rôles",
                        hint: "Sélectionner et ajouter des rôles à approvisionner vers le fournisseur d'identité",
                        label: "Rôle",
                        placeHolder: "Sélectionnez un rôle",
                        popup: {
                            content: "Ajouter un rôle"
                        }
                    },
                    roleMapping: {
                        heading: "Association de rôles",
                        hint: "Associez les rôles locaux aux rôles des fournisseurs d'identité",
                        keyName: "Rôle local",
                        validation: {
                            duplicateKeyErrorMsg: "Ce rôle est déjà défini. Veuillez sélectionner un autre rôle",
                            keyRequiredMessage: "Veuillez renseigner le rôle local",
                            valueRequiredErrorMessage: "Veuillez renseigner un rôle de l'IDP à associer à"
                        },
                        valueName: "Rôle du fournisseur d'identité"
                    },
                    uriAttributeSettings: {
                        role: {
                            heading: "Rôle",
                            hint: "Spécifie l'attribut qui identifie les rôles chez le fournisseur d'identité",
                            label: "Attribut de rôle",
                            placeHolder: "Sélectionner un attribut",
                            validation: {
                                empty: "Veuillez sélectionner un attribut pour le rôle"
                            }
                        },
                        subject: {
                            heading: "Sujet",
                            hint: "Spécifie l'attribut qui identifie l'utilisateur auprès du fournisseur d'identité",
                            label: "Attribut du sujet",
                            placeHolder: "Sélectionner un attribut",
                            validation: {
                                empty: "Veuillez sélectionner un attribut pour le sujet"
                            }
                        }
                    }
                },
                helpPanel: {
                    tabs: {
                        samples: {
                            content: {
                                docs: {
                                    goBack: "Revenir en arrière",
                                    hint: "Cliquez sur les types de fournisseurs d'identité suivants " +
                                        "pour consulter la documentation correspondante.",
                                    title: "Sélectionnez un type de modèle"
                                }
                            },
                            heading: "Docs"
                        }
                    }
                },
                list: {
                    actions: "Actions",
                    name: "Nom"
                },
                modals: {
                    addAuthenticator: {
                        subTitle: "Ajouter un nouvel authentificateur au fournisseur d'identité : {{ idpName }}",
                        title: "Ajouter un nouvel authentificateur"
                    },
                    addCertificate: {
                        subTitle: "Ajouter un nouveau certificat au fournisseur d'identité : {{ idpName }}",
                        title: "Configurer les certificats"
                    },
                    addProvisioningConnector: {
                        subTitle: "Suivre les étapes pour ajouter un nouveau connecteur d'approvisionnement sortant",
                        title: "Créer un connecteur d'approvisionnement sortant"
                    },
                    attributeSelection: {
                        content: {
                            searchPlaceholder: "Rechercher des attributs"
                        },
                        subTitle: "Ajouter de nouveaux attributs ou supprimer des attributs existants.",
                        title: "Mettre à jour la sélection des attributs"
                    }
                },
                notifications: {
                    addFederatedAuthenticator: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de création"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'ajout de l'authentificateur.",
                            message: "Erreur de création"
                        },
                        success: {
                            description: "L'authentificateur a été ajouté avec succès.",
                            message: "Créer avec succès"
                        }
                    },
                    addIDP: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de création"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création de la connexion.",
                            message: "Erreur de création"
                        },
                        success: {
                            description: "Création réussie de la connexion.",
                            message: "Créer avec succès"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "Vous avez atteint le nombre maximum de fournisseurs d'identité autorisés.",
                            message: "Échec de la création du fournisseur d'identité"
                        }
                    },
                    changeCertType: {
                        jwks: {
                            description: "Veuillez noter que les certificats seront remplacés par le point de " +
                                "terminaison JWKS.",
                            message: "Attention !"
                        },
                        pem: {
                            description: "Veuillez noter que le point de terminaison JWKS sera remplacé par " +
                                "les certificats.",
                            message: "Attention !"
                        }
                    },
                    deleteCertificate: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de suppression de certificat"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du certificat.",
                            message: "Erreur de suppression de certificat"
                        },
                        success: {
                            description: "Le certificat a bien été supprimé.",
                            message: "Suppression réussie"
                        }
                    },
                    deleteDefaultAuthenticator: {
                        error: {
                            description: "L'authentificateur fédéré par défaut ne peut pas être supprimé.",
                            message: "Erreur de suppression de l'authentificateur fédéré"
                        },
                        genericError: null,
                        success: null
                    },
                    deleteDefaultConnector: {
                        error: {
                            description: "Le connecteur d'approvisionnement sortant par défaut ne peut pas " +
                                "être supprimé.",
                            message: "Erreur de suppression du connecteur sortant"
                        },
                        genericError: null,
                        success: null
                    },
                    deleteIDP: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de suppression du fournisseur d'identité"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du fournisseur d'identité",
                            message: "Erreur de suppression du fournisseur d'identité"
                        },
                        success: {
                            description: "Suppression réussie du fournisseur d'identité",
                            message: " Suppression réussie"
                        }
                    },
                    disableAuthenticator: {
                        error: {
                            description: "Vous ne pouvez pas désactiver l'authentificateur par défaut.",
                            message: "Erreur de validation des données"
                        },
                        genericError: {
                            description: "",
                            message: ""
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    disableOutboundProvisioningConnector: {
                        error: {
                            description: "ous ne pouvez pas désactiver le connecteur d'approvisionnement " +
                                "sortant par défaut.",
                            message: "Erreur de validation des données"
                        },
                        genericError: {
                            description: "",
                            message: ""
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    duplicateCertificateUpload: {
                        error: {
                            description: "Le certificat existe déjà pour l'IDP : {{idp}}",
                            message: "Erreur certificat en double"
                        },
                        genericError: {
                            description: "",
                            message: ""
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getAllLocalClaims: {
                        error: {
                            description: "{{ description }}",
                            message: "Retrieval Error"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des claims localaux.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getFederatedAuthenticator: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getFederatedAuthenticatorMetadata: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des métadonnées " +
                                "d'authentification.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getFederatedAuthenticatorsList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getIDP: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des données du " +
                                "fournisseur d'identité",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getIDPList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des fournisseurs " +
                                "d'identité",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getIDPTemplate: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du modèle d'IDP.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getIDPTemplateList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'extraction de la liste des modèles " +
                                "de fournisseurs d'identités",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getOutboundProvisioningConnector: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des détails du " +
                                "connecteur d'approvisionnement sortant.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getOutboundProvisioningConnectorMetadata: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des métadonnées " +
                                "du connecteur d'approvisionnement sortant.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getOutboundProvisioningConnectorsList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération de la liste " +
                                "des connecteurs d'approvisionnement sortant.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getRolesList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "An error occurred while retrieving roles.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    submitAttributeSettings: {
                        error: {
                            description: "Nécessité de configurer toutes les propriétés obligatoires.",
                            message: "Impossible d'effectuer la mise à jour"
                        },
                        genericError: {
                            description: "",
                            message: ""
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: "Voir les forfaits",
                            subtitles: "Vous pouvez contacter l'administrateur de l'organisation ou (si vous êtes l'" +
                                "administrateur) mettre à niveau votre abonnement pour augmenter la limite autorisée.",
                            title: "Vous avez atteint le nombre maximum de fournisseurs IdPs " +
                                "autorisés pour cette organisation."
                        },
                        heading: "Vous avez atteint la limite maximale d'IdP"
                    },
                    updateClaimsConfigs: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des configurations " +
                                "des claims.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie des configurations des claims.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateFederatedAuthenticator: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de " +
                                "l'authentificateur fédéré.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie de l'authentificateur fédéré.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateFederatedAuthenticators: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "sUne erreur s'est produite lors de la mise à jour des " +
                                "authentificateurs fédérés.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie des authentificateurs fédérés.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateIDP: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de la connexion.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "La connexion a été mise à jour avec succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateIDPCertificate: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du certificat " +
                                "du fournisseur d'identité.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie du certificat du fournisseur d'identité.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateIDPRoleMappings: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des " +
                                "configurations des rôles pour le provisionnement sortant.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie des configurations des rôles pour le " +
                                "provisionnement sortant.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateJITProvisioning: {
                        error: {
                            description: "",
                            message: ""
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des " +
                                "configurations de provisionnement JIT.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie des configurations de provisionnement JIT.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateOutboundProvisioningConnector: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du" +
                                " connecteur d'approvisionnement sortant.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie du connecteur d'approvisionnement sortant.",
                            message: "Mise à jour réussie"
                        }
                    },
                    updateOutboundProvisioningConnectors: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des " +
                                "connecteurs d'approvisionnement sortant.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie des connecteurs d'approvisionnement sortant.",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                placeHolders: {
                    emptyAuthenticatorList: {
                        subtitles: {
                            0: "Il n'y a actuellement aucun authentificateur disponible.",
                            1: "Vous pouvez ajouter un nouvel authentificateur facilement en utilisant le ",
                            2: "modèles prédéfinis."
                        },
                        title: "Ajouter un authentificateur"
                    },
                    emptyCertificateList: {
                        subtitles: {
                            0: "Cet IDP n'a pas de certificat.",
                            1: "Ajouter un certificat pour le visualiser ici."
                        },
                        title: "Pas de certificat"
                    },
                    emptyConnectorList: {
                        subtitles: {
                            0: "Cet IDP n'a pas de connecteurs de provisionnement sortant configurés.",
                            1: "Ajouter un connecteur pour le voir ici."
                        },
                        title: "Pas de connecteurs d'approvisionnement sortant"
                    },
                    emptyIDPList: {
                        subtitles: {
                            0: "Actuellement, il n'y a pas de fournisseurs d'identité disponibles.",
                            1: "Vous pouvez ajouter un nouveau fournisseur d'identité facilement en suivant les",
                            2: "étapes de l'assistant de création de fournisseurs d'identité."
                        },
                        title: "Ajouter un nouveau fournisseur d'identité"
                    },
                    emptyIDPSearchResults: {
                        subtitles: {
                            0: "Nous n'avons trouvé aucun résultat pour '{{ searchQuery }}'",
                            1: "Veuillez essayer un autre terme de recherche."
                        },
                        title: "Aucun résultat trouvé"
                    },
                    noAttributes: {
                        subtitles: {
                            0: "Il n'y a pas d'attributs sélectionnés pour le moment."
                        },
                        title: "Aucun attribut ajouté"
                    }
                },
                templates: {
                    manualSetup: {
                        heading: "Configuration manuelle",
                        subHeading: "Créer un fournisseur d'identité avec des configurations personnalisées."
                    },
                    quickSetup: {
                        heading: "Installation rapide",
                        subHeading: "Ensemble prédéfini de modèles pour accélérer la création de " +
                            "votre fournisseur d'identité."
                    }
                },
                wizards: {
                    addAuthenticator: {
                        header: "Remplissez les informations de base sur l'authentificateur.",
                        steps: {
                            authenticatorConfiguration: {
                                title: "Configuration de l'authentificateur"
                            },
                            authenticatorSelection: {
                                manualSetup: {
                                    subTitle: "Ajouter un nouvel authentificateur avec des configurations " +
                                        "personnalisées.",
                                    title: "Configuration manuelle"
                                },
                                quickSetup: {
                                    subTitle: "Modèles d'authentificateurs prédéfinis pour accélérer le processus.",
                                    title: "Configuration rapide"
                                },
                                title: "Sélection de l'authentificateur"
                            },
                            summary: {
                                title: "Résumé"
                            }
                        }
                    },
                    addIDP: {
                        header: "Fill the basic information about the identity provider.",
                        steps: {
                            authenticatorConfiguration: {
                                title: "Authenticator Configuration"
                            },
                            generalSettings: {
                                title: "General settings"
                            },
                            provisioningConfiguration: {
                                title: "Provisioning Configuration"
                            },
                            summary: {
                                title: "Summary"
                            }
                        }
                    },
                    addProvisioningConnector: {
                        header: "Fill the basic information about the provisioning connector.",
                        steps: {
                            connectorConfiguration: {
                                title: "Détails du connecteur"
                            },
                            connectorSelection: {
                                defaultSetup: {
                                    subTitle: "Sélectionnez le type du nouveau connecteur d'approvisionnement sortant",
                                    title: "Types de connecteurs"
                                },
                                title: "Sélection du connecteur"
                            },
                            summary: {
                                title: "Résumé"
                            }
                        }
                    },
                    buttons: {
                        finish: "Terminer",
                        next: "Suivant",
                        previous: "Précédent"
                    }
                }
            },
            overview: {
                banner: {
                    heading: "WSO2 Identity Server pour les développeurs",
                    subHeading: "Utiliser les SDK et autres outils de développement pour construire " +
                        "une expérience personnalisée",
                    welcome: "Bienvenue, {{username}}"
                },
                quickLinks: {
                    cards: {
                        applications: {
                            heading: "Applications",
                            subHeading: "Créer des applications à l'aide de modèles prédéfinis et " +
                                "gérer leurs configurations."
                        },
                        idps: {
                            heading: "Fournisseurs d'identité",
                            subHeading: "Créer et gérer des fournisseurs d'identités sur la base de modèles " +
                                "et configurer l'authentification."
                        },
                        remoteFetch: {
                            heading: "Récupérer à distance",
                            subHeading: "Configurer un référentiel distant pour qu'il fonctionne de " +
                                "manière transparente avec WSO2 Identity Server."
                        }
                    }
                }
            },
            secrets: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Par exemple, nom, description, etc."
                            },
                            filterCondition: {
                                placeholder: "Par exemple, commence par etc."
                            },
                            filterValue: {
                                placeholder: "Saisir une valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Chercher par nom d'secret"
                },
                alerts: {
                    createdSecret: {
                        description: "Le secret a été créé avec succès.",
                        message: "Création réussie."
                    },
                    deleteSecret: {
                        description: "Le secret a été supprimé avec succès.",
                        message: "Suppression réussie."
                    },
                    updatedSecret: {
                        description: "Le secret a été mis à jour avec succès.",
                        message: "Mise à jour réussie."
                    }
                },
                banners: {
                    adaptiveAuthSecretType: {
                        content: "Ces secrets peuvent être utilisés dans le script d'authentification adaptative " +
                            "d'une application enregistrée lors de l'accès à des API externes.",
                        title: "Secrets d'authentification adaptative"
                    },
                    secretIsHidden: {
                        content: "Une fois créé, vous ne pourrez plus voir la valeur secrète. Vous ne pourrez " +
                            "supprimer que le secret.",
                        title: "Pourquoi ne puis-je pas voir le secret ?"
                    }
                },
                emptyPlaceholders: {
                    buttons: {
                        addSecret: {
                            ariaLabel: "Ajoutez un nouveau secret.",
                            label: "Nouveau secret"
                        },
                        backToSecrets: {
                            ariaLabel: "Accédez à la liste des secrets.",
                            label: "Ramène-moi à Secrets"
                        }
                    },
                    emptyListOfSecrets: {
                        messages: [
                            "Il n'y a pas de secrets disponibles pour le moment."
                        ]
                    },
                    resourceNotFound: {
                        messages: [
                            "Oups! nous n'avons pas pu trouver le secret demandé !",
                            "Peut-être avez-vous atterri sur une URL invalide..."
                        ]
                    }
                },
                errors: {
                    generic: {
                        description: "Nous n'avons pas pu répondre à cette demande. Veuillez réessayer.",
                        message: "Quelque chose ne tourne pas rond."
                    }
                },
                forms: {
                    actions: {
                        submitButton: {
                            ariaLabel: "Mettre à jour pour enregistrer le formulaire",
                            label: "Mettre à jour"
                        }
                    },
                    editSecret: {
                        page: {
                            description: "Modifier le secret"
                        },
                        secretDescriptionField: {
                            ariaLabel: "Description secrète",
                            hint: "Donnez une description de ce secret (c'est-à-dire, quand utiliser ce secret).",
                            label: "Description secrète",
                            placeholder: "Entrez une description secrète"
                        },
                        secretValueField: {
                            ariaLabel: "Entrez une valeur secrète",
                            cancelButton: "Annuler",
                            editButton: "Modifier la valeur secrète",
                            hint: "Vous pouvez saisir une valeur comprise entre {{minLength}} et {{maxLength}}.",
                            label: "Valeur secrète",
                            placeholder: "Entrez une valeur secrète",
                            updateButton: "Mettre à jour la valeur secrète"
                        }
                    }
                },
                modals: {
                    deleteSecret: {
                        assertionHint: "Oui je comprends. Je veux le supprimer.",
                        content: "Cette action est irréversible et supprimera définitivement le secret.",
                        primaryActionButtonText: "Confirmer",
                        secondaryActionButtonText: "Annuler",
                        title: "Es-tu sûr?",
                        warningMessage: "Si vous supprimez ce secret, les scripts d'authentification conditionnelle " +
                            "en fonction de cette valeur cesseront de fonctionner. Veuillez procéder avec prudence."
                    }
                },
                page: {
                    description: "Créer et gérer des secrets pour l'authentification conditionnelle",
                    primaryActionButtonText: "Nouveau secret",
                    subFeatureBackButton: "Retourner à Secrets",
                    title: "Secrets"
                },
                routes: {
                    category: "secrets",
                    name: "Secrets",
                    sidePanelChildrenNames: [
                        "Modifier le secret"
                    ]
                },
                wizards: {
                    actions: {
                        cancelButton: {
                            ariaLabel: "Annuler et fermer le modal",
                            label: "Annuler"
                        },
                        createButton: {
                            ariaLabel: "Créer et soumettre",
                            label: "Créer"
                        }
                    },
                    addSecret: {
                        form: {
                            secretDescriptionField: {
                                ariaLabel: "Description secrète",
                                hint: "Donnez une description de ce secret (c'est-à-dire, quand utiliser ce secret).",
                                label: "Description secrète",
                                placeholder: "Entrez une description secrète"
                            },
                            secretNameField: {
                                alreadyPresentError: "Ce nom secret est déjà ajouté",
                                ariaLabel: "Nom secret pour le type de secret",
                                hint: "Donnez un nom significatif à ce secret. Notez qu'une fois que vous avez créé " +
                                    "ce secret avec le nom ci-dessus, vous ne pouvez plus le modifier par la suite.",
                                label: "Nom secret",
                                placeholder: "Entrez un nom secret"
                            },
                            secretTypeField: {
                                ariaLabel: "Sélectionnez le type de secret",
                                hint: "Sélectionnez un type de secret auquel appartient ce secret.",
                                label: "Sélectionnez le type de secret"
                            },
                            secretValueField: {
                                ariaLabel: "Entrez une valeur secrète",
                                hint: "C'est la valeur du secret. Vous pouvez saisir une valeur comprise entre " +
                                    "{{minLength}} et {{maxLength}}.",
                                label: "Valeur secrète",
                                placeholder: "Entrez une valeur secrète"
                            }
                        },
                        heading: "Créer un secret",
                        subheading: "Créer un nouveau secret pour les scripts d'authentification adaptative"
                    }
                }
            },
            sidePanel: {
                applicationEdit: "Édition des applications",
                applicationTemplates: "Modèles d'application",
                applications: "Applications",
                categories: {
                    application: "Applications",
                    general: "Général",
                    gettingStarted: " Pour commencer",
                    identityProviders: "Fournisseurs d'identité"
                },
                customize: "Personnaliser",
                identityProviderEdit: "Edition des fournisseurs d'identité",
                identityProviderTemplates: "Modèles de fournisseurs d'identités",
                identityProviders: "Fournisseurs d'identité",
                oidcScopes: "Scopes",
                oidcScopesEdit: "Édition des scopes",
                overview: "Vue d'ensemble",
                remoteRepo: "Configuration de dépôts distants",
                remoteRepoEdit: "Édition des configurations des dépôts distants"
            },
            templates: {
                emptyPlaceholder: {
                    action: null,
                    subtitles: "Veuillez ajouter des modèles à afficher ici.",
                    title: "Pas de modèles à afficher."
                }
            }
        },
        notifications: {
            endSession: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de clôture"
                },
                genericError: {
                    description: "Impossible de mettre fin à la session en cours.",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "Clôture avec succès de la session en cours.",
                    message: "Clôture réussie"
                }
            },
            getProfileInfo: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Impossible de récupérer les détails du profil de l'utilisateur.",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "Récupération réussie des détails du profil de l'utilisateur.",
                    message: "Récupération réussie"
                }
            },
            getProfileSchema: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Impossible de récupérer les schémas des profils.",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "Récupération avec succès des schémas de profils d'utilisateurs.",
                    message: "Récupération réussie"
                }
            }
        },
        pages: {
            applicationTemplate: {
                backButton: "Retour aux applications",
                subTitle: "Enregistrez une demande en utilisant l'un des modèles ci-dessous. Si rien ne correspond " +
                    "à votre type d'application, commencez par le modèle d'application standard.",
                title: "Enregistrer une nouvelle candidature"
            },
            applications: {
                subTitle: "Enregistrez et gérez vos applications et configurez la connexion.",
                title: "Applications"
            },
            applicationsEdit: {
                backButton: "Retour aux applications",
                subTitle: null,
                title: null
            },
            idp: {
                subTitle: "Gérez les fournisseurs d'identité pour permettre aux utilisateurs de se connecter à " +
                    "votre application via eux.",
                title: "Fournisseurs d'identités"
            },
            idpTemplate: {
                backButton: "Retourner aux fournisseurs d'identité",
                subTitle: "Choisissez l'un des fournisseurs d'identité suivants.",
                supportServices: {
                    authenticationDisplayName: "Authentification",
                    provisioningDisplayName: "Approvisionnement"
                },
                title: "Sélectionnez le fournisseur d'identité"
            },
            overview: {
                subTitle: "Configurer et gérer les applications, les fournisseurs d'identité, les utilisateurs " +
                    "et les rôles, les dialectes d'attributs, " +
                    "etc.",
                title: "Bienvenue, {{firstName}}"
            }
        },
        placeholders: {
            emptySearchResult: {
                action: "Effacer la requête de recherche",
                subtitles: {
                    0: "Nous n'avons pas trouvé de résultats pour \"{{query}}\"",
                    1: "Veuillez essayer un autre terme de recherche."
                },
                title: "Aucun résultat trouvé"
            },
            underConstruction: {
                action: "Retour à la page d'accueil",
                subtitles: {
                    0: "Nous travaillons sur cette page.",
                    1: "Excusez nous et revenez plus tard. Merci de votre patience."
                },
                title: "Page en construction"
            }
        },
        technologies: {
            android: "Android",
            angular: "Angular",
            ios: "iOS",
            java: "Java",
            python: "Python",
            react: "React",
            windows: "Windows"
        }
    },
    manage: {
        features: {
            approvals: {
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Nom"
                    }
                },
                modals: {
                    approvalProperties: {
                        "Claims": "Réclamations",
                        "REQUEST ID": "Identifiant de la demande",
                        "Roles": "Rôles",
                        "User Store Domain": "Domaine du magasin d'utilisateurs",
                        "Username": "Nom d'utilisateur"
                    },
                    taskDetails: {
                        description: "Vous avez une demande d'approbation d'une action opérationnelle " +
                            "d'un utilisateur.",
                        header: "Tâche d'approbation"
                    }
                },
                notifications: {
                    fetchApprovalDetails: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la récupération des détails de l'approbation"
                        },
                        genericError: {
                            description: "Impossible de mettre à jour les détails de l'approbation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Détails de l'approbation récupérés avec succès",
                            message: "Récupération des détails de l'approbation réussie"
                        }
                    },
                    fetchPendingApprovals: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération des approbations en attente"
                        },
                        genericError: {
                            description: "Impossible à récupérer la liste des approbations en attente",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Liste des approbations en attente récupérée avec succès",
                            message: "Récupération des approbations en attente réussie"
                        }
                    },
                    updatePendingApprovals: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la mise à jour de l'approbation"
                        },
                        genericError: {
                            description: "Impossible de mettre à jour l'approbation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Approbation mis à jour avec succès",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                placeholders: {
                    emptyApprovalFilter: {
                        action: "Voir tout",
                        subtitles: {
                            0: "Il n'y a actuellement aucune approbation dans l'état {{status}}.",
                            1: "Veuillez vérifier si vous avez des tâches dans l'état {{status}} à",
                            2: "les voir ici."
                        },
                        title: "Aucune {{status}} approbation"
                    },
                    emptyApprovalList: {
                        action: "",
                        subtitles: {
                            0: "Il n'y a actuellement aucune approbation à examiner.",
                            1: "Veuillez vérifier si vous avez ajouté un flux de travail pour",
                            2: "contrôler les tâches dans le système."
                        },
                        title: "Aucune approbation"
                    },
                    emptySearchResults: {
                        action: "Voir tout",
                        subtitles: {
                            0: "Nous n'avons pas trouvé le flux de travail que vous avez recherché.",
                            1: "Veuillez vérifier si vous avez un flux de travail avec ce nom dans",
                            2: "le système."
                        },
                        title: "Aucun résultat trouvé"
                    }
                }
            },
            businessGroups: {
                fields: {
                    groupName: {
                        label: "Nome de {{type}}",
                        placeholder: "Saisir un nom de {{type}}",
                        validations: {
                            duplicate: "Un {{type}} avec ce nom existe déjà.",
                            empty: "Le nom de {{type}} est obligatoire",
                            invalid: "Un nom {{type}} ne peut contenir que des caractères alphanumériques, - et _. "+
                                "Et doit avoir une longueur comprise entre 3 et 30 caractères."
                        }
                    }
                }
            },
            certificates: {
                keystore: {
                    advancedSearch: {
                        error: "Le format de la requête est incorrect",
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "Ex. alias, etc."
                                },
                                filterCondition: {
                                    placeholder: "Ex. Commence par, etc."
                                },
                                filterValue: {
                                    placeholder: "Ex. wso2carbon, etc."
                                }
                            }
                        },
                        placeholder: "Recherche par alias"
                    },
                    attributes: {
                        alias: "Alias"
                    },
                    certificateModalHeader: "Voir le Certificat",
                    confirmation: {
                        content: "Cette action est irréversible et supprimera définitivement le certificat.",
                        header: "Êtes-vous sûr ?",
                        hint: "Veuillez saisir <1>{{ name }}</1> pour confirmer.",
                        message: "Cette action est irréversible et supprimera définitivement le certificat.",
                        primaryAction: "Confirmer",
                        tenantContent: "Cela supprimera définitivement le certificat d'organisation. Une fois" +
                            " supprimé, à moins que vous n'importiez un nouveau certificat d'organisation, vous ne" +
                            " pourrez pas accéder aux applications du portail.Pour continuer la suppression, entrez" +
                            " l'alias du certificat et cliquez sur supprimer."
                    },
                    errorCertificate: "Une erreur s'est produite lors de l'ouverture du certificat"
                        + " Veuillez vous assurer que le certificat est valide.",
                    errorEmpty: "Ajoutez un fichier de certificat ou collez le contenu d'un certificat au format PEM.",
                    forms: {
                        alias: {
                            label: "Alias",
                            placeholder: "Saisir un alias",
                            requiredErrorMessage: "L'alias est obligatoire"
                        }
                    },
                    list: {
                        columns: {
                            actions: "Actions",
                            name: "Nom"
                        }
                    },
                    notifications: {
                        addCertificate:{
                            genericError: {
                                description: "Une erreur s'est produite lors de l'import du certificat.",
                                message: "Quelque chose s'est mal passé !"
                            },
                            success: {
                                description: "Le certificat a été importé avec succès.",
                                message: "Import de certificat réussi"
                            }
                        },
                        deleteCertificate: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la suppression du certificat",
                                message: "Quelque chose s'est mal passé !"
                            },
                            success: {
                                description: "Le certificat a été supprimé avec succès.",
                                message: "Suppression du certificat réussi"
                            }
                        },
                        download: {
                            success: {
                                description: "Le téléchargement du certificat a commencé.",
                                message: "Début du téléchargement"
                            }
                        },
                        getAlias: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération du certificat.",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        getCertificate: {
                            genericError: {
                                description: "Une erreur s'est produite lors la recherche du certificat",
                                message: "Quelque chose s'est mal passé !"
                            }
                        },
                        getCertificates: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des certificats",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        getPublicCertificate: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération du certificat" +
                                    " d'organisation.",
                                message: "Quelque chose s'est mal passé !"
                            }
                        }
                    },
                    pageLayout: {
                        description: "Gérer les certificats dans le keystore",
                        primaryAction: "Importer un certificat",
                        title: "Certificats"
                    },
                    placeholders: {
                        emptyList: {
                            action: "Importer un certificat",
                            subtitle: "Il n'y a actuellement aucun certificat dans le magasin de clés."
                                + "Vous pouvez en importer en cliquant sur le bouton ci-dessous.",
                            title: "Importer un certificat"
                        },
                        emptySearch: {
                            action: "Effacer la recherche",
                            subtitle: "La recherche \"{{searchQuery}}\" n'a renvoyé aucun résultat."
                                + "Veuillez essayer d'autres paramètres.",
                            title: "Aucun résultat"
                        }
                    },
                    summary: {
                        issuerDN: "Nom de l'émetteur",
                        sn: "Numéro de série :",
                        subjectDN: "Nom du sujet",
                        validFrom: "Non valable avant",
                        validTill: "Non valable après",
                        version: "Version"
                    },
                    wizard: {
                        dropZone: {
                            action: "Charger un certificat",
                            description: "Glissez et déposez un fichier de certificat ici"
                        },
                        header: "Importer un certificat",
                        panes: {
                            paste: "Coller",
                            upload: "Charger"
                        },
                        pastePlaceholder: "Coller le contenu du certificat au format PEM",
                        steps: {
                            summary: "Résumé",
                            upload: "Charger un certificat"
                        }
                    }
                },
                truststore: {
                    advancedSearch: {
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "Ex. alias, etc."
                                },
                                filterCondition: {
                                    placeholder: "Ex. Commence par, etc."
                                },
                                filterValue: {
                                    placeholder: "Ex. wso2carbon, etc."
                                }
                            }
                        },
                        placeholder: "Recherche par nom de groupe"
                    }
                }
            },
            claims: {
                attributeMappings: {
                    custom: {
                        description: "Représentation de protocole personnalisé pour les " +
                            "attributs utilisateur qui seront utilisés dans l'API personnalisée.",
                        heading: "Attributs personnalisés"
                    },
                    oidc: {
                        description: "Représentation du protocole OpenID Connect pour les attributs " +
                            "utilisateur qui seront utilisés dans l'API OpenID Connect.",
                        heading: "OpenID Connect"
                    },
                    scim: {
                        description: "Représentation du protocole SCIM2 pour les attributs " +
                            "utilisateur qui seront utilisés dans l'API SCIM2.",
                        heading: "System for Cross-Domain Identity Management"
                    }
                },
                dialects: {
                    advancedSearch: {
                        error: "Le format de la requête est incorrect",
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "Ex. URI du dialecte, etc."
                                },
                                filterCondition: {
                                    placeholder: "Ex. Commence par, etc."
                                },
                                filterValue: {
                                    placeholder: "Ex. http://wso2.org/oidc/claim"
                                }
                            }
                        },
                        placeholder: "Recherche par URI de dialecte"
                    },
                    attributes: {
                        dialectURI: "URI de dialecte"
                    },
                    confirmations: {
                        action: "Confirmer",
                        content: "Si vous supprimez ce mappage d'attributs, tous les attributs {{type}} " +
                            "associés seront également supprimés, veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        hint: "Veuillez saisir <1>{{ name }}</1> pour confirmer.",
                        message: "Cette action est irréversible et supprimera définitivement le mappage " +
                            "d'attributs sélectionné."
                    },
                    dangerZone: {
                        actionTitle: "Supprimer le mappage d'attributs {{type}}",
                        header: "Supprimer le mappage d'attributs {{type}}",
                        subheader: "Une fois que vous supprimez ce mappage d'attribut {{type}}, il n'y a plus " +
                            "de retour en arrière. Soyez certain."
                    },
                    forms: {
                        dialectURI: {
                            label: "{{type}} URI de mappage d'attributs",
                            placeholder: "Saisir une URI de dialecte",
                            requiredErrorMessage: "L'URI de dialecte est obligatoire"
                        },
                        fields: {
                            attributeName: {
                                validation: {
                                    alreadyExists: "Un attribut existe déjà avec le nom d'attribut donné.",
                                    invalid: "Le nom d'attribut ne peut contenir que des caractères "
                                        +"alphanumériques et _. Et doit avoir une longueur comprise "
                                        +"entre 3 et 30 caractères."
                                }
                            }
                        },
                        submit: "Mettre à jour"
                    },
                    notifications: {
                        addDialect: {
                            error: {
                                description: "Une erreur s'est produite lors de l'ajout du mappage d'attributs",
                                message: "Quelque chose s'est mal passé"
                            },
                            genericError: {
                                description: "Le mappage d'attributs a été ajouté avec succès, mais ce n'est pas " +
                                    "le cas pour tous les attributs {{type}}",
                                message: "Des attributs externes n'ont pas pu être ajoutés"
                            },
                            success: {
                                description: "Le mappage d'attributs a été ajouté avec succès",
                                message: "mappage d'attributs ajouté avec succès"
                            }
                        },
                        deleteDialect: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la suppression du dialecte",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Le dialecte a été supprimé avec succès !",
                                message: "Dialecte supprimé avec succès"
                            }
                        },
                        fetchADialect: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la recherche du mappage d'attributs",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        fetchDialects: {
                            error: {
                                description: "{{description}}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Impossible de récupéré les dialectes de claims.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Les dialectes des claim ont été récupérés avec succès.",
                                message: "Récupération réussie"
                            }
                        },
                        fetchExternalClaims: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la recherche des attributs externes",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        updateDialect: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour du dialecte",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Le dialecte a été mis à jour avec succès",
                                message: "La mise à jour du dialecte a été effectuée avec succès"
                            }
                        }
                    },
                    pageLayout: {
                        edit: {
                            back: "Retournez aux attributs des dialectes",
                            description: "Modifier le mappage d'attributs et ses attributs",
                            updateDialectURI: "Mettre à jour l'URI de mappage d'attributs {{type}}",
                            updateExternalAttributes: "Mettre à jour le mappage d'attributs {{type}}"
                        },
                        list: {
                            description: "Affichez et gérez la façon dont les attributs utilisateur " +
                                "d'{{productName}} sont mappés et transformés lors de l'interaction avec les " +
                                "API ou vos applications.",
                            primaryAction: "Nouveau mappage d'attributse",
                            title: "Les attributs",
                            view: "Voir les claims locaux"
                        }
                    },
                    sections: {
                        manageAttributeMappings: {
                            custom: {
                                description: "Communiquez des informations sur l'utilisateur via " +
                                    "des mappages personnalisés.",
                                heading: "Mappage d'attributs personnalisés"
                            },
                            description: "Affichez et gérez la façon dont les attributs d'{{productName}} sont " +
                                "mappés et transformés lors de l'interaction avec les API ou vos applications.",
                            heading: "Gérer les mappages d'attributs",
                            oidc: {
                                description: "Communiquez des informations sur l'utilisateur pour les " +
                                    "applications qui utilisent OpenID Connect pour s'authentifier.",
                                heading: "OpenID Connect"
                            },
                            scim: {
                                description: "Communiquez des informations sur l'utilisateur via la " +
                                    "conformité API avec les normes SCIM2.",
                                heading: "System for Cross-Domain Identity Management "
                            }
                        },
                        manageAttributes: {
                            attributes: {
                                description: "Chaque attribut contient un élément de données " +
                                    "utilisateur stocké dans {{productName}}.",
                                heading: "Les attributs"
                            },
                            description: "Affichez et gérez les attributs natifs d'{{productName}}.",
                            heading: "Gérer les attributs"
                        }
                    },
                    wizard: {
                        header: "Ajouter un mappage d'attributs",
                        steps: {
                            dialectURI: "URI de  mappage d'attributs",
                            externalAttribute: "Attributs {{type}}",
                            summary: "Résumé"
                        },
                        summary: {
                            externalAttribute: "URI de l'attribut {{type}}",
                            mappedAttribute: "URI de l'attribut local associée",
                            notFound: "Aucun attribut {{type}} n'a été ajouté."
                        }
                    }
                },
                external: {
                    advancedSearch: {
                        error: "Format du filtre de requête incorrect",
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "Ex. URI d'attribut {{type}}, etc."
                                },
                                filterCondition: {
                                    placeholder: "Ex. Commence par, etc."
                                },
                                filterValue: {
                                    placeholder: "Ex. http://axschema.org/namePerson/last"
                                }
                            }
                        },
                        placeholder: "Recherche par URI d'attribut"
                    },
                    attributes: {
                        attributeURI: "{{type}} URI d'attribut",
                        mappedClaim: "URI d'attribut mappé"
                    },
                    forms: {
                        attributeURI: {
                            label: "{{type}} Attribute URI",
                            placeholder: "Saisissez l'URI de l'attribut {{type}}",
                            requiredErrorMessage: "Une URI d'attribut {{type}} est requis.",
                            validationErrorMessages: {
                                duplicateName: "L'URI de l'attribut {{type}} existe déjà.",
                                invalidName: "Le nom que vous avez entré contient des caractères non autorisés. " +
                                    "Seuls les alphabets, les nombres, «#», «_» sont autorisés.",
                                scimInvalidName: "Le caractère de départ du nom doit être une lettre. " +
                                    "Les caractères restants peuvent inclure des lettres, des chiffres, " +
                                    "un tiret (-) et un trait de soulignement (_)."
                            }
                        },
                        emptyMessage: "Tous les attributs SCIM sont mappés sur des revendications locales.",
                        localAttribute: {
                            label: "Attribut URI à mapper",
                            placeholder: "Sélectionnez un attribut",
                            requiredErrorMessage: "Sélectionnez un attribut auquel mapper"
                        },
                        submit: "Ajouter un mappage d'attributs",
                        warningMessage: "Aucun attribut local n'est disponible pour le mappage. " +
                            "Ajouter de nouveaux attributs locaux à partir d'ici"
                    },
                    notifications: {
                        addExternalAttribute: {
                            genericError: {
                                description: "Une erreur s'est produite lors de l'ajout de l'attribut {{type}}.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "L'attribut {{type}} a été ajouté au dialecte avec succès !",
                                message: "Attribut ajouté"
                            }
                        },
                        deleteExternalClaim: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la suppression de l'attribut {{type}}",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "L'attribut {{type}} a été supprimé avec succès !",
                                message: "Attribut supprimé"
                            }
                        },
                        fetchExternalClaims: {
                            error: {
                                description: "{{description}}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Impossible de récupérer les claims externes.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Récupérer avec succès des claims externes.",
                                message: "Récupération réussie"
                            }
                        },
                        getExternalAttribute: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération de l'attribut {{type}}",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        updateExternalAttribute: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération de l'attribut {{type}}",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "L'attribut {{type}} a été mis à jour avec succès !",
                                message: "Attribut mis à jour"
                            }
                        }
                    },
                    pageLayout: {
                        edit: {
                            header: "Ajouter un attribut {{type}}",
                            primaryAction: "Nouvel attribut {{type}}"
                        }
                    },
                    placeholders: {
                        empty: {
                            subtitle: "Actuellement, il n'y a pas d'attributs externes disponibles pour "
                                + "ce dialecte.",
                            title: "Pas d'attributs externes"
                        }
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        claimURI: "Attribut SCIM",
                        dialectURI: "Attribut mappé",
                        name: "Nom"
                    },
                    confirmation: {
                        action: "Confirmer",
                        content: "{{message}} Veuillez procéder avec prudence.",
                        dialect: {
                            message: "Si vous supprimez ce dialecte {{type}}, tous les"
                                + " attributs externes associés seront également supprimés.",
                            name: "dialecte {{type}}"
                        },
                        external: {
                            message: "Ceci supprimera définitivement l'attribut {{type}}.",
                            name: "attribut {{type}}"
                        },
                        header: "Êtes-vous sûr ?",
                        hint: "Veuillez confirmer votre action.",
                        local: {
                            message: "Si vous supprimez cet attribut local, les données de l'utilisateur appartenant "
                                + "à cet attribut seront également supprimés.",
                            name: "attribut local"
                        },
                        message: "Cette action est irréversible et supprimera définitivement le {{name}} sélectionné."
                    },
                    placeholders: {
                        emptyList: {
                            action: {
                                dialect: "Nouveau dialecte {{type}}",
                                external: "Nouvel attribut {{type}}",
                                local: "Nouvel attribut local"
                            },
                            subtitle: "Il n'y a actuellement aucun résultat disponible."
                                + "Vous pouvez ajouter un nouvel élément facilement en suivant les étapes " +
                                "de l'assistant de création.",
                            title: {
                                dialect: "Ajouter un dialecte {{type}}",
                                external: "Ajouter un attribut {{type}}",
                                local: "Ajouter un attribut"
                            }
                        },
                        emptySearch: {
                            action: "Effacer la requête de recherche",
                            subtitle: "Nous n'avons trouvé aucun résultat pour {{searchQuery}}."
                                + "Veuillez essayer un autre terme de recherche.",
                            title: "Aucun résultat trouvé"
                        }
                    },
                    warning: "Cet attribut n'a pas été associé à un attribut" +
                        " dans les annuaires suivants :"
                },
                local: {
                    additionalProperties: {
                        hint: "A utiliser lors de l'écriture d'une extension utilisant les attributs courants",
                        key: "Nom",
                        keyRequiredErrorMessage: "Saisir un nom",
                        value: "Valeur",
                        valueRequiredErrorMessage: "Saisir une valeur"
                    },
                    advancedSearch: {
                        error: "Format de requête de filtre incorrect",
                        form: {
                            inputs: {
                                filterAttribute: {
                                    placeholder: "Ex. nom, attribut URI, etc."
                                },
                                filterCondition: {
                                    placeholder: "Ex. commence par etc."
                                },
                                filterValue: {
                                    placeholder: "Ex. l'adresse, le sexe, etc."
                                }
                            }
                        },
                        placeholder: "Recherche par nom"
                    },
                    attributes: {
                        attributeURI: "URI d'attribut"
                    },
                    confirmation: {
                        content: "Si vous supprimez cet attribut local, les données utilisateur appartenant à " +
                            "cet attribut "
                            + "seront également supprimés. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        hint: "Veuillez confirmer votre action.",
                        message: "Cette action est irréversible et supprimera définitivement l'attribut local " +
                            "sélectionné.",
                        primaryAction: "Confirmer"
                    },
                    dangerZone: {
                        actionTitle: "Supprimer l'attribut local",
                        header: "Supprimer l'attribut local",
                        subheader: "Une fois que vous avez supprimé un attribut local, il est impossible " +
                            "de revenir en arrière. "
                            + "Soyez certains de vous."
                    },
                    forms: {
                        attribute: {
                            placeholder: "Entrez un attribut à associer à",
                            requiredErrorMessage: "Le nom de l'attribut est un champ obligatoire"
                        },
                        attributeHint: "Un identifiant unique pour l'attribut."
                            + " L'ID sera ajouté à l'URI du dialecte pour créer un URI d'attribut",
                        attributeID: {
                            label: "ID d'attribut",
                            placeholder: "Saisir un ID d'attribut",
                            requiredErrorMessage: "Un ID d'attribut est requis."
                        },
                        description: {
                            label: "Description",
                            placeholder: "Saisir une description",
                            requiredErrorMessage: "Description est requis"
                        },
                        descriptionHint: "Une description significative de l'attribut.",
                        displayOrder: {
                            label: "Ordre d'affichage",
                            placeholder: "Saisir l'ordre d'affichage"
                        },
                        displayOrderHint: "Ceci détermine la position à laquelle cet attribut est affiché "
                            + "dans le profil de l'utilisateur et la page d'enregistrement de l'utilisateur",
                        infoMessages: {
                            configApplicabilityInfo: "Veuillez noter que les configurations d'attributs suivantes " +
                                "n'affecteront que les profils d'utilisateurs des clients.",
                            disabledConfigInfo: "Veuillez noter que la section ci-dessous est désactivée car aucun" +
                                " mappage de revendication externe n'a été trouvé pour cet attribut de revendication."
                        },
                        name: {
                            label: "Nom",
                            placeholder: "Saisir un nom pour l'attribut",
                            requiredErrorMessage: "Un nom est requis",
                            validationErrorMessages: {
                                invalidName: "Le nom que vous avez entré contient des caractères non autorisés. Il" +
                                    " ne peut contenir que 30 caractères, y compris les caractères alphanumériques," +
                                    " les points (.), les tirets (-), les traits de soulignement (_), signes plus" +
                                    " (+) et espaces."
                            }
                        },
                        nameHint: "Nom de l'attribut qui figurera sur le profil de l'utilisateur "
                            + "et la page d'enregistrement de l'utilisateur",
                        readOnly: {
                            label: "Mettre cet attribut en lecture seule"
                        },
                        readOnlyHint: "Si cette option est sélectionnée, la valeur de cet attribut est en " +
                        "lecture seule dans un profil utilisateur. Assurez-vous de sélectionner cette " +
                        "option si la valeur de l'attribut est définie par le système.",
                        regEx: {
                            label: "Expression régulière",
                            placeholder: "Entrez une expression régulière"
                        },
                        regExHint: "Cette expression régulière est utilisée pour valider le format que cet " +
                            "attribut peut prendre",
                        required: {
                            label: "Rendre cet attribut obligatoire lors de l'inscription de l'utilisateur"
                        },
                        requiredHint: "S'il est sélectionné, l'utilisateur doit spécifier une valeur pour " +
                        "cet attribut sur le profil.",
                        supportedByDefault: {
                            label: "Afficher cet attribut sur le profil de l'utilisateur et la page " +
                                "d'enregistrement de l'utilisateur"
                        }
                    },
                    mappedAttributes: {
                        hint: "Saisissez l'attribut de chaque magasin d'utilisateurs que vous voulez associer " +
                            "à cet attribut."
                    },
                    notifications: {
                        addLocalClaim: {
                            genericError: {
                                description: "Une erreur s'est produite lors de l'ajout de l'attribut local",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "L'attribut local a été ajouté avec succès !",
                                message: "L'attribut local a été ajouté avec succès"
                            }
                        },
                        deleteClaim: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la suppression de l'attribut local",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Le claim local a été supprimé avec succès!",
                                message: "Le claim local a été supprimé avec succès"
                            }
                        },
                        fetchLocalClaims: {
                            error: {
                                description: "{{description}}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Impossible de récupérer les claims locaux.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Récupération réussie des claims locaux.",
                                message: "Récupération réussie"
                            }
                        },
                        getAClaim: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération de l'attribut local",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        getClaims: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des attributs locaux",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        getLocalDialect: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération du dialecte local",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        updateClaim: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour de l'attribut local",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Cet attribut local a été mis à jour avec succès !",
                                message: "Attribut local mis à jour avec succès"
                            }
                        }
                    },
                    pageLayout: {
                        edit: {
                            back: "Revernir aux attributs locaux",
                            description: "Modifier l'attribut local",
                            tabs: {
                                additionalProperties: "Propriétés supplémentaires",
                                general: "Général",
                                mappedAttributes: "Attributs associés"
                            }
                        },
                        local: {
                            action: "Nouvel attribut local",
                            back: "Revenir aux Attributs et Mappages",
                            description: "Créer et gérer les attributs locaux",
                            title: "Attributs locaux"
                        }
                    },
                    wizard: {
                        header: "Ajouter un attribut local",
                        steps: {
                            general: "Général",
                            mapAttributes: "Attributs associés",
                            summary: "Résumé"
                        },
                        summary: {
                            attribute: "Attribut",
                            attributeURI: "URI d'attribut",
                            displayOrder: "Ordre d'affichage",
                            readOnly: "Cet attribut est en lecture seule",
                            regEx: "Expression régulière",
                            required: "Cet attribut est requis lors de l'inscription de l'utilisateur",
                            supportedByDefault: "Cet attribut est affiché sur le profil de l'utilisateur et sur " +
                                "la page d'enregistrement de l'utilisateur",
                            userstore: "Annuaire"
                        }
                    }
                },
                scopeMappings: {
                    deletionConfirmationModal: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous supprimez cette revendication, la revendication ne sera pas " +
                            "disponible dans le jeton. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et supprimera définitivement le mappage " +
                            "de revendication de champ d'application"
                    }
                }
            },
            emailLocale: {
                buttons: {
                    addLocaleTemplate: "Ajouter une langue",
                    saveChanges: "Sauvegarder les modifications"
                },
                forms: {
                    addLocale: {
                        fields: {
                            bodyEditor: {
                                label: "Corps",
                                validations: {
                                    empty: "Le corps de l'e-mail ne peut pas être vide."
                                }
                            },
                            locale: {
                                label: "Langue",
                                placeholder: "Sélectionnez une langue",
                                validations: {
                                    empty: "La langue est obligatoire"
                                }
                            },
                            signatureEditor: {
                                label: "Signature du courrier",
                                validations: {
                                    empty: "La signature électronique ne peut pas être vide."
                                }
                            },
                            subject: {
                                label: "Objet",
                                placeholder: "Saisissez l'objet de votre e-mail",
                                validations: {
                                    empty: "L'objet de l'e-mail est obligatoire"
                                }
                            }
                        }
                    }
                }
            },
            emailTemplateTypes: {
                advancedSearch: {
                    error: "Format de requête de filtre incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Par exemple. Nom etc."
                            },
                            filterCondition: {
                                placeholder: "Par exemple. Commence par etc."
                            },
                            filterValue: {
                                placeholder: "Par exemple. TOTP, passwordResetSuccess, etc."
                            }
                        }
                    },
                    placeholder: "Rechercher par type de modèle d'e-mail"
                },
                buttons: {
                    createTemplateType: "Créer un type de modèle",
                    deleteTemplate: "Supprimer le modèle",
                    editTemplate: "Modifier le modèle",
                    newType: "Nouveau type de modèle"
                },
                confirmations: {
                    deleteTemplateType: {
                        assertionHint: "Veuillez saisir <1>{{ id }}</1> pour confirmer.",
                        content: "En supprimant ce type de modèle d'e-mail, vous supprimez également tous " +
                            " les modèles d'e-mails qui lui sont associés. De plus, les notifications associés " +
                            " à ce type de modèle n'auront plus de modèles de mails associés. " +
                            " Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le type de modèle " +
                            "d'e-mail sélectionné."
                    }
                },
                forms: {
                    addTemplateType: {
                        fields: {
                            type: {
                                label: "Nom du type de modèle",
                                placeholder: "Saisir un nom de type de modèle",
                                validations: {
                                    empty: "Le nom du type de modèle est nécessaire pour poursuivre."
                                }
                            }
                        }
                    }
                },
                list: {
                    actions: "Actions",
                    name: "Nom"
                },
                notifications: {
                    createTemplateType: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de création de type de modèle d'e-mail."
                        },
                        genericError: {
                            description: "Impossible de créer le type de modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le type de modèle de mail a été créé avec succès.",
                            message: "Création du type de modèle d'e-mail réussie"
                        }
                    },
                    deleteTemplateType: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression du type de modèle d'e-mail."
                        },
                        genericError: {
                            description: "Impossible de supprimer le type de modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le type de modèle d'e-mail a été supprimé avec succès.",
                            message: "Type de modèle d'e-mail supprimé avec succès"
                        }
                    },
                    getTemplateTypes: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "La récupération des types de modèles de mail a échoué.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les types de modèles de mails ont été récupérés avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    updateTemplateType: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour du type de modèle d'e-mail."
                        },
                        genericError: {
                            description: "Impossible de mettre à jour le type de modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le type de modèle d'e-mail a été mis à jour avec succès.",
                            message: "Mise à jour réussie du type de modèle d'e-mail"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Nouveau type de modèle",
                        subtitles: {
                            0: "Il n'y a actuellement aucun type de modèle disponible.",
                            1: "Vous pouvez en ajouter en ",
                            2: "cliquant sur le bouton ci-dessous."
                        },
                        title: "Ajouter un nouveau type de modèle"
                    },
                    emptySearch: {
                        action: "Effacer la requête de recherche",
                        subtitles: "Nous n'avons trouvé aucun résultat pour {{searchQuery}}."
                            + "Veuillez essayer un autre terme de recherche.",
                        title: "Aucun résultat trouvé"
                    }
                },
                wizards: {
                    addTemplateType: {
                        heading: "Créer un type de modèle d'e-mail",
                        steps: {
                            templateType: {
                                heading: "Type de modèle"
                            }
                        },
                        subHeading: "Créer un nouveau type de modèle pour répondre à des besoins en matière d'e-mail."
                    }
                }
            },
            emailTemplates: {
                buttons: {
                    deleteTemplate: "Supprimer le modèle",
                    editTemplate: "Modifier le modèle",
                    newTemplate: "Nouveau modèle",
                    viewTemplate: "Voir le modèle"
                },
                confirmations: {
                    deleteTemplate: {
                        assertionHint: "Veuillez saisir <1>{{ id }}</1> pour confirmer.",
                        content: "En supprimant ce modèle d'e-mail, tous les processus associés ne disposeront " +
                            "plus de modèle valide pour fonctionner. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le modèle " +
                            "d'e-mail sélectionné."
                    }
                },
                editor: {
                    tabs: {
                        code: {
                            tabName: "Code HTML"
                        },
                        preview: {
                            tabName: "Prévisualisation"
                        }
                    }
                },
                list: {
                    actions: "Actions",
                    name: "Nom"
                },
                notifications: {
                    createTemplate: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de création d'un modèle d'e-mail."
                        },
                        genericError: {
                            description: "Impossible de créer un modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le modèle d'e-mail a été créé avec succès.",
                            message: "Création du modèle d'e-mail réussie"
                        }
                    },
                    deleteTemplate: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression d'un modèle d'e-mail."
                        },
                        genericError: {
                            description: "Impossible de supprimer un modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le modèle d'e-mail a été supprimé avec succès.",
                            message: "Modèle d'e-mail supprimé avec succès"
                        }
                    },
                    getTemplateDetails: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de récupérer les détails du modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le modèle de mail a été récupéré avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    getTemplates: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de récupérer les modèles d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les modèles d'e-mail ont été récupérés avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    iframeUnsupported: {
                        genericError: {
                            description: "Votre navigateur ne supporte pas les iframes.",
                            message: "Non pris en charge"
                        }
                    },
                    updateTemplate: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour du modèle d'e-mail."
                        },
                        genericError: {
                            description: "Impossible de mettre à jour le modèle d'e-mail.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le modèle d'e-mail a été mis à jour avec succès.",
                            message: "Mise à jour du modèle d'e-mail réussie"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Nouveau modèle",
                        subtitles: {
                            0: "Il n'y a actuellement aucun modèle d'e-mail disponible pour ",
                            1: "le type séléctionné. Vous pouvez en ajouter en ",
                            2: "cliquant sur le bouton ci-dessous."
                        },
                        title: "Ajouter un modèle"
                    }
                },
                viewTemplate: {
                    heading: "Aperçu du modèle d'e-mail"
                }
            },
            footer: {
                copyright: "WSO2 Identity Server © {{year}}"
            },
            governanceConnectors: {
                categories: "Catégories",
                connectorSubHeading: "Configurer les paramètre {{ name }}.",
                disabled: "Désactivé",
                enabled: "Activé",
                form: {
                    errors: {
                        format: "Le format est incorrect.",
                        positiveIntegers: "Le nombre ne doit pas être inférieur à 0."
                    }
                },
                notifications: {
                    getConnector: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du connecteur.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    getConnectorCategories: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des catégories " +
                                "de connecteurs.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConnector: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du connecteur.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le connecteur {{ name }} a été mis à jour avec succès.",
                            message: "Mise à jour réussie."
                        }
                    }
                },
                pageSubHeading: "Configurer et gérer {{ name }}."

            },
            groups: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ex. Nom de groupe."
                            },
                            filterCondition: {
                                placeholder: "Ex. Commence par, etc."
                            },
                            filterValue: {
                                placeholder: "Saisir une valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Rechercher par nom de groupe"
                },
                edit: {
                    basics: {
                        fields: {
                            groupName: {
                                name: "Nom de groupe",
                                placeholder: "Saisir le  nom du groupe",
                                required: "Le nom du groupe est obligatoire"
                            }
                        }
                    },
                    roles: {
                        addRolesModal: {
                            heading: "Mettre à jour les rôles de groupe",
                            subHeading: "Ajoutez de nouveaux rôles ou supprimez les rôles existants attribués " +
                                "au groupe."
                        },
                        subHeading: "Ajoutez ou supprimez les rôles auxquels ce groupe est affecté et " +
                             "notez que cela affectera l'exécution de certaines tâches."
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        lastModified: "Dernière modification",
                        name: "Nom",
                        source: "Magasin d'utilisateurs"
                    },
                    storeOptions: "Sélectionner un annuaire"
                },
                notifications: {
                    createGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur est survenue lors de la création du groupe."
                        },
                        genericError: {
                            description: "Impossible de créer le groupe.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le groupe a été créé avec succès.",
                            message: "Groupe créé avec succès."
                        }
                    },
                    createPermission: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de l'ajout d'une permission au groupe."
                        },
                        genericError: {
                            description: "Impossible d'ajouter des permissions au groupe.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les permissions ont été ajoutées avec succès au groupe.",
                            message: "Groupe créé avec succès."
                        }
                    },
                    deleteGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression du groupe sélectionné."
                        },
                        genericError: {
                            description: "Impossible de supprimer le groupe sélectionné.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le groupe sélectionné a été supprimé avec succès.",
                            message: "Groupe supprimé avec succès"
                        }
                    },
                    fetchGroups: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des groupes.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    updateGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour du groupe sélectionné."
                        },
                        genericError: {
                            description: "Impossible de mettre à jour le groupe sélectionné.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le groupe sélectionné a été mis à jour avec succès.",
                            message: "Groupe mis à jour avec succès"
                        }
                    }
                },
                placeholders: {
                    groupsError: {
                        subtitles: [
                            "Une erreur s'est produite lors de la tentative de récupération des groupes depuis le " +
                            "magasin de l'utilisateur.",
                            "Veuillez vous assurer que les détails de connexion de l'utilisateur sont exacts."
                        ],
                        title:"Impossible de récupérer les groupes depuis le magasin d'utilisateur"
                    }
                }
            },
            header: {
                links: {
                    devPortalNav: "Portail développeurs",
                    userPortalNav: "Mon compte"
                }
            },
            helpPanel: {
                notifications: {
                    pin: {
                        success: {
                            description: "Le panneau d'aide apparaîtra toujours {{state}} sauf si vous le " +
                                "modifiez explicitement.",
                            message: "Panneau d'aide {{state}}"
                        }
                    }
                }
            },
            oidcScopes: {
                addAttributes: {
                    description: "Sélectionnez les attributs utilisateur que vous souhaitez " +
                        "associer à l'étendue {{name}}."
                },
                buttons: {
                    addScope: "Nouveau scope OIDC"
                },
                confirmationModals: {
                    deleteClaim: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous supprimez ce claims, vous ne pourrez pas le récupérer. " +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement la claim OIDC."
                    },
                    deleteScope: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous supprimez ce scope, vous ne pourrez pas le récupérer.." +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le scope OIDC."
                    }
                },
                editScope: {
                    claimList: {
                        addClaim:  "Nouvel attribut",
                        emptyPlaceholder: {
                            action: "Ajouter un attribut",
                            subtitles: {
                                0: "Il n'y a pas d'attributs ajoutés pour ce scope OIDC.",
                                1: "Veuillez ajouter les attributs requis pour les visualiser ici."
                            },
                            title: "Pas d'attributs OIDC"
                        },
                        emptySearch: {
                            action: "Voir tout",
                            subtitles: {
                                0: "Nous n'avons pas trouvé l'attribut recherché.",
                                1: "Veuillez essayer un autre nom."
                            },
                            title: "Aucun résultat trouvé"
                        },
                        popupDelete: "Supprimer l'attribut",
                        searchClaims: "Recherche d'attributs",
                        subTitle: "Ajouter ou supprimer des attributs d'un scope OIDC",
                        title: "{{ name }}"
                    }
                },
                forms: {
                    addScopeForm: {
                        inputs: {
                            description: {
                                label: "Description",
                                placeholder: "Entrez une description pour le scope"
                            },
                            displayName: {
                                label: "Nom d'affichage",
                                placeholder: "Entrez le nom d'affichage",
                                validations: {
                                    empty: "Ce champ ne peut pas être vide"
                                }
                            },
                            scopeName: {
                                label: "Nom du scope",
                                placeholder: "Entrez le nom du scope",
                                validations: {
                                    empty: "Ce champ ne peut pas être vide",
                                    invalid: "La portée ne peut contenir que des caractères alphanumériques et _. " +
                                    "Et doit avoir une longueur comprise entre 3 et 40 caractères."
                                }
                            }
                        }
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Nom"
                    },
                    empty: {
                        action: "Ajouter le scope OIDC",
                        subtitles: {
                            0: "Il n'y a pas de scopes OIDC dans le système.",
                            1: "Veuillez ajouter de nouveaux scopes OIDC pour les voir ici."
                        },
                        title: "Pas de scope OIDC"
                    },
                    searchPlaceholder: "Recherche par nom d'étendue"
                },
                notifications: {
                    addOIDCClaim: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de création"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'ajout de l'attribut OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Création réussie du nouvel attribut OIDC",
                            message: "Création réussie"
                        }
                    },
                    addOIDCScope: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de création"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création du scope OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Réussir le nouveau scope OIDC",
                            message: "Création réussie"
                        }
                    },
                    claimsMandatory: {
                        error: {
                            description: "Pour ajouter une étendue, vous devez vous assurer que " +
                                "la portée a au moins un attribut.",
                            message: "Vous devez sélectionner au moins un attribut."
                        }
                    },
                    deleteOIDCScope: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du scope OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Suppression avec succès du scope OIDC.",
                            message: "Suppression réussie"
                        }
                    },
                    deleteOIDClaim: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression de l'attribut OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Suppression avec succès de l'attribut OIDC.",
                            message: "Suppression réussie"
                        }
                    },
                    fetchOIDCScope: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des détails du scope OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Obtention réussie des détails du scope OIDC.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchOIDCScopes: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur est survenue lors de la récupération des scopes OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Récupération réussie de la liste des scopes OIDC.",
                            message: "Récupération réussie"
                        }
                    },
                    fetchOIDClaims: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des attributs OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "écupération réussie de la liste des scopes OIDC.",
                            message: "Récupération réussie"
                        }
                    },
                    updateOIDCScope: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du scope OIDC.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour avec succès du scope OIDC.",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                placeholders:{
                    emptyList: {
                        action: "Nouveau scope OIDC",
                        subtitles: {
                            0: "Actuellement, il n'y a pas de scope OIDC.",
                            1: "Vous pouvez ajouter un nouveau scope OIDC facilement en suivant les",
                            2: "étapes de l'assistant de création."
                        },
                        title: "Ajouter un nouveau scope OIDC"
                    },
                    emptySearch: {
                        action: "Voir tout",
                        subtitles: {
                            0: "Nous n'avons pas trouvé la portée que vous avez recherchée.",
                            1: "Veuillez essayer un autre nom."
                        },
                        title: "Aucun résultat trouvé"
                    }
                },
                wizards: {
                    addScopeWizard: {
                        buttons: {
                            next: "Suivant",
                            previous: "Précédent"
                        },
                        claimList: {
                            searchPlaceholder: "Recherche d'attributs",
                            table: {
                                emptyPlaceholders: {
                                    assigned: "Tous les attributs disponibles sont assignés pour ce scope OIDC.",
                                    unAssigned: "Aucun attribut n'est assigné pour ce scope OIDC."
                                },
                                header: "Attributs"
                            }
                        },
                        steps: {
                            basicDetails: "Détails de base",
                            claims: "Ajouter des attributs"
                        },
                        subTitle: "Créer un nouveau scope OIDC avec les attributs requis",
                        title: "Créer le scope OIDC"
                    }
                }
            },
            organizations: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Par exemple. Nom etc"
                            },
                            filterCondition: {
                                placeholder: "Par exemple. Commence par etc.."
                            },
                            filterValue: {
                                placeholder: "Entrez la valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Rechercher par nom"
                },
                confirmations: {
                    deleteOrganization: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous supprimez cette organisation, toutes les données associées à cette " +
                            "organisation seront supprimées. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et supprimera entièrement l'organisation."
                    }
                },
                list: {
                    actions: {
                        add: "Ajouter une organisation"
                    },
                    columns: {
                        actions: "Actions",
                        name: "Nom"
                    }
                },
                notifications: {
                    deleteOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la suppression de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'organisation a bien été supprimée",
                            message: "Organisation supprimée avec succès"
                        }
                    },
                    fetchOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la récupération de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'organisation a bien été récupérée",
                            message: "Organisation récupérée avec succès"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Ajouter une organisation",
                        subtitles: {
                            0: "Il n'y a pas d'organisations pour le moment.",
                            1: "Vous pouvez facilement ajouter une nouvelle organisation en",
                            2: "en cliquant sur le bouton ci-dessous."
                        },
                        title: "Ajouter une nouvelle organisation"
                    }
                },
                subTitle: "Créer et gérer des organisations.",
                title: "Organisations"
            },
            overview: {
                widgets: {
                    insights: {
                        groups: {
                            heading: "Groupes",
                            subHeading: "Aperçu des groupes"
                        },
                        users: {
                            heading: "Utilisateurs",
                            subHeading: "Aperçu des utilisateurs"
                        }
                    },
                    overview: {
                        cards: {
                            groups: {
                                heading: "Groupes"
                            },
                            users: {
                                heading: "Utilisateurs"
                            },
                            userstores: {
                                heading: "Annuaires"
                            }
                        },
                        heading: "Vue d'ensemble",
                        subHeading: "Ensemble de statistiques de base pour comprendre le statut de l'instance."
                    },
                    quickLinks: {
                        cards: {
                            certificates: {
                                heading: "Certificats",
                                subHeading: "Gérer les certificats dans le magasin de clés."
                            },
                            dialects: {
                                heading: "Dialectes d'attributs",
                                subHeading: "Gérer les dialectes d'attributs."
                            },
                            emailTemplates: {
                                heading: "Modèles d'e-mail",
                                subHeading: "Gérer les modèles d'e-mail."
                            },
                            generalConfigs: {
                                heading: "Configurations générales",
                                subHeading: "Gérer les configurations, les politiques, etc."
                            },
                            groups: {
                                heading: "Groupes",
                                subHeading: "Gérer les groupes d'utilisateurs et les permissions."
                            },
                            roles: {
                                heading: "Rôles",
                                subHeading: "Gérer les rôles et les permissions des utilisateurs."
                            }
                        },
                        heading: "Accès rapides",
                        subHeading: "Liens permettant de naviguer rapidement vers les fonctionnalités."
                    }
                }
            },
            remoteFetch: {
                components: {
                    status: {
                        details: "Détails",
                        header: "Configurations à distance",
                        hint: "Aucune application déployée actuellement.",
                        linkPopup: {
                            content: "",
                            header: "URL du référentiel Github",
                            subHeader: ""
                        },
                        refetch: "Récupérer"
                    }
                },
                forms: {
                    getRemoteFetchForm: {
                        actions: {
                            remove: "Supprimer la configuration",
                            save: "enregistrer la configuration"
                        },
                        fields: {
                            accessToken: {
                                label: "Jeton d'accès personnel Github",
                                placeholder: "Jeton d'accès personnel"
                            },
                            connectivity: {
                                children: {
                                    polling: {
                                        label: "Polling"
                                    },
                                    webhook: {
                                        label: "Webhook"
                                    }
                                },
                                label: "Mécanisme de connectivité"
                            },
                            enable: {
                                hint: "Activer la configuration pour récupérer les applications",
                                label: "Activer la configuration de récupération"
                            },
                            gitBranch: {
                                hint: "Activer la configuration pour récupérer les applications",
                                label: "Branche Github",
                                placeholder: "Ex : Main",
                                validations: {
                                    required: "La branche Github est requise."
                                }
                            },
                            gitFolder: {
                                hint: "Activer la configuration pour récupérer les applications",
                                label: "Répertoire GitHub",
                                placeholder: "Ex : SampleConfigFolder/",
                                validations: {
                                    required: "Le répertoire de configuration Github est requis."
                                }
                            },
                            gitURL: {
                                label: "URL du référentiel GitHub",
                                placeholder: "Ex : https://github.com/samplerepo/sample-project",
                                validations: {
                                    required: "L'URL du référentiel Github est requise."
                                }
                            },
                            pollingFrequency: {
                                label: "Fréquence d'interrogation"
                            },
                            sharedKey: {
                                label: "Clé partagée GitHub"
                            },
                            username: {
                                label: "Nom d'utilisateur Github",
                                placeholder: "Ex: John Doe"
                            }
                        },
                        heading: {
                            subTitle: "Configurer le référentiel pour récupérer les applications",
                            title: "Référentiel de configuration d'application"
                        }
                    }
                },
                modal: {
                    appStatusModal: {
                        description: "",
                        heading: "Statut de récupération de l'application",
                        primaryButton: "Récupérer les applications",
                        secondaryButton: ""
                    }
                },
                notifications: {
                    createRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "Créer une erreur"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création de la configuration " +
                                "du dépôt distant.",
                            message: "Créer une erreur"
                        },
                        success: {
                            description: "Config de dépôt distant créé avec succès.",
                            message: "Créer avec succès"
                        }
                    },
                    deleteRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "Supprimer l'erreur"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression de la " +
                                "configuration du dépôt distant.",
                            message: "Supprimer l'erreur"
                        },
                        success: {
                            description: "La configuration du dépôt distant a bien été supprimée.",
                            message: "Suppression réussie"
                        }
                    },
                    getConfigDeploymentDetails: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des détails du " +
                                "déploiement.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Les détails du déploiement ont bien été récupérés.",
                            message: "Récupération réussie"
                        }
                    },
                    getConfigList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération de la liste de " +
                                "configuration du déploiement.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Liste de configuration de déploiement récupérée avec succès.",
                            message: "Récupération réussie"
                        }
                    },
                    getRemoteRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération de la configuration " +
                                "du dépôt.",
                            message: "Erreur de récupération"
                        },
                        success: {
                            description: "Récupération réussie de la configuration du dépôt.",
                            message: "Récupération réussie"
                        }
                    },
                    triggerConfigDeployment: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de déploiement"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors du déploiement des configurations de dépôt.",
                            message: "Erreur de déploiement"
                        },
                        success: {
                            description: "Configurations de dépôt déployées avec succès.",
                            message: "Déploiement réussi"
                        }
                    }
                },
                pages: {
                    listing: {
                        subTitle: "Configurez le référentiel github pour qu'il fonctionne de manière " +
                            "transparente avec le serveur d'identité.",
                        title: "Configurations à distance"
                    }
                },
                placeholders: {
                    emptyListPlaceholder: {
                        action: "Configurer le référentiel",
                        subtitles: "Actuellement, aucun référentiel n'est configuré. Vous pouvez ajouter une " +
                            "nouvelle configuration.",
                        title: "Ajouter une configuration"
                    }
                }
            },
            roles: {
                addRoleWizard: {
                    buttons: {
                        finish: "Terminer",
                        next: "Suivant",
                        previous: "Précédent"
                    },
                    forms: {
                        roleBasicDetails: {
                            domain: {
                                label: {
                                    group: "Annuaire",
                                    role: "Type de rôle"
                                },
                                placeholder: "Domaine",
                                validation: {
                                    empty: {
                                        group: "Sélectionner un annuaire",
                                        role: "Sélectionner un type de rôle"
                                    }
                                }
                            },
                            roleName: {
                                hint: "Un nom pour le groupe d'utilisateurs.",
                                label: "Nome de {{type}}",
                                placeholder: "Saisir un nom de {{type}}",
                                validations: {
                                    duplicate: "Un {{type}} avec ce nom existe déjà.",
                                    empty: "Le nom de {{type}} est obligatoire",
                                    invalid: "Un nom {{type}} ne peut contenir que des caractères " +
                                        "alphanumériques, - et _. Et doit avoir une longueur comprise entre 3 " +
                                        "et 30 caractères."
                                }
                            }
                        }
                    },
                    heading: "Créer un {{type}}",
                    permissions: {
                        buttons: {
                            collapseAll: "Tout réduire",
                            expandAll: "Tout étendre",
                            update: "Mettre à jour"
                        }
                    },
                    subHeading: "Créer un nouveau {{type}} dans le système avec des permissions spécifiques",
                    summary: {
                        labels: {
                            domain: {
                                group: "Annuaire",
                                role: "Type de rôle"
                            },
                            groups: "Groupe (s) attribué (s)",
                            permissions: "Permission(s)",
                            roleName: "Nom de {{type}}",
                            users: "Assigné aux utilisateurs"
                        }
                    },
                    users: {
                        assignUserModal: {
                            heading: "Mettre à jour le {{type}} d'utilisateurs",
                            hint: "Sélectionnez des utilisateurs pour les ajouter au groupe d'utilisateurs.",
                            list: {
                                listHeader: "Nom",
                                searchPlaceholder: "Rechercher des utilisateurs"
                            },
                            subHeading: "Ajouter de nouveaux utilisateurs ou supprimer les utilisateurs " +
                                "existants affectés a {{type}}."
                        }
                    },
                    wizardSteps: {
                        0: "Informations de base",
                        1: "Sélection de permissions",
                        2: "Affectation des utilisateurs",
                        3: "Résumé",
                        4: "Groupes et utilisateurs",
                        5: "Attribuer des rôles"
                    }
                },
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ex. nom d'un rôle."
                            },
                            filterCondition: {
                                placeholder: "Ex. Commence par, etc."
                            },
                            filterValue: {
                                placeholder: "Saisir une valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Rechercher par nom de rôle"
                },
                edit: {
                    basics: {
                        buttons: {
                            update: "Mettre à jour"
                        },
                        confirmation: {
                            assertionHint: "Veuillez confirmer votre action.",
                            content: "Si vous supprimez ce {{type}}, les permissions qui lui sont attachées " +
                                "seront supprimées et les utilisateurs qui y sont rattachés ne pourront plus " +
                                "effectuer les actions prévues qui étaient précédemment autorisées. " +
                                "Veuillez procéder avec prudence.",
                            header: "Êtes-vous sûr ?",
                            message: "Cette action est irréversible et supprimera définitivement le {{type}} " +
                                "sélectionné"
                        },
                        dangerZone: {
                            actionTitle: "Supprimer {{type}}",
                            header: "Supprimer {{type}}",
                            subheader: "Une fois que vous avez supprimé le {{type}}, il n'y a plus de retour " +
                                "en arrière. Veuillez en être certain."
                        },
                        fields: {
                            roleName: {
                                name: "Nom du rôle",
                                placeholder: "Saisissez votre nom de rôle",
                                required: "Le nom du rôle est requis"

                            }
                        }
                    },
                    groups: {
                        addGroupsModal: {
                            heading: "Mettre à jour les groupes de rôles",
                            subHeading: "Ajoutez de nouveaux groupes ou supprimez les groupes existants " +
                                "affectés au rôle."
                        },
                        emptyPlaceholder: {
                            action: "Attribuer un groupe",
                            subtitles: "Aucun groupe n'est affecté à ce rôle pour le moment.",
                            title: "Aucun groupe attribué"
                        },
                        heading: "Groupes attribués",
                        subHeading: "Ajoutez ou supprimez les groupes affectés au rôle. Notez que ceci"
                            + "affectera l'exécution de certaines tâches."
                    },
                    menuItems: {
                        basic: "Fondamentaux",
                        groups: "Groupes",
                        permissions: "Permissions",
                        roles: "Rôles",
                        users: "Utilisateurs"
                    },
                    users: {
                        list: {
                            emptyPlaceholder: {
                                action: "Affecter un utilisateur",
                                subtitles: "Aucun utilisateur n'est assigné à ce rôle pour le moment.",
                                title: "Aucun utilisateur assigné"
                            },
                            header: "Utilisateurs"
                        }
                    }
                },
                list: {
                    buttons: {
                        addButton: "Nouveau {{type}}",
                        filterDropdown: "Filtrer par"
                    },
                    columns: {
                        actions: "Actions",
                        lastModified: "Dernière modification",
                        name: "Nom"
                    },
                    confirmations: {
                        deleteItem: {
                            assertionHint: "Veuillez confirmer votre action.",
                            content: "Si vous supprimez ce {{type}}, les permissions qui y sont attachées seront " +
                                "supprimées et les utilisateurs qui y sont rattachés ne pourront plus effectuer " +
                                "les actions prévues qui étaient précédemment autorisées. Veuillez procéder " +
                                "avec prudence.",
                            header: "Êtes-vous sûr ?",
                            message: "Cette action est irréversible et supprimera définitivement le {{type}} " +
                                "sélectionné"
                        }
                    },
                    emptyPlaceholders: {
                        emptyRoleList: {
                            action: "Nouveau {{type}}",
                            subtitles: {
                                0: "Il n'y a actuellement aucun {{type}} disponible.",
                                1: "Vous pouvez en ajouter facilement en suivant les",
                                2: "étapes de l'assistant de création de {{type}}."
                            },
                            title: "Ajouter un nouveau {{type}}"
                        },
                        search: {
                            action: "Effacer la recherche",
                            subtitles: {
                                0: "La recherche pour '{{searchQuery}}' n'a renvoyé aucun résultat",
                                1: "Veuillez essayer un autre terme."
                            },
                            title: "Aucun résultat"
                        }
                    },
                    popups: {
                        delete: "Supprimer le {{type}}",
                        edit: "Modifier le {{type}}"
                    }
                },
                notifications: {
                    createPermission: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de l'ajout de la permission au rôle."
                        },
                        genericError: {
                            description: "Impossible d'ajouter des permissions au rôle.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les permissions ont été ajoutées avec succès au rôle.",
                            message: "Rôle créé avec succès."
                        }
                    },
                    createRole: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la création du rôle."
                        },
                        genericError: {
                            description: "Impossible de créer le rôle.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le rôle a été créé avec succès.",
                            message: "Rôle créé avec succès"
                        }
                    },
                    deleteRole: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression du rôle sélectionné."
                        },
                        genericError: {
                            description: "Impossible de supprimer le rôle sélectionné.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le rôle sélectionné a été supprimé avec succès.",
                            message: "Rôle supprimé avec succès"
                        }
                    },
                    fetchRoles: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des rôles.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    updateRole: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour du rôle sélectionné."
                        },
                        genericError: {
                            description: "Impossible de mettre à jour le rôle sélectionné.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le rôle sélectionné a été mis à jour avec succès.",
                            message: "Rôle mis à jour avec succès"
                        }
                    }
                }
            },
            serverConfigs: {
                realmConfiguration: {
                    actionTitles: {
                        config: "Plus"
                    },
                    confirmation: {
                        heading: "Confirmation",
                        message: "Souhaitez-vous sauvegarder les configurations liées au domaine d'identité ?"
                    },
                    description: "Configurer les paramètres généraux relatifs au domaine d'identité.",
                    form: {
                        homeRealmIdentifiers: {
                            hint: "Entrez l'identifiant du domaine d'identité. Plusieurs identifiants sont autorisés.",
                            label: "Identifiants du domaine d'identité",
                            placeholder: "localhost"
                        },
                        idleSessionTimeoutPeriod: {
                            hint: "Saisir le délai d'inactivité de la session en minutes",
                            label: "Temps d'inactivité maximum"
                        },
                        rememberMePeriod: {
                            hint: "Saisir la durée de mémorisation en minutes",
                            label: "Durée de mémorisation"
                        }
                    },
                    heading: "Configurations du domaine d'identité",
                    notifications: {
                        emptyHomeRealmIdentifiers: {
                            error: {
                                description: "Vous devez déclarer au moins un identifiant de domaine d'identité local.",
                                message: "Erreur de validation des données"
                            },
                            genericError: {
                                description: "",
                                message: ""
                            },
                            success: {
                                description: "",
                                message: ""
                            }
                        },
                        getConfigurations: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des configuration du " +
                                    "domaine d'identité.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "",
                                message: ""
                            }
                        },
                        updateConfigurations: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur de mise à jour"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour des configuration du " +
                                    "domaine d'identité.",
                                message: "Erreur de mise à jour"
                            },
                            success: {
                                description: "Mise à jour avec succès du domaine d'identité.",
                                message: "Mise à jour réussie"
                            }
                        }
                    }
                }
            },
            sidePanel: {
                addEmailTemplate: "Ajouter un modèle d'e-mail",
                addEmailTemplateLocale: "Ajouter une langue de modèle d'e-mail",
                approvals: "Approbations",
                attributeDialects: "Les attributs",
                categories: {
                    attributes: "Attributs Utilisateur",
                    certificates: "Certificats",
                    configurations: "Configurations",
                    general: "Général",
                    organizations: "Organisations",
                    users: "Utilisateurs",
                    userstores: "Annuaires"
                },
                certificates: "Certificats",
                configurations: "Configurations",
                editEmailTemplate: "Modèles d'e-mail",
                editExternalDialect: "Modifier le dialecte {{type}}",
                editGroups: "Modifier le groupe",
                editLocalClaims: "Modifier les attributs locaux",
                editRoles: "Modifier le rôle",
                editUsers: "Modifier l'utilisateur",
                editUserstore: "Modifier l'annuaire",
                emailTemplateTypes: "",
                emailTemplates: "Modèles d'e-mail",
                generalConfigurations: "Général",
                groups: "Groupes",
                localDialect: "Dialecte local",
                organizations: "Organisations",
                overview: "Vue d'ensemble",
                roles: "Rôles",
                users: "Utilisateurs",
                userstoreTemplates: "Modèles d'annuaires",
                userstores: "Annuaires"
            },
            transferList: {
                list: {
                    emptyPlaceholders: {
                        default: "Il n'y a aucun élément dans cette liste pour le moment.",
                        groups: {
                            selected: "Aucun {{type}} n'est attribué à ce groupe.",
                            unselected: "Aucun {{type}} disponible ne peut être assigné à ce groupe."
                        },
                        roles: {
                            selected: "Aucun {{type}} n'est assigné à ce rôle.",
                            unselected: "Aucun {{type}} disponible ne peut être assigné à ce rôle."
                        },
                        users: {
                            roles: {
                                selected: "Aucun {{type}} n'est attribué à cet utilisateur.",
                                unselected: "Aucun {{type}} disponible ne peut être attribué à cet utilisateur."
                            }
                        }
                    },
                    headers: {
                        0: "Domaine",
                        1: "Nom"
                    }
                },
                searchPlaceholder: "Rechercher un {{type}}"
            },
            user: {
                deleteJITUser: {
                    confirmationModal: {
                        content: "Si vous supprimez cet utilisateur, l'utilisateur ne pourra pas se connecter à " +
                            "Mon compte ou à toute autre application à laquelle l'utilisateur était abonné avant " +
                            "la prochaine connexion de l'utilisateur à l'aide d'une option de connexion sociale."
                    }
                },
                deleteUser: {
                    confirmationModal: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous supprimez cet utilisateur, l'utilisateur ne pourra pas se " +
                            "connecter à Mon compte ou à toute autre application à laquelle l'utilisateur " +
                            "était abonné auparavant. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le compte utilisateur."
                    }
                },
                disableUser: {
                    confirmationModal: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous désactivez cet utilisateur, l'utilisateur ne pourra pas se connecter à " +
                            "Mon compte ou à toute autre application à laquelle l'utilisateur était abonné " +
                            "auparavant.",
                        header: "Êtes-vous sûr?",
                        message: "Assurez-vous que l'utilisateur n'a plus besoin d'accéder au système."
                    }
                },
                editUser: {
                    dangerZoneGroup: {
                        deleteUserZone: {
                            actionTitle: "Supprimer l'utilisateur",
                            buttonDisableHint: "L'option de suppression est désactivée car cet utilisateur est " +
                                "géré dans un magasin d'utilisateurs distant.",
                            header: "Supprimer l'utilisateur",
                            subheader: "Cette action supprimera définitivement l'utilisateur de l'organisation. " +
                                "Veuillez être certain avant de continuer."
                        },
                        disableUserZone: {
                            actionTitle: "Désactiver l'utilisateur",
                            header: "Désactiver l'utilisateur",
                            subheader: "Une fois que vous avez désactivé un compte, l'utilisateur ne peut pas " +
                                "accéder au système."
                        },
                        header: "Zone sensible",
                        lockUserZone: {
                            actionTitle: "Verrouiller l'utilisateur",
                            header: "Verrouiller l'utilisateur",
                            subheader: "Une fois le compte verrouillé, l'utilisateur ne peut plus se connecter au " +
                                "système."
                        },
                        passwordResetZone: {
                            actionTitle: "Réinitialiser le mot de passe",
                            buttonHint: "Ce compte utilisateur doit être déverrouillé pour réinitialiser le mot de " +
                                "passe.",
                            header: "Réinitialiser le mot de passe",
                            subheader: "Une fois le mot de passe modifié, l'utilisateur ne pourra plus se connecter " +
                                "à aucune application en utilisant le mot de passe actuel."
                        }
                    },
                    dateOfBirth: {
                        placeholder: {
                            part1:"Entrer le",
                            part2: "au format AAAA-MM-JJ"
                        }
                    }
                },
                forms: {
                    addUserForm: {
                        buttons: {
                            radioButton: {
                                label: "Sélectionnez la méthode pour réinitialiser le mot de passe utilisateur",
                                options: {
                                    askPassword: "Invitez l'utilisateur à définir son propre mot de passe",
                                    createPassword: "Définissez un mot de passe temporaire pour l'utilisateur"

                                }
                            }
                        },
                        inputs: {
                            confirmPassword: {
                                label: "Confirmation",
                                placeholder: "Veuillez confirmer le mot de passe",
                                validations: {
                                    empty: "La confirmation est obligatoire",
                                    mismatch: "Les mots de passe saisis ne correspondent pas"
                                }
                            },
                            domain: {
                                label: "Annuaire",
                                placeholder: "Veuillez sélectionner un annuaire",
                                validations: {
                                    empty: "L'annuaire est obligatoire."
                                }
                            },
                            email: {
                                label: "Adresse e-mail",
                                placeholder: "Veuillez saisir une adresse e-mail",
                                validations: {
                                    empty: "L'adresse e-mail est obligatoire",
                                    invalid: "L'adresse e-mail est invalide"
                                }
                            },
                            firstName: {
                                label: "Prénom",
                                placeholder: "Entrez le prénom",
                                validations: {
                                    empty: "Le prénom est obligatoire"
                                }
                            },
                            lastName: {
                                label: "Nom de famille",
                                placeholder: "Entrez le nom de famille",
                                validations: {
                                    empty: "Le nom de famille est obligatoire"
                                }
                            },
                            newPassword: {
                                label: "Mot de passe",
                                placeholder: "Entrer le mot de passe",
                                validations: {
                                    empty: "Le mot de passe est obligatoire",
                                    regExViolation: "Le mot de passe saisi est invalide"
                                }
                            },
                            username: {
                                label: "Nom d'utilisateur",
                                placeholder: "Veuillez saisir un nom d'utilisateur",
                                validations: {
                                    empty: "Le nom d'utilisateur est obligatoire",
                                    invalid: "Ce nom d'utilisateur n'est pas disponible.",
                                    invalidCharacters: "Le nom d'utilisateur semble contenir des caractères " +
                                        "non valides.",
                                    regExViolation: "S'il vous plaît, mettez une adresse email valide."
                                }
                            }
                        },
                        validations: {
                            genericError: {
                                description: "Quelque chose s'est mal passé. Veuillez réessayer",
                                message: "Erreur de mise à jour du mot de passe"
                            },
                            invalidCurrentPassword: {
                                description: "Le mot de passe actuel semble erroné. Veuillez réessayer.",
                                message: "Erreur de mise à jour du mot de passe"
                            },
                            submitError: {
                                description: "{{description}}",
                                message: "Erreur de mise à jour du mot de passe"
                            },
                            submitSuccess: {
                                description: "Le mot de passe à été mis à jour avec succès",
                                message: "Mise à jour du mot de passe réussi"
                            }
                        }
                    }
                },
                lockUser: {
                    confirmationModal: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous verrouillez ce compte, l'utilisateur ne pourra se" +
                          " connecter à aucune des applications métier. Veuillez" +
                          " procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action verrouille le compte utilisateur."
                    }
                },
                modals: {
                    addUserWarnModal: {
                        heading: "Attention",
                        message: "Veuillez noter qu'aucun rôle ne sera attribué au nouvel utilisateur. Si " +
                            "vous souhaitez lui en attribuer, veuillez cliquer sur le bouton ci-dessous."
                    },
                    addUserWizard: {
                        buttons: {
                            next: "Suivant",
                            previous: "Précédent"
                        },
                        steps: {
                            basicDetails: "Informations générales",
                            groups: "Groupes",
                            roles: "Rôles",
                            summary: "Résumé"
                        },
                        subTitle: "Assistant de création d'un nouvel utilisateur",
                        title: "Ajouter un utilisateur",
                        wizardSummary: {
                            domain: "Annuaire",
                            groups: "Groupe(s)",
                            name: "Nom",
                            passwordOption: {
                                label: "Initialisation du mot de passe",
                                message: {
                                    0: "Une invitation sera envoyé à l'adresse {{email}} avec un lien " +
                                        "d'initialisation.",
                                    1: "Vous avez initialisé le mot de passe."
                                }
                            },
                            roles: "Rôle(s)",
                            username: "Nom d'utilisateur"
                        }
                    },
                    changePasswordModal: {
                        button: "réinitialiser le mot de passe",
                        header: "Réinitialiser le mot de passe de l'utilisateur",
                        hint: {
                            forceReset: "ATTENTION: Veuillez noter qu'après avoir invité l'utilisateur à " +
                                "réinitialiser le mot de passe, l'utilisateur ne pourra plus se connecter à " +
                                "aucune application en utilisant le mot de passe actuel. Le lien de " +
                                "éinitialisation du mot de passe sera " +
                                "valide pendant {{codeValidityPeriod}} minutes.",
                            setPassword: "ATTENTION: veuillez noter qu'après avoir modifié le mot de passe, " +
                                "l'utilisateur ne " +
                                "pourra plus se connecter à aucune application en utilisant le mot de passe actuel."
                        },
                        message: "ATTENTION: veuillez noter qu'après avoir modifié le mot de passe, l'utilisateur ne " +
                            "pourra plus se connecter à aucune application en utilisant le mot de passe actuel.",
                        passwordOptions: {
                            forceReset: "Inviter l'utilisateur à réinitialiser le mot de passe",
                            setPassword: "Définir un nouveau mot de passe pour l'utilisateur"
                        }
                    }
                },
                profile: {
                    fields: {
                        createdDate: "Date de création",
                        emails: "Email",
                        generic: {
                            default: "Ajouter l'attribut {{fieldName}}"
                        },
                        modifiedDate: "Date modifiée",
                        name_familyName: "Nom de famille",
                        name_givenName: "Prénom",
                        oneTimePassword: "Mot de passe à usage unique",
                        phoneNumbers: "Numéros de téléphone",
                        photos: "Photos",
                        profileUrl: "URL",
                        userId: "Identifiant d'utilisateur",
                        userName: "Nom d'utilisateur"
                    },
                    forms: {
                        emailChangeForm: {
                            inputs: {
                                email: {
                                    label: "Email",
                                    note: "NOTE: Cela modifiera l'adresse e-mail dans votre profil utilisateur",
                                    placeholder: "Veuillez saisir votre adresse e-mail",
                                    validations: {
                                        empty: "L'adresse e-mail est obligatoire",
                                        invalidFormat: "Le format de l'adresse e-mail saisie est invalide"
                                    }
                                }
                            }
                        },
                        generic: {
                            inputs: {
                                placeholder: "Entrez votre {{fieldName}}",
                                validations: {
                                    empty: "L'attribut {{fieldName}} est obligatoire",
                                    invalidFormat: "Le format de l'attribut {{fieldName}} saisi est invalide"
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
                                        invalidFormat: "Le format du numéro de téléphone portable saisi est invalide"
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
                    notifications: {
                        changeUserPassword: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la modification du mot de passe utilisateur"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la modification du mot de passe " +
                                    "utilisateur.",
                                message: "Un problème est survenu"
                            },
                            success: {
                                description: "Le mot de passe de l'utilisateur a été modifié avec succès",
                                message: "Mot de passe modifié avec succès"
                            }
                        },
                        disableUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la désactivation du compte utilisateur."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la désactivation du compte utilisateur",
                                message: "Un problème est survenu"
                            },
                            success: {
                                description: "Le compte utilisateur a bien été désactivé",
                                message: "Le compte de {{name}} est désactivé"
                            }
                        },
                        enableUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de l'activation du compte utilisateur."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de l'activation du compte utilisateur",
                                message: "Un problème est survenu"
                            },
                            success: {
                                description: "Le compte d'utilisateur a bien été activé",
                                message: "Le compte de {{name}} est activé"
                            }
                        },
                        forcePasswordReset: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors du déclenchement du flux de " +
                                    "réinitialisation du mot de passe."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors du déclenchement du flux de " +
                                    "réinitialisation du mot de passe.",
                                message: "Un problème est survenu"
                            },
                            success: {
                                description: "La réinitialisation du mot de passe est lancée avec succès " +
                                    "pour le compte d'utilisateur.",
                                message: "Réinitialisation du mot de passe lancée"
                            }
                        },
                        getProfileInfo: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la récupération des détails de votre profil"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des détails de " +
                                    "votre profil",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Les attributs obligatoires du profil utilisateur ont été récupérés " +
                                    "avec succès",
                                message: "Profil utilisateur récupéré avec succès"
                            }
                        },
                        lockUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors du verrouillage du compte utilisateur."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors du verrouillage du compte utilisateur.",
                                message: "Un problème est survenu"
                            },
                            success: {
                                description: "Le compte d'utilisateur a été verrouillé avec succès.",
                                message: "Le compte de {{name}} est verrouillé"
                            }
                        },
                        noPasswordResetOptions: {
                            error: {
                                description: "Aucune des options de mot de passe forcé n'est activée.",
                                message: "Impossible de déclencher une réinitialisation forcée du mot de passe"
                            }
                        },
                        unlockUserAccount: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors du déverrouillage du compte utilisateur."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors du déverrouillage du compte utilisateur.",
                                message: "Un problème est survenu"
                            },
                            success: {
                                description: "Le compte utilisateur a été déverrouillé avec succès.",
                                message: "Le compte de {{name}} est déverrouillé"
                            }
                        },
                        updateProfileInfo: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la mise à jour des informations du profil"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour des informations " +
                                    "du profil",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Les attributs obligatoires du profil utilisateur ont été mis à " +
                                    "jour avec succès",
                                message: "Profil utilisateur mis à jour avec succès"
                            }
                        }
                    },
                    placeholders: {
                        SCIMDisabled: {
                            heading: "Cette fonctionnalité n'est pas disponible pour votre compte"
                        },
                        userProfile: {
                            emptyListPlaceholder: {
                                subtitles: "Les informations de profil ne sont pas disponibles pour cet utilisateur.",
                                title: "Aucune information de profil"
                            }
                        }
                    }
                },
                updateUser: {
                    groups: {
                        addGroupsModal: {
                            heading: "Mise à jour des groupes d'utilisateurs",
                            subHeading: "Ajouter de nouveaux groupes ou supprimer des groupes existants " +
                                "attribués à l'utilisateur."
                        },
                        editGroups: {
                            groupList: {
                                emptyListPlaceholder: {
                                    subTitle: {
                                        0: "Aucun groupe n'est attribué à l'utilisateur pour le moment.",
                                        1: "Cela pourrait empêcher l'utilisateur d'effectuer certaines",
                                        2: "tâches comme l'accès à certaines applications."
                                    },
                                    title: "Pas de groupes assignés"
                                },
                                headers: {
                                    0: "Domaine",
                                    1: "Nom"
                                }
                            },
                            heading: "Groupes assignés",
                            popups: {
                                viewPermissions: "Voir les permissions"
                            },
                            searchPlaceholder: "Rechercher des groupes",
                            subHeading: "Ajouter ou supprimer le groupe auquel l'utilisateur est affecté. Notez que " +
                                "cela affectera également l'exécution de certaines tâches."
                        },
                        notifications: {
                            addUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des groupes " +
                                        "de l'utilisateur"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des groupes de " +
                                        "l'utilisateur",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "Assignation de nouveaux groupes à l'utilisateur réussie",
                                    message: "Mise à jour des groupes de l'utilisateur réussie"
                                }
                            },
                            fetchUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la récupération de la liste des groupes"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la récupération de la " +
                                        "liste des groupes",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "La liste des groupes a été récupérée avec succès",
                                    message: "Liste des groupes de l'utilisateur récupérée avec succès"
                                }
                            },
                            removeUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des groupes " +
                                        "de l'utilisateur"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des groupes de " +
                                        "l'utilisateur",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "Suppression des groupes assignés pour l'utilisateur réussi",
                                    message: "Mise à jour des groupes de l'utilisateur réussie"
                                }
                            },
                            updateUserGroups: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des groupes " +
                                        "de l'utilisateur"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des groupes de " +
                                    "l'utilisateur",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "La mise à jour des rôles attribués à l'utilisateur a réussi",
                                    message: "Mise à jour des groupes de l'utilisateur réussie"
                                }
                            }
                        }
                    },
                    roles: {
                        addRolesModal: {
                            heading: "Mettre à jour les rôles des utilisateurs",
                            subHeading: "Ajouter de nouveaux rôles ou supprimer les rôles existants " +
                                "attribués à l'utilisateur."
                        },
                        editRoles: {
                            confirmationModal: {
                                assertionHint: "Veuillez confirmer votre action.",
                                content: "La modification du rôle entraînera pour l'utilisateur soit la perte de " +
                                    "l'accès, soit l'accès à certaines fonctionnalités. " +
                                    "Veuillez procéder avec prudence.",
                                header: "Êtes-vous sûr?",
                                message: "Cette action modifiera le rôle de cet utilisateur."
                            },
                            heading: "Rôles assignés",
                            popups: {
                                viewPermissions: "Voir les permissions"
                            },
                            roleList: {
                                emptyListPlaceholder: {
                                    subTitle: {
                                        0: "Aucun rôle n'est attribué à l'utilisateur pour le moment.",
                                        1: "Cela pourrait empêcher l'utilisateur d'effectuer certaines",
                                        2: "tâches comme l'accès à certaines applications."
                                    },
                                    title: "Aucun rôle assigné"
                                },
                                headers: {
                                    0: "Domaine",
                                    1: "Nom"
                                }
                            },
                            searchPlaceholder: "Rechercher des rôles",
                            subHeading: "Ajouter ou supprimer le rôle auquel l'utilisateur est affecté. Notez que " +
                                        "cela affectera également l'exécution de certaines tâches."
                        },
                        notifications: {
                            addUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des rôles " +
                                        "de l'utilisateur"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des rôles de " +
                                        "l'utilisateur",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "L'attribution de nouveaux rôles à l'utilisateur est un succès",
                                    message: "Mise à jour des rôles de l'utilisateur réussie"
                                }
                            },
                            fetchUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la récupération de la liste des rôles"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la récupération de la liste " +
                                        "des rôles",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "La liste des rôles a été récupérée avec succès",
                                    message: "Liste des rôles de l'utilisateur récupérée avec succès"
                                }
                            },
                            removeUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des rôles de " +
                                        "l'utilisateur"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des rôles " +
                                        "de l'utilisateur",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "Suppression des rôles attribués à l'utilisateur réussie",
                                    message: "Mise à jour des rôles de l'utilisateur réussie"
                                }
                            },
                            updateUserRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des rôles de " +
                                        "l'utilisateur"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des rôles " +
                                        "de l'utilisateur",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "La mise à jour des rôles attribués à l'utilisateur a réussi",
                                    message: "Mise à jour des rôles de l'utilisateur réussie"
                                }
                            }
                        },
                        viewPermissionModal: {
                            backButton: "Retour à la liste",
                            editButton: "Modifier les autorisations",
                            heading: "Permissions pour {{role}}"
                        }
                    }
                }
            },
            users: {
                advancedSearch: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                email: "E-mail",
                                username: "Nom d'utilisateur"
                            }
                        },
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ex. Nom d'utisateur, E-mail, etc."
                            },
                            filterCondition: {
                                placeholder: "Ex. Commence par, etc."
                            },
                            filterValue: {
                                placeholder: "Saisir une valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Rechercher par nom d'utilisateur"
                },
                all: {
                    heading: "Utilisateurs",
                    subHeading: "Gérer et ajouter des comptes utilisateurs, assigner les rôles et maintenir les " +
                        "identités des utilisateurs."
                },
                buttons: {
                    addNewUserBtn: "Nouvel Utilisateur",
                    assignUserRoleBtn: "Assigner un rôle",
                    metaColumnBtn: "Champs"
                },
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous procédez à cette action, l'utilisateur sera déconnecté de toutes les " +
                            "sessions actives. Ils perdront la progression de toutes les tâches en cours. " +
                            "Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et mettra fin définitivement à toutes les sessions " +
                            "actives."
                    },
                    terminateSession: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous procédez à cette action, l'utilisateur sera déconnecté de la session " +
                            "sélectionnée. Ils perdront la progression de toutes les tâches en cours. Veuillez " +
                            "procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et mettra fin définitivement à la session."
                    }
                },
                consumerUsers: {
                    fields: {
                        username: {
                            label: "Nom d'utilisateur",
                            placeholder: "Veuillez saisir un nom d'utilisateur",
                            validations: {
                                empty: "Le nom d'utilisateur est obligatoire",
                                invalid: "Ce nom d'utilisateur n'est pas disponible.",
                                invalidCharacters: "Le nom d'utilisateur semble contenir des caractères non valides.",
                                regExViolation: "S'il vous plaît, mettez une adresse email valide."
                            }
                        }
                    }
                },
                editUser: {
                    tab: {
                        menuItems: {
                            0: "Profil",
                            1: "Groupes",
                            2: "Rôles",
                            3: "Sessions Actives"
                        }
                    }
                },
                forms: {
                    validation: {
                        dateFormatError: "Le format du {{field}} saisi est incorrect. Le format valide est YYYY-MM-DD.",
                        formatError: "Le format du {{field}} saisi est incorrect.",
                        mobileFormatError: "Le format du {{field}} saisi est incorrect. Le format valide est [+]"+
                            "[indicatif du pays][indicatif régional][numéro de téléphone local]."
                    }
                },
                guestUsers: {
                    fields: {
                        username: {
                            label: "Nom d'utilisateur",
                            placeholder: "Veuillez saisir un nom d'utilisateur",
                            validations: {
                                empty: "Le nom d'utilisateur est obligatoire",
                                invalid: "Ce nom d'utilisateur n'est pas disponible.",
                                invalidCharacters: "Le nom d'utilisateur semble contenir des caractères non valides.",
                                regExViolation: "S'il vous plaît, mettez une adresse email valide."
                            }
                        }
                    }
                },
                list: {
                    columns: {
                        actions: "Actions",
                        name: "Nom"
                    }
                },
                notifications: {
                    addUser: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur d'ajout de l'utilisateur"
                        },
                        genericError: {
                            description: "Impossible d'ajouter l'utilisateur",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'utilisateur a été ajouté avec succès.",
                            message: "Ajout d'utilisateur réussi"
                        }
                    },
                    deleteUser: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de suppression de l'utilisateur"
                        },
                        genericError: {
                            description: "Impossible de supprimer l'utilisateur",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'utilisateur a été supprimé avec succès.",
                            message: "Suppression d'utilisateur réussie"
                        }
                    },
                    fetchUsers: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération des utilisateurs"
                        },
                        genericError: {
                            description: "Impossible de récupérer les utilisateurs.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Les utilisateurs ont été récupérés avec succès.",
                            message: "Récupération des utilisateurs réussie"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Rafraîchir la liste",
                        subtitles: {
                            0: "La liste des utilisateurs est vide.",
                            1: "Une erreur s'est produite lors de la récupération de la liste des utilisateurs"
                        },
                        title: "Aucun utilisateur trouvé"
                    },
                    userstoreError: {
                        subtitles: {
                            0: "Impossible de récupérer les utilisateurs de la boutique d'utilisateurs",
                            1: "Veuillez réessayer"
                        },
                        title: "Un problème est survenu"
                    }
                },
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: "Terminer tout",
                                terminateSession: "Terminer la session"
                            },
                            labels: {
                                activeApplication: "Applications actives",
                                browser: "Navigateur",
                                deviceModel: "Modèle d'appareil",
                                ip: "Adresse IP",
                                lastAccessed: "Dernier accès {{ date }}",
                                loggedInAs: "Connecté sous <1>{{ app }}</1> en tant que <3>{{ user }}</3>",
                                loginTime: "Heure de connexion",
                                os: "Système opérateur",
                                recentActivity: "Activité récente"
                            }
                        }
                    },
                    dangerZones: {
                        terminate: {
                            actionTitle: "Déconnecter",
                            header: "Se déconnecter",
                            subheader: "L'accès à votre compte depuis cet appareil sera supprimé."
                        }
                    },
                    notifications: {
                        getAdminUser: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération du type" +
                                    "d'utilisateur actuel.",
                                message: "Erreur de récupération"
                            }
                        },
                        getUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur de récupération"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des sessions " +
                                    "utilisateur.",
                                message: "Erreur de récupération"
                            },
                            success: {
                                description: "Sessions utilisateur récupérées avec succès.",
                                message: "Récupération réussie"
                            }
                        },
                        terminateAllUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur de terminaison"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la fin des sessions utilisateur.",
                                message: "Erreur de terminaison"
                            },
                            success: {
                                description: "Terminé avec succès toutes les sessions utilisateur.",
                                message: "Résiliation réussie"
                            }
                        },
                        terminateUserSession: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur de terminaison"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la fin de la session utilisateur.",
                                message: "Erreur de terminaison"
                            },
                            success: {
                                description: "Terminé avec succès la session utilisateur.",
                                message: "Résiliation réussie"
                            }
                        }
                    },
                    placeholders: {
                        emptyListPlaceholder: {
                            subtitles: "Il n'y a aucune sessions active pour cet utilisateur.",
                            title: "Aucune session active"
                        }
                    }
                },
                usersList: {
                    list: {
                        emptyResultPlaceholder: {
                            addButton: "Nouvel utilisateur",
                            subTitle: {
                                0: "Il n'y a actuellement aucun utilisateur disponible.",
                                1: "Ajoutez facilement un nouvel utilisateur en",
                                2: "utilisant l'assistant."
                            },
                            title: "Ajouter un utilisateur"
                        },
                        iconPopups: {
                            delete: "Supprimer",
                            edit: "Modifier"
                        }
                    },
                    metaOptions: {
                        columns: {
                            emails: "E-mail",
                            id: "Identifiant interne",
                            lastModified: "Dernière modification",
                            name: "Nom",
                            userName: "Nom d'utilisateur"
                        },
                        heading: "Afficher les champs"
                    },
                    search: {
                        emptyResultPlaceholder: {
                            clearButton: "Réinitialiser la recherche",
                            subTitle: {
                                0: "La recheche \"{{query}}\" n'a renvoyé aucun résultat.",
                                1: "Veuillez essayer avec d'autres paramètres."
                            },
                            title: "Aucun résultat"
                        }
                    }
                },
                userstores: {
                    userstoreOptions: {
                        all: "Tous les annuaires",
                        primary: "Principal"
                    }
                }
            },
            userstores: {
                advancedSearch: {
                    error: "Le format du filtre est incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ex. Nom, Description, etc."
                            },
                            filterCondition: {
                                placeholder: "Ex. Commence par, etc."
                            },
                            filterValue: {
                                placeholder: "Ex. PRIMARY, SECONDARY, etc."
                            }
                        }
                    },
                    placeholder: "Rechercher par nom d'annuaire"
                },
                confirmation: {
                    confirm: "Confirmer",
                    content: "En supprimant cet annuaire, vous supprimerez également toute sa " +
                        + " configuration. Veuillez procéder avec prudence.",
                    header: "Êtes-vous sûr ?",
                    hint: "Veuillez saisir <1>{{name}}</1> pour confirmer.",
                    message: "Cette action est irréversible et supprimera définitivement "
                        + " l'annuaire sélectionné ainsi que ses configurations."
                },
                dangerZone: {
                    delete: {
                        actionTitle: "Supprimer l'annuaire",
                        header: "Supprimer l'annuaire",
                        subheader: "Une fois supprimé, il est impossible de restaurer la conexion à annuaire. "
                            + "Êtes-vous certain ?"
                    },
                    disable: {
                        actionTitle: "Activer Userstore",
                        header: "Activer Userstore",
                        subheader: "La désactivation d'un magasin d'utilisateurs peut vous faire perdre l'accès " +
                            "aux utilisateurs du magasin d'utilisateurs." +
                            "Procéder avec prudence."
                    }
                },
                forms: {
                    connection: {
                        connectionErrorMessage: "Veuillez vérifier les informations de connexion "
                            + "que vous avez saisis : URL, utilisateur, mot de passe, pilote",
                        testButton: "Tester la connexion"
                    },
                    custom: {
                        placeholder: "Veuillez saisir le paramètre {{name}}",
                        requiredErrorMessage: "{{name}} est obligatoire"
                    },
                    general: {
                        description: {
                            label: "Description",
                            placeholder: "Veuillez saisir une description"
                        },
                        name: {
                            label: "Nom",
                            placeholder: "Veuillez saisir un nom",
                            requiredErrorMessage: "Le nom de l'annuaire est obligatoire"
                        },
                        type: {
                            label: "Type",
                            requiredErrorMessage: "Veuillez sélectionner un type d'annuaire"
                        }
                    }
                },
                notifications: {
                    addUserstore: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la création de l'annuaire",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'annuaire a été ajouté avec succès !",
                            message: "Annuaire ajouté avec succès !"
                        }
                    },
                    apiLimitReachedError: {
                        error: {
                            description: "Vous avez atteint le nombre maximum de magasins d'utilisateurs autorisés.",
                            message: "Échec de la création du magasin d'utilisateurs"
                        }
                    },
                    delay: {
                        description: "La mise à jour de la liste des annuaires peut prendre un peu de temps. "
                            + "Veuillez rafraîchir dans quelques instants pour afficher la liste des annuaires mis à " +
                        "jour.",
                        message: "Mise à jour différée de la liste des annuaires"
                    },
                    deleteUserstore: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression de l'annuaire",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'annuaire a été supprimé avec succès !",
                            message: "Annuaire supprimé avec succès !"
                        }
                    },
                    fetchUserstoreMetadata: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des méta-données de " +
                                "l'annuaire.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    fetchUserstoreTemplates: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des détails de types " +
                                "d'annuaires.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    fetchUserstoreTypes: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des types d'annuaires.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    fetchUserstores: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération de la liste des annuaires.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    testConnection: {
                        genericError: {
                            description: "Une erreur s'est produite lors du test de connexion à l'annuaire.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Connexion à l'annuaire établie",
                            message: "Connexion réussie !"
                        }
                    },
                    updateDelay: {
                        description: "L'apparition des propriétés mises à jour peut prendre un certain temps.",
                        message: "La mise à jour des propriétés prend du temps"
                    },
                    updateUserstore: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de l'annuaire.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "This userstore has been updated successfully!",
                            message: "Userstore updated successfully!"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Revenir aux annuaires",
                        description: "Modifier l'annuaire",
                        tabs: {
                            connection: "Connexion",
                            general: "Général",
                            group: "Groupes",
                            user: "Utilisateurs"
                        }
                    },
                    list: {
                        description: "Créer et gérer les annuaires",
                        primaryAction: "Nouvel annuaire",
                        title: "Annuaires"
                    },
                    templates: {
                        back: "Revenir aux annuaires",
                        description: "Veuillez sélectionner un type d'annuaire parmi les possibilités suivantes.",
                        templateHeading: "Démarrage rapide",
                        templateSubHeading: "Modèles d'annuaires prédéfinis pour en faciliter l'initialisation.",
                        title: "Sélectionnez un type d'annuaire"
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Nouvel annuaire",
                        subtitles: "Aucune annuaire n'est actuellement configuré. " +
                        "Vous pouvez en ajouter à l'aide de l'assistant de création." ,
                        title: "Ajouter un annuaire"
                    },
                    emptySearch: {
                        action: "Réinitialiser la recherche",
                        subtitles: "La recheche \"{{query}}\" n'a renvoyé aucun résultat. "
                            + "Veuillez essayer avec d'autres paramètres.",
                        title: "Aucun résultat"
                    }
                },
                sqlEditor: {
                    create: "Ajout",
                    darkMode: "Mode sombre",
                    delete: "Suppression",
                    read: "Lecture",
                    reset: "Réinitialiser",
                    title: "Types de requêtes SQL",
                    update: "Mise à jour"
                },
                wizard: {
                    header: "Ajouter un annuaire {{type}}",
                    steps: {
                        general: "Général",
                        group: "Groupes",
                        summary: "Résumé",
                        user: "Utilisateurs"
                    }
                }
            }
        },
        notifications: {
            endSession: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de fermeture de sessions"
                },
                genericError: {
                    description: "Une erreur s'est produite lors de la fermeture de la session active.",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "La session active a été fermée avec succès.",
                    message: "Termination successful"
                }
            },
            getProfileInfo: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Une erreur s'est produite lors de la récupération des détails du profil utilisateur.",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "Détails du profil utilisateur récupéré avec succès.",
                    message: "Récupération réussie"
                }
            },
            getProfileSchema: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Une erreur s'est produite lors de la récupération du profil utilisateur",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "Profil utilisateur récupérés avec succès.",
                    message: "Récupération réussie"
                }
            }
        },
        pages: {
            addEmailTemplate: {
                backButton: "Revenir au modèle {{name}}",
                subTitle: null,
                title: "Ajouter un modèle"
            },
            approvalsPage: {
                subTitle: "Examiner les tâches opérationnelles qui nécessitent votre approbation",
                title: "Approbations"
            },
            editTemplate: {
                backButton: "Revenir au modèle {{name}}",
                subTitle: null,
                title: "{{template}}"
            },
            emailLocaleAdd: {
                backButton: "Revenir au modèle {{name}}",
                subTitle: null,
                title: "Modifier le modèle - {{name}}"
            },
            emailLocaleAddWithDisplayName: {
                backButton: "Revenir au modèle {{name}}",
                subTitle: null,
                title: "Ajouter un modèle pour {{displayName}}"
            },
            emailTemplateTypes: {
                subTitle: "Créer ou gérer les types de modèles d'e-mails",
                title: "Types de modèles d'e-mails"
            },
            emailTemplates: {
                backButton: "Revenir aux types de modèles d'e-mails",
                subTitle: null,
                title: "Modèles d'e-mails"
            },
            emailTemplatesWithDisplayName: {
                backButton: "Revenir aux Applications",
                subTitle: null,
                title: "Modèle d'e-mail - {{displayName}}"
            },
            groups: {
                subTitle: "Créer et gérer des groupes d'utilisateurs, attribuer des permissions aux groupes",
                title: "Groupes"
            },
            oidcScopes: {
                subTitle: "Créer et gérer les scopes OIDC et les attributs liés aux scopes.",
                title: "Scopes OIDC"
            },
            oidcScopesEdit: {
                backButton: "Revenir aux scopes",
                subTitle: "Ajouter ou supprimer des attributs OIDC du scope",
                title: "Modifier le scope : {{ name }}"
            },
            organizations: {
                subTitle: "Créer et gérer des organisations.",
                title: "Organisations"
            },
            overview: {
                subTitle: "Configurer et gérer les utilisateurs, les rôles, les claims " +
                    "et dialectes, les configurations du serveur, etc.",
                title: "Bienvenue, {{firstName}}"
            },
            roles: {
                subTitle: "Créer et gérer les rôles, attribuer des permissions.",
                title: "Rôles"
            },
            rolesEdit: {
                backButton: "Revenir aux {{type}}",
                subTitle: null,
                title: "Modifier le rôle"
            },
            serverConfigurations: {
                subTitle: "Gérer la configuration générale du serveur.",
                title: "Configurations générales"
            },
            users: {
                subTitle: "Créer et gérer les utilisateurs, les accès utilisateurs et le profils utilisateurs.",
                title: "Utilisateurs"
            },
            usersEdit: {
                backButton: "Revenir aux Utilisateurs",
                subTitle: "{{name}}",
                title: "{{email}}"
            }
        },
        placeholders: {
            emptySearchResult: {
                action: "Réinitialiser la recherche",
                subtitles: {
                    0: "La recheche \"{{query}}\" n'a renvoyé aucun résultat.",
                    1: "Veuillez essayer avec d'autres paramètres."
                },
                title: "Aucun résultat"
            },
            underConstruction: {
                action: "Revenir à la page d'accueil",
                subtitles: {
                    0: "Des travaux sont en cours sur cette page.",
                    1: "Nous vous invitons à revenir plus tard. Merci pour votre compréhension."
                },
                title: "Page en construction"
            }
        }
    }
};
