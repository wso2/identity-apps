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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
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
import React, { FunctionComponent, ReactElement, SyntheticEvent, useMemo } from "react";
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

    const selectedPolicyOptions: ConsentListItemInterface[] = useMemo((): ConsentListItemInterface[] => {
        if (!allPolicies) return [];

        return selectedPolicies
            .map((p: PolicyConfigItemInterface) =>
                allPolicies.find((policy: ConsentListItemInterface) => policy.id === p.purposeId)
            )
            .filter(Boolean) as ConsentListItemInterface[];
    }, [ selectedPolicies, allPolicies ]);

    const handlePolicySelectionChange = (
        _event: SyntheticEvent,
        value: ConsentListItemInterface[]
    ): void => {
        onChange(
            "config.policies",
            value.map((policy: ConsentListItemInterface): PolicyConfigItemInterface => ({ purposeId: policy.id })),
            resource
        );
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
            <Autocomplete
                multiple
                options={ allPolicies }
                value={ selectedPolicyOptions }
                getOptionLabel={ (option: ConsentListItemInterface): string => option.name }
                isOptionEqualToValue={ (
                    option: ConsentListItemInterface,
                    value: ConsentListItemInterface
                ): boolean => option.id === value.id }
                onChange={ handlePolicySelectionChange }
                renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
                    <TextField
                        { ...params }
                        placeholder={ selectedPolicyOptions.length === 0
                            ? t("consents:registrationFlow.selectPolicies") : "" }
                    />
                ) }
                data-componentid={ `${componentId}-multiselect` }
            />
        </Stack>
    );
};

export default ConsentExtendedProperties;
