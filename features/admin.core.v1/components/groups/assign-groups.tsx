/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import { RolesInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

/**
 * Proptypes for the assign group component.
 */
interface AssignGroupsPropsInterface {
    initialValues: any;
    triggerSubmit?: boolean;
    onSubmit?: (values: any) => void;
    handleGroupListChange: (groups: any) => void;
    handleTempListChange: (groups: any) => void;
    handleInitialTempListChange: (groups: any) => void;
    handleInitialGroupListChange: (groups: any) => void;
}

/**
 * Assign Group component.
 *
 * @returns ReactElement
 */
export const AssignGroups: FunctionComponent<AssignGroupsPropsInterface> = (
    props: AssignGroupsPropsInterface): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleGroupListChange,
        handleTempListChange,
        handleInitialTempListChange,
        handleInitialGroupListChange
    } = props;

    const { t } = useTranslation();

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RolesInterface[]>([]);
    const [ isSelectUnassignedGroupsAllRolesChecked, setIsSelectUnassignedAllGroupsChecked ] = useState(false);
    const [ isSelectAssignedAllGroupsChecked, setIsSelectAssignedAllGroupsChecked ] = useState(false);

    useEffect(() => {
        if (isSelectAssignedAllGroupsChecked) {
            setCheckedAssignedListItems(initialValues?.tempGroupList);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAssignedAllGroupsChecked ]);

    useEffect(() => {
        if (isSelectUnassignedGroupsAllRolesChecked) {
            setCheckedUnassignedListItems(initialValues?.groupList);
        } else {
            setCheckedUnassignedListItems([]);
        }
    }, [ isSelectUnassignedGroupsAllRolesChecked ]);

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
        const filteredGroupList: GroupsInterface[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            initialValues.groupList && initialValues.groupList.map((group: GroupsInterface) => {
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

    const handleSelectedListSearch = (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
        let isMatch: boolean = false;
        const filteredGroupList: GroupsInterface[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            initialValues.tempGroupList && initialValues.tempGroupList.map((group: GroupsInterface) => {
                isMatch = re.test(group.displayName);
                if (isMatch) {
                    filteredGroupList.push(group);
                    handleTempListChange(filteredGroupList);
                }
            });
        } else {
            handleTempListChange(initialValues?.initialTempGroupList);
        }
    };

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectUnassignedAllGroupsChecked(!isSelectUnassignedGroupsAllRolesChecked);
    };

    /**
     * The following function enables the user to deselect all the roles at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllGroupsChecked(!isSelectAssignedAllGroupsChecked);
    };

    /**
     * The following method handles adding list items checked in the initial
     * roles list to the assigned roles list.
     */
    const addGroups = () => {
        const addedGroups: GroupsInterface[] = [ ...initialValues?.tempGroupList ];

        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((group: GroupsInterface) => {
                if (!(initialValues?.tempGroupList?.includes(group))) {
                    addedGroups.push(group);
                }
            });
        }

        handleTempListChange(addedGroups);
        handleInitialTempListChange(addedGroups);
        handleGroupListChange(initialValues?.groupList.filter((x: GroupsInterface) => !addedGroups?.includes(x)));
        handleInitialGroupListChange(initialValues?.groupList.filter(
            (x: GroupsInterface) => !addedGroups?.includes(x)));
        setIsSelectUnassignedAllGroupsChecked(false);
    };

    /**
     * The following method handles removing list items checked in the assigned
     * roles list to the initial role list.
     */
    const removeGroups = () => {
        const removedGroups: GroupsInterface[] = [ ...initialValues?.groupList ];

        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((group: GroupsInterface) => {
                if (!(initialValues?.groupList?.includes(group))) {
                    removedGroups.push(group);
                }
            });
        }
        handleGroupListChange(removedGroups);
        handleInitialGroupListChange(removedGroups);
        handleTempListChange(initialValues?.tempGroupList?.filter((x: GroupsInterface) => !removedGroups.includes(x)));
        handleInitialTempListChange(initialValues?.tempGroupList?.filter(
            (x: GroupsInterface) => !removedGroups.includes(x)));
        setCheckedUnassignedListItems([]);
        setIsSelectAssignedAllGroupsChecked(false);
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups: GroupsInterface[] = [ ...checkedUnassignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedUnassignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedUnassignedListItems(checkedGroups);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an assigned item.
     */
    const handleAssignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups: GroupsInterface[] = [ ...checkedAssignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedAssignedListItems(checkedGroups);
        }
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param groupName - string
     */
    const createGroupLabel = (groupName: string): any => {
        const group: string[] = groupName.split("/");

        if (group.length > 1) {
            return { labelColor: "teal", labelText: group[0].toString() };
        } else {
            return {
                labelColor: "olive",
                labelText: StringUtils.isEqualCaseInsensitive(primaryUserStoreDomainName, PRIMARY_USERSTORE)
                    ? t("console:manage.features.users.userstores.userstoreOptions.primary")
                    : primaryUserStoreDomainName
            };
        }
    };

    return (
        <Forms
            onSubmit={ () => {
                onSubmit({ groups: initialValues?.tempGroupList });
            } }
            submitState={ triggerSubmit }
        >
            <TransferComponent
                searchPlaceholder={ t("transferList:searchPlaceholder",
                    { type: "groups" }) }
                addItems={ addGroups }
                removeItems={ removeGroups }
                handleUnelectedListSearch={ handleUnselectedListSearch }
                handleSelectedListSearch={ handleSelectedListSearch }
                data-testid="user-mgt-add-user-wizard-modal"
            >
                <TransferList
                    isListEmpty={ !(initialValues?.groupList?.length > 0) }
                    listType="unselected"
                    listHeaders={ [
                        t("transferList:list.headers.0"),
                        t("transferList:list.headers.1"), ""
                    ] }
                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                    isHeaderCheckboxChecked={ isSelectUnassignedGroupsAllRolesChecked }
                    emptyPlaceholderContent={ t("transferList:list." +
                    "emptyPlaceholders.roles.unselected", { type: "groups" }) }
                    data-testid="user-mgt-add-user-wizard-modal-unselected-groups-select-all-checkbox"
                    emptyPlaceholderDefaultContent={ t("transferList:list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        initialValues?.groupList?.map((group: GroupsInterface, index: number)=> {
                            const groupName: string[] = group?.displayName?.split("/");

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleUnassignedItemCheckboxChange(group) }
                                    key={ index }
                                    listItem={ groupName?.length > 1 ? groupName[1] : group?.displayName }
                                    listItemId={ group.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ createGroupLabel(group?.displayName) }
                                    isItemChecked={ checkedUnassignedListItems.includes(group) }
                                    showSecondaryActions={ false }
                                    data-testid="user-mgt-add-user-wizard-modal-unselected-groups"
                                />
                            );
                        })
                    }
                </TransferList>
                <TransferList
                    isListEmpty={ !(initialValues?.tempGroupList?.length > 0) }
                    listType="selected"
                    listHeaders={ [
                        t("transferList:list.headers.0"),
                        t("transferList:list.headers.1")
                    ] }
                    handleHeaderCheckboxChange={ selectAllAssignedList }
                    isHeaderCheckboxChecked={ isSelectAssignedAllGroupsChecked }
                    emptyPlaceholderContent={ t("transferList:list." +
                    "emptyPlaceholders.roles.selected", { type: "groups" }) }
                    data-testid="user-mgt-add-user-wizard-modal-selected-groups-select-all-checkbox"
                    emptyPlaceholderDefaultContent={ t("transferList:list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        initialValues?.tempGroupList?.map((group: GroupsInterface, index: number)=> {
                            const groupName: string[] = group?.displayName?.split("/");

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleAssignedItemCheckboxChange(group) }
                                    key={ index }
                                    listItem={ groupName?.length > 1 ? groupName[1] : group?.displayName }
                                    listItemId={ group.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ createGroupLabel(group?.displayName) }
                                    isItemChecked={ checkedAssignedListItems.includes(group) }
                                    showSecondaryActions={ false }
                                    data-testid="user-mgt-add-user-wizard-modal-selected-groups"
                                />
                            );
                        })
                    }
                </TransferList>
            </TransferComponent>
        </Forms>
    );
};
