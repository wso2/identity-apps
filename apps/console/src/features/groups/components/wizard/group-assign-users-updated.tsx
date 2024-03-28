/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue } from "@wso2is/forms";
import {
    ContentLoader,
    Heading,
    Hint,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Dispatch,
    FormEvent,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch as ReduxDispatch } from "redux";
import { Header, Segment } from "semantic-ui-react";
import { GroupBasicsUpdated } from "./group-basics-updated";
import { SCIMConfigs } from "../../../../extensions/configs/scim";
import { UIConstants, UserBasicInterface, UserListInterface, getUsersList } from "../../../core";
import { UserManagementUtils } from "../../../users/utils";
import { GroupsMemberInterface } from "../../models";

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

export const AddGroupUsersUpdated: FunctionComponent<AddGroupUserProps> = (props: AddGroupUserProps): ReactElement => {
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

    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ initialUserList, setInitialUserList ] = useState<UserBasicInterface[]>([]);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ listOffset ] = useState<number>(0);
    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);

    const [ isSelectAllAssignedUsers ] = useState<boolean>(false);

    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);

    const dispatch: ReduxDispatch = useDispatch();

    useEffect(() => {
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            [ "name", "name" ],
            [ "emails", "emails" ],
            [ "name", "name" ],
            [ "userName", "userName" ],
            [ "id", "" ],
            [ "profileUrl", "profileUrl" ],
            [ "meta.lastModified", "meta.lastModified" ],
            [ "meta.created", "" ]
        ]));
    }, []);

    useEffect(() => {
        if (isSelectAllAssignedUsers) {
            setCheckedAssignedListItems(usersList);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAllAssignedUsers ]);

    useEffect(() => {
        if (userListMetaContent) {
            const attributes: string = generateAttributesString(userListMetaContent.values());

            getList(listItemLimit, listOffset, null, attributes, selectedUserStore);
        }
    }, [ listOffset, listItemLimit, selectedUserStore ]);

    useEffect(() => {
        if (initialValues?.users) {
            setCheckedAssignedListItems(initialValues?.users);
        }
    }, [ initialValues ]);

    const getList = (limit: number, offset: number, filter: string, attribute: string, userStore: string) => {
        setIsUsersFetchRequestLoading(true);
        getUsersList(limit, offset, filter, null, userStore)
            .then((response: UserListInterface) => {
                // Exclude JIT users.
                const responseUsers: UserBasicInterface[] = response?.Resources?.filter(
                    (user: UserBasicInterface) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId);

                if (responseUsers) {
                    responseUsers.sort((userObject: UserBasicInterface, comparedUserObject: UserBasicInterface) =>
                        userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                    );
                    setUsersList(responseUsers);
                    setInitialUserList(responseUsers);
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
                }
            })
            .catch((error: AxiosError) => {
                setUsersList([]);
                setInitialUserList([]);
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("users:notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("users:notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("users:notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.fetchUsers.genericError.message")
                }));

            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
                onUserFetchRequestFinish();
            });
    };

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @returns attribute string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray: string[] = [];
        const iterator1: IterableIterator<string> = attributeMap[ Symbol.iterator ]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
        stateAction: Dispatch<SetStateAction<any>>) => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!isEmpty(query)) {
            const regExp: RegExp = new RegExp(escapeRegExp(query), "i");

            list?.map((user: UserBasicInterface) => {
                isMatch = regExp.test(user.userName) || (user.name && regExp.test(user.name.givenName))
                    || (user.name && regExp.test(user.name.familyName));

                if (isMatch) {
                    filteredRoleList.push(user);
                }
            });

            stateAction(filteredRoleList);

            return;
        }

        stateAction(list);

        return;
    };

    const handleAssignedItemCheckboxChange = (role: any) => {
        const checkedGroups: any = [ ...checkedAssignedListItems ];

        if (checkedGroups.includes(role)) {
            checkedGroups.splice(checkedGroups.indexOf(role), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(role);
            setCheckedAssignedListItems(checkedGroups);
        }
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
            <GroupBasicsUpdated
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
            { isUsersFetchRequestLoading
                ? <Segment basic><ContentLoader className="p-3" active /></Segment>
                : initialUserList?.length > 0 &&
                (
                    <>
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
                                { value }: { value: string; }) => {
                                handleSearchFieldChange(e, value, initialUserList, setUsersList);
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
                ) }
        </>
    );
};
