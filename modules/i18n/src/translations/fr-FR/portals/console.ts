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
                description: "Vous serez déconnecté de la session en cours pour cause d'inactivité." +
                    "Veuillez choisir 'Rester connecté' si vous souhaitez poursuivre la session.",
                heading: "Vous serez déconnecté(e) dans <1>{{ time }}</1>.",
                primaryButton: "Rester connecté",
                secondaryButton: "Déconnexion"
            }
        },
        placeholders: {
            brokenPage: {
                action: "Rafraîchir la page",
                subtitles: {
                    0: "Quelque chose s'est mal passé lors de l'affichage de cette page.",
                    1: "Voir la console du navigateur pour les détails techniques."
                },
                title: "Quelque chose s'est mal passé"
            }
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
        features: {
            applications: {
                confirmations: {
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
                    }
                },
                forms: {
                    inboundOIDC: {
                        messages: {
                            revokeDisclaimer: {
                                content: "விண்ணப்பம் ரத்து செய்யப்பட்டது. நீங்கள் பயன்பாட்டை மீண்டும் இயக்க விரும்பினால் " +
                                    "ரகசியத்தை மீண்டும் உருவாக்கவும்.",
                                heading: "La demande est révoquée"
                            }
                        }
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
                }
            }
        }
    },
    manage: {
        features: {
            users: {
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous procédez à cette action, l'utilisateur sera déconnecté de toutes les " +
                            "sessions actives. Ils perdront la progression de toutes les tâches en cours. " +
                            "Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et mettra fin définitivement à toutes les sessions " +
                            "actives."
                    },
                    terminateSession: {
                        assertionHint: "Veuillez taper <1>{{ name }}</1> pour confirmer.",
                        content: "Si vous procédez à cette action, l'utilisateur sera déconnecté de la session " +
                            "sélectionnée. Ils perdront la progression de toutes les tâches en cours. Veuillez " +
                            "procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action est irréversible et mettra fin définitivement à la session."
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
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: "Terminer tout",
                                terminateSession: "Terminer la session"
                            },
                            labels: {
                                browser: "Navigateur",
                                deviceModel: "Modèle d'appareil",
                                ip: "Adresse IP",
                                lastAccessed: "Dernier accès",
                                loggedInAs: "Connecté sous <1>{{ app }}</1> en tant que <3>{{ user }}</3>",
                                loginTime: "Heure de connexion",
                                os: "Système opérateur",
                                recentActivity: "Activité récente"
                            }
                        }
                    },
                    notifications: {
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
                            subtitles: "Il n'y a aucune session active pour cet utilisateur.",
                            title: "Aucune session active"
                        }
                    }
                }
            }
        }
    }
};
