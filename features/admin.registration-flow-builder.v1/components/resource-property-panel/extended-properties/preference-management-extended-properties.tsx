/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ConsentExtendedProperties from "./consent-extended-properties";

/**
 * Props interface of {@link PreferenceManagementExtendedProperties}
 */
type PreferenceManagementExtendedPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the preference management element.
 * Handles permission checks and attribute preservation for preference purposes.
 *
 * @param props - Props injected to the component.
 * @returns The PreferenceManagementExtendedProperties component.
 */
const PreferenceManagementExtendedProperties: FunctionComponent<PreferenceManagementExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "preference-management-extended-properties",
    resource,
    onChange
}: PreferenceManagementExtendedPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );

    const hasConsentsReadPermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.read);

    if (!hasConsentsReadPermission) {
        return (
            <Stack data-componentid={ componentId }>
                <Typography variant="caption" color="text.secondary">
                    { t("consents:registrationFlow.noPreference") }
                </Typography>
            </Stack>
        );
    }

    return (
        <ConsentExtendedProperties
            data-componentid={ componentId }
            resource={ resource }
            onChange={ onChange }
            filter="type eq Preference"
            emptyMessageKey="consents:registrationFlow.noPreference"
            selectLabelKey="consents:registrationFlow.selectPreference"
            preserveAttributes={ true }
        />
    );
};

export default PreferenceManagementExtendedProperties;
