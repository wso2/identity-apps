/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { MyAccountNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    "components": {
        "accountRecovery": {
            SMSRecovery: {
                descriptions: {
                    add: "Fügen Sie die Handynummer zur Wiederherstellung hinzu oder aktualisieren Sie sie.",
                    emptyMobile: "Sie müssen Ihre Handynummer konfigurieren, um mit der SMS-OTP-Wiederherstellung fortzufahren.",
                    update: "Aktualisieren Sie die Handynummer zur Wiederherstellung ({{mobile}})",
                    view: "Handynummer zur Wiederherstellung anzeigen ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "Handynummer",
                                placeholder: "Geben Sie die Handynummer zur Wiederherstellung ein.",
                                validations: {
                                    empty: "Geben Sie eine Handynummer ein.",
                                    invalidFormat: "Die Handynummer hat nicht das richtige Format."
                                }
                            }
                        }
                    }
                },
                heading: "SMS-Wiederherstellung",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Fehler beim Aktualisieren der Handynummer zur Wiederherstellung."
                        },
                        genericError: {
                            description: "Beim Aktualisieren der Handynummer zur Wiederherstellung ist ein Fehler aufgetreten",
                            message: "Etwas ist schief gelaufen"
                        },
                        success: {
                            description: "Die Handynummer im Benutzerprofil wurde erfolgreich aktualisiert",
                            message: "Handynummer erfolgreich aktualisiert"
                        }
                    }
                }
            },
            "codeRecovery": {
                "descriptions": {
                    "add": "Codewiederherstellungsoptionen hinzufügen oder aktualisieren"
                },
                "heading": "Codewiederherstellung"
            },
            "emailRecovery": {
                "descriptions": {
                    "add": "E-Mail-Adresse für die Wiederherstellung hinzufügen oder aktualisieren",
                    "emptyEmail": "Sie müssen Ihre E-Mail-Adresse konfigurieren, um mit der E-Mail-Wiederherstellung fortzufahren.",
                    "update": "Wiederherstellungs-E-Mail-Adresse aktualisieren ({{email}})",
                    "view": "Wiederherstellungs-E-Mail-Adresse anzeigen ({{email}})"
                },
                "forms": {
                    "emailResetForm": {
                        "inputs": {
                            "email": {
                                "label": "E-Mail-Addresse",
                                "placeholder": "Geben Sie die Wiederherstellungs-E-Mail-Adresse ein",
                                "validations": {
                                    "empty": "Gib eine E-mail Adresse ein",
                                    "invalidFormat": "Die E-Mail-Adresse hat nicht das richtige Format"
                                }
                            }
                        }
                    }
                },
                "heading": "E-Mail-Wiederherstellung",
                "notifications": {
                    "updateEmail": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Fehler beim Aktualisieren der Wiederherstellungs-E-Mail"
                        },
                        "genericError": {
                            "description": "Beim Aktualisieren der Wiederherstellungs-E-Mail ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "success": {
                            "description": "Die E-Mail-Adresse im Benutzerprofil wurde erfolgreich aktualisiert",
                            "message": "E-Mail-Adresse erfolgreich aktualisiert"
                        }
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Abrufen der Wiederherstellungseinstellung"
                    },
                    "genericError": {
                        "description": "Beim Abrufen der Wiederherstellungseinstellung ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die Wiederherstellungseinstellung wurde erfolgreich abgerufen",
                        "message": "Abruf der Wiederherstellungseinstellungen erfolgreich"
                    }
                }
            },
            "questionRecovery": {
                "descriptions": {
                    "add": "Fragen zur Kontowiederherstellung hinzufügen oder aktualisieren"
                },
                "forms": {
                    "securityQuestionsForm": {
                        "inputs": {
                            "answer": {
                                "label": "Antworten",
                                "placeholder": "Gib deine Antwort ein",
                                "validations": {
                                    "empty": "Antwort ist ein Pflichtfeld"
                                }
                            },
                            "question": {
                                "label": "Frage",
                                "placeholder": "Wähle eine Sicherheitsfrage",
                                "validations": {
                                    "empty": "Es muss mindestens eine Sicherheitsfrage ausgewählt werden"
                                }
                            }
                        }
                    }
                },
                "heading": "Sicherheitsfragen",
                "notifications": {
                    "addQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Beim Hinzufügen der Sicherheitsfragen ist ein Fehler aufgetreten"
                        },
                        "genericError": {
                            "description": "Beim Hinzufügen der Sicherheitsfragen ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen."
                        },
                        "success": {
                            "description": "Die erforderlichen Sicherheitsfragen wurden erfolgreich hinzugefügt",
                            "message": "Sicherheitsfragen wurden erfolgreich hinzugefügt"
                        }
                    },
                    "updateQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Fehler beim Aktualisieren der Sicherheitsfragen"
                        },
                        "genericError": {
                            "description": "Beim Aktualisieren der Sicherheitsfragen ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen."
                        },
                        "success": {
                            "description": "Die erforderlichen Sicherheitsfragen wurden erfolgreich aktualisiert",
                            "message": "Sicherheitsfragen wurden erfolgreich aktualisiert"
                        }
                    }
                }
            }
        },
        "advancedSearch": {
            "form": {
                "inputs": {
                    "filterAttribute": {
                        "label": "Filterattribut",
                        "placeholder": "B. Name, Beschreibung usw.",
                        "validations": {
                            "empty": "Das Filterattribut ist ein Pflichtfeld."
                        }
                    },
                    "filterCondition": {
                        "label": "Filterbedingung",
                        "placeholder": "B. beginnt mit usw.",
                        "validations": {
                            "empty": "Filterbedingung ist ein Pflichtfeld."
                        }
                    },
                    "filterValue": {
                        "label": "Filterwert",
                        "placeholder": "ZB admin, wso2 usw.",
                        "validations": {
                            "empty": "Der Filterwert ist ein Pflichtfeld."
                        }
                    }
                }
            },
            "hints": {
                "querySearch": {
                    "actionKeys": "Umschalt + Eingabe",
                    "label": "Als Abfrage suchen"
                }
            },
            "options": {
                "header": "Erweiterte Suche"
            },
            "placeholder": "Suche nach {{attribute}}",
            "popups": {
                "clear": "Saubere Suche",
                "dropdown": "Optionen anzeigen"
            },
            "resultsIndicator": "Ergebnisse für die Suchanfrage \"{{query}}\" werden angezeigt"
        },
        "applications": {
            "advancedSearch": {
                "form": {
                    "inputs": {
                        "filterAttribute": {
                            "placeholder": "B. Name, Beschreibung usw."
                        },
                        "filterCondition": {
                            "placeholder": "B. beginnt mit usw."
                        },
                        "filterValue": {
                            "placeholder": "Geben Sie den zu suchenden Wert ein"
                        }
                    }
                },
                "placeholder": "Suche nach Anwendungsnamen"
            },
            "all": {
                "heading": "Alle Anwendungen"
            },
            "favourite": {
                "heading": "Favoriten"
            },
            "notifications": {
                "fetchApplications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Abrufen von Anwendungen"
                    },
                    "genericError": {
                        "description": "Anwendungen konnten nicht abgerufen werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die Anwendungen wurden erfolgreich abgerufen.",
                        "message": "Anwendungsabruf erfolgreich"
                    }
                }
            },
            "placeholders": {
                "emptyList": {
                    "action": "Liste aktualisieren",
                    "subtitles": {
                        "0": "Die Anwendungsliste wurde leer zurückgegeben.",
                        "1": "Dies könnte daran liegen, dass keine erkennbaren Anwendungen vorhanden sind.",
                        "2": "Bitten Sie einen Administrator, die Auffindbarkeit für Anwendungen zu aktivieren."
                    },
                    "title": "Keine Anwendungen"
                }
            },
            "recent": {
                "heading": "Aktuelle Anwendungen"
            }
        },
        "changePassword": {
            "forms": {
                "passwordResetForm": {
                    "inputs": {
                        "confirmPassword": {
                            "label": "Passwort bestätigen",
                            "placeholder": "Geben Sie das neue Passwort ein",
                            "validations": {
                                "empty": "Passwort bestätigen ist ein Pflichtfeld",
                                "mismatch": "Die Passwortbestätigung stimmt nicht überein"
                            }
                        },
                        "currentPassword": {
                            "label": "Aktuelles Passwort",
                            "placeholder": "Geben Sie das aktuelle Passwort ein",
                            "validations": {
                                "empty": "Aktuelles Passwort ist ein Pflichtfeld",
                                "invalid": "Aktuelles Passwort ist ungültig"
                            }
                        },
                        "newPassword": {
                            "label": "Neues Kennwort",
                            "placeholder": "Geben Sie das neue Passwort ein",
                            "validations": {
                                "empty": "Neues Passwort ist ein Pflichtfeld"
                            }
                        }
                    },
                    "validations": {
                        "genericError": {
                            "description": "Etwas ist schief gelaufen. Bitte versuche es erneut",
                            "message": "Fehler beim Ändern des Passworts"
                        },
                        "invalidCurrentPassword": {
                            "description": "Das aktuell eingegebene Passwort scheint ungültig zu sein. Bitte versuche es erneut",
                            "message": "Fehler beim Ändern des Passworts"
                        },
                        "invalidNewPassword": {
                            "description": "Das Passwort erfüllt nicht die erforderlichen Einschränkungen.",
                            "message": "Ungültiges Passwort"
                        },
                        "passwordCaseRequirement": "Mindestens {{minUpperCase}} Großbuchstaben und {{minLowerCase}} Kleinbuchstaben",
                        "passwordCharRequirement": "Mindestens {{minSpecialChr}} Sonderzeichen",
                        "passwordLengthRequirement": "Muss zwischen {{min}} und {{max}} Zeichen lang sein",
                        "passwordLowerCaseRequirement": "Mindestens {{minLowerCase}} Kleinbuchstaben",
                        "passwordNumRequirement": "Mindestens {{min}} Nummer(n)",
                        "passwordRepeatedChrRequirement": "Nicht mehr als {{repeatedChr}} wiederholte(s) Zeichen",
                        "passwordUniqueChrRequirement": "Mindestens {{uniqueChr}} eindeutige(s) Zeichen",
                        "passwordUpperCaseRequirement": "Mindestens {{minUpperCase}} Großbuchstaben",
                        "submitError": {
                            "description": "{{description}}",
                            "message": "Fehler beim Ändern des Passworts"
                        },
                        "submitSuccess": {
                            "description": "Das Passwort wurde erfolgreich geändert",
                            "message": "Zurücksetzen des Passworts erfolgreich"
                        },
                        "validationConfig": {
                            "error": {
                                "description": "{{description}}",
                                "message": "Abruffehler"
                            },
                            "genericError": {
                                "description": "Validierungskonfigurationsdaten konnten nicht abgerufen werden.",
                                "message": "Etwas ist schief gelaufen"
                            }
                        }
                    }
                }
            },
            "modals": {
                "confirmationModal": {
                    "heading": "Bestätigung",
                    "message": "Das Ändern des Passworts führt zur Beendigung der aktuellen Sitzung. Sie müssen sich mit dem neu geänderten Passwort anmelden. Möchten Sie fortfahren?"
                }
            }
        },
        "consentManagement": {
            "editConsent": {
                "collectionMethod": "Erfassungsmethode",
                "dangerZones": {
                    "revoke": {
                        "actionTitle": "Widerrufen",
                        "header": "Einwilligung widerrufen",
                        "subheader": "Sie müssen dieser Anwendung erneut zustimmen."
                    }
                },
                "description": "Beschreibung",
                "piiCategoryHeading": "Verwalten Sie die Zustimmung zur Erfassung und Weitergabe Ihrer persönlichen Daten mit der Anwendung. Deaktivieren Sie die Attribute, die Sie widerrufen müssen, und klicken Sie auf die Schaltfläche „Aktualisieren“, um die Änderungen zu speichern, oder klicken Sie auf die Schaltfläche „Widerrufen“, um die Zustimmung für alle Attribute zu entfernen.",
                "state": "Zustand",
                "version": "Ausführung"
            },
            "modals": {
                "consentRevokeModal": {
                    "heading": "Bist du sicher?",
                    "message": "Dieser Vorgang ist nicht umkehrbar. Dadurch wird die Zustimmung für alle Attribute dauerhaft widerrufen. Sind Sie sicher, dass Sie fortfahren möchten?",
                    "warning": "Bitte beachten Sie, dass Sie zur Anmeldeseite weitergeleitet werden"
                }
            },
            "notifications": {
                "consentReceiptFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Informationen zur ausgewählten Anwendung konnten nicht geladen werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Einwilligungsbeleg erfolgreich abgerufen",
                        "message": "Erfolgreicher Abruf"
                    }
                },
                "consentedAppsFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Die Liste der genehmigten Anwendungen konnte nicht geladen werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die Liste der genehmigten Anwendungen wurde erfolgreich abgerufen",
                        "message": "Erfolgreicher Abruf"
                    }
                },
                "revokeConsentedApp": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Widerruf der Einwilligung"
                    },
                    "genericError": {
                        "description": "Einwilligung für die Anwendung konnte nicht widerrufen werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die Einwilligung für die Bewerbung wurde erfolgreich widerrufen",
                        "message": "Einwilligungen widerrufen Erfolg"
                    }
                },
                "updateConsentedClaims": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Die genehmigten Ansprüche konnten für die Anwendung nicht aktualisiert werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die genehmigten Ansprüche wurden erfolgreich für die Anwendung aktualisiert",
                        "message": "Eingewilligte Ansprüche erfolgreich aktualisiert"
                    }
                }
            }
        },
        "cookieConsent": {
            "confirmButton": "Ich habs",
            "content": "Wir verwenden Cookies, um sicherzustellen, dass Sie das beste Gesamterlebnis erhalten. Diese Cookies werden verwendet, um eine ununterbrochene kontinuierliche Sitzung aufrechtzuerhalten und gleichzeitig reibungslose und personalisierte Dienste bereitzustellen. Um mehr darüber zu erfahren, wie wir Cookies verwenden, lesen Sie unsere <1>Cookie-Richtlinie</1> ."
        },
        "federatedAssociations": {
            "deleteConfirmation": "Dadurch wird das verknüpfte soziale Konto von Ihrem lokalen Konto entfernt. Möchten Sie mit dem Entfernen fortfahren?",
            "notifications": {
                "getFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Verknüpfte soziale Konten konnten nicht abgerufen werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Verknüpfte soziale Konten wurden erfolgreich abgerufen",
                        "message": "Verknüpfte soziale Konten erfolgreich abgerufen"
                    }
                },
                "removeAllFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Verknüpfte soziale Konten konnten nicht entfernt werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Alle verknüpften sozialen Konten wurden erfolgreich entfernt",
                        "message": "Verknüpfte soziale Konten erfolgreich entfernt"
                    }
                },
                "removeFederatedAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Das verknüpfte soziale Konto konnte nicht entfernt werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Das verknüpfte soziale Konto wurde erfolgreich entfernt",
                        "message": "Das verknüpfte soziale Konto wurde erfolgreich entfernt"
                    }
                }
            }
        },
        "footer": {
            "copyright": "WSO2-Identity Server © {{year}}"
        },
        "header": {
            "appSwitch": {
                "console": {
                    "description": "Als Entwickler oder Administrator verwalten",
                    "name": "Konsole"
                },
                "myAccount": {
                    "description": "Verwalten Sie Ihr eigenes Konto",
                    "name": "Mein Konto"
                },
                "tooltip": "Anwendungen"
            },
            "dropdown": {
                "footer": {
                    "cookiePolicy": "Cookies",
                    "privacyPolicy": "Datenschutz",
                    "termsOfService": "Bedingungen"
                }
            },
            "organizationLabel": "Dieses Konto wird verwaltet von"
        },
        "linkedAccounts": {
            "accountTypes": {
                "local": {
                    "label": "Lokales Benutzerkonto hinzufügen"
                }
            },
            "deleteConfirmation": "Dadurch wird das verknüpfte Konto aus Ihrem Konto entfernt. Möchten Sie mit dem Entfernen fortfahren?",
            "forms": {
                "addAccountForm": {
                    "inputs": {
                        "password": {
                            "label": "Passwort",
                            "placeholder": "Geben Sie das Passwort ein",
                            "validations": {
                                "empty": "Passwort ist ein Pflichtfeld"
                            }
                        },
                        "username": {
                            "label": "Nutzername",
                            "placeholder": "Geben Sie den Benutzernamen ein",
                            "validations": {
                                "empty": "Benutzername ist ein Pflichtfeld"
                            }
                        }
                    }
                }
            },
            "notifications": {
                "addAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Abrufen verknüpfter Benutzerkonten"
                    },
                    "genericError": {
                        "description": "Beim Hinzufügen des verknüpften Kontos ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Das erforderliche verknüpfte Benutzerkonto wurde erfolgreich hinzugefügt",
                        "message": "Verknüpftes Benutzerkonto erfolgreich hinzugefügt"
                    }
                },
                "getAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Abrufen verknüpfter Benutzerkonten"
                    },
                    "genericError": {
                        "description": "Beim Abrufen der verknüpften Benutzerkonten ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die erforderlichen Benutzerprofildetails wurden erfolgreich abgerufen",
                        "message": "Verknüpfte Benutzerkonten erfolgreich abgerufen"
                    }
                },
                "removeAllAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Entfernen verknüpfter Benutzerkonten"
                    },
                    "genericError": {
                        "description": "Beim Entfernen der verknüpften Benutzerkonten ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Alle verknüpften Benutzerkonten wurden entfernt",
                        "message": "Verknüpfte Konten erfolgreich entfernt"
                    }
                },
                "removeAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Entfernen des verknüpften Benutzerkontos"
                    },
                    "genericError": {
                        "description": "Beim Entfernen des verknüpften Benutzerkontos ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die verknüpften Benutzerkonten wurden entfernt",
                        "message": "Verknüpftes Konto erfolgreich entfernt"
                    }
                },
                "switchAccount": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Beim Wechseln des Kontos ist ein Fehler aufgetreten"
                    },
                    "genericError": {
                        "description": "Beim Wechseln des Kontos ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Das Konto wurde erfolgreich gewechselt",
                        "message": "Kontowechsel erfolgreich"
                    }
                }
            }
        },
        "loginVerifyData": {
            "description": "Diese Daten werden verwendet, um Ihre Identität während des Logins weiter zu überprüfen",
            "heading": "Daten, die zur Überprüfung Ihres Logins verwendet werden",
            "modals": {
                "clearTypingPatternsModal": {
                    "heading": "Bestätigung",
                    "message": "Diese Aktion löscht Ihre Tippmuster, die in TypingDNA gespeichert sind. Möchten Sie fortfahren?"
                }
            },
            "notifications": {
                "clearTypingPatterns": {
                    "error": {
                        "description": "Tippmuster konnten nicht gelöscht werden. Bitte wenden Sie sich an Ihren Site-Administrator",
                        "message": "Tippmuster konnten nicht gelöscht werden"
                    },
                    "success": {
                        "description": "Ihre Tippmuster in TypingDNA wurden erfolgreich gelöscht",
                        "message": "Tippmuster erfolgreich gelöscht"
                    }
                }
            },
            "typingdna": {
                "description": "Ihre Tippmuster können hier gelöscht werden",
                "heading": "TypingDNA-Typisierungsmuster"
            }
        },
        "mfa": {
            "authenticatorApp": {
                "addHint": "Konfigurieren",
                "configuredDescription": "Sie können TOTP-Codes aus Ihrer konfigurierten Authentifizierungs-App für die Zwei-Faktor-Authentifizierung verwenden. Wenn Sie keinen Zugriff auf die Anwendung haben, können Sie hier eine neue Authentifizierungs-App einrichten.",
                "deleteHint": "Entfernen",
                "description": "Sie können die Authentifizierungs-App verwenden, um Bestätigungscodes für die Zwei-Faktor-Authentifizierung zu erhalten.",
                "enableHint": "TOTP-Authentifikator aktivieren/deaktivieren",
                "heading": "TOTP-Authenticator",
                "hint": "Aussicht",
                "modals": {
                    "delete": {
                        "heading": "Bestätigung",
                        "message": "Diese Aktion entfernt den Ihrem Profil hinzugefügten QR-Code. Möchten Sie fortfahren ?"
                    },
                    "done": "Erfolg! Jetzt können Sie Ihre Authenticator-App für die Zwei-Faktor-Authentifizierung verwenden",
                    "heading": "Richten Sie eine Authenticator-App ein",
                    "scan": {
                        "additionNote": "Der QR-Code wurde Ihrem Profil erfolgreich hinzugefügt!",
                        "authenticatorApps": "Authentifizierungs-Apps",
                        "generate": "Generieren Sie einen neuen Code",
                        "heading": "Scannen Sie den QR-Code unten mit einer Authentifizierungs-App",
                        "messageBody": "Eine Liste der verfügbaren Authenticator-Apps finden Sie hier.",
                        "messageHeading": "Sie haben keine Authenticator-App installiert?",
                        "regenerateConfirmLabel": "Bestätigen Sie die Generierung eines neuen QR-Codes",
                        "regenerateWarning": {
                            "extended": "Wenn Sie einen neuen QR-Code regenerieren, müssen Sie ihn scannen und Ihre Authentifizierungs-App neu einrichten. Sie können sich nicht mehr mit dem vorherigen QR-Code anmelden.",
                            "generic": "Wenn Sie einen neuen QR-Code regenerieren, müssen Sie ihn scannen und Ihre Authentifizierungs-App neu einrichten. Ihre bisherige Einrichtung funktioniert nicht mehr."
                        }
                    },
                    "toolTip": "Sie haben keine Authentifizierungs-App? Laden Sie eine Authentifizierungs-App wie Google Authenticator aus dem <1>App Store herunter</1> oder <3>Google Play</3>",
                    "verify": {
                        "error": "Verifizierung fehlgeschlagen. Bitte versuche es erneut.",
                        "heading": "Geben Sie den generierten Code zur Verifizierung ein",
                        "label": "Bestätigungs-Code",
                        "placeholder": "Geben Sie Ihren Bestätigungs-Code ein",
                        "reScan": "Scannen Sie erneut",
                        "reScanQuestion": "Möchten Sie den QR-Code erneut scannen?",
                        "requiredError": "Geben Sie den Bestätigungscode ein"
                    }
                },
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Löschen des QR-Codes ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Erfolgreich entfernt",
                        "message": "Die TOTP-Konfiguration wurde erfolgreich entfernt."
                    },
                    "initError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Abrufen des QR-Codes ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Versuch, einen neuen QR-Code abzurufen, ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Versuch, die Liste der aktivierten Authentifikatoren zu aktualisieren, ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    }
                },
                "regenerate": "Regenerieren"
            },
            "backupCode": {
                "actions": {
                    "add": "Sicherungscodes hinzufügen",
                    "delete": "Sicherungscodes entfernen"
                },
                "description": "Verwenden Sie Backup-Codes, um auf Ihr Konto zuzugreifen, falls Sie keine Multi-Faktor-Authentifizierungscodes erhalten können. Sie können bei Bedarf neue Codes neu generieren.",
                "download": {
                    "heading": "Sicherungscodes für {{productName}}",
                    "info1": "Sie können jeden Ersatzcode nur einmal verwenden.",
                    "info2": "Diese Codes wurden am generiert",
                    "subHeading": "Sie können diese Backup-Codes verwenden, um sich bei {{productName}} anzumelden, wenn Sie nicht an Ihrem Telefon sind. Bewahren Sie diese Backup-Codes an einem sicheren, aber zugänglichen Ort auf."
                },
                "heading": "Backup-Codes",
                "messages": {
                    "disabledMessage": "Mindestens ein zusätzlicher Authentifikator sollte konfiguriert werden, um Sicherungscodes zu aktivieren."
                },
                "modals": {
                    "actions": {
                        "copied": "Kopiert",
                        "copy": "Codes kopieren",
                        "download": "Codes herunterladen",
                        "regenerate": "Regenerieren"
                    },
                    "delete": {
                        "description": "Durch diese Aktion werden Sicherungscodes entfernt und Sie können sie nicht mehr verwenden. " +
                            "Möchten Sie fortfahren?",
                        "heading": "Bestätigung"
                    },
                    "description": "Verwenden Sie Backup-Codes, um sich anzumelden, wenn Sie nicht an Ihrem Telefon sind.",
                    "generate": {
                        "description": "Alle Ihre Sicherungscodes werden verwendet. Lassen Sie uns einen neuen Satz Backup-Codes generieren",
                        "heading": "Generieren"
                    },
                    "heading": "Backup-Codes",
                    "info": "Jeder Code kann nur einmal verwendet werden. Sie können jederzeit neue Codes generieren, um diese zu ersetzen.",
                    "regenerate": {
                        "description": "Nachdem Sie neue Codes generiert haben, funktionieren Ihre alten Codes nicht mehr. Achten Sie darauf, die neuen Codes zu speichern, sobald sie generiert wurden.",
                        "heading": "Bestätigung"
                    },
                    "subHeading": "Einmalpasswörter, mit denen Sie sich anmelden können",
                    "warn": "Diese Codes werden nur einmal angezeigt. Stellen Sie sicher, dass Sie sie jetzt speichern und an einem sicheren, aber zugänglichen Ort aufbewahren."
                },
                "mutedHeader": "Wiederherstellungsoptionen",
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Löschen von Sicherungscodes ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Erfolgreich entfernt",
                        "message": "Sicherungscodes erfolgreich entfernt."
                    },
                    "downloadError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Versuch, Sicherungscodes herunterzuladen, ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "downloadSuccess": {
                        "genericMessage": {
                            "description": "Die Sicherungscodes wurden erfolgreich heruntergeladen.",
                            "message": "Sicherungscodes erfolgreich heruntergeladen."
                        },
                        "message": {
                            "description": "{{message}}",
                            "message": "Sicherungscodes erfolgreich heruntergeladen."
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Versuch, neue Sicherungscodes zu generieren, ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "retrieveAuthenticatorError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Versuch, die Liste der aktivierten Authentifikatoren abzurufen, ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "retrieveError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Abrufen der Sicherungscodes ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{Fehler}}",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "genericError": {
                            "description": "Beim Versuch, die Liste der aktivierten Authentifikatoren zu aktualisieren, ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        }
                    }
                },
                "remaining": "Verbleibend"
            },
            "fido": {
                "description": "Sie können einen <1>Passkey</1>, <1>FIDO-Sicherheitsschlüssel</1> oder <1>Biometrische Daten</1> in Ihrem Gerät verwenden, um sich bei Ihrem Konto anzumelden.",
                "form": {
                    "label": "Passkey",
                    "placeholder": "Geben Sie einen Namen für den Passkey ein",
                    "remove": "Entfernen Sie den Passkey",
                    "required": "Bitte geben Sie einen Namen für Ihren Passkey ein"
                },
                "heading": "Passkey",
                "modals": {
                    "deleteConfirmation": {
                        "assertionHint": "Bitte bestätigen Sie Ihre Aktion.",
                        "content": "Diese Aktion ist irreversibel und löscht den Passkey dauerhaft.",
                        "description": "Wenn Sie diesen Passkey löschen, können Sie sich möglicherweise nicht mehr bei Ihrem Konto anmelden. Bitte gehen Sie vorsichtig vor.",
                        "heading": "Bist du sicher?"
                    },
                    "deviceRegistrationErrorModal": {
                        "description": "Die Passkey-Registrierung wurde unterbrochen. Wenn dies nicht beabsichtigt war, können Sie den Ablauf wiederholen.",
                        "heading": "Die Registrierung des Passkeys ist fehlgeschlagen",
                        "tryWithOlderDevice": "Sie können es auch mit einem älteren Passkey noch einmal versuchen."
                    }
                },
                "noPassKeyMessage": "Sie haben noch keine Passkeys registriert.",
                "notifications": {
                    "removeDevice": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Beim Entfernen des Passkeys ist ein Fehler aufgetreten"
                        },
                        "genericError": {
                            "description": "Beim Entfernen des Passkeys ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "success": {
                            "description": "Der Passkey wurde erfolgreich aus der Liste entfernt",
                            "message": "Ihr Passkey wurde erfolgreich entfernt"
                        }
                    },
                    "startFidoFlow": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Beim Abrufen des Passkeys ist ein Fehler aufgetreten"
                        },
                        "genericError": {
                            "description": "Beim Abrufen des Passkeys ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "success": {
                            "description": "Der Passkey wurde erfolgreich registriert und Sie verwenden ihn nun zur Authentifizierung.",
                            "message": "Ihr Passkey wurde erfolgreich registriert"
                        }
                    },
                    "updateDeviceName": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Beim Aktualisieren des Passkey-Namens ist ein Fehler aufgetreten"
                        },
                        "genericError": {
                            "description": "Beim Aktualisieren des Passkey-Namens ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "success": {
                            "description": "Der Name Ihres Passkeys wurde erfolgreich aktualisiert",
                            "message": "Der Passkey-Name wurde erfolgreich aktualisiert"
                        }
                    }
                },
                "tryButton": "Versuchen Sie es mit einem älteren Passkey"
            },
            "pushAuthenticatorApp": {
                "addHint": "Konfigurieren",
                "configuredDescription": "Sie können die Login-Eingabeaufforderungen nutzen, die von Ihrer konfigurierten Push-Authentifikator-App für die Zwei-Faktor-Authentifizierung generiert werden. Wenn Sie keinen Zugriff auf die Anwendung haben, können Sie hier eine neue Authentifikator-App einrichten.",
                "deleteHint": "Entfernen",
                "description": "Sie können die Push-Authentifikator-App verwenden, um Login-Eingabeaufforderungen als Push-Benachrichtigungen für die Zwei-Faktor-Authentifizierung zu erhalten.",
                "heading": "Push-Authentifikator",
                "hint": "Anzeigen",
                "modals": {
                    "deviceDeleteConfirmation": {
                        "assertionHint": "Bitte bestätigen Sie Ihre Aktion.",
                        "content": "Diese Aktion ist unwiderruflich und wird das Gerät dauerhaft entfernen.",
                        "description": "Wenn Sie dieses Gerät entfernen, können Sie möglicherweise nicht mehr auf Ihr Konto zugreifen. Bitte fahren Sie mit Vorsicht fort.",
                        "heading": "Sind Sie sicher?"
                    },
                    "scan": {
                        "additionNote": "Der QR-Code wurde erfolgreich zu Ihrem Profil hinzugefügt!",
                        "done": "Erfolg! Jetzt können Sie Ihre Push-Authentifikator-App für die Zwei-Faktor-Authentifizierung verwenden.",
                        "heading": "Push-Authentifikator-App einrichten",
                        "messageBody": "Eine Liste der verfügbaren Authentifikator-Apps finden Sie hier.",
                        "subHeading": "Scannen Sie den untenstehenden QR-Code mit der Push-Authentifikator-App"
                    }
                },
                "notifications": {
                    "delete": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Etwas ist schiefgelaufen"
                        },
                        "genericError": {
                            "description": "Beim Entfernen des registrierten Geräts ist ein Fehler aufgetreten.",
                            "message": "Etwas ist schiefgelaufen"
                        },
                        "success": {
                            "description": "Das registrierte Gerät wurde erfolgreich entfernt.",
                            "message": "Gerät erfolgreich gelöscht"
                        }
                    },
                    "deviceListFetchError": {
                        "error": {
                            "description": "Beim Abrufen der registrierten Geräte für die Push-Authentifizierung ist ein Fehler aufgetreten.",
                            "message": "Etwas ist schiefgelaufen"
                        }
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Etwas ist schiefgelaufen"
                        },
                        "genericError": {
                            "description": "Beim Abrufen des QR-Codes ist ein Fehler aufgetreten.",
                            "message": "Etwas ist schiefgelaufen"
                        }
                    }
                }
            },
            "smsOtp": {
                "descriptions": {
                    "hint": "Sie erhalten eine SMS mit einem einmaligen Bestätigungscode"
                },
                "heading": "Handynummer",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Beim Aktualisieren der Handynummer ist ein Fehler aufgetreten"
                        },
                        "genericError": {
                            "description": "Beim Aktualisieren der Handynummer ist ein Fehler aufgetreten",
                            "message": "Etwas ist schief gelaufen"
                        },
                        "success": {
                            "description": "Die Mobiltelefonnummer im Benutzerprofil wurde erfolgreich aktualisiert",
                            "message": "Handynummer erfolgreich aktualisiert"
                        }
                    }
                }
            }
        },
        "mobileUpdateWizard": {
            "done": "Erfolg! Ihre Handynummer wurde erfolgreich verifiziert.",
            "notifications": {
                "resendError": {
                    "error": {
                        "description": "{{Fehler}}",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "genericError": {
                        "description": "Beim Versuch, einen neuen Bestätigungscode abzurufen, ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    }
                },
                "resendSuccess": {
                    "message": "Anfrage zum erneuten Senden des Codes wurde erfolgreich gesendet"
                }
            },
            "submitMobile": {
                "heading": "Geben Sie Ihre neue Handynummer ein"
            },
            "verificationSent": {
                "heading": "Sie erhalten in Kürze ein OTP auf Ihre Handynummer zur Verifizierung"
            },
            "verifySmsOtp": {
                "didNotReceive": "Sie haben keinen Code erhalten?",
                "error": "Verifizierung fehlgeschlagen. Bitte versuche es erneut.",
                "heading": "Überprüfen Sie Ihre Handynummer",
                "label": "Geben Sie den an Ihre Handynummer gesendeten Bestätigungscode ein",
                "placeholder": "Geben Sie Ihren Bestätigungs-Code ein",
                "requiredError": "Geben Sie den Bestätigungscode ein",
                "resend": "Erneut senden"
            }
        },
        "overview": {
            "widgets": {
                "accountActivity": {
                    "actionTitles": {
                        "update": "Kontoaktivität verwalten"
                    },
                    "description": "Sie sind derzeit über das folgende Gerät angemeldet",
                    "header": "Aktive Sitzungen"
                },
                "accountSecurity": {
                    "actionTitles": {
                        "update": "Aktualisieren Sie die Kontosicherheit"
                    },
                    "description": "Einstellungen und Empfehlungen, die Ihnen dabei helfen, Ihr Konto zu schützen",
                    "header": "Konto Sicherheit"
                },
                "accountStatus": {
                    "complete": "Ihr Profil ist vollständig",
                    "completedFields": "Ausgefüllte Felder",
                    "completionPercentage": "Ihr Profilabschluss liegt bei {{percentage}} %",
                    "inComplete": "vervollständige dein Profil",
                    "inCompleteFields": "Unvollständige Felder",
                    "mandatoryFieldsCompletion": "{{completed}} von {{total}} Pflichtfeldern ausgefüllt",
                    "optionalFieldsCompletion": "{{completed}} von {{total}} optionalen Feldern ausgefüllt"
                },
                "consentManagement": {
                    "actionTitles": {
                        "manage": "Einwilligungen verwalten"
                    },
                    "description": "Steuern Sie die Daten, die Sie mit Anwendungen teilen möchten",
                    "header": "Einwilligungen kontrollieren"
                },
                "profileStatus": {
                    "completionPercentage": "Ihr Profilabschluss liegt bei {{percentage}} %",
                    "description": "Verwalten Sie Ihr Profil",
                    "header": "Ihr {{productName}}-Profil",
                    "profileText": "Angaben zu Ihrem persönlichen Profil",
                    "readOnlyDescription": "Zeigen Sie Ihr Profil an",
                    "userSourceText": "(Anmeldung über {{source}})"
                }
            }
        },
        "profile": {
            "actions": {
                "deleteEmail": "E-Mail-Adresse löschen",
                "deleteMobile": "Handy löschen",
                "verifyEmail": "Überprüfen Sie die E-Mail-Adresse",
                "verifyMobile": "Mobilgerät überprüfen"
            },
            "fields": {
                "Account Confirmed Time": "Konto bestätigte Zeit",
                "Account Disabled": "Account deaktiviert",
                "Account Locked": "Konto gesperrt",
                "Account State": "Kontostatus",
                "Active": "Aktiv",
                "Address - Street": "Adresse - Straße",
                "Ask Password": "Passwort fragen",
                "Backup Code Enabled": "Sicherungscode aktiviert",
                "Backup Codes": "Backup-Codes",
                "Birth Date": "Geburtstag",
                "Country": "Land",
                "Created Time": "Geschaffene Zeit",
                "Disable EmailOTP": "Deaktivieren Sie E-Mail-OTP",
                "Disable SMSOTP": "Deaktivieren Sie SMSOTP",
                "Display Name": "Anzeigename",
                "Email": "Email",
                "Email Addresses": "E-mailadressen",
                "Email Verified": "Email überprüft",
                "Enabled Authenticators": "Aktivierte Authentifikatoren",
                "Existing Lite User": "Bestehende Lite-Benutzer",
                "External ID": "Externe ID",
                "Failed Attempts Before Success": "Fehlversuche vor dem Erfolg",
                "Failed Backup Code Attempts": "Fehlgeschlagene Backup-Code-Versuche",
                "Failed Email OTP Attempts": "Fehlgeschlagene E-Mail-OTP-Versuche",
                "Failed Lockout Count": "Anzahl fehlgeschlagener Sperren",
                "Failed Login Attempts": "Fehlgeschlagene Anmeldeversuche",
                "Failed Password Recovery Attempts": "Fehlgeschlagene Versuche zur Kennwortwiederherstellung",
                "Failed SMS OTP Attempts": "Fehlgeschlagene SMS-OTP-Versuche",
                "Failed TOTP Attempts": "Fehlgeschlagene TOTP-Versuche",
                "First Name": "Vorname",
                "Force Password Reset": "Zurücksetzen des Passworts erzwingen",
                "Full Name": "Vollständiger Name",
                "Gender": "Geschlecht",
                "Groups": "Gruppen",
                "Identity Provider Type": "Typ des Identitätsanbieters",
                "Last Logon": "Letzte Anmeldung",
                "Last Modified Time": "Zeit der letzten Änderung",
                "Last Name": "Nachname",
                "Last Password Update": "Letzte Passwortaktualisierung",
                "Lite User": "Lite-Benutzer",
                "Lite User ID": "Lite-Benutzer-ID",
                "Local": "Lokal",
                "Local Credential Exists": "Lokaler Berechtigungsnachweis vorhanden",
                "Locality": "Lokalität",
                "Location": "Ort",
                "Locked Reason": "Gesperrter Grund",
                "Manager - Name": "Der Name des Managers",
                "Middle Name": "Zweiter Vorname",
                "Mobile": "Handy, Mobiltelefon",
                "Mobile Numbers": "Handynummern",
                "Nick Name": "Spitzname",
                "Phone Verified": "Telefon verifiziert",
                "Photo - Thumbnail": "Foto - Miniaturansicht",
                "Photo URL": "Foto-URL",
                "Postal Code": "Postleitzahl",
                "Preferred Channel": "Bevorzugter Kanal",
                "Read Only User": "Nur-Lese-Benutzer",
                "Region": "Region",
                "Resource Type": "Ressourcentyp",
                "Roles": "Rollen",
                "Secret Key": "Geheimer Schlüssel",
                "TOTP Enabled": "TOTP aktiviert",
                "Time Zone": "Zeitzone",
                "URL": "URL",
                "Unlock Time": "Zeit freischalten",
                "User Account Type": "Benutzerkontotyp",
                "User ID": "Nutzer ID",
                "User Metadata - Version": "Benutzermetadaten - Version",
                "User Source": "Benutzerquelle",
                "User Source ID": "Benutzerquellen-ID",
                "Username": "Nutzername",
                "Verification Pending Email": "E-Mail mit ausstehender Bestätigung",
                "Verification Pending Mobile Number": "Handynummer zur Überprüfung ausstehend",
                "Verified Email Addresses": "Verifizierte E-Mail-Adressen",
                "Verified Mobile Numbers": "Verifizierte Mobiltelefonnummern",
                "Verify Email": "E-Mail bestätigen",
                "Verify Mobile": "Handy bestätigen",
                "Verify Secret Key": "Verifizieren Sie den geheimen Schlüssel",
                "Website URL": "Webadresse",
                "emails": "Email",
                "generic": {
                    "default": "{{fieldName}} hinzufügen"
                },
                "nameFamilyName": "Nachname",
                "nameGivenName": "Vorname",
                "phoneNumbers": "Telefonnummer",
                "profileImage": "Profilbild",
                "profileUrl": "URL",
                "userName": "Nutzername"
            },
            "forms": {
                "countryChangeForm": {
                    "inputs": {
                        "country": {
                            "placeholder": "Wähle dein Land"
                        }
                    }
                },
                "dateChangeForm": {
                    "inputs": {
                        "date": {
                            "validations": {
                                "futureDateError": "Das Datum, das Sie für das Feld {{field}} eingegeben haben, ist ungültig.",
                                "invalidFormat": "Bitte geben Sie einen gültigen {{fieldName}} im Format JJJJ-MM-TT ein."
                            }
                        }
                    }
                },
                "emailChangeForm": {
                    "inputs": {
                        "email": {
                            "label": "Email",
                            "note": "HINWEIS: Wenn Sie dies bearbeiten, wird die mit diesem Konto verknüpfte E-Mail-Adresse geändert. Diese E-Mail-Adresse wird auch für die Kontowiederherstellung verwendet.",
                            "placeholder": "Geben sie ihre E-Mailadresse ein",
                            "validations": {
                                "empty": "E-Mail-Adresse ist ein Pflichtfeld",
                                "invalidFormat": "Bitte geben Sie eine gültige E-Mail-Adresse ein. Sie können alphanumerische Zeichen, Unicode-Zeichen, Unterstriche (_), Bindestriche (-), Punkte (.) und ein At-Zeichen (@) verwenden."
                            }
                        }
                    }
                },
                "generic": {
                    "inputs": {
                        "placeholder": "Geben Sie Ihren {{fieldName}} ein",
                        "readonly": {
                            "placeholder": "Dieser Wert ist leer",
                            "popup": "Wenden Sie sich an den Administrator, um Ihr {{fieldName}} zu aktualisieren"
                        },
                        "validations": {
                            "empty": "{{fieldName}} ist ein Pflichtfeld",
                            "invalidFormat": "Das Format des eingegebenen {{fieldName}} ist falsch"
                        }
                    }
                },
                "mobileChangeForm": {
                    "inputs": {
                        "mobile": {
                            "label": "Handy Nummer",
                            "note": "HINWEIS: Dadurch wird die Handynummer in Ihrem Profil geändert",
                            "placeholder": "Geben Sie Ihre Mobiltelefonnummer ein",
                            "validations": {
                                "empty": "Handynummer ist ein Pflichtfeld",
                                "invalidFormat": "Bitte geben Sie eine gültige Handynummer im Format [+][Landesvorwahl][Ortsvorwahl][lokale Telefonnummer] ein."
                            }
                        }
                    }
                },
                "nameChangeForm": {
                    "inputs": {
                        "firstName": {
                            "label": "Vorname",
                            "placeholder": "Geben Sie den Vornamen ein",
                            "validations": {
                                "empty": "Der Vorname ist ein Pflichtfeld"
                            }
                        },
                        "lastName": {
                            "label": "Nachname",
                            "placeholder": "Geben Sie den Nachnamen ein",
                            "validations": {
                                "empty": "Nachname ist ein Pflichtfeld"
                            }
                        }
                    }
                },
                "organizationChangeForm": {
                    "inputs": {
                        "organization": {
                            "label": "Organisation",
                            "placeholder": "Geben Sie Ihre Organisation ein",
                            "validations": {
                                "empty": "Organisation ist ein Pflichtfeld"
                            }
                        }
                    }
                }
            },
            "messages": {
                "emailConfirmation": {
                    "content": "Bitte bestätigen Sie die Aktualisierung der E-Mail-Adresse, um die neue E-Mail-Adresse zu Ihrem Profil hinzuzufügen.",
                    "header": "Bestätigung ausstehend!"
                },
                "mobileVerification": {
                    "content": "Diese Mobiltelefonnummer wird zum Senden von SMS-OTP verwendet, wenn die Zwei-Faktor-Authentifizierung aktiviert ist, und zum Senden von Wiederherstellungscodes im Falle einer Wiederherstellung von Benutzername/Passwort. Um diese Nummer zu aktualisieren, müssen Sie die neue Nummer verifizieren, indem Sie den Bestätigungscode eingeben, der an Ihre neue Nummer gesendet wurde. Klicken Sie auf Aktualisieren, wenn Sie fortfahren möchten."
                }
            },
            "modals": {
                "customMultiAttributeDeleteConfirmation": {
                    "assertionHint": "Bitte bestätigen Sie Ihre Aktion.",
                    "content": "Diese Aktion ist irreversibel und löscht den ausgewählten Wert dauerhaft.",
                    "description": "Wenn Sie diesen ausgewählten Wert löschen, wird er dauerhaft aus Ihrem Profil entfernt.",
                    "heading": "Bist du sicher?"
                },
                "emailAddressDeleteConfirmation": {
                    "assertionHint": "Bitte bestätigen Sie Ihre Aktion.",
                    "content": "Diese Aktion ist irreversibel und löscht die E -Mail -Adresse dauerhaft.",
                    "description": "Wenn Sie diese E -Mail -Adresse löschen, wird sie dauerhaft aus Ihrem Profil entfernt.",
                    "heading": "Bist du sicher?"
                },
                "mobileNumberDeleteConfirmation": {
                    "assertionHint": "Bitte bestätigen Sie Ihre Aktion.",
                    "content": "Diese Aktion ist irreversibel und löscht die Mobiltelefonnummer dauerhaft.",
                    "description": "Wenn Sie diese Handynummer löschen, wird sie dauerhaft aus Ihrem Profil entfernt.",
                    "heading": "Bist du sicher?"
                }
            },
            "notifications": {
                "getProfileCompletion": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Ein Fehler ist aufgetreten"
                    },
                    "genericError": {
                        "description": "Beim Bewerten des Profilabschlusses ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die Profilvervollständigung wurde erfolgreich bewertet",
                        "message": "Berechnung erfolgreich"
                    }
                },
                "getProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Beim Abrufen der Profildetails ist ein Fehler aufgetreten"
                    },
                    "genericError": {
                        "description": "Beim Abrufen der Profildetails ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die erforderlichen Benutzerprofildetails wurden erfolgreich abgerufen",
                        "message": "Benutzerprofil erfolgreich abgerufen"
                    }
                },
                "getUserReadOnlyStatus": {
                    "genericError": {
                        "description": "Beim Abrufen des schreibgeschützten Status des Benutzers ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    }
                },
                "updateProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Beim Aktualisieren der Profildetails ist ein Fehler aufgetreten"
                    },
                    "genericError": {
                        "description": "Beim Aktualisieren der Profildetails ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die erforderlichen Benutzerprofildetails wurden erfolgreich aktualisiert",
                        "message": "Benutzerprofil erfolgreich aktualisiert"
                    }
                },
                "verifyEmail": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Beim Senden der Überprüfungs -E -Mail trat ein Fehler auf"
                    },
                    "genericError": {
                        "description": "Beim Senden der Überprüfungs -E -Mail trat ein Fehler auf",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die Überprüfungs -E -Mail wurde erfolgreich gesendet. Bitte überprüfen Sie Ihren Posteingang",
                        "message": "Überprüfungs -E -Mail erfolgreich gesendet "
                    }
                },
                "verifyMobile": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Beim Senden des Verifizierungscodes ist ein Fehler aufgetreten"
                    },
                    "genericError": {
                        "description": "Beim Senden des Verifizierungscodes ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Der Überprüfungscode wurde erfolgreich gesendet. Bitte überprüfen Sie Ihr Handy",
                        "message": "Überprüfungscode erfolgreich gesendet"
                    }
                }
            },
            "placeholders": {
                "SCIMDisabled": {
                    "heading": "Diese Funktion ist für Ihr Konto nicht verfügbar"
                }
            }
        },
        "profileExport": {
            "notifications": {
                "downloadProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Beim Herunterladen der Benutzerprofildetails ist ein Fehler aufgetreten"
                    },
                    "genericError": {
                        "description": "Beim Herunterladen der Benutzerprofildetails ist ein Fehler aufgetreten",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Der Download der Datei mit den erforderlichen Benutzerprofildetails hat begonnen",
                        "message": "Download der Benutzerprofildetails gestartet"
                    }
                }
            }
        },
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}.",
                        message: "Fehler beim Abrufen der Einstellungen für die Selbstregistrierung"
                    },
                    genericError: {
                        description: "Beim Abrufen der Einstellungen für die Selbstregistrierung ist ein Fehler aufgetreten.",
                        message: "Etwas ist schiefgelaufen"
                    },
                    success: {
                        description: "Einstellungen für die Selbstregistrierung erfolgreich abgerufen.",
                        message: "Einstellungen für die Selbstregistrierung erfolgreich abgerufen"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "Erneut senden",
            selfSignUp: {
                awaitingAccountConfirmation: "Ihr Konto ist noch nicht aktiv. Wir haben einen " +
                    "Aktivierungslink an Ihre registrierte E-Mail-Adresse gesendet. " +
                    "Benötigen Sie einen neuen Link?",
                notifications: {
                    resendError: {
                        description: "Beim erneuten Senden der Kontobestätigungs-E-Mail ist ein Fehler aufgetreten.",
                        message: "Etwas ist schiefgelaufen"
                    },
                    resendSuccess: {
                        description: "Kontobestätigungs-E-Mail erfolgreich erneut gesendet.",
                        message: "Kontobestätigungs-E-Mail erfolgreich erneut gesendet"
                    }
                }
            }
        },
        "userAvatar": {
            "infoPopover": "Dieses Bild wurde von <1>Gravatar abgerufen</1> Service.",
            "urlUpdateHeader": "Geben Sie eine Bild-URL ein, um Ihr Profilbild festzulegen"
        },
        "userSessions": {
            "browserAndOS": "{{browser}} auf {{os}} {{version}}",
            "dangerZones": {
                "terminate": {
                    "actionTitle": "Beenden",
                    "header": "Sitzung beenden",
                    "subheader": "Sie werden auf dem jeweiligen Gerät von der Sitzung abgemeldet."
                }
            },
            "lastAccessed": "Letzter Zugriff am {{date}}",
            "modals": {
                "terminateActiveUserSessionModal": {
                    "heading": "Aktuelle aktive Sitzungen beenden",
                    "message": "Die Änderungen der Optionen für die Zweitfaktor-Authentifizierung (2FA) werden nicht auf Ihre aktiven Sitzungen angewendet. Wir empfehlen Ihnen, diese zu kündigen.",
                    "primaryAction": "Alle beenden",
                    "secondaryAction": "Überprüfen und beenden"
                },
                "terminateAllUserSessionsModal": {
                    "heading": "Bestätigung",
                    "message": "Die Aktion meldet Sie von dieser Sitzung und allen anderen Sitzungen auf jedem Gerät ab. Möchten Sie fortfahren?"
                },
                "terminateUserSessionModal": {
                    "heading": "Bestätigung",
                    "message": "Durch diese Aktion werden Sie von der Sitzung auf dem jeweiligen Gerät abgemeldet. Möchten Sie fortfahren?"
                }
            },
            "notifications": {
                "fetchSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fehler beim Abrufen der aktiven Sitzung"
                    },
                    "genericError": {
                        "description": "Es konnten keine aktiven Sitzungen abgerufen werden",
                        "message": "Etwas ist schief gelaufen"
                    },
                    "success": {
                        "description": "Die aktiven Sitzungen wurden erfolgreich abgerufen",
                        "message": "Abruf der aktiven Sitzung erfolgreich"
                    }
                },
                "terminateAllUserSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Aktive Sitzungen konnten nicht beendet werden"
                    },
                    "genericError": {
                        "description": "Beim Beenden aktiver Sitzungen ist ein Fehler aufgetreten",
                        "message": "Aktive Sitzungen konnten nicht beendet werden"
                    },
                    "success": {
                        "description": "Alle aktiven Sitzungen erfolgreich beendet",
                        "message": "Alle aktiven Sitzungen beendet"
                    }
                },
                "terminateUserSession": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Die aktive Sitzung konnte nicht beendet werden"
                    },
                    "genericError": {
                        "description": "Beim Beenden der aktiven Sitzung ist etwas schief gelaufen",
                        "message": "Die aktive Sitzung konnte nicht beendet werden"
                    },
                    "success": {
                        "description": "Die aktive Sitzung wurde erfolgreich beendet",
                        "message": "Sitzung erfolgreich beendet"
                    }
                }
            }
        },
        "verificationOnUpdate": {
            "preference": {
                "notifications": {
                    "error": {
                        description: "{{description}}",
                        message: "Fehler beim Abrufen der Überprüfung der Update-Präferenz"
                    },
                    genericError: {
                        description: "Beim Abrufen der Überprüfung der Update-Präferenz ist ein Fehler aufgetreten",
                        message: "Etwas ist schief gelaufen"
                    },
                    success: {
                        description: "Die Überprüfung der Aktualisierungspräferenz wurde erfolgreich abgerufen",
                        message: "Überprüfung beim Abrufen der Update-Einstellungen erfolgreich"
                    }
                }
            }
        }
    },
    "modals": {
        "editAvatarModal": {
            "content": {
                "gravatar": {
                    "errors": {
                        "noAssociation": {
                            "content": "Anscheinend ist die ausgewählte E-Mail-Adresse nicht bei Gravatar registriert. Melden Sie sich für ein Gravatar-Konto an, indem Sie die offizielle <1>Gravatar-Website</1> besuchen oder eine der folgenden Methoden verwenden.",
                            "header": "Kein passendes Gravatar-Bild gefunden!"
                        }
                    },
                    "heading": "Gravatar basiert auf"
                },
                "hostedAvatar": {
                    "heading": "Gehostetes Bild",
                    "input": {
                        "errors": {
                            "http": {
                                "content": "Die ausgewählte URL verweist auf ein unsicheres Bild, das über HTTP bereitgestellt wird. Bitte gehen Sie vorsichtig vor.",
                                "header": "Unsicherer Inhalt!"
                            },
                            "invalid": {
                                "content": "Bitte geben Sie eine gültige Bild-URL ein"
                            }
                        },
                        "hint": "Geben Sie eine gültige Bild-URL ein, die auf einem Drittanbieterstandort gehostet wird.",
                        "placeholder": "Geben Sie die URL für das Bild ein.",
                        "warnings": {
                            "dataURL": {
                                "content": "Die Verwendung von Daten-URLs mit einer großen Zeichenzahl kann zu Datenbankproblemen führen. Mit Vorsicht fortfahren.",
                                "header": "Überprüfen Sie die eingegebene Daten-URL!"
                            }
                        }
                    }
                },
                "systemGenAvatars": {
                    "heading": "Vom System generierter Avatar",
                    "types": {
                        "initials": "Initialen"
                    }
                }
            },
            "description": null,
            "heading": "Profilbild aktualisieren",
            "primaryButton": "speichern",
            "secondaryButton": "Stornieren"
        },
        "sessionTimeoutModal": {
            "description": "Wenn Sie auf <1>Gehe zurück klicken</1> , werden wir versuchen, die Sitzung wiederherzustellen, falls sie vorhanden ist. Wenn Sie keine aktive Sitzung haben, werden Sie zur Anmeldeseite weitergeleitet.",
            "heading": "Es sieht so aus, als wären Sie lange Zeit inaktiv gewesen.",
            "loginAgainButton": "Nochmal anmelden",
            "primaryButton": "Geh zurück",
            "secondaryButton": "Logout",
            "sessionTimedOutDescription": "Bitte melden Sie sich erneut an, um dort fortzufahren, wo Sie aufgehört haben.",
            "sessionTimedOutHeading": "Die Benutzersitzung ist aufgrund von Inaktivität abgelaufen."
        }
    },
    "pages": {
        "applications": {
            "subTitle": "Entdecken Sie Ihre Anwendungen und greifen Sie darauf zu",
            "title": "Anwendungen"
        },
        "overview": {
            "subTitle": "Verwalten Sie Ihre persönlichen Daten, Kontosicherheit und Datenschutzeinstellungen",
            "title": "Willkommen, {{firstName}}"
        },
        "personalInfo": {
            "subTitle": "Bearbeiten oder exportieren Sie Ihr persönliches Profil und verwalten Sie verknüpfte Konten",
            "title": "Persönliche Informationen"
        },
        "personalInfoWithoutExportProfile": {
            "subTitle": "Anzeigen und Verwalten Ihrer persönlichen Daten",
            "title": "Persönliche Informationen"
        },
        "personalInfoWithoutLinkedAccounts": {
            "subTitle": "Bearbeiten oder exportieren Sie Ihr persönliches Profil",
            "title": "Persönliche Informationen"
        },
        "privacy": {
            "subTitle": "",
            "title": "Datenschutzrichtlinie des WSO2-Identitätsservers"
        },
        "readOnlyProfileBanner": "Ihr Profil kann von diesem Portal aus nicht geändert werden. Bitte kontaktieren Sie Ihren Administrator für weitere Details.",
        "security": {
            "subTitle": "Schützen Sie Ihr Konto, indem Sie Einwilligungen, Sitzungen und Sicherheitseinstellungen verwalten",
            "title": "Sicherheit"
        }
    },
    "placeholders": {
        "404": {
            "action": "Zurück nach Hause",
            "subtitles": {
                "0": "Wir konnten die von Ihnen gesuchte Seite nicht finden.",
                "1": "Bitte überprüfen Sie die URL oder klicken Sie auf die Schaltfläche unten, um zur Startseite zurückgeleitet zu werden."
            },
            "title": "Seite nicht gefunden"
        },
        "accessDeniedError": {
            "action": "Zurück nach Hause",
            "subtitles": {
                "0": "Anscheinend sind Sie nicht berechtigt, auf diese Seite zuzugreifen.",
                "1": "Bitte versuchen Sie, sich mit einem anderen Konto anzumelden."
            },
            "title": "Zugriff nicht gewährt"
        },
        "emptySearchResult": {
            "action": "Suchabfrage löschen",
            "subtitles": {
                "0": "Wir konnten keine Ergebnisse für \"{{query}}\" finden",
                "1": "Bitte versuchen Sie es mit einem anderen Suchbegriff."
            },
            "title": "keine Ergebnisse gefunden"
        },
        "genericError": {
            "action": "Lade die Seite neu",
            "subtitles": {
                "0": "Beim Anzeigen dieser Seite ist etwas schief gelaufen.",
                "1": "Technische Details finden Sie in der Browser-Konsole."
            },
            "title": "Etwas ist schief gelaufen"
        },
        "loginError": {
            "action": "Abmeldung fortsetzen",
            "subtitles": {
                "0": "Anscheinend haben Sie keine Berechtigung zur Nutzung dieses Portals.",
                "1": "Bitte melden Sie sich mit einem anderen Konto an."
            },
            "title": "Sie sind nicht berechtigt"
        },
        "sessionStorageDisabled": {
            "subtitles": {
                "0": "Um diese Anwendung nutzen zu können, müssen Sie Cookies in Ihren Webbrowser-Einstellungen zulassen.",
                "1": "Weitere Informationen zum Aktivieren von Cookies finden Sie im Hilfebereich Ihres Webbrowsers."
            },
            "title": "Cookies sind in Ihrem Browser deaktiviert."
        }
    },
    "sections": {
        "accountRecovery": {
            "description": "Verwalten Sie Wiederherstellungsinformationen, mit denen Sie Ihr Passwort wiederherstellen können",
            "emptyPlaceholderText": "Keine Optionen zur Wiederherstellung von Kontos zur Verfügung stehen",
            "heading": "Konto-Wiederherstellung"
        },
        "changePassword": {
            "actionTitles": {
                "change": "Ändern Sie Ihr Passwort"
            },
            "description": "Aktualisieren Sie Ihr Passwort regelmäßig und stellen Sie sicher, dass es sich von anderen von Ihnen verwendeten Passwörtern unterscheidet.",
            "heading": "Passwort ändern"
        },
        "consentManagement": {
            "actionTitles": {
                "empty": "Sie haben keiner Bewerbung zugestimmt"
            },
            "description": "Überprüfen Sie die Einwilligungen, die Sie für jede Anwendung erteilt haben. Außerdem können Sie je nach Bedarf eine oder mehrere davon widerrufen.",
            "heading": "Einwilligungen verwalten",
            "placeholders": {
                "emptyConsentList": {
                    "heading": "Sie haben keiner Bewerbung zugestimmt"
                }
            }
        },
        "createPassword": {
            "actionTitles": {
                "create": "Passwort erstellen"
            },
            "description": "Erstellen Sie ein Passwort in {{productName}}. Sie können dieses Passwort verwenden, um sich zusätzlich zum sozialen Login bei {{productName}} anzumelden.",
            "heading": "Passwort erstellen"
        },
        "federatedAssociations": {
            "description": "Sehen Sie sich Ihre Konten von anderen Verbindungen an, die mit diesem Konto verknüpft sind",
            "heading": "Verknüpfte soziale Konten"
        },
        "linkedAccounts": {
            "actionTitles": {
                "add": "Konto hinzufügen"
            },
            "description": "Verknüpfen/verknüpfen Sie Ihre anderen Konten und greifen Sie nahtlos ohne erneute Anmeldung darauf zu",
            "heading": "Verbundene Konten"
        },
        "mfa": {
            "description": "Konfigurieren Sie zusätzliche Authentifizierungen, um sich einfach anzumelden oder Ihrem Konto eine zusätzliche Sicherheitsebene hinzuzufügen.",
            "heading": "Zusätzliche Authentifizierung"
        },
        "profile": {
            "description": "Verwalten Sie Ihr persönliches Profil",
            "heading": "Profil"
        },
        "profileExport": {
            "actionTitles": {
                "export": "Laden Sie das Profil herunter"
            },
            "description": "Laden Sie alle Ihre Profildaten herunter, einschließlich persönlicher Daten und verknüpfter Konten",
            "heading": "Profil exportieren"
        },
        "userSessions": {
            "actionTitles": {
                "empty": "Keine aktiven Sitzungen",
                "terminateAll": "Beenden Sie alle Sitzungen"
            },
            "description": "Überprüfen Sie alle aktiven Benutzersitzungen für Ihr Konto",
            "heading": "Aktive Sitzungen",
            "placeholders": {
                "emptySessionList": {
                    "heading": "Es gibt keine aktiven Sitzungen für diesen Benutzer"
                }
            }
        }
    }
};
