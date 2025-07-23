/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
    "access": "Zugriff",
    "actions": "Aktionen",
    "activate": "aktivieren Sie",
    "active": "Aktiv",
    "add": "Hinzufügen",
    "addKey": "Geheimnis hinzufügen",
    "addURL": "URL hinzufügen",
    "all": "Alle",
    "applicationName": "Anwendungsname",
    "applications": "Anwendungen",
    "approvalStatus": "Freigabestand",
    "approvals": "Genehmigungen",
    "approvalsPage": {
        "list": {
            "columns": {
                "actions": "Aktionen",
                "name": "Name"
            }
        },
        "modals": {
            "description": "Überprüfen Sie die betrieblichen Aufgaben, die Ihre Genehmigung erfordern",
            "header": "Genehmigungen",
            "subHeader": "Überprüfen Sie die betrieblichen Aufgaben, die Ihre Genehmigung erfordern"
        },
        "notifications": {
            "fetchApprovalDetails": {
                "error": {
                    "description": "{{description}}",
                    "message": "Fehler beim Abrufen der Genehmigungsdetails"
                },
                "genericError": {
                    "description": "Die Genehmigungsdetails konnten nicht abgerufen werden.",
                    "message": "Da ist etwas schiefgelaufen"
                }
            },
            "fetchPendingApprovals": {
                "error": {
                    "description": "{{description}}",
                    "message": "Fehler beim Abrufen ausstehender Genehmigungen"
                },
                "genericError": {
                    "description": "Die ausstehenden Genehmigungen konnten nicht abgerufen werden.",
                    "message": "Da ist etwas schiefgelaufen"
                }
            },
            "updatePendingApprovals": {
                "error": {
                    "description": "{{description}}",
                    "message": "Fehler beim Aktualisieren der Genehmigung"
                },
                "genericError": {
                    "description": "Die ausstehende Genehmigung konnte nicht aktualisiert werden.",
                    "message": "Da ist etwas schiefgelaufen"
                },
                "success": {
                    "description": "Die Genehmigung wurde erfolgreich aktualisiert.",
                    "message": "Update erfolgreich"
                }
            }
        },
        "placeholders": {
            "emptyApprovalFilter": {
                "action": "Alle anzeigen",
                "subtitles": {
                    0: "Derzeit gibt es keine Genehmigungen im Status {{status}}.",
                    1: "Bitte überprüfen Sie, ob Sie Aufgaben im Status {{status}} haben, um",
                    2: "sie hier anzuzeigen."
                },
                "title": "Keine Ergebnisse gefunden"
            },
            "emptyApprovalList": {
                "action": "",
                "subtitles": {
                    0: "Derzeit gibt es keine Genehmigungen zur Überprüfung.",
                    1: "Bitte überprüfen Sie, ob Sie einen Workflow hinzugefügt haben, um die Vorgänge im System zu steuern.",
                    2: ""
                },
                "title": "Keine Genehmigungen"
            },
            "emptySearchResults": {
                "action": "Alle anzeigen",
                "subtitles": {
                    0: "Wir konnten den von Ihnen gesuchten Workflow nicht finden.",
                    1: "Bitte überprüfen Sie, ob Sie einen Workflow mit diesem Namen in",
                    2: "dem System haben."
                },
                "title": "Keine Genehmigungen"
            },
            "searchApprovals": "Nach Workflow-Namen suchen"
        },
        "subTitle": "Überprüfen Sie die betrieblichen Aufgaben, die Ihre Genehmigung erfordern",
        "title": "Genehmigungen"
    },
    "approve": "Genehmigen",
    "apps": "Anwendungen",
    "assignee": "Beauftragter",
    "assignees": "Beauftragte",
    "asyncOperationErrorMessage": {
        "description": "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später noch einmal.",
        "message": "Da ist etwas schiefgelaufen"
    },
    "authentication": "Authentifizierung",
    "authenticator": "Authentifikator",
    "authenticator_plural": "Authentifikatoren",
    "back": "Zurück",
    "beta": "Beta",
    "browser": "Browser",
    "cancel": "Stornieren",
    "challengeQuestionNumber": "Herausforderungsfrage {{number}}",
    "change": "Veränderung",
    "chunkLoadErrorMessage": {
        "description": "Beim Bereitstellen der angeforderten Anwendung ist ein Fehler aufgetreten. Bitte versuchen Sie, die App neu zu laden.",
        "heading": "Etwas ist schief gelaufen",
        "primaryActionText": "Laden Sie die App neu"
    },
    "claim": "Beanspruchen",
    "clear": "klar",
    "clientId": "Kunden ID",
    "close": "Schließen",
    "comingSoon": "Kommt bald",
    "completed": "Abgeschlossen",
    "configure": "Konfigurieren",
    "confirm": "Bestätigen",
    "contains": "enthält",
    "continue": "Fortsetzen",
    "copyToClipboard": "In die Zwischenablage kopieren",
    "create": "Erstellen",
    "createdOn": " Angelegt am ",
    "dangerZone": "Gefahrenzone",
    "darkMode": "Dunkler Modus",
    "delete": "Löschen",
    "deprecated": "Diese Konfiguration ist veraltet und wird in einer zukünftigen Version entfernt.",
    "description": "Beschreibung",
    "deviceModel": "Gerätemodell",
    "disable": "Deaktivieren",
    "disabled": "Deaktiviert",
    "docs": "Dokumente",
    "documentation": "Dokumentation",
    "done": "Getan",
    "download": "Download",
    "drag": "Ziehen",
    "duplicateURLError": "Dieser Wert ist bereits hinzugefügt",
    "edit": "Bearbeiten",
    "enable": "Aktivieren",
    "enabled": "aktiviert",
    "endsWith": "endet auf",
    "equals": "Gleich",
    "exitFullScreen": "Beenden Sie den Vollbildmodus",
    "experimental": "Experimental",
    "explore": "Entdecken",
    "export": "Export",
    "featureAvailable": "Diese Funktion wird in Kürze verfügbar sein!",
    "filter": "Filter",
    "finish": "Fertig",
    "generatePassword": "Generiere Passwort",
    "goBackHome": "Wieder nach Hause gehen",
    "goFullScreen": "Gehe in den Vollbildmodus",
    "good": "Gut",
    "help": "Hilfe",
    "hide": "Verstecken",
    "hidePassword": "Passwort verbergen",
    "identityProviders": "Identitätsanbieter",
    "import": "Importieren",
    "initiator": "Initiator",
    "ipAddress": "IP Adresse",
    "issuer": "Aussteller",
    "lastAccessed": "Zuletzt aufgerufen",
    "lastModified": "Zuletzt bearbeitet",
    "lastSeen": "Zuletzt gesehen",
    "lastUpdatedOn": "Zuletzt aktualisiert am",
    "learnMore": "Mehr erfahren",
    "lightMode": "Lichtmodus",
    "loading": "Wird geladen",
    "loginTime": "Anmeldezeit",
    "logout": "Logout",
    "makePrimary": "Primär machen",
    "maxValidation": "Dieser Wert sollte kleiner oder gleich {{max}} sein.",
    "maximize": "Maximieren",
    "metaAttributes": "Metaattribute",
    "minValidation": "Dieser Wert sollte größer oder gleich {{min}} sein.",
    "minimize": "Minimieren",
    "minutes": "minuten",
    "more": "Mehr",
    "myAccount": "Mein Konto",
    "name": "Name",
    "networkErrorMessage": {
        "description": "Bitte versuchen Sie erneut, sich anzumelden.",
        "heading": "Deine Sitzung ist abgelaufen",
        "primaryActionText": "Einloggen"
    },
    "new": "Neu",
    "next": "Nächster",
    "noResultsFound": "Keine Ergebnisse gefunden",
    "okay": "Okay",
    "operatingSystem": "Betriebssystem",
    "operations": "Betrieb",
    "organizationName": "{{orgName}} Organisation",
    "overview": "Überblick",
    "personalInfo": "Persönliche Informationen",
    "pin": "PIN",
    "pinned": "Gepinnt",
    "premium": "Prämie",
    "pressEnterPrompt": "Drücken Sie zur Auswahl die <1>Eingabetaste</1>",
    "preview": "Vorschau",
    "previous": "Bisherige",
    "primary": "Primär",
    "priority": "Priorität",
    "privacy": "Privatsphäre",
    "properties": "Eigenschaften",
    "publish": "Veröffentlichen",
    "ready": "Bereit",
    "regenerate": "Regenerieren",
    "register": "Registrieren",
    "reject": "Ablehnen",
    "release": "Veröffentlichung",
    "remove": "Entfernen",
    "removeAll": "Alles entfernen",
    "required": "Dies ist erforderlich.",
    "reserved": "Reserviert",
    "resetFilters": "Filter zurücksetzen",
    "retry": "Wiederholen",
    "revoke": "Widerrufen",
    "revokeAll": "Alle widerrufen",
    "samples": "Proben",
    "save": "speichern",
    "saveDraft": "Entwurf speichern",
    "sdks": "SDKs",
    "search": "Suche",
    "searching": "Suche",
    "security": "SICHERHEIT",
    "services": "Dienstleistungen",
    "settings": "die Einstellungen",
    "setup": "Konfiguration",
    "show": "Show",
    "showAll": "Zeige alles",
    "showLess": "Weniger anzeigen",
    "showMore": "Zeig mehr",
    "showPassword": "Passwort anzeigen",
    "skip": "Überspringen",
    "startsWith": "fängt an mit",
    "step": "Schritt",
    "strong": "stark",
    "submit": "einreichen",
    "switch": "Schalter",
    "technologies": "Technologien",
    "terminate": "Beenden",
    "terminateAll": "Alle beenden",
    "terminateSession": "Sitzung beenden",
    "tooShort": "Zu kurz",
    "type": "Art",
    "unpin": "Lösen Sie den Stift",
    "unpinned": "Losgelöst",
    "update": "Aktualisieren",
    "user": "Nutzer",
    "verified": "Verifiziert",
    "verify": "Überprüfen",
    "view": "Aussicht",
    "weak": "Schwach",
    "weakPassword": "Die Passwortstärke sollte zumindest gut sein."
};
