/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { GovernanceConnectorsInterface } from "../models";
import { SetGovernanceConnectorCategory } from "../store/actions";

/**
 * Utility class for governance connectors.
 */
export class GovernanceConnectorUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
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
}
