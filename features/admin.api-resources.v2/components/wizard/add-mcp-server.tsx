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


import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { Heading, Hint, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import { createAPIResource } from "../../api/api-resources";
import { APIResourceInterface } from "../../models/api-resources";
import "./add-mcp-server.scss";


interface AddMcpServerProps extends IdentifiableComponentInterface {
    closeWizard: () => void;
}

export default function AddMcpServer ({
    closeWizard,
    ["data-componentid"]: componentId
}: AddMcpServerProps) {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    return         (<Modal
        data-testid={ componentId }
        open={ true }
        dimmer="blurring"
        onClose={ closeWizard }
        size="tiny"
        closeOnDimmerClick={ false }
        closeOnEscape
    >
        <Modal.Header className="wizard-header">
            Add MCP server
            <Heading as="h6">Create a new MCP server.</Heading>
        </Modal.Header>
        <Modal.Content className="content-container" scrolling>
            { /* form goes here */ }
            <FinalForm
                onSubmit={ (values: any) => {
                    setIsSubmitting(true);

                    const apiResourceBody: APIResourceInterface = {
                        identifier: values.identifier,
                        name: values.displayName,
                        requiresAuthorization: true,
                        scopes: []
                    };

                    createAPIResource(apiResourceBody)
                        .then((apiResource: APIResourceInterface) => {
                            dispatch(addAlert<AlertInterface>({
                                description: "MCP server added successfully",
                                level: AlertLevels.SUCCESS,
                                message: "Added successfully" }));

                            // Open the created API resource.
                            history.push(AppConstants.getPaths().get("MCP_SERVER_EDIT").replace(":id", apiResource.id));
                        })
                        .catch(() => {
                            dispatch(addAlert<AlertInterface>({
                                description: "An error occurred when adding the MCP server",
                                level: AlertLevels.ERROR,
                                message: "Something went wrong"
                            }));
                        })
                        .finally(() => {
                            setIsSubmitting(false);

                            closeWizard();
                        });
                } }
                render={ ({ handleSubmit }: {
                    handleSubmit: any
                }) => {
                    return (<form id="addMcpServer" onSubmit={ handleSubmit }>
                        <FinalFormField
                            label="Identifier"
                            name="identifier"
                            component={ TextFieldAdapter }
                            required
                            placeholder="mcp://my-mcp-server"
                            helperText={
                                (<Hint className="hint" compact>
                                    A unique URI is recommended as the identifier. It won’t be accessed
                                    but will appear as the
                                    aud claim in tokens. This cannot be changed later.
                                </Hint>)
                            }
                        />
                        <FinalFormField
                            name="displayName"
                            label="Display Name"
                            className="mcp-server-display-name-input"
                            required
                            placeholder="My MCP Server"
                            component={ TextFieldAdapter }
                            helperText={
                                (<Hint className="hint" compact>
                                    Meaningful name to identify the MCP server.
                                </Hint>)
                            }
                        />
                    </form>);
                } }
            />
        </Modal.Content>
        <Modal.Actions>
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <LinkButton
                            tabIndex={ 6 }
                            data-testid={ `${componentId}-cancel-button` }
                            floated="left"
                            onClick={ () => closeWizard() }
                        >
                            Cancel
                        </LinkButton>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <PrimaryButton
                            tabIndex={ 8 }
                            data-testid={ `${componentId}-finish-button` }
                            floated="right"
                            type="submit"
                            isLoading={ isSubmitting }
                            onClick={ () => {
                                document
                                    .getElementById("addMcpServer")
                                    .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
                            } }
                        >
                            Add MCP Server
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Modal.Actions>
    </Modal>);
}
