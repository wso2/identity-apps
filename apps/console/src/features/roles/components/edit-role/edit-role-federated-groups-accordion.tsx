/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { AlertLevels, RoleGroupsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, GenericIcon } from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, HTMLAttributes, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AutoCompleteRenderOption } from "./edit-role-common/auto-complete-render-option";
import { RenderChip } from "./edit-role-common/render-chip";
import { EditRoleLocalGroupsAccordionPropsInterface } from "./edit-role-local-groups-accordion";
import { getConnectionIcons } from "../../../connections/configs/ui";
import { ConnectionsManagementUtils } from "../../../connections/utils/connection-utils";
import { useGetIdentityProviderGroupList } from "../../../identity-providers/api/use-get-identity-provider-groups-list";
import { IdentityProviderGroupInterface, StrictIdentityProviderInterface } from "../../../identity-providers/models";
import { RoleConstants } from "../../constants/role-constants";

interface EditRoleFederatedGroupsAccordionPropsInterface extends EditRoleLocalGroupsAccordionPropsInterface {
    identityProvider: StrictIdentityProviderInterface;
    isExpanded?: boolean;
    onExpansionChange?: (index: string, isExpanded: boolean) => void;
}

export const EditRoleFederatedGroupsAccordion: FunctionComponent<EditRoleFederatedGroupsAccordionPropsInterface> = (
    props: EditRoleFederatedGroupsAccordionPropsInterface
) => {

    const {
        isReadOnly,
        initialSelectedGroups,
        onUpdate,
        identityProvider,
        onSelectedGroupsListChange,
        isExpanded,
        onExpansionChange,
        isUpdating
    } = props;

    const initialSelectedGroupsOptions: IdentityProviderGroupInterface[] = initialSelectedGroups?.map(
        (group: RoleGroupsInterface) => {
            return {
                id: group.value,
                name: group.display
            };
        });

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { UIConfig } = useUIConfig();

    const [ selectedGroupsOptions, setSelectedGroupsOptions ]
        = useState<IdentityProviderGroupInterface[]>(initialSelectedGroupsOptions);
    const [ activeOption, setActiveOption ] = useState<IdentityProviderGroupInterface>(undefined);
    const [ removedGroupsOptions, setRemovedGroupsOptions ] = useState<IdentityProviderGroupInterface[]>(undefined);
    const [ groupsOptions, setGroupsOptions ] = useState<IdentityProviderGroupInterface[]>([]);
    const [ isGroupSearchLoading, setGroupSearchLoading ] = useState<boolean>(false);

    // Groups should be fetched only when the accordion is expanded.
    const shouldFetchGroups: boolean = isExpanded;

    // External connection resources URL from the UI config.
    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const {
        data: originalGroupList,
        isLoading: isGroupListFetchRequestLoading,
        error: groupListFetchRequestError
    } = useGetIdentityProviderGroupList(identityProvider.id, shouldFetchGroups);

    /**
     * Set groups options.
     */
    useEffect(() => {
        if (!isReadOnly) {
            if (originalGroupList && originalGroupList?.length > 0) {
                setGroupsOptions(originalGroupList);
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
                    description: t("roles:edit.groups.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:edit.groups.notifications.fetchError.message")
                })
            );
        }
    }, [ groupListFetchRequestError ]);

    /**
     * Set removed groups.
     */
    useEffect(() => {
        if (!isReadOnly && initialSelectedGroupsOptions && selectedGroupsOptions) {
            setRemovedGroupsOptions(initialSelectedGroupsOptions?.filter((group: IdentityProviderGroupInterface) => {
                return selectedGroupsOptions?.find(
                    (selectedGroup: IdentityProviderGroupInterface) => selectedGroup.id === group.id) === undefined;
            }));
        }
    }, [ selectedGroupsOptions ]);

    /**
     * Update the selected groups list.
     */
    useEffect(() => {
        if (!onSelectedGroupsListChange) {
            return;
        }

        const selectedGroupsIDs: string[] = selectedGroupsOptions?.map(
            (group: IdentityProviderGroupInterface) => group.id);
        const removedGroupsIDs: string[] = removedGroupsOptions?.map(
            (group: IdentityProviderGroupInterface) => group.id);

        onSelectedGroupsListChange(identityProvider?.id, selectedGroupsIDs, removedGroupsIDs);
    }, [ selectedGroupsOptions, removedGroupsOptions ]);

    /**
     * Listener for the accordion change.
     *
     * @param event - Click event.
     * @param isExpanded - Is accordion expanded.
     */
    const onAccordionChange = (event: SyntheticEvent, isExpanded: boolean): void => {
        if (onExpansionChange) {
            onExpansionChange(identityProvider.id, isExpanded);
        }
    };

    /**
     * Handles the search query for the groups list.
     */
    const searchGroups: DebouncedFunc<(query: string) => void> =
        useCallback(debounce((query: string) => {
            if (isEmpty(query)) {
                setGroupsOptions(originalGroupList);
                setGroupSearchLoading(false);

                return;
            }

            const trimmedQuery: string = query.trim();
            const filteredGroups: IdentityProviderGroupInterface[] = originalGroupList?.filter(
                (group: IdentityProviderGroupInterface) => {
                    return group.name.toLowerCase().includes(trimmedQuery.toLowerCase());
                });

            setGroupsOptions(filteredGroups);
            setGroupSearchLoading(false);
        }, RoleConstants.DEBOUNCE_TIMEOUT), [ originalGroupList ]);

    /**
     * Handle the restore groups.
     *
     * @param remainingGroups - remaining groups.
     */
    const handleRestoreGroups = (remainingGroups: IdentityProviderGroupInterface[]) => {
        const removedGroups: IdentityProviderGroupInterface[] = [];

        removedGroupsOptions.forEach((group: IdentityProviderGroupInterface) => {
            if (!remainingGroups?.find((newGroup: IdentityProviderGroupInterface) => newGroup.id === group.id)) {
                removedGroups.push(group);
            }
        });

        setSelectedGroupsOptions([
            ...selectedGroupsOptions,
            ...removedGroups
        ]);
    };

    /**
     * Resolves the IDP image.
     *
     * @returns Resolved IDP image.
     */
    const resolveIDPImage = (): string => {
        if (identityProvider.image) {
            return ConnectionsManagementUtils.resolveConnectionResourcePath(
                connectionResourcesUrl, identityProvider.image);
        }

        return getConnectionIcons().default;
    };

    return (
        <EmphasizedSegment
            className="mt-2"
            basic
        >
            <Accordion
                onChange={ onAccordionChange }
                elevation={ 1 }
                variant="elevation"
                disableGutters
                expanded={ isExpanded }
            >
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={ <ChevronDownIcon /> }
                >
                    <>
                        <GenericIcon
                            square
                            transparent
                            className="card-image"
                            size="mini"
                            icon={ resolveIDPImage() }
                            floated="left"
                        />
                        <Typography
                            className="ml-4"
                            variant="h6"
                        >
                            { identityProvider.name }
                        </Typography>
                    </>
                </AccordionSummary>
                <AccordionDetails>
                    <>
                        {
                            isReadOnly
                                ? (
                                    <Autocomplete
                                        multiple
                                        disableCloseOnSelect
                                        options={ selectedGroupsOptions ? selectedGroupsOptions : [] }
                                        value={ selectedGroupsOptions ? selectedGroupsOptions : [] }
                                        getOptionLabel={ (group: IdentityProviderGroupInterface) =>
                                            group.name }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <TextField
                                                { ...params }
                                                placeholder= { t("roles:edit.groups" +
                                                    ".actions.search.placeholder") }
                                            />
                                        ) }
                                        renderTags={ (
                                            value: IdentityProviderGroupInterface[],
                                            getTagProps: AutocompleteRenderGetTagProps
                                        ) => value.map((option: IdentityProviderGroupInterface, index: number) => (
                                            <RenderChip
                                                { ...getTagProps({ index }) }
                                                key={ index }
                                                primaryText={ option.name }
                                                option={ option }
                                                activeOption={ activeOption }
                                                setActiveOption={ setActiveOption }
                                                onDelete= { null }
                                            />
                                        )) }
                                        renderOption={ (
                                            props: HTMLAttributes<HTMLLIElement>,
                                            option: IdentityProviderGroupInterface
                                        ) => (
                                            <AutoCompleteRenderOption
                                                displayName={ option.name }
                                                renderOptionProps={ props }
                                            />
                                        ) }
                                    />
                                ) : (
                                    <Autocomplete
                                        multiple
                                        disableCloseOnSelect
                                        loading={ isGroupListFetchRequestLoading || isGroupSearchLoading }
                                        options={ groupsOptions }
                                        value={ selectedGroupsOptions ? selectedGroupsOptions : [] }
                                        getOptionLabel={ (group: IdentityProviderGroupInterface) => group.name }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <TextField
                                                { ...params }
                                                placeholder= { t("roles:edit.groups" +
                                                    ".actions.assign.placeholder") }
                                            />
                                        ) }
                                        onChange={ (
                                            event: SyntheticEvent,
                                            groups: IdentityProviderGroupInterface[]
                                        ) => { setSelectedGroupsOptions(groups); } }
                                        filterOptions={ (groups: IdentityProviderGroupInterface[]) => groups }
                                        onInputChange={
                                            (event: SyntheticEvent, newValue: string) => {
                                                setGroupSearchLoading(true);
                                                searchGroups(newValue);
                                            }
                                        }
                                        isOptionEqualToValue={ (
                                            option: IdentityProviderGroupInterface,
                                            value: IdentityProviderGroupInterface
                                        ) => option.id === value.id }
                                        renderTags={ (
                                            value: IdentityProviderGroupInterface[],
                                            getTagProps: AutocompleteRenderGetTagProps
                                        ) => value.map((option: IdentityProviderGroupInterface, index: number) => (
                                            <RenderChip
                                                { ...getTagProps({ index }) }
                                                key={ index }
                                                primaryText={ option.name }
                                                option={ option }
                                                activeOption={ activeOption }
                                                setActiveOption={ setActiveOption }
                                                variant={
                                                    initialSelectedGroupsOptions?.find(
                                                        (group: IdentityProviderGroupInterface) =>
                                                            group.id === option.id
                                                    )
                                                        ? "solid"
                                                        : "outlined"
                                                }
                                            />
                                        )) }
                                        renderOption={ (
                                            props: HTMLAttributes<HTMLLIElement>,
                                            option: IdentityProviderGroupInterface,
                                            { selected }: { selected: boolean }
                                        ) => (
                                            <AutoCompleteRenderOption
                                                selected={ selected }
                                                displayName={ option.name }
                                                renderOptionProps={ props }
                                            />
                                        ) }
                                    />
                                )
                        }

                        {
                            removedGroupsOptions?.length > 0
                                ? (
                                    <Autocomplete
                                        multiple
                                        disableCloseOnSelect
                                        loading={ isGroupListFetchRequestLoading || isGroupSearchLoading }
                                        options={ removedGroupsOptions }
                                        value={ removedGroupsOptions }
                                        getOptionLabel={
                                            (group: IdentityProviderGroupInterface) =>
                                                group.name
                                        }
                                        onChange={ (
                                            event: SyntheticEvent,
                                            remainingGroups: IdentityProviderGroupInterface[]
                                        ) => handleRestoreGroups(remainingGroups) }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <TextField
                                                { ...params }
                                                placeholder={ t("roles:edit.groups" +
                                                    ".actions.remove.placeholder") }
                                                label={ t("roles:edit.groups" +
                                                    ".actions.remove.label") }
                                                margin="dense"
                                            />
                                        ) }
                                        renderTags={ (
                                            value: IdentityProviderGroupInterface[],
                                            getTagProps: AutocompleteRenderGetTagProps
                                        ) => value.map((option: IdentityProviderGroupInterface, index: number) => (
                                            <RenderChip
                                                { ...getTagProps({ index }) }
                                                key={ index }
                                                primaryText={ option.name }
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
                                            option: IdentityProviderGroupInterface
                                        ) => (
                                            <AutoCompleteRenderOption
                                                displayName={ option.name }
                                                renderOptionProps={ props }
                                            />
                                        ) }
                                    />
                                ) : null
                        }
                        {
                            !isReadOnly
                                ? (
                                    <Button
                                        className="role-assigned-button"
                                        variant="contained"
                                        loading={ isUpdating }
                                        onClick={ onUpdate }
                                        disabled={ initialSelectedGroupsOptions === selectedGroupsOptions }
                                    >
                                        { t("common:update") }
                                    </Button>
                                ) : null
                        }
                    </>
                </AccordionDetails>
            </Accordion>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditRoleFederatedGroupsAccordion.defaultProps = {
    isReadOnly: false
};
