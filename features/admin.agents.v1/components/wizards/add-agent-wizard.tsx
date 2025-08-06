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
import { Button } from "@wso2is/react-components";
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

    const authenticatedUserInfo: AuthenticatedUserInfo = useSelector((state: AppState) => state?.auth);
    const [ isNewAgentFormSubmitting, setIsNewAgentFormSubmitting ] = useState<boolean>(false);

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
            <Modal.Header>New Agent</Modal.Header>
            <Modal.Content>
                <FinalForm
                    onSubmit={ (values: any) => {
                        if (!values?.name) {
                            return;
                        }

                        setIsNewAgentFormSubmitting(true);

                        const addAgentPayload: AgentScimSchema = {
                            "urn:scim:wso2:agent:schema": {
                                Description: values?.description,
                                DisplayName: values?.name,
                                Owner: authenticatedUserInfo?.username
                            }
                        };

                        addAgent(addAgentPayload)
                            .then((response: AgentScimSchema) => {
                                onClose(response);
                            })
                            .catch((_err: unknown) => {
                                dispatch(
                                    addAlert({
                                        description: "Creating agent failed",
                                        level: AlertLevels.ERROR,
                                        message: "Something went wrong"
                                    })
                                );
                            }).finally(() => {
                                setIsNewAgentFormSubmitting(false);
                            });
                    } }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        return (
                            <form id="addAgentForm" onSubmit={ handleSubmit }>
                                <FinalFormField
                                    name="name"
                                    label="Name"
                                    required={ true }
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

            </Modal.Content>

            <Modal.Actions>
                <Button
                    className="link-button"
                    basic
                    primary
                    onClick={ () => onClose(null) }
                    data-testid={ `${componentId}-confirmation-modal-actions-cancel-button` }
                >
                            Cancel
                </Button>
                <Button
                    primary={ true }
                    type="submit"
                    disabled={ isNewAgentFormSubmitting }
                    loading={ isNewAgentFormSubmitting }
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
