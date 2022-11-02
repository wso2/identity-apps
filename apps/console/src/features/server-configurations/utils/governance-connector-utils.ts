/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { store } from "../../core";
import { getConnectorCategories } from "../api";
import { 
    GovernanceCategoryForOrgsInterface, 
    GovernanceConnectorForOrgsInterface, 
    GovernanceConnectorInterface, 
    GovernanceConnectorsInterface 
} from "../models";
import { SetGovernanceConnectorCategory } from "../store/actions";

/**
 * Utility class for governance connectors.
 */
export class GovernanceConnectorUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Clears the session related information and sign out from the session.
     */
    public static getGovernanceConnectors(): void {
        const connectorCategories: GovernanceConnectorsInterface = {
            categories: []
        };

        getConnectorCategories()
            .then((response) => {
                response.map(category => {
                    connectorCategories.categories.push({
                        id: category.id,
                        name: category.name
                    });
                });
                store.dispatch(SetGovernanceConnectorCategory(connectorCategories));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    store.dispatch(addAlert({
                        description: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                            "getConnectorCategories.error.description", 
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                            "getConfigurations.error.message")
                    }));
                } else {
                    // Generic error message
                    store.dispatch(addAlert({
                        description: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                            "getConfigurations.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                            "getConfigurations.genericError.message")
                    }));
                }
            });
    }

    public static encodeConnectorPropertyName(name: string): string {
        return name.split(".").join("-");
    }

    public static decodeConnectorPropertyName(name: string): string {
        return name.split("-").join(".");
    }

    /**
     * Governance connectors and their sub categories that will be visible in a sub organization
     */
    public static readonly SHOW_GOVERNANCE_CONNECTORS_FOR_SUBORGS: GovernanceCategoryForOrgsInterface[] = [
        {
            connectors: [
                {
                    friendlyName: "Account Recovery",
                    id: "YWNjb3VudC1yZWNvdmVyeQ",
                    name: "account-recovery",
                    properties: [
                        "Recovery.Notification.Password.Enable" // Notification based password recovery
                    ]
                }
            ],
            id: "QWNjb3VudCBNYW5hZ2VtZW50",
            name: "Account Management"
        },
        {
            connectors: [
                {
                    friendlyName: "Ask Password",
                    id: "dXNlci1lbWFpbC12ZXJpZmljYXRpb24",
                    name: "user-email-verification",
                    properties: [
                        "EmailVerification.Enable", // Enable user email verification
                        "EmailVerification.LockOnCreation", // Enable account lock on creation
                        "EmailVerification.Notification.InternallyManage", // Manage notifications sending internally
                        "EmailVerification.ExpiryTime", // Email verification code expiry time
                        "EmailVerification.AskPassword.ExpiryTime", // Username recoveryAsk password code expiry time
                        "EmailVerification.AskPassword.PasswordGenerator", 
                        // Temporary password generation extension class
                        "_url_listPurposeJITProvisioning" // Manage JIT provisioning purposes
                    ]
                }
            ],
            id: "VXNlciBPbmJvYXJkaW5n",
            name: "User Onboarding"
        } 
    ]

    /**
     * Filter governance categories of a connector for a sub organization.
     * @param governanceConnectors - List of categories to evaluate.
     * @param governanceCategoryId - Category id of the governance connector.
     * 
     * @returns Filtered categories as a list.
     */
    public static filterGovernanceConnectorCategories
    (governanceCategoryId: string, governanceConnectors: GovernanceConnectorInterface[])
    : GovernanceConnectorInterface[] {
        let showGovernanceConnectors = [];

        showGovernanceConnectors  = this.SHOW_GOVERNANCE_CONNECTORS_FOR_SUBORGS.filter(
            category => category.id === governanceCategoryId)[0].connectors;

        const showGovernanceConnectorsIdOfSuborgs = [];

        showGovernanceConnectors.forEach(connector => {
            showGovernanceConnectorsIdOfSuborgs.push(connector.id);
        });

        return governanceConnectors.filter(connector => {
            if (showGovernanceConnectorsIdOfSuborgs.includes(connector.id)) {
                const showProperties = this.getGovernanceConnectorsProperties(showGovernanceConnectors,
                    connector.id);
                
                connector.properties = connector.properties.filter(property => {
                    if (showProperties.includes(property.name)) {
                        return property;
                    }
                });

                return connector;
            }
        });
    }

    /**
     * Get governance connector properties for a given connector.
     * @param showGovernanceConnectors - Category id of the governance connector.
     * @param governanceConnectorId - Connector id.
     * 
     * @returns governance connector properties as a list.
     */
    private static getGovernanceConnectorsProperties
    (showGovernanceConnectors: GovernanceConnectorForOrgsInterface[], governanceConnectorId: string) {

        return showGovernanceConnectors.filter(connector=>connector.id===governanceConnectorId)[0].properties;

    }
}
