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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form/src";
import { Button } from "@wso2is/react-components";
import React from "react";
import { useDispatch } from "react-redux";
import { Grid, Modal } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

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
            <Modal.Content scrolling>
                <FinalForm
                    onSubmit={ (values: any) => {
                        try {
                            const agents: any = JSON.parse(localStorage.getItem("agents"));

                            const newAgent = {
                                description: values.description,
                                id: uuidv4(),
                                name: values.name
                            }
                            agents.push(newAgent);

                            localStorage.setItem("agents", JSON.stringify(agents));

                            onClose(newAgent.id);

                            dispatch(addAlert({
                                description: "Agent created successfully",
                                level: AlertLevels.SUCCESS,
                                message: "Created successfully"
                            }));
                        } catch (err) {
                            console.log(err)
                            dispatch(addAlert({
                                description: "Error while creating the agent",
                                level: AlertLevels.ERROR,
                                message: "Something went wrong"
                            }));
                        }

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
                />
            </Modal.Content>

            <Modal.Actions>
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
            </Modal.Actions>
        </Modal>
    );
}
