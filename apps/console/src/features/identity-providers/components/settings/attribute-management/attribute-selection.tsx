/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Code, EmptyPlaceholder, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Icon, Input, Label, Popup, Segment, Table } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../../core";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";

type OnAttributesSelectionCallback = (selectedOnes: IdentityProviderCommonClaimMappingInterface[]) => void;

export interface AttributeSelectionProps extends TestableComponentInterface {
    attributeList: IdentityProviderClaimInterface[];
    selectedAttributesWithMapping: IdentityProviderCommonClaimMappingInterface[];
    onAttributesSelection: OnAttributesSelectionCallback;
}

export const AttributeSelection = (props: AttributeSelectionProps) => {

    const {
        attributeList,
        selectedAttributesWithMapping,
        onAttributesSelection,
        ["data-testid"]: testId
    } = props;

    const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
    const [attrSearchQuery, setAttrSearchQuery] = useState<string>("");

    const onSearchInputValueChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
        setAttrSearchQuery(target.value ?? "");
    };

    const onEditIconButtonClicked = (): void => {
        setShowSelectionModal(true);
    };

    const onAddIdPAttributeClicked = (): void => {
        setShowSelectionModal(true);
    };

    const updateAttributeClaimMapping = (mapping: IdentityProviderCommonClaimMappingInterface): void => {
        const otherMappingsExceptUpdatingOne = selectedAttributesWithMapping.filter(
            element => element.claim.uri !== mapping.claim.uri
        );
        onAttributesSelection([
            ...otherMappingsExceptUpdatingOne,
            mapping
        ]);
    };

    const removeAttributeClaimMapping = (mapping: IdentityProviderCommonClaimMappingInterface): void => {
        const everyClaimExceptRemovingOne = selectedAttributesWithMapping.filter(
            element => element.claim.uri !== mapping.claim.uri
        );
        onAttributesSelection([...everyClaimExceptRemovingOne]);
    };

    const hasAttributesSelected = (): boolean => {
        return selectedAttributesWithMapping &&
            selectedAttributesWithMapping.length > 0;
    };

    const _attributesTableControls = (): ReactElement => {
        return (
            <Table basic="very" compact>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Input
                                icon={ <Icon name="search" /> }
                                onChange={ onSearchInputValueChange }
                                placeholder={ "Search attribute" }
                                floated="left"
                                size="small"
                                data-testid={ `${testId}-search` }
                            />
                        </Table.Cell>
                        <Table.Cell textAlign="right">
                            <Button
                                size="medium"
                                icon="pencil"
                                floated="right"
                                onClick={ onEditIconButtonClicked }
                                data-testid={ `${testId}-edit-button` }
                            />
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    };

    const _attributesMappingTable = (): ReactElement => {
        return (
            <Table singleLine compact>
                <Table.Header>
                    <Table.Row>

                        <Table.HeaderCell width={ 6 }>
                            <strong>Attribute</strong>
                        </Table.HeaderCell>
                        <Table.HeaderCell width={ 8 }>
                            <strong>IdP mapping attribute</strong>
                            <Hint icon="info circle" popup>
                                Enter the custom attribute that should be requested
                                instead of the default attribute.
                            </Hint>
                        </Table.HeaderCell>
                        <Table.HeaderCell width={ 2 } />

                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { selectedAttributesWithMapping.filter((m) => {
                        if (!attrSearchQuery || !attrSearchQuery.trim()) return true;
                        return m.claim.displayName
                            .toLowerCase()
                            .match(attrSearchQuery.toLowerCase());
                    }).map((mapping) => {
                        return (
                            <AttributeMappingListItem
                                key={ mapping.claim.uri }
                                onAttributeMappingUpdate={ (newMappedValue: string) => {
                                    const newMapping = cloneDeep(mapping);
                                    newMapping.mappedValue = newMappedValue;
                                    updateAttributeClaimMapping(newMapping);
                                } }
                                onAttributeMappingRemoveClicked={ () => {
                                    removeAttributeClaimMapping(mapping);
                                } }
                                attribute={ mapping }
                            />
                        );
                    }) }
                </Table.Body>
            </Table>
        );
    };

    const _mappingSegment = (): ReactElement => {
        return (
            <Segment.Group fluid>
                <Segment className="user-role-edit-header-segment clearing">
                    <Grid.Row>
                        { _attributesTableControls() }
                    </Grid.Row>
                    <Grid.Row>
                        { _attributesMappingTable() }
                    </Grid.Row>
                </Segment>
            </Segment.Group>
        );
    };

    const _placeholder = (): ReactElement => {
        return (
            <Segment data-testid={ testId }>
                <EmptyPlaceholder
                    title={ "No attributes added" }
                    subtitle={ "There are no attributes added for the IdP at the moment." }
                    action={
                        <PrimaryButton onClick={ onAddIdPAttributeClicked } icon="plus">
                            Add IdP Attribute
                        </PrimaryButton>
                    }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    data-testid={ `${testId}-empty-placeholder` }
                />
            </Segment>
        );
    };

    return (
        <React.Fragment>
            <Grid.Row>
                <Grid.Column computer={ 16 } tablet={ 16 } largeScreen={ 12 } widescreen={ 12 }>
                    <Heading as="h4">
                        Attribute Selection
                    </Heading>
                    <Hint compact>
                        Add and map the supported attributes from external IdP.
                    </Hint>
                    <Divider hidden />
                    { hasAttributesSelected() ? _mappingSegment() : _placeholder() }
                </Grid.Column>
            </Grid.Row>
            <AttributeSelectionWizard
                attributesList={ attributeList }
                selectedAttributeMappings={ selectedAttributesWithMapping }
                show={ showSelectionModal }
                onAttributesSelected={ (selectedMappings) => {
                    onAttributesSelection([
                        ...selectedMappings,
                        ...selectedAttributesWithMapping
                    ]);
                } }
                onClose={ () => setShowSelectionModal(false) }
            />
        </React.Fragment>
    );

};

