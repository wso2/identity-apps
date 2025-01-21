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

import Backdrop from "@mui/material/Backdrop";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import {
    ContentLoader,
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
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { DropdownProps, Icon, Message, Grid as SemanticGrid } from "semantic-ui-react";
import { useGetConnectionTemplate } from "../../api/connections";
import { getConnectionWizardStepIcons } from "../../configs/ui";
import { CommonAuthenticatorConstants } from "../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { LocalAuthenticatorConstants } from "../../constants/local-authenticator-constants";
import {
    AuthenticationType,
    AuthenticationTypeDropdownOption,
    AvailableCustomAuthentications,
    ConnectionTemplateInterface,
    CustomAuthenticationCreateWizardGeneralFormValuesInterface,
    EndpointConfigFormPropertyInterface,
    FormErrors,
    WizardStepInterface,
    WizardStepsCustomAuth
} from "../../models/connection";
import "./custom-authentication-create-wizard.scss";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

export interface CustomAuthenticationCreateWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connection template interface.
     */
    template: ConnectionTemplateInterface;
    /**
     * Title of the wizard.
     */
    title: string;
    /**
     * Sub title of the wizard.
     */
    subTitle: string;
    /**
     * Callback triggered when closing the wizard.
     */
    onWizardClose: () => void;
}

