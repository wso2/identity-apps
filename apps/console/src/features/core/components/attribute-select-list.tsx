import { TestableComponentInterface } from "@wso2is/core/models";
import { TransferComponent, TransferList, TransferListItem } from "@wso2is/react-components";
import sortBy from "lodash/sortBy";
import union from "lodash/union";
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

    const [isSelectAssignedAllClaimsChecked, setIsSelectAssignedAllClaimsChecked] = useState<boolean>(false);
    const [tempAvailableClaims, setTempAvailableClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [tempSelectedClaims, setTempSelectedClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [filterTempAvailableClaims, setFilterTempAvailableClaims] = useState<ExtendedExternalClaimInterface[]>([]);

    const { t } = useTranslation();

    const init = useRef(true);
    const initCheck = useRef(true);

    useEffect(() => {
        if (selectedExternalClaims.length > 0) {
            const sortedClaims = sortBy(
                union([...selectedExternalClaims], [...availableExternalClaims]),
                "localClaimDisplayName"
            );
            setTempAvailableClaims(sortedClaims);
            setFilterTempAvailableClaims(sortedClaims);
            setTempSelectedClaims(selectedExternalClaims);
        } else {
            const sortedClaims = sortBy(availableExternalClaims, "localClaimDisplayName");
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
    }, [triggerSubmit]);

    /**
     *  Save the selected claims
     */
    const updateSelectedClaims = () => {
        setInitialSelectedExternalClaims([...tempSelectedClaims]);
        setAvailableExternalClaims([...tempAvailableClaims]);
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
    }, [isSelectAssignedAllClaimsChecked]);

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
        const checkedRoles = [...tempSelectedClaims];

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
            setFilterTempAvailableClaims(
                filterTempAvailableClaims.filter(
                    (item) => item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1
                )
            );
        } else {
            if (selectedExternalClaims.length > 0) {
                setFilterTempAvailableClaims(
                    sortBy(union(selectedExternalClaims, availableExternalClaims), "localClaimDisplayName")
                );
            } else {
                setFilterTempAvailableClaims(sortBy(tempAvailableClaims, "localClaimDisplayName"));
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
            isHeaderCheckboxChecked={ isSelectAssignedAllClaimsChecked }
            handleUnelectedListSearch={ searchTempAvailable }
            data-testid={ `${testId}-transfer-component` }
        >
            <TransferList
                selectionComponent
                isListEmpty={ !(filterTempAvailableClaims.length > 0) }
                listType="unselected"
                data-testid={ `${testId}-unselected-transfer-list` }
            >
                { filterTempAvailableClaims?.map((claim, index) => {
                    return (
                        <TransferListItem
                            handleItemChange={ () => handleUnassignedItemCheckboxChange(claim) }
                            key={ claim.claimURI }
                            listItem={ claim.localClaimDisplayName }
                            listItemId={ claim.id }
                            listItemIndex={ claim.claimURI }
                            isItemChecked={ tempSelectedClaims.includes(claim) }
                            showSecondaryActions={ false }
                            showListSubItem={ true }
                            listSubItem={ claim.claimURI }
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
