/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { webhooksNS } from "../../../models";

export const webhooks: webhooksNS = {
    advancedSearch: {
        filterAttribute: {
            placeholder: "E.g. Name, Endpoint"
        },
        filterAttributeOptions: {
            endpoint: { label: "Endpoint" },
            name: { label: "Name" }
        },
        filterCondition: {
            placeholder: "E.g. Contains, Starts with etc."
        },
        filterValue: {
            placeholder: "Enter value to search"
        },
        placeholder: "Search webhooks by name, or endpoint"
    },
    common: {
        status: {
            active: "Active",
            inactive: "Inactive"
        }
    },
    configForm: {
        buttons: {
            cancel: "Cancel",
            changeSecret: "Change Secret",
            create: "Create",
            update: "Update"
        },
        channels: {
            heading: "Select Events",
            status: {
                subscriptionAccepted: "subscription request sent",
                subscriptionError: "suscription request error",
                unsubscriptionAccepted: "unsubscription request sent",
                unsubscriptionError: "unsubscription request error"
            },
            subHeading: "Select the events you want to receive webhook notifications for.",
            validations: {
                empty: "At least one event must be selected."
            }
        },
        fields: {
            endpoint: {
                hint: "The URL of the external endpoint that integrates as a webhook.",
                label: "Endpoint",
                placeholder: "https://myservice.com/webhook",
                validations: {
                    empty: "Endpoint is a required field.",
                    invalid: "Please enter a valid URL.",
                    notHttps: "The URL is not secure (HTTP). Use HTTPS for a secure connection."
                }
            },
            name: {
                hint: "Must be a string containing only letters (a-z, A-Z), numbers (0-9), " +
                    "spaces, underscore (_) and hyphen (-).",
                label: "Name",
                placeholder: "Sample Webhook",
                validations: {
                    empty: "Name is a required field.",
                    invalid: "Please enter a valid name that adheres to the given guidelines."
                }
            },
            secret: {
                hint: {
                    common: "Must be a string containing only letters (a-z, A-Z), numbers (0-9), symbols, and spaces. ",
                    create: "This secret is used to generate an HMAC signature so your endpoint can verify that events are secure and unchanged. Once added, the secret will not be displayed. You will only be able to reset it.",
                    createWebSubHubMode: "This secret is used to generate an HMAC signature (X-Hub-Signature header) so your endpoint can verify that events are secure and unchanged. You cannot view or change the secret after creation.",
                    update: "This secret is used to generate an HMAC signature so your endpoint can verify that events are secure and unchanged. Once updated, the secret will not be displayed. You will only be able to reset it again."
                },
                info: {
                    message: "This secret is used to generate an HMAC signature so your endpoint can verify that events are secure and unchanged. If you are changing the secret, remember to update it in your external service endpoint to maintain connectivity.",
                    messageWebSubHubMode: "This secret is used to generate an HMAC signature (X-Hub-Signature header) so your endpoint can verify that events are secure and unchanged. You cannot view or change the secret after creation.",
                    title: "A <strong>secret</strong> is configured for this webhook."
                },
                label: "Secret",
                placeholder: "Secret",
                validations: {
                    empty: "Secret is a required field.",
                    invalid: "Please enter a valid secret that adheres to the given guidelines."
                }
            }
        }
    },
    confirmations: {
        delete: {
            assertionHint: "Please confirm your action.",
            content: "If you delete this webhook configuration, the service endpoint defined will no longer receive event notifications." +
                " Please proceed with caution.",
            heading: "Are you sure?",
            message: "This action is irreversible and will permanently delete the configured webhook."
        }
    },
    dangerZone: {
        delete: {
            actionTitle: "Delete",
            heading: "Delete webhook",
            subHeading: "Once the webhook is deleted, it cannot be recovered and the service endpoint defined will no longer receive event notifications."
        },
        heading: "Danger Zone"
    },
    goBackToWebhooks: "Go back to Webhooks",
    heading: "Add Webhook",
    notifications: {
        createWebhook: {
            error: {
                description: "{{description}}",
                message: "Failed to create webhook."
            },
            success: {
                description: "The webhook has been successfully created.",
                message: "Webhook created"
            }
        },
        deleteWebhook: {
            error: {
                description: "{{description}}",
                message: "Failed to delete webhook."
            },
            success: {
                description: "The webhook has been successfully deleted.",
                message: "Webhook deleted"
            }
        },
        fetchEventProfile: {
            error: {
                description: "{{description}}",
                genericDescription: "Something went wrong while fetching the event profile.",
                message: "Failed to fetch event profile."
            }
        },
        fetchWebhook: {
            error: {
                description: "{{description}}",
                genericDescription: "Something went wrong while fetching the webhook.",
                message: "Failed to fetch webhook."
            }
        },
        fetchWebhooks: {
            error: {
                description: "{{description}}",
                genericDescription: "Something went wrong while fetching the webhooks.",
                message: "Failed to fetch webhooks."
            }
        },
        retryWebhookState: {
            error: {
                description: "{{description}}",
                message: "Failed to resend requests"
            },
            success: {
                description: "Resent {{requestType}} requests.",
                message: "Resent requests."
            }
        },
        updateWebhook: {
            error: {
                description: "{{description}}",
                message: "Failed to update webhook."
            },
            success: {
                description: "The webhook has been successfully updated.",
                message: "Webhook updated"
            }
        },
        updateWebhookStatus: {
            error: {
                description: "{{description}}",
                message: "Failed to change webhook status."
            },
            success: {
                description: "The webhook status has been successfully changed to {{status}}.",
                message: "Webhook status changed"
            }
        }
    },
    pages: {
        create: {
            heading: "Add Webhook",
            subHeading: "Configure a new webhook to receive event notifications."
        },
        edit: {
            heading: "Update Webhook",
            headingWebSubHubMode: "Manage Webhook",
            subHeading: "Update webhook configurations.",
            subHeadingWebSubHubMode: "Activate, deactivate or delete webhook."
        },
        list: {
            buttons: {
                add: "Add Webhook",
                settings: "Webhook Settings"
            },
            columns: {
                status: "Status",
                webhook: "Webhook"
            },
            emptyList: {
                subHeading: "There are no webhooks available at the moment."
            },
            heading: "Webhooks",
            subHeading: "Create and manage webhooks to notify external services when certain events happen."
        },
        settings: {
            backButton: "Go back to Webhooks",
            heading: "Webhook Settings",
            organizationPolicy: {
                heading: "Select organizations whose events will be sent to webhooks.",
                radioOptions: {
                    currentOrgAndImmediateChild: "Publish events from this organization and its immediate child organization.",
                    currentOrgOnly: "Publish events from this organization only."
                }
            },
            subHeading: "Settings related to webhook configurations."
        }
    },
    sidePanel: {
        name: "Webhooks"
    },
    statusBanner: {
        buttons: {
            retry: "Resend requests"
        },
        pendingActivation: {
            message: "Make sure your endpoint received and responded to the challenge. You can resend requests to attempt subscriptions again. Events will only be delivered for successfully verified channels.",
            title: "Subscription requests sent."
        },
        pendingDeactivation: {
            message: "Make sure your endpoint received and responded to the challenge. You can resend requests to attempt unsubscriptions again. Events may still be delivered to channels that are not yet unsubscribed.",
            title: "Unsubscription requests sent."
        }
    },
    subHeading: "Register a webhook for events of your interest."
};
