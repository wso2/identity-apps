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
