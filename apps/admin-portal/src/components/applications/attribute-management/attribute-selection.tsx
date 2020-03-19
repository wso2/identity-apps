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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Grid, Input, List } from "semantic-ui-react";
import {
    Claim,
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    ExternalClaim,
    RequestedClaimConfigurationInterface
} from "../../../models";
import { AttributeItem } from "./attribute-item";
import { EmptyPlaceholder, Heading, Hint } from "@wso2is/react-components";
import { EmptyPlaceholderIllustrations } from "../../../configs";
import {
    ExtendedClaimInterface,
    ExtendedClaimMappingInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "./attribute-settings";
import { isEmpty } from "lodash";


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
}

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
        claimConfigurations
    } = props;

    //search operation
    const [filteredClaims, setFilteredClaims] = useState<ExtendedClaimInterface[]>([]);
    const [filteredExternalClaims, setFilteredExternalClaims] = useState<ExtendedExternalClaimInterface[]>([]);
    const [searchOn, setSearchOn] = useState(false);


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

    const selectAttribute = (claimURI) => {
        const allAttributes = [...filteredClaims];
        const oldAttributes = [...selectedClaims];
        let currentClaim: Claim = null;
        let sliceIndex = -1;
        allAttributes.map((claim, index) => {
            if (claim.claimURI === claimURI) {
                sliceIndex = index;
                currentClaim = claim;
            }
        });

        if (sliceIndex > -1) {
            allAttributes.splice(sliceIndex, 1);
        }
        if (currentClaim !== null) {
            oldAttributes.push(currentClaim);
            createMapping(currentClaim);
        }
        setSelectedClaims(oldAttributes);
        setFilteredClaims(allAttributes);
    };

    const removeAttribute = (claimURI) => {
        const allAttributes = [...filteredClaims];
        const oldAttributes = [...selectedClaims];

        let sliceIndex = -1;
        let currentClaim: Claim = null;
        // tslint:disable-next-line:no-shadowed-variable
        oldAttributes.map((claim, index) => {
            if (claim.claimURI === claimURI) {
                sliceIndex = index;
                currentClaim = claim;
            }
        });

        if (sliceIndex > -1) {
            oldAttributes.splice(sliceIndex, 1);
        }
        if (currentClaim !== null) {
            allAttributes.push(currentClaim);
            removeMapping(currentClaim);
        }
        setSelectedClaims(oldAttributes);
        setFilteredClaims(allAttributes)
    };

    const selectExternalAttribute = (claimURI) => {
        const allAttributes = [...filteredExternalClaims];
        const oldAttributes = [...selectedExternalClaims];
        let currentClaim: ExternalClaim = null;
        let sliceIndex = -1;
        allAttributes.map((claim, index) => {
            if (claim.claimURI === claimURI) {
                sliceIndex = index;
                currentClaim = claim;
            }
        });

        if (sliceIndex > -1) {
            allAttributes.splice(sliceIndex, 1);
        }
        if (currentClaim !== null) {
            oldAttributes.push(currentClaim);
        }
        setSelectedExternalClaims(oldAttributes);
        setFilteredExternalClaims(allAttributes)
    };

    const removeExternalAttribute = (claimURI) => {
        const allAttributes = [...externalClaims];
        const oldAttributes = [...selectedExternalClaims];
        let currentClaim: ExternalClaim = null;
        let sliceIndex = -1;
        // tslint:disable-next-line:no-shadowed-variable
        oldAttributes.map((claim, index) => {
            if (claim.claimURI === claimURI) {
                sliceIndex = index;
                currentClaim = claim;
            }
        });

        if (sliceIndex > -1) {
            oldAttributes.splice(sliceIndex, 1);
        }
        if (currentClaim !== null) {
            allAttributes.push(currentClaim);
        }
        setSelectedExternalClaims(oldAttributes);
        setFilteredExternalClaims(allAttributes)
    };

    const addAll = (): void => {
        if (selectedDialect.localDialect) {
            const allAttributes = [...filteredClaims];
            const oldAttributes = [...selectedClaims];
            const newAttributes = oldAttributes.concat(allAttributes);
            setSelectedClaims(newAttributes);
            setFilteredClaims([])
        } else {
            const allAttributes = [...filteredExternalClaims];
            const oldAttributes = [...selectedExternalClaims];
            const newAttributes = oldAttributes.concat(allAttributes);
            setSelectedExternalClaims(newAttributes);
            setFilteredExternalClaims([])
        }
    };

    const removeAll = (): void => {
        if (selectedDialect.localDialect) {
            const allAttributes = [...filteredClaims];
            const selectedAttributes = [...selectedClaims];
            // const newAttributes = allAttributes.concat(oldAttributes);
            setSelectedClaims([]);
            setFilteredClaims(claims)
        } else {
            const allAttributes = [...filteredExternalClaims];
            const selectedAttributes = [...selectedExternalClaims];
            // const newAttributes = allAttributes.concat(oldAttributes);
            setSelectedExternalClaims([]);
            setFilteredExternalClaims(externalClaims)
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
            setFilteredClaims(claims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1))
        } else {
            setFilteredExternalClaims(externalClaims.filter((item) =>
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
            setSearchOn(true);
            searchFilter(changeValue);
        } else {
            setSearchOn(false);
            if (selectedDialect.localDialect) {
                setFilteredClaims(claims)
            } else {
                setFilteredExternalClaims(externalClaims)
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
            setFilteredClaims(initialAvailableClaims);

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
                initialSelectedClaims.map((claim: ExtendedClaimInterface) => {
                    createMapping(claim);
                })
            }
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
            setFilteredExternalClaims(initialAvailableClaims);
        }
    };

    useEffect(() => {
        if (filteredClaims && filteredExternalClaims) {
            setFilteredClaims([...claims]);
            setFilteredExternalClaims([...externalClaims]);
        }
    }, [claims, externalClaims]);

    useEffect(() => {
        setInitialValues();
    }, [claimConfigurations]);


    return (
        !isEmpty(claimConfigurations) &&
        <>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 6 }>
                    <Heading as="h5">Attribute Selection</Heading>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="claim-list-row">
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 6 } className="claim-list-columnn" id="style-1">
                    <Heading as="h6">Available Attributes</Heading>
                    <Hint> Choose Attributes to be add to the token </Hint>
                    <Input
                        icon="search"
                        placeholder="Search Attribute"
                        onChange={ handleChange }
                        className={ "available-claim-search" }
                    />
                    <div className="claim-scrolling-list" id="claim-scroll">
                        { selectedDialect.localDialect ?
                            (
                                filteredClaims.length > 0 ?
                                    <List verticalAlign="middle" className="claim-list">
                                        { filteredClaims.map((claim) => {
                                            return (
                                                <AttributeItem
                                                    onClick={ selectAttribute }
                                                    id={ claim.id }
                                                    key={ claim.id }
                                                    claimURI={ claim.claimURI }
                                                    displayName={ claim.displayName }
                                                    mappedURI={ claim.claimURI }
                                                    claimSelected={ false }
                                                    localDialect={ true }
                                                    scope={ "Local" }
                                                />
                                            )
                                        })
                                        }
                                    </List>
                                    :
                                    (searchOn ?
                                            <EmptyPlaceholder
                                                image={ EmptyPlaceholderIllustrations.emptySearch }
                                                imageSize="tiny"
                                                title={ "No Attributes found" }
                                                subtitle={ ["Nothing found on the search"] }
                                            />
                                            :
                                            <div className={ "empty-placeholder-center" }>
                                                <EmptyPlaceholder
                                                    subtitle={ ["There is no attribute available to be selected"] }
                                                />
                                            </div>
                                    )
                            ) :
                            (
                                <List verticalAlign="middle" className="claim-list">
                                    { filteredExternalClaims.length > 0 ? filteredExternalClaims.map((claim) => {
                                            return (
                                                <AttributeItem
                                                    onClick={ selectExternalAttribute }
                                                    id={ claim.id }
                                                    key={ claim.id }
                                                    claimURI={ claim.claimURI }
                                                    displayName={ claim.claimURI }
                                                    mappedURI={ claim.mappedLocalClaimURI }
                                                    claimSelected={ false }
                                                    localDialect={ false }
                                                    scope={ "Local" }
                                                />
                                            )
                                        }) :
                                        <EmptyPlaceholder
                                            image={ EmptyPlaceholderIllustrations.emptyList }
                                            imageSize="tiny"
                                            title={ "No Attributes found" }
                                            subtitle={ ["No Attribute is available to select"] }
                                        />
                                    }
                                </List>
                            )
                        }
                    </div>
                </Grid.Column>

                { selectedDialect.localDialect ?
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 } className="claim-list-columnn selected"
                                 id="style-1" verticalAlign="middle">
                        <Heading as="h6">Selected Attributes</Heading>
                        <Hint> These attributes can be present in the token </Hint>
                        <div className="claim-scrolling-list selected" id="claim-scroll">
                            { selectedClaims.length > 0 ?
                                <List verticalAlign="middle" className="claim-list">
                                    { selectedClaims.map((claim) => {
                                        return (
                                            <AttributeItem
                                                onClick={ removeAttribute }
                                                id={ claim.id }
                                                key={ claim.id }
                                                claimURI={ claim.claimURI }
                                                displayName={ claim.displayName }
                                                mappedURI={ claim.claimURI }
                                                claimSelected={ true }
                                                localDialect={ true }
                                                updateMapping={ updateClaimMapping }
                                                addToMapping={ addToClaimMapping }
                                                scope={ "Local" }
                                                mapping={ getCurrentMapping(claim.claimURI) }
                                                initialMandatory={ claim.mandatory }
                                                initialRequested={ claim.requested }
                                                selectMandatory={ updateMandatory }
                                                selectRequested={ updateRequested }
                                            />
                                        );
                                    })
                                    }
                                </List> :
                                <div className={ "empty-placeholder-center" }>
                                    <EmptyPlaceholder
                                        subtitle={ ["Select the attributes from available attribute list"] }
                                    />
                                </div> }
                        </div>
                    </Grid.Column> :
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 } className="claim-list-columnn selected"
                                 id="style-1">
                        <Heading as="h6">Selected Attributes</Heading>
                        <Hint> These attributes can be present in the token </Hint>
                        <div className="claim-scrolling-list selected" id="claim-scroll">
                            { selectedExternalClaims.length > 0 ?
                                <List verticalAlign="middle" className="claim-list">
                                    { selectedExternalClaims.map((claim) => {
                                        return (
                                            <AttributeItem
                                                onClick={ removeExternalAttribute }
                                                id={ claim.id }
                                                key={ claim.id }
                                                claimURI={ claim.claimURI }
                                                displayName={ claim.claimURI }
                                                mappedURI={ claim.mappedLocalClaimURI }
                                                claimSelected={ true }
                                                localDialect={ false }
                                                selectMandatory={ updateMandatory }
                                                initialMandatory={ claim.mandatory }
                                                scope={ "Local" }
                                            />
                                        )
                                    })
                                    }
                                </List> :
                                <div className={ "empty-placeholder-center" }>
                                    <EmptyPlaceholder
                                        // image={ EmptyPlaceholderIllustrations.newList }
                                        // imageSize="tiny"
                                        // title={ "No Attributes Selected" }
                                        subtitle={ ["Select the attributes from available attribute list"] }
                                    />
                                </div>
                            }
                        </div>
                    </Grid.Column>
                }
            </Grid.Row>
            <Grid.Row>
                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                    <Button
                        onClick={ addAll }
                    >
                        Select All
                    </Button>
                </Grid.Column>
                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                    <Button
                        onClick={ removeAll }
                    >
                        Remove All
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </>
    );
};
