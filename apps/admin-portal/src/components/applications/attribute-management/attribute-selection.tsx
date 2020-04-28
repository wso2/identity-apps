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

import { EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Checkbox, Divider, Grid, Icon, Input, Segment, Table } from "semantic-ui-react";
import { AttributeSelectionWizardOtherDialect } from "./attirbute-selection-wizard-other-dialect";
import { AttributeListItem } from "./attribute-list-item";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";
import {
    ExtendedClaimInterface,
    ExtendedClaimMappingInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "./attribute-settings";
import { EmptyPlaceholderIllustrations } from "../../../configs";
import {
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    RequestedClaimConfigurationInterface
} from "../../../models";

interface AttributeSelectionPropsInterface {
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
 * @param props AttributeSelectionPropsInterface
 */
export const AttributeSelection: FunctionComponent<AttributeSelectionPropsInterface> = (
    props
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
        readOnly
    } = props;


    const [availableClaims, setAvailableClaims] = useState<ExtendedClaimInterface[]>([]);
    const [availableExternalClaims, setAvailableExternalClaims] = useState<ExtendedExternalClaimInterface[]>([]);

    const [filterSelectedClaims, setFilterSelectedClaims] = useState<ExtendedClaimInterface[]>([]);
    const [filterSelectedExternalClaims, setFilterSelectedExternalClaims] = useState<ExtendedExternalClaimInterface[]>([]);

    const [initializationFinished, setInitializationFinished] = useState(false);

    const [showSelectionModal, setShowSelectionModal] = useState(false);

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
        if (claimConfigurations.dialect === "CUSTOM") {
            claimConfigurations.claimMappings?.map((element: ClaimMappingInterface) => {
                requestURI.push(element.localClaim.uri)
            })
        } else if (claimConfigurations.dialect === "LOCAL") {
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
            return checkInRequested ? true : false;
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
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilterSelectedExternalClaims(selectedExternalClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
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
                setFilterSelectedClaims(selectedClaims)
            } else {
                setFilterSelectedExternalClaims(selectedExternalClaims)
            }
        }
    };

    const setInitialValues = () => {
        // set local dialect values.
        if (selectedDialect.localDialect) {
            setInitializationFinished(false);
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
            if (claimConfigurations.dialect === "CUSTOM") {
                const initialClaimMappingList: ExtendedClaimMappingInterface[] = [];
                claimConfigurations.claimMappings.map((claim) => {
                    const claimMapping: ExtendedClaimMappingInterface = {
                        applicationClaim: claim.applicationClaim,
                        localClaim: {
                            displayName: claim?.localClaim?.displayName,
                            id: claim?.localClaim?.id,
                            uri: claim?.localClaim?.uri
                        },
                        addMapping: true
                    };
                    initialClaimMappingList.push(claimMapping);
                });
                setClaimMapping(initialClaimMappingList);
            } else {
                const initialClaimMappingList: ExtendedClaimMappingInterface[] = [];
                initialSelectedClaims.map((claim: ExtendedClaimInterface) => {
                    // createMapping(claim);
                    const claimMapping: ExtendedClaimMappingInterface = {
                        applicationClaim: "",
                        localClaim: {
                            displayName: claim.displayName,
                            id: claim.id,
                            uri: claim.claimURI
                        },
                        addMapping: false
                    };
                    initialClaimMappingList.push(claimMapping);
                });
                setClaimMapping(initialClaimMappingList);
            }
            setInitializationFinished(true);
        } else {
            setInitializationFinished(false);
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
        setInitialValues();
    }, [claimConfigurations]);

    const addSelectionModal = (() => {
            if (selectedDialect.localDialect) {
                return <AttributeSelectionWizard
                    selectedClaims={ selectedClaims }
                    setSelectedClaims={ setFilterSelectedClaims }
                    setInitialSelectedClaims={ setSelectedClaims }
                    showAddModal={ showSelectionModal }
                    setShowAddModal={ setShowSelectionModal }
                    availableClaims={ claims }
                    setAvailableClaims={ setClaims }
                    createMapping={ createMapping }
                    removeMapping={ removeMapping }
                />
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
                />
            )
        }
    );


    return (
        initializationFinished &&
        <>
            <Heading as="h5">
                Attribute Selection
            </Heading>
            <Divider hidden/>
            <Grid.Row>
                <Grid.Column computer={ (selectedDialect.localDialect) ? 10 : 8 }>
                    {
                        (selectedClaims.length > 0 || selectedExternalClaims.length > 0) ? (
                            <Segment.Group fluid>
                                <Segment className="user-role-edit-header-segment clearing">
                                    <Grid.Row>
                                        <Table basic="very" compact>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Input
                                                            icon={ <Icon name="search"/> }
                                                            onChange={ handleChange }
                                                            placeholder="Search attributes"
                                                            floated="left"
                                                            size="small"
                                                        />
                                                    </Table.Cell>
                                                    { selectedDialect.localDialect &&
                                                    (
                                                        <Table.Cell textAlign="right">
                                                            <Checkbox
                                                                slider
                                                                defaultChecked={ claimMappingOn }
                                                                onChange={ handelMapButtonClick }
                                                                label="Enable mapping"
                                                            />
                                                        </Table.Cell>
                                                    )
                                                    }
                                                    <Table.Cell textAlign="right">
                                                        <Button
                                                            size="medium"
                                                            icon="pencil"
                                                            floated="right"
                                                            onClick={ handleOpenSelectionModal }
                                                        />
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Grid.Row>
                                    <Grid.Row>
                                        { selectedDialect.localDialect ? (
                                                <Table singleLine compact>
                                                    <Table.Header>
                                                        { claimMappingOn ?
                                                            (
                                                                <Table.Row>
                                                                    <Table.HeaderCell>
                                                                        <strong>Attribute</strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell>
                                                                        <strong>Application attribute</strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell>
                                                                        <strong> Requested </strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell>
                                                                        <strong>Mandatory</strong>
                                                                    </Table.HeaderCell>
                                                                </Table.Row>
                                                            ) :
                                                            (
                                                                <Table.Row>
                                                                    <Table.HeaderCell>
                                                                        <strong>Attribute</strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell>
                                                                        <strong>Application attribute</strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell>
                                                                        <strong> Requested </strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell>
                                                                        <strong>Mandatory</strong>
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
                                                                        mapping={ getCurrentMapping(claim.claimURI) }
                                                                        initialMandatory={ claim.mandatory }
                                                                        initialRequested={ claim.requested }
                                                                        selectMandatory={ updateMandatory }
                                                                        selectRequested={ updateRequested }
                                                                        claimMappingOn={ claimMappingOn }
                                                                        claimMappingError={ claimMappingError }
                                                                    />
                                                                )

                                                            })
                                                        }
                                                    </Table.Body>
                                                </Table>) :
                                            (<Table singleLine compact>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>
                                                            <strong>Attribute</strong>
                                                        </Table.HeaderCell>
                                                        <Table.HeaderCell>
                                                            <strong>Mandatory</strong>
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
                                                                />
                                                            )
                                                        })
                                                    }
                                                </Table.Body>
                                            </Table>)
                                        }
                                    </Grid.Row>
                                </Segment>
                            </Segment.Group>
                        ) : (
                            <Segment>
                                <EmptyPlaceholder
                                    title="No attributes added"
                                    subtitle={ [
                                        "There are no attributes selected to the application at the moment."
                                    ] }
                                    action={
                                        !readOnly && (
                                            <PrimaryButton onClick={ handleOpenSelectionModal } icon="plus">
                                                Add Attribute
                                            </PrimaryButton>
                                        )
                                    }
                                    image={ EmptyPlaceholderIllustrations.emptyList }
                                    imageSize="tiny"
                                />
                            </Segment>
                        )
                    }
                </Grid.Column>
            </Grid.Row>
            { addSelectionModal() }
        </>
    );
};
