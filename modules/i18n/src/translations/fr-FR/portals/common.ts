/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { CommonNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const common: CommonNS = {
    access: "Accès",
    actions: "Actions",
    activate: "Activer",
    active: "Actif",
    add: "Ajouter",
    addKey: "Ajouter un secret",
    addURL: "ajouter l'URL",
    all: "Tous",
    applicationName: "Nom de l'application",
    applications: "Applications",
    approvalStatus: "Statut d'approbation",
    approvals: "Approbations",
    approvalsPage: {
        list: {
            columns: {
                actions: "Actes",
                name: "Nom"
            }
        },
        modals: {
            description: "Examinez les tâches opérationnelles nécessitant votre approbation",
            header: "Approbations",
            subHeader: "Examinez les tâches opérationnelles nécessitant votre approbation"
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "Erreur lors de la récupération des détails d'approbation"
                },
                genericError: {
                    description: "Les détails d'approbation n'ont pas pu être récupérés.",
                    message: "Une erreur s'est produite"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Erreur lors de la récupération des approbations en attente"
                },
                genericError: {
                    description: "Les approbations en attente n'ont pas pu être récupérées.",
                    message: "Une erreur s'est produite"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Erreur lors de la mise à jour de l'approbation"
                },
                genericError: {
                    description: "La demande d'approbation en attente n'a pas pu être mise à jour.",
                    message: "Une erreur s'est produite"
                },
                success: {
                    description: "La demande d'approbation a été mise à jour avec succès.",
                    message: "Mise à jour réussie"
                }
            }
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "Voir tout",
                subtitles: {
                    0: "Il n'y a actuellement aucune approbation dans l'état {{status}}.",
                    1: "Veuillez vérifier si vous avez des tâches dans l'état {{status}} pour",
                    2: "les voir ici."
                },
                title: "Aucun résultat trouvé"
            },
            emptyApprovalList: {
                action: "",
                subtitles: {
                    0: "Il n'y a actuellement aucune approbation à examiner.",
                    1: "Veuillez vérifier si vous avez ajouté un flux de travail pour contrôler les opérations dans le système.",
                    2: ""
                },
                title: "Aucune approbation"
            },
            emptySearchResults: {
                action: "Voir tout",
                subtitles: {
                    0: "Nous n'avons pas pu trouver le flux de travail que vous avez recherché.",
                    1: "Veuillez vérifier si vous avez un flux de travail avec ce nom dans",
                    2: "le système."
                },
                title: "Aucune approbation"
            },
            searchApprovals: "Rechercher par nom de flux de travail"
        },
        subTitle: "Examinez les tâches opérationnelles nécessitant votre approbation",
        title: "Approbations"
    },
    approve: "Approuver",
    apps: "Applications",
    assignee: "Cessionnaire",
    assignees: "Contrôleurs",
    asyncOperationErrorMessage: {
        description: "Quelque chose s'est mal passé",
        message: "Une erreur inattendue s'est produite. Veuillez réessayer ultérieurement."
    },
    authentication: "Authentification",
    authenticator: "Authentificateur",
    authenticator_plural: "Authentificateurs",
    back: "Dos",
    beta: "Bêta",
    browser: "Navigateur",
    cancel: "Annuler",
    challengeQuestionNumber: "Question de sécurité {{number}}",
    change: "Modifier",
    chunkLoadErrorMessage: {
        description: "Une erreur s'est produite lors de la diffusion de l'application demandée. Veuillez essayer " +
            "de recharger l'application.",
        heading: "Quelque chose s'est mal passé",
        primaryActionText: "Recharger l'application"
    },
    claim: "Claim",
    clear: "Effacer",
    clientId: "Identité du client",
    close: "Fermer",
    comingSoon: "Bientôt disponible",
    completed: "Terminé",
    configure: "Configurer",
    confirm: "Confirmer",
    contains: "Contient",
    continue: "Continuer",
    copyToClipboard: "Copier dans le presse-papier",
    create: "Créer",
    createdOn: "Créé le",
    dangerZone: "Zone de danger",
    darkMode: "Mode sombre",
    delete: "Supprimer",
    deprecated: "Cette configuration est obsolète et sera supprimée dans une version future.",
    description: "Description",
    deviceModel: "Modèle d'appareil",
    disable: "désactiver",
    disabled: "désactivé",
    docs: "Docs",
    documentation: "Documentation",
    done: "Fait",
    download: "Télécharger",
    drag: "Glisser",
    duplicateURLError: "Cette valeur a déjà été ajoutée",
    edit: "Éditer",
    enable: "Activer",
    enabled: "Activée",
    endsWith: "Se termine par",
    equals: "Est égal à",
    exitFullScreen: "Quitter le mode plein écran",
    experimental: "expérimental",
    explore: "Explorer",
    export: "Exporter",
    featureAvailable: "Cette fonctionnalité sera bientôt disponible!",
    filter: "Filtrer",
    finish: "Terminer",
    generatePassword: "Générer un mot de passe",
    goBackHome: "Revenir à l'accueil",
    goFullScreen: "Ouvrir en plein écran",
    good: "Bien",
    help: "Aide",
    hide: "Cacher",
    hidePassword: "Cacher le mot de passe",
    identityProviders: "Fournisseurs d'identité",
    import: "Importer",
    initiator: "Initiateur",
    ipAddress: "Addresse IP",
    issuer: "Émetteur",
    lastAccessed: "Dernier accès",
    lastModified: "Dernière modification",
    lastSeen: "Dernier vu",
    lastUpdatedOn: "Dernière mise à jour le",
    learnMore: "Apprendre encore plus",
    lightMode: "Mode lumière",
    loading: "Chargement",
    loginTime: "Heure de connexion",
    logout: "Déconnexion",
    makePrimary: "Faire primaire",
    maxValidation: "Cette valeur doit être inférieure ou égale à {{max}}.",
    maximize: "Maximiser",
    metaAttributes: "Méta-attributs",
    minValidation: "Cette valeur doit être supérieure ou égale à {{min}}.",
    minimize: "Minimiser",
    minutes: "mins",
    more: "Plus",
    myAccount: "Mon compte",
    name: "Nom",
    networkErrorMessage:{
        description: "Veuillez réessayer de vous connecter.",
        heading: "Votre session a expiré",
        primaryActionText: "S'identifier"
    },
    new: "Nouveau",
    next: "Suivant",
    noResultsFound: "Aucun résultat trouvé",
    okay: "d'accord",
    operatingSystem: "Système d'exploitation",
    operations: "Opérations",
    organizationName: "{{orgName}} organisation",
    overview: "Vue d'ensemble",
    personalInfo: "Informations personnelles",
    pin: "Épingler",
    pinned: "Épinglé",
    premium: "prime",
    pressEnterPrompt: "Appuyez sur <1>Entrée</1> pour sélectionner",
    preview: "Aperçu",
    previous: "Précédent",
    primary: "Primaire",
    priority: "Priorité",
    privacy: "Vie privée",
    properties: "Propriétés",
    publish: "Publier",
    ready: "Prêt",
    regenerate: "Régénérer",
    register: "Inscrire",
    reject: "Rejeter",
    release: "Version",
    remove: "Retirer",
    removeAll: "Tout retirer",
    required: "Ceci est nécessaire",
    reserved: "Réservé",
    resetFilters: "Réinitialiser les filtres",
    retry: "Réessayer",
    revoke: "Révoquer",
    revokeAll: "Tout révoquer",
    samples: "Exemples",
    save: "Sauvegarder",
    saveDraft: "Enregistrer le brouillon",
    sdks: "SDKs",
    search: "Rechercher",
    searching: "Recherche",
    security: "Sécurité",
    selectAll: "Sélectionnez tout",
    selectNone: "Sélectionnez aucun",
    services: "Services",
    settings: "Paramètres",
    setup: "Installer",
    show: "Afficher",
    showAll: "Tout afficher",
    showLess: "Afficher moins",
    showMore: "Afficher plus",
    showPassword: "Afficher le mot de passe",
    skip: "sauter",
    startsWith: "Commence par",
    step: "Étape",
    strong: "Fort",
    submit: "Valider",
    switch: "Changer",
    technologies: "Technologies",
    terminate: "Terminer",
    terminateAll: "Tout terminer",
    terminateSession: "Terminer la session",
    tooShort: "Trop court",
    type: "Type",
    unpin: "Détacher",
    unpinned: "Détaché",
    update: "Mettre à jour",
    user: "Utilisateur",
    verified: "Vérifié",
    verify: "Vérifier",
    view: "Voir",
    weak: "Faible",
    weakPassword: "La force du mot de passe doit au moins être bonne."
};
