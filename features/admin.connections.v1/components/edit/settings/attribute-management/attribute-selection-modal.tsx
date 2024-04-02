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
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal, Table } from "semantic-ui-react";
import { AttributeMappingAddItem } from "./attribute-mapping-add-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import { 
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface 
} from "../../../../models/connection";

interface AddAttributeSelectionModalProps extends TestableComponentInterface {
    attributeList: Array<ConnectionClaimInterface>;
    alreadyMappedAttributesList: Array<ConnectionCommonClaimMappingInterface>;
    onClose: () => void;
    onSave: (mappingsToBeAdded: ConnectionCommonClaimMappingInterface[]) => void;
    show: boolean;
}

/**
 * Attributes mapping modal. User should be able to select attributes
 * which aren't already selected. Then It will render a list inside modal
 * once keeps adding.
 *
 * @param props - AddAttributeSelectionModalProps
 */
export const AddAttributeSelectionModal: FunctionComponent<AddAttributeSelectionModalProps> = (
    props: AddAttributeSelectionModalProps
): ReactElement => {

    const {
        attributeList,
        alreadyMappedAttributesList,
        show,
        onClose,
        onSave
    } = props;

    const { t } = useTranslation();

    /**
     * The claims that user picks. All the selecting ones will be
     * pushed to this piece of state.
     */
    const [ claimsToBeAdded, setClaimsToBeAdded ] = useState<ConnectionCommonClaimMappingInterface[]>([]);
    /**
     * Since this modal is a intermediate step in adding attributes
     * we can't read the records always from from {@link attributeList}
     * we need to internally remove selected ones from the dropdown.
     */
    const [ copyOfAttributes, setCopyOfAttributes ] = useState<ConnectionClaimInterface[]>([]);
    /**
     * This has the state to tell whether {@link claimsToBeAdded} is empty
     * or not. We need this to control the {@link Transition} state.
     */
    const [ showPlaceholder, setShowPlaceholder ] = useState<boolean>(false);

    const [
        alreadyLocallyMappedAttributes,
        setAlreadyLocallyMappedAttributes
    ] = useState<ConnectionCommonClaimMappingInterface[]>();

    useEffect(() => {
        // Clone it first. We don't want to mutate the original list.
        setCopyOfAttributes([ ...attributeList ]);
        setAlreadyLocallyMappedAttributes([ ...alreadyMappedAttributesList ]);
    }, []);

    useEffect(() => {
        setShowPlaceholder(claimsToBeAdded.length === 0);
    }, [ claimsToBeAdded ]);

    const onAttributeMappingAdd = (
        mapping: ConnectionCommonClaimMappingInterface
    ): void => {
        const newClaimsToBeAdded: ConnectionCommonClaimMappingInterface[] = [
            ...claimsToBeAdded,
            mapping
        ];

        const idsToHide: Set<string> = newClaimsToBeAdded.reduce(
            (
                acc: Set<string>,
                value: ConnectionCommonClaimMappingInterface
            ) => acc.add(value?.claim?.id),
            new Set<string>()
        );

        // Records to be added.
        setClaimsToBeAdded(newClaimsToBeAdded);
        // Remove the added attribute from the attribute list.
        setCopyOfAttributes([
            ...copyOfAttributes.filter(
                (attr: ConnectionClaimInterface) => !idsToHide.has(attr.id)
            )
        ]);
        // Now reinitialize the already mapped attributes list.
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes,
            mapping
        ]);
    };

    const onMappingDeleted = (
        mapping: ConnectionCommonClaimMappingInterface
    ): void => {
        const filtered: ConnectionCommonClaimMappingInterface[] =
            claimsToBeAdded.filter(
                (m: ConnectionCommonClaimMappingInterface) =>
                    m.claim.id !== mapping.claim.id
            );

        setClaimsToBeAdded([ ...filtered ]);
        setCopyOfAttributes([ ...copyOfAttributes, mapping.claim ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes.filter(
                (e: ConnectionCommonClaimMappingInterface) =>
                    e?.claim?.id === mapping?.claim.id
            )
        ]);
    };


    const onMappingEdited = (
        oldMapping: ConnectionCommonClaimMappingInterface,
        newMapping: ConnectionCommonClaimMappingInterface
    ) => {
        // If user changed the local mapping of this. Then first
        // go and remove it from {@link claimsToBeAdded} array.
        setClaimsToBeAdded([
            ...claimsToBeAdded.filter(
                (e: ConnectionCommonClaimMappingInterface) =>
                    e.claim.id !== oldMapping.claim.id
            ),
            newMapping
        ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes.filter(
                (e: ConnectionCommonClaimMappingInterface) =>
                    e?.claim?.id === oldMapping?.claim.id
            ),
            newMapping
        ]);
    };

    const _placeholder = (): ReactElement => {
        return (
            <EmptyPlaceholder
                title={ t("idp:forms.attributeSettings.attributeMapping." +
                        "modal.placeholder.title") }
                subtitle={
                    [
                        <p key={ "empty-attributes-mapping" }>
                            { t("idp:forms.attributeSettings.attributeMapping." +
                                "modal.placeholder.subtitle") }
                        </p>
                    ]
                }
                image={ null }
                imageSize="tiny"
            />
        );
    };

    return (
        <Modal
            open={ show }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            closeOnDimmerClick={ false }>
            <Modal.Header>
                { t("idp:forms.attributeSettings.attributeMapping." +
                    "modal.header") }
            </Modal.Header>
            <Modal.Content scrolling className="edit-attribute-mapping">
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <AttributeMappingAddItem
                                availableAttributeList={ copyOfAttributes }
                                alreadyMappedAttributesList={ alreadyLocallyMappedAttributes }
                                onSubmit={ onAttributeMappingAdd }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 } >
                            { !showPlaceholder ? (
                                <Table
                                    singleLine
                                    compact
                                    fixed
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width="7">
                                                <strong>
                                                    {
                                                        t("idp:forms.attributeSettings." +
                                                            "attributeMapping.attributeMapTable." +
                                                            "externalAttributeColumnHeader")
                                                    }
                                                </strong>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell width="7">
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
                                            key="attribute-mapping-working-list"
                                            alreadyMappedAttributesList={ alreadyLocallyMappedAttributes }
                                            onMappingDeleted={ onMappingDeleted }
                                            onMappingEdited={ onMappingEdited }
                                            attributeMappingsListToShow={ claimsToBeAdded }
                                            availableAttributesList={ copyOfAttributes }
                                        />
                                    </Table.Body>
                                </Table>
                            ) : _placeholder() }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onClose }>
                    { t("common:cancel") }
                </LinkButton>
                <PrimaryButton
                    disabled={ claimsToBeAdded?.length === 0 }
                    onClick={ () => onSave([ ...claimsToBeAdded ]) }
                >
                    { t("common:save") }
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    );

};

/**
 * Default properties.
 */
AddAttributeSelectionModal.defaultProps = {
    "data-testid": "add-attribute-modal"
};
