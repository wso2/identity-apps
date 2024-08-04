/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Backdrop from "@mui/material/Backdrop";
import Divider from "@oxygen-ui/react/Divider";
import Grid from "@oxygen-ui/react/Grid";
import { EventPublisher } from "@wso2is/admin.core.v1";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components";
import { getCertificateIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1/models/reducer-state";
import { AppState } from "@wso2is/admin.core.v1/store";
import { commonConfig } from "@wso2is/admin.extensions.v1";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import {
    CertFileStrategy,
    ContentLoader,
    DocumentationLink,
    FilePicker,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    Steps,
    Switcher,
    XMLFileStrategy,
    useDocumentation,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, {
    FC,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Grid as SemanticGrid } from "semantic-ui-react";
import { createConnection, useGetConnectionTemplate } from "../../api/connections";
import { getConnectionIcons, getConnectionWizardStepIcons } from "../../configs/ui";
import { ConnectionManagementConstants } from "../../constants/connection-constants";
import { AuthenticatorMeta } from "../../meta/authenticator-meta";
import {
    AuthProtocolTypes,
    ConnectionInterface,
    ConnectionTemplateInterface,
    EnterpriseConnectionCreateWizardGeneralFormValuesInterface,
    GenericConnectionCreateWizardPropsInterface,
    IdpNameValidationCache
} from "../../models/connection";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

/**
 * Proptypes for the enterprise identity provider
 * creation wizard component.
 */
interface EnterpriseConnectionCreateWizardProps extends
    GenericConnectionCreateWizardPropsInterface, IdentifiableComponentInterface {
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

export const EnterpriseConnectionCreateWizard: FC<EnterpriseConnectionCreateWizardProps> = (
    props: PropsWithChildren<EnterpriseConnectionCreateWizardProps>
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        title,
        subTitle,
        template,
        [ "data-componentid" ]: componentId
    } = props;

    const wizardRef: MutableRefObject<any> = useRef(null);

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
    const [ selectedTemplateId, setSelectedTemplateId ] = useState<string>(null);
    const [ selectedSamlConfigMode, setSelectedSamlConfigMode ] = useState<SamlConfigurationMode>("file");
    const [ pastedPEMContent, setPastedPEMContent ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // Dynamic UI state
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const idpNameValidationCache: MutableRefObject<IdpNameValidationCache> = useRef(null);
    const [ isUserInputIdpNameAlreadyTaken, setIsUserInputIdpNameAlreadyTaken ] = useState<boolean>(undefined);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: connectionTemplate,
        isLoading: isConnectionTemplateFetchRequestLoading
    } = useGetConnectionTemplate(selectedTemplateId, selectedTemplateId !== null);

    useEffect(() => {
        if (!initWizard) {
            setWizardSteps(getWizardSteps());
            setInitWizard(true);
        }
    }, [ initWizard ]);

    useEffect(() => {
        setSelectedCertInputType(selectedProtocol === "oidc" ? "jwks" : "pem");

        const templateId: string = selectedProtocol === "saml"
            ? "enterprise-saml-idp"
            : "enterprise-oidc-idp";

        setSelectedTemplateId(templateId);
    }, [ selectedProtocol ]);

    const initialValues: { NameIDType: string, RequestMethod: string, name: string } = useMemo(() => ({
        NameIDType: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
        RequestMethod: "post",
        name: EMPTY_STRING // This must be filled by the user.
    }), []);

    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.GENERAL_DETAILS,
                title: "General Settings"
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardSteps.AUTHENTICATOR_SETTINGS,
                title: "Configuration"
            },
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.CERTIFICATES,
                title: "Certificates"
            }
        ] as WizardStepInterface[];
    };

    /**
     * Check if the typed IDP name is already taken.
     *
     * @param value - User input for the IDP name.
     */
    const idpNameValidation: DebouncedFunc<(value: string) => void> = debounce(
        async (value: string) => {
            let idpExist: boolean;

            if (idpNameValidationCache?.current?.value === value) {
                idpExist = idpNameValidationCache?.current?.state;
            }

            if (idpExist === undefined) {
                try {
                    idpExist = await ConnectionsManagementUtils.searchIdentityProviderName(value);
                } catch (e) {
                    /**
                     * Ignore the error, as a failed identity provider search
                     * should not result in user blocking. However, if the
                     * identity provider name already exists, it will undergo
                     * validation from the backend, and any resulting errors
                     * will be displayed in the user interface.
                     */
                    idpExist = false;
                }

                idpNameValidationCache.current = {
                    state: idpExist,
                    value
                };
            }

            setIsUserInputIdpNameAlreadyTaken(!!idpExist);
        },
        500
    );

    const renderDimmerOverlay = (): ReactNode => {
        return (
            <Backdrop open={ true }>
                { t("common:featureAvailable") }
            </Backdrop>
        );
    };

    /**
     * Check whether loop back call is allowed or not.
     * @param value - URL to check.
     */
    const checkValueIsLoopBackCall = (value: string) => {
        if (commonConfig?.blockLoopBackCalls && URLUtils.isLoopBackCall(value)) {
            return t("idp:forms.common.internetResolvableErrorMessage");
        }

        return undefined;
    };

    /**
     * @param values - form values
     * @param form - form instance
     * @param callback - callback to proceed to the next step
     */
    const handleFormSubmit = (values: any) => {

        const FIRST_ENTRY: number = 0;

        const { idp: identityProvider } = cloneDeep(connectionTemplate);

        if (selectedProtocol === "oidc") {

            identityProvider.templateId = selectedTemplateId;

            // Populate user entered values
            identityProvider.name = values?.name?.toString();
            identityProvider.federatedAuthenticators.authenticators[ FIRST_ENTRY ].properties = [
                { "key": "ClientId", "value": values?.clientId?.toString() },
                { "key": "ClientSecret", "value": values?.clientSecret?.toString() },
                { "key": "OAuth2AuthzEPUrl", "value": values?.authorizationEndpointUrl?.toString() },
                { "key": "OAuth2TokenEPUrl", "value": values?.tokenEndpointUrl?.toString() },
                { "key": "callbackUrl", "value": config?.deployment?.customServerHost + "/commonauth" }
            ];
            // Certificates: bind the JWKS URL if exists otherwise pem
            identityProvider[ "certificate" ][ "jwksUri" ] = values.jwks_endpoint ?? EMPTY_STRING;
            identityProvider[ "certificate" ][ "certificates" ] = [ pemString ? btoa(pemString) : EMPTY_STRING ];

        } else {

            identityProvider.templateId = template.subTemplates
                .find((template: ConnectionTemplateInterface) => {
                    return template.id === "enterprise-saml-idp";
                })?.id;

            // Populate user entered values
            identityProvider.name = values?.name?.toString();
            if (selectedSamlConfigMode === "manual") {
                identityProvider.federatedAuthenticators.authenticators[ FIRST_ENTRY ][ "properties" ] = [
                    { key: "IdPEntityId", value: values.IdPEntityId },
                    { key: "NameIDType", value: values.NameIDType },
                    { key: "RequestMethod", value: values.RequestMethod },
                    { key: "SPEntityId", value: values.SPEntityId },
                    { key: "SSOUrl", value: values.SSOUrl },
                    { key: "SelectMode", value: "Manual Configuration" },
                    { key: "IsUserIdInClaims", value: "false" },
                    { key: "IsSLORequestAccepted", value: "false" },
                    { key: "SignatureAlgorithm", value: "RSA with SHA256" },
                    { key: "DigestAlgorithm", value: "SHA256" }
                ];
            } else {
                identityProvider.federatedAuthenticators.authenticators[ FIRST_ENTRY ].properties = [
                    { key: "SPEntityId", value: values.SPEntityId },
                    { key: "meta_data_saml", value: xmlBase64String ?? EMPTY_STRING },
                    { key: "SelectMode", value: "Metadata File Configuration" },
                    { key: "IsUserIdInClaims", value: "false" },
                    { key: "IsSLORequestAccepted", value: "false" }
                ];
            }
            identityProvider[ "certificate" ][ "certificates" ] = [ pemString ? btoa(pemString) : EMPTY_STRING ];

        }

        // Identity provider placeholder image.
        identityProvider.image = "assets/images/logos/enterprise.svg";

        // Add the default description from the metadata instead from template.
        identityProvider.description = AuthenticatorMeta.getAuthenticatorDescription(
            identityProvider?.federatedAuthenticators?.authenticators[ FIRST_ENTRY ]?.authenticatorId
        );

        setIsSubmitting(true);

        createConnection(identityProvider)
            .then((response: AxiosResponse<ConnectionInterface>) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: componentId + "-" + kebabCase(selectedProtocol)
                });
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications." +
                        "addIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "addIDP.success.message")
                }));
                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location: string = response.headers.location;
                    const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }
                onIDPCreate();
            })
            .catch((error: AxiosError) => {
                const identityAppsError: IdentityAppsError = ConnectionManagementConstants.ERROR_CREATE_LIMIT_REACHED;

                if (error.response.status === 403 &&
                    error?.response?.data?.code ===
                    identityAppsError.getErrorCode()) {

                    setAlert({
                        code: identityAppsError.getErrorCode(),
                        description: t(
                            identityAppsError.getErrorDescription()
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            identityAppsError.getErrorMessage()
                        ),
                        traceId: identityAppsError.getErrorTraceId()
                    });
                    setTimeout(() => setAlert(undefined), 4000);

                    return;
                }

                if (error?.response.status === 500 &&
                    selectedProtocol === "saml" &&
                    selectedSamlConfigMode === "file" &&
                    error.response?.data.code === "IDP-65002") {
                    setAlert({
                        description: "You are trying to add a provider with an existing Identity" +
                            " Provider Entity ID or a Service Provider Entity ID.",
                        level: AlertLevels.ERROR,
                        message: "There's a Conflicting Entity"
                    });
                    setTimeout(() => setAlert(undefined), 8000);

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("authenticationProvider:notifications." +
                            "addIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "addIDP.error.message")
                    });
                    setTimeout(() => setAlert(undefined), 4000);

                    return;
                }
                setAlert({
                    description: t("authenticationProvider:notifications." +
                        "addIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications." +
                        "addIDP.genericError.message")
                });
                setTimeout(() => setAlert(undefined), 4000);
            })
            .finally(() => {
                setIsSubmitting(false);
            });

    };

    const wizardCommonFirstPage = () => (
        <WizardPage
            validate={ (values: EnterpriseConnectionCreateWizardGeneralFormValuesInterface) => {
                const errors: FormErrors = {};

                errors.name = composeValidators(required, length(IDP_NAME_LENGTH))(values.name);
                if (values?.name && isUserInputIdpNameAlreadyTaken) {
                    errors.name = t("authenticationProvider:" +
                        "forms.generalDetails.name.validations.duplicate");
                }
                if (!FormValidation.isValidResourceName(values.name)) {
                    errors.name = t("authenticationProvider:" +
                        "templates.enterprise.validation.name");
                }
                setNextShouldBeDisabled(ifFieldsHave(errors));
            } }
        >
            <Field.Input
                data-testid={ `${ componentId }-form-wizard-idp-name` }
                ariaLabel="name"
                inputType="resource_name"
                name="name"
                placeholder="Enter a name for the identity provider"
                label="Identity provider name"
                initialValue={ initialValues.name }
                maxLength={ IDP_NAME_LENGTH.max }
                minLength={ IDP_NAME_LENGTH.min }
                required={ true }
                width={ 15 }
                format = { (values: any) => {
                    return values.toString().trimStart();
                } }
                listen={ idpNameValidation }
                validation={ (value: string) => {
                    let errors: "";

                    errors = composeValidators(required, length(IDP_NAME_LENGTH))(value);
                    if (value && isUserInputIdpNameAlreadyTaken) {
                        errors = t("authenticationProvider:" +
                            "forms.generalDetails.name.validations.duplicate");
                    }
                    if (!FormValidation.isValidResourceName(value)) {
                        errors = t("authenticationProvider:" +
                            "templates.enterprise.validation.invalidName",
                        { idpName: value });
                    }

                    if (errors === "" || errors === undefined) {
                        setNextShouldBeDisabled(false);
                    }

                    return errors;
                }
                }
            />
            <div className="sub-template-selection">
                <label className="sub-templates-label">Select protocol</label>
                <Grid
                    container
                    spacing={ { md: 3, xs: 2 } }
                    columns={ { md: 12, sm: 8, xs: 4 } }
                >
                    <Grid xs={ 2 } sm={ 4 } md={ 8 }>
                        <SelectionCard
                            inline
                            image={ getConnectionIcons().oidc }
                            size="small"
                            className="sub-template-selection-card"
                            header={ "OpenID Connect" }
                            selected={ selectedProtocol === "oidc" }
                            onClick={ () => setSelectedProtocol("oidc") }
                            imageSize="x30"
                            imageOptions={ {
                                relaxed: true,
                                square: false,
                                width: "auto"
                            } }
                            contentTopBorder={ false }
                            showTooltips={ true }
                            data-componentid={ `${ componentId }-form-wizard-oidc-selection-card` }
                        />
                        <SelectionCard
                            inline
                            image={ getConnectionIcons().saml }
                            size="small"
                            className="sub-template-selection-card"
                            style={ { marginTop: "0" } }
                            header={ "SAML" }
                            selected={ selectedProtocol === "saml" }
                            onClick={ () => setSelectedProtocol("saml") }
                            imageSize="x30"
                            imageOptions={ {
                                relaxed: true,
                                square: false,
                                width: "auto"
                            } }
                            showTooltips={ true }
                            disabled={ false }
                            overlay={ renderDimmerOverlay() }
                            contentTopBorder={ false }
                            renderDisabledItemsAsGrayscale={ false }
                            overlayOpacity={ 0.6 }
                            data-componentid={ `${ componentId }-form-wizard-saml-selection-card` }
                        />
                    </Grid>
                </Grid>
            </div>
        </WizardPage>
    );

    const samlConfigurationPage = () => (
        <WizardPage
            validate={ (values: any) => {
                const errors: FormErrors = {};

                errors.SPEntityId = composeValidators(required, length(SP_EID_LENGTH))(values.SPEntityId);
                if (selectedSamlConfigMode === "file") {
                    setNextShouldBeDisabled(ifFieldsHave(errors) || !xmlBase64String);
                } else {
                    errors.NameIDType = composeValidators(required)(values.NameIDType);
                    errors.SSOUrl = composeValidators(required, length(SSO_URL_LENGTH), isUrl)(values.SSOUrl);
                    errors.IdPEntityId = composeValidators(required, length(IDP_EID_LENGTH))(values.IdPEntityId);
                    errors.RequestMethod = composeValidators(required)(values.RequestMethod);
                    setNextShouldBeDisabled(ifFieldsHave(errors));
                }

                return errors;
            } }>
            <Field.Input
                ariaLabel="Service provider entity id"
                inputType="text"
                name="SPEntityId"
                label="Service provider entity ID"
                required={ true }
                maxLength={ SP_EID_LENGTH.max }
                minLength={ SP_EID_LENGTH.min }
                width={ 15 }
                placeholder="Enter a Service Provider Entity ID"
                data-componentid={ `${ componentId }-form-wizard-saml-entity-id` }
            />
            <Grid container spacing={ { md: 3, xs: 2 } } columns={ { md: 12, sm: 8, xs: 4  } }>
                <Grid xs={ 2 } sm={ 4 } md={ 6 }>
                    <p><b>Mode of configuration</b></p>
                    <Switcher
                        compact
                        data-componentid={ `${ componentId }-form-wizard-saml-config-switcher` }
                        className={ "mt-1" }
                        selectedValue={ selectedSamlConfigMode }
                        onChange={ ({ value }: any) => setSelectedSamlConfigMode(value as any) }
                        options={ [ {
                            label: "Manual Configuration",
                            value: "manual"
                        }, {
                            label: "File Based Configuration",
                            value: "file"
                        } ] }
                    />
                </Grid>
            </Grid>
            <Divider hidden/>
            { (selectedSamlConfigMode === "manual") ? (
                <div>
                    <Field.Input
                        inputType="url"
                        ariaLabel="Identity provider Single Sign-On URL"
                        name="SSOUrl"
                        label="Identity provider Single Sign-On URL"
                        required={ true }
                        maxLength={ SSO_URL_LENGTH.max }
                        minLength={ SSO_URL_LENGTH.min }
                        width={ 15 }
                        placeholder={ "Enter SAML 2.0 redirect SSO url" }
                        data-componentid={ `${ componentId }-form-wizard-saml-sso-url` }
                    />
                    <Field.Input
                        inputType="text"
                        ariaLabel="Identity provider entity ID"
                        name="IdPEntityId"
                        label="Identity provider entity ID"
                        required={ true }
                        maxLength={ IDP_EID_LENGTH.max }
                        minLength={ IDP_EID_LENGTH.min }
                        width={ 15 }
                        placeholder={ "Enter SAML 2.0 entity id (saml issuer)" }
                        data-componentid={ `${ componentId }-form-wizard-saml-idp-entity-id` }
                    />
                </div>
            ) : (
                <FilePicker
                    key={ 1 }
                    hidePasteOption={ true }
                    fileStrategy={ XML_FILE_PROCESSING_STRATEGY }
                    file={ selectedMetadataFile }
                    pastedContent={ pastedMetadataContent }
                    onChange={ (result: any) => {
                        setSelectedMetadataFile(result.file);
                        setPastedMetadataContent(result.pastedContent);
                        setXmlBase64String(result.serialized as string);
                    } }
                    uploadButtonText="Upload Metadata File"
                    dropzoneText="Drag and drop a XML file here."
                    data-componentid={ `${ componentId }-form-wizard-saml-xml-config-file-picker` }
                    icon={ getCertificateIllustrations().uploadPlaceholder }
                    placeholderIcon={ <ArticleOutlinedIcon /> }
                    normalizeStateOnRemoveOperations={ true }
                />
            )
            }
        </WizardPage>
    );

    const oidcConfigurationPage = () => {
        return (
            <WizardPage
                validate={ (values: any) => {
                    const errors: FormErrors = {};

                    errors.clientId = composeValidators(
                        required,
                        length(OIDC_CLIENT_ID_MAX_LENGTH)
                    )(values.clientId);
                    errors.clientSecret = composeValidators(
                        required,
                        length(OIDC_CLIENT_SECRET_MAX_LENGTH)
                    )(values.clientSecret);
                    errors.authorizationEndpointUrl = composeValidators(
                        required,
                        isUrl,
                        checkValueIsLoopBackCall,
                        length(OIDC_URL_MAX_LENGTH)
                    )(values.authorizationEndpointUrl);
                    errors.tokenEndpointUrl = composeValidators(
                        required,
                        isUrl,
                        checkValueIsLoopBackCall,
                        length(OIDC_URL_MAX_LENGTH)
                    )(values.tokenEndpointUrl);
                    setNextShouldBeDisabled(ifFieldsHave(errors));

                    return errors;
                } }>
                <Field.Input
                    ariaLabel="clientId"
                    inputType="client_id"
                    name="clientId"
                    label={ "Client ID" }
                    required={ true }
                    maxLength={ 100 }
                    minLength={ 3 }
                    placeholder={ "Enter client id" }
                    data-componentid={ `${ componentId }-form-wizard-oidc-idp-client-id` }
                    width={ 13 }
                />
                <Field.Input
                    ariaLabel="clientSecret"
                    className="addon-field-wrapper"
                    inputType="password"
                    name="clientSecret"
                    label={ "Client secret" }
                    required={ true }
                    hidePassword={ t("common:hide") }
                    showPassword={ t("common:show") }
                    maxLength={ 100 }
                    minLength={ 3 }
                    type="password"
                    placeholder={ "Enter client secret" }
                    data-componentid={ `${ componentId }-form-wizard-oidc-idp-client-secret` }
                    width={ 13 }
                />
                <Field.Input
                    ariaLabel="authorizationEndpointUrl"
                    inputType="url"
                    name="authorizationEndpointUrl"
                    label={ "Authorization endpoint URL" }
                    required={ true }
                    placeholder={ "Enter authorization endpoint URL" }
                    maxLength={ 100 }
                    minLength={ 3 }
                    data-componentid={ `${ componentId }-form-wizard-oidc-idp-authorization-endpoint-url` }
                    width={ 13 }
                />
                <Field.Input
                    ariaLabel="tokenEndpointUrl"
                    inputType="url"
                    name="tokenEndpointUrl"
                    label={ "Token endpoint URL" }
                    required={ true }
                    placeholder={ "Enter token endpoint URL" }
                    maxLength={ 100 }
                    minLength={ 3 }
                    data-componentid={ `${ componentId }-form-wizard-oidc-idp-token-endpoint-url` }
                    width={ 13 }
                />
            </WizardPage>
        );
    };

    const certificatesPage = () => (
        <WizardPage
            validate={ (values: any) => {
                const errors: FormErrors = {};

                if (selectedProtocol === "oidc" && selectedCertInputType === "jwks") {
                    if (values.jwks_endpoint?.length > 0) {
                        errors.jwks_endpoint = composeValidators(
                            length(JWKS_URL_LENGTH),
                            checkValueIsLoopBackCall,
                            isUrl
                        )(values.jwks_endpoint);
                    }
                    setNextShouldBeDisabled(ifFieldsHave(errors));
                }

                return errors;
            } }>
            <Grid container spacing={ { md: 3, xs: 2 } } columns={ { md: 12, sm: 8, xs: 4 } }>
                <Grid xs={ 2 } sm={ 4 } md={ 6 }>
                    <p><b>Mode of certificate configuration</b></p>
                    { (selectedProtocol === "oidc") && (
                        <Switcher
                            compact
                            disabledMessage="This feature will be enabled soon."
                            className={ "mt-1" }
                            defaultOptionValue={ "jwks" }
                            selectedValue={ selectedCertInputType }
                            onChange={ ({ value }: any) => setSelectedCertInputType(value as any) }
                            options={ [ {
                                label: "JWKS endpoint",
                                value: "jwks"
                            }, {
                                label: "Use PEM certificate",
                                value: "pem"
                            } ] }
                        />
                    ) }
                </Grid>
            </Grid>
            <Divider hidden/>
            { (selectedProtocol === "oidc" && selectedCertInputType === "jwks") && (
                <>
                    <Field.Input
                        ariaLabel="JWKS endpoint URL"
                        inputType="url"
                        name="jwks_endpoint"
                        label="JWKS endpoint URL"
                        required={ false }
                        maxLength={ JWKS_URL_LENGTH.max }
                        minLength={ JWKS_URL_LENGTH.min }
                        width={ 15 }
                        initialValue={ EMPTY_STRING }
                        placeholder="Enter JWKS endpoint URL"
                        data-componentid={ `${ componentId }-form-wizard-oidc-jwks-endpoint-url` }
                    />
                    <Hint>
                        { config.ui.productName } will use this URL to obtain keys to verify the signed
                        responses from your external IdP
                    </Hint>
                </>
            ) }
            { (selectedCertInputType === "pem") && (
                <>
                    <FilePicker
                        key={ 2 }
                        file={ selectedCertificateFile }
                        pastedContent={ pastedPEMContent }
                        fileStrategy={ CERT_FILE_PROCESSING_STRATEGY }
                        normalizeStateOnRemoveOperations={ true }
                        onChange={ (result: any) => {
                            setPastedPEMContent(result.pastedContent);
                            setSelectedCertificateFile(result.file);
                            setPemString(result.serialized?.pem);
                            /**
                             * If there's pasted content or a file, but it hasn't been serialized
                             * and if it's not valid then we must disable the next button. This condition
                             * implies that when the input is optional but the user tries to enter
                             * invalid content to the picker we can't enable next because it's invalid.
                             */
                            setNextShouldBeDisabled(
                                (result.pastedContent?.length > 0 || result.file) &&
                                !result.serialized &&
                                !result.valid
                            );
                        } }
                        uploadButtonText="Upload Certificate File"
                        dropzoneText="Drag and drop a certificate file here."
                        pasteAreaPlaceholderText="Paste IdP certificate in PEM format."
                        icon={ getCertificateIllustrations().uploadPlaceholder }
                        placeholderIcon={ <ArticleOutlinedIcon /> }
                        data-componentid={ `${ componentId }-form-wizard-${ selectedProtocol }-pem-certificate` }
                    />
                    <Hint>
                        { config.ui.productName } will use this certificate to verify the signed
                        responses from your external IdP.
                    </Hint>
                </>
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

        const SECOND_STEP: number = 1;

        if (currentWizardStep !== SECOND_STEP) return null;

        // Return null when `showHelpPanel` is false or `samlHelp`
        // or `oidcHelp` is not defined in `selectedTemplate` object.

        const subTemplate: ConnectionTemplateInterface = cloneDeep(template.subTemplates.find(
            ({ id }: { id: string }) => {
                return id === (selectedProtocol === "saml"
                    ? "enterprise-saml-idp"
                    : "enterprise-oidc-idp"
                );
            }
        ));

        if (!subTemplate?.content?.wizardHelp) return null;

        let { wizardHelp: WizardHelp } = subTemplate?.content;

        if (selectedProtocol === "saml" && selectedSamlConfigMode === "file") {
            WizardHelp = subTemplate.content.fileBasedHelpPanel;
        }

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header
                    data-componentid={ `${ componentId }-modal-side-panel-header` }
                    className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        Help
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        <WizardHelp data-componentid={ `${ componentId }-modal-side-panel-help-content` }/>
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );

    };

    /**
     * Resolves the documentation link when a protocol is selected.
     * @returns Documetation link.
     */
    const resolveDocumentationLink = (): ReactElement => {
        let docLink: string = undefined;

        if (selectedProtocol === AuthProtocolTypes.SAML) {
            docLink = getLink("develop.connections.newConnection.enterprise.samlLearnMore");
        }

        if (selectedProtocol === AuthProtocolTypes.OIDC) {
            docLink = getLink("develop.connections.newConnection.enterprise.oidcLearnMore");
        }

        return (
            <DocumentationLink
                link={ docLink }
            >
                { t("common:learnMore") }
            </DocumentationLink>
        );
    };

    // Start: Modal

    return (
        <ModalWithSidePanel
            isLoading={ isConnectionTemplateFetchRequestLoading }
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ onWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ `${ componentId }-modal` }>
            <ModalWithSidePanel.MainPanel>
                { /*Modal header*/ }
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${ componentId }-modal-header` }>
                    <div className={ "display-flex" }>
                        <GenericIcon
                            icon={ getConnectionIcons().enterprise }
                            size="x30"
                            transparent
                            spaced={ "right" }
                            data-componentid={ `${ componentId }-image` }/>
                        <div>
                            { title }
                            { subTitle && (
                                <Heading as="h6">
                                    { subTitle }
                                    { resolveDocumentationLink() }
                                </Heading>
                            ) }
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
                { /*Modal body content*/ }
                <React.Fragment>
                    <ModalWithSidePanel.Content
                        className="steps-container"
                        data-componentid={ `${ componentId }-modal-content-1` }>
                        <Steps.Group
                            current={ currentWizardStep }>
                            { wizardSteps.map((step: any, index: number) => (
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
                        data-componentid={ `${ componentId }-modal-content-2` }>
                        { alert && alertComponent }
                        <Wizard2
                            ref={ wizardRef }
                            initialValues={ initialValues }
                            onSubmit={ handleFormSubmit }
                            uncontrolledForm={ true }
                            pageChanged={ (index: number) => setCurrentWizardStep(index) }
                            data-componentid={ componentId }
                        >
                            { resolveWizardPages() }
                        </Wizard2>
                    </ModalWithSidePanel.Content>
                </React.Fragment>
                { /*Modal actions*/ }
                <ModalWithSidePanel.Actions
                    data-componentid={ `${ componentId }-modal-actions` }
                >
                    <SemanticGrid>
                        <SemanticGrid.Row column={ 1 }>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    floated="left"
                                    onClick={ onWizardClose }
                                    data-testid="add-connection-modal-cancel-button"
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </SemanticGrid.Column>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { /*Check whether we have more steps*/ }
                                { currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled }
                                        floated="right"
                                        onClick={ () => {
                                            wizardRef.current.gotoNextPage();
                                        } }
                                        data-testid="add-connection-modal-next-button"
                                    >
                                        { t("authenticationProvider:wizards.buttons.next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                { /*Check whether its the last step*/ }
                                { currentWizardStep === wizardSteps.length - 1 && (
                                    // Note that we use the same logic as the next button
                                    // element. This is because we pass a callback to
                                    // onSubmit which triggers a dedicated handler.
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled || isSubmitting }
                                        type="submit"
                                        floated="right"
                                        onClick={ () => {
                                            wizardRef.current.gotoNextPage();
                                        } }
                                        data-testid="add-connection-modal-finish-button"
                                        loading={ isSubmitting }
                                    >
                                        { t("authenticationProvider:wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        type="submit"
                                        floated="right"
                                        onClick={ () => wizardRef.current.gotoPreviousPage() }
                                        data-testid="add-connection-modal-previous-button"
                                    >
                                        <Icon name="arrow left"/>
                                        { t("authenticationProvider:wizards.buttons." +
                                            "previous") }
                                    </LinkButton>
                                ) }
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </SemanticGrid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { resolveHelpPanel() }
        </ModalWithSidePanel>
    );

};

/**
 * Default props for the enterprise identity provider
 * creation wizard.
 */
EnterpriseConnectionCreateWizard.defaultProps = {
    currentStep: 0,
    "data-componentid": "enterprise-idp"
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
const JWKS_URL_LENGTH: MinMax = { max: 2048, min: 0 };

// General constants
const EMPTY_STRING: string = "";
const CERT_FILE_PROCESSING_STRATEGY: CertFileStrategy = new CertFileStrategy();
const XML_FILE_PROCESSING_STRATEGY: XMLFileStrategy = new XMLFileStrategy();

// Validation Functions.
// FIXME: These will be removed in the future when
//        form module validation gets to a stable state.

const composeValidators = ( ...validators: any) => (value: string) => {
    return validators.reduce(
        (error: any, validator: any) => error || validator(value),
        undefined
    );
};

/**
 * Given a {@link FormErrors} object, it will check whether
 * every key has a assigned truthy value. {@link Array.every}
 * will return true if one of the object member has
 * a truthy value. In other words, it will check a field has
 * a error message attached to it or not.
 *
 */
const ifFieldsHave = (errors: FormErrors): boolean => {
    return !Object.keys(errors).every((k: any) => !errors[ k ]);
};

const required = (value: any) => {
    if (!value) {
        return "This is a required field";
    }

    return undefined;
};

const length = (minMax: MinMax) => (value: string) => {
    if (!value && minMax.min > 0) {
        return "You cannot leave this blank";
    }
    if (value?.length > minMax.max) {
        return `Cannot exceed more than ${ minMax.max } characters.`;
    }
    if (value?.length < minMax.min) {
        return `Should have at least ${ minMax.min } characters.`;
    }

    return undefined;
};

const isUrl = (value: string) => {
    return FormValidation.url(value) ? undefined : "This value is invalid.";
};