/**
 * Custom authenticator create wizard component.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
const CustomAuthenticationCreateWizard: FunctionComponent<CustomAuthenticationCreateWizardPropsInterface> = ({
    template,
    title,
    subTitle,
    onWizardClose,
    "data-componentid": _componentId = "application-creation-adapter"
}: CustomAuthenticationCreateWizardPropsInterface): ReactElement => {
    const wizardRef: MutableRefObject<any> = useRef(null);

    const { CUSTOM_AUTHENTICATION_CONSTANTS: CustomAuthConstants } = ConnectionUIConstants;

    const [ initWizard, setInitWizard ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ selectedAuthenticator, setSelectedAuthenticator ] = useState<AvailableCustomAuthentications>(
        CustomAuthConstants.EXTERNAL_AUTHENTICATOR
    );
    const [ selectedTemplateId, setSelectedTemplateId ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isShowSecret1, setIsShowSecret1 ] = useState(false);
    const [ isShowSecret2, setIsShowSecret2 ] = useState(false);
    const [ authenticationType, setAuthenticationType ] = useState<AuthenticationType>(null);
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const { t } = useTranslation();

    const { data: connectionTemplate, isLoading: isConnectionTemplateFetchRequestLoading } = useGetConnectionTemplate(
        selectedTemplateId,
        selectedTemplateId !== null
    );

    const initialValues: {
        NameIDType: string;
        RequestMethod: string;
        identifier: string;
        displayName: string;
    } = useMemo(
        () => ({
            NameIDType: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            RequestMethod: "post",
            displayName: CustomAuthConstants.EMPTY_STRING,
            identifier: CustomAuthConstants.EMPTY_STRING
        }),[]);

    useEffect(() => {
        if (!initWizard) {
            setWizardSteps(getWizardSteps());
            setInitWizard(true);
        }
    }, [ initWizard ]);

    useEffect(() => {
        const templateId: string =
            selectedAuthenticator === CustomAuthConstants.EXTERNAL_AUTHENTICATOR
                ? "external-custom-authentication"
                : selectedAuthenticator === CustomAuthConstants.INTERNAL_AUTHENTICATOR
                    ? "internal-user-custom-authentication"
                    : "two-factor-custom-authentication";

        setSelectedTemplateId(templateId);
    }, [ selectedAuthenticator ]);

    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getConnectionWizardStepIcons().selectAuthentication,
                name: WizardStepsCustomAuth.AUTHENTICATION_TYPE,
                title: t("customAuthentication:fields.createWizard.authenticationTypeStep.title")
            },
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardStepsCustomAuth.GENERAL_SETTINGS,
                title: t("customAuthentication:fields.createWizard.generalSettingsStep.title")
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardStepsCustomAuth.CONFIGURATION,
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
                data-componentid={ `${_componentId}-authentication-property-secret1-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const renderDimmerOverlay = (): ReactNode => {
        return <Backdrop open={ true }>{ t("common:featureAvailable") }</Backdrop>;
    };

    /**
     * This method checks whether an error message is attached to a specific field.
     * @param errors - Errors object
     * @returns `true` if the field has an error, `false` otherwise.
     */
    const ifFieldsHave = (errors: FormErrors): boolean => {
        return !Object.keys(errors).every((k: any) => !errors[k]);
    };

    /**
     * This method handles endpoint authentication type dropdown changes.
     * @param event - event associated with the dropdown change.
     * @param data - data changed by the event
     */
    const handleDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setAuthenticationType(data.value as AuthenticationType);
    };

    /**
     * This method renders property fields of each endpoint authentication type.
     * @returns property fields of the selected authentication type.
     */
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
                            label={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.username.label"
                            ) }
                            placeholder={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.username.placeholder"
                            ) }
                            inputType="password"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(isShowSecret1, () =>
                                    setIsShowSecret1(!isShowSecret1)
                                )
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-authentication-property-username` }
                            width={ 15 }
                        />
                        <Field.Input
                            ariaLabel="password"
                            className="addon-field-wrapper"
                            label={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.password.label"
                            ) }
                            placeholder={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.password.placeholder"
                            ) }
                            name="passwordAuthProperty"
                            inputType="password"
                            type={ isShowSecret2 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(isShowSecret2, () =>
                                    setIsShowSecret2(!isShowSecret2)
                                )
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-authentication-property-password` }
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
                            inputType="password"
                            type={ isShowSecret1 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(isShowSecret1, () =>
                                    setIsShowSecret1(!isShowSecret1)
                                )
                            } }
                            label={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.accessToken.label"
                            ) }
                            placeholder={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.accessToken.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-authentication-property-accessToken` }
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
                            label={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.header.label"
                            ) }
                            placeholder={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.header.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-authentication-property-header` }
                            width={ 15 }
                        />
                        <Field.Input
                            ariaLabel="value"
                            className="addon-field-wrapper"
                            name="valueAuthProperty"
                            inputType="password"
                            type={ isShowSecret2 ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(isShowSecret2, () =>
                                    setIsShowSecret2(!isShowSecret2)
                                )
                            } }
                            label={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.value.label"
                            ) }
                            placeholder={ t(
                                "customAuthentication:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.value.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-authentication-property-value` }
                            width={ 15 }
                        />
                    </>
                );
            default:
                break;
        }
    };

    /**
     * This method validates the endpoint configurations.
     * @param values - values to be validated.
     * @returns errors object.
     */
    const validateEndpointConfigs = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> => {
        const errors: Partial<EndpointConfigFormPropertyInterface> = {};

        if (!values?.endpointUri) {
            errors.endpointUri = t(
                "customAuthentication:fields.createWizard.configurationsStep." + "endpoint.validations.empty"
            );
        }
        if (URLUtils.isURLValid(values?.endpointUri)) {
            if (!URLUtils.isHttpsUrl(values?.endpointUri)) {
                errors.endpointUri = t(
                    "customAuthentication:fields.createWizard.configurationsStep." + "endpoint.validations.invalid"
                );
            }
        } else {
            errors.endpointUri = t(
                "customAuthentication:fields.createWizard.configurationsStep." + "endpoint.validations.general"
            );
        }

        if (!authenticationType) {
            errors.authenticationType = t(
                "customAuthentication:fields.createWizard.configurationsStep." +
                    "authenticationTypeDropdown.validations.required"
            );
        }

        switch (authenticationType) {
            case AuthenticationType.BASIC:
                if (values?.usernameAuthProperty || values?.passwordAuthProperty) {
                    if (!values?.usernameAuthProperty) {
                        errors.usernameAuthProperty = t(
                            "customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.username.validations.required"
                        );
                    }
                    if (!values?.passwordAuthProperty) {
                        errors.passwordAuthProperty = t(
                            "customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.password.validations.required"
                        );
                    }
                }

                break;
            case AuthenticationType.BEARER:
                if (!values?.accessTokenAuthProperty) {
                    errors.accessTokenAuthProperty = t(
                        "customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.accessToken.validations.required"
                    );
                }

                break;
            case AuthenticationType.API_KEY:
                if (values?.headerAuthProperty || values?.valueAuthProperty) {
                    if (!values?.headerAuthProperty) {
                        errors.headerAuthProperty = t(
                            "customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.header.validations.required"
                        );
                    }
                    if (!CommonAuthenticatorConstants.API_KEY_HEADER_REGEX.test(values?.headerAuthProperty)) {
                        errors.headerAuthProperty = t(
                            "customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.header.validations.invalid"
                        );
                    }
                    if (!values?.valueAuthProperty) {
                        errors.valueAuthProperty = t(
                            "customAuthentication:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.value.validations.required"
                        );
                    }
                }

                break;
            default:
                break;
        }

        return errors;
    };

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
                        image={ ConnectionsManagementUtils.resolveConnectionResourcePath(
                            "",
                            "assets/images/icons/external-authentication-icon.svg"
                        ) }
                        header={
                            (<div>
                                { t(
                                    "customAuthentication:fields.createWizard.authenticationTypeStep." +
                                        "externalAuthenticationCard.header"
                                ) }
                            </div>)
                        }
                        description={
                            (<div>
                                <p className="main-description">
                                    { t(
                                        "customAuthentication:fields.createWizard." +
                                            "authenticationTypeStep.externalAuthenticationCard.mainDescription"
                                    ) }
                                </p>
                                <p className="examples">
                                    { t(
                                        "customAuthentication:fields.createWizard." +
                                            "authenticationTypeStep.externalAuthenticationCard.examples"
                                    ) }
                                </p>
                            </div>)
                        }
                        contentTopBorder={ false }
                        selected={ selectedAuthenticator === CustomAuthConstants.EXTERNAL_AUTHENTICATOR }
                        onClick={ () => setSelectedAuthenticator(CustomAuthConstants.EXTERNAL_AUTHENTICATOR) }
                        imageSize="x60"
                        imageOptions={ {
                            relaxed: "very",
                            square: false,
                            width: "auto"
                        } }
                        showTooltips={ true }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        data-componentid={ `${_componentId}-form-wizard-external-custom-authentication-
                        selection-card` }
                    />
                    <SelectionCard
                        className="sub-template-selection-card"
                        centered={ true }
                        image={ ConnectionsManagementUtils.resolveConnectionResourcePath(
                            "",
                            "assets/images/icons/internal-user-authentication-icon.svg"
                        ) }
                        header={
                            (<div>
                                { t(
                                    "customAuthentication:fields.createWizard.authenticationTypeStep." +
                                        "internalUserAuthenticationCard.header"
                                ) }
                            </div>)
                        }
                        description={
                            (<div>
                                <p className="main-description">
                                    { t(
                                        "customAuthentication:fields.createWizard." +
                                            "authenticationTypeStep.internalUserAuthenticationCard.mainDescription"
                                    ) }
                                </p>
                                <p className="examples">
                                    { t(
                                        "customAuthentication:fields.createWizard." +
                                            "authenticationTypeStep.internalUserAuthenticationCard.examples"
                                    ) }
                                </p>
                            </div>)
                        }
                        selected={ selectedAuthenticator === CustomAuthConstants.INTERNAL_AUTHENTICATOR }
                        onClick={ () => setSelectedAuthenticator(CustomAuthConstants.INTERNAL_AUTHENTICATOR) }
                        imageSize="x60"
                        showTooltips={ true }
                        contentTopBorder={ false }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        data-componentid={ `${_componentId}-form-wizard-internal-custom-authentication-
                        selection-card` }
                    />
                    <SelectionCard
                        className="sub-template-selection-card"
                        centered={ true }
                        image={ ConnectionsManagementUtils.resolveConnectionResourcePath(
                            "",
                            "assets/images/icons/two-factor-custom-authentication-icon.svg"
                        ) }
                        header={
                            (<div>
                                { t(
                                    "customAuthentication:fields.createWizard.authenticationTypeStep." +
                                        "twoFactorAuthenticationCard.header"
                                ) }
                            </div>)
                        }
                        description={
                            (<div>
                                <p className="main-description">
                                    { t(
                                        "customAuthentication:fields.createWizard." +
                                            "authenticationTypeStep.twoFactorAuthenticationCard.mainDescription"
                                    ) }
                                </p>
                                <p className="examples">
                                    { t(
                                        "customAuthentication:fields.createWizard." +
                                            "authenticationTypeStep.twoFactorAuthenticationCard.examples"
                                    ) }
                                </p>
                            </div>)
                        }
                        selected={ selectedAuthenticator === CustomAuthConstants.TWO_FACTOR_AUTHENTICATOR }
                        onClick={ () => setSelectedAuthenticator(CustomAuthConstants.TWO_FACTOR_AUTHENTICATOR) }
                        imageSize="x60"
                        showTooltips={ true }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        contentTopBorder={ false }
                        data-componentid={ `${_componentId}-form-wizard-two-factor-custom-authentication-
                        selection-card` }
                    />
                </div>
            </div>
        </WizardPage>
    );

    const generalSettingsPage = () => (
        <WizardPage
            validate={ (values: CustomAuthenticationCreateWizardGeneralFormValuesInterface) => {
                const errors: FormErrors = {};

                if (!FormValidation.identifier(values.identifier)) {
                    errors.identifier = t(
                        "customAuthentication:fields.createWizard.generalSettingsStep." +
                            "identifier.validations.invalid"
                    );
                }
                if (!FormValidation.isValidResourceName(values.displayName)) {
                    errors.displayName = t(
                        "customAuthentication:fields.createWizard.generalSettingsStep." +
                            "displayName.validations.invalid"
                    );
                }

                setNextShouldBeDisabled(ifFieldsHave(errors));

                return errors;
            } }
        >
            <Field.Input
                ariaLabel="identifier"
                inputType="identifier"
                name="identifier"
                label={ t("customAuthentication:fields.createWizard.generalSettingsStep.identifier.label") }
                placeholder={ t("customAuthentication:fields.createWizard.generalSettingsStep.identifier.placeholder") }
                initialValue={ initialValues.identifier }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${_componentId}-form-wizard-identifier` }
                width={ 15 }
            />
            <Hint>{ t("customAuthentication:fields.createWizard.generalSettingsStep.helpPanel.identifier.hint") }</Hint>
            <Field.Input
                ariaLabel="displayName"
                inputType="resource_name"
                name="displayName"
                label={ t("customAuthentication:fields.createWizard.generalSettingsStep.displayName.label") }
                placeholder={ t(
                    "customAuthentication:fields.createWizard.generalSettingsStep.displayName." + "placeholder"
                ) }
                initialValue={ initialValues.displayName }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${_componentId}-form-wizard-display-name` }
                width={ 15 }
            />
            <Hint>
                { t("customAuthentication:fields.createWizard.generalSettingsStep.helpPanel." + "displayName.hint") }
            </Hint>
        </WizardPage>
    );

    const configurationsPage = () => (
        <WizardPage validate={ validateEndpointConfigs }>
            <Field.Input
                ariaLabel="endpointUri"
                className="addon-field-wrapper"
                inputType="url"
                name="endpointUri"
                label={ t("customAuthentication:fields.createWizard.configurationsStep.endpoint.label") }
                placeholder={ t("customAuthentication:fields.createWizard.configurationsStep.endpoint.placeholder") }
                hint={ t("customAuthentication:fields.createWizard.configurationsStep.endpoint.hint") }
                required={ true }
                maxLength={ 100 }
                minLength={ 0 }
                data-componentid={ `${_componentId}-endpointUri` }
                width={ 15 }
            />
            <Divider className="divider-container" />
            <Heading className="heading-container" as="h5">
                { t("customAuthentication:fields.createWizard.configurationsStep.authenticationTypeDropdown.title") }
            </Heading>
            <Box className="box-container">
                <Field.Dropdown
                    ariaLabel="authenticationType"
                    name="authenticationType"
                    label={ t(
                        "customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.label"
                    ) }
                    placeholder={ t(
                        "customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.placeholder"
                    ) }
                    hint={ t(
                        "customAuthentication:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.hint"
                    ) }
                    required={ true }
                    value={ authenticationType }
                    options={ [
                        ...LocalAuthenticatorConstants.AUTH_TYPES.map((option: AuthenticationTypeDropdownOption) => ({
                            text: t(option.text),
                            value: option.value.toString()
                        }))
                    ] }
                    onChange={ handleDropdownChange }
                    enableReinitialize={ true }
                    data-componentid={ `${_componentId}-endpoint_authentication-dropdown` }
                    width={ 15 }
                />
                <div className="box-field">{ renderEndpointAuthPropertyFields() }</div>
            </Box>
        </WizardPage>
    );

    const resolveWizardPages = (): Array<ReactElement> => {
        return [ wizardCommonFirstPage(), generalSettingsPage(), configurationsPage() ];
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
            <div>
                <Heading as="h5">
                    { t("customAuthentication:fields.createWizard.generalSettingsStep.helpPanel.identifier.header") }
                </Heading>
                <p>
                    { t(
                        "customAuthentication:fields.createWizard.generalSettingsStep.helpPanel." +
                            "identifier.description"
                    ) }
                </p>
                <Message className="display-flex" size="small" warning header="Hello there">
                    <Icon name="warning sign" color="orange" corner />
                    <Message.Content className="tiny">
                        { t(
                            "customAuthentication:fields.createWizard.generalSettingsStep.helpPanel." +
                                "identifier.warning"
                        ) }
                    </Message.Content>
                </Message>
                <Divider />
                <Heading as="h5">
                    { t("customAuthentication:fields.createWizard.generalSettingsStep.helpPanel.displayName.header") }
                </Heading>
                <p>
                    { t(
                        "customAuthentication:fields.createWizard.generalSettingsStep.helpPanel.displayName.description"
                    ) }
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
                    data-componentid={ `${_componentId}-modal-side-panel-header` }
                    className="wizard-header help-panel-header muted"
                ></ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader /> }>
                        <WizardHelpPanel />
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    return (
        <ModalWithSidePanel
            isLoading={ isConnectionTemplateFetchRequestLoading }
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ onWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ `${_componentId}-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header" data-componentid={ `${_componentId}-modal-header` }>
                    <div className={ "display-flex" }>
                        <GenericIcon
                            icon={ ConnectionsManagementUtils.resolveConnectionResourcePath(
                                "",
                                "assets/images/logos/custom-authentication.svg"
                            ) }
                            size="x30"
                            transparent
                            spaced={ "right" }
                            data-componentid={ `${_componentId}-image` }
                        />
                        <div>
                            { title }
                            { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
                <React.Fragment>
                    <ModalWithSidePanel.Content
                        className="steps-container"
                        data-componentid={ `${_componentId}-modal-content-1` }
                    >
                        <Steps.Group current={ currentWizardStep }>
                            { wizardSteps.map((step: any, index: number) => (
                                <Steps.Step active key={ index } icon={ step.icon } title={ step.title } />
                            )) }
                        </Steps.Group>
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-componentid={ `${_componentId}-modal-content-2` }
                    >
                        { alert && alertComponent }
                        <Wizard2
                            ref={ wizardRef }
                            initialValues={ initialValues }
                            // onSubmit={ handleFormSubmit }
                            uncontrolledForm={ true }
                            pageChanged={ (index: number) => setCurrentWizardStep(index) }
                            data-componentid={ _componentId }
                        >
                            { resolveWizardPages() }
                        </Wizard2>
                    </ModalWithSidePanel.Content>
                </React.Fragment>
                <ModalWithSidePanel.Actions data-componentid={ `${_componentId}-modal-actions` }>
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
                                        <Icon name="arrow right" />
                                    </PrimaryButton>
                                ) }
                                { /*Check whether its the last step*/ }
                                { currentWizardStep === wizardSteps.length - 1 && (
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
                                        <Icon name="arrow left" />
                                        { t("authenticationProvider:wizards.buttons." + "previous") }
                                    </LinkButton>
                                ) }
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </SemanticGrid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { resolveWizardHelpPanel() }
        </ModalWithSidePanel>
    );
};

export default CustomAuthenticationCreateWizard;
