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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { PurposeInterface } from "@wso2is/admin.flow-builder-core.v1/models/purpose";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ConsentListItemInterface, useGetPurposes } from "@wso2is/common.consents.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement, SyntheticEvent, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Props interface for generic consent extended properties
 */
interface ConsentExtendedPropertiesInterface extends CommonResourcePropertiesPropsInterface,
    IdentifiableComponentInterface {
    filter: string;
    emptyMessageKey: string;
    selectLabelKey: string;
    onPurposesChange?: (updated: PurposeInterface[]) => void;
    preserveAttributes?: boolean;
}

/**
 * Generic consent extended properties component.
 * Handles common logic for both preference and policy consents.
 *
 * @param props - Props injected to the component.
 * @returns The ConsentExtendedProperties component.
 */
const ConsentExtendedProperties: FunctionComponent<ConsentExtendedPropertiesInterface> = ({
    "data-componentid": componentId = "consent-extended-properties",
    resource,
    onChange,
    filter,
    emptyMessageKey,
    selectLabelKey,
    onPurposesChange,
    preserveAttributes = false
}: ConsentExtendedPropertiesInterface): ReactElement => {
    const { t } = useTranslation();

    const currentTenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);

    const purposes: PurposeInterface[] = useMemo(
        (): PurposeInterface[] => resource.config?.purposes ?? [],
        [ resource.config?.purposes ]
    );

    const { mappedData: availableConsents, isLoading: isConsentsLoading } = useGetPurposes(
        { filter, limit: 50 }
    );

    const selectedConsentOptions: ConsentListItemInterface[] = useMemo(
        (): ConsentListItemInterface[] => {
            if (!availableConsents) return [];

            return purposes
                .map((p: PurposeInterface) =>
                    availableConsents.find((c: ConsentListItemInterface): boolean => c.id === p.purposeId)
                )
                .filter(Boolean) as ConsentListItemInterface[];
        },
        [ purposes, availableConsents ]
    );

    const handleSelectConsent = (_: SyntheticEvent, selected: ConsentListItemInterface[]): void => {
        let updated: PurposeInterface[];

        if (preserveAttributes) {
            const existingById: Map<string, PurposeInterface> = new Map(
                purposes.map((p: PurposeInterface): [ string, PurposeInterface ] => [ p.purposeId, p ])
            );

            updated = selected.map((c: ConsentListItemInterface): PurposeInterface => ({
                attributes: existingById.get(c.id)?.attributes ?? [],
                purposeId: c.id
            }));
        } else {
            updated = selected.map((c: ConsentListItemInterface): PurposeInterface => ({
                attributes: [],
                purposeId: c.id
            }));
        }

        if (onPurposesChange) {
            onPurposesChange(updated);
        } else {
            onChange("config.purposes", updated, resource);
        }
    };

    if (isConsentsLoading) {
        return (
            <Stack data-componentid={ componentId } spacing={ 1.5 }>
                <Typography variant="caption" color="text.secondary">
                    { t(emptyMessageKey) }
                </Typography>
            </Stack>
        );
    }

    if ((availableConsents ?? []).length === 0) {
        return (
            <Stack data-componentid={ componentId }>
                <Typography variant="caption" color="text.secondary">
                    { t(emptyMessageKey) }
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack data-componentid={ componentId } spacing={ 1.5 }>
            <Autocomplete
                multiple
                options={ availableConsents ?? [] }
                value={ selectedConsentOptions }
                getOptionLabel={ (option: ConsentListItemInterface): string => option.name }
                isOptionEqualToValue={ (
                    option: ConsentListItemInterface,
                    value: ConsentListItemInterface
                ): boolean => option.id === value.id }
                onChange={ handleSelectConsent }
                disabled={ isConsentsLoading }
                renderTags={ (
                    value: ConsentListItemInterface[],
                    getTagProps: AutocompleteRenderGetTagProps
                ): ReactElement => (
                    <Box display="flex" flexWrap="wrap" gap={ 0.5 }>
                        { value.map((option: ConsentListItemInterface, index: number): ReactElement => {
                            const isShared: boolean =
                                !!option.tenantDomain && option.tenantDomain !== currentTenantDomain;

                            return (
                                <Chip
                                    key={ option.id }
                                    { ...getTagProps({ index }) }
                                    size="small"
                                    label={
                                        isShared
                                            ? `${option.name} (${t(
                                                "consents:policyConsents.list.labels.sharedPolicy"
                                            )})`
                                            : option.name
                                    }
                                />
                            );
                        }) }
                    </Box>
                ) }
                renderOption={ (
                    optionProps: HTMLAttributes<HTMLLIElement>,
                    option: ConsentListItemInterface,
                    _state: AutocompleteRenderOptionState
                ): ReactElement => {
                    const isShared: boolean =
                        !!option.tenantDomain && option.tenantDomain !== currentTenantDomain;

                    return (
                        <li { ...optionProps } key={ option.id }>
                            <Stack direction="row" alignItems="center" spacing={ 1 }>
                                <span>{ option.name }</span>
                                { isShared && (
                                    <Chip
                                        label={ t("consents:policyConsents.list.labels.sharedPolicy") }
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                ) }
                            </Stack>
                        </li>
                    );
                } }
                renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
                    <TextField
                        { ...params }
                        label={ t(selectLabelKey) }
                        placeholder={ selectedConsentOptions.length === 0
                            ? t(selectLabelKey) : "" }
                    />
                ) }
                data-componentid={ `${componentId}-multiselect` }
            />
        </Stack>
    );
};

export default ConsentExtendedProperties;
