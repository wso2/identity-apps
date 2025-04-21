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

import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { CopyInputField } from "@wso2is/react-components";
import { Message } from "@wso2is/react-components";
import { Button } from "@wso2is/react-components";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { addAgent } from "../../api/agents";
import { AddAgentInterface } from "../../models/agents";

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
    const [ newAgent, setNewAgent ] = useState<
    { description: any; id: string; name: any; }>();

    const {
        data: applicationListData,
        isLoading: isApplicationListRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList(
        null,
        null,
        null,
        null,
        true,
        true
    );

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
            <Modal.Header>
                Create Agent
            </Modal.Header>
            <Modal.Content>
                { !showSecret ?
                    (<FinalForm
                        onSubmit={ (values: any) => {
                            const addAgentPayload: AddAgentInterface = {
                                description: values?.description,
                                name: values?.name,
                                version: "1.0.0"
                            };

                            addAgent(addAgentPayload).then(response => {
                                dispatch(addAlert({
                                    description: "New agent created successfully",
                                    level: AlertLevels.SUCCESS,
                                    message: "Created successfully"
                                }));

                                setShowSecret(true);
                            }).catch(err => {
                                dispatch(addAlert({
                                    description: "Creating agent failed",
                                    level: AlertLevels.ERROR,
                                    message: "Something went wrong"
                                }));
                            });
                        } }
                        render={ ({ handleSubmit }: FormRenderProps) => {
                            return (<form id="addAgentForm" onSubmit={ handleSubmit }>
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
                            </form>);
                        } }
                    />)
                    : (
                        <>
                            <Message warning>
                    Make sure to copy your personal access token now as you will not be able to see this again.
                            </Message>

                            <CopyInputField
                                secret
                                value={ "sdjskjksjkdjkjsdk" }
                                hideSecretLabel={ "Hide secret" }
                                showSecretLabel={ "Show secret" }
                                data-componentid={ "client-secret-readonly-input" }
                            />
                        </>
                    ) }

            </Modal.Content>

            <Modal.Actions>
                { showSecret ? (<>
                    <Button
                        primary={ true }
                        type="submit"
                        onClick={ () => {
                            onClose(newAgent.id);

                            dispatch(addAlert({
                                description: "Agent created successfully",
                                level: AlertLevels.SUCCESS,
                                message: "Created successfully"
                            }));
                        } }
                        data-testid={ `${componentId}-confirmation-modal-actions-continue-button` }
                    >
                                Done
                    </Button>

                </>) : (
                    <>
                        <Button
                            className="link-button"
                            onClick={ onClose }
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
