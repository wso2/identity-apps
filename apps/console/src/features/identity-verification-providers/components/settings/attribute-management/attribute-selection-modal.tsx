/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Divider, Grid, Modal } from "semantic-ui-react";
import { AttributeMappingListItem } from "./attribute-mapping-list-item";
import { AttributeMappingList } from "./attributes-mapping-list";
import { getEmptyPlaceholderIllustrations } from "../../../../core";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";
import {getEmptyAttributeMappingPlaceholder} from "./utils";

interface AddAttributeSelectionModalProps extends IdentifiableComponentInterface {
    attributeList: Array<IDVPLocalClaimInterface>;
    alreadyMappedAttributesList: Array<IDVPClaimMappingInterface>;
    onClose: () => void;
    onSave: (mappingsToBeAdded: IDVPClaimMappingInterface[]) => void;
    show: boolean;
}

/**
 * Attributes mapping modal. User should be able to select attributes
 * which aren't already selected. Then It will render a list inside modal
 * once keeps adding.
 *
 * @param props - Props injected to the component.
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

    useEffect(() => {
        // Clone it first. We don't want to mutate the original list.
        setCopyOfAttributes([ ...attributeList ]);
        setAlreadyLocallyMappedAttributes([ ...alreadyMappedAttributesList ]);
    }, []);

    useEffect(() => {
        setShowPlaceholder(claimsToBeAdded.length === 0);
    }, [ claimsToBeAdded ]);

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

    const onMappingEdited = (
        oldMapping: IDVPClaimMappingInterface,
        newMapping: IDVPClaimMappingInterface
    ) => {
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
                Add Attribute Mappings
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
                            { !showPlaceholder ? (
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
                    Cancel
                </LinkButton>
                <PrimaryButton
                    disabled={ claimsToBeAdded?.length === 0 }
                    onClick={ () => onSave([ ...claimsToBeAdded ]) }>Save
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
