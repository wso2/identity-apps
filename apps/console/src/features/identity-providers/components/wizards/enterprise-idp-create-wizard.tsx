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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import {
    CertFileStrategy,
    ContentLoader,
    FilePicker,
    GenericIcon,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    Steps,
    Switcher,
    useWizardAlert,
    XMLFileStrategy
} from "@wso2is/react-components";
import { addAlert } from "@wso2is/core/store";

import React, { FC, PropsWithChildren, ReactElement, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { IdentityProviderInterface, IdentityProviderTemplateInterface } from "../../models";
import { AppConstants, getCertificateIllustrations, history, ModalWithSidePanel, store } from "../../../core";
import { getIdentityProviderWizardStepIcons, getIdPIcons } from "../../configs";
import { Divider, Grid, Header, Icon } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import { createIdentityProvider } from "../../api";
import isEmpty from "lodash-es/isEmpty";
import { IdentityProviderManagementConstants } from "../../constants";
import cloneDeep from "lodash-es/cloneDeep";
import { FormValidation } from "@wso2is/validation";

/**
 * Proptypes for the enterprise identity provider
 * creation wizard component.
 */
interface EnterpriseIDPCreateWizardProps extends TestableComponentInterface {
    currentStep?: number;
    title: string;
    closeWizard: () => void;
    template: IdentityProviderTemplateInterface;
    subTitle?: string;
}

/**
 * Constants for wizard steps. As per the requirement we have three
 * wizard steps. Here are the step definitions:-
 *
 * GENERAL_DETAILS - This is common to both `oidc` and `saml` protocols.
 * AUTHENTICATOR_SETTINGS - Will have protocol specific fields and functionality.
 * CERTIFICATES - Common to both but has some differences.
 */
enum WizardSteps {
    GENERAL_DETAILS = "GeneralDetails",
    AUTHENTICATOR_SETTINGS = "Identity Provider Settings",
    CERTIFICATES = "Certificates"
}

interface WizardStepInterface {
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardSteps;
}

type AvailableProtocols = "oidc" | "saml";
type SamlConfigurationMode = "file" | "manual";
type CertificateInputType = "jwks" | "pem";
type MinMax = { min: number; max: number };
type FormErrors = { [ key: string ]: string };

export const EnterpriseIDPCreateWizard: FC<EnterpriseIDPCreateWizardProps> = (
    props: PropsWithChildren<EnterpriseIDPCreateWizardProps>
): ReactElement => {

    const {
        closeWizard,
        title,
        subTitle,
        template,
        [ "data-testid" ]: testId
    } = props;

    const wizardRef = useRef(null);

    const [ initWizard, setInitWizard ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ pemString, setPemString ] = useState<string>(EMPTY_STRING);
    const [ xmlBase64String, setXmlBase64String ] = useState<string>();
    const [ selectedMetadataFile, setSelectedMetadataFile ] = useState<File>(null);
    const [ pastedMetadataContent, setPastedMetadataContent ] = useState<string>(null);
    const [ selectedCertificateFile, setSelectedCertificateFile ] = useState<File>(null);
    const [ selectedCertInputType, setSelectedCertInputType ] = useState<CertificateInputType>("jwks");
    const [ selectedProtocol, setSelectedProtocol ] = useState<AvailableProtocols>("oidc");
    const [ selectedSamlConfigMode, setSelectedSamlConfigMode ] = useState<SamlConfigurationMode>("file");
    const [ pastedPEMContent, setPastedPEMContent ] = useState<string>(null);

    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        if (!initWizard) {
            setWizardSteps(getWizardSteps());
            setInitWizard(true);
        }
    }, [ initWizard ]);

    useEffect(() => {
        setSelectedCertInputType(selectedProtocol === "oidc" ? "jwks" : "pem")
    }, [ selectedProtocol ]);

    const initialValues = useMemo(() => ({
        RequestMethod: "post",
        NameIDType: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"
    }), []);

    // Utils

    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getIdentityProviderWizardStepIcons().general,
                name: WizardSteps.GENERAL_DETAILS,
                title: "General Settings"
            },
            {
                icon: getIdentityProviderWizardStepIcons().authenticatorSettings,
                name: WizardSteps.AUTHENTICATOR_SETTINGS,
                title: "Configuration"
            },
            {
                icon: getIdentityProviderWizardStepIcons().general,
                name: WizardSteps.CERTIFICATES,
                title: "Certificates"
            }
        ] as WizardStepInterface[];
    };

    const getAvailableNameIDFormats = () => {

        const schemes = [
            "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
            "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
            "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
            "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            "urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName",
            "urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName",
            "urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos",
            "urn:oasis:names:tc:SAML:2.0:nameid-format:entity"
        ];

        return schemes.map((scheme: string, index: number) => ({
            key: index, text: scheme, value: scheme
        }));

    };

    const getAvailableProtocolBindingTypes = () => {
        return [
            { key: 1, text: "HTTP Redirect", value: "redirect" },
            { key: 2, text: "HTTP Post", value: "post" },
            { key: 3, text: "As Per Request", value: "as_request" }
        ]
    };

    // Wizard

    const handleFormSubmit = (values, form, callback) => {

        // Deep clone the original template. Since we have both saml and
        // oidc protocol's authenticators in the same template we need to
        // have the logic to remove the other option before sending the
        // resource create requests.
        const identityProvider: IdentityProviderInterface = cloneDeep(template.idp);

        if (selectedProtocol === "oidc") {

            // Populate user entered values
            identityProvider.name = values?.name?.toString();
            identityProvider.federatedAuthenticators.authenticators[ 0 ].properties = [
                { "key": "ClientId", "value": values?.clientId?.toString() },
                { "key": "ClientSecret", "value": values?.clientSecret?.toString() },
                { "key": "OAuth2AuthzEPUrl", "value": values?.authorizationEndpointUrl?.toString() },
                { "key": "OAuth2TokenEPUrl", "value": values?.tokenEndpointUrl?.toString() },
                { "key": "callbackUrl", "value": store.getState().config.deployment.serverHost + "/commonauth" }
            ];

            // Certificates: bind the JWKS URL if exists otherwise pem
            identityProvider[ "certificate" ][ "jwksUri" ] = values.jwks_endpoint ?? EMPTY_STRING;
            identityProvider[ "certificate" ][ "certificates" ] = [ pemString ?? EMPTY_STRING ];

            // Identity provider placeholder image.
            if (AppConstants.getClientOrigin()) {
                if (AppConstants.getAppBasename()) {
                    identityProvider.image = AppConstants.getClientOrigin() +
                        "/" + AppConstants.getAppBasename() +
                        "/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
                } else {
                    identityProvider.image = AppConstants.getClientOrigin() +
                        "/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
                }
            }

            // Remove the saml authenticator from the template.
            identityProvider.federatedAuthenticators.authenticators.pop();
            identityProvider.federatedAuthenticators.defaultAuthenticatorId =
                identityProvider.federatedAuthenticators.authenticators[ 0 ].authenticatorId;

        } else {

            // Populate user entered values
            identityProvider.name = values?.name?.toString();

            if (selectedSamlConfigMode === "manual") {
                identityProvider.federatedAuthenticators.authenticators[ 1 ][ "properties" ] = [
                    { key: "IdPEntityId", value: values.IdPEntityId },
                    { key: "NameIDType", value: values.NameIDType },
                    { key: "RequestMethod", value: values.RequestMethod },
                    { key: "SPEntityId", value: values.SPEntityId },
                    { key: "SSOUrl", value: values.SSOUrl },
                    { key: "selectMode", value: "Manual Configuration" }
                ];
            } else {
                identityProvider.federatedAuthenticators.authenticators[ 1 ].properties = [
                    { key: "meta_data_saml", value: xmlBase64String ?? "" },
                    { key: "selectMode", value: "Metadata File Configuration" }
                ];
            }

            // Certificate
            identityProvider[ "certificate" ][ "certificates" ] = [ pemString ?? "" ];

            // Remove the oidc authenticator from the template.
            identityProvider.federatedAuthenticators.authenticators.shift();
            identityProvider.federatedAuthenticators.defaultAuthenticatorId =
                identityProvider.federatedAuthenticators.authenticators[ 0 ].authenticatorId

        }

        createIdentityProvider(identityProvider)
            .then((response) => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.success.message")
                }));
                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdIdpID = location.substring(location.lastIndexOf("/") + 1);
                    history.push({
                        pathname: AppConstants.getPaths().get("IDP_EDIT").replace(":id", createdIdpID),
                        search: IdentityProviderManagementConstants.NEW_IDP_URL_SEARCH_PARAM
                    });
                    return;
                }
                // Fallback to identity providers page, if the location
                // header is not present.
                history.push(AppConstants.getPaths().get("IDP"));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("console:develop.features.authenticationProvider.notifications." +
                            "addIDP.error.description",
                            { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                            "addIDP.error.message")
                    });
                    return;
                }
                setAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.genericError.message")
                });
            });

    };

    const wizardCommonFirstPage = () => (
        <WizardPage validate={ (values: any) => {
            const errors: FormErrors = {};
            errors.name = composeValidators(required, length(IDP_NAME_LENGTH))(values.name);
            setNextShouldBeDisabled(ifFieldsHave(errors));
            return errors;
        } }>
            <Field.Input
                data-testid={ `${ testId }-idp-name` }
                ariaLabel="name"
                inputType="name"
                name="name"
                placeholder="Enter a name for the identity provider"
                label="Identity provider name"
                maxLength={ IDP_NAME_LENGTH.max }
                minLength={ IDP_NAME_LENGTH.min }
                required={ true }
                width={ 15 }
            />
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                        <div>
                            <div>Select Protocol</div>
                            <SelectionCard
                                inline
                                image={ getIdPIcons().oidc }
                                size="x120"
                                className="sub-template-selection-card"
                                header={ "OIDC" }
                                selected={ selectedProtocol === "oidc" }
                                onClick={ () => setSelectedProtocol("oidc") }
                                imageSize="mini"
                                contentTopBorder={ false }
                                showTooltips={ true }
                                data-testid={ `${ testId }-oidc-card` }/>
                            <SelectionCard
                                inline
                                image={ getIdPIcons().saml }
                                size="x120"
                                className="sub-template-selection-card"
                                header={ "SAML" }
                                selected={ selectedProtocol === "saml" }
                                onClick={ () => setSelectedProtocol("saml") }
                                imageSize="mini"
                                contentTopBorder={ false }
                                showTooltips={ true }
                                data-testid={ `${ testId }-saml-card` }
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </WizardPage>
    );

    const samlConfigurationPage = () => (
        <WizardPage validate={ (values) => {
            const errors: FormErrors = {};
            errors.SPEntityId = composeValidators(required, length(SP_EID_LENGTH))(values.SPEntityId);
            errors.NameIDType = composeValidators(required)(values.NameIDType);
            errors.SSOUrl = composeValidators(required, length(SSO_URL_LENGTH), isUrl)(values.SSOUrl);
            errors.IdPEntityId = composeValidators(required, length(IDP_EID_LENGTH))(values.IdPEntityId);
            errors.RequestMethod = composeValidators(required)(values.RequestMethod);
            if (selectedSamlConfigMode === "file") {
                setNextShouldBeDisabled(!xmlBase64String);
            } else {
                setNextShouldBeDisabled(ifFieldsHave(errors));
            }
            return errors;
        } }>
            <Field.Input
                ariaLabel="Service provider entity id"
                inputType="default"
                name="SPEntityId"
                label="Service Provider Entity ID"
                required={ true }
                maxLength={ SP_EID_LENGTH.max }
                minLength={ SP_EID_LENGTH.min }
                width={ 15 }
                placeholder="Enter a Service Provider Entity ID"
            />
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <p><b>Mode of Configuration</b></p>
                        <Switcher
                            className={ "mt-1" }
                            defaultOptionValue="file"
                            selectedValue={ selectedSamlConfigMode }
                            onChange={ ({ value }) => setSelectedSamlConfigMode(value as any) }
                            options={ [ {
                                value: "manual",
                                label: "Manual Configuration",
                            }, {
                                value: "file",
                                label: "File Based Configuration",
                            } ] }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden/>
            { (selectedSamlConfigMode === "manual") ? (
                    <React.Fragment>
                        <Field.Dropdown
                            ariaLabel="Name id format"
                            name="NameIDType"
                            label="Name ID Format"
                            required={ true }
                            width={ 15 }
                            children={ getAvailableNameIDFormats() }
                            value={ "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" }
                            placeholder="Select an available name identifier"
                        />
                        <Field.Input
                            inputType="url"
                            ariaLabel="SSO Url"
                            name="SSOUrl"
                            label="SSO URL"
                            required={ true }
                            maxLength={ SSO_URL_LENGTH.max }
                            minLength={ SSO_URL_LENGTH.min }
                            width={ 15 }
                            placeholder={ "Enter SAML 2.0 redirect SSO url" }
                        />
                        <Field.Input
                            inputType="default"
                            ariaLabel="Identity provider entity id"
                            name="IdPEntityId"
                            label="Identity Provider Entity ID"
                            required={ true }
                            maxLength={ IDP_EID_LENGTH.max }
                            minLength={ IDP_EID_LENGTH.min }
                            width={ 15 }
                            placeholder={ "Enter SAML 2.0 entity id (saml issuer)" }
                        />
                        <Field.Dropdown
                            ariaLabel="SAML Protocol Binding"
                            name="RequestMethod"
                            label="SAML Protocol Binding"
                            required={ true }
                            children={ getAvailableProtocolBindingTypes() }
                            width={ 15 }
                            value={ "post" }
                            placeholder={ "Select mode of protocol binding" }
                        />
                    </React.Fragment>
                )
                : (
                    <FilePicker
                        key={ 1 }
                        fileStrategy={ XML_FILE_PROCESSING_STRATEGY }
                        file={ selectedMetadataFile }
                        pastedContent={ pastedMetadataContent }
                        onChange={ (result) => {
                            setSelectedMetadataFile(result.file);
                            setPastedMetadataContent(result.pastedContent);
                            setXmlBase64String(result.serialized as string);
                        } }
                        uploadButtonText="Upload Metadata File"
                        dropzoneText="Drag and drop a XML file here."
                        icon={ getCertificateIllustrations().uploadPlaceholder }
                        placeholderIcon={ <Icon name="file code" size="huge"/> }
                    />
                )
            }
        </WizardPage>
    );

    const oidcConfigurationPage = () => {
        return (
            <WizardPage validate={ (values) => {
                const errors: FormErrors = {};
                errors.clientId = composeValidators(required, length(IDP_NAME_LENGTH))(values.clientId);
                errors.clientSecret = composeValidators(required, length(IDP_NAME_LENGTH))(values.clientSecret);
                errors.authorizationEndpointUrl = composeValidators(required, length(IDP_NAME_LENGTH))(values.authorizationEndpointUrl);
                errors.tokenEndpointUrl = composeValidators(required, length(IDP_NAME_LENGTH))(values.tokenEndpointUrl);
                setNextShouldBeDisabled(ifFieldsHave(errors));
                return errors;
            } }>
                <Field.Input
                    ariaLabel="clientId"
                    inputType="resourceName"
                    name="clientId"
                    label={ "Client ID" }
                    required={ true }
                    autoComplete={ "" + Math.random() }
                    maxLength={ 100 }
                    minLength={ 3 }
                    data-testid={ `${ testId }-idp-client-id` }
                    width={ 13 }
                />
                <Field.Input
                    ariaLabel="clientSecret"
                    inputType="password"
                    name="clientSecret"
                    label={ "Client secret" }
                    required={ true }
                    hidePassword={ t("common:hide") }
                    showPassword={ t("common:show") }
                    autoComplete={ "" + Math.random() }
                    maxLength={ 100 }
                    minLength={ 3 }
                    type="password"
                    data-testid={ `${ testId }-idp-client-secret` }
                    width={ 13 }
                />
                <Field.Input
                    ariaLabel="authorizationEndpointUrl"
                    inputType="url"
                    name="authorizationEndpointUrl"
                    label={ "Authorization Endpoint URL" }
                    required={ true }
                    placeholder={ "https://localhost:9443/oauth2/authorize/" }
                    autoComplete={ "" + Math.random() }
                    maxLength={ 100 }
                    minLength={ 3 }
                    data-testid={ `${ testId }-idp-authorization-endpoint-url` }
                    width={ 13 }
                />
                <Field.Input
                    ariaLabel="tokenEndpointUrl"
                    inputType="url"
                    name="tokenEndpointUrl"
                    label={ "Token Endpoint URL" }
                    required={ true }
                    placeholder={ "https://localhost:9443/oauth2/token/" }
                    autoComplete={ "" + Math.random() }
                    maxLength={ 100 }
                    minLength={ 3 }
                    data-testid={ `${ testId }-idp-token-endpoint-url` }
                    width={ 13 }
                />
            </WizardPage>
        );
    };

    const certificatesPage = () => (
        <WizardPage validate={ () => {
            setNextShouldBeDisabled(!pemString);
            return {};
        } }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <p><b>Mode of Certificate Configuration</b></p>
                        { (selectedProtocol === "oidc") && (
                            <Switcher
                                compact
                                className={ "mt-1" }
                                defaultOptionValue="jwks"
                                selectedValue={ selectedCertInputType }
                                onChange={ ({ value }) => setSelectedCertInputType(value as any) }
                                options={ [ {
                                    value: "jwks",
                                    label: "JWKS Endpoint",
                                }, {
                                    value: "pem",
                                    label: "Use PEM Certificate",
                                } ] }
                            />
                        ) }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden/>
            { (selectedProtocol === "oidc" && selectedCertInputType === "jwks") && (
                <Field.Input
                    ariaLabel="JWKS Endpoint URL"
                    inputType="url"
                    name="jwks_endpoint"
                    label="JWKS Endpoint URL"
                    required={ true }
                    maxLength={ JWKS_URL_LENGTH.max }
                    minLength={ JWKS_URL_LENGTH.min }
                    width={ 15 }
                    placeholder="Enter JWKS Endpoint URL"
                />
            ) }
            { (selectedCertInputType === "pem") && (
                <FilePicker
                    key={ 2 }
                    file={ selectedCertificateFile }
                    pastedContent={ pastedPEMContent }
                    fileStrategy={ CERT_FILE_PROCESSING_STRATEGY }
                    onChange={ (result) => {
                        if (result?.serialized) {
                            setPastedPEMContent(result?.pastedContent);
                            setSelectedCertificateFile(result?.file);
                            setPemString(result.serialized.pemStripped);
                        }
                    } }
                    uploadButtonText="Upload Certificate File"
                    dropzoneText="Drag and drop a certificate file here."
                    icon={ getCertificateIllustrations().uploadPlaceholder }
                    placeholderIcon={ getCertificateIllustrations().uploadPlaceholder }
                />
            ) }
        </WizardPage>
    );

    // Resolvers

    const resolveWizardPages = (): Array<ReactElement> => {
        if (selectedProtocol === "oidc") {
            return [
                wizardCommonFirstPage(),
                oidcConfigurationPage(),
                certificatesPage()
            ];
        } else {
            return [
                wizardCommonFirstPage(),
                samlConfigurationPage(),
                certificatesPage()
            ];
        }
    };

    const resolveHelpPanel = () => {

        const SECOND_STEP_WIZARD_PAGE_INDEX: number = 1;

        // Return null when `showHelpPanel` is false or `samlHelp`
        // or `oidcHelp` is not defined in `selectedTemplate` object.
        if (!template?.content?.samlHelp
            || !template?.content?.oidcHelp
            || currentWizardStep !== SECOND_STEP_WIZARD_PAGE_INDEX) {
            return null;
        }

        const { samlHelp: SamlHelp, oidcHelp: OidcHelp } = template?.content;

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header
                    className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        Help
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        { (selectedProtocol === "oidc") ? (
                            <OidcHelp/>
                        ) : (
                            <SamlHelp/>
                        ) }
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );

    }

    // Start: Modal

    return (
        <ModalWithSidePanel
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-testid={ `${ testId }-modal` }>
            <ModalWithSidePanel.MainPanel>
                { /*Modal header*/ }
                <ModalWithSidePanel.Header
                    className="page-header-inner with-image"
                    data-testid={ `${ testId }-modal-header` }>
                    <div className="display-flex">
                        <GenericIcon
                            icon={ getIdPIcons().enterprise }
                            size="x50"
                            transparent
                            spaced={ "right" }
                            data-testid={ `${ testId }-image` }/>
                        <Header
                            size={ "small" }
                            textAlign={ "left" }
                            className={ "m-0" }
                            data-testid={ `${ testId }-text-wrapper` }>
                            { title && (
                                <span data-testid={ `${ testId }-title` }>{ title }</span>
                            ) }
                            { subTitle && (
                                <Header.Subheader
                                    data-testid={ `${ testId }-sub-title` }>
                                    { subTitle }
                                </Header.Subheader>
                            ) }
                        </Header>
                    </div>
                </ModalWithSidePanel.Header>
                { /*Modal body content*/ }
                <React.Fragment>
                    <ModalWithSidePanel.Content
                        className="steps-container"
                        data-testid={ `${ testId }-modal-content-1` }>
                        <Steps.Group
                            current={ currentWizardStep }>
                            { wizardSteps.map((step, index) => (
                                <Steps.Step
                                    active
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }/>
                            )) }
                        </Steps.Group>
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-testid={ `${ testId }-modal-content-2` }>
                        { alert && alertComponent }
                        <Wizard2
                            ref={ wizardRef }
                            initialValues={ initialValues }
                            onSubmit={ handleFormSubmit }
                            uncontrolledForm={ true }
                            pageChanged={ (index: number) => setCurrentWizardStep(index) }
                            data-testid={ testId }>
                            { resolveWizardPages() }
                        </Wizard2>
                    </ModalWithSidePanel.Content>
                </React.Fragment>
                { /*Modal actions*/ }
                <ModalWithSidePanel.Actions
                    data-testid={ `${ testId }-modal-actions` }>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    floated="left" onClick={ closeWizard }
                                    data-testid={ `${ testId }-modal-cancel-button` }>
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                {/*Check whether we have more steps*/ }
                                { currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled }
                                        floated="right" onClick={ () => {
                                        wizardRef.current.gotoNextPage();
                                    } }
                                        data-testid={ `${ testId }-modal-next-button` }>
                                        { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                {/*Check whether its the last step*/ }
                                { currentWizardStep === wizardSteps.length - 1 && (
                                    // Note that we use the same logic as the next button
                                    // element. This is because we pass a callback to
                                    // onSubmit which triggers a dedicated handler.
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled }
                                        type="submit"
                                        floated="right" onClick={ () => {
                                        wizardRef.current.gotoNextPage();
                                    } }
                                        data-testid={ `${ testId }-modal-finish-button` }>
                                        { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        type="submit"
                                        floated="right" onClick={ () => wizardRef.current.gotoPreviousPage() }
                                        data-testid={ `${ testId }-modal-previous-button` }>
                                        <Icon name="arrow left"/>
                                        { t("console:develop.features.authenticationProvider.wizards.buttons.previous") }
                                    </LinkButton>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { resolveHelpPanel() }
        </ModalWithSidePanel>
    );

}

/**
 * Default props for the enterprise identity provider
 * creation wizard.
 */
EnterpriseIDPCreateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "idp-edit-idp-create-wizard"
};

