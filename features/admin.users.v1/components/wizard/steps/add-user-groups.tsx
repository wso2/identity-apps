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

import { useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

/**
 * Proptypes for the application consents list component.
 */
interface AddConsumerUserGroupPropsInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    selectedUserStore: string;
    selectedGroupsList: GroupsInterface[];
    setSelectedGroupList: (groups: GroupsInterface[]) => void;
}

/**
 * Add user groups component.
 *
 * @returns add user groups component.
 */
export const AddUserGroups: FunctionComponent<AddConsumerUserGroupPropsInterface> = (
    props: AddConsumerUserGroupPropsInterface): ReactElement => {

    const {
        triggerSubmit,
        onSubmit,
        selectedUserStore,
        selectedGroupsList,
        setSelectedGroupList
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ , setIsSelectUnassignedAllGroupsChecked ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);

    const excludedAttributes: string = "members";

    const {
        data: originalGroupList,
        error: groupsListFetchRequestError
    } = useGroupList(
        null,
        null,
        searchQuery,
        selectedUserStore,
        excludedAttributes
    );

    /**
     * Show error if group list fetch request failed.
     */
    useEffect(() => {
        if (groupsListFetchRequestError) {
            if (groupsListFetchRequestError.response && groupsListFetchRequestError.response.data &&
                groupsListFetchRequestError.response.data.description) {
                dispatch(
                    addAlert({
                        description: groupsListFetchRequestError.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.edit.groups.notifications.fetchError.message")
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    description: t("console:manage.features.roles.edit.groups.notifications.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.roles.edit.groups.notifications.fetchError.message")
                })
            );
        }
    }, [ groupsListFetchRequestError ]);

    const handleUnselectedListSearch: DebouncedFunc<(e: FormEvent<HTMLInputElement>, query: string) => void>
    = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        if (isEmpty(query.trim())) {
            setSearchQuery(null);
        } else {
            const processedQuery: string = "displayName co " + query;

            setSearchQuery(processedQuery);
        }
    }, 1000), []);

    // Commented when the select all option for groups was removed.
    // Uncomment if select all option is reintroduced.
    // /**
    //  * The following function enables the user to select all the roles at once.
    //  */
    // const selectAllUnAssignedList = () => {
    //     if (!isSelectUnassignedGroupsAllRolesChecked) {
    //         setCheckedUnassignedListItems(initialValues?.groupList);
    //         handleTempListChange(initialValues?.groupList);
    //     } else {
    //         setCheckedUnassignedListItems([]);
    //     }
    //     setIsSelectUnassignedAllGroupsChecked(!isSelectUnassignedGroupsAllRolesChecked);
    // };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups: GroupsInterface[] = !isEmpty(selectedGroupsList)
            ? [ ...selectedGroupsList ]
            : [];

        const groupIndex: number = checkedGroups.findIndex(
            (selectedGroup: GroupsInterface) => selectedGroup.id === group.id);

        if (groupIndex !== -1) {
            checkedGroups.splice(groupIndex, 1);
        } else {
            checkedGroups.push(group);
        }

        setSelectedGroupList(checkedGroups);
        setIsSelectUnassignedAllGroupsChecked(originalGroupList?.Resources?.length === checkedGroups.length);
    };

    return (
        <Forms
            onSubmit={ () => {
                onSubmit({ groups: selectedGroupsList });
            } }
            submitState={ triggerSubmit }
        >
            <TransferComponent
                selectionComponent
                searchPlaceholder={ t("transferList:searchPlaceholder",
                    { type: "Groups" }) }
                handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                    handleUnselectedListSearch(e, value);
                } }
                data-testid="user-mgt-add-user-wizard-modal"
            >
                <TransferList
                    isListEmpty={ !(originalGroupList?.Resources?.length > 0) }
                    listType="unselected"
                    emptyPlaceholderContent={ t("transferList:list.emptyPlaceholders." +
                        "users.roles.unselected", { type: "groups" }) }
                    data-testid="user-mgt-add-user-wizard-modal-unselected-transfer-list"
                    emptyPlaceholderDefaultContent={ t("transferList:list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        originalGroupList?.Resources?.map((group: GroupsInterface, index: number)=> {
                            const groupNameSegments: string[] = group.displayName?.split("/");
                            const groupName: string = groupNameSegments.length > 1
                                ? groupNameSegments[1]
                                : groupNameSegments[0];

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleUnassignedItemCheckboxChange(group) }
                                    key={ index }
                                    listItem={ groupName }
                                    listItemId={ group.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ null }
                                    isItemChecked={ selectedGroupsList.findIndex((item: GroupsInterface) =>
                                        item.id === group.id) !== -1 }
                                    showSecondaryActions={ false }
                                    data-testid="user-mgt-add-user-wizard-modal-unselected-groups"
                                />
                            );
                        })
                    }
                </TransferList>
            </TransferComponent>
        </Forms>
    );
};
