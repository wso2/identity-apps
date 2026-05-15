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

import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { PolicyConfigItemInterface } from "@wso2is/admin.flow-builder-core.v1/models/policies";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    ConsentListItemInterface,
    useGetPurposes
} from "@wso2is/common.consents.v1";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Props interface of {@link ConsentExtendedProperties}
 */
type ConsentExtendedPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * Extended properties for the consent element.
 *
 * @param props - Props injected to the component.
 * @returns The ConsentExtendedProperties component.
 */
const ConsentExtendedProperties: FunctionComponent<ConsentExtendedPropertiesPropsInterface> = ({
    "data-componentid": componentId = "consent-extended-properties",
    resource,
    onChange
}: ConsentExtendedPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );

    const hasConsentsReadPermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.read);

    const { mappedData: allPolicies, isLoading: isPoliciesLoading } = useGetPurposes(
        hasConsentsReadPermission ? { filter: "type eq Policy", limit: 50 } : null
    );

    const selectedPolicies: PolicyConfigItemInterface[] = useMemo((): PolicyConfigItemInterface[] => {
        return resource.config?.policies ?? [];
    }, [ resource.config?.policies ]);

    const handlePolicyToggle = (policyId: string, isChecked: boolean): void => {
        let updatedPolicies: PolicyConfigItemInterface[];

        if (isChecked) {
            updatedPolicies = [ ...selectedPolicies, { purposeId: policyId } ];
        } else {
            updatedPolicies = selectedPolicies.filter(
                (p: PolicyConfigItemInterface) => p.purposeId !== policyId
            );
        }

        onChange("config.policies", updatedPolicies, resource);
    };

    const handlePolicyCheckboxChange = (policyId: string) =>
        (_event: ChangeEvent<HTMLInputElement>, isChecked: boolean): void => {
            handlePolicyToggle(policyId, isChecked);
        };

    if (isPoliciesLoading) {
        return (
            <Stack data-componentid={ componentId }>
                <CircularProgress size={ 24 } />
            </Stack>
        );
    }

    if (!allPolicies || allPolicies.length === 0) {
        return (
            <Stack data-componentid={ componentId }>
                <Typography variant="body2" color="textSecondary">
                    { t("consents:registrationFlow.noPolicies") }
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack data-componentid={ componentId } spacing={ 1 }>
            <Typography variant="subtitle2">{ t("consents:registrationFlow.selectPolicies") }</Typography>
            <Box sx={ { pl: 1 } }>
                {
                    allPolicies.map((policy: ConsentListItemInterface): ReactElement => (
                        <FormControlLabel
                            key={ policy.id }
                            control={ (
                                <Checkbox
                                    checked={ selectedPolicies.some(
                                        (p: PolicyConfigItemInterface) => p.purposeId === policy.id
                                    ) }
                                    onChange={ handlePolicyCheckboxChange(policy.id) }
                                    data-componentid={ `${componentId}-${policy.id}` }
                                />
                            ) }
                            label={ policy.name }
                        />
                    ))
                }
            </Box>
        </Stack>
    );
};

export default ConsentExtendedProperties;
