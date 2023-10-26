/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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
import { AlertLevels, IdentifiableComponentInterface, RoleGroupsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, EmptyPlaceholder, Heading } from "@wso2is/react-components";
import { AxiosError } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AutoCompleteRenderOption } from "./edit-role-common/auto-complete-render-option";
import { RenderChip } from "./edit-role-common/render-chip";
import { updateResources } from "../../../core/api/bulk-operations";
import { getEmptyPlaceholderIllustrations } from "../../../core/configs/ui";
import { 
    GroupsInterface, 
    PatchBulkGroupDataInterface, 
    PatchGroupAddOpInterface, 
    PatchGroupOpInterface, 
    PatchGroupRemoveOpInterface 
} from "../../../groups";
import { useGroupList } from "../../../groups/api/groups";
import { UserBasicInterface } from "../../../users/models";
import { RoleConstants, Schemas } from "../../constants";
import { RoleEditSectionsInterface } from "../../models/roles";
import { RoleManagementUtils } from "../../utils";

type RoleGroupsPropsInterface = IdentifiableComponentInterface & RoleEditSectionsInterface;

export const RoleGroupsList: FunctionComponent<RoleGroupsPropsInterface> = (
    props: RoleGroupsPropsInterface
): ReactElement => {

    const {
        role,
        onRoleUpdate,
        isReadOnly,
        tabIndex
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ groupSearchValue, setGroupSearchValue ] = useState<string>(undefined);
    const [ isGroupSearchLoading, setGroupSearchLoading ] = useState<boolean>(false);
    const [ groupsOptions, setGroupsOptions ] = useState<GroupsInterface[]>([]);
    const [ selectedGroupsOptions, setSelectedGroupsOptions ] = useState<GroupsInterface[]>(undefined);
    const [ initialSelectedGroupsOptions, setInitialSelectedGroupsOptions ] = useState<GroupsInterface[]>(undefined);
    const [ removedGroupsOptions, setRemovedGroupsOptions ] = useState<GroupsInterface[]>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ activeOption, setActiveOption ] = useState<GroupsInterface|UserBasicInterface>(undefined);
    const [ showEmptyRolesListPlaceholder, setShowEmptyRolesListPlaceholder ] = useState<boolean>(false);

    const {
        data: originalGroupList,
        isLoading: isGroupListFetchRequestLoading,
        error: groupListFetchRequestError,
        mutate: mutateGroupListFetchRequest
    } = useGroupList(null, null, groupSearchValue ? `displayName co ${ groupSearchValue }` : null);

    /**
     * Set initial selected groups options
     */
    useEffect(() => {
        if ( role?.groups?.length > 0 ) {
            setInitialSelectedGroupsOptions(role.groups.map((group: RoleGroupsInterface) => {
                return {
                    displayName: group.display,
                    id: group.value
                };
            }));
        } else {
            setInitialSelectedGroupsOptions([]);
            setShowEmptyRolesListPlaceholder(true);
        }
    }, [ role ]);

    /**
     * Set selected groups options initially
     */
    useEffect(() => {
        if (!selectedGroupsOptions && initialSelectedGroupsOptions) {
            setSelectedGroupsOptions(initialSelectedGroupsOptions);
        }

        // Set groups options when the user is read only
        if (isReadOnly && initialSelectedGroupsOptions) {
            setGroupsOptions(initialSelectedGroupsOptions);
        }
    }, [ isReadOnly, initialSelectedGroupsOptions ]);

    /**
     * Set groups options
     */
    useEffect(() => {
        if (!isReadOnly) {
            if (originalGroupList && originalGroupList?.totalResults !== 0) {
                setGroupsOptions(originalGroupList?.Resources);
            } else {
                setGroupsOptions([]);
            }
        }
    }, [ originalGroupList ]);

    /**
     * Set removed groups
     */
    useEffect(() => {
        if (!isReadOnly && initialSelectedGroupsOptions && selectedGroupsOptions) {
            setRemovedGroupsOptions(initialSelectedGroupsOptions?.filter((group: GroupsInterface) => {
                return selectedGroupsOptions?.find(
                    (selectedGroup: GroupsInterface) => selectedGroup.id === group.id) === undefined;
            }));
        }
    }, [ initialSelectedGroupsOptions, selectedGroupsOptions ]);

    /**
     * Call mutateGroupListFetchRequest when the group search value changes
     */
    useEffect(() => {
        if ( groupSearchValue ) {
            mutateGroupListFetchRequest().finally(() => {
                setGroupSearchLoading(false);
            });
        }
    }, [ groupSearchValue ]);
    
    /**
     * Show error if group list fetch request failed
     */ 
    useEffect(() => {
        if ( groupListFetchRequestError ) {
            dispatch(
                addAlert({
                    description: t("console:manage.features.roles.edit.groups.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.edit.groups.notifications.fetchError.message")
                })
            );
        }
    }, [ groupListFetchRequestError ]);

    /**
     * Handle the restore groups.
     * 
     * @param remainingGroups - remaining groups
     */
    const handleRestoreGroups = (remainingGroups: GroupsInterface[]) => {
        const removedGroups: GroupsInterface[] = [];

        removedGroupsOptions.forEach((group: GroupsInterface) => {
            if (!remainingGroups?.find((newGroup: GroupsInterface) => newGroup.id === group.id)) {
                removedGroups.push(group);
            }
        });

        setSelectedGroupsOptions([
            ...selectedGroupsOptions,
            ...removedGroups
        ]);
    };

    /**
     * Get the place holder components.
     * 
     * @returns - place holder components
     */
    const getPlaceholders = () => {
        if (groupListFetchRequestError) {
            return (
                <EmptyPlaceholder
                    subtitle={ 
                        [ t("console:manage.features.roles.edit.groups.placeholders.errorPlaceholder.subtitles.0"),
                            t("console:manage.features.roles.edit.groups.placeholders.errorPlaceholder.subtitles.1") ] 
                    }
                    title={ t("console:manage.features.roles.edit.groups.placeholders.errorPlaceholder.title") }
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                />
            );
        } else if (showEmptyRolesListPlaceholder) {
            return (
                <EmptyPlaceholder
                    subtitle={ 
                        [ t("console:manage.features.roles.edit.groups.placeholders.emptyPlaceholder.subtitles.0") ]
                    }
                    title={ t("console:manage.features.roles.edit.groups.placeholders.emptyPlaceholder.title") }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    action={ 
                        !isReadOnly 
                            ? (
                                <Button onClick={ () => setShowEmptyRolesListPlaceholder(false) } >
                                    { t("console:manage.features.roles.edit.groups.placeholders.emptyPlaceholder" + 
                                        ".action") }
                                </Button>
                            )
                            : null
                    }
                />
            );
        }
    };

    /**
     * Handles the search query for the groups list.
     */
    const searchGroups: DebouncedFunc<(query: string) => void> = 
        useCallback(debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setGroupSearchValue(query);
        }, RoleConstants.DEBOUNCE_TIMEOUT), []);

    /**
     * Handles the update of the groups list.
     */
    const onGroupsUpdate: () => void = () => {

        const removeOperations: PatchGroupRemoveOpInterface[] = [];
        const addOperations: PatchGroupAddOpInterface[] = [];

        const bulkData: PatchBulkGroupDataInterface = {
            Operations: [],
            failOnErrors: 1,
            schemas: [ Schemas.BULK_REQUEST ]
        };

        const operation: PatchGroupOpInterface = {
            data: {
                "Operations": []
            },
            method: "PATCH",
            path: "/Roles/" + role.id
        };
        
        removedGroupsOptions?.map((group: GroupsInterface) => {
            removeOperations.push({
                "op": "remove",
                "path": `groups[value eq ${ group.id }]`
            });
        } );

        operation.data.Operations.push(...removeOperations);

        selectedGroupsOptions?.map((group: GroupsInterface) => {
            if (!initialSelectedGroupsOptions?.find(
                (selectedGroup: GroupsInterface) => selectedGroup.id === group.id)) {
                addOperations.push({
                    "op": "add",
                    "value": {
                        "groups": [ {
                            "value": group.id
                        } ]
                    }
                });
            }
        } );

        operation.data.Operations.push(...addOperations);
        bulkData.Operations.push(operation);

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("console:manage.features.roles.edit.groups.notifications.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.roles.edit.groups.notifications.success.message")
                    })
                );
                onRoleUpdate(tabIndex);
            })
            .catch( (error: AxiosError) => {
                if (error.response && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: 
                                t("console:manage.features.roles.edit.groups.notifications.error.description",
                                    { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.roles.edit.groups.notifications.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.roles.edit.groups.notifications.genericError" + 
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.roles.edit.groups.notifications.genericError.message")
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">
                { t("console:manage.features.roles.edit.groups.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:manage.features.roles.edit.groups.subHeading") }
            </Heading>
            {
                groupListFetchRequestError || showEmptyRolesListPlaceholder
                    ? getPlaceholders()
                    : (
                        <>
                            {
                                isReadOnly
                                    ? (
                                        <Autocomplete
                                            multiple
                                            disableCloseOnSelect
                                            options={ selectedGroupsOptions ? selectedGroupsOptions : [] }
                                            value={ selectedGroupsOptions ? selectedGroupsOptions : [] }
                                            getOptionLabel={ (group: GroupsInterface) => 
                                                RoleManagementUtils.getGroupDisplayName(group) }
                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                <TextField
                                                    { ...params }
                                                    placeholder= { t("console:manage.features.roles.edit.groups" + 
                                                        ".actions.search.placeholder") }
                                                />
                                            ) }
                                            renderTags={ (
                                                value: GroupsInterface[], 
                                                getTagProps: AutocompleteRenderGetTagProps
                                            ) => value.map((option: GroupsInterface, index: number) => (
                                                <RenderChip 
                                                    { ...getTagProps({ index }) }
                                                    key={ index }
                                                    primaryText={ RoleManagementUtils.getGroupDisplayName(option) }
                                                    userStore={ 
                                                        RoleManagementUtils.getUserStore(option.displayName) 
                                                    }
                                                    option={ option }
                                                    activeOption={ activeOption }
                                                    setActiveOption={ setActiveOption }
                                                    onDelete= { null }
                                                />
                                            )) }
                                            renderOption={ (
                                                props: HTMLAttributes<HTMLLIElement>, 
                                                option: GroupsInterface
                                            ) => (
                                                <AutoCompleteRenderOption
                                                    displayName={ RoleManagementUtils.getGroupDisplayName(option) }
                                                    userstore={ RoleManagementUtils.getUserStore(option.displayName) }
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
                                            getOptionLabel={ (group: GroupsInterface) => group.displayName }
                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                <TextField
                                                    { ...params }
                                                    placeholder= { t("console:manage.features.roles.edit.groups" + 
                                                        ".actions.assign.placeholder") }
                                                />
                                            ) }
                                            onChange={ (event: SyntheticEvent, groups: GroupsInterface[]) => {
                                                setSelectedGroupsOptions(groups); 
                                            } }
                                            filterOptions={ (groups: GroupsInterface[]) => groups }
                                            onInputChange={ 
                                                (event: SyntheticEvent, newValue: string) => {
                                                    setGroupSearchLoading(true);
                                                    searchGroups(newValue);
                                                } 
                                            }
                                            isOptionEqualToValue={ 
                                                (option: GroupsInterface, value: GroupsInterface) => 
                                                    option.id === value.id 
                                            }
                                            renderTags={ (
                                                value: GroupsInterface[], 
                                                getTagProps: AutocompleteRenderGetTagProps
                                            ) => value.map((option: GroupsInterface, index: number) => (
                                                <RenderChip 
                                                    { ...getTagProps({ index }) }
                                                    key={ index }
                                                    primaryText={ RoleManagementUtils.getGroupDisplayName(option) }
                                                    userStore={ 
                                                        RoleManagementUtils.getUserStore(option.displayName) 
                                                    }
                                                    option={ option }
                                                    activeOption={ activeOption }
                                                    setActiveOption={ setActiveOption }
                                                    variant={
                                                        initialSelectedGroupsOptions?.find(
                                                            (group: GroupsInterface) => group.id === option.id
                                                        )
                                                            ? "solid"
                                                            : "outlined"
                                                    }
                                                />
                                            )) }
                                            renderOption={ (
                                                props: HTMLAttributes<HTMLLIElement>,
                                                option: GroupsInterface, 
                                                { selected }: { selected: boolean }
                                            ) => (
                                                <AutoCompleteRenderOption
                                                    selected={ selected }
                                                    displayName={ RoleManagementUtils.getGroupDisplayName(option) }
                                                    userstore={ RoleManagementUtils.getUserStore(option.displayName) }
                                                    renderOptionProps={ props }
                                                />
                                            ) }
                                        />
                                    )
                            }

                            {   
                                // Removing groups
                                removedGroupsOptions?.length > 0
                                    ? (
                                        <Autocomplete
                                            multiple
                                            disableCloseOnSelect
                                            loading={ isGroupListFetchRequestLoading || isGroupSearchLoading }
                                            options={ removedGroupsOptions }
                                            value={ removedGroupsOptions }
                                            getOptionLabel={ 
                                                (group: GroupsInterface) => 
                                                    RoleManagementUtils.getGroupDisplayName(group)
                                            }
                                            onChange={ (event: SyntheticEvent, remainingGroups: GroupsInterface[]) => 
                                                handleRestoreGroups(remainingGroups)
                                            }
                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                <TextField
                                                    { ...params }
                                                    placeholder={ t("console:manage.features.roles.edit.groups" + 
                                                        ".actions.remove.placeholder") }
                                                    label={ t("console:manage.features.roles.edit.groups" + 
                                                        ".actions.remove.label") }
                                                    margin="dense"
                                                />
                                            ) }
                                            renderTags={ (
                                                value: GroupsInterface[], 
                                                getTagProps: AutocompleteRenderGetTagProps
                                            ) => value.map((option: GroupsInterface, index: number) => (
                                                <RenderChip
                                                    { ...getTagProps({ index }) }
                                                    key={ index }
                                                    primaryText={ RoleManagementUtils.getGroupDisplayName(option) }
                                                    userStore={ RoleManagementUtils.getUserStore(option.displayName) }
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
                                                option: GroupsInterface
                                            ) => (
                                                <AutoCompleteRenderOption
                                                    displayName={ RoleManagementUtils.getGroupDisplayName(option) }
                                                    userstore={ RoleManagementUtils.getUserStore(option.displayName) }
                                                    renderOptionProps={ props }
                                                />
                                            ) }
                                        />
                                    ) : null
                            } 
                            {
                                // Update Button
                                !isReadOnly 
                                    ? (
                                        <Button
                                            className="role-assigned-button"
                                            variant="contained" 
                                            loading={ isSubmitting } 
                                            onClick={ onGroupsUpdate }
                                            disabled={ initialSelectedGroupsOptions === selectedGroupsOptions }
                                        >
                                            { t("common:update") }
                                        </Button>
                                    ) : null
                            }
                        </>
                    )
            }
        </EmphasizedSegment>
    );
};

/**
 * Default props for application roles tab component.
 */
RoleGroupsList.defaultProps = {
    "data-componentid": "edit-role-group"
};
