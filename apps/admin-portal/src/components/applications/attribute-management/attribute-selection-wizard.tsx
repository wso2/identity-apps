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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Modal } from "semantic-ui-react";
import { ExtendedClaimInterface } from "./attribute-settings";


interface AttributeSelectionWizardPropsInterface {
    availableClaims: ExtendedClaimInterface[];
    setAvailableClaims: any;
    selectedClaims: ExtendedClaimInterface[];
    setSelectedClaims: any;
    setInitialSelectedClaims: any;
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
    createMapping: any;
    removeMapping: any;
}

export const AttributeSelectionWizard: FunctionComponent<AttributeSelectionWizardPropsInterface> = (
    props
): ReactElement => {

    const {
        selectedClaims,
        setSelectedClaims,
        showAddModal,
        setShowAddModal,
        availableClaims,
        setAvailableClaims,
        setInitialSelectedClaims,
        createMapping,
        removeMapping
    } = props;


    const [tempAvailableClaims, setTempAvailableClaims] = useState<ExtendedClaimInterface[]>([]);
    const [tempSelectedClaims, setTempSelectedClaims] = useState<ExtendedClaimInterface[]>([]);
    const [filterTempAvailableClaims, setFilterTempAvailableClaims] = useState<ExtendedClaimInterface[]>([]);
    const [filterTempSelectedClaims, setFilterTempSelectedClaims] = useState<ExtendedClaimInterface[]>([]);
    const [checkedUnassignedListItems, setCheckedUnassignedListItems] = useState<ExtendedClaimInterface[]>([]);
    const [checkedAssignedListItems, setCheckedAssignedListItems] = useState<ExtendedClaimInterface[]>([]);
    const [isSelectUnassignedClaimsAllClaimsChecked, setSelectUnassignedClaimsAllClaimsChecked] = useState(false);
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

    // search operation for available claims.
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempAvailableClaims(tempAvailableClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterTempAvailableClaims(tempAvailableClaims);
        }
    };

    // search operation for selected claims.
    const searchTempSelected = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempSelectedClaims(tempSelectedClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterTempSelectedClaims(tempSelectedClaims);
        }
    };

    const addAttributes = () => {
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
        setTempSelectedClaims(tempSelectedClaims?.filter(x => !removedRoles?.includes(x)));
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
            setCheckedAssignedListItems(tempSelectedClaims);
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
            setTempAvailableClaims(availableClaims);
            setFilterTempAvailableClaims(availableClaims);
            setTempSelectedClaims(selectedClaims);
            setFilterTempSelectedClaims(selectedClaims);
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
        const selectedClaimsValues = [...tempSelectedClaims];
        const removedClaims = selectedClaims.filter((claim) => !selectedClaimsValues.includes(claim));
        const added = selectedClaimsValues.filter((claim) => !selectedClaims.includes(claim));
        added.map((claim) => createMapping(claim));
        removedClaims.map((claim) => removeMapping(claim));
        // setSelectedClaims(selectedClaimsValues);
        setInitialSelectedClaims(selectedClaimsValues);
        setAvailableClaims([...tempAvailableClaims]);
        handleAttributeModal();
    });


    return (
        <Modal open={ showAddModal } size="small" className="user-roles">
            <Modal.Header>
                Update Attribute Selection
                <Heading subHeading ellipsis as="h6">
                    Add new attributes or remove existing attributes.
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    searchPlaceholder="Search attribute"
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
                            filterTempAvailableClaims?.map((claim, index) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                                        key={ claim.claimURI }
                                        listItem={ claim.displayName }
                                        listItemId={ claim.id }
                                        listItemIndex={ claim.claimURI }
                                        isItemChecked={ checkedUnassignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ claim.claimURI }
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
                            filterTempSelectedClaims?.map((claim, index) => {

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(claim) }
                                        key={ claim.claimURI }
                                        listItem={ claim.displayName }
                                        listItemId={ claim.id }
                                        listItemIndex={ claim.claimURI }
                                        isItemChecked={ checkedAssignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ claim.claimURI }
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
                    Cancel
                </LinkButton>
                <PrimaryButton
                    onClick={ updateSelectedClaims }
                >
                    Save
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
};
