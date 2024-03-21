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
import { serverConfigsNS } from "../../../models";

export const serverConfigs: serverConfigsNS = {
    adminAdvisory: {
        configurationEditSection: {
            backButtonLabel: "Go back to Admin Advisory Banner",
            pageHeading: "Admin Advisory Banner",
            pageSubheading: "Configure and customize the admin advisory banner to be displayed on the login page.",
            form: {
                bannerContent: {
                    label: "Banner content",
                    hint: "This is the content that will be displayed in the banner on the login page.",
                    placeholder: "Warning - unauthorized use of this tool is strictly prohibited."
                }
            }
        },
        configurationSection: {
            disabled: "Disabled",
            description: "Enable and configure the admin advisory banner.",
            enabled: "Enabled",
            heading: "Admin Advisory Banner"
        },
        notifications: {
            disbleAdminAdvisoryBanner: {
                error: {
                    description: "{{ description }}",
                    message: "Error disabling admin advisory banner."
                },
                genericError: {
                    description: "An error occurred while disabling admin advisory banner.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully disabled the admin advisory banner.",
                    message: "Disabled the admin advisory banner"
                }
            },
            enableAdminAdvisoryBanner: {
                error: {
                    description: "{{ description }}",
                    message: "Error enabling admin advisory banner."
                },
                genericError: {
                    description: "An error occurred while enabling admin advisory banner.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully enabled the admin advisory banner.",
                    message: "Enabled the admin advisory banner"
                }
            },
            getConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Error retrieving admin advisory banner configurations."
                },
                genericError: {
                    description: "An error occurred while retrieving admin advisory banner configurations.",
                    message: "Something went wrong"
                },
                success: {
                    description: "",
                    message: ""
                }
            },
            updateConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Error updating admin advisory banner configurations."
                },
                genericError: {
                    description: "An error occurred while updating admin advisory banner configurations.",
                    message: "Something went wrong"
                },
                success: {
                    description: "Successfully updated the admin advisory banner configurations.",
                    message: "Banner updated successfully"
                }
            }
        },
        pageHeading: "Admin Advisory Banner",
        pageSubheading: "Configure the admin advisory banner to be displayed on the login page."
    },
    manageNotificationSendingInternally: {
        title: "Internal Notification Sending",
        description: "Manage notification sending internally."
    },
    remoteLogPublishing: {
        title: "Remote Log Publishing",
        pageTitle: "Remote Log Publishing",
        description: "Configure remote logging settings for audit logs in the organization.",
        fields: {
            logTypes: {
                label: "Log types to be published",
                values: {
                    carbonLogs: "Carbon logs",
                    auditLogs: "Audit logs",
                    allLogs: "All Logs"
                }
            },
            remoteURL: {
                label: "Destination URL"
            },
            advanced: {
                title: "Advanced Settings",
                connectionTimeout: {
                    label: "Connection timeout (ms)"
                },
                verifyHostname: {
                    label: "Verify the hostname"
                },
                basicAuthConfig: {
                    title: "Basic Authentication Configuration",
                    serverUsername: {
                        label: "Remote server username"
                    },
                    serverPassword: {
                        label: "Remote server password"
                    }
                },
                sslConfig: {
                    title: "SSL Configuration",
                    keystorePath: {
                        label: "Keystore location"
                    },
                    keystorePassword: {
                        label: "Keystore password"
                    },
                    truststorePath: {
                        label: "Truststore location"
                    },
                    truststorePassword: {
                        label: "Truststore password"
                    }
                }
            }
        },
        dangerZone: {
            button: "Restore",
            title: "Restore Default Configuration",
            header: "Restore Default Configuration",
            subheader: "This action will delete the existing configuration for {{logType}} logs. Please be certain before you proceed.",
            confirmation: {
                hint: "Please confirm your action.",
                header: "Are you sure?",
                message: "If you restore the default configuration, remote log publishing for {{logType}} logs may not work properly. " +
                "Please proceed with caution.",
                content: "This action will restore the default log publishing configuration for {{logType}} logs."
            }
        },
        notification: {
            success: {
                description: "Remote log publishing configuration updated successfully.",
                message: "Updated successfully."
            },
            error: {
                updateError: {
                    description: "An error occurred while updating remote log publishing configuration.",
                    message: "Something went wrong"
                },
                fetchError: {
                    description: "An error occurred while getting the remote log publishing configuration.",
                    message: "Couldn't get remote log publishing configuration."
                }
            }
        }
    },
    realmConfiguration: {
        actionTitles: {
            config: "More"
        },
        confirmation: {
            heading: "Confirmation",
            message: "Do you wish to save the configurations related to realm?"
        },
        description: "Configure the basic configurations related to realm.",
        form: {
            homeRealmIdentifiers: {
                hint: "Enter home realm identifier. Multiple identifiers are allowed.",
                label: "Home realm identifiers",
                placeholder: "localhost"
            },
            idleSessionTimeoutPeriod: {
                hint: "Enter the idle session timeout in minutes",
                label: "Idle Session Time Out"
            },
            rememberMePeriod: {
                hint: "Enter the remember me period in minutes",
                label: "Remember Me Period"
            }
        },
        heading: "Realm configurations",
        notifications: {
            emptyHomeRealmIdentifiers: {
                error: {
                    description: "You must declare at least one home realm identifier.",
                    message: "Data validation error"
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
                    message: "Retrieval Error"
                },
                genericError: {
                    description: "An error occurred while retrieving the realm configurations.",
                    message: "Something went wrong"
                },
                success: {
                    description: "",
                    message: ""
                }
            },
            updateConfigurations: {
                error: {
                    description: "{{ description }}",
                    message: "Update Error"
                },
                genericError: {
                    description: "An error occurred while updating the realm configurations.",
                    message: "Update Error"
                },
                success: {
                    description: "Successfully updated the realm configurations.",
                    message: "Update Successful"
                }
            }
        }
    },
    server: {
        title: "Server",
        description: "Configure server settings."
    }
};
