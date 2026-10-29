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

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, {
    AutocompleteInputChangeReason,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { CircleInfoIcon } from "@oxygen-ui/react-icons";
import { SYSTEM_RESERVED_ROLES } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useSharedOrganizationRoles from "../../../../hooks/use-shared-organization-roles";

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
    const { roles, sharedRoles, hasRoleReadPermission, isLoading, isLoaded, error } = useSharedOrganizationRoles();
    const [ inputValue, setInputValue ] = useState<string>("");

    const selectedRoles: RolesV2Interface[] = useMemo((): RolesV2Interface[] =>
        selectedRoleIds.map((roleId: string): RolesV2Interface =>
            roles.find((role: RolesV2Interface) => role.id === roleId) ?? {
                audience: { display: "", type: "", value: "" },
                displayName: roleId,
                id: roleId,
                meta: { location: "" }
            }), [ roles, selectedRoleIds ]);

    const options: RolesV2Interface[] = useMemo((): RolesV2Interface[] => [
        ...sharedRoles,
        ...selectedRoles.filter((selected: RolesV2Interface) =>
            !sharedRoles.some((role: RolesV2Interface) => role.id === selected.id))
    ], [ sharedRoles, selectedRoles ]);
    const unavailableRoles: RolesV2Interface[] = isLoaded ? selectedRoles.filter((selected: RolesV2Interface) =>
        !sharedRoles.some((role: RolesV2Interface) => role.id === selected.id)) : [];

    const getRoleLabel: (_role: RolesV2Interface) => string = (role: RolesV2Interface): string =>
        role.audience?.display ? `${role.displayName} · ${role.audience.display}` : role.displayName;

    return (
        <Stack gap={ 1 } data-componentid={ componentId }>
            <FormLabel htmlFor={ `${componentId}-select` } sx={ { color: "text.primary" } }>
                { t("flows:registrationFlow.steps.end.organizationRoles.label") }
            </FormLabel>
            <Autocomplete
                id={ `${componentId}-select` }
                multiple
                fullWidth
                disableCloseOnSelect
                size="small"
                slotProps={ {
                    popper: {
                        placement: "top-start"
                    }
                } }
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
                        <Chip { ...getTagProps({ index }) } key={ role.id } label={ getRoleLabel(role) } size="small"
                            color={ unavailableRoles.some((unavailable: RolesV2Interface) => unavailable.id === role.id)
                                ? "warning" : "default" } />
                    )) }
                renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
                    <TextField { ...params }
                        placeholder={ t("flows:registrationFlow.steps.end.organizationRoles.placeholder") }
                        InputProps={ {
                            ...params.InputProps,
                            startAdornment: (
                                <>
                                    <Chip
                                        icon={ <LockOutlinedIcon /> }
                                        label={ t("flows:registrationFlow.steps.end.organizationRoles.defaultRole", {
                                            role: SYSTEM_RESERVED_ROLES.SELF_SIGNUP
                                        }) }
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={ { m: 0.5 } }
                                        data-componentid={ `${componentId}-default-role` }
                                    />
                                    { params.InputProps.startAdornment }
                                </>
                            )
                        } }
                        error={ !!error }
                        data-componentid={ `${componentId}-input` }
                    />
                ) }
                data-componentid={ `${componentId}-select` }
            />
            <Stack direction="row" gap={ 1 } alignItems="flex-start">
                <Typography color="info.main"><CircleInfoIcon /></Typography>
                <FormHelperText>{ t("flows:registrationFlow.steps.end.organizationRoles.hint") }</FormHelperText>
            </Stack>
            { unavailableRoles.length > 0 && (
                <Alert severity="warning">
                    { t("flows:registrationFlow.steps.end.organizationRoles.unavailable", {
                        roles: unavailableRoles.map(getRoleLabel).join(", ")
                    }) }
                </Alert>
            ) }
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
