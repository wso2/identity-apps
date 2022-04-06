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

import { ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import {
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";

interface OIDCScopeAttributesPropsInterface extends TestableComponentInterface {
    selectedClaims: ExternalClaim[];
    unselectedClaims: ExternalClaim[];
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
    createMapping?: any;
    removeMapping?: any;
    onUpdateAttributes?: (attributes: string[]) => void;
}

/**
 * OIDC attribute selection component.
 *
 * @param {OIDCScopeAttributesPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OIDCScopeAttributes: FunctionComponent<OIDCScopeAttributesPropsInterface> = (
    props: OIDCScopeAttributesPropsInterface
): ReactElement => {

    const {
        selectedClaims,
        unselectedClaims,
        showAddModal,
        setShowAddModal,
        onUpdateAttributes,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ tempUnselectedClaims, setUnselectedClaims ] = useState<ExternalClaim[]>([]);
    const [ tempSelectedClaims, setTempSelectedClaims ] = useState<ExternalClaim[]>([]);
    const [ filterTempUnselectedClaims, setFilterTempUnselectedClaims ] = useState<ExternalClaim[]>([]);
    const [ filterTempSelectedClaims, setFilterTempSelectedClaims ] = useState<ExternalClaim[]>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<ExternalClaim[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<ExternalClaim[]>([]);
    const [ isSelectUnassignedClaimsAllClaimsChecked, setSelectUnassignedClaimsAllClaimsChecked ] = useState(false);
    const [ isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked ] = useState(false);

    /**
     *  Select all selected claims
     */
    useEffect(() => {
        if (isSelectAssignedAllClaimsChecked) {
            setCheckedAssignedListItems(tempSelectedClaims);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [isSelectAssignedAllClaimsChecked]);

    /**
     * Select all available claims.
     */
    useEffect(() => {
        if (isSelectUnassignedClaimsAllClaimsChecked) {
            setCheckedUnassignedListItems(tempUnselectedClaims);
        } else {
            setCheckedUnassignedListItems([]);
        }
    }, [isSelectUnassignedClaimsAllClaimsChecked]);

    /**
     * Set initial unselected claims
     */
    useEffect(() => {
        if (unselectedClaims === undefined) {
            return;
        }

        setUnselectedClaims(unselectedClaims);
        setFilterTempUnselectedClaims(unselectedClaims);
    }, [ unselectedClaims ]);

    /**
     * Set initial unselected claims
     */
    useEffect(() => {
        if (selectedClaims === undefined) {
            return;
        }

        setTempSelectedClaims(selectedClaims);
        setFilterTempSelectedClaims(selectedClaims);
    }, [ selectedClaims ]);

    const handleAttributeModal = () => {
        setShowAddModal(false);
    };

    // search operation for available claims.
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempUnselectedClaims(tempUnselectedClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));
        } else {
            setFilterTempUnselectedClaims(tempUnselectedClaims);
        }
    };

    // search operation for selected claims.
    const searchTempSelected = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempSelectedClaims(tempSelectedClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));
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
        setUnselectedClaims(tempUnselectedClaims.filter(x => !addedClaims?.includes(x)));
        setFilterTempUnselectedClaims(filterTempUnselectedClaims.filter(x => !addedClaims?.includes(x)));
        setCheckedUnassignedListItems(checkedUnassignedListItems.filter(x => !addedClaims?.includes(x)));
        setSelectUnassignedClaimsAllClaimsChecked(false);
    };

    const removeAttributes = () => {
        const removedRoles = [...tempUnselectedClaims];
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((claim) => {
                if (!(removedRoles?.includes(claim))) {
                    removedRoles.push(claim);
                }
            });
        }
        setUnselectedClaims(removedRoles);
        setFilterTempUnselectedClaims(removedRoles);
        setTempSelectedClaims(tempSelectedClaims?.filter(x => !removedRoles?.includes(x)));
        setFilterTempSelectedClaims(filterTempSelectedClaims?.filter(x => !removedRoles?.includes(x)));
        setCheckedUnassignedListItems([]);
        setIsSelectAssignedAllClaimsChecked(false);
    };


    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (claim) => {
        const checkedClaims = [...checkedUnassignedListItems];

        if (checkedClaims?.includes(claim)) {
            checkedClaims.splice(checkedClaims.indexOf(claim), 1);
            setCheckedUnassignedListItems(checkedClaims);
        } else {
            checkedClaims.push(claim);
            setCheckedUnassignedListItems(checkedClaims);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an assigned item.
     */
    const handleAssignedItemCheckboxChange = (claim) => {
        const checkedClaims = [...checkedAssignedListItems];

        if (checkedClaims?.includes(claim)) {
            checkedClaims.splice(checkedClaims.indexOf(claim), 1);
            setCheckedAssignedListItems(checkedClaims);
        } else {
            checkedClaims.push(claim);
            setCheckedAssignedListItems(checkedClaims);
        }
    };

    /**
     * The following function enables the user to select all the attributes at once.
     */
    const selectAllUnAssignedList = () => {
        setSelectUnassignedClaimsAllClaimsChecked(!isSelectUnassignedClaimsAllClaimsChecked);
    };

    /**
     * The following function enables the user to deselect all the attributes at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllClaimsChecked(!isSelectAssignedAllClaimsChecked);
    };

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = (() => {
        const selectedClaims = [];
        const selectedClaimsValues = [...tempSelectedClaims];

        selectedClaimsValues.map((claim) => {
            selectedClaims.push(claim.claimURI);
        });

        onUpdateAttributes(selectedClaims);
        setShowAddModal(false);
    });

    return (
        <Modal open={ showAddModal } size="small" className="user-roles" data-testid={ testId }>
            <Modal.Header>
                { t("console:develop.features.applications.edit.sections.attributes.selection.addWizard.header") }
                <Heading subHeading ellipsis as="h6">
                    { t("console:develop.features.applications.edit.sections.attributes.selection.addWizard." +
                        "subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    searchPlaceholder={
                        t("console:develop.features.applications.edit.sections.attributes.selection.addWizard.steps" +
                            ".select.transfer.searchPlaceholders.attribute")
                    }
                    addItems={ addAttributes }
                    removeItems={ removeAttributes }
                    handleUnelectedListSearch={ searchTempAvailable }
                    handleSelectedListSearch={ searchTempSelected }
                    data-testid={ `${ testId }-transfer-component` }
                >
                    <TransferList
                        isListEmpty={ !(filterTempUnselectedClaims?.length > 0) }
                        listType="unselected"
                        listHeaders={ [
                            t("console:develop.features.applications.edit.sections.attributes.selection.addWizard.steps" +
                                ".select.transfer.headers.attribute")
                        ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectUnassignedClaimsAllClaimsChecked }
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            filterTempUnselectedClaims?.map((claim, index) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                                        key={ index }
                                        listItem={ claim?.claimURI }
                                        listItemId={ claim?.id }
                                        listItemIndex={ claim?.claimURI }
                                        isItemChecked={ checkedUnassignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ claim?.claimURI }
                                        data-testid={ `${ testId }-unselected-transfer-list-item-${ 1 }` }
                                    />
                                );
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(filterTempSelectedClaims?.length > 0) }
                        listType="selected"
                        listHeaders={ [
                            t("console:develop.features.applications.edit.sections.attributes.selection.addWizard.steps" +
                                ".select.transfer.headers.attribute")
                        ] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAssignedAllClaimsChecked }
                        data-testid={ `${ testId }-selected-transfer-list` }
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            filterTempSelectedClaims?.map((claim, index) => {

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(claim) }
                                        key={ index }
                                        listItem={ claim?.claimURI }
                                        listItemId={ claim?.id }
                                        listItemIndex={ claim?.claimURI }
                                        isItemChecked={ checkedAssignedListItems.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ claim?.claimURI }
                                        data-testid={ `${ testId }-selected-transfer-list-item-${ 1 }` }
                                    />
                                );
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ handleAttributeModal }
                    data-testid={ `${ testId }-cancel-button` }
                >
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    onClick={ updateSelectedClaims }
                    data-testid={ `${ testId }-save-button` }
                >
                    { t("common:save") }
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    );
};
