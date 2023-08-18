/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal, Table } from "semantic-ui-react";
import { AttributeMappingAddItem } from "./attribute-mapping-add-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";

interface AddAttributeSelectionModalProps extends TestableComponentInterface {
    attributeList: Array<IdentityProviderClaimInterface>;
    alreadyMappedAttributesList: Array<IdentityProviderCommonClaimMappingInterface>;
    onClose: () => void;
    onSave: (mappingsToBeAdded: IdentityProviderCommonClaimMappingInterface[]) => void;
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
    const [ claimsToBeAdded, setClaimsToBeAdded ] = useState<IdentityProviderCommonClaimMappingInterface[]>([]);
    /**
     * Since this modal is a intermediate step in adding attributes
     * we can't read the records always from from {@link attributeList}
     * we need to internally remove selected ones from the dropdown.
     */
    const [ copyOfAttributes, setCopyOfAttributes ] = useState<IdentityProviderClaimInterface[]>([]);
    /**
     * This has the state to tell whether {@link claimsToBeAdded} is empty
     * or not. We need this to control the {@link Transition} state.
     */
    const [ showPlaceholder, setShowPlaceholder ] = useState<boolean>(false);

    const [
        alreadyLocallyMappedAttributes,
        setAlreadyLocallyMappedAttributes
    ] = useState<IdentityProviderCommonClaimMappingInterface[]>();

    useEffect(() => {
        // Clone it first. We don't want to mutate the original list.
        setCopyOfAttributes([ ...attributeList ]);
        setAlreadyLocallyMappedAttributes([ ...alreadyMappedAttributesList ]);
    }, []);

    useEffect(() => {
        setShowPlaceholder(claimsToBeAdded.length === 0);
    }, [ claimsToBeAdded ]);

    const onAttributeMappingAdd = (
        mapping: IdentityProviderCommonClaimMappingInterface
    ): void => {
        const newClaimsToBeAdded: IdentityProviderCommonClaimMappingInterface[] = [
            ...claimsToBeAdded,
            mapping
        ];

        const idsToHide: Set<string> = newClaimsToBeAdded.reduce(
            (
                acc: Set<string>,
                value: IdentityProviderCommonClaimMappingInterface
            ) => acc.add(value?.claim?.id),
            new Set<string>()
        );

        // Records to be added.
        setClaimsToBeAdded(newClaimsToBeAdded);
        // Remove the added attribute from the attribute list.
        setCopyOfAttributes([
            ...copyOfAttributes.filter(
                (attr: IdentityProviderClaimInterface) => !idsToHide.has(attr.id)
            )
        ]);
        // Now reinitialize the already mapped attributes list.
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes,
            mapping
        ]);
    };

    const onMappingDeleted = (
        mapping: IdentityProviderCommonClaimMappingInterface
    ): void => {
        const filtered: IdentityProviderCommonClaimMappingInterface[] =
            claimsToBeAdded.filter(
                (m: IdentityProviderCommonClaimMappingInterface) =>
                    m.claim.id !== mapping.claim.id
            );

        setClaimsToBeAdded([ ...filtered ]);
        setCopyOfAttributes([ ...copyOfAttributes, mapping.claim ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes.filter(
                (e: IdentityProviderCommonClaimMappingInterface) =>
                    e?.claim?.id === mapping?.claim.id
            )
        ]);
    };


    const onMappingEdited = (
        oldMapping: IdentityProviderCommonClaimMappingInterface,
        newMapping: IdentityProviderCommonClaimMappingInterface
    ) => {
        // If user changed the local mapping of this. Then first
        // go and remove it from {@link claimsToBeAdded} array.
        setClaimsToBeAdded([
            ...claimsToBeAdded.filter(
                (e: IdentityProviderCommonClaimMappingInterface) =>
                    e.claim.id !== oldMapping.claim.id
            ),
            newMapping
        ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes.filter(
                (e: IdentityProviderCommonClaimMappingInterface) =>
                    e?.claim?.id === oldMapping?.claim.id
            ),
            newMapping
        ]);
    };

    const _placeholder = (): ReactElement => {
        return (
            <EmptyPlaceholder
                title={ t("console:develop.features.idp.forms.attributeSettings.attributeMapping." +
                        "modal.placeholder.title") }
                subtitle={
                    [
                        <p key={ "empty-attributes-mapping" }>
                            { t("console:develop.features.idp.forms.attributeSettings.attributeMapping." +
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
                { t("console:develop.features.idp.forms.attributeSettings.attributeMapping." +
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
                                                        t("console:develop.features.idp.forms.attributeSettings." +
                                                            "attributeMapping.attributeMapTable." +
                                                            "externalAttributeColumnHeader")
                                                    }
                                                </strong>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell width="7">
                                                <strong>
                                                    {
                                                        t("console:develop.features.idp.forms.attributeSettings." +
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
