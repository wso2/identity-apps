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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import _ from "lodash";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import { RolesInterface } from "../../models/roles";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserGroupPropsInterface {
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
export const AddUserGroup: FunctionComponent<AddUserGroupPropsInterface> = (
    props: AddUserGroupPropsInterface): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleGroupListChange,
        handleTempListChange
    } = props;

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RolesInterface[]>([]);
    const [ isSelectUnassignedAllChecked, setIsSelectUnassignedAllChecked ] = useState(false);
    const [ isSelectAssignedAllChecked, setIsSelectAssignedAllChecked ] = useState(false);

    useEffect(() => {
        if (isSelectAssignedAllChecked) {
            setCheckedAssignedListItems(initialValues?.tempGroupList);
        } else {
            setCheckedAssignedListItems([])
        }
    }, [ isSelectAssignedAllChecked ]);

    useEffect(() => {
        if (setIsSelectUnassignedAllChecked) {
            setCheckedUnassignedListItems(initialValues?.groupList);
        } else {
            setCheckedUnassignedListItems([])
        }
    }, [ isSelectUnassignedAllChecked ]);

    /**
     * The following method handles the onChange event of the
     * search field. It matches the string pattern of the user
     * input value with the elements of the user list.
     *
     * @param e
     * @param value
     */
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

     const selectAllUnAssignedList = () => {
         setIsSelectUnassignedAllChecked(!isSelectUnassignedAllChecked);
     };

    const selectAllAssignedList = () => {
        setIsSelectAssignedAllChecked(!isSelectAssignedAllChecked);
    };

    /**
     * The following method handles adding list items checked in the initial
     * roles list to the assigned roles list.
     */
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
        setIsSelectUnassignedAllChecked(!isSelectUnassignedAllChecked);
    };

    /**
     * The following method handles removing list items checked in the assigned
     * roles list to the initial role list.
     */
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
        setIsSelectAssignedAllChecked(!isSelectAssignedAllChecked);
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...checkedUnassignedListItems ];

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
    const handleAssignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...checkedAssignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedAssignedListItems(checkedGroups);
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
                addItems={ addGroups }
                removeItems={ removeGroups }
                handleListSearch={ handleSearchFieldChange }
            >
                <TransferList
                    isListEmpty={ !(initialValues.groupList.length > 0) }
                    listType="unselected"
                    listHeaders={ [ "Name", "Type" ] }
                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                    isHeaderCheckboxChecked={ isSelectUnassignedAllChecked }
                >
                    {
                        initialValues.groupList.map((group, index)=> {
                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleUnassignedItemCheckboxChange(group) }
                                    key={ index }
                                    listItem={ group.displayName }
                                    listItemId={ group.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ { labelText: "Primary", labelColor: "olive" } }
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
                    handleHeaderCheckboxChange={ selectAllAssignedList }
                    isHeaderCheckboxChecked={ isSelectAssignedAllChecked }
                >
                    {
                        initialValues.tempGroupList.map((group, index)=> {
                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleAssignedItemCheckboxChange(group) }
                                    key={ index }
                                    listItem={ group.displayName }
                                    listItemId={ group.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ { labelText: "Primary", labelColor: "olive" } }
                                    isItemChecked={ checkedAssignedListItems.includes(group) }
                                    showSecondaryActions={ false }
                                />
                            )
                        })
                    }
                </TransferList>
            </TransferComponent>
        </Forms>
    );
};
