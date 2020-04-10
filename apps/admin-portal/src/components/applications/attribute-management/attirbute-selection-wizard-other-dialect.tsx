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
import { Modal } from "semantic-ui-react";
import {
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { ExtendedExternalClaimInterface } from "./attribute-settings";


interface AttributeSelectionWizardOtherDialectPropsInterface {
    availableExternalClaims: ExtendedExternalClaimInterface[];
    setAvailableExternalClaims: any;
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    setSelectedExternalClaims: any;
    setInitialSelectedExternalClaims: any;
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
}

export const AttributeSelectionWizardOtherDialect: FunctionComponent<AttributeSelectionWizardOtherDialectPropsInterface> = (
    props
): ReactElement => {

    const {
        selectedExternalClaims,
        setSelectedExternalClaims,
        setAvailableExternalClaims,
        setInitialSelectedExternalClaims,
        showAddModal,
        setShowAddModal,
        availableExternalClaims,
    } = props;


    const [tempAvailableClaims, setTempAvailableClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [tempSelectedClaims, setTempSelectedClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [filterTempAvailableClaims, setFilterTempAvailableClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [filterTempSelectedClaims, setFilterTempSelectedClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [checkedUnassignedListItems, setCheckedUnassignedListItems] = useState<ExtendedExternalClaimInterface[]>([]);
    const [checkedAssignedListItems, setCheckedAssignedListItems] = useState<ExtendedExternalClaimInterface[]>([]);
    const [isSelectUnassignedClaimsAllClaimsChecked, setIsSelectUnassignedClaimsAllClaimsChecked] = useState(false);
    const [isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked] = useState(false);

    const getClaimName = (claimURI: string): string => {
        if (typeof claimURI === "string") {
            const claimArray = claimURI.split("/");
            if (claimArray.length > 1) {
                return claimArray[claimArray.length - 1];
            } else {
                return claimArray[0];
            }
        }

        return claimURI;
    };

    const handleAttributeModal = () => {
        setShowAddModal(false);
    };

    // search operation for available claims
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempAvailableClaims(filterTempAvailableClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterTempAvailableClaims(tempAvailableClaims);
        }
    };

    // search operation for selected claims
    const searchTempSelected = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempSelectedClaims(filterTempSelectedClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterTempSelectedClaims(tempSelectedClaims);
        }
    };

    const addRoles = () => {
        const addedClaims = [...tempSelectedClaims];
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
        setIsSelectUnassignedClaimsAllClaimsChecked(false);
    };

    const removeRoles = () => {
        const removedClaims = [...tempAvailableClaims];
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((claim) => {
                if (!(removedClaims?.includes(claim))) {
                    removedClaims.push(claim);
                }
            });
        }
        setTempAvailableClaims(removedClaims);
        setFilterTempAvailableClaims(removedClaims);
        setTempSelectedClaims(tempSelectedClaims?.filter(x => !removedClaims?.includes(x)));
        setFilterTempSelectedClaims(filterTempSelectedClaims?.filter(x => !removedClaims?.includes(x)));
        setCheckedAssignedListItems(checkedAssignedListItems.filter(x => !removedClaims?.includes(x)));
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
        setIsSelectUnassignedClaimsAllClaimsChecked(!isSelectUnassignedClaimsAllClaimsChecked);
    };

    /**
     * The following function enables the user to deselect all the roles at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllClaimsChecked(!isSelectAssignedAllClaimsChecked);
    };

    /**
     * Select all selected claims.
     */
    useEffect(() => {
        if (isSelectAssignedAllClaimsChecked) {
            setCheckedAssignedListItems(tempSelectedClaims);
        } else {
            setCheckedAssignedListItems([])
        }
    }, [isSelectAssignedAllClaimsChecked]);

    /**
     *  Select all available claims.
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
            setTempAvailableClaims(availableExternalClaims);
            setFilterTempAvailableClaims(availableExternalClaims);
            setTempSelectedClaims(selectedExternalClaims);
            setFilterTempSelectedClaims(selectedExternalClaims);
        } else {
            setTempAvailableClaims([]);
            setFilterTempAvailableClaims([]);
            setTempSelectedClaims([]);
            setFilterTempSelectedClaims([]);
        }
    }, [showAddModal]);

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = (() => {
        setInitialSelectedExternalClaims([...tempSelectedClaims]);
        setAvailableExternalClaims([...tempAvailableClaims]);
        handleAttributeModal();
    });


    return (
        <Modal open={ showAddModal } size="small" className="user-roles">
            <Modal.Header>
                Update attribute selection
                <Heading subHeading ellipsis as="h6">
                    Add new attributes or remove existing attributes.
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    searchPlaceholder="Search roles"
                    addItems={ addRoles }
                    removeItems={ removeRoles }
                    handleUnelectedListSearch={ searchTempAvailable }
                    handleSelectedListSearch={ searchTempSelected }
                >
                    <TransferList
                        isListEmpty={ !(filterTempAvailableClaims.length > 0) }
                        listType="unselected"
                        listHeaders={ ["Attribute", "Local Attribute"] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectUnassignedClaimsAllClaimsChecked }
                    >
                        {
                            filterTempAvailableClaims?.map((claim, index) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                                        key={ claim.claimURI }
                                        listItem={ claim.claimURI }
                                        listItemId={ claim.id }
                                        listItemIndex={ claim.claimURI }
                                        listItemTypeLabel={ {
                                            labelText: getClaimName(claim.mappedLocalClaimURI),
                                            labelColor: null,
                                            name: "internal-label"
                                        } }
                                        isItemChecked={ checkedUnassignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                    />
                                )
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(filterTempSelectedClaims.length > 0) }
                        listType="selected"
                        listHeaders={ ["Attribute", "Local Attribute"] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAssignedAllClaimsChecked }
                    >
                        {
                            filterTempSelectedClaims?.map((claim, index) => {

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(claim) }
                                        key={ claim.claimURI }
                                        listItem={ claim.claimURI }
                                        listItemId={ claim.id }
                                        listItemIndex={ claim.claimURI }
                                        listItemTypeLabel={ {
                                            labelText: getClaimName(claim.mappedLocalClaimURI),
                                            labelColor: null,
                                            name: "application-label"
                                        } }
                                        isItemChecked={ checkedAssignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                    />
                                )
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>
            <Modal.Actions>
                <PrimaryButton
                    onClick={ updateSelectedClaims }
                >
                    Save
                </PrimaryButton>
                <LinkButton
                    onClick={ handleAttributeModal }
                >
                    Cancel
                </LinkButton>
            </Modal.Actions>
        </Modal>
    )
};
