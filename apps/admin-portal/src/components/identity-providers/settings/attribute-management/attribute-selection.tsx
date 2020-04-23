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

import { Button, Divider, Grid, Segment, Table } from "semantic-ui-react";
import { EmptyPlaceholder, Heading, Hint, PrimaryButton } from "@wso2is/react-components";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../../models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import _ from "lodash";
import { AttributeListItem } from "./attribute-list-item";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";
import { EmptyPlaceholderIllustrations } from "../../../../configs";


interface AttributeSelectionPropsInterface {
    attributeList: IdentityProviderClaimInterface[];
    selectedAttributesWithMapping: IdentityProviderCommonClaimMappingInterface[];
    setSelectedAttributesWithMapping: (selectedAttributes: IdentityProviderCommonClaimMappingInterface[]) => void;
    hint: string;
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
        setSelectedAttributesWithMapping,
        selectedAttributesWithMapping,
        componentHeading,
        hint,
        attributeList,
        attributeMapColumnHeader,
        attributeMapInputPlaceholderPrefix,
        enablePrecedingDivider
    } = props;
    
    const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
    const [tempSelectedAttributesWithMapping, setTempSelectedAttributesWithMapping]
        = useState<IdentityProviderCommonClaimMappingInterface[]>([]);

    useEffect(() => {
        setTempSelectedAttributesWithMapping(selectedAttributesWithMapping)
    }, [selectedAttributesWithMapping]);

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const addSelectionModal = (() => {
            return <AttributeSelectionWizard
                attributesList={ attributeList }
                selectedAttributes={ tempSelectedAttributesWithMapping }
                setSelectedAttributes={ setTempSelectedAttributesWithMapping }
                showAddModal={ showSelectionModal }
                setShowAddModal={ setShowSelectionModal }
            />
        }
    );

    const updateAttributeMapping = (mapping: IdentityProviderCommonClaimMappingInterface): void => {
        let existingAttribute = false;
        let updatedTempSelectedAttributesWithMapping = tempSelectedAttributesWithMapping?.map(element => {
           if (element?.claim?.uri === mapping?.claim.uri) {
               existingAttribute = true;
               return {
                   ...element,
                   mappedValue: mapping?.mappedValue
               }
           }
           return element;
        });

        updatedTempSelectedAttributesWithMapping =  existingAttribute ? updatedTempSelectedAttributesWithMapping :
            [...updatedTempSelectedAttributesWithMapping, mapping];

        // If all the mapped values are filled, then submit selected attributes.
        if (!updatedTempSelectedAttributesWithMapping.find(element => _.isEmpty(element.mappedValue))) {
            setSelectedAttributesWithMapping(updatedTempSelectedAttributesWithMapping);
        }

        // Update mapping elements in the component.
        setTempSelectedAttributesWithMapping(updatedTempSelectedAttributesWithMapping);
    };

    return (
        <>
            <Grid.Row>
                <Grid.Column computer={ 10 }>
                    { enablePrecedingDivider && <Divider/> }
                    <Heading as="h5">
                        { componentHeading }
                    </Heading>
                    <Divider hidden/>
                    {
                        (tempSelectedAttributesWithMapping?.length > 0) ? (
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
                                                                <strong>Attribute</strong>
                                                            </Table.HeaderCell>
                                                            <Table.HeaderCell>
                                                                <strong>{ attributeMapColumnHeader }</strong>
                                                            </Table.HeaderCell>
                                                        </Table.Row>
                                                    )
                                                }
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    tempSelectedAttributesWithMapping?.map(mapping => {
                                                        return (
                                                            <AttributeListItem
                                                                key={ mapping?.claim.id }
                                                                attribute={ mapping?.claim }
                                                                placeholder={ attributeMapInputPlaceholderPrefix
                                                                + mapping?.claim.displayName }
                                                                updateMapping={ updateAttributeMapping }
                                                                mapping={ mapping?.mappedValue }
                                                            />
                                                        )
                                                    })
                                                }
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
                        { hint }
                    </Hint>
                </Grid.Column>
            </Grid.Row>
            { addSelectionModal() }
        </>
    );
};
