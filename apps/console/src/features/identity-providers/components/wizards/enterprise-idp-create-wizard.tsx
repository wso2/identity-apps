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

import React, { FC, PropsWithChildren, ReactElement, Suspense, useEffect, useRef, useState } from "react";
import { IdentityProviderInterface, IdentityProviderTemplateInterface } from "../../models";
import { AppConstants, getCertificateIllustrations, history, ModalWithSidePanel, store } from "../../../core";
import { getIdentityProviderWizardStepIcons, getIdPIcons, getIdPTemplateDocsIcons } from "../../configs";
import { Divider, Grid, Header, Icon } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import { createIdentityProvider } from "../../api";
import isEmpty from "lodash-es/isEmpty";
import { IdentityProviderManagementConstants } from "../../constants";

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

// Oidc form constants.
const CLIENT_ID_MAX_LENGTH: number = 100;
const CLIENT_SECRET_MAX_LENGTH: number = 100;
const URL_MAX_LENGTH: number = 2048;

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
    const [ selectedProtocol, setSelectedProtocol ] = useState<"oidc" | "saml">("oidc");
    const [ selectedNameIdValue, setSelectedNameIdValue ] = useState<string>();
    const [ selectedSamlConfigMode, setSelectedSamlConfigMode ] = useState<string>();
    const [ xmlBase64String, setXmlBase64String ] = useState<string>();

    const [ selectedCertInputType, setSelectedCertInputType ] = useState<"jwks" | "pem">("jwks");
    const [ pemString, setPemString ] = useState<string>("");

    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        setWizardSteps(getWizardSteps());
        console.log("THIS IS THE TEMPLATE", template);
        setInitWizard(false);
    }, [ initWizard ]);

    useEffect(() => {
        setSelectedCertInputType(selectedProtocol === "oidc" ? "jwks" : "pem")
    }, [ selectedProtocol ])

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

        let identityProvider: IdentityProviderInterface;

        if (selectedProtocol === "oidc") {

            // Populate user entered values
            identityProvider = template.idp;
            identityProvider.name = values?.name?.toString();
            identityProvider.federatedAuthenticators.authenticators[ 0 ].properties = [
                { "key": "ClientId", "value": values?.clientId?.toString() },
                { "key": "ClientSecret", "value": values?.clientSecret?.toString() },
                { "key": "OAuth2AuthzEPUrl", "value": values?.authorizationEndpointUrl?.toString() },
                { "key": "OAuth2TokenEPUrl", "value": values?.tokenEndpointUrl?.toString() },
                { "key": "callbackUrl", "value": store.getState().config.deployment.serverHost + "/commonauth" }
            ];

            // Certificates: bind the JWKS URL if exists otherwise pem
            identityProvider[ "certificate" ][ "jwksUri" ] = values.jwks_endpoint ?? "";
            identityProvider[ "certificate" ][ "certificates" ] = [ pemString ?? "" ];

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
            identityProvider = template.idp;
            identityProvider.name = values?.name?.toString();
            identityProvider.federatedAuthenticators.authenticators[ 1 ].properties = [
                { key: "IdPEntityId", value: values.IdPEntityId },
                { key: "NameIDType", value: values.NameIDType },
                { key: "RequestMethod", value: values.RequestMethod },
                { key: "SPEntityId", value: values.SPEntityId },
                { key: "SSOUrl", value: values.SSOUrl }
            ];

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
            const errors: { [ key: string ]: string } = {};
            if (!values.name) {
                errors.name = 'Required'
            }
            return errors;
        } }>
            <Field.Input
                data-testid={ `${ testId }-idp-name` }
                ariaLabel="name"
                inputType="name"
                name="name"
                placeholder="Enter a name for the identity provider"
                label="Identity provider name"
                maxLength={ 20 }
                minLength={ 3 }
                required={ true }
                width={ 10 }
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
        <WizardPage validate={ (values): any => {
            const errors: { [ key: string ]: string } = {};
            if (!values.SPEntityId) {
                errors.name = 'Required';
            }
            return errors;
        } }>
            <Field.Input
                ariaLabel="Service provider entity id"
                inputType="default"
                name="SPEntityId"
                label="Service Provider Entity ID"
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                width={ 15 }
                validate={ (value) => value.startsWith("s") && "Cant start with s" }
                placeholder="Enter a Service Provider Entity ID"
            />
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <p><b>Mode of Configuration</b></p>
                        <Switcher
                            className={ "mt-1" }
                            defaultOptionValue="file"
                            onChange={ ({ value }) => setSelectedSamlConfigMode(value) }
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
                            initialValue={ "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" }
                            children={ getAvailableNameIDFormats() }
                            placeholder="Select an available name identifier"
                        />
                        <Field.Input
                            inputType="url"
                            ariaLabel="SSO Url"
                            name="SSOUrl"
                            label="SSO URL"
                            required={ true }
                            maxLength={ 1000 }
                            minLength={ 0 }
                            width={ 15 }
                            placeholder={ "Enter SAML 2.0 redirect SSO url" }
                        />
                        <Field.Input
                            inputType="default"
                            ariaLabel="Identity provider entity id"
                            name="IdPEntityId"
                            label="Identity Provider Entity ID"
                            required={ true }
                            maxLength={ 1000 }
                            minLength={ 0 }
                            width={ 15 }
                            placeholder={ "Enter SAML 2.0 entity id (saml issuer)" }
                        />
                        <Field.Dropdown
                            ariaLabel="SAML Protocol Binding"
                            name="RequestMethod"
                            label="SAML Protocol Binding"
                            required={ true }
                            initialValue={ "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" }
                            children={ getAvailableProtocolBindingTypes() }
                            width={ 15 }
                            placeholder={ "Select mode of protocol binding" }
                        />
                    </React.Fragment>
                )
                : (
                    <FilePicker
                        fileStrategy={ new XMLFileStrategy() }
                        onChange={ (result) => {
                            // meta_data_saml
                            setXmlBase64String(result.serialized as string);
                        } }
                        uploadButtonText="Upload Metadata File"
                        dropzoneText="Drag and drop a XML file here."
                        icon={ getCertificateIllustrations().uploadPlaceholder }
                        placeholderIcon={ getCertificateIllustrations().uploadPlaceholder }
                    />
                )
            }
        </WizardPage>
    );

    const oidcConfigurationPage = () => {
        return (
            <WizardPage>
                <Field.Input
                    ariaLabel="clientId"
                    inputType="identifier"
                    name="clientId"
                    label={ "Client ID" }
                    required={ true }
                    autoComplete={ "" + Math.random() }
                    maxLength={ 100 }
                    minLength={ 3 }
                    // TODO: checkon key press usecase
                    // onKeyDown={ keyPressed }
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
                    // TODO: checkon key press usecase
                    // onKeyDown={ keyPressed }
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
        )
    };

    const certificatesPage = () => (
        <WizardPage>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <p><b>Mode of Certificate Configuration</b></p>
                        { (selectedProtocol === "oidc") && (
                            <Switcher
                                compact
                                className={ "mt-1" }
                                defaultOptionValue="jwks"
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
                    maxLength={ 100 }
                    minLength={ 3 }
                    width={ 15 }
                    placeholder="Enter JWKS Endpoint URL"
                />
            ) }
            { (selectedCertInputType === "pem") && (
                <FilePicker
                    fileStrategy={ new CertFileStrategy() }
                    onChange={ (result) => {
                        if (result?.serialized) {
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

    const resolveWizardInitialValues = () => ({});

    const resolveHelpPanel = () => {

        // Return null when `showHelpPanel` is false or `samlHelp`
        // or `oidcHelp` is not defined in `selectedTemplate` object.
        if (!template?.content?.samlHelp
            || !template?.content?.oidcHelp
            || currentWizardStep !== 1) {
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
                            icon={ getIdPTemplateDocsIcons().manualsetup }
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
                            initialValues={ resolveWizardInitialValues() }
                            onSubmit={ handleFormSubmit }
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
                                        floated="right" onClick={ () => {
                                        wizardRef.current.gotoNextPage();
                                        console.log("next page....");
                                    } }
                                        data-testid={ `${ testId }-modal-next-button` }>
                                        { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                {/*Check whether its the last step*/ }
                                { currentWizardStep === wizardSteps.length - 1 && (
                                    // Note that we use the same logic as the next button
                                    // element. This is because when we pass a callback to
                                    // onSubmit which triggers a dedicated handler.
                                    <PrimaryButton
                                        floated="right" onClick={ () => {
                                        wizardRef.current.gotoNextPage();
                                    } }
                                        data-testid={ `${ testId }-modal-finish-button` }>
                                        { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
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