// OIDC form constants.
const OIDC_CLIENT_ID_MAX_LENGTH: MinMax = { max: 100, min: 1 };
const OIDC_CLIENT_SECRET_MAX_LENGTH: MinMax = { max: 100, min: 1 };
const OIDC_URL_MAX_LENGTH: MinMax = { max: 2048, min: 10 };

// SAML form constants.
const IDP_NAME_LENGTH: MinMax = { max: 120, min: 3 };
const SP_EID_LENGTH: MinMax = { max: 240, min: 3 };
const SSO_URL_LENGTH: MinMax = { max: 2048, min: 10 };
const IDP_EID_LENGTH: MinMax = { max: 2048, min: 5 };
const JWKS_URL_LENGTH: MinMax = { max: 2048, min: 10 };

// General constants
const EMPTY_STRING = "";
const CERT_FILE_PROCESSING_STRATEGY = new CertFileStrategy();
const XML_FILE_PROCESSING_STRATEGY = new XMLFileStrategy();

// Validation Functions

const composeValidators = (...validators) => (value) => {
    return validators.reduce(
        (error, validator) => error || validator(value),
        undefined
    );
};

const ifFieldsHave = (errors: FormErrors): boolean => {
    return !Object.keys(errors).every((k) => !errors[ k ]);
};

const required = (value: any) => {
    if (!value) {
        return `This is a required field`;
    }
    return undefined;
};

const length = (minMax: MinMax) => (value) => {
    if (value.length > minMax.max) {
        return `Cannot exceed more than ${ minMax.max } characters.`;
    }
    if (value.length < minMax.min) {
        return `Should have at least ${ minMax.min } characters.`;
    }
    return undefined;
};

const isUrl = (value) => {
    return FormValidation.url(value) ? undefined : "This value is invalid."
};