interface AttributeMappingListItemProps extends TestableComponentInterface {
    attribute: IdentityProviderCommonClaimMappingInterface;
    onAttributeMappingUpdate: (newValue: string) => void;
    onAttributeMappingRemoveClicked?: (attribute) => void
    showMappingInput?: boolean;
}

/**
 * This component is responsible for rendering a individual row
 * in the attributes mapping table.
 *
 * What does this component show?
 *  - local attribute name (Only a readonly text label)
 *  - mapped attribute and make it an editable input (delegates the event)
 *  - attribute remove icon button (delegates the event)
 *  - a checkbox which can mark attribute mandatory or not (delegates the event)
 *
 * @param {AttributeMappingListItemProps} props
 * @constructor
 */
const AttributeMappingListItem: FC<AttributeMappingListItemProps> = (
    props: AttributeMappingListItemProps
) => {

    const {
        attribute,
        onAttributeMappingUpdate,
        showMappingInput,
        onAttributeMappingRemoveClicked,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const [mappedAttributeValue, setMappedAttributeValue] = useState<string>();
    const [mappingEditInputHasError, setMappingEditInputHasError] = useState<boolean>();

    /**
     * This effect is added to set the {@link attribute}'s mapped
     * value to the component state. Without setting it like
     * {@code useState<string>(attribute?.mappedValue)} we will
     * set it from here instead.
     */
    useEffect(() => {
        setMappedAttributeValue(attribute?.mappedValue);
    }, []);

    /**
     * Whenever the {@link mappedAttributeValue} gets changed
     * we will validate the value in here and set error message
     * if there's any.
     */
    useEffect(() => {
        if (isEmpty(mappedAttributeValue)) {
            setMappingEditInputHasError(true);
            return;
        }
        onAttributeMappingUpdate(mappedAttributeValue);
        setMappingEditInputHasError(false);
    }, [mappedAttributeValue]);

    return (
        <Table.Row>
            <Table.Cell>
                <div>{ attribute.claim.displayName }</div>
                <Code compact withBackground={ false }>{ attribute.claim.uri }</Code>
            </Table.Cell>
            {
                showMappingInput &&
                <Table.Cell error={ showMappingInput && isEmpty(mappedAttributeValue) }>
                    <Input
                        required
                        placeholder={ `Attribute ${attribute.claim.displayName}` }
                        value={ mappedAttributeValue }
                        onChange={ ({ target }) => setMappedAttributeValue(target.value) }
                        data-testid={ `${testId}-input` }
                    />
                    { (showMappingInput && mappingEditInputHasError) && (
                        <Label
                            basic color="red"
                            pointing="left">
                            You cannot leave an attribute mapping empty!
                        </Label>
                    ) }
                </Table.Cell>
            }
            <Table.Cell>
                <Table.Cell textAlign="right">
                    <Popup
                        trigger={ (
                            <Icon
                                link={ true }
                                className="list-icon pr-4"
                                size="large"
                                color="grey"
                                name="trash alternate"
                                onClick={ onAttributeMappingRemoveClicked }
                            />
                        ) }
                        position="top right"
                        content={ t("common:remove") }
                        inverted
                    />
                </Table.Cell>
            </Table.Cell>
        </Table.Row>
    );

};

AttributeMappingListItem.defaultProps = {
    showMappingInput: true
};
