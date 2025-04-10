/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "../../../admin.extensions.v1";

// import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { getUsersList, useUsersList } from "@wso2is/admin.users.v1/api";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { getAUserStore, useUserStores } from "@wso2is/admin.userstores.v1/api";
import {
    UserStoreDropdownItem,
    UserStoreListItem,
    UserStorePostData,
    UserStoreProperty
} from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { StringUtils } from "@wso2is/core/utils";
import { EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
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
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { AutoCompleteRenderOption } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/auto-complete-render-option";
import { RoleManagementUtils } from "@wso2is/admin.roles.v2/utils/role-management-utils";
import { RenderChip } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/render-chip";
import { RoleConstants, Schemas } from "@wso2is/admin.roles.v2/constants";
import { StepEditSectionsInterface } from "../../models/users";

type StepUsersPropsInterface = IdentifiableComponentInterface & StepEditSectionsInterface;

export const StepUsersList: FunctionComponent<StepUsersPropsInterface> = (
    props: StepUsersPropsInterface
): ReactElement => {
    const { initialValues, isReadOnly, activeUserStore, onUsersChange } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const primaryUserStoreDomainName: string = useSelector(
        (state: AppState) => state?.config?.ui?.primaryUserStoreDomainName
    );

    const [userSearchValue, setUserSearchValue] = useState<string>(undefined);
    const [isUserSearchLoading, setUserSearchLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<UserBasicInterface[]>([]);
    const [activeOption, setActiveOption] = useState<GroupsInterface | UserBasicInterface>(undefined);
    const [availableUserStores, setAvailableUserStores] = useState<UserStoreDropdownItem[]>([]);
    const [selectedUserStoreDomainName, setSelectedUserStoreDomainName] = useState<string>(
        userstoresConfig.primaryUserstoreName
    );
    const [isPlaceholderVisible, setIsPlaceholderVisible] = useState<boolean>(true);
    const [selectedUsersFromUserStore, setSelectedUsersFromUserStore] = useState<UserBasicInterface[]>([]);
    const [selectedAllUsers, setSelectedAllUsers] = useState<Record<string, UserBasicInterface[] | undefined>>({});
    const [allUsers, setAllUsers] = useState<UserBasicInterface[]>([]);

    const { data: userStores, isLoading: isUserStoresLoading } = useUserStores(null);

    useEffect(() => {
        if (userStores && !isUserStoresLoading) {
            const storeOptions: UserStoreDropdownItem[] = [
                {
                    key: -1,
                    text: userstoresConfig?.primaryUserstoreName,
                    value: userstoresConfig?.primaryUserstoreName
                }
            ];

            let storeOption: UserStoreDropdownItem = {
                key: null,
                text: "",
                value: ""
            };

            userStores?.forEach((store: UserStoreListItem, index: number) => {
                if (store?.name?.toUpperCase() !== userstoresConfig?.primaryUserstoreName) {
                    getAUserStore(store.id).then((response: UserStorePostData) => {
                        const isDisabled: boolean =
                            response.properties.find((property: UserStoreProperty) => property.name === "Disabled")
                                ?.value === "true";

                        if (!isDisabled) {
                            storeOption = {
                                key: index,
                                text: store.name,
                                value: store.name
                            };
                            storeOptions.push(storeOption);
                        }
                    });
                }
            });

            setAvailableUserStores(storeOptions);
        }
    }, [userStores, isUserStoresLoading]);

    const {
        data: userResponse,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError
    } = useUsersList(
        null,
        null,
        userSearchValue ? `userName co ${userSearchValue}` : null,
        null,
        selectedUserStoreDomainName,
        null,
        !!selectedUserStoreDomainName || !!userSearchValue
    );

    const isUserBelongToSelectedUserStore = (user: UserBasicInterface, userStoreName: string) => {
        const userNameChunks: string[] = user.userName.split("/");

        return (
            (userNameChunks.length === 1 &&
                StringUtils.isEqualCaseInsensitive(userStoreName, primaryUserStoreDomainName)) ||
            (userNameChunks.length === 2 && StringUtils.isEqualCaseInsensitive(userNameChunks[0], userStoreName))
        );
    };

    useEffect(() => {
        if (activeUserStore) {
            setSelectedUserStoreDomainName(activeUserStore);
        } else {
            setSelectedUserStoreDomainName(userstoresConfig.primaryUserstoreName);
        }
    }, [activeUserStore]);

    useEffect(() => {
        setSelectedUserStoreDomainName(userstoresConfig.primaryUserstoreName);
    }, [selectedUserStoreDomainName]);

    useEffect(() => {
        onUsersChange(selectedUsersFromUserStore);
    }, [selectedUsersFromUserStore, onUsersChange]);

    // const fetchAllUsers = async () => {
    //     try {
    //         const response = await getUsersList(null); // fetch all users
    //         setAllUsers(response?.data?.Resources || []);
    //     } catch (error) {
    //         console.error("Error fetching all users:", error);
    //     }
    // };
    

    // useEffect(() => {
    //     fetchAllUsers(); // Only fetch once
    // }, []);

    useEffect(() => {
        console.log("Fetched Users: ", allUsers);
    }, [allUsers]);

    useEffect(() => {
        if (!initialValues || !userResponse?.Resources.length) return;

        const stepUsers = initialValues?.users;
        setAllUsers(userResponse.Resources);
        console.log("Initial Users in this step are ", stepUsers);
        const matchedUsers = userResponse.Resources.filter((user: UserBasicInterface) =>
            stepUsers.includes(user.userName)
        );
        setSelectedUsersFromUserStore(matchedUsers);
    }, [initialValues]);

    useEffect(()=>{
        console.log("Selected Users", selectedUsersFromUserStore)
    },[selectedUsersFromUserStore])

    /**
     * Set available to select users.
     */
    useEffect(() => {
        if (!isReadOnly && userResponse?.totalResults > 0 && Array.isArray(userResponse?.Resources)) {
            const usersAvailableToSelect: UserBasicInterface[] =
                userResponse?.Resources?.filter((user: UserBasicInterface) => {
                    const isUserInSelectedUserStore: boolean = isUserBelongToSelectedUserStore(
                        user,
                        selectedUserStoreDomainName
                    );

                    const isUserAlreadySelected: boolean =
                        selectedUsersFromUserStore?.find(
                            (selectedUser: UserBasicInterface) => selectedUser.id === user.id
                        ) !== undefined;

                    return !isUserAlreadySelected && isUserInSelectedUserStore;
                }) ?? [];

            setUsers(usersAvailableToSelect);
        } else {
            setUsers([]);
        }
    }, [userResponse, selectedUsersFromUserStore]);

    /**
     * Show error if user list fetch request failed
     */
    useEffect(() => {
        if (userListFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("roles:edit.users.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("roles:edit.users.notifications.fetchError.message")
                })
            );
        }
    }, [userListFetchRequestError]);

    /**
     * Get the place holder components.
     *
     * @returns - place holder components
     */
    const getPlaceholders = () => {
        return (
            <EmptyPlaceholder
                subtitle={[t("roles:edit.users.placeholders.emptyPlaceholder.subtitles.0")]}
                title={t("roles:edit.users.placeholders.emptyPlaceholder.title")}
                image={getEmptyPlaceholderIllustrations().emptyList}
                imageSize="tiny"
                action={
                    !isReadOnly ? (
                        <PrimaryButton onClick={() => setIsPlaceholderVisible(false)}>
                            <Icon name="plus" />
                            {t("roles:edit.users.placeholders.emptyPlaceholder" + ".action")}
                        </PrimaryButton>
                    ) : null
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
            onUsersChange(
                Object.values(selectedAllUsers)
                    .filter(users => users !== undefined)
                    .flat()
            );
        }
    };

    /**
     * Handles the search query for the users list.
     */
    const searchUsers: DebouncedFunc<(query: string) => void> = useCallback(
        debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setUserSearchValue(query);
        }, RoleConstants.DEBOUNCE_TIMEOUT),
        []
    );

    return (
        <>
            {users && availableUserStores && !isReadOnly && (
                <Grid container spacing={1} alignItems="center" className="full-width">
                    {!activeUserStore && (
                        <>
                            <Grid md={1.5}>
                                <label>Users</label>
                            </Grid>
                            <Grid xs={12} sm={4} md={3.5} alignItems="center">
                                <Select
                                    value={selectedUserStoreDomainName}
                                    onChange={(e: SelectChangeEvent<unknown>) => {
                                        updateSelectedAllUsers();
                                        setSelectedUsersFromUserStore([]);
                                        setSelectedUserStoreDomainName(e.target.value as string);
                                    }}
                                    fullWidth
                                    sx={{ height: 38 }}
                                >
                                    {isUserStoresLoading ? (
                                        <p>{t("common:loading")}</p>
                                    ) : (
                                        availableUserStores?.map((userstore: UserStoreDropdownItem) => (
                                            <MenuItem key={userstore.key} value={userstore.value}>
                                                {userstore.text}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </Grid>
                        </>
                    )}
                    <Grid xs={12} sm={4} md={7}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            loading={isUserListFetchRequestLoading || isUserSearchLoading}
                            options={users}
                            value={selectedUsersFromUserStore}
                            getOptionLabel={(user: UserBasicInterface) => RoleManagementUtils.getUserUsername(user)}
                            renderInput={(params: AutocompleteRenderInputParams) => (
                                <TextField
                                    {...params}
                                    placeholder={t("roles:edit.users" + ".actions.assign.placeholder")}
                                />
                            )}
                            onChange={(event: SyntheticEvent, users: UserBasicInterface[]) => {
                                setSelectedUsersFromUserStore(users);
                            }}
                            filterOptions={(users: UserBasicInterface[]) => users}
                            onInputChange={(_event: SyntheticEvent, searchTerm: string) => {
                                setUserSearchLoading(true);
                                searchUsers(searchTerm);
                            }}
                            isOptionEqualToValue={(option: UserBasicInterface, value: UserBasicInterface) =>
                                option.id === value.id
                            }
                            renderTags={(value: UserBasicInterface[], getTagProps: AutocompleteRenderGetTagProps) =>
                                value.map((option: UserBasicInterface, index: number) => (
                                    <RenderChip
                                        {...getTagProps({ index })}
                                        key={index}
                                        primaryText={RoleManagementUtils.getUserUsername(option)}
                                        userStore={RoleManagementUtils.getUserStore(option.userName)}
                                        option={option}
                                        activeOption={activeOption}
                                        setActiveOption={setActiveOption}
                                        variant="filled"
                                    />
                                ))
                            }
                            renderOption={(
                                props: HTMLAttributes<HTMLLIElement>,
                                option: UserBasicInterface,
                                { selected }: { selected: boolean }
                            ) => (
                                <AutoCompleteRenderOption
                                    selected={selected}
                                    subTitle={RoleManagementUtils.getUserUsername(option)}
                                    displayName={RoleManagementUtils.getNameToDisplayOfUser(option)}
                                    userstore={RoleManagementUtils.getUserStore(option.userName)}
                                    renderOptionProps={props}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
StepUsersList.defaultProps = {
    "data-componentid": "create-step-users"
};
