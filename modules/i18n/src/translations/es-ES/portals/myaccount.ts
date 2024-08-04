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
                    add: "Agregue o actualice el número de móvil de recuperación.",
                    emptyMobile: "Necesita configurar su número de móvil para proceder con la recuperación por SMS-OTP.",
                    update: "Actualice el número de móvil de recuperación ({{mobile}})",
                    view: "Ver número de móvil de recuperación ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "Número de móvil",
                                placeholder: "Ingrese el número de móvil de recuperación.",
                                validations: {
                                    empty: "Ingrese un número de móvil.",
                                    invalidFormat: "El formato del número de móvil no es correcto."
                                }
                            }
                        }
                    }
                },
                heading: "Recuperación por SMS",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "Error al actualizar el número de móvil de recuperación."
                        },
                        genericError: {
                            description: "Ocurrió un error al actualizar el número de móvil de recuperación",
                            message: "Algo salió mal"
                        },
                        success: {
                            description: "El número de móvil en el perfil del usuario ha sido actualizado con éxito",
                            message: "Número de móvil actualizado con éxito"
                        }
                    }
                }
            },
            "codeRecovery": {
                "descriptions": {
                    "add": "Agregar o actualizar opciones de recuperación de código"
                },
                "heading": "Recuperación de código"
            },
            "emailRecovery": {
                "descriptions": {
                    "add": "Agregar o actualizar la dirección de correo electrónico de recuperación",
                    "emptyEmail": "Debe configurar su dirección de correo electrónico para continuar con la recuperación del correo electrónico.",
                    "update": "Actualizar la dirección de correo electrónico de recuperación ({{email}})",
                    "view": "Ver la dirección de correo electrónico de recuperación ({{email}})"
                },
                "forms": {
                    "emailResetForm": {
                        "inputs": {
                            "email": {
                                "label": "Dirección de correo electrónico",
                                "placeholder": "Introduce la dirección de correo electrónico de recuperación",
                                "validations": {
                                    "empty": "Introduzca una dirección de correo electrónico",
                                    "invalidFormat": "La dirección de correo electrónico no tiene el formato correcto"
                                }
                            }
                        }
                    }
                },
                "heading": "recuperación de correo electrónico",
                "notifications": {
                    "updateEmail": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Error al actualizar el correo electrónico de recuperación"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al actualizar el correo electrónico de recuperación",
                            "message": "Algo salió mal"
                        },
                        "success": {
                            "description": "La dirección de correo electrónico en el perfil de usuario se ha actualizado correctamente",
                            "message": "Dirección de correo electrónico actualizada con éxito"
                        }
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al obtener la preferencia de recuperación"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al obtener la preferencia de recuperación",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Recuperó con éxito la preferencia de recuperación",
                        "message": "Recuperación de preferencia de recuperación exitosa"
                    }
                }
            },
            "questionRecovery": {
                "descriptions": {
                    "add": "Agregar o actualizar preguntas de desafío de recuperación de cuenta"
                },
                "forms": {
                    "securityQuestionsForm": {
                        "inputs": {
                            "answer": {
                                "label": "Respuesta",
                                "placeholder": "Introduce tu respuesta",
                                "validations": {
                                    "empty": "La respuesta es un campo obligatorio"
                                }
                            },
                            "question": {
                                "label": "Pregunta",
                                "placeholder": "Seleccione una Pregunta de Seguridad",
                                "validations": {
                                    "empty": "Se debe seleccionar al menos una pregunta de seguridad"
                                }
                            }
                        }
                    }
                },
                "heading": "Preguntas de seguridad",
                "notifications": {
                    "addQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Ocurrió un error al agregar las preguntas de seguridad"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al agregar las preguntas de seguridad",
                            "message": "Algo salió mal."
                        },
                        "success": {
                            "description": "Las preguntas de seguridad requeridas se agregaron correctamente",
                            "message": "Las preguntas de seguridad se agregaron con éxito"
                        }
                    },
                    "updateQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Error al actualizar las preguntas de seguridad"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al actualizar las preguntas de seguridad",
                            "message": "Algo salió mal."
                        },
                        "success": {
                            "description": "Las preguntas de seguridad requeridas se actualizaron con éxito",
                            "message": "Las preguntas de seguridad se actualizaron con éxito"
                        }
                    }
                }
            }
        },
        "advancedSearch": {
            "form": {
                "inputs": {
                    "filterAttribute": {
                        "label": "Atributo de filtro",
                        "placeholder": "Por ejemplo, nombre, descripción, etc.",
                        "validations": {
                            "empty": "El atributo de filtro es un campo obligatorio."
                        }
                    },
                    "filterCondition": {
                        "label": "Condición del filtro",
                        "placeholder": "Por ejemplo, comienza con etc.",
                        "validations": {
                            "empty": "La condición del filtro es un campo obligatorio."
                        }
                    },
                    "filterValue": {
                        "label": "Valor de filtro",
                        "placeholder": "Por ejemplo, administrador, wso2, etc.",
                        "validations": {
                            "empty": "El valor del filtro es un campo obligatorio."
                        }
                    }
                }
            },
            "hints": {
                "querySearch": {
                    "actionKeys": "Mayús + Intro",
                    "label": "Para buscar como una consulta"
                }
            },
            "options": {
                "header": "Búsqueda Avanzada"
            },
            "placeholder": "Buscar por {{attribute}}",
            "popups": {
                "clear": "Borrar búsqueda",
                "dropdown": "Mostrar opciones"
            },
            "resultsIndicator": "Mostrando resultados para la consulta \"{{query}}\""
        },
        "applications": {
            "advancedSearch": {
                "form": {
                    "inputs": {
                        "filterAttribute": {
                            "placeholder": "Por ejemplo, nombre, descripción, etc."
                        },
                        "filterCondition": {
                            "placeholder": "Por ejemplo, comienza con etc."
                        },
                        "filterValue": {
                            "placeholder": "Ingrese el valor para buscar"
                        }
                    }
                },
                "placeholder": "Buscar por nombre de la aplicación"
            },
            "all": {
                "heading": "Todas las aplicaciones"
            },
            "favourite": {
                "heading": "Favoritos"
            },
            "notifications": {
                "fetchApplications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al recuperar aplicaciones"
                    },
                    "genericError": {
                        "description": "No se pudieron recuperar las aplicaciones",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Recuperó con éxito las aplicaciones.",
                        "message": "Recuperación de aplicaciones exitosa"
                    }
                }
            },
            "placeholders": {
                "emptyList": {
                    "action": "Actualizar lista",
                    "subtitles": {
                        "0": "La lista de aplicaciones volvió vacía.",
                        "1": "Esto podría deberse a que no tiene aplicaciones detectables.",
                        "2": "Pídale a un administrador que habilite la visibilidad de las aplicaciones."
                    },
                    "title": "Sin Aplicaciones"
                }
            },
            "recent": {
                "heading": "Aplicaciones recientes"
            }
        },
        "changePassword": {
            "forms": {
                "passwordResetForm": {
                    "inputs": {
                        "confirmPassword": {
                            "label": "Confirmar Contraseña",
                            "placeholder": "Introduce la nueva contraseña",
                            "validations": {
                                "empty": "Confirmar contraseña es un campo obligatorio",
                                "mismatch": "La confirmación de la contraseña no coincide"
                            }
                        },
                        "currentPassword": {
                            "label": "Contraseña actual",
                            "placeholder": "Introduzca la contraseña actual",
                            "validations": {
                                "empty": "La contraseña actual es un campo obligatorio",
                                "invalid": "La contraseña actual no es válida"
                            }
                        },
                        "newPassword": {
                            "label": "Nueva contraseña",
                            "placeholder": "Introduce la nueva contraseña",
                            "validations": {
                                "empty": "La nueva contraseña es un campo obligatorio"
                            }
                        }
                    },
                    "validations": {
                        "genericError": {
                            "description": "Algo salió mal. Inténtalo de nuevo",
                            "message": "Error al cambiar contraseña"
                        },
                        "invalidCurrentPassword": {
                            "description": "La contraseña actual que ingresó parece no ser válida. Inténtalo de nuevo",
                            "message": "Error al cambiar contraseña"
                        },
                        "invalidNewPassword": {
                            "description": "La contraseña no cumple con las restricciones requeridas.",
                            "message": "Contraseña invalida"
                        },
                        "passwordCaseRequirement": "Al menos {{minUpperCase}} letras mayúsculas y {{minLowerCase}} letras minúsculas",
                        "passwordCharRequirement": "Al menos {{minSpecialChr}} de carácter(es) especial(es)",
                        "passwordLengthRequirement": "Debe tener entre {{min}} y {{max}} caracteres",
                        "passwordLowerCaseRequirement": "Al menos {{minLowerCase}} letra(s) minúscula(s)",
                        "passwordNumRequirement": "Al menos {{min}} número(s)",
                        "passwordRepeatedChrRequirement": "No más de {{repeatedChr}} caracteres repetidos",
                        "passwordUniqueChrRequirement": "Al menos {{uniqueChr}} caracteres únicos",
                        "passwordUpperCaseRequirement": "Al menos {{minUpperCase}} letras mayúsculas",
                        "submitError": {
                            "description": "{{description}}",
                            "message": "Error al cambiar contraseña"
                        },
                        "submitSuccess": {
                            "description": "La contraseña ha sido cambiada con éxito",
                            "message": "Restablecimiento de contraseña exitoso"
                        },
                        "validationConfig": {
                            "error": {
                                "description": "{{description}}",
                                "message": "error de recuperación"
                            },
                            "genericError": {
                                "description": "No se pudieron recuperar los datos de configuración de validación.",
                                "message": "Algo salió mal"
                            }
                        }
                    }
                }
            },
            "modals": {
                "confirmationModal": {
                    "heading": "Confirmación",
                    "message": "Cambiar la contraseña resultará en la terminación de la sesión actual. Tendrás que iniciar sesión con la contraseña recién cambiada. ¿Desea continuar?"
                }
            }
        },
        "consentManagement": {
            "editConsent": {
                "collectionMethod": "Método de recolección",
                "dangerZones": {
                    "revoke": {
                        "actionTitle": "Revocar",
                        "header": "Revocar el consentimiento",
                        "subheader": "Tendrá que dar su consentimiento para esta aplicación de nuevo."
                    }
                },
                "description": "Descripción",
                "piiCategoryHeading": "Gestionar el consentimiento para la recopilación y el intercambio de su información personal con la aplicación. Desmarque los atributos que necesita revocar y presione el botón Actualizar para guardar los cambios o presione el botón Revocar para eliminar el consentimiento de todos los atributos.",
                "state": "Expresar",
                "version": "Versión"
            },
            "modals": {
                "consentRevokeModal": {
                    "heading": "¿Está seguro?",
                    "message": "Esta operación no es reversible. Esto revocará permanentemente el consentimiento para todos los atributos. ¿Estas seguro que deseas continuar?",
                    "warning": "Tenga en cuenta que será redirigido a la página de consentimiento de inicio de sesión"
                }
            },
            "notifications": {
                "consentReceiptFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "No se pudo cargar información sobre la aplicación seleccionada",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Recuperó correctamente el recibo de consentimiento",
                        "message": "Recuperación exitosa"
                    }
                },
                "consentedAppsFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "No se pudo cargar la lista de aplicaciones consentidas",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Se recuperó con éxito la lista de aplicaciones consentidas",
                        "message": "Recuperación exitosa"
                    }
                },
                "revokeConsentedApp": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error de revocación de consentimientos"
                    },
                    "genericError": {
                        "description": "No se pudo revocar el consentimiento para la aplicación",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "El consentimiento ha sido revocado con éxito para la aplicación.",
                        "message": "Consentimientos Revocar Éxito"
                    }
                },
                "updateConsentedClaims": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "Las reclamaciones consentidas no se actualizaron para la aplicación.",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Las reclamaciones consentidas se han actualizado correctamente para la aplicación.",
                        "message": "Reclamos consentidos actualizados con éxito"
                    }
                }
            }
        },
        "cookieConsent": {
            "confirmButton": "Entendido",
            "content": "Usamos cookies para asegurarnos de que obtenga la mejor experiencia en general. Estas cookies se utilizan para mantener una sesión continua e ininterrumpida mientras se brindan servicios fluidos y personalizados. Para obtener más información sobre cómo usamos las cookies, consulte nuestra <1>Política de cookies</1> ."
        },
        "federatedAssociations": {
            "deleteConfirmation": "Esto eliminará la cuenta social vinculada de su cuenta local. ¿Quieres seguir eliminando?",
            "notifications": {
                "getFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "No se pudieron recuperar las cuentas sociales vinculadas",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Las cuentas sociales vinculadas se han recuperado correctamente",
                        "message": "Cuentas sociales vinculadas recuperadas con éxito"
                    }
                },
                "removeAllFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "No se pudieron eliminar las cuentas sociales vinculadas",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Todas las cuentas sociales vinculadas se han eliminado con éxito",
                        "message": "Cuentas sociales vinculadas eliminadas con éxito"
                    }
                },
                "removeFederatedAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "No se pudo eliminar la cuenta social vinculada",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "La cuenta social vinculada se ha eliminado con éxito",
                        "message": "La cuenta social vinculada se eliminó con éxito"
                    }
                }
            }
        },
        "footer": {
            "copyright": "Servidor de identidad WSO2 © {{year}}"
        },
        "header": {
            "appSwitch": {
                "console": {
                    "description": "Administrar como desarrolladores o administradores",
                    "name": "Consola"
                },
                "myAccount": {
                    "description": "Administra tu propia cuenta",
                    "name": "Mi cuenta"
                },
                "tooltip": "Aplicaciones"
            },
            "organizationLabel": "Esta cuenta es administrada por"
        },
        "linkedAccounts": {
            "accountTypes": {
                "local": {
                    "label": "Agregar cuenta de usuario local"
                }
            },
            "deleteConfirmation": "Esto eliminará la cuenta vinculada de su cuenta. ¿Quieres seguir eliminando?",
            "forms": {
                "addAccountForm": {
                    "inputs": {
                        "password": {
                            "label": "Contraseña",
                            "placeholder": "Introduce la contraseña",
                            "validations": {
                                "empty": "La contraseña es un campo requerido"
                            }
                        },
                        "username": {
                            "label": "Nombre de usuario",
                            "placeholder": "Ingrese el nombre de usuario",
                            "validations": {
                                "empty": "El nombre de usuario es un campo obligatorio"
                            }
                        }
                    }
                }
            },
            "notifications": {
                "addAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al recuperar cuentas de usuario vinculadas"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al agregar la cuenta vinculada",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "La cuenta de usuario vinculada requerida se agregó correctamente",
                        "message": "Cuenta de usuario vinculada añadida correctamente"
                    }
                },
                "getAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al recuperar cuentas de usuario vinculadas"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al recuperar las cuentas de usuario vinculadas",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Los detalles de perfil de usuario requeridos se recuperan con éxito",
                        "message": "Cuentas de usuario vinculadas recuperadas correctamente"
                    }
                },
                "removeAllAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al eliminar cuentas de usuario vinculadas"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al eliminar las cuentas de usuario vinculadas",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Se han eliminado todas las cuentas de usuario vinculadas.",
                        "message": "Cuentas vinculadas eliminadas con éxito"
                    }
                },
                "removeAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al eliminar la cuenta de usuario vinculada"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al eliminar la cuenta de usuario vinculada",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Las cuentas de usuario vinculadas se han eliminado.",
                        "message": "Cuenta vinculada eliminada con éxito"
                    }
                },
                "switchAccount": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Ocurrió un error al cambiar la cuenta"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al cambiar la cuenta",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "La cuenta ha sido cambiada con éxito",
                        "message": "Cuenta cambiada con éxito"
                    }
                }
            }
        },
        "loginVerifyData": {
            "description": "Estos datos se utilizan para verificar aún más su identidad durante el inicio de sesión",
            "heading": "Datos utilizados para verificar su inicio de sesión",
            "modals": {
                "clearTypingPatternsModal": {
                    "heading": "Confirmación",
                    "message": "Esta acción borrará los patrones de escritura que se guardan en TypingDNA. ¿Desea continuar?"
                }
            },
            "notifications": {
                "clearTypingPatterns": {
                    "error": {
                        "description": "No se pudieron borrar los patrones de escritura. Póngase en contacto con el administrador de su sitio",
                        "message": "No se pudieron borrar los patrones de escritura"
                    },
                    "success": {
                        "description": "Sus patrones de escritura en TypingDNA se han borrado con éxito",
                        "message": "Patrones de escritura borrados con éxito"
                    }
                }
            },
            "typingdna": {
                "description": "Sus patrones de escritura se pueden borrar desde aquí",
                "heading": "TypingDNA Typing Patterns"
            }
        },
        "mfa": {
            "authenticatorApp": {
                "addHint": "Configurar",
                "configuredDescription": "Puede usar los códigos TOTP de su aplicación de autenticación configurada para la autenticación de dos factores. Si no tiene acceso a la aplicación, puede configurar una nueva aplicación de autenticación desde aquí.",
                "deleteHint": "Eliminar",
                "description": "Puede usar la aplicación de autenticación para obtener códigos de verificación para la autenticación de dos factores.",
                "enableHint": "Habilitar/deshabilitar el autenticador TOTP",
                "heading": "Aplicación Authenticator",
                "hint": "Vista",
                "modals": {
                    "delete": {
                        "heading": "Confirmación",
                        "message": "Esta acción eliminará el código QR agregado a su perfil. Desea continuar ?"
                    },
                    "done": "¡Éxito! Ahora puede usar su aplicación Authenticator para la autenticación de dos factores",
                    "heading": "Configurar una aplicación de autenticación",
                    "scan": {
                        "additionNote": "¡El código QR se ha agregado con éxito a su perfil!",
                        "authenticatorApps": "Aplicaciones de autenticación",
                        "generate": "Generar un nuevo código",
                        "heading": "Escanee el código QR a continuación usando una aplicación de autenticación",
                        "messageBody": "Puede encontrar una lista de aplicaciones de autenticación disponibles aquí.",
                        "messageHeading": "¿No tienes instalada una aplicación de autenticación?",
                        "regenerateConfirmLabel": "Confirmar la regeneración de un nuevo código QR",
                        "regenerateWarning": {
                            "extended": "Cuando regenera un nuevo código QR, debe escanearlo y volver a configurar su aplicación de autenticación. Ya no podrá iniciar sesión con el código QR anterior.",
                            "generic": "Cuando regenera un nuevo código QR, debe escanearlo y volver a configurar su aplicación de autenticación. Su configuración anterior ya no funcionará."
                        }
                    },
                    "toolTip": "¿No tienes una aplicación de autenticación? Descarga una aplicación de autenticación como Google Authenticator desde <1>App Store</1> o <3>>Google Play</3>",
                    "verify": {
                        "error": "Fallo en la verificación. Inténtalo de nuevo.",
                        "heading": "Ingrese el código generado para la verificación",
                        "label": "Código de verificación",
                        "placeholder": "Ingrese su código de verificación",
                        "reScan": "volver a escanear",
                        "reScanQuestion": "¿Quieres escanear el código QR de nuevo?",
                        "requiredError": "Introduzca el código de verificación"
                    }
                },
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al eliminar el código QR",
                            "message": "Algo salió mal"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Eliminado con éxito",
                        "message": "Se eliminó con éxito la configuración TOTP."
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al recuperar el código QR",
                            "message": "Algo salió mal"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Se produjo un error al intentar obtener un nuevo código QR",
                            "message": "Algo salió mal"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Se produjo un error al intentar actualizar la lista de autenticadores habilitados",
                            "message": "Algo salió mal"
                        }
                    }
                },
                "regenerate": "Regenerado"
            },
            "backupCode": {
                "actions": {
                    "add": "Agregar códigos de respaldo",
                    "delete": "Eliminar códigos de copia de seguridad"
                },
                "description": "Use códigos de respaldo para acceder a su cuenta en caso de que no pueda recibir códigos de autenticación de múltiples factores. Puede regenerar nuevos códigos si es necesario.",
                "download": {
                    "heading": "Códigos de respaldo para {{productName}}",
                    "info1": "Solo puede usar cada código de respaldo una vez.",
                    "info2": "Estos códigos fueron generados en",
                    "subHeading": "Puede usar estos códigos de respaldo para iniciar sesión en {{productName}} cuando no esté usando su teléfono. Guarde estos códigos de respaldo en un lugar seguro pero accesible."
                },
                "heading": "Códigos de respaldo",
                "messages": {
                    "disabledMessage": "Se debe configurar al menos un autenticador adicional para habilitar los códigos de respaldo."
                },
                "modals": {
                    "actions": {
                        "copied": "copiado",
                        "copy": "Copiar códigos",
                        "download": "Descargar Códigos",
                        "regenerate": "Regenerado"
                    },
                    "delete": {
                        "description": "Esta acción eliminará los códigos de respaldo y ya no podrá usarlos. " +
                            "¿Desea continuar?",
                        "heading": "Confirmación"
                    },
                    "description": "Use códigos de respaldo para iniciar sesión cuando esté lejos de su teléfono.",
                    "generate": {
                        "description": "Se utilizan todos sus códigos de respaldo. Permite generar un nuevo conjunto de códigos de respaldo",
                        "heading": "Generar"
                    },
                    "heading": "Códigos de respaldo",
                    "info": "Cada código solo se puede utilizar una vez. Puede generar nuevos códigos en cualquier momento para reemplazar estos.",
                    "regenerate": {
                        "description": "Después de generar códigos nuevos, los códigos antiguos ya no funcionarán. Asegúrese de guardar los nuevos códigos una vez que se generen.",
                        "heading": "Confirmación"
                    },
                    "subHeading": "Códigos de acceso de un solo uso que puede usar para iniciar sesión",
                    "warn": "Estos códigos aparecerán una sola vez. Asegúrese de guardarlos ahora y guárdelos en un lugar seguro pero accesible."
                },
                "mutedHeader": "Opciones de recuperación",
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al eliminar los códigos de respaldo",
                            "message": "Algo salió mal"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Eliminado exitosamente",
                        "message": "Códigos de copia de seguridad eliminados con éxito."
                    },
                    "downloadError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Se produjo un error al intentar descargar los códigos de copia de seguridad",
                            "message": "Algo salió mal"
                        }
                    },
                    "downloadSuccess": {
                        "genericMessage": {
                            "description": "Los códigos de respaldo se descargaron con éxito.",
                            "message": "Los códigos de copia de seguridad se descargaron correctamente."
                        },
                        "message": {
                            "description": "{{message}}",
                            "message": "Los códigos de copia de seguridad se descargaron correctamente."
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al intentar generar nuevos códigos de respaldo",
                            "message": "Algo salió mal"
                        }
                    },
                    "retrieveAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Se produjo un error al intentar obtener la lista de autenticadores habilitados",
                            "message": "Algo salió mal"
                        }
                    },
                    "retrieveError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al recuperar los códigos de respaldo",
                            "message": "Algo salió mal"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Algo salió mal"
                        },
                        "genericError": {
                            "description": "Se produjo un error al intentar actualizar la lista de autenticadores habilitados",
                            "message": "Algo salió mal"
                        }
                    }
                },
                "remaining": "Restante"
            },
            "fido": {
                "description": "Puede utilizar una <1>Clave de acceso</1>, una <1>Clave de seguridad FIDO</1> o una <1>Datos biométricos</1> en su dispositivo para iniciar sesión en su cuenta.",
                "form": {
                    "label": "Llave maestra",
                    "placeholder": "Introduzca un nombre para la clave de acceso",
                    "remove": "Quitar la clave de acceso",
                    "required": "Por favor ingrese un nombre para su clave de acceso"
                },
                "heading": "Llave maestra",
                "modals": {
                    "deleteConfirmation": {
                        "assertionHint": "Por favor, confirme su acción.",
                        "content": "Esta acción es irreversible y eliminará permanentemente la clave de acceso.",
                        "description": "Si elimina esta clave de acceso, es posible que no pueda volver a iniciar sesión en su cuenta. Proceda con precaución.",
                        "heading": "¿Está seguro?"
                    },
                    "deviceRegistrationErrorModal": {
                        "description": "Se interrumpió el registro de la clave de acceso. Si esto no fue intencional, puede volver a intentar el flujo.",
                        "heading": "Error al registrar la clave de acceso",
                        "tryWithOlderDevice": "También puedes volver a intentarlo con una clave anterior."
                    }
                },
                "notifications": {
                    "removeDevice": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Se produjo un error al eliminar la clave de acceso"
                        },
                        "genericError": {
                            "description": "Se produjo un error al eliminar la clave de acceso",
                            "message": "Algo salió mal"
                        },
                        "success": {
                            "description": "La clave de acceso se eliminó correctamente de la lista.",
                            "message": "Su clave de acceso se eliminó con éxito"
                        }
                    },
                    "startFidoFlow": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Se produjo un error al recuperar la clave de acceso"
                        },
                        "genericError": {
                            "description": "Se produjo un error al recuperar la clave de acceso",
                            "message": "Algo salió mal"
                        },
                        "success": {
                            "description": "La clave de acceso se registró correctamente y ahora puede utilizarla para la autenticación.",
                            "message": "Su clave de acceso se registró correctamente"
                        }
                    },
                    "updateDeviceName": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Se produjo un error al actualizar el nombre de la clave de acceso"
                        },
                        "genericError": {
                            "description": "Se produjo un error al actualizar el nombre de la clave de acceso",
                            "message": "Algo salió mal"
                        },
                        "success": {
                            "description": "El nombre de su clave de acceso se actualizó correctamente",
                            "message": "Nombre de clave de acceso actualizado correctamente"
                        }
                    }
                },
                "tryButton": "Pruebe con una clave anterior"
            },
            "smsOtp": {
                "descriptions": {
                    "hint": "Recibirás un mensaje de texto que contiene un código de verificación único"
                },
                "heading": "Número de teléfono móvil",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Ocurrió un error al actualizar el número de celular"
                        },
                        "genericError": {
                            "description": "Ocurrió un error al actualizar el número de celular",
                            "message": "Algo salió mal"
                        },
                        "success": {
                            "description": "El número de móvil en el perfil de usuario se actualiza correctamente",
                            "message": "Número de móvil actualizado con éxito"
                        }
                    }
                }
            }
        },
        "mobileUpdateWizard": {
            "done": "¡Éxito! Su número de móvil se verificó con éxito.",
            "notifications": {
                "resendError": {
                    "error": {
                        "description": "{{error}}",
                        "message": "Algo salió mal"
                    },
                    "genericError": {
                        "description": "Se produjo un error al intentar obtener un nuevo código de verificación",
                        "message": "Algo salió mal"
                    }
                },
                "resendSuccess": {
                    "message": "La solicitud de reenvío de código se envía con éxito"
                }
            },
            "submitMobile": {
                "heading": "Introduce tu nuevo número de móvil"
            },
            "verifySmsOtp": {
                "error": "Fallo en la verificación. Inténtalo de nuevo.",
                "generate": "Reenviar un nuevo código de verificación",
                "heading": "Introduce el código de verificación enviado a tu número de móvil",
                "label": "Código de verificación",
                "placeholder": "Ingrese su código de verificación",
                "requiredError": "Introduzca el código de verificación"
            }
        },
        "overview": {
            "widgets": {
                "accountActivity": {
                    "actionTitles": {
                        "update": "Administrar la actividad de la cuenta"
                    },
                    "description": "Estás conectado actualmente desde el siguiente dispositivo",
                    "header": "Sesiones activas"
                },
                "accountSecurity": {
                    "actionTitles": {
                        "update": "Actualizar la seguridad de la cuenta"
                    },
                    "description": "Configuraciones y recomendaciones para ayudarlo a mantener su cuenta segura",
                    "header": "Seguridad de la cuenta"
                },
                "accountStatus": {
                    "complete": "Tu perfil está completo",
                    "completedFields": "Campos completados",
                    "completionPercentage": "La finalización de su perfil está en {{percentage}}%",
                    "inComplete": "completa tu perfil",
                    "inCompleteFields": "campos incompletos",
                    "mandatoryFieldsCompletion": "{{completed}} de {{total}} campos obligatorios completados",
                    "optionalFieldsCompletion": "{{completed}} de {{total}} campos opcionales completados"
                },
                "consentManagement": {
                    "actionTitles": {
                        "manage": "Administrar consentimientos"
                    },
                    "description": "Controle los datos que desea compartir con las aplicaciones",
                    "header": "Consentimientos de control"
                },
                "profileStatus": {
                    "completionPercentage": "La finalización de su perfil está en {{percentage}}%",
                    "description": "Administra tu perfil",
                    "header": "Tu perfil de {{productName}}",
                    "profileText": "Detalles de tu perfil personal",
                    "readOnlyDescription": "ver tu perfil",
                    "userSourceText": "(Registrado a través de {{source}})"
                }
            }
        },
        "privacy": {
            "about": {
                "description": "WSO2 Identity Server (denominado &quot;WSO2 IS&quot; en esta política) es un servidor de derechos y gestión de identidades de código abierto que se basa en estándares y especificaciones abiertos.",
                "heading": "Acerca del servidor de identidad WSO2"
            },
            "privacyPolicy": {
                "collectionOfPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "WSO2 IS utiliza su dirección IP para detectar cualquier intento de inicio de sesión sospechoso en su cuenta.",
                            "1": "WSO2 IS utiliza atributos como su nombre, apellido, etc., para proporcionar una experiencia de usuario rica y personalizada.",
                            "2": "WSO2 IS usa sus preguntas y respuestas de seguridad solo para permitir la recuperación de la cuenta."
                        },
                        "para1": "WSO2 IS recopila su información solo para cumplir con sus requisitos de acceso. Por ejemplo:"
                    },
                    "heading": "Recopilación de información personal",
                    "trackingTechnologies": {
                        "description": {
                            "list1": {
                                "0": "Recopilación de información de la página de perfil de usuario donde ingresa sus datos personales.",
                                "1": "Seguimiento de su dirección IP con solicitud HTTP, encabezados HTTP y TCP/IP.",
                                "2": "Seguimiento de su información geográfica con la dirección IP.",
                                "3": "Seguimiento de su historial de inicio de sesión con cookies del navegador. Consulte nuestro {{cookiePolicyLink}} para obtener más información."
                            },
                            "para1": "WSO2 IS recopila su información de la siguiente manera:"
                        },
                        "heading": "Tecnologías de seguimiento"
                    }
                },
                "description": {
                    "para1": "Esta política describe cómo WSO2 IS captura su información personal, los propósitos de la recopilación y la información sobre la retención de su información personal.",
                    "para2": "Tenga en cuenta que esta política es solo de referencia y se aplica al software como producto. WSO2 LLC. y sus desarrolladores no tienen acceso a la información contenida en WSO2 IS. Consulte el <1>descargo de responsabilidad</1> sección para más información.",
                    "para3": "Las entidades, organizaciones o individuos que controlan el uso y la administración de WSO2 IS deben crear sus propias políticas de privacidad que establezcan la forma en que la entidad, organización o individuo respectivo controla o procesa los datos."
                },
                "disclaimer": {
                    "description": {
                        "list1": {
                            "0": "WSO2, sus empleados, socios y afiliados no tienen acceso ni requieren, almacenan, procesan ni controlan ninguno de los datos, incluidos los datos personales contenidos en WSO2 IS. Todos los datos, incluidos los datos personales, son controlados y procesados por la entidad o individuo que ejecuta WSO2 IS. WSO2, sus empleados, socios y afiliados no son un procesador de datos ni un controlador de datos en el sentido de las normas de privacidad de datos. WSO2 no ofrece ninguna garantía ni asume ninguna responsabilidad en relación con la legalidad o la manera y los propósitos para los cuales WSO2 IS es utilizado por dichas entidades o personas.",
                            "1": "Esta política de privacidad es para fines informativos de la entidad o las personas que ejecutan WSO2 IS y establece los procesos y la funcionalidad contenida en WSO2 IS con respecto a la protección de datos personales. Es responsabilidad de las entidades y personas que ejecutan WSO2 IS crear y administrar sus propias reglas y procesos que rigen los datos personales de los usuarios, y dichas reglas y procesos pueden cambiar las políticas de uso, almacenamiento y divulgación contenidas en este documento. Por lo tanto, los usuarios deben consultar la política de privacidad de la entidad o las personas que ejecutan WSO2 IS para conocer los detalles que rigen los datos personales de los usuarios."
                        }
                    },
                    "heading": "Descargo de responsabilidad"
                },
                "disclosureOfPersonalInfo": {
                    "description": "WSO2 IS solo divulga información personal a las aplicaciones relevantes (también conocidas como proveedores de servicios) que están registradas con WSO2 IS. Estas aplicaciones son registradas por el administrador de identidad de su entidad u organización. La información personal se divulga solo para los fines para los que se recopiló (o para un uso identificado como consistente con ese propósito), según lo controlado por dichos Proveedores de servicios, a menos que haya dado su consentimiento o cuando lo exija la ley.",
                    "heading": "Divulgación de información personal",
                    "legalProcess": {
                        "description": "Tenga en cuenta que la organización, entidad o individuo que ejecuta WSO2 IS puede verse obligado a divulgar su información personal con o sin su consentimiento cuando lo exija la ley siguiendo un proceso legal debido.",
                        "heading": "Proceso legal"
                    }
                },
                "heading": "Política de privacidad",
                "moreInfo": {
                    "changesToPolicy": {
                        "description": {
                            "para1": "Las versiones actualizadas de WSO2 IS pueden contener cambios en esta política y las revisiones de esta política se empaquetarán dentro de dichas actualizaciones. Dichos cambios solo se aplicarían a los usuarios que elijan usar versiones actualizadas.",
                            "para2": "La organización que ejecuta WSO2 IS puede revisar la Política de privacidad de vez en cuando. Puede encontrar la política de gobierno más reciente con el enlace respectivo proporcionado por la organización que ejecuta WSO2 IS. La organización comunicará cualquier cambio en la política de privacidad a través de nuestros canales públicos oficiales."
                        },
                        "heading": "Cambios a esta política"
                    },
                    "contactUs": {
                        "description": {
                            "para1": "Comuníquese con WSO2 si tiene alguna pregunta o inquietud con respecto a esta política de privacidad."
                        },
                        "heading": "Contáctenos"
                    },
                    "heading": "Más información",
                    "yourChoices": {
                        "description": {
                            "para1": "Si ya tiene una cuenta de usuario dentro de WSO2 IS, tiene derecho a desactivar su cuenta si considera que esta política de privacidad es inaceptable para usted.",
                            "para2": "Si no tiene una cuenta y no está de acuerdo con nuestra política de privacidad, puede optar por no crear una."
                        },
                        "heading": "Tus opciones"
                    }
                },
                "storageOfPersonalInfo": {
                    "heading": "Almacenamiento de información personal",
                    "howLong": {
                        "description": {
                            "list1": {
                                "0": "Contraseña actual",
                                "1": "Contraseñas utilizadas anteriormente"
                            },
                            "para1": "WSO2 IS retiene sus datos personales mientras sea un usuario activo de nuestro sistema. Puede actualizar sus datos personales en cualquier momento utilizando los portales de usuario de autocuidado proporcionados.",
                            "para2": "WSO2 IS puede mantener secretos hash para brindarle un nivel adicional de seguridad. Esto incluye:"
                        },
                        "heading": "Cuánto tiempo se conserva su información personal"
                    },
                    "requestRemoval": {
                        "description": {
                            "para1": "Puede solicitar al administrador que elimine su cuenta. El administrador es el administrador de la organización en la que está registrado o el superadministrador si no utiliza la función de organización.",
                            "para2": "Además, puede solicitar anonimizar todos los rastros de sus actividades que WSO2 IS pueda haber retenido en registros, bases de datos o almacenamiento analítico."
                        },
                        "heading": "Cómo solicitar la eliminación de su información personal"
                    },
                    "where": {
                        "description": {
                            "para1": "WSO2 IS almacena su información personal en bases de datos seguras. WSO2 IS ejerce las medidas de seguridad adecuadas aceptadas por la industria para proteger la base de datos donde se guarda su información personal. WSO2 IS como producto no transfiere ni comparte sus datos con terceros o ubicaciones.",
                            "para2": "WSO2 IS puede usar encriptación para mantener sus datos personales con un nivel adicional de seguridad."
                        },
                        "heading": "Dónde se almacena su información personal"
                    }
                },
                "useOfPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "Para brindarle una experiencia de usuario personalizada. WSO2 IS usa su nombre y fotos de perfil cargadas para este propósito.",
                            "1": "Para proteger su cuenta del acceso no autorizado o posibles intentos de piratería. WSO2 IS utiliza encabezados HTTP o TCP/IP para este fin.",
                            "2": "Obtener datos estadísticos con fines analíticos sobre mejoras en el rendimiento del sistema. WSO2 IS no conservará ninguna información personal después de los cálculos estadísticos. Por lo tanto, el informe estadístico no tiene ningún medio para identificar a una persona individual."
                        },
                        "para1": "WSO2 IS solo utilizará su información personal para los fines para los que fue recopilada (o para un uso identificado como consistente con ese propósito).",
                        "para2": "WSO2 IS utiliza su información personal únicamente para los siguientes fines.",
                        "subList1": {
                            "heading": "Esto incluye:",
                            "list": {
                                "0": "dirección IP",
                                "1": "Toma de huellas dactilares del navegador",
                                "2": "Galletas"
                            }
                        },
                        "subList2": {
                            "heading": "WSO2 IS puede usar:",
                            "list": {
                                "0": "Dirección IP para obtener información geográfica",
                                "1": "Toma de huellas dactilares del navegador para determinar la tecnología y/o la versión del navegador"
                            }
                        }
                    },
                    "heading": "Uso de información personal"
                },
                "whatIsPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "Su nombre de usuario (excepto en los casos en que el nombre de usuario creado por su empleador esté bajo contrato)",
                            "1": "Tu fecha de nacimiento/edad",
                            "2": "Dirección IP utilizada para iniciar sesión",
                            "3": "Su ID de dispositivo si usa un dispositivo (p. ej., teléfono o tableta) para iniciar sesión"
                        },
                        "list2": {
                            "0": "Ciudad/País desde el que originó la conexión TCP/IP",
                            "1": "Hora del día en que inició sesión (año, mes, semana, hora o minuto)",
                            "2": "Tipo de dispositivo que utilizó para iniciar sesión (p. ej., teléfono o tableta)",
                            "3": "Sistema operativo e información genérica del navegador"
                        },
                        "para1": "WSO2 IS considera cualquier cosa relacionada con usted, y por la cual puede ser identificado, como su información personal. Esto incluye, pero no se limita a:",
                        "para2": "Sin embargo, WSO2 IS también recopila la siguiente información que no se considera información personal, pero se usa solo para <1> estadísticas</1> propósitos La razón de esto es que esta información no se puede usar para rastrearlo."
                    },
                    "heading": "¿Qué es la información personal?"
                }
            }
        },
        "profile": {
            "fields": {
                "Account Confirmed Time": "Hora de confirmación de la cuenta",
                "Account Disabled": "Cuenta deshabilitada",
                "Account Locked": "Cuenta bloqueada",
                "Account State": "Estado de la cuenta",
                "Active": "Activo",
                "Address - Street": "Nombre de la calle",
                "Ask Password": "Preguntar contraseña",
                "Backup Code Enabled": "Código de respaldo habilitado",
                "Backup Codes": "Códigos de respaldo",
                "Birth Date": "Fecha de nacimiento",
                "Country": "País",
                "Created Time": "Tiempo creado",
                "Disable EmailOTP": "Deshabilitar correo electrónicoOTP",
                "Disable SMSOTP": "Deshabilitar SMSOTP",
                "Display Name": "Nombre para mostrar",
                "Email": "Correo electrónico",
                "Email Verified": "Correo Electrónico Verificado",
                "Enabled Authenticators": "Autenticadores habilitados",
                "Existing Lite User": "Usuario Lite existente",
                "External ID": "Identificación externa",
                "Failed Attempts Before Success": "Intentos fallidos antes del éxito",
                "Failed Backup Code Attempts": "Intentos fallidos de código de copia de seguridad",
                "Failed Email OTP Attempts": "Intentos OTP de correo electrónico fallidos",
                "Failed Lockout Count": "Número de bloqueos fallidos",
                "Failed Login Attempts": "Intentos de inicio de sesión fallidos",
                "Failed Password Recovery Attempts": "Intentos fallidos de recuperación de contraseña",
                "Failed SMS OTP Attempts": "Intentos OTP de SMS fallidos",
                "Failed TOTP Attempts": "Intentos fallidos de TOTP",
                "First Name": "Nombre propio",
                "Force Password Reset": "Forzar restablecimiento de contraseña",
                "Full Name": "Nombre completo",
                "Gender": "género",
                "Groups": "Grupos",
                "Identity Provider Type": "Tipo de proveedor de identidad",
                "Last Logon": "último inicio de sesión",
                "Last Modified Time": "Hora de última modificación",
                "Last Name": "Apellido",
                "Last Password Update": "Última actualización de contraseña",
                "Lite User": "Usuario básico",
                "Lite User ID": "ID de usuario ligero",
                "Local": "local",
                "Local Credential Exists": "Existe una credencial local",
                "Locality": "Localidad",
                "Location": "Localización",
                "Locked Reason": "Razón bloqueada",
                "Manager - Name": "Nombre del gerente",
                "Middle Name": "Segundo nombre",
                "Mobile": "Móvil",
                "Nick Name": "Apodo",
                "Phone Verified": "Teléfono verificado",
                "Photo - Thumbnail": "Foto - Miniatura",
                "Photo URL": "URL de la foto",
                "Postal Code": "Código Postal",
                "Preferred Channel": "Canal preferido",
                "Read Only User": "Usuario de solo lectura",
                "Region": "Región",
                "Resource Type": "Tipo de recurso",
                "Roles": "Roles",
                "Secret Key": "Llave secreta",
                "TOTP Enabled": "TOTP habilitado",
                "Time Zone": "Zona horaria",
                "URL": "URL",
                "Unlock Time": "Tiempo de desbloqueo",
                "User Account Type": "Tipo de cuenta de usuario",
                "User ID": "Identificador del usuario",
                "User Metadata - Version": "Metadatos de usuario - Versión",
                "User Source": "Fuente de usuario",
                "User Source ID": "ID de origen del usuario",
                "Username": "Nombre de usuario",
                "Verification Pending Email": "Correo electrónico pendiente de verificación",
                "Verification Pending Mobile Number": "Número de móvil pendiente de verificación",
                "Verify Email": "Verificar correo electrónico",
                "Verify Mobile": "Verificar móvil",
                "Verify Secret Key": "Verificar clave secreta",
                "Website URL": "URL del sitio web",
                "emails": "Correo electrónico",
                "generic": {
                    "default": "Agregar {{fieldName}}"
                },
                "nameFamilyName": "Apellido",
                "nameGivenName": "Nombre propio",
                "phoneNumbers": "Número de teléfono",
                "profileImage": "Imagen de perfil",
                "profileUrl": "URL",
                "userName": "Nombre de usuario"
            },
            "forms": {
                "countryChangeForm": {
                    "inputs": {
                        "country": {
                            "placeholder": "Selecciona tu pais"
                        }
                    }
                },
                "dateChangeForm": {
                    "inputs": {
                        "date": {
                            "validations": {
                                "futureDateError": "La fecha que ingresó para el campo {{field}} no es válida.",
                                "invalidFormat": "Ingrese un {{fieldName}} válido en el formato AAAA-MM-DD."
                            }
                        }
                    }
                },
                "emailChangeForm": {
                    "inputs": {
                        "email": {
                            "label": "Correo electrónico",
                            "note": "NOTA: Al editar esto, cambia la dirección de correo electrónico asociada con esta cuenta. Esta dirección de correo electrónico también se utiliza para la recuperación de la cuenta.",
                            "placeholder": "Ingrese su dirección de correo electrónico",
                            "validations": {
                                "empty": "la direccion de correo electronico es un campo requerido",
                                "invalidFormat": "Por favor, introduce una dirección de correo electrónico válida. Puede utilizar caracteres alfanuméricos, caracteres Unicode, guiones bajos (_), guiones (-), puntos (.) y un signo de arroba (@)."
                            }
                        }
                    }
                },
                "generic": {
                    "inputs": {
                        "placeholder": "Ingrese su {{fieldName}}",
                        "readonly": {
                            "placeholder": "Este valor está vacío",
                            "popup": "Póngase en contacto con el administrador para actualizar su {{fieldName}}"
                        },
                        "validations": {
                            "empty": "{{fieldName}} es un campo obligatorio",
                            "invalidFormat": "El formato del {{fieldName}} ingresado es incorrecto"
                        }
                    }
                },
                "mobileChangeForm": {
                    "inputs": {
                        "mobile": {
                            "label": "Número de teléfono móvil",
                            "note": "NOTA: Esto cambiará el número de móvil en tu perfil",
                            "placeholder": "Ingrese su numero celular",
                            "validations": {
                                "empty": "El número de móvil es un campo obligatorio",
                                "invalidFormat": "Introduzca un número de móvil válido con el formato [+][código de país][código de área][número de teléfono local]."
                            }
                        }
                    }
                },
                "nameChangeForm": {
                    "inputs": {
                        "firstName": {
                            "label": "Nombre propio",
                            "placeholder": "Ingrese el primer nombre",
                            "validations": {
                                "empty": "El nombre es un campo obligatorio"
                            }
                        },
                        "lastName": {
                            "label": "Apellido",
                            "placeholder": "Ingrese el apellido",
                            "validations": {
                                "empty": "El apellido es un campo obligatorio"
                            }
                        }
                    }
                },
                "organizationChangeForm": {
                    "inputs": {
                        "organization": {
                            "label": "Organización",
                            "placeholder": "Ingrese su organización",
                            "validations": {
                                "empty": "La organización es un campo obligatorio"
                            }
                        }
                    }
                }
            },
            "messages": {
                "emailConfirmation": {
                    "content": "Confirme la actualización de la dirección de correo electrónico para agregar el nuevo correo electrónico a su perfil.",
                    "header": "¡Confirmación pendiente!"
                },
                "mobileVerification": {
                    "content": "Este número de teléfono móvil se usa para enviar SMS OTP cuando la autenticación de segundo factor está habilitada y para enviar códigos de recuperación en caso de recuperación de nombre de usuario/contraseña. Para actualizar este número, debe verificar el nuevo número ingresando el código de verificación enviado a su nuevo número. Haga clic en actualizar si desea continuar."
                }
            },
            "notifications": {
                "getProfileCompletion": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Se produjo un error"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al evaluar la finalización del perfil",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "La finalización del perfil se evaluó con éxito",
                        "message": "Cálculo exitoso"
                    }
                },
                "getProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Ocurrió un error al recuperar los detalles del perfil"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al recuperar los detalles del perfil",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Los detalles de perfil de usuario requeridos se recuperan con éxito",
                        "message": "Perfil de usuario recuperado con éxito"
                    }
                },
                "getUserReadOnlyStatus": {
                    "genericError": {
                        "description": "Ocurrió un error al recuperar el estado de solo lectura del usuario",
                        "message": "Algo salió mal"
                    }
                },
                "updateProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Ocurrió un error al actualizar los detalles del perfil"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al actualizar los detalles del perfil",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Los detalles de perfil de usuario requeridos se actualizaron con éxito",
                        "message": "Perfil de usuario actualizado con éxito"
                    }
                }
            },
            "placeholders": {
                "SCIMDisabled": {
                    "heading": "Esta característica no está disponible para su cuenta"
                }
            }
        },
        "profileExport": {
            "notifications": {
                "downloadProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Ocurrió un error al descargar los detalles del perfil de usuario"
                    },
                    "genericError": {
                        "description": "Ocurrió un error al descargar los detalles del perfil de usuario",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "El archivo que contiene los detalles de perfil de usuario necesarios ha comenzado a descargarse",
                        "message": "Se inició la descarga de detalles del perfil de usuario"
                    }
                }
            }
        },
        "userAvatar": {
            "infoPopover": "Esta imagen ha sido recuperada de <1>Gravatar</1> servicio.",
            "urlUpdateHeader": "Introduce una URL de imagen para configurar tu foto de perfil"
        },
        "userSessions": {
            "browserAndOS": "{{browser}} en {{os}} {{version}}",
            "dangerZones": {
                "terminate": {
                    "actionTitle": "Terminar",
                    "header": "Terminar sesión",
                    "subheader": "Se cerrará la sesión en el dispositivo en particular."
                }
            },
            "lastAccessed": "Último acceso {{date}}",
            "modals": {
                "terminateActiveUserSessionModal": {
                    "heading": "Terminar sesiones activas actuales",
                    "message": "Los cambios en la opción de autenticación de segundo factor (2FA) no se aplicarán a sus sesiones activas. Le recomendamos que los termine.",
                    "primaryAction": "Terminar todo",
                    "secondaryAction": "Revisar y terminar"
                },
                "terminateAllUserSessionsModal": {
                    "heading": "Confirmación",
                    "message": "La acción lo desconectará de esta sesión y de todas las demás sesiones en todos los dispositivos. ¿Desea continuar?"
                },
                "terminateUserSessionModal": {
                    "heading": "Confirmación",
                    "message": "Esta acción lo desconectará de la sesión en el dispositivo en particular. ¿Desea continuar?"
                }
            },
            "notifications": {
                "fetchSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Error al recuperar la sesión activa"
                    },
                    "genericError": {
                        "description": "No se pudo recuperar ninguna sesión activa",
                        "message": "Algo salió mal"
                    },
                    "success": {
                        "description": "Recuperado con éxito las sesiones activas",
                        "message": "Recuperación de sesión activa exitosa"
                    }
                },
                "terminateAllUserSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "No se pudieron terminar las sesiones activas"
                    },
                    "genericError": {
                        "description": "Algo salió mal al terminar las sesiones activas",
                        "message": "No se pudieron terminar las sesiones activas"
                    },
                    "success": {
                        "description": "Finalizó con éxito todas las sesiones activas",
                        "message": "Terminadas todas las sesiones activas"
                    }
                },
                "terminateUserSession": {
                    "error": {
                        "description": "{{description}}",
                        "message": "No se pudo terminar la sesión activa"
                    },
                    "genericError": {
                        "description": "Algo salió mal al terminar la sesión activa",
                        "message": "No se pudo terminar la sesión activa"
                    },
                    "success": {
                        "description": "Finalizó con éxito la sesión activa",
                        "message": "Sesión terminada con éxito"
                    }
                }
            }
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "Error al obtener la verificación en la preferencia de actualización"
                    },
                    genericError: {
                        description: "Se produjo un error al obtener la verificación de la preferencia de actualización",
                        message: "Algo salió mal"
                    },
                    success: {
                        description: "Se recuperó exitosamente la verificación en la preferencia de actualización.",
                        message: "verificación en la recuperación de preferencias de actualización exitosa"
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
                            "content": "Parece que el correo electrónico seleccionado no está registrado en Gravatar. Regístrese para obtener una cuenta de Gravatar visitando el sitio <1>web oficial de Gravatar</1> o use uno de los siguientes.",
                            "header": "¡No se ha encontrado ninguna imagen de Gravatar coincidente!"
                        }
                    },
                    "heading": "Gravatar basado en"
                },
                "hostedAvatar": {
                    "heading": "Imagen alojada",
                    "input": {
                        "errors": {
                            "http": {
                                "content": "La URL seleccionada apunta a una imagen no segura servida a través de HTTP. Proceda con precaución.",
                                "header": "¡Contenido inseguro!"
                            },
                            "invalid": {
                                "content": "Introduce una URL de imagen válida"
                            }
                        },
                        "hint": "Ingrese una URL de imagen válida que esté alojada en una ubicación de terceros.",
                        "placeholder": "Introduzca la URL de la imagen.",
                        "warnings": {
                            "dataURL": {
                                "content": "El uso de direcciones URL de datos con un gran número de caracteres puede provocar problemas en la base de datos. Proceda con precaución.",
                                "header": "¡Verifique dos veces la URL de datos ingresada!"
                            }
                        }
                    }
                },
                "systemGenAvatars": {
                    "heading": "Avatar generado por el sistema",
                    "types": {
                        "initials": "Iniciales"
                    }
                }
            },
            "description": null,
            "heading": "Actualizar foto de perfil",
            "primaryButton": "Salvar",
            "secondaryButton": "Cancelar"
        },
        "sessionTimeoutModal": {
            "description": "Al hacer clic en <1>Volver</1> , intentaremos recuperar la sesión si existe. Si no tiene una sesión activa, será redirigido a la página de inicio de sesión.",
            "heading": "Parece que has estado inactivo durante mucho tiempo.",
            "loginAgainButton": "Ingresar de nuevo",
            "primaryButton": "Regresa",
            "secondaryButton": "Cerrar sesión",
            "sessionTimedOutDescription": "Vuelva a iniciar sesión para continuar desde donde lo dejó.",
            "sessionTimedOutHeading": "La sesión del usuario ha expirado debido a la inactividad."
        }
    },
    "pages": {
        "applications": {
            "subTitle": "Descubre y accede a tus aplicaciones",
            "title": "Aplicaciones"
        },
        "overview": {
            "subTitle": "Administre su información personal, la seguridad de la cuenta y la configuración de privacidad",
            "title": "Bienvenido, {{firstName}}"
        },
        "personalInfo": {
            "subTitle": "Edite o exporte su perfil personal y administre cuentas vinculadas",
            "title": "Información personal"
        },
        "personalInfoWithoutExportProfile": {
            "subTitle": "Ver y administrar su información personal",
            "title": "Información personal"
        },
        "personalInfoWithoutLinkedAccounts": {
            "subTitle": "Edita o exporta tu perfil personal",
            "title": "Información personal"
        },
        "privacy": {
            "subTitle": "",
            "title": "Política de privacidad del servidor de identidad de WSO2"
        },
        "readOnlyProfileBanner": "Su perfil no puede ser modificado desde este portal. Póngase en contacto con su administrador para obtener más detalles.",
        "security": {
            "subTitle": "Asegure su cuenta administrando consentimientos, sesiones y configuraciones de seguridad",
            "title": "Seguridad"
        }
    },
    "placeholders": {
        "404": {
            "action": "De vuelta a casa",
            "subtitles": {
                "0": "No pudimos encontrar la página que está buscando.",
                "1": "Verifique la URL o haga clic en el botón a continuación para ser redirigido a la página de inicio."
            },
            "title": "Página no encontrada"
        },
        "accessDeniedError": {
            "action": "De vuelta a casa",
            "subtitles": {
                "0": "Parece que no tienes permiso para acceder a esta página.",
                "1": "Intente iniciar sesión con una cuenta diferente."
            },
            "title": "Acceso no concedido"
        },
        "emptySearchResult": {
            "action": "Borrar consulta de búsqueda",
            "subtitles": {
                "0": "No pudimos encontrar ningún resultado para \"{{query}}\"",
                "1": "Intente con otro término de búsqueda."
            },
            "title": "No se han encontrado resultados"
        },
        "genericError": {
            "action": "Recarga la página",
            "subtitles": {
                "0": "Algo salió mal al mostrar esta página.",
                "1": "Consulte la consola del navegador para obtener detalles técnicos."
            },
            "title": "Algo salió mal"
        },
        "loginError": {
            "action": "Continuar cerrar sesión",
            "subtitles": {
                "0": "Parece que no tienes permiso para usar este portal.",
                "1": "Por favor, inicia sesión con una cuenta diferente."
            },
            "title": "Usted no está autorizado"
        },
        "sessionStorageDisabled": {
            "subtitles": {
                "0": "Para usar esta aplicación, debe habilitar las cookies en la configuración de su navegador web.",
                "1": "Para obtener más información sobre cómo habilitar las cookies, consulte la sección de ayuda de su navegador web."
            },
            "title": "Las cookies están deshabilitadas en su navegador."
        }
    },
    "sections": {
        "accountRecovery": {
            "description": "Administre la información de recuperación que podemos usar para ayudarlo a recuperar su contraseña",
            "emptyPlaceholderText": "No hay opciones de recuperación de cuenta disponibles",
            "heading": "Recuperación de Cuenta"
        },
        "changePassword": {
            "actionTitles": {
                "change": "cambia tu contraseña"
            },
            "description": "Actualice su contraseña regularmente y asegúrese de que sea única de otras contraseñas que use.",
            "heading": "Cambiar la contraseña"
        },
        "consentManagement": {
            "actionTitles": {
                "empty": "No ha dado su consentimiento a ninguna aplicación."
            },
            "description": "Revise los consentimientos que ha proporcionado para cada aplicación. Además, puede revocar uno o varios de ellos según sea necesario.",
            "heading": "Administrar consentimientos",
            "placeholders": {
                "emptyConsentList": {
                    "heading": "No ha dado su consentimiento a ninguna aplicación."
                }
            }
        },
        "createPassword": {
            "actionTitles": {
                "create": "Crear contraseña"
            },
            "description": "Cree una contraseña en {{productName}}. Puede usar esta contraseña para iniciar sesión en {{productName}} además del inicio de sesión social.",
            "heading": "Crear contraseña"
        },
        "federatedAssociations": {
            "description": "Ver sus cuentas desde otras conexiones que están vinculadas con esta cuenta",
            "heading": "Cuentas sociales vinculadas"
        },
        "linkedAccounts": {
            "actionTitles": {
                "add": "Añadir cuenta"
            },
            "description": "Vincule/asocie sus otras cuentas y acceda a ellas sin problemas sin volver a iniciar sesión",
            "heading": "Cuentas Vinculadas"
        },
        "mfa": {
            "description": "Configure autenticaciones adicionales para iniciar sesión fácilmente o para agregar una capa adicional de seguridad a su cuenta.",
            "heading": "Autenticación adicional"
        },
        "profile": {
            "description": "Administra tu perfil personal",
            "heading": "Perfil"
        },
        "profileExport": {
            "actionTitles": {
                "export": "Descarga el perfil"
            },
            "description": "Descargue todos los datos de su perfil, incluidos los datos personales y las cuentas vinculadas.",
            "heading": "Perfil de exportación"
        },
        "userSessions": {
            "actionTitles": {
                "empty": "Sin sesiones activas",
                "terminateAll": "Terminar todas las sesiones"
            },
            "description": "Revisa todas las sesiones de usuario activas de tu cuenta",
            "heading": "Sesiones activas",
            "placeholders": {
                "emptySessionList": {
                    "heading": "No hay sesiones activas para este usuario"
                }
            }
        }
    }
};
