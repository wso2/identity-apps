/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useState, useEffect } from "react";
import { Modal, Header } from "semantic-ui-react";
import { ClaimDialect, Claim, AlertLevels } from "../../../models";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { getAllLocalClaims, addExternalClaim } from "../../../api";
import { Forms, Field, FormValue, useTrigger } from "@wso2is/forms";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";

/**
 * Prop types for the `AddExternalClaims` component
 */
interface AddExternalClaimsPropsInterface {
    /**
     * Open the modal
     */
    open: boolean;
    /**
     * Handler to be called when the modal is closed
     */
    onClose: () => void;
    /**
     * Information about the claim dialect
     */
    dialect: ClaimDialect;
    /**
     * Function to be called to initiate an update
     */
    update: () => void;
}
/**
 * A component that lets you add an external claim
 * @param {AddExternalClaimsPropsInterface} props
 * @return {React.ReactElement} Component
 */
export const AddExternalClaims = (props: AddExternalClaimsPropsInterface): React.ReactElement => {

    const { open, onClose, dialect, update } = props;

    const [localClaims, setLocalClaims] = useState<Claim[]>();

    const [submit, setSubmit] = useTrigger();

    const dispatch = useDispatch();

    useEffect(() => {
        getAllLocalClaims(null).then(response => {
            setLocalClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching local claims",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        })
    }, []);

    return (
        <Modal
            dimmer="blurring"
            size="tiny"
            open={ open }
            onClose={ onClose }
        >
            <Modal.Header>
                <Header as="h3" content="Add an External Claim" subheader={ "to " + dialect?.dialectURI } />
            </Modal.Header>
            <Modal.Content>
                <Forms
                    onSubmit={ (values: Map<string,FormValue>) => {
                        addExternalClaim(dialect.id, {
                            claimURI: values.get("claimURI").toString(),
                            mappedLocalClaimURI: values.get("localClaim").toString()
                        }).then(() => {
                            dispatch(addAlert(
                                {
                                    description: "The external claim has been added to the dialect successfully!",
                                    level: AlertLevels.SUCCESS,
                                    message: "External claim added successfully"
                                }
                            ));
                            onClose();
                            update();
                        }).catch(error => {
                            dispatch(addAlert(
                                {
                                    description: error?.description,
                                    level: AlertLevels.ERROR,
                                    message: error?.message || "Something went wrong"
                                }
                            ));
                        })
                    } }
                    submitState={ submit }
                >
                    <Field
                        name="claimURI"
                        label="Claim URI"
                        required={ true }
                        requiredErrorMessage="Claim URI is required"
                        placeholder="Enter a claim URI"
                        type="text"
                    />
                    <Field
                        type="dropdown"
                        name="localClaim"
                        label="Local Claim URI to map to"
                        required={ true }
                        requiredErrorMessage="Select a local claim to map to"
                        placeholder="Select a Local Claim"
                        search
                        children={
                            localClaims?.map((claim: Claim, index) => {
                                return {
                                    key: index,
                                    value: claim.claimURI,
                                    text: claim.displayName
                                }
                            })
                        }
                    />
                </Forms>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton
                    onClick={ onClose }
                >
                    Cancel
                </LinkButton>
                <PrimaryButton
                    onClick={ () => {
                        setSubmit();
                    } }
                >
                    Add
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
};
