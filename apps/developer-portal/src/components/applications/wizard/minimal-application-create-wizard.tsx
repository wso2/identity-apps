/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, useTrigger } from "@wso2is/forms";
import { GenericIcon, Heading, LinkButton, PrimaryButton, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Form, Grid, Message, Segment } from "semantic-ui-react";
import { ModalWithSidePanel } from "../..";
import { createApplication, getApplicationTemplateData } from "../../../api";
import { ApplicationTemplateIllustrations } from "../../../configs";
import { AppConstants } from "../../../constants";
import { history } from "../../../helpers";
import {
    ApplicationTemplateInterface,
    ApplicationTemplateListItemInterface,
    MainApplicationInterface
} from "../../../models";
import { ApplicationManagementUtils } from "../../../utils";

/**
 * Specifies the template ID of SPAs.
 *
 * @constant
 *
 * @type {string}
 */
const SPA_TEMPLATE_ID = "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7";

/**
 * The template ID of the Web application templates.
 *
 * @constant
 *
 * @type {string}
 */
const WEB_APP_TEMPLATE_ID = "b9c5e11e-fc78-484b-9bec-015d247561b8";

/**
 * Protocols
 */
enum PROTOCOLS {
    OIDC,
    PASSIVE_STS,
    SAML
}

/**
 * Prop types of the `MinimalAppCreateWizard` component.
 */
interface MinimalApplicationCreateWizardPropsInterface extends TestableComponentInterface {
    title: string;
    closeWizard: () => void;
    template?: ApplicationTemplateListItemInterface;
    subTitle?: string;
    addProtocol: boolean;
    selectedProtocols?: string[];
    appId?: string;
    /**
     * Callback to update the application details.
     */
    onUpdate?: (id: string) => void;
}

/**
 * An app creation wizard with only the minimal features.
 *
 * @param {MinimalApplicationCreateWizardPropsInterface} props Props to be injected into the component.
 */
