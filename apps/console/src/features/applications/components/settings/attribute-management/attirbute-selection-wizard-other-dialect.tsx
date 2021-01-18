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

import { TestableComponentInterface } from "@wso2is/core/models";
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
import { ExtendedExternalClaimInterface } from "./attribute-settings";

interface AttributeSelectionWizardOtherDialectPropsInterface extends TestableComponentInterface {
    availableExternalClaims: ExtendedExternalClaimInterface[];
    setAvailableExternalClaims: any;
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    setSelectedExternalClaims: any;
    setInitialSelectedExternalClaims: any;
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
}

/**
 * Other dialects attribute selection wizard component.
 *
 * @param {AttributeSelectionWizardOtherDialectPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AttributeSelectionWizardOtherDialect: FunctionComponent<
    AttributeSelectionWizardOtherDialectPropsInterface
    > = (
        props: AttributeSelectionWizardOtherDialectPropsInterface
): ReactElement => {

    const {
        selectedExternalClaims,
        setAvailableExternalClaims,
        setInitialSelectedExternalClaims,
        showAddModal,
        setShowAddModal,
        availableExternalClaims,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [tempAvailableClaims, setTempAvailableClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [tempSelectedClaims, setTempSelectedClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [filterTempAvailableClaims, setFilterTempAvailableClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked] = useState<boolean | string>(false);

    const handleAttributeModal = () => {
        setShowAddModal(false);
    };

    // search operation for available claims
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            setFilterTempAvailableClaims(filterTempAvailableClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));
        } else {
            setFilterTempAvailableClaims(tempAvailableClaims);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (claim) => {
        const checkedRoles = [...tempSelectedClaims];

        if (checkedRoles?.includes(claim)) {
            checkedRoles.splice(checkedRoles.indexOf(claim), 1);
            setTempSelectedClaims(checkedRoles);
        } else {
            checkedRoles.push(claim);
            setTempSelectedClaims(checkedRoles);
        }

    };

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectAssignedAllClaimsChecked(!isSelectAssignedAllClaimsChecked);
    };

    /**
     *  Set initial values for modal.
     */
    useEffect(() => {
        if (showAddModal) {
            setTempAvailableClaims(availableExternalClaims);
            setFilterTempAvailableClaims(availableExternalClaims);
            setTempSelectedClaims(selectedExternalClaims);
        } else {
            setTempAvailableClaims([]);
            setFilterTempAvailableClaims([]);
            setTempSelectedClaims([]);
        }
    }, [showAddModal]);

    /**
     * Select all selected claims.JSON
     */
    useEffect(() => {
        if (isSelectAssignedAllClaimsChecked) {
            setTempSelectedClaims(availableExternalClaims);
        } else {
            setTempSelectedClaims([]);
        }
    }, [isSelectAssignedAllClaimsChecked]);

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = (() => {
        setInitialSelectedExternalClaims([...tempSelectedClaims]);
        setAvailableExternalClaims([...tempAvailableClaims]);
        handleAttributeModal();
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
                    selectionComponent
                    searchPlaceholder={
                        t("console:develop.features.applications.edit.sections.attributes.selection.addWizard" +
                            ".steps.select.transfer.searchPlaceholders.attribute")
                    }
                    handleUnelectedListSearch={ searchTempAvailable }
                    data-testid={ `${ testId }-transfer-component` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ !(filterTempAvailableClaims.length > 0) }
                        listType="unselected"
                        listHeaders={ [
                            t("console:develop.features.applications.edit.sections.attributes.selection.addWizard" +
                                ".steps.select.transfer.headers.attribute")
                        ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        
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
                                        isItemChecked={ tempSelectedClaims.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ claim.mappedLocalClaimURI }
                                        data-testid={ `${ testId }-unselected-transfer-list-item-${ index }` }
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

/**
 * Default props for the application attribute selection wizard other dialects component.
 */
AttributeSelectionWizardOtherDialect.defaultProps = {
    "data-testid": "application-attribute-selection-wizard-other-dialects"
};
