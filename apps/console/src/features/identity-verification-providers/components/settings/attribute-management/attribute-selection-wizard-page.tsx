/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, Heading, Hint } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import { fetchAllLocalClaims, getEmptyAttributeMappingPlaceholder } from "./utils";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";

/**
 * Properties of {@link AttributesSelectionWizardPage}
 */
export interface AttributesSelectionWizardPageProps extends IdentifiableComponentInterface {
    initialClaims?: IDVPClaimMappingInterface[];
    mappedAttributesList: Array<IDVPClaimMappingInterface>;
    setMappedAttributeList: (mappingsToBeAdded: IDVPClaimMappingInterface[]) => void;
    hideIdentityClaimAttributes?: boolean;
    setIsClaimsLoading?: (status: boolean) => void;
}

/**
 * This component renders the attributes selection on a wizard page.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AttributesSelectionWizardPage: FunctionComponent<AttributesSelectionWizardPageProps> = (
    props: AttributesSelectionWizardPageProps
): ReactElement => {

    const {
        initialClaims,
        mappedAttributesList,
        setMappedAttributeList,
        hideIdentityClaimAttributes,
        [ "data-componentid" ]: componentId
    } = props;
    // Manage available local claims.
    const [ availableLocalClaims, setAvailableLocalClaims ] = useState<IDVPLocalClaimInterface[]>([]);
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);
    const [ mappedAttrIds, setMappedAttrIds ] = useState<Set<string>>();

    /**
     * Fetch all the local claims and set them to availableLocalClaims.
     */
    useEffect(() => {
        fetchAllLocalClaims(hideIdentityClaimAttributes, setAvailableLocalClaims, setIsLocalClaimsLoading);
    }, []);

    /**
     * Populate the mapped attribute ids set.
     */
    useEffect(() => {
        const ids: Set<string> = new Set<string>();

        for (const mapping of mappedAttributesList) {
            ids.add(mapping.localClaim.id);
        }
        setMappedAttrIds(ids);
    }, [ availableLocalClaims, mappedAttributesList ]);

    /**
     * Set initial value for attribute mapping.
     */
    useEffect(() => {
        if (!isEmpty(mappedAttributesList) || isEmpty(availableLocalClaims) || isEmpty(mappedAttrIds)) {
            return;
        }
        setInitialValues();
    }, [ availableLocalClaims, initialClaims ]);

    /**
     * Populate the optional attributes in initial claims (attributes other than the URI) and
     * populate the mapped attributes initially.
     */
    const setInitialValues = () => {

        if (!initialClaims) {
            return;
        }

        initialClaims.forEach((claim: IDVPClaimMappingInterface) => {
            claim.localClaim = availableLocalClaims.find((localClaim: IDVPLocalClaimInterface) => {
                return localClaim.uri === claim.localClaim.uri;
            });
        });
        setMappedAttributeList(initialClaims);

    };


    /**
     * Return the remaining unmapped attributes.
     */
    const getRemainingUnmappedAttributes = () => {
        return [
            ...availableLocalClaims.filter(
                (attribute: IDVPLocalClaimInterface) => !mappedAttrIds.has(attribute.id)
            )
        ];
    };

    // Pasted Stuff

    /**
     * This has the state to tell whether {@link mappedAttributesList} is empty
     * or not. We need this to control the {@link Transition} state.
     */
    const [ showPlaceholder, setShowPlaceholder ] = useState<boolean>(false);

    useEffect(() => {
        setShowPlaceholder(mappedAttributesList.length === 0);
    }, [ mappedAttributesList ]);

    const onAttributeMappingAdd = (mapping: IDVPClaimMappingInterface): void => {

        setMappedAttributeList([ ...mappedAttributesList, mapping ]);

        // Add the id of newly added attribute to the mapped id list.
        setMappedAttrIds(new Set<string>([ ...mappedAttrIds, mapping.localClaim.id ]) );

    };

    const onMappingDeleted = (mapping: IDVPClaimMappingInterface): void => {
        // filter out the deleted mapping from mappedAttributesList
        const filtered: IDVPClaimMappingInterface[] = mappedAttributesList.filter(
            (m: IDVPClaimMappingInterface) => ( m.localClaim.id !== mapping.localClaim.id)
        );
        const mappedAttrIdsCopy: Set<string> = new Set<string>(mappedAttrIds);

        setMappedAttributeList([ ...filtered ]);
        // Remove the id of deleted attribute from the mapped id list.
        mappedAttrIdsCopy.delete(mapping.localClaim.id);
        setMappedAttrIds(mappedAttrIdsCopy);
    };

    const onMappingEdited = ( oldMapping: IDVPClaimMappingInterface, newMapping: IDVPClaimMappingInterface) => {
        // If user changed the local mapping of this. Then first
        // go and remove it from {@link claimsToBeAdded} array.
        const newMappedAttributeList: IDVPClaimMappingInterface[] = [
            ...mappedAttributesList.filter(
                ({ localClaim }: IDVPClaimMappingInterface) => (localClaim.id !== oldMapping.localClaim.id)
            ),
            newMapping
        ];

        setMappedAttributeList(newMappedAttributeList);

        if(oldMapping.localClaim.id !== newMapping.localClaim.id) {
            const newMappedAttrIds: Set<string> = new Set<string>(mappedAttrIds);

            newMappedAttrIds.delete(oldMapping.localClaim.id);
            newMappedAttrIds.add(newMapping.localClaim.id);
            setMappedAttrIds(newMappedAttrIds);
        }

    };

    // End of pasted stuff

    return (
        isLocalClaimsLoading ? <ContentLoader/> : (
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column computer={ 16 } tablet={ 16 } largeScreen={ 16 } widescreen={ 16 }>
                        <Heading as="h4">
                        Identity Verification Provider Attribute Mappings
                        </Heading>
                        <Hint compact>
                        Add and map the supported attributes from external Identity Verification Provider.
                        </Hint>
                        <Divider hidden/>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <AttributeMappingListItem
                            availableAttributeList={ getRemainingUnmappedAttributes() }
                            alreadyMappedAttributesList={ mappedAttributesList }
                            onSubmit={ onAttributeMappingAdd }/>
                    </Grid.Column>
                    <Grid.Column width={ 16 }>
                        { !showPlaceholder
                            ? (
                                <React.Fragment>
                                    <Divider hidden/>
                                    <AttributeMappingList
                                        key="attribute-mapping-working-list"
                                        alreadyMappedAttributesList={ mappedAttributesList }
                                        onMappingDeleted={ onMappingDeleted }
                                        onMappingEdited={ onMappingEdited }
                                        attributeMappingsListToShow={ mappedAttributesList }
                                        availableAttributesList={ getRemainingUnmappedAttributes() }/>
                                </React.Fragment>
                            ) : getEmptyAttributeMappingPlaceholder()
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    );

};

/**
 * Default properties.
 */
AttributesSelectionWizardPage.defaultProps = {
    "data-componentid": "attributes-selection-v2"
};
