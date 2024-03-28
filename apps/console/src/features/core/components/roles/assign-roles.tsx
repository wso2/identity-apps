/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAuthorization from "../../../authorization/hooks/use-authorization";

/**
 * Proptypes for assign role component.
 */
interface AssignRoleProps {
    /**
     * Initial values of the form.
     */
    initialValues: { roleList: RolesInterface[] };
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    handleSetRoleId: (groupId: string) => void;
}

/**
 * Assign Role component.
 *
 * @returns Assign Roles component.
 */
export const AssignRoles: FunctionComponent<AssignRoleProps> = (props: AssignRoleProps): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        handleSetRoleId
    } = props;

    const { t } = useTranslation();

    const [ filteredRoleList, setFilteredRoleList ] = useState<RolesInterface[]>(initialValues?.roleList ?? []);
    const [ selectedRolesList, setSelectedRolesList ] = useState<RolesInterface[]>([]);
    const [ isSelectAllChecked, setIsSelectAllChecked ] = useState<boolean>(false);

    const { legacyAuthzRuntime } = useAuthorization();

    /**
     * useEffect hook to update the `isSelectAllChecked` state
     * when the `selectedRolesList` or `filteredRoleList` changes.
     */
    useEffect(() => {
        setIsSelectAllChecked(
            selectedRolesList?.length > 0
            && filteredRoleList?.every((role: RolesInterface) => selectedRolesList?.includes(role))
        );
    }, [ selectedRolesList, filteredRoleList ]);

    /**
     * The following method handles the `select all` checkbox change event.
     */
    const handleSelectAllCheckboxChange = () => {
        if (isSelectAllChecked) {
            setIsSelectAllChecked(false);
            const updatedSelectedRolesList: RolesInterface[] = [ ...selectedRolesList ];

            filteredRoleList.forEach((role: RolesInterface) => {
                const roleIndex: number = updatedSelectedRolesList.findIndex(
                    (selectedRole: RolesInterface) => selectedRole.id === role.id
                );

                if (roleIndex !== -1) {
                    updatedSelectedRolesList.splice(roleIndex, 1);
                }
            });
            setSelectedRolesList(updatedSelectedRolesList);
        } else {
            setIsSelectAllChecked(true);

            const updatedSelectedRolesList: RolesInterface[] = [ ...selectedRolesList ];

            filteredRoleList.forEach((role: RolesInterface) => {
                const roleIndex: number = updatedSelectedRolesList.findIndex(
                    (selectedRole: RolesInterface) => selectedRole.id === role.id
                );

                if (roleIndex === -1) {
                    updatedSelectedRolesList.push(role);
                }
            });
            setSelectedRolesList(updatedSelectedRolesList);
        }
    };

    /**
     * The following method handles the roles list search action.
     *
     * @param e - Event.
     * @param value - Search input value.
     */
    const handleRoleListSearch = (
        e: React.FormEvent<HTMLInputElement>,
        { value }: { value: string; }
    ) => {
        if (isEmpty(value)) {
            setFilteredRoleList(initialValues?.roleList ?? []);

            return;
        }

        const re: RegExp = new RegExp(escapeRegExp(value), "i");

        const filteredRoleList: RolesInterface[] = initialValues?.roleList?.
            filter((role: RolesInterface) => re.test(role.displayName)) ?? [];

        setFilteredRoleList(filteredRoleList);
    };

    /**
     * The following method handles the list item checkbox change event.
     *
     * @param role - Selected role.
     */
    const handleListItemCheckboxChange = (role: RolesInterface) => {
        const selectedRoleIndex: number = selectedRolesList?.findIndex(
            (selectedRole: RolesInterface) => selectedRole.id === role.id);

        if (selectedRoleIndex === -1) {
            setSelectedRolesList((prevState: RolesInterface[]) => [ ...prevState, role ]);
        } else {
            setSelectedRolesList((prevState: RolesInterface[]) => {
                const updatedRoles: RolesInterface[] = [ ...prevState ];

                updatedRoles.splice(selectedRoleIndex, 1);

                return updatedRoles;
            });
        }
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param roleType - string
     */
    const createItemLabel = (roleType: string, application: string) => {
        const role: string[] = roleType?.split("/");

        if (role?.length > 0) {
            if (role[0] == "application") {
                return {
                    labelColor: null,
                    labelText: t("roles:addRoleWizard." +
                        "forms.roleBasicDetails.roleAudience.values.application"),
                    name: "audience-label",
                    subLabel: application
                };
            } else {
                return {
                    labelColor: null,
                    labelText: t("roles:addRoleWizard." +
                        "forms.roleBasicDetails.roleAudience.values.organization"),
                    name: "audience-label"
                };
            }
        }
    };

    return (
        <>
            <Forms
                onSubmit={ () => {
                    onSubmit({ roles: selectedRolesList });
                } }
                submitState={ triggerSubmit }
            >
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={ t("transferList:searchPlaceholder",
                        { type: "Roles" }) }
                    handleUnelectedListSearch={ handleRoleListSearch }
                    data-testid="user-mgt-add-user-wizard-modal"
                >
                    <TransferList
                        isListEmpty={ !(filteredRoleList?.length > 0) }
                        listType="unselected"
                        listHeaders={ legacyAuthzRuntime ? [
                            t("transferList:list.headers.1"),""
                        ] : [
                            t("transferList:list.headers.1"),
                            t("transferList:list.headers.2"),""
                        ] }
                        handleHeaderCheckboxChange={ handleSelectAllCheckboxChange }
                        isHeaderCheckboxChecked={ isSelectAllChecked }
                        emptyPlaceholderContent={ t("transferList:list.emptyPlaceholders." +
                            "groups.unselected", { type: "roles" }) }
                        data-testid="user-mgt-add-user-wizard-modal-unselected-roles-select-all-checkbox"
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            filteredRoleList?.map((role: RolesInterface, index: number)=> {
                                const roleName: string[] = role?.displayName?.split("/");

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleListItemCheckboxChange(role) }
                                        key={ index }
                                        listItem={ roleName?.length > 1 ? roleName[1] : role?.displayName }
                                        listItemId={ role.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ !legacyAuthzRuntime &&
                                            createItemLabel(role?.audience.type, role?.audience.display)
                                        }
                                        isItemChecked={ selectedRolesList.includes(role) }
                                        showSecondaryActions={ false }
                                        handleOpenPermissionModal={ () => handleSetRoleId(role.id) }
                                        reOrderLabel
                                        showSubLabel={ !legacyAuthzRuntime }
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
