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
    pageTitle: "Insights",
    title: "Insights",
    description: "Understand user behavior better with usage statistics.",
    durationMessage: "Showing results from <1>{{ startTimestamp }}</1> to <1>{{ endTimestamp }}</1>",
    durationOption: "Last {{ duration }} days",
    lastFetchedMessage: {
        label: "Last fetched at {{ time }}",
        tooltipText: "Insights for the latest activity will take few minues to be reflected in the graphs"
    },
    advancedFilter: {
        filterAttribute: "Filter attribute",
        filterCondition: "Filter condition",
        filterValue: "Filter value"
    },
    commonFilters: {
        userId: "User ID"
    },
    activityType: {
        login: {
            filters: {
                userStore: "User Store",
                serviceProvider: "Application",
                authenticator: {
                    attributeName: "Connection Type",
                    values: {
                        basic: "Username & Password",
                        identifierFirst: "Identifier First",
                        fido2: "FIDO2",
                        magicLink: "Magic Link",
                        emailOtp: "Email OTP",
                        smsOtp: "SMS OTP",
                        totp: "TOTP",
                        backupCodes: "Backup Code",
                        google: "Google",
                        facebook: "Facebook",
                        github: "GitHub",
                        apple: "Apple",
                        oidc: "OIDC IdP",
                        saml: "SAML IdP",
                        hypr: "HYPR",
                        iproov: "IPROOV",
                        organizationLogin: "Organization Login"
                    }
                },
                identityProvider: "Connection ID"
            }
        },
        registration: {
            filters: {
                onboardingMethod: {
                    attributeName: "Onboarding Method",
                    values: {
                        adminInitiated: "By administrator",
                        userInvited: "Email invitation",
                        selfSignUp: "Self-registration"
                    }
                }
            }
        }
    },
    graphs: {
        activeUsers: {
            title: "Active Users",
            titleHint: "Number of unique users that signed in to your organization within the selected period"
        },
        successLogins: {
            title: "Total Logins",
            titleHint: "Number of successful logins to your organization within the selected period"
        },
        failedLogins: {
            title: "Failed Logins"
        },
        signups: {
            title: "User Signups",
            titleHint: "Total user signups occurred within the selected period"
        }
    },
    notifications: {
        fetchInsights: {
            genericError: {
                description: "An error occurred while fetching insights for the selected duration.",
                message: "Something went wrong"
            }
        }
    },
    compareToLastPeriodMessage: "Compare to last period"
};
