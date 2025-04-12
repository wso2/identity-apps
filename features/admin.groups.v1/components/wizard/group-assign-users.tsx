/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { useUsersList } from "@wso2is/admin.users.v1/api/users";
import { UserManagementUtils, generateAttributesString } from "@wso2is/admin.users.v1/utils";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue } from "@wso2is/forms";
import {
    Heading,
    Hint,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FormEvent,
    FunctionComponent,
    ReactElement,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch as ReduxDispatch } from "redux";
import { Header } from "semantic-ui-react";
import { GroupBasics } from "./group-basics";
import { GroupsMemberInterface } from "../../models/groups";

/**
 * Proptypes for the application consents list component.
 */
interface AddGroupUserProps extends IdentifiableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: ({ basic, users }: { basic: any; users: UserBasicInterface[]; }) => void;
    assignedUsers?: GroupsMemberInterface[];
    isEdit: boolean;
    selectedUserStore: string;
    initialValues?: { basic: any; users: UserBasicInterface[]; };
    onUserFetchRequestFinish?: () => void;
    setSelectedUserStore: (userStore: string) => void;
}

export const AddGroupUsers: FunctionComponent<AddGroupUserProps> = (props: AddGroupUserProps): ReactElement => {
    const {
        triggerSubmit,
        onSubmit,
        assignedUsers,
        initialValues,
        selectedUserStore,
        setSelectedUserStore,
        onUserFetchRequestFinish,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: ReduxDispatch = useDispatch();

    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);

    const userListMetaContent: Map<string, string> = new Map<string, string>([
        [ "name", "name" ],
        [ "emails", "emails" ],
        [ "name", "name" ],
        [ "userName", "userName" ],
        [ "id", "" ],
        [ "profileUrl", "profileUrl" ],
        [ "meta.lastModified", "meta.lastModified" ],
        [ "meta.created", "" ]
    ]);

    const attributes: string = generateAttributesString(userListMetaContent.values());

    const {
        data: originalUserList,
        isLoading: isUsersFetchRequestLoading,
        error: userListFetchRequestError
    } = useUsersList(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        null,
        searchQuery,
        attributes,
        selectedUserStore
    );

    useEffect(() => {
        if (originalUserList?.Resources) {
            // Exclude JIT users.
            const responseUsers: UserBasicInterface[] = originalUserList?.Resources?.filter(
                (user: UserBasicInterface) => !user[ SCIMConfigs.scim.systemSchema ]?.userSourceId);

            if (responseUsers) {
                responseUsers.sort((userObject: UserBasicInterface, comparedUserObject: UserBasicInterface) =>
                    userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                );
                setUsersList(responseUsers);
            }

            if (assignedUsers && assignedUsers.length !== 0) {
                const selectedUserList: UserBasicInterface[] = [];

                if (responseUsers && responseUsers instanceof Array) {
                    responseUsers.slice().reverse().forEach((user: UserBasicInterface) => {
                        assignedUsers.forEach((assignedUser: GroupsMemberInterface) => {
                            if (user.id === assignedUser.value) {
                                selectedUserList.push(user);
                                responseUsers.splice(responseUsers.indexOf(user), 1);
                            }
                        });
                    });
                    selectedUserList.sort(
                        (userObject: UserBasicInterface, comparedUserObject: UserBasicInterface) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                    );
                }

                setCheckedAssignedListItems(selectedUserList);
            }
        } else {
            setUsersList([]);
        }
    }, [ originalUserList ]);

    useEffect(() => {
        if (userListFetchRequestError) {
            dispatch(addAlert({
                description: userListFetchRequestError?.response?.data?.description
                    ?? t("users:notifications.fetchUsers.error.description"),
                level: AlertLevels.ERROR,
                message: userListFetchRequestError?.response?.data?.message
                    ?? t("users:notifications.fetchUsers.error.message")
            }));

            setUsersList([]);
        }
    }, [ userListFetchRequestError ]);

    useEffect(() => {
        if (!isUsersFetchRequestLoading) {
            onUserFetchRequestFinish();
        }
    }, [ isUsersFetchRequestLoading ]);

    useEffect(() => {
        if (initialValues?.users) {
            setCheckedAssignedListItems(initialValues?.users);
        }
    }, [ initialValues ]);

    const handleUnselectedListSearch: DebouncedFunc<(e: FormEvent<HTMLInputElement>, query: string) => void>
    = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        if (isEmpty(query.trim())) {
            setSearchQuery(null);
        } else {
            const processedQuery: string = "userName co " + query;

            setSearchQuery(processedQuery);
        }
    }, 1000), []);

    const handleAssignedItemCheckboxChange = (role: UserBasicInterface) => {
        setCheckedAssignedListItems((prevCheckedItems: UserBasicInterface[]) => {
            return prevCheckedItems.some((user: UserBasicInterface) => user.id === role.id)
                ? prevCheckedItems.filter((user: UserBasicInterface) => user.id !== role.id)
                : [ ...prevCheckedItems, role ];
        });
    };

    const resolveListItemElement = (listItemValue: string) => {
        return (
            <div data-suppress="">
                { listItemValue }
            </div>
        );
    };

    return (
        <>
            <GroupBasics
                data-componentid="add-group-form"
                triggerSubmit={ triggerSubmit }
                initialValues={ initialValues?.basic }
                userStore={ selectedUserStore }
                setUserStore={ setSelectedUserStore }
                onSubmit={ (values: Map<string, FormValue> ) => {
                    onSubmit({
                        basic: values,
                        users: checkedAssignedListItems
                    });
                } }
            />
            <Heading as="h5" className="mt-3">Add Users</Heading>
            <Hint>
                { t("roles:addRoleWizard.users.assignUserModal.hint") }
            </Hint>
            <TransferComponent
                compact
                basic
                bordered
                className="one-column-selection"
                selectionComponent
                searchPlaceholder={
                    t("roles:addRoleWizard.users.assignUserModal.list" +
                        ".searchPlaceholder")
                }
                isLoading={ isUsersFetchRequestLoading }
                handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>,
                    { value }: { value: string }) => {
                    handleUnselectedListSearch(e, value);
                } }
                data-componentid={ `${ componentId }-transfer-component` }
            >
                <TransferList
                    selectionComponent
                    isListEmpty={ !isUsersFetchRequestLoading && usersList?.length < 1 }
                    isLoading={ isUsersFetchRequestLoading }
                    listType="unselected"
                    emptyPlaceholderContent = { "We couldn't find any results for search. "+
                        "Please try a different search term." }
                    data-componentid={ `${ componentId }-unselected-transfer-list` }
                    emptyPlaceholderDefaultContent={ t("transferList:list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        usersList?.map((user: UserBasicInterface, index: number) => {
                            const header: string = user?.userName;
                            const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                    key={ index }
                                    listItem={ {
                                        listItemElement: resolveListItemElement(header),
                                        listItemValue: header
                                    } }
                                    listItemId={ user.id }
                                    listItemIndex={ index }
                                    isItemChecked={
                                        checkedAssignedListItems?.filter((item: UserBasicInterface) =>
                                            item?.id === user?.id).length > 0
                                    }
                                    showSecondaryActions={ false }
                                    showListSubItem={ true }
                                    listSubItem={ subHeader && header !== subHeader && (
                                        <Header as="h6">
                                            <Header.Content>
                                                <Header.Subheader
                                                    data-componentid={ `${ componentId }-item-sub-heading` }
                                                >
                                                    { subHeader }
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    ) }
                                    data-componentid={
                                        `${ componentId }-unselected-transfer-list-item-${ index }`
                                    }
                                />
                            );
                        } )
                    }
                </TransferList>
            </TransferComponent>
        </>
    );
};
