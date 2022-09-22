/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { Code, TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ExtendedExternalClaimInterface } from "../../applications/components/settings";

interface AttributeSelectListPropsInterface extends TestableComponentInterface {
    setAvailableExternalClaims: (claims: ExtendedExternalClaimInterface[]) => void;
    setInitialSelectedExternalClaims: (claims: ExtendedExternalClaimInterface[]) => void;
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    availableExternalClaims: ExtendedExternalClaimInterface[];
    onUpdate: () => void;
    triggerSubmit: boolean;
}

export const AttributeSelectList: FunctionComponent<AttributeSelectListPropsInterface> = (
    props: AttributeSelectListPropsInterface
): ReactElement => {
    const {
        ["data-testid"]: testId,
        setAvailableExternalClaims,
        setInitialSelectedExternalClaims,
        selectedExternalClaims,
        availableExternalClaims,
        onUpdate,
        triggerSubmit
    } = props;

    const [ isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked ] = useState<boolean>(false);
    const [ tempAvailableClaims, setTempAvailableClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ tempSelectedClaims, setTempSelectedClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ filterTempAvailableClaims, setFilterTempAvailableClaims ] = useState<ExtendedExternalClaimInterface[]>([]);

    const { t } = useTranslation();

    const init = useRef(true);
    const initCheck = useRef(true);

    const requestedComparator = (selectedList: ExtendedExternalClaimInterface[]) => {
        const filteredSelectedList = selectedList.filter(item => !!item);

        return (claim: ExtendedExternalClaimInterface): number => {
            return (filteredSelectedList?.findIndex(item => item.id === claim.id) >= 0) ? -1 : 1;
        };
    };

    useEffect(() => {
        if (selectedExternalClaims.length > 0) {
            const sortedClaims = sortBy(
                union([ ...selectedExternalClaims ], [ ...availableExternalClaims ]),
                requestedComparator(selectedExternalClaims), "localClaimDisplayName"
            );

            setTempAvailableClaims(sortedClaims);
            setFilterTempAvailableClaims(sortedClaims);
            setTempSelectedClaims(selectedExternalClaims);
        } else {
            const sortedClaims = sortBy(availableExternalClaims, requestedComparator([]),
                "localClaimDisplayName");

            setTempAvailableClaims(sortedClaims);
            setFilterTempAvailableClaims(sortedClaims);
        }
    }, [ selectedExternalClaims, availableExternalClaims ]);

    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            updateSelectedClaims();
        }
    }, [ triggerSubmit ]);

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = () => {
        setInitialSelectedExternalClaims([ ...tempSelectedClaims ]);
        setAvailableExternalClaims([ ...tempAvailableClaims ]);
        onUpdate();
    };

    /**
     * Select all selected claims
     */
    useEffect(() => {
        if (initCheck.current) {
            initCheck.current = false;

            return;
        }

        if (isSelectAssignedAllClaimsChecked) {
            setTempSelectedClaims(filterTempAvailableClaims);
        } else {
            setTempSelectedClaims([]);
        }
    }, [ isSelectAssignedAllClaimsChecked ]);

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectAssignedAllClaimsChecked(!isSelectAssignedAllClaimsChecked);
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

    // search operation for available claims
    const searchTempAvailable = (event) => {
        const changeValue = event.target.value;

        if (changeValue.length > 0) {
            const displayNameFilterClaims = tempAvailableClaims.filter((item) =>
                (item.localClaimDisplayName ?? "").toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            const uriFilterClaims = tempAvailableClaims.filter((item) =>
                (item.claimURI ?? "").toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            setFilterTempAvailableClaims(sortBy(union(displayNameFilterClaims, uriFilterClaims),
                requestedComparator(tempSelectedClaims), "localClaimDisplayName"));
        } else {
            if (selectedExternalClaims.length > 0) {
                setFilterTempAvailableClaims(sortBy(
                    union(selectedExternalClaims, availableExternalClaims), requestedComparator(tempSelectedClaims),
                    "localClaimDisplayName")
                );
            } else {
                setFilterTempAvailableClaims(sortBy(tempAvailableClaims, requestedComparator(tempSelectedClaims),
                    "localClaimDisplayName"));
            }
        }
    };

    return (
        <TransferComponent
            selectionComponent
            searchPlaceholder={ t(
                "console:develop.features.applications.edit.sections.attributes.selection.addWizard" +
                    ".steps.select.transfer.searchPlaceholders.attribute"
            ) }
            handleHeaderCheckboxChange={ selectAllUnAssignedList }
            iconPosition="left"
            isHeaderCheckboxChecked={ isSelectAssignedAllClaimsChecked }
            handleUnelectedListSearch={ searchTempAvailable }
            data-testid={ `${ testId }-transfer-component` }
            selectAllCheckboxLabel={
                t("console:develop.features.applications.edit.sections.attributes.selection.selectAll")
            }
        >
            <TransferList
                selectionComponent
                isListEmpty={ !(filterTempAvailableClaims.length > 0) }
                listType="unselected"
                data-testid={ `${testId}-unselected-transfer-list` }
                emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
            >
                { filterTempAvailableClaims?.map((claim, index) => {                    
                    return (
                        <TransferListItem
                            handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                            key={ claim.claimURI }
                            listItem={ claim?.localClaimDisplayName ? claim.localClaimDisplayName : claim.claimURI }
                            listItemId={ claim.id }
                            listItemIndex={ claim.claimURI }
                            isItemChecked={ tempSelectedClaims.includes(claim) }
                            showSecondaryActions={ false }
                            showListSubItem={ true }
                            listSubItem={ <Code compact withBackground={ false }>{ claim.claimURI }</Code> }
                            data-testid={ `${testId}-unselected-transfer-list-item-${index}` }
                        />
                    );
                }) }
            </TransferList>
        </TransferComponent>
    );
};

/**
 * Default props of the component.
 */
AttributeSelectList.defaultProps = {
    "data-testid": "attribute-select-list"
};
