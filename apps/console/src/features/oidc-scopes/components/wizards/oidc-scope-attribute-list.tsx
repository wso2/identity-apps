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
import { Forms } from "@wso2is/forms";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Interface for the OIDC scope attribute list props.
 */
interface OIDCScopeAttributesListPropsInterface extends TestableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: (values: any) => void;
    availableClaims: ExternalClaim[];
    setAvailableClaims: any;
    selectedClaims: ExternalClaim[];
    setSelectedClaims: any;
    setInitialSelectedClaims: any;
    createMapping?: any;
    removeMapping?: any;
    onUpdateAttributes?: (attributes: string[]) => void;
}

/**
 * OIDC attribute list component.
 *
 * @param {OIDCScopeAttributesListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OIDCScopeAttributesList: FunctionComponent<OIDCScopeAttributesListPropsInterface> = (
    props: OIDCScopeAttributesListPropsInterface
): ReactElement => {

    const {
        selectedClaims,
        setSelectedClaims,
        availableClaims,
        setAvailableClaims,
        setInitialSelectedClaims,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ tempAvailableClaims, setTempAvailableClaims ] = useState<ExternalClaim[]>([]);
    const [ tempSelectedClaims, setTempSelectedClaims ] = useState<ExternalClaim[]>([]);
    const [ filterTempAvailableClaims, setFilterTempAvailableClaims ] = useState<ExternalClaim[]>([]);
    const [ filterTempSelectedClaims, setFilterTempSelectedClaims ] = useState<ExternalClaim[]>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<ExternalClaim[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<ExternalClaim[]>([]);
    const [ isSelectUnassignedClaimsAllClaimsChecked, setSelectUnassignedClaimsAllClaimsChecked ] = useState(false);
    const [ isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked ] = useState(false);

    // search operation for available claims.
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempAvailableClaims(tempAvailableClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));
        } else {
            setFilterTempAvailableClaims(tempAvailableClaims);
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
            setCheckedUnassignedListItems(tempAvailableClaims);
        } else {
            setCheckedUnassignedListItems([]);
        }
    }, [isSelectUnassignedClaimsAllClaimsChecked]);

    /**
     *  Set initial values for modal.
     */
    useEffect(() => {
        setTempAvailableClaims(availableClaims);
        setFilterTempAvailableClaims(availableClaims);
        setTempSelectedClaims(selectedClaims);
        setFilterTempSelectedClaims(selectedClaims);
    }, []);

    /**
     *  Save the selected claims
     */
    const getSelectedClaims = (() => {
        const selectedClaims = [];
        const selectedClaimsValues = [...tempSelectedClaims];
        selectedClaimsValues.map((claim) => {
            selectedClaims.push(claim.claimURI);
        });

        setSelectedClaims(selectedClaimsValues);
        setInitialSelectedClaims(selectedClaimsValues);
        setAvailableClaims([...tempAvailableClaims]);
        return selectedClaims;
    });

    return (
        <Forms
            onSubmit={ () => onSubmit(getSelectedClaims()) }
            submitState={ triggerSubmit && triggerSubmit }
        >
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
                    isListEmpty={ !(filterTempAvailableClaims.length > 0) }
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
                        filterTempAvailableClaims?.map((claim, index) => {
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
                                    data-testid={ `${ testId }-unselected-transfer-list-item-${ 1 }` }
                                />
                            );
                        })
                    }
                </TransferList>
                <TransferList
                    isListEmpty={ !(filterTempSelectedClaims.length > 0) }
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
                                    data-testid={ `${ testId }-selected-transfer-list-item-${ 1 }` }
                                />
                            );
                        })
                    }
                </TransferList>
            </TransferComponent>
        </Forms>
    );
};