export const MinimalAppCreateWizard: FunctionComponent<MinimalApplicationCreateWizardPropsInterface> = (
    props: MinimalApplicationCreateWizardPropsInterface
): ReactElement => {

    const [ callBackUrls, setCallBackUrls ] = useState("");
    const [ showURLError, setShowURLError ] = useState(false);
    const [ templateSettings, setTemplateSettings ] = useState<MainApplicationInterface>(null);
    const [ selectedProtocol, setSelectedProtocol ] = useState<PROTOCOLS>(PROTOCOLS.OIDC);

    const { title, closeWizard, template, subTitle, [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [ submit, setSubmit ] = useTrigger();

    /**
     * Close the wizard.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param {string} urls - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackUrlWithRegExp = (urls: string): string => {
        let callbackURL = urls.replace(/['"]+/g, "");
        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL.split(",").join("|") + ")";
        }
        return callbackURL;
    };

    /**
     * Load application template data.
     */
    useEffect(() => {
        getApplicationTemplateData(template.id)
            .then((response: ApplicationTemplateInterface) => {
                setTemplateSettings(response.application);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "devPortal:components.applications.notifications.fetchTemplate.error" + ".message"
                            )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "devPortal:components.applications.notifications.fetchTemplate" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "devPortal:components.applications.notifications.fetchTemplate.genericError" + ".message"
                        )
                    })
                );
            });
    }, []);

    /**
     * Resolves to teh right help panel content.
     *
     * @return {ReactElement} The appropriate help content.
     */
    const resolveHelpContent = (): ReactElement => {
        switch (template.id) {
            case WEB_APP_TEMPLATE_ID:
                return (
                    <>
                        <p>
                            You have selected the Web Application template. An application with predefined set of
                            recommended settings based on the selected protocol will be registered for you. Please fill
                            the relevant fields to get started.
                        </p>
                        <h5>Name</h5>
                        <p>Provide a unique name for the application so that it can be easily identified.</p>
                        <p>E.g. Zoom, Salesforce, etc.</p>

                        <h5>Protocol</h5>
                        <p>
                            The access configuration protocol which will be used to SSO (Single Sign On) to the
                            application.
                        </p>
                        <Message info>
                            <a href="#" target="_blank">
                                Click here
                            </a>{ " " }
                            to learn more about supported protocols for agent-based single sign-on.
                        </Message>
                        <h5>Redirect URLs</h5>
                        <p>
                            After the authentication, we will only redirect to the above redirect URLs. You can also
                            specify more than one URL if needed.
                        </p>
                        <p>E.g. https://www.conotoso.com/login</p>
                    </>
                );
            case SPA_TEMPLATE_ID:
                return (
                    <>
                        <p>
                            You have selected the SIngle Page Application template. An application with predefined set
                            of recommended settings and required OIDC protocol configurations will be registered for
                            you. Please fill the relevant fields to get started with your application.
                        </p>
                        <h5>Name</h5>
                        <p>Provide a unique name for the application so that it can be easily identified.</p>
                        <h5>Redirect URLs</h5>
                        <p>
                            After the authentication, we will only redirect to the above redirect URLs. You can also
                            specify more than one URL if needed.
                        </p>
                        <Message warning>Note: This field is required for a functional app.</Message>
                    </>
                );
        }
    };

    /**
     * Resolves to the applicable content of an application template.
     *
     * @return {ReactElement} The content relevant to a specified application template.
     */
    const resolveContent = (): ReactElement => {
        if (template.id === SPA_TEMPLATE_ID || template.id === WEB_APP_TEMPLATE_ID) {
            return (
                <Forms
                    onSubmit={ (values) => {
                        submitUrl((url: string) => {
                            if (isEmpty(callBackUrls) && isEmpty(url)) {
                                setShowURLError(true);
                            } else {
                                const data = { ...templateSettings };

                                data.name = values.get("name").toString();
                                data.inboundProtocolConfiguration.oidc.callbackURLs = [
                                    buildCallBackUrlWithRegExp(url ? url : callBackUrls)
                                ];
                                data.description = ""

                                createApplication(ApplicationManagementUtils.prefixTemplateNameToDescription(
                                    data, template
                                ))
                                    .then((response) => {
                                        dispatch(
                                            addAlert({
                                                description: t(
                                                    "devPortal:components.applications.notifications." +
                                                    "addApplication.success.description"
                                                ),
                                                level: AlertLevels.SUCCESS,
                                                message: t(
                                                    "devPortal:components.applications.notifications." +
                                                    "addApplication.success.message"
                                                )
                                            })
                                        );

                                        // The created resource's id is sent as a location header.
                                        // If that's available, navigate to the edit page.
                                        if (!isEmpty(response.headers.location)) {
                                            const location = response.headers.location;
                                            const createdAppID = location.substring(location.lastIndexOf("/") + 1);

                                            history.push(
                                                AppConstants.PATHS.get("APPLICATION_EDIT").replace(":id", createdAppID)
                                            );

                                            return;
                                        }

                                        // Fallback to applications page, if the location header is not present.
                                        history.push(AppConstants.PATHS.get("APPLICATIONS"));
                                    })
                                    .catch((error) => {
                                        if (error.response && error.response.data && error.response.data.description) {
                                            dispatch(
                                                addAlert({
                                                    description: error.response.data.description,
                                                    level: AlertLevels.ERROR,
                                                    message: t(
                                                        "devPortal:components.applications.notifications." +
                                                        "addApplication.error.message"
                                                    )
                                                })
                                            );

                                            return;
                                        }

                                        dispatch(
                                            addAlert({
                                                description: t(
                                                    "devPortal:components.applications.notifications." +
                                                    "addApplication.genericError" +
                                                    ".description"
                                                ),
                                                level: AlertLevels.ERROR,
                                                message: t(
                                                    "devPortal:components.applications.notifications." +
                                                    "addApplication.genericError.message"
                                                )
                                            })
                                        );
                                    });
                            }
                        });
                    } }
                    submitState={ submit }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Field
                                    name="name"
                                    label={ t(
                                        "devPortal:components.applications.forms.generalDetails.fields.name.label"
                                    ) }
                                    required={ true }
                                    requiredErrorMessage={ t(
                                        "devPortal:components.applications.forms.generalDetails.fields.name" +
                                        ".validations.empty"
                                    ) }
                                    placeholder={ t(
                                        "devPortal:components.applications.forms.generalDetails.fields.name.placeholder"
                                    ) }
                                    type="text"
                                    data-testid={ `${ testId }-application-name-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        { template.id === WEB_APP_TEMPLATE_ID && (
                            <Grid.Row>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                    <p>Protocols</p>
                                    <Grid>
                                        <Grid.Row columns={ 3 }>
                                            <Grid.Column width={ 5 }>
                                                <Segment
                                                    textAlign="center"
                                                    className={ `${ selectedProtocol === PROTOCOLS.OIDC &&
                                                        "active" } protocol-cards` }
                                                    onClick={ () => {
                                                        setSelectedProtocol(PROTOCOLS.OIDC);
                                                    } }
                                                >
                                                    <GenericIcon
                                                        transparent={ true }
                                                        size="tiny"
                                                        icon={ ApplicationTemplateIllustrations.oidcWebApp }
                                                    />
                                                    OIDC
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column width={ 5 }>
                                                <Segment
                                                    textAlign="center"
                                                    className={ `${ selectedProtocol === PROTOCOLS.SAML &&
                                                        "active" } protocol-cards` }
                                                    onClick={ () => {
                                                        setSelectedProtocol(PROTOCOLS.SAML);
                                                    } }
                                                >
                                                    <GenericIcon
                                                        transparent={ true }
                                                        size="tiny"
                                                        icon={ ApplicationTemplateIllustrations.samlWebApp }
                                                    />
                                                    SAML
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column width={ 5 }>
                                                <Segment
                                                    textAlign="center"
                                                    className={ `${ selectedProtocol === PROTOCOLS.PASSIVE_STS &&
                                                        "active" } protocol-cards` }
                                                    onClick={ () => {
                                                        setSelectedProtocol(PROTOCOLS.PASSIVE_STS);
                                                    } }
                                                >
                                                    <GenericIcon
                                                        transparent={ true }
                                                        size="tiny"
                                                        icon={ ApplicationTemplateIllustrations.passiveSTS }
                                                    />
                                                    Passive STS
                                                </Segment>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                <Form.Field required>
                                    <label>
                                        { t(
                                            "devPortal:components.applications.forms.inboundOIDC." +
                                            "fields.callBackUrls.label"
                                        ) }
                                    </label>
                                    <URLInput
                                        urlState={ callBackUrls }
                                        setURLState={ setCallBackUrls }
                                        labelName={ "" }
                                        placeholder={ t(
                                            "devPortal:components.applications.forms.inboundOIDC." +
                                            "fields.callBackUrls" +
                                            ".placeholder"
                                        ) }
                                        validationErrorMsg={ t(
                                            "devPortal:components.applications.forms.inboundOIDC." +
                                            "fields.callBackUrls" +
                                            ".validations.empty"
                                        ) }
                                        validation={ (value: string) => {
                                            return FormValidation.url(value);
                                        } }
                                        computerWidth={ 10 }
                                        setShowError={ setShowURLError }
                                        showError={ showURLError }
                                        hint={ t(
                                            "devPortal:components.applications.forms.inboundOIDC." +
                                            "fields.callBackUrls.hint"
                                        ) }
                                        addURLTooltip={ t("common:addURL") }
                                        duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                        data-testid={ `${ testId }-callback-url-input` }
                                        getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                            submitUrl = submitFunction;
                                        } }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            );
        }
    };

    return (
        <ModalWithSidePanel
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            onClose={ handleWizardClose }
            closeOnDimmerClick
            closeOnEscape
            data-testid={ `${ testId }-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { title }
                    { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>{ resolveContent() }</ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ handleWizardClose }>
                                    Cancel
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    floated="right"
                                    onClick={ () => {
                                        setSubmit();
                                    } }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("common:register") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    Help
                    <Heading as="h6">Use the following as a guidance</Heading>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>{ resolveHelpContent() }</ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        </ModalWithSidePanel>
    );
};

/**
 * Default props for the application creation wizard.
 */
MinimalAppCreateWizard.defaultProps = {
    "data-testid": "minimal-application-create-wizard"
};
