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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import useGlobalVariables from "../../admin.core.v1/hooks/use-global-variables";
import { AppState } from "../../admin.core.v1/store";
import { applicationConfig } from "../../admin.extensions.v1/configs/application";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";

/**
 * Custom hook to determine whether the application sharing feature is eligible.
 *
 * @returns A boolean value indicating eligibility.
 */
const useApplicationSharingEligibility = (): boolean => {
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const applicationFeatureAccessConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });
    const organizationEnabled: string = useSelector((state: AppState) => state.config?.ui?.legacyMode?.organizations);
    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isClientSecretHashEnabled);

    const { isOrganizationManagementEnabled } = useGlobalVariables();

    return (isOrganizationManagementEnabled
        && organizationEnabled
        && applicationConfig?.editApplication?.showApplicationShare
        && hasRequiredScopes(
            applicationFeatureAccessConfig, applicationFeatureAccessConfig?.scopes?.update, allowedScopes
        )
        && !isSubOrganization()
        && !isClientSecretHashEnabled);
};

export default useApplicationSharingEligibility;
