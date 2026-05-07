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

import { AutocompleteChangeDetails, AutocompleteChangeReason, Typography } from "@mui/material";
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileInfoInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Hint } from "@wso2is/react-components";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

/**
 * Props interface for the ConsoleRolesShareWithAll component.
 */
interface RolesShareWithAllPropsInterface extends IdentifiableComponentInterface {
    agent: ProfileInfoInterface;
    selectedRoles: RolesInterface[];
    setSelectedRoles: (_roles: RolesInterface[]) => void;
    onRoleChange: (_role: RolesV2Interface, _isSelected: boolean) => void;
    /**
     * Whether to include the Console Administrator role in the role list.
     * Should only be true in the console settings administrator edit view.
     */
    enableConsoleAdminRole?: boolean;
    readOnly?: boolean;
}

/**
 *
 * @param props - Props injected to the component.
 * @returns Console roles share with all component.
 */
const RolesShareWithAll: FunctionComponent<RolesShareWithAllPropsInterface> = (
    props: RolesShareWithAllPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "agent-roles-share-with-all",
        agent,
        selectedRoles,
        setSelectedRoles,
        onRoleChange,
        enableConsoleAdminRole = false,
        readOnly = false
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ searchQuery, setSearchQuery ] = useState<string>();
    const [ isSearching, setIsSearching ] = useState<boolean>(false);

    const {
        data: originalUserRoles,
        isLoading: isUserRolesFetchRequestLoading,
        error: agentRolesFetchRequestError
    } = useGetRolesList<RolesV2ResponseInterface>(
        null,
        null,
        searchQuery,
        "users,groups,permissions,associatedApplications",
        !isEmpty(agent?.id)
    );

    // Roles available for sharing. Console application roles are excluded unless
    // enableConsoleAdminRole is true (e.g. in the console settings administrator edit view).
    const agentRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalUserRoles?.Resources?.length > 0) {
            return originalUserRoles.Resources.filter((role: RolesV2Interface) =>
                enableConsoleAdminRole
                || !(role.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION
                    && role.audience?.display === UIConstants.CONSOLE_APP_AUDIENCE_DISPLAY)
            );
        }

        return [];
    }, [ originalUserRoles, enableConsoleAdminRole ]);

    useEffect(() => {
        if (agentRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description:
                        t("agents:edit.sections.sharedAccess.notifications.fetchAgentRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("agents:edit.sections.sharedAccess.notifications.fetchAgentRoles.genericError.message")
                })
            );
        }
    }, [ agentRolesFetchRequestError ]);

    /**
     * This is a debounced function to handle the roles search.
     */
    const debouncedSearch: (_value: string) => void = useCallback(
        debounce((value: string) => {
            const query: string = value ? `displayName co "${value}"` : undefined;

            setSearchQuery(query);
            setIsSearching(false);
        }, 1000),
        []
    );

    const handleRolesOnChange = (
        value: RolesV2Interface[],
        reason: AutocompleteChangeReason,
        details: AutocompleteChangeDetails<RolesV2Interface>
    ): void => {
        setSelectedRoles(value);
        const role: RolesV2Interface = details.option;

        if (isEmpty(role)) {
            return;
        }

        if (reason === "selectOption") {
            onRoleChange(role, true);
        } else if (reason === "removeOption") {
            onRoleChange(role, false);
        }
    };

    const getRoleAudienceLabel = (role: RolesV2Interface): string => {
        const audienceType: string = role?.audience?.type?.toUpperCase();

        if (audienceType === RoleAudienceTypes.ORGANIZATION) {
            return t("agents:edit.sections.sharedAccess.roleAudience.organization");
        }

        return t("agents:edit.sections.sharedAccess.roleAudience.application", {
            appName: role?.audience?.display ?? ""
        });
    };

    return (
        <>
            <Typography variant="body1" marginBottom={ 1 }>
                { t("agents:edit.sections.sharedAccess.commonRoleSharingLabel") }
                <Hint inline popup className="ml-1">
                    { t("agents:edit.sections.sharedAccess.commonRoleSharingHint") }
                </Hint>
            </Typography>
            <Autocomplete
                fullWidth
                multiple
                disableClearable
                size="small"
                className="role-select-autocomplete"
                data-componentid={ `${componentId}-autocomplete` }
                loading={ isUserRolesFetchRequestLoading || isSearching }
                placeholder={ t("agents:edit.sections.sharedAccess.searchAvailableRolesPlaceholder") }
                options={ agentRolesList ?? [] }
                value={ selectedRoles }
                onChange={ (
                    _event: SyntheticEvent,
                    value: RolesV2Interface[],
                    reason: AutocompleteChangeReason,
                    details: AutocompleteChangeDetails<RolesV2Interface>) => {
                    handleRolesOnChange(value, reason, details);
                } }
                disabled={ readOnly }
                noOptionsText={ t("common:noResultsFound") }
                getOptionLabel={ (option: RolesV2Interface) => option?.displayName ?? "" }
                renderOption={ (props: React.HTMLAttributes<HTMLLIElement>, option: RolesV2Interface) => (
                    <li
                        { ...props }
                        style={ {
                            alignItems: "flex-start",
                            display: "flex",
                            flexDirection: "column"
                        } }
                    >
                        <Typography variant="body2" sx={ { fontSize: "0.95rem" } }>
                            { option?.displayName }
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            { getRoleAudienceLabel(option) }
                        </Typography>
                    </li>
                ) }
                isOptionEqualToValue={ (
                    option: RolesV2Interface,
                    value: RolesV2Interface) =>
                    option?.displayName === value?.displayName
                    && option?.audience?.type === value?.audience?.type
                    && option?.audience?.display === value?.audience?.display
                }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        size="small"
                        placeholder={ t("agents:edit.sections.sharedAccess.searchAvailableRolesPlaceholder") }
                        data-componentid={ `${componentId}-role-search-input` }
                        onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                            const value: string = event.target.value.trim();

                            setIsSearching(true);
                            debouncedSearch(value);
                        } }
                    />
                ) }
                renderTags={ (
                    value: RolesV2Interface[],
                    getTagProps: AutocompleteRenderGetTagProps
                ) => value.map((option: RolesV2Interface, index: number) => {
                    return (
                        <Chip
                            { ...getTagProps({ index }) }
                            key={ index }
                            label={ option.displayName }
                            variant={
                                selectedRoles?.find(
                                    (role: RolesV2Interface) => role.id === option.id
                                )
                                    ? "filled"
                                    : "outlined"
                            }
                        />
                    );
                }
                ) }
            />
        </>
    );
};

export default RolesShareWithAll;
