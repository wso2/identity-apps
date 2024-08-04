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

import { RolesInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Proptypes for the application consents list component.
 */
interface AddConsumerUserGroupPropsInterface {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    handleGroupListChange: (groups: any) => void;
    handleTempListChange: (groups: any) => void;
    handleInitialTempListChange: (groups: any) => void;
    handleInitialGroupListChange: (groups: any) => void;
    handleSetGroupId: (groupId: string) => void;
}

/**
 * Add user groups component.
 *
 * @returns add user groups component.
 */
export const AddUserGroups: FunctionComponent<AddConsumerUserGroupPropsInterface> = (
    props: AddConsumerUserGroupPropsInterface): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleGroupListChange,
        handleTempListChange,
        handleInitialTempListChange,
        handleSetGroupId
    } = props;

    const { t } = useTranslation();

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesInterface[]>([]);
    const [ , setIsSelectUnassignedAllGroupsChecked ] = useState(false);

    useEffect(() => {
        setCheckedUnassignedListItems(initialValues?.tempGroupList);
    }, [ initialValues?.tempGroupList ]);

    /**
     * The following method handles the onChange event of the
     * search field. It matches the string pattern of the user
     * input value with the elements of the user list.
     *
     * @param e - Click event.
     * @param value - Input value of the field
     */
    const handleUnselectedListSearch = (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
        let isMatch: boolean = false;
        const filteredGroupList: any[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            initialValues.initialGroupList && initialValues.initialGroupList.map((group: any) => {
                isMatch = re.test(group.displayName);
                if (isMatch) {
                    filteredGroupList.push(group);
                    handleGroupListChange(filteredGroupList);
                }
            });
        } else {
            handleGroupListChange(initialValues?.initialGroupList);
        }
    };

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
    const handleUnassignedItemCheckboxChange = (group: any) => {
        const checkedGroups: RolesInterface[] = [ ...checkedUnassignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
        } else {
            checkedGroups.push(group);
        }
        handleTempListChange(checkedGroups);
        handleInitialTempListChange(checkedGroups);
        setIsSelectUnassignedAllGroupsChecked(initialValues?.groupList?.length === checkedGroups.length);
    };

    return (
        <Forms
            onSubmit={ () => {
                onSubmit({ groups: initialValues?.tempGroupList });
            } }
            submitState={ triggerSubmit }
        >
            <TransferComponent
                selectionComponent
                searchPlaceholder={ t("transferList:searchPlaceholder",
                    { type: "Groups" }) }
                handleUnelectedListSearch={ handleUnselectedListSearch }
                data-testid="user-mgt-add-user-wizard-modal"
            >
                <TransferList
                    isListEmpty={ !(initialValues?.groupList?.length > 0) }
                    listType="unselected"
                    emptyPlaceholderContent={ t("transferList:list.emptyPlaceholders." +
                        "users.roles.unselected", { type: "groups" }) }
                    data-testid="user-mgt-add-user-wizard-modal-unselected-transfer-list"
                    emptyPlaceholderDefaultContent={ t("transferList:list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        initialValues?.groupList?.map((group: any, index: number)=> {
                            const groupName: string = group?.displayName?.split("/");

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleUnassignedItemCheckboxChange(group) }
                                    key={ index }
                                    listItem={ groupName?.length > 1 ? groupName[1] : group?.displayName }
                                    listItemId={ group.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ null }
                                    isItemChecked={ checkedUnassignedListItems?.includes(group) }
                                    showSecondaryActions={ false }
                                    handleOpenPermissionModal={ () => handleSetGroupId(group.id) }
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
