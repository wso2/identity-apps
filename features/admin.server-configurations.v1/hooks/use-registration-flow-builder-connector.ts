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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useGetRegistrationFlowBuilderEnabledStatus from "../api/use-get-self-registration-enabled-status";

/**
 * Custom hook to retrieve the registration flow builder connector details.
 * This is a dummy connector for the registration flow builder to be displayed in the login and registration page.
 *
 * @returns Registration flow builder connector properties.
 */
const useRegistrationFlowBuilderConnector = (): unknown => {

    const { t } = useTranslation();

    const {
        data: isRegistrationFlowBuilderEnabled
    } = useGetRegistrationFlowBuilderEnabledStatus();
    const registrationFlowBuilderFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.registrationFlowBuilder
    );
    const hasRegistrationFlowBuilderViewPermissions: boolean = useRequiredScopes(
        registrationFlowBuilderFeatureConfig?.scopes?.read
    );

    if (
        !isRegistrationFlowBuilderEnabled ||
        !registrationFlowBuilderFeatureConfig?.enabled ||
        !hasRegistrationFlowBuilderViewPermissions
    ) {
        return null;
    }

    return {
        connectors: [
            {
                description: t("governanceConnectors:connectorCategories.userOnboarding.connectors."
                    + "registrationFlowBuilder.description"),
                header: t("governanceConnectors:connectorCategories.userOnboarding.connectors."
                    + "registrationFlowBuilder.friendlyName"),
                id: "cmVnaXN0cmF0aW9uLWZsb3ctYnVpbGRlcg==",
                route: AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"),
                status: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP
                    .LOGIN_AND_REGISTRATION_SELF_REGISTRATION_FLOW_BUILDER,
                testId: "registration-flow-builder"
            }
        ],
        id: "user-onboarding"
    };
};

export default useRegistrationFlowBuilderConnector;
