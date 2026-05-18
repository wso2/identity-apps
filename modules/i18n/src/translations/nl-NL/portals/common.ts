/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
    access: "Toegang",
    actions: "Acties",
    activate: "Activeren",
    active: "Actief",
    add: "Toevoegen",
    addKey: "Geheim toevoegen",
    addURL: "URL toevoegen",
    all: "Alle",
    applicationName: "Naam van de toepassing",
    applications: "Toepassingen",
    approvalStatus: "Goedkeuringsstatus",
    approvals: "Goedkeuringen",
    approvalsPage: {
        list: {
            columns: {
                actions: "Acties",
                name: "Naam"
            }
        },
        modals: {
            description: "Beoordeel de operationele taken die uw goedkeuring vereisen",
            header: "Goedkeuringen",
            subHeader: "Beoordeel de operationele taken die uw goedkeuring vereisen"
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "Fout bij het ophalen van de goedkeuringsdetails"
                },
                genericError: {
                    description: "De goedkeuringsdetails konden niet worden opgehaald.",
                    message: "Er is een fout opgetreden"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Fout bij het ophalen van openstaande goedkeuringen"
                },
                genericError: {
                    description: "De openstaande goedkeuringen konden niet worden opgehaald.",
                    message: "Er is een fout opgetreden"
                }
            },
            statusUpdate: {
                approved: {
                    description: "Het goedkeuringsverzoek is goedgekeurd.",
                    message: "Goedkeuringsverzoek goedgekeurd"
                },
                claimed: {
                    description: "Het goedkeuringsverzoek is geclaimd.",
                    message: "Goedkeuringsverzoek geclaimd"
                },
                rejected: {
                    description: "Het goedkeuringsverzoek is afgewezen.",
                    message: "Goedkeuringsverzoek afgewezen"
                },
                released: {
                    description: "Het goedkeuringsverzoek is vrijgegeven.",
                    message: "Goedkeuringsverzoek vrijgegeven"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "Fout bij het bijwerken van de goedkeuring"
                },
                genericError: {
                    description: "Het openstaande goedkeuringsverzoek kon niet worden bijgewerkt.",
                    message: "Er is een fout opgetreden"
                },
                success: {
                    description: "Het goedkeuringsverzoek is succesvol bijgewerkt.",
                    message: "Bijwerken geslaagd"
                }
            }
        },
        operationTypes: {
            addRole: "Rol toevoegen",
            addUser: "Gebruiker toevoegen",
            all: "Alle bewerkingen",
            deleteRole: "Rol verwijderen",
            deleteUser: "Gebruiker verwijderen",
            selfRegisterUser: "Zelfregistratie van gebruiker",
            updateRolesOfUser: "Gebruikers van de rol bijwerken"
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "Alles bekijken",
                subtitle: "Er zijn momenteel geen goedkeuringen met de status {{status}}.",
                title: "Geen resultaten gevonden"
            },
            emptyApprovalList: {
                action: "",
                subtitle: "Er zijn momenteel geen goedkeuringen om te beoordelen.",
                title: "Geen goedkeuringen"
            },
            emptySearchResults: {
                action: "Alles bekijken",
                subtitles: {
                    0: "We konden de workflow waarnaar u zocht niet vinden.",
                    1: "Controleer of u een workflow met deze naam heeft in",
                    2: "het systeem."
                },
                title: "Geen goedkeuringen"
            },
            searchApprovals: "Zoeken op workflownaam"
        },
        propertyMessages: {
            assignedUsersDeleted: "De toegewezen gebruikers zijn verwijderd.",
            roleDeleted: "De rol is verwijderd.",
            selfRegistration: "Zelfregistratie",
            unassignedUsersDeleted: "De niet-toegewezen gebruikers zijn verwijderd."
        },
        search: {
            placeholder: "Zoeken op verzoek-ID"
        },
        subTitle: "Beoordeel de operationele taken die uw goedkeuring vereisen",
        title: "Goedkeuringen"
    },
    approve: "Goedkeuren",
    approved: "Goedgekeurd",
    apps: "Toepassingen",
    assignYourself: "Wijs aan uzelf toe",
    assignee: "Gemachtigde",
    assignees: "Controleurs",
    asyncOperationErrorMessage: {
        description: "Er is iets misgegaan",
        message: "Er is een onverwachte fout opgetreden. Probeer het later opnieuw."
    },
    authentication: "Authenticatie",
    authenticator: "Authenticator",
    authenticator_plural: "Authenticators",
    back: "Terug",
    beta: "Bèta",
    browser: "Browser",
    cancel: "Annuleren",
    challengeQuestionNumber: "Beveiligingsvraag {{number}}",
    change: "Wijzigen",
    chunkLoadErrorMessage: {
        description: "Er is een fout opgetreden bij het laden van de gevraagde toepassing. Probeer " +
            "de toepassing opnieuw te laden.",
        heading: "Er is iets misgegaan",
        primaryActionText: "Toepassing opnieuw laden"
    },
    clear: "Wissen",
    clientId: "Client-ID",
    close: "Sluiten",
    comingSoon: "Binnenkort beschikbaar",
    completed: "Voltooid",
    configure: "Configureren",
    confirm: "Bevestigen",
    contains: "Bevat",
    continue: "Doorgaan",
    copied: "Gekopieerd!",
    copyToClipboard: "Kopiëren naar klembord",
    create: "Aanmaken",
    createdOn: "Aangemaakt op",
    dangerZone: "Gevarenzone",
    darkMode: "Donkere modus",
    default: "Standaard",
    delete: "Verwijderen",
    deprecated: "Deze configuratie is verouderd en wordt in een toekomstige versie verwijderd.",
    description: "Beschrijving",
    deviceModel: "Apparaatmodel",
    disable: "uitschakelen",
    disabled: "uitgeschakeld",
    docs: "Documenten",
    documentation: "Documentatie",
    done: "Gereed",
    download: "Downloaden",
    drag: "Slepen",
    duplicateURLError: "Deze waarde is al toegevoegd",
    edit: "Bewerken",
    enable: "Inschakelen",
    enabled: "Ingeschakeld",
    endsWith: "Eindigt met",
    equals: "Is gelijk aan",
    exitFullScreen: "Volledig scherm verlaten",
    experimental: "experimenteel",
    explore: "Verkennen",
    export: "Exporteren",
    featureAvailable: "Deze functie is binnenkort beschikbaar!",
    filter: "Filteren",
    finish: "Voltooien",
    generatePassword: "Wachtwoord genereren",
    goBackHome: "Terug naar startpagina",
    goFullScreen: "Volledig scherm openen",
    good: "Goed",
    greaterThanOrEqual: "Groter dan of gelijk aan",
    help: "Help",
    hide: "Verbergen",
    hidePassword: "Wachtwoord verbergen",
    identityProviders: "Identiteitsproviders",
    import: "Importeren",
    initiator: "Initiator",
    ipAddress: "IP-adres",
    issuer: "Uitgever",
    lastAccessed: "Laatst geopend",
    lastModified: "Laatst gewijzigd",
    lastSeen: "Laatst gezien",
    lastUpdatedOn: "Laatst bijgewerkt op",
    learnMore: "Meer informatie",
    lessThanOrEqual: "Kleiner dan of gelijk aan",
    lightMode: "Lichte modus",
    loading: "Laden",
    loginTime: "Aanmeldtijd",
    logout: "Afmelden",
    makePrimary: "Als primair instellen",
    maxValidation: "Deze waarde moet kleiner zijn dan of gelijk aan {{max}}.",
    maximize: "Maximaliseren",
    metaAttributes: "Meta-attributen",
    minValidation: "Deze waarde moet groter zijn dan of gelijk aan {{min}}.",
    minimize: "Minimaliseren",
    minutes: "min",
    more: "Meer",
    myAccount: "Mijn account",
    name: "Naam",
    networkErrorMessage:{
        description: "Probeer opnieuw aan te melden.",
        heading: "Uw sessie is verlopen",
        primaryActionText: "Aanmelden"
    },
    new: "Nieuw",
    next: "Volgende",
    noResultsFound: "Geen resultaten gevonden",
    none: "Geen",
    okay: "Oké",
    operatingSystem: "Besturingssysteem",
    operationType: "Type bewerking",
    operations: "Bewerkingen",
    organizationName: "{{orgName}} organisatie",
    overview: "Overzicht",
    parameter: "Parameter",
    pending: "In afwachting",
    personalInfo: "Persoonlijke gegevens",
    pin: "Vastmaken",
    pinned: "Vastgemaakt",
    premium: "premium",
    pressEnterPrompt: "Druk op <1>Enter</1> om te selecteren",
    preview: "Voorbeeld",
    previous: "Vorige",
    primary: "Primair",
    priority: "Prioriteit",
    privacy: "Privacy",
    properties: "Eigenschappen",
    publish: "Publiceren",
    ready: "Gereed",
    regenerate: "Opnieuw genereren",
    register: "Registreren",
    reject: "Afwijzen",
    rejected: "Afgewezen",
    remove: "Verwijderen",
    removeAll: "Alles verwijderen",
    required: "Dit is verplicht",
    reserved: "Gereserveerd",
    resetFilters: "Filters opnieuw instellen",
    retry: "Opnieuw proberen",
    revert: "Terugdraaien",
    revoke: "Intrekken",
    revokeAll: "Alles intrekken",
    samples: "Voorbeelden",
    save: "Opslaan",
    saveDraft: "Concept opslaan",
    sdks: "SDK's",
    search: "Zoeken",
    searching: "Zoeken",
    security: "Beveiliging",
    selectAll: "Alles selecteren",
    selectNone: "Niets selecteren",
    services: "Diensten",
    settings: "Instellingen",
    setup: "Installeren",
    show: "Tonen",
    showAll: "Alles tonen",
    showLess: "Minder tonen",
    showMore: "Meer tonen",
    showPassword: "Wachtwoord tonen",
    skip: "overslaan",
    startsWith: "Begint met",
    step: "Stap",
    strong: "Sterk",
    submit: "Verzenden",
    switch: "Wisselen",
    technologies: "Technologieën",
    terminate: "Beëindigen",
    terminateAll: "Alles beëindigen",
    terminateSession: "Sessie beëindigen",
    tooShort: "Te kort",
    type: "Type",
    unassign: "Toewijzing opheffen",
    unpin: "Losmaken",
    unpinned: "Losgemaakt",
    update: "Bijwerken",
    user: "Gebruiker",
    verified: "Geverifieerd",
    verify: "Verifiëren",
    view: "Bekijken",
    viewDetails: "Details bekijken",
    weak: "Zwak",
    weakPassword: "De sterkte van het wachtwoord moet minstens goed zijn."
};
