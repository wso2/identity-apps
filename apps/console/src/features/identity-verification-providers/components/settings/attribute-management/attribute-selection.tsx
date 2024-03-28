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
import { Field, Form } from "@wso2is/form";
import { ContentLoader, EmptyPlaceholder, Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { AddAttributeSelectionModal } from "./attribute-selection-modal";
import { AttributeMappingList } from "./attributes-mapping-list";
import { fetchAllLocalClaims } from "./utils/claim-utils";
import { getEmptyPlaceholderIllustrations } from "../../../../core";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";

/**
 * Properties of {@link AttributesSelection}
 */
export interface AttributesSelectionProps extends IdentifiableComponentInterface {
    /**
     * List of mapped attributes.
     */
    mappedAttributesList: Array<IDVPClaimMappingInterface>;
    /**
     * Callback to set the mapped attributes.
     * @param mappingsToBeAdded - List of mapped attributes.
     */
    setMappedAttributes: (mappingsToBeAdded: IDVPClaimMappingInterface[]) => void;
    /**
     * Flag to determine if the component is read only.
     */
    isReadOnly: boolean;
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

const FORM_ID: string = "idvp-attribute-selection-form";

/**
 * Attributes selection UI for IDVPs.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AttributesSelection: FunctionComponent<AttributesSelectionProps> = (
    props: AttributesSelectionProps
): ReactElement => {

    const {
        initialClaims,
        mappedAttributesList,
        setMappedAttributes,
        hideIdentityClaimAttributes,
        isReadOnly,
        [ "data-componentid" ]: componentId
    } = props;

    // Manage available local claims.
    const [ availableLocalClaims, setAvailableLocalClaims ] = useState<IDVPLocalClaimInterface[]>([]);
    const [ isLocalClaimsLoading, setIsLocalClaimsLoading ] = useState<boolean>(true);
    const [ showAddModal, setShowAddModal ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string | undefined>(undefined);
    const [ mappedAttrIds, setMappedAttrIds ] = useState<string[]>([]);

    const { t } = useTranslation();

    /**
     * Fetch available local claims when the component render.
     */
    useEffect(() => {
        fetchAllLocalClaims(hideIdentityClaimAttributes, setAvailableLocalClaims, setIsLocalClaimsLoading);
    }, []);

    /**
     * Populate the mapped attribute ids list.
     */
    useEffect(() => {
        const ids: string[] = [];

        for (const mapping of mappedAttributesList) {
            ids.push(mapping.localClaim.id);
        }

        setMappedAttrIds(ids);
    }, [ availableLocalClaims ]);

    /**
     * Set initial value for claim mapping.
     */
    useEffect(() => {
        if (isEmpty(availableLocalClaims)) {
            return;
        }
        setInitialValues();
    }, [ availableLocalClaims ]);

    /**
     *  Process and set initial claims values to mapped attributes.
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

        setMappedAttributes(initialClaims);
    };

    /**
     * Check if there are mapped attributes.
     *
     * @returns Has mapped attributes or not.
     */
    const hasMappedAttributes = (): boolean => {
        return mappedAttributesList && mappedAttributesList.length > 0;
    };

    /**
     * The placeholder component to show when there's no attributes selected.
     *
     * @returns Selection modal placeholder.
     */
    const _noAttributesSelectedModalPlaceholder = (): ReactElement => {
        return (
            <Segment data-componentid={ componentId }>
                <EmptyPlaceholder
                    title={
                        t("idvp:forms.attributeSettings.attributeMapping." +
                            "emptyPlaceholderEdit.title")
                    }
                    subtitle={ [
                        <p key={ "no-attributes-configured" }>
                            {
                                t("idvp:forms.attributeSettings.attributeMapping." +
                                    "emptyPlaceholderEdit.subtitle")
                            }
                        </p>
                    ] }
                    action={ !isReadOnly && (
                        <PrimaryButton
                            onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {
                                e.preventDefault();
                                setShowAddModal(true);
                            } }
                        >
                            <Icon name="add"/>
                            { t("idvp:forms.attributeSettings.attributeMapping.addButton") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            </Segment>
        );
    };

    /**
     * The placeholder component to show when there's no results for
     * the search query {@link searchQuery}.
     *
     * @returns Empty results placeholder.
     */
    const _attributesListSearchResultsEmptyPlaceholder = (): ReactElement => {
        return (
            <EmptyPlaceholder
                action={ (
                    <LinkButton onClick={ () => setSearchQuery(undefined) }>
                        { t("console:manage.placeholders.emptySearchResult.action") }
                    </LinkButton>
                ) }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
                title={ t("console:manage.placeholders.emptySearchResult.title") }
                subtitle={ [
                    t("console:manage.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                    t("console:manage.placeholders.emptySearchResult.subtitles.1")
                ] }
                data-componentid={ `${ componentId }-empty-search-placeholder` }
            />
        );
    };

    /**
     * Modal cancel / dismiss event.
     * @returns void
     */
    const onCancel = (): void => {
        setShowAddModal(false);
    };

    /**
     * This is called when modal save button is clicked. In this what we
     * do is, we simply close the modal and call {@link onAttributesSelected}
     * with the newly added mappings + existing mappings.
     *
     * @param mappingsToBeAdded - Set of mappings.
     * @returns void
     */
    const onSave = (mappingsToBeAdded: IDVPClaimMappingInterface[]): void => {

        setMappedAttributes([ ...mappedAttributesList, ...mappingsToBeAdded ]);
        setShowAddModal(false);
    };

    /**
     * Filter the mapped attributes list based on the search query.
     *
     * @returns Filtered mapped attributes list by the search query.
     */
    const getFilteredAttributeMappings = (): IDVPClaimMappingInterface[] => {

        return mappedAttributesList.filter((mapping: IDVPClaimMappingInterface) => {
            if (searchQuery) {
                return mapping.idvpClaim.startsWith(searchQuery) || mapping.localClaim?.id.startsWith(searchQuery);
            }

            return true;
        });

    };

    /**
     * Get the list of attributes which does not have their Ids in mapped attribute id list.
     *
     * @returns List of the remaining unmapped attributes.
     */
    const getRemainingUnmappedAttributes = (): IDVPLocalClaimInterface[] => {
        return [
            ...availableLocalClaims.filter(
                (attribute: IDVPLocalClaimInterface) => !mappedAttrIds.includes(attribute.id)
            )
        ];
    };

    /**
     * Handles the deletion of an attribute mapping.
     *
     * @param deletedMapping - The mapping that is to be deleted.
     * @returns void
     */
    const handleAttributeMappingDeletion = (deletedMapping: IDVPClaimMappingInterface): void => {

        setMappedAttributes([
            ...mappedAttributesList?.filter(
                (attribute: IDVPClaimMappingInterface ) => (attribute.localClaim?.id !== deletedMapping.localClaim?.id)
            )
        ]);
    };

    /**
     * Handles the editing of an attribute mapping.
     *
     * @param previous - The previous mapping.
     * @param current - The current mapping.
     * @returns void
     */
    const handleEditAttributeMapping = (
        previous: IDVPClaimMappingInterface,
        current:IDVPClaimMappingInterface
    ): void => {

        setMappedAttributes([
            ...mappedAttributesList.filter(
                (attribute: IDVPClaimMappingInterface) => ( attribute?.localClaim?.id !== previous.localClaim?.id)
            ),
            current
        ]);
    };

    /**
     * Get the attribute mapping list component.
     *
     * @returns Attribute mapping list component.
     */
    const getAttributeMappingListComponent = () => {
        return (
            <AttributeMappingList
                alreadyMappedAttributesList={ [ ...mappedAttributesList ] }
                attributeMappingsListToShow={ getFilteredAttributeMappings() }
                noDataPlaceholder={ _attributesListSearchResultsEmptyPlaceholder() }
                availableAttributesList={ getRemainingUnmappedAttributes() }
                onMappingDeleted={ handleAttributeMappingDeletion }
                onMappingEdited={ handleEditAttributeMapping }
                readOnly={ isReadOnly }
            />
        );
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
                        <Divider hidden/>
                        { hasMappedAttributes() ? (
                            <Segment>
                                <Grid>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column width={ isReadOnly ? 16 : 7 }>
                                            <Form
                                                id={ FORM_ID }
                                                onSubmit={ () => ({ /*Noop*/ }) }
                                                uncontrolledForm={ false }
                                            >
                                                <Field.Input
                                                    icon="search"
                                                    iconPosition="left"
                                                    inputType="default"
                                                    maxLength={ 120 }
                                                    minLength={ 1 }
                                                    width={ 16 }
                                                    placeholder="Search mapped attribute"
                                                    listen={ (query: string) => setSearchQuery(query) }
                                                    ariaLabel={ "Search Field" }
                                                    name={ "searchQuery" }
                                                />
                                            </Form>
                                        </Grid.Column>
                                        <Grid.Column width={ 9 } textAlign="right">
                                            { !isReadOnly && (
                                                <PrimaryButton
                                                    onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.preventDefault();
                                                        setShowAddModal(true);
                                                    } }
                                                    data-componentid={ `${ componentId }-list-layout-add-button` }
                                                >
                                                    <Icon name="add"/>
                                                    {
                                                        t("idvp:forms.attributeSettings" +
                                                        ".attributeMapping.addButton")
                                                    }
                                                </PrimaryButton>
                                            ) }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column width={ 16 }>
                                            { getAttributeMappingListComponent() }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        ) : _noAttributesSelectedModalPlaceholder() }
                    </Grid.Column>
                </Grid.Row>
                { showAddModal && (
                    <AddAttributeSelectionModal
                        attributeList={ getRemainingUnmappedAttributes() }
                        alreadyMappedAttributesList={ [ ...mappedAttributesList ] }
                        show={ showAddModal }
                        onClose={ onCancel }
                        onSave={ onSave }
                    />
                ) }
            </Grid>
        )
    );

};

/**
 * Default properties.
 */
AttributesSelection.defaultProps = {
    "data-componentid": "idvp-attributes-selection"
};
