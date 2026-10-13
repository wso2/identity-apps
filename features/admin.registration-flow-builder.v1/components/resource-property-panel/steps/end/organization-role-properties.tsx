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

import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, {
    AutocompleteInputChangeReason,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface OrganizationRolePropertiesPropsInterface extends IdentifiableComponentInterface {
    selectedRoleIds: string[];
    onChange: (_roleIds: string[]) => void;
}

const OrganizationRoleProperties: FunctionComponent<OrganizationRolePropertiesPropsInterface> = ({
    selectedRoleIds,
    onChange,
    ["data-componentid"]: componentId = "organization-role-properties"
}: OrganizationRolePropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const rolesFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config?.ui?.features?.userRolesV3?.enabled
            ? state.config.ui.features.userRolesV3
            : state.config?.ui?.features?.userRoles);
    const hasRoleReadPermission: boolean = useRequiredScopes(rolesFeatureConfig?.scopes?.read);
    const [ startIndex, setStartIndex ] = useState<number>(1);
    const [ roles, setRoles ] = useState<RolesV2Interface[]>([]);
    const [ inputValue, setInputValue ] = useState<string>("");
    const { data, error, isLoading } = useGetRolesList<RolesV2ResponseInterface>(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        startIndex,
        undefined,
        "users,groups,permissions,associatedApplications",
        hasRoleReadPermission
    );

    useEffect((): void => {
        if (!data?.Resources?.length) {
            return;
        }

        setRoles((previousRoles: RolesV2Interface[]): RolesV2Interface[] => {
            const rolesById: Map<string, RolesV2Interface> = new Map(
                previousRoles.map((role: RolesV2Interface) => [ role.id, role ])
            );

            data.Resources.forEach((role: RolesV2Interface): void => {
                rolesById.set(role.id, role);
            });

            return [ ...rolesById.values() ];
        });

        const nextIndex: number = (data.startIndex ?? 1) + data.Resources.length;

        if (nextIndex <= data.totalResults) {
            setStartIndex(nextIndex);
        }
    }, [ data ]);

    const selectedRoles: RolesV2Interface[] = useMemo((): RolesV2Interface[] =>
        selectedRoleIds.map((roleId: string): RolesV2Interface =>
            roles.find((role: RolesV2Interface) => role.id === roleId) ?? {
                audience: { display: "", type: "", value: "" },
                displayName: roleId,
                id: roleId,
                meta: { location: "" }
            }), [ roles, selectedRoleIds ]);

    const options: RolesV2Interface[] = useMemo((): RolesV2Interface[] => [
        ...roles,
        ...selectedRoles.filter((selected: RolesV2Interface) =>
            !roles.some((role: RolesV2Interface) => role.id === selected.id))
    ], [ roles, selectedRoles ]);

    const getRoleLabel: (_role: RolesV2Interface) => string = (role: RolesV2Interface): string =>
        role.audience?.display ? `${role.displayName} (${role.audience.display})` : role.displayName;

    return (
        <Stack gap={ 1 } data-componentid={ componentId }>
            <Autocomplete
                multiple
                fullWidth
                disableCloseOnSelect
                disablePortal
                size="small"
                options={ options }
                value={ selectedRoles }
                inputValue={ inputValue }
                onInputChange={ (_event: SyntheticEvent, value: string,
                    reason: AutocompleteInputChangeReason): void => {
                    if (reason === "input" || reason === "clear") {
                        setInputValue(value);
                    }
                } }
                loading={ isLoading }
                disabled={ !hasRoleReadPermission }
                getOptionLabel={ getRoleLabel }
                isOptionEqualToValue={ (option: RolesV2Interface, value: RolesV2Interface): boolean =>
                    option.id === value.id }
                onChange={ (_event: SyntheticEvent, value: RolesV2Interface[]): void => {
                    setInputValue("");
                    onChange(value.map((role: RolesV2Interface) => role.id));
                } }
                noOptionsText={ t("common:noResultsFound") }
                renderOption={ (props: React.HTMLAttributes<HTMLLIElement>, role: RolesV2Interface,
                    { selected }: { selected: boolean }): ReactElement => (
                    <li { ...props } key={ role.id }>
                        <Checkbox checked={ selected } tabIndex={ -1 } disableRipple
                            inputProps={ { "aria-hidden": true } } />
                        <Stack>
                            <Typography variant="body2">{ role.displayName }</Typography>
                            <Typography variant="caption" color="text.secondary">
                                { role.audience?.display }
                            </Typography>
                        </Stack>
                    </li>
                ) }
                renderTags={ (value: RolesV2Interface[], getTagProps: AutocompleteRenderGetTagProps): ReactElement[] =>
                    value.map((role: RolesV2Interface, index: number): ReactElement => (
                        <Chip { ...getTagProps({ index }) } key={ role.id } label={ getRoleLabel(role) } size="small" />
                    )) }
                renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
                    <TextField { ...params }
                        label={ t("flows:registrationFlow.steps.end.organizationRoles.label") }
                        placeholder={ t("flows:registrationFlow.steps.end.organizationRoles.placeholder") }
                        error={ !!error }
                        data-componentid={ `${componentId}-input` }
                    />
                ) }
                data-componentid={ `${componentId}-select` }
            />
            <FormHelperText>{ t("flows:registrationFlow.steps.end.organizationRoles.hint") }</FormHelperText>
            { !hasRoleReadPermission && (
                <Alert severity="warning">
                    { t("flows:registrationFlow.steps.end.organizationRoles.noPermission") }
                </Alert>
            ) }
            { error && (
                <Alert severity="warning">
                    { t("flows:registrationFlow.steps.end.organizationRoles.fetchError") }
                </Alert>
            ) }
        </Stack>
    );
};

export default OrganizationRoleProperties;
