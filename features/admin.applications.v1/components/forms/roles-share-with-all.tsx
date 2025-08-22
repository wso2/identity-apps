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

import { AutocompleteChangeDetails, AutocompleteChangeReason, Typography } from "@mui/material";
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetApplicationRolesByAudience from "@wso2is/admin.roles.v2/api/use-get-application-roles-by-audience";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
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
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps } from "semantic-ui-react";
import { ApplicationInterface } from "../../models/application";
import "./roles-share-with-all.scss";

/**
 * Props interface for the ConsoleRolesShareWithAll component.
 */
interface RolesShareWithAllPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    selectedRoles: RolesInterface[];
    setSelectedRoles: (roles: RolesInterface[]) => void;
    onRoleChange: (role: RolesV2Interface, isSelected: boolean) => void;
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
        ["data-componentid"]: componentId = "console-roles-share-with-all",
        application,
        selectedRoles,
        setSelectedRoles,
        onRoleChange
    } = props;

    const applicationsFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const isReadOnly: boolean = !(useRequiredScopes(applicationsFeatureConfig?.scopes?.update));

    const [ searchQuery, setSearchQuery ] = useState<string>();
    const [ isSearching, setIsSearching ] = useState<boolean>(false);

    const applicationAudience: string = application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION;

    const {
        data: originalApplicationRoles,
        isLoading: isApplicationRolesFetchRequestLoading,
        error: applicationRolesFetchRequestError
    } = useGetApplicationRolesByAudience(
        applicationAudience,
        application?.id,
        searchQuery,
        null,
        null,
        null,
        "users,groups,permissions,associatedApplications"
    );

    const applicationRolesList: RolesV2Interface[] = useMemo(() => {
        if (originalApplicationRoles?.Resources?.length > 0) {
            return originalApplicationRoles.Resources;
        }
    }, [ originalApplicationRoles ]);

    useEffect(() => {
        if (applicationRolesFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("applications:edit.sections.sharedAccess.notifications.rolesFetchError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:edit.sections.sharedAccess.notifications.rolesFetchError.message")
                })
            );
        }
    }, [ applicationRolesFetchRequestError ]);

    /**
     * This is a debounced function to handle the roles search.
     */
    const debouncedSearch: (value: string) => void = useCallback(
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

    return (
        <>
            <Typography variant="body1" marginBottom={ 1 }>
                { t("applications:edit.sections.sharedAccess." +
                    "commonRoleSharingLabel") }
                <Hint inline popup>
                    { t("applications:edit.sections.sharedAccess." +
                        "commonRoleSharingHint") }
                </Hint>
            </Typography>
            <Autocomplete
                fullWidth
                multiple
                disableClearable
                size="small"
                className="role-select-autocomplete"
                data-componentid={ `${componentId}-autocomplete` }
                loading={ isApplicationRolesFetchRequestLoading || isSearching }
                placeholder={ t("applications:edit.sections.sharedAccess.modes.shareWithSelectedPlaceholder") }
                options={ applicationRolesList ?? [] }
                value={ selectedRoles }
                onChange={ (
                    _event: SyntheticEvent,
                    value: RolesV2Interface[],
                    reason: AutocompleteChangeReason,
                    details: AutocompleteChangeDetails<RolesV2Interface>) => {
                    handleRolesOnChange(value, reason, details);
                } }
                disabled={ isReadOnly }
                noOptionsText={ t("common:noResultsFound") }
                getOptionLabel={ (dropdownOption: DropdownProps) =>
                    dropdownOption?.displayName }
                isOptionEqualToValue={ (
                    option: RolesV2Interface,
                    value: RolesV2Interface) =>
                    option?.displayName === value.displayName
                }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        size="small"
                        placeholder={ t("applications:edit.sections.sharedAccess.searchAvailableRolesPlaceholder") }
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
