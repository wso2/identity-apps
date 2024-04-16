/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import { getEmptyAttributeMappingPlaceholder } from "./utils/attribute-settings-utils";
import { fetchAllLocalClaims } from "./utils/claim-utils";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";

/**
 * Properties of {@link AttributesSelectionWizardPage}
 */
export interface AttributesSelectionWizardPageProps extends IdentifiableComponentInterface {
    /**
     * List of mapped attributes.
     */
    mappedAttributesList: Array<IDVPClaimMappingInterface>;
    /**
     * Callback to set the mapped attributes.
     * @param mappingsToBeAdded - List of mapped attributes.
     */
    setMappedAttributeList: (mappingsToBeAdded: IDVPClaimMappingInterface[]) => void;
    /**
     * Initial claims that needs to be displayed.
     */
    initialClaims?: IDVPClaimMappingInterface[];
    /**
     * Flag to determine if the identity claim attributes should be hidden.
     */
    hideIdentityClaimAttributes?: boolean;
    /**
     * Callback to set the loading status of the local claims.
     * @param status - Loading status.
     */
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
        hideIdentityClaimAttributes
    } = props;

    // Manage available local claims.
    const [ availableLocalClaims, setAvailableLocalClaims ] = useState<IDVPLocalClaimInterface[]>([]);
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);
    const [ mappedAttrIds, setMappedAttrIds ] = useState<Set<string>>();
    const [ wereInitialValuesSet, setWereInitialValuesSet ] = useState<boolean>(true);
    const [ showPlaceholder, setShowPlaceholder ] = useState<boolean>(false);

    const { t } = useTranslation();

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
     * Set the show placeholder state.
     */
    useEffect(() => {
        setShowPlaceholder(mappedAttributesList.length === 0);
    }, [ mappedAttributesList ]);

    /**
     * Set initial value for attribute mapping.
     */
    useEffect(() => {
        if (!isEmpty(mappedAttributesList) || isEmpty(availableLocalClaims) || !wereInitialValuesSet) {
            return;
        }
        setInitialValues();
        setWereInitialValuesSet(false);
    }, [ availableLocalClaims, initialClaims ]);

    /**
     * Populate the optional attributes in initial claims (attributes other than the URI) and
     * initially populate the mapped attributes.
     *
     * @returns void
     */
    const setInitialValues = (): void => {

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
     * This function will be called when a new attribute mapping is added.
     *
     * @param mapping - New attribute mapping.
     * @returns void
     */
    const onAttributeMappingAdd = (mapping: IDVPClaimMappingInterface): void => {

        setMappedAttributeList([ ...mappedAttributesList, mapping ]);
        // Add the id of newly added attribute to the mapped id list.
        setMappedAttrIds(new Set<string>([ ...mappedAttrIds, mapping.localClaim.id ]) );
    };

    /**
     * Return the remaining unmapped attributes.
     *
     * @returns A list of remaining unmapped attributes.
     */
    const getRemainingUnmappedAttributes = (): IDVPLocalClaimInterface[]  => {
        return [
            ...availableLocalClaims.filter(
                (attribute: IDVPLocalClaimInterface) => !mappedAttrIds.has(attribute.id)
            )
        ];
    };

    /**
     * This function handles the deletion of attribute mappings.
     *
     * @param mapping - Deleted attribute mapping.
     * @returns void
     */
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

    /**
     * This function handles the editing of attribute mappings.
     *
     * @param oldMapping - Old attribute mapping.
     * @param newMapping - New attribute mapping.
     * @returns void
     */
    const onMappingEdited = ( oldMapping: IDVPClaimMappingInterface, newMapping: IDVPClaimMappingInterface): void => {
        // Remove the old mapping from the list and add the new mapping.
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

    return (
        isLocalClaimsLoading ? <ContentLoader/> : (
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column computer={ 16 } tablet={ 16 } largeScreen={ 16 } widescreen={ 16 }>
                        <Heading as="h4">
                            { t("idvp:forms.attributeSettings.attributeMapping.heading") }
                        </Heading>
                        <Hint compact>
                            { t("idvp:forms.attributeSettings.attributeMapping.hint") }
                        </Hint>
                    </Grid.Column>
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
    "data-componentid": "attributes-selection-wizard-page"
};
