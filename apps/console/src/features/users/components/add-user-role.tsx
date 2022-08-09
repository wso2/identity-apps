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

import { RolesInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Proptypes for the application consents list component.
 */
interface AddUserRoleProps {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    handleRoleListChange: (roles: any) => void;
    handleTempListChange: (roles: any) => void;
    handleInitialTempListChange: (groups: any) => void;
    handleInitialRoleListChange: (groups: any) => void;
    handleSetRoleId: (groupId: string) => void;
}

/**
 * User role component.
 *
 * @return {JSX.Element}
 */
export const AddUserRole: FunctionComponent<AddUserRoleProps> = (props: AddUserRoleProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleRoleListChange,
        handleTempListChange,
        handleInitialTempListChange,
        handleSetRoleId
    } = props;

    const { t } = useTranslation();

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);

    useEffect(() => {
        setCheckedUnassignedListItems(initialValues?.tempRoleList);
    }, [ initialValues?.tempRoleList ]);

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        if (!isSelectUnassignedRolesAllRolesChecked) {
            setCheckedUnassignedListItems(initialValues?.roleList);
            handleTempListChange(initialValues?.roleList);
        } else {
            setCheckedUnassignedListItems([]);
        }
        setIsSelectUnassignedAllRolesChecked(!isSelectUnassignedRolesAllRolesChecked);
    };

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            initialValues.initialRoleList && initialValues.initialRoleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    handleRoleListChange(filteredRoleList);
                }
            });
        } else {
            handleRoleListChange(initialValues?.initialRoleList);
        }
    };

    const handleUnassignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedUnassignedListItems ];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
        } else {
            checkedRoles.push(role);
        }
        handleTempListChange(checkedRoles);
        handleInitialTempListChange(checkedRoles);
        setIsSelectUnassignedAllRolesChecked(initialValues?.roleList?.length === checkedRoles.length);
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param roleName: string
     */
    const createItemLabel = (roleName: string) => {
        const role = roleName.split("/");

        if (role.length > 0) {
            if (role[0] == "Application") {
                return { labelColor: null, labelText: "Application", name: "application-label" };
            } else {
                return { labelColor: null, labelText: "Internal", name: "internal-label" };
            }
        }
    };

    return (
        <>
            <Forms
                onSubmit={ () => {
                    onSubmit({ roles: initialValues?.tempRoleList });
                } }
                submitState={ triggerSubmit }
            >
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={ t("console:manage.features.transferList.searchPlaceholder",
                        { type: "Roles" }) }
                    handleUnelectedListSearch={ handleUnselectedListSearch }
                    data-testid="user-mgt-add-user-wizard-modal"
                >
                    <TransferList
                        isListEmpty={ !(initialValues?.roleList?.length > 0) }
                        listType="unselected"
                        listHeaders={ [
                            t("console:manage.features.transferList.list.headers.0"),
                            t("console:manage.features.transferList.list.headers.1"), ""
                        ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectUnassignedRolesAllRolesChecked }
                        emptyPlaceholderContent={ t("console:manage.features.transferList." +
                            "list.emptyPlaceholders.users." +
                            "roles.unselected", { type: "roles" }) }
                        data-testid="user-mgt-add-user-wizard-modal-unselected-roles-select-all-checkbox"
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            initialValues?.roleList?.map((role, index)=> {
                                const roleName = role?.displayName?.split("/");

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(role) }
                                        key={ index }
                                        listItem={ roleName?.length > 1 ? roleName[1] : role?.displayName }
                                        listItemId={ role.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ createItemLabel(role?.displayName) }
                                        isItemChecked={ checkedUnassignedListItems.includes(role) }
                                        showSecondaryActions={ true }
                                        handleOpenPermissionModal={ () => handleSetRoleId(role.id) }
                                        data-testid="user-mgt-add-user-wizard-modal-unselected-roles"
                                    />
                                );
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Forms>
        </>
    );
};
