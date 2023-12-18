/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Extensions } from "../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 * sort-keys is suppressed temporarily until the existing warnings are fixed.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const extensions: Extensions = {
    common: {
        community: "Communauté",
        help: {
            communityLink: "Demandez à la communauté",
            docSiteLink: "Documentation",
            helpCenterLink: "Contactez le support",
            helpDropdownLink: "Obtenir de l'aide"
        },
        learnMore: "Apprendre encore plus",
        quickStart: {
            greeting: {
                alternativeHeading: "Content de te revoir, {{username}}",
                heading: "Bienvenue, {{username}}",
                subHeading: "Voici quelques étapes faciles pour démarrer avec {{productName}}"
            },
            sections: {
                addSocialLogin: {
                    actions: {
                        setup: "Configurer les connexions sociales",
                        view: "Afficher les connexions sociales"
                    },
                    description:
                        "Permettez à vos utilisateurs de se connecter à vos applications avec un " +
                        "fournisseur d'identité de leur choix.",
                    heading: "Ajouter une connexion sociale"
                },
                integrateApps: {
                    actions: {
                        create: "Enregistrer la demande",
                        manage: "Gérer des applications",
                        view: "Afficher les candidatures"
                    },
                    capabilities: {
                        sso: "SSO",
                        mfa: "MFA",
                        social: "Connexion sociale"
                    },
                    description:
                        "Enregistrez votre application et concevez l'expérience de connexion " +
                        "utilisateur que vous souhaitez en configurant SSO, MFA, connexion sociale et diverses " +
                        "règles d'authentification flexibles.",
                    heading: "Intégrez la connexion à vos applications"
                },
                learn: {
                    actions: {
                        view: "Afficher les documents"
                    },
                    description:
                        "Commencez à utiliser Asgardeo. Implémentez l'authentification pour tout type " +
                        "d'application en quelques minutes.",
                    heading: "Apprendre"
                },
                manageUsers: {
                    actions: {
                        create: "Ajouter un client",
                        manage: "gérer les utilisateurs",
                        view: "Afficher les utilisateurs"
                    },
                    capabilities: {
                        collaborators: "Collaborateurs",
                        customers: "Les clients",
                        groups: "Groupes d'utilisateurs"
                    },
                    description:
                        "Créez des comptes d'utilisateurs pour les clients et invitez des " +
                        "collaborateurs dans votre organisation. Permettez à vos utilisateurs de gérer eux-mêmes " +
                        "leurs profils en toute sécurité.",
                    heading: "Gérer les utilisateurs et les groupes"
                },
                asgardeoTryIt: {
                    errorMessages: {
                        appCreateGeneric: {
                            message: "Quelque chose s'est mal passé!",
                            description: "Échec de l'initialisation de l'application Try It."
                        },
                        appCreateDuplicate: {
                            message: "L'application existe déjà!",
                            description: "Veuillez supprimer l'application {{productName}} Try It existante."
                        }
                    }
                }
            }
        },
        upgrade: "Améliorer",
        dropdown: {
            footer: {
                privacyPolicy: "Confidentialité",
                cookiePolicy: "Cookies",
                termsOfService: "Conditions"
            }
        }
    },
    console: {
        application: {
            quickStart: {
                addUserOption: {
                    description:
                        "Vous avez besoin d'un compte <1>compte client</1> pour vous connecter à " + "l'application.",
                    hint:
                        "Si vous n'avez pas encore de compte client, cliquez sur le bouton ci-dessous pour en " +
                        "créer un. Sinon, accédez à <1>Gestion des utilisateurs > utilisateurs</1><3></3> et créez des clients.",
                    message:
                        "Si vous n'avez pas encore de compte d'utilisateur client, contactez l'administrateur " +
                        "de votre organisation."
                },
                spa: {
                    customConfig: {
                        heading: "Vous pouvez implémenter la connexion en utilisant le <1>flux de code d'autorisation avec PKCE</1> " +
                            "avec Asgardeo pour n'importe quelle technologie SPA.",
                        anySPATechnology: "ou toute technologie SPA",
                        configurations: "Configurations",
                        protocolConfig: "Utilisez les configurations suivantes pour intégrer votre application à Asgardeo. " +
                            "Pour plus de détails sur les configurations, rendez-vous dans l'onglet <1>Protocoles</1>.",
                        clientId: "identité du client",
                        baseUrl: "URL de base",
                        redirectUrl: "URL de redirection",
                        scope: "Porté",
                        serverEndpoints: "Les détails sur les points de terminaison du serveur sont disponibles dans l'onglet <1>Info</1>."
                    },
                    techSelection: {
                        heading: "Utilisez les SDK organisés par Asgardeo et les intégrations tierces."
                    }
                },
                technologySelectionWrapper: {
                    subHeading:
                        "Utiliser les " +
                        "<1>détails du point de terminaison du serveur</1> et commencer à intégrer votre propre " +
                        "application ou lire notre <3>documentation</3> pour en savoir plus .",
                    otherTechnology: "ou toute technologie mobile"
                },
                twa: {
                    common: {
                        orAnyTechnology: "ou toute technologie"
                    },
                    oidc: {
                        customConfig: {
                            clientSecret: "Clé secrète du client",
                            heading: "Vous pouvez implémenter la connexion à l'aide du <1>flux de code d'autorisation</1> " +
                                "avec Asgardeo pour n'importe quelle application Web traditionnelle."
                        }
                    },
                    saml: {
                        customConfig: {
                            heading: "Découvrez les <1>configurations SAML</1> pour intégrer " +
                                "Asgardeo à n'importe quelle application Web traditionnelle.",
                            issuer: "Émetteur",
                            acsUrl: "URL du service consommateur d'assertion",
                            idpEntityId: "ID d'entité IdP",
                            idpUrl: "URL du fournisseur d'identité"
                        }
                    }
                }
            }
        },
        applicationRoles: {
            assign: "Attribuer",
            assignGroupWizard: {
                heading: "Attribuer un groupe",
                subHeading: "Affecter des groupes au rôle d'application."
            },
            authenticatorGroups: {
                goToConnections: "Aller aux connexions",
                groupsList:{
                    assignGroups: "Attribuer des groupes",
                    notifications: {
                        fetchAssignedGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la récupération des groupes attribués"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des groupes attribués.",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        updateAssignedGroups: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la mise à jour des groupes attribués"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour des groupes attribués.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Les groupes attribués ont bien été mis à jour.",
                                message: "Mise à jour réussie"
                            }
                        }
                    }
                },
                hint: "Lors de l'attribution d'une connexion (groupes) à un rôle, assurez-vous que la connexion est " +
                "activée dans <1>Contrôle de résolution de rôle de connexion (groupe)</1> dans l'onglet Rôles de l'<3>application</3>.",
                placeholder: {
                    title: "Aucun groupe d'authentificateurs",
                    subTitle: {
                        0: "Il n'y a actuellement aucun groupe d'authentificateurs disponible.",
                        1: "Vous pouvez ajouter un nouveau groupe d'authentificateurs en visitant " +
                            "l'onglet Méthodes de connexion dans les paramètres de l'application."
                    }
                }
            },
            connectorGroups: {
                placeholder: {
                    title: "Aucun groupe d'authentificateurs fédérés",
                    subTitle: {
                        0: "Il n'y a pas de groupes disponibles pour le moment.",
                        1: "Définissez les groupes que vous recevez de votre authentificateur fédéré en ajoutant un nouveau groupe."
                    }
                }
            },
            heading: "Rôles d'application",
            searchApplication: "Demande de recherche",
            subHeading: "Affichez et gérez les rôles en fonction des besoins de l'application.",
            roleGroups: {
                assignGroup: "Attribuer un groupe",
                searchGroup: "Rechercher des groupes",
                placeholder: {
                    title: "Aucun groupe attribué",
                    subTitle: {
                        0: "Aucun groupe n'est affecté à ce rôle.",
                        1: "Pour affecter un groupe, cliquez sur le bouton Affecter un groupe."
                    }
                },
                notifications: {
                    addGroups: {
                        error: {
                            message: "Une erreur s'est produite",
                            description: "Une erreur s'est produite lors de l'ajout du groupe."
                        },
                        success: {
                            message: "Groupe ajouté avec succès",
                            description: "Le groupe a été ajouté au rôle avec succès."
                        }
                    },
                    fetchGroups: {
                        error: {
                            message: "Une erreur s'est produite",
                            description: "Une erreur s'est produite lors de l'ajout du groupe."
                        }
                    }
                },
                confirmation: {
                    deleteRole: {
                        message: "Cette action est irréversible et supprimera le groupe du rôle d'application.",
                        content: "Si vous supprimez ce groupe du rôle d'application, les autorisations associées " +
                            "à ce rôle seront supprimées du groupe. Veuillez procéder avec prudence."
                    }
                }
            },
            roleList: {
                placeholder: {
                    title: "Aucun rôle d'application",
                    subTitle: {
                        0: "Il n'y a actuellement aucun rôle d'application disponible.",
                        1: "Vous pouvez ajouter un nouveau rôle d'application en visitant l'onglet Rôles dans les paramètres de l'application."
                    }
                }
            },
            roleMapping: {
                heading: "Configurations de mappage de rôle",
                subHeading: "Configurez s'il faut utiliser les mappages de rôles d'application pendant le flux d'autorisation.",
                notifications: {
                    sharedApplication: {
                        error: {
                            description: "Une erreur s'est produite lors de la récupération des applications partagées.",
                            message: "Une erreur s'est produite"
                        }
                    },
                    updateRole: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la mise à jour du rôle"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du rôle.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le rôle a bien été mis à jour.",
                            message: "Mis à jour avec succés"
                        }
                    }
                }
            },
            roles: {
                heading: "Les rôles",
                subHeading: "Gérer les rôles et les autorisations.",
                goBackToRoles: "Revenir aux rôles",
                orgRoles: {
                    heading: "Rôles de l'organisation",
                    subHeading: "Gérez les rôles de l'organisation ici."
                }
            }
        },
        identityProviderGroups: {
            claimConfigs: {
                groupAttributeLabel: "Attribut de groupe",
                groupAttributeHint: "L'attribut de l'authentificateur fédéré sera mappé aux rôles spécifiques à l'application. " +
                    "Cela doit être défini pour que l'attribut d'application soit renvoyé.",
                groupAttributePlaceholder: "Saisir l'attribut mappé",
                notifications: {
                    fetchConfigs: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la récupération des configurations de revendication"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des configurations de revendication.",
                            message: "Une erreur s'est produite"
                        }
                    }
                }
            },
            createGroupWizard: {
                groupNameLabel: "Nom de groupe",
                groupNamePlaceHolder: "Entrez un nom de groupe",
                groupNameHint: "Cela doit correspondre au nom des groupes qui sera renvoyé par votre fournisseur d'identité fédérée.",
                subHeading: "Créer un nouveau groupe de fournisseurs d'identité.",
                notifications: {
                    createIdentityProviderGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création du groupe de fournisseurs d'identité.",
                            message: "Une erreur s'est produite"
                        },
                        success: {
                            description: "Le groupe de fournisseurs d'identité a été créé avec succès.",
                            message: "Créé avec succès"
                        }
                    },
                    duplicateGroupError: {
                        error: {
                            description: "Un groupe avec le même nom existe déjà.",
                            message: "Une erreur s'est produite"
                        }
                    }
                }
            },
            groupsList: {
                confirmation: {
                    deleteGroup: {
                        message: "Cette action est irréversible.",
                        content: "Cette action supprimera définitivement le groupe de " +
                            "fournisseurs d'identité {{groupName}}. Veuillez procéder avec prudence."
                    }
                },
                newGroup: "Nouveau groupe",
                noGroupsAvailable: "Aucun groupe disponible",
                notifications: {
                    fetchGroups: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la récupération des groupes de fournisseurs d'identité"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des groupes de fournisseurs d'identité.",
                            message: "Une erreur s'est produite"
                        }
                    },
                    deleteGroup: {
                        error: {
                            description: "{{description}}",
                            message: "Une erreur s'est produite lors de la suppression du groupe de fournisseurs d'identité"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du groupe de fournisseurs d'identité.",
                            message: "Une erreur s'est produite"
                        },
                        success: {
                            description: "Le groupe de fournisseurs d'identité a été supprimé avec succès.",
                            message: "Supprimé avec succès"
                        }
                    }
                },
                searchByName: "Rechercher par nom"
            }
        },
        marketingConsent: {
            heading: "Restons en contact!",
            description: "Abonnez-vous à notre newsletter pour obtenir les dernières nouvelles et mises à jour de produit directement dans votre boîte de réception.",
            actions: {
                subscribe: "S'abonner",
                decline: "Ne montrez plus ça"
            },
            notifications: {
                errors: {
                    fetch: {
                        message: "Quelque chose s'est mal passé",
                        description: "Quelque chose s'est mal passé lors de l'obtention des données de consentement des utilisateurs"
                    },
                    update: {
                        message: "Quelque chose s'est mal passé",
                        description: "Quelque chose s'est mal passé lors de la mise à jour du consentement des utilisateurs"
                    }
                }
            }
        }
    },
    develop: {
        apiResource: {
            pageHeader: {
                description: "Créez et gérez les ressources API utilisées pour définir les étendues / autorisations API qui peuvent être consommées par vos applications.",
                title: "Ressources de l'API"
            },
            empty: "Il n'y a pas de ressources API disponibles pour le moment.",
            managedByChoreoText: "Géré par Choreo",
            apiResourceError: {
                subtitles: {
                    0: "Quelque chose s'est mal passé lors de la récupération des ressources API",
                    1: "Veuillez réessayer"
                },
                title: "Quelque chose s'est mal passé"
            },
            addApiResourceButton: "Nouvelle ressource API",
            confirmations: {
                deleteAPIResource: {
                    assertionHint: "Veuillez confirmer votre action.",
                    content: "Cette action est irréversible et supprimera en permanence la ressource API.",
                    header: "Es-tu sûr?",
                    message: "Si vous supprimez cette ressource API, certaines fonctionnalités peuvent ne pas " +
                        "fonctionner correctement. Veuillez procéder avec prudence."
                },
                deleteAPIResourcePermission: {
                    assertionHint: "Veuillez confirmer votre action.",
                    content: "Cette action est irréversible et supprimera en permanence l'autorisation de la ressource API.",
                    header: "Es-tu sûr?",
                    message: "Si vous supprimez cette autorisation de la ressource API, certaines fonctionnalités peuvent ne pas fonctionner correctement." +
                        "Veuillez procéder avec prudence."
                }
            },
            managementAPI: {
                header: "API de gestion",
                description: "API pour gérer les ressources de votre organisation (racine)"
            },
            notifications: {
                deleteAPIResource: {
                    unauthorizedError: {
                        description: "Vous n'êtes pas autorisé à supprimer la ressource API.",
                        message: "Non autorisé"
                    },
                    notFoundError: {
                        description: "La ressource API que vous essayez de supprimer n'existe pas.",
                        message: "Ressource API introuvable"
                    },
                    genericError: {
                        description: "Échec de la suppression de la ressource API.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Supprimé avec succès la ressource API.",
                        message: "Ressource API supprimée"
                    }
                },
                getAPIResource: {
                    unauthorizedError: {
                        description: "Vous n'êtes pas autorisé à afficher la ressource API.",
                        message: "Non autorisé"
                    },
                    notFoundError: {
                        description: "La ressource API que vous essayez de voir n'existe pas.",
                        message: "Ressource API introuvable"
                    },
                    genericError: {
                        description: "Échec de la récupération de la ressource API.",
                        message: "Quelque chose s'est mal passé"
                    }
                },
                getAPIResources: {
                    unauthorizedError: {
                        description: "Vous n'êtes pas autorisé à consulter les ressources de l'API.",
                        message: "Non autorisé"
                    },
                    genericError: {
                        description: "N'a pas réussi à récupérer les ressources de l'API.",
                        message: "Quelque chose s'est mal passé"
                    }
                },
                updateAPIResource: {
                    invalidPayloadError: {
                        description: "The content of the paylond is not valid.",
                        message: "Charge utile de demande non valide"
                    },
                    unauthorizedError: {
                        description: "Vous n'êtes pas autorisé à mettre à jour la ressource API.",
                        message: "Non autorisé"
                    },
                    notFoundError: {
                        description: "La ressource API que vous essayez de mettre à jour n'existe pas.",
                        message: "Ressource API introuvable"
                    },
                    genericError: {
                        description: "Échec de la mise à jour de la ressource API.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Mis à jour avec succès la ressource API.",
                        message: "Ressource API mise à jour"
                    }
                },
                addAPIResource: {
                    invalidPayloadError: {
                        description: "Le contenu du PayLond n'est pas valide.",
                        message: "Charge utile de demande non valide"
                    },
                    unauthorizedError: {
                        description: "Vous n'êtes pas autorisé à créer une ressource API.",
                        message: "Non autorisé"
                    },
                    alreadyExistsError: {
                        description: "La ressource API que vous essayez de créer existe déjà.",
                        message: "La ressource API existe déjà"
                    },
                    permissionAlreadyExistsError: {
                        description: "Cette permission (portée) que vous essayez d'ajouter existe déjà dans l'organisation.Veuillez en choisir un autre.",
                        message: "La permission existe déjà"
                    },
                    genericError: {
                        description: "Échec de la création de la ressource API.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Création avec succès de la ressource API.",
                        message: "Ressource API créée"
                    }
                }
            },
            organizationAPI: {
                header: "API d'organisation",
                description: "API pour gérer les ressources de vos autres organisations"
            },
            table: {
                name: {
                    column: "Afficher un nom"
                },
                identifier: {
                    column: "Identifiant",
                    label: "Identifiant"
                },
                actions: {
                    column: "Actions"
                },
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "Nom ou identifiant d'affichage"
                            },
                            filterCondition: {
                                placeholder: "Par exemple.Commence par etc."
                            },
                            filterValue: {
                                placeholder: "Entrez la valeur pour rechercher"
                            }
                        }
                    },
                    placeholder: "Recherche par nom d'affichage"
                }
            },
            tabs: {
                apiResourceError: {
                    subtitles: {
                        0: "Une erreur s'est produite lors de la récupération de la ressource API demandée, peut-être parce que la ressource n'existe pas.",
                        1: "Veuillez réessayer."
                    },
                    title: "Quelque chose s'est mal passé"
                },
                title: "Modifier la ressource API",
                backButton: "Revenez aux ressources API",
                choreoApiEditWarning: "La mise à jour de cette ressource API créera des erreurs imprévues car il s'agit d'une ressource API gérée par Choreo.<1> procéder à la prudence. </1>",
                general: {
                    dangerZoneGroup: {
                        header: "Zone dangereuse",
                        deleteApiResource: {
                            header: "Supprimer la ressource API",
                            subHeading: "Cette action supprimera en permanence la ressource API.Veuillez être certain avant de continuer.",
                            button: "Supprimer la ressource API"
                        },
                        deleteChoreoApiResource: {
                            header: "Supprimer la ressource API",
                            subHeading: "Cette action supprimera en permanence la ressource API.Veuillez être certain avant de continuer.",
                            button: "Supprimer la ressource API"
                        }
                    },
                    form: {
                        fields: {
                            name: {
                                emptyValidate: "Le nom de l'affichage ne peut pas être vide",
                                label: "Afficher un nom",
                                placeholder: "Entrez un nom amical pour la ressource API"
                            },
                            identifier: {
                                hint: "[Text description for identifier]",
                                label: "Identifiant"
                            },
                            gwName: {
                                hint: "[Text description for gate way name]",
                                label: "Nom de passerelle"
                            },
                            description: {
                                label: "laDescription",
                                placeholder: "Entrez une description de la ressource API"
                            }
                        },
                        updateButton: "Mise à jour"
                    },
                    label: "Générale"
                },
                authorization: {
                    form: {
                        fields: {
                            authorize: {
                                label: "Nécessite une autorisation",
                                hint: "Indique si la ressource API nécessite l'autorisation d'obtenir des lunettes."
                            }
                        }
                    },
                    label: "Autorisation"
                },
                permissions: {
                    button: "Ajouter la permission",
                    label: "Autorisation",
                    title: "Liste des autorisations",
                    subTitle: "Liste des autorisations d'utilisation par la ressource API.",
                    learnMore: "Apprendre encore plus",
                    search: "Rechercher les autorisations par nom d'affichage",
                    empty: {
                        title: "Aucune autorisation n'est attribuée",
                        subTitle: "Cliquez sur l'icône + pour ajouter une nouvelle autorisation"
                    },
                    emptySearch: {
                        title: "Aucun résultat trouvé",
                        subTitle: {
                            0: "Nous n'avons pas pu trouver l'autorisation que vous avez recherchée.",
                            1: "Veuillez essayer d'utiliser un autre paramètre."
                        },
                        viewAll: "Recherche de recherche claire"
                    },
                    copyPopupText: "Copiez l'identifiant",
                    copiedPopupText: "Copié l'identifiant",
                    removePermissionPopupText: "Retirez l'autorisation ",
                    form: {
                        button: "Ajouter la permission",
                        cancelButton: "Annuler",
                        submitButton: "Finir",
                        title: "Ajouter la permission",
                        subTitle: "Créer une nouvelle autorisation",
                        fields: {
                            displayName: {
                                emptyValidate: "Le nom de l'affichage ne peut pas être vide",
                                label: "Afficher un nom",
                                placeholder: "Lire les réservations"
                            },
                            permission: {
                                emptyValidate: "L'autorisation (portée) ne peut pas être vide",
                                label: "Permission (portée)",
                                placeholder: "read_bookings"
                            },
                            description: {
                                label: "La description",
                                placeholder: "Entrez la description"
                            }
                        }
                    }
                }
            },
            wizard: {
                addApiResource: {
                    cancelButton: "Annuler",
                    nextButton: "Suivante",
                    previousButton: "Précédente",
                    submitButton: "Finir",
                    title: "Ajouter la ressource API",
                    subtitle: "Créer une nouvelle ressource API",
                    steps: {
                        basic: {
                            stepTitle: "Détails de base",
                            form: {
                                fields: {
                                    name: {
                                        emptyValidate: "Le nom de l'affichage ne peut pas être vide",
                                        label: "Afficher un nom",
                                        hint: "Nom significatif pour identifier votre ressource API dans {{ productName }}.",
                                        placeholder: "API des réservations"
                                    },
                                    identifier: {
                                        emptyValidate: "L'identifiant ne peut pas être vide",
                                        alreadyExistsError: "L'identifiant existe déjà dans l'organisation.Veuillez en choisir un autre",
                                        invalid: "L'identifiant ne peut pas contenir d'espaces",
                                        hint: "Nous vous recommandons d'utiliser une URI comme identifiant, mais vous n'avez pas besoin de rendre l'URI accessible au public car {{ productName }} n'accèdera pas à votre API. {{ productName }} utilisera cette valeur d'identifiant comme la réclamation d'audience(aud) dans les jetons JWT émis. <1>Ce champ devrait être unique;Une fois créé, il n'est pas modifiable.</1>",
                                        label: "Identifiant",
                                        placeholder: "https://api.bookmyhotel.com"
                                    },
                                    description: {
                                        label: "La description",
                                        placeholder: "Entrez une description de la ressource API"
                                    }
                                }
                            }
                        },
                        authorization: {
                            stepTitle: "Autorisation",
                            form: {
                                rbacMessage: "À l'heure actuelle, {{ productName }} prend en charge exclusivement le contrôle d'accès basé sur les rôles (RBAC) pour l'autorisation.",
                                fields: {
                                    authorize: {
                                        label: "Nécessite une autorisation",
                                        hint: "S'il est vérifié, il est obligatoire d'appliquer une politique d'autorisation lors de la consommation de cette API dans une demande, sinon vous avez la possibilité de procéder sans politique.<1> Ce champ ne peut pas être modifié une fois créé. </1>"
                                    }
                                }
                            }
                        },
                        permissions: {
                            emptyPlaceHolder: "Aucune autorisation n'est attribuée à la ressource API",
                            stepTitle: "Autorisation",
                            form: {
                                button: "Ajouter la permission",
                                fields: {
                                    displayName: {
                                        emptyValidate: "Le nom de l'affichage ne peut pas être vide",
                                        label: "Afficher un nom",
                                        placeholder: "Lire les réservations",
                                        hint: "Fournissez un nom significatif car il sera affiché sur l'écran de consentement de l'utilisateur."
                                    },
                                    permission: {
                                        emptyValidate: "L'autorisation (portée) ne peut pas être vide",
                                        uniqueValidate: "Cette autorisation (portée) existe déjà dans l'organisation.Veuillez en choisir un autre.",
                                        invalid: "L'autorisation (portée) ne peut pas contenir d'espaces.",
                                        label: "Permission (portée)",
                                        placeholder: "read_bookings",
                                        hint: "Une valeur unique qui agit comme portée lors de la demande d'un jeton d'accès.<1> Notez que l'autorisation ne peut pas être modifiée une fois créée.</1>"
                                    },
                                    permissionList: {
                                        label: "Autorisations ajoutées"
                                    },
                                    description: {
                                        label: "La description",
                                        placeholder: "Entrez la description",
                                        hint: "Fournissez une description de votre permission.Cela sera affiché sur l'écran de consentement de l'utilisateur."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        applications: {
            asgardeoTryIt: {
                description:
                    "Vous pouvez essayer différents flux de" +
                    "connexion d'Asgardeo avec notre application Try It."
            },
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled:
                                            "Les authentificateurs de deuxième facteur ne peuvent " +
                                            "être utilisés que si <1>Nom d'utilisateur et mot de passe</1>, " +
                                            "<3>Connexion sociale</3> ou <5>Clé de sécurité/Biométrie</5>" +
                                            " est présent lors d'une étape précédente."
                                    }
                                }
                            }
                        }
                    },
                    apiAuthorization: {
                        title: "Autorisation de l'API",
                        sections: {
                            apiSubscriptions: {
                                heading: "Gérer l'accès aux ressources de l'API",
                                subHeading: "Gérer les ressources API consommées par cette application.",
                                search: "Rechercher les ressources de l'API par nom d'affichage",
                                unsubscribeAPIResourcePopOver: "Débrancher la ressource API",
                                allAPIAuthorizedPopOver: "Toutes les ressources API sont autorisées",
                                choreoApiEditWarning: "La mise à jour des lunettes autorisées créera des erreurs imprévues car il s'agit d'une ressource API gérée par Choreo.<1> procéder à la prudence. </1>",
                                buttons: {
                                    subAPIResource: "Autoriser une ressource API",
                                    noAPIResourcesLink: "Créer une ressource API",
                                    emptySearchButton: "View all API resources"
                                },
                                placeHolderTexts: {
                                    emptyText: "Aucune ressource API n'est autorisée",
                                    noAPIResources: "Il n'y a pas de ressources API disponibles pour s'abonner",
                                    errorText: {
                                        subtitles: {
                                            0: "Une erreur s'est produite lors de la récupération des ressources de l'API.",
                                            1: "Veuillez réessayer."
                                        },
                                        title: "Quelque chose s'est mal passé"
                                    },
                                    emptySearch: {
                                        title: "Aucun résultat trouvé",
                                        subTitle: {
                                            0: "Nous n'avons pas pu trouver la ressource API que vous avez recherchée.",
                                            1: "Veuillez essayer d'utiliser un autre paramètre."
                                        }
                                    }
                                },
                                notifications: {
                                    unSubscribe: {
                                        unauthorizedError: {
                                            description: "Vous n'êtes pas autorisé à désabonner la ressource API.",
                                            message: "Non autorisé"
                                        },
                                        notFoundError: {
                                            description: "La ressource API que vous essayez de vous désabonner n'existe pas.",
                                            message: "Ressource API introuvable"
                                        },
                                        genericError: {
                                            description: "Échec de l'inbranration de la ressource API.",
                                            message: "Quelque chose s'est mal passé"
                                        },
                                        success: {
                                            description: "Abandonnez avec succès la ressource API.",
                                            message: "API Resource se désinscrire"
                                        }
                                    },
                                    patchScopes: {
                                        unauthorizedError: {
                                            description: "Vous n'êtes pas autorisé à mettre à jour la ressource API.",
                                            message: "Non autorisé"
                                        },
                                        genericError: {
                                            description: "Échec de la mise à jour de la ressource API.",
                                            message: "Quelque chose s'est mal passé"
                                        },
                                        success: {
                                            description: "Mis à jour avec succès la ressource API.",
                                            message: "Ressource API mise à jour"
                                        }
                                    },
                                    createAuthorizedAPIResource: {
                                        unauthorizedError: {
                                            description: "Vous n'êtes pas autorisé à autoriser la ressource API.",
                                            message: "Non autorisé"
                                        },
                                        initialError: {
                                            description: "Quelque chose s'est mal passé en ouvrant la boîte de dialogue.",
                                            message: "Veuillez réessayer."
                                        },
                                        genericError: {
                                            description: "Échec de l'autorisation de la ressource API.",
                                            message: "Quelque chose s'est mal passé"
                                        },
                                        success: {
                                            description: "Autorisé avec succès la ressource API.",
                                            message: "Ressource API autorisée"
                                        }
                                    }
                                },
                                confirmations: {
                                    unsubscribeAPIResource: {
                                        assertionHint: "Veuillez confirmer votre action.",
                                        content: "Cette action est irréversible et désabonnera définitivement la ressource API.",
                                        header: "Es-tu sûr?",
                                        message: "Si vous désinscrivez cette ressource API, certaines fonctionnalités peuvent ne pas fonctionner correctement." +
                                            "Veuillez procéder avec prudence."
                                    },
                                    unsubscribeChoreoAPIResource: {
                                        content: "Le désabonnement de cette ressource API ne sera pas reflété à la" +
                                        " fin de Choreo, mais aura un impact / affectera l'autorisation" +
                                        " de l'utilisateur car les lunettes autorisées ne seront plus accessibles." +
                                        "<1> procéder à la prudence. </1>"
                                    }
                                },
                                scopesSection: {
                                    label: "Scopes autorisées",
                                    placeholder: "Aucune portée n'est autorisée pour cette ressource API.",
                                    hint: "Les portées de la ressource API auxquelles l'application est autorisée à accéder.",
                                    updateButton: "Mise à jour",
                                    copyScopesHint: "Demandez ces étendues en plus des portées OIDC de cette application.",
                                    selectAll: "Tout sélectionner",
                                    selectNone: "Ne rien sélectionner"
                                },
                                wizards: {
                                    authorizeAPIResource: {
                                        title: "Autoriser une ressource API",
                                        subTitle: "Autoriser une nouvelle ressource API à l'application.",
                                        fields: {
                                            apiResource: {
                                                label: "Ressource API",
                                                placeholder: "Entrez le nom d'affichage de la ressource API",
                                                requiredErrorMessage: "La ressource API est requise"
                                            },
                                            scopes: {
                                                label: "Scopes autorisées",
                                                placeholder: "Aucune portée n'est autorisée pour cette ressource API",
                                                hint: "Les portées de la ressource API auxquelles l'application est autorisée à accéder."
                                            },
                                            policy: {
                                                label: "Politique d'autorisation",
                                                hint: "Sélectionnez la politique pour autoriser l'API pour l'application."
                                            }
                                        },
                                        rbacPolicyMessage: "Cette ressource API nécessite l'autorisation et {{ productName }} prend en charge exclusivement le contrôle d'accès basé sur les rôles (RBAC) pour l'autorisation.",
                                        buttons: {
                                            finish: "Finir",
                                            cancel: "Annuler"
                                        }
                                    }
                                }
                            },
                            policySection: {
                                heading: "Paramètres de stratégie",
                                subHeading: "Protégez et gouvernez vos ressources API avec des politiques d'autorisation dynamique.",
                                buttons: {
                                    update: "Mise à jour"
                                },
                                messages: {
                                    noPolicy: "Vous n'avez sélectionné aucune politique pour gérer les lunettes de vos API souscrites.Veuillez sélectionner des politiques pour gérer les lunettes API pour la sécurité et les fonctionnalités appropriées de votre application.",
                                    noClientCredentials: "Veuillez <1> activer la subvention des informations d'identification du client </1> pour votre demande avant d'appliquer la stratégie basée sur l'application pour un accès sécurisé à vos API abonnées."

                                },
                                form: {
                                    fields: {
                                        userPolicy: {
                                            label: "Activer les politiques basées sur l'utilisateur"
                                        },
                                        rbac: {
                                            label: "Activer le contrôle d'accès basé sur les rôles (RBAC)",
                                            name: "Contrôle d'accès basé sur les rôles (RBAC)",
                                            hint: "Les politiques d'autorisation du RBAC seront appliquées pour cette ressource API.L'autorisation de rôle et de rôle dans les mappages de groupe sera évaluée lors de l'appel d'autorisation."
                                        },
                                        consent: {
                                            label: "Activer la politique d'accès basée sur le consentement",
                                            hint: "Lorsqu'il est activé, la politique d'autorisation basée sur le consentement sera appliquée pour cette application.Au cours de la transaction de connexion, l'attribution de la portée sera évaluée pour déterminer les privilèges d'accès de l'application."
                                        },
                                        appPolicy: {
                                            label: "Activer la politique basée sur les applications (M2M)",
                                            hint: "Lorsqu'il est activé, la politique d'autorisation de la machine à machine (M2M) sera appliquée pour cette application."
                                        },
                                        noPolicy: {
                                            name: "Aucune politique d'autorisation",
                                            hint: "L'autorisation n'est pas requise pour cette ressource API, mais le consentement de l'utilisateur sera requis s'il est invité."
                                        }
                                    }
                                },
                                notifications: {
                                    getPolicies: {
                                        genericError: {
                                            description: "Échec de récupérer les politiques.",
                                            message: "Quelque chose s'est mal passé"
                                        }
                                    },
                                    patchPolicies: {
                                        unauthorizedError: {
                                            description: "Vous n'êtes pas autorisé à mettre à jour les politiques.",
                                            message: "Non autorisé"
                                        },
                                        genericError: {
                                            description: "Échec de la mise à jour des politiques.",
                                            message: "Quelque chose s'est mal passég"
                                        },
                                        success: {
                                            description: "Mis à jour avec succès les politiques.",
                                            message: "Politiques mises à jour"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    roles: {
                        addRoleWizard: {
                            buttons: {
                                finish: "Finir",
                                next: "Suivant",
                                previous: "Précédent"
                            },
                            forms: {
                                roleBasicDetails: {
                                    roleName: {
                                        hint: "Un nom pour le rôle.",
                                        label: "Nom de rôle",
                                        placeholder: "Entrez le nom du rôle",
                                        validations: {
                                            duplicate: "Un rôle existe déjà avec le nom de rôle donné.",
                                            empty: "Le nom du rôle est requis pour continuer.",
                                            invalid: "Un nom de rôle ne peut contenir que des caractères alphanumériques, - et _. "
                                                + "Et doit être d'une longueur comprise entre 3 et 30 caractères."
                                        }
                                    }
                                },
                                rolePermissions: {
                                    label: "Autorisations de rôle",
                                    searchPlaceholer: "Rechercher par nom d'API et nom d'autorisation"
                                }
                            },
                            heading: "Créer un rôle",
                            subHeading: "Créez un nouveau rôle dans votre application.",
                            wizardSteps: {
                                0: "Détails de base",
                                1: "Sélection d'autorisation"
                            }
                        },
                        title: "Rôles",
                        heading: "Rôles",
                        subHeading: "Gérer les rôles au niveau de l'application dans votre application.",
                        subHeadingAlt: "Afficher les rôles au niveau de l'application dans votre application.",
                        buttons: {
                            newRole: "Nouveau rôle"
                        },
                        labels: {
                            apiResource: "Ressource API",
                            selectAllPermissions: "Sélectionnez toutes les autorisations"
                        },
                        advancedSearch: {
                            form: {
                                inputs: {
                                    filterValue: {
                                        placeholder: "Entrez la valeur à rechercher"
                                    }
                                }
                            },
                            placeholder: "Rechercher par nom de rôle"
                        },
                        list: {
                            columns: {
                                actions: "",
                                name: "Nom"
                            }
                        },
                        editModal: {
                            heading: "Gérer les autorisations",
                            readonlyHeading: "Afficher les autorisations",
                            readonlySubHeading: "Afficher les autorisations liées au rôle. Les autorisations autorisées seront considérées comme cochées.",
                            subHeading: "Sélectionnez les autorisations liées au rôle.",
                            searchPlaceholer: "Rechercher par nom d'API et nom d'autorisation"
                        },
                        deleteRole: {
                            confirmationModal: {
                                assertionHint: "Veuillez confirmer votre action.",
                                content: "Si vous supprimez ce rôle d'application, les utilisateurs associés au rôle d'application ci-dessus" +
                                    " n'auront plus les autorisations attribuées. Veuillez procéder avec prudence.",
                                header: "Es-tu sûr?",
                                message: "Cette action est irréversible et supprimera définitivement le rôle d'application."
                            }
                        },
                        placeHolders: {
                            emptyList: {
                                action: "Nouveau rôle",
                                subtitles: {
                                    0: "Il n'y a actuellement aucun rôle disponible."
                                },
                                title: "Aucun rôle disponible"
                            },
                            emptySearchResults: {
                                action: "Effacer la requête de recherche",
                                subtitles: {
                                    0: "Nous n'avons trouvé aucun résultat pour '{{ searchQuery }}'",
                                    1: "Veuillez essayer un terme de recherche différent."
                                },
                                title: "Aucun résultat trouvé"
                            },
                            emptyPermissions: {
                                subtitles: {
                                    0: "Il n'y a pas d'autorisations autorisées disponibles pour votre application."
                                }
                            }
                        },
                        notifications: {
                            createApplicationRole: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la création du rôle d'application"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la création du rôle d'application.",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "Le rôle d'application a bien été créé.",
                                    message: "Créez avec succès."
                                }
                            },
                            updatePermissions: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la mise à jour des autorisations de rôle"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la mise à jour des autorisations de rôle.",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "Mise à jour des autorisations de rôle réussie.",
                                    message: "Mise à jour réussie"
                                }
                            },
                            deleteApplicationRole: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la suppression du rôle d'application"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la suppression du rôle d'application.",
                                    message: "Quelque chose s'est mal passé"
                                },
                                success: {
                                    description: "Le rôle d'application a bien été supprimé.",
                                    message: "Suppression réussie"
                                }
                            },
                            fetchApplicationRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la récupération des rôles d'application"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la récupération des rôles d'application.",
                                    message: "Quelque chose s'est mal passé"
                                }
                            },
                            fetchAuthorizedAPIs: {
                                error: {
                                    description: "{{description}}",
                                    message: "Une erreur s'est produite lors de la récupération des API autorisées"
                                },
                                genericError: {
                                    description: "Une erreur s'est produite lors de la récupération des API autorisées.",
                                    message: "Quelque chose s'est mal passé"
                                }
                            }
                        }
                    },
                    rolesV2: {
                        heading: "Les rôles",
                        subHeading: "Gérer les rôles attribués dans l'application.",
                        roleAudience: "Rôle public",
                        organization: "Organisation",
                        application: "application",
                        assignedRoles: "Rôles attribués",
                        removedRoles: "Rôles supprimés",
                        searchPlaceholder: "Recherche par nom de rôle",
                        switchRoleAudience: {
                            applicationConfirmationModal: {
                                assertionHint: "Veuillez confirmer votre action.",
                                content: "Si vous changez le rôle de rôle en application, l'association avec "+
                                    "Les rôles de l'organisation seront supprimés de la demande. Veuillez procéder à la prudence.",
                                header: "Passer à l'application du rôle de rôle?",
                                message: "Cette action est irréversible et supprimera les associations de rôle existantes."
                            },
                            organizationConfirmationModal: {
                                assertionHint: "Veuillez confirmer votre action.",
                                content: "Si vous modifiez le rôle de rôle en organisation, les rôles d'application "+
                                    "Associé à la demande sera supprimé en permanence. Veuillez procéder à la prudence.",
                                header: "Changer le rôle de rôle à l'organisation?",
                                message: "Cette action est irréversible et supprimera en permanence les rôles existants."
                            }
                        }
                    }
                }
            },
            quickstart: {
                mobileApp: {
                    configurations: {
                        anyTechnology: "ou toute technologie d'application mobile",
                        heading: "Suivez <1>ce guide</1> pour apprendre le flux de code d'autorisation " +
                            "OIDC avec PKCE et utilisez les détails ci-dessous pour configurer tout SDK OIDC tiers pour les applications mobiles.",
                        discoveryURI: {
                            label: "URI de découverte",
                            info: "Ce point de terminaison est appelé par les applications pour découvrir dynamiquement les métadonnées du fournisseur d'identité OpenID Connect."
                        },
                        generalDescription: "Utilisez les configurations suivantes pour intégrer votre application mobile à Asgardeo.",
                        moreInfoDescription: "Utilisez plus de détails sur les points de terminaison du serveur dans l'onglet <1>Info</1> pour créer votre application.",
                        protocolDescription: "Pour plus de détails sur les configurations, rendez-vous dans l'onglet <1>Protocole</1>.",
                        redirectURI: {
                            label: "URI de redirection"
                        },
                        scope: {
                            label: "Porté"
                        }
                    },
                    tabHeading: "Guider",
                    technologyInfo: "Vous pouvez intégrer cette application à n'importe quel SDK mobile OIDC tiers de votre choix. <1>En savoir plus</1>"
                },
                spa: {
                    common: {
                        addTestUser: {
                            title: "Expérimenter!"
                        },
                        prerequisites: {
                            angular:
                                "<0>Remarque: </0>Le SDK ne prend actuellement pas en charge les applications " +
                                "Angular 11 en <2>Mode Strict</2>. Nous travaillons à rendre le SDK compatible.",
                            node:
                                "Vous devrez avoir installé <1>Node.js</1> et <3>npm</3> sur votre environnement " +
                                "pour essayer le SDK. Pour télécharger la version Long Term Support (LTS) de " +
                                "<5>Node .js</5> (qui inclut <7>npm</7>), accédez à la page officielle de " +
                                "<9>téléchargements</9>."
                        }
                    },
                    integrate: {
                        common: {
                            sdkConfigs: {
                                clientId: {
                                    hint: "L'identifiant client OAuth 2.0 valide sur le serveur d'autorisation."
                                },
                                scope: {
                                    hint:
                                        "Ce sont l'ensemble des étendues qui sont utilisées pour demander des " +
                                        "attributs utilisateur.<1></1> Si vous devez ajouter d'autres étendues " +
                                        "que <3>openid</3> & <5>profile</5>, vous pouvez les ajouter au tableau." +
                                        "<7></7>Lisez notre <9>documentation</9> pour en savoir plus."
                                },
                                serverOrigin: {
                                    hint: "L'origine du fournisseur d'identité."
                                },
                                signInRedirectURL: {
                                    hint: {
                                        content:
                                            "L'URL qui détermine où le code d'autorisation est envoyé lors " +
                                            "de l'authentification de l'utilisateur.<1></1> Si votre application " +
                                            "est hébergée sur une URL différente, allez dans l'onglet <3>protocole" +
                                            "</3> et configurez la bonne URL dans le champ <5>URL de redirection " +
                                            "autorisées</5>.",
                                        multipleWarning:
                                            "Vous avez configuré plusieurs URL de rappel valides pour " +
                                            "votre application. Veuillez vérifier que la bonne URL est sélectionnée."
                                    }
                                },
                                signOutRedirectURL: {
                                    hint: {
                                        content:
                                            "L'URL qui détermine vers où l'utilisateur est redirigé lors de " +
                                            "la déconnexion.<1></1> Si votre application est hébergée sur une URL " +
                                            "différente, allez dans l'onglet <3>protocole</3> et configurez l'URL " +
                                            "correcte à partir du Champ <5>URL de redirection autorisées</5>.",
                                        multipleWarning:
                                            "Vous avez configuré plusieurs URL de rappel valides pour " +
                                            "votre application. Veuillez vérifier que la bonne URL est sélectionnée."
                                    }
                                }
                            }
                        }
                    },
                    samples: {
                        exploreMoreSamples: "Explorez plus d'échantillons."
                    }
                },
                twa: {
                    setup: {
                        skipURIs:
                            "Notez la propriété <1>skipURIs</1>. Cette propriété définit les pages Web " +
                            "de votre application qui ne doivent pas être sécurisées et ne nécessitent pas " +
                            "d'authentification. Plusieurs URI peuvent être définis à l'aide de valeurs <3>" +
                            "séparées par des virgules</3>."
                    }
                }
            }
        },
        branding: {
            confirmations: {
                revertBranding: {
                    assertionHint: "Veuillez confirmer votre action.",
                    content: "Cette action est irréversible et annulera définitivement vos préférences de marque.",
                    header: "Es-tu sûr?",
                    message:
                        "Si vous rétablissez les préférences de marque, vos clients commenceront à voir " +
                        "la marque {{ productName }} sur les flux de connexion. Veuillez procéder avec prudence."
                },
                unpublishBranding: {
                    assertionHint: "Veuillez confirmer votre action.",
                    enableContent: "Une fois ces préférences publiées, elles sont appliquées aux flux d'inscription des utilisateurs et à tous les flux de connexion (y compris la connexion multifacteur) de vos applications et modèles d'e-mail.",
                    disableContent: "Une fois ces préférences dépubliées, elles ne sont plus appliquées aux flux d'enregistrement des utilisateurs et à tous les flux de connexion (y compris la connexion multifacteur) de vos applications et modèles d'e-mail.",
                    header: "Êtes-vous sûr?",
                    enableMessage:
                        "Si vous activez les préférences de marque, vos utilisateurs commenceront à voir votre marque sur les flux de connexion. Veuillez confirmer.",
                    disableMessage:
                        "Si vous désactivez les préférences de marque, vos utilisateurs commenceront à voir " +
                        "{{ productName }} branding sur les flux de connexion. Veuillez confirmer."
                }
            },
            dangerZoneGroup: {
                header: "Zone dangereuse",
                revertBranding: {
                    actionTitle: "Revenir",
                    header: "Revenir à la valeur par défaut",
                    subheader:
                        "Une fois les préférences de marque rétablies, elles ne peuvent pas être récupérées " +
                        "et vos clients verront la marque par défaut de {{ productName }}."
                },
                unpublishBranding: {
                    actionTitle: "Inébranlable",
                    header: "Préférences de marque non publiées",
                    subheader: "Une fois ces préférences non publiées, elles ne sont plus appliquées aux flux d'enregistrement des utilisateurs et à tous les flux de connexion (y compris la connexion multi-facteurs) de vos applications, de mon portail de compte et de mes modèles de messagerie."
                }
            },
            forms: {
                advance: {
                    links: {
                        fields: {
                            common: {
                                validations: {
                                    invalid: "Veuillez saisir une URL valide"
                                }
                            },
                            cookiePolicyURL: {
                                hint: "Lien vers un document ou une page Web avec des informations détaillées sur tous les cookies utilisés par vos applications et le but de chacun d'eux.Vous pouvez utiliser des espaces réservés comme <1>{{lang}}</1>, <3>{{country}}</3>, ou <5>{{locale}}</5> pour personnaliser l'URL pour différentsrégions ou langues.",
                                label: "Politique de cookie",
                                placeholder: "https://myapp.com/{{locale}}/cookie-policy"
                            },
                            privacyPolicyURL: {
                                hint: "Lien vers une déclaration ou un document juridique qui indique comment votre organisation collecte, gère et traite les données de vos clients et visiteurs.Vous pouvez utiliser des espaces réservés comme <1>{{lang}}</1>, <3>{{country}}</3>, ou <5>{{locale}}</5> pour personnaliser l'URL pour différentsrégions ou langues.",
                                label: "politique de confidentialité",
                                placeholder: "https://myapp.com/{{locale}}/privacy-policy"
                            },
                            selfSignUpURL: {
                                hint: "Lien vers la page Web d'auto-inscription de votre organisation. Vous pouvez utiliser des espaces réservés comme <1>{{lang}}</1>, <3>{{country}}</3>, ou <5>{{locale}}</5> pour personnaliser l'URL pour différentsrégions ou langues.",
                                label: "Auto-inscription",
                                placeholder: "https://myapp.com/self-signup"
                            },
                            termsOfUseURL: {
                                hint: "Lien vers un accord que vos clients doivent accepter et respecter afin d'utiliser les applications ou d'autres services de votre organisation.Vous pouvez utiliser des espaces réservés comme <1>{{lang}}</1>, <3>{{country}}</3>, ou <5>{{locale}}</5> pour personnaliser l'URL pour différentsrégions ou langues.",
                                label: "Conditions d'utilisation",
                                placeholder: "https://myapp.com/{{locale}}/terms-of-service"
                            }
                        },
                        heading: "Liens"
                    }
                },
                design: {
                    layout: {
                        headings: {
                            fields: {
                                productTagline: {
                                    hint: "Ajoutez un slogan pour votre produit. "
                                        + "Celui-ci sera affiché sous le logo de votre produit.",
                                    label: "Texte du slogan du produit",
                                    placeholder: "Entrez un texte pour le slogan"
                                }
                            },
                            heading: "Slogan du produit"
                        },
                        images: {
                            logo: {
                                fields: {
                                    alt: {
                                        hint: "Ajoutez un texte alternatif pour représenter l'image."
                                            + " Il sera affiché lorsque l'image ne se charge pas.",
                                        label: "Texte alternatif de l'image latérale",
                                        placeholder: "Saisir le texte alternatif pour l'image latérale"
                                    },
                                    url: {
                                        hint: "Utilisez une image d'au moins <1>1 920 x 1 080 pixels</1>"
                                            + " et d'une taille inférieure à <3>1 mb</3> pour de meilleures"
                                            + " performances.",
                                        label: "URL de l'image latérale",
                                        placeholder: "https://myapp.com/placeholder.jpeg"
                                    }
                                },
                                heading: "Image latérale",
                                preview: "Aperçu"
                            }
                        },
                        variations: {
                            fields: {
                                centered: {
                                    imgAlt: "Disposition centrée",
                                    label: "Centrée"
                                },
                                "custom": {
                                    imgAlt: "Mise en page personnalisée",
                                    label: "Personnalisé"
                                },
                                "left-aligned": {
                                    imgAlt: "Mise en page alignée à gauche",
                                    label: "Aligné à gauche"
                                },
                                "left-image": {
                                    imgAlt: "Disposition de l'image de gauche",
                                    label: "Image de gauche"
                                },
                                "right-aligned": {
                                    imgAlt: "Mise en page alignée à droite",
                                    label: "Aligné à droite"
                                },
                                "right-image": {
                                    imgAlt: "Mise en page correcte de l'image",
                                    label: "Image droite"
                                }
                            }
                        }
                    },
                    theme: {
                        buttons: {
                            externalConnections: {
                                fields: {
                                    backgroundColor: {
                                        hint: "La couleur de la police des boutons de connexion externe tels que "
                                            + "les connexions sociales, les IdP tiers, etc.",
                                        label: "Couleur de l'arrière plan",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan pour les boutons " +
                                            "de connexions externes."
                                    },
                                    borderRadius: {
                                        hint: "Le rayon de la bordure du bouton des connexions externes.",
                                        label: "Rayon de bordure",
                                        placeholder: "Sélectionnez un rayon de bordure pour le bouton de" +
                                            "connexions externes."
                                    },
                                    fontColor: {
                                        hint: "La couleur de la police des boutons des connexions externes.",
                                        label: "Couleur de la police",
                                        placeholder: "Sélectionner une couleur de police pour le bouton des" +
                                            "connexions externes."
                                    }
                                },
                                heading: "Bouton de connexion externe"
                            },
                            heading: "Boutons",
                            primary: {
                                fields: {
                                    borderRadius: {
                                        hint: "Le rayon de bordure du bouton principal.",
                                        label: "Rayon de bordure",
                                        placeholder: "Sélectionnez un rayon de bordure de bouton principal"
                                    },
                                    fontColor: {
                                        hint: "La couleur de la police des boutons d'action principaux.",
                                        label: "Couleur de la police",
                                        placeholder: "Sélectionner une couleur de police de bouton principale"
                                    }
                                },
                                heading: "Bouton principal"
                            },
                            secondary: {
                                fields: {
                                    borderRadius: {
                                        hint: "Le rayon de bordure du bouton secondaire.",
                                        label: "Rayon de bordure",
                                        placeholder: "Sélectionnez un rayon de bordure de bouton secondaire"
                                    },
                                    fontColor: {
                                        hint: "La couleur de la police des boutons d'action secondaire.",
                                        label: "Couleur de la police",
                                        placeholder: "Sélectionner une couleur de police de bouton secondaire"
                                    }
                                },
                                heading: "Bouton secondaire"
                            }
                        },
                        colors: {
                            alerts: {
                                fields: {
                                    error: {
                                        hint: "Choisissez une couleur d'arrière-plan qui attire l'attention de l'utilisateur et représente les alertes d'erreur, telles que les défaillances du système ou les erreurs critiques.",
                                        label: "Couleur d'arrière-plan d'alerte d'erreur",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan d'alerte d'erreur"
                                    },
                                    info: {
                                        hint: "Choisissez une couleur d'arrière-plan qui complète la palette de couleurs et représente des alertes informatives, telles que des conseils ou des informations supplémentaires.",
                                        label: "Couleur d'arrière-plan d'alerte d'information",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan d'alerte d'information"
                                    },
                                    neutral: {
                                        hint: "Choisissez une couleur d'arrière-plan qui complète la palette de couleurs et représente des alertes neutres, telles que des informations non critiques ou des commentaires.",
                                        label: "Couleur d'arrière-plan d'alerte neutre",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan d'alerte neutre"
                                    },
                                    warning: {
                                        hint: "Choisissez une couleur d'arrière-plan qui se démarque et représente des alertes d'avertissement, telles que des risques potentiels ou des notifications importantes.",
                                        label: "Avertissement Couleur d'arrière-plan d'alerte",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan d'alerte d'avertissement"
                                    }
                                },
                                heading: "Alertes"
                            },
                            bodyBackground: {
                                fields: {
                                    main: {
                                        hint: "La couleur d'arrière-plan principale utilisée dans l'élément corporel de l'interface utilisateur.",
                                        label: "Couleur d'arrière-plan principal",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan du corps principal"
                                    }
                                },
                                heading: "Fond corporel"
                            },
                            fields: {
                                primaryColor: {
                                    hint: "La couleur principale qui est montrée dans les boutons d'action primaire, les hyperliens, etc.",
                                    label: "Couleur primaire",
                                    placeholder: "Sélectionnez une couleur primaire."
                                },
                                secondaryColor: {
                                    hint: "La couleur qui est montrée dans les boutons d'action secondaire comme les boutons d'annulation, etc.",
                                    label: "Couleur secondaire",
                                    placeholder: "Sélectionnez une couleur secondaire."
                                }
                            },
                            heading: "Palette de couleurs",
                            illustrations: {
                                fields: {
                                    accentColor1: {
                                        hint: "Il s'agit de la principale couleur d'accent utilisée pour les illustrations SVG.Choisissez une couleur qui attirera l'attention sur des éléments spécifiques de votre illustration et mettez en surbrillance les fonctionnalités clés de la conception de votre interface utilisateur.",
                                        label: "Couleur d'accent 1",
                                        placeholder: "Sélectionnez une couleur d'accent d'illustration"
                                    },
                                    accentColor2: {
                                        hint: "Il s'agit de la couleur d'accent secondaire utilisé pour les illustrations SVG.Choisissez une autre couleur d'accent qui s'harmonise avec votre esthétique de conception et améliore l'attrait visuel global de votre illustration SVG.",
                                        label: "Couleur d'accent 2",
                                        placeholder: "Sélectionnez une couleur d'accent secondaire d'illustration"
                                    },
                                    accentColor3: {
                                        hint: "Il s'agit de la couleur d'accent tertiaire utilisé pour les illustrations SVG.Choisissez une couleur d'accent qui s'harmonise avec votre esthétique de conception et améliore l'attrait visuel global de votre illustration SVG.",
                                        label: "Couleur d'accent 3",
                                        placeholder: "Sélectionnez une illustration Couleur d'accent tertiaire"
                                    },
                                    primaryColor: {
                                        hint: "Il s'agit de la couleur principale utilisée pour les illustrations SVG.Sélectionnez une couleur qui correspond à votre esthétique globale de conception et complète le schéma de couleurs de votre interface utilisateur.",
                                        label: "Couleur primaire",
                                        placeholder: "Sélectionnez une couleur primaire d'illustration"
                                    },
                                    secondaryColor: {
                                        hint: "Il s'agit de la couleur secondaire utilisée pour les illustrations SVG.Sélectionnez une couleur qui correspond à votre esthétique globale de conception et complète le schéma de couleurs de votre interface utilisateur.",
                                        label: "Couleur secondaire",
                                        placeholder: "Sélectionnez une couleur secondaire d'illustration"
                                    }
                                },
                                heading: "illustrations",
                                preview: "Aperçu"
                            },
                            outlines: {
                                fields: {
                                    main: {
                                        hint: "La couleur de contour par défaut utilisée pour des éléments tels que des cartes, des info-bulleurs, des listes déroulantes, etc.",
                                        label: "Couleur de contour par défaut",
                                        placeholder: "Sélectionnez une couleur de contour par défaut"
                                    }
                                },
                                heading: "Grandes lignes"
                            },
                            surfaceBackground: {
                                fields: {
                                    dark: {
                                        hint: "La variation plus sombre de la couleur d'arrière-plan qui est utilisée des éléments de surface tels que l'en-tête de l'application dans mon compte.",
                                        label: "Couleur d'arrière-plan de la surface foncée",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan de surface sombre"
                                    },
                                    inverted: {
                                        hint: "La variation inversée de la couleur d'arrière-plan qui utilise des éléments de surface tels que l'en-tête de l'application dans mon compte.",
                                        label: "Couleur d'arrière-plan de surface inversée",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan de surface inversée"
                                    },
                                    light: {
                                        hint: "La variation plus légère de la couleur d'arrière-plan qui est utilisée des éléments de surface comme les cartes, les fenêtres contextuelles, les panneaux, etc.",
                                        label: "Couleur d'arrière-plan de surface claire",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan de surface claire"
                                    },
                                    main: {
                                        hint: "La couleur d'arrière-plan principale qui utilise des éléments de surface comme les cartes, les fenêtres contextuelles, les panneaux, etc.",
                                        label: "Couleur d'arrière-plan de la surface principale",
                                        placeholder: "Sélectionnez une couleur d'arrière-plan de surface principale"
                                    }
                                },
                                heading: "Fond de surface"
                            },
                            text: {
                                fields: {
                                    primary: {
                                        hint: "La couleur du texte principale utilisée dans l'interface utilisateur.Sélectionnez une couleur qui offre un bon contraste avec la couleur d'arrière-plan et est facile à lire.",
                                        label: "Couleur du texte primaire",
                                        placeholder: "Sélectionnez une couleur de texte primaire"
                                    },
                                    secondary: {
                                        hint: "La couleur de texte secondaire utilisée dans l'interface utilisateur.Sélectionnez une couleur qui complète la couleur primaire et améliore la hiérarchie visuelle de votre conception.",
                                        label: "Couleur de texte secondaire",
                                        placeholder: "Sélectionnez une couleur de texte secondaire"
                                    }
                                },
                                heading: "Couleurs de texte"
                            }
                        },
                        font: {
                            fields: {
                                fontFamilyDropdown: {
                                    hint: "Choisissez une famille de polices dans la liste déroulante pour le texte "
                                        + "affiché sur les écrans de connexion.",
                                    label: "Famille de polices",
                                    placeholder: "Sélectionner une famille de polices"
                                },
                                fontFamilyInput: {
                                    hint: "Saisissez la famille de polices correspondant à celle saisie ci-dessus.",
                                    label: "Famille de polices",
                                    placeholder: "Entrez une famille de polices"
                                },
                                importURL: {
                                    hint: "Utilisez une URL pour importer une police personnalisée à partir d'un " +
                                        "service de police.",
                                    label: "URL d'importation de la police",
                                    placeholder: "Par exemple, https://fonts.googleapis.com/css2?family=Montserrat"
                                }
                            },
                            heading: "Police de caractère",
                            types: {
                                fromCDN: "Depuis CDN",
                                fromDefaults: "Depuis les paramètres par défaut du navigateur"
                            }
                        },
                        footer: {
                            fields: {
                                borderColor: {
                                    hint: "La couleur de la bordure supérieure du pied de page de l'écran de "
                                        + "connexion.",
                                    label: "Couleur de la bordure",
                                    placeholder: "Sélectionner une couleur de bordure de pied de page"
                                },
                                fontColor: {
                                    hint: "La couleur de la police du texte et des liens du copyright du pied de page.",
                                    label: "Couleur de la police",
                                    placeholder: "Sélectionner une couleur de police de pied de page"
                                }
                            },
                            heading: "Bas de page"
                        },
                        headings: {
                            fields: {
                                fontColor: {
                                    hint: "La couleur de la police des titres (h1, h2, h3, etc.) qui apparaissent " +
                                        "sur les pages de connexion.",
                                    label: "Couleur de la police",
                                    placeholder: "Sélectionner une couleur de police de titre"
                                }
                            },
                            heading: "Titres"
                        },
                        images: {
                            favicon: {
                                fields: {
                                    url: {
                                        hint:
                                            "Utilisez une image d'au moins <1>16x16 pixels</1> ou plus avec un " +
                                            "rapport hauteur/largeur de pixels carrés pour de meilleurs résultats. " +
                                            "S'il n'est pas défini, les valeurs par défaut de {{ productName }} " +
                                            "seront utilisées.",
                                        label: "URL de l'icône de favori",
                                        placeholder: "https://myapp.com/favicon.ico"
                                    }
                                },
                                heading: "Icône de favori",
                                preview: "Aperçu"
                            },
                            heading: "Images",
                            logo: {
                                fields: {
                                    alt: {
                                        hint:
                                            "Ajoutez une brève description écrite de l'image du logo à utiliser " +
                                            "lorsque l'image ne se charge pas et également pour le référencement " +
                                            "et l'accessibilité. S'il n'est pas défini, les valeurs par défaut " +
                                            "de {{ productName }} seront utilisées.",
                                        label: "Texte alternatif",
                                        placeholder: "Entrez un texte alternatif"
                                    },
                                    url: {
                                        hint:
                                            "Utilisez une image d'au moins <1>600x600 pixels</1> et d'une " +
                                            "taille inférieure à <3>1mb</3> pour de meilleures performances. " +
                                            "S'il n'est pas défini, les valeurs par défaut de {{ productName }} " +
                                            "seront utilisées.",
                                        label: "URL du logo",
                                        placeholder: "https://myapp.com/logo.png"
                                    }
                                },
                                heading: "Logo",
                                preview: "Aperçu"
                            },
                            myAccountLogo: {
                                fields: {
                                    alt: {
                                        hint: "Ajoutez une brève description de l'image de logo de mon compte à afficher lorsque l'image ne se charge pas et aussi pour le référencement et l'accessibilité.Si ce n'est pas défini, {{ productName }} Les défauts sont utilisés.",
                                        label: "Texte de logo alt de mon compte",
                                        placeholder: "Entrez un texte alt pour le logo de mon compte."
                                    },
                                    title: {
                                        hint: "Ajoutez un titre à afficher à côté de l'image du logo si nécessaire.Si ce n'est pas défini, {{ productName }} Les défauts sont utilisés.",
                                        label: "Titre du logo de mon compte",
                                        placeholder: "Entrez un titre pour le logo de mon compte."
                                    },
                                    url: {
                                        hint: "Utilisez une image au moins <1>250x50 pixels</1> et moins de <3>1mb</3> de taille pour de meilleures performances.Si ce n'est pas défini, {{ productName }} Les défauts sont utilisés.",
                                        label: "URL du logo de mon compte",
                                        placeholder: "https://myaccount.myapp.com/logo.png"
                                    }
                                },
                                heading: "Le logo de mon compte",
                                preview: "Aperçu"
                            }
                        },
                        inputs: {
                            fields: {
                                backgroundColor: {
                                    hint: "La couleur d'arrière-plan des champs de saisie à l'intérieur de la " +
                                        "boîte de connexion.",
                                    label: "Couleur de fond",
                                    placeholder: "Sélectionnez une couleur d'arrière-plan pour les entrées."
                                },
                                borderColor: {
                                    hint: "La couleur de la bordure des champs de saisie à l'intérieur de la " +
                                        "boîte de connexion.",
                                    label: "Couleur de la bordure",
                                    placeholder: "Sélectionnez une couleur de bordure pour les entrées."
                                },
                                borderRadius: {
                                    hint: "Le rayon de la bordure des champs de saisie à l'intérieur de la " +
                                        "boîte de connexion.",
                                    label: "Border Radius",
                                    placeholder: "Sélectionnez un rayon de bordure pour la zone de connexion."
                                },
                                fontColor: {
                                    hint: "La couleur de la police des champs de saisie à l'intérieur de la " +
                                        "boîte de connexion.",
                                    label: "Couleur de la police",
                                    placeholder: "Sélectionnez une couleur de police pour les entrées."
                                }
                            },
                            heading: "Contributions",
                            labels: {
                                fields: {
                                    fontColor: {
                                        hint: "La couleur de la police des étiquettes des champs de saisie " +
                                            "à l'intérieur de la boîte de connexion.",
                                        label: "Couleur de la police",
                                        placeholder: "Sélectionnez une couleur de police pour les étiquettes d'entrée."
                                    }
                                },
                                heading: "Étiquettes d'entrée"
                            }
                        },
                        loginBox: {
                            fields: {
                                backgroundColor: {
                                    hint: "La couleur d'arrière-plan de la boîte de connexion.",
                                    label: "Couleur de fond",
                                    placeholder: "Sélectionnez une couleur d'arrière-plan pour la boîte de connexion."
                                },
                                borderColor: {
                                    hint: "La couleur de la bordure de la boîte de connexion.",
                                    label: "Couleur de la bordure",
                                    placeholder: "Sélectionnez une couleur de bordure pour la zone de connexion."
                                },
                                borderRadius: {
                                    hint: "Le rayon de la bordure de la boîte de connexion.",
                                    label: "Border Radius",
                                    placeholder: "Sélectionnez un rayon de bordure pour la zone de connexion."
                                },
                                borderWidth: {
                                    hint: "La largeur de la bordure de la boîte de connexion.",
                                    label: "Largeur de la bordure",
                                    placeholder: "Sélectionnez une largeur de bordure pour la boîte de connexion."
                                },
                                fontColor: {
                                    hint: "La couleur de la police du texte qui se trouve à l'intérieur de la " +
                                        "boîte de connexion.",
                                    label: "Couleur de la police",
                                    placeholder: "Sélectionnez une couleur de police pour le texte de la zone " +
                                        "de connexion."
                                }
                            },
                            heading: "Boîte de connexion"
                        },
                        loginPage: {
                            fields: {
                                backgroundColor: {
                                    hint: "La couleur d'arrière-plan des écrans de connexion.",
                                    label: "Couleur de fond",
                                    placeholder: "Sélectionner une couleur d'arrière-plan de page"
                                },
                                fontColor: {
                                    hint: "La couleur de la police du contenu de la page.",
                                    label: "Couleur de la police",
                                    placeholder: "Sélectionner une couleur de police de page"
                                }
                            },
                            heading: "Page"
                        },
                        variations: {
                            fields: {
                                dark: {
                                    label: "Sombre"
                                },
                                light: {
                                    label: "Léger"
                                }
                            }
                        }
                    }
                },
                general: {
                    fields: {
                        displayName: {
                            hint:
                                "Nom de l'organisation qui apparaît aux utilisateurs. S'il n'est pas défini, " +
                                "les valeurs par défaut de {{ productName }} seront utilisées.",
                            label: "Nom d’affichage de l’organisation",
                            placeholder: "Entrer un nom d'affichage"
                        },
                        supportEmail: {
                            hint:
                                "TEmail qui apparaît sur les pages d'erreur et dans les endroits où une " +
                                "assistance serait requise pour les clients. S'il n'est pas défini, " +
                                "les valeurs par défaut de {{ productName }} seront utilisées.",
                            label: "Email du contact",
                            placeholder: "Entrez une adresse e-mail de contact"
                        }
                    }
                }
            },
            notifications: {
                delete: {
                    genericError: {
                        description:
                            "Une erreur s'est produite lors de la suppression des préférences de marque " +
                            "pour {{ tenant }}.",
                        message: "Impossible de supprimer les préférences de marque"
                    },
                    invalidStatus: {
                        description:
                            "Une erreur s'est produite lors de la suppression des préférences de marque " +
                            "pour {{ tenant }}.",
                        message: "Impossible de supprimer les préférences de marque"
                    },
                    notConfigured: {
                        description: "Aucune préférence de marque trouvée pour {{ tenant }}.",
                        message: "Impossible de supprimer les préférences de marque"
                    },
                    success: {
                        description: "Les préférences de marque ont été rétablies avec succès pour {{ tenant }}.",
                        message: "Rétablissement réussi"
                    },
                    successWaiting: {
                        description: "Retour des préférences de marque pour {{ tenant }}."+
                            "Il peut prendre un certain temps que les changements soient reflétés.",
                        message: "Retour des préférences de marque"
                    },
                    successWaitingAlert: {
                        description: "Retour des préférences de marque pour {{ tenant }}."+
                            "Notez que cela peut prendre jusqu'à 10 minutes pour que les modifications soient reflétées.",
                        message: "Retour des préférences de marque"
                    }
                },
                fetch: {
                    customLayoutNotFound: {
                        description: "Il n'y a pas de mise en page personnalisée déployée pour {{ tenant }}.",
                        message: "Impossible d'activer la mise en page personnalisée"
                    },
                    genericError: {
                        description:
                            "Une erreur s'est produite lors de l'obtention des préférences de marque " +
                            "pour {{ tenant }}.",
                        message: "Impossible d'obtenir les préférences de marque"
                    },
                    invalidStatus: {
                        description:
                            "Une erreur s'est produite lors de l'obtention des préférences de marque " +
                            "pour {{ tenant }}.",
                        message: "Impossible d'obtenir les préférences de marque"
                    },
                    tenantMismatch: {
                        description:
                            "Une erreur s'est produite lors de l'obtention des préférences de marque pour " +
                            "{{ tenant }}.",
                        message: "Impossible d'obtenir les préférences de marque"
                    }
                },
                update: {
                    genericError: {
                        description:
                            "Une erreur s'est produite lors de la mise à jour des préférences de marque " +
                            "pour {{ tenant }}.",
                        message: "Erreur de mise à jour"
                    },
                    invalidStatus: {
                        description:
                            "Une erreur s'est produite lors de la mise à jour des préférences de" +
                            " marque pour {{ tenant }}.",
                        message: "Erreur de mise à jour"
                    },
                    success: {
                        description: "Préférence de marque mise à jour avec succès pour {{ tenant }}.",
                        message: "Mise à jour réussie"
                    },
                    successWaiting: {
                        description: "Mise à jour des préférences de marque pour {{ tenant }}."+
                            "Il peut prendre un certain temps que les changements soient reflétés.",
                        message: "Mise à jour des préférences de marque"
                    },
                    successWaitingAlert: {
                        description: "Mise à jour des préférences de marque pour {{ teant }}."+
                            "Notez que cela peut prendre jusqu'à 10 minutes pour que les modifications soient reflétées.",
                        message: "Mise à jour des préférences de marque"
                    },
                    tenantMismatch: {
                        description:
                            "Une erreur s'est produite lors de la mise à jour des préférences de " +
                            "marque pour {{ tenant }}.",
                        message: "Erreur de mise à jour"
                    }
                }
            },
            pageHeader: {
                description:
                    "Personnalisez les interfaces utilisateur destinées aux consommateurs dans " +
                    "les applications de votre organisation.",
                title: "l'image de marque"
            },
            publishToggle: {
                hint: "Activer/Désactiver les modifications",
                label: "Passez en direct",
                enabled: "Activé",
                disabled: "Handicapé"
            },
            tabs: {
                advance: {
                    label: "Avance"
                },
                design: {
                    label: "Conception",
                    sections: {
                        imagePreferences: {
                            description: "Ajoutez des images personnalisées pour correspondre"
                                + " au thème de votre organisation.",
                            heading: "Préférences d'image"
                        },
                        layoutVariation: {
                            description: "Sélectionnez une mise en page pour vos interfaces. Vous pouvez personnaliser "
                                + "davantage ces mises en page en mettant à jour les préférences de thème.",
                            heading: "Disposition",
                            status: "NOUVELLE"
                        },
                        themePreferences: {
                            description: "En fonction de la variante de thème sélectionnée ci-dessus, "
                                + "commencez à personnaliser le éléments suivants pour correspondre "
                                + "aux directives de votre organisation.",
                            heading: "Préférences de thème"
                        },
                        themeVariation: {
                            description: "Sélectionnez un thème de couleur pour vos interfaces. Vous pouvez " +
                                "personnaliser davantage ces thèmes en utilisant les options ci-dessous. " +
                                "Par défaut, le thème clair (thème {{ productName }}) est sélectionné.",
                            heading: "Variation de thème"
                        }
                    }
                },
                general: {
                    customRequest: {
                        description:
                            "Si vous avez besoin de personnalisations supplémentaires, veuillez nous " +
                            "contacter à <1>{{ supportEmail }}</>",
                        heading: "Besoin de plus de personnalisations ?"
                    },
                    label: "Général"
                },
                preview: {
                    disclaimer:
                        "Une fois ces préférences publiées, elles sont appliquées aux flux d'enregistrement" +
                        " des utilisateurs et à tous les flux de connexion (y compris la connexion multifacteur) " +
                        "de vos applications et aux modèles d'e-mail.",
                    errors: {
                        layout: {
                            notFound: {
                                subTitle: "La ressource que vous recherchez n'est pas disponible.",
                                title: "Ressource introuvable"
                            },
                            notFoundWithSupport: {
                                description: "Besoin d'une mise en page entièrement personnalisée pour "
                                    + "votre organisation? Contactez-nous à <1>{{ supportEmail }}</1>.",
                                subTitle: "Vous n'avez pas encore déployé de mise en page personnalisée.",
                                title: "Mise en page personnalisée introuvable"
                            }
                        }
                    },
                    info: {
                        layout: {
                            activatedMessage: {
                                description: "Vous pouvez désormais intégrer une mise en page personnalisée pour "
                                    + "les pages de connexion, d'enregistrement et de récupération. Reportezvous "
                                    + "à notre documentation pour des instructions détaillées.",
                                subTitle: "La mise en page personnalisée a été activée avec succès.",
                                title: "Mise en page personnalisée"
                            }
                        }
                    },
                    label: "Aperçu"
                }
            }
        },
        emailProviders: {
            configureEmailTemplates: "Configurer les modèles d'e-mail",
            heading: "Fournisseur de messagerie personnalisé",
            subHeading: "Configurez des serveurs SMTP personnalisés pour envoyer des e-mails avec votre propre adresse e-mail.",
            description: "Configurez les paramètres du fournisseur de messagerie en fonction de votre serveur SMTP.",
            note: "Le fournisseur de messagerie de la super-organisation ne peut être configuré que via <1>deployment.toml</1>.",
            info: "Vous pouvez personnaliser le contenu des e-mails à l'aide de <1>Modèles d'e-mails</1>.",
            updateButton: "Mise à jour",
            sendTestMailButton: "Envoyer un e-mail test",
            goBack: "Revenir à E-mail et SMS",
            confirmationModal: {
                assertionHint: "Veuillez confirmer votre action.",
                content: "Si vous supprimez cette configuration, les e-mails seront envoyés à partir de l'adresse e-mail Asgardeo. " +
                    "Veuillez procéder avec prudence.",
                header: "Es-tu sûr?",
                message: "Cette action est irréversible et supprimera définitivement les configurations du fournisseur de messagerie."
            },
            dangerZoneGroup: {
                header: "Zone dangereuse",
                revertConfig: {
                    heading: "Rétablir les configurations",
                    subHeading: "Cette action rétablira les configurations du serveur de messagerie à la configuration par défaut d'Asgardeo. " +
                        "Si vous revenez, vous continuerez à recevoir des e-mails du domaine Asgardeo.",
                    actionTitle: "Revenir"
                }
            },
            form: {
                smtpServerHost: {
                    label: "Hôte du serveur",
                    placeholder: "Entrez un hôte de serveur",
                    hint: "L'hôte du serveur est généralement fourni par votre fournisseur de services de messagerie et commence généralement par " +
                        "<1>smtp</1>, suivi du nom de domaine du fournisseur de services de messagerie."
                },
                smtpPort: {
                    label: "Port de serveur",
                    placeholder: "Entrez un numéro de port",
                    hint: "Le port SMTP par défaut est <1>25</1>, mais certains fournisseurs de services de messagerie peuvent utiliser d'autres ports " +
                        "tels que <3>587</3>. Vérifiez auprès de votre fournisseur de services de messagerie le port SMTP correct."
                },
                fromAddress: {
                    label: "De l'adresse",
                    placeholder: "entrez une adresse email",
                    hint: "Pour des raisons de sécurité, nous prenons actuellement en charge le port <1>587</1> uniquement."
                },
                replyToAddress: {
                    label: "Répondre à l'adresse",
                    placeholder: "entrez une adresse email",
                    hint: "L'adresse de réponse est utilisée pour spécifier l'adresse e-mail que les destinataires doivent " +
                        "utiliser s'ils souhaitent répondre à votre message. Il peut s'agir d'une adresse e-mail de support client."
                },
                userName: {
                    label: "Nom d'utilisateur",
                    placeholder: "Entrez un nom d'utilisateur",
                    hint: "Le nom d'utilisateur SMTP est généralement le même que votre adresse e-mail. Cependant, certains fournisseurs de " +
                        "services de messagerie peuvent vous demander d'utiliser un nom d'utilisateur différent pour vos paramètres SMTP."
                },
                password: {
                    label: "Mot de passe",
                    placeholder: "Entrer un mot de passe",
                    hint: "Le mot de passe SMTP est un identifiant de sécurité utilisé pour authentifier et vérifier votre " +
                        "identité lors de l'envoi d'e-mails via le serveur SMTP."
                },
                displayName: {
                    label: "Afficher un nom",
                    placeholder: "Entrer un nom d'affichage",
                    hint: "Le nom d'affichage est utilisé pour spécifier le nom que les destinataires verront dans leur " +
                        "boîte de réception lorsqu'ils recevront votre message. Il peut s'agir du nom de votre organisation."
                },
                validations: {
                    required: "Ce champ ne peut pas être vide",
                    portInvalid: "Le numéro de port est invalide",
                    emailInvalid: "L'adresse mail est invalide"
                }
            },
            notifications: {
                getConfiguration: {
                    error: {
                        message: "Erreur est survenue",
                        description: "Erreur lors de la récupération des configurations du fournisseur de messagerie."
                    }
                },
                deleteConfiguration: {
                    error: {
                        message: "Erreur est survenue",
                        description: "Erreur lors de la suppression des configurations du fournisseur de messagerie."
                    },
                    success: {
                        message: "Configurations supprimées avec succès",
                        description: "Les configurations du fournisseur de messagerie ont bien été supprimées."
                    }
                },
                updateConfiguration: {
                    error: {
                        message: "Erreur est survenue",
                        description: "Erreur lors de la mise à jour des configurations du fournisseur de messagerie."
                    },
                    success: {
                        message: "Configurations mises à jour avec succès",
                        description: "Mise à jour réussie des configurations du fournisseur de messagerie."
                    }
                }
            }
        },
        notificationChannel: {
            heading: "Fournisseurs SMS/e-mail",
            title: "Fournisseurs SMS/e-mail",
            description: "Configurez les fournisseurs SMS et Email pour votre organisation."
        },
        smsProviders: {
            heading: "Fournisseur de SMS personnalisé",
            subHeading: "Configurez un fournisseur SMS personnalisé pour envoyer des SMS à vos utilisateurs.",
            description: "Configurez les paramètres du fournisseur SMS en fonction de votre fournisseur SMS.",
            info: "Vous pouvez personnaliser le contenu du SMS à l'aide des <1>Modèles de SMS</1>.",
            updateButton: "Mise à jour",
            sendTestSMSButton: "Envoyer un SMS test",
            goBack: "Revenir à E-mail et SMS",
            confirmationModal: {
                assertionHint: "Veuillez confirmer votre action.",
                content: "Si vous supprimez cette configuration, vous ne recevrez pas de SMS." +
                    "Veuillez procéder avec prudence.",
                header: "Es-tu sûr?",
                message: "Cette action est irréversible et supprimera définitivement les configurations du fournisseur SMS."
            },
            dangerZoneGroup: {
                header: "Zone dangereuse",
                revertConfig: {
                    heading: "Supprimer les configurations",
                    subHeading: "Cette action supprimera les configurations du fournisseur de SMS. Une fois supprimé, vous ne recevrez plus de SMS.",
                    actionTitle: "Supprimer"
                }
            },
            form: {
                twilio: {
                    subHeading: "Paramètres Twilio",
                    accountSID: {
                        label: "SID du compte Twilio",
                        placeholder: "Entrez le SID du compte Twilio",
                        hint: "Identifiant de chaîne de compte Twilio qui fait office de nom d'utilisateur pour le compte"
                    },
                    authToken: {
                        label: "Jeton d'authentification Twilio",
                        placeholder: "Entrez le jeton d'authentification Twilio",
                        hint: "Le jeton d'accès généré par le serveur d'authentification Twilio."
                    },
                    sender: {
                        label: "Expéditrice",
                        placeholder: "Entrez le numéro de téléphone de l'expéditeur",
                        hint: "Numéro de téléphone de l'expéditeur."
                    },
                    validations: {
                        required: "Ce champ ne peut pas être vide"
                    }
                },
                vonage: {
                    subHeading: "Paramètres Vonage",
                    accountSID: {
                        label: "Clé API Vonage",
                        placeholder: "Entrez la clé API Vonage",
                        hint: "Clé API Vonage qui fait office de nom d'utilisateur pour le compte."
                    },
                    authToken: {
                        label: "Secret de l'API Vonage",
                        placeholder: "Entrez le secret de l'API Vonage",
                        hint: "Le secret API généré par le serveur d'authentification Vonage."
                    },
                    sender: {
                        label: "Expéditrice",
                        placeholder: "Entrez le numéro de téléphone de l'expéditeur",
                        hint: "Numéro de téléphone de l'expéditeur."
                    },
                    validations: {
                        required: "Ce champ ne peut pas être vide"
                    }
                },
                custom: {
                    subHeading: "Paramètres personnalisés",
                    providerName: {
                        label: "Nom du fournisseur SMS",
                        placeholder: "Entrez le nom du fournisseur SMS",
                        hint: "Le nom du fournisseur SMS."
                    },
                    providerUrl: {
                        label: "URL du fournisseur SMS",
                        placeholder: "Entrez l'URL du fournisseur de SMS",
                        hint: "L'URL du fournisseur SMS."
                    },
                    httpMethod: {
                        label: "Méthode HTTP",
                        placeholder: "POST",
                        hint: "La méthode HTTP de la requête API utilisée pour l'envoi du SMS."
                    },
                    contentType: {
                        label: "Type de contenu",
                        placeholder: "JSON",
                        hint: "Le type de contenu de la requête API utilisée pour l'envoi du SMS."
                    },
                    headers: {
                        label: "En-têtes",
                        placeholder: "Saisir les en-têtes",
                        hint: "En-têtes à inclure dans la requête API d'envoi de SMS."
                    },
                    payload: {
                        label: "Charge utile",
                        placeholder: "Entrez la charge utile",
                        hint: "Charge utile de la requête API SMS."
                    },
                    key: {
                        label: "Clé d'authentification du fournisseur SMS",
                        placeholder: "Entrez la clé d'authentification du fournisseur SMS",
                        hint: "La clé d'authentification du fournisseur SMS."
                    },
                    secret: {
                        label: "Secret d'authentification du fournisseur SMS",
                        placeholder: "Entrez le secret d'authentification du fournisseur SMS",
                        hint: "Le secret d'authentification du fournisseur SMS."
                    },
                    sender: {
                        label: "Expéditrice",
                        placeholder: "Entrez le numéro de téléphone de l'expéditeur",
                        hint: "Numéro de téléphone de l'expéditeur."
                    },
                    validations: {
                        required: "Ce champ ne peut pas être vide",
                        methodInvalid: "La méthode HTTP n'est pas valide",
                        contentTypeInvalid: "Le type de contenu n'est pas valide"
                    }
                }
            },
            notifications: {
                getConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error retrieving the sms provider configurations."
                    }
                },
                deleteConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error deleting the sms provider configurations."
                    },
                    success: {
                        message: "Revert Successful",
                        description: "Successfully reverted the sms provider configurations."
                    }
                },
                updateConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error updating the sms provider configurations."
                    },
                    success: {
                        message: "Update Successful",
                        description: "Successfully updated the sms provider configurations."
                    }
                }
            }
        },
        identityProviders: {
            apple: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion Apple",
                        subHeading: "Sélectionnez une application pour configurer la connexion Apple."
                    },
                    connectApp: {
                        description:
                            "Ajouter l'authentificateur <1>Apple</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion Apple",
                    subHeading:
                        "Apple est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer la " +
                                "connexion Apple.",
                            heading: "Sélectionnez l'application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Allez dans l'onglet <1>Méthode de connexion</1> et cliquez sur " +
                                "<3>Ajouter une connexion Apple</3> pour configurer un flux de connexion Apple.",
                            heading: "Sélectionnez <1>Démarrer avec la configuration par défaut</1>"
                        }
                    }
                }
            },
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter un e-mail OTP",
                        subHeading: "Sélectionnez une application pour configurer la connexion OTP par e-mail."
                    },
                    connectApp: {
                        description:
                            "Ajoutez l'<1>Email OTP</1> à l'<3>Étape 2</3> dans la section <5>Méthode de " +
                            "connexion </5> de votre <7>application</7>."
                    },
                    heading: "Guide de configuration de l'OTP par e-mail",
                    subHeading:
                        "Suivez les instructions ci-dessous pour configurer Email OTP en tant que facteur " +
                        "dans votre flux de connexion.",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer la " +
                                "connexion OTP par e-mail.",
                            heading: "Sélectionnez l'application"
                        },
                        selectEmailOTP: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur <3>Ajouter Email OTP " +
                                "comme deuxième facteur</3> pour configurer un flux Email OTP de base.",
                            heading: "Sélectionnez <1>Ajouter Email OTP comme deuxième facteur</1>"
                        }
                    }
                }
            },
            smsOTP: {
                settings: {
                    smsOtpEnableDisableToggle: {
                        labelEnable: "Activer SMS OTP",
                        labelDisable: "Désactiver SMS OTP "
                    },
                    enableRequiredNote: {
                        message: "Asgardeo publie des événements sur Choreo enable SMS OTP, où les " +
                            "webhooks Choreo seront utilisés pour s'intégrer à plusieurs services afin de publier " +
                            "des notifications OTP Suivez <1>Ajouter un guide SMS OTP</1> ABC pour configurer les " +
                            "webhooks Choreo pour les événements de publication "
                    },
                    errorNotifications: {
                        notificationSendersRetrievalError: {
                            message: "Erreur est survenue",
                            description: "Une erreur s'est produite lors de la tentative d'obtention de la " +
                                "configuration SMS OTP."
                        },
                        smsPublisherCreationError: {
                            message: "Erreur est survenue",
                            description: "Une erreur s'est produite lors de la tentative d'activation de SMS OTP."
                        },
                        smsPublisherDeletionError: {
                            generic: {
                                message: "Erreur est survenue",
                                description: "Une erreur s'est produite lors de la tentative de désactivation de " +
                                    "SMS OTP."
                            },
                            activeSubs: {
                                message: "Erreur est survenue",
                                description: "Une erreur s'est produite lors de la tentative de désactivation de SMS " +
                                    "OTP. SMS Publisher a des abonnements actifs."
                            },
                            connectedApps: {
                                message: "Erreur est survenue",
                                description: "Une erreur s'est produite lors de la tentative de désactivation de " +
                                    "SMS OTP. Il existe des applications utilisant cette connexion."
                            }
                        }
                    }
                },
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter un SMS OTP",
                        subHeading: "Sélectionnez une application pour configurer la connexion OTP par SMS."
                    },
                    connectApp: {
                        description:
                            "Ajoutez l'<1>SMS OTP</1> à l'<3>Étape 2</3> dans la section <5>Méthode de " +
                            "connexion </5> de votre <7>application</7>."
                    },
                    heading: "Guide de configuration de l'OTP par SMS",
                    subHeading:
                        "Suivez les instructions ci-dessous pour configurer SMS OTP en tant que facteur " +
                        "dans votre flux de connexion.",
                    steps: {
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer la " +
                                "connexion OTP par SMS.",
                            heading: "Sélectionnez l'application"
                        },
                        selectSMSOTP: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur <3>Ajouter SMS OTP " +
                                "comme deuxième facteur</3> pour configurer un flux SMS OTP de base.",
                            heading: "Sélectionnez <1>Ajouter SMS OTP comme deuxième facteur</1>"
                        }
                    }
                }
            },
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion Facebook",
                        subHeading: "Sélectionnez une application pour configurer la connexion Facebook."
                    },
                    connectApp: {
                        description:
                            "Ajouter l'authentificateur <1>Facebook</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion Facebook",
                    subHeading:
                        "Facebook est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer la " +
                                "connexion Facebook.",
                            heading: "Sélectionnez l'application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Allez dans l'onglet <1>Méthode de connexion</1> et cliquez sur <3>Démarrer " +
                                "avec la configuration par défaut</3>.",
                            heading: "Sélectionnez <1>Démarrer avec la configuration par défaut</1>"
                        }
                    }
                }
            },
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion GitHub",
                        subHeading: "Sélectionnez une application pour configurer la connexion GitHub."
                    },
                    connectApp: {
                        description:
                            "Ajouter l'authentificateur <1>GitHub</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion GitHub",
                    subHeading:
                        "Github est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer la connexion Github.",
                            heading: "Sélectionnez l'application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Allez dans l'onglet <1>Méthode de connexion</1> et cliquez sur <3>Démarrer " +
                                "avec la configuration par défaut</3>.",
                            heading: "Sélectionnez <1>Démarrer avec la configuration par défaut</1>"
                        }
                    }
                }
            },
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion Google",
                        subHeading: "Sélectionnez une application pour configurer la connexion Google."
                    },
                    connectApp: {
                        description:
                            "Ajouter l'authentificateur <1>Google</1> à l'<3>Étape 1</3> de la <5>" +
                            "Méthode de connexion</5> section de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion Google",
                    subHeading:
                        "Google est maintenant prêt à être utilisé comme " +
                        "option de connexion pour votre applications.",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer la connexion Google.",
                            heading: "Sélectionnez l'application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur <3>Ajouter une " +
                                "connexion Google</3> pour configurer un flux de connexion Google.",
                            heading: "Sélectionnez <1>Ajouter une connexion Google</1>"
                        }
                    }
                }
            },
            microsoft: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion Microsoft",
                        subHeading: "Sélectionnez une application pour configurer la connexion Microsoft."
                    },
                    connectApp: {
                        description:
                            "Ajoutez l'authentificateur <1>Microsoft</1> à l'<3>étape 1</3> de la section" +
                            "<5>Méthode de connexion </5> de votre <7>application</7>."
                    },
                    heading: "Ajouter une connexion Microsoft",
                    subHeading: "Microsoft est maintenant prêt à être utilisé comme option de connexion pour" +
                        "vos applications",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnalisez le flux"
                        },
                        selectApplication: {
                            content: "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer" +
                                "la connexion Microsoft.",
                            heading: "Sélectionnez l'application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur" +
                                "<3>Démarrer avec la configuration par défaut</3>.",
                            heading: "Sélectionnez <1>Démarrer avec la configuration par défaut</1>"
                        }
                    }
                }
            },
            hypr: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion HYPR",
                        subHeading: "Sélectionnez une application pour configurer la connexion HYPR."
                    },
                    connectApp: {
                        description:
                            "Ajoutez l'authentificateur <1>HYPR</1> à l'<3>étape 1</3> de la section" +
                            "<5>Méthode de connexion </5> de votre <7>application</7>."
                    },
                    heading: "Ajouter une connexion HYPR",
                    subHeading: "HYPR est maintenant prêt à être utilisé comme option de connexion pour" +
                        "vos applications",
                    steps: {
                        configureLogin: {
                            heading: "Configurer le flux de connexion",
                            addHypr: "Ajoutez l'authentificateur HYPR à l'étape 1 en cliquant sur le bouton <1>Ajouter une authentification</1>.",
                            conditionalAuth:
                                "Activez l'<1>authentification conditionnelle</1> en basculant la bascule et ajoutez le " +
                                "script d'authentification conditionnelle suivant.",
                            update: "Cliquez sur <1>Mettre à jour</1> pour confirmer."
                        },
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnalisez le flux"
                        },
                        selectApplication: {
                            content: "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer" +
                                "la connexion HYPR.",
                            heading: "Sélectionnez l'application"
                        },
                        selectDefaultConfig: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur" +
                                "<3>Démarrer avec la configuration par défaut</3>.",
                            heading: "Sélectionnez <1>Démarrer avec la configuration par défaut</1>"
                        }
                    }
                }
            },
            siwe: {
                forms: {
                    authenticatorSettings: {
                        callbackUrl: {
                            hint: "L'ensemble des URI de redirection spécifiés comme valides pour " +
                                "le serveur OIDC hébergé.",
                            label: "URL de rappel d'autorisation",
                            placeholder: "Entrez l'URL de rappel d'autorisation.",
                            validations: {
                                required: "L'URL de rappel d'autorisation est un champ obligatoire."
                            }
                        },
                        clientId: {
                            hint: "L'<1>identifiant client</1> que vous avez reçu de " +
                                "<2>oidc.signinwithethereum.org</2> pour votre client OIDC.",
                            label: "Identifiant client",
                            placeholder: "Entrez l'ID client du client OIDC.",
                            validations: {
                                required: "L'ID client est un champ obligatoire."
                            }
                        },
                        clientSecret: {
                            hint: "Le <1>secret client</1> que vous avez reçu <2>oidc.signinwithethereum.org</2>" +
                                "pour votre client OIDC.",
                            label: "Secret client",
                            placeholder: "Entrez le secret client du client OIDC.",
                            validations: {
                                required: "La clé secrète du client est un champ obligatoire."
                            }
                        },
                        scopes: {
                            heading: "Périmètres",
                            hint: "Le type d'accès fourni aux applications connectées pour accéder aux données" +
                                "depuis le portefeuille Ethereum.",
                            list: {
                                openid: {
                                    description: "Accorde un accès en lecture à l'e-mail, aux adresses," +
                                        "au téléphone, etc. d'un utilisateur."
                                },
                                profile: {
                                    description: "Accorde l'accès pour lire les données du profil d'un utilisateur."
                                }
                            }
                        }
                    }
                },
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion avec Ethereum",
                        subHeading: "Sélectionnez une application pour configurer la connexion avec Ethereum."
                    },
                    connectApp: {
                        description:
                            "Ajoutez l'authentificateur <1>Connexion avec Ethereum</1> à l'" +
                            "<3>Étape 1</3> de la <5>Méthode de connexion </5> de votre <7>candidature</7>."
                    },
                    heading: "Ajouter une connexion avec Ethereum",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnalisez le flux"
                        },
                        selectApplication: {
                            content: "Choisissez l'<1>application</1> pour laquelle vous souhaitez " +
                                "configurer la connexion avec Ethereum.",
                            heading: "Sélectionner une application"
                        },
                        selectDefaultConfig: {
                            content: "Allez dans l'onglet <1>Méthode de connexion</1> et cliquez sur" +
                                "<3>Commencer par défaut paramétrage</3>.",
                            heading: "Sélectionnez <1>Démarrer avec la configuration par défaut</1>"
                        }
                    },
                    subHeading: "Se connecter avec Ethereum est maintenant prêt à être utilisé comme" +
                        " option de connexion pour votre demandes."
                },
                wizardHelp: {
                    clientId: {
                        description: "Fournissez l'<1>identifiant client</1> que vous avez reçu de " +
                            "<2>oidc.signinwithethereum.org</2> pour votre client OIDC.",
                        heading: "identité du client"
                    },
                    clientSecret: {
                        description: "Fournissez le <1>Secret client</1> que vous avez reçu de " +
                            "<2>oidc.signinwithethereum.org</2> pour votre client OIDC.",
                        heading: "Secret client"
                    },
                    heading: "Aider",
                    name: {
                        connectionDescription: "Fournissez un nom unique pour la connexion.",
                        heading: "Nom",
                        idpDescription: "Fournissez un nom unique pour le fournisseur d'identité."
                    },
                    preRequisites: {
                        clientRegistrationDocs: "Voir le guide de configuration du client OIDC.",
                        configureClient: "Si vous souhaitez démarrer rapidement, utilisez la commande <1>curl</1> suivante pour enregistrer le client.",
                        configureRedirectURI: "L'URL suivante doit être définie comme <1>URI de redirection</1>.",
                        getCredentials: "Avant de commencer, enregistrez un <1>client OIDC</1> à l'aide de l'enregistrement client OIDC de <2>oidc.signinwithethereum.org</2>, et obtenez un <3>ID client et secret</3 >.",
                        heading: "Prérequis"
                    },
                    subHeading: "Utilisez le guide ci-dessous"
                }
            },
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter TOTP",
                        subHeading: "Sélectionnez une application pour configurer la connexion TOTP."
                    },
                    heading: "Guide de configuration TOTP",
                    steps: {
                        customizeFlow: {
                            content: "Continuer à configurer le flux de connexion selon les besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer " +
                                "la connexion TOTP.",
                            heading: "Sélectionner l'application"
                        },
                        selectTOTP: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur <3>Ajouter OTP " +
                                "comme deuxième facteur</3> pour configurer un flux TOTP de base.",
                            heading: "Sélectionnez <1>Ajouter TOTP comme deuxième facteur</1>"
                        }
                    },
                    subHeading:
                        "Suivez les instructions ci-dessous pour configurer TOTP en tant que facteur " +
                        "dans votre flux de connexion."
                }
            },
            fido: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion par mot de passe",
                        subHeading: "Sélectionnez une application pour configurer la connexion par mot de passe."
                    },
                    heading: "Guide de configuration du mot de passe",
                    passkeys: {
                        docLinkText: "Clé d'accès FIDO",
                        content:
                            "Passkey fournit une connexion sans mot de passe simple et sécurisée pour vos " +
                            "applications qui survit à la perte de l'appareil et fonctionne sur toutes les " +
                            "plates-formes. Vous pouvez essayer l'authentification par mot de passe sur " +
                            "Asgardeo avec \"Passkey\".",
                        heading: "Authentification FIDO avec mot de passe"
                    },
                    steps: {
                        customizeFlow: {
                            content: "Continuer à configurer le flux de connexion selon les besoins.",
                            heading: "Personnaliser le flux"
                        },
                        selectApplication: {
                            content:
                                "Choisissez l'<1>application</1> pour laquelle vous souhaitez configurer " +
                                "la connexion par mot de passe.",
                            heading: "Sélectionner l'application"
                        },
                        selectFIDO: {
                            content:
                                "Accédez à l'onglet <1>Méthode de connexion</1> et cliquez sur " +
                                "<3>Ajouter une connexion par clé d'accès</3> pour configurer " +
                                " un flux de clé d'accès de base.",
                            heading: "Sélectionnez <1>Ajouter une connexion par mot de passe</1>."
                        },
                        configureParameters: {
                            heading: "Configurer les options de clé d'accès",
                            content: {
                                parameters: {
                                    progressiveEnrollment: {
                                        description: "Activez cette option pour permettre aux utilisateurs " +
                                        "de s'inscrire pour obtenir un mot de passe lors de la connexion.",
                                        label: "Inscription progressive du mot de passe:",
                                        note: "Lorsque la clé d'accès est définie comme <1>première option de facteur</1>, " +
                                        "les utilisateurs doivent ajouter un <3>script adaptatif</3> pour vérifier l'identité" +
                                        " de l'utilisateur avant l'inscription de la clé d'accès. Pour inclure le script, les " +
                                        "utilisateurs peuvent utiliser le modèle <5>d'inscription progressive des</5> clés " +
                                        "d'accès disponible dans l'onglet <7>Méthode de connexion<7> de l'application."
                                    },
                                    usernamelessAuthentication: {
                                        description: "L'activation de cette fonctionnalité permet aux " +
                                        "utilisateurs de se connecter avec un mot de passe sans saisir " +
                                        "de nom d'utilisateur, créant ainsi une expérience de " +
                                        "connexion plus rationalisée.",
                                        label: "Authentification sans nom d'utilisateur:"
                                    }
                                },
                                steps: {
                                    info: "Pour configurer, veuillez suivre les étapes ci-dessous:",
                                    1: "Accédez à la zone <1>Connexions</1>.",
                                    2: "Recherchez et sélectionnez la connexion <1>Passkey</1>.",
                                    3: "Accédez à l'onglet <1>Paramètres</1>."
                                }
                            }
                        }
                    },
                    subHeading:
                        "Suivez les instructions ci-dessous pour configurer la connexion par mot de " +
                        "passe dans votre flux de connexion."
                }
            },
            magicLink: {
                quickStart: {
                    addLoginModal: {
                        heading: "Ajouter une connexion sans mot de passe",
                        subHeading: "Sélectionnez une application pour configurer la connexion sans mot de passe."
                    },
                    heading: "Guide de configuration du lien magique",
                    steps: {
                        customizeFlow: {
                            content: "Continuez à configurer le flux de connexion selon vos besoins.",
                            heading: "Personnalisez le flux"
                        },
                        selectApplication: {
                            content: "Choisissez l'<1>application</1> pour laquelle vous " +
                                "souhaitez configurer la connexion sans mot de passe.",
                            heading: "Sélectionnez l'application"
                        },
                        selectMagicLink: {
                            content:
                                "Allez dans l'onglet <1>Méthode de connexion</1> et cliquez sur <3>" +
                                "Ajouter une connexion sans mot de passe" +
                                "</3> pour configurer un flux Magic Link de base.",
                            heading: "Sélectionnez <1>Ajouter une connexion sans mot de passe</1>"
                        }
                    },
                    subHeading: "Suivez les instructions ci-dessous pour configurer la connexion sans mot " +
                        "de passe dans votre flux de connexion."
                }
            }
        },
        monitor: {
            filter: {
                advancedSearch: {
                    attributes: {
                        placeholder: "Par exemple., actionId, traceId etc."
                    },
                    fields: {
                        value: {
                            placeholder: "Par exemple., validate-token, access_token etc."
                        }
                    },
                    buttons: {
                        submit: {
                            label: "Ajouter un filtre"
                        }
                    },
                    title: "Recherche Avancée"
                },
                dropdowns: {
                    timeRange: {
                        custom: {
                            labels: {
                                from: "De",
                                timeZone: "Sélectionnez le fuseau horaire",
                                to: "À"
                            }
                        },
                        texts: {
                            0: "15 dernières minutes",
                            1: "30 dernières minutes",
                            2: "Dernière heure",
                            3: "4 dernières heures",
                            4: "Dernières 12 heures",
                            5: "Dernières 24 heures",
                            6: "Dernières 48 heures",
                            7: "3 derniers jours",
                            8: "7 derniers jours",
                            9: "Période personnalisée"
                        }
                    },
                    timeZone: {
                        placeholder: "Sélectionnez le fuseau horaire"
                    }
                },
                topToolbar: {
                    buttons: {
                        addFilter: {
                            label: "Ajouter des filtres"
                        },
                        clearFilters: {
                            label: "Effacer tous les filtres"
                        }
                    }
                },
                searchBar: {
                    placeholderDiagnostic: "Rechercher des journaux par ID de suivi, ID d'action, ID client, message de résultat ou état de résultat",
                    placeholderAudit: "Rechercher les journaux par action, ID cible, ID initiateur, ID de demande"

                },
                refreshMessage: {
                    text: "Derniers journaux récupérés à",
                    tooltipText: "Les journaux nouvellement générés prendront quelques minutes pour être inclus dans les résultats de la recherche."
                },
                refreshButton: {
                    label: "Rafraîchir"
                },
                queryButton: {
                    label: "Exécuter la requête"
                },
                downloadButton : {
                    label : "Télécharger les données du journal"
                },
                delayMessage: {
                    text: "Certaines requêtes peuvent prendre plus de temps à charger."
                }
            },
            logView: {
                toolTips: {
                    seeMore: "Voir plus"
                }
            },
            notifications: {
                genericError: {
                    subtitle: {
                        0: "Impossible de récupérer les journaux.",
                        1: "Veuillez réessayer."
                    },
                    title: "Quelque chose s'est mal passé"
                },
                emptyFilterResult: {
                    actionLabel: "Effacer tous les filtres",
                    subtitle: {
                        0: "Nous n'avons trouvé aucun résultat.",
                        1: "Veuillez essayer d'ajouter un filtre différent."
                    },
                    title: "Aucun résultat trouvé"
                },
                emptySearchResult: {
                    actionLabel: "Effacer la requête de recherche",
                    subtitle: {
                        0: "Nous n'avons trouvé aucun résultat pour cette requête de recherche.",
                        1: "Veuillez essayer un terme de recherche différent."
                    },
                    title: "Aucun résultat trouvé"
                },
                emptyResponse: {
                    subtitle: {
                        0: "Nous n'avons trouvé aucun journal dans ",
                        1: "Veuillez essayer une plage horaire différente."
                    },
                    title: "Aucun journal disponible"
                }
            },
            pageHeader: {
                description: "Interrogez vos journaux pour résoudre les problèmes et surveiller les activités des ressources.",
                title: "Journaux"
            },
            tooltips: {
                copy: "Copier dans le presse-papier"
            }
        },
        sidePanel: {
            apiResources: "Ressources de l'API",
            branding: "l'image de marque",
            stylesAndText: "Styles et texte",
            monitor: "Journaux",
            categories: {
                apiResources: "Ressources de l'API",
                branding: "l'image de marque",
                emailProvider: "Fournisseur de messagerie",
                smsProvider: "Fournisseur SMS",
                monitor: "Journaux"
            },
            emailProvider: "Fournisseur de messagerie",
            smsProvider: "Fournisseur SMS",
            eventPublishing : "Événements",
            emailTemplates : "Modèles d'e-mails",
            organizationInfo: "Informations sur l'organisation"
        },
        eventPublishing: {
            eventsConfiguration: {
                heading: "Configurer les événements",
                subHeading:  "Asgardeo peut publier des événements sur Choreo en fonction de diverses interactions de l'utilisateur. Vous pouvez utiliser les événements publiés pour déclencher des cas d'utilisation personnalisés.",
                formHeading: "Sélectionnez les événements que vous souhaitez publier sur Choreo.",
                form : {
                    updateButton: "Update"
                },
                navigateToChoreo: {
                    description: "Accédez à votre locataire Choreo pour consommer les événements publiés.",
                    navigateButton: "aller à la Choreo"
                }
            },
            notifications : {
                updateConfiguration : {
                    error : {
                        generic: {
                            description: "Une erreur s'est produite lors de la mise à jour des configurations d'événement.",
                            message: "Quelque chose s'est mal passé"
                        },
                        activeSubs: {
                            description: "Assurez-vous qu'il n'y a pas d'abonnés actifs avant de désactiver une " +
                                "catégorie d'événement.",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    success : {
                        description : "Les configurations d'événement ont été mises à jour avec succès.",
                        message : "Mise à jour réussie"
                    }
                },
                getConfiguration : {
                    error : {
                        description : "Une erreur s'est produite lors de la récupération des configurations d'événement.",
                        message :  "Erreur de récupération"
                    },
                    success : {
                        description : "",
                        message : ""
                    }
                }
            }
        },
        emailTemplates: {
            page: {
                header: "Modèles d'e-mails",
                description: "Personnalisez les modèles d'e-mail utilisés dans votre organisation."
            },
            tabs: {
                content: {
                    label: "Contenu"
                },
                preview: {
                    label: "Aperçu"
                }
            },
            notifications: {
                getEmailTemplateList: {
                    error: {
                        description: "Une erreur s'est produite lors de la récupération de la liste des modèles d'e-mail.",
                        message: "Une erreur s'est produite lors de la récupération de la liste des modèles d'e-mail"
                    }
                },
                getEmailTemplate: {
                    error: {
                        description: "Une erreur s'est produite lors de la récupération du modèle d'e-mail.",
                        message: "Erreur lors de la récupération du modèle d'e-mail."
                    }
                },
                updateEmailTemplate: {
                    success: {
                        description: "Modèle d'e-mail mis à jour avec succès",
                        message: "Modèle d'e-mail mis à jour avec succès"
                    },
                    error: {
                        description: "Erreur lors de la mise à jour du modèle d'e-mail. Assurez-vous d'avoir rempli tous les champs obligatoires et réessayez",
                        message: "Erreur lors de la mise à jour du modèle d'e-mail"
                    }
                },
                deleteEmailTemplate: {
                    success: {
                        description: "Modèle d'e-mail supprimé avec succès.",
                        message: "Modèle d'e-mail supprimé avec succès!"
                    },
                    error: {
                        description: "Erreur lors de la suppression du modèle d'e-mail. Veuillez réessayer",
                        message: "Error while deleting the email template"
                    }
                }
            },
            form: {
                inputs: {
                    template: {
                        label: "Modèle d'e-mail",
                        placeholder: "Sélectionnez le modèle d'e-mail",
                        hint: "Sélectionnez le modèle d'e-mail"
                    },
                    locale: {
                        label: "Lieu",
                        placeholder: "Sélectionnez les paramètres régionaux"
                    },
                    subject: {
                        label: "Assujettir",
                        placeholder: "Saisissez l'objet de l'e-mail",
                        hint: "Il sera utilisé comme objet du modèle d'e-mail et sera visible par l'utilisateur."
                    },
                    body: {
                        label: "Corps de l'e-mail (HTML)",
                        hint: "Vous pouvez inclure n'importe lequel des espaces réservés de littéraux disponibles pour le corps de l'e-mail."
                    },
                    footer: {
                        label: "Bas de page",
                        placeholder: "Saisissez le pied de page de l'e-mail",
                        hint: "Il sera utilisé comme pied de page du modèle d'e-mail et sera visible par l'utilisateur."
                    }
                }
            },
            modal: {
                replicateContent: {
                    header: "Répliquer le contenu?",
                    message: "Il semble que vous n'ayez aucun contenu pour ces paramètres régionaux. Avez-vous besoin de remplir ici le contenu des paramètres régionaux précédents pour un démarrage rapide?"
                }
            },
            dangerZone: {
                heading: "Supprimer le modèle",
                message: "Cette action supprimera le modèle sélectionné et vous perdrez toutes les modifications que vous avez apportées à ce modèle.",
                action: "Supprimer le modèle",
                actionDisabledHint: "Vous ne pouvez pas supprimer un modèle avec les paramètres régionaux par défaut."
            }
        }
    },
    manage: {
        accountLogin: {
            notifications: {
                success: {
                    description:  "La configuration de validation du nom d'utilisateur a bien été mise à jour.",
                    message: "Mise à jour réussie"
                },
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Je n'ai pas pu récupérer mes données de portail de compte.",
                    message: "Quelque chose s'est mal passé"
                }
            },
            validationError: {
                minMaxMismatch: "La longueur minimale doit être inférieure à la longueur maximale.",
                minLimitError: "La longueur minimale ne peut pas être inférieure à 3.",
                maxLimitError: "La longueur maximale ne peut pas être supérieure à 50.",
                wrongCombination: "La combinaison n'est pas autorisée."
            },
            editPage: {
                pageTitle: "Validation du nom d'utilisateur",
                description: "Mettez à jour le type de nom d'utilisateur et personnalisez les règles de validation du nom d'utilisateur pour vos utilisateurs.",
                usernameType: "Sélectionnez le type de nom d'utilisateur",
                usernameTypeHint: "Autoriser les utilisateurs à définir un e-mail ou une combinaison de caractères pour le nom d'utilisateur.",
                emailType: "Email",
                customType: "Coutume",
                usernameLength: {
                    0: "Doit contenir entre",
                    1: "et",
                    2: "caractères."
                },
                usernameAlphanumeric: "Restreindre aux caractères alphanumériques (a-z, A-Z, 0-9).",
                usernameSpecialCharsHint: "Toute combinaison de lettres (a-z, A-Z), de chiffres (0-9) et des caractères suivants: !@#$%&'*+\\=?^_.{|}~-."
            },
            alternativeLoginIdentifierPage: {
                pageTitle: "Identifiants de connexion alternatifs",
                description: "Configurez des identifiants de connexion alternatifs et autorisez les utilisateurs à" +
                    " utiliser un nom d'utilisateur ou un identifiant de connexion configurédans les flux de" +
                    " connexion et de récupération.",
                loginIdentifierTypes: "Sélectionnez l'identifiant de connexion",
                loginIdentifierTypesHint: "Autoriser les utilisateurs à utiliser un nom d'utilisateur ou un" +
                    " identifiant de connexion configuré dans le flux de connexion.",
                warning: "Les utilisateurs professionnels peuvent utiliser n'importe lequel des identifiants de" +
                    " connexion sélectionnés comme alternative au nom d'utilisateur dans les flux de connexion," +
                    " les flux de récupération, etc.",
                info: "Vous avez sélectionné l'e-mail comme type de nom d'utilisateur, ce qui en fait l'identifiant de connexion principal.",
                notification: {
                    error: {
                        description:"Erreur lors de la mise à jour de la configuration alternative de" +
                            " l'identifiant de connexion.",
                        message: "Erreur lors de la mise à jour de la configuration"
                    },
                    success: {
                        description: "Mise à jour réussie de la configuration alternative de l'identifiant" +
                            " de connexion.",
                        message: "Mise à jour réussie"
                    }
                },
                claimUpdateNotification: {
                    error: {
                        description: "Erreur lors de la mise à jour de l'attribut en tant qu'attribut unique." +
                            " Veuillez réessayer.",
                        message: "Erreur lors de la mise à jour de la revendication"
                    }
                }
            },
            pageTitle: "Connexion au compte",
            description: "Personnalisez les configurations de connexion du compte des utilisateurs de votre organisation.",
            goBackToApplication: "Revenir aux applications",
            goBackToAccountLogin: "Revenir à la connexion du compte"
        },
        attributes: {
            attributes: {
                description: "Afficher et gérer les attributs"
            },
            displayNameHint:
                "Le nom d'affichage sera utilisé dans le profil de l'utilisateur pour reconnaître " +
                "l'attribut, donc soyez prudent lors de sa sélection.",
            generatedAttributeMapping: {
                title: "Mappages de protocoles",
                OIDCProtocol: "OpenID Connect",
                SCIMProtocol: "SCIM 2.0",
                description:
                    "Nous simplifions le processus pour vous et ajoutons les mappages requis pour " +
                    "les protocoles suivants."
            }
        },
        features: {
            header: {
                links: {
                    billingPortalNav: "Portail de Facturation"
                }
            },
            tenant: {
                header: {
                    tenantSwitchHeader: "Changer d'organisation",
                    tenantAddHeader: "Nouvelle organisation",
                    tenantDefaultButton: "Défaut",
                    tenantMakeDefaultButton: "Faire défaut",
                    makeDefaultOrganization: "Faire l'organisation par défaut",
                    backButton: "Retourner",
                    copyOrganizationId: "Copier l'ID de l'organisation",
                    copied: "Copié!",
                    tenantSearch: {
                        placeholder: "Rechercher une organisation",
                        emptyResultMessage: "Aucune organisation trouvée"
                    }
                },
                wizards: {
                    addTenant: {
                        heading: "Ajouter une nouvelle organisation",
                        forms: {
                            fields: {
                                tenantName: {
                                    label: "Nom de l'organisation",
                                    placeholder: "Nom de l'organisation (E.g., myorg)",
                                    validations: {
                                        empty: "Ceci est un champ obligatoire.",
                                        duplicate:
                                            "Une organisation portant le nom {{ tenantName }} existe déjà." +
                                            " Veuillez essayer un autre nom.",
                                        invalid: "Veuillez entrer un format valide pour le nom de l'organisation. Il doit" +
                                            "<1><0>être unique</0><1>cobtenir plus de {{ minLength }} et moins de" +
                                            " {{ maxLength }} personnages</1><2>se composent uniquement de minuscules" +
                                            "caractères alphanumériques</2><3>bcommencer par un caractère alphabétique</3>" +
                                            "</1>",
                                        invalidLength: "Le nom que vous avez saisi est inférieur à {{ minLength }}" +
                                            " personnages. Ce doit être" +
                                            "<3><0>être unique</0><1>contenir plus de {{ minLength }} et moins de" +
                                            " {{ maxLength }} personnages</1><2>se composent uniquement de minuscules" +
                                            " caractères alphanumériques</2><3>commencer par un caractère alphabétique</3>" +
                                            "</3s>"
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "Validation du nouveau nom de l'organisation...",
                                tenantCreate: "Créer la nouvelle organisation...",
                                tenantSwitch:
                                    "Veuillez patienter pendant que nous vous redirigeons vers la nouvelle" +
                                    "organisation..."
                            },
                            messages: {
                                info:
                                    "Pensez à un bon nom d'organisation unique pour votre nouvel espace de travail" +
                                    " Asgardeo car vous ne pourrez pas le modifier plus tard!"
                            }
                        },
                        tooltips: {
                            message: "Vous utiliserez cette URL pour accéder à la nouvelle organisation."
                        }
                    }
                },
                tenantCreationPrompt: {
                    heading: "Créer une nouvelle organisation",
                    subHeading1: "Vous accédez à Asgardeo dans le ",
                    subHeading2: "S'identifier",
                    subHeading3: "au ",
                    subHeading4: "Pour continuer, créez votre première organisation.",
                    subHeading5: "Alternativement, ",
                    subHeading6: "pour",
                    subHeading7: "région."
                },
                notifications: {
                    addTenant: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur lors de la création de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création de l'organisation.",
                            message: "Erreur lors de la création de l'organisation"
                        },
                        limitReachError: {
                            description: "Le nombre maximum d'organisations autorisées a été atteint.",
                            message: "Erreur lors de la création de l'organisation"
                        },
                        success: {
                            description: "Organisation {{ tenantName }} créée avec succès.",
                            message: "Organisation créée"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description:
                                "Une erreur s'est produite lors de la mise à jour de votre organisation par défaut.",
                            message: "Erreur lors de la mise à jour de l'organisation"
                        },
                        success: {
                            description: "Vous avez bien défini {{ tenantName }} votre organisation par défaut.",
                            message: "Organisation par défaut mise à jour"
                        }
                    },
                    missingClaims: {
                        message: "Certaines informations personnelles sont manquantes",
                        description:
                            "Veuillez visiter l'application MyAccount et assurez-vous que votre prénom," +
                            " nomet adresse e-mail principale ont été définis dans la section Informations personnelles."
                    },
                    getTenants: {
                        message: "Impossible de récupérer vos organisations",
                        description: "Une erreur s'est produite lors de la récupération de vos organisations."
                    }
                }
            },
            user: {
                addUser: {
                    close: "proche",
                    invite: "Inviter",
                    finish: "Finir",
                    add: "Ajouter",
                    inputLabel: {
                        alphanumericUsername: "Nom d'utilisateur",
                        alphanumericUsernamePlaceholder: "Entrez le nom d'utilisateur",
                        emailUsername: "Nom d'utilisateur (courriel)"
                    },
                    inviteUserTooltip:
                        "Un e-mail avec un lien de confirmation sera envoyé à l'adresse e-mail " +
                        "fournie pour que l'utilisateur définisse son propre mot de passe.",
                    inviteUserOfflineTooltip: "Vous pouvez copier le lien d'invitation" +
                        " ou l'invitation lors de l'étape finale pour la partager avec l'utilisateur.",
                    inviteLink: {
                        error: {
                            description: "Impossible de récupérer l'invitation",
                            message: "Une erreur s'est produite lors de la récupération du lien d'invitation."
                        },
                        genericError: {
                            description: "Erreur lors de l'obtention du résumé de l'invitation",
                            message: "Une erreur s'est produite lors de la génération du résumé."
                        }
                    },
                    summary: {
                        invitation: "Invitation",
                        invitationBody: {
                            accountHasBeenCreated: "Un compte a été créé pour le nom d'utilisateur," +
                                " {{ username }} dans le {{ tenantname }} organisme.",
                            hi: "Hi,",
                            pleaseFollowTheLink: "Veuillez suivre le lien ci-dessous pour définir le mot de passe.",
                            team: "{{ tenantname }} équipe",
                            thanks: "Merci"
                        },
                        invitationBodyCopy: {
                            accountHasBeenCreated: "Un compte a été créé pour le nom d'utilisateur," +
                                " $username dans le $tenantname organisme.",
                            team: "$tenantname équipe"
                        },
                        invitationPasswordBody: {
                            accountHasBeenCreated: "Un compte a été créé pour vous dans l'organisation" +
                                " {{ tenantname }}. Your credentials are as follows.",
                            myAccountLink: "URL de mon compte",
                            pleaseFollowTheLink: "Veuillez utiliser les informations d'identification pour " +
                                "vous connecter à votre compte en suivant le lien ci-dessous."
                        },
                        invitationPasswordBodyCopy: {
                            accountHasBeenCreated: "Un compte a été créé pour vous dans l'organisation" +
                                " $tenantname. Your credentials are as follows."
                        },
                        invitationLink: "Lien d'invitation",
                        inviteWarningMessage: "Assurez-vous de copier le lien d'invitation ou" +
                            " l'invitation avant de continuer. Vous ne les reverrez plus!",
                        password: "Mot de passe",
                        passwordWarningMessage: "Assurez-vous de copier le mot de passe ou l'invitation" +
                            " avant de continuer. Vous ne les reverrez plus !",
                        username: "Nom d'utilisateur"
                    },
                    validation: {
                        password:
                            "Votre mot de passe doit contenir un minimum de 8 caractères dont au moins une " +
                            "lettre majuscule, une lettre minuscule et un chiffre.",
                        passwordCase: "Au moins {{minUpperCase}} lettres majuscules et {{minLowerCase}} " +
                            "lettres minuscules",
                        upperCase: "Au moins {{minUpperCase}} lettre(s) majuscule(s)",
                        lowerCase: "Au moins {{minLowerCase}} lettre(s) minuscule(s)",
                        passwordLength: "Doit contenir entre {{min}} et {{max}} caractères",
                        passwordNumeric: "Au moins {{min}} numéro(s)",
                        specialCharacter: "Au moins {{specialChr}} caractère(s) spécial(s)",
                        uniqueCharacters: "Au moins {{uniqueChr}} caractère(s) unique(s)",
                        consecutiveCharacters: "Pas plus de {{repeatedChr}} caractère(s) répété(s)",
                        error: {
                            passwordValidation: "Le mot de passe doit satisfaire les contraintes ci-dessous."
                        },
                        usernameHint: "Doit être une chaîne alphanumérique (a-z, A-Z, 0-9) entre {{minLength}} et {{maxLength}} caractères comprenant " +
                            "au moins une lettre.",
                        usernameSpecialCharHint: "TDoit contenir entre {minLength}} et {{maxLength}} caractères, dont au " +
                            "moins une lettre, et peut contenir une combinaison des caractères " +
                            "suivants: a-z, A-Z, 0-9, !@#$%&'*+\\=?^_.{|}~-.",
                        usernameLength: "La longueur du nom d'utilisateur doit être comprise " +
                            "entre {{minLength}} et {{maxLength}}.",
                        usernameSymbols: "Le nom d'utilisateur doit être composé de caractères alphanumériques (a-z, A-Z, 0-9) et doit inclure au moins une lettre.",
                        usernameSpecialCharSymbols: "Veuillez choisir un nom d'utilisateur valide qui respecte les directives données."
                    }
                }
            },
            userStores: {
                configs: {
                    addUserStores: {
                        actionTitle: "Connecter le magasin de l'utilisateur",
                        subTitle: "Il n'y a actuellement aucun magasin d'utilisateurs distant connecté. " +
                            "Connectez un nouveau magasin d'utilisateurs et intégrez les comptes d'" +
                            "utilisateurs distants à Asgardeo.",
                        title: "Connecter un nouvel userstore"
                    }
                },
                create: {
                    pageLayout: {
                        actions: {
                            connectUserStore: "Connecter le magasin d'utilisateurs"
                        },
                        description: "Intégrez les utilisateurs de votre magasin d'utilisateurs distants" +
                            " à Asgardeo.",
                        title: "Magasin d'utilisateurs distants",
                        steps: {
                            attributeMappings: {
                                subTitle: "Mappez les attributs définis dans le magasin d'utilisateurs sur " +
                                    "site pour le nom d'utilisateur et l'ID utilisateur afin que les " +
                                    "utilisateurs du magasin d'utilisateurs sur site que vous connectez " +
                                    "puissent se connecter aux applications sans aucun problème.",
                                title: "Attributs de la carte",
                                usernameHint: "L'attribut mappé pour le nom d'utilisateur doit être " +
                                    "<1> unique </1> et être de <3> type {{ usernameType }} </3>. Ce " +
                                    "champ ne peut pas être vide car le nom d'utilisateur est l'identifiant principal de l'utilisateur.",
                                emailUsername: "e-mail",
                                alphanumericUsername: "nom d'utilisateur alphanumérique"
                            },
                            generalSettings: {
                                form: {
                                    fields: {
                                        name: {
                                            hint: "Cela apparaîtra comme le nom du magasin d'utilisateurs " +
                                                "distant auquel vous vous connectez.",
                                            label: "Nom",
                                            placeholder: "Entrez le nom du magasin de l'utilisateur",
                                            requiredErrorMessage: "Ce champ ne peut pas être vide car il s'agit " +
                                            "de l'identifiant unique du magasin d'utilisateurs"
                                        },
                                        description: {
                                            label: "La description",
                                            placeholder: "Entrez la description du magasin de l'utilisateur"
                                        },
                                        userStoreType: {
                                            label: "Type de magasin d'utilisateurs distants",
                                            message: "Seul l'accès en lecture à ce magasin d'utilisateurs vous " +
                                                "sera accordé.",
                                            types: {
                                                ldap: {
                                                    label: "LDAP"
                                                },
                                                ad: {
                                                    label: "Active Directory"
                                                }
                                            }
                                        },
                                        accessType: {
                                            label: "Type d'accès",
                                            types: {
                                                readOnly: {
                                                    label: "Lecture seulement",
                                                    hint: "Vous obtiendrez un accès en lecture seule au magasin "+
                                                    "d'utilisateurs. Vous ne pourrez pas ajouter de nouveaux "+
                                                    "utilisateurs ou mettre à jour les attributs des comptes "+
                                                    "d'utilisateurs à bord."
                                                },
                                                readWrite: {
                                                    label: "Lire/écrire",
                                                    hint: "YOU recevra un accès en lecture / écriture au magasin "+
                                                    "d'utilisateurs. Vous pourrez ajouter de nouveaux utilisateurs "+
                                                    "et mettre à jour les attributs des comptes d'utilisateurs à bord."
                                                }
                                            }
                                        }

                                    }
                                },
                                title: "Détails Généraux"
                            }
                        }
                    }
                },
                delete: {
                    assertionHint: "Veuillez confirmer votre action."
                },
                edit: {
                    attributeMappings: {
                        description: "Mappez les attributs de votre magasin d'utilisateurs distant avec les " +
                            "attributs par défaut et personnalisés correspondants de votre organisation. Les " +
                            "valeurs d'attribut seront mappées aux mappages d'attributs par défaut de votre " +
                            "organisation. ",
                        disable: {
                            buttonDisableHint: "Vous ne pouvez pas mapper les attributs car ce magasin " +
                                "d'utilisateurs est désactivé."
                        },
                        title: "Mettre à jour les mappages d'attributs",
                        subTitle: "Mettez à jour les mappages d'attributs que vous avez ajoutés pour les " +
                            "attributs par défaut et personnalisés",
                        sections: {
                            custom: "Attributs personnalisés",
                            local: "Attributs locaux"
                        },
                        validations: {
                            empty: "Ceci est un champ obligatoire."
                        }
                    },
                    general: {
                        connectionsSections: {
                            title: "Connexion(s) de l'agent du magasin d'utilisateurs",
                            agents: {
                                agentOne: {
                                    description: "Les utilisateurs disposant d'un compte dans ce magasin " +
                                        "d'utilisateurs connecté via cet agent peuvent se connecter à Mon compte " +
                                        "et à d'autres applications professionnelles enregistrées dans l'organisation."
                                },
                                agentTwo: {
                                    description: "Pour maintenir la haute disponibilité du magasin d'utilisateurs " +
                                        "distant, vous pouvez connecter un deuxième agent de magasin d'utilisateurs. "
                                },
                                buttons: {
                                    disconnect: "Déconnecter",
                                    generate: "Générer un jeton",
                                    regenerate: "Régénérer le jeton"
                                }
                            }
                        },
                        disable: {
                            buttonDisableHint: "Vous ne pouvez pas mettre à jour la description car ce magasin " +
                                "d'utilisateurs est désactivé."
                        },
                        form: {
                            fields: {
                                description: {
                                    label: "La description",
                                    placeholder: "Entrez la description du magasin de l'utilisateur"
                                }
                            },
                            validations: {
                                allSymbolsErrorMessage: "Le nom du magasin de l'utilisateur doit contenir une" +
                                    " combinaison de caractères alphanumériques et spéciaux. Veuillez essayer un autre nom.",
                                invalidSymbolsErrorMessage: "Le nom que vous avez saisi contient des caractères non " +
                                    "autorisés. Il ne peut pas contenir '/' ou '_'.",
                                restrictedNamesErrorMessage: "Un magasin d'utilisateurs portant le nom {{name}} existe " +
                                    "déjà. Veuillez essayer un autre nom.",
                                reservedNamesErrorMessage: "Le nom de magasin de l'utilisateur {{name}} est réservé." +
                                    " Veuillez essayer un autre nom."
                            }
                        },
                        userStoreType: {
                            info: "Notez que vous bénéficierez d'un accès en LECTURE SEULE au répertoire " +
                                "utilisateur. Vous ne pourrez pas ajouter de nouveaux utilisateurs ni mettre " +
                                "à jour les attributs des comptes d'utilisateurs que vous avez intégrés. Les " +
                                "utilisateurs de ce magasin d'utilisateurs pourront se connecter aux " +
                                "applications de votre organisation."
                        }
                    },
                    setupGuide: {
                        title: "Connecter le magasin d'utilisateurs distant",
                        subTitle: "Suivez les étapes ci-dessous pour configurer l'agent de magasin d'utilisateurs, " +
                            "qui connecte le magasin d'utilisateurs distant à Asgardeo",
                        steps: {
                            configureProperties: {
                                content: {
                                    message: "Consultez la documentation Asgardeo pour la liste complète des " +
                                        "propriétés de configuration du magasin d'utilisateurs."
                                },
                                description: "Configurez les propriétés du magasin d'utilisateurs local dans " +
                                    "le fichier deployment.toml qui se trouve dans la distribution de l'agent " +
                                    "du magasin d'utilisateurs en fonction de vos besoins.",
                                title: "Configurer les propriétés du magasin d'utilisateurs"
                            },
                            downloadAgent: {
                                content: {
                                    buttons: {
                                        download: "Télécharger l'agent"
                                    }
                                },
                                description: "Téléchargez et décompressez l'agent de magasin d'utilisateurs.",
                                title: "Télécharger l'agent"
                            },
                            generateToken: {
                                content: {
                                    buttons: {
                                        generate: "Générer un jeton"
                                    }
                                },
                                description: "Générez un nouveau jeton d'accès qui sera requis lorsque vous " +
                                    "essayez de connecter votre magasin d'utilisateurs distant via l'agent de " +
                                    "magasin d'utilisateurs.",
                                title: "Générer un nouveau jeton"
                            },
                            runAgent: {
                                description: "Exécutez l'une des commandes suivantes en fonction de votre" +
                                    "système d'exploitation. Entrez le jeton d'installation à l'invite.",
                                title: "Exécutez l'agent"
                            },
                            tryAgain: {
                                info: "Un magasin d'utilisateurs n'est pas connecté, veuillez vous assurer" +
                                    " que vous avez bien suivi toutes les étapes du guide d'installation."
                            }
                        }
                    }
                },
                list: {
                    subTitle: "Connectez et gérez les magasins d'utilisateurs.",
                    title: "Magasins d'utilisateurs"
                }
            }
        },
        groups: {
            heading: "Groupes",
            subHeading:
                "Les groupes d'utilisateurs de votre organisation sont répertoriés ici. Vous pouvez créer de nouveaux" +
                " groupes et affecter des utilisateurs.",
            edit: {
                users: {
                    heading: "Utilisateurs du groupe",
                    description: "Les groupes d'utilisateurs au sein de votre organisation sont gérés ici."
                },
                roles: {
                    title: "Rôles",
                    heading: "Rôles attribués au groupe",
                    description: "Les attributions de groupe à rôle au sein de votre organisation sont gérées ici.",
                    editHoverText: "Modifier les rôles attribués",
                    searchPlaceholder: "Rechercher des rôles d'application par nom d'application et nom de rôle",
                    rolesList: {
                        applicationLabel: "Application",
                        applicationRolesLabel: "Rôles d'application"
                    },
                    addNewModal: {
                        heading: "Gérer les rôles d'application",
                        subHeading: "Sélectionnez les rôles d'application liés au groupe."
                    },
                    buttons: {
                        assignRoles: "Attribuer des rôles"
                    },
                    placeHolders: {
                        emptyRoles: {
                            action: "Aller aux applications",
                            subtitles: {
                                0: "Aucun rôle d'application n'est créé pour le moment.",
                                1: "Veuillez créer un rôle d'application pour l'affecter au groupe."
                            },
                            title: "Aucun rôle créé"
                        },
                        emptyList: {
                            action: "Attribuer des rôles",
                            subtitles: {
                                0: "Aucun rôle n'est attribué au groupe pour le moment."
                            },
                            title: "Aucun rôle attribué"
                        }
                    },
                    notifications: {
                        updateApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la mise à jour des rôles d'application"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour des rôles d'application",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "La mise à jour des rôles d'application pour le groupe a réussi.",
                                message: "La mise à jour des rôles d'application a réussi"
                            }
                        },
                        fetchApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la récupération des rôles d'application"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des rôles d'application.",
                                message: "Quelque chose s'est mal passé"
                            }
                        },
                        fetchAssignedApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la récupération des rôles d'application attribués"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des rôles d'application attribués.",
                                message: "Quelque chose s'est mal passé"
                            }
                        }
                    }
                }
            }
        },
        myAccount: {
            fetchMyAccountData: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Impossible de récupérer les données du portail Mon compte.",
                    message: "Quelque chose s'est mal passé"
                }
            },
            fetchMyAccountStatus: {
                error: {
                    description: "{{description}}",
                    message: "Erreur de récupération"
                },
                genericError: {
                    description: "Impossible de récupérer l'état du portail Mon compte.",
                    message: "Quelque chose s'est mal passé"
                }
            },
            editPage: {
                pageTitle: "Portail libre-service Mon compte",
                description: "Contrôlez l'accès au portail Mon compte pour vos utilisateurs et configurez l'authentification à deux facteurs pour le portail Mon compte.",
                enableEmailOtp: "Activer l'OTP des e-mails",
                enableSmsOtp: "Activer SMS OTP",
                smsOtpEnableDescription: "Pour l'activer, vous devez configurer le service SMS pour votre organisation. <1>En savoir plus</1>",
                enableTotp: "Activer le TOTP",
                mfaDescription: "Configurer les options d'authentification à deux facteurs pour le portail Mon compte",
                myAccountUrlDescription: "Partagez ce lien avec vos utilisateurs pour accéder au portail Mon compte.",
                backupCodeDescription: "Activez les codes de sauvegarde pour l'authentification à deux facteurs.",
                enableBackupCodes: "Activer les codes de secours",
                backupCodeInfo: "Pour activer les codes de secours, vous devez activer au moins une des options d'authentification à deux facteurs pour le flux de connexion du portail Mon compte.",
                EnableTotpEnrollment: "Autoriser l'inscription TOTP lors de la connexion",
                totpEnrollmentInfo: "Si l'inscription TOTP est désactivée lors de la connexion de l'utilisateur et que l'utilisateur n'a pas encore inscrit l'authentificateur TOTP, l'utilisateur sera invité à contacter l'administrateur de l'organisation pour obtenir de l'aide."
            },
            pageTitle: "Portail libre-service",
            description: "Portail libre-service pour vos utilisateurs.",
            goBackToApplication: "Retour à l'application",
            goBackToMyAccount: "Retour à Mon compte"
        },
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: "Password Recovery",
                    subHeading:
                        "Configurez les paramètres de récupération de mot de passe en libre-service pour " +
                        "permettre aux utilisateurs de réinitialiser leur mot de passe à l'aide d'un e-mail.",
                    toggleName: "Activer la récupération de mot de passe"
                }
            },
            accountRecovery: {
                backButton: "Revenir à la récupération de compte",
                heading: "Account Recovery",
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: {
                                hint:
                                    "L'activation de cette option permettra aux utilisateurs professionnels de " +
                                    "réinitialiser leur mot de passe à l'aide d'un e-mail.",
                                label: "Activer"
                            },
                            expiryTime: {
                                label: "Délai d'expiration du lien de récupération en minutes",
                                placeholder: "Entrez l'heure d'expiration",
                                validations: {
                                    invalid:
                                        "Le délai d'expiration du lien de récupération doit être un nombre entier.",
                                    empty: "L'heure d'expiration du lien de récupération ne peut pas être vide.",
                                    range:
                                        "Le délai d'expiration du lien de récupération doit être compris entre " +
                                        "1 minute et 10 080 minutes (7 jours).",
                                    maxLengthReached:
                                        "L'heure d'expiration du lien de récupération doit être un " +
                                        "nombre de 5 chiffres ou moins."
                                }
                            },
                            notifySuccess: {
                                hint:
                                    "Ceci spécifie s'il faut notifier l'utilisateur par e-mail lorsque la " +
                                    "récupération du mot de passe est réussie.",
                                label: "Notifier la récupération réussie"
                            }
                        }
                    },
                    connectorDescription:
                        "Activer l'option de récupération de mot de passe en libre-service pour " +
                        "les utilisateurs professionnels sur la page de connexion. ",
                    heading: "Password Recovery",
                    notification: {
                        error: {
                            description:
                                "Erreur lors de la mise à jour de la configuration de récupération de mot " +
                                "de passe.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description:
                                "La configuration de récupération de mot de passe a été mise à jour avec " + "succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading:
                        "Activez l'option de récupération de mot de passe en libre-service pour les " +
                        "utilisateurs professionnels sur la page de connexion."
                },
                subHeading:
                    "Configurer les paramètres liés à la récupération du mot de passe et à la " +
                    "récupération du nom d'utilisateur."
            },
            accountSecurity: {
                backButton: "Revenir à la sécurité du compte",
                heading: "Sécurité du compte",
                botDetection: {
                    form: {
                        fields: {
                            enable: {
                                hint:
                                    "L'activation de cette option appliquera reCaptcha pour la connexion et " +
                                    "la récupération.",
                                label: "Activer"
                            }
                        }
                    },
                    info: {
                        heading:
                            "Cela appliquera la validation reCAPTCHA dans les interfaces utilisateur " +
                            "respectives des flux suivants.",
                        subSection1: "Connectez-vous aux applications d'entreprise",
                        subSection2: "Récupérer le mot de passe d'un compte client",
                        subSection3: "Auto-inscription pour les comptes clients"
                    },
                    connectorDescription: "Activer reCAPTCHA pour l'organisation.",
                    heading: "Détection de Bot",
                    notification: {
                        error: {
                            description: "Erreur lors de la mise à jour de la configuration de détection de bot.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description: "La configuration de détection de bot a été mise à jour avec succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading:
                        "Activer recaptcha pour la connexion à l'application métier et la récupération de " +
                        "compte pour l'organisation."
                },
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: {
                                hint:
                                    "Ceci spécifie le facteur par lequel la durée de verrouillage du compte " +
                                    "doit être incrémentée lors d'autres tentatives de connexion infructueuses " +
                                    "après le verrouillage du compte. Ex : Durée initiale : 5mins ; " +
                                    "Facteur d'incrémentation : 2 ; Durée du prochain verrouillage : " +
                                    "5 x 2 = 10 min.",
                                label: "Facteur d'incrément de la durée du verrouillage du compte",
                                placeholder: "Entrez le facteur d'incrément de la durée de verrouillage",
                                validations: {
                                    invalid:
                                        "Le facteur d'incrément de la durée du verrouillage du compte doit être " +
                                        "un nombre entier.",
                                    range:
                                        "Le facteur d'incrément de la durée du verrouillage du compte doit être " +
                                        "compris entre 1 et 10.",
                                    maxLengthReached:
                                        "Le facteur d'incrément de la durée du verrouillage du compte " +
                                        "doit être un nombre à 1 ou 2 chiffres."
                                }
                            },
                            accountLockTime: {
                                hint:
                                    "Cela spécifie la durée initiale pendant laquelle le compte sera verrouillé. " +
                                    "Le compte sera automatiquement déverrouillé après cette période.",
                                label: "Durée de verrouillage du compte en minutes",
                                placeholder: "Entrer la durée de verrouillage",
                                validations: {
                                    invalid: "La durée de verrouillage du compte doit être un nombre entier.",
                                    required: "La durée de verrouillage du compte est un champ obligatoire.",
                                    range:
                                        "La durée de verrouillage du compte doit être comprise entre 1 minute " +
                                        "et 1 440 minutes (1 jour).",
                                    maxLengthReached:
                                        "La durée de verrouillage du compte doit être un nombre de 4 " +
                                        "chiffres ou moins."
                                }
                            },
                            enable: {
                                hint:
                                    "Le verrouillage du compte entraînera l'envoi d'un courrier à l'utilisateur " +
                                    "indiquant que le compte a été verrouillé.",
                                label: "Activer"
                            },
                            maxFailedAttempts: {
                                hint:
                                    "Ceci spécifie le nombre de tentatives de connexion infructueuses autorisées " +
                                    "avant que le compte ne soit verrouillé.",
                                label:
                                    "Nombre de tentatives de connexion infructueuses avant le verrouillage du " +
                                    "compte",
                                placeholder: "Saisissez le nombre maximal de tentatives infructueuses",
                                validations: {
                                    invalid:
                                        "Le nombre maximal de tentatives infructueuses doit être un nombre " +
                                        "entier.",
                                    required: "Le nombre maximal de tentatives échouées est un champ obligatoire.",
                                    range:
                                        "Le nombre maximal de tentatives infructueuses doit être compris entre 1 " +
                                        "et 10.",
                                    maxLengthReached:
                                        "Le nombre maximal de tentatives infructueuses doit être un " +
                                        "nombre à 1 ou 2 chiffres."
                                }
                            }
                        }
                    },
                    info:
                        "Une fois le compte verrouillé, le propriétaire du compte en sera informé par e-mail. " +
                        "Le compte sera automatiquement activé après la durée de verrouillage du compte.",
                    connectorDescription:
                        "Protégez les comptes contre les attaques par force brute de mot " +
                        "de passe en verrouillant le compte lors de tentatives de connexion infructueuses " +
                        "consécutives.",
                    heading: "Tentatives de connexion Sécurité",
                    notification: {
                        error: {
                            description:
                                "Erreur lors de la mise à jour de la configuration de sécurité des " +
                                "tentatives de connexion.",
                            message: "Erreur lors de la mise à jour de la configuration"
                        },
                        success: {
                            description:
                                "La configuration de sécurité des tentatives de connexion a été mise à " +
                                "jour avec succès.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading:
                        "Activer le verrouillage du compte en cas d'échec des tentatives de connexion pour " +
                        "la connexion à l'application métier de l'organisation.",
                    howItWorks: {
                        correctPassword: {
                            description:
                                "Si l'utilisateur entre le mot de passe correct, l'utilisateur peut se " +
                                "connecter avec succès."
                        },
                        example: {
                            description_plural:
                                "C'est-à-dire que le compte sera verrouillé pendant " +
                                "{{ lockIncrementRatio }} x {{ lockDuration }} = {{ lockTotalDuration }} minutes.",
                            description_singular:
                                "C'est-à-dire que le compte sera verrouillé pendant " +
                                "{{ lockIncrementRatio }} x {{ lockDuration }} = {{ lockTotalDuration }} minute."
                        },
                        incorrectPassword: {
                            description_plural:
                                "Si l'utilisateur essaie un mot de passe incorrect pour " +
                                "{{ maxAttempts }} autres tentatives consécutives, la durée de verrouillage du " +
                                "compte sera incrémentée de {{ lockIncrementRatio }} fois la durée de " +
                                "verrouillage précédente.",
                            description_singular:
                                "Si l'utilisateur essaie un mot de passe incorrect pour " +
                                "{{ maxAttempts }} autres tentative consécutives, la durée de verrouillage " +
                                "du compte sera incrémentée de {{ lockIncrementRatio }} fois la durée de " +
                                "verrouillage précédente."
                        }
                    }
                },
                subHeading: "Configurez les paramètres de sécurité pour protéger les comptes d'utilisateurs."
            },
            additionalSettings: "Paramètres additionnels",
            analytics: {
                heading: "Moteur d'analyse",
                subHeading: "Configurez le moteur d'analyse pour votre organisation.",
                form: {
                    fields: {
                        hostUrl: {
                            label: "URL de l'hôte",
                            placeholder: "Entrez l'URL de l'hôte",
                            hint: "L'URL du moteur d'analyse."
                        },
                        hostBasicAuthEnable: {
                            label: "Activer l'authentification de base",
                            hint: "Activez l'authentification de base pour le moteur d'analyse."
                        },
                        hostUsername: {
                            label: "Nom d'utilisateur",
                            placeholder: "Entrez le nom d'utilisateur",
                            hint: "Le nom d'utilisateur pour s'authentifier dans le moteur d'analyse."
                        },
                        hostPassword: {
                            label: "Mot de passe",
                            placeholder: "Entrer le mot de passe",
                            hint: "Le mot de passe pour s'authentifier dans le moteur d'analyse."
                        },
                        hostConnectionTimeout: {
                            label: "Délai d'expiration de la connexion HTTP",
                            placeholder: "Entrez le délai d'expiration de la connexion",
                            hint: "Entrez la valeur du délai d'expiration de la connexion en millisecondes."
                        },
                        hostReadTimeout: {
                            label: "Délai d'expiration de lecture HTTP",
                            placeholder: "Entrez le délai de lecture",
                            hint: "Entrez la valeur du délai de lecture en millisecondes."
                        },
                        hostConnectionRequestTimeout: {
                            label: "Expiration du délai de demande de connexion HTTP",
                            placeholder: "Entrez le délai d'expiration de la demande de connexion",
                            hint: "Entrez la valeur du délai d'expiration de la demande de connexion en millisecondes."
                        },
                        hostNameVerification: {
                            label: "Vérification du nom d'hôte",
                            placeholder: "Entrez la vérification du nom d'hôte",
                            hint: "Activez la vérification du nom d'hôte pour le moteur d'analyse. (STRICT | ALLOW_ALL)"
                        }
                    },
                    notification: {
                        error: {
                            description: "Une erreur s'est produite lors de la mise à jour des configurations du moteur d'analyse.",
                            message: "Erreur est survenue"
                        },
                        success: {
                            description: "Mis à jour avec succès les configurations du moteur d'analyse.",
                            message: "Mise à jour réussie"
                        }
                    }
                }
            },
            generalBackButton: "Retourner",
            generalDisabledLabel: "désactivé",
            generalEnabledLabel: "activé",
            passwordHistoryCount: {
                heading: "Compteur de l'historique des mots de passe",
                label1: "Doit être différent du dernier",
                label2: "mots de passe.",
                message: "Spécifiez le nombre de mots de passe uniques qu'un utilisateur doit utiliser avant qu'un ancien mot de passe puisse être réutilisé."
            },
            passwordExpiry: {
                heading: "Expiration du mot de passe",
                label: "Le mot de passe expire",
                timeFormat: "jours"
            },
            passwordValidationHeading: "Password Input Validation",
            userOnboarding: {
                backButton: "Revenir à l'auto-inscription",
                heading: "Auto-inscription",
                selfRegistration: {
                    accountVerificationWarning: "Pour activer l'option de vérification de compte, vous " +
                        "devez rendre l'attribut e-mail obligatoire pour votre organisation.",
                    form: {
                        fields: {
                            enable: {
                                hint:
                                    "Autoriser les utilisateurs particuliers à s'inscrire eux-mêmes pour cette " +
                                    "organisation. Lorsqu'il est activé, les utilisateurs verront un lien pour " +
                                    "créer un compte sur l'écran de connexion.",
                                label: "Activer"
                            },
                            enableAutoLogin: {
                                label: "Activer la connexion automatique",
                                hint:
                                    "Si cette option est sélectionnée, l'utilisateur sera automatiquement connecté " +
                                    "après l'enregistrement."
                            },
                            expiryTime: {
                                hint: "L'heure d'expiration du lien de vérification du compte.",
                                label: "Heure d'expiration du lien de vérification du compte",
                                placeholder: "Entrez l'heure d'expiration",
                                validations: {
                                    invalid: "L'heure d'expiration doit être un nombre entier.",
                                    empty: "Le délai d'expiration ne peut pas être vide.",
                                    range:
                                        "Le délai d'expiration doit être compris entre 1 minute et " +
                                        "10 080 minutes (7 jours).",
                                    maxLengthReached:
                                        "L'heure d'expiration doit être un nombre avec 5 chiffres ou " + "moins."
                                }
                            },
                            activateImmediately: {
                                msg:
                                    "Si sélectionné, le nouveau compte est activé immédiatement après " +
                                    "l'enregistrement sans attendre la confirmation du compte.",
                                hint: "Cela permettra la vérification par e-mail lors de l'auto-inscription.",
                                label: "Activer le compte immédiatement"
                            },
                            signUpConfirmation: {
                                recommendationMsg:
                                    "Il est recommandé d'activer la vérification du compte pour " +
                                    "l'auto-enregistrement.",
                                botMsg: " Sinon, activez au moins la détection des bots.",
                                accountLockMsg:
                                    "La vérification du compte permet la vérification de l'e-mail " +
                                    "lors de l'auto-inscription. Le nouveau compte n'est activé qu'une fois " +
                                    "que l'utilisateur a vérifié l'e-mail",
                                hint:
                                    "Un e-mail est envoyé à l'utilisateur auto-enregistré demandant la " +
                                    "vérification du compte.",
                                label: "Vérification de compte",
                                confirmation: {
                                    heading: "Êtes-vous sûr?",
                                    message: "Activer la vérification de compte",
                                    content: "La connexion automatique nécessite que le compte soit activé immédiatement"
                                        + " après l'enregistrement. Lorsque vous continuez, la connexion automatique sera "
                                        + "désactivée. Vous pouvez toujours le réactiver lorsque vous sélectionnez "
                                        + "l'option <1>Activer le compte immédiatement</1>."
                                }
                            }
                        }
                    },
                    connectorDescription: "Activer l'auto-inscription pour les utilisateurs clients de l'organisation.",
                    heading: "Auto-inscription",
                    notification: {
                        error: {
                            description: "Erreur lors de la mise à jour de la configuration d'auto-enregistrement.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description: "Mise à jour réussie de la configuration d'auto-enregistrement.",
                            message: "Mise à jour réussie"
                        }
                    },
                    subHeading:
                        "Lorsque l'auto-inscription est activée, les utilisateurs peuvent s'inscrire via le " +
                        "lien <1>Créer un compte</1> sur la page de connexion de l'application. " +
                        "Cela crée un nouveau compte <3>client</3> dans l'organisation."
                },
                inviteUserToSetPassword: {
                    notification: {
                        error: {
                            description: "Échec de la mise à jour de la configuration du connecteur " +
                                "Inviter un utilisateur à définir un mot de passe.",
                            message: "Erreur de mise à jour de la configuration"
                        },
                        success: {
                            description: "Mise à jour réussie de la configuration du connecteur Inviter " +
                                "un utilisateur à définir un mot de passe",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                subHeading: "Paramètres liés à l'auto-enregistrement"
            }
        },
        users: {
            administratorSettings: {
                administratorSettingsSubtitle: "Paramètres liés aux administrateurs de l'organisation.",
                administratorSettingsTitle: "Paramètres administrateur",
                backButton: "Revenir aux administrateurs",
                disableToggleMessage: "Autoriser les utilisateurs à gérer l'organisation",
                enableToggleMessage: "Désactiver les utilisateurs pour gérer l'organisation",
                error: {
                    description: "{{description}}",
                    message: "Erreur lors de la mise à jour de la configuration"
                },
                genericError: {
                    description: "Impossible de mettre à jour la configuration",
                    message: "Quelque chose s'est mal passé"
                },
                success: {
                    description: "La configuration a été mise à jour avec succès.",
                    message: "Mise à jour de la configuration réussie"
                },
                toggleHint: "Si cette option est activée, les utilisateurs peuvent se voir attribuer " +
                    "des capacités d'administration."
            },
            usersTitle: "Utilisateurs",
            usersSubTitle: "Les utilisateurs qui peuvent accéder aux applications au sein de l'organisation sont " +
                "gérés ici.",
            collaboratorsTitle: "Collaborateurs",
            collaboratorsSubTitle: "Les utilisateurs qui ont accès aux opérations administratives de votre " +
                "organisation sont gérés ici.",
            editUserProfile: {
                userId: "Identifiant d'utilisateur",
                disclaimerMessage:
                    "Ce profil utilisateur appartient à un collaborateur ou à un propriétaire" +
                    " d'organisation. Seul le propriétaire du compte peut gérer le profil via l'application Compte.",
                accountLock: {
                    title: "Verrouiller le compte utilisateur",
                    description:
                        "Une fois le compte verrouillé, l'utilisateur ne peut plus se connecter au système. " +
                        "S'il vous plaît soyez certain."
                },
                resetPassword: {
                    changePasswordModal: {
                        emailUnavailableWarning: "WARNING: Impossible de trouver une adresse e-mail pour" +
                            " le compte d'utilisateur. Veuillez fournir une adresse e-mail pour inviter" +
                            " l'utilisateur à réinitialiser le mot de passe.",
                        emailResetWarning: "Un e-mail avec un lien pour réinitialiser le mot de passe sera envoyé à " +
                            "l'adresse e-mail fournie pour que l'utilisateur puisse définir son propre mot de passe.",
                        passwordResetConfigDisabled: "La réinitialisation du mot de passe via l'e-mail de récupération " +
                            "n'est pas activée. Veuillez vous assurer de l'activer dans les configurations " +
                            "<1> Connexion et inscription </1>."
                    }
                }
            },
            buttons: {
                addUserBtn: "Ajouter un utilisateur",
                addCollaboratorBtn: "Ajouter un collaborateur"
            },
            collaboratorAccounts: {
                consoleInfo: "Partagez ce lien avec les utilisateurs disposant de privilèges " +
                    "administratifs pour autoriser l'accès à la console"
            },
            list: {
                columns: {
                    user: "utilisateur",
                    accountType: "Type de compte",
                    idpType: "Dirigé par",
                    userStore: "Magasin d'utilisateurs"
                },
                popups: {
                    content: {
                        AccountTypeContent: "La relation de l'utilisateur avec cette organisation.",
                        idpTypeContent:
                            "Entité qui gère l'identité et les informations d'identification de " + "l'utilisateur.",
                        sourceContent: "Le magasin de données où les informations utilisateur sont stockées."
                    }
                }
            },
            descriptions: {
                learnMore: "Apprendre encore plus",
                allUser: "Ce sont tous les utilisateurs de votre organisation.",
                consumerUser:
                    "Ces utilisateurs (clients) peuvent accéder aux applications de l'organisation. Les " +
                    "administrateurs peuvent intégrer des clients à l'organisation ou les clients peuvent " +
                    "s'inscrire si l'auto-inscription est activée.",
                guestUser:
                    "Ces utilisateurs (collaborateurs) ont accès aux opérations administratives de votre " +
                    "organisation (Par exemple, intégration des applications, gestion des utilisateurs). " +
                    "Les administrateurs peuvent inviter des utilisateurs en tant que collaborateurs dans " +
                    "l'organisation et leur attribuer des autorisations.",
                consumerAppInfo:
                    "Partagez ce lien avec vos clients pour autoriser l'accès à My Account et gérer leurs comptes."
            },
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: {
                            description: "Le nombre maximum d'utilisateurs clients autorisés a été atteint.",
                            message: "Erreur lors de l'ajout du nouvel utilisateur"
                        }
                    }
                }
            },
            wizard: {
                addAdmin: {
                    external: {
                        subtitle: "Invitez un administrateur externe à gérer votre organisation. " +
                            "wilCet utilisateur recevra une invitation par e-mail " +
                            "qu'il pourra accepter afin de commencer à collaborer.",
                        title: "Inviter un utilisateur administrateur"
                    },
                    internal: {
                        hint: "Seuls les utilisateurs répertoriés dans la section des utilisateurs peuvent être " +
                            "ajoutés en tant qu'administrateurs.",
                        searchPlaceholder: "Rechercher par e-mail",
                        emptySearchQueryPlaceholder: "Pour commencer, recherchez des utilisateurs en tapant l'e-mail. Vous devrez peut-être saisir l'adresse e-mail complète.",
                        emptySearchResultsPlaceholder: "Nous n'avons trouvé aucun résultat pour la recherche. Veuillez essayer un terme de recherche différent.",
                        selectUser: "Sélectionnez l'utilisateur",
                        subtitle: "Faites des utilisateurs existants des administrateurs de votre organisation. " +
                            "Une notification par e-mail sera envoyée aux utilisateurs indiquant le changement.",
                        title: "Inviter un utilisateur administrateur",
                        updateRole: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur lors de l'ajout de l'administrateur"
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de l'ajout de l'administrateur.",
                                message: "Erreur lors de l'ajout de l'administrateur"
                            },
                            success: {
                                description: "Administrateur ajouté avec succès.",
                                message: "Administrateur ajouté"
                            }
                        }
                    }
                },
                addUser: {
                    subtitle: "Suivez les étapes pour ajouter un nouvel utilisateur",
                    title: "Ajouter un utilisateur"
                }
            }
        },
        admins: {
            editPage: {
                backButton: "Revenir aux administrateurs"
            }
        },
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: {
                        description: "Le nombre maximal d'utilisateurs collaborateurs autorisés a été atteint.",
                        message: "Erreur lors de l'envoi de l'invitation"
                    }
                }
            }
        },
        guest: {
            deleteUser: {
                confirmationModal: {
                    content:
                        "Cependant, le compte de l'utilisateur n'est pas définitivement supprimé du système et " +
                        "ils pourront toujours accéder aux autres organisations auxquelles ils sont associés.",
                    message:
                        "Cette action est irréversible et supprimera l'association de l'utilisateur avec " +
                        "cette organisation."
                }
            },
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        subheader:
                            "Cette action supprimera l'association de l'utilisateur avec cette organisation. " +
                            "Veuillez être certain avant de continuer."
                    }
                }
            }
        },
        sidePanel: {
            categories: {
                attributeManagement: "Gestion des attributs",
                AccountManagement: "Gestion de compte",
                userManagement: "Gestion des utilisateurs",
                organizationSettings: "Paramètres de l'organisation"
            }
        }
    }
};
