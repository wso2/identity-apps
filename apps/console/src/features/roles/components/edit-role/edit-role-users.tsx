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
import FormControl from "@oxygen-ui/react/FormControl";
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
import "./edit-role.scss";

type UserstoreDisplayItem = Omit<UserStoreListItem,"description" | "self" | "enabled">

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
    const [ users, setUsers ] = useState<UserBasicInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ activeOption, setActiveOption ] = useState<GroupsInterface|UserBasicInterface>(undefined);
    const [ availableUserStores, setAvailableUserStores ] = useState<UserstoreDisplayItem[]>([]);
    const [ selectedUserStoreDomainName, setSelectedUserStoreDomainName ] = useState<string>(
        "Primary"
    );
    const [ isPlaceholderVisible, setIsPlaceholderVisible ] = useState<boolean>(true);
    const [ selectedUsersFromUserStore, setSelectedUsersFromUserStore ] = useState<UserBasicInterface[]>([]);
    const [ selectedAllUsers, setSelectedAllUsers ] = useState<Record<string, UserBasicInterface[] | undefined>>({});

    const {
        data: userStores,
        isLoading: isUserStoresLoading
    } = useUserStores(null);

    const {
        data: userResponse,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError
    } = useUsersList(
        null,
        null,
        userSearchValue ? `userName co ${ userSearchValue }` : null,
        null,
        selectedUserStoreDomainName,
        null,
        !!selectedUserStoreDomainName || !!userSearchValue
    );

    const isUserBelongToSelectedUserStore = (user: UserBasicInterface, userStoreName: string) => {
        const userNameChunks: string[] = user.userName.split("/");

        return (userNameChunks.length === 1 && userStoreName === "Primary")
        || (userNameChunks.length === 2 && userNameChunks[0] === userStoreName.toUpperCase());
    };

    useEffect(() => {
        if (!role?.users?.length) {
            return;
        }

        setIsPlaceholderVisible(false);

        const alreadyAssignedUsersFromSelectedUserStore: UserBasicInterface[] = role?.users?.map(
            (user: RolesMemberInterface) => ({
                id: user.value,
                userName: user.display
            })
        ).filter((user: UserBasicInterface) =>
            isUserBelongToSelectedUserStore(user, selectedUserStoreDomainName)
        ) ?? [];

        // if `selectedAllUsers[selectedUserStoreDomainName]` is undefined, that means the assigned users
        // for the selected user store have not yet been edited since page load. In such cases, the autocomplete
        // input is populated with already assigned users to role.
        const usersFromSelectedStore: UserBasicInterface[] =
            selectedAllUsers[selectedUserStoreDomainName] || alreadyAssignedUsersFromSelectedUserStore;

        setSelectedUsersFromUserStore(usersFromSelectedStore);
    },[ role, selectedUserStoreDomainName ]);

    useEffect(() => {
        if (userStores) {
            const availableUserStoreList: UserstoreDisplayItem[] = [
                {
                    id: RemoteUserStoreConstants.PRIMARY_USER_STORE_NAME,
                    name: t("users:userstores." +
                    "userstoreOptions.primary")
                }
            ];

            setAvailableUserStores(
                [
                    ...availableUserStoreList,
                    ...userStores.map((userStore: UserStoreListItem) => ({
                        id: userStore.id,
                        name: userStore.name
                    }))
                ]
            );
        }
    }, [ userStores ]);

    /**
     * Set available to select users.
     */
    useEffect(() => {
        if (!isReadOnly && userResponse?.totalResults > 0 && Array.isArray(userResponse?.Resources)) {
            const usersAvailableToSelect: UserBasicInterface[] = userResponse?.Resources?.filter(
                (user: UserBasicInterface) => {
                    const isUserInSelectedUserStore: boolean = isUserBelongToSelectedUserStore(
                        user, selectedUserStoreDomainName
                    );

                    const isUserAlreadySelected: boolean = selectedUsersFromUserStore?.find(
                        (selectedUser: UserBasicInterface) => selectedUser.id === user.id) !== undefined;

                    return !isUserAlreadySelected && isUserInSelectedUserStore;
                }) ?? [];

            setUsers(usersAvailableToSelect);
        } else {
            setUsers([]);
        }
    }, [ userResponse, selectedUsersFromUserStore ]);

    /**
     * Show error if user list fetch request failed
     */
    useEffect(() => {
        if ( userListFetchRequestError ) {
            dispatch(
                addAlert({
                    description: t("roles:edit.users.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:edit.users.notifications.fetchError.message")
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
        return (
            <EmptyPlaceholder
                subtitle={
                    [ t("roles:edit.users.placeholders.emptyPlaceholder.subtitles.0") ]
                }
                title={ t("roles:edit.users.placeholders.emptyPlaceholder.title") }
                image={ getEmptyPlaceholderIllustrations().emptyList }
                imageSize="tiny"
                action={
                    !isReadOnly
                        ? (
                            <PrimaryButton
                                onClick={ () => setIsPlaceholderVisible(false) }
                            >
                                <Icon name="plus"/>
                                { t("roles:edit.users.placeholders.emptyPlaceholder" +
                                        ".action") }
                            </PrimaryButton>
                        )
                        : null
                }
            />
        );
    };

    /**
     * Handles temporarily storing the users selected from the specified user store.
     */
    const updateSelectedAllUsers = () => {
        if (Array.isArray(selectedUsersFromUserStore)) {
            const tempSelectedAllUsers: Record<string, UserBasicInterface[]> = selectedAllUsers;

            tempSelectedAllUsers[selectedUserStoreDomainName] = selectedUsersFromUserStore;

            setSelectedAllUsers(tempSelectedAllUsers);
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
     * Handles updating the assigned users for the role.
     */
    const handleUsersUpdate: () => void = () => {
        setIsSubmitting(true);

        updateSelectedAllUsers();

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

        const selectedUsers: UserBasicInterface[] = Object.keys(selectedAllUsers).map((userStoreName: string) => {
            return selectedAllUsers[userStoreName];
        }).flat();

        // Formatting unassigned users list.
        const removedUsers: RolesMemberInterface[] = role?.users?.filter((user: RolesMemberInterface) => {
            return selectedUsers?.find(
                (selectedUser: UserBasicInterface) => selectedUser.id === user.value) === undefined;
        }) ?? [];

        const removeOperations: PatchUserRemoveOpInterface[] = removedUsers?.map((user: RolesMemberInterface) => {
            return ({
                "op": "remove",
                "path": `users[value eq ${ user.value }]`
            });
        } );

        operation.data.Operations.push(...removeOperations);

        // Formatting newly assigned users list.
        const addedUsers: UserBasicInterface[] = selectedUsers?.filter((user: UserBasicInterface) => {
            return role?.users?.find(
                (selectedUser: RolesMemberInterface) => selectedUser.value === user.id) === undefined;
        }) ?? [];

        const addOperations: PatchUserAddOpInterface[] = addedUsers?.map((user: UserBasicInterface) => {
            return ({
                "op": "add",
                "value": {
                    "users": [ {
                        "value": user.id
                    } ]
                }
            });
        } );

        operation.data.Operations.push(...addOperations);

        bulkData.Operations.push(operation);

        updateResources(bulkData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("roles:edit.users.notifications.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("roles:edit.users.notifications.success.message")
                    })
                );
                onRoleUpdate(tabIndex);
            })
            .catch( (error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description:
                                t("roles:edit.groups.notifications.error.description",
                                    { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t("roles:edit.groups.notifications.genericError" +
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.genericError.message")
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
        <EmphasizedSegment padded="very" className="edit-role users">
            <Heading as="h4">
                { t("roles:edit.users.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("roles:edit.users.subHeading") }
            </Heading>
            {
                isPlaceholderVisible
                    ? getPlaceholders()
                    : (
                        <>
                            {
                                users && availableUserStores && !isReadOnly && (
                                    <Grid container spacing={ 1 }>
                                        <Grid xs={ 12 } sm={ 4 } md={ 2 } alignItems="center">
                                            <FormControl fullWidth size="medium">
                                                <Select
                                                    value={ selectedUserStoreDomainName }
                                                    onChange={
                                                        (e: SelectChangeEvent<unknown>) => {
                                                            updateSelectedAllUsers();
                                                            setSelectedUsersFromUserStore([]);
                                                            setSelectedUserStoreDomainName(e.target.value as string);
                                                        }
                                                    }
                                                >
                                                    { isUserStoresLoading
                                                        ? <p>{ t("common:loading") }</p>
                                                        : availableUserStores?.map((userstore: UserStoreListItem) =>
                                                            (<MenuItem
                                                                key={ userstore.name }
                                                                value={ userstore.name }
                                                            >
                                                                { userstore.name }
                                                            </MenuItem>)
                                                        )
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid xs={ 12 } sm={ 4 } md={ 8 }>
                                            <Autocomplete
                                                multiple
                                                style={ { padding: 0 } }
                                                size="small"
                                                disableCloseOnSelect
                                                loading={ isUserListFetchRequestLoading || isUserSearchLoading }
                                                options={ users }
                                                value={ selectedUsersFromUserStore }
                                                getOptionLabel={
                                                    (user: UserBasicInterface) =>
                                                        RoleManagementUtils.getUserUsername(user)
                                                }
                                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                                    <TextField
                                                        { ...params }
                                                        placeholder= {
                                                            t("roles:edit.users" +
                                                                                  ".actions.assign.placeholder") }
                                                    />
                                                ) }
                                                onChange={ (event: SyntheticEvent, users: UserBasicInterface[]) => {
                                                    setSelectedUsersFromUserStore(users);
                                                } }
                                                filterOptions={ (users: UserBasicInterface[]) => users }
                                                onInputChange={
                                                    (_event: SyntheticEvent, searchTerm: string) => {
                                                        setUserSearchLoading(true);
                                                        searchUsers(searchTerm);
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
                                                        variant={ "solid" }
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

                                        </Grid>
                                    </Grid>
                                )
                            }

                            {
                                !isReadOnly
                                    ? (
                                        <Button
                                            className="role-assigned-button"
                                            variant="contained"
                                            loading={ isSubmitting }
                                            onClick={ handleUsersUpdate }
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
