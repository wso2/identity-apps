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
import { Field, Form } from "@wso2is/form";
import { EmptyPlaceholder, Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { AddAttributeSelectionModal } from "./attribute-selection-modal";
import { AttributeMappingList } from "./attributes-mapping-list";
import { getEmptyPlaceholderIllustrations } from "../../../../core";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";

/**
 * Properties of {@link AttributesSelectionV2}
 */
export interface AttributesSelectionV2Props extends TestableComponentInterface {
    attributeList: Array<IdentityProviderClaimInterface>;
    mappedAttributesList: Array<IdentityProviderCommonClaimMappingInterface>;
    onAttributesSelected: (mappingsToBeAdded: IdentityProviderCommonClaimMappingInterface[]) => void;
    isReadOnly: boolean;
}

const FORM_ID: string = "idp-attribute-selection-v2-form";

/**
 * New implementation of attributes selection for IdPs. It has a similar
 * look and feel of Claims components.
 *
 * TODO: Validate the necessity of this component. If this is the way forward, remove the
 * v1 component and remove the v2 suffix from this component.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AttributesSelectionV2: FunctionComponent<AttributesSelectionV2Props> = (
    props: AttributesSelectionV2Props
): ReactElement => {

    const {
        attributeList,
        mappedAttributesList,
        onAttributesSelected,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const [ showAddModal, setShowAddModal ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string | undefined>(undefined);
    const [ mappedAttrIds, setMappedAttrIds ] = useState<string[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        const ids: string[] = [];

        for (const mapping of mappedAttributesList) {
            ids.push(mapping.claim.id);
        }

        setMappedAttrIds(ids);
    }, [ attributeList ]);

    /**
     * Check if there are mapped attibutes.
     *
     * @returns Has mapped attributes or not.
     */
    const hasMappedAttributes = (): boolean => {
        return mappedAttributesList &&
            mappedAttributesList.length > 0;
    };

    /**
     * The placeholder component to show when there's no attributes selected.
     *
     * @returns Selection modal placeholder.
     */
    const _noAttributesSelectedModalPlaceholder = (): ReactElement => {
        return (
            <Segment data-testid={ testId }>
                <EmptyPlaceholder
                    title={ "No attributes added" }
                    subtitle={ [
                        <p key={ "no-attributes-configured" }>
                            There are no attributes added for this <strong>Identity Provider</strong>.
                        </p>
                    ] }
                    action={ !isReadOnly && (
                        <PrimaryButton onClick={ () => setShowAddModal(true) }>
                            <Icon name="add"/>
                            Add IdP Attributes
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    data-testid={ `${ testId }-empty-placeholder` }
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
                data-testid={ `${ testId }-empty-search-placeholder` }
            />
        );
    };

    /**
     * Modal cancel / dismiss event.
     */
    const onCancel = () => {
        setShowAddModal(false);
    };

    /**
     * This is called when modal save button is clicked. In this what we
     * is, we simply close the modal and call {@link onAttributesSelected}
     * with the newly added mappings + existing mappings.
     *
     * @param mappingsToBeAdded - Set of mappings.
     */
    const onSave = (mappingsToBeAdded: IdentityProviderCommonClaimMappingInterface[]) => {
        onAttributesSelected([ ...mappedAttributesList, ...mappingsToBeAdded ]);
        setShowAddModal(false);
    };

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column computer={ 16 } tablet={ 16 } largeScreen={ 16 } widescreen={ 16 }>
                    <Heading as="h4">
                        Identity Provider Attribute Mappings
                    </Heading>
                    <Hint compact>
                        Add and map the supported attributes from external Identity Provider.
                    </Hint>
                    <Divider hidden/>
                    { hasMappedAttributes() ? (
                        <Segment>
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 7 }>
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
                                                listen={ (query) => setSearchQuery(query) }
                                                ariaLabel={ "Search Field" }
                                                name={ "searchQuery" }/>
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column width={ 9 } textAlign="right">
                                        { !isReadOnly && (
                                            <PrimaryButton
                                                onClick={ () => setShowAddModal(true) }
                                                data-testid={ `${ testId }-list-layout-add-button` }>
                                                <Icon name="add"/>
                                                Add Attribute Mapping
                                            </PrimaryButton>
                                        ) }
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 16 }>
                                        <AttributeMappingList
                                            alreadyMappedAttributesList={ [ ...mappedAttributesList ] }
                                            attributeMappingsListToShow={
                                                mappedAttributesList.filter((m) => {
                                                    if (searchQuery) {
                                                        return m.mappedValue.startsWith(searchQuery) ||
                                                            m.claim.id.startsWith(searchQuery);
                                                    }

                                                    return true;
                                                })
                                            }
                                            noDataPlaceholder={ _attributesListSearchResultsEmptyPlaceholder() }
                                            availableAttributesList={ [
                                                ...attributeList.filter((a) => !mappedAttrIds.includes(a.id))
                                            ] }
                                            onMappingDeleted={ (deletedMapping) => {
                                                onAttributesSelected([
                                                    ...mappedAttributesList
                                                        ?.filter((m) => m.claim.id !== deletedMapping.claim.id)
                                                ]);
                                            } }
                                            onMappingEdited={ (oldMapping, newMapping) => {
                                                onAttributesSelected([
                                                    ...mappedAttributesList.filter(
                                                        ({ claim }) => (claim.id !== oldMapping.claim.id)
                                                    ),
                                                    newMapping
                                                ]);
                                            } }
                                            readOnly={ isReadOnly }/>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    ) : _noAttributesSelectedModalPlaceholder() }
                </Grid.Column>
            </Grid.Row>
            { showAddModal && (
                <AddAttributeSelectionModal
                    attributeList={ [ ...attributeList.filter((a) => !mappedAttrIds.includes(a.id)) ] }
                    alreadyMappedAttributesList={ [ ...mappedAttributesList ] }
                    show={ showAddModal }
                    onClose={ onCancel }
                    onSave={ onSave }/>
            ) }
        </Grid>
    );

};

/**
 * Default properties.
 */
AttributesSelectionV2.defaultProps = {
    "data-testid": "attributes-selection-v2"
};
