/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { ConsoleNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
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
        dateTime: {
            humanizedDateString: "Dernière modification {{date}} depuis"
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
            featureAnnouncements: {
                organizations: {
                    message: "Présentation des organisations B2B. Commencez à construire votre plateforme " +
                        "B2B en intégrant vos organisations partenaires/clientes.",
                    buttons: {
                        tryout: "Essaye le"
                    }
                }
            },
            organizationSwitch: {
                breadcrumbError: {
                    description: "Une erreur s'est produite lors de la récupération de la hiérarchie de l'organisation.",
                    message: "Quelque chose s'est mal passé"
                },
                emptyOrgListMessage: "Aucune organisation disponible",
                orgSearchPlaceholder: "Rechercher par nom d'organisation"
            }
        },
        modals: {
            editAvatarModal: {
                content: {
                    gravatar: {
                        errors: {
                            noAssociation: {
                                content: "Il semble que l'e-mail sélectionné ne soit pas enregistré sur Gravatar. " +
                                    "Ouvrez un compte Gravatar en vous rendant sur le <1>site officiel de Gravatar</1> ou " +
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
                        "as a product. WSO2 LLC. and its developers have no access to the information held within " +
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
            privacy: "Confidentialité",
            loginAndRegistration: {
                label: "Connexion et inscription",
                description: "Configurer les paramètres de connexion et d'enregistrement."
            },
            userAttributesAndStores: "Attributs utilisateur et magasins",
            userManagement: "Gestion des utilisateurs",
            branding: "l'image de marque"
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
    apiResources: {
        confirmations: {
            deleteAPIResource: {
                assertionHint: "Veuillez confirmer votre action.",
                content: "Cette action est irréversible et supprimera en permanence la ressource API.",
                header: "Es-tu sûr?",
                message: "Si vous supprimez cette ressource API, certaines fonctionnalités peuvent ne pas fonctionner correctement. " +
                    "Veuillez procéder avec prudence."
            },
            deleteAPIResourcePermission: {
                assertionHint: "Veuillez confirmer votre action.",
                content: "Cette action est irréversible et supprimera en permanence la portée de la ressource API.",
                header: "Es-tu sûr?",
                message: "Si vous supprimez cette portée de la ressource API, certaines fonctionnalités peuvent ne pas fonctionner correctement. " +
                    "Veuillez procéder avec prudence."
            }
        },
        tabs: {
            scopes: {
                button: "Ajouter la portée",
                label: "Portées",
                title: "Liste des étendues",
                subTitle: "Liste des utilisations de lunettes par la ressource API.",
                learnMore: "Apprendre encore plus",
                search: "Rechercher des portées par le nom d'affichage",
                empty: {
                    title: "Aucune portée n'est attribuée",
                    subTitle: "Cliquez sur l'icône + pour ajouter une nouvelle portée"
                },
                emptySearch: {
                    title: "Aucun résultat trouvé",
                    subTitle: {
                        0: "Nous n'avons pas pu trouver la portée que vous avez recherchée.",
                        1: "Veuillez essayer d'utiliser un autre paramètre."
                    },
                    viewAll: "Recherche de recherche claire"
                },
                copyPopupText: "Copiez l'identifiant",
                copiedPopupText: "Copié l'identifiant",
                removeScopePopupText: "Retirez la portée",
                form: {
                    button: "Ajouter la portée",
                    cancelButton: "Annuler",
                    submitButton: "Finition",
                    title: "Ajouter une portée",
                    subTitle: "Créer une nouvelle portée",
                    fields: {
                        displayName: {
                            emptyValidate: "Le nom de l'affichage ne peut pas être vide",
                            label: "Afficher un nom",
                            placeholder: "Lire les réservations"
                        },
                        scope: {
                            emptyValidate: "La portée ne peut pas être vide",
                            label: "Portée",
                            placeholder: "read_bookings"
                        },
                        description: {
                            label: "description",
                            placeholder: "Entrez la description"
                        }
                    }
                }
            }
        },
        wizard: {
            addApiResource: {
                steps: {
                    scopes: {
                        empty: {
                            title: "Aucune portée n'est attribuée",
                            subTitle: "Click on the + icon to add a new scope"
                        },
                        stepTitle: "Portées",
                        form: {
                            button: "Ajouter la portée",
                            fields: {
                                displayName: {
                                    emptyValidate: "Le nom de l'affichage ne peut pas être vide",
                                    label: "Afficher un nom",
                                    placeholder: "Lire les réservations",
                                    hint: "Fournissez un nom significatif car il sera affiché sur l'écran de consentement de l'utilisateur."
                                },
                                permission: {
                                    emptyValidate: "La portée ne peut pas être vide",
                                    uniqueValidate: "Cette portée existe déjà dans l'organisation.Veuillez en choisir un autre.",
                                    invalid: "La portée ne peut pas contenir des espaces",
                                    label: "Portée",
                                    placeholder: "read_bookings",
                                    hint: "Une valeur unique qui agit comme portée lors de la demande d'un jeton d'accès. <1>Notez que la portée ne peut pas être modifiée une fois créée.</1>"
                                },
                                permissionList: {
                                    label: "Scopes ajoutées"
                                },
                                description: {
                                    label: "description",
                                    placeholder: "Entrez la description",
                                    hint: "Fournissez une description de votre portée.Cela sera affiché sur l'écran de consentement de l'utilisateur."
                                }
                            }
                        },
                        removeScopePopupText: "Retirez la portée"
                    }
                }
            }
        }
    },
    branding: {
        form: {
            actions: {
                save: "Sauver et publier",
                resetAll: "Réinitialiser à par défaut"
            }
        },
        tabs: {
            text: {
                label: "Texte"
            },
            preview: {
                label: "Aperçu"
            }
        },
        screens: {
            common: "Commune",
            login: "Se connecter",
            "sms-otp": "smsOtp",
            "email-otp": "emailOtp",
            "email-template": "Modèles de messagerie",
            "sign-up": "S'inscrire",
            "totp": "totp",
            myaccount: "Mon compte"
        }
    },
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: "Une fois que vous avez confirmé, vos utilisateurs commenceront à voir les défaillances {{productName}} et ce ne sera pas réversible. Veuillez procéder avec prudence.",
            heading: "Es-tu sûr?",
            message: "Retour <1>{{screen}}</1> Écran Personnaliser le texte pour le <3>{{locale}}</3> Locale."
        },
        revertUnsavedConfirmationModal: {
            content: "Si vous changez l'écran, vos modifications non sauvées seront perdues. Cliquez sur <1>Confirmer</1> pour continuer.",
            heading: "Es-tu sûr?",
            message: "Enregistrez vos modifications non sauvées"
        },
        form: {
            genericFieldResetTooltip: "Réinitialiser à par défaut",
            genericFieldPlaceholder: "Entrez votre texte",
            fields: {
                copyright: {
                    hint: "Texte qui apparaît au bas de l'écran de connexion. Vous pouvez utiliser le paramètre `{{currentYear}}` pour afficher automatiquement l'année en cours."
                },
                "site.title": {
                    hint: "Le titre du site peut apparaître dans les onglets du navigateur, les résultats des moteurs de recherche, les partages sur les réseaux sociaux, etc. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "login.button": {
                    hint: "Le texte qui apparaît sur le bouton d'action principal de la boîte de connexion. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "login.heading": {
                    hint: "Le titre de la boîte de connexion. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "sms.otp.heading": {
                    hint: "Le titre de la boîte SMS OTP. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "email.otp.heading": {
                    hint: "Le titre de la boîte Email OTP. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "totp.heading": {
                    hint: "Le titre de la boîte TOTP. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "sign.up.button": {
                    hint: "Le texte qui apparaît sur le bouton d'action principal de la boîte d'inscription. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                },
                "sign.up.heading": {
                    hint: "Le titre de la boîte d'inscription. Si non défini, les valeurs par défaut de {{productName}} sont utilisées."
                }
            }
        },
        localeSelectDropdown: {
            label: "Lieu",
            placeholder: "Sélectionner les paramètres régionaux"
        },
        modes: {
            text: {
                label: "Champs de texte"
            },
            json: {
                label: "JSON"
            }
        },
        notifications: {
            getPreferenceError: {
                description: "Impossible d'obtenir le texte personnalisé de l'écran {{screen}} pour {{locale}}.",
                message: "Impossible d'obtenir le texte personnalisé"
            },
            revertError: {
                description: "Je n'ai pas pu revenir {{screen}} texte personnalisé de l'écran pour {{locale}}.",
                message: "Je n'ai pas pu revenir sur le texte personnalisé"
            },
            resetSuccess: {
                description: "Retour avec succès {{screen}} Texte personnalisé de l'écran pour {{locale}}.",
                message: "Retournez le succès"
            },
            updateError: {
                description: "Impossible de mettre à jour {{Screen}} Texte personnalisé de l'écran pour {{locale}}.",
                message: "Impossible de mettre à jour le texte personnalisé"
            },
            updateSuccess: {
                description: "Le texte personnalisé de l'écran a mis à jour avec succès {{screen}} pour {{locale}}.",
                message: "Mise à jour de texte personnalisée réussie"
            }
        },
        screenSelectDropdown: {
            label: "Écran",
            placeholder: "Sélectionner l'écran"
        }
    },
    consoleSettings: {
        administrators: {
            add: {
                action: "Ajouter l'administrateur",
                options: {
                    addExistingUser: "Ajouter l'utilisateur existant",
                    inviteNewUser: "Inviter un nouvel utilisateur"
                }
            },
            edit: {
                backButton: "Retourner aux administrateurs"
            },
            tabLabel: "Administratrices"
        },
        loginFlow: {
            tabLabel: "Flux de connexion"
        },
        protocol: {
            tabLabel: "Protocole"
        },
        roles: {
            tabLabel: "Les rôles",
            permissionLevels: {
                edit: "Modifier",
                view: "Voir"
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
                        content: "Vous devez activer CORS pour l'origine de cette URL pour envoyer des requêtes à " +
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
                    placeholder: "Chercher des applications par nom, clientId, ou émetteur"
                },
                confirmations: {
                    addSocialLogin: {
                        content: "Pour ajouter une nouvelle connexion sociale, nous devrons vous diriger " +
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
                    deleteChoreoApplication: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "La suppression de cette application brisera les flux d'authentification et " +
                            "provoquera que l'application Choreo associée soit inutilisable avec ses informations " +
                            "d'identification.<1> procédez à vos risques et périls. </1>",
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
                    backupCodeAuthenticatorDelete: {
                        assertionHint: "Cliquez sur Continuer pour supprimer la fonctionnalité de code de secours.",
                        content: "Si vous continuez, la fonctionnalité de code de secours sera également " +
                            "supprimée de votre étape d'authentification actuelle. Souhaitez-vous continuer?",
                        header: "Confirmer la suppression",
                        message: "Cette action supprimera la fonctionnalité de code de secours de l'étape " +
                            "d'authentification en cours."
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
                        content: "Si vous supprimez cela, l'attribut d'objet sera défini sur " +
                            "<1>{{ default }}</1>",
                        header: "Etes-vous sûr ?",
                        subHeader: "Vous essayez de supprimer l'attribut d'objet"
                    },
                    removeApplicationUserAttributeMapping: {
                        content: "Si vous confirmez cette action, vous devez sélectionner un nouvel attribut de sujet",
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
                            emptySearchResults: {
                                subtitles: {
                                    0: "Nous n'avons trouvé aucun résultat pour '{{ searchQuery }}'",
                                    1: "Veuillez essayer un autre terme de recherche."
                                },
                                title: "Aucun résultat trouvé"
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
                                attributeComponentHintAlt: "Utilisez les étendues <1>OpenID Connect</1> pour ajouter/supprimer un attribut utilisateur " +
                                    "à une étendue. Vous pouvez ajouter de nouveaux attributs en accédant à <3>Attributs.</3>",
                                description: "Sélectionnez les étendues, c'est-à-dire les attributs utilisateur groupés qui sont autorisés à être " +
                                    "partagés avec cette application.",
                                heading: "Sélection des attributs utilisateur",
                                scopelessAttributes: {
                                    description: "Afficher les attributs sans étendue",
                                    displayName: "Attributs sans portée",
                                    name: "",
                                    hint: "Impossible de récupérer ces attributs utilisateur en demandant " +
                                        "des étendues OIDC. Pour récupérer, ajoutez les attributs requis à une étendue pertinente."
                                },
                                selectedScopesComponentHint: "Demandez ces étendues à partir de votre application pour récupérer " +
                                    "les attributs utilisateur sélectionnés.",
                                howToUseScopesHint: "Comment utiliser les portées",
                                mandatoryAttributeHint: "Marquez les attributs utilisateur qui doivent " +
                                    "obligatoirement être partagés avec l'application. Lors de la connexion, " +
                                    "{{productName}} invite l'utilisateur à saisir ces valeurs d'attribut, si elles " +
                                    "ne sont pas déjà fournies dans le profil de l'utilisateur.",
                                mappingTable: {
                                    actions: {
                                        enable: "Activer le mappage des noms d'attributs"
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
                                            makeScopeRequested: "Rendre la portée demandée",
                                            removeMandatory: "Retirer l'obligation",
                                            removeRequested: "Retirer la demandabilité",
                                            removeScopeRequested: "Supprimer l'étendue demandée",
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
                                    mappedAtributeHint: "Entrez le nom de l'attribut personnalisé à utiliser dans " +
                                        "l'assertion envoyée à l'application.",
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
                                    searchPlaceholder: "Rechercher des attributs d'utilisateur par nom, nom d'affichage ou détails de portée"
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
                            samlHeading: "Détails du connexion",
                            samlSubHeading: "Les détails de l'IdP suivants vous seront utiles pour implémenter et " +
                                "configurer l'authentification pour votre application à l'aide de SAML 2.0.",
                            wsFedHeading: "Détails de la connexion",
                            wsFedSubHeading: "Les détails IDP suivants seront utiles pour que vous puissiez implémenter et " +
                                "Configurer l'authentification pour votre application à l'aide de WS-Federation.",
                            tabName: "Info"
                        },
                        protocol: {
                            title: "Configuration du protocole",
                            subtitle: "Configurez le protocole pour votre application.",
                            button: "Configurer le protocole"
                        },
                        provisioning: {
                            inbound: {
                                heading: "Provisionnement entrant",
                                subHeading: "Provisionner des utilisateurs ou des groupes vers un annuaire de " +
                                    "WSO2 Identity Server’ via une application."
                            },
                            outbound: {
                                actions: {
                                    addIdp: "Nouveau connexion"
                                },
                                addIdpWizard: {
                                    errors: {
                                        noProvisioningConnector: "Le connexion sélectionné n'a aucun " +
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
                                subHeading: "Configurer un connexion pour l'aprovisionnement " +
                                    "sortant des utilisateurs de cette application."
                            },
                            tabName: "Provisionnement"
                        },
                        sharedAccess: {
                            subTitle: "Sélectionnez les options suivantes pour partager l'application avec " +
                                "les organisations.",
                            tabName: "Accès partagé"
                        },
                        shareApplication: {
                            addSharingNotification: {
                                genericError: {
                                    description: "Le partage d'application a échoué. Veuillez réessayer",
                                    message: "Le partage d'application a échoué!"
                                },
                                success: {
                                    description: "Application partagée avec succès avec l'organisation ou les organisations",
                                    message: "Application partagée!"
                                }
                            },
                            getSharedOrganizations: {
                                genericError: {
                                    description: "Échec de l'obtention de la liste des organisations partagées!",
                                    message: "Échec de l'obtention de la liste des organisations partagées!"
                                }
                            },
                            heading: "Partager l'application",
                            shareApplication: "Partager l'application",
                            stopSharingNotification: {
                                genericError: {
                                    description: "Échec de l'arrêt du partage d'application pour {{organization}}",
                                    message: "Échec de l'arrêt du partage d'application!"
                                },
                                success: {
                                    description: "Le partage d'application s'est arrêté avec succès avec l'{{organisation}}",
                                    message: "L'application partagée s'est arrêtée avec succès!"
                                }
                            },
                            stopAllSharingNotification: {
                                genericError: {
                                    description: "L'arrêt du partage des applications a échoué pour toutes les organisations",
                                    message: "L'arrêt du partage de l'application a échoué!"
                                },
                                success: {
                                    description: "Le partage des applications s'est arrêté avec toutes les organisations avec succès",
                                    message: "Le partage d'applications s'est arrêté avec succès!"
                                }
                            }
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
                                                        "secrets. Les secrets peuvent remplacer le secret du " +
                                                        "consommateur dans la fonction <1>callChoreo</1> pour " +
                                                        "l'authentification conditionnelle.",
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
                                                        title: "Configurer un nouveau connexion"
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
                                                        },
                                                        backupCodes: {
                                                            description: "Option de récupération de l'authentification " +
                                                                "à deux facteurs.",
                                                            heading: "Récupération MFA"
                                                        }
                                                    },
                                                    goBackButton: "Revenir à la Sélection",
                                                    search: {
                                                        placeholder: "Rechercher des authentificateurs"
                                                    },
                                                    stepSelectDropdown: {
                                                        hint: "Sélectionnez l'étape à laquelle vous souhaitez " +
                                                            "ajouter des authentificateurs.",
                                                        label: "Sélectionnez l'étape",
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
                                                    },
                                                    enableBackupCodes: {
                                                        label: "Activer les codes de secours"
                                                    }
                                                }
                                            },
                                            heading: "Configuration par étapes",
                                            hint: "Créez des étapes d'authentification en faisant glisser les " +
                                                "authentificateurs locaux/fédérés vers les étapes correspondantes.",
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
                                                "facteur ne peuvent pas être utilisés dans la première étape.",
                                            backupCodesDisabled: "L'authentificateur de code de secours ne peut être utilisé " +
                                                "que si des authentificateurs multifacteur sont présents dans l'étape en cours.",
                                            backupCodesDisabledInFirstStep: "L'authentificateur de code de secours ne peut pas " +
                                                "être utilisé dans la première étape.",
                                            federatedSMSOTPConflictNote: {
                                                multipleIdps: "Asgardeo nécessite le profil de l'utilisateur" +
                                                    " contenant le <1>numéro de mobile</1> pour configurer <3>SMS OTP</3>" +
                                                    " avec les connexions suivantes.",
                                                singleIdp: "Asgardeo nécessite le profil de l'utilisateur" +
                                                    " contenant le <1>numéro de mobile</1> pour configurer <3>SMS OTP</3>" +
                                                    " avec Connexion <5>{{idpName}}</5>."
                                            },
                                            sessionExecutorDisabledInFirstStep: "Le gestionnaire de limite de sessions actives nécessite " +
                                                "d'avoir un authentificateur de base dans une étape préalable.",
                                            sessionExecutorDisabledInMultiOptionStep: "Le gestionnaire de limite de sessions actives " +
                                                "ne peut pas être ajouté à une étape multi-options."
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
                                            apple: {
                                                description: "Permettre aux utilisateurs de se connecter avec Apple ID.",
                                                heading: "Ajouter une connexion Apple"
                                            },
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
                                            idf: {
                                                tooltipText: "Le premier authentificateur d'identifiant ne vérifie" +
                                                    " pas l'identité de l'utilisateur et ne peut donc pas être" +
                                                    " utilisé pour choisir l'identité ou les attributs de" +
                                                    " l'utilisateur. Pour ce faire, activez les validations à" +
                                                    " l'aide d'un script d'authentification."
                                            },
                                            magicLink: {
                                                description: "Permettre aux utilisateurs de se connecter " +
                                                    "en utilisant un lien magique envoyé à leur adresse e-mail.",
                                                heading: "Ajouter une connexion Magic Link"
                                            },
                                            microsoft: {
                                                description: "Autoriser les utilisateurs à se connecter avec Microsoft.",
                                                heading: "Ajouter une connexion Microsoft"
                                            },
                                            totp: {
                                                description: "Activez une couche d'authentification supplémentaire " +
                                                    "avec OTP basé sur le temps.",
                                                heading: "Ajouter TOTP comme deuxième facteur"
                                            },
                                            usernameless: {
                                                description: "Permettez aux utilisateurs de se connecter " +
                                                    "à l'aide d'un mot de passe, d'une clé de sécurité ou de données biométriques.",
                                                heading: "Ajouter une connexion par mot de passe",
                                                info: "L'inscription des clés d'accès à la volée est disponible exclusivement " +
                                                    "pour les clés d'accès prises en charge par FIDO2 et les autres utilisateurs " +
                                                    "souhaitant enregistrer plusieurs clés d'accès doivent le faire via Mon compte."
                                            },
                                            passkey: {
                                                description: "Permettez aux utilisateurs de se connecter à l'aide d'un mot " +
                                                "de passe, d'une clé de sécurité FIDO ou de données biométriques.",
                                                heading: "Ajouter une connexion par mot de passe",
                                                info: {
                                                    progressiveEnrollmentEnabled: "L’inscription progressive par mot de passe est activée.",
                                                    passkeyAsFirstStepWhenprogressiveEnrollmentEnabled: "<0>Note : </0> Pour " +
                                                    "Inscription utilisateur à la volée avec PassKeys, utilisez le <2>Passkeys progressif " +
                                                    "Inscription</2> modèle <4>Authentification conditionnelle</4> section.",
                                                    passkeyIsNotFirstStepWhenprogressiveEnrollmentEnabled: "Les utilisateurs peuvent s'inscrire " +
                                                    "Passkeys à la volée. Si les utilisateurs souhaitent inscrire plusieurs clés de pass " +
                                                    "Je sais via <1>My Account</1>.",
                                                    progressiveEnrollmentEnabledCheckbox: "<0>Note : </0> Lors de la définition de " +
                                                    "la clé d'accès lors de la <2>première étape</2>, les utilisateurs doivent ajouter " +
                                                    "un script adaptatif. Utilisez le modèle <4>Inscription progressive des clés d'accès</4> " +
                                                    "dans l'onglet <6>Méthode de connexion</6> de l'application.",
                                                    progressiveEnrollmentDisabled: "L'inscription du mot de passe à la volée " +
                                                    "est désactivée. Les utilisateurs doivent enregistrer leurs clés d'accès " +
                                                    "via <1>My Account</1> pour utiliser la connexion sans mot de passe."
                                                }
                                            },
                                            emailOTP: {
                                                description: "Activez une couche supplémentaire d'authentification avec OTP basé sur Email.",
                                                heading: "Ajouter Email OTP comme deuxième facteur"
                                            },
                                            smsOTP: {
                                                description: "Activez une couche supplémentaire d'authentification avec OTP basé sur SMS.",
                                                heading: "Ajouter SMS OTP comme deuxième facteur"
                                            },
                                            emailOTPFirstFactor: {
                                                description: "Autorisez les utilisateurs à se connecter à l'aide " +
                                                    "d'un code secret à usage unique envoyé à leur adresse e-mail.",
                                                heading: "Ajouter une connexion OTP par e-mail"
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
                        },
                        apiAuthorization: {
                            m2mPolicyMessage: "Toutes les étendues autorisées d'une ressource API sont disponibles pour une application M2M malgré la politique d'autorisation spécifiée pour la ressource."
                        },
                        roles: {
                            createApplicationRoleWizard: {
                                title: "Créer un rôle d'application",
                                subTitle: "Créez un nouveau rôle d'application dans le système.",
                                button: "Créer un rôle"
                            }
                        }
                    }
                },
                forms: {
                    advancedAttributeSettings: {
                        sections: {
                            linkedAccounts: {
                                errorAlert: {
                                    message: "Configuration invalide",
                                    description: "La validation du compte local lié doit être activée pour mandater un compte local lié"
                                },
                                heading: "Comptes liés",
                                fields: {
                                    validateLocalAccount: {
                                        label: "Valider le compte local lié",
                                        hint: "Cette option décidera si le compte d'utilisateur local lié est validé avec l'identité authentifiée."
                                    },
                                    mandateLocalAccount: {
                                        label: "Mandater le compte local lié",
                                        hint: "Ces options détermineront comment le compte utilisateur local lié est validé avec " +
                                            "l'identité authentifiée."
                                    }
                                }
                            },
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
                                fields: {
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
                                    },
                                    subjectType: {
                                        label: "Type de sujet",
                                        public: {
                                            label: "public",
                                            hint: "Cette option utilisera l'identifiant public du sujet comme sujet. " +
                                                "L'URI de l'identifiant du sujet est utilisé dans le calcul de la " +
                                                "valeur du sujet."
                                        },
                                        pairwise: {
                                            label: "par paire",
                                            hint: "Activez par paire pour attribuer un identifiant pseudonyme unique " +
                                                "à chaque client. L'URI de l'identifiant du sujet et l'URI de rappel " +
                                                "ou l'URI de l'identifiant du secteur sont pris en compte dans le " +
                                                "calcul de la valeur du sujet."
                                        }
                                    },
                                    sectorIdentifierURI: {
                                        label: "URI de l'identifiant du secteur",
                                        hint: "Doit configurer cette valeur si plusieurs URI de rappel avec des noms" +
                                            " d'hôte différents sont configurés.",
                                        placeholder: "Entrez l'URI de l'identifiant du sujet",
                                        validations: {
                                            invalid: "L'URL saisie n'est pas HTTPS. Veuillez ajouter une URL valide.",
                                            required: "Ce champ est obligatoire pour une application fonctionnelle." +
                                                " Toutefois, si vous envisagez d’essayer l’exemple d’application, ce" +
                                                " champ peut être ignoré."
                                        },
                                        multipleCallbackError: "Besoin de configurer un URI d'identifiant de secteur" +
                                            " si plusieurs URL de rappel sont configurées avec un type de sujet par" +
                                            " paire. Accédez à Attributs utilisateur -> Objet pour configurer l'URI" +
                                            " de l'identifiant du secteur."
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
                            applicationNativeAuthentication: {
                                heading: "Authentification native de l'application",
                                alerts: {
                                    clientAttestation: "Pour que l'attestation du client fonctionne, l'API d'authentification native de l'application doit être activée."
                                },
                                fields: {
                                    enableAPIBasedAuthentication: {
                                        hint: "Sélectionnez pour autoriser l'application à effectuer une authentification sans navigation et sans application via l'API d'authentification native de l'application.",
                                        label: "Activer l'API d'authentification d'application-Native"
                                    },
                                    enableClientAttestation: {
                                        hint: "Sélectionnez pour vérifier l'intégrité de l'application en appelant le service d'attestation de la plate-forme d'hébergement.",
                                        label: "Activer l'attestation du client"
                                    },
                                    android: {
                                        heading: "Android",
                                        fields: {
                                            androidPackageName: {
                                                hint: "Entrez le nom du package de votre application.C'est l'identifiant unique de votre application et se trouve généralement dans le format de domaine inverse.",
                                                label: "Nom du package",
                                                placeholder: "com.example.myapp",
                                                validations: {
                                                    empty: "Le nom du package d'application est requis pour l'attestation du client."
                                                }
                                            },
                                            androidAttestationServiceCredentials: {
                                                hint: "Fournissez les informations d'identification du compte Google Service au format JSON.Ceci sera utilisé pour accéder au service Google Play Integrity.",
                                                label: "Informations sur le compte de service",
                                                placeholder: "Contenu du fichier clé JSON pour les informations d'identification du compte Google Service",
                                                validations: {
                                                    empty: "Les informations d'identification du compte Google Service sont requises pour l'attestation du client."
                                                }
                                            }
                                        }
                                    },
                                    apple: {
                                        heading: "Apple",
                                        fields: {
                                            appleAppId: {
                                                hint: "Entrez l'ID d'application Apple, un identifiant unique attribué par Apple à votre application, en commençant généralement par 'com.' ou 'bundle.",
                                                label: "Identifiant d'application",
                                                placeholder: "com.example.myapp"
                                            }
                                        }
                                    }
                                }
                            },
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
                                },
                                invalidOperationModal: {
                                    header: "Opération invalide",
                                    message: "Vous devez désactiver la validation de la signature de la demande pour" +
                                        " supprimer le certificat. Si la signature de requête ou de réponse est" +
                                        " activée, il est essentiel de disposer d'un certificat valide" +
                                        " pour vérifier la signature."
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
                                },
                                ariaLabel: "URL d'accès à l'application"
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
                            isSharingEnabled: {
                                hint: "Si elle est activée, elle permettra à cette application d'authentifier les " +
                                    "clients/partenaires dans cette organisation ou l'une de ses organisations.",
                                label: "Autoriser le partage avec des organisations"
                            },
                            isManagementApp: {
                                hint: "Activez pour autoriser l'application à accéder à l'API de gestion de cette " +
                                    "organisation.",
                                label: "Application de gestion"
                            },
                            isFapiApp: {
                                hint: "Activez cette option pour permettre à l'application d'être conforme à FAPI.",
                                label: "Application conforme FAPI"
                            },
                            name: {
                                label: "Nom",
                                placeholder: "Mon appli",
                                validations: {
                                    empty: "Ceci est un champ obligatoire.",
                                    reserved: "{{appName}} est un nom d'application réservé. Veuillez entrer un nom " +
                                        "différent"
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
                                        hint: "Ce type d'octroi ne prend pas en charge la portée 'openid'.",
                                        label: "(portée openid non autorisée)"
                                    },
                                    implicit: {
                                        hint: "Ce type de subvention n'est pas recommandé.",
                                        label: "{{grantType}} (non recommandé)"
                                    },
                                    password: {
                                        hint: "Ce type de subvention n'est pas recommandé.",
                                        label: "{{grantType}} (non recommandé)"
                                    }
                                },
                                hint: "Cela déterminera la manière dont l'application communique avec le service " +
                                    "de jetons.",
                                label: "Types de subvention autorisés",
                                validation: {
                                    refreshToken: "Le type d'octroi Refresh token doit être sélectionné uniquement " +
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
                        mobileApp: {
                            discoverableHint: "Si cette option est activée et qu'une URL accessible sur le " +
                                "Web (lien profond) est fournie, les clients peuvent accéder à cette " +
                                "application à partir du portail <1>{{ myAccount }}</1>.",
                            mobileAppPlaceholder: "myapp://oauth2"
                        },
                        dropdowns: {
                            selectOption: "Sélectionner une option"
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
                                                + "en secondes."
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
                                    },
                                    audience: {
                                        hint: "Spécifiez le destinataire auquel ce <1>jeton_d'accès</1> est " +
                                            "destiné. Par défaut, l'ID client de cette application est " +
                                            "ajouté en tant qu'audience.",
                                        label: "Audience",
                                        placeholder: "Saisir l'audience",
                                        validations: {
                                            duplicate: "L'audience contient des valeurs en double",
                                            empty: "Veuillez remplir le public",
                                            invalid: "Veuillez ajouter une audience valide."
                                        }
                                    }
                                },
                                heading: "Jeton d'accès",
                                hint: " Configurez l'émetteur du jeton d'accès, l'heure d'expiration du jeton " +
                                    "d'accès de l'utilisateur, l'heure d'expiration du jeton d'accès de " +
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
                                            "destiné. Par défaut, l'ID client de cette application est " +
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
                                        hint: "Sélectionnez pour crypter le <1>jetons_d'identification</1> " +
                                            "lors de l'émission " +
                                            "du jeton à l'aide de la clé publique de votre application." +
                                            " Pour utiliser le chiffrement, configurez le point de terminaison " +
                                            "JWKS ou le certificat " +
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
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    signing: {
                                        hint: "La liste déroulante contient les algorithmes de signature " +
                                            "<1>id_token</1> pris en charge.",
                                        label: "Algorithme de signature de réponse au jeton d'identification",
                                        placeholder: "Sélectionnez l'algorithme"
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
                            clientAuthentication: {
                                fields: {
                                    authenticationMethod: {
                                        hint: "La liste déroulante contient les méthodes d'authentification client " +
                                            "prises en charge.",
                                        label: "Méthode d'authentification client",
                                        placeholder: "Sélectionnez la méthode"
                                    },
                                    signingAlgorithm: {
                                        hint: "La liste déroulante contient les algorithmes de signature" +
                                            " d'assertions client pris en charge.",
                                        label: "Algorithme de signature",
                                        placeholder: "Sélectionnez l'algorithme"
                                    },
                                    subjectDN: {
                                        label: "Nom de domaine du sujet d'authentification du client TLS"
                                    }
                                },
                                heading: "Authentification client"
                            },
                            pushedAuthorization: {
                                fields: {
                                    requirePushAuthorizationRequest: {
                                        hint: "Sélectionnez cette option pour rendre obligatoire l'envoi par" +
                                            " l'application des demandes d'autorisation sous forme de demandes" +
                                            " d'autorisation poussées.",
                                        label: "Exiger des demandes d'autorisation poussées"
                                    }
                                },
                                heading: "Demandes d'autorisation poussées"
                            },
                            requestObject: {
                                fields: {
                                    requestObjectSigningAlg: {
                                        hint: "La liste déroulante contient les algorithmes de signature d'<1>objet " +
                                            "de requête</1> pris en charge.",
                                        label: "Demander un algorithme de signature d'objet",
                                        placeholder: "Sélectionnez l'algorithme"
                                    },
                                    requestObjectEncryptionAlgorithm: {
                                        hint: "La liste déroulante contient les algorithmes de chiffrement " +
                                            "<1>objet de requête</1> pris en charge.",
                                        label: "Demander un algorithme de chiffrement d'objet",
                                        placeholder: "Sélectionnez l'algorithme"
                                    },
                                    requestObjectEncryptionMethod: {
                                        hint: "La liste déroulante contient les méthodes de chiffrement " +
                                            "<1>objet de requête</1> prises en charge.",
                                        label: "Demander une méthode de chiffrement d'objet",
                                        placeholder: "Sélectionnez la méthode"
                                    }
                                },
                                heading: "Objet de demande"
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
                                    "SAML SSO du connexion résident. L'identifiant de l'entité du " +
                                    "connexion est utilisé comme émetteur de la réponse SAML qui " +
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
                                            "connexion. Les identifiants sont utilisés pour fournir " +
                                            "des informations concernant un utilisateur.",
                                        label: "Format des identifiants",
                                        placeholder: "Saisir le format d'identifiant",
                                        validations: {
                                            empty: "Ceci est un champ obligatoire."
                                        }
                                    },
                                    recipients: {
                                        hint: "Valider les destinataires de la réponse.",
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
                                            "dans lequel le connexion peut inclure les attributs " +
                                            "de l'utilisateur dans les assertions SAML en tant que déclaration " +
                                            "d'attributs.",
                                        label: "Activer"
                                    },
                                    includeAttributesInResponse: {
                                        hint: "Une fois que vous avez coché la case 'Toujours inclure les " +
                                            "attributs dans la réponse' , le connexion incluera " +
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
                                    "demande et le chiffrement des assertions sont désactivés pour continuer.",
                                certificateRemoveConfirmation: {
                                    header: "Supprimer le certificat actuel?",
                                    content: "Définir le type de certificat sur aucun supprimera le certificat " +
                                        "actuel fourni pour cette application. Procéder avec prudence."
                                }
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
                                        hint: "Cela précise si le connexion doit valider " +
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
                                hint: "Saisissez l'identifiant du domaine ws-federation",
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
                            },
                            replyToLogout: {
                                hint: "Saisir l'URL du RP qui gère la réponse à la déconnexion.",
                                label: "URL de la réponse à la déconnexion.",
                                placeholder: "Saisir l'URL de la réponse à la déconnexion.",
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
                                label: "connexion",
                                placeholder: "Sélectionner le connexion",
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
                    spaProtocolSettingsWizard: {
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
                            },
                            urlDeepLinkError: "L'URL saisie n'est pas un lien profond."
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
                                        dynamicClientRegistration: "Enregistrement client dynamique",
                                        endSession: "Se déconnecter",
                                        introspection: "Introspection",
                                        issuer: "Émetteur",
                                        jwks: "JWKS",
                                        keystore: "Key Set",
                                        openIdServer: "Serveur OpenID",
                                        pushedAuthorizationRequest: "Demande d'autorisation poussée",
                                        revoke: "Révoquer",
                                        sessionIframe: "Iframe de session",
                                        token: "Token",
                                        userInfo: "UserInfo",
                                        webFinger: "Web Finger",
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
                                        sso: "Authentification unique",
                                        destinationURL: "URL de destination",
                                        artifactResolutionUrl: "URL de résolution des artefacts"
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
                                },
                                wsFedConfigurations: {
                                    labels: {
                                        passiveSTSUrl: "URL STS passive"
                                    }
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
                        actions: "",
                        name: "Nom",
                        inboundKey: "Clé entrante"
                    },
                    labels: {
                        fragment: "Application partagée"
                    }
                },
                myaccount: {
                    description: "Portail libre-service pour les utilisateurs d'Asgardeo",
                    popup: "Partagez ce lien avec vos utilisateurs pour autoriser" +
                        " l'accès à Mon compte et gérer leurs comptes.",
                    title: "Mon compte",
                    enable: {
                        0: "Activé",
                        1: "Désactivé"
                    },
                    Confirmation: {
                        enableConfirmation: {
                            content: "Le portail Mon compte est en mode aperçu et il est recommandé de le désactiver " +
                                "lorsque votre organisation passe en production.",
                            heading: "Êtes-vous sûr?",
                            message: "Activer le portail Mon compte."
                        },
                        disableConfirmation: {
                            content: "Le portail Mon compte est en mode aperçu et il est recommandé de le désactiver " +
                                "lorsque votre organisation passe en production. Lorsque le portail Mon compte est " +
                                "désactivé, les utilisateurs de votre organisation ne pourront pas y accéder.",
                            heading: "Êtes-vous sûr?",
                            message: "Désactiver le portail Mon compte."
                        }
                    },
                    notifications: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Échec de la mise à jour de l'état du portail Mon compte.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le statut du portail Mon compte a été mis à jour avec succès",
                            message: "Mise à jour réussie"
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
                    }
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
                    authenticationStepDeleteErrorDueToAppShared: {
                        genericError: {
                            description: "Cet authentificateur est requis pour l'application partagée.",
                            message: "Impossible de supprimer cet authentificateur"
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
                    fetchMyAccountApplication: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Impossible de récupérer les détails de l'application Mon compte.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Récupération réussie des détails de l'application Mon compte.",
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
                            description: "Les attributs utilisateur mappés ne peuvent pas être dupliqués.",
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
                    updateIdentifierFirstInFirstStepError: {
                        description: "L'authentificateur Identifier First nécessite plusieurs étapes " +
                            "d'authentification dans le flux de connexion.",
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
            suborganizations: {
                notifications: {
                    tierLimitReachedError: {
                        emptyPlaceholder: {
                            action: "Voir les forfaits",
                            subtitles: "Vous pouvez contacter l'administrateur de l'organisation ou (si vous êtes l'administrateur) " +
                                "mettre à niveau votre abonnement pour augmenter la limite autorisée.",
                            title: "Vous avez atteint le nombre maximum d'organisations autorisées."
                        },
                        heading: "Vous avez atteint la limite maximale pour les organisations"
                    },
                    subOrgLevelsLimitReachedError: {
                        emptyPlaceholder: {
                            action: "Voir les forfaits",
                            subtitles: "Vous pouvez contacter l'administrateur de l'organisation ou (si vous êtes l'administrateur) " +
                                "mettre à niveau votre abonnement pour augmenter la limite autorisée.",
                            title: "Vous avez atteint le nombre maximal de niveaux d'organisation autorisés."
                        },
                        heading: "Vous avez atteint les niveaux d'organisation maximaux autorisés pour l'organisation."
                    },
                    duplicateOrgError: {
                        message: "Une organisation du même nom existe déjà.",
                        description: "L'organisation que vous essayez de créer existe déjà."
                    }
                }
            },
            authenticationProvider: {
                templates: {
                    apple: {
                        wizardHelp: {
                            clientId: {
                                description: "Fournissez l'<1>ID de services</1> créé chez Apple.",
                                heading: "ID de services"
                            },
                            heading: "Aider",
                            keyId: {
                                description: "Fournissez l'<1>identifiant de clé</1> de la clé privée générée.",
                                heading: "ID de clé"
                            },
                            name: {
                                connectionDescription: "Fournissez un nom unique pour la connexion.",
                                idpDescription: "Fournissez un nom unique pour le connexion.",
                                heading: "Nom"
                            },
                            preRequisites: {
                                configureAppleSignIn: "Consultez le guide d'Apple sur la configuration de votre" +
                                    " environnement pour Se connecter avec Apple.",
                                configureReturnURL: "Ajoutez l'URL suivante en tant qu'<1>URL de retour</1>.",
                                configureWebDomain: "Utilisez ce qui suit comme <1>domaine Web</1>.",
                                getCredentials: "Avant de commencer, créez une application compatible" +
                                    " <1>Connexion avec Apple</1> sur le <3>programme pour développeurs Apple</3>" +
                                    " avec un <5>identifiant de services</5> et une <5>clé privée</5>.",
                                heading: "Prérequis"
                            },
                            privateKey: {
                                description: "Fournissez la <1>clé privée</1> générée pour l'application.",
                                heading: "Clé privée"
                            },
                            subHeading: "Utilisez le guide ci-dessous.",
                            teamId: {
                                description: "Fournissez l'<1>identifiant d'équipe</1> du développeur Apple.",
                                heading: "ID d'équipe"
                            }
                        }
                    },
                    enterprise: {
                        addWizard: {
                            subtitle: "Configurez un connexion pour se connecter avec des " +
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
                    },
                    trustedTokenIssuer: {
                        addWizard: {
                            title: "Émetteur de jeton de confiance",
                            subtitle: "Enregistrez un émetteur de jeton de confiance pour échanger son jeton contre " +
                                "un jeton émis par Asgardeo"
                        },
                        forms: {
                            steps: {
                                general: "réglages généraux",
                                certificate: "Certificats"
                            },
                            name: {
                                label: "Nom de l'émetteur de jeton de confiance",
                                placeholder: "Enter a name for the trusted token isser"
                            },
                            issuer: {
                                label: "Émettrice",
                                placeholder: "Entrez l'émetteur",
                                hint: "Une valeur d'émetteur unique de l'émetteur de jeton de confiance.",
                                validation: {
                                    notValid: "{{issuer}} n'est pas un émetteur valide."
                                }
                            },
                            alias: {
                                label: "alias",
                                placeholder: "Entrez l'alias",
                                hint: "Valeur d'alias pour {{productName}} dans l'émetteur de jeton de confiance.",
                                validation: {
                                    notValid: "{{alias}} n'est pas un alias valide."
                                }
                            },
                            certificateType: {
                                label: "Mode de configuration de certificat",
                                requiredCertificate: "Un certificat est nécessaire pour créer un émetteur de jeton de confiance."
                            },
                            jwksUrl: {
                                optionLabel: "Point de terminaison JWKS",
                                placeholder: "Entrez l'URL de point de terminaison JWKS",
                                label: "URL de point de terminaison JWKS",
                                hint: "Asgardeo utilisera cette URL pour obtenir des clés pour vérifier les réponses " +
                                    "signées de Votre émetteur de jeton de confiance.",
                                validation: {
                                    notValid: "Veuillez saisir une URL valide"
                                }
                            },
                            pem: {
                                optionLabel: "Utiliser le certificat PEM",
                                hint: "Asgardeo utilisera ce certificat pour vérifier les réponses signées de "+
                                    "Votre émetteur de jeton de confiance.",
                                uploadCertificateButtonLabel: "Télécharger le fichier de certificat",
                                dropzoneText: "Faites glisser et déposez un fichier de certificat ici.",
                                pasteAreaPlaceholderText: "Coller Certificat d'émetteur de jeton de confiance au " +
                                    "format PEM."
                            }
                        }
                    },
                    expert: {
                        wizardHelp: {
                            description: {
                                connectionDescription: "Fournir un nom unique pour la connexion.",
                                heading: "Nom",
                                idpDescription: "Fournir un nom unique pour le connexion."
                            },
                            heading: "Aider",
                            name: {
                                connectionDescription: "Fournissez une description de la connexion pour en expliquer plus à ce sujet.",
                                heading: "La description",
                                idpDescription: "Fournir une description au connexion pour en expliquer davantage."
                            },
                            subHeading: "Utilisez le guide ci-dessous"
                        }
                    },
                    organizationIDP: {
                        wizardHelp: {
                            name: {
                                description: "Fournissez un nom unique au fournisseur d'authentification d'entreprise" +
                                    " afin qu'il puisse être facilement identifié.",
                                heading: "Nom"
                            },
                            description: {
                                description: "Fournissez une description du fournisseur d'authentification" +
                                    " d'entreprise pour en savoir plus à ce sujet.",
                                heading: "La description",
                                example: "Par exemple, il s'agit de l'authentificateur pour MyOrg, qui agit en tant" +
                                    " qu'IDP pour MyApp."
                            }
                        }
                    }
                },
                wizards: {
                    addAuthenticator: {
                        header: "Remplissez les informations de base sur l'authentificateur.",
                        steps: {
                            authenticatorConfiguration: {
                                title: "Configuration d'authentificateur"
                            },
                            authenticatorSelection: {
                                manualSetup: {
                                    subTitle: "Ajoutez un nouvel authentificateur avec des configurations personnalisées.",
                                    title: "Configuration manuelle"
                                },
                                quickSetup: {
                                    subTitle: "Modèles d'authentificateur prédéfinis pour accélérer le processus.",
                                    title: "Installation rapide"
                                },
                                title: "Sélection des authentificateurs"
                            },
                            authenticatorSettings: {
                                emptyPlaceholder: {
                                    subtitles: [
                                        "Cet authentificateur n'a aucun paramètre disponible pour être",
                                        "configuré à ce niveau.Cliquez simplement sur <11> Terminer </1>."
                                    ],
                                    title: "Aucun paramètre disponible pour cet authentificateur."
                                }
                            },
                            summary: {
                                title: "Sommaire"
                            }
                        }
                    },
                    addIDP: {
                        header: "Remplissez les informations de base sur le connexion.",
                        steps: {
                            authenticatorConfiguration: {
                                title: "Configuration d'authentificateur"
                            },
                            generalSettings: {
                                title: "Réglages généraux"
                            },
                            provisioningConfiguration: {
                                title: "Configuration de l'approvisionnement"
                            },
                            summary: {
                                title: "Sommaire"
                            }
                        }
                    },
                    addProvisioningConnector: {
                        header: "Remplissez les informations de base sur le connecteur d'approvisionnement.",
                        steps: {
                            connectorConfiguration: {
                                title: "Détails du connecteur"
                            },
                            connectorSelection: {
                                defaultSetup: {
                                    subTitle: "Sélectionnez le type du nouveau connecteur d'approvisionnement sortant",
                                    title: "Types de connecteur"
                                },
                                title: "Sélection du connecteur"
                            },
                            summary: {
                                title: "Sommaire"
                            }
                        }
                    },
                    buttons: {
                        finish: "Finir",
                        next: "Prochaine",
                        previous: "Précédente"
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
                    addIDP: "Nouveau connexion"
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
                        content: "Si vous supprimez ce connexion, vous ne pourrez pas le récupérer. " +
                            "Veuillez procéder avec prudence.",
                        header: "Etes-vous sûr ?",
                        message: "Cette action est irréversible et supprimera définitivement l'IDP."
                    },
                    deleteIDPWithConnectedApps: {
                        assertionHint: "",
                        content: "Supprimez les associations de ces applications avant de supprimer:",
                        header: "Impossible de supprimer",
                        message: "Il existe des applications utilisant ce connexion."
                    }
                },
                connectedApps: {
                    action: "Aller à la méthode de connexion",
                    header: "Applications connectées de {{idpName}}",
                    subHeader: "Les applications connectées à {{idpName}} sont listées ici.",
                    placeholders: {
                        search: "Rechercher par nom d'application",
                        emptyList: "Il n'y a pas d'applications connectées à {{idpName}} pour le moment."
                    },
                    applicationEdit: {
                        back: "Revenir à {{idpName}}"
                    },
                    genericError: {
                        description: "Une erreur s'est produite lors de la tentative de récupération des applications connectées.",
                        message: "Erreur est survenue."
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
                            hint: "Vérifiez si cela pointe vers un hub de connexion",
                            label: "Hub de fédération"
                        },
                        homeRealmIdentifier: {
                            hint: "Entrez l'identifiant du domaine d'identité pour ce connexion",
                            label: " Identifiant du domaine local",
                            placeholder: "Entrez la valeur de l'identifiant du royaume d'origine."
                        },
                        implicitAssociation: {
                            enable: {
                                label: "Association implicite des comptes",
                                hint: "Lors de l'échange de jetons, si un compte local correspondant est trouvé," +
                                    " il sera lié implicitement"
                            },
                            attributes: {
                                label: "Sélectionnez les attributs à vérifier",
                                hint: "Sélectionnez jusqu'à trois attributs qui seront utilisés pour vérifier si" +
                                    " il existe un compte utilisateur local correspondant",
                                placeholder: "Aucun attribut sélectionné"
                            },
                            warning: "Assurez-vous que les attributs sélectionnés sont vérifiés par l'émetteur du jeton"
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
                            attributeMapColumnHeader: "Attribut du connexion",
                            attributeMapInputPlaceholderPrefix: "ex : attribut IdP pour ",
                            componentHeading: "Association des attributs",
                            hint: "Ajouter des attributs pris en charge par le connexion",
                            placeHolder: {
                                title: "Aucun attribut mappé trouvé",
                                subtitle: "Aucun attribut mappé n'a été ajouté pour cette connexion pour le moment.",
                                action: "Ajouter un mappage d'attributs"
                            },
                            attributeMapTable: {
                                mappedAttributeColumnHeader: "Attribut mappé",
                                externalAttributeColumnHeader: "Attribut IdP externe"
                            },
                            heading: "Mappages d'attributs de connexion",
                            subheading: "Ajoutez et mappez les attributs pris en charge à partir du connexion externe.",
                            search: {
                                placeHolder: "Rechercher des attributs mappés"
                            },
                            attributeDropdown: {
                                label: "Cartes à",
                                placeHolder: "Sélectionnez l'attribut de mappage",
                                noResultsMessage: "Essayez une autre recherche d'attribut."
                            },
                            externalAttributeInput: {
                                label: "Attribut IdP externe",
                                placeHolder: "Saisir l'attribut IdP externe",
                                existingErrorMessage: "Il existe déjà un attribut mappé avec ce nom."
                            },
                            addAttributeButtonLabel: "Ajouter un mappage d'attributs",
                            modal: {
                                header: "Ajouter des mappages d'attributs",
                                placeholder: {
                                    title: "Vous n'avez sélectionné aucun attribut",
                                    subtitle: "Mappez les attributs et cliquez sur Ajouter un mappage d'attributs pour commencer."
                                }
                            }
                        },
                        attributeProvisioning: {
                            attributeColumnHeader: {
                                0: "Attribut",
                                1: "Attribut du connexion"
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
                            hint: "Une URL pour récupérer l'image du connexion.",
                            label: "URL du connexion",
                            placeholder: "Par exemple: https://example.com/image.png"
                        },
                        name: {
                            hint: "Saisissez un nom unique pour cette connexion.",
                            label: "Nom du connexion",
                            placeholder: "Saisissez un nom unique pour cette connexion.",
                            validations: {
                                duplicate: "Un connexion existe déjà avec ce nom",
                                empty: "Le nom du connexion est requis",
                                maxLengthReached: "Le nom du connexion ne peut pas contenir plus " +
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
                                " connexion doivent être mandatés.",
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
                        hint: "Sélectionner et ajouter des rôles à approvisionner vers le connexion",
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
                        valueName: "Rôle du connexion"
                    },
                    uriAttributeSettings: {
                        role: {
                            heading: "Rôle",
                            hint: "Spécifie l'attribut qui identifie les rôles chez le connexion.",
                            label: "Attribut de rôle",
                            placeHolder: "Rôle par défaut",
                            validation: {
                                empty: "Veuillez sélectionner un attribut pour le rôle"
                            }
                        },
                        subject: {
                            heading: "Sujet",
                            hint: "Spécifie l'attribut qui identifie l'utilisateur auprès du connexion",
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
                        subTitle: "Ajouter un nouvel authentificateur au connexion : {{ idpName }}",
                        title: "Ajouter un nouvel authentificateur"
                    },
                    addCertificate: {
                        subTitle: "Ajouter un nouveau certificat au connexion : {{ idpName }}",
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
                            message: "Échec de la création du connexion"
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
                            message: "Erreur de suppression du connexion"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du connexion",
                            message: "Erreur de suppression du connexion"
                        },
                        success: {
                            description: "Suppression réussie du connexion",
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
                                "connexion",
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
                                "du connexion.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie du certificat du connexion.",
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
                            1: "Vous pouvez ajouter un nouveau connexion facilement en suivant les",
                            2: "étapes de l'assistant de création de fournisseurs d'identité."
                        },
                        title: "Ajouter un nouveau connexion"
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
                        subHeading: "Créer un connexion avec des configurations personnalisées."
                    },
                    quickSetup: {
                        heading: "Installation rapide",
                        subHeading: "Ensemble prédéfini de modèles pour accélérer la création de " +
                            "votre connexion."
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
            idvp: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterValue: {
                                placeholder: "Saisissez la valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Rechercher par nom"
                },
                buttons: {
                    addIDVP: "Nouveau fournisseur de vérification d'identité"
                },
                placeholders: {
                    emptyIDVPList: {
                        subtitles: {
                            0: "Il n'y a pas de fournisseurs de vérification d'identité disponibles pour le moment.",
                            1: "Vous pouvez facilement ajouter un nouveau fournisseur de vérification d'identité en " +
                                "suivant les",
                            2: "étapes de l'assistant de création du fournisseur de vérification d'identité."
                        },
                        title: "Ajouter un nouveau fournisseur de vérification d'identité"
                    },
                    emptyIDVPTypeList: {
                        subtitles: {
                            0: "Il n'y a actuellement aucun type de fournisseur de vérification ",
                            1: "d'identité disponible pour la configuration."
                        },
                        title: "Aucun type de fournisseur de vérification d'identité trouvé"
                    }
                },
                confirmations: {
                    deleteIDVP: {
                        assertionHint: "Veuillez confirmer votre action",
                        content: "Si vous supprimez ce fournisseur de vérification d'identité, vous ne pourrez pas " +
                            "le récupérer. Veuillez procéder avec prudence.",
                        header: "Es-tu sûr?",
                        message: "Cette action est irréversible et supprimera définitivement le fournisseur de " +
                            "vérification d'identité."
                    }
                },
                notifications: {
                    getIDVPList: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des fournisseurs de " +
                                "vérification d'identité.",
                            message: "Erreur de récupération"
                        }
                    },
                    deleteIDVP: {
                        error: {
                            description: "{{ description }}",
                            message: "Supprimer l'erreur"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la suppression du fournisseur de " +
                                "vérification d'identité.",
                            message: "Supprimer l'erreur"
                        },
                        success: {
                            description: "Le fournisseur de vérification d'identité a bien été supprimé.",
                            message: "Suppression réussie"
                        }
                    },
                    updateIDVP: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de mise à jour"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour du fournisseur de " +
                                "vérification d'identité.",
                            message: "Erreur de mise à jour"
                        },
                        success: {
                            description: "Le fournisseur de vérification d'identité a bien été mis à jour.",
                            message: "Mise à jour réussie"
                        }
                    },
                    addIDVP: {
                        error: {
                            description: "{{ description }}",
                            message: "Créer une erreur"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la création du fournisseur de " +
                                "vérification d'identité.",
                            message: "Créer une erreur"
                        },
                        success: {
                            description: "Le fournisseur de vérification d'identité a bien été créé.",
                            message: "Créez avec succès"
                        }
                    },
                    submitAttributeSettings: {
                        error: {
                            description: "Nécessité de configurer toutes les propriétés obligatoires.",
                            message: "Impossible d'effectuer la mise à jour"
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
                        }
                    },
                    getIDVP: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des données du " +
                                "fournisseur de vérification d'identité",
                            message: "Erreur de récupération"
                        }
                    },
                    getUIMetadata: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des métadonnées de " +
                                "l'interface utilisateur.",
                            message: "Erreur de récupération"
                        }
                    },
                    getIDVPTemplateTypes: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des types de modèles " +
                                "auprès du fournisseur de vérification d'identité.",
                            message: "Erreur de récupération"
                        }
                    },
                    getIDVPTemplateType: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de Récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du type de modèle auprès" +
                                " du fournisseur de vérification d'identité.",
                            message: "Erreur de Récupération"
                        }
                    },
                    getIDVPTemplate: {
                        error: {
                            description: "{{ description }}",
                            message: "Erreur de Récupération"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du modèle du fournisseur " +
                                "de vérification d'identité.",
                            message: "Erreur de Récupération"
                        }
                    }
                },
                forms: {
                    generalDetails: {
                        description: {
                            hint: "Une description textuelle du fournisseur de vérification d'identité.",
                            label: "Description",
                            placeholder: "Entrez une description du fournisseur de vérification d'identité."
                        },
                        name: {
                            hint: "Entrez Un nom unique pour ce fournisseur de vérification d'identité.",
                            label: "Nom",
                            placeholder: "Entrez un nom pour le fournisseur de vérification d'identité.",
                            validations: {
                                duplicate: "Un fournisseur de vérification d'identité existe déjà avec ce nom",
                                empty: "Le nom du fournisseur de vérification d'identité est requis",
                                maxLengthReached: "Le nom du fournisseur de vérification d'identité ne peut pas " +
                                    "dépasser {{ maxLength }} caractères.",
                                required: "Le nom du fournisseur de vérification d'identité est requis",
                                invalid: "Le nom du fournisseur de vérification d'identité n'est pas valide"
                            }
                        }
                    },
                    attributeSettings: {
                        attributeMapping: {
                            heading: "Mapping des attributs du fournisseur de vérification d'identité",
                            hint: "Ajoutez et mappez les attributs pris en charge par le fournisseur externe " +
                                "de vérification d'identité.",
                            addButton: "Ajouter un mappage d'attributs",
                            emptyPlaceholderEdit: {
                                subtitle: "Aucun attribut n'est associé à ce fournisseur de vérification d'identité.",
                                title: "Aucun attribut associé"
                            },
                            emptyPlaceholderCreate: {
                                subtitle: "Associez les attributs sur la carte et cliquez sur <1>Ajouter un mappage " +
                                    "d'attributs</1> pour commencer.",
                                title: "Vous n'avez associé aucun attribut"
                            }
                        },
                        attributeMappingListItem: {
                            validation: {
                                duplicate: "Il existe déjà un attribut mapé avec ce nom.",
                                required: "Ce champ ne peut pas être vide",
                                invalid: "Veuillez entrer une valeur valide"
                            },
                            placeholders: {
                                mappedValue: "Saisissez l'attribut IDVP externe",
                                localClaim: "Sélectionnez l'attribut de mappage"
                            },
                            labels: {
                                mappedValue: "Attribut IDVP externe",
                                localClaim: "Mappe à"
                            }
                        },
                        attributeSelectionModal: {
                            header: "Ajouter des mappages d'attributs"
                        }
                    }
                },
                dangerZoneGroup: {
                    deleteIDVP: {
                        actionTitle: "Supprimer",
                        header: "Supprimer le fournisseur de vérification d'identité",
                        subheader: "Il s'agit d'une action irréversible, procédez avec prudence."
                    },
                    disableIDVP: {
                        actionTitle: "{{ state }} Fournisseur de vérification d'identité",
                        header: "Fournisseur de vérification d'identité {{ state }}",
                        subheader: "Une fois que vous avez désactivé un fournisseur de vérification d'identité, " +
                            "il ne peut plus être utilisé tant qu'il n'est pas réactivé.",
                        subheader2: "Activez le fournisseur de vérification d'identité pour l'utiliser avec vos " +
                            "applications."
                    },
                    header: "Zone de Danger"
                },
                list: {
                    actions: "Actions",
                    name: "Nom"
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
                    identityProviders: "Fournisseurs d'identité",
                    identityVerificationProviders: "Fournisseurs de vérification d'identité"
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
                alternateSubTitle: "Gérez vos applications et personnalisez les flux de connexion.",
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
                title: "Sélectionnez le connexion"
            },
            idvp: {
                subTitle: "Gérez les fournisseurs de vérification d'identité pour permettre aux utilisateurs de " +
                "vérifier leur identité via eux.",
                title: "Fournisseurs de vérification d'identité"
            },
            idvpTemplate: {
                backButton: "Retourner aux fournisseurs de vérification d'identité",
                subTitle: "Choisissez l'un des fournisseurs de vérification d'identité suivants.",
                title: "Sélectionnez le fournisseur de vérification d'identité",
                "search": {
                    "placeholder": "Recherche par nom"
                }
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
    loginFlow: {
        adaptiveLoginFlowSelectConfirmationModal: {
            content: "Le modèle sélectionné remplacera le script existant dans l'éditeur ainsi que les étapes de connexion que vous avez configurées.Cliquez sur <1> Confirmer </1> pour continuer.",
            heading: "Es-tu sûr?",
            message: "Cette action est irréversible."
        },
        basicLoginFlowSelectConfirmationModal: {
            content: "Le modèle sélectionné remplacera les étapes de connexion existantes que vous avez configurées.Cliquez sur <1> Confirmer </1> pour continuer.",
            heading: "Es-tu sûr?",
            message: "Cette action est irréversible."
        },
        options: {
            controls: {
                remove: "Retirer"
            },
            displayName: "Connectez-vous avec {{displayName}}",
            divider: "OU"
        },
        modes: {
            legacy: {
                label: "Rédacteur en chef"
            },
            visual: {
                label: "Éditeur visuel"
            },
            switchConfirmationModal: {
                assertionHint: "Oui je comprends.Je veux changer.",
                content: "Cette action est irréversible et vous perdrez en permanence les changements non sauvés du flux de courant.",
                primaryActionButtonText: "Confirmer",
                secondaryActionButtonText: "Annuler",
                title: "Es-tu sûr?",
                warningMessage: "Si vous passez à la <1>{{mode}}</1>, vous perdez les changements non sauvés du flux de courant.Veuillez procéder avec prudence."
            }
        },
        nodes: {
            controls: {
                attributeSelector: {
                    label: "Choisissez les attributs de cette étape"
                },
                enableBackupCodes: {
                    label: "Activer les codes de sauvegarde"
                },
                userAttributeSelector: {
                    label: "Choisissez l'identifiant de l'utilisateur à partir de cette étape"
                }
            },
            emailOTP: {
                controls: {
                    optionRemoveTooltipContent: "Retirer"
                },
                form: {
                    actions: {
                        primary: "Continuer",
                        secondary: "Renvoyer le code"
                    },
                    fields: {
                        code: {
                            label: "Entrez le code envoyé à votre identifiant de messagerie (John****@gmail.com)",
                            placeholder: ""
                        }
                    }
                },
                header: "Vérification OTP"
            },
            identifierFirst: {
                controls: {
                    optionRemoveTooltipContent: "Retirer",
                    optionSwitchTooltipContent: "Passez au nom d'utilisateur et au mot de passe"
                },
                form: {
                    actions: {
                        primary: "S'identifier"
                    },
                    fields: {
                        rememberMe: {
                            label: "Se souvenir de moi sur cet ordinateur"
                        },
                        username: {
                            label: "Nom d'utilisateur",
                            placeholder: "Entrez votre nom d'utilisateur"
                        }
                    }
                },
                header: "S'identifier"
            },
            signIn: {
                controls: {
                    optionRemoveTooltipContent: "Retirer",
                    optionSwitchTooltipContent: "Passez d'abord à l'identifiant"
                },
                form: {
                    actions: {
                        primary: "S'identifier"
                    },
                    fields: {
                        password: {
                            label: "Mot de passe",
                            placeholder: "Tapez votre mot de passe"
                        },
                        rememberMe: {
                            label: "Se souvenir de moi sur cet ordinateur"
                        },
                        username: {
                            label: "Nom d'utilisateur",
                            placeholder: "Entrez votre nom d'utilisateur"
                        }
                    }
                },
                header: "S'identifier"
            },
            smsOTP: {
                controls: {
                    optionRemoveTooltipContent: "Retirer"
                },
                form: {
                    actions: {
                        primary: "Continuer",
                        secondary: "Renvoyer le code"
                    },
                    fields: {
                        code: {
                            label: "Entrez le code envoyé à votre téléphone mobile (****** 3830)",
                            placeholder: ""
                        }
                    }
                },
                header: "Vérification OTP"
            },
            totp: {
                controls: {
                    optionRemoveTooltipContent: "Retirer"
                },
                form: {
                    actions: {
                        primary: "Continuer"
                    },
                    fields: {
                        code: {
                            label: "Entrez le code de vérification généré par votre application Authenticator.",
                            placeholder: ""
                        }
                    },
                    help: "Vous n'avez pas encore configuré votre authentificateur TOTP?Contactez le support"
                },
                header: "Vérifiez Votre Identité"
            },
            activeSessionsLimit: {
                controls: {
                    optionRemoveTooltipContent: "Retirer"
                },
                form: {
                    sessions: {
                        browserLabel: "Navigateur",
                        lastAccessedLabel: "Dernier accès"
                    },
                    help: "Terminez les sessions actives pour continuer."
                },
                header: "Plusieurs sessions actives trouvées"
            }
        },
        revertConfirmationModal: {
            assertionHint: "Oui je comprends.Je veux revenir.",
            content: "Cette action est irréversible et vous perdrez en permanence les progrès que vous avez réalisés.",
            primaryActionButtonText: "Confirmer",
            secondaryActionButtonText: "Annuler",
            title: "Es-tu sûr?",
            warningMessage: "Si vous revenez à la valeur par défaut, vous ne pourrez pas récupérer les progrès.Veuillez procéder avec prudence."
        },
        steps: {
            controls: {
                addOption: "Ajouter l'option de connexion",
                remove: "Retirer",
                signUp: {
                    hint: "Vous n'avez pas de compte?",
                    label: "S'inscrire"
                }
            }
        },
        predefinedFlows: {
            adaptive: {
                actions: {
                    add: "AJOUTER"
                },
                header: "Flux de connexion conditionnels"
            },
            authenticators: {
                apple: {
                    displayName: "Apple"
                },
                facebook: {
                    displayName: "Facebook"
                },
                github: {
                    displayName: "GitHub"
                },
                google: {
                    displayName: "Google"
                },
                microsoft: {
                    displayName: "Microsoft"
                }
            },
            basic: {
                header: "Flux de connexion de base"
            },
            categories: {
                basic: {
                    label: "Ajouter la connexion de base"
                },
                mfa: {
                    label: "Ajouter la connexion multi-facteurs"
                },
                passwordless: {
                    label: "Ajouter la connexion sans mot de passe"
                },
                social: {
                    label: "Ajouter la connexion sociale"
                }
            },
            header: "Flux prédéfinis",
            panelHeader: "Flux prédéfinis"
        },
        scriptEditor: {
            panelHeader: "Éditeur de script",
            secretSelector: {
                actions: {
                    create: {
                        label: "Créer un nouveau secret"
                    }
                },
                emptyPlaceholder: {
                    header: "Pas de secrets disponibles.",
                    description: "Stockez en toute sécurité les clés d'accès comme des secrets.Un secret peut remplacer le secret du consommateur dans <1> Callchoreo () </1> dans les scripts d'authentification conditionnels."
                },
                label: "Ajouter le secret"
            },
            themes: {
                dark: {
                    label: "Dark (Visual Studio)"
                },
                highContrast: {
                    label: "Contraste élevé"
                },
                light: {
                    label: "Light (Visual Studio)"
                }
            }
        },
        visualEditor: {
            actions: {
                revert: {
                    label: "Revenir à la valeur par défaut"
                },
                update: {
                    label: "Mise à jour"
                }
            }
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
                            invalid: "Un nom {{type}} ne peut contenir que des caractères alphanumériques, - et _. " +
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
                        tenantContent: "Cela supprimera définitivement le certificat d'locataire. Une fois" +
                            " supprimé, à moins que vous n'importiez un nouveau certificat d'locataire, vous ne" +
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
                        addCertificate: {
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
                    axschema: {
                        description: "Représentation du schéma d'échange d'attributs (axschema) "
                            + "pour les attributs utilisateur.",
                        heading: "Schéma d'échange d'attributs"
                    },
                    custom: {
                        description: "Représentation de protocole personnalisé pour les " +
                            "attributs utilisateur qui seront utilisés dans l'API personnalisée.",
                        heading: "Attributs personnalisés"
                    },
                    eidas: {
                        description: "La représentation du protocole eIDAS pour les attributs utilisateur.",
                        heading: "eIDAS"
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
                                        + "alphanumériques et _. Et doit avoir une longueur comprise "
                                        + "entre 3 et 30 caractères."
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
                        },
                        fetchSCIMResource: {
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des ressources SCIM.",
                                message: "Quelque chose s'est mal passé"
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
                            placeholder: "Entrez le nom d'affichage",
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
                        requiredWarning: "Pour que l'attribut d'e-mail ne s'affiche pas et ne soit pas " +
                            "requis sur le profil de l'utilisateur, vous devez désactiver la vérification " +
                            "de compte pour votre organisation",
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
                    },
                    saveChangesButton: "Sauvegarder les modifications"
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
                goBackLoginAndRegistration: "Revenez à la connexion et à l'enregistrement",
                categories: "Catégories",
                connectorSubHeading: "Configurer les paramètre {{ name }}.",
                connectorCategories: {
                    passwordPolicies: {
                        name: "Politiques de mot de passe",
                        description: "Configurer les stratégies de mot de passe pour améliorer la force du mot de passe utilisateur.",
                        connectors: {
                            passwordExpiry: {
                                friendlyName: "Expiration du mot de passe"
                            },
                            passwordHistory: {
                                friendlyName: "Historique du mot de passe",
                                properties: {
                                    passwordHistoryEnable: {
                                        hint: "L'utilisateur ne sera pas autorisé à utiliser les mots de passe précédemment utilisés.",
                                        label: "Valider l'historique des mots de passe"
                                    },
                                    passwordHistoryCount: {
                                        hint: "Restreindre l'utilisation de ce nombre de derniers mots de passe utilisés pendant la mise à jour du mot de passe.",
                                        label: "Compte de validation de l'historique des mots de passe"
                                    }
                                }
                            },
                            passwordPolicy: {
                                friendlyName: "Modèles de mot de passe",
                                properties: {
                                    passwordPolicyEnable: {
                                        hint: "Valider les mots de passe utilisateur contre une politique",
                                        label: "Valider les mots de passe en fonction d'un modèle de stratégie"
                                    },
                                    passwordPolicyMinLength: {
                                        hint: "Nombre minimum de caractères dans le mot de passe.",
                                        label: "Nombre minimum de caractères"
                                    },
                                    passwordPolicyMaxLength: {
                                        hint: "Nombre maximum de caractères dans le mot de passe.",
                                        label: "Nombre maximum de caractères"
                                    },
                                    passwordPolicyPattern: {
                                        hint: "Le modèle d'expression régulière pour valider le mot de passe.",
                                        label: "Motif de mot de passe regex"
                                    },
                                    passwordPolicyErrorMsg: {
                                        hint: "Ce message d'erreur sera affiché lorsqu'une violation de modèle est détectée.",
                                        label: "Message d'erreur sur la violation du modèle"
                                    }
                                }
                            }
                        }
                    },
                    userOnboarding: {
                        name: "Intégration de l'utilisateur",
                        description: "Configurer les paramètres d'intégration de l'utilisateur.",
                        connectors: {
                            askPassword: {
                                friendlyName: "Inviter l'utilisateur à définir le mot de passe"
                            },
                            selfSignUp: {
                                friendlyName: "Auto-inscription",
                                properties: {
                                    selfRegistrationEnable: {
                                        hint: "Autoriser les utilisateurs à s'inscrire au système.",
                                        label: "Auto-inscription utilisateur"
                                    },
                                    selfRegistrationLockOnCreation: {
                                        hint: "Verrouillez le compte d'utilisateur auto-enregistré jusqu'à la vérification par e-mail.",
                                        label: "Verrouiller le compte d'utilisateur sur la création"
                                    },
                                    selfRegistrationSendConfirmationOnCreation: {
                                        hint: "Activer la confirmation du compte utilisateur lorsque le compte d'utilisateur n'est pas verrouillé sur la création",
                                        label: "Activer la confirmation du compte sur la création"
                                    },
                                    selfRegistrationNotificationInternallyManage: {
                                        hint: "Désactiver si la demande client gère la notification envoyée",
                                        label: "Gérer les notifications envoyées en interne"
                                    },
                                    selfRegistrationReCaptcha: {
                                        hint: "Activer la vérification de recaptcha pendant l'auto-enregistrement.",
                                        label: "Recaptcha rapide"
                                    },
                                    selfRegistrationVerificationCodeExpiryTime: {
                                        hint: "Spécifiez le temps d'expiration en quelques minutes pour le lien de vérification.",
                                        label: "Lien de vérification de l'auto-enregistrement des utilisateurs Temps d'expiration"
                                    },
                                    selfRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: "Spécifiez le temps d'expiration en quelques minutes pour le SMS OTP.",
                                        label: "SMS d'auto-enregistrement des utilisateurs OTP Temps d'expiration"
                                    },
                                    selfRegistrationSmsotpRegex: {
                                        hint: "Regex pour SMS OTP au format [caractères autorisés] {longueur}.Les gammes de caractères prises en charge sont A-Z, A-Z, 0-9.La longueur minimale de OTP est 4",
                                        label: "SMS d'auto-enregistrement des utilisateurs otp regex"
                                    },
                                    selfRegistrationCallbackRegex: {
                                        hint: "Ce préfixe sera utilisé pour valider l'URL de rappel.",
                                        label: "URL de rappel d'auto-enregistrement utilisateur Regex"
                                    },
                                    urlListPurposeSelfSignUp: {
                                        hint: "Cliquez ici pour gérer les objectifs d'auto-signature",
                                        label: "Gérer les objectifs d'auto-signature"
                                    },
                                    selfRegistrationNotifyAccountConfirmation: {
                                        hint: "Activer l'envoi de notification pour la confirmation d'auto-inscription.",
                                        label: "Envoyer un e-mail de confirmation d'inscription"
                                    },
                                    selfRegistrationResendConfirmationReCaptcha: {
                                        hint: "Vérification RecaptCha rapide pour la confirmation de renvoi",
                                        label: "Recaptcha rapide sur la confirmation de re-end"
                                    },
                                    selfRegistrationAutoLoginEnable: {
                                        hint: "L'utilisateur sera connecté automatiquement après avoir terminé la confirmation du compte",
                                        label: "Activer la connexion automatique après la confirmation du compte"
                                    },
                                    selfRegistrationAutoLoginAliasName: {
                                        hint: "Alias de la clé utilisée pour signer au cookie.La clé publique doit être importée sur le stade de clés.",
                                        label: "Alias de la clé utilisée pour signer au cookie"
                                    }
                                }
                            },
                            liteUserSignUp: {
                                friendlyName: "Enregistrement de l'utilisateur Lite",
                                properties: {
                                    liteRegistrationEnable: {
                                        hint: "Autoriser les utilisateurs à s'inscrire au système sans mot de passe.",
                                        label: "Enregistrement de l'utilisateur Lite"
                                    },
                                    liteRegistrationLockOnCreation: {
                                        hint: "Verrouillez le compte d'utilisateur auto-enregistré jusqu'à la vérification par e-mail.",
                                        label: "Verrouiller le compte d'utilisateur sur la création"
                                    },
                                    liteRegistrationNotificationInternallyManage: {
                                        hint: "Désactiver si la demande client gère la notification envoyée",
                                        label: "Gérer les notifications envoyées en interne"
                                    },
                                    liteRegistrationReCaptcha: {
                                        hint: "Activer la vérification de Recaptcha pendant l'auto-enregistrement.",
                                        label: "Recaptcha rapide"
                                    },
                                    liteRegistrationVerificationCodeExpiryTime: {
                                        hint: "Spécifiez le temps d'expiration en quelques minutes pour le lien de vérification.",
                                        label: "Lite des utilisateurs d'enregistrement des utilisateurs lien d'expiration du lien d'expiration"
                                    },
                                    liteRegistrationVerificationCodeSmsotpExpiryTime: {
                                        hint: "Spécifiez le temps d'expiration en quelques minutes pour le SMS OTP.",
                                        label: "Enregistrement des utilisateurs Lite SMS OTP Temps d'expiration"
                                    },
                                    liteRegistrationSmsotpRegex: {
                                        hint: "Regex pour SMS OTP au format [caractères autorisés] {longueur}.Les gammes de caractères prises en charge sont A-Z, A-Z, 0-9.La longueur minimale de OTP est 4",
                                        label: "Enregistrement des utilisateurs Lite SMS OTP Regex"
                                    },
                                    liteRegistrationCallbackRegex: {
                                        hint: "Ce préfixe sera utilisé pour valider l'URL de rappel.",
                                        label: "URL de rappel d'enregistrement de l'utilisateur Lite Regex"
                                    },
                                    urlListPurposeLiteUserSignUp: {
                                        hint: "Cliquez ici pour gérer les objectifs de sign",
                                        label: "Gérer les objectifs lite-sign"
                                    }
                                }
                            },
                            userEmailVerification: {
                                friendlyName: "Demander le mot de passe",
                                properties: {
                                    emailVerificationEnable: {
                                        hint: "Une notification de vérification sera déclenchée pendant la création d'utilisateurs.",
                                        label: "Activer la vérification de l'e-mail utilisateur"
                                    },
                                    emailVerificationLockOnCreation: {
                                        hint: "Le compte d'utilisateur sera verrouillé pendant la création d'utilisateurs.",
                                        label: "Activer le verrouillage du compte sur la création"
                                    },
                                    emailVerificationNotificationInternallyManage: {
                                        hint: "Désactiver si la demande client gère la notification envoyée.",
                                        label: "Gérer les notifications envoyées en interne"
                                    },
                                    emailVerificationExpiryTime: {
                                        hint: "Réglez la durée que l'e-mail de vérification serait valide, en quelques minutes.(Pour une période de validité infinie, réglé -1)",
                                        label: "Code de vérification par e-mail Heure d'expiration"
                                    },
                                    emailVerificationAskPasswordExpiryTime: {
                                        hint: "Définissez la durée de l'e-mail de mot de passe de demande serait valide, en quelques minutes.(Pour une période de validité infinie, réglé -1)",
                                        label: "Demandez l'heure d'expiration du code de mot de passe"
                                    },
                                    emailVerificationAskPasswordPasswordGenerator: {
                                        hint: "Point d'extension de génération de mots de passe temporaire dans la fonction de mot de passe de demande.",
                                        label: "Classe d'extension de génération de mots de passe temporaire"
                                    },
                                    urlListPurposeJitProvisioning: {
                                        hint: "Cliquez ici pour gérer juste les fins de provisioning à temps.",
                                        label: "Gérer les objectifs de l'approvisionnement JIT"
                                    }
                                }
                            }
                        }
                    },
                    loginAttemptsSecurity: {
                        name: "La connexion tente la sécurité",
                        description: "Configurer les paramètres de sécurité des tentatives de connexion.",
                        connectors: {
                            accountLockHandler: {
                                friendlyName: "Verrouillage du compte",
                                properties: {
                                    accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                                        hint: "Verrouiller les comptes d'utilisateurs sur les tentatives de connexion ratées",
                                        label: "Lock user accounts on maximum failed attempts"
                                    },
                                    accountLockHandlerOnFailureMaxAttempts: {
                                        hint: "Le nombre de tentatives de connexion échouées autorisées jusqu'à verrouillage du compte.",
                                        label: "Tentatives de connexion échoue maximale"
                                    },
                                    accountLockHandlerTime: {
                                        hint: "Période de verrouillage du compte initial en quelques minutes.Le compte sera automatiquement déverrouillé après cette période.",
                                        label: "Durée initiale du verrouillage du compte"
                                    },
                                    accountLockHandlerLoginFailTimeoutRatio: {
                                        hint: "La durée du verrouillage du compte sera augmentée de ce facteur.Ex: Durée initiale: 5m;Facteur d'incrément: 2;Durée du verrouillage suivant: 5 x 2 = 10m",
                                        label: "Facteur d'incrément de durée de verrouillage du compte"
                                    },
                                    accountLockHandlerNotificationManageInternally: {
                                        hint: "Désactiver si la demande client gère la notification envoyée",
                                        label: "Gérer la notification Envoi en interne"
                                    },
                                    accountLockHandlerNotificationNotifyOnLockIncrement: {
                                        hint: "Informer l'utilisateur lorsque la durée de verrouillage du compte est augmentée en raison des tentatives de connexion en échec continu.",
                                        label: "Informer l'utilisateur lorsque le temps de verrouillage est augmenté"
                                    }
                                }
                            },
                            ssoLoginRecaptcha: {
                                friendlyName: "recaptcha pour la connexion SSO",
                                properties: {
                                    ssoLoginRecaptchaEnableAlways: {
                                        hint: "Toujours une vérification de recaptcha rapide pendant le flux de connexion SSO.",
                                        label: "Toujours recaptcha rapide"
                                    },
                                    ssoLoginRecaptchaEnable: {
                                        hint: "Vérification rapide du recaptcha pendant le flux de connexion SSO uniquement après que les tentatives d'échec max ont dépassé.",
                                        label: "Recaptcha rapide après les tentatives d'échec max"
                                    },
                                    ssoLoginRecaptchaOnMaxFailedAttempts: {
                                        hint: "Nombre de tentatives infructueuses autorisées sans inciter à la vérification de RECAPTCHA.",
                                        label: "Max Échec des tentatives pour recaptcha"
                                    }
                                }
                            }
                        }
                    },
                    accountManagement: {
                        name: "Gestion de compte",
                        description: "Configurer les paramètres de gestion des comptes.",
                        connectors: {
                            suspensionNotification: {
                                friendlyName: "Suspende du compte inactif",
                                properties: {
                                    suspensionNotificationEnable: {
                                        hint: "Verrouiller le compte d'utilisateur après une période d'inactivité donnée.",
                                        label: "Suspendre les comptes d'utilisateurs inactifs"
                                    },
                                    suspensionNotificationAccountDisableDelay: {
                                        hint: "Période dans des jours avant de verrouiller le compte d'utilisateur.",
                                        label: "Autorisation du temps inactif dans les jours"
                                    },
                                    suspensionNotificationDelays: {
                                        hint: "Envoyez des alertes d'avertissement aux utilisateurs avant de verrouiller le compte, après chaque période.La virgule séparée plusieurs valeurs acceptées.",
                                        label: "Alerte d'envoi de périodes en jours"
                                    }
                                }
                            },
                            accountDisableHandler: {
                                friendlyName: "Compte désactiver",
                                properties: {
                                    accountDisableHandlerEnable: {
                                        hint: "Allow an administrative user to disable user accounts",
                                        label: "Activer la désactivation du compte"
                                    },
                                    accountDisableHandlerNotificationManageInternally: {
                                        hint: "Désactiver, si la demande client gère la notification",
                                        label: "Gérer la notification Envoi en interne"
                                    }
                                }
                            },
                            multiattributeLoginHandler: {
                                friendlyName: "Connexion multi-attribut",
                                properties: {
                                    accountMultiattributeloginHandlerEnable: {
                                        hint: "Activer l'utilisation de plusieurs attributs comme identifiant de connexion",
                                        label: "Activer la connexion multi-attribut"
                                    },
                                    accountMultiattributeloginHandlerAllowedattributes: {
                                        hint: "Liste des réclamations autorisées séparées par des virgules",
                                        label: "Liste des réclamations d'attribut autorisée"
                                    }
                                }
                            },
                            accountRecovery: {
                                friendlyName: "Gestion de compte",
                                properties: {
                                    recoveryNotificationPasswordEnable: {
                                        label: "Récupération de mot de passe basée sur la notification"
                                    },
                                    recoveryReCaptchaPasswordEnable: {
                                        label: "Activer RecaptCha pour la récupération de mot de passe"
                                    },
                                    recoveryQuestionPasswordEnable: {
                                        label: "Récupération de mot de passe basée sur les questions de sécurité"
                                    },
                                    recoveryQuestionPasswordMinAnswers: {
                                        label: "Nombre de questions requises pour la récupération du mot de passe"
                                    },
                                    recoveryQuestionAnswerRegex: {
                                        hint: "Security question answer regex",
                                        label: "Question de sécurité Réponse Regex"
                                    },
                                    recoveryQuestionAnswerUniqueness: {
                                        hint: "Enforce security question answer uniqueness",
                                        label: "Appliquer la question de sécurité Réponse l'unicité"
                                    },
                                    recoveryQuestionPasswordReCaptchaEnable: {
                                        hint: "Prompt reCaptcha for security question based password recovery",
                                        label: "Activer RecaptCha pour la récupération de mot de passe basée sur les questions de sécurité"
                                    },
                                    recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                                        label: "Max Échec des tentatives pour recaptcha"
                                    },
                                    recoveryNotificationUsernameEnable: {
                                        label: "Récupération du nom d'utilisateur"
                                    },
                                    recoveryReCaptchaUsernameEnable: {
                                        label: "Activer RecaptCha pour la récupération du nom d'utilisateur"
                                    },
                                    recoveryNotificationInternallyManage: {
                                        hint: "Désactiver si la demande client gère la notification envoyée",
                                        label: "Gérer les notifications envoyées en interne"
                                    },
                                    recoveryNotifySuccess: {
                                        label: "Aviser quand le succès de la récupération"
                                    },
                                    recoveryQuestionPasswordNotifyStart: {
                                        label: "Informer quand la récupération basée sur les questions de sécurité commence"
                                    },
                                    recoveryExpiryTime: {
                                        label: "Lien de récupération Expiration Temps en quelques minutes"
                                    },
                                    recoveryNotificationPasswordExpiryTimeSmsOtp: {
                                        hint: "Temps d'expiration du code OTP SMS pour la récupération de mot de passe",
                                        label: "Temps d'expiration SMS OTP"
                                    },
                                    recoveryNotificationPasswordSmsOtpRegex: {
                                        hint: "Regex pour SMS OTP au format [caractères autorisés] {longueur}.Les gammes de caractères prises en charge sont A-Z, A-Z, 0-9.La longueur minimale de OTP est 4",
                                        label: "smsOtpRegex"
                                    },
                                    recoveryQuestionPasswordForcedEnable: {
                                        hint: "Force les utilisateurs à fournir des réponses aux questions de sécurité pendant la connexion",
                                        label: "Enable forced security questions"
                                    },
                                    recoveryQuestionMinQuestionsToAnswer: {
                                        hint: "Forcer les utilisateurs à fournir des réponses aux questions de sécurité pendant la connexion si l'utilisateur a répondu moins que cette valeur",
                                        label: "Nombre minimum de questions de sécurité forcées à répondre"
                                    },
                                    recoveryCallbackRegex: {
                                        hint: "URL de rappel de récupération Regex",
                                        label: "URL de rappel de récupération Regex"
                                    },
                                    recoveryAutoLoginEnable: {
                                        hint: "L'utilisateur sera connecté automatiquement après avoir terminé l'assistant de réinitialisation du mot de passe",
                                        label: "Activer la connexion automatique après réinitialisation du mot de passe"
                                    }
                                }
                            },
                            adminForcedPasswordReset: {
                                friendlyName: "Réinitialisation du mot de passe",
                                properties: {
                                    recoveryAdminPasswordResetRecoveryLink: {
                                        hint: "L'utilisateur est averti avec un lien pour réinitialiser le mot de passe",
                                        label: "Activer la réinitialisation du mot de passe via l'e-mail de récupération"
                                    },
                                    recoveryAdminPasswordResetOtp: {
                                        hint: "L'utilisateur est averti avec un mot de passe unique pour essayer avec la connexion SSO",
                                        label: "Activer la réinitialisation du mot de passe via OTP"
                                    },
                                    recoveryAdminPasswordResetOffline: {
                                        hint: "Un OTP généré et stocké dans les revendications des utilisateurs",
                                        label: "Activer la réinitialisation du mot de passe hors ligne"
                                    },
                                    recoveryAdminPasswordResetExpiryTime: {
                                        hint: "Le temps de validité de l'administrateur de réinitialisation du mot de passe forcé en quelques minutes",
                                        label: "Administrateur de réinitialisation de mot de passe forcé le code d'expiration du code"
                                    }
                                }
                            }
                        }
                    },
                    otherSettings: {
                        name: "Autres réglages",
                        description: "Configurer d'autres paramètres.",
                        connectors: {
                            piiController: {
                                friendlyName: "Contrôleur d'information sur le consentement",
                                properties: {
                                    piiController: {
                                        hint: "Nom du premier contrôleur qui collecte les données",
                                        label: "Nom du contrôleur"
                                    },
                                    contact: {
                                        hint: "Nom de contact du contrôleur",
                                        label: "Nom du contact"
                                    },
                                    email: {
                                        hint: "Adresse e-mail de contact du contrôleur",
                                        label: "Adresse e-mail"
                                    },
                                    phone: {
                                        hint: "Numéro de téléphone de contact du contrôleur",
                                        label: "Numéro de téléphone"
                                    },
                                    onBehalf: {
                                        hint: "Un processeur d'informations utilisateur (PII) agissant au nom d'un contrôleur ou d'un processeur PII",
                                        label: "De la part de"
                                    },
                                    piiControllerUrl: {
                                        hint: "Une URL pour contacter le contrôleur",
                                        label: "URL"
                                    },
                                    addressCountry: {
                                        hint: "Pays du contrôleur",
                                        label: "Pays"
                                    },
                                    addressLocality: {
                                        hint: "Localité du contrôleur",
                                        label: "Localité"
                                    },
                                    addressRegion: {
                                        hint: "Région du contrôleur",
                                        label: "Région"
                                    },
                                    postOfficeBoxNumber: {
                                        hint: "Numéro de boîte de bureau du contrôleur",
                                        label: "Numéro de boîte de bureau"
                                    },
                                    postalCode: {
                                        hint: "Code postal du contrôleur",
                                        label: "code postal"
                                    },
                                    streetAddress: {
                                        hint: "Adresse de rue du contrôleur",
                                        label: "Adresse de rue"
                                    }
                                }
                            },
                            analyticsEngine: {
                                friendlyName: "Analyse des serveurs d'identité [dépréciés]",
                                messages: {
                                    deprecation: {
                                        description: "WSO2 Identity Server Analytics est désormais obsolète. Utilisez <1> ELK Analytics </1> à la place.",
                                        heading: "Décousue"
                                    }
                                },
                                properties: {
                                    adaptiveAuthenticationAnalyticsReceiver: {
                                        hint: "Hôte cible",
                                        label: "Hôte cible"
                                    },
                                    adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                                        hint: "Activer l'authentification de base",
                                        label: "Activer l'authentification de base"
                                    },
                                    adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                                        hint: "Target Host Secured User ID",
                                        label: "Identifiant d'utilisateur"
                                    },
                                    secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                                        hint: "Secret sécurisé l'hôte cible",
                                        label: "Secrète"
                                    },
                                    adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                                        hint: "Délai de connexion HTTP en millisecondes",
                                        label: "Délai d'expiration de la connexion HTTP"
                                    },
                                    adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                                        hint: "HTTP Read Timeout en millisecondes",
                                        label: "httpReadTimeout"
                                    },
                                    adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                                        hint: "Timeout de demande de connexion HTTP en millisecondes",
                                        label: "Timeout de demande de connexion HTTP"
                                    },
                                    adaptiveAuthenticationAnalyticsHostnameVerfier: {
                                        hint: "Vérification du nom d'hôte.(Strict, perte_all)",
                                        label: "Vérification du nom d'hôte"
                                    }
                                }
                            },
                            elasticAnalyticsEngine: {
                                friendlyName: "Analytique des wapitis",
                                warningModal: {
                                    configure: "<1>Configurer</1> les paramètres ELK Analytics pour une fonctionnalité appropriée.",
                                    reassure: "Vous pouvez mettre à jour vos paramètres à tout moment."
                                },
                                properties: {
                                    adaptiveAuthenticationElasticReceiver: {
                                        hint: "Hôte elasticsearch",
                                        label: "Hôte elasticsearch"
                                    },
                                    adaptiveAuthenticationElasticBasicAuthEnabled: {
                                        hint: "Activer l'authentification de base",
                                        label: "Activer l'authentification de base"
                                    },
                                    adaptiveAuthenticationElasticBasicAuthUsername: {
                                        hint: "Nom d'utilisateur Elasticsearch",
                                        label: "Nom d'utilisateur Elasticsearch"
                                    },
                                    secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                                        hint: "Mot de passe de l'utilisateur Elasticsearch",
                                        label: "Mot de passe Elasticsearch"
                                    },
                                    adaptiveAuthenticationElasticHttpConnectionTimeout: {
                                        hint: "Délai de connexion HTTP en millisecondes",
                                        label: "Délai d'expiration de la connexion HTTP"
                                    },
                                    adaptiveAuthenticationElasticHttpReadTimeout: {
                                        hint: "HTTP Read Timeout en millisecondes",
                                        label: "httpReadTimeout"
                                    },
                                    adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                                        hint: "Timeout de demande de connexion HTTP en millisecondes",
                                        label: "Timeout de demande de connexion HTTP"
                                    },
                                    adaptiveAuthenticationElasticHostnameVerfier: {
                                        hint: "Vérification du nom d'hôte.(Strict, perte_all)",
                                        label: "Vérification du nom d'hôte"
                                    }
                                }
                            },
                            userClaimUpdate: {
                                friendlyName: "Mise à jour de la réclamation des utilisateurs",
                                properties: {
                                    userClaimUpdateEmailEnableVerification: {
                                        hint: "Déclencher une notification de vérification lorsque l'adresse e-mail de l'utilisateur est mise à jour.",
                                        label: "Activer la vérification des e-mails utilisateur lors de la mise à jour"
                                    },
                                    userClaimUpdateEmailVerificationCodeExpiryTime: {
                                        hint: "Temps de validité du lien de confirmation par e-mail en quelques minutes.",
                                        label: "Vérification par e-mail sur le lien de mise à jour Temps d'expiration"
                                    },
                                    userClaimUpdateEmailEnableNotification: {
                                        hint: "Déclenchez une notification à l'adresse e-mail existante lorsque l'utilisateur tente de mettre à jour l'adresse e-mail existante.",
                                        label: "Activer la notification par e-mail utilisateur lors de la mise à jour"
                                    },
                                    userClaimUpdateMobileNumberEnableVerification: {
                                        hint: "Déclencher une vérification SMS OTP lorsque le numéro de mobile de l'utilisateur est mis à jour.",
                                        label: "Activer la vérification du numéro de mobile de l'utilisateur lors de la mise à jour"
                                    },
                                    userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                                        hint: "Temps de validité de la confirmation du numéro de mobile OTP en quelques minutes.",
                                        label: "Vérification du numéro de mobile sur la mise à jour du temps d'expiration SMS OTP"
                                    },
                                    userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                                        hint: "Permettez aux utilisateurs privilégiés d'initier la vérification du numéro de mobile lors de la mise à jour.",
                                        label: "Enable mobile number verification by privileged users"
                                    }
                                }
                            }
                        }
                    },
                    multiFactorAuthenticators: {
                        name: "Authentificateurs multi-facteurs",
                        friendlyName: "Paramètres d'authentificateur",
                        description: "Configurer les paramètres d'authentificateur multi-facteurs.",
                        connectors: {
                            backupCodeAuthenticator: {
                                friendlyName: "Authentificateur de code de sauvegarde",
                                properties: {
                                    backupCodeBackupCodeLength: {
                                        hint: "Longueur d'un code de sauvegarde",
                                        label: "Longueur de code de sauvegarde"
                                    },
                                    backupCodeBackupCodeSize: {
                                        hint: "Nombre maximum de codes de sauvegarde",
                                        label: "Taille du code de sauvegarde"
                                    }
                                }
                            }
                        }
                    },
                    sessionManagement: {
                        description: "Gérer les paramètres liés à la session de vos utilisateurs."
                    },
                    saml2WebSsoConfiguration: {
                        description: "Configurer SAML2 Web SSO pour vos applications."
                    },
                    wsFederationConfiguration: {
                        description: "Configurer le protocole WS-Federation pour vos applications."
                    }
                },
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
                            description: "La configuration {{ name }} a été mise à jour avec succès.",
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
                        placeHolders: {
                            emptyListPlaceholder: {
                                subtitles: "Il n'y a aucun rôle attribué à ce groupe pour le moment.",
                                title: "Aucun rôle attribué"
                            }
                        },
                        heading: "Rôles attribués",
                        addRolesModal: {
                            heading: "Mettre à jour les rôles de groupe",
                            subHeading: "Ajoutez de nouveaux rôles ou supprimez les rôles existants attribués " +
                                "au groupe."
                        },
                        subHeading: "Afficher les rôles attribués pour le groupe."
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
                        title: "Impossible de récupérer les groupes depuis le magasin d'utilisateur"
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
            parentOrgInvitations: {
                addUserWizard: {
                    heading: "Inviter un utilisateur parent",
                    description: "Invitez un utilisateur de l’organisation parente.",
                    hint: "Les utilisateurs invités sont gérés par l'organisation parente.",
                    username: {
                        label: "nom d'utilisateur",
                        placeholder: "Entrez le nom d'utilisateur",
                        hint: "Le nom d'utilisateur doit appartenir à un utilisateur de l'organisation parente.",
                        validations: {
                            required: "Le nom d'utilisateur est un champ obligatoire."
                        }
                    },
                    roles: {
                        label: "Les rôles",
                        placeholder: "Sélectionnez des rôles",
                        hint: "Attribuez des rôles à l'utilisateur invité.",
                        validations: {
                            required: "Les rôles sont un champ obligatoire."
                        }
                    },
                    inviteButton: "Inviter"
                },
                tab: {
                    usersTab: "Utilisateurs",
                    invitationsTab: "Invitations"
                },
                searchPlaceholder: "Rechercher par nom d'utilisateur",
                searchdropdown: {
                    pendingLabel: "En attente",
                    expiredLabel: "Expiré"
                },
                createDropdown: {
                    createLabel: "Créer un utilisateur",
                    inviteLabel: "Inviter un utilisateur parent"
                },
                filterLabel: "Filtrer par: ",
                emptyPlaceholder: {
                    noPendingInvitations: "Il n'y a aucune invitation en attente pour le moment.",
                    noExpiredInvitations: "Il y a des invitations expirées pour le moment.",
                    noInvitations: "Il n'y a aucune invitation pour le moment.",
                    noCollaboratorUserInvitations: "Il n’y a actuellement aucun utilisateur collaborateur dont les invitations ont expiré."
                },
                invitedUserLabel: "Géré par l'organisation mère"
            },
            oidcScopes: {
                back: "Revenir aux mappages d’attributs OpenID Connect",
                viewAttributes: "Afficher les attributs",
                manageAttributes: "Gérer les attributs",
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
                        addClaim: "Nouvel attribut",
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
                                    duplicate: "Cette portée existe déjà.",
                                    empty: "Ce champ ne peut pas être vide.",
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
                            description: "Création réussie du nouveau champ d'application OIDC",
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
                            description: "Une erreur s'est produite lors de la mise à jour du scope OIDC {{ scope }}.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour avec succès du scope OIDC.",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                placeholders: {
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
                        action: "Effacer la requête de recherche",
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
            organizationDiscovery: {
                advancedSearch: {
                    form: {
                        dropdown: {
                            filterAttributeOptions: {
                                organizationName: "nom de l'organisation"
                            }
                        },
                        inputs: {
                            filterAttribute: {
                                placeholder: "Par exemple. Nom de l'organisation, etc."
                            },
                            filterCondition: {
                                placeholder: "Par exemple. Commence par etc."
                            },
                            filterValue: {
                                placeholder: "Entrez la valeur à rechercher"
                            }
                        }
                    },
                    placeholder: "Rechercher par nom d'organisation"
                },
                assign: {
                    title: "Affecter les domaines e-mail",
                    description: "Fournir des domaines de messagerie pour les organisations.",
                    form: {
                        fields: {
                            emailDomains: {
                                label : "Domaines de messagerie",
                                placeholder: "Entrez les domaines de messagerie",
                                hint: "Tapez et entrez les domaines de messagerie à mapper à l'organisation. (Par exemple, gmail.com, etc.)",
                                validations: {
                                    invalid: {
                                        0: "Veuillez saisir un domaine de messagerie valide.",
                                        1: "Le domaine de messagerie fourni est déjà mappé à une autre organisation."
                                    }
                                }
                            },
                            organizationName: {
                                label: "nom de l'organisation",
                                placeholder: "Sélectionnez une organisation",
                                emptyPlaceholder: {
                                    0: "Aucune organisation n'est disponible.",
                                    1: "Toutes les organisations ont des domaines attribués."
                                },
                                hint: "Entrez le nom de l'organisation que vous souhaitez ajouter le mappage de domaine."
                            }
                        }
                    },
                    buttons: {
                        assign: "Attribuer"
                    }
                },
                emailDomains: {
                    actions: {
                        assign: "Attribuer un domaine de messagerie",
                        enable: "Activer la découverte de domaines de messagerie"
                    }
                },
                edit: {
                    back: "Dos",
                    description: "Modifier les domaines de messagerie",
                    form: {
                        fields: {
                            emailDomains: {
                                label : "Domaines de messagerie",
                                placeholder: "Entrez les domaines de messagerie",
                                hint: "Tapez et entrez les domaines de messagerie à mapper à l'organisation. (Par exemple, gmail.com, etc.)",
                                validations: {
                                    invalid: {
                                        0: "Veuillez saisir un domaine de messagerie valide.",
                                        1: "Le domaine de messagerie fourni est déjà mappé à une autre organisation."
                                    }
                                }
                            },
                            organizationName: {
                                label: "nom de l'organisation",
                                hint: "Entrez le nom de l'organisation que vous souhaitez ajouter la cartographie du domaine."
                            }
                        },
                        message: "La modification des mappages de domaines de messagerie peut empêcher les utilisateurs existants de se connecter."
                    }
                },
                message: "La fonctionnalité de découverte de domaine de messagerie ne peut être utilisée que lorsque l'adresse e-mail est configurée comme nom d'utilisateur.",
                notifications: {
                    addEmailDomains: {
                        error: {
                            description: "L'ajout des domaines de messagerie à l'organisation a échoué.",
                            message: "Ajout échoué"
                        },
                        success: {
                            description: "Domaines de messagerie ajoutés avec succès.",
                            message: "Ajouté avec succès"
                        }
                    },
                    checkEmailDomain: {
                        error: {
                            description: "La validation de l'existence du domaine de messagerie a échoué.",
                            message: "Validation échouée"
                        }
                    },
                    disableEmailDomainDiscovery: {
                        error: {
                            description: "Une erreur s'est produite lors de la désactivation de la découverte de domaines de messagerie.",
                            message: "Désactivation échouée"
                        },
                        success: {
                            description: "La découverte du domaine de messagerie a été désactivée avec succès.",
                            message: "Désactivé avec succès"
                        }
                    },
                    enableEmailDomainDiscovery: {
                        error: {
                            description: "Une erreur s'est produite lors de l'activation de la découverte de domaines de messagerie.",
                            message: "Activation échouée"
                        },
                        success: {
                            description: "La découverte du domaine de messagerie a été activée avec succès.",
                            message: "Activé avec succès"
                        }
                    },
                    fetchOrganizationDiscoveryAttributes: {
                        error: {
                            description: "Une erreur s'est produite lors de la récupération des attributs de découverte de l'organisation.",
                            message: "Récupération échouée"
                        }
                    },
                    getEmailDomainDiscovery: {
                        error: {
                            description: "Une erreur s'est produite lors de la récupération de la configuration de la découverte du domaine de messagerie.",
                            message: "Récupération échouée"
                        }
                    },
                    getOrganizationListWithDiscovery: {
                        error: {
                            description: "Une erreur s'est produite lors de l'obtention de la liste des organisations avec les attributs de découverte.",
                            message: "Récupération échouée"
                        }
                    },
                    updateOrganizationDiscoveryAttributes: {
                        error: {
                            description: "Une erreur s'est produite lors de la mise à jour des attributs de découverte de l'organisation.",
                            message: "Échec de la mise à jour"
                        },
                        success: {
                            description: "Mise à jour réussie des attributs de découverte de l'organisation.",
                            message: "Mise à jour réussie"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Attribuer un domaine de messagerie",
                        subtitles: "Aucune organisation ne dispose de domaines de messagerie attribués.",
                        title: "Attribuer un domaine de messagerie"
                    }
                },
                title: "Découverte de domaines de messagerie"
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
                edit: {
                    attributes: {
                        hint: "Configurer les attributs de l'organisation",
                        key: "Nom",
                        keyRequiredErrorMessage: "Le nom est requis",
                        value: "Évaluer",
                        valueRequiredErrorMessage: "Valeur est requise"
                    },
                    back: "Retour",
                    dangerZone: {
                        disableOrganization: {
                            disableActionTitle: "Désactiver l'organisation",
                            enableActionTitle: "Activer l'organisation",
                            subheader: "La désactivation d'une organisation la rendra indisponible pour tous " +
                                "les utilisateurs."
                        },
                        subHeader: "Voulez-vous vraiment supprimer cette organisation?",
                        title: "Supprimer l'organisation"
                    },
                    description: "Modifier l'organisation",
                    fields: {
                        created: {
                            ariaLabel: "Établi",
                            label: "Établi"
                        },
                        description: {
                            ariaLabel: "Description de l'organisation",
                            label: "Description de l'organisation",
                            placeholder: "Entrez la description de l'organisation"
                        },
                        domain: {
                            ariaLabel: "Domaine de l'organisation",
                            label: "Domaine de l'organisation"
                        },
                        id: {
                            ariaLabel: "ID de l'organisation",
                            label: "ID de l'organisation"
                        },
                        lastModified: {
                            ariaLabel: "Dernière modification",
                            label: "Dernière modification"
                        },
                        name: {
                            ariaLabel: "Nom de l'organisation",
                            label: "Nom de l'organisation",
                            placeholder: "Entrez le nom de l'organisation"
                        },
                        type: {
                            ariaLabel: "Type d'Organisation",
                            label: "Type d'Organisation"
                        }
                    },
                    tabTitles: {
                        attributes: "Les attributs",
                        overview: "Aperçu"
                    }
                },
                forms: {
                    addOrganization: {
                        description: {
                            label: "La description",
                            placeholder: "Entrez la description"
                        },
                        domainName: {
                            label: "Nom de domaine",
                            placeholder: "Entrez le nom de domaine",
                            validation: {
                                duplicate: "Le nom de domaine existe déjà",
                                empty: "Le nom de domaine est requis"
                            }
                        },
                        name: {
                            label: "nom de l'organisation",
                            placeholder: "Entrez le nom de l'organisation",
                            validation: {
                                duplicate: "Le nom de l'organisation existe déjà",
                                empty: "Le nom de l'organisation est requis"
                            }
                        },
                        structural: "De construction",
                        tenant: "Locataire",
                        type: "Taper"
                    }
                },
                homeList: {
                    description: "Consultez la liste de toutes les organisations disponibles.",
                    name: "Toutes les organisations"
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
                modals: {
                    addOrganization: {
                        header: "Ajouter une Organisation",
                        subtitle1: "Créez une nouvelle organisation dans {{parent}}.",
                        subtitle2: "Créer une nouvelle organisation."
                    }
                },
                notifications: {
                    addOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de l'ajout de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'ajout de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'organisation a bien été ajoutée",
                            message: "Organisation ajoutée avec succès"
                        }
                    },
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
                    deleteOrganizationWithSubOrganizationError: "L'organisation {{ organizationName }} ne peut pas" +
                        " être supprimée car elle possède une ou plusieurs organisations.",
                    disableOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la désactivation de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la désactivation de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'organisation a bien été désactivée",
                            message: "Organisation désactivée avec succès"
                        }
                    },
                    disableOrganizationWithSubOrganizationError: "L'organisation {{ organizationName }} ne peut pas" +
                        " être désactivée car elle possède une ou plusieurs organisations.",
                    enableOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de l'activation de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'activation de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "L'organisation a bien été activée",
                            message: "Organisation activée avec succès"
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
                    },
                    getOrganizationList: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de l'obtention de la liste des organisations"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de l'obtention de la liste des organisations",
                            message: "Quelque chose s'est mal passé"
                        }
                    },
                    updateOrganization: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la mise à jour de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie de l'organisation",
                            message: "Organisation mise à jour avec succès"
                        }
                    },
                    updateOrganizationAttributes: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la mise à jour des attributs de l'organisation"
                        },
                        genericError: {
                            description: "Une erreur s'est produite lors de la mise à jour des attributs " +
                                "de l'organisation",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Mise à jour réussie des attributs de l'organisation",
                            message: "Les attributs de l'organisation ont bien été mis à jour"
                        }
                    }
                },
                placeholders: {
                    emptyList: {
                        action: "Ajouter une Organisation",
                        subtitles: {
                            0: "Il n'y a pas d'organisations pour le moment.",
                            1: "Vous pouvez facilement ajouter une nouvelle organisation en",
                            2: "en cliquant sur le bouton ci-dessous.",
                            3: "Il n'y a aucune organisation sous {{parent}} pour le moment."
                        },
                        title: "Ajouter une nouvelle organisation"
                    }
                },
                shareApplicationSubTitle: "Sélectionnez l'une des options suivantes pour partager l'application.",
                shareApplicationRadio: "Partager avec toutes les organisations",
                shareApplicationInfo: "Sélectionnez cette option pour partager l'application avec toutes " +
                    "les organisations existantes et toutes les nouvelles organisations que vous " +
                    "créez sous votre organisation actuelle.",
                unshareApplicationRadio: "Ne partagez avec aucune organisation",
                shareWithSelectedOrgsRadio: "Partager uniquement avec les organisations sélectionnées",
                unshareApplicationInfo: "Cela vous permettra d'empêcher le partage de cette application " +
                    "avec l'une des organisations existantes ou les nouvelles organisations que vous " +
                    "créerez sous cette organisation à l'avenir.",
                subTitle: "Créer et gérer des organisations.",
                switching: {
                    emptyList: "Il n'y a aucune organisation à afficher.",
                    search: {
                        placeholder: "Rechercher par nom"
                    },
                    goBack: "Retourner",
                    subOrganizations: "Organisations",
                    switchLabel: "Organisation",
                    switchButton: "Passer à l'organisation",
                    notifications: {
                        switchOrganization: {
                            genericError: {
                                description: "Impossible de basculer vers l'organisation sélectionnée.",
                                message: "Quelque chose s'est mal passé"
                            }
                        }
                    }
                },
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
                                    duplicateInAudience: "Un rôle portant ce nom existe déjà dans l'audience sélectionnée.",
                                    empty: "Le nom de {{type}} est obligatoire",
                                    invalid: "Un nom {{type}} ne peut contenir que des caractères " +
                                        "alphanumériques, - et _. Et doit avoir une longueur comprise entre 3 " +
                                        "et 30 caractères."
                                }
                            },
                            roleAudience: {
                                hint: "Définissez le public du rôle.<1> Notez que le public du rôle ne peut pas être modifié. </1>",
                                label: "Sélectionnez le rôle de rôle",
                                values: {
                                    organization: "Organisation",
                                    application: "Application"
                                }
                            },
                            notes: {
                                orgNote: "Lorsque le rôle d'audience est l'organisation, vous pouvez associer le rôle à une application qui permet des rôles d'audience d'organisation.",
                                appNote: "Lorsque le rôle d'audience est une application, vous pouvez associer le rôle à une application qui permet des rôles d'audience d'application.",
                                cannotCreateRole: "Vous ne pouvez pas créer un rôle avec le public de rôle en tant qu'application car il n'y a actuellement aucune application qui prend en charge les rôles d'audience d'application.S'il vous plaît <1> Créer une application </1> qui prend en charge les rôles d'audience d'application pour continuer."
                            },
                            assignedApplication: {
                                hint: "Attribuer une application pour le rôle. Notez que l'application attribuée pour ce rôle ne peut pas être modifiée après la création du rôle.",
                                label: "Application attribuée",
                                placeholder: "Sélectionnez l'application pour attribuer le rôle",
                                applicationSubTitle: {
                                    application: "Prise en charge des rôles à application.",
                                    organization: "Rôles de soutien à l'organisation. ",
                                    changeAudience: "Changer le public"
                                },
                                validations: {
                                    empty: "L'application attribuée est nécessaire pour créer un rôle à application."
                                },
                                note: "Notez que l'application attribuée pour ce rôle ne peut pas être modifiée après la création du rôle."
                            }
                        },
                        rolePermission: {
                            apiResource: {
                                label: "Sélectionnez la ressource API",
                                placeholder: "Sélectionnez une ressource API pour attribuer des autorisations (lunettes)",
                                hint: {
                                    empty: "Aucune ressource API n'est autorisée pour l'application sélectionnée. Les ressources de l'API peuvent être autorisées via <1>ici</1>."
                                }
                            },
                            permissions: {
                                label: "Sélectionnez autorisations (lunettes) dans les ressources API sélectionnées",
                                placeholder: "Sélectionnez les autorisations (lunettes)",
                                tooltips: {
                                    noScopes: "Aucune portée disponible pour la ressource API sélectionnée",
                                    selectAllScopes: "Sélectionnez toutes les autorisations (lunettes)",
                                    removeAPIResource: "Supprimer la ressource API"
                                },
                                validation: {
                                    empty: "La liste des autorisations(lunettes) ne peut pas être vide. Sélectionnez au moins une autorisation(lunettes)."
                                },
                                permissionsLabel: "Autorisations (étendues)"
                            },
                            notes: {
                                applicationRoles: "Seules les API et les autorisations (lunettes) autorisées dans l'application sélectionnée(<1>{{applicationName}}</1>) seront répertoriées pour être sélectionnées."
                            },
                            notifications: {
                                fetchAPIResourceError: {
                                    error: {
                                        description: "Quelque chose s'est mal passé tout en récupérant les ressources d'API.Veuillez réessayer.",
                                        message: "Quelque chose s'est mal passé"
                                    }
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
                    back: "Retourner",
                    summary: {
                        labels: {
                            domain: {
                                group: "Annuaire",
                                role: "Type de rôle"
                            },
                            groups: "Groupe (s) attribué (s)",
                            permissions: "Permission(s)",
                            roles: "Rôle (s) assigné (s)",
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
                                searchPlaceholder: "Rechercher des utilisateurs",
                                searchByEmailPlaceholder: "Recherchez les utilisateurs par adresse e-mail"
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
                    placeholders: {
                        errorPlaceHolder: {
                            action: "Retourner",
                            subtitles: {
                                0: "Une erreur s'est produite lors de la récupération du rôle demandé, peut-être parce que le rôle n'existe pas.",
                                1: "Please try again."
                            },
                            title: "Quelque chose s'est mal passé"
                        }
                    },
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
                            buttonDisableHint: "L'option de suppression est désactivée car ce {{type}} est géré " +
                                "dans un magasin d'utilisateurs distant.",
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
                        placeholders: {
                            emptyPlaceholder: {
                                action: "Attribuer des groupes",
                                subtitles: {
                                    0: "Il n'y a aucun groupe disponible pour le moment."
                                },
                                title: "Aucun groupe affecté à ce rôle."
                            },
                            errorPlaceholder: {
                                action: "Rafraîchir",
                                subtitles: {
                                    0: "Une erreur s'est produite tout en récupérant les groupes affectés à ce rôle.",
                                    1: "Veuillez réessayer."
                                },
                                title: "Quelque chose s'est mal passé"
                            }
                        },
                        notifications: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de la mise à jour des groupes attribués au rôle."
                            },
                            success: {
                                message: "Rôle mis à jour avec succès",
                                description: "Les groupes attribués à ce rôle ont été mis à jour avec succès."
                            },
                            genericError: {
                                message: "Quelque chose s'est mal passé",
                                description: "Nous n'avons pas pu mettre à jour les groupes attribués à ce rôle."
                            },
                            fetchError: {
                                message: "Quelque chose s'est mal passé",
                                description: "Nous n'avons pas pu récupérer les groupes attribués à ce rôle."
                            }
                        },
                        externalGroupsHeading: "Groupes externes",
                        localGroupsHeading: "Groupes locaux",
                        heading: "Groupes attribués",
                        subHeading: "Ajoutez ou supprimez les groupes affectés au rôle. Notez que ceci"
                            + "affectera l'exécution de certaines tâches.",
                        actions: {
                            search: {
                                placeholder: "Groupes de recherche"
                            },
                            assign: {
                                placeholder: "Attribuer des groupes"
                            },
                            remove: {
                                label: "Élimination des groupes",
                                placeholder: "Restaurer les groupes"
                            }
                        }
                    },
                    menuItems: {
                        basic: "Fondamentaux",
                        connectedApps: "Applications connectées",
                        groups: "Groupes",
                        permissions: "Permissions",
                        roles: "Rôles",
                        users: "Utilisateurs"
                    },
                    users: {
                        heading: "Utilisateurs affectés",
                        subHeading: "Ajouter ou supprimer les utilisateurs affectés à ce rôle.Notez que cela affectera l'exécution de certaines tâches.",
                        placeholders: {
                            emptyPlaceholder: {
                                action: "Affecter les utilisateurs",
                                subtitles: {
                                    0: "Aucun utilisateur n'est attribué à ce rôle pour le moment."
                                },
                                title: "Aucun utilisateur affecté au rôle."
                            },
                            errorPlaceholder: {
                                action: "Rafraîchir",
                                subtitles: {
                                    0: "Une erreur s'est produite tout en récupérant les utilisateurs affectés à ce rôle.",
                                    1: "Veuillez réessayer."
                                },
                                title: "Quelque chose s'est mal passé"
                            }
                        },
                        notifications: {
                            error: {
                                description: "{{description}}",
                                message: "L'erreur s'est produite lors de la mise à jour des utilisateurs attribués au rôle."
                            },
                            success: {
                                message: "Rôle mis à jour avec succès",
                                description: "Les utilisateurs affectés à ce rôle ont été mis à jour avec succès."
                            },
                            genericError: {
                                message: "Quelque chose s'est mal passé",
                                description: "Nous n'avons pas pu mettre à jour les utilisateurs attribués à ce rôle."
                            },
                            fetchError: {
                                message: "Quelque chose s'est mal passé",
                                description: "Nous n'avons pas pu récupérer les utilisateurs attribués à ce rôle."
                            }
                        },
                        list: {
                            emptyPlaceholder: {
                                action: "Affecter un utilisateur",
                                subtitles: "Aucun utilisateur n'est assigné à ce rôle pour le moment.",
                                title: "Aucun utilisateur assigné"
                            },
                            user: "Utilisateur",
                            organization: "Dirigé par"
                        },
                        actions: {
                            search: {
                                placeholder: "Rechercher les utilisateurs"
                            },
                            assign: {
                                placeholder: "Affecter les utilisateurs"
                            },
                            remove: {
                                label: "Suppression des utilisateurs",
                                placeholder: "Restaurer les utilisateurs"
                            }
                        }
                    },
                    permissions: {
                        heading: "Autorisations attribuées",
                        readOnlySubHeading: "Voir les autorisations attribuées du rôle.",
                        removedPermissions: "Autorisations supprimées",
                        subHeading: "Gérer les autorisations attribuées dans le rôle."
                    }
                },
                list: {
                    buttons: {
                        addButton: "Nouveau {{type}}",
                        filterDropdown: "Filtrer par"
                    },
                    columns: {
                        actions: "Actions",
                        audience: "Public",
                        lastModified: "Dernière modification",
                        managedByApp: {
                            label: "Ne peut être utilisé que dans l'application: ",
                            header: "Dirigé par"
                        },
                        managedByOrg: {
                            label: "Peut être utilisé au sein de l'organisation: ",
                            header: "Dirigé par"
                        },
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
                        },
                        deleteItemError: {
                            content: "Supprimer les associations de la demande suivante avant de supprimer:",
                            header: "Impossible de supprimer",
                            message: "Il existe une application utilisant ce rôle."
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
                    },
                    filterOptions: {
                        all: "Afficher tout",
                        applicationRoles: "Rôles d'application",
                        organizationRoles: "Rôles d'organisation"
                    },
                    filterAttirbutes: {
                        name: "Nom",
                        audience: "Rôle public"
                    }
                },
                readOnlyList: {
                    emptyPlaceholders: {
                        searchAndFilter: {
                            subtitles: {
                                0: "Nous n'avons trouvé aucun résultat pour la combinaison de nom de rôle et d'audience spécifiée.",
                                1: "Veuillez essayer une combinaison différente."
                            },
                            title: "Aucun résultat trouvé"
                        }
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
                            message: "Impossible de supprimer le rôle sélectionné."
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
                    fetchRole: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération du rôle.",
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
                adminAdvisory: {
                    configurationEditSection: {
                        backButtonLabel: "Revenir à la bannière de conseils d'administration",
                        pageHeading: "Bannière de conseil d'administration",
                        pageSubheading: "Configurez et personnalisez la bannière d'avis d'administration " +
                            "à afficher sur la page de connexion.",
                        form: {
                            bannerContent: {
                                label: "Contenu de la bannière",
                                hint: "C'est le contenu qui sera affiché dans la bannière sur la page de connexion.",
                                placeholder: "Attention : l'utilisation non autorisée de cet outil " +
                                    "est strictement interdite."
                            }
                        }
                    },
                    configurationSection: {
                        disabled: "Désactivé",
                        description: "Activez et configurez la bannière d'avis d'administration.",
                        enabled: "Activé",
                        heading: "Bannière de conseil d'administration"
                    },
                    notifications: {
                        disbleAdminAdvisoryBanner: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur lors de la désactivation de la bannière " +
                                    "d'information de l'administrateur."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la désactivation de" +
                                    "la bannière d'information de l'administrateur.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "La bannière d'information de l'administrateur " +
                                    "a été désactivée avec succès.",
                                message: "Désactivé la bannière d'information de l'administrateur"
                            }
                        },
                        enableAdminAdvisoryBanner: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur lors de l'activation de la bannière d'avis " +
                                    "d'administration."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de l'activation " +
                                    "de la bannière d'information de l'administrateur.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Activation réussie de la bannière de conseil d'administration.",
                                message: "Activation de la bannière d'avis d'administration"
                            }
                        },
                        getConfigurations: {
                            error: {
                                description: "{{ description }}",
                                message: "Erreur lors de la récupération des configurations de la " +
                                    "bannière d'avis d'administration."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la récupération des " +
                                    "configurations des bannières d'avis d'administration.",
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
                                message: "Erreur lors de la mise à jour des configurations de la " +
                                "bannière d'avis d'administration."
                            },
                            genericError: {
                                description: "Une erreur s'est produite lors de la mise à jour des " +
                                    "configurations des bannières d'avis d'administration.",
                                message: "Quelque chose s'est mal passé"
                            },
                            success: {
                                description: "Mise à jour réussie des configurations de la bannière " +
                                    "d'avis d'administration.",
                                message: "Bannière mise à jour avec succès"
                            }
                        }
                    },
                    pageHeading: "Bannière de conseil d'administration",
                    pageSubheading: "Configurez la bannière d'avis d'administration à afficher " +
                        "sur la page de connexion."
                },
                manageNotificationSendingInternally: {
                    title: "Notification interne",
                    description: "Gérer la notification Envoi en interne."
                },
                remoteLogPublishing: {
                    title: "Publication de journaux à distance",
                    pageTitle: "Publication de journaux à distance",
                    description: "Configurez les paramètres de journalisation à distance pour l'organisation.",
                    fields: {
                        logTypes: {
                            label: "Types de journaux à publier",
                            values: {
                                carbonLogs: "Bûches de carbone",
                                auditLogs: "Journaux d'audit",
                                allLogs: "Tous les journaux"
                            }
                        },
                        remoteURL: {
                            label: "URL de destination"
                        },
                        advanced: {
                            title: "Réglages avancés",
                            connectionTimeout: {
                                label: "Délai d'expiration de la connexion (ms)"
                            },
                            verifyHostname: {
                                label: "Vérifiez le nom d'hôte"
                            },
                            basicAuthConfig: {
                                title: "Configuration de l'authentification de base",
                                serverUsername: {
                                    label: "Nom d'utilisateur du serveur distant"
                                },
                                serverPassword: {
                                    label: "Mot de passe du serveur distant"
                                }
                            },
                            sslConfig: {
                                title: "Configuration SSL",
                                keystorePath: {
                                    label: "Emplacement du magasin de clés"
                                },
                                keystorePassword: {
                                    label: "Mot de passe du magasin de clés"
                                },
                                truststorePath: {
                                    label: "Emplacement du magasin de confiance"
                                },
                                truststorePassword: {
                                    label: "Mot de passe du magasin de confiance"
                                }
                            }
                        }
                    },
                    dangerZone: {
                        title: "Restaurer la configuration par défaut pour les journaux {{logType}}",
                        header: "Restaurer la configuration par défaut pour les journaux {{logType}}",
                        subheader: "Cette action supprimera la configuration existante pour les journaux {{logType}}. Veuillez en être sûr avant de continuer.",
                        confirmation: {
                            hint: "Veuillez confirmer votre action.",
                            header: "Êtes-vous sûr?",
                            message: "Si vous restaurez la configuration par défaut, la publication de journaux à distance pour les journaux {{logType}} risque de ne pas fonctionner correctement. " +
                            "Veuillez procéder avec prudence.",
                            content: "Cette action restaurera la configuration de publication de journaux par défaut pour les journaux {{logType}}."
                        }
                    },
                    notification: {
                        success: {
                            description: "La configuration de la publication des journaux à distance a été mise à jour avec succès.",
                            message: "Mis à jour avec succés."
                        },
                        error: {
                            updateError: {
                                description: "Une erreur s'est produite lors de la mise à jour de la configuration de la publication des journaux à distance.",
                                message: "Quelque chose s'est mal passé"
                            },
                            fetchError: {
                                description: "Une erreur s'est produite lors de l'obtention de la configuration de la publication des journaux à distance.",
                                message: "Impossible d'obtenir la configuration de la publication des journaux à distance."
                            }
                        }
                    }
                },
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
                },
                server: {
                    title: "Serveuse",
                    description: "Configurer les paramètres du serveur."
                }
            },
            sidePanel: {
                accountManagement: "Gestion de compte",
                addEmailTemplate: "Ajouter un modèle d'e-mail",
                addEmailTemplateLocale: "Ajouter une langue de modèle d'e-mail",
                approvals: "Approbations",
                attributeDialects: "Les attributs",
                categories: {
                    attributes: "Attributs Utilisateur",
                    certificates: "Certificats",
                    configurations: "Configurations",
                    general: "Général",
                    organizations: "Gestion de l'organisation",
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
                emailDomainDiscovery: "Découverte de domaines de messagerie",
                emailTemplateTypes: "",
                emailTemplates: "Modèles d'e-mail",
                generalConfigurations: "Général",
                groups: "Groupes",
                localDialect: "Dialecte local",
                loginAttemptsSecurity: "Sécurité des tentatives de connexion",
                multiFactorAuthenticators: "Authentificateurs multi-facteurs",
                organizations: "Organisations",
                otherSettings: "Autres réglages",
                overview: "Vue d'ensemble",
                passwordPolicies: "Politiques de mot de passe",
                remoteFetchConfig: "Configurations à distance",
                roles: "Rôles",
                userOnboarding: "Intégration des utilisateurs",
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
                            unselected: "Aucun {{type}} disponible ne peut être assigné à ce groupe.",
                            common: "Aucun {{type}} trouvé"
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
                        1: "Nom",
                        2: "Audience"
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
                        },
                        deleteAdminPriviledgeZone: {
                            actionTitle: "Révoquer les privilèges",
                            header: "Révoquer les privilèges d'administrateur",
                            subheader: "Cette action supprimera les privilèges d'administrateur de l'utilisateur, " +
                                "mais l'utilisateur continuera d'être dans l'organisation."
                        }
                    },
                    dateOfBirth: {
                        placeholder: {
                            part1: "Entrer le",
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
                                    createPassword: "Définissez un mot de passe pour l'utilisateur"
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
                                    invalid: "S'il vous plaît, mettez une adresse email valide.Vous pouvez utiliser alphanumérique "+
                                        "Caractères, caractères Unicode, soulignements (_), tirets (-), périodes (.)," +
                                        "Et un signe AT (@)."
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
                                    regExViolation: "Merci d'entrer un nom d'utilisateur valide."
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
                        askPassword: {
                            alphanumericUsernameEnabled: "Pour utiliser la fonction de réinitialisation du mot de passe, désactiver " +
                                "Fonction de nom d'utilisateur alphanumérique.",
                            emailInvalid: "Pour utiliser la fonction de réinitialisation du mot de passe, veuillez utiliser une adresse e-mail valide comme "+
                                "l'identifiant.",
                            emailVerificationDisabled: "Pour utiliser la fonction de réinitialisation du mot de passe, activez la vérification par e-mail par "+
                                "Configuration d'un fournisseur de messagerie."
                        },
                        buttons: {
                            next: "Suivant",
                            previous: "Précédent"
                        },
                        steps: {
                            basicDetails: "Informations générales",
                            groups: "Groupes",
                            roles: "Rôles",
                            summary: "Résumé",
                            method: "Méthode"
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
                    bulkImportUserWizard: {
                        title: "Ajouter plusieurs utilisateurs",
                        subTitle: "Ajoutez plusieurs utilisateurs manuellement ou en utilisant un fichier CSV.",
                        wizardSummary: {
                            inviteEmailInfo: "Un e-mail avec un lien de confirmation sera envoyé à l'adresse e-mail fournie à l'utilisateur afin de définir son propre mot de passe.",
                            successCount: "Nombre de réussites",
                            failedCount: "Nombre d'échecs",
                            totalUserCreationCount: "Nombre total de créations d'utilisateurs",
                            totalUserAssignmentCount: "Nombre total d'attributions de groupes",
                            tableHeaders: {
                                username: "Nom d'utilisateur",
                                status: "Statut",
                                message: "Message"
                            },
                            tableMessages: {
                                userCreatedMessage: "Utilisateur importé avec succès",
                                invalidDataMessage: "Données non valides fournies",
                                userAlreadyExistsMessage: "L'utilisateur existe déjà",
                                userCreationAcceptedMessage: "Création d'utilisateur acceptée",
                                internalErrorMessage: "Une erreur s'est produite lors de l'importation des " +
                                    "utilisateurs",
                                userAssignmentSuccessMessage: "Les utilisateurs ont été attribués avec succès à " +
                                    "{{resource}}",
                                userAssignmentFailedMessage: "L'affectation de l'utilisateur à {{resource}} a échoué",
                                userAssignmentInternalErrorMessage: "Une erreur s'est produite lors de " +
                                    "l'attribution d'utilisateurs à {{resource}}"

                            },
                            tableStatus: {
                                success: "Succès",
                                warning: "Avertissement",
                                failed: "Échoué"
                            },
                            alerts: {
                                importSuccess: {
                                    description: "Les utilisateurs ont été importés avec succès.",
                                    message: "Importation réussie"
                                },
                                importFailed: {
                                    userCreation: "Problèmes rencontrés dans les créations <1>d'utilisateurs " +
                                        "{{failedUserCreationCount}}</1>.",
                                    groupAssignment: "Problèmes rencontrés dans les attributions <1>de groupe " +
                                        "{{failedUserAssignmentCount}}</1>. Les utilisateurs des groupes concernés " +
                                        "ont été créés mais non attribués. Veuillez accéder à la section Gestion " +
                                        "des utilisateurs pour examiner et attribuer des groupes aux utilisateurs.",
                                    message: "Révision requise."
                                }
                            },
                            advanceSearch: {
                                searchByUsername: "Rechercher par nom d'utilisateur",
                                searchByGroup: "Recherche par nom de groupe",
                                roleGroupFilterAttributePlaceHolder: "Nom du groupe"
                            },
                            manualCreation: {
                                alerts: {
                                    creationSuccess: {
                                        description: "Les comptes d'utilisateurs ont été créés avec succès.",
                                        message: "Création d'utilisateurs réussie"
                                    }
                                },
                                hint: "Ajoutez l'adresse e-mail de l'utilisateur que vous souhaitez inviter et appuyez sur Entrée.",
                                emailsLabel: "E-mails",
                                emailsPlaceholder: "Entrez les adresses e-mail",
                                disabledHint: "TL'option manuelle est désactivée en raison de l'utilisation de noms d'utilisateur alphanumériques dans votre organisation.",
                                upload: {
                                    buttonText: "Télécharger le fichier CSV",
                                    description: "Faites glisser et déposez un fichier CSV ici."
                                },
                                primaryButton: "Ajouter",
                                groupsLabel: "Grupos",
                                groupsPlaceholder: "Entrar em grupos",
                                warningMessage: "Cette option ne peut être utilisée que lorsque l'adresse e-mail " +
                                    "est configurée comme nom d'utilisateur."
                            },
                            fileBased: {
                                hint: "Invitez plusieurs utilisateurs en masse à l’aide d’un fichier CSV."
                            },
                            responseOperationType: {
                                userCreation: "Création d'utilisateur",
                                roleAssignment: "Tarefa de grupo"
                            },
                            userstoreMessage: "Les utilisateurs créés seront ajoutés au magasin d'utilisateurs <1>{{ userstore }></1>."
                        },
                        buttons: {
                            import: "Importer"
                        },
                        sidePanel: {
                            manual: "Manuel",
                            fileBased: "Basé sur un fichier",
                            fileFormatTitle: "Format de fichier CSV",
                            fileFormatContent: "Les en-têtes du fichier CSV doivent être des attributs utilisateur " +
                                "mappés aux <1>attributs locaux</1>.",
                            fileFormatSampleHeading: "Exemple de format de fichier CSV:"
                        }
                    },
                    inviteParentUserWizard: {
                        totalInvitations: "Nombre total d'invitations",
                        successAlert: {
                            description: "L'invitation du ou des utilisateurs a réussi.",
                            message: "Invitation(s) envoyée(s)"
                        },
                        errorAlert: {
                            description: "Une erreur s'est produite lors de l'invitation de {{ failedCount }} " +
                                "utilisateur(s).",
                            message: "Examen requis"
                        },
                        tableMessages: {
                            userNotFound: "Utilisateur non trouvé",
                            activeInvitationExists: "Une invitation active existe déjà pour l'utilisateur",
                            userEmailNotFound: "Impossible de trouver l'e-mail de l'utilisateur invité",
                            userAlreadyExist: "L'utilisateur existe déjà"
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
                                dropdownPlaceholder: "Sélectionnez votre {{fieldName}}",
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
                                genericMessage: "Le compte utilisateur a bien été désactivé",
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
                                genericMessage: "Le compte de l'utilisateur a bien été activé",
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
                                genericMessage: "Le compte d'utilisateur a été verrouillé avec succès.",
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
                                genericMessage: "Le compte utilisateur a été déverrouillé avec succès.",
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
                revokeAdmin: {
                    confirmationModal: {
                        assertionHint: "Veuillez confirmer votre action.",
                        content: "Si vous révoquez les privilèges d'administrateur de cet utilisateur, l'utilisateur " +
                            "ne pourra pas se connecter à la console Asgardeo et ne pourra pas " +
                            "effectuer d'opérations d'administration. Veuillez procéder avec prudence.",
                        header: "Êtes-vous sûr?",
                        message: "Cette action révoquera les privilèges d'administrateur de l'utilisateur."
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
                            infoMessage: "Les rôles hérités via des groupes ne sont pas présentés ici.",
                            placeholders: {
                                emptyPlaceholder: {
                                    title: "Aucun rôle attribué",
                                    subtitles: "Il n'y a aucun rôle attribué à l'utilisateur pour le moment."
                                }
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
                            subHeading: "Afficher les rôles attribués directement à l'utilisateur."
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
                addUserType: {
                    createUser: {
                        title: "Créer un utilisateur",
                        description: "Créez un utilisateur dans votre organisation."
                    },
                    inviteParentUser: {
                        title: "Inviter l'utilisateur des parents",
                        description: "Invitez l'utilisateur de l'organisation parentale."
                    }
                },
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
                    placeholder: "Rechercher par Nom d'utilisateur"
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
                addUserDropDown: {
                    addNewUser:  "Ajouter un utilisateur",
                    bulkImport: "Importation en masse"
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
                    },
                    addMultipleUser: {
                        header: "Avant de continuer",
                        message: "L'option Inviter des utilisateurs est désactivée",
                        content: "Inviter l'utilisateur à définir le mot de passe doit être activé pour ajouter " +
                            "plusieurs utilisateurs. Veuillez activer la vérification des e-mails dans les paramètres" +
                            " de connexion et d'inscription.",
                        assertionHint: "Veuillez confirmer votre action."
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
                    },
                    placeholders: {
                        undefinedUser: {
                            action: "Retourner aux utilisateurs",
                            subtitles: "Il semble que l'utilisateur demandé n'existe pas.",
                            title: "Utilisateur non trouvé"
                        }
                    }
                },
                forms: {
                    validation: {
                        dateFormatError: "Le format du {{field}} saisi est incorrect. Le format valide est YYYY-MM-DD.",
                        formatError: "Le format du {{field}} saisi est incorrect.",
                        futureDateError: "La date que vous avez saisie pour le champ {{field}} n'est pas valide.",
                        mobileFormatError: "Le format du {{field}} saisi est incorrect. Le format valide est [+]" +
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
                    addUserPendingApproval: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur d'ajout de l'utilisateur"
                        },
                        genericError: {
                            description: "Impossible d'ajouter l'utilisateur",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Le nouvel utilisateur a été accepté et est en attente d'approbation.",
                            message: "Utilisateur accepté pour création"
                        }
                    },
                    bulkImportUser: {
                        validation: {
                            emptyRowError: {
                                description: "Le fichier sélectionné ne contient aucune donnée.",
                                message: "Fichier vide"
                            },
                            columnMismatchError: {
                                description: "Certaines lignes de données du fichier déposer ne correspondent " +
                                    "pas au nombre de colonnes requis. Veuillez examiner et corriger les données.",
                                message: "Incompatibilité du nombre de colonnes"
                            },
                            emptyHeaderError: {
                                description: "Assurez-vous que la première ligne contient les en-têtes de " +
                                "chaque colonne.",
                                message: "En-têtes de colonnes manquants"
                            },
                            missingRequiredHeaderError: {
                                description: "Le ou les en-têtes suivants sont requis mais sont manquants dans" +
                                "le fichier CSV: {{ headers }}.",
                                message: "En-têtes de colonnes obligatoires manquants"
                            },
                            blockedHeaderError: {
                                description: "Les en-têtes suivants ne sont pas autorisés : {{headers}}.",
                                message: "En-têtes de colonnes bloqués"
                            },
                            duplicateHeaderError: {
                                description: "Le(s) en-tête(s) suivant(s) sont dupliqués : {{headers}}.",
                                message: "En-têtes de colonnes en double"
                            },
                            invalidHeaderError: {
                                description: "Le ou les en-têtes suivants ne sont pas valides : {{headers}}.",
                                message: "En-têtes de colonnes invalides"
                            },
                            emptyDataField: {
                                description: "Le champ de données '{{dataField}}' ne doit pas être vide.",
                                message: "Champ de données vide"
                            },
                            invalidRole: {
                                description: "{{role}} n'existe pas.",
                                message: "Rôle introuvable"
                            },
                            invalidGroup: {
                                description: "{{group}} n'existe pas.",
                                message: "Groupe introuvable"
                            }
                        },
                        submit: {
                            error: {
                                description: "{{description}}",
                                message: "Une erreur s'est produite lors de l'importation des utilisateurs"
                            },
                            genericError: {
                                description: "Impossible d'importer les utilisateurs.",
                                message: "Une erreur s'est produite lors de l'importation des utilisateurs"
                            },
                            success: {
                                description: "Les utilisateurs ont été importés avec succès.",
                                message: "Utilisateurs importés avec succès"
                            }
                        },
                        timeOut: {
                            description: "Certains utilisateurs peuvent ne pas avoir été créés.",
                            message: "La demande a expiré"
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
                    },
                    getAdminRole: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la récupération du rôle d'administrateur"
                        },
                        genericError: {
                            description: "Impossible de récupérer les rôles d'administrateur.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Récupération réussie des rôles d'administrateur.",
                            message: "Récupération du rôle d'administrateur réussie"
                        }
                    },
                    revokeAdmin: {
                        error: {
                            description: "{{description}}",
                            message: "Erreur lors de la révocation des privilèges d'administrateur"
                        },
                        genericError: {
                            description: "Impossible de révoquer les privilèges d'administrateur.",
                            message: "Quelque chose s'est mal passé"
                        },
                        success: {
                            description: "Révocation réussie des privilèges d'administrateur.",
                            message: "Les privilèges d'administrateur ont bien été révoqués"
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
                        +" configuration. Veuillez procéder avec prudence.",
                    header: "Êtes-vous sûr ?",
                    hint: "Veuillez confirmer votre action.",
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
                        updatePassword: "Mettre à jour le mot de passe de connexion",
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
                            "Vous pouvez en ajouter à l'aide de l'assistant de création.",
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
                    reset: "Réinitialiser les modifications",
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
            },
            validation: {
                fetchValidationConfigData: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de récupération"
                    },
                    genericError: {
                        description: "Impossible de récupérer les données de configuration de validation.",
                        message: "Quelque chose s'est mal passé"
                    }
                },
                validationError: {
                    minMaxMismatch: "La longueur minimale doit être inférieure à la longueur maximale.",
                    uniqueChrMismatch: "Le nombre de caractères uniques doit être inférieur à la longueur " +
                        "minimale du mot de passe.",
                    consecutiveChrMismatch: "Le nombre de caractères consécutifs doit être inférieur à la " +
                        "longueur minimale du mot de passe.",
                    invalidConfig: "Impossible de créer un mot de passe avec les configurations ci-dessus.",
                    minLimitError: "La longueur minimale ne peut pas être inférieure à 8.",
                    maxLimitError: "La longueur maximale ne peut pas être supérieure à 30.",
                    wrongCombination: "La combinaison n'est pas autorisée"
                },
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de mise à jour"
                    },
                    genericError: {
                        description: "Échec de la mise à jour de la configuration de validation du mot de passe.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "Configuration de la validation du mot de passe mise à jour avec succès.",
                        message: "Mise à jour réussie"
                    }
                },
                pageTitle: "Validation du mot de passe",
                description: "Personnalisez les règles de validation des mots de passe pour vos utilisateurs.",
                goBackToApplication: "Revenir à l'application",
                goBackToValidationConfig: "Revenir à la sécurité du compte"
            },
            jwtPrivateKeyConfiguration: {
                fetchValidationConfigData: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de récupération"
                    },
                    genericError: {
                        description: "Impossible de récupérer les données de configuration de validation.",
                        message: "Quelque chose s'est mal passé"
                    }
                },
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Erreur de mise à jour"
                    },
                    genericError: {
                        description: "Échec de la mise à jour de la configuration de l'authentificateur de clé privée jwt.",
                        message: "Quelque chose s'est mal passé"
                    },
                    success: {
                        description: "La configuration de l'authentificateur de clé privée jwt a bien été mise à jour.",
                        message: "Mise à jour réussie"
                    }
                },
                pageTitle: "Authentification du client JWT par clé privée pour OIDC",
                description: "Authentifiez les clients confidentiels auprès du serveur d'autorisation lors de l'utilisation du point de terminaison de jeton.",
                goBackToApplication: "Revenir à l'application",
                goBackToAccountSecurityConfig: "Revenir à la sécurité du compte",
                messageInfo: "S'il est activé, le JWT peut être réutilisé à nouveau pendant sa période d'expiration. JTI (JWT ID) est une revendication qui fournit un identifiant unique pour le JWT.",
                tokenReuseEnabled: "Réutilisation du jeton activée",
                tokenReuseDisabled: "Réutilisation du jeton désactivée"
            },
            insights: {
                pageTitle: "Connaissances",
                title: "Connaissances",
                description: "Mieux comprendre le comportement des utilisateurs grâce aux statistiques d'utilisation.",
                durationMessage: "Afficher les résultats de <1>{{ startTimestamp }}</1> à <1>{{ endTimestamp }}</1>",
                durationOption: "{{ duration }} derniers jours",
                lastFetchedMessage: {
                    label: "Dernière récupération à {{ time }}",
                    tooltipText: "Les informations sur la dernière activité prendront quelques minutes pour être reflétées dans les graphiques"
                },
                commonFilters: {
                    userId: "ID de l'utilisateur"
                },
                activityType: {
                    login: {
                        filters: {
                            userStore: "Magasin d'utilisateurs",
                            serviceProvider: "Application",
                            authenticator: {
                                attributeName: "Type de connexion",
                                values: {
                                    basic: "Identifiant Mot de passe",
                                    identifierFirst: "Identifiant d'abord",
                                    fido2: "FIDO2",
                                    magicLink: "Lien magique",
                                    emailOtp: "E-mail OTP",
                                    smsOtp: "OTP SMS",
                                    totp: "TOTP",
                                    backupCodes: "Code de secours",
                                    google: "Google",
                                    facebook: "Facebook",
                                    github: "GitHub",
                                    apple: "Apple",
                                    oidc: "OIDC IdP",
                                    saml: "SAML IdP",
                                    hypr: "HYPR",
                                    organizationLogin: "Connexion à l'organisation"
                                }
                            },
                            identityProvider: "ID de connexion"
                        }
                    },
                    registration: {
                        filters: {
                            onboardingMethod: {
                                attributeName: "Méthode d'intégration",
                                values: {
                                    adminInitiated: "Par l'administrateur",
                                    userInvited: "Par e-mail d'invitation",
                                    selfSignUp: "Par auto-inscription"
                                }
                            }
                        }
                    }
                },
                advancedFilter: {
                    filterAttribute: "Attribut de filtre",
                    filterCondition: "État du filtre",
                    filterValue: "Valeur du filtre"
                },
                graphs: {
                    activeUsers: {
                        title: "Utilisateurs actifs",
                        titleHint: "Nombre d'utilisateurs uniques qui se sont connectés à votre organisation au cours de la période sélectionnée"
                    },
                    successLogins: {
                        title: "Connexions totales",
                        titleHint: "Nombre de connexions réussies à votre organisation au cours de la période sélectionnée"
                    },
                    failedLogins: {
                        title: "Connexions échouées"
                    },
                    signups: {
                        title: "Inscriptions d'utilisateurs",
                        titleHint: "Nombre total d'inscriptions d'utilisateurs au cours de la période sélectionnée"
                    }
                },
                notifications: {
                    fetchInsights: {
                        genericError: {
                            description: "Une erreur s'est produite lors de la récupération des informations pour la durée sélectionnée.",
                            message: "Quelque chose s'est mal passé"
                        }
                    }
                },
                compareToLastPeriodMessage: "Comparer à la dernière période"
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
            emailDomainDiscovery: {
                subTitle: "Configurez la découverte de domaines de messagerie pour les organisations.",
                title: "Découverte de domaines de messagerie"
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
                subTitle: "Créer et gérer des Organisations.",
                title: "Organisations"
            },
            overview: {
                subTitle: "Configurer et gérer les utilisateurs, les rôles, les claims " +
                    "et dialectes, les configurations du serveur, etc.",
                title: "Bienvenue, {{firstName}}"
            },
            roles: {
                alternateSubTitle: "Afficher et gérer les rôles.",
                subTitle: "Créer et gérer les rôles, attribuer des permissions.",
                title: "Rôles"
            },
            rolesEdit: {
                backButton: "Revenir aux {{type}}",
                subTitle: null,
                title: "Modifier le rôle"
            },
            groupsEdit: {
                backButton: "Revenir aux {{type}}",
                subTitle: null,
                title: "Modifier le groupe"
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
                backButton: "Revenir aux {{type}}",
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
    },
    featureGate: {
        enabledFeatures: {
            tags: {
                premium: {
                    warning: "Ceci est une fonctionnalité premium et sera bientôt désactivée pour le plan d'abonnement gratuit. Mettez à niveau votre abonnement pour un accès ininterrompu à cette fonctionnalité."
                }
            }
        }
    },
    saml2Config: {
        title: "Configuration SAML2 Web SSO",
        description: "Configurer SAML2 Web SSO pour vos applications.",
        form: {
            metadataValidityPeriod: {
                hint: "Réglez la période de validité des métadonnées SAML en quelques minutes.",
                label: "Période de validité des métadonnées"
            },
            destinationUrl: {
                hint: "L'emplacement pour envoyer la réponse SAML, telle que définie dans l'affirmation SAML.",
                label: "URL de destination"
            },
            enableMetadataSigning: {
                label: "Activer la signature des métadonnées"
            },
            validation: {
                metadataValidityPeriod: "La période de validité des métadonnées devrait être un entier positif.",
                destinationURLs: "Les URL de destination doivent être des URL valides et ne doivent pas être vides."
            }
        },
        notifications: {
            getConfiguration: {
                error: {
                    description: "Une erreur s'est produite tout en récupérant les configurations SAML2.",
                    message: "Erreur est survenue"
                }
            },
            updateConfiguration: {
                error: {
                    description: "L'erreur s'est produite lors de la mise à jour des configurations SAML2.",
                    message: "Erreur est survenue"
                },
                success: {
                    description: "Mis à jour avec succès les configurations SAML2.",
                    message: "Mise à jour réussie"
                }
            }
        }
    },
    sessionManagement: {
        description: "Gérez les paramètres liés à la session de vos utilisateurs.",
        title: "Gestion des sessions",
        form: {
            idleSessionTimeout: {
                hint: "L'utilisateur sera automatiquement déconnecté après l'heure configurée.",
                label: "Délai d'expiration de la session inactive",
                placeholder: "Entrez le délai d'expiration de la session inactive en minutes"
            },
            rememberMePeriod: {
                hint: "L'utilisateur sera invité à se reconnecter après l'heure configurée.",
                label: "Période Souviens-toi de moi",
                placeholder: "Entrez la période de mémorisation en minutes"
            },
            validation: {
                idleSessionTimeout: "Le délai d'expiration de la session inactive doit être un entier positif.",
                rememberMePeriod: "La période Remember Me doit être un entier positif."
            }
        },
        notifications: {
            getConfiguration: {
                error: {
                    description: "Une erreur s'est produite lors de la récupération des paramètres de gestion de session.",
                    message: "Erreur est survenue"
                }
            },
            updateConfiguration: {
                error: {
                    description: "Une erreur s'est produite lors de la mise à jour des paramètres de gestion de session.",
                    message: "Erreur est survenue"
                },
                success: {
                    description: "Mise à jour réussie des paramètres de gestion de session.",
                    message: "Mise à jour réussie"
                }
            }
        }
    },

    wsFederationConfig: {
        title: "Configuration WS-Federation",
        description: "Configurer le protocole WS-Federation pour vos applications.",
        form: {
            enableRequestSigning: {
                label: "Activer la signature des demandes d'authentification"
            }
        },
        notifications: {
            getConfiguration: {
                error: {
                    description: "Une erreur s'est produite tout en récupérant les configurations de fédération WS.",
                    message: "Erreur est survenue"
                }
            },
            updateConfiguration: {
                error: {
                    description: "L'erreur s'est produite lors de la mise à jour des configurations de fédération WS.",
                    message: "Erreur est survenue"
                },
                success: {
                    description: "Mis à jour avec succès les configurations WS-Federation.",
                    message: "Mise à jour réussie"
                }
            }
        }
    }
};
