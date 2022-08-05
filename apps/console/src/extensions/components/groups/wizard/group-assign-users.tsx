/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    Heading,
    Hint,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
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
import { Header, Segment } from "semantic-ui-react";
import { GroupBasics } from "./group-basics";
import { UIConstants, UserBasicInterface, getUsersList } from "../../../../features/core";
import { GroupsMemberInterface } from "../../../../features/groups/models";
import { SCIMConfigs } from "../../../configs/scim";
import { UserManagementUtils } from "../../users/utils";

/**
 * Proptypes for the application consents list component.
 */
interface AddGroupUserProps extends TestableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: ({ basic, users }: { basic: any; users: UserBasicInterface[]; }) => void;
    assignedUsers?: GroupsMemberInterface[];
    isEdit: boolean;
    userStore?: string;
    initialValues?: { basic: any; users: UserBasicInterface[]; };
    onUserFetchRequestFinish?: () => void;
}

export const AddGroupUsers: FunctionComponent<AddGroupUserProps> = (props: AddGroupUserProps): ReactElement => {
    const {
        triggerSubmit,
        onSubmit,
        assignedUsers,
        initialValues,
        userStore,
        onUserFetchRequestFinish,
        [ "data-testid" ]: testId
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

    useEffect(() => {
        if (isSelectAllAssignedUsers) {
            setCheckedAssignedListItems(usersList);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAllAssignedUsers ]);

    // Commented when the select all option for users was removed.
    // Uncomment if select all option is reintroduced.
    // /**
    //  * Select all assigned users
    //  */
    // const selectAllAssignedList = () => {
    //     setIsSelectAllAssignedUsers(!isSelectAllAssignedUsers);
    // };

    const getList = (limit: number, offset: number, filter: string, attribute: string, userStore: string) => {

        setIsUsersFetchRequestLoading(true);

        getUsersList(limit, offset, filter, null, userStore)
            .then((response) => {
                // Exclude JIT users.
                const responseUsers = response?.Resources?.filter(
                    (user) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId);

                if (responseUsers) {

                    responseUsers.sort((userObject, comparedUserObject) =>
                        userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                    );
                    setUsersList(responseUsers);
                    setInitialUserList(responseUsers);
                }

                if (assignedUsers && assignedUsers.length !== 0) {
                    const selectedUserList: UserBasicInterface[] = [];

                    if (responseUsers && responseUsers instanceof Array) {
                        responseUsers.slice().reverse().forEach(user => {
                            assignedUsers.forEach(assignedUser => {
                                if (user.id === assignedUser.value) {
                                    selectedUserList.push(user);
                                    responseUsers.splice(responseUsers.indexOf(user), 1);
                                }
                            });
                        });
                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );
                    }
                }

                if (initialValues && initialValues.users && initialValues.users instanceof Array) {
                    const selectedUserList: UserBasicInterface[] = [];

                    if (responseUsers && responseUsers instanceof Array) {
                        responseUsers.forEach(user => {
                            initialValues.users.forEach(assignedUser => {
                                if (user.id === assignedUser.id) {
                                    selectedUserList.push(user);
                                }
                            });
                        });
                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );
                        setUsersList(responseUsers.filter(function (user) {
                            return selectedUserList.indexOf(user) == -1;
                        }));
                    }
                }
            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
                onUserFetchRequestFinish();
            });
    };

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

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[ Symbol.iterator ]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());

            getList(listItemLimit, listOffset, null, attributes, userStore);
        }
    }, [ listOffset, listItemLimit ]);

    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
        stateAction: Dispatch<SetStateAction<any>>) => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!isEmpty(query)) {
            const regExp = new RegExp(escapeRegExp(query), "i");

            list && list.map((user: UserBasicInterface) => {
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

    const handleAssignedItemCheckboxChange = (role) => {
        const checkedGroups = [ ...checkedAssignedListItems ];

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
            <GroupBasics
                data-testid="add-group-form"
                triggerSubmit={ triggerSubmit }
                initialValues={ initialValues?.basic }
                onSubmit={ (values) => {
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
                            { t("console:manage.features.roles.addRoleWizard.users.assignUserModal.hint") }
                        </Hint>
                        <TransferComponent
                            compact
                            basic
                            bordered
                            className="one-column-selection"
                            selectionComponent
                            searchPlaceholder={
                                t("console:manage.features.roles.addRoleWizard.users.assignUserModal.list" +
                                    ".searchPlaceholder")
                            }
                            isLoading={ isUsersFetchRequestLoading }
                            handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, 
                                { value }: { value: string; }) => {
                                    handleSearchFieldChange(e, value, initialUserList, setUsersList);
                            } }
                            data-testid={ `${ testId }-transfer-component` }
                        >
                            <TransferList
                                selectionComponent
                                isListEmpty={ !isUsersFetchRequestLoading && usersList?.length < 1 }
                                isLoading={ isUsersFetchRequestLoading }
                                listType="unselected"
                                emptyPlaceholderContent = { "We couldn't find any results for search. "+
                                    "Please try a different search term." }
                                data-testid={ `${ testId }-unselected-transfer-list` }
                                emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                    + "emptyPlaceholders.default") }
                            >
                                {
                                    usersList?.map((user: UserBasicInterface, index: number) => {

                                        const header: string = UserManagementUtils.resolveUserListHeader(user);
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
                                                isItemChecked={ checkedAssignedListItems.includes(user) }
                                                showSecondaryActions={ false }
                                                showListSubItem={ true }
                                                listSubItem={ header !== subHeader && (
                                                    <Header as="h6">
                                                        <Header.Content>
                                                            <Header.Subheader
                                                                data-testid={ `${ testId }-item-sub-heading` }
                                                            >
                                                                { subHeader }
                                                            </Header.Subheader>
                                                        </Header.Content>
                                                    </Header>
                                                ) }
                                                data-testid={ `${ testId }-unselected-transfer-list-item-${ index }` }
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
