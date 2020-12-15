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
import { ContentLoader, EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Grid, Icon, Input, Segment, Table } from "semantic-ui-react";
import { AttributeSelectionWizardOtherDialect } from "./attirbute-selection-wizard-other-dialect";
import { AttributeListItem } from "./attribute-list-item";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";
import {
    ExtendedClaimInterface,
    ExtendedClaimMappingInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "./attribute-settings";
import { getEmptyPlaceholderIllustrations } from "../../../../core";
import {
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    RequestedClaimConfigurationInterface
} from "../../../models";

interface AttributeSelectionPropsInterface extends TestableComponentInterface {
    claims: ExtendedClaimInterface[];
    setClaims: any;
    externalClaims: ExtendedExternalClaimInterface[];
    setExternalClaims: any;
    selectedClaims: ExtendedClaimInterface[];
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    setSelectedClaims: any;
    setSelectedExternalClaims: any;
    selectedDialect: SelectedDialectInterface;
    claimMapping: ExtendedClaimMappingInterface[];
    setClaimMapping: any;
    createMapping: any;
    removeMapping: any;
    getCurrentMapping: any;
    updateClaimMapping: any;
    addToClaimMapping: any;
    claimConfigurations: ClaimConfigurationInterface;
    claimMappingOn: boolean;
    setClaimMappingOn: (mappingOn: boolean) => void;
    claimMappingError: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Attribute selection component.
 *
 * @param {AttributeSelectionPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AttributeSelection: FunctionComponent<AttributeSelectionPropsInterface> = (
    props: AttributeSelectionPropsInterface
): ReactElement => {

    const {
        claims,
        setClaims,
        externalClaims,
        selectedClaims,
        setExternalClaims,
        selectedExternalClaims,
        setSelectedClaims,
        setSelectedExternalClaims,
        selectedDialect,
        setClaimMapping,
        createMapping,
        removeMapping,
        getCurrentMapping,
        updateClaimMapping,
        addToClaimMapping,
        claimConfigurations,
        claimMappingOn,
        setClaimMappingOn,
        claimMappingError,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [availableClaims, setAvailableClaims] = useState<ExtendedClaimInterface[]>([]);
    const [availableExternalClaims, setAvailableExternalClaims] = useState<ExtendedExternalClaimInterface[]>([]);

    const [filterSelectedClaims, setFilterSelectedClaims] = useState<ExtendedClaimInterface[]>([]);
    const [
        filterSelectedExternalClaims,
        setFilterSelectedExternalClaims
    ] = useState<ExtendedExternalClaimInterface[]>([]);

    const [initializationFinished, setInitializationFinished] = useState(false);

    const [showSelectionModal, setShowSelectionModal] = useState(false);

    const initValue = useRef(false);

    const updateMandatory = (claimURI: string, mandatory: boolean) => {
        if (selectedDialect.localDialect) {
            const localClaims = [...selectedClaims];
            localClaims.forEach((mapping) => {
                if (mapping.claimURI === claimURI) {
                    mapping.mandatory = mandatory;
                }
            });
            setSelectedClaims(localClaims);
        } else {
            const externalClaims = [...selectedExternalClaims];
            externalClaims.forEach((mapping) => {
                if (mapping.claimURI === claimURI) {
                    mapping.mandatory = mandatory;
                }
            });
            setSelectedExternalClaims(externalClaims);
        }
    };

    const updateRequested = (claimURI: string, requested: boolean) => {
        if (selectedDialect.localDialect) {
            const localClaims = [...selectedClaims];
            localClaims.forEach((mapping) => {
                if (mapping.claimURI === claimURI) {
                    mapping.requested = requested;
                }
            });
            setSelectedClaims(localClaims);
        }
    };

    const getInitiallySelectedClaimsURI = ((): string[] => {
        const requestURI: string[] = [];
        if (claimConfigurations?.dialect === "CUSTOM") {
            claimConfigurations.claimMappings?.map((element: ClaimMappingInterface) => {
                requestURI.push(element.localClaim.uri);
            });
        } else if (claimConfigurations?.dialect === "LOCAL") {
            claimConfigurations.requestedClaims.map((element: RequestedClaimConfigurationInterface) => {
                requestURI.push(element.claim.uri);
            });
        }
        return requestURI;
    });

    /**
     * Check whether claim is mandatory or not
     *
     * @param uri Claim URI to be checked.
     */
    const checkInitialRequestMandatory = (uri: string) => {
        let requestURI = false;
        // If custom mapping there then retrieve the relevant uri and check for requested section.
        if (claimConfigurations.dialect === "CUSTOM") {
            const requestURI = claimConfigurations.claimMappings.find(
                (mapping) => mapping?.localClaim?.uri === uri)?.applicationClaim;
            if (requestURI) {
                const checkInRequested = claimConfigurations.requestedClaims.find(
                    (requestClaims) => requestClaims?.claim?.uri === requestURI);
                if (checkInRequested) {
                    return checkInRequested.mandatory;
                }
            }
        }
        // If it is mapped directly check the requested section
        requestURI = claimConfigurations.requestedClaims.find(
            (requestClaims) => requestClaims?.claim?.uri === uri)?.mandatory;

        return requestURI;
    };

    /**
     * Check whether claim is requested or not.
     *
     * @param uri Claim URI to be checked.
     */
    const checkInitialRequested = (uri: string): boolean => {
        if (claimConfigurations.dialect === "CUSTOM") {
            const requestURI = claimConfigurations.claimMappings.find(
                (mapping) => mapping?.localClaim?.uri === uri)?.applicationClaim;
            let checkInRequested;
            if (requestURI) {
                checkInRequested = claimConfigurations.requestedClaims.find(
                    (requestClaims) => requestClaims?.claim?.uri === requestURI);
            } else {
                checkInRequested = claimConfigurations.requestedClaims.find(
                    (requestClaims) => requestClaims?.claim?.uri === uri);
            }

            return !!checkInRequested;
        } else {
            // If the dialect is not custom, the initial selected claim is decided by requested claims
            // So it is always true.
            return true;
        }
    };

    // search operation for claims
    const searchFilter = (changeValue) => {

        if (selectedDialect.localDialect) {
            setFilterSelectedClaims(selectedClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));
        } else {
            setFilterSelectedExternalClaims(selectedExternalClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));
        }
    };

    /**
     * Handle change event of the search input.
     *
     * @param event change event.
     */
    const handleChange = (event) => {
        const changeValue = event.target.value;
        if (changeValue.length > 0) {
            // setSearchOn(true);
            searchFilter(changeValue);
        } else {
            // setSearchOn(false);
            if (selectedDialect.localDialect) {
                setFilterSelectedClaims(selectedClaims);
            } else {
                setFilterSelectedExternalClaims(selectedExternalClaims);
            }
        }
    };

    const setInitialValues = () => {
        // set local dialect values.
        if (selectedDialect.localDialect) {
            const initialRequest = getInitiallySelectedClaimsURI();
            const initialSelectedClaims: ExtendedClaimInterface[] = [];
            const initialAvailableClaims: ExtendedClaimInterface[] = [];
            claims.map((claim) => {
                if (initialRequest.includes(claim.claimURI)) {
                    const newClaim: ExtendedClaimInterface = {
                        ...claim,
                        mandatory: checkInitialRequestMandatory(claim.claimURI),
                        requested: checkInitialRequested(claim.claimURI)
                    };
                    initialSelectedClaims.push(newClaim);
                } else {
                    initialAvailableClaims.push(claim);
                }
            });
            setSelectedClaims(initialSelectedClaims);
            setClaims(initialAvailableClaims);
            setAvailableClaims(initialAvailableClaims);

            //Handle claim mapping initialization
            if (claimConfigurations?.dialect === "CUSTOM") {
                const initialClaimMappingList: ExtendedClaimMappingInterface[] = [];
                claimConfigurations.claimMappings.map((claim) => {
                    const claimMapping: ExtendedClaimMappingInterface = {
                        addMapping: true,
                        applicationClaim: claim.applicationClaim,
                        localClaim: {
                            displayName: claim?.localClaim?.displayName,
                            id: claim?.localClaim?.id,
                            uri: claim?.localClaim?.uri
                        }
                    };
                    initialClaimMappingList.push(claimMapping);
                });
                setClaimMapping(initialClaimMappingList);
            } else {
                const initialClaimMappingList: ExtendedClaimMappingInterface[] = [];
                initialSelectedClaims.map((claim: ExtendedClaimInterface) => {
                    // createMapping(claim);
                    const claimMapping: ExtendedClaimMappingInterface = {
                        addMapping: false,
                        applicationClaim: "",
                        localClaim: {
                            displayName: claim.displayName,
                            id: claim.id,
                            uri: claim.claimURI
                        }
                    };
                    initialClaimMappingList.push(claimMapping);
                });
                setClaimMapping(initialClaimMappingList);
            }
            setInitializationFinished(true);
        } else {
            const initialRequest = getInitiallySelectedClaimsURI();
            const initialSelectedClaims: ExtendedExternalClaimInterface[] = [];
            const initialAvailableClaims: ExtendedExternalClaimInterface[] = [];
            externalClaims.map((claim) => {
                if (initialRequest.includes(claim.mappedLocalClaimURI)) {
                    const newClaim: ExtendedExternalClaimInterface = {
                        ...claim,
                        mandatory: checkInitialRequestMandatory(claim.mappedLocalClaimURI)
                    };
                    initialSelectedClaims.push(newClaim);

                } else {
                    initialAvailableClaims.push(claim);
                }
            });
            setSelectedExternalClaims(initialSelectedClaims);
            setExternalClaims(initialAvailableClaims);
            setAvailableExternalClaims(initialAvailableClaims);
            setInitializationFinished(true);
        }
    };

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const handelMapButtonClick = () => {
        const mapping = claimMappingOn;
        setClaimMappingOn(!mapping);
    };

    useEffect(() => {
        if (claims) {
            setAvailableClaims([...claims]);
        }
        if (externalClaims) {
            setAvailableExternalClaims([...externalClaims]);
        }
    }, [claims, externalClaims]);


    useEffect(() => {
        if (selectedClaims) {
            setFilterSelectedClaims([...selectedClaims]);
        }
        if (selectedExternalClaims) {
            setFilterSelectedExternalClaims([...selectedExternalClaims]);
        }
    }, [selectedClaims, selectedExternalClaims]);

    useEffect(() => {
        if (!initValue.current) {
            setInitializationFinished(false);
            setInitialValues();
            initValue.current = true;
        }
    }, [claimConfigurations]);

    const addSelectionModal = (() => {
            if (selectedDialect.localDialect) {
                return (
                    <AttributeSelectionWizard
                        selectedClaims={ selectedClaims }
                        setSelectedClaims={ setFilterSelectedClaims }
                        setInitialSelectedClaims={ setSelectedClaims }
                        showAddModal={ showSelectionModal }
                        setShowAddModal={ setShowSelectionModal }
                        availableClaims={ claims }
                        setAvailableClaims={ setClaims }
                        createMapping={ createMapping }
                        removeMapping={ removeMapping }
                        data-testid={ `${ testId }-wizard` }
                    />
                );
            }
            return (

                <AttributeSelectionWizardOtherDialect
                    selectedExternalClaims={ selectedExternalClaims }
                    setSelectedExternalClaims={ setFilterSelectedExternalClaims }
                    setInitialSelectedExternalClaims={ setSelectedExternalClaims }
                    showAddModal={ showSelectionModal }
                    setShowAddModal={ setShowSelectionModal }
                    availableExternalClaims={ externalClaims }
                    setAvailableExternalClaims={ setExternalClaims }
                    data-testid={ `${ testId }-wizard-other-dialects` }
                />
            );
        }
    );


    return (
        claimConfigurations && initializationFinished
            ?
            <>
                <Grid.Row data-testid={ testId }>
                    <Grid.Column computer={ (selectedDialect.localDialect) ? 10 : 8 }>
                        <Heading as="h4">
                            { t("console:develop.features.applications.edit.sections.attributes.selection.heading") }
                        </Heading>
                        {
                            (selectedClaims.length > 0 || selectedExternalClaims.length > 0) ? (
                                <Segment.Group fluid>
                                    <Segment className="user-role-edit-header-segment clearing attributes">
                                        <Grid.Row>
                                            <Table
                                                data-testid={ `${ testId }-action-bar` }
                                                basic="very"
                                                compact
                                            >
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            <Input
                                                                icon={ <Icon name="search"/> }
                                                                onChange={ handleChange }
                                                                placeholder={
                                                                    t("console:develop.features.applications.edit" +
                                                                        ".sections.attributes.selection.mappingTable" +
                                                                        ".searchPlaceholder")
                                                                }
                                                                floated="left"
                                                                size="small"
                                                                data-testid={ `${ testId }-search` }
                                                            />
                                                        </Table.Cell>
                                                        { selectedDialect.localDialect &&
                                                        (
                                                            <Table.Cell textAlign="right">
                                                                <Checkbox
                                                                    slider
                                                                    defaultChecked={ claimMappingOn }
                                                                    onChange={ handelMapButtonClick }
                                                                    label={
                                                                        t("console:develop.features.applications" +
                                                                            ".edit.sections.attributes.selection" +
                                                                            ".mappingTable.actions.enable")
                                                                    }
                                                                    readOnly={ readOnly }
                                                                    data-testid={ `${ testId }-cliam-mapping-toggle` }
                                                                />
                                                            </Table.Cell>
                                                        )
                                                        }
                                                        {
                                                            !readOnly && (
                                                                <Table.Cell textAlign="right">
                                                                    <Button
                                                                        size="medium"
                                                                        icon="pencil"
                                                                        floated="right"
                                                                        onClick={ handleOpenSelectionModal }
                                                                        data-testid={ `${ testId }-update-button` }
                                                                    />
                                                                </Table.Cell>
                                                            )
                                                        }
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table>
                                        </Grid.Row>
                                        <Grid.Row>
                                            { selectedDialect.localDialect
                                                ? (
                                                    <Table
                                                        singleLine
                                                        compact
                                                        data-testid={ `${ testId }-list` }
                                                    >
                                                        <Table.Header>
                                                            { claimMappingOn
                                                                ? (
                                                                    <Table.Row>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".attribute")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                    ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".appAttribute")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".requested")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".mandatory")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                    </Table.Row>
                                                                )
                                                                :
                                                                (
                                                                    <Table.Row>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".attribute")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".appAttribute")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".requested")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                        <Table.HeaderCell>
                                                                            <strong>
                                                                                {
                                                                                    t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".mandatory")
                                                                                }
                                                                            </strong>
                                                                        </Table.HeaderCell>
                                                                    </Table.Row>
                                                                )
                                                            }
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {
                                                                filterSelectedClaims?.map((claim) => {
                                                                    return (
                                                                        <AttributeListItem
                                                                            key={ claim.id }
                                                                            claimURI={ claim.claimURI }
                                                                            displayName={ claim.displayName }
                                                                            mappedURI={ claim.claimURI }
                                                                            localDialect={ true }
                                                                            updateMapping={ updateClaimMapping }
                                                                            addToMapping={ addToClaimMapping }
                                                                            mapping={
                                                                                getCurrentMapping(claim.claimURI)
                                                                            }
                                                                            initialMandatory={ claim.mandatory }
                                                                            initialRequested={ claim.requested }
                                                                            selectMandatory={ updateMandatory }
                                                                            selectRequested={ updateRequested }
                                                                            claimMappingOn={ claimMappingOn }
                                                                            claimMappingError={ claimMappingError }
                                                                            readOnly={ readOnly }
                                                                            data-testid={ claim.claimURI }
                                                                        />
                                                                    );

                                                                })
                                                            }
                                                        </Table.Body>
                                                    </Table>
                                                )
                                                :
                                                (
                                                    <Table
                                                        singleLine
                                                        compact
                                                        data-testid={ `${ testId }-list` }
                                                    >
                                                        <Table.Header>
                                                            <Table.Row>
                                                                <Table.HeaderCell>
                                                                    <strong>
                                                                        {
                                                                            t("console:develop.features.applications" +
                                                                                ".edit.sections.attributes.selection" +
                                                                                ".mappingTable.columns.attribute")
                                                                        }
                                                                    </strong>
                                                                </Table.HeaderCell>
                                                                <Table.HeaderCell>
                                                                    <strong>
                                                                        {
                                                                            t("console:develop.features.applications" +
                                                                                ".edit.sections.attributes.selection" +
                                                                                ".mappingTable.columns.mandatory")
                                                                        }
                                                                    </strong>
                                                                </Table.HeaderCell>
                                                            </Table.Row>
                                                        </Table.Header>
                                                        <Table.Body>
                                                            {
                                                                filterSelectedExternalClaims?.map((claim) => {
                                                                    return (
                                                                        <AttributeListItem
                                                                            key={ claim.id }
                                                                            claimURI={ claim.claimURI }
                                                                            displayName={ claim.claimURI }
                                                                            mappedURI={ claim.mappedLocalClaimURI }
                                                                            localDialect={ false }
                                                                            initialMandatory={ claim.mandatory }
                                                                            selectMandatory={ updateMandatory }
                                                                            data-testid={ claim.claimURI }
                                                                            readOnly={ readOnly }
                                                                        />
                                                                    );
                                                                })
                                                            }
                                                        </Table.Body>
                                                    </Table>
                                                )
                                            }
                                        </Grid.Row>
                                    </Segment>
                                </Segment.Group>
                            ) : (
                                <Segment>
                                    <EmptyPlaceholder
                                        title={
                                            t("console:develop.features.applications.placeholders.emptyAttributesList" +
                                                ".title")
                                        }
                                        subtitle={ [
                                            t("console:develop.features.applications.placeholders.emptyAttributesList" +
                                                ".subtitles")
                                        ] }
                                        action={
                                            !readOnly && (
                                                <PrimaryButton onClick={ handleOpenSelectionModal }>
                                                    <Icon name="plus"/>
                                                    { t("console:develop.features.applications.placeholders" +
                                                        ".emptyAttributesList.action") }
                                                </PrimaryButton>
                                            )
                                        }
                                        image={ getEmptyPlaceholderIllustrations().emptyList }
                                        imageSize="tiny"
                                        data-testid={ `${ testId }-empty-placeholder` }
                                    />
                                </Segment>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                { addSelectionModal() }
            </>
            : !initializationFinished
                ? <ContentLoader/>
                : null
    );
};

/**
 * Default props for the application attribute selection component.
 */
AttributeSelection.defaultProps = {
    "data-testid": "application-attribute-selection"
};
