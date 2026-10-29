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

import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { previewClientIdMetadataDocument } from "@wso2is/admin.applications.v1/api/application";
import { MainApplicationInterface } from "@wso2is/admin.applications.v1/models/application";
import {
    CimdClientIdUrlError,
    CimdClientMetadataInterface,
    CimdKnownClientInterface,
    CimdTokenEndpointAuthMethods,
    buildCimdApplicationPayload,
    validateCimdClientIdUrl
} from "@wso2is/admin.applications.v1/utils/cimd";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
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

const URL_ERROR_DESCRIPTIONS: Record<CimdClientIdUrlError, string> = {
    [ CimdClientIdUrlError.INVALID ]: "applicationTemplates:mcpKnownClients.document.urlInvalid",
    [ CimdClientIdUrlError.TOO_LONG ]: "applicationTemplates:mcpKnownClients.document.urlTooLong"
};

/**
 * How an MCP client that is not a known client is registered.
 */
enum OtherClientOption {
    METADATA_DOCUMENT = "metadataDocument",
    MANUAL = "manual"
}

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
     * Template payload the client's values are merged over.
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

const getHost = (url: string): string => {
    try {
        return new URL(url).host;
    } catch {
        return url;
    }
};

const isLoopbackUri = (uri: string): boolean => uri.startsWith("http://127.0.0.1") || uri.startsWith("http://[::1]");

