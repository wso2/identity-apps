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

import { EmptyPlaceholder, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Divider, Grid, Segment, Table } from "semantic-ui-react";
import { AttributeListItem } from "./attribute-list-item";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";
import { EmptyPlaceholderIllustrations } from "../../../../configs";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../../models";


interface AttributeSelectionPropsInterface {
    attributeList: IdentityProviderClaimInterface[];
    selectedAttributesWithMapping: IdentityProviderCommonClaimMappingInterface[];
    setSelectedAttributesWithMapping: (selectedAttributes: IdentityProviderCommonClaimMappingInterface[]) => void;
    uiProps: AttributeSelectionUIPropsInterface;
}

export interface AttributeSelectionUIPropsInterface {
    hint: string;
    attributeColumnHeader: string;
    attributeMapColumnHeader: string;
    attributeMapInputPlaceholderPrefix: string;
    enablePrecedingDivider: boolean;
    componentHeading: string;
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
        attributeList,
        setSelectedAttributesWithMapping,
        selectedAttributesWithMapping,
        uiProps
    } = props;
    
    const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const addSelectionModal = (() => {
            return <AttributeSelectionWizard
                attributesList={ attributeList }
                selectedAttributes={ selectedAttributesWithMapping }
                setSelectedAttributes={ setSelectedAttributesWithMapping }
                showAddModal={ showSelectionModal }
                setShowAddModal={ setShowSelectionModal }
            />
        }
    );


    const updateAttributeMapping = (mapping: IdentityProviderCommonClaimMappingInterface): void => {
        setSelectedAttributesWithMapping(
            [
                ...selectedAttributesWithMapping.filter(element => element.claim.uri !== mapping.claim.uri),
                mapping
            ]
        );
    };

    return (
        selectedAttributesWithMapping &&
        <>
            <Grid.Row>
                <Grid.Column computer={ 10 }>
                    { uiProps.enablePrecedingDivider && <Divider/> }
                    <Heading as="h5">
                        { uiProps.componentHeading }
                    </Heading>
                    <Divider hidden/>
                    {
                        (selectedAttributesWithMapping?.length > 0) ? (
                            <Segment.Group fluid>
                                <Segment className="user-role-edit-header-segment clearing">
                                    <Grid.Row>
                                        <Table basic="very" compact>
                                            <Table.Body>
                                                <Table.Row>
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
                                        <Table singleLine compact>
                                            <Table.Header>
                                                {
                                                    (
                                                        <Table.Row>
                                                            <Table.HeaderCell>
                                                                <strong>{ uiProps.attributeColumnHeader }</strong>
                                                            </Table.HeaderCell>
                                                            <Table.HeaderCell>
                                                                <strong>{ uiProps.attributeMapColumnHeader }</strong>
                                                            </Table.HeaderCell>
                                                        </Table.Row>
                                                    )
                                                }
                                            </Table.Header>
                                            <Table.Body>
                                                { selectedAttributesWithMapping?.sort((a, b) =>
                                                    a.claim.displayName.localeCompare(b.claim.displayName))?.map(
                                                    mapping => {
                                                        return (
                                                            <AttributeListItem
                                                                key={ mapping?.claim.id }
                                                                attribute={ mapping?.claim }
                                                                placeholder={ uiProps.attributeMapInputPlaceholderPrefix
                                                                + mapping?.claim.displayName }
                                                                updateMapping={ updateAttributeMapping }
                                                                mapping={ mapping?.mappedValue }
                                                            />
                                                        )
                                                    }) }
                                            </Table.Body>
                                        </Table>
                                    </Grid.Row>
                                </Segment>
                            </Segment.Group>
                        ) : (
                            <Segment>
                                <EmptyPlaceholder
                                    title="No attributes added"
                                    subtitle={ [
                                        "There are no attributes selected at the moment."
                                    ] }
                                    action={
                                        <PrimaryButton onClick={ handleOpenSelectionModal } icon="plus">
                                            Add Attribute
                                        </PrimaryButton>
                                    }
                                    image={ EmptyPlaceholderIllustrations.emptyList }
                                    imageSize="tiny"
                                />
                            </Segment>
                        )
                    }
                    <Hint>
                        { uiProps.hint }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            { addSelectionModal() }
        </>
    );
};
