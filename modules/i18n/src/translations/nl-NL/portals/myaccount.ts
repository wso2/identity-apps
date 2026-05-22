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

import { MyAccountNS } from "../../../models";

/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    "components": {
        "accountRecovery": {
            "SMSRecovery": {
                "descriptions": {
                    "add": "Voeg het mobiele herstelnummer toe of werk het bij.",
                    "emptyMobile": "U moet uw mobiele nummer instellen om door te gaan met SMS-OTP-herstel.",
                    "update": "Werk het mobiele herstelnummer bij ({{mobile}})",
                    "view": "Bekijk het mobiele herstelnummer ({{mobile}})"
                },
                "forms": {
                    "mobileResetForm": {
                        "inputs": {
                            "mobile": {
                                "label": "Mobiel nummer",
                                "placeholder": "Voer het mobiele herstelnummer in.",
                                "validations": {
                                    "empty": "Voer een mobiel nummer in.",
                                    "invalidFormat": "Het formaat van het mobiele nummer is onjuist."
                                }
                            }
                        }
                    }
                },
                "heading": "SMS-herstel",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Fout bij het bijwerken van het mobiele herstelnummer."
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van het mobiele herstelnummer",
                            "message": "Er is iets misgegaan"
                        },
                        "success": {
                            "description": "Het mobiele nummer in het gebruikersprofiel is succesvol bijgewerkt",
                            "message": "Mobiel nummer succesvol bijgewerkt"
                        }
                    }
                }
            },
            "codeRecovery": {
                "descriptions": {
                    "add": "Opties voor herstelcodes toevoegen of bijwerken."
                },
                "heading": "Herstelcodes"
            },
            "emailRecovery": {
                "descriptions": {
                    "add": "Hersteladres voor e-mail toevoegen of bijwerken",
                    "emptyEmail": "U moet uw e-mailadres instellen om door te gaan met e-mailherstel.",
                    "update": "Hersteladres voor e-mail bijwerken ({{email}})",
                    "view": "Hersteladres voor e-mail tonen ({{email}})"
                },
                "forms": {
                    "emailResetForm": {
                        "inputs": {
                            "email": {
                                "label": "E-mailadres",
                                "placeholder": "Voer het hersteladres voor e-mail in",
                                "validations": {
                                    "empty": "Voer een e-mailadres in",
                                    "invalidFormat": "Ongeldig e-mailadresformaat"
                                }
                            }
                        }
                    }
                },
                "heading": "Hersteladres voor e-mail",
                "notifications": {
                    "updateEmail": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Fout bij het bijwerken van het hersteladres voor e-mail"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van het hersteladres voor e-mail",
                            "message": "Er is iets misgegaan"
                        },
                        "success": {
                            "description": "Het e-mailadres in het gebruikersprofiel is succesvol bijgewerkt",
                            "message": "E-mailadres succesvol bijgewerkt"
                        }
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het ophalen van de herstelvoorkeur"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van de herstelvoorkeur",
                        "message": "Er is een probleem opgetreden"
                    },
                    "success": {
                        "description": "De herstelvoorkeur is succesvol opgehaald",
                        "message": "Herstelvoorkeur succesvol opgehaald"
                    }
                }
            },
            "questionRecovery": {
                "descriptions": {
                    "add": "Beveiligingsvragen toevoegen of bijwerken"
                },
                "forms": {
                    "securityQuestionsForm": {
                        "inputs": {
                            "answer": {
                                "label": "Antwoord",
                                "placeholder": "Voer uw antwoord in",
                                "validations": {
                                    "empty": "Antwoord is verplicht"
                                }
                            },
                            "question": {
                                "label": "Vraag",
                                "placeholder": "Selecteer een beveiligingsvraag",
                                "validations": {
                                    "empty": "Er moet ten minste één beveiligingsvraag worden geselecteerd"
                                }
                            }
                        }
                    }
                },
                "heading": "Beveiligingsvragen",
                "notifications": {
                    "addQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Er is een fout opgetreden bij het toevoegen van de beveiligingsvragen"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het toevoegen van de beveiligingsvragen",
                            "message": "Er is iets misgegaan."
                        },
                        "success": {
                            "description": "De beveiligingsvragen zijn succesvol toegevoegd",
                            "message": "De beveiligingsvragen zijn succesvol toegevoegd"
                        }
                    },
                    "updateQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Fout bij het bijwerken van de beveiligingsvragen"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van de beveiligingsvragen",
                            "message": "Er is iets misgegaan."
                        },
                        "success": {
                            "description": "De beveiligingsvragen zijn succesvol bijgewerkt",
                            "message": "De beveiligingsvragen zijn succesvol bijgewerkt"
                        }
                    }
                }
            }
        },
        "advancedSearch": {
            "form": {
                "inputs": {
                    "filterAttribute": {
                        "label": "Attribuut om te filteren",
                        "placeholder": "Bijv. Naam, Beschrijving, enz.",
                        "validations": {
                            "empty": "Attribuut is verplicht."
                        }
                    },
                    "filterCondition": {
                        "label": "Voorwaarde",
                        "placeholder": "Bijv. Begint met, enz.",
                        "validations": {
                            "empty": "Filtervoorwaarde is verplicht."
                        }
                    },
                    "filterValue": {
                        "label": "Waarde om te zoeken",
                        "placeholder": "Bijv. admin, wso2, enz.",
                        "validations": {
                            "empty": "Waarde is verplicht."
                        }
                    }
                }
            },
            "hints": {
                "querySearch": {
                    "actionKeys": "Shift + Enter",
                    "label": "Zoeken als query"
                }
            },
            "options": {
                "header": "Geavanceerd zoeken"
            },
            "placeholder": "Zoeken op {{attribute}}",
            "popups": {
                "clear": "Zoekopdracht wissen",
                "dropdown": "Opties tonen"
            },
            "resultsIndicator": "Resultaten weergeven voor query \"{{query}}\""
        },
        "applications": {
            "advancedSearch": {
                "form": {
                    "inputs": {
                        "filterAttribute": {
                            "placeholder": "Bijv. Naam, Beschrijving, enz."
                        },
                        "filterCondition": {
                            "placeholder": "Bijv. Begint met, enz."
                        },
                        "filterValue": {
                            "placeholder": "Voer de te zoeken waarde in"
                        }
                    }
                },
                "placeholder": "Zoeken op toepassing"
            },
            "all": {
                "heading": "Alle toepassingen"
            },
            "favourite": {
                "heading": "Favorieten"
            },
            "notifications": {
                "fetchApplications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het ophalen van de toepassingen"
                    },
                    "genericError": {
                        "description": "Kan de toepassingen niet ophalen",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Toepassingen succesvol opgehaald",
                        "message": "Toepassingen succesvol opgehaald"
                    }
                }
            },
            "placeholders": {
                "emptyList": {
                    "action": "Lijst vernieuwen",
                    "subtitles": {
                        "0": "De lijst met toepassingen is leeg",
                        "1": "Er zijn mogelijk geen zichtbare toepassingen.",
                        "2": "Vraag een beheerder om de toepassingsdetectie in te schakelen."
                    },
                    "title": "Geen toepassingen"
                }
            },
            "recent": {
                "heading": "Recente toepassingen"
            }
        },
        "changePassword": {
            "forms": {
                "passwordResetForm": {
                    "inputs": {
                        "confirmPassword": {
                            "label": "Bevestig nieuw wachtwoord",
                            "placeholder": "Bevestig het nieuwe wachtwoord",
                            "validations": {
                                "empty": "Bevestig uw nieuwe wachtwoord",
                                "mismatch": "De ingevoerde nieuwe wachtwoorden komen niet overeen"
                            }
                        },
                        "currentPassword": {
                            "label": "Huidig wachtwoord",
                            "placeholder": "Voer het huidige wachtwoord in",
                            "validations": {
                                "empty": "Voer uw huidige wachtwoord in",
                                "invalid": "Het huidige wachtwoord dat u heeft ingevoerd is ongeldig."
                            }
                        },
                        "newPassword": {
                            "label": "Nieuw wachtwoord",
                            "placeholder": "Voer het nieuwe wachtwoord in",
                            "validations": {
                                "empty": "Voer uw nieuwe wachtwoord in"
                            }
                        }
                    },
                    "validations": {
                        "genericError": {
                            "description": "Er is iets misgegaan. Probeer het opnieuw",
                            "message": "Fout bij het wijzigen van het wachtwoord"
                        },
                        "invalidCurrentPassword": {
                            "description": "Het huidige wachtwoord dat u heeft ingevoerd lijkt ongeldig te zijn. Probeer het opnieuw",
                            "message": "Fout bij het wijzigen van het wachtwoord"
                        },
                        "invalidNewPassword": {
                            "description": "Het wachtwoord voldoet niet aan de vereiste voorwaarden.",
                            "message": "Onjuist wachtwoord"
                        },
                        "passwordCaseRequirement": "Ten minste {{minUpperCase}} hoofdletter(s) en {{minLowerCase}} kleine letter(s)",
                        "passwordCharRequirement": "Ten minste {{minSpecialChr}} speciale teken(s)",
                        "passwordLengthRequirement": "Moet tussen {{min}} en {{max}} tekens bevatten",
                        "passwordLowerCaseRequirement": "Ten minste {{minLowerCase}} kleine letter(s)",
                        "passwordNumRequirement": "Ten minste {{min}} cijfer(s)",
                        "passwordRepeatedChrRequirement": "Niet meer dan {{repeatedChr}} herhaalde teken(s)",
                        "passwordUniqueChrRequirement": "Ten minste {{uniqueChr}} uniek(e) teken(s)",
                        "passwordUpperCaseRequirement": "Ten minste {{minUpperCase}} hoofdletter(s)",
                        "submitError": {
                            "description": "{{description}}",
                            "message": "Fout bij het wijzigen van het wachtwoord"
                        },
                        "submitSuccess": {
                            "description": "Het wachtwoord is succesvol gewijzigd",
                            "message": "Wachtwoord opnieuw instellen geslaagd"
                        },
                        "validationConfig": {
                            "error": {
                                "description": "{{description}}",
                                "message": "Fout bij het ophalen"
                            },
                            "genericError": {
                                "description": "Kan de validatieconfiguratiegegevens niet ophalen.",
                                "message": "Er is iets misgegaan"
                            }
                        }
                    }
                }
            },
            "modals": {
                "confirmationModal": {
                    "heading": "Bevestiging",
                    "message": "Het bijwerken van uw wachtwoord kan u afmelden bij alle toepassingen. Als u wordt afgemeld, meld u dan opnieuw aan met uw nieuwe wachtwoord. Wilt u doorgaan?"
                }
            }
        },
        "consentManagement": {
            "editConsent": {
                "collectionMethod": "Verzamelmethode",
                "dangerZones": {
                    "revoke": {
                        "actionTitle": "Intrekken",
                        "header": "Toestemming intrekken",
                        "subheader": "U zult opnieuw toestemming moeten geven om weer toegang te krijgen tot deze toepassing."
                    }
                },
                "description": "Beschrijving",
                "piiCategoryHeading": "Beheer de toestemming voor het verzamelen en delen van uw persoonlijke gegevens met de toepassing. Schakel de attributen uit die u wilt intrekken en bevestig vervolgens door op de knop Bijwerken te klikken om de wijzigingen op te slaan, of klik op de knop Intrekken om de toestemming voor alle attributen te verwijderen.",
                "state": "Status",
                "version": "Versie"
            },
            "modals": {
                "consentRevokeModal": {
                    "heading": "Weet u het zeker?",
                    "message": "Deze bewerking is onomkeerbaar. Hiermee wordt de toestemming voor alle attributen definitief ingetrokken. Weet u zeker dat u wilt doorgaan?",
                    "warning": "Houd er rekening mee dat u wordt omgeleid naar de pagina voor het verzamelen van toestemming"
                }
            },
            "notifications": {
                "consentReceiptFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is iets misgegaan"
                    },
                    "genericError": {
                        "description": "Kan geen informatie laden over de geselecteerde toepassing",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Bewijs van toestemming succesvol opgehaald",
                        "message": "Ophalen geslaagd"
                    }
                },
                "consentedAppsFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is iets misgegaan"
                    },
                    "genericError": {
                        "description": "Kan de lijst met geautoriseerde toepassingen niet laden",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Lijst met geautoriseerde toepassingen succesvol opgehaald",
                        "message": "Ophalen geslaagd"
                    }
                },
                "revokeConsentedApp": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het intrekken van toestemmingen"
                    },
                    "genericError": {
                        "description": "Fout bij het intrekken van toestemmingen die aan de toepassing zijn verleend",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De aan de toepassing verleende toestemming is succesvol ingetrokken",
                        "message": "Toestemming succesvol ingetrokken"
                    }
                },
                "updateConsentedClaims": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is iets misgegaan"
                    },
                    "genericError": {
                        "description": "De met de toepassing gedeelde attributen zijn niet bijgewerkt",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De met de toepassing gedeelde attributen zijn succesvol bijgewerkt",
                        "message": "Gedeelde attributen succesvol bijgewerkt"
                    }
                }
            }
        },
        "cookieConsent": {
            "confirmButton": "Ik begrijp het",
            "content": "We gebruiken cookies om u de best mogelijke algemene ervaring te garanderen. Deze cookies worden gebruikt om een doorlopende sessie te onderhouden en tegelijkertijd vloeiende en gepersonaliseerde diensten te bieden. Voor meer informatie over hoe we cookies gebruiken, raadpleegt u ons <1>Cookiebeleid</1>."
        },
        "federatedAssociations": {
            "deleteConfirmation": "Hiermee wordt de toegang tot uw account door de externe authenticatiedienst verwijderd. Bevestigt u de verwijdering?",
            "notifications": {
                "getFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is iets misgegaan"
                    },
                    "genericError": {
                        "description": "Kan de externe authenticatiediensten die toegang hebben tot uw account niet ophalen",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De externe authenticatiediensten die toegang hebben tot uw account zijn succesvol opgehaald",
                        "message": "Externe authenticatiediensten succesvol opgehaald"
                    }
                },
                "removeAllFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is iets misgegaan"
                    },
                    "genericError": {
                        "description": "Kan niet alle externe authenticatiediensten die toegang hebben tot uw account verwijderen",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Toegang succesvol verwijderd voor alle externe authenticatiediensten die toegang hadden tot uw account.",
                        "message": "Toegang succesvol verwijderd"
                    }
                },
                "removeFederatedAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is iets misgegaan"
                    },
                    "genericError": {
                        "description": "De toegang tot uw account door de externe authenticatiedienst kon niet worden verwijderd",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De toegang tot uw account door de externe authenticatiedienst is succesvol verwijderd",
                        "message": "Toegang succesvol verwijderd"
                    }
                }
            }
        },
        "footer": {
            "copyright": "WSO2 Identity Server © {{year}}"
        },
        "header": {
            "appSwitch": {
                "console": {
                    "description": "Beheren als ontwikkelaars of beheerders",
                    "name": "Console"
                },
                "myAccount": {
                    "description": "Beheer uw eigen account",
                    "name": "My Account"
                },
                "tooltip": "Apps"
            },
            "dropdown": {
                "footer": {
                    "cookiePolicy": "Cookies",
                    "privacyPolicy": "Privacy",
                    "termsOfService": "Voorwaarden"
                }
            },
            "organizationLabel": "Dit account wordt beheerd door"
        },
        "linkedAccounts": {
            "accountTypes": {
                "local": {
                    "label": "Een gebruikersaccount koppelen"
                }
            },
            "deleteConfirmation": "Hiermee wordt de koppeling met uw account verwijderd. Bevestigt ude verwijdering?",
            "forms": {
                "addAccountForm": {
                    "inputs": {
                        "password": {
                            "label": "Wachtwoord",
                            "placeholder": "Voer het wachtwoord in",
                            "validations": {
                                "empty": "Wachtwoord is verplicht"
                            }
                        },
                        "username": {
                            "label": "Gebruikersnaam",
                            "placeholder": "Voer de gebruikersnaam in",
                            "validations": {
                                "empty": "Gebruikersnaam is verplicht"
                            }
                        }
                    }
                }
            },
            "notifications": {
                "addAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het ophalen van gekoppelde accounts"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het koppelen van het account",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De accountkoppeling is succesvol toegevoegd",
                        "message": "Account succesvol gekoppeld"
                    }
                },
                "getAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het ophalen van gekoppelde accounts"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van gekoppelde accounts",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De vereiste informatie over het gebruikersprofiel is succesvol opgehaald",
                        "message": "Gegevens van gekoppelde accounts succesvol opgehaald"
                    }
                },
                "removeAllAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het verwijderen van gekoppelde accounts"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het verwijderen van gekoppelde accounts",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Alle gekoppelde accounts zijn verwijderd",
                        "message": "Gekoppelde accounts succesvol verwijderd"
                    }
                },
                "removeAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het verwijderen van het gekoppelde account"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het verwijderen van het gekoppelde account",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Het gekoppelde account is verwijderd",
                        "message": "Gekoppeld account succesvol verwijderd"
                    }
                },
                "switchAccount": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden bij het wisselen van account"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het wisselen van account",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Het wisselen van account is succesvol uitgevoerd",
                        "message": "Wisselen van account succesvol uitgevoerd"
                    }
                }
            }
        },
        "loginVerifyData": {
            "description": "Deze gegevens worden gebruikt om uw identiteit verder te verifiëren tijdens het aanmelden",
            "heading": "Gegevens gebruikt om uw aanmelding te verifiëren",
            "modals": {
                "clearTypingPatternsModal": {
                    "heading": "Bevestiging",
                    "message": "Met deze actie worden uw opgeslagen typpatronen in TypingDNA gewist. Wilt u doorgaan?"
                }
            },
            "notifications": {
                "clearTypingPatterns": {
                    "error": {
                        "description": "De typpatronen konden niet worden gewist. Neem contact op met uw sitebeheerder",
                        "message": "Verwijderen van typpatronen mislukt"
                    },
                    "success": {
                        "description": "Uw typpatronen in TypingDNA zijn succesvol gewist",
                        "message": "Typpatronen succesvol verwijderd"
                    }
                }
            },
            "typingdna": {
                "description": "Uw typpatronen kunnen vanaf hier worden gewist",
                "heading": "TypingDNA typpatronen"
            }
        },
        "mfa": {
            "authenticatorApp": {
                "addHint": "Configureren",
                "configuredDescription": "U kunt de TOTP-codes van uw geconfigureerde authenticatortoepassing gebruiken voor tweefactorauthenticatie. Als u geen toegang heeft tot de toepassing, kunt u hier een nieuwe authenticatortoepassing configureren",
                "deleteHint": "Verwijderen",
                "description": "Scan de QR-code met een authenticatortoepassing om tijdgebaseerde eenmalige wachtwoorden (ook wel TOTP genoemd) te gebruiken als tweede factor bij het aanmelden bij toepassingen.",
                "enableHint": "TOTP-authenticator in-/uitschakelen",
                "heading": "TOTP-authenticator",
                "hint": "Bekijken",
                "modals": {
                    "delete": {
                        "heading": "Bevestiging",
                        "message": "Met deze actie wordt de QR-code die aan uw profiel is toegevoegd verwijderd. Wilt u doorgaan? "
                    },
                    "done": "Geslaagd! U kunt nu uw authenticatortoepassing gebruiken voor tweestapsauthenticatie",
                    "heading": "Een authenticatortoepassing configureren",
                    "scan": {
                        "additionNote": "De QR-code is succesvol aan uw profiel toegevoegd",
                        "authenticatorApps": "Authenticatortoepassingen",
                        "copiedToClipboard": "Gekopieerd!",
                        "copyToClipboard": "Kopiëren",
                        "generate": "Een nieuwe code genereren",
                        "heading": "Scan deze QR-code met een authenticatortoepassing",
                        "hideSecretKey": "Geheim verbergen",
                        "manualEntryLabel": "Voer de code handmatig in",
                        "messageBody": "U kunt een compatibele authenticatortoepassing uit deze lijst gebruiken :",
                        "messageHeading": "Heeft u geen authenticatortoepassing?",
                        "regenerateConfirmLabel": "Bevestig het opnieuw genereren van een nieuwe QR-code",
                        "regenerateWarning": {
                            "extended": "Wanneer u een nieuwe QR-code opnieuw genereert, moet u deze scannen en uw authenticatortoepassing opnieuw installeren. U kunt zich niet meer aanmelden met de vorige QR-code.",
                            "generic": "Wanneer u een nieuwe QR-code opnieuw genereert, moet u deze scannen en uw authenticatortoepassing opnieuw installeren. Uw vorige configuratie werkt niet meer."
                        },
                        "showSecretKey": "Geheim tonen"
                    },
                    "toolTip": "Heeft u geen toepassing? Download een authenticatortoepassing zoals Google Authenticator uit de <1>App Store</1> of <3>Google Play</3>",
                    "verify": {
                        "error": "Verificatie mislukt. Probeer het opnieuw.",
                        "heading": "Voer de gegenereerde code in ter verificatie",
                        "label": "Verificatiecode",
                        "placeholder": "Voer uw verificatiecode in",
                        "reScan": "Opnieuw scannen",
                        "reScanQuestion": "Wilt u de QR-code opnieuw scannen?",
                        "requiredError": "Voer uw verificatiecode in"
                    }
                },
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het verwijderen van de TOTP-authenticatorconfiguratie",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Verwijderen geslaagd",
                        "message": "De TOTP-configuratie is succesvol verwijderd."
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het ophalen van de QR-code",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het ophalen van een nieuwe QR-code",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van de lijst met ingeschakelde authenticators",
                            "message": "Er is iets misgegaan"
                        }
                    }
                },
                "regenerate": "Opnieuw genereren"
            },
            "backupCode": {
                "actions": {
                    "add": "Back-upcodes toevoegen",
                    "delete": "Back-upcodes verwijderen"
                },
                "description": "Gebruik back-upcodes om toegang te krijgen tot uw account in het geval dat u geen multifactor-authenticatiecodes kunt ontvangen. U kunt indien nodig nieuwe codes opnieuw genereren.",
                "download": {
                    "heading": "BEWAAR UW BACK-UPCODES.",
                    "info1": "U kunt elke back-upcode slechts één keer gebruiken.",
                    "info2": "Deze codes zijn gegenereerd op ",
                    "subHeading": "U kunt deze back-upcodes gebruiken om u aan te melden bij Asgardeo wanneer u niet bij uw telefoon kunt. Bewaar deze back-upcodes op een veilige maar toegankelijke plaats."
                },
                "heading": "Back-upcodes",
                "messages": {
                    "disabledMessage": "Er moet ten minste één extra authenticator zijn geconfigureerd om back-upcodes in te schakelen."
                },
                "modals": {
                    "actions": {
                        "copied": "gekopieerd",
                        "copy": "Codes kopiëren",
                        "download": "Codes downloaden",
                        "regenerate": "Opnieuw genereren"
                    },
                    "delete": {
                        "description": "Met deze actie worden de back-upcodes verwijderd en kunt u ze niet meer gebruiken. Wilt u doorgaan?",
                        "heading": "Bevestiging"
                    },
                    "description": "Gebruik de back-upcodes om u aan te melden wanneer u niet bij uw telefoon kunt. U kunt er meer genereren wanneer ze allemaal zijn gebruikt",
                    "generate": {
                        "description": "Al uw back-upcodes zijn gebruikt. Hiermee genereert u een nieuwe set back-upcodes",
                        "heading": "Genereren"
                    },
                    "heading": "Back-upcodes",
                    "info": "Elke code kan slechts één keer worden gebruikt",
                    "regenerate": {
                        "description": "Nadat u nieuwe codes heeft gegenereerd, werken uw oude codes niet meer. Zorg ervoor dat u de nieuwe codes opslaat zodra ze zijn gegenereerd.",
                        "heading": "Bevestiging"
                    },
                    "subHeading": "Eenmalige toegangscodes die u kunt gebruiken om u aan te melden",
                    "warn": "Deze codes verschijnen slechts één keer. Zorg ervoor dat u ze nu opslaat en op een veilige maar toegankelijke plaats bewaart."
                },
                "mutedHeader": "Herstelopties",
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het verwijderen van de back-upcodes",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Verwijderen geslaagd",
                        "message": "Back-upcodes succesvol verwijderd."
                    },
                    "downloadError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het downloaden van de back-upcodes",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "downloadSuccess": {
                        "genericMessage": {
                            "description": "De back-upcodes zijn succesvol gedownload.",
                            "message": "De back-upcodes zijn succesvol gedownload."
                        },
                        "message": {
                            "description": "{{message}}",
                            "message": "De back-upcodes zijn succesvol gedownload."
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het genereren van nieuwe back-upcodes",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "retrieveAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het ophalen van de lijst met ingeschakelde authenticators",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "retrieveError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het ophalen van de back-upcodes",
                            "message": "Er is iets misgegaan"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is iets misgegaan"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van de lijst met ingeschakelde authenticators",
                            "message": "Er is iets misgegaan"
                        }
                    }
                },
                "remaining": "resterend"
            },
            "fido": {
                "description": "U kunt een <1>passkey</1>, een <1>FIDO-beveiligingssleutel</1> of <1>biometrische gegevens</1> op uw apparaat gebruiken om u aan te melden bij uw account.",
                "form": {
                    "label": "Passkey",
                    "placeholder": "Voer een naam in voor de passkey",
                    "remove": "Passkey verwijderen",
                    "required": "Voer een naam in voor uw passkey"
                },
                "heading": "Passkey",
                "modals": {
                    "deleteConfirmation": {
                        "assertionHint": "Bevestig uw actie.",
                        "content": "Deze actie is onomkeerbaar en verwijdert de passkey definitief.",
                        "description": "Als u deze passkey verwijdert, kunt u zich mogelijk niet meer aanmelden bij uw account. Ga met voorzichtigheid te werk.",
                        "heading": "Weet u het zeker?"
                    },
                    "deviceRegistrationErrorModal": {
                        "description": "De registratie van de passkey is onderbroken. Als dit niet de bedoeling was, kunt u de flow opnieuw proberen.",
                        "heading": "Registratie van de passkey mislukt",
                        "tryWithOlderDevice": "U kunt het ook opnieuw proberen met een oudere passkey."
                    }
                },
                "noPassKeyMessage": "U heeft nog geen passkeys geregistreerd.",
                "notifications": {
                    "removeDevice": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Er is een fout opgetreden bij het verwijderen van de passkey"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het verwijderen van de beveiligings-/biometrische sleutel",
                            "message": "Er is iets misgegaan"
                        },
                        "success": {
                            "description": "De passkey is succesvol uit de lijst verwijderd",
                            "message": "Uw passkey is succesvol verwijderd"
                        }
                    },
                    "startFidoFlow": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Er is een fout opgetreden bij het ophalen van de passkey"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het ophalen van de passkey",
                            "message": "Er is iets misgegaan"
                        },
                        "success": {
                            "description": "De passkey is succesvol geregistreerd en u kunt deze nu gebruiken voor authenticatie.",
                            "message": "Uw passkey is succesvol geregistreerd"
                        }
                    },
                    "updateDeviceName": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Er is een fout opgetreden bij het bijwerken van de passkeynaam"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van de passkeynaam",
                            "message": "Er is iets misgegaan"
                        },
                        "success": {
                            "description": "De naam van uw passkey is succesvol bijgewerkt",
                            "message": "De passkeynaam is succesvol bijgewerkt"
                        }
                    }
                },
                "tryButton": "Probeer het met een oudere passkey"
            },
            "pushAuthenticatorApp": {
                "addHint": "Configureren",
                "configuredDescription": "U kunt aanmeldingsnotificaties van uw geconfigureerde authenticatortoepassing gebruiken voor tweefactorauthenticatie. Als u geen toegang heeft tot de toepassing, kunt u hier een nieuwe authenticatortoepassing configureren.",
                "deleteHint": "Verwijderen",
                "description": "U kunt de push-authenticatortoepassing gebruiken om aanmeldingsnotificaties als pushmeldingen te ontvangen voor tweefactorauthenticatie.",
                "heading": "Push-authenticator",
                "hint": "Bekijken",
                "modals": {
                    "deviceDeleteConfirmation": {
                        "assertionHint": "Bevestig uw actie.",
                        "content": "Deze actie is onomkeerbaar en verwijdert het apparaat definitief.",
                        "description": "Als u dit apparaat verwijdert, kunt u zich mogelijk niet meer aanmelden bij uw account. Ga met voorzichtigheid te werk.",
                        "heading": "Weet u het zeker?"
                    },
                    "scan": {
                        "additionNote": "De QR-code is succesvol aan uw profiel toegevoegd!",
                        "done": "Geslaagd! U kunt nu uw push-authenticatortoepassing gebruiken voor tweefactorauthenticatie.",
                        "heading": "Configureer de push-authenticatortoepassing",
                        "messageBody": "Hier vindt u een lijst met beschikbare authenticatortoepassingen.",
                        "subHeading": "Scan onderstaande QR-code met de push-authenticatortoepassing"
                    }
                },
                "notifications": {
                    "delete": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is een fout opgetreden"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het verwijderen van het geregistreerde apparaat",
                            "message": "Er is een fout opgetreden"
                        },
                        "success": {
                            "description": "Het geregistreerde apparaat is succesvol verwijderd",
                            "message": "Apparaat succesvol verwijderd"
                        }
                    },
                    "deviceListFetchError": {
                        "error": {
                            "description": "Er is een fout opgetreden bij het ophalen van de geregistreerde apparaten voor push-authenticatie",
                            "message": "Er is een fout opgetreden"
                        }
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Er is een fout opgetreden"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het ophalen van de QR-code",
                            "message": "Er is een fout opgetreden"
                        }
                    }
                }
            },
            "smsOtp": {
                "descriptions": {
                    "hint": "U ontvangt een sms met een eenmalige verificatiecode"
                },
                "heading": "Mobiel nummer",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Er is een fout opgetreden bij het bijwerken van het mobiele herstelnummer"
                        },
                        "genericError": {
                            "description": "Er is een fout opgetreden bij het bijwerken van het mobiele herstelnummer",
                            "message": "Er is iets misgegaan"
                        },
                        "success": {
                            "description": "Het mobiele nummer in het gebruikersprofiel is succesvol bijgewerkt",
                            "message": "Herstelnummer succesvol bijgewerkt"
                        }
                    }
                }
            }
        },
        "mobileUpdateWizard": {
            "done": "Geslaagd! Uw mobiele nummer is succesvol geverifieerd.",
            "notifications": {
                "resendError": {
                    "error": {
                        "description": "{{error}}",
                        "message": "Er is een probleem opgetreden"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van een nieuwe verificatiecode",
                        "message": "Er is een probleem opgetreden"
                    }
                },
                "resendSuccess": {
                    "message": "Het verzoek om de code opnieuw te verzenden is succesvol verzonden"
                }
            },
            "submitMobile": {
                "heading": "Voer uw nieuwe mobiele nummer in"
            },
            "verificationSent": {
                "heading": "U ontvangt binnenkort een OTP op uw mobiele nummer ter verificatie"
            },
            "verifySmsOtp": {
                "didNotReceive": "Heeft u de code niet ontvangen?",
                "error": "Verificatie mislukt. Probeer het opnieuw.",
                "heading": "Verifieer uw mobiele nummer",
                "label": "Voer de verificatiecode in die naar uw mobiele nummer is verzonden",
                "placeholder": "Voer uw verificatiecode in",
                "requiredError": "Voer de verificatiecode in",
                "resend": "Opnieuw verzenden"
            }
        },
        "overview": {
            "widgets": {
                "accountActivity": {
                    "actionTitles": {
                        "update": "Beheer de activiteit van uw account"
                    },
                    "description": "U bent momenteel aangemeld vanaf het volgende apparaat",
                    "header": "Actieve sessies"
                },
                "accountSecurity": {
                    "actionTitles": {
                        "update": "Beveilig uw account"
                    },
                    "description": "Instellingen en aanbevelingen om uw account te beveiligen",
                    "header": "Accountbeveiliging"
                },
                "accountStatus": {
                    "complete": "Uw profiel is compleet",
                    "completedFields": "Voltooide attributen",
                    "completionPercentage": "Uw profiel is voor {{percentage}}% voltooid",
                    "inComplete": "Voltooi uw profiel",
                    "inCompleteFields": "Onvolledige attributen",
                    "mandatoryFieldsCompletion": "{{completed}} van {{total}} verplichte attributen voltooid",
                    "optionalFieldsCompletion": "{{completed}} van {{total}} optionele attributen voltooid"
                },
                "consentManagement": {
                    "actionTitles": {
                        "manage": "Beheer uw toestemmingen"
                    },
                    "description": "Bepaal welke gegevens u met andere toepassingen wilt delen",
                    "header": "Toestemmingsbeheer"
                },
                "profileStatus": {
                    "completionPercentage": "Uw profiel is voor {{percentage}}% voltooid",
                    "description": "Beheer uw profiel",
                    "header": "Uw {{productName}} profiel",
                    "profileText": "Details van uw persoonlijke profiel",
                    "readOnlyDescription": "Bekijk uw profiel",
                    "userSourceText": "(Aangemeld via {{source}})"
                }
            }
        },
        "profile": {
            "actions": {
                "deleteEmail": "E-mailadres verwijderen",
                "deleteMobile": "Mobiel nummer verwijderen",
                "verifyEmail": "Bevestig uw e-mailadres",
                "verifyMobile": "Verifieer mobiel"
            },
            "fields": {
                "Account Confirmed Time": "Tijdstip accountbevestiging",
                "Account Disabled": "Account uitgeschakeld",
                "Account Locked": "Account vergrendeld",
                "Account State": "Accountstatus",
                "Active": "Actief",
                "Address - Street": "Adres - Straat",
                "Ask Password": "Wachtwoord opvragen",
                "Backup Code Enabled": "Back-upcode ingeschakeld",
                "Backup Codes": "Back-upcodes",
                "Birth Date": "Geboortedatum",
                "Country": "Land",
                "Created Time": "Aanmaaktijd",
                "Disable EmailOTP": "EmailOTP uitschakelen",
                "Disable SMSOTP": "SMSOTP uitschakelen",
                "Display Name": "Weergavenaam",
                "Email": "E-mail",
                "Email Addresses": "E-mailadressen",
                "Email Verified": "E-mail geverifieerd",
                "Enabled Authenticators": "Ingeschakelde authenticators",
                "Existing Lite User": "Bestaande Lite-gebruiker",
                "External ID": "Externe ID",
                "Failed Attempts Before Success": "Mislukte pogingen vóór succes",
                "Failed Backup Code Attempts": "Mislukte back-upcodepogingen",
                "Failed Email OTP Attempts": "Mislukte e-mail-OTP-pogingen",
                "Failed Lockout Count": "Aantal mislukte vergrendelingen",
                "Failed Login Attempts": "Mislukte aanmeldingspogingen",
                "Failed Password Recovery Attempts": "Mislukte wachtwoordhersteltpogingen",
                "Failed SMS OTP Attempts": "Mislukte SMS-OTP-pogingen",
                "Failed TOTP Attempts": "Mislukte TOTP-pogingen",
                "First Name": "Voornaam",
                "Force Password Reset": "Wachtwoord opnieuw instellen afdwingen",
                "Full Name": "Volledige naam",
                "Gender": "Geslacht",
                "Groups": "Groepen",
                "Identity Provider Type": "Type identiteitsprovider",
                "Last Logon": "Laatste aanmelding",
                "Last Modified Time": "Laatst gewijzigd tijdstip",
                "Last Name": "Achternaam",
                "Last Password Update": "Laatste wachtwoordwijziging",
                "Lite User": "Lite-gebruiker",
                "Lite User ID": "Lite-gebruikers-ID",
                "Local": "Lokaal",
                "Local Credential Exists": "Lokale referenties bestaan",
                "Locality": "Plaats",
                "Location": "Locatie",
                "Locked Reason": "Reden voor vergrendeling",
                "Manager - Name": "Manager - Naam",
                "Middle Name": "Tweede naam",
                "Mobile": "Mobiel",
                "Mobile Numbers": "Mobiele nummers",
                "Nick Name": "Bijnaam",
                "Phone Verified": "Telefoon geverifieerd",
                "Photo - Thumbnail": "Foto - Miniatuur",
                "Photo URL": "Foto-URL",
                "Postal Code": "Postcode",
                "Preferred Channel": "Voorkeurskanaal",
                "Read Only User": "Alleen-lezen gebruiker",
                "Region": "Regio",
                "Resource Type": "Type bron",
                "Roles": "Rollen",
                "Secret Key": "Geheime sleutel",
                "TOTP Enabled": "TOTP ingeschakeld",
                "Time Zone": "Tijdzone",
                "URL": "URL",
                "Unlock Time": "Ontgrendelingstijd",
                "User Account Type": "Type gebruikersaccount",
                "User ID": "Gebruikers-ID",
                "User Metadata - Version": "Gebruikersmetagegevens - Versie",
                "User Source": "Gebruikersbron",
                "User Source ID": "ID van gebruikersbron",
                "Username": "Gebruikersnaam",
                "Verification Pending Email": "E-mail in afwachting van verificatie",
                "Verification Pending Mobile Number": "Mobiel nummer in afwachting van verificatie",
                "Verified Email Addresses": "Geverifieerde e-mailadressen",
                "Verified Mobile Numbers": "Geverifieerde mobiele nummers",
                "Verify Email": "E-mail verifiëren",
                "Verify Mobile": "Mobiel verifiëren",
                "Verify Secret Key": "Geheime sleutel verifiëren",
                "Website URL": "Website-URL",
                "emails": "E-mail",
                "generic": {
                    "default": "Attribuut {{fieldName}} toevoegen"
                },
                "nameFamilyName": "Achternaam",
                "nameGivenName": "Voornaam",
                "phoneNumbers": "Telefoonnummers",
                "profileImage": "Profielafbeelding",
                "profileUrl": "URL",
                "userName": "Gebruikersnaam"
            },
            "forms": {
                "countryChangeForm": {
                    "inputs": {
                        "country": {
                            "placeholder": "Selecteer uw land"
                        }
                    }
                },
                "dateChangeForm": {
                    "inputs": {
                        "date": {
                            "validations": {
                                "futureDateError": "De datum die u heeft ingevoerd voor het veld {{field}} is ongeldig.",
                                "invalidFormat": "Voer een geldige waarde in het formaat YYYY-MM-DD in."
                            }
                        }
                    }
                },
                "emailChangeForm": {
                    "inputs": {
                        "email": {
                            "label": "E-mail",
                            "note": "OPMERKING: Hiermee wijzigt u het e-mailadres dat aan dit account is gekoppeld. Dit e-mailadres wordt ook gebruikt voor accountherstel.",
                            "placeholder": "Voer uw e-mailadres in",
                            "validations": {
                                "empty": "E-mailadres is verplicht",
                                "invalidFormat": "Het formaat van het ingevoerde e-mailadres is ongeldig. U kunt alfanumerieke tekens, Unicode-tekens, underscores (_), streepjes (-), punten (.) en een apenstaartje (@) gebruiken."
                            }
                        }
                    }
                },
                "generic": {
                    "dropdown": {
                        "placeholder": "Selecteer uw {{FieldName}}"
                    },
                    "inputs": {
                        "placeholder": "Voer uw {{fieldName}} in",
                        "readonly": {
                            "placeholder": "Deze waarde is leeg",
                            "popup": "Neem contact op met de beheerder om uw {{fieldName}} bij te werken"
                        },
                        "validations": {
                            "duplicate": "{{fieldName}} mag geen dubbele waarden hebben",
                            "empty": "Het attribuut {{fieldName}} is verplicht",
                            "invalidFormat": "Het formaat van de ingevoerde {{fieldName}} is onjuist"
                        }
                    },
                    "radioGroup": {
                        "optionNone": "Geen"
                    }
                },
                "mobileChangeForm": {
                    "inputs": {
                        "mobile": {
                            "label": "Mobiel telefoonnummer",
                            "note": "OPMERKING: Het gekoppelde mobiele telefoonnummer van uw gebruikersprofiel wordt gewijzigd",
                            "placeholder": "Voer uw mobiele nummer in",
                            "validations": {
                                "empty": "Mobiel nummer is een verplicht veld",
                                "invalidFormat": "Voer een geldig mobiel nummer in het formaat [+][landcode][netnummer][lokaal telefoonnummer] in."
                            }
                        }
                    }
                },
                "nameChangeForm": {
                    "inputs": {
                        "firstName": {
                            "label": "Voornaam",
                            "placeholder": "Voer uw voornaam in",
                            "validations": {
                                "empty": "Voornaam is verplicht"
                            }
                        },
                        "lastName": {
                            "label": "Achternaam",
                            "placeholder": "Voer uw achternaam in",
                            "validations": {
                                "empty": "Achternaam is verplicht"
                            }
                        }
                    }
                },
                "organizationChangeForm": {
                    "inputs": {
                        "organization": {
                            "label": "Organisatie",
                            "placeholder": "Voer uw organisatie in",
                            "validations": {
                                "empty": "Organisatie is verplicht"
                            }
                        }
                    }
                }
            },
            "messages": {
                "emailConfirmation": {
                    "content": "Bevestig uw e-mailadres zodat u het aan uw profiel kunt toevoegen",
                    "header": "Bevestiging in afwachting!"
                },
                "emailVerification": {
                    "content": "Dit e-mailadres wordt gebruikt om verificatie-e-mails te verzenden wanneer tweefactorauthenticatie is ingeschakeld en om herstelcodes te verzenden in geval van herstel van een gebruikersnaam/wachtwoord. Om dit e-mailadres bij te werken, moet u het nieuwe e-mailadres verifiëren door de verificatiecode in te voeren die naar uw nieuwe e-mailadres is verzonden. Klik op bijwerken als u wilt doorgaan."
                },
                "mobileVerification": {
                    "content": "Dit mobiele nummer wordt gebruikt voor het verzenden van SMS-OTP wanneer tweefactorauthenticatie is ingeschakeld en voor het verzenden van herstelcodes in geval van herstel van een gebruikersnaam/wachtwoord. Om dit nummer bij te werken, moet u het nieuwe nummer verifiëren door de verificatiecode in te voeren die naar uw nieuwe nummer is verzonden. Klik op bijwerken als u wilt doorgaan."
                }
            },
            "modals": {
                "customMultiAttributeDeleteConfirmation": {
                    "assertionHint": "Bevestig uw actie.",
                    "content": "Deze actie is onomkeerbaar en verwijdert de geselecteerde waarde definitief.",
                    "description": "Als u deze geselecteerde waarde verwijdert, wordt deze permanent uit uw profiel verwijderd.",
                    "heading": "Weet u het zeker?"
                },
                "emailAddressDeleteConfirmation": {
                    "assertionHint": "Bevestig uw actie.",
                    "content": "Deze actie is onomkeerbaar en verwijdert het e-mailadres permanent.",
                    "description": "Als u dit e-mailadres verwijdert, wordt het permanent uit uw profiel verwijderd.",
                    "heading": "Weet u het zeker?"
                },
                "mobileNumberDeleteConfirmation": {
                    "assertionHint": "Bevestig uw actie.",
                    "content": "Deze actie is onomkeerbaar en verwijdert het mobiele telefoonnummer permanent.",
                    "description": "Als u dit mobiele telefoonnummer verwijdert, wordt het permanent uit uw profiel verwijderd.",
                    "heading": "Weet u het zeker?"
                }
            },
            "notifications": {
                "getProfileCompletion": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het beoordelen van de profielcompleetheid",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De profielcompleetheid is succesvol beoordeeld",
                        "message": "Beoordeling geslaagd"
                    }
                },
                "getProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden bij het ophalen van uw profielgegevens"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van uw profielgegevens",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De verplichte attributen van het gebruikersprofiel zijn succesvol opgehaald",
                        "message": "Gebruikersprofiel succesvol opgehaald"
                    }
                },
                "getUserReadOnlyStatus": {
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van de alleen-lezen-status van de gebruiker",
                        "message": "Er is iets misgegaan"
                    }
                },
                "updateProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden bij het bijwerken van de profielgegevens"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het bijwerken van de profielgegevens",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De verplichte attributen van het gebruikersprofiel zijn succesvol bijgewerkt",
                        "message": "Gebruikersprofiel succesvol bijgewerkt"
                    }
                },
                "verifyEmail": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden bij het verzenden van de verificatie-e-mail"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het verzenden van de verificatie-e-mail",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De verificatie-e-mail is succesvol verzonden. Controleer uw inbox",
                        "message": "Verificatie-e-mail succesvol verzonden"
                    }
                },
                "verifyMobile": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden bij het verzenden van de verificatiecode"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het verzenden van de verificatiecode",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "De verificatiecode is succesvol verzonden. Controleer uw mobiele telefoon",
                        "message": "Verificatiecode succesvol verzonden"
                    }
                }
            },
            "placeholders": {
                "SCIMDisabled": {
                    "heading": "Deze functie is niet beschikbaar voor uw account"
                }
            }
        },
        "profileExport": {
            "notifications": {
                "downloadProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Er is een fout opgetreden bij het downloaden van uw gebruikersprofielgegevens"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het downloaden van uw gebruikersprofielgegevens",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Het downloaden van het bestand met uw gebruikersprofielgegevens is gestart",
                        "message": "Het downloaden van uw gebruikersprofielgegevens is gestart"
                    }
                }
            }
        },
        "selfSignUp": {
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}.",
                        "message": "Fout bij het ophalen van de zelfregistratievoorkeuren"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van de zelfregistratievoorkeuren.",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Zelfregistratievoorkeuren succesvol opgehaald.",
                        "message": "Zelfregistratievoorkeuren succesvol opgehaald"
                    }
                }
            }
        },
        "systemNotificationAlert": {
            "resend": "Opnieuw verzenden",
            "selfSignUp": {
                "awaitingAccountConfirmation": "Uw account is nog niet actief. We hebben een activeringslink naar uw geregistreerde e-mailadres gestuurd. Heeft u een nieuwe link nodig?",
                "notifications": {
                    "resendError": {
                        "description": "Er is een fout opgetreden bij het opnieuw verzenden van de accountbevestigingsmail.",
                        "message": "Er is iets misgegaan"
                    },
                    "resendSuccess": {
                        "description": "Accountbevestigingsmail succesvol opnieuw verzonden.",
                        "message": "Accountbevestigingsmail succesvol opnieuw verzonden"
                    }
                }
            }
        },
        "userAvatar": {
            "infoPopover": "Deze afbeelding is opgehaald uit de <1>Gravatar</1>-service.",
            "urlUpdateHeader": "Voer de URL van een afbeelding in om uw profielfoto bij te werken"
        },
        "userSessions": {
            "browserAndOS": "{{browser}} op {{os}} {{version}}",
            "dangerZones": {
                "terminate": {
                    "actionTitle": "Afmelden",
                    "header": "Afmelden",
                    "subheader": "De toegang tot uw account vanaf dit apparaat wordt verwijderd."
                }
            },
            "lastAccessed": "Laatst geopend {{date}}",
            "modals": {
                "terminateActiveUserSessionModal": {
                    "heading": "Lopende actieve sessies beëindigen",
                    "message": "Wijzigingen aan de tweefactorauthenticatie (2FA)-optie worden niet toegepast op uw actieve sessies. We raden u aan deze te beëindigen.",
                    "primaryAction": "Alles beëindigen",
                    "secondaryAction": "Bekijken en beëindigen"
                },
                "terminateAllUserSessionsModal": {
                    "heading": "Bevestiging",
                    "message": "Met deze actie wordt u afgemeld bij deze sessie en alle andere sessies op elk apparaat. Wilt u doorgaan?"
                },
                "terminateUserSessionModal": {
                    "heading": "Bevestiging",
                    "message": "Met deze actie wordt de toegang tot uw account vanaf dit apparaat verwijderd. Wilt u doorgaan?"
                }
            },
            "notifications": {
                "fetchSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het ophalen van geauthenticeerde sessies"
                    },
                    "genericError": {
                        "description": "Kan geauthenticeerde sessies niet ophalen",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Geauthenticeerde sessies succesvol opgehaald",
                        "message": "Geauthenticeerde sessies succesvol opgehaald"
                    }
                },
                "terminateAllUserSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Kan niet alle geauthenticeerde sessies beëindigen"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het beëindigen van de geauthenticeerde sessies",
                        "message": "Kan de geauthenticeerde sessies niet beëindigen"
                    },
                    "success": {
                        "description": "Alle geauthenticeerde sessies zijn verwijderd",
                        "message": "Alle geauthenticeerde sessies beëindigd"
                    }
                },
                "terminateUserSession": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Kan de geauthenticeerde sessie niet beëindigen"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het beëindigen van de geauthenticeerde sessie",
                        "message": "Kan de geauthenticeerde sessie niet beëindigen"
                    },
                    "success": {
                        "description": "Geauthenticeerde sessie succesvol beëindigd",
                        "message": "Sessie succesvol verwijderd"
                    }
                }
            }
        },
        "verificationOnUpdate": {
            "modal": {
                "common": {
                    "step2": {
                        "hint": "Heeft u geen code ontvangen?",
                        "resend": "Opnieuw verzenden",
                        "resendSuccess": "Het verzoek om de code opnieuw te verzenden is succesvol verzonden",
                        "validation": {
                            "otpRequired": "Voer de verificatiecode in"
                        },
                        "verificationFailure": "Verificatie mislukt. Probeer het opnieuw."
                    }
                },
                "email": {
                    "step1": {
                        "content": {
                            "label": "Voer uw nieuwe e-mailadres in"
                        },
                        "heading": "Verifieer uw e-mailadres",
                        "validation": {
                            "invalidFormat": "Voer een geldig e-mailadres in",
                            "required": "E-mailadres vereist"
                        }
                    },
                    "step2": {
                        "content": {
                            "label": "Er is een verificatiecode naar uw e-mailadres verzonden. Voer de onderstaande code in om uw e-mailadres te verifiëren."
                        },
                        "heading": "Verifieer uw e-mailadres"
                    },
                    "step3": {
                        "content": "Geslaagd! Uw e-mailadres is succesvol geverifieerd."
                    }
                },
                "notifications": {
                    "resendError": {
                        "description": "Er is een fout opgetreden bij het opnieuw verzenden van de verificatiecode",
                        "message": "Er is een probleem opgetreden"
                    }
                },
                "sms": {
                    "step1": {
                        "content": {
                            "label": "Voer uw nieuwe mobiele nummer in"
                        },
                        "heading": "Verifieer uw mobiele nummer",
                        "validation": {
                            "invalidFormat": "Voer een geldig mobiel nummer in",
                            "required": "Mobiel nummer vereist"
                        }
                    },
                    "step2": {
                        "content": {
                            "label": "Er is een verificatiecode naar uw mobiele nummer verzonden. Voer de onderstaande code in om uw mobiele nummer te verifiëren."
                        },
                        "heading": "Verifieer uw mobiele nummer"
                    },
                    "step3": {
                        "content": "Geslaagd! Uw mobiele nummer is succesvol geverifieerd."
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Fout bij het ophalen van de verificatie-bij-bijwerken-voorkeur"
                    },
                    "genericError": {
                        "description": "Er is een fout opgetreden bij het ophalen van de verificatie-bij-bijwerken-voorkeur",
                        "message": "Er is iets misgegaan"
                    },
                    "success": {
                        "description": "Verificatie-bij-bijwerken-voorkeur succesvol opgehaald",
                        "message": "Verificatie-bij-bijwerken-voorkeur succesvol opgehaald"
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
                            "content": "Het lijkt erop dat het geselecteerde e-mailadres niet is geregistreerd bij Gravatar. Maak een account aan via <1>de officiële Gravatar-website</1> of gebruik een van de afbeeldingen hieronder.",
                            "header": "Geen afbeelding gevonden op Gravatar!"
                        }
                    },
                    "heading": "Gravatar gekoppeld aan e-mailadres "
                },
                "hostedAvatar": {
                    "heading": "Afbeelding van het internet",
                    "input": {
                        "errors": {
                            "http": {
                                "content": "De geselecteerde URL verwijst naar een onbeveiligde bron (HTTP). Wees voorzichtig.",
                                "header": "Onbeveiligde inhoud!"
                            },
                            "invalid": {
                                "content": "Voer een geldige URL in die naar een afbeelding verwijst"
                            }
                        },
                        "hint": "Voer de geldige URL in van een afbeelding die op een externe site wordt gehost",
                        "placeholder": "Voer de URL van de afbeelding in",
                        "warnings": {
                            "dataURL": {
                                "content": "Het gebruik van URL's met een groot aantal tekens kan problemen veroorzaken in de database. Ga met voorzichtigheid te werk",
                                "header": "Controleer de ingevoerde URL!"
                            }
                        }
                    }
                },
                "systemGenAvatars": {
                    "heading": "Systeem-gegenereerde avatar",
                    "types": {
                        "initials": "Initialen"
                    }
                }
            },
            "description": "Werk uw profielfoto bij",
            "heading": "Uw profielfoto",
            "primaryButton": "Opslaan",
            "secondaryButton": "Annuleren"
        },
        "sessionTimeoutModal": {
            "description": "Wanneer u op <1>Terug</1> klikt, proberen we de sessie te herstellen als deze bestaat. Als u geen actieve sessie heeft, wordt u doorgestuurd naar de aanmeldpagina.",
            "heading": "Het lijkt erop dat u lange tijd inactief bent geweest.",
            "loginAgainButton": "Opnieuw aanmelden",
            "primaryButton": "Terug",
            "secondaryButton": "Afmelden",
            "sessionTimedOutDescription": "Meld u opnieuw aan om verder te gaan waar u gebleven was.",
            "sessionTimedOutHeading": "De gebruikerssessie is verlopen wegens inactiviteit."
        }
    },
    "pages": {
        "applications": {
            "subTitle": "Ontdek en open uw toepassingen",
            "title": "Toepassingen"
        },
        "overview": {
            "subTitle": "Beheer uw persoonlijke gegevens, accountbeveiliging en privacy-instellingen",
            "title": "Welkom, {{firstName}}"
        },
        "personalInfo": {
            "subTitle": "Bewerk of exporteer uw persoonlijke profiel en beheer uw gekoppelde accounts",
            "title": "Persoonlijke gegevens"
        },
        "personalInfoWithoutExportProfile": {
            "subTitle": "Bewerk uw persoonlijke profiel",
            "title": "Persoonlijke gegevens"
        },
        "personalInfoWithoutLinkedAccounts": {
            "subTitle": "Bewerk of exporteer uw persoonlijke profiel",
            "title": "Persoonlijke gegevens"
        },
        "privacy": {
            "subTitle": "",
            "title": "Privacybeleid van WSO2 Identity Server"
        },
        "readOnlyProfileBanner": "Uw profiel kan vanuit dit portaal niet worden bewerkt. Neem contact op met uw beheerder voor meer informatie.",
        "security": {
            "subTitle": "Beveilig uw account door toestemmingen, geauthenticeerde sessies en beveiligingsinstellingen te beheren",
            "title": "Beveiliging"
        }
    },
    "placeholders": {
        "404": {
            "action": "Terug naar startpagina",
            "subtitles": {
                "0": "De pagina die u probeert te bekijken bestaat niet.",
                "1": "Controleer de URL of klik op de knop hieronder om naar de startpagina te worden doorgestuurd."
            },
            "title": "Pagina niet gevonden"
        },
        "accessDeniedError": {
            "action": "Terug naar startpagina",
            "subtitles": {
                "0": "Het lijkt erop dat u geen toestemming heeft om deze pagina te openen.",
                "1": "Meld u aan met een ander account."
            },
            "title": "Niet-geautoriseerde toegang"
        },
        "emptySearchResult": {
            "action": "Zoekopdracht opnieuw instellen",
            "subtitles": {
                "0": "De zoekopdracht \"{{query}}\" heeft geen resultaten opgeleverd.",
                "1": "Probeer het met andere parameters."
            },
            "title": "Geen resultaten"
        },
        "genericError": {
            "action": "Pagina vernieuwen",
            "subtitles": {
                "0": "Er is iets misgegaan bij het weergeven van deze pagina.",
                "1": "Zie de browserconsole voor technische details."
            },
            "title": "Er is iets misgegaan"
        },
        "loginError": {
            "action": "Afmelden",
            "subtitles": {
                "0": "Het lijkt erop dat u geen toegang heeft tot dit portaal.",
                "1": "Meld u aan met een ander account."
            },
            "title": "Verboden toegang"
        },
        "sessionStorageDisabled": {
            "subtitles": {
                "0": "Om deze toepassing te kunnen gebruiken, moet u cookies inschakelen in de instellingen van uw webbrowser.",
                "1": "Voor meer informatie over het inschakelen van cookies, raadpleegt u de hulpsectie van uw webbrowser."
            },
            "title": "Cookies zijn uitgeschakeld in uw browser."
        }
    },
    "sections": {
        "accountRecovery": {
            "description": "Beheer de herstelgegevens die we kunnen gebruiken om u te helpen uw wachtwoord te herstellen",
            "emptyPlaceholderText": "Geen accountherstelopties beschikbaar",
            "heading": "Herstel van uw account"
        },
        "changePassword": {
            "actionTitles": {
                "change": "Mijn wachtwoord wijzigen"
            },
            "description": "Zorg ervoor dat u uw wachtwoord regelmatig bijwerkt en het niet opnieuw gebruikt op andere sites.",
            "heading": "Wachtwoord wijzigen"
        },
        "consentManagement": {
            "actionTitles": {
                "empty": "U heeft aan geen enkele toepassing toestemming gegeven"
            },
            "description": "Bekijk de toestemmingen die u voor elke toepassing heeft gegeven. Daarnaast kunt u één of meer ervan intrekken naar wens.",
            "heading": "Mijn toestemmingen beheren",
            "placeholders": {
                "emptyConsentList": {
                    "heading": "U heeft geen toestemmingen gegeven"
                }
            }
        },
        "createPassword": {
            "actionTitles": {
                "create": "Wachtwoord aanmaken"
            },
            "description": "Maak een wachtwoord aan in {{productName}}. U kunt dit wachtwoord gebruiken om u aan te melden bij {{productName}}, naast de sociale aanmelding.\n",
            "heading": "Wachtwoord aanmaken"
        },
        "federatedAssociations": {
            "description": "Bekijk uw accounts van andere aanmeldingen die aan dit account zijn gekoppeld",
            "heading": "Externe authenticatiediensten"
        },
        "linkedAccounts": {
            "actionTitles": {
                "add": "Een ander account koppelen"
            },
            "description": "Koppel uw accounts en open deze naadloos zonder u opnieuw te hoeven aanmelden",
            "heading": "Gekoppelde accounts"
        },
        "mfa": {
            "description": "Versterk de bescherming van uw account door meerdere authenticatiestappen te configureren.",
            "heading": "Authenticatie met meerdere stappen"
        },
        "profile": {
            "description": "Beheer uw persoonlijke gegevens, zoals uw naam, e-mailadres, mobiele nummer, enz.",
            "heading": "Profiel"
        },
        "profileExport": {
            "actionTitles": {
                "export": "Profiel downloaden"
            },
            "description": "Download al uw profielgegevens, inclusief persoonlijke gegevens en gekoppelde accounts",
            "heading": "Mijn profiel downloaden"
        },
        "userSessions": {
            "actionTitles": {
                "empty": "Geen actieve sessies",
                "terminateAll": "Alle sessies beëindigen"
            },
            "description": "Bekijk alle sessies die momenteel actief zijn op uw account",
            "heading": "Actieve sessies",
            "placeholders": {
                "emptySessionList": {
                    "heading": "Er zijn geen actieve sessies voor deze gebruiker"
                }
            }
        }
    }
};