/**
 * First step of the MCP client template: register a known MCP client in one click, register any other client from
 * its Client ID Metadata Document, or continue with the template's own form.
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

    // Known clients come from the deployment config, so a vendor's new Client Identifier URL needs no code change.
    const knownClients: CimdKnownClientInterface[] = (Array.isArray(configuredClients)
        ? configuredClients as CimdKnownClientInterface[]
        : [])
        .filter((client: CimdKnownClientInterface) => typeof client?.clientId === "string"
            && client.clientId.trim().length > 0
            && typeof client?.name === "string"
            && client.name.trim().length > 0);

    const [ creatingClientId, setCreatingClientId ] = useState<string>(null);
    const [ otherOption, setOtherOption ] = useState<OtherClientOption>(null);
    const [ isDocumentStep, setIsDocumentStep ] = useState<boolean>(false);
    const [ documentUrl, setDocumentUrl ] = useState<string>("");
    const [ documentUrlError, setDocumentUrlError ] = useState<string>(null);
    const [ metadata, setMetadata ] = useState<CimdClientMetadataInterface>(null);
    const [ applicationName, setApplicationName ] = useState<string>("");
    const [ isFetching, setIsFetching ] = useState<boolean>(false);

    const isBusy: boolean = !!creatingClientId || isFetching;

    const getPreviewErrorDescription = (error: AxiosError<HttpErrorResponseDataInterface>): string =>
        t(PREVIEW_ERROR_DESCRIPTIONS[error?.response?.data?.code]
            ?? "applicationTemplates:mcpKnownClients.previewError.generic");

    const createApplication = (clientId: string, payload: MainApplicationInterface): void => {
        setCreatingClientId(clientId);
        onSubmit(payload, (errorMsg: string, errorDescription: string) => {
            setCreatingClientId(null);

            if (errorMsg) {
                setAlert({
                    description: errorDescription,
                    level: AlertLevels.ERROR,
                    message: errorMsg
                });
            }
        });
    };

    const handleClientSelect = (client: CimdKnownClientInterface): void => {
        if (isBusy) {
            return;
        }

        setAlert(null);
        setCreatingClientId(client.clientId);
        // Only a failed preview is reported as one; create errors come back through the onSubmit callback.
        previewClientIdMetadataDocument(client.clientId)
            .then(
                (reviewed: CimdClientMetadataInterface) => {
                    createApplication(client.clientId, buildCimdApplicationPayload(reviewed, templatePayload));
                },
                (error: AxiosError<HttpErrorResponseDataInterface>) => {
                    setCreatingClientId(null);
                    setAlert({
                        description: getPreviewErrorDescription(error),
                        level: AlertLevels.ERROR,
                        message: t("applicationTemplates:mcpKnownClients.previewError.message")
                    });
                }
            );
    };

    const handleContinue = (): void => {
        if (otherOption === OtherClientOption.MANUAL) {
            onConfigureManually();

            return;
        }

        setAlert(null);
        setIsDocumentStep(true);
    };

    const handleDocumentUrlChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const url: string = event.target.value;
        const urlError: CimdClientIdUrlError = validateCimdClientIdUrl(url.trim());

        setDocumentUrl(url);
        setMetadata(null);
        // Only the length is shown while typing; the rest of the URL is checked when the document is fetched.
        setDocumentUrlError(urlError === CimdClientIdUrlError.TOO_LONG ? t(URL_ERROR_DESCRIPTIONS[urlError]) : null);
    };

    const handleFetch = (): void => {
        const url: string = documentUrl.trim();
        const urlError: CimdClientIdUrlError = validateCimdClientIdUrl(url);

        setAlert(null);
        setMetadata(null);

        if (urlError) {
            setDocumentUrlError(t(URL_ERROR_DESCRIPTIONS[urlError]));

            return;
        }

        setDocumentUrlError(null);
        setIsFetching(true);
        previewClientIdMetadataDocument(url)
            .then(
                (reviewed: CimdClientMetadataInterface) => {
                    setMetadata(reviewed);
                    setApplicationName(reviewed.clientName);
                },
                (error: AxiosError<HttpErrorResponseDataInterface>) => {
                    setDocumentUrlError(getPreviewErrorDescription(error));
                }
            )
            .finally(() => setIsFetching(false));
    };

    const handleCreate = (): void => {
        setAlert(null);
        createApplication(metadata.clientId, {
            ...buildCimdApplicationPayload(metadata, templatePayload),
            name: applicationName.trim()
        });
    };

    const renderChooser = (): ReactElement => (
        <div className="sub-template-selection">
            <Heading as="h4">{ t("applicationTemplates:mcpKnownClients.chooser.heading") }</Heading>
            { knownClients.length > 0 && (
                <>
                    <Hint>{ t("applicationTemplates:mcpKnownClients.chooser.hint") }</Hint>
                    <label className="sub-templates-label">
                        { t("applicationTemplates:mcpKnownClients.chooser.knownClients") }
                    </label>
                    <Card.Group itemsPerRow={ 3 } className="sub-templates">
                        { knownClients.map((client: CimdKnownClientInterface, index: number) => (
                            <SelectionCard
                                key={ client.clientId }
                                size="auto"
                                className="sub-template-selection-card"
                                header={ <Typography variant="body1">{ client.name }</Typography> }
                                selected={ creatingClientId === client.clientId }
                                disabled={ isBusy && creatingClientId !== client.clientId }
                                onClick={ () => handleClientSelect(client) }
                                contentTopBorder={ false }
                                showTooltips={ false }
                                renderDisabledItemsAsGrayscale={ false }
                                data-componentid={ `${ componentId }-client-${ index }` }
                            />
                        )) }
                    </Card.Group>
                </>
            ) }
            <label className="sub-templates-label">
                { t("applicationTemplates:mcpKnownClients.chooser.otherClients") }
            </label>
            <RadioGroup
                className="other-client-options"
                value={ otherOption ?? "" }
                onChange={ (_event: ChangeEvent<HTMLInputElement>, value: string) =>
                    setOtherOption(value as OtherClientOption) }
            >
                { [ OtherClientOption.METADATA_DOCUMENT, OtherClientOption.MANUAL ].map(
                    (option: OtherClientOption) => (
                        <FormControlLabel
                            key={ option }
                            value={ option }
                            disabled={ isBusy }
                            className={ `other-client-option${ otherOption === option ? " selected" : "" }` }
                            control={ <Radio /> }
                            label={ (
                                <>
                                    <Typography variant="body1">
                                        { t(`applicationTemplates:mcpKnownClients.chooser.${ option }.label`) }
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        { t(`applicationTemplates:mcpKnownClients.chooser.${ option }.description`) }
                                    </Typography>
                                </>
                            ) }
                            data-componentid={ `${ componentId }-${ option }` }
                        />
                    )) }
            </RadioGroup>
        </div>
    );

    const renderDocumentCard = (): ReactElement => (
        <div className="cimd-document-card" data-componentid={ `${ componentId }-document` }>
            <div className="cimd-document-card-header">
                <Typography variant="body1">
                    <Icon name="file alternate outline" />
                    { metadata.clientName }
                </Typography>
                <Chip
                    size="small"
                    variant="outlined"
                    label={ t("applicationTemplates:mcpKnownClients.document.publishedBy",
                        { host: getHost(metadata.clientId) }) }
                />
            </div>
            <dl className="cimd-document-card-details">
                <dt>{ t("applicationTemplates:mcpKnownClients.document.signInType") }</dt>
                <dd>
                    { metadata.tokenEndpointAuthMethod === CimdTokenEndpointAuthMethods.PRIVATE_KEY_JWT
                        ? t("applicationTemplates:mcpKnownClients.document.privateKeyJwt",
                            { host: getHost(metadata.jwksUri) })
                        : t("applicationTemplates:mcpKnownClients.document.publicClient") }
                </dd>
                <dt>{ t("applicationTemplates:mcpKnownClients.document.redirectUris") }</dt>
                <dd>
                    { metadata.redirectUris.map((uri: string) => (
                        <code key={ uri }>
                            { uri }
                            { isLoopbackUri(uri) && (
                                <Icon
                                    name="laptop"
                                    title={ t("applicationTemplates:mcpKnownClients.document.loopback") }
                                    aria-label={ t("applicationTemplates:mcpKnownClients.document.loopback") }
                                />
                            ) }
                        </code>
                    )) }
                </dd>
                <dt>{ t("applicationTemplates:mcpKnownClients.document.grants") }</dt>
                <dd>{ metadata.grantTypes.join(", ") }</dd>
            </dl>
        </div>
    );

    const renderDocumentStep = (): ReactElement => (
        <div className="cimd-document-step">
            <Heading as="h4">{ t("applicationTemplates:mcpKnownClients.document.heading") }</Heading>
            <Hint>{ t("applicationTemplates:mcpKnownClients.document.hint") }</Hint>
            <label className="sub-templates-label" htmlFor={ `${ componentId }-document-url-input` }>
                { t("applicationTemplates:mcpKnownClients.document.url") }
            </label>
            <div className="cimd-document-url">
                <TextField
                    fullWidth
                    size="small"
                    type="url"
                    id={ `${ componentId }-document-url-input` }
                    placeholder="https://"
                    value={ documentUrl }
                    onChange={ handleDocumentUrlChange }
                    onKeyDown={ (event: React.KeyboardEvent) => event.key === "Enter" && handleFetch() }
                    error={ !!documentUrlError }
                    helperText={ documentUrlError }
                    disabled={ isBusy }
                    data-componentid={ `${ componentId }-document-url` }
                />
                <Button
                    variant="outlined"
                    onClick={ handleFetch }
                    disabled={ isBusy || !documentUrl.trim()
                        || validateCimdClientIdUrl(documentUrl.trim()) === CimdClientIdUrlError.TOO_LONG }
                    data-componentid={ `${ componentId }-fetch-document` }
                >
                    { t("applicationTemplates:mcpKnownClients.document.fetch") }
                </Button>
            </div>
            { metadata
                ? (
                    <>
                        { renderDocumentCard() }
                        <TextField
                            fullWidth
                            size="small"
                            label={ t("applicationTemplates:mcpKnownClients.document.applicationName") }
                            value={ applicationName }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                setApplicationName(event.target.value) }
                            disabled={ isBusy }
                            data-componentid={ `${ componentId }-application-name` }
                        />
                    </>
                )
                : (
                    <div className="cimd-document-placeholder">
                        { t("applicationTemplates:mcpKnownClients.document.placeholder") }
                    </div>
                ) }
        </div>
    );

    return (
        <ModalWithSidePanel
            open
            className="wizard minimal-application-create-wizard mcp-known-client-wizard"
            dimmer="blurring"
            closeOnDimmerClick={ false }
            closeOnEscape={ !isBusy }
            onClose={ () => !isBusy && onClose() }
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
                                { isDocumentStep ? renderDocumentStep() : renderChooser() }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                { isDocumentStep
                                    ? (
                                        <>
                                            <LinkButton
                                                floated="left"
                                                onClick={ () => {
                                                    setAlert(null);
                                                    setIsDocumentStep(false);
                                                } }
                                                disabled={ isBusy }
                                                data-componentid={ `${ componentId }-back` }
                                            >
                                                { t("common:back") }
                                            </LinkButton>
                                            <PrimaryButton
                                                floated="right"
                                                onClick={ handleCreate }
                                                disabled={ isBusy || !metadata || !applicationName.trim() }
                                                loading={ !!creatingClientId }
                                                data-componentid={ `${ componentId }-create` }
                                            >
                                                { t("common:create") }
                                            </PrimaryButton>
                                        </>
                                    )
                                    : (
                                        <>
                                            <LinkButton
                                                floated="left"
                                                onClick={ onClose }
                                                disabled={ isBusy }
                                                data-componentid={ `${ componentId }-cancel` }
                                            >
                                                { t("common:cancel") }
                                            </LinkButton>
                                            <PrimaryButton
                                                floated="right"
                                                onClick={ handleContinue }
                                                disabled={ isBusy || !otherOption }
                                                data-componentid={ `${ componentId }-continue` }
                                            >
                                                { t("common:continue") }
                                            </PrimaryButton>
                                        </>
                                    ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
        </ModalWithSidePanel>
    );
};
