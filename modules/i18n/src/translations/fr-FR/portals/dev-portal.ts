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

import { DevPortalNS } from "../../../models";

export const devPortal: DevPortalNS = {
    componentExtensions: {
        component: {
            application: {
                quickStart: {
                    title: "Démarrage rapide"
                }
            }
        }
    },
    components: {
        URLInput: {
            withLabel: {
                negative: {
                    content: "L'origine de l'URL de redirection {{url}} n'est pas autorisée à faire des requêtes CORS vers les APIs " +
                        "de WSO2 Identity Server.",
                    detailedContent: {
                        0: "Par défaut, les API de WSO2 Identity Server bloquent les requêtes CORS. Mais cela peut aussi " +
                            "empêcher que des demandes légitimes puissent circuler",
                        1: "Par conséquent, l'activation de CORS pour cette origine vous permettra d'accéder aux APIs de WSO2 Identity Server " +
                            "à partir des applications enregistrées dans le domaine du locataire <1>{{ tenantName }}</1>."
                    },
                    header: "CORS non autorisé",
                    leftAction: "Autoriser"
                },
                positive: {
                    content: "L'origine de l'URL de redirection {{url}} n'est pas autorisée à faire des requêtes CORS vers les APIs " +
                     "de WSO2 Identity Server.",
                    detailedContent: {
                       0: "Par défaut, les API de WSO2 Identity Server bloquent les requêtes CORS. Mais cela peut aussi " +
                             "empêcher que des demandes légitimes puissent circuler",
                       1: "Par conséquent, l'activation de CORS pour cette origine vous permettra d'accéder aux APIs de WSO2 Identity Server " +
                             "à partir des applications enregistrées dans le domaine du locataire <1>{{ tenantName }}</1>."
                    },
                    header: "CORS autorisé"
                }
            }
        },
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
                            placeholder: "Par exemple, Zoom, Salesforce etc."
                        }
                    }
                },
                placeholder: "Chercher par nom d'application"
            },
            confirmations: {
                deleteApplication: {
                    assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                    content: "Si vous supprimez cette application, vous ne pourrez pas la récupérer. Toutes les " +
                        "applications qui en dépendent risquent également de ne plus fonctionner. Veuillez procéder avec prudence.",
                    header: "Etes-vous sûr ?",
                    message: "Cette action est irréversible et supprimera définitivement l'application."
                },
                deleteOutboundProvisioningIDP: {
                    assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                    content: "Si vous supprimez cet IDP de provisionnement sortant, vous ne pourrez pas le récupérer. " +
                        "Veuillez procéder avec prudence.",
                    header: "Etes-vous sûr ?",
                    message: "Cette action est irréversible et supprimera définitivement l'IDP."
                },
                deleteProtocol: {
                    assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                    content: "Si vous supprimez ce protocole, vous ne pourrez pas le récupérer. Toutes les " +
                        "applications qui en dépendent risquent également de ne plus fonctionner. Veuillez procéder avec prudence.",
                    header: "Etes-vous sûr ?",
                    message: "Cette action est irréversible et supprimera définitivement le protocole."
                },
                regenerateSecret: {
                    assertionHint: "Veuillez taper <1>{{ id }}</1> pour confirmer.",
                    content: "Si vous régénérez le secret, toutes les applications qui en dépendent pourraient également " +
                        "cesser de fonctionner. Veuillez procéder avec prudence.",
                    header: "Etes-vous sûr ?",
                    message: "Cette action est irréversible et modifie de façon permanente le secret du client."
                },
                revokeApplication: {
                    assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                    content: "Si vous révoquez cette application, toutes les applications qui en dépendent pourraient également " +
                        "cesser de fonctionner. Veuillez procéder avec prudence.",
                    header: "Etes-vous sûr ?",
                    message: "Cette action peut être inversée en régénérant le secret du client."
                }
            },
            dangerZoneGroup: {
                deleteApplication: {
                    actionTitle: "Supprimer",
                    header: "Supprimer l'application",
                    subheader: "Une fois que vous avez supprimé une application, il est impossible de revenir en arrière. Veuillez en être certain."
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
                        tabName: "Accès"
                    },
                    advanced: {
                        tabName: "Avancé"
                    },
                    attributes: {
                        forms: {
                            fields: {
                                dynamic: {
                                    applicationRole: {
                                        label: "Rôle applicatif",
                                        validations: {
                                            duplicate: "Ce rôle est déjà associé. Veuillez sélectionner un autre rôle",
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
                                header: "Mettre à jour la sélection des attributs",
                                steps: {
                                    select: {
                                        transfer: {
                                            headers: {
                                                attribute: "Attribut"
                                            },
                                            searchPlaceholders: {
                                                attribute: "Chercher un attribut",
                                                role: "Chercher un rôle"
                                            }
                                        }
                                    }
                                },
                                subHeading: "Ajouter de nouveaux attributs ou supprimer des attributs existants."
                            },
                            heading: "Sélection des attributs",
                            mappingTable: {
                                actions: {
                                    enable: "Activer l'association"
                                },
                                columns: {
                                    appAttribute: "Attribut d'application",
                                    attribute: "Attribut",
                                    mandatory: "Obligatoire",
                                    requested: "Demandé"
                                },
                                listItem: {
                                    actions: {
                                        makeMandatory: "Rendre obligatoire",
                                        makeRequested: "Rendre demandable",
                                        removeMandatory: "Retirer l'obligation",
                                        removeRequested: "Retirer la demandabilité"
                                    },
                                    fields: {
                                        claim: {
                                            label: "Veuillez entrer une valeur",
                                            placeholder: "ex: {{name}} personnalisé, nouveau {{name}}"
                                        }
                                    }
                                },
                                searchPlaceholder: "Attributs de recherche"
                            }
                        },
                        tabName: "Attributs"
                    },
                    general: {
                        tabName: "Général"
                    },
                    provisioning: {
                        inbound: {
                            heading: "Provisionnement entrant",
                            subHeading: "Provisionner des utilisateurs ou des groupes vers un annuaire de WSO2 Identity Server’ via une " +
                                "application."
                        },
                        outbound: {
                            actions: {
                                addIdp: "Nouveau fournisseur d'identité"
                            },
                            addIdpWizard: {
                                heading: "Ajouter un IDP de provisionnement sortant",
                                steps: {
                                    details: "Détails de l'IDP"
                                },
                                subHeading: "Sélectionnez l'IDP pour approvisionner les utilisateurs qui s'auto-enregistrent dans votre application."
                            },
                            heading: "Provisionnement sortant",
                            subHeading: "Configurer un fournisseur d'identité pour l'aprovisionnement sortant des " +
                                "utilisateurs de cette application."
                        },
                        tabName: "Provisionnement"
                    },
                    signOnMethod: {
                        sections: {
                            authenticationFlow: {
                                heading: "Flux d'authentification",
                                sections: {
                                    scriptBased: {
                                        editor: {
                                            templates: {
                                                darkMode: "Mode sombre",
                                                heading: "Modèles"
                                            }
                                        },
                                        heading: "Configuration basée sur des scripts",
                                        hint: "Définissez le flux d'authentification via un script adaptatif. Vous pouvez " +
                                            "sélectionner l'un des modèles du panneau pour commencer."
                                    },
                                    stepBased: {
                                        actions: {
                                            addStep: "Nouvelle étape d'authentification",
                                            selectAuthenticator: "Sélectionner un authentificateur"
                                        },
                                        forms: {
                                            fields: {
                                                attributesFrom: {
                                                    label: "Utilisez les attributs de",
                                                    placeholder: "Sélectionner une étape"
                                                },
                                                subjectIdentifierFrom: {
                                                    label: "Utiliser I'identifiant du sujet de",
                                                    placeholder: "Sélectionner une étape"
                                                }
                                            }
                                        },
                                        heading: "Configuration par étapes",
                                        hint: "Créez des étapes d'authentification en faisant glisser les authentificateurs " +
                                            "locaux/fédérés vers les étapes correspondantes."
                                    }
                                }
                            },
                            requestPathAuthenticators: {
                                notifications: {
                                    getRequestPathAuthenticators: {
                                        error: {
                                            description: "{{ description }}",
                                            message: "Retrieval Error"
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
                                subTitle: "Les authentificateurs locaux pour l'authentification par chemin de requête.",
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
                                    hint: "Cette option ajoutera au rôle le domaine de l'annuaire dans lequel l'utilisateur " +
                                        "réside",
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
                                    hint: "Choisissez l'attribut",
                                    label: "Attribut de sujet",
                                    validations: {
                                        empty: "Sélectionner l'attribut de sujet"
                                    }
                                },
                                subjectIncludeTenantDomain: {
                                    hint: "Cette option ajoutera le domaine d'identité à l'identifiant du sujet",
                                    label: "Inclure le domaine du locataire",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                },
                                subjectIncludeUserDomain: {
                                    hint: "Cette option ajoutera le domaine de l'annuaire dans lequel l'utilisateur réside " +
                                        "dans l'identifiant du sujet",
                                    label: "Inclure le domaine de l'utilisateur",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                },
                                subjectUseMappedLocalSubject: {
                                    hint: "Cette option utilisera l'identifiant local associé comme sujet pour revendiquer " +
                                        "l'identité",
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
                            hint: "Décide si les politiques d'autorisation doivent être engagées pendant les flux " +
                                "d'authentification.",
                            label: "Activer les autorisations",
                            validations: {
                                empty: "Ceci est un champ obligatoire."
                            }
                        },
                        returnAuthenticatedIdpList: {
                            hint: " La liste des fournisseurs d'identité authentifiés sera renvoyée dans la réponse " +
                                "d'authentification.",
                            label: "Retourne la liste des idP authentifiés",
                            validations: {
                                empty: "Ceci est un champ obligatoire."
                            }
                        },
                        saas: {
                            hint: "L'utilisation des applications est par défaut limitée aux utilisateurs " +
                                "du fournisseur de services du locataire. Si cette application est en mode SaaS, elle est ouverte pour " +
                                "les usagers de tous les locataires..",
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
                            hint: "Le consentement de l'utilisateur sera ignoré pendant le processus de déconnexion.",
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
                                    label: "Valeur",
                                    placeholder: "URL JWKS de l'application.",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire.",
                                        invalid: "Ceci n'est pas une URL valide"
                                    }
                                },
                                pemValue: {
                                    actions: {
                                        view: "Voir les informations sur le certificat"
                                    },
                                    hint: "Le certificat ( au format PEM ) de l'application.",
                                    label: "Valeur",
                                    placeholder: "Certificat au format PEM.",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
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
                            heading: "Certificat"
                        }
                    }
                },
                generalDetails: {
                    fields: {
                        accessUrl: {
                            hint: "Les applications marquées comme découvrables sont visibles par les utilisateurs finaux.",
                            label: "URL d'accès",
                            placeholder: "Saisissez l'url d'accès à la page de connexion de l'application",
                            validations: {
                                empty: "Une URL d'accès valide doit être définie pour qu'une application soit marquée comme " +
                                    "étant découvrable",
                                invalid: "Ceci n'est pas une URL valide"
                            }
                        },
                        description: {
                            label: "Description",
                            placeholder: "Saisissez une description pour l'application"
                        },
                        discoverable: {
                            label: "Application découvrable"
                        },
                        imageUrl: {
                            label: "Image de l'application",
                            placeholder: "Entrez une URL d'image pour l'application",
                            validations: {
                                invalid: "Ceci n'est pas une URL d'image valide"
                            }
                        },
                        name: {
                            label: "Nom",
                            placeholder: "Saisissez un nom pour l'application.",
                            validations: {
                                empty: "Ceci est un champ obligatoire."
                            }
                        }
                    }
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
                    fields: {
                        allowedOrigins: {
                            hint: "Les origines autorisées sont des URL qui seront autorisées à effectuer des requêtes " +
                                "depuis des origines tierces vers les APIs de WSO2 Identity Server ",
                            label: "Origines autorisées",
                            placeholder: "Entrez les origines autorisées",
                            validations: {
                                empty: "Veuillez ajouter une origine valide."
                            }
                        },
                        callBackUrls: {
                            hint: "Après l'authentification, nous ne redirigerons que vers les URLs de redirection " +
                                "renseignées ci-dessus",
                            label: "URLs de redirection",
                            placeholder: "Saisir les URLs de redirection",
                            validations: {
                                empty: "Veuillez ajouter une URL valide."
                            }
                        },
                        clientID: {
                            label: "Identifiant du client"
                        },
                        clientSecret: {
                            hideSecret: "Cacher le secret",
                            label: "Secret du client",
                            placeholder: "Saisir le secret du client",
                            showSecret: "Montrez le secret",
                            validations: {
                                empty: "Ceci est un champ obligatoire."
                            }
                        },
                        grant: {
                            label: "Grant type autorisés",
                            validations: {
                                empty: "Sélectionnez au minimum un grant type"
                            }
                        },
                        public: {
                            hint: "Autorisez le client à s'authentifier sans secret.",
                            label: "Client public",
                            validations: {
                                empty: "Ceci est un champ obligatoire."
                            }
                        }
                    },
                    sections: {
                        accessToken: {
                            fields: {
                                bindingType: {
                                    label: "Type de liaison des jetons"
                                },
                                expiry: {
                                    hint: "Configurer le temps d'expiration des jetons d'accès utilisateur (en secondes)",
                                    label: "Délai d'expiration du jeton d'accès utilisateur",
                                    placeholder: "Saisissez l'heure d'expiration des jetons d'accès utilisateur",
                                    validations: {
                                        empty: "Veuillez indiquer le délai d'expiration des jetons d'accès"
                                    }
                                },
                                revokeToken: {
                                    hint: "Permet de révoquer les jetons de cette application lorsqu'une session IDP " +
                                        "liée est terminée",
                                    label: "Révoquer les jetons lorsque la session IDP se termine"
                                },
                                type: {
                                    label: "Type de token"
                                },
                                validateBinding: {
                                    hint: "Activer la validation de la liaison des jetons pendant les invocations des API",
                                    label: "Valider les liaisons des jetons"
                                }
                            },
                            heading: "Jeton d'accès",
                            hint: " Configurez l'émetteur du jeton d'accès, l'heure d'expiration du jeton d'accès " +
                                "de l'utilisateur, l'heure d'expiration du jeton d'accès de l'application, etc."
                        },
                        idToken: {
                            fields: {
                                algorithm: {
                                    hint: "Choisissez l'algorithme de chiffrement du jeton d'identification du client.",
                                    label: "Algorithme",
                                    placeholder: "Sélectionner un algorithme",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                },
                                audience: {
                                    hint: "les destinataires auxquels le jeton d'identification est destiné.",
                                    label: "Audience",
                                    placeholder: "Saisir l'audience",
                                    validations: {
                                        empty: "Please fill the audience"
                                    }
                                },
                                encryption: {
                                    label: "Activer le chiffrement",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                },
                                expiry: {
                                    hint: "Configurer le temps d'expiration du jeton d'identification (en secondes)",
                                    label: "Délai d'expiration du jeton d'identification",
                                    placeholder: "Entrez l'heure d'expiration du jeton d'identification",
                                    validations: {
                                        empty: "Veuillez indiquer l'heure d'expiration du jeton d'identification"
                                    }
                                },
                                method: {
                                    hint: "Choisissez la méthode de chiffrement du jeton d'identification.",
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
                                    label: "URL de déconnexion amont",
                                    placeholder: "Saisir l'URL de déconnexion amont",
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
                                },
                                signatureValidation: {
                                    label: "Activer la validation de la signature de l'objet de la requête"
                                }
                            },
                            heading: "PKCE"
                        },
                        pkce: {
                            fields: {
                                pkce: {
                                    children: {
                                        mandatory: {
                                            label: "PKCE obligatoire"
                                        },
                                        plainAlg: {
                                            label: "Prise en charge de l'algorithme PKCE de transformation 'Plain'"
                                        }
                                    },
                                    label: "{{label}}",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                }
                            },
                            heading: "PKCE",
                            hint: "PKCE (RFC 7636) est une extension du processus par code d'autorisation pour prévenir " +
                                "certaines attaques et pour pouvoir effectuer en toute sécurité l'échange OAuth à partir " +
                                "de clients publics."
                        },
                        refreshToken: {
                            fields: {
                                expiry: {
                                    hint: "Configurer le temps d'expiration du jeton de rafraîchissement (en secondes)",
                                    label: "Délai d'expiration du jeton de rafraîchissement",
                                    placeholder: "Saisissez l'heure d'expiration du jeton de rafraîchissement",
                                    validations: {
                                        empty: "Veuillez indiquer le délai d'expiration du jeton de rafraîchissement"
                                    }
                                },
                                renew: {
                                    hint: "Émettre un nouveau jeton de rafraîchissement par requête lorsque le Refresh Token Grant est utilisé.",
                                    label: "Renouveler le jeton de rafraîchissement",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                }
                            },
                            heading: "jeton de rafraîchissement"
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
                    fields: {
                        assertionURLs: {
                            hint: "Elle précise les URL des consommateurs vers lesquels le navigateur " +
                                "doit être redirigé une fois l'authentification réussie. Il s'agit de l'URL " +
                                "du service consommateur d'assertions (ACS) de l'application.",
                            label: "URL du consommateur d'assertions",
                            placeholder: "Saisir l'URL d'assertion",
                            validations: {
                                invalid: "Veuillez ajouter une URL valide"
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
                            hint: "Cette valeur peut remplacer l'identifiant de l'entité du fournisseur d'identité qui est " +
                                "spécifié dans la configuration d'authentification entrante SAML SSO du fournisseur " +
                                "d'identité résident. L'identifiant de l'entité du fournisseur d'identité " +
                                "est utilisé comme émetteur de la réponse SAML qui est générée.",
                            label: "Alias IDP entityId",
                            placeholder: "Saisir alias",
                            validations: {
                                empty: "Ceci est un champ obligatoire."
                            }
                        },
                        issuer: {
                            hint: "Ceci précise l'émetteur. C'est l'élément 'saml:Issuer' qui contient l'identifiant " +
                                "unique de la demande. C'est également la valeur de l'émetteur" +
                                "spécifiée dans la demande d'authentification SAML émise par l'application.",
                            label: "Emetteur",
                            placeholder: "Saisir le nom de l'émetteur",
                            validations: {
                                empty: "Veuillez indiquer l'émetteur"
                            }
                        },
                        metaURL: {
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
                                        invalid: "Veuillez ajouter une URL valide"
                                    }
                                },
                                nameIdFormat: {
                                    hint: "Elle définit le format des identifiants pris en charge par le " +
                                        "fournisseur d'identité. Les identifiants sont utilisés pour fournir des informations" +
                                        "concernant un utilisateur.",
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
                                        invalid: "Veuillez ajouter une URL valide"
                                    }
                                }
                            },
                            heading: "Assertion"
                        },
                        attributeProfile: {
                            fields: {
                                enable: {
                                    hint: "WSO2 Identity Server prend en charge un profil d'attribut de base " +
                                        "dans lequel le fournisseur d'identité peut inclure les attributs de l'utilisateur" +
                                        "dans les assertions SAML en tant que déclaration d'attributs.",
                                    label: "Activer"
                                },
                                includeAttributesInResponse: {
                                    hint: "Une fois que vous avez coché la case 'Toujours inclure les attributs dans la réponse' " +
                                        ", le fournisseur d'identité incluera toujours les valeurs des attributs " +
                                        "relatifs aux claims sélectionnées dans la déclaration d'attributs SAML.",
                                    label: "Toujours inclure les attributs dans la réponse"
                                },
                                serviceIndex: {
                                    hint: "Il s'agit d'un champ optionnel, s'il n'est pas fourni, une valeur sera " +
                                        "générée automatiquement.",
                                    label: "Indice de l'attribut consommant le service",
                                    placeholder: "Saisir l'indice de l'attribut consommant le service",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                }
                            },
                            heading: "Profil des attributs"
                        },
                        encryption: {
                            fields: {
                                assertionEncryption: {
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
                                    hint: "Lorsque cette option est activée, le fournisseur de services n'est pas tenu d'envoyer " +
                                        "la requête SAML.",
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
                                    hint: "Cela précise si le fournisseur d'identité doit valider la signature de la  " +
                                        "demande d'authentification SAML2 et de la demande de " +
                                        "déconnexion SAML2 qui sont envoyées par l'application.",
                                    label: "Activer la validation de la signature de la requête",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire."
                                    }
                                },
                                signatureValidationCertAlias: {
                                    hint: "Si un certificat applicatif est fourni, il sera utilisé et le certificat " +
                                        "sélectionné ci-dessus sera ignoré.",
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
                                    hint: "Signez les réponses SAML2 renvoyées après le processus d'authentification.",
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
                            hint: "Bloquer le flux d'authentification jusqu'à ce que le provisionnement soit terminé.",
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
                            hint: "Approvisionnement des utilisateurs de l'annuaire par un approvisionnement juste à temps.",
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
                            hint: "Sélectionnez un nom de domaine utilisateur pour fournir des utilisateurs et des groupes.",
                            label: "Approvisionnement du domaine utilisateur"
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
                                        "WSO2 Identity Server SDK et comment vous pouvez intégrer n'importe quelle  " +
                                        "application avec lui.",
                                    title: "Essayer l'exemple"
                                },
                                goBack: "Revenir en arrière",
                                subTitle: "Commencez rapidement le prototypage en téléchargeant notre application " +
                                    "d'exemple préconfigurée.",
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
                                    introspection: "Introspection",
                                    keystore: "Key Set",
                                    token: "Token",
                                    userInfo: "UserInfo"
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
                                subTitle: "Vous pouvez essayer les examples qui démontreront le flux d'authentification. " +
                                    "Cliquez sur le bouton ci-dessous pour télécharger et déployer l'exemple d'application.",
                                title: "Essayer avec un exemple"
                            },
                            useSDK: {
                                btns: {
                                    withSDK: "Utiliser le SDK",
                                    withoutSDK: "Manuellement"
                                },
                                subTitle: "Installez et utilisez nos SDK pour intégrer l'authentification à votre " +
                                    "application avec un nombre minimum de lignes de code.",
                                title: "Intégrez votre propre application"
                            }
                        },
                        heading: "Quelle est la suite ?"
                    }
                }
            },
            list: {
                actions: {
                    add: "Nouvelle Application"
                },
                columns: {
                    actions: "Actions",
                    name: "Nom"
                }
            },
            notifications: {
                addApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de création"
                    },
                    genericError: {
                        description: "Echec de la création de l'application",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Création avec succès de l'application",
                        message: "Création réussie"
                    }
                },
                authenticationStepMin: {
                    genericError: {
                        description: "Au moins une étape d'authentification est requise.",
                        message: "Erreur de retrait"
                    }
                },
                deleteApplication: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de retrait"
                    },
                    genericError: {
                        description: "N'a pas réussi à supprimer l'application",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Suppression avec succès de l'application.",
                        message: "Suppression réussie"
                    }
                },
                deleteProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de suppression"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la suppression des configurations de protocoles entrants.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Suppression avec succés des configurations du protocole {{protocol}}.",
                        message: "Suppression réussie"
                    }
                },
                duplicateAuthenticationStep: {
                    genericError: {
                        description: "Le même authentificateur ne peut être utilisé deux fois au sein d'une même étape.",
                        message: "Non autorisé"
                    }
                },
                emptyAuthenticationStep: {
                    genericError: {
                        description: "Il y a une étape d'authentification vide.Veuillez la supprimer ou ajouter des " +
                            "authentificateurs pour continuer.",
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
                        description: "Une erreur s'est produite lors de la récupération des protocoles entrants personnalisés.",
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
                        description: "Une erreur s'est produite en récupérant les protocoles entrants disponibles.",
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
                        description: "Une erreur s'est produite lors de la récupération des configurations IDP pour l'application OIDC.",
                        message: "Erreur de récupération"
                    },
                    success: {
                        description: "Récupération avec succès des configurations IDP pour l'application OIDC.",
                        message: "Récupération réussie"
                    }
                },
                fetchProtocolMeta: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de récupération"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la récupération des métadonnées du protocole.",
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
                        description: "Une erreur s'est produite lors de la récupération des configurations IDP pour l'application SAML.",
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
                        description: "Une erreur s'est produite lors de la récupération des données du modèle d'application",
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
                        description: "Une erreur s'est produite lors de la mise à jour du flux d'authentification de l'application",
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
                        description: "Une erreur s'est produite lors de la mise à jour de la configuration de la demande",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Mise à jour réussie de la configuration des demandes",
                        message: "Mise à jour réussie"
                    }
                },
                updateInboundProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de mise à jour"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la mise à jour des configurations des protocoles entrants.",
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
                        0: "Faites glisser et déposez l'un des authentificateurs ci-dessus",
                        1: "pour construire une séquence d'authentification."
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
            templates: {
                manualSetup: {
                    heading: "Configuration manuelle",
                    subHeading: "Créer une application avec des configurations personnalisées."
                },
                quickSetup: {
                    heading: "Configuration rapide",
                    subHeading: "Ensemble prédéfini de modèles d'application pour accélérer la création de votre application."
                }
            },
            wizards: {
                minimalAppCreationWizard: {
                    help: {
                        heading: "Aide",
                        subHeading: "Utilisez les éléments suivants à titre d'orientation"
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
                        description: "Le panneau d'aide apparaîtra toujours {{state}} sauf si vous le modifiez explicitement.",
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
                            placeholder: "Par exemple, Google, Github etc."
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
                    content: "Si vous supprimez cet authentificateur, vous ne pourrez pas le récupérer. Toutes les applications" +
                        "qui en dépendent risquent également de ne plus fonctionner. Veuillez procéder avec prudence.",
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
                    assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                    content: "Si vous supprimez ce fournisseur d'identité, vous ne pourrez pas le récupérer. Toutes les applications " +
                        "qui en dépendent risquent également de ne plus fonctionner. Veuillez procéder avec prudence.",
                    header: "Etes-vous sûr ?",
                    message: "Cette action est irréversible et supprimera définitivement l'IDP."
                }
            },
            dangerZoneGroup: {
                deleteIDP: {
                    actionTitle: "Supprimer le fournisseur d'identité",
                    header: "Supprimer le fournisseur d'identité",
                    subheader: "Une fois que vous avez supprimé un fournisseur d'identité, il est impossible." +
                        " Soyez-en certain."
                },
                disableIDP: {
                    actionTitle: "Activer le fournisseur d'identité",
                    header: "Activer le fournisseur d'identité",
                    subheader: "Une fois que vous avez désactivé un fournisseur d'identité, il ne peut plus être " +
                        "utilisé jusqu'à ce que vous l'activiez à nouveau. Soyez-en certain."
                },
                header: "Zone de danger"
            },
            forms: {
                advancedConfigs: {
                    alias: {
                        hint: "If the resident identity provider is known by an alias at the federated identity " +
                            "provider, specify it here.",
                        label: "Alias"
                    },
                    certificateType: {
                        certificateJWKS: {
                            label: "Utilisez le point d'entrée JWKS",
                            placeholder: "La valeur doit être le certificat au format JWKS.",
                            validations: {
                                empty: "La valeur du certificat est requise"
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
                        label: " Identifiant du domaine local"
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
                    invalidQueryParamErrorMessage: "Ce ne sont pas des paramètres de requête valables",
                    invalidURLErrorMessage: "Ceci n'est pas une URL valide",
                    requiredErrorMessage: "Ceci est requis"
                },
                generalDetails: {
                    description: {
                        hint: "Une description significative du fournisseur d'identité.",
                        label: "Description",
                        placeholder: "Saisir un e description pour le fournisseur d'identité."
                    },
                    image: {
                        hint: "Une URL pour récupérer l'image du fournisseur d'identité.",
                        label: "URL du fournisseur d'identité",
                        placeholder: "Par exemple: https://example.com/image.png"
                    },
                    name: {
                        hint: "Entrez un nom unique pour ce fournisseur d'identité.",
                        label: "Nom du fournisseur d'identité",
                        placeholder: "Saisissez un nom pour le fournisseur d'identité.",
                        validations: {
                            duplicate: "Un fournisseur d'identité existe déjà avec ce nom",
                            empty: "Le nom du fournisseur d'identité est requis"
                        }
                    }
                },
                jitProvisioning: {
                    enableJITProvisioning: {
                        hint: "Précise si les utilisateurs fédérés à partir de ce fournisseur " +
                            "d'identité doivent être approvisionnés localement.",
                        label: "Activer l' approvisionnement juste à temps"
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
                    default: "Mettre par défaut",
                    enable: "Activé"
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
                    title: "Ajouter un nouveau certificat"
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
                        description: "Une erreur s'est produite lors de la création du fournisseur d'identité.",
                        message: "Erreur de création"
                    },
                    success: {
                        description: "Création réussie du fournisseur d'identité.",
                        message: "Créer avec succès"
                    }
                },
                changeCertType: {
                    jwks: {
                        description: "Veuillez noter que si vous avez ajouté un certificat, il sera remplacé " +
                            "par l'adresse JWKS.",
                        message: "Attention !"
                    },
                    pem: {
                        description: "Veuillez noter que si vous avez ajouté une adresse JWKS, elle sera remplacée " +
                            "par le certificat.",
                        message: "Attention !"
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
                        description: "Le connecteur d'approvisionnement sortant par défaut ne peut pas être supprimé.",
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
                        description: "ous ne pouvez pas désactiver le connecteur d'approvisionnement sortant par défaut.",
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
                        description: "Une erreur s'est produite lors de la récupération des métadonnées d'authentification.",
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
                        description: "Une erreur s'est produite lors de la récupération des données du fournisseur d'identité",
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
                        description: "Une erreur s'est produite lors de la récupération des fournisseurs d'identité",
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
                        description: "Une erreur s'est produite lors de l'extraction de la liste des modèles de fournisseurs d'identités",
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
                        description: "Une erreur s'est produite lors de la récupération des détails du connecteur d'approvisionnement sortant.",
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
                        description: "Une erreur s'est produite lors de la récupération des métadonnées du connecteur d'approvisionnement sortant.",
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
                        description: "Une erreur s'est produite lors de la récupération de la liste des connecteurs d'approvisionnement sortant.",
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
                        description: "An error occurred while retrieving roles",
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
                updateClaimsConfigs: {
                    error: {
                        description: "{{ description }}",
                        message: "Erreur de mise à jour"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la mise à jour des configurations des claims.",
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
                        description: "Une erreur s'est produite lors de la mise à jour de l'authentificateur fédéré.",
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
                        description: "sUne erreur s'est produite lors de la mise à jour des authentificateurs fédérés.",
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
                        description: "Une erreur s'est produite lors de la mise à jour du fournisseur d'identité.",
                        message: "Erreur de mise à jour"
                    },
                    success: {
                        description: "Mise à jour réussie du fournisseur d'identité.",
                        message: "Mise à jour réussie"
                    }
                },
                updateIDPCertificate: {
                    error: {
                        description: "{{ description }}",
                        message: "Erreur de mise à jour"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la mise à jour du certificat du fournisseur d'identité.",
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
                        description: "Une erreur s'est produite lors de la mise à jour des configurations des rôles pour le provisionnement sortant.",
                        message: "Erreur de mise à jour"
                    },
                    success: {
                        description: "Mise à jour réussie des configurations des rôles pour le provisionnement sortant.",
                        message: "Mise à jour réussie"
                    }
                },
                updateJITProvisioning: {
                    error: {
                        description: "",
                        message: ""
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la mise à jour des configurations de provisionnement JIT.",
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
                        description: "Une erreur s'est produite lors de la mise à jour du connecteur d'approvisionnement sortant.",
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
                        description: "Une erreur s'est produite lors de la mise à jour des connecteurs d'approvisionnement sortant.",
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
                    subHeading: "Ensemble prédéfini de modèles pour accélérer la création de votre fournisseur d'identité."
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
                                subTitle: "Ajouter un nouvel authentificateur avec des configurations personnalisées.",
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
        oidcScopes: {
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
                    assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
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
                            0: "Il n'y a pas d'attributs ajoutés pour ce scope OIDC",
                            1: "Veuillez ajouter les attributs requis pour les visualiser ici."
                        },
                        title: "Pas d'attributs OIDC"
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
                                empty: "Le nom d'affichage est un champ obligatoire"
                            }
                        },
                        scopeName: {
                            label: "Nom du scope",
                            placeholder: "Entrez le nom du scope",
                            validations: {
                                empty: "Le nom du scope est un champ obligatoire"
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
                }
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
        overview: {
            banner: {
                heading: "WSO2 Identity Server pour les développeurs",
                subHeading: "Utiliser les SDK et autres outils de développement pour construire une expérience personnalisée",
                welcome: "Bienvenue, {{username}}"
            },
            quickLinks: {
                cards: {
                    applications: {
                        heading: "Applications",
                        subHeading: "Créer des applications à l'aide de modèles prédéfinis et gérer leurs configurations."
                    },
                    idps: {
                        heading: "Fournisseurs d'identité",
                        subHeading: "Créer et gérer des fournisseurs d'identités sur la base de modèles " +
                            "et configurer l'authentification."
                    },
                    remoteFetch: {
                        heading: "Récupérer à distance",
                        subHeading: "Configurer un référentiel distant pour qu'il fonctionne de manière transparente avec WSO2 Identity Server."
                    }
                }
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
                                "the administrator of the tenant you are registered under, or the " +
                                "super-administrator if you do not use the tenant feature.",
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
        remoteConfig: {
            createConfigForm: {
                configName: {
                    label: "Nom de la configuration",
                    placeholder: "Nom pour la configuration du dépôt",
                    requiredMessage: "Le nom de la configuration est requis."
                },
                enableConfig: {
                    label: "Activer la configuration"
                },
                gitAccessToken: {
                    label: "Jeton d'accès personnel",
                    placeholder: "Jeton d'accès pour le compte github."
                },
                gitBranch: {
                    label: "Branche Git",
                    placeholder: "emplacement de la branche github",
                    requiredMessage: "La branche Git est requise."
                },
                gitDirectory: {
                    label: "Répertoire Git",
                    placeholder: "emplacement du répertoire github",
                    requiredMessage: "Le répertoire Git est requis."
                },
                gitUrl: {
                    label: "URI du dépôt Git",
                    placeholder: "Lien du dépôt github.",
                    requiredMessage: "L'URL du dépôt Git est obligatoire."
                },
                gitUserName: {
                    label: "Nom d'utilisateur Git",
                    placeholder: "Nom d'utilisateur du compte github."
                }
            },
            list: {
                columns: {
                    actions: "Actions",
                    failedDeployments: "Les Déploiements ont échoué",
                    lastDeployed: "Dernier déploiement",
                    name: "Nom",
                    successfulDeployments: "Déploiements réussis"
                },
                confirmations: {
                    deleteConfig: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous supprimez cette configuration, vous ne pourrez pas la récupérer." +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement la configuration."
                    }
                }
            },
            notifications: {
                createConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de création"
                    },
                    genericError: {
                        description: "Echec de la création de la configuration",
                        message: "Quelque chose a mal tourné"
                    },
                    success: {
                        description: "Création avec succès de la configuration.",
                        message: "Création réussie"
                    }
                },
                deleteConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de suppression"
                    },
                    genericError: {
                        description: "Echec de la suppression de la configuration",
                        message: "Quelque chose a mal tourné"
                    },
                    success: {
                        description: "Suppression avec succès de la configuration.",
                        message: "Suppression réussie"
                    }
                },
                editConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur d'édition"
                    },
                    genericError: {
                        description: "Échec de la modification de la configuration",
                        message: "Quelque chose a mal tourné"
                    },
                    success: {
                        description: "Edition réussie de la configuration.",
                        message: "Édition réussie"
                    }
                },
                getConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de création"
                    },
                    genericError: {
                        description: "Impossible de récupérer la configuration",
                        message: "Quelque chose a mal tourné"
                    },
                    success: {
                        description: "Création avec succès de la configuration.",
                        message: "Création réussie"
                    }
                },
                triggerConfig: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de déclenchement"
                    },
                    genericError: {
                        description: "Echec du déclenchement de la configuration",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Déclenchement réussi de la configuration.",
                        message: "Déclenchement réussi"
                    }
                }
            },
            pageTitles: {
                editPage: {
                    backLink: "Retour aux configurations",
                    description: "Modifier les configurations des dépôts distants.",
                    title: "Modifier la configuration : "
                },
                listingPage: {
                    description: "Configurer un référentiel distant pour qu'il fonctionne de manière transparente avec le serveur d'identité.",
                    title: "Configuration du déploiement d'un référentiel distant"
                }
            },
            placeholders: {
                emptyDetails: {
                    subtitles: {
                        0: "La configuration n'est pas encore déployée.",
                        1: "Veuillez déployer la configuration et vérifier à nouveau."
                    },
                    title: "La configuration n'est pas déployée."
                },
                emptyList: {
                    action: "Nouvelle configuration de dépôt à distance",
                    subtitles: {
                        0: "Actuellement, il n'y a aucune configuration disponible.",
                        1: "Vous pouvez ajouter une nouvelle configuration en cliquant sur ",
                        2: "en cliquant sur le bouton ci-dessous."
                    },
                    title: "Ajouter une nouvelle configuration de dépôt à distance"
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
            oidcScopes: "Scopes OIDC",
            oidcScopesEdit: "Édition des scopes OIDC",
            overview: "Vue d'ensemble",
            privacy: "Vie privée",
            remoteRepo: "Configuration de dépôts distants",
            remoteRepoEdit: "Édition des configurations des dépôts distants"
        },
        templates: {
            emptyPlaceholder: {
                action: null,
                subtitles: "Veuillez ajouter des modèles à afficher ici.",
                title: "Pas de modèles à afficher."
            }
        },
        transferList: {
            list: {
                emptyPlaceholders: {
                    default: "Il n'y a aucun élément dans cette liste pour le moment.",
                    users: {
                        roles: {
                            selected: "Aucun {{type}} n'est attribué à cet utilisateur.",
                            unselected: "Aucun {{type}} n'est disponible pour être assigné à cet utilisateur."
                        }
                    }
                },
                headers: {
                    0: "Domaine",
                    1: "Nom"
                }
            },
            searchPlaceholder: "Rechercher {{type}}"
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
            subTitle: "Veuillez choisir l'un des types d'application suivant.",
            title: "Choisissez le type d'application"
        },
        applications: {
            subTitle: "Créer et gérer des applications basées sur des modèles et configurer l'authentification.",
            title: "Applications"
        },
        applicationsEdit: {
            backButton: "Retour aux applications",
            subTitle: null,
            title: null
        },
        idp: {
            subTitle: "Créer et gérer des fournisseurs d'identités sur la base de modèles et configurer l'authentification",
            title: "Fournisseurs d'identités"
        },
        idpTemplate: {
            backButton: "Retourner aux fournisseurs d'identité",
            subTitle: "Veuillez choisir l'un des types de fournisseurs d'identité suivants.",
            supportServices: {
                authenticationDisplayName: "Authentification",
                provisioningDisplayName: "Approvisionnement"
            },
            title: "Sélectionner le type de fournisseur d'identité"
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
        overview: {
            subTitle: "Configurer et gérer les applications, les fournisseurs d'identité, les utilisateurs et les rôles, les dialectes d'attributs, " +
                "etc.",
            title: "Bienvenue, {{firstName}}"
        }
    },
    placeholders: {
        404: {
            action: "Retour à la page d'accueil",
            subtitles: {
                0: "Nous n'avons pas trouvé la page que vous cherchez.",
                1: "Veuillez vérifier l'URL ou cliquez sur le bouton ci-dessous pour être redirigé vers la page d'accueil."
            },
            title: "Page non trouvée"
        },
        accessDenied: {
            action: "Continuer la déconnexion",
            subtitles: {
                0: "Il semble que vous n'ayez pas la permission d'utiliser ce portail.",
                1: "Veuillez vous connecter avec un autre compte."
            },
            title: "Vous n'êtes pas autorisé"
        },
        consentDenied: {
            action: "Continuer la déconnexion",
            subtitles: {
                0: "Il semble que vous n'ayez pas donné votre accord pour cette application.",
                1: "Veuillez donner votre accord pour l'utilisation de l'application."
            },
            title: "Vous avez refusé le consentement"
        },
        emptySearchResult: {
            action: "Effacer la requête de recherche",
            subtitles: {
                0: "Nous n'avons pas trouvé de résultats pour \"{{query}}\"",
                1: "Veuillez essayer un autre terme de recherche."
            },
            title: "Aucun résultat trouvé"
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
            action: "Continuer la déconnexion",
            subtitles: {
                0: "Il semble que vous n'ayez pas la permission d'utiliser ce portail.",
                1: "Veuillez vous connecter avec un autre compte."
            },
            title: "Vous n'êtes pas autorisé"
        },
        unauthorized: {
            action: "Continuer la déconnexion",
            subtitles: {
                0: "Il semble que vous n'ayez pas la permission d'utiliser ce portail.",
                1: "Veuillez vous connecter avec un autre compte."
            },
            title: "Vous n'êtes pas autorisé"
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
};
