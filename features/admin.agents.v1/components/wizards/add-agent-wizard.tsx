/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AuthenticatedUserInfo } from "@asgardeo/auth-react";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { Button, CopyInputField, Message } from "@wso2is/react-components";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";
import { addAgent } from "../../api/agents";
import { AgentScimSchema } from "../../models/agents";

interface AddAgentWizardProps extends IdentifiableComponentInterface {
    isOpen: boolean;
    onClose: any;
}

export default function AddAgentWizard({
    isOpen,
    onClose,
    [ "data-componentid" ]: componentId
}: AddAgentWizardProps) {
    const dispatch: any = useDispatch();

    const [ showSecret, setShowSecret ] = useState(false);
    const [ newAgent, setNewAgent ] = useState<AgentScimSchema>();

    const authenticatedUserInfo: AuthenticatedUserInfo = useSelector((state: AppState) => state?.auth);

    return (
        <Modal
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ isOpen }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>{ showSecret ? "Agent created successfully" : "New Agent" }</Modal.Header>
            <Modal.Content>
                { !showSecret ?
                    (<FinalForm
                        onSubmit={ (values: any) => {
                            const addAgentPayload: AgentScimSchema = {
                                "urn:scim:wso2:agent:schema": {
                                    agentDescription: values?.description,
                                    agentDisplayName: values?.name,
                                    agentOwner: authenticatedUserInfo?.username
                                }
                            };

                            addAgent(addAgentPayload)
                                .then((response: AgentScimSchema) => {
                                    setNewAgent(response);
                                    setShowSecret(true);
                                })
                                .catch((_err: unknown) => {
                                    dispatch(
                                        addAlert({
                                            description: "Creating agent failed",
                                            level: AlertLevels.ERROR,
                                            message: "Something went wrong"
                                        })
                                    );
                                });
                        } }
                        render={ ({ handleSubmit }: FormRenderProps) => {
                            return (
                                <form id="addAgentForm" onSubmit={ handleSubmit }>
                                    <FinalFormField
                                        name="name"
                                        label="Name"
                                        autoComplete="new-password"
                                        component={ TextFieldAdapter }
                                    />
                                    <FinalFormField
                                        label="Description"
                                        name="description"
                                        className="mt-3"
                                        multiline
                                        rows={ 4 }
                                        maxRows={ 4 }
                                        autoComplete="new-password"
                                        placeholder="Enter a description for the agent"
                                        component={ TextFieldAdapter }
                                    />
                                </form>
                            );
                        } }
                    />
                    ) : (
                        <>
                            <Message warning>
                            Important: Please copy and store the agent credentials securely.{ " " }
                            Make sure to copy the agent secret now as you will not be able to see this again.
                            </Message>

                            <label>Agent ID</label>
                            <div style={ { marginTop: "1%" } }>
                                <CopyInputField
                                    className="agent-id-input"
                                    value={ newAgent?.id }
                                    data-componentid="agent-id-readonly-input"
                                />
                            </div>
                            <div style={ { marginTop: "2%" } }></div>
                            <label>Agent secret</label>
                            <div style={ { marginTop: "1%" } }>
                                <CopyInputField
                                    className="agent-secret-input"
                                    secret
                                    value={ newAgent?.password }
                                    hideSecretLabel={ "Hide secret" }
                                    showSecretLabel={ "Show secret" }
                                    data-componentid={ "agent-secret-readonly-input" }
                                />
                            </div>

                        </>
                    ) }
            </Modal.Content>

            <Modal.Actions>
                { showSecret ? (
                    <>
                        <Button
                            primary={ true }
                            type="submit"
                            onClick={ () => {
                                if (newAgent) {
                                    setShowSecret(false);
                                    onClose(newAgent?.id);
                                    dispatch(
                                        addAlert({
                                            description: "Agent created successfully",
                                            level: AlertLevels.SUCCESS,
                                            message: "Created successfully"
                                        })
                                    );
                                }
                            } }
                            data-testid={ `${componentId}-confirmation-modal-actions-continue-button` }
                        >
                            Done
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            className="link-button"
                            onClick={ () => onClose(null) }
                            data-testid={ `${componentId}-confirmation-modal-actions-cancel-button` }
                        >
                            Cancel
                        </Button>
                        <Button
                            primary={ true }
                            type="submit"
                            onClick={ () => {
                                document
                                    .getElementById("addAgentForm")
                                    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                            } }
                            data-testid={ `${componentId}-confirmation-modal-actions-continue-button` }
                        >
                            Create
                        </Button>
                    </>
                ) }
            </Modal.Actions>
        </Modal>
    );
}
