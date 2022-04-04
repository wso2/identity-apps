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
    Code,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { ExtendedClaimInterface } from "./attribute-settings";

interface AttributeSelectionWizardPropsInterface extends TestableComponentInterface {
    availableClaims: ExtendedClaimInterface[];
    setAvailableClaims: any;
    selectedClaims: ExtendedClaimInterface[];
    setSelectedClaims: any;
    setInitialSelectedClaims: any;
    showAddModal: boolean;
    setShowAddModal: (showModal: boolean) => void;
    createMapping: any;
    removeMapping: any;
    updateMappings: any;
}

/**
 * Attribute selection wizard component.
 *
 * @param {AttributeSelectionWizardPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AttributeSelectionWizard: FunctionComponent<AttributeSelectionWizardPropsInterface> = (
    props: AttributeSelectionWizardPropsInterface
): ReactElement => {

    const {
        selectedClaims,
        showAddModal,
        setShowAddModal,
        availableClaims,
        setAvailableClaims,
        setInitialSelectedClaims,
        updateMappings,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ tempAvailableClaims, setTempAvailableClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ tempSelectedClaims, setTempSelectedClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ filterTempAvailableClaims, setFilterTempAvailableClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked ] = useState(false);

    const handleAttributeModal = () => {
        setShowAddModal(false);
    };

    // search operation for available claims.
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;

        if (changeValue.length > 0) {
            const displayNameFilterClaims = tempAvailableClaims.filter((item) =>
                item.displayName.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            const uriFilterClaims = tempAvailableClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            setFilterTempAvailableClaims(sortBy(union(displayNameFilterClaims, uriFilterClaims), "displayName"));
        } else {
            if (selectedClaims.length > 0) {
                setFilterTempAvailableClaims(sortBy(union(selectedClaims, availableClaims ), "displayName"));
            } else {
                setFilterTempAvailableClaims(sortBy(tempAvailableClaims, "displayName"));
            }
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (claim) => {
        const checkedRoles = [ ...tempSelectedClaims ];

        if (checkedRoles?.includes(claim)) {
            checkedRoles.splice(checkedRoles.indexOf(claim), 1);
            setTempSelectedClaims(checkedRoles);
        } else {
            claim.requested = true;
            checkedRoles.push(claim);
            setTempSelectedClaims(checkedRoles);
        }
    };

    /**
     * The following function enables the user to select all the attributes at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectAssignedAllClaimsChecked(!isSelectAssignedAllClaimsChecked);
    };

    /**
     * Select all selected claims
     */
    useEffect(() => {
        if (isSelectAssignedAllClaimsChecked) {
            setTempSelectedClaims(filterTempAvailableClaims);
        } else {
            setTempSelectedClaims([]);
        }
    }, [ isSelectAssignedAllClaimsChecked ]);

    /**
     *  Set initial values for modal.
     */
    useEffect(() => {
        if (showAddModal) {
            if (selectedClaims.length > 0) {
                const sortedClaims = sortBy(union(selectedClaims, availableClaims ), "displayName");

                setTempAvailableClaims(sortedClaims);
                setFilterTempAvailableClaims(sortedClaims);
            } else {
                const sortedClaims = sortBy(availableClaims, "displayName");

                setTempAvailableClaims(sortedClaims);
                setFilterTempAvailableClaims(sortedClaims);
            }
            setTempSelectedClaims(selectedClaims);
        } else {
            setTempAvailableClaims([]);
            setFilterTempAvailableClaims([]);
            setTempSelectedClaims([]);
        }
    }, [ showAddModal ]);

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = (() => {
        const selectedClaimsValues = [ ...tempSelectedClaims ];
        const removedClaims = selectedClaims.filter((claim) => !selectedClaimsValues?.includes(claim));
        const addedClaims = selectedClaimsValues.filter((claim) => !selectedClaims?.includes(claim));

        updateMappings(addedClaims, removedClaims);
        setInitialSelectedClaims(selectedClaimsValues);
        setAvailableClaims([ ...tempAvailableClaims ]);
        setShowAddModal(false);
    });


    return (
        <Modal open={ showAddModal } size="large" className="user-roles attribute-modal" data-testid={ testId }>
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
                        t("console:develop.features.applications.edit.sections.attributes.selection.addWizard.steps" +
                            ".select.transfer.searchPlaceholders.attribute")
                    }
                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                    isHeaderCheckboxChecked={ isSelectAssignedAllClaimsChecked }
                    handleUnelectedListSearch={ searchTempAvailable }
                    data-testid={ `${ testId }-transfer-component` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ !(filterTempAvailableClaims.length > 0) }
                        listType="unselected"
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
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
                                        isItemChecked={ tempSelectedClaims.includes(claim) }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ (
                                            <Code compact withBackground={ false }>{ claim.claimURI }</Code>
                                        ) }
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
 * Default props for the application attribute selection wizard component.
 */
AttributeSelectionWizard.defaultProps = {
    "data-testid": "application-attribute-selection-wizard"
};
