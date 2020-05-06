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

import {
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../../models";
import { useTranslation } from "react-i18next";


interface AttributeSelectionWizardPropsInterface {
    attributesList: IdentityProviderClaimInterface[];
    selectedAttributes: IdentityProviderCommonClaimMappingInterface[];
    setSelectedAttributes: (mapping: IdentityProviderCommonClaimMappingInterface[]) => void;
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
}

export const AttributeSelectionWizard: FunctionComponent<AttributeSelectionWizardPropsInterface> = (
    props
): ReactElement => {

    const {
        selectedAttributes,
        setSelectedAttributes,
        showAddModal,
        setShowAddModal,
        attributesList
    } = props;

    const { t } = useTranslation();

    const [tempAvailableClaims, setTempAvailableClaims] = useState<IdentityProviderClaimInterface[]>([]);
    const [filterTempAvailableClaims, setFilterTempAvailableClaims] = useState<IdentityProviderClaimInterface[]>([]);
    
    const [tempSelectedAttributes, setTempSelectedClaims] = useState<IdentityProviderClaimInterface[]>([]);
    const [filterTempSelectedClaims, setFilterTempSelectedClaims] = useState<IdentityProviderClaimInterface[]>([]);
    
    const [checkedUnassignedListItems, setCheckedUnassignedListItems] = useState<IdentityProviderClaimInterface[]>([]);
    const [checkedAssignedListItems, setCheckedAssignedListItems] = useState<IdentityProviderClaimInterface[]>([]);
    
    const [isSelectUnassignedClaimsAllClaimsChecked, setSelectUnassignedClaimsAllClaimsChecked] = useState(false);
    const [isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked] = useState(false);

    const handleAttributeModal = () => {
        setShowAddModal(false);
    };

    // Search operation for available claims.
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempAvailableClaims(filterTempAvailableClaims.filter((item) =>
                item.uri.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterTempAvailableClaims(tempAvailableClaims);
        }
    };

    // search operation for selected claims.
    const searchTempSelected = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempSelectedClaims(filterTempSelectedClaims.filter((item) =>
                item.uri.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterTempSelectedClaims(tempSelectedAttributes);
        }
    };

    const addAttributes = () => {
        const addedClaims = [...tempSelectedAttributes];
        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((claim) => {
                if (!(addedClaims?.includes(claim))) {
                    addedClaims.push(claim);
                }
            });
        }
        setTempSelectedClaims(addedClaims);
        setFilterTempSelectedClaims(addedClaims);
        setTempAvailableClaims(tempAvailableClaims.filter(x => !addedClaims?.includes(x)));
        setFilterTempAvailableClaims(filterTempAvailableClaims.filter(x => !addedClaims?.includes(x)));
        setCheckedUnassignedListItems(checkedUnassignedListItems.filter(x => !addedClaims?.includes(x)));
        setSelectUnassignedClaimsAllClaimsChecked(false);
    };

    const removeAttributes = () => {
        const removedRoles = [...tempAvailableClaims];
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((claim) => {
                if (!(removedRoles?.includes(claim))) {
                    removedRoles.push(claim);
                }
            });
        }
        setTempAvailableClaims(removedRoles);
        setFilterTempAvailableClaims(removedRoles);
        setTempSelectedClaims(tempSelectedAttributes?.filter(x => !removedRoles?.includes(x)));
        setFilterTempSelectedClaims(filterTempSelectedClaims?.filter(x => !removedRoles?.includes(x)));
        setCheckedAssignedListItems(checkedAssignedListItems.filter(x => !removedRoles?.includes(x)));
        setIsSelectAssignedAllClaimsChecked(false);
    };


    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (claim) => {
        const checkedRoles = [...checkedUnassignedListItems];

        if (checkedRoles?.includes(claim)) {
            checkedRoles.splice(checkedRoles.indexOf(claim), 1);
            setCheckedUnassignedListItems(checkedRoles);
        } else {
            checkedRoles.push(claim);
            setCheckedUnassignedListItems(checkedRoles);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an assigned item.
     */
    const handleAssignedItemCheckboxChange = (role) => {
        const checkedRoles = [...checkedAssignedListItems];

        if (checkedRoles?.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedAssignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedAssignedListItems(checkedRoles);
        }
    };

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setSelectUnassignedClaimsAllClaimsChecked(!isSelectUnassignedClaimsAllClaimsChecked);
    };

    /**
     * The following function enables the user to deselect all the roles at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllClaimsChecked(!isSelectAssignedAllClaimsChecked);
    };

    /**
     *  Select all selected claims
     */
    useEffect(() => {
        if (isSelectAssignedAllClaimsChecked) {
            setCheckedAssignedListItems(tempSelectedAttributes);
        } else {
            setCheckedAssignedListItems([])
        }
    }, [isSelectAssignedAllClaimsChecked]);

    /**
     * Select all available claims.
     */
    useEffect(() => {
        if (isSelectUnassignedClaimsAllClaimsChecked) {
            setCheckedUnassignedListItems(tempAvailableClaims);
        } else {
            setCheckedUnassignedListItems([])
        }
    }, [isSelectUnassignedClaimsAllClaimsChecked]);

    /**
     *  Set initial values for modal.
     */
    useEffect(() => {
        if (showAddModal) {
            const attributesListWithoutSelectedElements = attributesList.filter(element => _.isEmpty(
                _.find(selectedAttributes, value => (value.claim.uri === element.uri)))
            );
            setTempAvailableClaims(attributesListWithoutSelectedElements);
            setFilterTempAvailableClaims(attributesListWithoutSelectedElements);

            setTempSelectedClaims(selectedAttributes.map(element => element.claim));
            setFilterTempSelectedClaims(selectedAttributes.map(element => element.claim));
        } else {
            setTempAvailableClaims([]);
            setFilterTempAvailableClaims([]);

            setTempSelectedClaims([]);
            setFilterTempSelectedClaims([]);
        }
        setCheckedAssignedListItems([]);
        setCheckedUnassignedListItems([]);

        setIsSelectAssignedAllClaimsChecked(false);
        setSelectUnassignedClaimsAllClaimsChecked(false);
    }, [showAddModal]);

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = (() => {

        setSelectedAttributes(tempSelectedAttributes.map(element => {
            const existingMapping = selectedAttributes.find(mapping => mapping.claim.uri === element.uri);
            return _.isEmpty(existingMapping) ? {
                claim: element,
                mappedValue: ""
            } as IdentityProviderCommonClaimMappingInterface : existingMapping;
        }));
        setShowAddModal(false);
    });

    return (
        <Modal open={ showAddModal } size="small" className="user-attributes">
            <Modal.Header>
                { t("devPortal.components.idp.modals.attributeSelection.title") }
                <Heading subHeading ellipsis as="h6">
                    { t("devPortal.components.idp.modals.attributeSelection.subTitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    searchPlaceholder={ t("devPortal:components.idp.modals.attributeSelection." +
                        "content.searchPlaceholder") }
                    addItems={ addAttributes }
                    removeItems={ removeAttributes }
                    handleUnelectedListSearch={ searchTempAvailable }
                    handleSelectedListSearch={ searchTempSelected }
                >
                    <TransferList
                        isListEmpty={ !(filterTempAvailableClaims.length > 0) }
                        listType="unselected"
                        listHeaders={ ["Attribute"] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectUnassignedClaimsAllClaimsChecked }
                    >
                        {
                            filterTempAvailableClaims?.map((claim: IdentityProviderClaimInterface) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                                        key={ claim.uri }
                                        listItem={ claim.displayName }
                                        listItemId={ claim.id }
                                        listItemIndex={ claim.uri }
                                        isItemChecked={ checkedUnassignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ claim.uri === claim.displayName ? "" : claim.uri }
                                    />
                                )
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(filterTempSelectedClaims.length > 0) }
                        listType="selected"
                        listHeaders={ ["Attribute"] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAssignedAllClaimsChecked }
                    >
                        {
                            filterTempSelectedClaims?.map((mapping) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(mapping) }
                                        key={ mapping.uri }
                                        listItem={ mapping.displayName }
                                        listItemId={ mapping.id }
                                        listItemIndex={ mapping.uri }
                                        isItemChecked={ checkedAssignedListItems.includes(mapping) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ mapping.uri === mapping.displayName ? "" : mapping.uri }
                                    />
                                )
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ handleAttributeModal }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    onClick={ updateSelectedClaims }
                >
                    { t("common:save") }
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
};
