/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Backdrop from "@mui/material/Backdrop";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { EventPublisher } from "@wso2is/admin.core.v1";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import {
    Field,
    Wizard2,
    WizardPage
} from "@wso2is/form";
import {
    ContentLoader,
    EmphasizedSegment,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
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
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, Grid as SemanticGrid } from "semantic-ui-react";
import { createConnection, useGetConnectionTemplate } from "../../api/connections";
import { getConnectionWizardStepIcons } from "../../configs/ui";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { LocalAuthenticatorConstants } from "../../constants/local-authenticator-constants";
import {
    AuthenticationType,
    AuthenticationTypeDropdownOption,
    ConnectionInterface,
    CustomAuthenticationCreateWizardGeneralFormValuesInterface,
    EndpointConfigFormPropertyInterface,
    GenericConnectionCreateWizardPropsInterface
} from "../../models/connection";
import "./custom-authentication-create-wizard.scss";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

/**
 * Proptypes for the custom authenticator
 * creation wizard component.
 */
interface CustomAuthenticationCreateWizardProps extends
    GenericConnectionCreateWizardPropsInterface, IdentifiableComponentInterface {
}

/**
 * Constants for wizard steps. As per the requirement we have three
 * wizard steps. Here are the step definitions:-
 *
 * AUTHENTICATION_TYPE - The authentication type of the custom authenticator.
 * GENERAL_SETTINGS - Contains general details common to all the authenticators.
 * CONFIGURATION - Includes the external endpoint configuration details.
 */
enum WizardSteps {
    AUTHENTICATION_TYPE = "Authentication Type", // TODO: update the authentication type step icon
    GENERAL_SETTINGS = "General Settings",
    CONFIGURATION = "Configuration"
}

interface WizardStepInterface {
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardSteps;
}

type AvailableCustomAuthentications = "external" | "internal" | "two-factor";
type FormErrors = { [ key: string ]: string };

