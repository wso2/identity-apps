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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/form";
import { EmptyPlaceholder, Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Segment, Table } from "semantic-ui-react";
import { AddAttributeSelectionModal } from "./attribute-selection-modal";
import { AttributeMappingList } from "./attributes-mapping-list";
import {
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface
} from "../../../../models/connection";

/**
 * Properties of {@link AttributesSelectionV2}
 */
export interface AttributesSelectionV2Props extends TestableComponentInterface {
    attributeList: Array<ConnectionClaimInterface>;
    mappedAttributesList: Array<ConnectionCommonClaimMappingInterface>;
    onAttributesSelected: (mappingsToBeAdded: ConnectionCommonClaimMappingInterface[]) => void;
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
            <Segment component data-testid={ testId }>
                <EmptyPlaceholder
                    title={
                        t("idp:forms.attributeSettings.attributeMapping." +
                            "placeHolder.title")
                    }
                    subtitle={ [
                        t("idp:forms.attributeSettings.attributeMapping." +
                            "placeHolder.subtitle")
                    ] }
                    action={ !isReadOnly &&
                        (<PrimaryButton onClick={ () => setShowAddModal(true) }>
                            <Icon name="plus" />
                            { t("idp:forms.attributeSettings.attributeMapping." +
                            "placeHolder.action") }
                        </PrimaryButton>)
                    }
                    data-testid={ `${testId}-empty-placeholder` }
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
    const onSave = (mappingsToBeAdded: ConnectionCommonClaimMappingInterface[]) => {
        onAttributesSelected([ ...mappedAttributesList, ...mappingsToBeAdded ]);
        setShowAddModal(false);
    };

    return (
        <>
            <Grid.Row>
                <Grid.Column computer={ 16 } tablet={ 16 } largeScreen={ 16 } widescreen={ 16 }>
                    <Heading as="h4">
                        { t("idp:forms.attributeSettings.attributeMapping." +
                            "heading") }
                    </Heading>
                    <Heading as="h6" color="grey">
                        { t("idp:forms.attributeSettings.attributeMapping." +
                            "subheading") }
                    </Heading>
                    { hasMappedAttributes() ? (
                        <>
                            <Grid.Row className="user-role-edit-header-segment attributes">
                                <Table
                                    data-testid={ `${ testId }-action-bar` }
                                    basic="very"
                                    compact
                                >
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell collapsing width="10">
                                                <Form
                                                    id={ FORM_ID }
                                                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                    onSubmit={ () => {} }
                                                    uncontrolledForm={ false }
                                                >
                                                    <Field.Input
                                                        icon="search"
                                                        iconPosition="left"
                                                        inputType="default"
                                                        maxLength={ 120 }
                                                        minLength={ 1 }
                                                        width={ 16 }
                                                        placeholder={
                                                            t("idp:forms.attributeSettings." +
                                                                "attributeMapping.search.placeHolder")
                                                        }
                                                        listen={ (query: string) => setSearchQuery(query) }
                                                        ariaLabel={ "Search Field" }
                                                        name={ "searchQuery" }/>
                                                </Form>
                                            </Table.Cell>
                                            <Table.Cell textAlign="right">
                                                {
                                                    !isReadOnly && (
                                                        <PrimaryButton
                                                            onClick={ () => setShowAddModal(true) }
                                                            data-testid={ `${ testId }-list-layout-add-button` }
                                                        >
                                                            <Icon name="plus" />
                                                            { t("idp:forms." +
                                                                    "attributeSettings.attributeMapping.placeHolder" +
                                                                    ".action") }
                                                        </PrimaryButton>
                                                    )
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Row>
                            <Segment className="user-role-edit-header-segment attributes">
                                <Grid.Row>
                                    <Table
                                        singleLine
                                        compact
                                        data-testid={ `${ testId }-list` }
                                        fixed
                                    >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width="10">
                                                    <strong>
                                                        {
                                                            t("idp:forms.attributeSettings." +
                                                                "attributeMapping.attributeMapTable." +
                                                                "externalAttributeColumnHeader")
                                                        }
                                                    </strong>
                                                </Table.HeaderCell>
                                                <Table.HeaderCell width="10">
                                                    <strong>
                                                        {
                                                            t("idp:forms.attributeSettings." +
                                                                "attributeMapping.attributeMapTable." +
                                                                "mappedAttributeColumnHeader")
                                                        }
                                                    </strong>
                                                </Table.HeaderCell>
                                                <Table.HeaderCell width="2">
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            <AttributeMappingList
                                                alreadyMappedAttributesList={ [ ...mappedAttributesList ] }
                                                attributeMappingsListToShow={
                                                    mappedAttributesList.filter(
                                                        (
                                                            mappedAttribute: ConnectionCommonClaimMappingInterface
                                                        ) => {
                                                            if (searchQuery) {
                                                                return (
                                                                    mappedAttribute.mappedValue.startsWith(
                                                                        searchQuery
                                                                    ) ||
                                                                    mappedAttribute.claim.id.startsWith(
                                                                        searchQuery
                                                                    )
                                                                );
                                                            }

                                                            return true;
                                                        }
                                                    )
                                                }
                                                noDataPlaceholder={ _attributesListSearchResultsEmptyPlaceholder() }
                                                availableAttributesList={ [
                                                    ...attributeList.filter(
                                                        (attribute: ConnectionClaimInterface) =>
                                                            !mappedAttrIds.includes(attribute.id))
                                                ] }
                                                onMappingDeleted={
                                                    (
                                                        deletedMapping: ConnectionCommonClaimMappingInterface
                                                    ) => {
                                                        onAttributesSelected([
                                                            ...mappedAttributesList?.filter(
                                                                (mappedAttribute:
                                                                    ConnectionCommonClaimMappingInterface
                                                                ) =>
                                                                    mappedAttribute.claim.id !== deletedMapping.claim.id
                                                            )
                                                        ]);
                                                    }
                                                }
                                                onMappingEdited={ (
                                                    oldMapping: ConnectionCommonClaimMappingInterface,
                                                    newMapping: ConnectionCommonClaimMappingInterface
                                                ) => {
                                                    onAttributesSelected([
                                                        ...mappedAttributesList.filter(
                                                            ({ claim }: { claim: ConnectionClaimInterface}) =>
                                                                (claim.id !== oldMapping.claim.id)
                                                        ),
                                                        newMapping
                                                    ]);
                                                } }
                                                readOnly={ isReadOnly }/>
                                        </Table.Body>
                                    </Table>
                                </Grid.Row>
                            </Segment>
                        </>
                    ) : _noAttributesSelectedModalPlaceholder() }
                </Grid.Column>
            </Grid.Row>
            { showAddModal && (
                <AddAttributeSelectionModal
                    attributeList={ [ ...attributeList.filter((attribute: ConnectionClaimInterface) =>
                        !mappedAttrIds.includes(attribute.id)) ] }
                    alreadyMappedAttributesList={ [ ...mappedAttributesList ] }
                    show={ showAddModal }
                    onClose={ onCancel }
                    onSave={ onSave }/>
            ) }
        </>
    );

};

/**
 * Default properties.
 */
AttributesSelectionV2.defaultProps = {
    "data-testid": "attributes-selection-v2"
};
