/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Typography from "@oxygen-ui/react/Typography";
import { previewClientIdMetadataDocument } from "@wso2is/admin.applications.v1/api/application";
import { MainApplicationInterface } from "@wso2is/admin.applications.v1/models/application";
import {
    buildCimdApplicationPayload,
    CimdClientMetadataInterface,
    CimdConstants,
    CimdKnownClientInterface
} from "@wso2is/admin.applications.v1/utils/cimd";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, Hint, LinkButton, SelectionCard, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card, Grid, Icon } from "semantic-ui-react";
import "./mcp-known-client-wizard.scss";

/**
 * Descriptions of the errors IS returns when it cannot read or accept a client's metadata document.
 */
const PREVIEW_ERROR_DESCRIPTIONS: Record<string, string> = {
    "CIMD-60001": "applicationTemplates:mcpKnownClients.previewError.invalidClientId",
    "CIMD-60002": "applicationTemplates:mcpKnownClients.previewError.documentNotRetrieved",
    "CIMD-60003": "applicationTemplates:mcpKnownClients.previewError.invalidRedirectUri",
    "CIMD-60004": "applicationTemplates:mcpKnownClients.previewError.invalidAuthentication",
    "CIMD-60005": "applicationTemplates:mcpKnownClients.previewError.missingAuthorizationCode",
    "CIMD-60006": "applicationTemplates:mcpKnownClients.previewError.valueTooLong",
    "CIMD-60007": "applicationTemplates:mcpKnownClients.previewError.disabled",
    "CIMD-60008": "applicationTemplates:mcpKnownClients.previewError.tooManyPreviews"
};

/**
 * Prop types of the `McpKnownClientWizard` component.
 */
interface McpKnownClientWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Name of the MCP client template.
     */
    templateName: string;
    /**
     * Description of the MCP client template.
     */
    templateDescription: string;
    /**
     * Template payload the known client's values are merged over.
     */
    templatePayload: MainApplicationInterface;
    /**
     * Callback to continue with the template's own form.
     */
    onConfigureManually: () => void;
    /**
     * Callback to create the application.
     */
    onSubmit: (
        payload: MainApplicationInterface,
        callback: (errorMsg: string, errorDescription: string) => void
    ) => void;
    /**
     * Callback triggered when closing the wizard.
     */
    onClose: () => void;
}

/**
 * First step of the MCP client template: register a known MCP client that uses a Client ID Metadata Document
 * in one click, or continue with the template's own form.
 *
 * @param props - Props injected to the component.
 * @returns MCP known client wizard.
 */
export const McpKnownClientWizard: FunctionComponent<McpKnownClientWizardPropsInterface> = ({
    templateName,
    templateDescription,
    templatePayload,
    onConfigureManually,
    onSubmit,
    onClose,
    ["data-componentid"]: componentId = "mcp-known-client-wizard"
}: McpKnownClientWizardPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ alert, setAlert, notification ] = useWizardAlert();

    const configuredClients: unknown = useSelector((state: AppState) =>
        state?.config?.deployment?.extensions?.mcpKnownClients);

    const knownClients: CimdKnownClientInterface[] = (Array.isArray(configuredClients)
        ? configuredClients as CimdKnownClientInterface[]
        : CimdConstants.DEFAULT_KNOWN_CLIENTS)
        .filter((client: CimdKnownClientInterface) => typeof client?.clientId === "string"
            && typeof client?.name === "string");

    const [ creatingClientId, setCreatingClientId ] = useState<string>(null);

    const isCreating: boolean = !!creatingClientId;

    const handleClientSelect = (client: CimdKnownClientInterface): void => {
        if (isCreating) {
            return;
        }

        setAlert(null);
        setCreatingClientId(client.clientId);
        // Only a failed preview is reported as one; create errors come back through the onSubmit callback.
        previewClientIdMetadataDocument(client.clientId)
            .then(
                (metadata: CimdClientMetadataInterface) => {
                    onSubmit(
                        buildCimdApplicationPayload(metadata, templatePayload),
                        (errorMsg: string, errorDescription: string) => {
                            setCreatingClientId(null);

                            if (errorMsg) {
                                setAlert({
                                    description: errorDescription,
                                    level: AlertLevels.ERROR,
                                    message: errorMsg
                                });
                            }
                        }
                    );
                },
                (error: AxiosError<HttpErrorResponseDataInterface>) => {
                    setCreatingClientId(null);
                    setAlert({
                        description: t(PREVIEW_ERROR_DESCRIPTIONS[error?.response?.data?.code]
                            ?? "applicationTemplates:mcpKnownClients.previewError.generic"),
                        level: AlertLevels.ERROR,
                        message: t("applicationTemplates:mcpKnownClients.previewError.message")
                    });
                }
            );
    };

    return (
        <ModalWithSidePanel
            open
            className="wizard minimal-application-create-wizard mcp-known-client-wizard"
            dimmer="blurring"
            closeOnDimmerClick={ false }
            closeOnEscape={ !isCreating }
            onClose={ () => !isCreating && onClose() }
            data-componentid={ componentId }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { templateName }
                    <Heading as="h6">{ templateDescription }</Heading>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Grid>
                        { alert && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    { notification }
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <div className="sub-template-selection">
                                    <label className="sub-templates-label">
                                        { t("applicationTemplates:mcpKnownClients.label") }
                                    </label>
                                    <Card.Group itemsPerRow={ 3 } className="sub-templates">
                                        { knownClients.map((client: CimdKnownClientInterface, index: number) => (
                                            <SelectionCard
                                                key={ client.clientId }
                                                size="auto"
                                                className="sub-template-selection-card"
                                                header={ <Typography variant="body1">{ client.name }</Typography> }
                                                selected={ creatingClientId === client.clientId }
                                                disabled={ isCreating && creatingClientId !== client.clientId }
                                                onClick={ () => handleClientSelect(client) }
                                                contentTopBorder={ false }
                                                showTooltips={ false }
                                                renderDisabledItemsAsGrayscale={ false }
                                                data-componentid={ `${ componentId }-client-${ index }` }
                                            />
                                        )) }
                                        <SelectionCard
                                            size="auto"
                                            className="sub-template-selection-card"
                                            header={ (
                                                <Typography variant="body1">
                                                    <Icon name="add" />
                                                    { t("applicationTemplates:mcpKnownClients.other") }
                                                </Typography>
                                            ) }
                                            disabled={ isCreating }
                                            onClick={ () => !isCreating && onConfigureManually() }
                                            contentTopBorder={ false }
                                            showTooltips={ false }
                                            renderDisabledItemsAsGrayscale={ false }
                                            data-componentid={ `${ componentId }-configure-manually` }
                                        />
                                    </Card.Group>
                                    { knownClients.length > 0 && (
                                        <Hint>{ t("applicationTemplates:mcpKnownClients.hint") }</Hint>
                                    ) }
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <LinkButton floated="left" onClick={ onClose } disabled={ isCreating }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
        </ModalWithSidePanel>
    );
};
