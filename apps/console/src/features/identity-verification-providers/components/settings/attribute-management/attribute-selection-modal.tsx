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
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Modal } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import { getEmptyAttributeMappingPlaceholder } from "./utils/attribute-settings-utils";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";

/**
 * Props interface of {@link AddAttributeSelectionModal}
 */
interface AddAttributeSelectionModalProps extends IdentifiableComponentInterface {
    /**
     * The list of attributes that can be selected.
     */
    attributeList: Array<IDVPLocalClaimInterface>;
    /**
     * The list of attributes that are already mapped.
     */
    alreadyMappedAttributesList: Array<IDVPClaimMappingInterface>;
    /**
     * Callback to be called when the modal is closed.
     */
    onClose: () => void;
    /**
     * Callback to be called when the modal is saved.
     * @param mappingsToBeAdded - The list of attributes that are selected.
     */
    onSave: (mappingsToBeAdded: IDVPClaimMappingInterface[]) => void;
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
    const [ claimsToBeAdded, setClaimsToBeAdded ] = useState<IDVPClaimMappingInterface[]>([]);
    /**
     * Since this modal is an intermediate step in adding attributes
     * we can't read the records always from {@link attributeList}
     * we need to internally remove selected ones from the dropdown.
     */
    const [ copyOfAttributes, setCopyOfAttributes ] = useState<IDVPLocalClaimInterface[]>([]);
    /**
     * This has the state to tell whether {@link claimsToBeAdded} is empty
     * or not. We need this to control the {@link Transition} state.
     */
    const [ showPlaceholder, setShowPlaceholder ] = useState<boolean>(false);

    const [
        alreadyLocallyMappedAttributes,
        setAlreadyLocallyMappedAttributes
    ] = useState<IDVPClaimMappingInterface[]>();

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
    const onAttributeMappingAdd = (mapping: IDVPClaimMappingInterface): void => {
        const newClaimsToBeAdded: IDVPClaimMappingInterface[] = [ ...claimsToBeAdded, mapping ];
        const idsToHide: Set<string> = newClaimsToBeAdded.reduce(
            (acc: Set<string>, value: IDVPClaimMappingInterface) => acc.add(value.localClaim.id),
            new Set<string>()
        );

        // Records to be added.
        setClaimsToBeAdded(newClaimsToBeAdded);
        // Remove the added attribute from the attribute list.
        setCopyOfAttributes([ ...copyOfAttributes.filter(({ id }: IDVPLocalClaimInterface) => !idsToHide.has(id)) ]);
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
    const onMappingDeleted = (mapping: IDVPClaimMappingInterface): void => {
        const filtered: IDVPClaimMappingInterface[] = claimsToBeAdded.filter((m: IDVPClaimMappingInterface) => (
            m.localClaim.id !== mapping.localClaim.id
        ));

        setClaimsToBeAdded([ ...filtered ]);
        setCopyOfAttributes([ ...copyOfAttributes, mapping.localClaim ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes
                .filter((e: IDVPClaimMappingInterface) => (e?.localClaim?.id === mapping?.localClaim.id))
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
        oldMapping: IDVPClaimMappingInterface,
        newMapping: IDVPClaimMappingInterface
    ): void => {
        // If user changed the local mapping of this. Then first
        // go and remove it from {@link claimsToBeAdded} array.
        setClaimsToBeAdded([
            ...claimsToBeAdded
                .filter(({ localClaim }: IDVPClaimMappingInterface) => (localClaim.id !== oldMapping.localClaim.id)),
            newMapping
        ]);
        setAlreadyLocallyMappedAttributes([
            ...alreadyLocallyMappedAttributes
                .filter((e: IDVPClaimMappingInterface) => e?.localClaim?.id === oldMapping?.localClaim.id),
            newMapping
        ]);
    };

    return (
        <Modal
            open={ show }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            closeOnDimmerClick={ false }>
            <Modal.Header>
                { t("idvp:forms.attributeSettings.attributeSelectionModal.header") }
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
                                ) : getEmptyAttributeMappingPlaceholder() }
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
