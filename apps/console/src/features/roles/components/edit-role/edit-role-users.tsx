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

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Grid from "@oxygen-ui/react/Grid";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { AlertLevels, IdentifiableComponentInterface, RolesMemberInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
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
import { Icon } from "semantic-ui-react";
import { AutoCompleteRenderOption } from "./edit-role-common/auto-complete-render-option";
import { RenderChip } from "./edit-role-common/render-chip";
import { RemoteUserStoreConstants } from "../../../../extensions/components/user-stores/constants";
import { updateResources } from "../../../core/api/bulk-operations";
import { getEmptyPlaceholderIllustrations } from "../../../core/configs/ui";
import { GroupsInterface } from "../../../groups/models/groups";
import { useUsersList } from "../../../users/api";
import {
    PatchBulkUserDataInterface,
    PatchUserAddOpInterface,
    PatchUserOpInterface,
    PatchUserRemoveOpInterface,
    UserBasicInterface
} from "../../../users/models";
import { useUserStores } from "../../../userstores/api";
import { UserStoreListItem } from "../../../userstores/models/user-stores";
import { RoleConstants, Schemas } from "../../constants";
import { RoleEditSectionsInterface } from "../../models/roles";
import { RoleManagementUtils } from "../../utils/role-management-utils";

type RoleUsersPropsInterface = IdentifiableComponentInterface & RoleEditSectionsInterface;

export const RoleUsersList: FunctionComponent<RoleUsersPropsInterface> = (
    props: RoleUsersPropsInterface
): ReactElement => {

    const {
        role,
        onRoleUpdate,
        isReadOnly,
        tabIndex
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ userSearchValue, setUserSearchValue ] = useState<string>(undefined);
    const [ isUserSearchLoading, setUserSearchLoading ] = useState<boolean>(false);
    const [ usersOptions, setUsersOptions ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsersOption, setSelectedUsersOption ] = useState<UserBasicInterface[]>(undefined);
    const [ initialSelectedUsersOption, setInitialSelectedUsersOption ] = useState<UserBasicInterface[]>(undefined);
    const [ removedUsersOptions, setRemovedUsersOptions ] = useState<UserBasicInterface[]>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ activeOption, setActiveOption ] = useState<GroupsInterface|UserBasicInterface>(undefined);
    const [ showEmptyRolesListPlaceholder, setShowEmptyRolesListPlaceholder ] = useState<boolean>(false);
    const [ selectedUserStoreDomainId, setSelectedUserStoreDomainId ] = useState<string>(
        RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME
    );

    const {
        data: userStores,
        isLoading: isUserStoresLoading
    } = useUserStores(null);

    const {
        data: originalUserList,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError,
        mutate: mutateUserListFetchRequest
    } = useUsersList(
        null,
        null,
        userSearchValue ? `userName co ${ userSearchValue }` : null,
        null,
        selectedUserStoreDomainId,
        null,
        !!selectedUserStoreDomainId
    );


    /**
     * Set initial selected users options
     */
    useEffect(() => {
        if ( role?.users?.length > 0 ) {
            setInitialSelectedUsersOption(role.users.map((user: RolesMemberInterface) => {
                return {
                    id: user.value,
                    userName: user.display
                };
            }));
        } else {
            setInitialSelectedUsersOption([]);
            setShowEmptyRolesListPlaceholder(true);
        }
    }, [ role ]);

    /**
     * Set selected users options initially
     */
    useEffect(() => {
        if (!selectedUsersOption && initialSelectedUsersOption) {
            setSelectedUsersOption(initialSelectedUsersOption);
        }

        // Set users options when the user is read only
        if (isReadOnly && initialSelectedUsersOption) {
            setUsersOptions(initialSelectedUsersOption);
        }
    }, [ isReadOnly, initialSelectedUsersOption ]);

    /**
     * Set users options
     */
    useEffect(() => {
        if (!isReadOnly) {
            if (originalUserList && originalUserList?.totalResults !== 0) {
                setUsersOptions(originalUserList?.Resources);
            } else {
                setUsersOptions([]);
            }
        }
    }, [ originalUserList ]);

    /**
     * Set removed users
     */
    useEffect(() => {
        if (!isReadOnly && initialSelectedUsersOption && selectedUsersOption) {
            setRemovedUsersOptions(initialSelectedUsersOption?.filter((user: UserBasicInterface) => {
                return selectedUsersOption?.find(
                    (selectedUser: UserBasicInterface) => selectedUser.id === user.id) === undefined;
            }));
        }
    }, [ initialSelectedUsersOption, selectedUsersOption ]);

    /**
     * Call mutateUserListFetchRequest when the user search value changes
     */
    useEffect(() => {
        if ( userSearchValue ) {
            mutateUserListFetchRequest().finally(() => setUserSearchLoading(false));
        }
    }, [ userSearchValue ]);

    /**
     * Show error if user list fetch request failed
     */
    useEffect(() => {
        if ( userListFetchRequestError ) {
            dispatch(
                addAlert({
                    description: t("console:manage.features.roles.edit.users.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.edit.users.notifications.fetchError.message")
                })
            );
        }
    }, [ userListFetchRequestError ]);

    /**
     * Get the place holder components.
     *
     * @returns - place holder components
     */
    const getPlaceholders = () => {
        if (showEmptyRolesListPlaceholder) {
            return (
                <EmptyPlaceholder
                    subtitle={
                        [ t("console:manage.features.roles.edit.users.placeholders.emptyPlaceholder.subtitles.0") ]
                    }
                    title={ t("console:manage.features.roles.edit.users.placeholders.emptyPlaceholder.title") }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    action={
                        !isReadOnly
                            ? (
                                <PrimaryButton
                                    onClick={ () => setShowEmptyRolesListPlaceholder(false) }
                                >
                                    <Icon name="plus"/>
                                    { t("console:manage.features.roles.edit.users.placeholders.emptyPlaceholder" +
                                        ".action") }
                                </PrimaryButton>
                            )
                            : null
                    }
                />
            );
        }
    };

    /**
     * Handles the search query for the users list.
     */
    const searchUsers: DebouncedFunc<(query: string) => void> =
        useCallback(debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setUserSearchValue(query);
        }, RoleConstants.DEBOUNCE_TIMEOUT), []);

    /**
     * Handles the update of the groups list.
     */
    const onUsersUpdate: () => void = () => {

        const removeOperations: PatchUserRemoveOpInterface[] = [];
        const addOperations: PatchUserAddOpInterface[] = [];

        const bulkData: PatchBulkUserDataInterface = {
            Operations: [],
            failOnErrors: 1,
            schemas: [ Schemas.BULK_REQUEST ]
        };

        const operation: PatchUserOpInterface = {
            data: {
                "Operations": []
            },
            method: "PATCH",
            path: "/v2/Roles/" + role.id
        };

        removedUsersOptions?.map((user: UserBasicInterface) => {
            removeOperations.push({
                "op": "remove",
                "path": `users[value eq ${ user.id }]`
            });
        } );

        operation.data.Operations.push(...removeOperations);

        selectedUsersOption?.map((user: UserBasicInterface) => {
            if (!initialSelectedUsersOption?.find((selectedUser: UserBasicInterface) => selectedUser.id === user.id)) {
                addOperations.push({
                    "op": "add",
                    "value": {
                        "users": [ {
                            "value": user.id
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
                        description: t("console:manage.features.roles.edit.users.notifications.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.roles.edit.users.notifications.success.message")
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

    // TODO: need to add the details of the managed by to the users list
    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">
                { t("console:manage.features.roles.edit.users.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:manage.features.roles.edit.users.subHeading") }
            </Heading>
            {
                showEmptyRolesListPlaceholder
                    ? getPlaceholders()
                    : (
                        <>
                            <Grid container spacing={ 1 }>
                                <Grid xs={ 12 } sm={ 6 } md={ 2 }>
                                    <Select
                                        style={ { width: "100%" } }
                                        value={ selectedUserStoreDomainId }
                                        onChange={
                                            (e: SelectChangeEvent<unknown>) => {
                                                setSelectedUserStoreDomainId(e.target.value as string);
                                                setSelectedUsersOption([]);
                                            }
                                        }
                                    >
                                        { isUserStoresLoading
                                            ? <p>{ t("common:loading") }</p>
                                            : [
                                                {
                                                    id: RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME,
                                                    name: t("console:manage.features.users.userstores." +
                                                        "userstoreOptions.primary")
                                                },
                                                ...(userStores ?? [])
                                            ].map((userstore: UserStoreListItem) =>
                                                (<MenuItem
                                                    key={ userstore.id }
                                                    value={ userstore.id }
                                                >
                                                    { userstore.name }
                                                </MenuItem>)
                                            )
                                        }
                                    </Select>
                                </Grid>
                                <Grid xs={ 12 } sm={ 6 } md={ 10 }>
                                    {
                                        isReadOnly
                                            ? (
                                                <Autocomplete
                                                    multiple
                                                    disableCloseOnSelect
                                                    options={ selectedUsersOption ? selectedUsersOption : [] }
                                                    value={ selectedUsersOption ? selectedUsersOption : [] }
                                                    getOptionLabel={ (user: UserBasicInterface) =>
                                                        RoleManagementUtils.getUserUsername(user) }
                                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                                        <TextField
                                                            { ...params }
                                                            placeholder= {
                                                                t("console:manage.features.roles.edit.users" +
                                                                  ".actions.search.placeholder") }
                                                        />
                                                    ) }
                                                    renderTags={ (
                                                        value: UserBasicInterface[],
                                                        getTagProps: AutocompleteRenderGetTagProps
                                                    ) => value.map((option: UserBasicInterface, index: number) => (
                                                        <RenderChip
                                                            { ...getTagProps({ index }) }
                                                            key={ index }
                                                            primaryText={ RoleManagementUtils.getUserUsername(option) }
                                                            userStore={
                                                                RoleManagementUtils.getUserStore(option.userName)
                                                            }
                                                            option={ option }
                                                            activeOption={ activeOption }
                                                            setActiveOption={ setActiveOption }
                                                            onDelete= { null }
                                                        />
                                                    )) }
                                                    renderOption={ (
                                                        props: HTMLAttributes<HTMLLIElement>,
                                                        option: UserBasicInterface
                                                    ) => (
                                                        <AutoCompleteRenderOption
                                                            subTitle={ RoleManagementUtils.getUserUsername(option) }
                                                            displayName={
                                                                RoleManagementUtils.getNameToDisplayOfUser(option)
                                                            }
                                                            userstore={
                                                                RoleManagementUtils.getUserStore(option.userName)
                                                            }
                                                            renderOptionProps={ props }
                                                        />
                                                    ) }
                                                />
                                            ) : (
                                                <Autocomplete
                                                    multiple
                                                    style={ { padding: 0 } }
                                                    size="small"
                                                    disableCloseOnSelect
                                                    loading={ isUserListFetchRequestLoading || isUserSearchLoading }
                                                    options={ usersOptions }
                                                    value={ selectedUsersOption ? selectedUsersOption : [] }
                                                    getOptionLabel={
                                                        (user: UserBasicInterface) =>
                                                            RoleManagementUtils.getUserUsername(user)
                                                    }
                                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                                        <TextField
                                                            { ...params }
                                                            placeholder= {
                                                                t("console:manage.features.roles.edit.users" +
                                                                  ".actions.assign.placeholder") }
                                                        />
                                                    ) }
                                                    onChange={ (event: SyntheticEvent, users: UserBasicInterface[]) => {
                                                        setSelectedUsersOption(users);
                                                    } }
                                                    filterOptions={ (users: UserBasicInterface[]) => users }
                                                    onInputChange={
                                                        (event: SyntheticEvent, newValue: string) => {
                                                            setUserSearchLoading(true);
                                                            searchUsers(newValue);
                                                        }
                                                    }
                                                    isOptionEqualToValue={
                                                        (option: UserBasicInterface, value: UserBasicInterface) =>
                                                            option.id === value.id
                                                    }
                                                    renderTags={ (
                                                        value: UserBasicInterface[],
                                                        getTagProps: AutocompleteRenderGetTagProps
                                                    ) => value.map((option: UserBasicInterface, index: number) => (
                                                        <RenderChip
                                                            { ...getTagProps({ index }) }
                                                            key={ index }
                                                            primaryText={ RoleManagementUtils.getUserUsername(option) }
                                                            userStore={
                                                                RoleManagementUtils.getUserStore(option.userName)
                                                            }
                                                            option={ option }
                                                            activeOption={ activeOption }
                                                            setActiveOption={ setActiveOption }
                                                            variant={
                                                                initialSelectedUsersOption?.find(
                                                                    (user: UserBasicInterface) => user.id === option.id
                                                                )
                                                                    ? "solid"
                                                                    : "outlined"
                                                            }
                                                        />
                                                    )) }
                                                    renderOption={ (
                                                        props: HTMLAttributes<HTMLLIElement>,
                                                        option: UserBasicInterface,
                                                        { selected }: { selected: boolean }
                                                    ) => (
                                                        <AutoCompleteRenderOption
                                                            selected={ selected }
                                                            subTitle={ RoleManagementUtils.getUserUsername(option) }
                                                            displayName={
                                                                RoleManagementUtils.getNameToDisplayOfUser(option)
                                                            }
                                                            userstore={
                                                                RoleManagementUtils.getUserStore(option.userName)
                                                            }
                                                            renderOptionProps={ props }
                                                        />
                                                    ) }
                                                />
                                            )
                                    }
                                </Grid>
                            </Grid>

                            {
                                !isReadOnly
                                    ? (
                                        <Button
                                            className="role-assigned-button"
                                            variant="contained"
                                            loading={ isSubmitting }
                                            onClick={ onUsersUpdate }
                                            disabled={ initialSelectedUsersOption === selectedUsersOption }
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
RoleUsersList.defaultProps = {
    "data-componentid": "edit-role-users"
};
