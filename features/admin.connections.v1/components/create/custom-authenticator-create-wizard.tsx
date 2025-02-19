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
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { EndpointConfigFormPropertyInterface } from "@wso2is/admin.actions.v1/models/actions";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Wizard2, WizardPage } from "@wso2is/form";
import { FormSpy } from "@wso2is/form/src";
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
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
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
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, Message, Grid as SemanticGrid } from "semantic-ui-react";
import { createConnection, createCustomAuthenticator, useGetConnectionTemplate } from "../../api/connections";
import { getConnectionWizardStepIcons } from "../../configs/ui";
import { CommonAuthenticatorConstants } from "../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { AuthenticatorMeta } from "../../meta/authenticator-meta";
import {
    AuthenticationTypeDropdownOption,
    AvailableCustomAuthenticators,
    ConnectionInterface,
    ConnectionTemplateInterface,
    CustomAuthConnectionInterface,
    CustomAuthenticatorCreateWizardGeneralFormValuesInterface,
    EndpointAuthenticationType,
    FormErrors,
    GenericConnectionCreateWizardPropsInterface,
    WizardStepInterface,
    WizardStepsCustomAuth
} from "../../models/connection";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";
import "./custom-authenticator-create-wizard.scss";

export interface CustomAuthenticatorCreateWizardPropsInterface
    extends GenericConnectionCreateWizardPropsInterface,
        IdentifiableComponentInterface {
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
const CustomAuthenticatorCreateWizard: FunctionComponent<CustomAuthenticatorCreateWizardPropsInterface> = ({
    title,
    subTitle,
    onIDPCreate,
    onWizardClose,
    "data-componentid": _componentId = "custom-authenticator"
}: CustomAuthenticatorCreateWizardPropsInterface): ReactElement => {
    const wizardRef: MutableRefObject<any> = useRef(null);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const { CUSTOM_AUTHENTICATOR_CONSTANTS: CustomAuthConstants } = ConnectionUIConstants;
    const { CONNECTION_TEMPLATE_IDS: ConnectionTemplateIds } = CommonAuthenticatorConstants;

    const [ initWizard, setInitWizard ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ selectedAuthenticator, setSelectedAuthenticator ] = useState<AvailableCustomAuthenticators>(
        CustomAuthConstants.EXTERNAL_AUTHENTICATOR
    );
    const [ selectedTemplateId, setSelectedTemplateId ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showPrimarySecret, setShowPrimarySecret ] = useState<boolean>(false);
    const [ showSecondarySecret, setShowSecondarySecret ] = useState<boolean>(false);
    const [ endpointAuthType, setEndpointAuthType ] = useState<EndpointAuthenticationType>(null);
    const [ isHttpEndpointUri, setIsHttpEndpointUri ] = useState<boolean>(false);
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

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
                ? ConnectionTemplateIds.EXTERNAL_CUSTOM_AUTHENTICATOR
                : selectedAuthenticator === CustomAuthConstants.INTERNAL_AUTHENTICATOR
                    ? ConnectionTemplateIds.INTERNAL_CUSTOM_AUTHENTICATOR
                    : ConnectionTemplateIds.TWO_FACTOR_CUSTOM_AUTHENTICATOR;

        setSelectedTemplateId(templateId);
    }, [ selectedAuthenticator ]);

    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getConnectionWizardStepIcons().selectAuthentication,
                name: WizardStepsCustomAuth.AUTHENTICATION_TYPE,
                title: t("customAuthenticator:fields.createWizard.authenticationTypeStep.title")
            },
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardStepsCustomAuth.GENERAL_SETTINGS,
                title: t("customAuthenticator:fields.createWizard.generalSettingsStep.title")
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardStepsCustomAuth.CONFIGURATION,
                title: t("customAuthenticator:fields.createWizard.configurationsStep.title")
            }
        ] as WizardStepInterface[];
    };

    /**
     * On successful local authenticator creation, navigates to the authenticator views.
     *
     * @param id - ID of the created local authenticator.
     */
    const handleSuccessfulAuthenticatorCreate = (id?: string): void => {
        if (id) {
            history.push({
                pathname: AppConstants.getPaths()
                    .get("AUTH_EDIT")
                    .replace(":id", id),
                search: ConnectionUIConstants.NEW_IDP_URL_SEARCH_PARAM
            });

            return;
        }

        history.push(AppConstants.getPaths().get("IDP"));
    };

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${_componentId}-endpoint-authentication-property-secret-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const renderDimmerOverlay = (): ReactNode => {
        return <Backdrop open={ true }>{ t("common:featureAvailable") }</Backdrop>;
    };

    /**
     * This method checks whether an error message is attached to a specific field.
     *
     * @param errors - Errors object
     * @returns `true` if the field has an error, `false` otherwise.
     */
    const hasValidationErrors = (errors: FormErrors): boolean => {
        return !Object.keys(errors).every((k: string) => !errors[k]);
    };

    /**
     * This method handles endpoint authentication type dropdown changes.
     *
     * @param event - event associated with the dropdown change.
     * @param data - data changed by the event
     */
    const handleDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setEndpointAuthType(data.value as EndpointAuthenticationType);
    };

    /**
     * This method renders property fields of each endpoint authentication type.
     *
     * @returns property fields of the selected authentication type.
     */
    const renderEndpointAuthPropertyFields = (): ReactElement => {
        switch (endpointAuthType) {
            case EndpointAuthenticationType.NONE:
                break;
            case EndpointAuthenticationType.BASIC:
                return (
                    <>
                        <Field.Input
                            ariaLabel="username"
                            className="addon-field-wrapper"
                            name="usernameAuthProperty"
                            label={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.username.label"
                            ) }
                            placeholder={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.username.placeholder"
                            ) }
                            inputType="password"
                            type={ showPrimarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showPrimarySecret, () =>
                                    setShowPrimarySecret(!showPrimarySecret)
                                )
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-endpoint-authentication-property-username` }
                            width={ 15 }
                        />
                        <Field.Input
                            ariaLabel="password"
                            className="addon-field-wrapper"
                            label={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.password.label"
                            ) }
                            placeholder={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.password.placeholder"
                            ) }
                            name="passwordAuthProperty"
                            inputType="password"
                            type={ showSecondarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showSecondarySecret, () =>
                                    setShowSecondarySecret(!showSecondarySecret)
                                )
                            } }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-endpoint-authentication-property-password` }
                            width={ 15 }
                        />
                    </>
                );
            case EndpointAuthenticationType.BEARER:
                return (
                    <>
                        <Field.Input
                            ariaLabel="accessToken"
                            className="addon-field-wrapper"
                            name="accessTokenAuthProperty"
                            inputType="password"
                            type={ showPrimarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showPrimarySecret, () =>
                                    setShowPrimarySecret(!showPrimarySecret)
                                )
                            } }
                            label={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.accessToken.label"
                            ) }
                            placeholder={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.accessToken.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-endpoint-authentication-property-accessToken` }
                            width={ 15 }
                        />
                    </>
                );
            case EndpointAuthenticationType.API_KEY:
                return (
                    <>
                        <Field.Input
                            ariaLabel="header"
                            className="addon-field-wrapper"
                            name="headerAuthProperty"
                            inputType="text"
                            type={ "text" }
                            label={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.header.label"
                            ) }
                            placeholder={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.header.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-endpoint-authentication-property-header` }
                            width={ 15 }
                        />
                        <Field.Input
                            ariaLabel="value"
                            className="addon-field-wrapper"
                            name="valueAuthProperty"
                            inputType="password"
                            type={ showSecondarySecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(showSecondarySecret, () =>
                                    setShowSecondarySecret(!showSecondarySecret)
                                )
                            } }
                            label={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.value.label"
                            ) }
                            placeholder={ t(
                                "customAuthenticator:fields.createWizard.configurationsStep." +
                                    "authenticationTypeDropdown.authProperties.value.placeholder"
                            ) }
                            required={ true }
                            maxLength={ 100 }
                            minLength={ 0 }
                            data-componentid={ `${_componentId}-endpoint-authentication-property-value` }
                            width={ 15 }
                        />
                    </>
                );
            default:
                break;
        }
    };

    /**
     * This method validates the general settings fields.
     *
     * @param values - values to be validated.
     * @returns - errors object.
     */
    const validateGeneralSettingsField = (
        values: CustomAuthenticatorCreateWizardGeneralFormValuesInterface
    ): Partial<CustomAuthenticatorCreateWizardGeneralFormValuesInterface> => {
        const errors: Partial<CustomAuthenticatorCreateWizardGeneralFormValuesInterface> = {};

        if (!CommonAuthenticatorConstants.IDENTIFIER_REGEX.test(values?.identifier)) {
            errors.identifier = t(
                "customAuthenticator:fields.createWizard.generalSettingsStep.identifier.validations.invalid"
            );
        }

        if (!CommonAuthenticatorConstants.DISPLAY_NAME_REGEX.test(values?.displayName)) {
            errors.displayName = t(
                "customAuthenticator:fields.createWizard.generalSettingsStep.displayName.validations.invalid"
            );
        }

        setNextShouldBeDisabled(hasValidationErrors(errors));

        return errors;
    };

    /**
     * This method validates the endpoint configurations.
     *
     * @param values - values to be validated.
     * @returns errors object.
     */
    const validateEndpointConfigs = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> => {
        const errors: Partial<EndpointConfigFormPropertyInterface> = {};

        if (!values?.endpointUri) {
            errors.endpointUri = t(
                "customAuthenticator:fields.createWizard.configurationsStep.endpoint.validations.empty"
            );
        }

        if (
            !FormValidation.url(values?.endpointUri, {
                domain: {
                    allowUnicode: true,
                    minDomainSegments: 1,
                    tlds: false
                },
                scheme: [ "https", "http" ]
            })
        ) {
            errors.endpointUri = t(
                "customAuthenticator:fields.createWizard.configurationsStep.endpoint.validations.general"
            );
        }

        if (!endpointAuthType) {
            errors.authenticationType = t(
                "customAuthenticator:fields.createWizard.configurationsStep." +
                    "authenticationTypeDropdown.validations.required"
            );
        }

        switch (endpointAuthType) {
            case EndpointAuthenticationType.BASIC:
                if (values?.usernameAuthProperty || values?.passwordAuthProperty) {
                    if (!values?.usernameAuthProperty) {
                        errors.usernameAuthProperty = t(
                            "customAuthenticator:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.username.validations.required"
                        );
                    }
                    if (!values?.passwordAuthProperty) {
                        errors.passwordAuthProperty = t(
                            "customAuthenticator:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.password.validations.required"
                        );
                    }
                }

                break;
            case EndpointAuthenticationType.BEARER:
                if (!values?.accessTokenAuthProperty) {
                    errors.accessTokenAuthProperty = t(
                        "customAuthenticator:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.authProperties.accessToken.validations.required"
                    );
                }

                break;
            case EndpointAuthenticationType.API_KEY:
                if (values?.headerAuthProperty || values?.valueAuthProperty) {
                    if (!values?.headerAuthProperty) {
                        errors.headerAuthProperty = t(
                            "customAuthenticator:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.header.validations.required"
                        );
                    }
                    if (!CommonAuthenticatorConstants.API_KEY_HEADER_REGEX.test(values?.headerAuthProperty)) {
                        errors.headerAuthProperty = t(
                            "customAuthenticator:fields.createWizard.configurationsStep." +
                                "authenticationTypeDropdown.authProperties.header.validations.invalid"
                        );
                    }
                    if (!values?.valueAuthProperty) {
                        errors.valueAuthProperty = t(
                            "customAuthenticator:fields.createWizard.configurationsStep." +
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

    /**
     * This method encodes a string to base64.
     * @param str - string to be encoded
     * @returns - encoded string
     */
    const encodeString = (str: string): string => {
        try {
            return btoa(str);
        } catch (error) {
            return "";
        }
    };

    /**
     * This method handles custom authenticator create errors.
     *
     * @param error - error object.
     */
    const handleCustomAuthenticatorCreateErrors = (error: AxiosError): void => {
        const identityAppsError: IdentityAppsError = ConnectionUIConstants.ERROR_CREATE_LIMIT_REACHED;

        if (error?.response?.status === 403 && error?.response?.data?.code === identityAppsError.getErrorCode()) {
            setAlert({
                code: identityAppsError.getErrorCode(),
                description: t(identityAppsError.getErrorDescription()),
                level: AlertLevels.ERROR,
                message: t(identityAppsError.getErrorMessage()),
                traceId: identityAppsError.getErrorTraceId()
            });
            setTimeout(() => setAlert(undefined), ConnectionUIConstants.WIZARD_ERROR_CLEAR_TIMEOUT);

            return;
        }

        if (error?.response?.status === 500) {
            setAlert({
                description: t(
                    "customAuthenticator:notifications.addCustomAuthenticator.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "customAuthenticator:notifications.addCustomAuthenticator.genericError.message"
                )
            });
            setTimeout(() => setAlert(undefined), ConnectionUIConstants.WIZARD_ERROR_CLEAR_TIMEOUT);

            return;
        }

        if (error?.response?.data?.description) {
            setAlert({
                description: t(
                    "customAuthenticator:notifications.addCustomAuthenticator.error.description",
                    {
                        description: error.response.data.description
                    }
                ),
                level: AlertLevels.ERROR,
                message: t("customAuthenticator:notifications.addCustomAuthenticator.error.message")
            });
            setTimeout(() => setAlert(undefined), ConnectionUIConstants.WIZARD_ERROR_CLEAR_TIMEOUT);

            return;
        }
        setAlert({
            description: t(
                "customAuthenticator:notifications.addCustomAuthenticator.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: t("customAuthenticator:notifications.addCustomAuthenticator.genericError.message")
        });
        setTimeout(() => setAlert(undefined), ConnectionUIConstants.WIZARD_ERROR_CLEAR_TIMEOUT);
    };

    /**
     * This method creates an external authenticator.
     *
     * @param identityProvider - identity provider object.
     */
    const createExternalAuthenticator = (identityProvider: ConnectionInterface) => {
        createConnection(identityProvider)
            .then((response: AxiosResponse<ConnectionInterface>) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: _componentId + "-" + kebabCase(selectedAuthenticator)
                });
                dispatch(
                    addAlert({
                        description: t("customAuthenticator:notifications.addCustomAuthenticator.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "customAuthenticator:notifications.addCustomAuthenticator.success.message"
                        )
                    })
                );

                if (!isEmpty(response.headers.location)) {
                    const location: string = response.headers.location;
                    const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }
                onIDPCreate();
            })
            .catch((error: AxiosError) => {
                handleCustomAuthenticatorCreateErrors(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * This method creates a custom local authenticator.
     *
     * @param customAuthenticator - custom authenticator
     */
    const createCustomLocalAuthenticator = (customAuthenticator: CustomAuthConnectionInterface) => {
        createCustomAuthenticator(customAuthenticator)
            .then((response: AxiosResponse<CustomAuthConnectionInterface>) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: _componentId + "-" + kebabCase(selectedAuthenticator)
                });
                dispatch(
                    addAlert({
                        description: t("authenticationProvider:notifications.addIDP.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("authenticationProvider:notifications.addIDP.success.message")
                    })
                );

                if (!isEmpty(response.headers.location)) {
                    const location: string = response.headers.location;
                    const createdLocalAuthID: string = location.substring(location.lastIndexOf("/") + 1);

                    handleSuccessfulAuthenticatorCreate(createdLocalAuthID);

                    return;
                }
                handleSuccessfulAuthenticatorCreate();
            })
            .catch((error: AxiosError) => {
                handleCustomAuthenticatorCreateErrors(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * @param values - form values
     * @param form - form instance
     * @param callback - callback to proceed to the next step
     */
    const handleFormSubmit = (values: any) => {
        const prefixedIdentifier: string = CustomAuthConstants.PREFIX + values?.identifier?.toString();
        const encodedPrefixedIdentifier: string = encodeString(prefixedIdentifier);

        if (selectedAuthenticator === CustomAuthConstants.EXTERNAL_AUTHENTICATOR) {
            const FIRST_ENTRY: number = 0;

            const { idp: identityProvider } = cloneDeep(connectionTemplate);

            identityProvider.templateId = selectedTemplateId;
            identityProvider.name = values?.displayName?.toString();

            identityProvider.federatedAuthenticators.defaultAuthenticatorId = encodedPrefixedIdentifier;
            identityProvider.federatedAuthenticators.authenticators[
                FIRST_ENTRY
            ].authenticatorId = encodedPrefixedIdentifier;
            identityProvider.federatedAuthenticators.authenticators[
                FIRST_ENTRY
            ].endpoint.uri = values?.endpointUri.toString();
            identityProvider.federatedAuthenticators.authenticators[
                FIRST_ENTRY
            ].endpoint.authentication.type = endpointAuthType;

            const authProperties: any = {};

            authProperties["username"] = values?.usernameAuthProperty;
            authProperties["password"] = values?.passwordAuthProperty;
            authProperties["accessToken"] = values?.accessTokenAuthProperty;
            authProperties["header"] = values?.headerAuthProperty;
            authProperties["value"] = values?.valueAuthProperty;
            identityProvider.federatedAuthenticators.authenticators[
                FIRST_ENTRY
            ].endpoint.authentication.properties = authProperties;

            setIsSubmitting(true);
            createExternalAuthenticator(identityProvider);
        } else {

            const { customLocalAuthenticator: customAuthenticator } = cloneDeep(connectionTemplate);

            customAuthenticator.name = prefixedIdentifier;
            customAuthenticator.displayName = values?.displayName?.toString();
            customAuthenticator.description = connectionTemplate.customLocalAuthenticator.description;

            customAuthenticator.endpoint.authentication.type = endpointAuthType;
            customAuthenticator.endpoint.uri = values?.endpointUri.toString();

            const authProperties: any = {};

            authProperties["username"] = values?.usernameAuthProperty;
            authProperties["password"] = values?.passwordAuthProperty;
            authProperties["accessToken"] = values?.accessTokenAuthProperty;
            authProperties["header"] = values?.headerAuthProperty;
            authProperties["value"] = values?.valueAuthProperty;
            customAuthenticator.endpoint.authentication.properties = authProperties;

            setIsSubmitting(true);
            createCustomLocalAuthenticator(customAuthenticator);
        }
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
                <label>{ t("customAuthenticator:fields.createWizard.authenticationTypeStep.label") }</label>
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
                                    "customAuthenticator:fields.createWizard.authenticationTypeStep." +
                                        "externalAuthenticationCard.header"
                                ) }
                            </div>)
                        }
                        description={
                            (<div>
                                <p className="main-description">
                                    { t(
                                        "customAuthenticator:fields.createWizard." +
                                            "authenticationTypeStep.externalAuthenticationCard.mainDescription"
                                    ) }
                                </p>
                                <p className="examples">
                                    { t(
                                        "customAuthenticator:fields.createWizard." +
                                            "authenticationTypeStep.externalAuthenticationCard.examples"
                                    ) }
                                </p>
                            </div>)
                        }
                        contentTopBorder={ false }
                        selected={ selectedAuthenticator === CustomAuthConstants.EXTERNAL_AUTHENTICATOR }
                        onClick={ () => setSelectedAuthenticator(CustomAuthConstants.EXTERNAL_AUTHENTICATOR) }
                        imageSize="x60"
                        showTooltips={ true }
                        overlay={ renderDimmerOverlay() }
                        overlayOpacity={ 0.6 }
                        data-componentid={ `${_componentId}-create-wizard-external-custom-authenticator-
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
                                    "customAuthenticator:fields.createWizard.authenticationTypeStep." +
                                        "internalUserAuthenticationCard.header"
                                ) }
                            </div>)
                        }
                        description={
                            (<div>
                                <p className="main-description">
                                    { t(
                                        "customAuthenticator:fields.createWizard." +
                                            "authenticationTypeStep.internalUserAuthenticationCard.mainDescription"
                                    ) }
                                </p>
                                <p className="examples">
                                    { t(
                                        "customAuthenticator:fields.createWizard." +
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
                        data-componentid={ `${_componentId}-create-wizard-internal-user-custom-authenticator-
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
                                    "customAuthenticator:fields.createWizard.authenticationTypeStep." +
                                        "twoFactorAuthenticationCard.header"
                                ) }
                            </div>)
                        }
                        description={
                            (<div>
                                <p className="main-description">
                                    { t(
                                        "customAuthenticator:fields.createWizard." +
                                            "authenticationTypeStep.twoFactorAuthenticationCard.mainDescription"
                                    ) }
                                </p>
                                <p className="examples">
                                    { t(
                                        "customAuthenticator:fields.createWizard." +
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
                        data-componentid={ `${_componentId}-create-wizard-two-factor-custom-authenticator-
                        selection-card` }
                    />
                </div>
            </div>
        </WizardPage>
    );

    /**
     * In order to display that the "custom-" will be prefixed to the identifier, this is rendered
     * inside the Input field similar to an adornment.
     * @returns React Element
     */
    const customPrefix = (): ReactElement => {
        return <span>{ ConnectionUIConstants.CUSTOM_AUTHENTICATOR_IDENTIFIER_PREFIX }</span>;
    };

    const generalSettingsPage = () => (
        <WizardPage validate={ validateGeneralSettingsField }>
            <Field.Input
                className="identifier-field"
                ariaLabel="identifier"
                inputType="text"
                name="identifier"
                label={ t("customAuthenticator:fields.createWizard.generalSettingsStep.identifier.label") }
                placeholder={ t("customAuthenticator:fields.createWizard.generalSettingsStep.identifier.placeholder") }
                initialValue={ initialValues.identifier }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${_componentId}-create-wizard-identifier` }
                width={ 15 }
                iconPosition="left"
                adornment={ customPrefix() }
            />
            <Hint>{ t("customAuthenticator:fields.createWizard.generalSettingsStep.identifier.hint") }</Hint>
            <Field.Input
                ariaLabel="displayName"
                inputType="text"
                name="displayName"
                label={ t("customAuthenticator:fields.createWizard.generalSettingsStep.displayName.label") }
                placeholder={ t("customAuthenticator:fields.createWizard.generalSettingsStep.displayName." +
                    "placeholder") }
                initialValue={ initialValues.displayName }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${_componentId}-create-wizard-display-name` }
                width={ 15 }
            />
        </WizardPage>
    );

    const configurationsPage = () => (
        <WizardPage validate={ validateEndpointConfigs }>
            <Field.Input
                ariaLabel="endpointUri"
                className="addon-field-wrapper"
                inputType="url"
                name="endpointUri"
                label={ t("customAuthenticator:fields.createWizard.configurationsStep.endpoint.label") }
                placeholder={ t("customAuthenticator:fields.createWizard.configurationsStep.endpoint.placeholder") }
                hint={ t("customAuthenticator:fields.createWizard.configurationsStep.endpoint.hint") }
                required={ true }
                maxLength={ 100 }
                minLength={ 0 }
                data-componentid={ `${_componentId}-create-wizard-endpoint-uri` }
                width={ 15 }
            />
            <FormSpy
                onChange={ ({ values }: { values: EndpointConfigFormPropertyInterface }) => {
                    if (values?.endpointUri?.startsWith("http://")) {
                        setIsHttpEndpointUri(true);
                    } else {
                        setIsHttpEndpointUri(false);
                    }
                } }
            />
            { isHttpEndpointUri && (
                <Alert
                    severity="warning"
                    className="endpoint-uri-alert"
                    data-componentid={ `${_componentId}-endpoint-uri-alert` }
                >
                    <Trans
                        i18nKey={ t("actions:fields.endpoint.validations.notHttps") }
                    >
                        The URL is not secure (HTTP). Use HTTPS for a secure connection.
                    </Trans>
                </Alert>
            ) }
            <Divider className="divider-container" />
            <Heading className="heading-container" as="h5">
                { t("customAuthenticator:fields.createWizard.configurationsStep.authenticationTypeDropdown.title") }
            </Heading>
            <Box className="box-container">
                <Field.Dropdown
                    ariaLabel="authenticationType"
                    name="authenticationType"
                    label={ t(
                        "customAuthenticator:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.label"
                    ) }
                    placeholder={ t(
                        "customAuthenticator:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.placeholder"
                    ) }
                    hint={ t(
                        "customAuthenticator:fields.createWizard.configurationsStep." +
                            "authenticationTypeDropdown.hint"
                    ) }
                    required={ true }
                    value={ endpointAuthType }
                    options={ [
                        ...ConnectionUIConstants.AUTH_TYPES.map((option: AuthenticationTypeDropdownOption) => ({
                            text: t(option.text),
                            value: option.value.toString()
                        }))
                    ] }
                    onChange={ handleDropdownChange }
                    enableReinitialize={ true }
                    data-componentid={ `${_componentId}-create-wizard-endpoint-authentication-dropdown` }
                    width={ 15 }
                />
                <div className="box-field">{ renderEndpointAuthPropertyFields() }</div>
            </Box>
        </WizardPage>
    );

    const resolveWizardPages = (): Array<ReactElement> => {
        return [ wizardCommonFirstPage(), generalSettingsPage(), configurationsPage() ];
    };

    const WizardHelpPanel = (): ReactElement => {
        return (
            <div>
                <Heading as="h5">
                    { t("customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel.identifier.header") }
                </Heading>
                <p>
                    { t(
                        "customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel." +
                            "identifier.description"
                    ) }
                </p>
                <p>
                    <Trans
                        i18nKey={
                            "customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel." +
                            "identifier.note"
                        }
                    >
                        Provide a unique name to refer in authentication scripts and authentication parameters. Note
                        that <strong>custom-</strong> will be prefixed to the identifier.
                    </Trans>
                </p>
                <Message className="display-flex" size="small" warning>
                    <Icon name="warning sign" color="orange" corner />
                    <Message.Content className="tiny">
                        { t(
                            "customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel." +
                                "identifier.warning"
                        ) }
                    </Message.Content>
                </Message>
                <Divider />
                <Heading as="h5">
                    { t("customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel.displayName.header") }
                </Heading>
                <p>
                    { t(
                        "customAuthenticator:fields.createWizard.generalSettingsStep.helpPanel.displayName.description"
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
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${_componentId}-modal-header` }>
                    <div className={ "display-flex" }>
                        <GenericIcon
                            icon={ AuthenticatorMeta.getCustomAuthenticatorIcon() }
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
                            { wizardSteps.map((step: WizardStepInterface, index: number) => (
                                <Steps.Step active key={ index } icon={ step.icon } title={ step.title } />
                            )) }
                        </Steps.Group>
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-componentid={ `${_componentId}-modal-content-2` }
                    >
                        { alert && alertComponent }
                        <div className="custom-authenticator-create-wizard">
                            <Wizard2
                                ref={ wizardRef }
                                initialValues={ initialValues }
                                uncontrolledForm={ true }
                                onSubmit={ handleFormSubmit }
                                pageChanged={ (index: number) => setCurrentWizardStep(index) }
                                data-componentid={ _componentId }
                            >
                                { resolveWizardPages() }
                            </Wizard2>
                        </div>
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
                                        { t("authenticationProvider:wizards.buttons.previous") }
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

export default CustomAuthenticatorCreateWizard;
