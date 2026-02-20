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
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import { Show } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import {
    AutoCompleteRenderOption
} from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/auto-complete-render-option";
import { RenderChip } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/render-chip";
import { RoleManagementUtils } from "@wso2is/admin.roles.v2/utils/role-management-utils";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, Hint } from "@wso2is/react-components/src/components/typography";
import { AxiosError } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, HTMLAttributes, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { updateConnectionRoleMappings } from "../../../../api/connections";
import { ConnectionRolesInterface } from "../../../../models/connection";
import { handleUpdateIDPRoleMappingsError } from "../../../../utils/connection-utils";

interface GroupInterface {
    id: string;
    name: string;
}

interface OutboundProvisioningGroupsPropsInterface extends IdentifiableComponentInterface {
    idpId: string;
    idpRoles: ConnectionRolesInterface;
    isReadOnly?: boolean;
    onUpdate: (id: string) => void;
}

export const OutboundProvisioningGroups: FunctionComponent<OutboundProvisioningGroupsPropsInterface> = (
    props: OutboundProvisioningGroupsPropsInterface) => {

    const {
        idpId,
        idpRoles,
        isReadOnly,
        onUpdate,
        [ "data-componentid" ]: componentId = "outbound-provisioning-settings-groups"
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const excludedAttributes: string = "members,roles,meta";

    const initialSelectedGroupsOptions: GroupInterface[] = idpRoles?.outboundProvisioningRoles?.map(
        (groupName: string) => ({
            id: groupName,
            name: groupName
        })
    ) || [];

    const [ selectedGroupsOptions, setSelectedGroupsOptions ]
        = useState<GroupInterface[]>(initialSelectedGroupsOptions);
    const [ activeOption, setActiveOption ] = useState<GroupInterface>(undefined);
    const [ removedGroupsOptions, setRemovedGroupsOptions ] = useState<GroupInterface[]>(undefined);
    const [ groupsOptions, setGroupsOptions ] = useState<GroupInterface[]>([]);
    const [ groupSearchValue, setGroupSearchValue ] = useState<string>(undefined);
    const [ isGroupSearchLoading, setGroupSearchLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: originalGroupList,
        isLoading: isGroupListFetchRequestLoading,
        error: groupListFetchRequestError
    } = useGroupList(
        null,
        null,
        groupSearchValue ? `displayName co "${ groupSearchValue }"` : null,
        null,
        excludedAttributes
    );

    /**
     * Set groups options.
     */
    useEffect(() => {
        if (!isReadOnly) {
            if (originalGroupList && originalGroupList?.totalResults !== 0) {
                setGroupsOptions(originalGroupList.Resources.map((group: GroupsInterface) => ({
                    id: group.displayName,
                    name: group.displayName
                })));
            } else {
                setGroupsOptions([]);
            }
        }
    }, [ originalGroupList ]);

    /**
     * Show error if group list fetch request failed.
     */
    useEffect(() => {
        if (groupListFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("groups:notifications.fetchGroups.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("groups:notifications.fetchGroups.genericError.message")
                })
            );
        }
    }, [ groupListFetchRequestError ]);

    /**
     * Set removed groups.
     */
    useEffect(() => {
        if (!isReadOnly && initialSelectedGroupsOptions && selectedGroupsOptions) {
            setRemovedGroupsOptions(initialSelectedGroupsOptions?.filter((group: GroupInterface) => {
                return selectedGroupsOptions?.find(
                    (selectedGroup: GroupInterface) => selectedGroup.id === group.id) === undefined;
            }));
        }
    }, [ selectedGroupsOptions ]);

    /**
     * Handles the search query for the groups list.
     */
    const searchGroups: DebouncedFunc<(query: string) => void> =
        useCallback(debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setGroupSearchValue(query);
            setGroupSearchLoading(false);
        }, 1000), []);

    /**
     * Handle the restore groups.
     *
     * @param remainingGroups - remaining groups
     */
    const handleRestoreGroups = (remainingGroups: GroupInterface[]) => {
        const removedGroups: GroupInterface[] = [];

        removedGroupsOptions.forEach((group: GroupInterface) => {
            if (!remainingGroups?.find((newGroup: GroupInterface) => newGroup.id === group.id)) {
                removedGroups.push(group);
            }
        });

        setSelectedGroupsOptions([
            ...selectedGroupsOptions,
            ...removedGroups
        ]);
    };

    /**
     * Handle update of outbound provisioning groups.
     */
    const handleOutboundProvisioningGroupMapping = () => {
        setIsSubmitting(true);

        const selectedGroupNames: string[] = selectedGroupsOptions?.map((group: GroupInterface) => group.name);

        updateConnectionRoleMappings(idpId, {
            ...idpRoles,
            outboundProvisioningRoles: selectedGroupNames
        }).then(() => {
            dispatch(addAlert({
                description: t("authenticationProvider:notifications.updateIDPRoleMappings.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("authenticationProvider:notifications.updateIDPRoleMappings.success.message")
            }));
            onUpdate(idpId);
        }).catch((error: AxiosError) => {
            handleUpdateIDPRoleMappingsError(error);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column mobile={ 16 } computer={ 12 }>
                    <Heading as="h4">
                        { t("authenticationProvider:forms.outboundProvisioningGroups.heading") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column mobile={ 16 } computer={ 12 }>
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        loading={ isGroupListFetchRequestLoading || isGroupSearchLoading }
                        options={ groupsOptions }
                        value={ selectedGroupsOptions ? selectedGroupsOptions : [] }
                        data-componentid={ `${ componentId }-groups-autocomplete` }
                        getOptionLabel={ (group: GroupInterface) => group.name }
                        renderInput={ (params: AutocompleteRenderInputParams) => (
                            <TextField
                                { ...params }
                                placeholder={ t("authenticationProvider:forms." +
                                                        "outboundProvisioningGroups.placeHolder") }
                            />
                        ) }
                        disabled={ isReadOnly }
                        onChange={ (event: SyntheticEvent, groups: GroupInterface[]) => {
                            setSelectedGroupsOptions(groups);
                        } }
                        filterOptions={ (groups: GroupInterface[]) => groups }
                        onInputChange={ (event: SyntheticEvent, newValue: string) => {
                            setGroupSearchLoading(true);
                            searchGroups(newValue);
                        } }
                        isOptionEqualToValue={ (option: GroupInterface, value: GroupInterface) =>
                            option.id === value.id
                        }
                        renderTags={ (
                            value: GroupInterface[],
                            getTagProps: AutocompleteRenderGetTagProps
                        ) => value.map((option: GroupInterface, index: number) => (
                            <RenderChip
                                { ...getTagProps({ index }) }
                                key={ index }
                                primaryText={ RoleManagementUtils.getDisplayName(option.name) }
                                userStore={ RoleManagementUtils.getUserStore(option.name) }
                                option={ option }
                                activeOption={ activeOption }
                                setActiveOption={ setActiveOption }
                                variant={
                                    initialSelectedGroupsOptions?.find(
                                        (group: GroupInterface) => group.id === option.id
                                    )
                                        ? "filled"
                                        : "outlined"
                                }
                            />
                        )) }
                        renderOption={ (
                            props: HTMLAttributes<HTMLLIElement>,
                            option: GroupInterface,
                            { selected }: { selected: boolean }
                        ) => (
                            <AutoCompleteRenderOption
                                selected={ selected }
                                displayName={ RoleManagementUtils.getDisplayName(option.name) }
                                userstore={ RoleManagementUtils.getUserStore(option.name) }
                                renderOptionProps={ props }
                            />
                        ) }
                    />
                </Grid.Column>
            </Grid.Row>
            {
                removedGroupsOptions?.length > 0 && (
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } computer={ 12 }>
                            <>
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    loading={ isGroupListFetchRequestLoading || isGroupSearchLoading }
                                    options={ removedGroupsOptions }
                                    value={ removedGroupsOptions }
                                    data-componentid={ `${componentId}-removed-groups-autocomplete` }
                                    getOptionLabel={ (group: GroupInterface) => group.name }
                                    onChange={ (
                                        event: SyntheticEvent,
                                        remainingGroups: GroupInterface[]
                                    ) => handleRestoreGroups(remainingGroups) }
                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                        <TextField
                                            { ...params }
                                            placeholder={ t("roles:edit.groups.actions.remove.placeholder") }
                                            label={ t("roles:edit.groups.actions.remove.label") }
                                            margin="dense"
                                        />
                                    ) }
                                    renderTags={ (
                                        value: GroupInterface[],
                                        getTagProps: AutocompleteRenderGetTagProps
                                    ) => value.map((option: GroupInterface, index: number) => (
                                        <RenderChip
                                            { ...getTagProps({ index }) }
                                            key={ index }
                                            primaryText={ RoleManagementUtils.getDisplayName(option.name) }
                                            userStore={ RoleManagementUtils.getUserStore(option.name) }
                                            option={ option }
                                            activeOption={ activeOption }
                                            setActiveOption={ setActiveOption }
                                            variant="outlined"
                                            onDelete={ () => {
                                                setSelectedGroupsOptions([
                                                    ...selectedGroupsOptions,
                                                    option
                                                ]);
                                            } }
                                        />
                                    )) }
                                    renderOption={ (
                                        props: HTMLAttributes<HTMLLIElement>,
                                        option: GroupInterface
                                    ) => (
                                        <AutoCompleteRenderOption
                                            displayName={ RoleManagementUtils.getDisplayName(option.name) }
                                            userstore={ RoleManagementUtils.getUserStore(option.name) }
                                            renderOptionProps={ props }
                                        />
                                    ) }
                                />
                            </>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            <Hint compact>
                { t("authenticationProvider:forms.outboundProvisioningGroups.hint") }
            </Hint>
            <Grid.Row>
                <Grid.Column mobile={ 16 } computer={ 12 }>
                    <>
                        {
                            !isReadOnly
                                ? (
                                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                        <Button
                                            className="role-assigned-button"
                                            variant="contained"
                                            loading={ isSubmitting }
                                            onClick={ handleOutboundProvisioningGroupMapping }
                                            disabled={ isSubmitting }
                                            data-componentid={ `${ componentId }-update-button` }
                                        >
                                            { t("common:update") }
                                        </Button>
                                    </Show>
                                ) : null
                        }
                    </>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
