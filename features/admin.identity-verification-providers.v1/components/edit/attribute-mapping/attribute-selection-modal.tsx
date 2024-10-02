/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid, Modal } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import {
    IdVPClaimMappingInterface,
    IdVPLocalClaimInterface
} from "../../../models/identity-verification-providers";

/**
 * Props interface of {@link AddAttributeSelectionModal}
 */
interface AddAttributeSelectionModalProps extends IdentifiableComponentInterface {
    /**
     * The list of attributes that can be selected.
     */
    attributeList: Array<IdVPLocalClaimInterface>;
    /**
     * The list of attributes that are already mapped.
     */
    alreadyMappedAttributesList: Array<IdVPClaimMappingInterface>;
    /**
     * Callback to be called when the modal is closed.
     */
    onClose: () => void;
    /**
     * Callback to be called when the modal is saved.
     * @param mappingsToBeAdded - The list of attributes that are selected.
     */
    onSave: (mappingsToBeAdded: IdVPClaimMappingInterface[]) => void;
    /**
     * Whether the modal should be visible or not.
     */
    show: boolean;
}

/**
 * Attributes mapping modal. User should be able to select attributes
 * which aren't already selected. Then It will render a list inside modal
 * once keeps adding.
 *
 * @param props - Props injected to the component.
 * @returns Function Component
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

    /**
     * The claims that user picks. All the selecting ones will be
     * pushed to this piece of state.
     */
    const [ claimsToBeAdded, setClaimsToBeAdded ] = useState<IdVPClaimMappingInterface[]>([]);
    /**
     * Since this modal is an intermediate step in adding attributes
     * we can't read the records always from {@link attributeList}
     * we need to internally remove selected ones from the dropdown.
     */
    const [ copyOfAttributes, setCopyOfAttributes ] = useState<IdVPLocalClaimInterface[]>([]);
    /**
     * This has the state to tell whether {@link claimsToBeAdded} is empty
     * or not. We need this to control the {@link Transition} state.
     */
    const [ showPlaceholder, setShowPlaceholder ] = useState<boolean>(false);

    const [
        alreadyLocallyMappedAttributes,
        setAlreadyLocallyMappedAttributes
    ] = useState<IdVPClaimMappingInterface[]>();

    const { t } = useTranslation();

    /**
     * Clone the lists first as we don't want to mutate the original lists.
     */
    useEffect(() => {
        setCopyOfAttributes([ ...attributeList ]);
        setAlreadyLocallyMappedAttributes([ ...alreadyMappedAttributesList ]);
    }, []);

    /**
     * Set the show placeholder state.
     */
    useEffect(() => {
        setShowPlaceholder(claimsToBeAdded.length === 0);
    }, [ claimsToBeAdded ]);


    /**
     * This function will be called when a new attribute mapping is added.
     *
     * @param mapping - New attribute mapping.
     * @returns void
     */
    const onAttributeMappingAdd = (mapping: IdVPClaimMappingInterface): void => {
        const newClaimsToBeAdded: IdVPClaimMappingInterface[] = [ ...claimsToBeAdded, mapping ];
        const idsToHide: Set<string> = newClaimsToBeAdded.reduce(
            (acc: Set<string>, value: IdVPClaimMappingInterface) => acc.add(value.localClaim.id),
            new Set<string>()
        );

        // Records to be added.
        setClaimsToBeAdded(newClaimsToBeAdded);
        // Remove the added attribute from the attribute list.
        setCopyOfAttributes([ ...copyOfAttributes.filter(({ id }: IdVPLocalClaimInterface) => !idsToHide.has(id)) ]);
        // Now reinitialize the already mapped attributes list.
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes,
            mapping
        ]);
    };

    /**
     * This function handles the deletion of attribute mappings.
     *
     * @param mapping - Deleted attribute mapping.
     * @returns void
     */
    const onMappingDeleted = (mapping: IdVPClaimMappingInterface): void => {
        const filtered: IdVPClaimMappingInterface[] = claimsToBeAdded.filter((m: IdVPClaimMappingInterface) => (
            m.localClaim.id !== mapping.localClaim.id
        ));

        setClaimsToBeAdded([ ...filtered ]);
        setCopyOfAttributes([ ...copyOfAttributes, mapping.localClaim ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes
                .filter((e: IdVPClaimMappingInterface) => (e?.localClaim?.id === mapping?.localClaim.id))
        ]);
    };

    /**
     * This function handles the editing of attribute mappings.
     *
     * @param oldMapping - Old attribute mapping.
     * @param newMapping - New attribute mapping.
     * returns void
     */
    const onMappingEdited = (
        oldMapping: IdVPClaimMappingInterface,
        newMapping: IdVPClaimMappingInterface
    ): void => {
        // If user changed the local mapping of this. Then first
        // go and remove it from {@link claimsToBeAdded} array.
        setClaimsToBeAdded([
            ...claimsToBeAdded
                .filter(({ localClaim }: IdVPClaimMappingInterface) => (localClaim.id !== oldMapping.localClaim.id)),
            newMapping
        ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes
                .filter((e: IdVPClaimMappingInterface) => e?.localClaim?.id === oldMapping?.localClaim.id),
            newMapping
        ]);
    };

    const renderEmptyAttributeMappingPlaceholder = (): ReactElement => {
        return (
            <EmptyPlaceholder
                title={ t("idvp:edit.attributeSettings.modal.emptyPlaceholder.title") }
                subtitle={
                    [
                        <Trans
                            key={ "no-attributes-configured" }
                            i18nKey={
                                "idvp:edit.attributeSettings.modal.emptyPlaceholder.description"
                            }
                        >
                            Map attributes and click <strong>Add Attribute Mapping</strong> to get started.
                        </Trans>
                    ]
                }
                image={ getEmptyPlaceholderIllustrations().emptyList }
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
                { t("idvp:edit.attributeSettings.modal.header") }
            </Modal.Header>
            <Modal.Content scrolling className="edit-attribute-mapping">
                <Grid className={ "ui form" }>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <AttributeMappingListItem
                                availableAttributeList={ copyOfAttributes }
                                alreadyMappedAttributesList={ alreadyLocallyMappedAttributes }
                                onSubmit={ onAttributeMappingAdd }
                            />
                        </Grid.Column>
                        <Grid.Column width={ 16 }>
                            { !showPlaceholder
                                ? (
                                    <React.Fragment>
                                        <Divider hidden/>
                                        <AttributeMappingList
                                            key="attribute-mapping-working-list"
                                            alreadyMappedAttributesList={ alreadyLocallyMappedAttributes }
                                            onMappingDeleted={ onMappingDeleted }
                                            onMappingEdited={ onMappingEdited }
                                            attributeMappingsListToShow={ claimsToBeAdded }
                                            availableAttributesList={ copyOfAttributes }
                                        />
                                    </React.Fragment>
                                ) : renderEmptyAttributeMappingPlaceholder() }
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
    "data-componentid": "add-attribute-modal"
};
