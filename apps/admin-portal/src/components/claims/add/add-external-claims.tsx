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
import { Modal } from "semantic-ui-react";
import { ClaimDialect, Claim } from "../../../models";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { getLocalClaims } from "../../../api";
import { Forms, Field } from "@wso2is/forms";

interface AddExternalClaimsPropsInterface{
    open: boolean;
    onClose: () => void;
    dialect: ClaimDialect;
}
export const AddExternalClaims = (props: AddExternalClaimsPropsInterface): React.ReactElement => {
    
    const { open, onClose, dialect } = props;
    
    const [localClaims, setLocalClaims] = useState<Claim[]>();

    useEffect(() => {
        getLocalClaims().then(response => {
            setLocalClaims(response);
        }).catch(error => {
            // TODO:Notify
        })
    }, []);

    return (
        <Modal
            dimmer="blurring"
            size="small"
            open={open}
            onClose={onClose}
        >
            <Modal.Header>
                Add an External Claim 
                {dialect.dialectURI}
            </Modal.Header>
            <Modal.Content>
                <Forms
                    onSubmit={() => {
                        
                    }}
                >
                    <Field
                        name="claimURI"
                        label="Claim URI"
                        required={true}
                        requiredErrorMessage="Claim URI is required"
                        placeholder="Enter a claim URI"
                        type="text"
                    />
                    <Field 
                        type="dropdown"
                        name="localClaim"
                        label="Local Claim URI to map to"
                        placeholder="Select a Local Claim"
                        children={
                            localClaims.map((claim:Claim) => {
                                return {
                                    key: claim.id,
                                    value: claim.claimURI,
                                    text: claim.displayName
                                }
                            })
                        }
                        required={true}
                        requiredErrorMessage="Select a local claim to map to"
                    />
                </Forms>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton>
                    Cancel
                </LinkButton>
                <PrimaryButton>
                    Add
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
}