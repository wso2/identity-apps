/**
 * Copyright (c) 2020-2026, WSO2 LLC. (https://www.wso2.com).
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
 * @param props - Props injected to the component.
 *
 * @returns Attribute selection wizard component.
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
    const searchTempAvailable = (event: any) => {
        const changeValue: any = event.target.value;

        if (changeValue.length > 0) {
            const displayNameFilterClaims: ExtendedClaimInterface[] = tempAvailableClaims.filter(
                (item: ExtendedClaimInterface) =>
                    item.displayName.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            const uriFilterClaims: ExtendedClaimInterface[] = tempAvailableClaims.filter(
                (item: ExtendedClaimInterface) =>
                    item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            // Deduplicate based on claimURI
            const combinedClaims: ExtendedClaimInterface[] = [ ...displayNameFilterClaims, ...uriFilterClaims ];
            const uniqueClaims: ExtendedClaimInterface[] =
                combinedClaims.reduce((acc: ExtendedClaimInterface[], claim: ExtendedClaimInterface) => {
                    if (!acc.find((c: ExtendedClaimInterface) => c.claimURI === claim.claimURI)) {
                        acc.push(claim);
                    }

                    return acc;
                }, []);

            setFilterTempAvailableClaims(sortBy(uniqueClaims, "displayName"));
        } else {
            setFilterTempAvailableClaims(sortBy(tempAvailableClaims, "displayName"));
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (claim: ExtendedClaimInterface) => {
        const checkedRoles: ExtendedClaimInterface[] = [ ...tempSelectedClaims ];
        const existingClaimIndex: number = checkedRoles.findIndex(
            (c: ExtendedClaimInterface) => c.claimURI === claim.claimURI
        );

        if (existingClaimIndex !== -1) {
            checkedRoles.splice(existingClaimIndex, 1);
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
            // Combine and deduplicate claims based on claimURI
            const allClaims: ExtendedClaimInterface[] = [ ...selectedClaims, ...availableClaims ];
            const uniqueClaims: ExtendedClaimInterface[] =
                allClaims.reduce((acc: ExtendedClaimInterface[], claim: ExtendedClaimInterface) => {
                    if (!acc.find((c: ExtendedClaimInterface) => c.claimURI === claim.claimURI)) {
                        acc.push(claim);
                    }

                    return acc;
                }, []);

            const sortedClaims: ExtendedClaimInterface[] = sortBy(uniqueClaims, "displayName");

            setTempAvailableClaims(sortedClaims);
            setFilterTempAvailableClaims(sortedClaims);
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
        const selectedClaimsValues: ExtendedClaimInterface[] = [ ...tempSelectedClaims ];
        const removedClaims: ExtendedClaimInterface[] =
            selectedClaims.filter((claim: ExtendedClaimInterface) => !selectedClaimsValues?.includes(claim));
        const addedClaims: ExtendedClaimInterface[] =
            selectedClaimsValues.filter((claim: ExtendedClaimInterface) => !selectedClaims?.includes(claim));

        updateMappings(addedClaims, removedClaims);
        setInitialSelectedClaims(selectedClaimsValues);
        setAvailableClaims([ ...tempAvailableClaims ]);
        setShowAddModal(false);
    });


    return (
        <Modal open={ showAddModal } size="large" className="user-roles attribute-modal" data-testid={ testId }>
            <Modal.Header>
                { t("applications:edit.sections.attributes.selection.addWizard.header") }
                <Heading subHeading ellipsis as="h6">
                    { t("applications:edit.sections.attributes.selection.addWizard." +
                        "subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={
                        t("applications:edit.sections.attributes.selection.addWizard.steps" +
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
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            filterTempAvailableClaims?.map((claim: ExtendedClaimInterface, index: number) => {
                                const isChecked: boolean = tempSelectedClaims.some(
                                    (c: ExtendedClaimInterface) => c.claimURI === claim.claimURI
                                );

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                                        key={ claim.claimURI }
                                        listItem={ claim.displayName }
                                        listItemId={ claim.id }
                                        listItemIndex={ claim.claimURI }
                                        isItemChecked={ isChecked }
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