export const CustomAuthenticationCreateWizard: FC<CustomAuthenticationCreateWizardProps> = (
    props: PropsWithChildren<CustomAuthenticationCreateWizardProps>
): ReactElement => {

    const {
        onWizardClose,
        onIDPCreate,
        title,
        subTitle,
        [ "data-componentid" ]: componentId
    } = props;

    const wizardRef: MutableRefObject<any> = useRef(null);

    const [ initWizard, setInitWizard ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ selectedAuthenticator, setSelectedAuthenticator ] = useState<AvailableCustomAuthentications>("external");
    const [ selectedTemplateId, setSelectedTemplateId ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isShowSecret1, setIsShowSecret1 ] = useState(false);
    const [ isShowSecret2, setIsShowSecret2 ] = useState(false);
    // const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ authenticationType, setAuthenticationType ] = useState<AuthenticationType>(null);

    // Dynamic UI state
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

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

        const templateId: string = selectedAuthenticator === "external"
            ? "external-user-authentication"
            : selectedAuthenticator === "internal"
                ? "internal-user-authentication"
                : "enterprise-oidc-idp";

        setSelectedTemplateId(templateId);
    }, [ selectedAuthenticator ]);

    const initialValues: { NameIDType: string, RequestMethod: string,
        identifier: string, displayName: string } = useMemo(() => ({
            NameIDType: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            RequestMethod: "post",
            displayName: EMPTY_STRING,
            identifier: EMPTY_STRING
        }), []);

    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.AUTHENTICATION_TYPE,
                title: t("customAuthentication:fields.createWizard.authenticationTypeStep.title")
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardSteps.GENERAL_SETTINGS,
                title: t("customAuthentication:fields.createWizard.generalSettingsStep.title")
            },
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.CONFIGURATION,
                title: t("customAuthentication:fields.createWizard.configurationsStep.title")
            }
        ] as WizardStepInterface[];
    };

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${ componentId }-authentication-property-secret1-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const renderDimmerOverlay = (): ReactNode => {
        return (
            <Backdrop open={ true }>
                { t("common:featureAvailable") }
            </Backdrop>
        );
    };

    // NOTE: This method is still under development.
    // TODO: Update method with correct API configurations and endpoint auth details.
    /**
     * @param values - form values
     * @param form - form instance
     * @param callback - callback to proceed to the next step
     */
    const handleFormSubmit = (values: any) => {

        const { customAuth: customAuthenticator } = cloneDeep(connectionTemplate);

        customAuthenticator.templateId = selectedTemplateId;

        // THIS HAS THE FINAL FIELD VALUES SUBMITTED
        // Populate user entered values
        customAuthenticator.name = values?.identifier?.toString();
        customAuthenticator.displayName = values?.displayName?.toString();
        // TODO: Add endpoint details
        // customAuthenticator.endpoint.uri = values?.uri?.toString();

        setIsSubmitting(true);

        // TODO: Update API integration
        createConnection(customAuthenticator)
            .then((response: AxiosResponse<ConnectionInterface>) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: componentId + "-" + kebabCase(selectedAuthenticator)
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
                const identityAppsError: IdentityAppsError = ConnectionUIConstants.ERROR_CREATE_LIMIT_REACHED;

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
                    error.response?.data.code === "IDP-65002") {
                    setAlert({
                        description: t("authenticationProvider:notifications." +
                            "addIDP.serverError.description"),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "addIDP.serverError.message")
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

    /**
     * This method handles endpoint authentication type dropdown changes.
     * @param event - event associated with the dropdown change.
     * @param data - data changed by the event
     */
    const handleDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setAuthenticationType(data.value as AuthenticationType);
    };

    const renderEndpointAuthPropertyFields = (): ReactElement => {
        switch (authenticationType) {
            case AuthenticationType.NONE:
                break;
            case AuthenticationType.BASIC:
                return (
                    <>
                        <Field.Input
                            ariaLabel="username"
                            className="addon-field-wrapper"
                            name="usernameAuthProperty"
                            label={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.username.label") }
                            placeholder={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.username.placeholder") }
                            inputType="name"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(
                                    isShowSecret1,
                                    () => setIsShowSecret1(!isShowSecret1))
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${ componentId }-authentication-property-username` }
                            width={ 15 }
                        />
                        <Field.Input
                            ariaLabel="password"
                            className="addon-field-wrapper"
                            label={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.password.label") }
                            placeholder={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.password.placeholder") }
                            name="passwordAuthProperty"
                            inputType="password"
                            type={ isShowSecret2 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(
                                    isShowSecret2,
                                    () => setIsShowSecret2(!isShowSecret2))
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${ componentId }-authentication-property-password` }
                            width={ 15 }
                        />
                    </>
                );
            case AuthenticationType.BEARER:
                return (
                    <>
                        <Field.Input
                            ariaLabel="accessToken"
                            className="addon-field-wrapper"
                            name="accessTokenAuthProperty"
                            inputType="text"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(
                                    isShowSecret1,
                                    () => setIsShowSecret1(!isShowSecret1))
                            } }
                            label={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.accessToken.label") }
                            placeholder={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.accessToken.placeholder") }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${ componentId }-authentication-property-accessToken` }
                            width={ 15 }
                        />
                    </>
                );
            case AuthenticationType.API_KEY:
                return (
                    <>
                        <Field.Input
                            ariaLabel="header"
                            className="addon-field-wrapper"
                            name="headerAuthProperty"
                            inputType="text"
                            type={ "text" }
                            label={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.header.label") }
                            placeholder={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.header.placeholder") }
                            helperText={ (
                                <Hint className="hint" compact>
                                    Hint
                                </Hint>
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${ componentId }-authentication-property-header` }
                            width={ 15 }
                        />
                        <Field.Input
                            ariaLabel="value"
                            className="addon-field-wrapper"
                            name="valueAuthProperty"
                            inputType="text"
                            type={ isShowSecret2 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(
                                    isShowSecret2,
                                    () => setIsShowSecret2(!isShowSecret2))
                            } }
                            label={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.value.label") }
                            placeholder={ t("customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.value.placeholder") }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${ componentId }-authentication-property-value` }
                            width={ 15 }
                        />
                    </>
                );
            default:
                break;
        }
    };

    const validateEndpointConfigs = (values: EndpointConfigFormPropertyInterface):
    Partial<EndpointConfigFormPropertyInterface> => { const error: Partial<EndpointConfigFormPropertyInterface> = {};

        if (!values?.endpointUri) {
            error.endpointUri = t("customAuthentication:fields.createWizard.configurationsStep." +
                "endpoint.validations.empty");
        }
        if (URLUtils.isURLValid(values?.endpointUri)) {
            if (!(URLUtils.isHttpsUrl(values?.endpointUri))) {
                error.endpointUri = t("customAuthentication:fields.createWizard.configurationsStep." +
                    "endpoint.validations.invalid");
            }
        } else {
            error.endpointUri = t("customAuthentication:fields.createWizard.configurationsStep." +
                "endpoint.validations.general");
        }

        if (!authenticationType) {
            error.authenticationType = t("customAuthentication:fields.createWizard.configurationsStep." +
                "authenticationTypeDropdown.validations.required");
        }

        const apiKeyHeaderRegex: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]+$/;

        switch (authenticationType) {
            case AuthenticationType.BASIC:
                if (values?.usernameAuthProperty || values?.passwordAuthProperty) {
                    if (!values?.usernameAuthProperty) {
                        error.usernameAuthProperty = t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.username.validations.required");
                    }
                    if (!values?.passwordAuthProperty) {
                        error.passwordAuthProperty = t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.password.validations.required");
                    }
                }

                break;
            case AuthenticationType.BEARER:
                if (!values?.accessTokenAuthProperty) {
                    error.accessTokenAuthProperty = t("customAuthentication:fields.createWizard.configurationsStep." +
                        "authenticationTypeDropdown.authProperties.accessToken.validations.required");
                }

                break;
            case AuthenticationType.API_KEY:
                if (values?.headerAuthProperty || values?.valueAuthProperty) {
                    if (!values?.headerAuthProperty) {
                        error.headerAuthProperty = t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.header.validations.required");
                    }
                    if (!apiKeyHeaderRegex.test(values?.headerAuthProperty)) {
                        error.headerAuthProperty = t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.header.validations.invalid");
                    }
                    if (!values?.valueAuthProperty) {
                        error.valueAuthProperty = t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.value.validations.required");
                    }
                }

                break;
            default:
                break;
        }

        return error;
    };

    // Wizard Step 1
    const wizardCommonFirstPage = () => (
        <WizardPage
            validate={ () => {
                if (selectedAuthenticator !== null || selectedAuthenticator !== undefined) {
                    setNextShouldBeDisabled(false);
                }
            } }
        >
            <div className="sub-template-selection">
                <label>{ t("customAuthentication:fields.createWizard.authenticationTypeStep.label") }</label>
                <div className="sub-template-selection-container">
                    <SelectionCard
                        className="sub-template-selection-card"
                        centered={ true }
                        image={
                            ConnectionsManagementUtils.resolveConnectionResourcePath("",
                                "assets/images/icons/external-authentication-icon.svg")
                        }
                        header={ (<div>
                            { t("customAuthentication:fields.createWizard.authenticationTypeStep." +
                                        "externalAuthenticationCard.header") }
                        </div>) }
                        description={
                            (<div>
                                <p className="main-description">{ t("customAuthentication:fields.createWizard." +
                                    "authenticationTypeStep.externalAuthenticationCard.mainDescription") }</p>
                                <p className="examples">{ t("customAuthentication:fields.createWizard." +
                                    "authenticationTypeStep.externalAuthenticationCard.examples") }</p>
                            </div>)
                        }
                        contentTopBorder={ false }
                        selected={ selectedAuthenticator === "external" }
                        onClick={ () => setSelectedAuthenticator("external") }
                        imageSize="x60"
                        imageOptions={ {
                            relaxed: "very",
                            square: false,
                            width: "auto"
                        } }
                        showTooltips={ true }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        data-componentid={ `${ componentId }-form-wizard-external-custom-authentication-
                        selection-card` }
                    />
                    <SelectionCard
                        className="sub-template-selection-card"
                        centered={ true }
                        image={
                            ConnectionsManagementUtils.resolveConnectionResourcePath("",
                                "assets/images/icons/internal-user-authentication-icon.svg")
                        }
                        header={ (<div>
                            { t("customAuthentication:fields.createWizard.authenticationTypeStep." +
                                        "internalUserAuthenticationCard.header") }
                        </div>) }
                        description={
                            (<div>
                                <p className="main-description">{ t("customAuthentication:fields.createWizard." +
                                    "authenticationTypeStep.internalUserAuthenticationCard.mainDescription") }</p>
                                <p className="examples">{ t("customAuthentication:fields.createWizard." +
                                    "authenticationTypeStep.internalUserAuthenticationCard.examples") }</p>
                            </div>)
                        }
                        selected={ selectedAuthenticator === "internal" }
                        onClick={ () => setSelectedAuthenticator("internal") }
                        imageSize="x60"
                        showTooltips={ true }
                        contentTopBorder={ false }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        data-componentid={ `${ componentId }-form-wizard-internal-custom-authentication-
                        selection-card` }
                    />
                    <SelectionCard
                        className="sub-template-selection-card"
                        centered={ true }
                        image={
                            ConnectionsManagementUtils.resolveConnectionResourcePath("",
                                "assets/images/icons/two-factor-custom-authentication-icon.svg")
                        }
                        header={ (<div>
                            { t("customAuthentication:fields.createWizard.authenticationTypeStep." +
                                        "twoFactorAuthenticationCard.header") }
                        </div>) }
                        description={
                            (<div>
                                <p className="main-description">{ t("customAuthentication:fields.createWizard." +
                                    "authenticationTypeStep.twoFactorAuthenticationCard.mainDescription") }</p>
                                <p className="examples">{ t("customAuthentication:fields.createWizard." +
                                    "authenticationTypeStep.twoFactorAuthenticationCard.examples") }</p>
                            </div>)
                        }
                        selected={ selectedAuthenticator === "two-factor" }
                        onClick={ () => setSelectedAuthenticator("two-factor") }
                        imageSize="x60"
                        showTooltips={ true }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        contentTopBorder={ false }
                        data-componentid={ `${ componentId }-form-wizard-two-factor-custom-authentication-
                        selection-card` }
                    />
                </div>
            </div>
        </WizardPage>
    );

    // Wizard Step 2
    const generalSettingsPage = () => (
        <WizardPage
            validate={ (values: CustomAuthenticationCreateWizardGeneralFormValuesInterface) => {
                const errors: FormErrors = {};

                if (!FormValidation.identifier(values.identifier)) {
                    errors.identifier = t("customAuthentication:fields.createWizard.generalSettingsStep." +
                        "identifier.validations.invalid");
                }
                if (!FormValidation.isValidResourceName(values.displayName)) {
                    errors.displayName = t("customAuthentication:fields.createWizard.generalSettingsStep." +
                        "displayName.validations.invalid");                }

                setNextShouldBeDisabled(ifFieldsHave(errors));

                return errors;
            } }
        >
            <Field.Input
                ariaLabel="identifier"
                className="addon-field-wrapper"
                inputType="identifier"
                name="identifier"
                label={ t("customAuthentication:fields.createWizard.generalSettingsStep.identifier.label") }
                placeholder={ t("customAuthentication:fields.createWizard.generalSettingsStep.identifier.placeholder") }
                initialValue={ initialValues.identifier }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${ componentId }-form-wizard-identifier` }
                width={ 15 }
            />
            <Field.Input
                ariaLabel="displayName"
                className="addon-field-wrapper"
                inputType="resource_name"
                name="displayName"
                label={ t("customAuthentication:fields.createWizard.generalSettingsStep.displayName.label") }
                placeholder={ t("customAuthentication:fields.createWizard.generalSettingsStep.displayName." +
                    "placeholder") }
                initialValue={ initialValues.displayName }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${ componentId }-form-wizard-display-name` }
                width={ 15 }
            />
        </WizardPage>
    );

    // Wizard Step 3
    // How to remove the border of the emphasized segment?
    const configurationsPage = () => (
        <WizardPage
            validate={ validateEndpointConfigs }
        >
            <EmphasizedSegment
                className="wizard-wrapper"
                bordered={ false }
                emphasized={ true }
                padded={ "very" }
                data-componentid={ `${ componentId }-section` }
            >
                <Field.Input
                    ariaLabel="endpointUri"
                    className="addon-field-wrapper"
                    inputType="url"
                    name="endpointUri"
                    label={ t("customAuthentication:fields.createWizard.configurationsStep.endpoint.label") }
                    placeholder={ t("customAuthentication:fields.createWizard.configurationsStep.endpoint." +
                        "placeholder") }
                    hint={ t("customAuthentication:fields.createWizard.configurationsStep.endpoint.hint") }
                    required={ true }
                    maxLength={ 100 }
                    minLength={ 0 }
                    data-componentid={ `${ componentId }-endpointUri` }
                    width={ 15 }
                />
                <Divider className="divider-container"/>
                <Heading className="heading-container" as="h5">
                    { "Authentication" }
                </Heading>
                <Box className="box-container">
                    <Field.Dropdown
                        ariaLabel="authenticationType"
                        name="authenticationType"
                        label={ t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.label") }
                        placeholder = { t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.placeholder") }
                        hint={ t("customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.hint") }
                        required={ true }
                        value={ authenticationType }
                        options={
                            [ ...LocalAuthenticatorConstants.AUTH_TYPES.map(
                                (option: AuthenticationTypeDropdownOption) => ({
                                    text: t(option.text),
                                    value: option.value.toString() }))
                            ]
                        }
                        onChange={ handleDropdownChange }
                        enableReinitialize={ true }
                        data-componentid={ `${ componentId }-endpoint_authentication-dropdown` }
                        width={ 15 }
                    />
                    <div className="box-field">
                        { renderEndpointAuthPropertyFields() }
                    </div>
                </Box>
            </EmphasizedSegment>
        </WizardPage>
    );


    const resolveWizardPages = (): Array<ReactElement> => {
        return [
            wizardCommonFirstPage(),
            generalSettingsPage(),
            configurationsPage()
        ];
    };

    /**
     * Wizard help panel content is defined here since there is not metadata.json associated with custom authenticators.
     * Currently the help panel content is extracted only from the metadata.json file and a separate effort
     * needs to be in place to improve this.
     *
     * @returns help panel.
     */
    const WizardHelpPanel = (): ReactElement => {
        return (
            <div >
                <Heading as="h5"> { t("customAuthentication:fields.createWizard.helpPanel." +
                    "hint.header") } </Heading>
                <p>
                    { t("customAuthentication:fields.createWizard.helpPanel.hint.description") }
                    <strong>
                        { t("customAuthentication:fields.createWizard.helpPanel.hint.warning") }
                    </strong>
                </p>
            </div>
        );
    };

    const resolveWizardHelpPanel = () => {

        const SECOND_STEP: number = 1;

        if (currentWizardStep !== SECOND_STEP) return null;

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header
                    data-componentid={ `${ componentId }-modal-side-panel-header` }
                    className="wizard-header help-panel-header muted">
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        <WizardHelpPanel/>
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );

    };

    // Final modal
    // TODO: Update documentation links.
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
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${ componentId }-modal-header` }>
                    <div className={ "display-flex" }>
                        <GenericIcon
                            icon={
                                ConnectionsManagementUtils.resolveConnectionResourcePath("",
                                    "assets/images/logos/custom-authentication.svg")
                            }
                            size="x30"
                            transparent
                            spaced={ "right" }
                            data-componentid={ `${ componentId }-image` }/>
                        <div>
                            { title }
                            { subTitle && (
                                <Heading as="h6">
                                    { subTitle }
                                    {/* { resolveDocumentationLink() } */}
                                </Heading>
                            ) }
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
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
            { (resolveWizardHelpPanel()) }
        </ModalWithSidePanel>
    );

};

/**
 * Default props for the custom authenticator create wizard.
 */
CustomAuthenticationCreateWizard.defaultProps = {
    currentStep: 0,
    "data-componentid": "custom-authentication"
};


// General constants
const EMPTY_STRING: string = "";


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
