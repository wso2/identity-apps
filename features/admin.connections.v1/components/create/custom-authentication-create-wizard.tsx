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

import { SelectChangeEvent } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Grid from "@oxygen-ui/react/Grid";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Skeleton from "@oxygen-ui/react/Skeleton";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState, EventPublisher } from "@wso2is/admin.core.v1";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import {
    Field,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    FormSpy,
    SelectFieldAdapter,
    TextFieldAdapter,
    Wizard2,
    WizardPage
} from "@wso2is/form";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    Steps,
    useDocumentation,
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
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Grid as SemanticGrid } from "semantic-ui-react";
import { createConnection, useGetConnectionTemplate } from "../../api/connections";
import { getConnectionIcons, getConnectionWizardStepIcons } from "../../configs/ui";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { LocalAuthenticatorConstants } from "../../constants/local-authenticator-constants";
import {
    AuthenticationType,
    AuthenticationTypeDropdownOption,
    AuthenticationPropertiesInterface,
    ConnectionInterface,
    ConnectionTemplateInterface,
    CustomAuthenticationCreateWizardGeneralFormValuesInterface,
    EndpointInterface,
    EndpointConfigFormPropertyInterface,
    GenericConnectionCreateWizardPropsInterface,
} from "../../models/connection";

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
    AUTHENTICATION_TYPE = "Authentication Type",
    GENERAL_SETTINGS = "General Settings",
    CONFIGURATION = "Configuration"
}

interface WizardStepInterface {
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardSteps;
}

/**
 * Prop types for the endpoint configuration form component.
 */
interface EndpointConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Endpoint's initial values.
     */
    initialValues: EndpointConfigFormInterface;
    /**
     * Flag for loading state.
     */
    isLoading?: boolean;
    /**
     * Specifies action creation state.
     */
    isCreateFormState: boolean;
}

type AvailableCustomAuthentications = "external" | "internal" | "two-factor";
type MinMax = { min: number; max: number };
type FormErrors = { [ key: string ]: string };

