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
import { BrandingNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const branding: BrandingNS = {
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: "Once you confirm, your users will start to see the {{productName}} defaults and it will not be reversible. Please proceed with caution.",
            heading: "Are you sure?",
            message: "Reverting <1>{{screen}}</1> screen's customized text for the <3>{{locale}}</3> locale."
        },
        revertUnsavedConfirmationModal: {
            content: "If you switch the screen, your unsaved changes will be lost. Click <1>Confirm</1> to proceed.",
            heading: "Are you sure?",
            message: "Save your unsaved changes"
        },
        form: {
            genericFieldResetTooltip: "Reset to default",
            genericFieldPlaceholder: "Enter your text",
            fields: {
                copyright: {
                    hint: "Text that appears at the footer of the login screens. You can use `{{currentYear}}` placeholder to automatically display the current year."
                },
                "privacy.policy": {
                    hint: "The privacy policy text that appears at the footer of the login screens. If not set, {{productName}} defaults are used."
                },
                "site.title": {
                    hint: "The site title may appear in browser tabs, search engine results, social shares, etc. If not set, {{productName}} defaults are used."
                },
                "terms.of.service": {
                    hint: "The terms of service text that appears at the footer of the login screens. If not set, {{productName}} defaults are used."
                },
                "login.button": {
                    hint: "The text that appears on the main action button of the login box. If not set, {{productName}} defaults are used."
                },
                "login.heading": {
                    hint: "The heading of the login box. If not set, {{productName}} defaults are used."
                },
                "sms.otp.heading": {
                    hint: "The heading of the SMS OTP box. If not set, {{productName}} defaults are used."
                },
                "email.otp.heading": {
                    hint: "The heading of the Email OTP box. If not set, {{productName}} defaults are used."
                },
                "totp.heading": {
                    hint: "The heading of the TOTP box. If not set, {{productName}} defaults are used."
                },
                "sign.up.button": {
                    hint: "The text that appears on the main action button of the sign up box. If not set, {{productName}} defaults are used."
                },
                "sign.up.heading": {
                    hint: "The heading of the sign up box. If not set, {{productName}} defaults are used."
                },
                "password.recovery.body": {
                    hint: "The body text of the password recovery box. If not set, {{productName}} defaults are used."
                },
                "password.recovery.button": {
                    hint: "The text that appears on the main action button of the password recovery box. If not set, {{productName}} defaults are used."
                },
                "password.recovery.heading": {
                    hint: "The heading of the password recovery box. If not set, {{productName}} defaults are used."
                },
                "password.reset.button": {
                    hint: "The text that appears on the main action button of the password reset box. If not set, {{productName}} defaults are used."
                },
                "password.reset.heading": {
                    hint: "The heading of the password reset box. If not set, {{productName}} defaults are used."
                },
                "password.reset.success.action": {
                    hint: "The text that appears on the main action link of the password reset success box. If not set, {{productName}} defaults are used."
                },
                "password.reset.success.body": {
                    hint: "The body text of the password reset success box. If not set, {{productName}} defaults are used."
                },
                "password.reset.success.heading": {
                    hint: "The heading of the password reset success box. If not set, {{productName}} defaults are used."
                }
            }
        },
        localeSelectDropdown: {
            label: "Locale",
            placeholder: "Select locale"
        },
        modes: {
            text: {
                label: "Text Fields"
            },
            json: {
                label: "JSON"
            }
        },
        notifications: {
            getPreferenceError: {
                description: "Couldn't get {{screen}} screen's customized text for {{locale}}.",
                message: "Couldn't get the custom text"
            },
            revertError: {
                description: "Couldn't revert {{screen}} screen's customized text for {{locale}}.",
                message: "Couldn't revert the custom text"
            },
            resetSuccess: {
                description: "Successfully reverted {{screen}} screen's customized text for {{locale}}.",
                message: "Revert successful"
            },
            updateError: {
                description: "Couldn't update {{screen}} screen's customized text for {{locale}}.",
                message: "Couldn't update the custom text"
            },
            updateSuccess: {
                description: "Successfully updated {{screen}} screen's customized text for {{locale}}.",
                message: "Update Successful"
            }
        },
        screenSelectDropdown: {
            label: "Screen",
            placeholder: "Select screen"
        }
    },
    form: {
        actions: {
            resetAll: "Reset to Default",
            save: "Save & Publish"
        }
    },
    screens: {
        common: "Common",
        "email-otp": "Email OTP",
        "email-template": "Email Templates",
        login: "Login",
        myaccount: "My Account",
        "password-recovery": "Password Recovery",
        "password-reset": "Password Reset",
        "password-reset-success": "Password Reset Link Sent",
        "sign-up": "Sign Up",
        "sms-otp": "SMS OTP",
        "totp": "TOTP"
    },
    ai: {
        banner: {
            full: {
                heading: "Transform your branding with ease, try our new Branding AI",
                subHeading: "Provide your website URL, and our AI will seamlessly create a branding theme that is both beautiful and brand-consistent.",
                button: "Try Branding AI"
            },
            input: {
                heading: "Generate branding with a single click using Branding AI",
                subHeading: "AI-powered branding recommendations that are crafted for a unified visual approach.",
                placeholder: "Enter website URL",
                button: "Generate Branding"
            },
            collapsed: {
                heading: "Generate branding using, Branding AI",
                subHeading: "AI-powered branding recommendations that are crafted for a unified visual approach.",
                button: "Try Branding AI"
            }
        },
        screens: {
            loading: {
                heading: "Generating your branding",
                facts: {
                    0: "Asgardeo's advanced theming capabilities let you modify the site title, copyright information, and support email displayed on your login pages, aligning every detail with your brand identity.",
                    1: "You can personalize your login portal even further with Asgardeo by updating links to your privacy policy, terms of service, and cookie policy, making your compliance visible and accessible.",
                    2: "With Asgardeo's branding features, you can update your organization's logo directly in the login and registration pages, ensuring a consistent brand experience for your customers across all application touchpoints."
                },
                states: {
                    0: "Initializing...",
                    1: "Rendering Webpage...",
                    2: "Extracting Content...",
                    3: "Content Extracted.",
                    4: "Generating Branding...",
                    5: "Creating Color Palette...",
                    6: "Defining Style Properties...",
                    7: "Creating Branding Theme...",
                    8: "Branding Generation Completed!"
                }
            }
        }
    },
    tabs: {
        preview: {
            label: "Preview"
        },
        text: {
            label: "Text"
        }
    }
};
