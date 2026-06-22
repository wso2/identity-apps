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
import { insightsNS } from "../../../models";

export const insights: insightsNS = {
    activityType: {
        login: {
            filters: {
                authenticator: {
                    attributeName: "Connection Type",
                    values: {
                        apple: "Apple",
                        backupCodes: "Backup Code",
                        basic: "Username & Password",
                        emailOtp: "Email OTP",
                        facebook: "Facebook",
                        fido2: "FIDO2",
                        github: "GitHub",
                        google: "Google",
                        hypr: "HYPR",
                        identifierFirst: "Identifier First",
                        iproov: "IPROOV",
                        magicLink: "Magic Link",
                        oidc: "OIDC IdP",
                        organizationLogin: "Organization Login",
                        saml: "SAML IdP",
                        smsOtp: "SMS OTP",
                        totp: "TOTP"
                    }
                },
                identityProvider: "Connection ID",
                serviceProvider: "Application",
                userStore: "User Store"
            }
        },
        m2m: {
            filters: {
                clientId: "Client ID",
                tenantDomain: "Organization",
                tenantDomainPlaceholder: "Search organization"
            }
        },
        registration: {
            filters: {
                onboardingMethod: {
                    attributeName: "Onboarding Method",
                    values: {
                        adminInitiated: "By administrator",
                        selfSignUp: "Self-registration",
                        userInvited: "Email invitation"
                    }
                }
            }
        }
    },
    advancedAnalytics: {
        card: {
            description: "Get a clearer picture of how your users sign in, sign up, and use tokens, " +
                "with live dashboards that update as activity happens.",
            enableButton: "Enable Advanced Analytics",
            title: "Switch to Advanced Analytics"
        },
        dialog: {
            agreement: "I have read and understood the above, and I agree to enable advanced analytics " +
                "for my organization.",
            dataRetentionPoint: "Your existing analytics data will <1>not</1> carry over. Your new " +
                "analytics history begins the moment you switch.",
            enableButton: "Enable",
            intro: "Before you switch, please review the following carefully.",
            irreversiblePoint: "This switch is <1>permanent</1>. Once advanced analytics is enabled, " +
                "you cannot return to the previous analytics model.",
            privacyPoint: "Advanced analytics is powered by <1>Moesif</1>, a WSO2-owned company. To generate " +
                "these insights, some of your end users' personally identifiable information (PII), such as " +
                "user identifiers and IP addresses, may be shared with Moesif. Review the <3>Terms of " +
                "Service</3> and <5>Moesif Terms of Service</5> for details.",
            title: "Switch to Advanced Analytics",
            warning: "Enabling advanced analytics is permanent and applies to all users in your organization."
        },
        notifications: {
            enableError: {
                description: "Failed to enable advanced analytics. Please try again.",
                message: "Operation Failed"
            },
            enableSuccess: {
                description: "Advanced analytics has been enabled for your organization.",
                message: "Advanced Analytics Enabled"
            }
        }
    },
    advancedFilter: {
        filterAttribute: "Filter attribute",
        filterCondition: "Filter condition",
        filterValue: "Filter value"
    },
    commonFilters: {
        userId: "User ID"
    },
    compareToLastPeriodMessage: "Compare to last period",
    description: "Understand user behavior better with usage statistics.",
    durationMessage: "Showing results from <1>{{ startTimestamp }}</1> to <1>{{ endTimestamp }}</1>",
    durationOption: "Last {{ duration }} days",
    graphs: {
        activeUsers: {
            title: "Active Users",
            titleHint: "Number of unique users that signed in to your organization within the selected period"
        },
        failedLogins: {
            title: "Failed Logins"
        },
        m2mAuthentications: {
            title: "M2M Authentications",
            titleHint: "Number of M2M token requests made to your organization within the selected period"
        },
        signups: {
            title: "User Signups",
            titleHint: "Total user signups occurred within the selected period"
        },
        successLogins: {
            title: "Total Logins",
            titleHint: "Number of successful logins to your organization within the selected period"
        }
    },
    lastFetchedMessage: {
        label: "Last fetched at {{ time }}",
        tooltipText: "Insights for the latest activity will take few minutes to be reflected in the graphs"
    },
    notifications: {
        fetchInsights: {
            genericError: {
                description: "An error occurred while fetching insights for the selected duration.",
                message: "Something went wrong"
            }
        }
    },
    pageTitle: "Insights",
    title: "Insights"
};
