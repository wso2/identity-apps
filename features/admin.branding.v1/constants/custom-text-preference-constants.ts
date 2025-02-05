/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";

/**
 * Class containing Branding Text Preferences constants.
 */
export class CustomTextPreferenceConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() {}

    public static readonly DEFAULT_LOCALE: string = "en-US";
    public static readonly CUSTOM_TEXT_PREFERENCE_NOT_CONFIGURED_ERROR_CODE: string = "BPM-60006";
    public static readonly CUSTOM_TEXT_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BTPM-60001";
    public static readonly CUSTOM_TEXT_PREFERENCE_FETCH_ERROR_CODE: string = "ASG-CON-BTPM-60002";
    public static readonly CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BTPM-60005";
    public static readonly CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR_CODE: string = "ASG-CON-BTPM-60006";
    public static readonly CUSTOM_TEXT_PREFERENCE_DELETE_ERROR_CODE: string = "ASG-CON-BTPM-60008";
    public static readonly CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR_CODE: string = "ASG-CON-BTPM-60007";

    /**
     * Branding Related Error Messages.
     */
    public static ErrorMessages: {
        CUSTOM_TEXT_PREFERENCE_DELETE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_FETCH_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR: IdentityAppsError;
        CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR: IdentityAppsError;
} = {
            CUSTOM_TEXT_PREFERENCE_DELETE_ERROR: new IdentityAppsError(
                CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_DELETE_ERROR_CODE,
                "An error occurred while deleting the Text Customizations for the requested resource.",
                "Error while deleting Text Customizations",
                null
            ),
            CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
                CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while deleting the Text Customizations for the requested resource.",
                "Invalid Error Code while deleting Text Customizations",
                null
            ),
            CUSTOM_TEXT_PREFERENCE_FETCH_ERROR: new IdentityAppsError(
                CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_FETCH_ERROR_CODE,
                "An error occurred while fetching the Text Customizations for the requested resource.",
                "Error while fetching Text Customizations",
                null
            ),
            CUSTOM_TEXT_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
                CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while fetching the Text Customizations for the requested resource.",
                "Invalid Error Code while fetching Text Customizations",
                null
            ),
            CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR: new IdentityAppsError(
                CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR_CODE,
                "An error occurred while updating the Text Customizations for the requested resource.",
                "Error while updating Text Customizations",
                null
            ),
            CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR: new IdentityAppsError(
                CustomTextPreferenceConstants.CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR_CODE,
                "Received an invalid status code while updating the Text Customizations for the requested resource.",
                "Invalid Error Code while updating Text Customizations",
                null
            )
        };

    /**
     * Text customization form element constraints.
     */
    public static readonly FORM_FIELD_CONSTRAINTS: {
            MAX_LENGTH: number;
            MIN_LENGTH: number;
        } = {
            MAX_LENGTH: 1024,
            MIN_LENGTH: 0
        };

    public static readonly FORM_ID: string = "branding-preference-custom-text-form";

    public static readonly TEXT_BUNDLE_KEYS: {
        COPYRIGHT: string;
        EMAIL_LINK_EXPIRY: {
            MESSAGE: string;
        };
        EMAIL_OTP: {
            HEADING: string;
        }
        LOGIN: {
            BUTTON: string;
            HEADING: string;
            IDENTIFIER: {
                INPUT: {
                    LABEL: string;
                }
            }
        };
        USERNAME_RECOVERY_CLAIM: {
            HEADING: string;
            BODY: string;
            IDENTIFIER: {
                INPUT: {
                    LABEL: string;
                    PLACEHOLDER: string;
                }
            },
            BUTTON: {
                NEXT: string;
                CANCEL: string;
            }
        };
        USERNAME_RECOVERY_CHANNEL_SELECTION: {
            HEADING: string;
            BODY: string;
            RADIO_BUTTON: {
                EMAIL: string;
                SMS: string;
            },
            BUTTON: {
                NEXT: string;
                CANCEL: string;
            }
        };
        USERNAME_RECOVERY_SUCCESS_EMAIL : {
            HEADING: string;
            BODY: string;
            BUTTON: string;
        };
        USERNAME_RECOVERY_SUCCESS_SMS : {
            HEADING: string;
            BODY: string;
            BUTTON: string;
        };
        PASSWORD_RECOVERY: {
            HEADING: string;
            BODY: string;
            IDENTIFIER: {
                INPUT: {
                    LABEL: string;
                    PLACEHOLDER: string;
                }
            };
            RADIO_BUTTON: {
                SMS_OTP: string,
                EMAIL_LINK: string
            }
            BUTTON: {
                SMS_OTP: string,
                EMAIL_LINK: string,
                MULTI: string
            };
        },
        PASSWORD_RESET: {
            HEADING: string;
            BUTTON: string;
        },
        PASSWORD_RESET_SUCCESS: {
            HEADING: string;
            ACTION: string;
            BODY: string;
        },
        PRIVACY_POLICY: string;
        PUSH_AUTH: {
            HEADING: string;
            BODY: string;
        },
        REGISTER_TEXT: {
            MESSAGE: string;
            REGISTER: string;
        },
        SIGN_UP: {
            BUTTON: string;
            HEADING: string;
        },
        SMS_OTP: {
            HEADING: string;
        },
        TERMS_OF_SERVICE: string;
        TOTP: {
            HEADING: string;
        }
    } = {
            COPYRIGHT: "copyright",
            EMAIL_LINK_EXPIRY: {
                MESSAGE: "email.link.expiry.message"
            },
            EMAIL_OTP: {
                HEADING: "email.otp.heading"
            },
            LOGIN: {
                BUTTON: "login.button",
                HEADING: "login.heading",
                IDENTIFIER: {
                    INPUT: {
                        LABEL: "login.identifier.input.label"
                    }
                }
            },
            PASSWORD_RECOVERY: {
                BODY: "password.recovery.body",
                BUTTON: {
                    EMAIL_LINK: "password.recovery.button.email.link",
                    MULTI: "password.recovery.button.multi",
                    SMS_OTP: "password.recovery.button.smsotp"
                },
                HEADING: "password.recovery.heading",
                IDENTIFIER: {
                    INPUT: {
                        LABEL: "Username",
                        PLACEHOLDER: "password.recovery.identifier.input.placeholder"
                    }
                },
                RADIO_BUTTON: {
                    EMAIL_LINK: "send.email.link",
                    SMS_OTP: "send.code.via.sms"
                }
            },
            PASSWORD_RESET: {
                BUTTON: "password.reset.button",
                HEADING: "password.reset.heading"
            },
            PASSWORD_RESET_SUCCESS: {
                ACTION: "password.reset.success.action",
                BODY: "password.reset.success.body",
                HEADING: "password.reset.success.heading"
            },
            PRIVACY_POLICY: "privacy.policy",
            PUSH_AUTH: {
                BODY: "push.notification.sent.msg",
                HEADING: "push.auth.heading"
            },
            REGISTER_TEXT: {
                MESSAGE: "dont.have.an.account",
                REGISTER: "register"
            },
            SIGN_UP: {
                BUTTON: "sign.up.button",
                HEADING: "sign.up.heading"
            },
            SMS_OTP: {
                HEADING: "sms.otp.heading"
            },
            TERMS_OF_SERVICE: "terms.of.service",
            TOTP: {
                HEADING: "totp.heading"
            },
            USERNAME_RECOVERY_CHANNEL_SELECTION: {
                BODY: "username.recovery.channel.selection.body",
                BUTTON: {
                    CANCEL: "username.recovery.channel.selection.cancel.button",
                    NEXT: "username.recovery.channel.selection.next.button"
                },
                HEADING: "username.recovery.channel.selection.heading",
                RADIO_BUTTON: {
                    EMAIL: "send.username.via.email",
                    SMS: "send.username.via.sms"
                }
            },
            USERNAME_RECOVERY_CLAIM: {
                BODY: "username.recovery.body",
                BUTTON: {
                    CANCEL: "username.recovery.cancel.button",
                    NEXT: "username.recovery.next.button"
                },
                HEADING: "username.recovery.heading",
                IDENTIFIER: {
                    INPUT: {
                        LABEL: "contact",
                        PLACEHOLDER: "contact"
                    }
                }
            },
            USERNAME_RECOVERY_SUCCESS_EMAIL: {
                BODY: "username.recovery.email.success.body",
                BUTTON: "username.recovery.success.action",
                HEADING: "username.recovery.email.success.heading"
            },
            USERNAME_RECOVERY_SUCCESS_SMS: {
                BODY: "username.recovery.sms.success.body",
                BUTTON: "username.recovery.success.action",
                HEADING: "username.recovery.sms.success.heading"
            }
        };
}
