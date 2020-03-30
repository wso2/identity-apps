/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { ReactElement, useState } from "react";
import _ from "lodash";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserGroupProps {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    handleGroupListChange: (groups: any) => void;
    handleTempListChange: (groups: any) => void;
}

/**
 * User role component.
 *
 * @return {ReactElement}
 */
export const AddUserGroup: React.FunctionComponent<AddUserGroupProps> = (props: AddUserGroupProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleGroupListChange,
        handleTempListChange
    } = props;

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState([]);

    const handleSearchFieldChange = (e: React.FormEvent<HTMLInputElement>, { value }: { value: string }) => {
        let isMatch = false;
        const filteredGroupList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            initialValues.groupList && initialValues.groupList.map((group) => {
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

    const addGroups = () => {
        const addedGroups = [ ...initialValues.tempGroupList ];
        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((group) => {
                if (!(initialValues.tempGroupList.includes(group))) {
                    addedGroups.push(group);
                }
            });
        }
        handleTempListChange(addedGroups);
        handleGroupListChange(initialValues.groupList.filter(x => !addedGroups.includes(x)));
    };

    const removeGroups = () => {
        const removedGroups = [ ...initialValues.groupList ];
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((group) => {
                if (!(initialValues.groupList.includes(group))) {
                    removedGroups.push(group);
                }
            });
        }
        handleGroupListChange(removedGroups);
        handleTempListChange(initialValues.tempGroupList.filter(x => !removedGroups.includes(x)));
        setCheckedAssignedListItems(checkedAssignedListItems.filter(x => !removedGroups.includes(x)))
    };

    const handleUnassignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...checkedUnassignedListItems ];

        if (checkedGroups.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedUnassignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedUnassignedListItems(checkedGroups);
        }
    };

    const handleAssignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...checkedAssignedListItems ];

        if (checkedGroups.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedAssignedListItems(checkedGroups);
        }
    };

    const createItemLabel = (roleName: string) => {

        const role = roleName.split("/");
        if (role.length > 0) {
            if (role[0] == "Application") {
                return { labelText: "Application", labelColor: null, name: "application-label" };
            } else {
                return { labelText: "Internal", labelColor: null, name: "internal-label" };
            }
        }
    };

    return (
        <>
            <Forms
                onSubmit={ () => {
                    onSubmit({ groups: initialValues?.tempGroupList });
                } }
                submitState={ triggerSubmit }
            >
                <TransferComponent
                    addItems={ addGroups }
                    removeItems={ removeGroups }
                    handleListSearch={ handleSearchFieldChange }
                >
                    <TransferList
                        isListEmpty={ !(initialValues.groupList.length > 0) }
                        listType="unselected"
                        listHeaders={ [ "Name", "Type" ] }
                    >
                        {
                            initialValues.groupList.map((group, index)=> {
                                const groupName = group.displayName.split("/");
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(group) }
                                        key={ index }
                                        listItem={ groupName.length > 0 ? groupName[1] : group.displayName }
                                        listItemId={ group.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ createItemLabel(group.displayName) }
                                        isItemChecked={ checkedUnassignedListItems.includes(group) }
                                        showSecondaryActions={ false }
                                    />
                                )
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(initialValues.tempGroupList.length > 0) }
                        listType="selected"
                        listHeaders={ [ "Name", "Type" ] }
                    >
                        {
                            initialValues.tempGroupList.map((group, index)=> {
                                const groupName = group.displayName.split("/");
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(group) }
                                        key={ index }
                                        listItem={ groupName.length > 0 ? groupName[1] : group.displayName }
                                        listItemId={ group.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ createItemLabel(group.displayName) }
                                        isItemChecked={ checkedAssignedListItems.includes(group) }
                                        showSecondaryActions={ false }
                                    />
                                )
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Forms>
        </>
    );
};