export const CustomAuthenticationCreateWizard: FC<CustomAuthenticationCreateWizardProps> = (
    props: PropsWithChildren<CustomAuthenticationCreateWizardProps>
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
    const [ selectedAuthenticator, setSelectedAuthenticator ] = useState<AvailableCustomAuthentications>("external");
    const [ selectedTemplateId, setSelectedTemplateId ] = useState<string>(null);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isShowSecret1, setIsShowSecret1 ] = useState(false);
    const [ isShowSecret2, setIsShowSecret2 ] = useState(false);
    const [ isAuthenticationCreateState, setIsAuthenticationCreateState ] = useState<boolean>(true);
    const [ isAuthenticationUpdateState, setIsAuthenticationUpdateState ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ authenticationType, setAuthenticationType ] = useState<AuthenticationType>(null);
    const [ selectedAuthenticationType, setSelectedAuthenticationType ] = useState<string>();
    // const [ selectedEndpointAuthType, setSelectedEndpointAuthType ] = useState<string>();

    // Dynamic UI state
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const endpointFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.actions);
    const hasActionUpdatePermissions: boolean = useRequiredScopes(endpointFeatureConfig?.scopes?.update);
    const hasActionCreatePermissions: boolean = useRequiredScopes(endpointFeatureConfig?.scopes?.create);

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

    // useEffect(() => {
    //     if(selectedAuthenticationType) {
    //         setSelectedValue(selectedSubjectValue);
    //         setShowSubjectAttribute(selectedSubjectValue !== defaultSubjectAttribute);
    //     }
    // }, [ selectedSubjectValue ]);

    const initialValues: { NameIDType: string, RequestMethod: string, 
        identifier: string, displayName: string } = useMemo(() => ({
            NameIDType: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
            RequestMethod: "post",
            displayName: EMPTY_STRING,
            identifier: EMPTY_STRING
        }), []);

    // TODO: [Immediate] use the API to get initial endpoint details
    // const {
    //     data: action,
    //     error: actionFetchRequestError,
    //     isLoading: isActionLoading,
    //     mutate: mutateAction
    // } = useGetActionById(actionTypeApiPath, actionId);

    // const endpointInitialValues: EndpointConfigFormInterface = useMemo(() => {
    //     return {
    //         authenticationType: action?.endpoint?.authentication?.type.toString(),
    //         endpointUri: action?.endpoint?.uri,
    //         id: action?.id,
    //         name: action?.name
    //     };
    // }, [action]); // TODO: add dep

    const endpointInitialValues: EndpointConfigFormPropertyInterface = useMemo(() => {
        return {
            authenticationType: "",
            endpointUri: "",
            id: ""
        };
    }, []);

    /**
     * The following useEffect is used to set the current Action Authentication Type.
     */
    useEffect(() => {
        if (!initialValues?.identifier) {
            setIsAuthenticationCreateState(true);
        } else {
            // setAuthenticationType(endpointInitialValues.authenticationType as AuthenticationType);
            setIsAuthenticationUpdateState(false);
        }
    }, [ initialValues ]);

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

    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.AUTHENTICATION_TYPE,
                title: "Authentication Type"
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardSteps.GENERAL_SETTINGS,
                title: "General Settings"
            },
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.CONFIGURATION,
                title: "Configuration"
            }
        ] as WizardStepInterface[];
    };

    const renderDimmerOverlay = (): ReactNode => {
        return (
            <Backdrop open={ true }>
                { t("common:featureAvailable") }
            </Backdrop>
        );
    };

    // TODO: update this method
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
        console.log("name: " + customAuthenticator.name);
        console.log("displayName: " + customAuthenticator.displayName);
        // TODO: [Immediate] add endpoint details here
        // customAuthenticator.endpoint.uri = values?.uri?.toString();

        // TODO: update the image
        customAuthenticator.image = "assets/images/logos/expert.svg";

        setIsSubmitting(true);

        // TODO: [Immediate] API integrations
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
                        description: "You are trying to add a provider with an existing Identity" + // TODO: update this
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

    useEffect (() => {
        console.log("Auth type", selectedAuthenticationType);
    }, [ selectedAuthenticationType ]);

    const handleDropdownChange = (event, data) => {
        setSelectedAuthenticationType(data.value); // Update the state with the selected value
        console.log("Selected value:", data.value); // Log the selected value for debugging
    };

    const validateForm = (values: EndpointConfigFormPropertyInterface):
    Partial<EndpointConfigFormPropertyInterface> => { const error: Partial<EndpointConfigFormPropertyInterface> = {};

        console.log("value type: " + values?.authenticationType);
        console.log("value uri: " + values?.endpointUri);
        // TODO: use local - and update with proper local
        if (!values?.endpointUri) {
            error.endpointUri = "Empty endpoint URI";
        }
        if (URLUtils.isURLValid(values?.endpointUri)) {
            if (!(URLUtils.isHttpsUrl(values?.endpointUri))) {
                error.endpointUri = t("actions:fields.endpoint.validations.notHttps");
            }
        } else {
            error.endpointUri = t("actions:fields.endpoint.validations.invalidUrl");
        }

        if (!selectedAuthenticationType) {
            error.authenticationType = t("actions:fields.authenticationType.validations.empty");
        }

        const apiKeyHeaderRegex: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]+$/;

        switch (authenticationType) {
            case AuthenticationType.BASIC:
                if (isAuthenticationCreateState || isAuthenticationUpdateState ||
                    values?.usernameAuthProperty || values?.passwordAuthProperty) {
                    if (!values?.usernameAuthProperty) {
                        error.usernameAuthProperty = t("actions:fields.authentication." +
                            "types.basic.properties.username.validations.empty");
                    }
                    if (!values?.passwordAuthProperty) {
                        error.passwordAuthProperty = t("actions:fields.authentication." +
                            "types.basic.properties.password.validations.empty");
                    }
                }

                break;
            case AuthenticationType.BEARER:
                if (isAuthenticationCreateState || isAuthenticationUpdateState) {
                    if (!values?.accessTokenAuthProperty) {
                        error.accessTokenAuthProperty = t("actions:fields.authentication." +
                        "types.bearer.properties.accessToken.validations.empty");
                    }
                }

                break;
            case AuthenticationType.API_KEY:
                if (isAuthenticationCreateState || isAuthenticationUpdateState||
                    values?.headerAuthProperty || values?.valueAuthProperty) {
                    if (!values?.headerAuthProperty) {
                        error.headerAuthProperty = t("actions:fields.authentication." +
                            "types.apiKey.properties.header.validations.empty");
                    }
                    if (!apiKeyHeaderRegex.test(values?.headerAuthProperty)) {
                        error.headerAuthProperty = t("actions:fields.authentication." +
                            "types.apiKey.properties.header.validations.invalid");
                    }
                    if (!values?.valueAuthProperty) {
                        error.valueAuthProperty = t("actions:fields.authentication." +
                            "types.apiKey.properties.value.validations.empty");
                    }
                }

                break;
            default:
                break;
        }

        return error;
    };

    const handleSubmit = (
        values: EndpointConfigFormPropertyInterface,
        changedFields: EndpointConfigFormPropertyInterface) =>
    {
        const authProperties: Partial<AuthenticationPropertiesInterface> = {};

        if (isAuthenticationCreateState || isAuthenticationUpdateState) {
            switch (authenticationType) {
                case AuthenticationType.BASIC:
                    authProperties.username = values.usernameAuthProperty;
                    authProperties.password = values.passwordAuthProperty;

                    break;
                case AuthenticationType.BEARER:
                    authProperties.accessToken = values.accessTokenAuthProperty;

                    break;
                case AuthenticationType.API_KEY:
                    authProperties.header = values.headerAuthProperty;
                    authProperties.value = values.valueAuthProperty;

                    break;
                case AuthenticationType.NONE:
                    break;
                default:
                    break;
            }
        }

        if (isAuthenticationCreateState) {
            const endpoint: EndpointInterface ={
                authentication: {
                    properties: authProperties,
                    type: authenticationType
                },
                uri: values.endpointUri
            };

            setIsSubmitting(true);
            // TODO: [ Immediate ] add creation API

            // createAction(actionTypeApiPath, actionValues)
            //     .then(() => {
            //         handleSuccess(ActionsConstants.CREATE);
            //         mutateActions();
            //     })
            //     .catch((error: AxiosError) => {
            //         handleError(error, ActionsConstants.CREATE);
            //     })
            //     .finally(() => {
            //         setIsSubmitting(false);
            //     });
        } else {
            // Update endpoint details
            const endpoint: EndpointInterface = {
                authentication: isAuthenticationUpdateState ? {
                    properties: authProperties,
                    type: authenticationType
                } : undefined,
                uri: changedFields?.endpointUri ? values.endpointUri : undefined
            };

            setIsSubmitting(true);
            // TODO: [ Immediate ] add creation API

            // updateAction(actionTypeApiPath, initialValues.id, updatingValues)
            //     .then(() => {
            //         handleSuccess(ActionsConstants.UPDATE);
            //         setIsAuthenticationUpdateFormState(false);
            //         mutateAction();
            //     })
            //     .catch((error: AxiosError) => {
            //         handleError(error, ActionsConstants.UPDATE);
            //     })
            //     .finally(() => {
            //         setIsSubmitting(false);
            //     });
        }
    };

    /**
     * This is called when the Change Authentication button is pressed.
     */
    const handleAuthenticationChange = (): void => {
        setIsAuthenticationUpdateState(true);
    };

    /**
     * This is called when the cancel button is pressed.
     */
    const handleAuthenticationChangeCancel = (): void => {
        setAuthenticationType(endpointInitialValues?.authenticationType as AuthenticationType);
        setIsAuthenticationUpdateState(false);
    };


    const getFieldDisabledStatus = (): boolean => {
        if (isAuthenticationCreateState) {
            return !hasActionCreatePermissions;
        } else {
            return !hasActionUpdatePermissions;
        }
    };

    const renderLoadingPlaceholders = (): ReactElement => (
        <Box className="placeholder-box">
            <Skeleton variant="rectangular" height={ 7 } width="30%" />
            <Skeleton variant="rectangular" height={ 28 } />
            <Skeleton variant="rectangular" height={ 7 } width="90%" />
            <Skeleton variant="rectangular" height={ 7 } />
        </Box>
    );

    const renderEndpointAuthPropertyFields = (): ReactElement => {
        // const showAuthSecretsHint = (): ReactElement => (
        //     <Hint className="hint-text" compact>
        //         {
        //             isAuthenticationCreateState ?
        //                 t("actions:fields.authenticationType.hint.create")
        //                 : t("actions:fields.authenticationType.hint.update")
        //         }
        //     </Hint>
        // );

        switch (selectedAuthenticationType) {
            case AuthenticationType.NONE:
                break;
            case AuthenticationType.BASIC: // TODO: [Immediate] check inputType
                return (
                    <>
                        {/* { showAuthSecretsHint() } */}
                        <Field.Input
                            ariaLabel="username"
                            className="addon-field-wrapper"
                            // inputType="username"
                            name="usernameAuthProperty"
                            label={ "Username" }
                            placeholder={ "Username" }
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
                            label={ "Password" }
                            placeholder={ "Password" }
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
                        {/* { showAuthSecretsHint() } */}
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
                            label={ "Access token" }
                            placeholder={ "Access Token" }
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
                        {/* { showAuthSecretsHint() } */}
                        <Field.Input
                            ariaLabel="header"
                            className="addon-field-wrapper"
                            name="headerAuthProperty"
                            inputType="text"
                            type={ "text" }
                            label={ "Header" }
                            placeholder={ "Header" }
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
                            label={ "Value" }
                            placeholder={ "Value" }
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

    // const renderFormFields = (): ReactElement => {
    //     const renderAuthenticationSection = (): ReactElement => {
    //         const renderAuthenticationSectionInfoBox = (): ReactElement => {
    //             const resolveAuthTypeDisplayName = (): string => {
    //                 switch (authenticationType) {
    //                     case AuthenticationType.NONE: // TODO: update with proper local
    //                         return t("actions:fields.authentication.types.none.name");
    //                     case AuthenticationType.BASIC:
    //                         return t("actions:fields.authentication.types.basic.name");
    //                     case AuthenticationType.BEARER:
    //                         return t("actions:fields.authentication.types.bearer.name");
    //                     case AuthenticationType.API_KEY:
    //                         return t("actions:fields.authentication.types.apiKey.name");
    //                     default:
    //                         return;
    //                 }
    //             };

    //             return (
    //                 <Alert severity="info">
    //                     <AlertTitle
    //                         className="alert-title"
    //                         data-componentid={ `${ componentId }-authentication-info-box-title` }
    //                     >
    //                         <Trans
    //                             i18nKey={
    //                                 authenticationType === AuthenticationType.NONE ?
    //                                     t("actions:fields.authentication.info.title.noneAuthType") :
    //                                     t("actions:fields.authentication.info.title.otherAuthType",
    //                                         { authType: resolveAuthTypeDisplayName() })
    //                             }
    //                             components={ { strong: <strong/> } }
    //                         />
    //                     </AlertTitle>
    //                     <Trans
    //                         i18nKey={ t("actions:fields.authentication.info.message") }
    //                     >
    //                             If you are changing the authentication, be aware that the authentication secrets of
    //                             the external endpoint need to be updated.
    //                     </Trans>
    //                     <div>
    //                         <Button
    //                             onClick={ handleAuthenticationChange }
    //                             variant="outlined"
    //                             size="small"
    //                             className={ "secondary-button" }
    //                             data-componentid={ `${ componentId }-change-authentication-button` }
    //                             disabled={ getFieldDisabledStatus() }
    //                         >
    //                             { t("actions:buttons.changeAuthentication") }
    //                         </Button>
    //                     </div>
    //                 </Alert>
    //             );
    //         };

    //         const renderAuthenticationUpdateWidget = (): ReactElement => {
    //             const renderAuthentication = (): ReactElement => {
    //                 const renderAuthenticationPropertyFields = (): ReactElement => {
    //                     const showAuthSecretsHint = (): ReactElement => (
    //                         <Hint className="hint-text" compact>
    //                             {
    //                                 isAuthenticationCreateState ?
    //                                     t("actions:fields.authenticationType.hint.create")
    //                                     : t("actions:fields.authenticationType.hint.update")
    //                             }
    //                         </Hint>
    //                     );

    //                     switch (authenticationType) {
    //                         case AuthenticationType.NONE:
    //                             break;
    //                         case AuthenticationType.BASIC:
    //                             return (
    //                                 <>
    //                                     { showAuthSecretsHint() }
    //                                     <FinalFormField
    //                                         key="username"
    //                                         width={ 16 }
    //                                         className="text-field-container"
    //                                         FormControlProps={ {
    //                                             margin: "dense"
    //                                         } }
    //                                         ariaLabel="username"
    //                                         required={ true }
    //                                         data-componentid={ `${ componentId }-authentication-property-username` }
    //                                         name="usernameAuthProperty"
    //                                         type={ isShowSecret1 ? "text" : "password" }
    //                                         InputProps={ {
    //                                             endAdornment: renderInputAdornmentOfSecret(
    //                                                 isShowSecret1,
    //                                                 () => setIsShowSecret1(!isShowSecret1))
    //                                         } }
    //                                         label={ t("actions:fields.authentication" +
    //                                             ".types.basic.properties.username.label") }
    //                                         placeholder={ t("actions:fields.authentication" +
    //                                             ".types.basic.properties.username.placeholder") }
    //                                         component={ TextFieldAdapter }
    //                                         maxLength={ 100 }
    //                                         minLength={ 0 }
    //                                         disabled={ getFieldDisabledStatus() }
    //                                     />
    //                                     <FinalFormField
    //                                         key="password"
    //                                         className="text-field-container"
    //                                         width={ 16 }
    //                                         FormControlProps={ {
    //                                             margin: "dense"
    //                                         } }
    //                                         ariaLabel="password"
    //                                         required={ true }
    //                                         data-componentid={ `${ componentId }-authentication-property-password` }
    //                                         name="passwordAuthProperty"
    //                                         type={ isShowSecret2 ? "text" : "password" }
    //                                         InputProps={ {
    //                                             endAdornment: renderInputAdornmentOfSecret(
    //                                                 isShowSecret2,
    //                                                 () => setIsShowSecret2(!isShowSecret2))
    //                                         } }
    //                                         label={ t("actions:fields.authentication" +
    //                                             ".types.basic.properties.password.label") }
    //                                         placeholder={ t("actions:fields.authentication" +
    //                                             ".types.basic.properties.password.placeholder") }
    //                                         component={ TextFieldAdapter }
    //                                         maxLength={ 100 }
    //                                         minLength={ 0 }
    //                                         disabled={ getFieldDisabledStatus() }
    //                                     />
    //                                 </>
    //                             );
    //                         case AuthenticationType.BEARER:
    //                             return (
    //                                 <>
    //                                     { showAuthSecretsHint() }
    //                                     <FinalFormField
    //                                         key="accessToken"
    //                                         className="text-field-container"
    //                                         width={ 16 }
    //                                         FormControlProps={ {
    //                                             margin: "dense"
    //                                         } }
    //                                         ariaLabel="accessToken"
    //                                         required={ true }
    //                                         data-componentid={ `${ componentId }-authentication-property-accessToken` }
    //                                         name="accessTokenAuthProperty"
    //                                         type={ isShowSecret1 ? "text" : "password" }
    //                                         InputProps={ {
    //                                             endAdornment: renderInputAdornmentOfSecret(
    //                                                 isShowSecret1,
    //                                                 () => setIsShowSecret1(!isShowSecret1))
    //                                         } }
    //                                         label={ t("actions:fields.authentication" +
    //                                             ".types.bearer.properties.accessToken.label") }
    //                                         placeholder={ t("actions:fields.authentication" +
    //                                             ".types.bearer.properties.accessToken.placeholder") }
    //                                         component={ TextFieldAdapter }
    //                                         maxLength={ 100 }
    //                                         minLength={ 0 }
    //                                         disabled={ getFieldDisabledStatus() }
    //                                     />
    //                                 </>
    //                             );
    //                         case AuthenticationType.API_KEY:
    //                             return (
    //                                 <>
    //                                     { showAuthSecretsHint() }
    //                                     <FinalFormField
    //                                         key="header"
    //                                         className="text-field-container"
    //                                         width={ 16 }
    //                                         FormControlProps={ {
    //                                             margin: "dense"
    //                                         } }
    //                                         ariaLabel="header"
    //                                         required={ true }
    //                                         data-componentid={ `${ componentId }-authentication-property-header` }
    //                                         name="headerAuthProperty"
    //                                         type={ "text" }
    //                                         label={ t("actions:fields.authentication" +
    //                                             ".types.apiKey.properties.header.label") }
    //                                         placeholder={ t("actions:fields.authentication" +
    //                                             ".types.apiKey.properties.header.placeholder") }
    //                                         helperText={ (
    //                                             <Hint className="hint" compact>
    //                                                 { t("actions:fields.authentication" +
    //                                                     ".types.apiKey.properties.header.hint") }
    //                                             </Hint>
    //                                         ) }
    //                                         component={ TextFieldAdapter }
    //                                         maxLength={ 100 }
    //                                         minLength={ 0 }
    //                                         disabled={ getFieldDisabledStatus() }
    //                                     />
    //                                     <FinalFormField
    //                                         key="value"
    //                                         className="text-field-container"
    //                                         width={ 16 }
    //                                         FormControlProps={ {
    //                                             margin: "dense"
    //                                         } }
    //                                         ariaLabel="value"
    //                                         required={ true }
    //                                         data-componentid={ `${ componentId }-authentication-property-value` }
    //                                         name="valueAuthProperty"
    //                                         type={ isShowSecret2 ? "text" : "password" }
    //                                         InputProps={ {
    //                                             endAdornment: renderInputAdornmentOfSecret(
    //                                                 isShowSecret2,
    //                                                 () => setIsShowSecret2(!isShowSecret2))
    //                                         } }
    //                                         label={ t("actions:fields.authentication" +
    //                                             ".types.apiKey.properties.value.label") }
    //                                         placeholder={ t("actions:fields.authentication" +
    //                                             ".types.apiKey.properties.value.placeholder") }
    //                                         component={ TextFieldAdapter }
    //                                         maxLength={ 100 }
    //                                         minLength={ 0 }
    //                                         disabled={ getFieldDisabledStatus() }
    //                                     />
    //                                 </>
    //                             );
    //                         default:
    //                             break;
    //                     }
    //                 };

    //                 const handleAuthTypeChange = (event: SelectChangeEvent) => {
    //                     switch (event.target.value) {
    //                         case AuthenticationType.NONE.toString():
    //                             setAuthenticationType(AuthenticationType.NONE);

    //                             break;
    //                         case AuthenticationType.BASIC.toString():
    //                             setAuthenticationType(AuthenticationType.BASIC);

    //                             break;
    //                         case AuthenticationType.BEARER.toString():
    //                             setAuthenticationType(AuthenticationType.BEARER);

    //                             break;
    //                         case AuthenticationType.API_KEY.toString():
    //                             setAuthenticationType(AuthenticationType.API_KEY);

    //                             break;
    //                         default:
    //                             setAuthenticationType(AuthenticationType.NONE);
    //                     }

    //                     renderAuthenticationPropertyFields();
    //                 };

    //                 return (
    //                     <>
    //                         <FinalFormField
    //                             key="authenticationType"
    //                             className="select-field-container"
    //                             width={ 16 }
    //                             FormControlProps={ {
    //                                 margin: "dense"
    //                             } }
    //                             ariaLabel="authenticationType"
    //                             required={ true }
    //                             data-componentid={ `${ componentId }-authentication-type-dropdown` }
    //                             name="authenticationType"
    //                             type={ "dropdown" }
    //                             displayEmpty={ true }
    //                             label={ t("actions:fields.authenticationType.label") }
    //                             placeholder={ "Select" }
    //                             component={ SelectFieldAdapter }
    //                             maxLength={ 100 }
    //                             minLength={ 0 }
    //                             options={
    //                                 [ ...LocalAuthenticatorConstants.AUTH_TYPES.map(
    //                                     (option: AuthenticationTypeDropdownOption) => ({
    //                                         text: t(option.text),
    //                                         value: option.value.toString() }))
    //                                 ]
    //                             }
    //                             onChange={ handleAuthTypeChange }
    //                             disabled={ getFieldDisabledStatus() }
    //                         />
    //                         {/* { renderAuthenticationPropertyFields() } */}
    //                     </>
    //                 );
    //             };

    //             return (
    //                 <Box className="box-container">
    //                     <div className="box-field">
    //                         { renderAuthentication() }
    //                         {/* { !isAuthenticationCreateState && (
    //                             <Button
    //                                 onClick={ handleAuthenticationChangeCancel }
    //                                 variant="outlined"
    //                                 size="small"
    //                                 className="secondary-button"
    //                                 data-componentid={ `${ componentId }-cancel-edit-authentication-button` }
    //                             >
    //                                 { t("actions:buttons.cancel") }
    //                             </Button>
    //                         ) } */}
    //                     </div>
    //                 </Box>
    //             );
    //         };

    //         // return ( !isAuthenticationUpdateState && !isAuthenticationCreateState && !(authenticationType === null) ?
    //         //     renderAuthenticationSectionInfoBox() : renderAuthenticationUpdateWidget());

    //         return ( renderAuthenticationUpdateWidget());
    //     };

    //     if (isLoading) {
    //         return renderLoadingPlaceholders();
    //     }

    //     return (
    //         <>
    //             <FinalFormField
    //                 key="uri"
    //                 className="text-field-container"
    //                 width={ 16 }
    //                 FormControlProps={ {
    //                     margin: "dense"
    //                 } }
    //                 ariaLabel="endpointUri"
    //                 required={ true }
    //                 data-componentid={ `${ componentId }-action-endpointUri` }
    //                 name="endpointUri"
    //                 type="text"
    //                 label={ t("actions:fields.endpoint.label") }
    //                 placeholder={ t("actions:fields.endpoint.placeholder") }
    //                 helperText={ (
    //                     <Hint className="hint" compact>
    //                         { t("actions:fields.endpoint.hint") }
    //                     </Hint>
    //                 ) }
    //                 component={ TextFieldAdapter }
    //                 maxLength={ 100 }
    //                 minLength={ 0 }
    //                 disabled={ getFieldDisabledStatus() }
    //             />
    //             <Divider className="divider-container"/>
    //             <Heading className="heading-container" as="h5">
    //                 { t("actions:fields.authentication.label") }
    //             </Heading>
    //             { renderAuthenticationSection() }
    //         </>
    //     );
    // };

    const wizardCommonFirstPage = () => (
        <WizardPage
            validate={ () => {
                if (selectedAuthenticator !== null || selectedAuthenticator !== undefined) {
                    setNextShouldBeDisabled(false);
                }
            } }
        >
            <div className="sub-template-selection">
                <label className="sub-templates-label">Select the authentication type you are implementing</label>
                <Grid
                    container
                    spacing={ { md: 3, xs: 2 } }
                    columns={ { md: 9, sm: 8, xs: 4 } }
                >
                    <Grid xs={ 2 } sm={ 4 } md={ 9 }>
                        <SelectionCard
                            inline
                            image={ getConnectionIcons().oidc }
                            size="medium"
                            className="sub-template-selection-card"
                            header={ <strong>External (Federated) User Authentication</strong> }
                            selected={ selectedAuthenticator === "external" }
                            onClick={ () => setSelectedAuthenticator("external") }
                            imageSize="x30"
                            imageOptions={ {
                                relaxed: true,
                                square: false,
                                width: "auto"
                            } }
                            contentTopBorder={ false }
                            showTooltips={ true }
                            data-componentid={ `${ componentId }-form-wizard-external-custom-authentication-
                            selection-card` }
                        />
                        <SelectionCard
                            inline
                            image={ getConnectionIcons().saml }
                            size="small"
                            className="sub-template-selection-card"
                            style={ { marginTop: "0" } }
                            header={ <strong>Internal User Authentication</strong> }
                            selected={ selectedAuthenticator === "internal" }
                            onClick={ () => setSelectedAuthenticator("internal") }
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
                            data-componentid={ `${ componentId }-form-wizard-internal-custom-authentication-
                            selection-card` }
                        />
                        <SelectionCard
                            inline
                            image={ getConnectionIcons().saml }
                            size="default"
                            className="sub-template-selection-card"
                            style={ { marginTop: "0" } }
                            header={ <strong>2FA Authentication</strong> }
                            selected={ selectedAuthenticator === "two-factor" }
                            onClick={ () => setSelectedAuthenticator("two-factor") }
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
                            data-componentid={ `${ componentId }-form-wizard-two-factor-custom-authentication-
                            selection-card` }
                        />
                    </Grid>
                </Grid>
            </div>
        </WizardPage>
    );

    // TODO: check max and min len of two fields
    const generalSettingsPage = () => (
        <WizardPage
            validate={ (values: CustomAuthenticationCreateWizardGeneralFormValuesInterface) => {
                const errors: FormErrors = {};

                if (!FormValidation.identifier(values.identifier)) {
                    errors.identifier = "Invalid Identifier"; // TODO: local message
                }
                if (!FormValidation.isValidResourceName(values.displayName)) {
                    errors.displayName = "Invalid Display Name"; // TODO: local message
                }

                setNextShouldBeDisabled(ifFieldsHave(errors));

                return errors;
            } }
        >
            <Field.Input
                ariaLabel="identifier"
                className="addon-field-wrapper"
                inputType="identifier"
                name="identifier"
                label={ "Identifier" }
                placeholder={ "ABC_authenticator" }
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
                label={ "Display name" }
                placeholder={ "ABC Authenticator" }
                initialValue={ initialValues.displayName }
                required={ true }
                maxLength={ 100 }
                minLength={ 3 }
                data-componentid={ `${ componentId }-form-wizard-display-name` }
                width={ 15 }
            />
        </WizardPage>
    );

    // Final Page
    // TODO: check if we need the emphasized segment
    const configurationsPage = () => (
        <WizardPage
            validate={ validateForm }
        >
            <Field.Input
                ariaLabel="endpointUri"
                className="addon-field-wrapper"
                inputType="url"
                name="endpointUri"
                label={ "Endpoint" }
                placeholder={ "https://abc.external.authenticator/authenticate" }
                hint="Hello babe"
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
                    label={ "Authentication Scheme" }
                    placeholder = { "Select Authentication Type" }
                    hint="Once added, these secrets will not be displayed. You will only be able to reset them."
                    required={ true }
                    value={ selectedAuthenticationType }
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
        </WizardPage>
    );

    // ### Here the configurationsPage is written with FinalForm
    //   const configurationsPage = () => (
    //     <FinalForm
    //         onSubmit={ (values: EndpointConfigFormPropertyInterface, form: any) => {
    //             handleSubmit(values, form.getState().dirtyFields); }
    //         }
    //         validate={ validateForm }
    //         // initialValues={ endpointInitialValues }
    //         render={ ({ handleSubmit, form }: FormRenderProps) => (
    //             <form onSubmit={ handleSubmit }>
    //                 <EmphasizedSegment
    //                     className="form-wrapper"
    //                     padded={ "very" }
    //                     data-componentid={ `${ componentId }-section` }
    //                 >
    //                     <div className="form-container with-max-width">
    //                         { renderFormFields() }
    //                         { !isLoading && (
    //                             <Button
    //                                 size="medium"
    //                                 variant="contained"
    //                                 onClick={ handleSubmit }
    //                                 className={ "button-container" }
    //                                 data-componentid={ `${ componentId }-primary-button` }
    //                                 loading={ isSubmitting }
    //                                 disabled={ getFieldDisabledStatus() }
    //                             >
    //                                 {
    //                                     isAuthenticationCreateState
    //                                         ? t("actions:buttons.create")
    //                                         : t("actions:buttons.update")
    //                                 }
    //                             </Button>
    //                         ) }
    //                     </div>
    //                 </EmphasizedSegment>
    //                 <FormSpy
    //                     subscription={ { values: true } }
    //                 >
    //                     { ({ values }: { values: EndpointConfigFormPropertyInterface }) => {
    //                         if (!isAuthenticationUpdateState) {
    //                             form.change("authenticationType",
    //                                 endpointInitialValues?.authenticationType);
    //                             switch (authenticationType) {
    //                                 case AuthenticationType.BASIC:
    //                                     delete values.usernameAuthProperty;
    //                                     delete values.passwordAuthProperty;

    //                                     break;
    //                                 case AuthenticationType.BEARER:
    //                                     delete values.accessTokenAuthProperty;

    //                                     break;
    //                                 case AuthenticationType.API_KEY:
    //                                     delete values.headerAuthProperty;
    //                                     delete values.valueAuthProperty;

    //                                     break;
    //                                 default:
    //                                     break;
    //                             }
    //                         }

    //                         // Clear inputs of property field values of other authentication types.
    //                         switch (authenticationType) {
    //                             case AuthenticationType.BASIC:
    //                                 delete values.accessTokenAuthProperty;
    //                                 delete values.headerAuthProperty;
    //                                 delete values.valueAuthProperty;

    //                                 break;
    //                             case AuthenticationType.BEARER:
    //                                 delete values.usernameAuthProperty;
    //                                 delete values.passwordAuthProperty;
    //                                 delete values.headerAuthProperty;
    //                                 delete values.valueAuthProperty;

    //                                 break;
    //                             case AuthenticationType.API_KEY:
    //                                 delete values.usernameAuthProperty;
    //                                 delete values.passwordAuthProperty;
    //                                 delete values.accessTokenAuthProperty;

    //                                 break;
    //                             case AuthenticationType.NONE:
    //                                 delete values.usernameAuthProperty;
    //                                 delete values.passwordAuthProperty;
    //                                 delete values.headerAuthProperty;
    //                                 delete values.valueAuthProperty;
    //                                 delete values.accessTokenAuthProperty;

    //                                 break;
    //                             default:

    //                                 break;
    //                         }

    //                         return null;
    //                     } }
    //                 </FormSpy>
    //             </form>
    //         ) }
    //     >
    //     </FinalForm>
    // );

    // Resolvers
    const resolveWizardPages = (): Array<ReactElement> => {
        return [
            wizardCommonFirstPage(),
            generalSettingsPage(),
            configurationsPage()
        ];
    };

    const resolveHelpPanel = () => {

        const SECOND_STEP: number = 1;

        if (currentWizardStep !== SECOND_STEP) return null;

        // Return null when `showHelpPanel` is false or `samlHelp`
        // or `oidcHelp` is not defined in `selectedTemplate` object.

        const subTemplate: ConnectionTemplateInterface = cloneDeep(template.subTemplates.find(
            ({ id }: { id: string }) => {
                return id === (selectedAuthenticator === "external"
                    ? "external-custom-authentication"
                    : selectedAuthenticator === "internal"
                        ? "internal-custom-authentication"
                        : "two-factor-custom-authentication"
                );
            }
        ));

        // TODO: update this with correct wizard helps
        if (!subTemplate?.content?.wizardHelp) return null;

        // let { wizardHelp: WizardHelp } = subTemplate?.content;

        // if (selectedAuthenticator === "external" && selectedSamlConfigMode === "file") {
        //     WizardHelp = subTemplate.content.fileBasedHelpPanel;
        // }

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
                        {/* <WizardHelp data-componentid={ `${ componentId }-modal-side-panel-help-content` }/> */}
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

        if (selectedAuthenticator === "external") {
            docLink = getLink("develop.connections.newConnection.enterprise.samlLearnMore");
        }

        if (selectedAuthenticator === "internal") {
            docLink = getLink("develop.connections.newConnection.enterprise.oidcLearnMore");
        }

        if (selectedAuthenticator === "two-factor") {
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
            className="wizard identity-provider-create-wizard" // TODO: update the class
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
 * Default props for the custom authenticator
 * creation wizard.
 */
CustomAuthenticationCreateWizard.defaultProps = {
    currentStep: 0,
    "data-componentid": "custom-authentication"
};


// General constants
const EMPTY_STRING: string = "";

// Validation Functions.
// FIXME: These will be removed in the future when
//        form module validation gets to a stable state.

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
