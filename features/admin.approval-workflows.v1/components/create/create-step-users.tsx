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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { AutoCompleteRenderOption } from
    "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/auto-complete-render-option";
import { RenderChip } from "@wso2is/admin.roles.v2/components/edit-role/edit-role-common/render-chip";
import { RoleConstants } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RoleManagementUtils } from "@wso2is/admin.roles.v2/utils/role-management-utils";
import { useUsersList } from "@wso2is/admin.users.v1/api";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { StepEditSectionsInterface } from "../../models/ui";

type StepUsersPropsInterface = IdentifiableComponentInterface & StepEditSectionsInterface;

const StepUsersList: FunctionComponent<StepUsersPropsInterface> = (
    props: StepUsersPropsInterface
): ReactElement => {
    const {
        initialValues,
        isReadOnly,
        activeUserStore,
        onUsersChange,
        showValidationError,
        ["data-componentid"]: componentId = "workflow-model-approval-step-users"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ userSearchValue, setUserSearchValue ] = useState<string>(undefined);
    const [ isUserSearchLoading, setUserSearchLoading ] = useState<boolean>(false);
    const [ users, setUsers ] = useState<UserBasicInterface[]>([]);
    const [ activeOption, setActiveOption ] = useState<GroupsInterface | UserBasicInterface>(undefined);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ validationError, setValidationError ] = useState<boolean>(false);
    const [ hasInitialized, setHasInitialized ] = useState<boolean>(false);

    const {
        data: userResponse,
        isLoading: isUserListFetchRequestLoading,
        error: userListFetchRequestError
    } = useUsersList(
        null,
        null,
        userSearchValue ? `userName co ${userSearchValue}` : null,
        null,
        null,
        null
    );

    useEffect(() => {
        setValidationError(showValidationError);
    },[ showValidationError ]);

    useEffect(() => {
        onUsersChange(selectedUsers);
    }, [ selectedUsers, onUsersChange ]);

    /**
     * Pre-selects users based on initial form values once user data is available.
     * Only runs on first initialization to prevent resetting manual selections.
     */
    useEffect(() => {
        if (!initialValues || !userResponse?.Resources?.length || hasInitialized) return;

        const stepUsers: string[] = initialValues?.users;

        if (stepUsers?.length > 0) {
            const matchedUsers: UserBasicInterface[] = userResponse.Resources.filter((user: UserBasicInterface) =>
                stepUsers.includes(user.id)
            );

            setSelectedUsers(matchedUsers);
        }

        setHasInitialized(true);
    }, [ initialValues, userResponse ]);

    /**
     * Set available to select users.
     */
    useEffect(() => {
        if (!isReadOnly && userResponse?.totalResults > 0 && Array.isArray(userResponse?.Resources)) {
            setUsers(userResponse.Resources);
        } else {
            setUsers([]);
        }
        setUserSearchLoading(false);
    }, [ userResponse, selectedUsers ]);

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
    }, [ userListFetchRequestError ]);

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
            { users && (
                <Grid
                    container
                    spacing={ 2 }
                    alignItems="flex-start"
                    className="full-width"
                    data-componentid={ `${componentId}-userstore-users-grid` }
                >
                    { !activeUserStore && (
                        <Grid
                            xs={ 12 }
                            sm={ 2 }
                            md={ 2 }
                            data-componentid={ `${componentId}-field-userstore-label` }
                        >
                            <label>{ t("approvalWorkflows:forms.configurations.template.users.label") }</label>
                        </Grid>
                    ) }
                    <Grid
                        xs={ 12 }
                        sm={ 10 }
                        md={ activeUserStore ? 12 : 10 }
                        data-componentid={ `${componentId}-field-user-autocomplete` }
                    >
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            loading={ isUserListFetchRequestLoading || isUserSearchLoading }
                            options={ users }
                            value={ selectedUsers }
                            disabled={ isReadOnly }
                            getOptionLabel={ (user: UserBasicInterface) => RoleManagementUtils.getUserUsername(user) }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <TextField
                                    { ...params }
                                    placeholder={ "Type user/s to search and assign" }
                                    error={ validationError }
                                    helperText={
                                        validationError
                                            ? "At least one of the options should be completed"
                                            : ""
                                    }
                                    data-componentid={ `${componentId}-field-user-search` }
                                />
                            ) }
                            onChange={ (event: SyntheticEvent, users: UserBasicInterface[]) => {
                                setSelectedUsers(users);
                            } }
                            filterOptions={ (users: UserBasicInterface[]) => users }
                            onInputChange={ (_event: SyntheticEvent, searchTerm: string) => {
                                setUserSearchLoading(true);
                                searchUsers(searchTerm);
                            } }
                            isOptionEqualToValue={ (option: UserBasicInterface, value: UserBasicInterface) =>
                                option.id === value.id
                            }
                            renderTags={ (value: UserBasicInterface[], getTagProps: AutocompleteRenderGetTagProps) =>
                                value.map((option: UserBasicInterface, index: number) => (
                                    <RenderChip
                                        { ...getTagProps({ index }) }
                                        key={ index }
                                        primaryText={ RoleManagementUtils.getUserUsername(option) }
                                        userStore={ RoleManagementUtils.getUserStore(option.userName) }
                                        option={ option }
                                        activeOption={ activeOption }
                                        setActiveOption={ setActiveOption }
                                        variant="filled"
                                        data-componentid={ `${componentId}-chip-selected-user-${option.id}` }
                                    />
                                ))
                            }
                            renderOption={ (
                                props: HTMLAttributes<HTMLLIElement>,
                                option: UserBasicInterface,
                                { selected }: { selected: boolean }
                            ) => (
                                <AutoCompleteRenderOption
                                    selected={ selected }
                                    subTitle={ RoleManagementUtils.getUserUsername(option) }
                                    displayName={ RoleManagementUtils.getNameToDisplayOfUser(option) }
                                    userstore={ RoleManagementUtils.getUserStore(option.userName) }
                                    renderOptionProps={ props }
                                    data-componentid={ `${componentId}-option-user-${option.id}` }
                                />
                            ) }
                        />
                    </Grid>
                </Grid>

            ) }
        </>
    );
};

export default StepUsersList;
