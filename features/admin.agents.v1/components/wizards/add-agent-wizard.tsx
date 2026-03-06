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
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter, CheckboxFieldAdapter } from "@wso2is/form/src";
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
    const [ currentStep, setCurrentStep ] = useState<number>(0);
    const [ stepOneValues, setStepOneValues ] = useState<{ name?: string; description?: string }>({});
    const [ stepOneErrors, setStepOneErrors ] = useState<{ name?: string }>({});

    const handleClose = () => {
        setCurrentStep(0);
        setStepOneValues({});
        setStepOneErrors({});
        onClose(null);
    };

    const handleNext = (values: any) => {
        if (!values?.name) {
            setStepOneErrors({ name: "Agent name is required." });

            return;
        }

        setStepOneErrors({});
        setStepOneValues({ description: values?.description, name: values?.name });
        setCurrentStep(1);
    };

    const handleBack = () => {
        setCurrentStep(0);
    };

    const handleCreate = (values: any) => {
        setIsNewAgentFormSubmitting(true);

        // Capture the checkbox value here — the backend response does NOT return
        // IsUserServingAgent, so we must carry this value forward ourselves.
        const isUserServing: boolean = values?.isUserServingAgent || false;

        const addAgentPayload: AgentScimSchema = {
            "urn:scim:wso2:agent:schema": {
                Description: stepOneValues?.description,
                DisplayName: stepOneValues?.name,
                IsUserServingAgent: isUserServing,
                Owner: authenticatedUserInfo?.username
            }
        };

        addAgent(addAgentPayload)
            .then((response: AgentScimSchema) => {
                // Attach isUserServingAgent to the response so the parent (agents.tsx)
                // knows which value the user selected, without relying on the backend
                // to echo it back.
                onClose({ ...response, isUserServingAgent: isUserServing });
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
    };

    return (
        <Modal
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ isOpen }
            className="wizard"
            dimmer="blurring"
            size="tiny"
            onClose={ handleClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>New Agent</Modal.Header>

            { currentStep === 0 && (
                <>
                    <Modal.Content>
                        <FinalForm
                            onSubmit={ handleNext }
                            initialValues={ stepOneValues }
                            render={ ({ handleSubmit }: FormRenderProps) => {
                                return (
                                    <form id="addAgentStepOneForm" onSubmit={ handleSubmit }>
                                        <FinalFormField
                                            name="name"
                                            label="Name"
                                            required={ true }
                                            autoComplete="new-password"
                                            component={ TextFieldAdapter }
                                            error={ stepOneErrors?.name }
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
                            onClick={ handleClose }
                            data-testid={ `${componentId}-step-one-cancel-button` }
                        >
                            Cancel
                        </Button>
                        <Button
                            primary={ true }
                            onClick={ () => {
                                document
                                    .getElementById("addAgentStepOneForm")
                                    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                            } }
                            data-testid={ `${componentId}-step-one-next-button` }
                        >
                            Next
                        </Button>
                    </Modal.Actions>
                </>
            ) }

            { currentStep === 1 && (
                <>
                    <Modal.Content>
                        <FinalForm
                            onSubmit={ handleCreate }
                            render={ ({ handleSubmit }: FormRenderProps) => {
                                return (
                                    <form id="addAgentStepTwoForm" onSubmit={ handleSubmit }>
                                        <FinalFormField
                                            name="isUserServingAgent"
                                            label="Is this a user-serving agent?"
                                            component={ CheckboxFieldAdapter }
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
                            onClick={ handleBack }
                            data-testid={ `${componentId}-step-two-back-button` }
                        >
                            Back
                        </Button>
                        <Button
                            primary={ true }
                            type="submit"
                            disabled={ isNewAgentFormSubmitting }
                            loading={ isNewAgentFormSubmitting }
                            onClick={ () => {
                                document
                                    .getElementById("addAgentStepTwoForm")
                                    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                            } }
                            data-testid={ `${componentId}-step-two-create-button` }
                        >
                            Create
                        </Button>
                    </Modal.Actions>
                </>
            ) }
        </Modal>
    );
}
