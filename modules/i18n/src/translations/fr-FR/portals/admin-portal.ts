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

import { AdminPortalNS } from "../../../models";

export const adminPortal: AdminPortalNS = {
    components: {
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
            resultsIndicator: "Afficher des résultats pour la requête \"{{query}}\""
        },
        approvals: {
            list: {
                columns: {
                    actions: "Actions",
                    name: "Nom"
                }
            },
            modals: {
                taskDetails: {
                    header: "Tâche d'approbation",
                    description: "Vous avez une demande d'approbation d'une action opérationnelle d'un utilisateur.",
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
                emptyApprovalList: {
                    action: "",
                    subtitles: {
                        0: "Il n'y a actuellement aucune approbation à examiner.",
                        1: "Veuillez vérifier si vous avez ajouté un flux de travail pour",
                        2: "contrôler les tâches dans le système."
                    },
                    title: "Aucune approbation"
                },
                emptyApprovalFilter: {
                    action: "Voir tout",
                    subtitles: {
                        0: "Il n'y a actuellement aucune approbation dans l'état {{status}}.",
                        1: "Veuillez vérifier si vous avez des tâches dans l'état {{status}} à",
                        2: "les voir ici."
                    },
                    title: "Aucune {{status}} approbation"
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
                    tenantContent: "Ceci supprimera définitivement le certificat du locataire."
                        + "Une fois supprimé, vous ne pourrez plus accéder aux applications du portail, "
                        + "à moins d'en importer un nouveau certificat. "
                        + "Pour confirmer la suppression, veuillez saisir l'alias du certificat et cliquez sur 'Supprimer'."
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
                            description: "Une erreur s'est produite lors de la récupération du certificat du locataire",
                            message: "Quelque chose s'est mal passé !"
                        }
                    }
                },
                pageLayout: {
                    description: "Créer et gérer des certificats dans le magasin de clés",
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
                    content: "Si vous supprimez ce dialecte externe, tous les attributs externes associés seront "
                        + "également supprimés, veuillez procéder avec prudence.",
                    header: "Êtes-vous sûr ?",
                    hint: "Veuillez saisir <1>{{ name }}</1> pour confirmer.",
                    message: "Cette action est irréversible et supprimera définitivement le dialecte externe sélectionné."
                },
                dangerZone: {
                    actionTitle: "Supprimer le dialecte externe",
                    header: "Supprimer le dialecte externe",
                    subheader: "Une fois le dialecte externe supprimé, il est impossible de revenir en arrière. Soyez certain de vous."
                },
                forms: {
                    dialectURI: {
                        label: "URI de dialecte",
                        placeholder: "Saisir une URI de dialecte",
                        requiredErrorMessage: "L'URI de dialecte est obligatoire"
                    },
                    submit: "Mettre à jour"
                },
                localDialect: "Dialecte local",
                notifications: {
                    addDialect: {
                        error: {
                            description: "Une erreur s'est produite lors de l'ajout du dialecte externe",
                            message: "Quelque chose s'est mal passé"
                        },
                        genericError: {
                            description: "Le dialecte externe a été ajouté avec succès, mais ce n'est pas le cas pour "
                                + "tous les attributs externes",
                            message: "Des attributs externes n'ont pas pu être ajoutés"
                        },
                        success: {
                            description: "Le dialecte externe a été ajouté avec succès",
                            message: "Dialecte externe ajouté avec succès"
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
                            description: "Une erreur s'est produite lors de la recherche du dialecte externe",
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
                        description: "Modifier le dialecte externe et ses attributs",
                        updateDialectURI: "Mettre à jour l'URI du dialecte",
                        updateExternalAttributes: "Mettre à jour les attributs externes"
                    },
                    list: {
                        description: "Créer et gérer les dialectes d'attributs",
                        primaryAction: "Nouveau dialecte externe",
                        title: "Dialectes des attributs",
                        view: "Voir les claims locaux"
                    }
                },
                wizard: {
                    header: "Ajouter un dialecte externe",
                    steps: {
                        dialectURI: "URI de dialecte",
                        externalAttribute: "Attributs externes",
                        summary: "Résumé"
                    },
                    summary: {
                        externalAttribute: "URI de l'attribut externe",
                        mappedAttribute: "URI de l'attribut local associée",
                        notFound: "Aucun attribut externe n'a été ajouté."
                    }
                }
            },
            external: {
                advancedSearch: {
                    error: "Format du filtre de requête incorrect",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Ex. URI d'attribut, etc."
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
                    attributeURI: "URI d'attribut",
                    mappedClaim: "URI de l'attribut local associée"
                },
                forms: {
                    attributeURI: {
                        label: "URI d'attribut",
                        placeholder: "Saisir  une URI d'attribut",
                        requiredErrorMessage: "Une URI d'attribut est requis."
                    },
                    localAttribute: {
                        label: " URI de l'attribut local à associer à",
                        placeholder: "Sélectionnez un attribut local",
                        requiredErrorMessage: "Sélectionnez un attribut local  à associer à"
                    },
                    submit: "Ajouter un attribut externe"
                },
                notifications: {
                    addExternalAttribute: {
                        genericError: {
                            description: "Une erreur s'est produite lors de l'ajout de l'attribut externe.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'attribut externe a été ajouté au dialecte avec succès !",
                            message: "L'attribut externe a été ajouté avec succès"
                        }
                    },
                    deleteExternalClaim: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression de l'attribut externe",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'attribut externe a été supprimé avec succès !",
                            message: "L'attribut externe a été effacé avec succès"
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
                            description: "Une erreur s'est produite lors de la récupération de l'attribut externe",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    updateExternalAttribute: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération de l'attribut externe",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'attribut externe a été mis à jour avec succès !",
                            message: "L'attribut externe a été mis à jour avec succès"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        header: "Ajouter un attribut externe",
                        primaryAction: "Nouvel attribut externe"
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
                    claimURI: "URI du claim",
                    dialectURI: "URI du dialecte",
                    name: "Nom"
                },
                confirmation: {
                    action: "Confirmer",
                    content: "{{message}} Veuillez procéder avec prudence.",
                    dialect: {
                        message: "Si vous supprimez ce dialecte externe, tous les"
                            + " attributs externes associés seront également supprimés.",
                        name: "dialecte externe"
                    },
                    external: {
                        message: "Ceci supprimera définitivement l'attribut externe.",
                        name: "attribut externe"
                    },
                    header: "Êtes-vous sûr ?",
                    hint: "Veuillez saisir <1>{{assertion}}</1> pour confirmer.",
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
                            dialect: "Nouveau dialecte externe",
                            external: "Nouvel attribut externe",
                            local: "Nouvel attribut local"
                        },
                        subtitle: "Il n'y a actuellement aucun résultat disponible."
                            + "Vous pouvez ajouter un nouvel élément facilement en suivant les étapes de l'assistant de création.",
                        title: {
                            dialect: "Ajouter un dialecte externe",
                            external: "Ajouter un attribut externe",
                            local: "Ajouter un attribut local"
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
                    content: "Si vous supprimez cet attribut local, les données utilisateur appartenant à cet attribut "
                        + "seront également supprimés. Veuillez procéder avec prudence.",
                    header: "Êtes-vous sûr ?",
                    hint: "Veuillez saisir <1>{{nom}}</1> pour confirmer.",
                    message: "Cette action est irréversible et supprimera définitivement l'attribut local sélectionné.",
                    primaryAction: "Confirmer"
                },
                dangerZone: {
                    actionTitle: "Supprimer l'attribut local",
                    header: "Supprimer l'attribut local",
                    subheader: "Une fois que vous avez supprimé un attribut local, il est impossible de revenir en arrière. "
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
                    displayOrder: {
                        label: "Ordre d'affichage",
                        placeholder: "Saisir l'ordre d'affichage"
                    },
                    displayOrderHint: "Ceci détermine la position à laquelle cet attribut est affiché "
                        + "dans le profil de l'utilisateur et la page d'enregistrement de l'utilisateur",
                    name: {
                        label: "Nom",
                        placeholder: "Saisir un nom pour l'attribut",
                        requiredErrorMessage: "Un nom est requis"
                    },
                    nameHint: "Nom de l'attribut qui figurera sur le profil de l'utilisateur "
                        + "et la page d'enregistrement de l'utilisateur",
                    readOnly: {
                        label: "Mettre cet attribut en lecture seule"
                    },
                    regEx: {
                        label: "Expression régulière",
                        placeholder: "Entrez une expression régulière"
                    },
                    regExHint: "Cette expression régulière est utilisée pour valider le format que cet attribut peut prendre",
                    required: {
                        label: "Rendre cet attribut obligatoire lors de l'inscription de l'utilisateur"
                    },
                    supportedByDefault: {
                        label: "Afficher cet attribut sur le profil de l'utilisateur et la page d'enregistrement de l'utilisateur"
                    }
                },
                mappedAttributes: {
                    hint: "Saisissez l'attribut de chaque magasin d'utilisateurs que vous voulez associer à cet attribut."
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
                        back: "Revenir aux dialectes d'attributs",
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
                        supportedByDefault: "Cet attribut est affiché sur le profil de l'utilisateur et sur la page d'enregistrement de l'utilisateur",
                        userstore: "Annuaire"
                    }
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
                    message: "Cette action est irréversible et supprimera définitivement le modèle d'e-mail sélectionné."
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
                        description: "Une erreur s'est produite lors de la récupération des catégories de connecteurs.",
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
                            placeholder: "Valeur à rechercher"
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
                     subHeading: "Ajoutez ou supprimez les rôles auxquels ce groupe est affecté et " +
                         "notez que cela affectera l'exécution de certaines tâches."
                }
            },
            list: {
                columns: {
                    actions: "Actions",
                    lastModified: "Dernière modification",
                    name: "Nom"
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
                        description: "Le panneau d'aide apparaîtra toujours {{state}} sauf si vous le modifiez explicitement.",
                        message: "Panneau d'aide {{state}}"
                    }
                }
            }
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
                            label: "Nome de {{type}}",
                            placeholder: "Saisir un nom de {{type}}",
                            validations: {
                                duplicate: "Un {{type}} avec ce nom existe déjà.",
                                empty: "Le nom de {{type}} est obligatoire",
                                invalid: "Veuillez saisir un nom de {{type}} valide."
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
                        list: {
                            listHeader: "Nom",
                            searchPlaceholder: "Rechercher des utilisateurs"
                        },
                        subHeading: "Ajouter de nouveaux utilisateurs ou supprimer les utilisateurs existants affectés a {{type}}."
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
                        assertionHint: "Veuillez taper <1>{{ roleName }}</1> pour confirmer.",
                        content: "Si vous supprimez ce {{type}}, les permissions qui lui sont attachées seront supprimées et " +
                            "les utilisateurs qui y sont rattachés ne pourront plus effectuer les actions prévues qui étaient " +
                            "précédemment autorisées. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le {{type}} sélectionné"
                    },
                    dangerZone: {
                        actionTitle: "Supprimer {{type}}",
                        header: "Supprimer {{type}}",
                        subheader: "Une fois que vous avez supprimé le {{type}}, il n'y a plus de retour en arrière. Veuillez en être certain."
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
                        assertionHint: "Veuillez taper <1>{{ roleName }}</1> pour confirmer.",
                        content: "Si vous supprimez ce {{type}}, les permissions qui y sont attachées seront supprimées et " +
                            "les utilisateurs qui y sont rattachés ne pourront plus effectuer les actions prévues qui étaient " +
                            "précédemment autorisées. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement le {{type}} sélectionné"
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
                            description: "Une erreur s'est produite lors de la récupération des configuration du domaine d'identité.",
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
                            description: "Une erreur s'est produite lors de la mise à jour des configuration du domaine d'identité.",
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
            attributeDialects: "Dialectes d'attributs",
            categories: {
                attributes: "Attributs",
                certificates: "Certificats",
                configurations: "Configurations",
                general: "Général",
                users: "Utilisateurs",
                userstores: "Annuaires"
            },
            certificates: "Certificats",
            configurations: "Configurations",
            editEmailTemplate: "Modèles d'e-mail",
            editExternalDialect: "Modifier le dialecte externe",
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
            overview: "Vue d'ensemble",
            privacy: "Confidentialité",
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
            deleteUser: {
                confirmationModal: {
                    assertionHint: "Veuillez saisir <1>{{ userName }}</1> pour confirmer.",
                    content: "En supprimant cet utilisateur, il ne sera plus en mesure de " +
                        "se connecter au portail ou à toute autre application à laquelle il " +
                        "est actuellement habilité. Êtes-vous ABSOLUMENT certain de vouloir continuer ?",
                    header: "Êtes-vous sûr ?",
                    message: "Cette action est irréversible et supprimera définitivement le compte utilisateur."
                }
            },
            disableUser: {
                confirmationModal: {
                    assertionHint: "Veuillez saisir <1>{{ userName }}</1> pour confirmer.",
                    content: "Si vous désactivez cet utilisateur, l'utilisateur ne pourra pas se connecter à Mon " +
                        "compte ou à toute autre application à laquelle l'utilisateur était auparavant abonné. " +
                        "Veuillez procéder avec prudence.",
                    header: "Êtes-vous sûr?",
                    message: "Assurez-vous que l'utilisateur n'a plus besoin d'accéder au système."
                }
            },
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        actionTitle: "Supprimer l'utilisateur",
                        header: "Supprimer l'utilisateur",
                        subheader: "Cette action est irréversible et supprimera définitivement l'utilisateur. " +
                            "Êtes-vous ABSOLUMENT certain de vouloir supprimer cet utilisateur ?"
                    },
                    disableUserZone: {
                        actionTitle: "Supprimer l'utilisateur",
                        header: "Supprimer l'utilisateur",
                        subheader: "Cette action est irréversible et supprimera définitivement l'utilisateur. " +
                            "Êtes-vous ABSOLUMENT certain de vouloir supprimer cet utilisateur ?"
                    },
                    header: "Zone sensible",
                    lockUserZone: {
                        actionTitle: "Supprimer l'utilisateur",
                        header: "Supprimer l'utilisateur",
                        subheader: "Cette action est irréversible et supprimera définitivement l'utilisateur. " +
                            "Êtes-vous ABSOLUMENT certain de vouloir supprimer cet utilisateur ?"
                    }
                }
            },
            forms: {
                addUserForm: {
                    buttons: {
                        radioButton: {
                            label: "Sélectionner la méthode d'initialisation du mot de passe",
                            options: {
                                askPassword: "Inviter l'utilisateur à définir un mot de passe",
                                createPassword: "Définir le mot de passe de l'utilisateur"

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
                            placeholder: "Veuillez saisir un prénom",
                            validations: {
                                empty: "Le prénom est obligatoire"
                            }
                        },
                        lastName: {
                            label: "Nom de famille",
                            placeholder: "Veuillez saisir un nom de famille",
                            validations: {
                                empty: "Le nom de famille est obligatoire"
                            }
                        },
                        newPassword: {
                            label: "Nouveau mot de passe",
                            placeholder: "Veuillez saisir un mot de passe",
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
                                invalidCharacters: "Le nom d'utilisateur semble contenir des caractères non valides.",
                                regExViolation: "Ce nom d'utilisateur est invalide"
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
                    assertionHint: "Veuillez saisir <1>{{ userName }}</1> pour confirmer.",
                    content: "Si vous verrouillez cet utilisateur, l'utilisateur ne pourra pas se connecter à Mon " +
                        "compte ou à toute autre application à laquelle l'utilisateur était abonné auparavant. " +
                        "Veuillez procéder avec prudence.",
                    header: "Êtes-vous sûr?",
                    message: "Assurez-vous que cet utilisateur ne doit pas être autorisé à se connecter au système."
                }
            },
            modals: {
                addUserWarnModal: {
                    heading: "Attention",
                    message: "Veuillez noter qu'aucun rôle ne sera attribué au nouvel utilisateur. Si vous souhaitez " +
                        "lui en attribuer, veuillez cliquer sur le bouton ci-dessous."
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
                                0: "Une invitation sera envoyé à l'adresse {{email}} avec un lien d'initialisation.",
                                1: "Vous avez initialisé le mot de passe."
                            }
                        },
                        roles: "Rôle(s)",
                        username: "Nom d'utilisateur"
                    }
                },
                changePasswordModal: {
                    header: "Changer le mot de passe de l'utilisateur",
                    message: "REMARQUE: veuillez noter qu'après avoir modifié le mot de passe, l'utilisateur ne " +
                        "pourra plus se connecter à aucune application en utilisant le mot de passe actuel."
                }
            },
            profile: {
                fields: {
                    /* eslint-disable @typescript-eslint/camelcase */
                    addresses_home: "Adresse personnelle",
                    addresses_work: "Adresse professionnelle",
                    emails: "Email",
                    emails_home: "E-mail personnel",
                    emails_other: "Autre adresse e-mail",
                    emails_work: "E-mail professionnel",
                    generic: {
                        default: "Ajouter l'attribut {{fieldName}}"
                    },
                    name_familyName: "Nom de famille",
                    name_givenName: "Prénom",
                    oneTimePassword: "Mot de passe à usage unique",
                    phoneNumbers: "Numéros de téléphone",
                    phoneNumbers_home: "Numéro de téléphone personnel",
                    phoneNumbers_mobile: "Numéro de téléphone portable",
                    phoneNumbers_other: "Autre numéro de téléphone",
                    phoneNumbers_work: "Numéro de téléphone au professionnel",
                    profileUrl: "URL",
                    userName: "Nom d'utilisateur"
                    /* eslint-enable @typescript-eslint/camelcase */
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
                            description: "La réinitialisation du mot de passe du compte utilisateur a été " +
                                "déclenchée avec succès",
                            message: "Réinitialisation du mot de passe déclenchée avec succès"
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
                            description: "Une erreur s'est produite lors de la mise à jour des informations du profil",
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
                                message: "Une erreur s'est produite lors de la mise à jour des groupes de l'utilisateur"
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
                                message: "Une erreur s'est produite lors de la mise à jour des groupes de l'utilisateur"
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
                                message: "Une erreur s'est produite lors de la mise à jour des rôles de l'utilisateur"
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
                                description: "Une erreur s'est produite lors de la récupération de la liste des rôles",
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
                                message: "Une erreur s'est produite lors de la mise à jour des rôles de l'utilisateur"
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
                        }
                    },
                    viewPermissionModal: {
                        backButton: "Retour à la liste",
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
                            placeholder: "Valeur à rechercher"
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
            forms: {
                validation: {
                    formatError: "Le format du {{field}} saisi est incorrect."
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
                        0: "Une erreur s'est produite lors de la tentative de récupération des utilisateurs dans " +
                            "l'annuaire'",
                        1: "Veuillez vous assurer que les informations de connexion à l'annuaire sont exactes."
                    },
                    title: "Impossible d'aller chercher les utilisateurs dans l'annuaire"
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
                    subheader: "La désactivation d'un magasin d'utilisateurs peut vous faire perdre l'accès aux utilisateurs du magasin d'utilisateurs." +
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
                delay: {
                description: "La mise à jour de la liste des annuaires peut prendre un peu de temps. "
                        + "Veuillez rafraîchir dans quelques instants pour afficher la liste des annuaires mis à jour.",
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
            backButton: "Revenir aux applications",
            subTitle: null,
            title: "Modèle d'e-mail - {{displayName}}"
        },
        groups: {
            subTitle: "Créer et gérer des groupes d'utilisateurs, attribuer des permissions aux groupes",
            title: "Groupes"
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
            backButton: "Revenir aux utilisateurs",
            subTitle: "{{name}}",
            title: "{{email}}"
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
        consentDenied: {
            action: "Se déconnecter",
            subtitles: {
                0: "Il semblerait que vous n'ayez pas donné votre consentement à cette application",
                1: "Veuillez accorder votre consentement afin  d'utiliser l'application."
            },
            title: "Vous avez refusé le consentement"
        },
        emptySearchResult: {
            action: "Réinitialiser la recherche",
            subtitles: {
                0: "La recheche \"{{query}}\" n'a renvoyé aucun résultat.",
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
                0: "Il semblerait que l'accès à ce portail ne vous soit pas autorisé.",
                1: "Veuillez vous connecter en utilisant un autre compte."
            },
            title: "Accès interdit"
        },
        unauthorized: {
            action: "Se déconnecter",
            subtitles: {
                0: "Il semblerait que l'accès à ce portail ne vous soit pas autorisé.",
                1: "Veuillez vous connecter en utilisant un autre compte."
            },
            title: "Accès interdit"
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
};
